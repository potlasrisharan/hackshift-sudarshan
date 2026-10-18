import { useState } from "react";
import { predictCbc } from "../../../../../packages/engine/cbc/inference";
import { cbcFields, type CbcField } from "../../../../../packages/shared/cbc_contracts";

const fields: Record<CbcField, { label: string; unit: string }> = {
  wbc: { label: "WBC", unit: "×10⁹/L" },
  rbc: { label: "RBC", unit: "×10¹²/L" },
  neutrophils: { label: "Neutrophils", unit: "%" },
  lymphocytes: { label: "Lymphocytes", unit: "%" },
  monocytes: { label: "Monocytes", unit: "%" },
};
const sample = { wbc: "8.95", rbc: "4.41", neutrophils: "65", lymphocytes: "25", monocytes: "9" };
const belowCutoffSample = { wbc: "7", rbc: "4.8", neutrophils: "60", lymphocytes: "32", monocytes: "5" };
const empty = { wbc: "", rbc: "", neutrophils: "", lymphocytes: "", monocytes: "" };

export default function CbcResearchDemo() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<CbcField, string>>(empty);
  const [result, setResult] = useState<ReturnType<typeof predictCbc> | null>(null);
  const [error, setError] = useState("");
  const [demoPreset, setDemoPreset] = useState("risk");

  function run() {
    setResult(null);
    setError("");
    if (cbcFields.some((field) => !values[field].trim())) {
      setError("Enter all five synthetic measurements before running the model.");
      return;
    }
    try {
      setResult(predictCbc({
        wbc: Number(values.wbc), rbc: Number(values.rbc),
        neutrophils: Number(values.neutrophils),
        lymphocytes: Number(values.lymphocytes), monocytes: Number(values.monocytes),
      }));
    } catch {
      setError("WBC and RBC must be positive finite numbers. Each differential must be 0–100%, with their total no greater than 100%.");
    }
  }

  return (
    <section aria-label="CBC Research Explorer" className="rounded-2xl border border-teal-200 bg-teal-50/50 p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 rounded-full px-2 py-1">Experimental · Synthetic data only</span>
          <h3 className="mt-2 font-bold text-slate-900">CBC Research Explorer</h3>
          <p className="text-sm text-slate-600">Explore a frozen research model using five CBC measurements.</p>
        </div>
        <button type="button" aria-expanded={open} aria-controls="cbc-research-demo" className="rounded-lg bg-teal-800 text-white px-4 py-2 text-sm font-semibold" onClick={() => {
          if (!open) { setValues({ ...sample }); setDemoPreset("risk"); setResult(null); setError(""); }
          setOpen(!open);
        }}>{open ? "Close demo" : "Try demo"}</button>
      </div>
      {open && (
        <div id="cbc-research-demo" className="space-y-4">
          <p className="text-xs text-slate-600">Demo values are illustrative, not a patient report. Use synthetic inputs only. Calculation runs on this device; inputs and results are not sent to Render or saved to patient records.</p>
          <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); run(); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {cbcFields.map((field) => (
                <label key={field} className="text-xs font-semibold text-slate-700">
                  {fields[field].label} <span className="font-normal">({fields[field].unit})</span>
                  <input type="number" step="any" required min={0} max={field === "wbc" || field === "rbc" ? undefined : 100}
                    aria-label={`Synthetic ${fields[field].label}`} value={values[field]}
                    className="mt-1 block w-full border border-slate-300 rounded-lg p-2 bg-white"
                    onChange={(event) => { setValues({ ...values, [field]: event.target.value }); setDemoPreset(""); setResult(null); setError(""); }} />
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="rounded-lg bg-teal-800 text-white px-4 py-2 text-sm">Run research model</button>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                Demo values
                <select aria-label="Demo values" value={demoPreset} className="rounded-lg border bg-white px-3 py-2 text-sm" onChange={(event) => {
                  const preset = event.target.value;
                  if (!preset) return;
                  setDemoPreset(preset);
                  setValues({ ...(preset === "risk" ? sample : belowCutoffSample) });
                  setResult(null); setError("");
                }}>
                  <option value="" disabled>Choose an example</option>
                  <option value="risk">Risk signal · experimental</option>
                  <option value="no-signal">No risk signal · experimental</option>
                </select>
              </label>
              <button type="button" className="rounded-lg border bg-white px-3 py-2 text-sm" onClick={() => { setValues({ ...empty }); setDemoPreset(""); setResult(null); setError(""); }}>Clear</button>
            </div>
          </form>
          {error && <p role="alert" className="text-sm text-amber-950">{error}</p>}
          <div aria-live="polite">
            {result && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500">Experimental model output</p>
                <p className="text-lg font-bold text-slate-900">{result.above_cutoff ? "Potential risk signal detected" : "No risk signal detected by this model"}</p>
                <p className="text-sm text-slate-700">{result.above_cutoff
                  ? "These inputs triggered the experimental model flag. This does not establish that a person has cancer or a higher clinical risk."
                  : "These inputs did not trigger the experimental model flag. This does not mean no cancer risk; the model can miss cases."}</p>
                <p className="text-sm font-semibold text-slate-900">Model score: {result.score.toFixed(3)}</p>
                <p className="text-sm text-slate-700">{result.above_cutoff ? "Above" : "Below"} experimental cutoff ({result.cutoff.toFixed(3)}).</p>
                <p className="text-xs text-slate-600 break-all">Model: {result.model_version} · Undefined ratios imputed: {result.undefined_ratios_imputed ? "yes" : "no"}</p>
                <p className="text-sm font-semibold text-amber-950">This score is not a cancer probability. It cannot confirm or rule out cancer and must not guide treatment.</p>
              </div>
            )}
          </div>
          <details className="text-xs text-slate-600">
            <summary className="cursor-pointer font-semibold">Why experimental?</summary>
            <p className="mt-2">Limited development data, reconstructed labels and possible hospital-source bias restrict interpretation. Internal nested cross-validation on 752 records reported AUC 0.713, sensitivity 35.9% and specificity 90.4%. These are development estimates, not independent clinical validation. The model can miss cases; a low score does not rule out cancer. Representative, appropriately governed data and independent validation are needed before clinical use.</p>
          </details>
        </div>
      )}
    </section>
  );
}
