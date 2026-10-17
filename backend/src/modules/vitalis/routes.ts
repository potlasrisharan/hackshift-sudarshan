/**
 * AyuSetu Vitalis — Longevity, Preventive Health & Healthspan Intelligence
 * Backend Module Routes (/api/v1/vitalis)
 * 
 * Implements deterministic safety, healthspan scoring, questionnaire branching,
 * biomarker intelligence, wearable sync, exercise/nutrition plans, and doctor summary export.
 */

import { Hono } from "hono";
import {
  vitalisSafetyGate,
  vitalisExerciseProgression,
  vitalisHealthspanIndex,
  vitalisBiomarkerTrends,
  vitalisRecommendationSelector,
  evaluateVO2maxRecord,
  vitalisRollingBaseline,
  vitalisSleepRegularity,
  vitalisDailyReadiness,
  vitalisFunctionalCapacity,
  vitalisIngestAndDeduplicate,
  vitalisPreventiveEligibility,
  vitalisBehaviorSimulator,
} from "../../../../packages/engine";
import {
  VitalisProfile,
  VitalisConsent,
  VitalisAssessment,
  VitalisObservation,
  VitalisDoctorSummary,
} from "../../../../packages/shared/vitalis_contracts";

export const vitalisRouter = new Hono();

// Standalone storage store for rapid testing and cloudflare worker runtime
const store = {
  profiles: new Map<string, VitalisProfile>(),
  consents: new Map<string, VitalisConsent>(),
  assessments: new Map<string, VitalisAssessment>(),
  observations: new Map<string, VitalisObservation[]>(),
  goals: new Map<string, any[]>(),
  summaries: new Map<string, VitalisDoctorSummary>(),
  auditLogs: [] as Array<{ patientId: string; action: string; timestamp: string; details: any }>,
};

function getPatientId(c: any): string {
  const header = c.req.header("X-Patient-Id") || c.req.header("x-patient-id");
  if (header) return header;
  const auth = c.req.header("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return "pat_" + auth.slice(7, 19).replace(/[^a-zA-Z0-9]/g, "");
  }
  return "demo_patient_vitalis";
}

function audit(patientId: string, action: string, details: any = {}) {
  store.auditLogs.push({
    patientId,
    action,
    timestamp: new Date().toISOString(),
    details,
  });
}

// ----------------------------------------------------
// 1. Overview & Dashboard Status
// ----------------------------------------------------
vitalisRouter.get("/overview", async (c) => {
  const patientId = getPatientId(c);
  let profile = store.profiles.get(patientId);
  if (!profile) {
    profile = {
      patientId,
      yearOfBirth: 1978,
      sex: "MALE",
      heightCm: 172,
      weightKg: 78,
      diagnosedConditions: ["Pre-diabetes"],
      medications: ["Metformin 500mg"],
      allergies: [],
      dietPreference: "vegetarian",
      activityLimitations: [],
      goals: ["cardio", "metabolic"],
      smokingStatus: "never",
      alcoholIntake: "none",
      clinicianRestrictedExertion: false,
      onboardingVersion: "2026.1",
    };
    store.profiles.set(patientId, profile);
  }

  const hpi = vitalisHealthspanIndex({
    domains: {
      physical_activity: { score: 72, observed: true },
      strength_mobility: { score: 65, observed: true },
      sleep_recovery: { score: 78, observed: true },
      nutrition_quality: { score: 80, observed: true },
      cardio_health: { score: 70, observed: true },
      metabolic_health: { score: 60, observed: true },
      preventive_care: { score: 85, observed: true },
      psychosocial_wellbeing: { score: 75, observed: true },
    },
  });

  const recs = vitalisRecommendationSelector({
    age: 2026 - profile.yearOfBirth,
    sex: profile.sex,
    diagnosedConditions: profile.diagnosedConditions,
    medications: profile.medications,
    dietPreference: profile.dietPreference,
    clinicianRestrictedExertion: profile.clinicianRestrictedExertion,
    primaryGoals: profile.goals,
  });

  return c.json({
    data: {
      profile,
      healthspanIndex: hpi,
      topRecommendations: recs.recommendedActions.slice(0, 3),
      dataCoverage: hpi.coverage,
      lastSyncTimestamp: new Date().toISOString(),
      syntheticDemo: true,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      algorithmVersion: "V1-HPI-2026.1",
    },
    warnings: [],
  });
});

