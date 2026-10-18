import {
  type CbcField,
  type CbcMeasurement,
  cbcFields,
  cbcInputSchema,
} from "../../shared/cbc_contracts";

export interface CbcLine {
  text: string;
  page: number;
  method: "pdf-text" | "ocr";
  region?: CbcMeasurement["region"];
  confidence?: number | null;
}
export interface CbcCandidate {
  field: CbcField;
  measurement: CbcMeasurement | null;
  status: "found" | "missing" | "ambiguous" | "unit_unknown";
  alternatives: CbcMeasurement[];
  warning: string | null;
}
const labels: Record<CbcField, RegExp> = {
  wbc: /\b(?:wbc|total\s+(?:wbc|leu[ck]ocyte)\s*(?:count)?|tlc)\b/i,
  rbc: /\b(?:rbc|erythrocyte)\s*(?:count)?\b/i,
  neutrophils: /\b(?:neutrophils?|neut|polymorphs?|polys)\b/i,
  lymphocytes: /\b(?:lymphocytes?|lymph|lym)\b/i,
  monocytes: /\b(?:monocytes?|mono|mon)\b/i,
};
export function canonicalValue(measurement: CbcMeasurement): number {
  const { field, value, unit } = measurement;
  if (field === "wbc") {
    if (unit === "10^9/L" || unit === "10^3/uL") return value;
    if (unit === "cells/uL") return value / 1000;
  } else if (field === "rbc") {
    if (unit === "10^12/L" || unit === "million/uL") return value;
    if (unit === "lakh/uL") return value / 10;
    if (unit === "cells/uL") return value / 1000000;
  } else if (unit === "%") return value;
  throw new Error(`Unsupported unit for ${field}`);
}
export function normalizeCbc(measurements: CbcMeasurement[]) {
  if (
    measurements.length !== 5 ||
    new Set(measurements.map((m) => m.field)).size !== 5
  )
    throw new Error("Confirm all five distinct CBC measurements");
  const values: Record<string, number> = {};
  for (const m of measurements) values[m.field] = canonicalValue(m);
  return cbcInputSchema.parse(values);
}
function unitFor(field: CbcField, text: string): CbcMeasurement["unit"] | null {
  const t = text
    .toLowerCase()
    .replace(/[µμ]/g, "u")
    .replace(/³/g, "^3")
    .replace(/⁹/g, "^9")
    .replace(/¹²/g, "^12")
    .replace(/\s/g, "");
  if (!["wbc", "rbc"].includes(field)) return t.includes("%") ? "%" : null;
  if (field === "wbc" && /10\^?9\/l/.test(t)) return "10^9/L";
  if (field === "wbc" && /10\^?3\/(?:ul|cumm|mm\^?3)/.test(t)) return "10^3/uL";
  if (field === "rbc" && /10\^?12\/l/.test(t)) return "10^12/L";
  if (field === "rbc" && /(?:million|10\^?6)\/(?:ul|cumm|mm\^?3)/.test(t))
    return "million/uL";
  if (field === "rbc" && /lakhs?\/(?:ul|cumm|mm\^?3)/.test(t)) return "lakh/uL";
  if (/(?:cells\/ul|\/cumm|\/mm\^?3|cells\/mm3)/.test(t)) return "cells/uL";
  return null;
}
/** Conservative: ambiguous layouts require manual review, never guessed values. */
export function parseCbc(lines: CbcLine[]): CbcCandidate[] {
  return cbcFields.map((field) => {
    const alternatives: CbcMeasurement[] = [];
    let warning: string | null = null;
    let seen = false;
    for (const [lineIndex, line] of lines.entries()) {
      const match = labels[field].exec(line.text);
      if (!match) continue;
      seen = true;
      const tail = line.text.slice(match.index + match[0].length);
      if (
        /absolute|\b(?:anc|alc|amc)\b|^\s*#/.test(tail.toLowerCase()) ||
        /absolute/i.test(line.text)
      ) {
        warning =
          "Absolute count found; enter a differential percentage from the report.";
        continue;
      }
      // Multiple analytes on one line make result-column ownership uncertain.
      if (
        cbcFields.some((other) => other !== field && labels[other].test(tail))
      ) {
        warning =
          "Multiple result columns; review the source and enter the correct result.";
        continue;
      }
      const unit = unitFor(field, line.text);
      const numeric = /^\s*(?:count)?\s*[%:]?\s*([\d][\d,.]*)(?:\s|$|%)/i.exec(
        tail,
      );
      if (!numeric || !unit) {
        warning = "Result or unit is unclear; confirm both manually.";
        continue;
      }
      const token = numeric[1] ?? "";
      if (token.includes(",")) {
        warning =
          "Ambiguous number separator; enter the reviewed numeric result.";
        continue;
      }
      const value = Number(token);
      if (!Number.isFinite(value)) continue;
      alternatives.push({
        field,
        value,
        unit,
        page: line.page,
        method: line.method,
        evidence: line.text.slice(match.index, match.index + 250),
        evidenceId: `${line.page}:${lineIndex}:${field}`,
        confidence: line.confidence ?? null,
        ...(line.region ? { region: line.region } : {}),
      });
    }
    return {
      field,
      alternatives,
      measurement:
        alternatives.length === 1 && !warning
          ? (alternatives[0] ?? null)
          : null,
      status:
        alternatives.length > 1 || (alternatives.length && warning)
          ? "ambiguous"
          : alternatives.length === 1
            ? "found"
            : seen
              ? "unit_unknown"
              : "missing",
      warning:
        alternatives.length > 1
          ? "Repeated measurements/panels: select a single coherent panel and confirm manually."
          : warning,
    };
  });
}
