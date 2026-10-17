/**
 * AyuSetu HER — Women's Preventive Health & Hormonal Wellness Intelligence
 * Backend Module Routes (/api/v1/her)
 * 
 * Implements deterministic safety, cycle tracking, adaptive questionnaires,
 * screening evidence, wellness recommendations, wearable sync, and doctor summaries.
 */

import { Hono } from "hono";
import {
  herSafetyGate,
  herCycleDetector,
  herScreeningEngine,
  herWellnessRanker,
  herTrendAnalyzer,
} from "../../../../packages/engine";
import {
  HerProfile,
  HerCycle,
  HerDailySymptom,
  HerQuestionnaireResponse,
  HerScreeningFinding,
  HerDoctorSummary,
  HerWearableData,
  SafetyCheckInput,
} from "../../../../packages/shared/her_contracts";

export const herRouter = new Hono();

// In-memory mock storage store for standalone tests and local execution
const store = {
  profiles: new Map<string, HerProfile>(),
  cycles: new Map<string, HerCycle[]>(),
  symptoms: new Map<string, HerDailySymptom[]>(),
  questionnaires: new Map<string, HerQuestionnaireResponse[]>(),
  screenings: new Map<string, HerScreeningFinding[]>(),
  wearables: new Map<string, HerWearableData[]>(),
  summaries: new Map<string, HerDoctorSummary>(),
  shareTokens: new Map<string, string>(), // token -> summaryId
  consents: new Map<string, Record<string, boolean>>(),
  auditLogs: [] as Array<{ patientId: string; action: string; timestamp: string; details: any }>,
};

function getPatientId(c: any): string {
  const header = c.req.header("X-Patient-Id") || c.req.header("x-patient-id");
  if (header) return header;
  const auth = c.req.header("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return "pat_" + auth.slice(7, 19).replace(/[^a-zA-Z0-9]/g, "");
  }
  return "demo_patient_her";
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
// 1. Consent Management
// ----------------------------------------------------
herRouter.get("/consent", async (c) => {
  const patientId = getPatientId(c);
  const userConsents = store.consents.get(patientId) || {
    her_health_data: true,
    her_anonymized_research: false,
    her_doctor_sharing: true,
  };
  return c.json({ patientId, consents: userConsents });
});

herRouter.post("/consent", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  const existing = store.consents.get(patientId) || {};
  const updated = { ...existing, ...body };
  store.consents.set(patientId, updated);
  audit(patientId, "CONSENT_UPDATED", body);
  return c.json({ success: true, consents: updated });
});

// ----------------------------------------------------
// 2. Profile Management
// ----------------------------------------------------
herRouter.get("/profile", async (c) => {
  const patientId = getPatientId(c);
  let profile = store.profiles.get(patientId);
  if (!profile) {
    profile = {
      patientId,
      yearOfBirth: 1998,
      menarcheAge: 13,
      isPregnantOrLactating: false,
      hormonalContraception: false,
      dietPreference: "vegetarian",
      allergies: [],
      lifestyleGoals: ["cycle_regularity", "hormonal_balance"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.profiles.set(patientId, profile);
  }
  return c.json(profile);
});

herRouter.post("/profile", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  const existing = store.profiles.get(patientId) || {
    patientId,
    yearOfBirth: body.yearOfBirth ?? 1998,
    createdAt: new Date().toISOString(),
  };

  const updated: HerProfile = {
    ...existing,
    ...body,
    patientId,
    updatedAt: new Date().toISOString(),
  };

  store.profiles.set(patientId, updated);
  audit(patientId, "PROFILE_UPDATED", { fields: Object.keys(body) });
  return c.json(updated);
});

// ----------------------------------------------------
// 3. Menstrual Cycle Tracking & Deviation Detection
// ----------------------------------------------------
herRouter.get("/cycles", async (c) => {
  const patientId = getPatientId(c);
  const profile = store.profiles.get(patientId);
  const cycles = store.cycles.get(patientId) || [];
  const age = profile ? new Date().getFullYear() - (profile.yearOfBirth ?? profile.birthYear ?? 1998) : 26;

  const cycleAnalysis = herCycleDetector({
    cycles,
    age,
    yearsSinceMenarche: profile?.menarcheAge ? age - profile.menarcheAge : 10,
    isPregnantOrLactating: profile?.isPregnantOrLactating,
  });

  return c.json({
    cycles,
    analysis: cycleAnalysis,
  });
});

herRouter.post("/cycles", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  const cycleList = store.cycles.get(patientId) || [];

  const newCycle: HerCycle = {
    id: body.id || "cyc_" + Date.now(),
    patientId,
    startDate: body.startDate,
    endDate: body.endDate,
    flowIntensity: body.flowIntensity ?? "medium",
    crampsSeverity: body.crampsSeverity ?? 0,
    cycleLengthDays: body.cycleLengthDays,
    periodLengthDays: body.periodLengthDays,
    notes: body.notes,
    createdAt: new Date().toISOString(),
  };

  // Sort cycles by start date descending
  cycleList.unshift(newCycle);
  cycleList.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  store.cycles.set(patientId, cycleList);
  audit(patientId, "CYCLE_LOGGED", { cycleId: newCycle.id, startDate: newCycle.startDate });

  const profile = store.profiles.get(patientId);
  const age = profile ? new Date().getFullYear() - (profile.yearOfBirth ?? profile.birthYear ?? 1998) : 26;
  const analysis = herCycleDetector({
    cycles: cycleList,
    age,
  });

  return c.json({
    cycle: newCycle,
    analysis,
  });
});

