import {
  type CbcInput,
  cbcInputSchema,
  cbcPredictionSchema,
} from "../../shared/cbc_contracts";
import frozen from "./frozen-model.json";

/** NumPy round(x, 0): ties to even, for the model's non-negative percentages. */
export function roundEven(value: number): number {
  const floor = Math.floor(value),
    fraction = value - floor;
  return fraction === 0.5 ? floor + (floor % 2) : Math.round(value);
}
export function predictCbc(input: CbcInput) {
  const v = cbcInputSchema.parse(input);
  const n = roundEven(v.neutrophils),
    l = roundEven(v.lymphocytes),
    m = roundEven(v.monocytes);
  const row = [v.wbc, l, n, m, v.rbc, l ? n / l : null, m ? l / m : null];
  const missing = row.map((value) => value === null);
  const filled = row.map((value, i) => value ?? required(frozen.statistics, i));
  for (const i of frozen.indicator_features) filled.push(missing[i] ? 1 : 0);
  let decision = frozen.intercept;
  for (const [i, value] of filled.entries()) {
    decision +=
      ((value - required(frozen.mean, i)) / required(frozen.scale, i)) *
      required(frozen.coefficients, i);
  }
  const score =
    decision >= 0
      ? 1 / (1 + Math.exp(-decision))
      : Math.exp(decision) / (1 + Math.exp(decision));
  return cbcPredictionSchema.parse({
    score,
    cutoff: frozen.cutoff,
    above_cutoff: score >= frozen.cutoff,
    undefined_ratios_imputed: missing.some(Boolean),
    research_only: true,
    model_version: frozen.model_version,
    model_sha256: frozen.model_sha256,
    representation_version: 1,
  });
}
function required(values: number[], index: number): number {
  const value = values[index];
  if (value === undefined || !Number.isFinite(value))
    throw new Error("Invalid frozen model representation");
  return value;
}