// ----------------------------------------------------
// 2. Profile Management
// ----------------------------------------------------
vitalisRouter.get("/profile", async (c) => {
  const patientId = getPatientId(c);
  let profile = store.profiles.get(patientId);
  if (!profile) {
    profile = {
      patientId,
      yearOfBirth: 1985,
      sex: "OTHER",
      diagnosedConditions: [],
      medications: [],
      allergies: [],
      dietPreference: "vegetarian",
      activityLimitations: [],
      goals: ["energy", "sleep"],
      smokingStatus: "never",
      alcoholIntake: "none",
      clinicianRestrictedExertion: false,
      onboardingVersion: "2026.1",
    };
    store.profiles.set(patientId, profile);
  }
  return c.json({ data: profile });
});

vitalisRouter.put("/profile", async (c) => {
  const patientId = getPatientId(c);
  const body = (await c.req.json()) as VitalisProfile;
  const updated: VitalisProfile = {
    ...body,
    patientId,
    updatedAt: new Date().toISOString(),
  };
  store.profiles.set(patientId, updated);
  audit(patientId, "PROFILE_UPDATED", { yearOfBirth: updated.yearOfBirth });
  return c.json({ data: updated });
});

// ----------------------------------------------------
// 3. Adaptive Questionnaire (Q01-Q40)
// ----------------------------------------------------
vitalisRouter.get("/questionnaire", async (c) => {
  const questions = [
    { questionId: "Q01", section: "demographics", prompt: "Year of birth or date of birth?", type: "number", required: true },
    { questionId: "Q02", section: "anthropometrics", prompt: "Height (cm), weight (kg), and waist circumference?", type: "text", required: false },
    { questionId: "Q03", section: "goals", prompt: "Primary healthspan goals?", type: "multi", options: ["energy", "strength", "sleep", "cardio", "mobility", "metabolic", "preventive"], required: true },
    { questionId: "Q04", section: "conditions", prompt: "Diagnosed medical conditions?", type: "multi", options: ["diabetes", "hypertension", "cardiovascular", "ckd", "liver", "none", "unsure"], required: true },
    { questionId: "Q05", section: "medications", prompt: "Current daily medicines and supplements?", type: "text", required: false },
    { questionId: "Q08", section: "nutrition", prompt: "Primary dietary pattern?", type: "single", options: ["vegetarian", "vegan", "eggetarian", "mixed"], required: true },
    { questionId: "Q14", section: "physical_activity", prompt: "Weekly exercise days (0-7)?", type: "number", required: true },
    { questionId: "Q18", section: "safety_triage", prompt: "Any chest discomfort, unusual breathlessness, or dizziness during exertion?", type: "boolean", required: true },
    { questionId: "Q19", section: "safety_triage", prompt: "Has a doctor or clinician restricted vigorous physical activity?", type: "boolean", required: true },
    { questionId: "Q20", section: "sleep", prompt: "Typical nightly sleep duration (hours)?", type: "number", required: true },
    { questionId: "Q23", section: "sleep", prompt: "Observed loud snoring, gasping, or pauses in breathing during sleep?", type: "boolean", required: false },
    { questionId: "Q30", section: "functional", prompt: "Number of falls experienced in the past year?", type: "number", required: false },
    { questionId: "Q38", section: "urgent_safety", prompt: "Are you experiencing chest tightness, fainting, or acute severe pain right now?", type: "boolean", required: true },
    { questionId: "Q39", section: "consent", prompt: "Consent to connect wearable activity & recovery telemetry?", type: "boolean", required: true },
    { questionId: "Q40", section: "consent", prompt: "Consent to generate doctor-ready longitudinal summaries?", type: "boolean", required: true },
  ];

  return c.json({ data: questions, meta: { totalQuestions: questions.length, version: "1.0" } });
});

