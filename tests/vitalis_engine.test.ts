import { describe, expect, it } from "vitest";
import {
  estimateNonExerciseVO2max,
  vitalisBehaviorSimulator,
  vitalisBiomarkerTrends,
  vitalisDailyReadiness,
  vitalisExerciseProgression,
  vitalisFunctionalCapacity,
  vitalisHealthspanIndex,
  vitalisIngestAndDeduplicate,
  vitalisLifestyleCorrelations,
  vitalisPreventiveEligibility,
  vitalisPreventiveRanker,
  vitalisRecommendationSelector,
  vitalisRollingBaseline,
  vitalisSafetyGate,
  vitalisSleepRegularity,
} from "../packages/engine";

describe("AyuSetu Vitalis — Algorithm V0: Safety Gate", () => {
  it("escalates urgent evaluation immediately when chest discomfort is present", () => {
    const res = vitalisSafetyGate({
      symptoms: { chestPain: true },
      candidateAction: "general_wellness",
    });
    expect(res.allowed).toBe(false);
    expect(res.decision).toBe("URGENT_EVALUATION");
    expect(res.ruleId).toBe("V0-RED01-CHEST-PAIN");
    expect(res.emergencyGuidance).toContain("immediate medical attention");
  });

  it("blocks high-intensity training when clinician exertion restrictions are active", () => {
    const res = vitalisSafetyGate({
      clinicianRestrictedExertion: true,
      candidateAction: "hiit_exercise",
    });
    expect(res.allowed).toBe(false);
    expect(res.decision).toBe("BLOCKED");
    expect(res.ruleId).toBe("V0-EX01-CLINICIAN-RESTRICTION");
  });

  it("blocks high-protein dietary suggestions for patients with CKD", () => {
    const res = vitalisSafetyGate({
      diagnosedConditions: ["Chronic Kidney Disease Stage 3", "Hypertension"],
      candidateAction: "high_protein_diet",
    });
    expect(res.allowed).toBe(false);
    expect(res.decision).toBe("BLOCKED");
    expect(res.ruleId).toBe("V0-NUT01-CKD-PROTEIN-LIMIT");
  });

  it("permits standard low-intensity lifestyle actions for healthy profile", () => {
    const res = vitalisSafetyGate({
      symptoms: {},
      diagnosedConditions: [],
      candidateAction: "walking",
    });
    expect(res.allowed).toBe(true);
    expect(res.decision).toBe("ALLOWED");
  });
});

describe("AyuSetu Vitalis — Algorithm V1: Healthspan Progress Index (HPI)", () => {
  it("returns INSUFFICIENT_DATA and null score when coverage is below 40%", () => {
    const res = vitalisHealthspanIndex({
      domains: {
        physical_activity: { score: 80, observed: true },
      },
    });
    expect(res.status).toBe("INSUFFICIENT_DATA");
    expect(res.hpiScore).toBeNull();
    expect(res.coverage).toBeLessThan(0.4);
  });

  it("calculates weighted normalized score when coverage exceeds minimum", () => {
    const res = vitalisHealthspanIndex({
      domains: {
        physical_activity: { score: 80, observed: true }, // wt 1.5 -> 120
        strength_mobility: { score: 70, observed: true }, // wt 1.2 -> 84
        sleep_recovery: { score: 90, observed: true }, // wt 1.4 -> 126
        nutrition_quality: { score: 85, observed: true }, // wt 1.3 -> 110.5
      },
    });
    expect(res.status).toBe("ADEQUATE_DATA");
    expect(res.hpiScore).toBeGreaterThanOrEqual(75);
    expect(res.hpiScore).toBeLessThanOrEqual(90);
    expect(res.limitations.length).toBeGreaterThan(0);
  });
});

