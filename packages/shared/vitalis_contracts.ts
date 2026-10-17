import { z } from "zod";

// ----------------------------------------------------
// 1. Profile & Consent Contracts
// ----------------------------------------------------
export const vitalisProfileSchema = z.object({
  id: z.string().optional(),
  patientId: z.string(),
  yearOfBirth: z.number().int().min(1900).max(2026),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).default("OTHER"),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  waistCircumferenceCm: z.number().positive().optional(),
  diagnosedConditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  dietPreference: z.enum(["vegetarian", "vegan", "eggetarian", "mixed"]).default("vegetarian"),
  activityLimitations: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  smokingStatus: z.enum(["never", "former", "current", "declined"]).default("never"),
  alcoholIntake: z.enum(["none", "occasional", "moderate", "high", "declined"]).default("none"),
  clinicianRestrictedExertion: z.boolean().default(false),
  onboardingVersion: z.string().default("2026.1"),
  updatedAt: z.string().optional(),
});

export type VitalisProfile = z.infer<typeof vitalisProfileSchema>;

export const vitalisConsentSchema = z.object({
  id: z.string().optional(),
  patientId: z.string(),
  vitalisHealthData: z.boolean().default(true),
  wearableSync: z.boolean().default(true),
  clinicianSharing: z.boolean().default(false),
  researchAnonymized: z.boolean().default(false),
  herMenstrualSharing: z.boolean().default(false), // Explicit opt-in required for HER data
  grantedAt: z.string().optional(),
  revokedAt: z.string().nullable().optional(),
});

export type VitalisConsent = z.infer<typeof vitalisConsentSchema>;

// ----------------------------------------------------
// 2. Adaptive Questionnaire Contracts (Q01-Q40)
// ----------------------------------------------------
export const vitalisQuestionSchema = z.object({
  questionId: z.string(),
  version: z.string().default("1.0"),
  section: z.string(),
  prompt: z.string(),
  type: z.enum(["single", "multi", "number", "date", "scale", "text", "boolean"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  clinicalRuleTags: z.array(z.string()).default([]),
});

export type VitalisQuestion = z.infer<typeof vitalisQuestionSchema>;

export const vitalisAssessmentSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  questionnaireVersion: z.string().default("1.0"),
  status: z.enum(["in_progress", "completed", "abandoned"]).default("in_progress"),
  answers: z.record(z.string(), z.any()).default({}),
  resultCategory: z.enum(["urgent_evaluation", "clinician_review", "wellness_plan_available", "insufficient_information"]).default("wellness_plan_available"),
  triageNotes: z.array(z.string()).default([]),
  startedAt: z.string(),
  completedAt: z.string().nullable().optional(),
});

export type VitalisAssessment = z.infer<typeof vitalisAssessmentSchema>;

// ----------------------------------------------------
// 3. Biomarker Observations & Health Data
// ----------------------------------------------------
export const vitalisObservationSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  metricCode: z.string(), // e.g., 'hba1c', 'systolic_bp', 'vo2max', 'ldl', 'resting_hr'
  metricName: z.string(),
  valueNumeric: z.number(),
  valueText: z.string().optional(),
  unit: z.string(),
  observedStartUtc: z.string(),
  observedEndUtc: z.string().optional(),
  ianaTimezone: z.string().default("Asia/Kolkata"),
  sourceType: z.enum(["lab_measured", "wearable_estimated", "model_estimated", "patient_reported"]),
  sourceId: z.string().default("manual"),
  sourceRecordId: z.string().optional(),
  method: z.string().optional(),
  quality: z.enum(["verified", "estimated", "unverified", "quarantined"]).default("verified"),
  referenceRange: z.string().optional(),
  isAbnormal: z.boolean().default(false),
});

export type VitalisObservation = z.infer<typeof vitalisObservationSchema>;