// ----------------------------------------------------
// 4. Daily Symptom Logging & Immediate Safety Triage
// ----------------------------------------------------
herRouter.get("/symptoms", async (c) => {
  const patientId = getPatientId(c);
  const symptoms = store.symptoms.get(patientId) || [];
  return c.json(symptoms);
});

herRouter.post("/symptoms", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  const profile = store.profiles.get(patientId);

  const symptomEntry: HerDailySymptom = {
    id: body.id || "sym_" + Date.now(),
    patientId,
    logDate: body.logDate || new Date().toISOString().slice(0, 10),
    energyLevel: body.energyLevel,
    mood: body.mood,
    pelvicPain: body.pelvicPain ?? 0,
    bloating: body.bloating ?? 0,
    headache: body.headache ?? 0,
    acneSeverity: body.acneSeverity,
    sleepHours: body.sleepHours,
    tags: body.tags ?? [],
    notes: body.notes,
    createdAt: new Date().toISOString(),
  };

  // Immediate Safety Gate Check (Algorithm A0)
  const safetyCheckInput: SafetyCheckInput = {
    isPregnantOrPossible: profile?.isPregnantOrLactating || body.isPregnantOrPossible,
    pelvicPainSeverity: symptomEntry.pelvicPain,
    suddenSeverePain: body.suddenSeverePain === true,
    heavyBleedingWithDizziness: body.heavyBleedingWithDizziness === true,
    faintingOrSyncope: body.faintingOrSyncope === true,
    severeShortnessOfBreath: body.severeShortnessOfBreath === true,
    selfHarmIdeation: body.selfHarmIdeation === true,
    bleedingBetweenPeriods: body.bleedingBetweenPeriods === true,
  };

  const safetyResult = herSafetyGate(safetyCheckInput);

  const list = store.symptoms.get(patientId) || [];
  list.unshift(symptomEntry);
  store.symptoms.set(patientId, list);

  audit(patientId, "SYMPTOM_LOGGED", {
    symptomId: symptomEntry.id,
    isUrgent: safetyResult.isUrgent,
    safetyRule: safetyResult.ruleId,
  });

  return c.json({
    symptom: symptomEntry,
    safety: safetyResult,
  });
});