describe("AyuSetu Vitalis — Algorithm V2: Preventive Ranker", () => {
  it("ranks evidence-based high-feasibility low-burden actions highest", () => {
    const actions = [
      {
        id: "ACT-1",
        title: "Daily Brisk Walk",
        category: "lifestyle_activity" as const,
        evidenceStrength: 0.95,
        relevanceScore: 0.9,
        feasibilityScore: 0.9,
        patientBurden: 0.1,
        evidenceSource: "WHO",
      },
      {
        id: "ACT-2",
        title: "Complex Cold Plunge",
        category: "lifestyle_activity" as const,
        evidenceStrength: 0.3,
        relevanceScore: 0.4,
        feasibilityScore: 0.2,
        patientBurden: 0.8,
        evidenceSource: "Anecdotal",
      },
    ];

    const ranked = vitalisPreventiveRanker(actions);
    expect(ranked[0]!.id).toBe("ACT-1");
    expect(ranked[0]!.priorityScore).toBeGreaterThan(ranked[1]!.priorityScore);
  });
});

describe("AyuSetu Vitalis — Algorithm V3: Adaptive Exercise Progression", () => {
  it("deloads volume when subjective fatigue is high (≥7/10)", () => {
    const res = vitalisExerciseProgression({
      currentWeeklyMinutes: 120,
      adherencePercentage: 90,
      recentFatigueRating: 8,
      symptomsReported: false,
      clinicianRestricted: false,
      hasCardiovascularCondition: false,
    });
    expect(res.action).toBe("DELOAD");
    expect(res.deltaMinutes).toBeLessThan(0);
    expect(res.nextTargetMinutes).toBeLessThan(120);
  });

  it("safely escalates up to 10% when adherence is high and fatigue is low", () => {
    const res = vitalisExerciseProgression({
      currentWeeklyMinutes: 100,
      adherencePercentage: 95,
      recentFatigueRating: 2,
      symptomsReported: false,
      clinicianRestricted: false,
      hasCardiovascularCondition: false,
    });
    expect(res.action).toBe("INCREASE");
    expect(res.nextTargetMinutes).toBe(110);
  });
});

describe("AyuSetu Vitalis — Algorithm V4: Biomarker Trends", () => {
  it("quarantines physiologically implausible HbA1c values", () => {
    const res = vitalisBiomarkerTrends("hba1c", [
      { dateUtc: "2026-01-01T00:00:00Z", value: 5.7, unit: "%" },
      { dateUtc: "2026-04-01T00:00:00Z", value: 5.9, unit: "%" },
      { dateUtc: "2026-07-01T00:00:00Z", value: -1.0, unit: "%" }, // Implausible
    ]);
    expect(res.quarantinedPoints.length).toBe(1);
    expect(res.validPoints.length).toBe(2);
    expect(res.delta).toBe(0.2);
    expect(res.direction).toBe("STABLE");
  });
});

describe("AyuSetu Vitalis — Algorithm V5: Lifestyle Correlations", () => {
  it("returns ZERO_VARIANCE when one series has no dispersion", () => {
    const pairs = [
      { x: 10, y: 100, dateKey: "d1" },
      { x: 10, y: 120, dateKey: "d2" },
      { x: 10, y: 140, dateKey: "d3" },
      { x: 10, y: 110, dateKey: "d4" },
      { x: 10, y: 130, dateKey: "d5" },
      { x: 10, y: 105, dateKey: "d6" },
      { x: 10, y: 115, dateKey: "d7" },
    ];
    const res = vitalisLifestyleCorrelations("Fixed X", "Variable Y", pairs);
    expect(res.status).toBe("ZERO_VARIANCE");
    expect(res.pearsonR).toBe(0);
  });
});

describe("AyuSetu Vitalis — Algorithm V7: VO2max Provenance & Formula", () => {
  it("blocks non-exercise regression by default with validation pending notice", () => {
    const res = estimateNonExerciseVO2max({
      sexBinary: 1,
      age: 48,
      bmi: 24.5,
      nightRhr: 60,
      pai: 80,
      enableExperimentalFlag: false,
    });
    expect(res.estimatedVO2).toBeNull();
    expect(res.status).toBe("DISABLED_PENDING_CLINICAL_VALIDATION");
  });

  it("calculates experimental regression only when flag is explicitly enabled", () => {
    const res = estimateNonExerciseVO2max({
      sexBinary: 1,
      age: 48,
      bmi: 24.5,
      nightRhr: 60,
      pai: 80,
      enableExperimentalFlag: true,
    });
    expect(res.estimatedVO2).toBeGreaterThan(20);
    expect(res.status).toBe("EXPERIMENTAL_ESTIMATE");
  });
});

