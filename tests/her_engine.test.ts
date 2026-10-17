import { describe, expect, it } from "vitest";
import {
  herSafetyGate,
  herCycleDetector,
  herScreeningEngine,
  herWellnessRanker,
  herTrendAnalyzer,
} from "../packages/engine";

describe("AyuSetu HER — Algorithm A0: Safety Gate", () => {
  it("triggers urgent triage for pregnancy combined with acute pelvic pain", () => {
    const res = herSafetyGate({
      isPregnantOrPossible: true,
      pelvicPainSeverity: 7,
    });
    expect(res.isUrgent).toBe(true);
    expect(res.category).toBe("URGENT_REVIEW");
    expect(res.ruleId).toBe("A0-OB01-ECTOPIC-TRIAGE");
    expect(res.suppressWellnessAdvice).toBe(true);
  });

  it("triggers urgent triage for severe bleeding with syncope / dizziness", () => {
    const res = herSafetyGate({
      heavyBleedingWithDizziness: true,
      faintingOrSyncope: true,
    });
    expect(res.isUrgent).toBe(true);
    expect(res.ruleId).toBe("A0-HEM03-HEAVY-SYNCOPE");
    expect(res.suppressWellnessAdvice).toBe(true);
  });

  it("passes safe routine symptoms without escalation", () => {
    const res = herSafetyGate({
      pelvicPainSeverity: 3,
      isPregnantOrPossible: false,
      suddenSeverePain: false,
    });
    expect(res.isUrgent).toBe(false);
    expect(res.category).toBe("NORMAL");
    expect(res.suppressWellnessAdvice).toBe(false);
  });
});

describe("AyuSetu HER — Algorithm A1: Cycle Detector", () => {
  it("calculates exact interval statistics and predicted window for regular cycles", () => {
    const dates = ["2026-01-01", "2026-01-29", "2026-02-26", "2026-03-26"];
    const stats = herCycleDetector(dates, { age: 26 });

    expect(stats.status).toBe("ADEQUATE_DATA");
    expect(stats.totalIntervals).toBe(3);
    expect(stats.meanLengthDays).toBe(28);
    expect(stats.stdDevDays).toBe(0);
    expect(stats.irregularityFlags.length).toBe(0);
    expect(stats.predictedNextWindowStart).toBeDefined();
    expect(stats.predictedNextWindowEnd).toBeDefined();
  });

  it("flags adult oligomenorrhea and amenorrhea gaps over 35 and 90 days", () => {
    const dates = ["2026-01-01", "2026-02-15", "2026-06-01"]; // intervals: 45 days, 106 days
    const stats = herCycleDetector(dates, { age: 28 });

    expect(stats.status).toBe("INSUFFICIENT_DATA"); // only 2 intervals
    expect(stats.irregularityFlags.some((f) => f.includes("Oligomenorrhea"))).toBe(true);
    expect(stats.irregularityFlags.some((f) => f.includes("Secondary Amenorrhea"))).toBe(true);
  });

  it("applies adolescent-safe thresholds where up to 45 days is physiologically normal", () => {
    const dates = ["2026-01-01", "2026-02-10", "2026-03-22"]; // intervals: 40 days, 40 days
    const adultStats = herCycleDetector(dates, { age: 28, yearsSinceMenarche: 12 });
    const teenStats = herCycleDetector(dates, { age: 15, yearsSinceMenarche: 1 });

    expect(adultStats.irregularityFlags.some((f) => f.includes("Oligomenorrhea"))).toBe(true);
    // In teenager with menarche 1 year ago, 40 days is within 21-45 days normal range
    expect(teenStats.irregularityFlags.some((f) => f.includes("Infrequent"))).toBe(false);
  });

  it("marks context-limited status during pregnancy or lactation", () => {
    const dates = ["2026-01-01", "2026-01-29"];
    const stats = herCycleDetector(dates, { isPregnantOrLactating: true });
    expect(stats.status).toBe("CONTEXT_LIMITED");
  });
});

