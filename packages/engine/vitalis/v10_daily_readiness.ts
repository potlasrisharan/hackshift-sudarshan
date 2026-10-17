export interface ReadinessInput {
  hrvZScore?: number | null; // HRV z-score relative to 21-day baseline (-3 to +3)
  restingHrZScore?: number | null; // RHR z-score (elevated RHR yields negative impact)
  sleepEfficiencyPercent?: number | null; // e.g. 85%
  sleepRegularityScore?: number | null; // 0-100 from V9
  subjectiveFatigue?: number; // 0-10 scale
  symptomsReported?: boolean;
}

export interface ReadinessResult {
  readinessScore: number | null; // 0 to 100 or null
  coveragePercentage: number;
  status: "ADEQUATE" | "INSUFFICIENT_DATA";
  subScores: {
    hrvComponent: number | null;
    rhrComponent: number | null;
    sleepEfficiencyComponent: number | null;
    regularityComponent: number | null;
  };
  wellnessLabel: "REST_RECOVERY" | "MODERATE_CAPACITY" | "OPTIMAL_READINESS";
  clinicalNotice: string;
}

/**
 * V10 — Exploratory Daily Readiness Score
 * Normalized 0-100 composite wellness indicator. Strictly NOT medical clearance.
 */
export function vitalisDailyReadiness(input: ReadinessInput): ReadinessResult {
  const clinicalNotice =
    "Experimental wellness indicator based on wearable telemetry. Not clinical clearance. Subjective fatigue and clinical symptoms always supersede algorithmic scores.";

  // Immediate symptom or high fatigue override
  if (input.symptomsReported || (input.subjectiveFatigue && input.subjectiveFatigue >= 8)) {
    return {
      readinessScore: 35,
      coveragePercentage: 100,
      status: "ADEQUATE",
      subScores: {
        hrvComponent: 40,
        rhrComponent: 40,
        sleepEfficiencyComponent: 40,
        regularityComponent: 40,
      },
      wellnessLabel: "REST_RECOVERY",
      clinicalNotice: "Elevated fatigue or symptoms reported. Rest prioritized over physical loading.",
    };
  }

  let totalWeight = 0;
  let weightedSum = 0;

  // 1. HRV Sub-score (Weight: 0.35). Map Z-score from [-2.5, +2.5] to [20, 100]
  let hrvSub: number | null = null;
  if (input.hrvZScore !== null && input.hrvZScore !== undefined) {
    const clampedZ = Math.max(-2.5, Math.min(2.5, input.hrvZScore));
    hrvSub = Math.round(60 + clampedZ * 16); // z=0 -> 60, z=+2.5 -> 100, z=-2.5 -> 20
    weightedSum += 0.35 * hrvSub;
    totalWeight += 0.35;
  }

  // 2. RHR Sub-score (Weight: 0.25). Inverse mapping (higher RHR z-score means higher stress)
  let rhrSub: number | null = null;
  if (input.restingHrZScore !== null && input.restingHrZScore !== undefined) {
    const clampedZ = Math.max(-2.5, Math.min(2.5, input.restingHrZScore));
    rhrSub = Math.round(60 - clampedZ * 16); // lower RHR -> higher score
    weightedSum += 0.25 * rhrSub;
    totalWeight += 0.25;
  }

  // 3. Sleep Efficiency (Weight: 0.20). [70% -> 50, 95% -> 100]
  let sleepEffSub: number | null = null;
  if (input.sleepEfficiencyPercent !== null && input.sleepEfficiencyPercent !== undefined) {
    sleepEffSub = Math.max(20, Math.min(100, Math.round(input.sleepEfficiencyPercent)));
    weightedSum += 0.20 * sleepEffSub;
    totalWeight += 0.20;
  }

  // 4. Sleep Regularity (Weight: 0.20)
  let regSub: number | null = null;
  if (input.sleepRegularityScore !== null && input.sleepRegularityScore !== undefined) {
    regSub = Math.max(20, Math.min(100, Math.round(input.sleepRegularityScore)));
    weightedSum += 0.20 * regSub;
    totalWeight += 0.20;
  }

  const coverage = Number((totalWeight / 1.0).toFixed(2));
  if (totalWeight < 0.40) {
    return {
      readinessScore: null,
      coveragePercentage: Math.round(coverage * 100),
      status: "INSUFFICIENT_DATA",
      subScores: {
        hrvComponent: hrvSub,
        rhrComponent: rhrSub,
        sleepEfficiencyComponent: sleepEffSub,
        regularityComponent: regSub,
      },
      wellnessLabel: "MODERATE_CAPACITY",
      clinicalNotice: "Insufficient wearable telemetry streams available to calibrate readiness index.",
    };
  }

  const score = Math.round(weightedSum / totalWeight);
  let label: ReadinessResult["wellnessLabel"] = "MODERATE_CAPACITY";
  if (score >= 80) label = "OPTIMAL_READINESS";
  else if (score < 60) label = "REST_RECOVERY";

  return {
    readinessScore: score,
    coveragePercentage: Math.round(coverage * 100),
    status: "ADEQUATE",
    subScores: {
      hrvComponent: hrvSub,
      rhrComponent: rhrSub,
      sleepEfficiencyComponent: sleepEffSub,
      regularityComponent: regSub,
    },
    wellnessLabel: label,
    clinicalNotice,
  };
}
