import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { Worker as OcrWorker } from "tesseract.js";
import { declaredImagePixels } from "../../../../../packages/engine/cbc/document";
import {
  type CbcLine,
  parseCbc,
} from "../../../../../packages/engine/cbc/parser";

const MAX_BYTES = 10 * 1024 * 1024,
  MAX_PIXELS = 12_000_000;
function check(signal: AbortSignal) {
  signal.throwIfAborted();
}
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const cancel = () =>
      reject(signal.reason ?? new DOMException("Cancelled", "AbortError"));
    promise.then(
      (value) => {
        signal.removeEventListener("abort", cancel);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", cancel);
        reject(error);
      },
    );
    if (signal.aborted) cancel();
    else signal.addEventListener("abort", cancel, { once: true });
  });
}
export async function extractCbc(
  file: File,
  signal: AbortSignal,
  progress: (message: string) => void,
) {
  if (file.size > MAX_BYTES || file.size === 0)
    throw new Error("Select a non-empty report up to 10 MiB.");
  if (!/\.(pdf|png|jpe?g)$/i.test(file.name))
    throw new Error("Supported files: PDF, JPEG and PNG.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  check(signal);
  const isPdf =
    bytes[0] === 37 && bytes[1] === 80 && bytes[2] === 68 && bytes[3] === 70;
  const isPng =
    bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71;
  const isJpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (!isPdf && !isPng && !isJpeg)
    throw new Error("The file signature is not PDF, JPEG or PNG.");
  const expected = isPdf ? /\.pdf$/i : isPng ? /\.png$/i : /\.jpe?g$/i;
  if (!expected.test(file.name))
    throw new Error("File extension and document signature disagree.");
  const lines: CbcLine[] = [];
  const previews: Blob[] = [];
  async function preview(canvas: HTMLCanvasElement) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.8),
    );
    if (blob) previews.push(blob);
  }
  let worker: OcrWorker | undefined;
  let destroyPdf: (() => void) | undefined;
  const cancel = () => {
    void worker?.terminate();
    destroyPdf?.();
  };
  signal.addEventListener("abort", cancel, { once: true });
  async function ocr(canvas: HTMLCanvasElement, page: number) {
    check(signal);
    progress(`Reading printed text on page ${page}…`);
    if (!worker) {
      const { createWorker } = await import("tesseract.js");
      check(signal);
      const pendingWorker = createWorker("eng", 1, {
        workerPath: "/cbc-assets/worker.min.js",
        corePath: "/cbc-assets/",
        langPath: "/cbc-assets",
        workerBlobURL: false,
        cacheMethod: "none",
        errorHandler: () => {},
        logger: (message) => {
          if (!signal.aborted && message.status === "recognizing text")
            progress(`Page ${page}: ${Math.round(message.progress * 100)}%`);
        },
      });
      const initialized = await abortable(
        pendingWorker.then((created) => {
          if (signal.aborted) void created.terminate();
          return created;
        }),
        signal,
      );
      if (!initialized) throw new Error("OCR worker initialization failed");
      worker = initialized;
      if (signal.aborted) {
        await initialized.terminate();
        check(signal);
      }
      await abortable(
        initialized.setParameters({ preserve_interword_spaces: "1" }),
        signal,
      );
    }
    const recognize = async (image: HTMLCanvasElement): Promise<CbcLine[]> => {
      if (!worker) throw new Error("OCR worker unavailable.");
      const { data } = await abortable(
        worker.recognize(image, {}, { text: true, blocks: true }),
        signal,
      );
      check(signal);
      const result: CbcLine[] = [];
      if (data.blocks) {
        for (const block of data.blocks)
          for (const paragraph of block.paragraphs)
            for (const line of paragraph.lines) {
              result.push({
                text: line.text,
                page,
                method: "ocr",
                confidence: line.confidence,
                region: {
                  x: line.bbox.x0 / image.width,
                  y: line.bbox.y0 / image.height,
                  width: (line.bbox.x1 - line.bbox.x0) / image.width,
                  height: (line.bbox.y1 - line.bbox.y0) / image.height,
                },
              });
            }
      } else
        for (const text of data.text.split(/\r?\n/))
          result.push({ text, page, method: "ocr" });
      return result;
    };
    let best = await recognize(canvas),
      bestCanvas = canvas;
    const count = (items: CbcLine[]) =>
      parseCbc(items).filter((candidate) => candidate.status === "found")
        .length;
    // Try quarter turns only when fields are missing. One OCR worker; no parallel image copies.
    for (const angle of [90, 180, 270]) {
      if (count(best) === 5) break;
      check(signal);
      progress(`Checking page ${page} orientation…`);
      const rotated = document.createElement("canvas");
      rotated.width = angle === 180 ? canvas.width : canvas.height;
      rotated.height = angle === 180 ? canvas.height : canvas.width;
      const context = rotated.getContext("2d");
      if (!context) throw new Error("Image rotation unavailable.");
      context.translate(rotated.width / 2, rotated.height / 2);
      context.rotate((angle * Math.PI) / 180);
      context.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
      const result = await recognize(rotated);
      if (count(result) > count(best)) {
        if (bestCanvas !== canvas) bestCanvas.width = bestCanvas.height = 0;
        best = result;
        bestCanvas = rotated;
      } else rotated.width = rotated.height = 0;
    }
    lines.push(...best);
    return bestCanvas;
  }
  try {
    if (isPdf) {
      const pdfjs = await import("pdfjs-dist");
      check(signal);
      pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
      const task = pdfjs.getDocument({
        data: bytes,
        enableXfa: false,
        verbosity: 0,
        maxImageSize: MAX_PIXELS,
        cMapUrl: "/cbc-assets/pdf/cmaps/",
        cMapPacked: true,
        standardFontDataUrl: "/cbc-assets/pdf/standard_fonts/",
        wasmUrl: "/cbc-assets/pdf/wasm/",
        useSystemFonts: true,
        disableFontFace: true,
        stopAtErrors: true,
      });
      destroyPdf = () => {
        void task.destroy();
      };
      const pdf = await task.promise;
      if (pdf.numPages > 5)
        throw new Error(
          "Reports are limited to five pages. Select the relevant CBC pages.",
        );
      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
        check(signal);
        progress(`Reading PDF page ${pageNo} of ${pdf.numPages}…`);
        const page = await pdf.getPage(pageNo),
          text = await page.getTextContent();
        const rows = new Map<number, { x: number; text: string }[]>();
        for (const item of text.items) {
          if (!("str" in item)) continue;
          const y = Math.round((item.transform[5] as number) / 3) * 3;
          const row = rows.get(y) ?? [];
          row.push({ x: item.transform[4] as number, text: item.str });
          rows.set(y, row);
        }
        const pageLines = [...rows.entries()]
          .sort((a, b) => b[0] - a[0])
          .map(([, row]) => ({
            text: row
              .sort((a, b) => a.x - b.x)
              .map((i) => i.text)
              .join(" "),
            page: pageNo,
            method: "pdf-text" as const,
          }));
        const candidates = parseCbc(pageLines);
        const natural = page.getViewport({ scale: 2 });
        if (natural.width * natural.height > MAX_PIXELS)
          throw new Error("PDF page exceeds the rendering limit.");
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(natural.width);
        canvas.height = Math.ceil(natural.height);
        const rendering = page.render({ canvas, viewport: natural });
        const cancelRender = () => rendering.cancel();
        signal.addEventListener("abort", cancelRender, { once: true });
        try {
          await rendering.promise;
          check(signal);
        } finally {
          signal.removeEventListener("abort", cancelRender);
        }
        if (candidates.some((candidate) => candidate.status === "found")) {
          lines.push(...pageLines);
          await preview(canvas);
        } else {
          const recognized = await ocr(canvas, pageNo);
          await preview(recognized);
          if (recognized !== canvas) recognized.width = recognized.height = 0;
        }
        canvas.width = canvas.height = 0;
        page.cleanup();
        if (
          lines.length > 5000 ||
          lines.reduce((n, line) => n + line.text.length, 0) > 150000
        )
          throw new Error("Report text limit exceeded.");
      }
    } else {
      if (declaredImagePixels(bytes) > MAX_PIXELS)
        throw new Error(
          "Image exceeds 12 megapixels. Resize it before processing.",
        );
      const image = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      try {
        if (image.width * image.height > MAX_PIXELS)
          throw new Error(
            "Image exceeds 12 megapixels. Resize it before processing.",
          );
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Image rendering is unavailable.");
        context.drawImage(image, 0, 0);
        const recognized = await ocr(canvas, 1);
        await preview(recognized);
        if (recognized !== canvas) recognized.width = recognized.height = 0;
        canvas.width = canvas.height = 0;
      } finally {
        image.close();
      }
    }
    check(signal);
    const patientNames = lines
      .map((line) =>
        /\b(?:patient\s*name|name\s*of\s*patient)\s*[:-]\s*([^|\t]+)/i
          .exec(line.text)?.[1]
          ?.trim(),
      )
      .filter((name): name is string => !!name);
    return {
      candidates: parseCbc(lines),
      previews,
      patientNames,
      pages: Math.max(1, previews.length),
      mime: isPdf ? "application/pdf" : isPng ? "image/png" : "image/jpeg",
    };
  } finally {
    signal.removeEventListener("abort", cancel);
    await worker?.terminate();
    destroyPdf?.();
  }
}