describe("AyuSetu HER — Algorithm A2: Screening Engine", () => {
  it("recommends clinical review for adult with irregular cycles and hirsutism/acne without diagnostic claims", () => {
    const findings = herScreeningEngine({
      patientId: "test-adult-01",
      age: 26,
      cycleStats: { hasIrregularity: true, longestCycle: 42 },
      answers: {
        P01: "yes",
        P05: "yes", // coarse facial hair
        P03: "severe", // severe acne
      },
    });

    const pcosFinding = findings.find((f) => f.domain === "PCOS_FEATURES");
    expect(pcosFinding).toBeDefined();
    expect(pcosFinding?.category).toBe("CLINICAL_REVIEW_SUGGESTED");
    expect(pcosFinding?.isDiagnosis).toBe(false);
    expect(pcosFinding?.supportingEvidence.length).toBeGreaterThanOrEqual(2);
    expect(pcosFinding?.missingInformation.length).toBeGreaterThan(0);
  });

  it("protects adolescents by assigning MONITOR_AND_TRACK instead of adult PCOS evaluation", () => {
    const findings = herScreeningEngine({
      patientId: "test-teen-01",
      age: 15,
      yearsSinceMenarche: 1,
      cycleStats: { hasIrregularity: true },
      answers: {
        P01: "yes",
        P03: "mild",
      },
    });

    const pcosFinding = findings.find((f) => f.domain === "PCOS_FEATURES");
    expect(pcosFinding?.category).toBe("MONITOR_AND_TRACK");
    expect(pcosFinding?.limitations.some((l) => l.includes("prohibit using ovarian ultrasound"))).toBe(true);
  });

  it("suggests pelvic pain review for recurrent severe dysmenorrhea interfering with function", () => {
    const findings = herScreeningEngine({
      patientId: "test-endo-01",
      age: 29,
      answers: {
        E01: 9, // Severe pain 9/10
        E02: "often", // Misses work
        E05: "yes", // Cyclic bowel pain
      },
    });

    const endoFinding = findings.find((f) => f.domain === "ENDOMETRIOSIS_PELVIC_PAIN");
    expect(endoFinding).toBeDefined();
    expect(endoFinding?.category).toBe("CLINICAL_REVIEW_SUGGESTED");
    expect(endoFinding?.isDiagnosis).toBe(false);
  });
});

describe("AyuSetu HER — Algorithm A3: Wellness Ranker", () => {
  it("filters out contraindicated foods and activities", () => {
    const items = herWellnessRanker({
      dietPreference: "vegan",
      allergies: ["dairy_allergy"],
      hasPcosFeatures: true,
    });

    // Should not include dairy curd
    expect(items.some((i) => i.id === "nutr-02-curd-seed-cycle")).toBe(false);
    // Should include high protein besan chilla
    expect(items.some((i) => i.id === "nutr-01-besan-chilla")).toBe(true);
  });

  it("suppresses wellness advice if acute safety red flag is active", () => {
    const items = herWellnessRanker({
      activeRedFlags: true,
    });
    expect(items.length).toBe(0);
  });
});

describe("AyuSetu HER — Algorithm A4: Trend Analyzer", () => {
  it("computes rolling moving averages when observation coverage exceeds threshold", () => {
    const series = [
      { date: "2026-03-01", value: 60 },
      { date: "2026-03-02", value: 62 },
      { date: "2026-03-03", value: 58 },
      { date: "2026-03-04", value: 60 },
      { date: "2026-03-05", value: 59 },
      { date: "2026-03-06", value: 61 },
      { date: "2026-03-07", value: 60 },
    ];
    const trend = herTrendAnalyzer(series, 7, 0.6);

    expect(trend.status).toBe("AVAILABLE");
    expect(trend.sampleCount).toBe(7);
    expect(trend.rollingMean).toBe(60);
    expect(trend.coverageRatio).toBe(1.0);
  });

  it("marks insufficient data when observations are sparse", () => {
    const series = [
      { date: "2026-03-01", value: 60 },
      { date: "2026-03-07", value: 62 },
    ];
    const trend = herTrendAnalyzer(series, 7, 0.6);
    expect(trend.status).toBe("INSUFFICIENT_DATA");
    expect(trend.rollingMean).toBeNull();
  });
});