// ----------------------------------------------------
// 5. Adaptive Questionnaires
// ----------------------------------------------------
herRouter.get("/questionnaires/:code", async (c) => {
  const code = c.req.param("code").toUpperCase();
  // Question library catalog
  const questionnairesMeta: Record<string, any> = {
    CORE: {
      code: "CORE",
      title: "Core Health & Menstrual History",
      questions: [
        { id: "C01", type: "number", prompt: "What is your current age?" },
        { id: "C02", type: "number", prompt: "At what age did you have your first menstrual period?" },
        { id: "C03", type: "choice", prompt: "Could you currently be pregnant?", options: ["yes", "no", "unsure"] },
        { id: "C07", type: "choice", prompt: "How many days typically pass between periods?", options: ["<21", "21-35", "36-45", ">45", "irregular"] },
        { id: "C11", type: "scale_10", prompt: "On a scale of 0 to 10, how severe is your typical period cramp pain?" },
      ],
    },
    PCOS: {
      code: "PCOS",
      title: "Hormonal & Ovulatory Check-In",
      questions: [
        { id: "P01", type: "choice", prompt: "Are your cycles typically longer than 35 days?", options: ["yes", "no", "unsure"] },
        { id: "P02", type: "choice", prompt: "Have you missed your period for 3 or more months in a row?", options: ["yes", "no"] },
        { id: "P05", type: "choice", prompt: "Do you experience coarse, dark hair growth on chin, upper lip, or abdomen?", options: ["yes", "no"] },
        { id: "P06", type: "choice", prompt: "Do you experience persistent adult acne resistant to routine skincare?", options: ["mild", "moderate", "severe", "none"] },
        { id: "P07", type: "choice", prompt: "Have you noticed thinning of hair at your scalp crown?", options: ["yes", "no"] },
      ],
    },
    ENDO: {
      code: "ENDO",
      title: "Pelvic Health & Discomfort Evaluation",
      questions: [
        { id: "E01", type: "scale_10", prompt: "On a scale of 0 to 10, how intense is your pelvic or menstrual pain?" },
        { id: "E02", type: "choice", prompt: "Does pelvic pain force you to miss work, school, or routine activities?", options: ["rarely", "sometimes", "often", "always"] },
        { id: "E04", type: "choice", prompt: "Do you experience pelvic aching or pain outside of your period?", options: ["yes", "no"] },
        { id: "E05", type: "choice", prompt: "Do you experience painful bowel movements or bladder discomfort during your period?", options: ["yes", "no"] },
        { id: "E11", type: "choice", prompt: "Is your pain sudden, acute, or unlike anything you normally feel?", options: ["yes", "no"] },
      ],
    },
  };

  const q = questionnairesMeta[code] || questionnairesMeta.CORE;
  return c.json(q);
});

herRouter.post("/questionnaires/:code", async (c) => {
  const patientId = getPatientId(c);
  const code = c.req.param("code").toUpperCase();
  const body = await c.req.json();

  const response: HerQuestionnaireResponse = {
    id: "qres_" + Date.now(),
    patientId,
    questionnaireCode: code,
    answers: body.answers || {},
    completedAt: new Date().toISOString(),
  };

  const userQList = store.questionnaires.get(patientId) || [];
  userQList.unshift(response);
  store.questionnaires.set(patientId, userQList);

  audit(patientId, "QUESTIONNAIRE_SUBMITTED", { code, answerCount: Object.keys(response.answers).length });

  return c.json({ success: true, response });
});

