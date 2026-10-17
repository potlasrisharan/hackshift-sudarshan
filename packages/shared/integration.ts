import { z } from "zod";
import { patientSchema, sentinelInputSchema } from "./contracts";

export const roleSchema = z.enum([
  "HOSPITAL_ADMIN",
  "DOCTOR",
  "NURSE",
  "CASHIER",
]);
export const principalSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  clinicId: z.string(),
  role: roleSchema,
});
export type Principal = z.infer<typeof principalSchema>;
export const loginSchema = z
  .object({
    orgId: z.string().regex(/^[a-z0-9-]{1,80}$/),
    email: z.email().max(160),
    password: z.string().min(1).max(200),
  })
  .strict();
export const loginResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.iso.datetime(),
  principal: principalSchema,
});
export const intakeSchema = z
  .object({
    patient: patientSchema.omit({ id: true }),
    chiefComplaint: z.string().trim().min(3).max(2000),
    answers: sentinelInputSchema.shape.answers,
    careConsent: z.literal(true),
    synthetic: z.literal(true),
  })
  .strict()
  .superRefine((input, context) => {
    const danger = ["chestPain", "breathless", "fainting"] as const;
    if (
      !danger.some((key) => input.answers[key] === "yes") &&
      danger.some((key) => input.answers[key] === undefined)
    ) {
      context.addIssue({
        code: "custom",
        path: ["answers"],
        message: "Complete the red-flag screen before routine intake",
      });
    }
  });
export const encounterSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  clinicId: z.string(),
  patientName: z.string(),
  chiefComplaint: z.string(),
  language: patientSchema.shape.language,
  status: z.enum(["waiting", "emergency", "reviewed"]),
  answers: sentinelInputSchema.shape.answers,
  redFlags: z.array(z.string()),
  nextQuestion: z.string().nullable(),
  createdAt: z.iso.datetime(),
  reviewedBy: z.string().nullable(),
  reviewedAt: z.iso.datetime().nullable(),
  reviewNote: z.string().nullable(),
  consentActive: z.boolean(),
});
export type Encounter = z.infer<typeof encounterSchema>;
export const encounterListSchema = z.object({
  encounters: z.array(encounterSchema),
});
export const reviewSchema = z
  .object({ note: z.string().trim().min(3).max(4000) })
  .strict();
export const capabilitySchema = z.object({
  mode: z.literal("synthetic-integration"),
  persistentStorage: z.literal(true),
  intake: z.literal(true),
  clinicianQueue: z.literal(true),
  dispensing: z.literal(false),
  externalClinicalAI: z.literal(false),
  liveUpstreams: z.literal(false),
});
