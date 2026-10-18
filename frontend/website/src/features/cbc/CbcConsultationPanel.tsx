import { useEffect, useRef, useState } from "react";
import { roundEven } from "../../../../../packages/engine/cbc/inference";
import {
  type CbcCandidate,
  normalizeCbc,
} from "../../../../../packages/engine/cbc/parser";
import {
  type CbcMeasurement,
  type CbcReport,
  cbcFields,
  cbcUnits,
} from "../../../../../packages/shared/cbc_contracts";
import { cbcApi, type DoctorSession } from "./api";
import { setCbcUnsaved } from "./navigation";

interface Props {
  session: DoctorSession | null;
  patientId: string;
  patientName: string;
  encounterId: string | null;
  onDirty: (dirty: boolean) => void;
}
interface Editor {
  value: string;
  unit: CbcMeasurement["unit"] | "";
  measurement: CbcMeasurement | null;
}
const labels = {
  wbc: "WBC",
  rbc: "RBC",
  neutrophils: "Neutrophils",
  lymphocytes: "Lymphocytes",
  monocytes: "Monocytes",
};
function blank(): Editor[] {
  return cbcFields.map((field) => ({
    value: "",
    unit: field === "wbc" ? "10^9/L" : field === "rbc" ? "10^12/L" : "%",
    measurement: null,
  }));
}
export default function CbcConsultationPanel(props: Props) {
  // Parent keys this component by the full verified session/patient/encounter context.
  const { session, patientId, patientName, encounterId, onDirty } = props;
  const [rows, setRows] = useState<Editor[]>(blank);
  const [candidates, setCandidates] = useState<CbcCandidate[]>([]);
  const [reports, setReports] = useState<CbcReport[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [selected, setSelected] = useState<CbcReport | null>(null);
  const [revision, setRevision] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [busy, setBusy] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [processingConsent, setProcessingConsent] = useState(false);
  const [researchConsent, setResearchConsent] = useState(false);
  const [retain, setRetain] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [date, setDate] = useState("");
  const [identityMismatch, setIdentityMismatch] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [mime, setMime] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [previewPage, setPreviewPage] = useState(1);
  const [highlight, setHighlight] = useState<CbcMeasurement["region"]>();
  const [caps, setCaps] = useState({
    sourceRetention: false,
    inference: false,
  });
  const live = useRef(true),
    abort = useRef<AbortController | null>(null),
    previewUrls = useRef<string[]>([]);
  const attempt = useRef<{
    createKey: string;
    id: string | null;
    retained: boolean;
    confirmKeys: Map<string, string>;
  }>({
    createKey: crypto.randomUUID(),
    id: null,
    retained: false,
    confirmKeys: new Map(),
  });
  const ready = !!session && !!encounterId;
  const saved =
    selected?.revisions.find((item) => item.revision === revision) ?? null;
  useEffect(() => {
    onDirty(dirty);
    setCbcUnsaved(dirty);
  }, [dirty, onDirty]);
  useEffect(() => {
    live.current = true;
    const controller = new AbortController();
    if (ready && session && encounterId) {
      void cbcApi
        .list(session.token, encounterId, controller.signal)
        .then((data) => {
          if (live.current) {
            setReports(data.reports);
            setCursor(data.nextCursor);
          }
        })
        .catch((e) => {
          if (live.current && !controller.signal.aborted)
            setError(
              e instanceof Error ? e.message : "Could not load report history.",
            );
        });
      void cbcApi
        .capabilities()
        .then((data) => {
          if (live.current) setCaps(data);
        })
        .catch(() => {});
    }
    return () => {
      live.current = false;
      controller.abort();
      abort.current?.abort();
      for (const url of previewUrls.current) URL.revokeObjectURL(url);
      onDirty(false);
      setCbcUnsaved(false);
    };
  }, [session, encounterId, ready, onDirty]);
  useEffect(() => {
    const guard = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  function newDraft() {
    abort.current?.abort();
    abort.current = null;
    for (const url of previewUrls.current) URL.revokeObjectURL(url);
    previewUrls.current = [];
    setPreviews([]);
    setPreviewPage(1);
    setHighlight(undefined);
    setSelected(null);
    setRevision(null);
    setRows(blank());
    setCandidates([]);
    setFile(null);
    setMime("");
    setDirty(false);
    setReviewed(false);
    setDate("");
    setError("");
    setProgress("");
    setProcessingConsent(false);
    setResearchConsent(false);
    setRetain(false);
    setIdentityMismatch(false);
    attempt.current = {
      createKey: crypto.randomUUID(),
      id: null,
      retained: false,
      confirmKeys: new Map(),
    };
  }
  async function extract(source: File) {
    newDraft();
    setFile(source);
    setBusy(true);
    setExtracting(true);
    setDirty(true);
    const controller = new AbortController();
    abort.current = controller;
    const timeout = window.setTimeout(
      () =>
        controller.abort(
          new Error(
            "Extraction timed out. Retry or enter measurements manually.",
          ),
        ),
      120000,
    );
    try {
      const { extractCbc } = await import("./extraction");
      const result = await extractCbc(source, controller.signal, (message) => {
        if (live.current && !controller.signal.aborted) setProgress(message);
      });
      if (!live.current || controller.signal.aborted) return;
      setCandidates(result.candidates);
      setMime(result.mime);
      const normalizeName = (name: string) =>
        name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
      setIdentityMismatch(
        result.patientNames.some(
          (name) => normalizeName(name) !== normalizeName(patientName),
        ),
      );
      setRows(
        result.candidates.map((candidate) => ({
          value: candidate.measurement
            ? String(candidate.measurement.value)
            : "",
          unit: candidate.measurement?.unit ?? "",
          measurement: candidate.measurement,
        })),
      );
      previewUrls.current = result.previews.map((blob) =>
        URL.createObjectURL(blob),
      );
      setPreviews(previewUrls.current);
      setProgress(
        `Extraction finished (${result.pages} page${result.pages === 1 ? "" : "s"}). Review every value and unit against the source.`,
      );
    } catch (e) {
      if (live.current && abort.current === controller) {
        setRows(blank());
        setError(
          controller.signal.aborted
            ? "Extraction cancelled or timed out. Enter values manually or retry."
            : e instanceof Error
              ? e.message
              : "Extraction failed.",
        );
      }
    } finally {
      window.clearTimeout(timeout);
      if (live.current && abort.current === controller) {
        setBusy(false);
        setExtracting(false);
      }
    }
  }
  function measurements(): CbcMeasurement[] {
    return rows.map((row, index) => {
      const field = cbcFields[index];
      if (!field || row.value.trim() === "" || row.unit === "")
        throw new Error("Complete all five measurements.");
      return {
        ...(row.measurement ?? {}),
        field,
        value: Number(row.value),
        unit: row.unit,
        method: row.measurement?.method ?? "manual",
        page: row.measurement?.page ?? null,
        evidence: row.measurement?.evidence ?? "",
      };
    });
  }
  let validation = "";
  try {
    normalizeCbc(measurements());
  } catch (e) {
    validation =
      e instanceof Error && e.message.startsWith("Unsupported")
        ? e.message
        : "Complete five valid values with compatible units; differential total must not exceed 100%.";
  }
  if (identityMismatch)
    validation =
      "A patient-name label in this file differs from the selected consultation. Select the correct patient/report; saving is blocked.";
  async function reload() {
    if (!session || !encounterId) return;
    const data = await cbcApi.list(session.token, encounterId);
    if (live.current) {
      setReports(data.reports);
      setCursor(data.nextCursor);
    }
  }
  function accept(result: CbcReport) {
    if (!live.current) return;
    if (result.patientId !== patientId || result.encounterId !== encounterId)
      throw new Error("The report context does not match this consultation.");
    setSelected(result);
    setRevision(result.revision);
    setDirty(false);
    setReviewed(false);
    setProgress("Measurements saved against the selected encounter.");
    setReports((previous) => [
      result,
      ...previous.filter((item) => item.id !== result.id),
    ]);
  }
  async function save() {
    if (
      !session ||
      !encounterId ||
      !processingConsent ||
      !reviewed ||
      identityMismatch
    )
      return;
    setBusy(true);
    setError("");
    try {
      const values = measurements();
      normalizeCbc(values);
      const pending = attempt.current;
      if (!selected && !pending.id) {
        const draft = await cbcApi.create(
          session.token,
          encounterId,
          researchConsent,
          pending.createKey,
        );
        pending.id = draft.id;
      }
      const reportId = selected?.id ?? pending.id;
      if (!reportId) throw new Error("Create the report before saving.");
      if (retain && file && !pending.retained && !selected) {
        await cbcApi.retain(session.token, reportId, file, mime);
        pending.retained = true;
      }
      const fingerprint = JSON.stringify({
        values,
        date,
        revision: selected?.revision ?? 0,
      });
      let key = pending.confirmKeys.get(fingerprint);
      if (!key) {
        key = crypto.randomUUID();
        pending.confirmKeys.set(fingerprint, key);
      }
      accept(
        await cbcApi.confirm(
          session.token,
          reportId,
          selected?.revision ?? 0,
          values,
          date || null,
          key,
        ),
      );
    } catch (e) {
      if (live.current)
        setError(e instanceof Error ? e.message : "Could not save the report.");
    } finally {
      if (live.current) setBusy(false);
    }
  }
  async function run() {
    if (!session || !selected) return;
    setBusy(true);
    setError("");
    try {
      accept(
        await cbcApi.predict(session.token, selected.id, selected.revision),
      );
    } catch (e) {
      if (live.current)
        setError(
          e instanceof Error ? e.message : "Research analysis unavailable.",
        );
    } finally {
      if (live.current) setBusy(false);
    }
  }
  function openReport(report: CbcReport, number = report.revision) {
    if (dirty && !window.confirm("Discard the unsaved CBC draft?")) return;
    newDraft();
    setSelected(report);
    setRevision(number);
    setResearchConsent(report.researchConsent);
    const data = report.revisions.find((item) => item.revision === number);
    if (data) {
      setRows(
        cbcFields.map((field) => {
          const m = data.measurements.find((item) => item.field === field);
          return {
            value: m ? String(m.value) : "",
            unit: m?.unit ?? "%",
            measurement: m ?? null,
          };
        }),
      );
      setDate(data.collectionDate ?? "");
      setCandidates(
        data.measurements.map((measurement) => ({
          field: measurement.field,
          measurement,
          alternatives: [measurement],
          status: "found",
          warning:
            measurement.method === "manual"
              ? "Manually entered or corrected by the confirming doctor."
              : null,
        })),
      );
    }
  }
  return (
    <section
      aria-label="CBC Reports"
      className="border border-teal-200 rounded-2xl bg-teal-50/30 p-4 sm:p-5 space-y-4"
      data-testid="cbc-panel"
    >
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">CBC Reports</h3>
          <p className="text-xs text-slate-600">
            Research analysis available after review · Synthetic records only
          </p>
        </div>
        {ready && (
          <button
            type="button"
            disabled={busy}
            className="border rounded-lg px-3 py-2 text-xs bg-white"
            onClick={() => {
              if (!dirty || window.confirm("Discard the unsaved CBC draft?"))
                newDraft();
            }}
          >
            New report / manual entry
          </button>
        )}
      </div>
      {!ready ? (
        <p className="text-sm text-slate-600">
          Connect a clinical doctor session and select an authorized
          consultation from the patient queue. This row has no verified clinical
          encounter.
        </p>
      ) : (
        <>
          <p className="text-xs text-slate-600 break-all">
            Patient: <strong>{patientName}</strong> · Encounter: {encounterId}
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <label className="text-sm font-semibold">
              Upload CBC report
              <input
                aria-label="Upload CBC report"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                disabled={busy}
                className="block mt-1 text-xs max-w-full"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (
                    f &&
                    (!dirty || window.confirm("Discard the unsaved CBC draft?"))
                  )
                    void extract(f);
                  e.target.value = "";
                }}
              />
            </label>
            <span className="text-xs text-slate-500">
              PDF/JPEG/PNG · 10 MiB · 5 pages · extraction stays on this device
            </span>
            {extracting && (
              <button
                type="button"
                className="text-xs underline"
                onClick={() => {
                  abort.current?.abort();
                  abort.current = null;
                  setBusy(false);
                  setExtracting(false);
                  setProgress(
                    "Extraction cancelled. Retry or enter measurements manually.",
                  );
                }}
              >
                Cancel extraction
              </button>
            )}
          </div>
          {progress && (
            <p
              role="status"
              aria-live="polite"
              className="text-xs text-teal-900"
            >
              {progress}
            </p>
          )}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <h4 className="text-xs font-bold">Source evidence</h4>
              {previews.length ? (
                <>
                  <label className="text-xs">
                    Source page
                    <select
                      aria-label="Source page"
                      value={previewPage}
                      onChange={(e) => {
                        setPreviewPage(Number(e.target.value));
                        setHighlight(undefined);
                      }}
                      className="ml-2 border rounded p-1"
                    >
                      {previews.map((url, i) => (
                        <option key={url} value={i + 1}>
                          Page {i + 1}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="max-h-80 overflow-auto border bg-white">
                    <div className="relative">
                      <img
                        src={previews[previewPage - 1]}
                        alt={`Locally rendered CBC source, page ${previewPage}`}
                        className="w-full"
                      />
                      {highlight && (
                        <div
                          role="img"
                          aria-label="Extracted row highlight"
                          className="absolute border-2 border-amber-500 bg-amber-300/20 pointer-events-none"
                          style={{
                            left: `${highlight.x * 100}%`,
                            top: `${highlight.y * 100}%`,
                            width: `${highlight.width * 100}%`,
                            height: `${highlight.height * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-500">
                  Select a report to preview its pages locally, or enter
                  reviewed measurements manually. Source retention is optional.
                </p>
              )}
              {candidates.map((candidate) => (
                <div
                  key={candidate.field}
                  className="text-xs border rounded p-2 bg-white break-words"
                >
                  <strong>
                    {labels[candidate.field]}: {candidate.status}
                  </strong>
                  {candidate.warning && (
                    <p className="text-amber-900">{candidate.warning}</p>
                  )}
                  {candidate.alternatives.map((m) => (
                    <button
                      type="button"
                      key={m.evidenceId ?? `${m.page}:${m.field}:${m.evidence}`}
                      className="block text-left underline mt-1"
                      onClick={() => {
                        setPreviewPage(m.page ?? 1);
                        setHighlight(m.region);
                      }}
                    >
                      Page {m.page}: {m.evidence}
                    </button>
                  ))}
                </div>
              ))}
              {saved && (
                <p className="text-xs text-slate-600">
                  Confirmed by {saved.confirmedBy} · {saved.confirmedAt}.
                  Evidence came from client extraction or manual entry; it is
                  not a certified lab result.
                </p>
              )}
            </div>
            <div className="space-y-3 min-w-0">
              <h4 className="text-xs font-bold">Review all five inputs</h4>
              {rows.map((row, i) => (
                <div
                  key={cbcFields[i]}
                  className="grid grid-cols-2 gap-2 min-w-0"
                >
                  <label className="text-xs">
                    {labels[cbcFields[i] ?? "wbc"]}
                    <input
                      aria-label={`${labels[cbcFields[i] ?? "wbc"]} value`}
                      type="number"
                      step="any"
                      value={row.value}
                      disabled={busy}
                      className="block w-full border rounded-lg p-2 bg-white"
                      onChange={(e) => {
                        setRows((previous) =>
                          previous.map((r, j) =>
                            j === i
                              ? {
                                  ...r,
                                  value: e.target.value,
                                  measurement: r.measurement
                                    ? { ...r.measurement, method: "manual" }
                                    : null,
                                }
                              : r,
                          ),
                        );
                        setDirty(true);
                        setReviewed(false);
                      }}
                    />
                  </label>
                  <label className="text-xs">
                    Unit
                    <select
                      aria-label={`${labels[cbcFields[i] ?? "wbc"]} unit`}
                      value={row.unit}
                      disabled={busy}
                      className="block w-full border rounded-lg p-2 bg-white"
                      onChange={(e) => {
                        const unit = cbcUnits.find((u) => u === e.target.value);
                        if (unit) {
                          setRows((previous) =>
                            previous.map((r, j) =>
                              j === i
                                ? {
                                    ...r,
                                    unit,
                                    measurement: r.measurement
                                      ? { ...r.measurement, method: "manual" }
                                      : null,
                                  }
                                : r,
                            ),
                          );
                          setDirty(true);
                          setReviewed(false);
                        }
                      }}
                    >
                      <option value="">Choose reviewed unit</option>
                      {cbcUnits.map((unit) => (
                        <option key={unit}>{unit}</option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
              <label className="block text-xs">
                Collection date (leave blank if unknown)
                <input
                  type="date"
                  value={date}
                  max={new Date().toISOString().slice(0, 10)}
                  disabled={busy}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setDirty(true);
                    setReviewed(false);
                  }}
                  className="block border rounded p-2"
                />
              </label>
              {validation && (
                <p className="text-xs text-amber-900">{validation}</p>
              )}
              {!validation && (
                <dl className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  {Object.entries(normalizeCbc(measurements())).map(
                    ([field, value]) => (
                      <div key={field}>
                        <dt>{labels[field as keyof typeof labels]}</dt>
                        <dd className="font-semibold">
                          {value}{" "}
                          {field === "wbc"
                            ? "×10⁹/L"
                            : field === "rbc"
                              ? "×10¹²/L"
                              : "%"}
                        </dd>
                      </div>
                    ),
                  )}
                </dl>
              )}
              <label className="flex gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={processingConsent}
                  disabled={busy}
                  onChange={(e) => setProcessingConsent(e.target.checked)}
                />
                Record permission to process and save these synthetic
                measurements.
              </label>
              <label className="flex gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={researchConsent}
                  disabled={busy || !!selected || !!attempt.current.id}
                  onChange={(e) => setResearchConsent(e.target.checked)}
                />
                Record permission for optional research-model analysis.
              </label>
              <label className="flex gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={retain}
                  disabled={
                    busy || !caps.sourceRetention || !file || !!selected
                  }
                  onChange={(e) => setRetain(e.target.checked)}
                />
                Retain the original privately with source-storage permission{" "}
                {caps.sourceRetention
                  ? ""
                  : "(storage unavailable; measurements still work)"}
                .
              </label>
              <label className="flex gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={reviewed}
                  disabled={busy || !!validation}
                  onChange={(e) => setReviewed(e.target.checked)}
                />
                I checked every value/unit, patient, and a single coherent
                collection panel against the source.
              </label>
              <button
                type="button"
                disabled={
                  busy || !!validation || !processingConsent || !reviewed
                }
                onClick={() => void save()}
                className="rounded-lg bg-teal-800 text-white px-4 py-2 text-sm disabled:opacity-40"
              >
                Confirm and save measurements
              </button>
            </div>
          </div>
          {selected && saved && (
            <div className="border rounded-xl bg-white p-3 space-y-2">
              <h4 className="font-semibold text-sm">
                Confirmed snapshot · revision {saved.revision}
                {saved.revision !== selected.revision ? " (historical)" : ""}
              </h4>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {Object.entries(saved.values).map(([field, value]) => (
                  <div key={field}>
                    <dt className="text-slate-500">
                      {labels[field as keyof typeof labels]}
                    </dt>
                    <dd className="font-semibold">
                      {value}{" "}
                      {field === "wbc"
                        ? "×10⁹/L"
                        : field === "rbc"
                          ? "×10¹²/L"
                          : "%"}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-slate-600">
                Frozen preprocessing ratios: NLR{" "}
                {roundEven(saved.values.lymphocytes)
                  ? (
                      roundEven(saved.values.neutrophils) /
                      roundEven(saved.values.lymphocytes)
                    ).toFixed(3)
                  : "undefined; saved imputer applies"}{" "}
                · LMR{" "}
                {roundEven(saved.values.monocytes)
                  ? (
                      roundEven(saved.values.lymphocytes) /
                      roundEven(saved.values.monocytes)
                    ).toFixed(3)
                  : "undefined; saved imputer applies"}
              </p>
              <button
                type="button"
                disabled={
                  busy ||
                  dirty ||
                  !caps.inference ||
                  !selected.researchConsent ||
                  revision !== selected.revision
                }
                className="border border-teal-700 text-teal-900 rounded px-3 py-2 text-sm disabled:opacity-40"
                onClick={() => void run()}
              >
                Run research analysis
              </button>
              {!selected.researchConsent && (
                <p className="text-xs text-amber-900">
                  Research permission was not recorded for this report.
                </p>
              )}
              {saved.prediction && (
                <div className="text-xs space-y-1" data-testid="cbc-result">
                  <p className="font-bold">
                    Model score: {saved.prediction.score.toFixed(6)} ·{" "}
                    {saved.prediction.above_cutoff ? "Above" : "Below"} research
                    cutoff {saved.prediction.cutoff.toFixed(6)}
                  </p>
                  <p>
                    {saved.prediction.model_version} · {saved.predictedAt}
                  </p>
                  <p>
                    Undefined ratios imputed:{" "}
                    {saved.prediction.undefined_ratios_imputed ? "yes" : "no"}
                  </p>
                </div>
              )}
              <p className="text-xs text-amber-950">
                Experimental research score, not a diagnosis or personal cancer
                probability. Internal development sensitivity was 35.9%; a low
                score cannot rule out cancer. Clinical assessment and referral
                decisions remain separate.
              </p>
            </div>
          )}
          <div className="border-t pt-3 space-y-2">
            <h4 className="text-sm font-bold">
              Report history · current encounter
            </h4>
            {!reports.length && (
              <p className="text-xs text-slate-500">
                No saved reports for this encounter.
              </p>
            )}
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-wrap gap-2 items-center text-xs border rounded-lg bg-white p-2"
              >
                <button
                  type="button"
                  className="underline"
                  disabled={busy}
                  onClick={() => openReport(report)}
                >
                  Open {report.createdAt} · revision {report.revision}
                </button>
                {report.revisions.length > 1 && (
                  <select
                    aria-label="Report revision"
                    value={
                      selected?.id === report.id
                        ? (revision ?? report.revision)
                        : report.revision
                    }
                    onChange={(e) => openReport(report, Number(e.target.value))}
                  >
                    {report.revisions.map((item) => (
                      <option key={item.revision} value={item.revision}>
                        Revision {item.revision}
                      </option>
                    ))}
                  </select>
                )}
                {report.sourceRetained && (
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      if (!session) return;
                      void cbcApi
                        .source(session.token, report.id)
                        .then((blob) => {
                          if (!live.current) return;
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download =
                            blob.type === "application/pdf"
                              ? "cbc-report.pdf"
                              : "cbc-report";
                          a.click();
                          setTimeout(() => URL.revokeObjectURL(url), 1000);
                        })
                        .catch((e) => {
                          if (live.current)
                            setError(
                              e instanceof Error
                                ? e.message
                                : "Source unavailable.",
                            );
                        });
                    }}
                  >
                    Download private source
                  </button>
                )}
                <button
                  type="button"
                  className="text-red-800 underline"
                  disabled={busy}
                  onClick={() => {
                    if (
                      !session ||
                      !window.confirm(
                        "Delete this report and its saved measurements/analysis?",
                      )
                    )
                      return;
                    setBusy(true);
                    void cbcApi
                      .remove(session.token, report.id)
                      .then(async (result) => {
                        if (!live.current) return;
                        if (selected?.id === report.id) newDraft();
                        await reload();
                        if (live.current && result.sourceCleanupPending)
                          setProgress(
                            "Report deleted. Private source cleanup is pending and access is blocked.",
                          );
                      })
                      .catch((e) => {
                        if (live.current)
                          setError(
                            e instanceof Error ? e.message : "Deletion failed.",
                          );
                      })
                      .finally(() => {
                        if (live.current) setBusy(false);
                      });
                  }}
                >
                  Delete report
                </button>
              </div>
            ))}
            {cursor && (
              <button
                type="button"
                className="text-xs underline"
                disabled={busy}
                onClick={() => {
                  if (!session || !encounterId) return;
                  void cbcApi
                    .list(session.token, encounterId, undefined, cursor)
                    .then((data) => {
                      if (live.current) {
                        setReports((prev) => [...prev, ...data.reports]);
                        setCursor(data.nextCursor);
                      }
                    })
                    .catch((e) => {
                      if (live.current)
                        setError(
                          e instanceof Error
                            ? e.message
                            : "Could not load reports.",
                        );
                    });
                }}
              >
                More reports
              </button>
            )}
          </div>
        </>
      )}
      {error && (
        <p
          role="alert"
          className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"
        >
          {error}
        </p>
      )}
    </section>
  );
}