vitalisRouter.post("/assessments", async (c) => {
  const patientId = getPatientId(c);
  const id = "asmt_" + Math.random().toString(36).substring(2, 9);
  const assessment: VitalisAssessment = {
    id,
    patientId,
    questionnaireVersion: "1.0",
    status: "in_progress",
    answers: {},
    resultCategory: "wellness_plan_available",
    triageNotes: [],
    startedAt: new Date().toISOString(),
  };
  store.assessments.set(id, assessment);
  audit(patientId, "ASSESSMENT_STARTED", { id });
  return c.json({ data: assessment });
});

vitalisRouter.patch("/assessments/:id/answers", async (c) => {
  const id = c.req.param("id");
  const assessment = store.assessments.get(id);
  if (!assessment) return c.json({ error: "Assessment not found" }, 404);

  const body = await c.req.json();
  assessment.answers = { ...assessment.answers, ...body.answers };
  store.assessments.set(id, assessment);
  return c.json({ data: assessment });
});

vitalisRouter.post("/assessments/:id/complete", async (c) => {
  const id = c.req.param("id");
  const assessment = store.assessments.get(id);
  if (!assessment) return c.json({ error: "Assessment not found" }, 404);

  // Run V0 Safety Gate on answers
  const safety = vitalisSafetyGate({
    symptoms: {
      chestPain: assessment.answers["Q38"] === true || assessment.answers["Q18"] === true,
      fainting: assessment.answers["fainting"] === true,
    },
    diagnosedConditions: Array.isArray(assessment.answers["Q04"]) ? assessment.answers["Q04"] : [],
    clinicianRestrictedExertion: assessment.answers["Q19"] === true,
  });

  assessment.status = "completed";
  assessment.completedAt = new Date().toISOString();
  if (safety.decision === "URGENT_EVALUATION") {
    assessment.resultCategory = "urgent_evaluation";
    assessment.triageNotes = [safety.reason, safety.emergencyGuidance || ""];
  } else if (safety.decision === "BLOCKED" || safety.decision === "CLINICIAN_REVIEW") {
    assessment.resultCategory = "clinician_review";
    assessment.triageNotes = [safety.reason];
  } else {
    assessment.resultCategory = "wellness_plan_available";
  }

  store.assessments.set(id, assessment);
  audit(assessment.patientId, "ASSESSMENT_COMPLETED", { resultCategory: assessment.resultCategory });

  return c.json({ data: assessment, safety });
});

// ----------------------------------------------------
// 4. Biomarkers & Observations
// ----------------------------------------------------
vitalisRouter.get("/biomarkers/trends", async (c) => {
  const patientId = getPatientId(c);
  // Default synthetic longitudinal history for demo Persona A
  const hba1cPoints = [
    { dateUtc: "2025-10-15T09:00:00Z", value: 5.7, unit: "%" },
    { dateUtc: "2026-03-10T09:00:00Z", value: 5.9, unit: "%" },
    { dateUtc: "2026-08-20T09:00:00Z", value: 6.1, unit: "%" },
  ];

  const trend = vitalisBiomarkerTrends("hba1c", hba1cPoints);
  return c.json({ data: trend });
});

// ----------------------------------------------------
// 5. Cardiorespiratory Fitness & VO2max
// ----------------------------------------------------
vitalisRouter.get("/fitness/cardio", async (c) => {
  const record = {
    vo2MaxMlKgMin: 38.5,
    recordedDate: "2026-10-12",
    sourceType: "wearable_estimated" as const,
    device: "Apple Watch Series 9",
    method: "Submaximal GPS Outdoor Walk Estimation",
    uncertaintyMargin: 2.5,
  };

  const evalResult = evaluateVO2maxRecord(record, 48);
  return c.json({ data: evalResult });
});

// ----------------------------------------------------
// 6. Wearables & Telemetry Baselines
// ----------------------------------------------------
vitalisRouter.get("/wearables/connections", async (c) => {
  const patientId = getPatientId(c);
  return c.json({
    data: {
      patientId,
      appleHealthConnected: true,
      healthConnectConnected: false,
      lastSyncTime: new Date().toISOString(),
      syncedMetrics: ["steps", "resting_hr", "hrv_rmssd", "sleep_intervals"],
      isSyntheticDemo: true,
    },
  });
});

