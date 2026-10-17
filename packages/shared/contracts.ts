import { z } from "zod";

export const patientSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z0-9-]+$/)
    .max(80),
  name: z.string().min(1).max(120),
  gender: z.enum(["female", "male", "other", "unknown"]),
  birthDate: z.iso.date(),
  language: z.enum(["en-IN", "hi-IN", "ta-IN", "te-IN"]),
});
export type Patient = z.infer<typeof patientSchema>;
export const observationSchema = z.object({
  id: z.string().min(1).max(100),
  patientId: z.string().min(1),
  code: z.enum(["8480-6", "8867-4", "59408-5", "41950-7"]),
  value: z.number().finite(),
  unit: z.enum(["mm[Hg]", "/min", "%", "{steps}"]),
  sampledAt: z.iso.datetime(),
  source: z.enum(["project-1", "project-2", "ble-simulator", "manual"]),
});
export type Observation = z.infer<typeof observationSchema>;
export const prescriptionSchema = z.object({
  salt: z.string().min(1).max(100),
  strengthMg: z.number().int().positive().max(5000),
  form: z.enum(["tablet", "capsule"]),
  units: z.number().int().positive().max(1000),
  courseEnd: z.iso.date(),
});
export const batchSchema = z.object({
  id: z.string().min(1),
  clinic: z.string().min(1),
  salt: z.string().min(1),
  strengthMg: z.number().int().positive(),
  form: z.enum(["tablet", "capsule"]),
  stock: z.number().int().nonnegative(),
  pricePaise: z.number().int().nonnegative().max(10000000),
  expiry: z.iso.date(),
});
export const planInputSchema = z
  .object({
    prescription: prescriptionSchema,
    batches: z.array(batchSchema).max(200),
    allergies: z.array(z.string().max(100)).max(30).default([]),
    homeClinic: z.string().max(100),
    transferPaise: z.number().int().nonnegative().max(100000).default(0),
  })
  .superRefine((input, ctx) => {
    const ids = new Set<string>();
    for (const [index, batch] of input.batches.entries()) {
      if (ids.has(batch.id))
        ctx.addIssue({
          code: "custom",
          message: "Batch IDs must be unique",
          path: ["batches", index, "id"],
        });
      ids.add(batch.id);
    }
  });
export type PlanInput = z.infer<typeof planInputSchema>;
export type Batch = z.infer<typeof batchSchema>;
export const sentinelInputSchema = z.object({
  answers: z.partialRecord(
    z.enum([
      "chestPain",
      "breathless",
      "fainting",
      "fever",
      "cough",
      "fatigue",
      "thirst",
    ]),
    z.enum(["yes", "no", "unsure"]),
  ),
});
export const driftInputSchema = z.object({
  readings: z
    .array(
      z.object({
        day: z.number().int().min(0).max(36500),
        value: z.number().min(60).max(250),
      }),
    )
    .min(1)
    .max(365),
});
export const demandInputSchema = z.object({
  probabilities: z.array(z.number().min(0).max(1)).max(500),
  stock: z.number().int().nonnegative().max(100000),
  serviceLevel: z.number().min(0.5).max(0.999).default(0.95),
});

/** Collection bundle: FHIR R4 aligned; not an ABDM document or certified profile. */
export function fhirBundle(patient: Patient, observations: Observation[]) {
  patientSchema.parse(patient);
  for (const observation of observations) {
    observationSchema.parse(observation);
    if (observation.patientId !== patient.id)
      throw new Error("Observation patient mismatch");
  }
  return {
    resourceType: "Bundle",
    type: "collection",
    entry: [
      {
        fullUrl: `urn:dhaaga:Patient:${patient.id}`,
        resource: {
          resourceType: "Patient",
          id: patient.id,
          name: [{ text: patient.name }],
          gender: patient.gender,
          birthDate: patient.birthDate,
        },
      },
      ...observations.map((o) => ({
        fullUrl: `urn:dhaaga:Observation:${o.id}`,
        resource: {
          resourceType: "Observation",
          id: o.id,
          status: "final",
          subject: { reference: `urn:dhaaga:Patient:${patient.id}` },
          code: { coding: [{ system: "http://loinc.org", code: o.code }] },
          effectiveDateTime: o.sampledAt,
          valueQuantity: {
            value: o.value,
            unit: o.unit,
            system: "http://unitsofmeasure.org",
            code: o.unit,
          },
          note: [{ text: `Source: ${o.source}; synthetic demonstration data` }],
        },
      })),
    ],
  };
}