describe("AyuSetu Vitalis — Algorithm V8: Rolling Baseline", () => {
  it("calculates mean, std dev, and z-score for consistent device series", () => {
    const samples = [
      { value: 60, dateUtc: "2026-01-01", sourceDevice: "AppleWatch" },
      { value: 62, dateUtc: "2026-01-02", sourceDevice: "AppleWatch" },
      { value: 58, dateUtc: "2026-01-03", sourceDevice: "AppleWatch" },
      { value: 61, dateUtc: "2026-01-04", sourceDevice: "AppleWatch" },
      { value: 59, dateUtc: "2026-01-05", sourceDevice: "AppleWatch" },
      { value: 60, dateUtc: "2026-01-06", sourceDevice: "AppleWatch" },
      { value: 60, dateUtc: "2026-01-07", sourceDevice: "AppleWatch" },
    ];
    const today = {
      value: 60,
      dateUtc: "2026-01-08",
      sourceDevice: "AppleWatch",
    };

    const res = vitalisRollingBaseline("RESTING_HR", samples, today);
    expect(res.status).toBe("ADEQUATE");
    expect(res.mean).toBe(60);
    expect(res.todayZScore).toBe(0);
    expect(res.isWithinNormalRange).toBe(true);
  });
});

describe("AyuSetu Vitalis — Algorithm V10: Daily Readiness", () => {
  it("bounds output between 0 and 100 and prioritizes rest on high fatigue", () => {
    const res = vitalisDailyReadiness({
      subjectiveFatigue: 9,
    });
    expect(res.readinessScore).toBe(35);
    expect(res.wellnessLabel).toBe("REST_RECOVERY");
  });
});

describe("AyuSetu Vitalis — Algorithm V11: Functional Capacity", () => {
  it("flags sarcopenia review if male grip strength is below 27 kg", () => {
    const res = vitalisFunctionalCapacity({
      age: 68,
      sex: "MALE",
      gripStrengthKg: 22,
      chairRiseSeconds5x: 16.5,
      fallsPastYearCount: 1,
    });
    expect(res.sarcopeniaScreen).toBe("POSSIBLE_SARCOPENIA_CONSIDER_REVIEW");
    expect(res.fallRiskCategory).toBe("INCREASED_FALL_PRECAUTIONS");
    expect(res.locomotorRisk).toBe("ELEVATED_ATTENTION");
  });
});

describe("AyuSetu Vitalis — Algorithm V12: Dedup and Units", () => {
  it("deduplicates identical source records and converts glucose mmol/L to mg/dL", () => {
    const raw = [
      {
        patientId: "p1",
        provider: "healthkit",
        sourceDevice: "watch",
        sourceRecordId: "rec-01",
        metricCode: "blood_glucose",
        value: 5.5, // 5.5 mmol/L -> ~99.1 mg/dL
        unit: "mmol/L",
        startUtc: "2026-01-01T08:00:00Z",
      },
      {
        patientId: "p1",
        provider: "healthkit",
        sourceDevice: "watch",
        sourceRecordId: "rec-01", // Duplicate
        metricCode: "blood_glucose",
        value: 5.5,
        unit: "mmol/L",
        startUtc: "2026-01-01T08:00:00Z",
      },
    ];

    const res = vitalisIngestAndDeduplicate(raw);
    expect(res.duplicateCount).toBe(1);
    expect(res.deduplicatedSamples.length).toBe(1);
    expect(res.deduplicatedSamples[0]?.unit).toBe("mg/dL");
    expect(res.deduplicatedSamples[0]?.value).toBe(99.1);
  });
});

describe("AyuSetu Vitalis — Algorithm V14: Behavior Simulator", () => {
  it("models routine targets without making lifespan or mortality claims", () => {
    const res = vitalisBehaviorSimulator({
      currentDailySteps: 4000,
      currentWeeklyStrengthSessions: 0,
      currentSleepHours: 6.5,
      simulatedExtraWalkMinutes: 30,
      simulatedExtraStrengthSessions: 2,
      simulatedEarlierBedtimeMinutes: 30,
    });
    expect(res.projectedDailySteps).toBe(7000);
    expect(res.projectedWeeklyStrengthTotal).toBe(2);
    expect(res.projectedSleepHours).toBe(7.0);
    expect(res.illustrativeNotice).toContain(
      "does not predict biological age reduction",
    );
  });
});