vitalisRouter.post("/wearables/sync", async (c) => {
  const patientId = getPatientId(c);
  const body = (await c.req.json()) as { samples: any[] };
  const result = vitalisIngestAndDeduplicate(body.samples || []);
  audit(patientId, "WEARABLES_SYNCED", { sampleCount: result.deduplicatedSamples.length });
  return c.json({ data: result });
});

vitalisRouter.get("/readiness", async (c) => {
  const readiness = vitalisDailyReadiness({
    hrvZScore: 0.4,
    restingHrZScore: -0.2,
    sleepEfficiencyPercent: 86,
    sleepRegularityScore: 82,
    subjectiveFatigue: 3,
  });
  return c.json({ data: readiness });
});

vitalisRouter.get("/healthspan-index", async (c) => {
  const hpi = vitalisHealthspanIndex({
    domains: {
      physical_activity: { score: 75, observed: true },
      strength_mobility: { score: 68, observed: true },
      sleep_recovery: { score: 82, observed: true },
      nutrition_quality: { score: 85, observed: true },
      cardio_health: { score: 72, observed: true },
      metabolic_health: { score: 62, observed: true },
      preventive_care: { score: 90, observed: true },
      psychosocial_wellbeing: { score: 78, observed: true },
    },
  });
  return c.json({ data: hpi });
});

// ----------------------------------------------------
// 7. Activity & Nutrition Plans
// ----------------------------------------------------
vitalisRouter.get("/plans/exercise", async (c) => {
  const patientId = getPatientId(c);
  const profile = store.profiles.get(patientId);
  const progression = vitalisExerciseProgression({
    currentWeeklyMinutes: 90,
    adherencePercentage: 80,
    recentFatigueRating: 2,
    symptomsReported: false,
    clinicianRestricted: profile?.clinicianRestrictedExertion ?? false,
    hasCardiovascularCondition: (profile?.diagnosedConditions ?? []).some((condition) =>
      /cardio|heart|coronary|hypertension/i.test(condition),
    ),
  });
  const plan = {
    id: "plan_ex_01",
    patientId,
    weeklyAerobicMinutesTarget: progression.nextTargetMinutes,
    weeklyStrengthSessionsTarget: 2,
    recommendedActivities: ["Brisk Walking", "Bodyweight Squats", "Surya Namaskar"],
    contraindicatedActivities: ["Unsupervised HIIT 4x4"],
    intensityLevel: progression.intensityCap,
    yogaAndMobilityRoutine: [],
    policyVersion: "V3-EX-2026.1",
    progressionAction: progression.action,
    safetyStatus: progression.action === "CLINICAL_HOLD" ? "REVIEW" : "ALLOWED",
    safetyNotes: [progression.reason],
    syntheticDemo: true,
  };
  return c.json({ data: plan });
});

vitalisRouter.get("/plans/nutrition", async (c) => {
  const patientId = getPatientId(c);
  const plan = {
    id: "plan_nut_01",
    patientId,
    dietPreference: "vegetarian",
    keyFoods: [
      { foodName: "Moong & Chana Dal", hindiName: "मूंग व चना दाल", category: "Pulses", proteinGramsPer100g: 24, fiberGramsPer100g: 16, benefits: "High satiety, slow glycemic release" },
      { foodName: "Roasted Makhana", hindiName: "मखाना", category: "Snacks", proteinGramsPer100g: 9.7, fiberGramsPer100g: 14.5, benefits: "Low glycemic index, rich in magnesium" },
      { foodName: "Desi Curd / Dahi", hindiName: "दही", category: "Fermented Dairy", proteinGramsPer100g: 11, fiberGramsPer100g: 0, benefits: "Probiotic gut microbiome diversity" },
      { foodName: "Palak (Spinach)", hindiName: "पालक", category: "Greens", proteinGramsPer100g: 2.9, fiberGramsPer100g: 2.2, benefits: "Rich in folate and natural nitrates" },
    ],
    exclusions: ["Excess refined sugars", "Deep-fried savories"],
    guidelines: [
      "Aim for 20g protein per main meal using combinations of dal and paneer/tofu.",
      "Incorporate whole grains like bajra, jowar, or ragi to increase dietary fiber.",
    ],
    herbalCautionNotes: [
      "Ashwagandha and herbal decoctions have variable liver/thyroid interactions; use only after clinician review.",
    ],
  };
  return c.json({ data: plan });
});

