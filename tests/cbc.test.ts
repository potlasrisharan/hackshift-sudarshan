import { describe, expect, it } from "vitest";
import { declaredImagePixels } from "../packages/engine/cbc/document";
import { predictCbc, roundEven } from "../packages/engine/cbc/inference";
import { normalizeCbc, parseCbc } from "../packages/engine/cbc/parser";
import { cbcInputSchema } from "../packages/shared/cbc_contracts";
import oracle from "./fixtures/cbc/parity.json";

const published = oracle[0];
if (!published) throw new Error("Missing published reference fixture");
function present<T>(value: T | null | undefined): T {
  if (value == null) throw new Error("Missing test fixture measurement");
  return value;
}
describe("frozen CBC model", () => {
  it("matches every synthetic Python reference score, cutoff flag and imputation flag", () => {
    let largest = 0;
    for (const row of oracle) {
      const result = predictCbc(row.input);
      largest = Math.max(largest, Math.abs(result.score - row.expected.score));
      expect(result.score).toBeCloseTo(row.expected.score, 12);
      expect(result.above_cutoff).toBe(row.expected.above_cutoff);
      expect(result.undefined_ratios_imputed).toBe(
        row.expected.undefined_ratios_imputed,
      );
    }
    expect(largest).toBeLessThanOrEqual(1e-12);
  });
  it("uses ties to even and distinguishes absent values from zero", () => {
    expect([0.5, 1.5, 2.5, 24.5, 25.5].map(roundEven)).toEqual([
      0, 2, 2, 24, 26,
    ]);
    const input = published.input;
    for (const invalid of [
      {},
      { ...input, wbc: true },
      { ...input, rbc: 0 },
      { ...input, wbc: NaN },
      { ...input, neutrophils: 80, lymphocytes: 80 },
      { ...input, monocytes: null },
      { ...input, patientId: "forged" },
    ]) {
      expect(cbcInputSchema.safeParse(invalid).success).toBe(false);
    }
    expect(
      predictCbc({ ...input, lymphocytes: 0, monocytes: 0 })
        .undefined_ratios_imputed,
    ).toBe(true);
  });
});
describe("conservative CBC extraction", () => {
  it("checks declared image dimensions before pixel allocation", () => {
    const png = new Uint8Array(24);
    png.set([137, 80, 78, 71]);
    const view = new DataView(png.buffer);
    view.setUint32(16, 20000);
    view.setUint32(20, 20000);
    expect(declaredImagePixels(png)).toBe(400000000);
    expect(() => declaredImagePixels(new Uint8Array([255, 216, 0]))).toThrow();
  });
  const source = [
    "WBC 8950 cells/uL 4000 - 11000",
    "RBC 44.1 lakh/uL 35 - 55",
    "Neutrophils 65 % 40 - 80",
    "Lymphocytes 25 % 20 - 40",
    "Monocytes 9 % 2 - 10",
  ];
  const lines = source.map((text) => ({
    text,
    page: 1,
    method: "pdf-text" as const,
  }));
  it("extracts the result rather than reference ranges and converts units", () => {
    const parsed = parseCbc(lines);
    expect(parsed.map((item) => item.status)).toEqual(Array(5).fill("found"));
    expect(
      normalizeCbc(parsed.map((item) => present(item.measurement))),
    ).toEqual(published.input);
  });
  it("does not infer missing units, use absolute counts, or choose between duplicate panels", () => {
    expect(
      parseCbc([{ text: "WBC 8950", page: 1, method: "ocr" }])[0]?.measurement,
    ).toBeNull();
    const absolute = parseCbc([
      { text: "Neutrophils absolute 5.4 10^9/L", page: 1, method: "ocr" },
    ]);
    expect(absolute[2]?.measurement).toBeNull();
    expect(
      parseCbc([
        ...lines,
        ...lines.map((item) => ({ ...item, page: 2 })),
      ]).every((item) => item.status === "ambiguous"),
    ).toBe(true);
    expect(
      parseCbc([{ text: "WBC 8,950 cells/uL", page: 1, method: "ocr" }])[0]
        ?.measurement,
    ).toBeNull();
  });
  it("rejects wrong dimensions and incomplete or duplicate fields", () => {
    const parsed = parseCbc(lines).map((item) => present(item.measurement));
    expect(() => normalizeCbc(parsed.slice(0, 4))).toThrow();
    expect(() =>
      normalizeCbc([present(parsed[0]), ...parsed.slice(0, 4)]),
    ).toThrow();
    expect(() =>
      normalizeCbc(
        parsed.map((item) =>
          item.field === "wbc" ? { ...item, unit: "%" } : item,
        ),
      ),
    ).toThrow();
  });
});
