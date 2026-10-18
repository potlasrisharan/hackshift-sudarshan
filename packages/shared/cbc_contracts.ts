import { z } from "zod";

export const cbcFields = [
  "wbc",
  "rbc",
  "neutrophils",
  "lymphocytes",
  "monocytes",
] as const;
export type CbcField = (typeof cbcFields)[number];
export const cbcUnits = [
  "10^9/L",
  "10^12/L",
  "%",
  "cells/uL",
  "10^3/uL",
  "million/uL",
  "lakh/uL",
] as const;
export const cbcInputSchema = z
  .object({
    wbc: z.number().finite().positive(),
    rbc: z.number().finite().positive(),
    neutrophils: z.number().finite().min(0).max(100),
    lymphocytes: z.number().finite().min(0).max(100),
    monocytes: z.number().finite().min(0).max(100),
  })
  .strict()
  .refine((v) => v.neutrophils + v.lymphocytes + v.monocytes <= 100 + 1e-6, {
    message: "Differential percentages cannot total more than 100",
  });
export type CbcInput = z.infer<typeof cbcInputSchema>;
export const cbcMeasurementSchema = z
  .object({
    field: z.enum(cbcFields),
    value: z.number().finite(),
    unit: z.enum(cbcUnits),
    method: z.enum(["pdf-text", "ocr", "manual"]),
    page: z.number().int().min(1).max(5).nullable(),
    evidence: z.string().max(250),
    evidenceId: z.string().max(80).optional(),
    confidence: z.number().min(0).max(100).nullable().optional(),
    region: z
      .object({
        x: z.number().min(0).max(1),
        y: z.number().min(0).max(1),
        width: z.number().min(0).max(1),
        height: z.number().min(0).max(1),
      })
      .strict()
      .optional(),
  })
  .strict();
export type CbcMeasurement = z.infer<typeof cbcMeasurementSchema>;
export const cbcCreateSchema = z
  .object({
    encounterId: z.string().min(1).max(100),
    processingConsent: z.literal(true),
    researchConsent: z.boolean(),
  })
  .strict();
export const cbcConfirmSchema = z
  .object({
    expectedRevision: z.number().int().min(0),
    measurements: z.array(cbcMeasurementSchema).length(5),
    collectionDate: z.iso.date().nullable(),
    panelReviewed: z.literal(true),
  })
  .strict();
export const cbcPredictSchema = z
  .object({ revision: z.number().int().positive() })
  .strict();
export const cbcPredictionSchema = z.object({
  score: z.number().finite().min(0).max(1),
  cutoff: z.number().finite(),
  above_cutoff: z.boolean(),
  undefined_ratios_imputed: z.boolean(),
  research_only: z.literal(true),
  model_version: z.string(),
  model_sha256: z.string(),
  representation_version: z.literal(1),
});
export type CbcPrediction = z.infer<typeof cbcPredictionSchema>;
export const cbcRevisionSchema = z.object({
  revision: z.number().int(),
  values: cbcInputSchema,
  measurements: z.array(cbcMeasurementSchema),
  collectionDate: z.iso.date().nullable(),
  confirmedAt: z.string(),
  confirmedBy: z.string(),
  inputHash: z.string(),
  prediction: cbcPredictionSchema.nullable(),
  predictedAt: z.string().nullable(),
});
export const cbcReportSchema = z.object({
  id: z.string(),
  encounterId: z.string(),
  patientId: z.string(),
  revision: z.number().int(),
  createdAt: z.string(),
  researchConsent: z.boolean(),
  sourceRetained: z.boolean(),
  revisions: z.array(cbcRevisionSchema),
});
export type CbcReport = z.infer<typeof cbcReportSchema>;
export const cbcListSchema = z.object({
  reports: z.array(cbcReportSchema),
  nextCursor: z.string().nullable(),
});
export const cbcCapabilitiesSchema = z.object({
  enabled: z.boolean(),
  syntheticOnly: z.literal(true),
  sourceRetention: z.boolean(),
  inference: z.boolean(),
  maxFileBytes: z.literal(10485760),
  maxPages: z.literal(5),
});
