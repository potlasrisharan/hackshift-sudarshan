import { z } from "zod";

// ==========================================
// 1. HER PROFILE & CONSENTS
// ==========================================
export const herProfileSchema = z.object({
  patientId: z.string().min(1).max(80),
  birthYear: z.number().int().min(1940).max(2025).optional(),
  yearOfBirth: z.number().int().min(1940).max(2025).optional(),
  menarcheAge: z.number().int().min(8).max(20).optional(),
  lifeStage: z.enum(["reproductive", "perimenopause", "postmenopause", "adolescent"]).default("reproductive").optional(),
  isPregnantOrLactating: z.boolean().default(false),
  hormonalContraception: z.union([z.boolean(), z.enum(["none", "combined_pill", "progestin_only", "iud", "implant", "other"])]).default("none"),
  knownConditions: z.array(z.string()).default([]).optional(),
  medications: z.array(z.string()).default([]).optional(),
  dietPreference: z.union([z.enum(["vegetarian", "vegan", "eggetarian", "non_vegetarian"]), z.literal("non-vegetarian")]).default("vegetarian"),
  allergies: z.array(z.string()).default([]).optional(),
  goals: z.array(z.string()).default([]).optional(),
  lifestyleGoals: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type HerProfile = z.infer<typeof herProfileSchema>;

export const herConsentSchema = z.object({
  id: z.string().min(1),
  patientId: z.string().min(1),
  consentType: z.enum(["reproductive_health", "wearable_telemetry", "report_linkage", "clinician_share"]),
  scope: z.array(z.string()),
  granted: z.boolean(),
  grantedAt: z.string().datetime(),
  revokedAt: z.string().datetime().nullable().optional(),
  policyVersion: z.string().default("2026.1"),
});
export type HerConsent = z.infer<typeof herConsentSchema>;

// ==========================================
// 2. CYCLES & BLEEDING
// ==========================================
export const herBleedingDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  flowLevel: z.enum(["spotting", "light", "moderate", "heavy"]),
  spotting: z.boolean().default(false),
  subjectiveHeavy: z.boolean().default(false),
  crampsSeverity: z.number().min(0).max(10).default(0),
  productsCount: z.number().int().nonnegative().optional(),
});
export type HerBleedingDay = z.infer<typeof herBleedingDaySchema>;

export const herCycleEntrySchema = z.object({
  id: z.string().min(1),
  patientId: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  certainty: z.enum(["exact", "estimated"]).default("exact"),
  notes: z.string().max(500).optional(),
  bleedingDays: z.array(herBleedingDaySchema).default([]),
});
export type HerCycleEntry = z.infer<typeof herCycleEntrySchema>;

// ==========================================
// 3. DAILY SYMPTOM & WELLBEING JOURNAL
// ==========================================
export const herSymptomEntrySchema = z.object({
  id: z.string().min(1),
  patientId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  symptomCode: z.enum([
    "pelvic_pain",
    "cramps",
    "acne",
    "facial_hair",
    "hair_thinning",
    "fatigue",
    "headache",
    "bloating",
    "nausea",
    "bowel_pain",
    "urinary_pain",
    "mood_swings",
    "hot_flashes",
    "insomnia",
    "dizziness",
  ]),
  severity: z.number().min(0).max(10), // 0 to 10 scale
  notes: z.string().max(300).optional(),
});
export type HerSymptomEntry = z.infer<typeof herSymptomEntrySchema>;

// ==========================================
// 4. SCREENING & EVIDENCE RESULTS
// ==========================================
export const herScreeningFindingSchema = z.object({
  domain: z.enum(["PCOS_FEATURES", "ENDOMETRIOSIS_PELVIC_PAIN", "HEAVY_BLEEDING_ANEMIA", "THYROID_CONTEXT", "PMS_PMDD"]),
  category: z.enum(["URGENT_REVIEW", "CLINICAL_REVIEW_SUGGESTED", "MONITOR_AND_TRACK", "INSUFFICIENT_INFORMATION", "NO_CURRENT_SCREENING_FLAGS"]),
  isDiagnosis: z.literal(false),
  title: z.string(),
  rationale: z.string(),
  supportingEvidence: z.array(
    z.object({
      source: z.string(),
      label: z.string(),
      verified: z.boolean(),
    })
  ),
  missingInformation: z.array(z.string()),
  limitations: z.array(z.string()),
  ruleVersion: z.string(),
  suggestedAction: z.string(),
});
export type HerScreeningFinding = z.infer<typeof herScreeningFindingSchema>;

// ==========================================
// 5. WEARABLE & HEALTH ADAPTER CONTRACTS
// ==========================================
export const herWearableDataPointSchema = z.object({
  type: z.enum(["steps", "sleep_hours", "resting_hr", "hrv_ms", "temperature_c"]),
  value: z.number(),
  timestamp: z.string().datetime(),
  source: z.enum(["healthkit", "health_connect", "synthetic_demo"]),
});
export type HerWearableDataPoint = z.infer<typeof herWearableDataPointSchema>;
export type HerWearableData = any;
export type HerCycle = any;
export type HerDailySymptom = any;
export type HerQuestionnaireResponse = any;
export type HerDoctorSummary = any;
export type SafetyCheckInput = any;
