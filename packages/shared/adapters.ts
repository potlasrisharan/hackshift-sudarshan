import { z } from "zod";
import {
  type Observation,
  observationSchema,
  type Patient,
  patientSchema,
} from "./contracts";

const intakePatientSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  gender: z.string(),
  age: z.number().int().min(0).max(120),
});
/** No inferred date of birth from age: caller must provide confirmed birthDate. */
export function fromIntakePatient(raw: unknown, birthDate: string): Patient {
  const p = intakePatientSchema.parse(raw);
  return patientSchema.parse({
    id: `p2-${p.id}`,
    name: p.full_name,
    gender: p.gender.toLowerCase(),
    birthDate,
    language: "hi-IN",
  });
}
const opsReadingSchema = z.object({
  id: z.string(),
  patient_id: z.string(),
  systolic: z.number(),
  recorded_at: z.iso.datetime(),
});
export function fromOpsReading(raw: unknown): Observation {
  const r = opsReadingSchema.parse(raw);
  return observationSchema.parse({
    id: `p1-${r.id}`,
    patientId: r.patient_id,
    code: "8480-6",
    value: r.systolic,
    unit: "mm[Hg]",
    sampledAt: r.recorded_at,
    source: "project-1",
  });
}
/** Dedupe identical source IDs; retain competing sources for human review. */
export function mergeRecord(readings: Observation[]) {
  const unique = new Map<string, Observation>();
  for (const reading of readings) {
    const parsed = observationSchema.parse(reading);
    const key = `${parsed.source}:${parsed.id}`;
    const prior = unique.get(key);
    if (prior && JSON.stringify(prior) !== JSON.stringify(parsed))
      throw new Error(
        "Conflicting observation identity requires explicit correction review",
      );
    unique.set(key, parsed);
  }
  return [...unique.values()].sort((a, b) =>
    a.sampledAt.localeCompare(b.sampledAt),
  );
}