vitalisRouter.get("/recommendations", async (c) => {
  const patientId = getPatientId(c);
  const profile = store.profiles.get(patientId) || {
    patientId,
    yearOfBirth: 1978,
    sex: "MALE",
    diagnosedConditions: ["Pre-diabetes"],
    medications: [],
    dietPreference: "vegetarian",
    clinicianRestrictedExertion: false,
    goals: ["cardio", "metabolic"],
  };

  const recs = vitalisRecommendationSelector({
    age: 2026 - (profile.yearOfBirth || 1978),
    sex: profile.sex || "OTHER",
    diagnosedConditions: profile.diagnosedConditions || [],
    medications: profile.medications || [],
    dietPreference: profile.dietPreference as any,
    clinicianRestrictedExertion: profile.clinicianRestrictedExertion || false,
    primaryGoals: profile.goals || [],
  });

  return c.json({ data: recs });
});

// ----------------------------------------------------
// 8. Preventive Care Timeline
// ----------------------------------------------------
vitalisRouter.get("/preventive-care", async (c) => {
  const patientId = getPatientId(c);
  const profile = store.profiles.get(patientId);
  const age = profile ? 2026 - profile.yearOfBirth : 48;

  const items = vitalisPreventiveEligibility({
    age,
    sex: (profile?.sex as any) || "MALE",
    diagnosedConditions: profile?.diagnosedConditions || ["Pre-diabetes"],
    familyHistory: ["diabetes"],
    lastCompletedDates: {
      "PREV-BLOOD-PRESSURE": "2026-04-10",
      "PREV-DIABETES-HBA1C": "2025-08-15",
    },
  });

  return c.json({ data: items });
});

// ----------------------------------------------------
// 9. Behavior What-If Simulator
// ----------------------------------------------------
vitalisRouter.post("/scenarios/simulate", async (c) => {
  const body = await c.req.json();
  const sim = vitalisBehaviorSimulator({
    currentDailySteps: body.currentDailySteps || 3500,
    currentWeeklyStrengthSessions: body.currentWeeklyStrengthSessions || 0,
    currentSleepHours: body.currentSleepHours || 6.2,
    simulatedExtraWalkMinutes: body.simulatedExtraWalkMinutes || 30,
    simulatedExtraStrengthSessions: body.simulatedExtraStrengthSessions || 2,
    simulatedEarlierBedtimeMinutes: body.simulatedEarlierBedtimeMinutes || 30,
  });
  return c.json({ data: sim });
});

// ----------------------------------------------------
// 10. Evidence-Grounded AI Copilot
// ----------------------------------------------------
vitalisRouter.post("/copilot/chat", async (c) => {
  const patientId = getPatientId(c);
  const body = (await c.req.json()) as { message: string };
  const userMsg = (body.message || "").toLowerCase();

  let reply = "I can explain your biomarker trends, summarize exercise targets, or review Indian nutrition ideas based on clinical guidelines.";
  const citations = ["AHA Life's Essential 8 (2022)", "WHO Guidelines on Physical Activity and Sedentary Behaviour (2020)"];

  if (userMsg.includes("hba1c") || userMsg.includes("sugar") || userMsg.includes("glucose")) {
    reply = "Your latest recorded HbA1c is 6.1% (August 2026), indicating a pre-diabetes range. This reflects a three-month average glucose concentration. Guidelines recommend dietary fiber, daily brisk walking, and periodic re-testing every 6 to 12 months in consultation with your doctor.";
    citations.push("ICMR-INDIAB Clinical Guidance for Type 2 Diabetes");
  } else if (userMsg.includes("walk") || userMsg.includes("exercise") || userMsg.includes("step")) {
    reply = "Your current activity plan recommends 150 minutes of moderate aerobic activity weekly (such as 30 minutes of brisk walking 5 days a week) alongside 2 bodyweight strength sessions. Avoid sudden unaccustomed vigorous exertion.";
  }

  audit(patientId, "COPILOT_QUERY", { query: body.message });

  return c.json({
    data: {
      reply,
      citations,
      disclaimer: "Informational summary grounded in medical guidelines. Not an individual diagnosis or prescription.",
    },
  });
});