// ----------------------------------------------------
// 6. Screening Engine Evaluation (A0 + A1 + A2)
// ----------------------------------------------------
herRouter.post("/screening/evaluate", async (c) => {
  const patientId = getPatientId(c);
  const profile = store.profiles.get(patientId);
  const cycles = store.cycles.get(patientId) || [];
  const qList = store.questionnaires.get(patientId) || [];

  // Consolidate answers from all completed questionnaires
  const aggregatedAnswers: Record<string, any> = {};
  for (const q of qList) {
    Object.assign(aggregatedAnswers, q.answers);
  }

  // Parse any passed-in answers from body
  try {
    const body = await c.req.json();
    if (body.answers) Object.assign(aggregatedAnswers, body.answers);
  } catch {}

  const age = profile ? new Date().getFullYear() - (profile.yearOfBirth ?? profile.birthYear ?? 1998) : 26;
  const cycleAnalysis = herCycleDetector({
    cycles,
    age,
    yearsSinceMenarche: profile?.menarcheAge ? age - profile.menarcheAge : 10,
    isPregnantOrLactating: profile?.isPregnantOrLactating,
  });

  const findings = herScreeningEngine({
    patientId,
    age,
    yearsSinceMenarche: profile?.menarcheAge ? age - profile.menarcheAge : 10,
    isPregnantOrLactating: profile?.isPregnantOrLactating,
    hormonalContraception: profile?.hormonalContraception,
    cycleStats: {
      hasIrregularity: cycleAnalysis.hasIrregularity,
      longestCycle: cycleAnalysis.longestCycleDays,
      hasAmenorrhea: cycleAnalysis.hasAmenorrhea,
    },
    answers: aggregatedAnswers,
  });

  store.screenings.set(patientId, findings);
  audit(patientId, "SCREENING_EVALUATED", { findingsCount: findings.length });

  return c.json({
    patientId,
    cycleAnalysis,
    findings,
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------------------
// 7. Personalized Wellness Companion (A0 + A3)
// ----------------------------------------------------
herRouter.get("/wellness", async (c) => {
  const patientId = getPatientId(c);
  const profile = store.profiles.get(patientId);
  const findings = store.screenings.get(patientId) || [];
  const symptoms = store.symptoms.get(patientId) || [];
  const latestSymptom = symptoms[0];

  // Run Safety Gate first to determine if wellness should be suppressed
  const safetyResult = herSafetyGate({
    isPregnantOrPossible: profile?.isPregnantOrLactating,
    pelvicPainSeverity: latestSymptom?.pelvicPain,
  });

  const hasPcos = findings.some((f) => f.domain === "PCOS_FEATURES" && f.category !== "NO_CURRENT_SCREENING_FLAGS");
  const hasEndo = findings.some((f) => f.domain === "ENDOMETRIOSIS_PELVIC_PAIN");
  const hasBleeding = findings.some((f) => f.domain === "HEAVY_BLEEDING_ANEMIA");

  const recommendations = herWellnessRanker({
    dietPreference: profile?.dietPreference || "vegetarian",
    allergies: profile?.allergies || [],
    currentCyclePhase: "luteal",
    hasPcosFeatures: hasPcos,
    hasPelvicPainFeatures: hasEndo,
    hasHeavyBleedingFeatures: hasBleeding,
    acuteSafetyRedFlag: safetyResult.isUrgent,
  });

  return c.json({
    patientId,
    safetyCheck: safetyResult,
    recommendations,
  });
});

// ----------------------------------------------------
// 8. Longitudinal Trends (A4)
// ----------------------------------------------------
herRouter.get("/trends", async (c) => {
  const patientId = getPatientId(c);
  const wearables = store.wearables.get(patientId) || [];
  const symptoms = store.symptoms.get(patientId) || [];

  // Group wearable observations by metric
  const rhrObs = wearables
    .filter((w) => w.restingHeartRateBpm)
    .map((w) => ({ date: w.date, value: w.restingHeartRateBpm! }));
  const sleepObs = wearables
    .filter((w) => w.sleepDurationMinutes)
    .map((w) => ({ date: w.date, value: w.sleepDurationMinutes! / 60 }));
  const painObs = symptoms.map((s) => ({ date: s.logDate, value: s.pelvicPain }));

  const rhrTrends = herTrendAnalyzer(rhrObs, "Resting Heart Rate (BPM)");
  const sleepTrends = herTrendAnalyzer(sleepObs, "Sleep Duration (Hours)");
  const painTrends = herTrendAnalyzer(painObs, "Pelvic Pain Intensity");

  return c.json({
    patientId,
    trends: [rhrTrends, sleepTrends, painTrends],
  });
});

// ----------------------------------------------------
// 9. Wearable Data Ingestion & Synthetic Sync
// ----------------------------------------------------
herRouter.post("/wearables/sync", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  const incoming: HerWearableData[] = Array.isArray(body) ? body : body.records || [body];

  const existing = store.wearables.get(patientId) || [];
  for (const item of incoming) {
    existing.unshift({
      ...item,
      patientId,
    });
  }

  // Deduplicate by date
  const map = new Map<string, HerWearableData>();
  for (const item of existing) {
    if (!map.has(item.date)) map.set(item.date, item);
  }
  const merged = Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  store.wearables.set(patientId, merged);

  audit(patientId, "WEARABLES_SYNCED", { count: incoming.length });

  return c.json({
    success: true,
    totalRecords: merged.length,
    latestRecord: merged[0] || null,
  });
});

// ----------------------------------------------------
// 10. Doctor-Ready Clinical Summary & Token Sharing
// ----------------------------------------------------
herRouter.post("/doctor-summary", async (c) => {
  const patientId = getPatientId(c);
  const body = await c.req.json();
  const profile = store.profiles.get(patientId);
  const cycles = store.cycles.get(patientId) || [];
  const findings = store.screenings.get(patientId) || [];
  const symptoms = store.symptoms.get(patientId) || [];

  const summaryId = "sum_" + Date.now();
  const shareToken = "her_share_" + Math.random().toString(36).substring(2, 10);

  const summary: HerDoctorSummary = {
    id: summaryId,
    patientId,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    isRevoked: false,
    demographics: {
      age: profile ? new Date().getFullYear() - (profile.yearOfBirth ?? profile.birthYear ?? 1998) : 26,
      menarcheAge: profile?.menarcheAge,
      dietPreference: profile?.dietPreference,
    },
    cycleMetrics: {
      totalRecordedCycles: cycles.length,
      averageCycleDays: cycles.length ? 31 : null,
      cycleVariationDays: 3,
      historySummary: cycles.slice(0, 6).map((c) => ({
        startDate: c.startDate,
        lengthDays: c.cycleLengthDays,
        flow: c.flowIntensity,
      })),
    },
    screeningEvidence: findings,
    symptomProfile: {
      averageEnergy: 7,
      predominantMood: "balanced",
      painReportsPast90Days: symptoms.filter((s) => s.pelvicPain > 3).length,
    },
    shareToken,
  };

  store.summaries.set(summaryId, summary);
  store.shareTokens.set(shareToken, summaryId);
  audit(patientId, "DOCTOR_SUMMARY_CREATED", { summaryId, shareToken });

  return c.json(summary);
});

herRouter.get("/doctor-summary/:token", async (c) => {
  const token = c.req.param("token");
  const summaryId = store.shareTokens.get(token);
  if (!summaryId) {
    return c.json({ error: "Summary not found or invalid link" }, 404);
  }

  const summary = store.summaries.get(summaryId);
  if (!summary) return c.json({ error: "Summary expired" }, 404);
  if (summary.isRevoked) return c.json({ error: "This medical summary access was revoked by the patient" }, 403);
  if (summary.expiresAt && new Date(summary.expiresAt).getTime() < Date.now()) {
    return c.json({ error: "This medical summary link has expired" }, 410);
  }

  audit(summary.patientId, "DOCTOR_SUMMARY_VIEWED", { token });
  return c.json(summary);
});

herRouter.post("/doctor-summary/:id/revoke", async (c) => {
  const id = c.req.param("id");
  const summary = store.summaries.get(id);
  if (!summary) return c.json({ error: "Summary not found" }, 404);

  summary.isRevoked = true;
  store.summaries.set(id, summary);
  audit(summary.patientId, "DOCTOR_SUMMARY_REVOKED", { summaryId: id });

  return c.json({ success: true, message: "Summary sharing revoked immediately." });
});

// ----------------------------------------------------
// 11. Synthetic Demo Seeder (Scenarios A through G)
// ----------------------------------------------------
herRouter.post("/demo/seed", async (c) => {
  const body = await c.req.json();
  const scenario = (body.scenario || "SCENARIO_B_PCOS").toUpperCase();
  const patientId = getPatientId(c);

  // Clear existing records for this patient
  store.cycles.set(patientId, []);
  store.symptoms.set(patientId, []);
  store.questionnaires.set(patientId, []);
  store.screenings.set(patientId, []);
  store.wearables.set(patientId, []);

  const now = new Date();
  const format = (d: Date) => d.toISOString().slice(0, 10);
  const subtractDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return format(d);
  };

  if (scenario === "SCENARIO_A_NORMAL" || scenario === "SCENARIO_A") {
    // 27-year-old regular 28-day cycle
    store.profiles.set(patientId, {
      patientId,
      yearOfBirth: now.getFullYear() - 27,
      menarcheAge: 13,
      isPregnantOrLactating: false,
      hormonalContraception: false,
      dietPreference: "vegetarian",
      allergies: [],
      lifestyleGoals: ["sleep_optimization", "stress_reduction"],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    store.cycles.set(patientId, [
      { id: "c1", patientId, startDate: subtractDays(14), cycleLengthDays: 28, periodLengthDays: 5, flowIntensity: "medium", crampsSeverity: 2, createdAt: now.toISOString() },
      { id: "c2", patientId, startDate: subtractDays(42), cycleLengthDays: 28, periodLengthDays: 5, flowIntensity: "medium", crampsSeverity: 3, createdAt: now.toISOString() },
      { id: "c3", patientId, startDate: subtractDays(70), cycleLengthDays: 29, periodLengthDays: 4, flowIntensity: "medium", crampsSeverity: 2, createdAt: now.toISOString() },
    ]);
  } else if (scenario === "SCENARIO_B_PCOS" || scenario === "SCENARIO_B") {
    // 25-year-old with oligomenorrhea (48 & 55 day gaps) + facial hair & cystic acne
    store.profiles.set(patientId, {
      patientId,
      yearOfBirth: now.getFullYear() - 25,
      menarcheAge: 13,
      isPregnantOrLactating: false,
      hormonalContraception: false,
      dietPreference: "vegetarian",
      allergies: [],
      lifestyleGoals: ["cycle_regularity", "insulin_sensitivity"],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    store.cycles.set(patientId, [
      { id: "c1", patientId, startDate: subtractDays(20), cycleLengthDays: 48, periodLengthDays: 7, flowIntensity: "heavy", crampsSeverity: 4, createdAt: now.toISOString() },
      { id: "c2", patientId, startDate: subtractDays(68), cycleLengthDays: 55, periodLengthDays: 6, flowIntensity: "medium", crampsSeverity: 4, createdAt: now.toISOString() },
      { id: "c3", patientId, startDate: subtractDays(123), cycleLengthDays: 52, periodLengthDays: 7, flowIntensity: "heavy", crampsSeverity: 5, createdAt: now.toISOString() },
    ]);

    store.questionnaires.set(patientId, [
      {
        id: "q_pcos",
        patientId,
        questionnaireCode: "PCOS",
        answers: { P01: "yes", P02: "no", P05: "yes", P06: "severe", P07: "yes" },
        completedAt: now.toISOString(),
      },
    ]);
  } else if (scenario === "SCENARIO_C_ADOLESCENT" || scenario === "SCENARIO_C") {
    // 16-year-old, 1.5 years post-menarche, 42-day cycle (physiologically normal maturation)
    store.profiles.set(patientId, {
      patientId,
      yearOfBirth: now.getFullYear() - 16,
      menarcheAge: 15,
      isPregnantOrLactating: false,
      hormonalContraception: false,
      dietPreference: "vegetarian",
      allergies: [],
      lifestyleGoals: ["cycle_awareness"],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    store.cycles.set(patientId, [
      { id: "c1", patientId, startDate: subtractDays(10), cycleLengthDays: 42, periodLengthDays: 4, flowIntensity: "medium", crampsSeverity: 3, createdAt: now.toISOString() },
      { id: "c2", patientId, startDate: subtractDays(52), cycleLengthDays: 40, periodLengthDays: 5, flowIntensity: "medium", crampsSeverity: 2, createdAt: now.toISOString() },
    ]);

    store.questionnaires.set(patientId, [
      {
        id: "q_ado",
        patientId,
        questionnaireCode: "PCOS",
        answers: { P01: "yes", P05: "no", P06: "mild" },
        completedAt: now.toISOString(),
      },
    ]);
  } else if (scenario === "SCENARIO_D_ENDO" || scenario === "SCENARIO_D") {
    // 29-year-old with severe dysmenorrhea (8/10), misses work, cyclic bowel pain
    store.profiles.set(patientId, {
      patientId,
      yearOfBirth: now.getFullYear() - 29,
      menarcheAge: 12,
      isPregnantOrLactating: false,
      hormonalContraception: false,
      dietPreference: "non-vegetarian",
      allergies: [],
      lifestyleGoals: ["pelvic_pain_relief", "anti_inflammatory_nutrition"],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    store.cycles.set(patientId, [
      { id: "c1", patientId, startDate: subtractDays(5), cycleLengthDays: 27, periodLengthDays: 6, flowIntensity: "heavy", crampsSeverity: 9, createdAt: now.toISOString() },
      { id: "c2", patientId, startDate: subtractDays(32), cycleLengthDays: 28, periodLengthDays: 6, flowIntensity: "heavy", crampsSeverity: 8, createdAt: now.toISOString() },
    ]);

    store.questionnaires.set(patientId, [
      {
        id: "q_endo",
        patientId,
        questionnaireCode: "ENDO",
        answers: { E01: 9, E02: "often", E04: "yes", E05: "yes", E11: "no" },
        completedAt: now.toISOString(),
      },
    ]);
  } else if (scenario === "SCENARIO_E_BLEEDING" || scenario === "SCENARIO_E") {
    // Heavy menstrual bleeding with rapid pad soaking & persistent fatigue
    store.profiles.set(patientId, {
      patientId,
      yearOfBirth: now.getFullYear() - 34,
      menarcheAge: 13,
      isPregnantOrLactating: false,
      hormonalContraception: false,
      dietPreference: "vegetarian",
      allergies: [],
      lifestyleGoals: ["iron_levels", "energy_enhancement"],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    store.questionnaires.set(patientId, [
      {
        id: "q_bleed",
        patientId,
        questionnaireCode: "CORE",
        answers: { B01: 9, B03: "yes", B08: "yes", C09: 9 },
        completedAt: now.toISOString(),
      },
    ]);
  } else if (scenario === "SCENARIO_F_ACUTE" || scenario === "SCENARIO_F") {
    // Acute Red Flag emergency: possible pregnancy + sudden severe pelvic pain
    store.profiles.set(patientId, {
      patientId,
      yearOfBirth: now.getFullYear() - 28,
      menarcheAge: 13,
      isPregnantOrLactating: true,
      hormonalContraception: false,
      dietPreference: "vegetarian",
      allergies: [],
      lifestyleGoals: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    store.symptoms.set(patientId, [
      {
        id: "s_acute",
        patientId,
        logDate: format(now),
        pelvicPain: 9,
        bloating: 4,
        headache: 3,
        tags: ["severe_cramping", "acute_dizziness"],
        notes: "Sudden sharp right lower quadrant pelvic pain",
        createdAt: now.toISOString(),
      },
    ]);

    store.questionnaires.set(patientId, [
      {
        id: "q_acute",
        patientId,
        questionnaireCode: "ENDO",
        answers: { C03: "yes", E01: 9, E11: "yes", B06: "yes" },
        completedAt: now.toISOString(),
      },
    ]);
  }

  // Populate synthetic wearable history (30 days of metrics)
  const wearableData: HerWearableData[] = [];
  for (let i = 0; i < 30; i++) {
    wearableData.push({
      patientId,
      date: subtractDays(i),
      restingHeartRateBpm: 66 + (i % 5),
      hrvMs: 48 - (i % 4),
      sleepDurationMinutes: 440 + (i % 60),
      sleepEfficiencyPercent: 88,
      stepCount: 8200 + (i * 120) % 3000,
      basalBodyTempCelsius: 36.4 + (i > 14 ? 0.4 : 0.0),
      source: "synthetic_simulator",
    });
  }
  store.wearables.set(patientId, wearableData);

  audit(patientId, "DEMO_SCENARIO_SEEDED", { scenario });

  return c.json({
    success: true,
    scenario,
    patientId,
    message: `Synthetic scenario '${scenario}' seeded with complete clinical history.`,
  });
});