describe("AyuSetu Vitalis — Algorithm V6: Recommendation Selector", () => {
  it("selects evidence-backed actions aligned with user profile and filters out safety violations", () => {
    const res = vitalisRecommendationSelector({
      age: 45,
      sex: "FEMALE",
      diagnosedConditions: ["Hypertension"],
      medications: ["Telmisartan 40mg"],
      dietPreference: "vegetarian",
      clinicianRestrictedExertion: true, // Restricts high exertion!
      primaryGoals: ["strength", "sleep"],
    });

    expect(res.recommendedActions.length).toBeGreaterThan(0);
    // HIIT should be suppressed due to clinician restriction
    expect(
      res.suppressedActions.some((a) => a.id.toLowerCase().includes("hiit")),
    ).toBe(true);
    expect(res.safetyStatus).toBe("FILTERED_FOR_SAFETY");
  });
});

describe("AyuSetu Vitalis — Algorithm V9: Sleep Regularity Index", () => {
  it("calculates circular consistency score and category across multi-night sleep schedules", () => {
    const intervals = [
      {
        date: "2026-10-10",
        bedtimeMinuteOfDay: 1380,
        wakeMinuteOfDay: 420,
        durationMinutes: 480,
      }, // 11:00 PM
      {
        date: "2026-10-11",
        bedtimeMinuteOfDay: 1390,
        wakeMinuteOfDay: 430,
        durationMinutes: 480,
      }, // 11:10 PM
      {
        date: "2026-10-12",
        bedtimeMinuteOfDay: 1375,
        wakeMinuteOfDay: 415,
        durationMinutes: 480,
      }, // 10:55 PM
    ];

    const res = vitalisSleepRegularity(intervals);
    expect(res.score).toBeGreaterThanOrEqual(80);
    expect(["EXCELLENT", "MODERATE"]).toContain(res.consistencyCategory);
    expect(res.meanBedtimeFormatted).toContain("PM");
    expect(res.sleepDurationAverageHours).toBe(8.0);
  });

  it("identifies high variability in irregular shift-work sleep patterns", () => {
    const intervals = [
      {
        date: "2026-10-10",
        bedtimeMinuteOfDay: 1320,
        wakeMinuteOfDay: 360,
        durationMinutes: 480,
      }, // 10:00 PM
      {
        date: "2026-10-11",
        bedtimeMinuteOfDay: 180,
        wakeMinuteOfDay: 660,
        durationMinutes: 480,
      }, // 3:00 AM
      {
        date: "2026-10-12",
        bedtimeMinuteOfDay: 1400,
        wakeMinuteOfDay: 440,
        durationMinutes: 480,
      }, // 11:20 PM
    ];

    const res = vitalisSleepRegularity(intervals);
    expect(res.score).toBeLessThan(75);
    expect(res.bedtimeVariabilityMinutes).toBeGreaterThan(60);
  });
});

describe("AyuSetu Vitalis — Algorithm V13: Preventive Care Eligibility", () => {
  it("determines due dates and guidelines for metabolic and cardiovascular screening", () => {
    const evaluations = vitalisPreventiveEligibility({
      age: 48,
      sex: "MALE",
      diagnosedConditions: ["Pre-diabetes"],
      familyHistory: ["diabetes", "cad"],
      lastCompletedDates: {
        "PREV-DIABETES-HBA1C": "2024-01-01", // > 12 months ago -> due
        "PREV-BLOOD-PRESSURE": "2026-09-01", // recent -> completed
      },
    });

    const hba1c = evaluations.find((e) => e.ruleId === "PREV-DIABETES-HBA1C");
    const bp = evaluations.find((e) => e.ruleId === "PREV-BLOOD-PRESSURE");

    expect(hba1c).toBeDefined();
    expect(hba1c?.status).toBe("due");
    expect(hba1c?.recommendedIntervalMonths).toBe(12);

    expect(bp).toBeDefined();
    expect(bp?.status).toBe("completed");
  });
});