// ----------------------------------------------------
// 11. Doctor-Ready Longitudinal Summary & Export
// ----------------------------------------------------
vitalisRouter.get("/doctor-summary", async (c) => {
  const patientId = getPatientId(c);
  const profile = store.profiles.get(patientId);
  const age = profile ? 2026 - profile.yearOfBirth : 48;

  const summary: VitalisDoctorSummary = {
    id: "sum_" + Math.random().toString(36).substring(2, 9),
    patientId,
    generatedAt: new Date().toISOString(),
    patientSummary: {
      age,
      sex: profile?.sex || "MALE",
      bmi: profile?.heightCm && profile?.weightKg ? Number((profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1)) : 26.4,
      knownConditions: profile?.diagnosedConditions || ["Pre-diabetes"],
      currentMedications: profile?.medications || ["Metformin 500mg"],
    },
    safetyFlags: [],
    biomarkerTrends: [
      { metric: "HbA1c", baseline: "5.7%", latest: "6.1%", delta: "+0.4%", status: "PRE_DIABETES_RANGE" },
      { metric: "Blood Pressure", baseline: "128/82 mmHg", latest: "126/80 mmHg", delta: "-2 mmHg", status: "STAGE_1_SYS_ELEVATED" },
    ],
    wearableBaseline: {
      meanRestingHr: 62,
      meanHrvRmssd: 48,
      dailyStepsAverage: 6800,
      sleepAverageHours: 7.1,
    },
    preventiveStatus: [
      { item: "HbA1c Screening", status: "DUE_FOR_REVIEW" },
      { item: "Blood Pressure Check", status: "COMPLETED" },
    ],
    algorithmVersions: {
      safetyGate: "V0-SAFETY-2026.1",
      healthspanIndex: "V1-HPI-2026.1",
      ranker: "V2-RANKER-2026.1",
    },
    shareToken: "vit_share_" + Math.random().toString(36).substring(2, 10),
    isClinicianConfirmed: false,
    disclaimer: "Patient-authorized longitudinal telemetry & clinical records summary. Not machine-diagnosed.",
  };

  store.summaries.set(summary.id, summary);
  audit(patientId, "DOCTOR_SUMMARY_VIEWED", { id: summary.id });

  return c.json({ data: summary });
});

vitalisRouter.post("/doctor-summary/export", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  audit(patientId, "DOCTOR_SUMMARY_EXPORTED", { format: body.format || "pdf" });
  return c.json({
    data: {
      exportUrl: `https://ayusetu.health/api/v1/vitalis/exports/${patientId}_summary.pdf`,
      downloadExpiresInMinutes: 30,
      message: "Clinician summary generated successfully.",
    },
  });
});

// ----------------------------------------------------
// 12. Consents Management
// ----------------------------------------------------
vitalisRouter.get("/consents", async (c) => {
  const patientId = getPatientId(c);
  let consent = store.consents.get(patientId);
  if (!consent) {
    consent = {
      patientId,
      vitalisHealthData: true,
      wearableSync: true,
      clinicianSharing: false,
      researchAnonymized: false,
      herMenstrualSharing: false, // Explicit opt-in required
      grantedAt: new Date().toISOString(),
    };
    store.consents.set(patientId, consent);
  }
  return c.json({ data: consent });
});

vitalisRouter.post("/consents", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  const existing = store.consents.get(patientId) || {
    patientId,
    vitalisHealthData: true,
    wearableSync: true,
    clinicianSharing: false,
    researchAnonymized: false,
    herMenstrualSharing: false,
  };
  const updated: VitalisConsent = {
    ...existing,
    ...body,
    patientId,
    grantedAt: new Date().toISOString(),
  };
  store.consents.set(patientId, updated);
  audit(patientId, "CONSENT_UPDATED", body);
  return c.json({ data: updated });
});
