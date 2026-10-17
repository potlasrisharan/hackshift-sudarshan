import { describe, expect, it } from "vitest";
import {
  vitalisSafetyGate,
  vitalisHealthspanIndex,
  vitalisPreventiveRanker,
  vitalisExerciseProgression,
  vitalisBiomarkerTrends,
  vitalisLifestyleCorrelations,
  vitalisRecommendationSelector,
  evaluateVO2maxRecord,
  estimateNonExerciseVO2max,
  vitalisRollingBaseline,
  vitalisSleepRegularity,
  vitalisDailyReadiness,
  vitalisFunctionalCapacity,
  vitalisIngestAndDeduplicate,
  vitalisPreventiveEligibility,
  vitalisBehaviorSimulator,
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
    expect(res.coverage).toBeLessThan(0.40);
  });

  it("calculates weighted normalized score when coverage exceeds minimum", () => {
    const res = vitalisHealthspanIndex({
      domains: {
        physical_activity: { score: 80, observed: true }, // wt 1.5 -> 120
        strength_mobility: { score: 70, observed: true }, // wt 1.2 -> 84
        sleep_recovery: { score: 90, observed: true },    // wt 1.4 -> 126
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
        relevanceScore: 0.90,
        feasibilityScore: 0.90,
        patientBurden: 0.10,
        evidenceSource: "WHO",
      },
      {
        id: "ACT-2",
        title: "Complex Cold Plunge",
        category: "lifestyle_activity" as const,
        evidenceStrength: 0.30,
        relevanceScore: 0.40,
        feasibilityScore: 0.20,
        patientBurden: 0.80,
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
    const today = { value: 60, dateUtc: "2026-01-08", sourceDevice: "AppleWatch" };

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
    expect(res.deduplicatedSamples[0]!.unit).toBe("mg/dL");
    expect(res.deduplicatedSamples[0]!.value).toBe(99.1);
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
    expect(res.illustrativeNotice).toContain("does not predict biological age reduction");
  });
});