// ----------------------------------------------------
// 4. Healthspan Progress Index (HPI)
// ----------------------------------------------------
export const vitalisScoreSchema = z.object({
  patientId: z.string(),
  hpiScore: z.number().nullable(), // 0-100, null if coverage < minimum
  coverage: z.number().min(0).max(1),
  status: z.enum(["ADEQUATE_DATA", "INSUFFICIENT_DATA"]),
  domains: z.record(z.string(), z.object({
    score: z.number().min(0).max(100).nullable(),
    weight: z.number().positive(),
    observed: z.boolean(),
    rationale: z.string(),
  })),
  algorithmVersion: z.string().default("V1-HPI-2026.1"),
  computedAt: z.string(),
  limitations: z.array(z.string()),
});

export type VitalisScore = z.infer<typeof vitalisScoreSchema>;

// ----------------------------------------------------
// 5. Exercise & Nutrition Plans
// ----------------------------------------------------
export const vitalisExercisePlanSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  weeklyAerobicMinutesTarget: z.number().int(),
  weeklyStrengthSessionsTarget: z.number().int(),
  recommendedActivities: z.array(z.string()),
  contraindicatedActivities: z.array(z.string()),
  intensityLevel: z.enum(["low", "moderate", "challenging_educational_only"]),
  yogaAndMobilityRoutine: z.array(z.object({
    asana: z.string(),
    durationMins: z.number(),
    focus: z.string(),
    contraindications: z.array(z.string()),
  })),
  policyVersion: z.string().default("V3-EX-2026.1"),
  safetyStatus: z.enum(["ALLOWED", "BLOCKED", "CLINICIAN_REVIEW"]).default("ALLOWED"),
  safetyNotes: z.array(z.string()).default([]),
});

export type VitalisExercisePlan = z.infer<typeof vitalisExercisePlanSchema>;

export const vitalisNutritionPlanSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  dietPreference: z.string(),
  keyFoods: z.array(z.object({
    foodName: z.string(),
    hindiName: z.string().optional(),
    category: z.string(),
    proteinGramsPer100g: z.number(),
    fiberGramsPer100g: z.number(),
    benefits: z.string(),
  })),
  exclusions: z.array(z.string()),
  guidelines: z.array(z.string()),
  herbalCautionNotes: z.array(z.string()),
});

export type VitalisNutritionPlan = z.infer<typeof vitalisNutritionPlanSchema>;

// ----------------------------------------------------
// 6. Preventive Care Timeline
// ----------------------------------------------------
export const vitalisPreventiveItemSchema = z.object({
  id: z.string(),
  ruleId: z.string(),
  title: z.string(),
  description: z.string(),
  evidenceGrade: z.string(),
  guidelineSource: z.string(),
  status: z.enum(["due", "completed", "needs_discussion", "not_applicable", "unknown"]),
  recommendedIntervalMonths: z.number(),
  lastCompletedDate: z.string().nullable().optional(),
  nextDueDate: z.string().nullable().optional(),
});

export type VitalisPreventiveItem = z.infer<typeof vitalisPreventiveItemSchema>;

// ----------------------------------------------------
// 7. Doctor Longitudinal Summary & Export
// ----------------------------------------------------
export const vitalisDoctorSummarySchema = z.object({
  id: z.string(),
  patientId: z.string(),
  generatedAt: z.string(),
  patientSummary: z.object({
    age: z.number(),
    sex: z.string(),
    bmi: z.number().optional(),
    knownConditions: z.array(z.string()),
    currentMedications: z.array(z.string()),
  }),
  safetyFlags: z.array(z.string()),
  biomarkerTrends: z.array(z.any()),
  wearableBaseline: z.record(z.string(), z.any()).optional(),
  functionalMetrics: z.record(z.string(), z.any()).optional(),
  preventiveStatus: z.array(z.any()),
  algorithmVersions: z.record(z.string(), z.string()),
  shareToken: z.string().optional(),
  passcodeHash: z.string().optional(),
  isClinicianConfirmed: z.boolean().default(false),
  disclaimer: z.string(),
});

export type VitalisDoctorSummary = z.infer<typeof vitalisDoctorSummarySchema>;
