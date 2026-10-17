export type VO2SourceType =
  | "lab_measured"
  | "wearable_estimated"
  | "model_estimated";

export interface VO2Record {
  vo2MaxMlKgMin: number;
  recordedDate: string;
  sourceType: VO2SourceType;
  device?: string;
  method?: string;
  uncertaintyMargin?: number;
}

export interface ResearchEquationInput {
  sexBinary: 0 | 1; // 1 for male, 0 for female
  age: number;
  bmi: number;
  nightRhr: number;
  pai: number; // Physical Activity Index
  enableExperimentalFlag?: boolean;
}

export interface VO2EvaluationResult {
  record: VO2Record;
  provenanceLabel: string;
  isLabMeasured: boolean;
  ageSexCohortReferenceBand?: {
    low: number;
    moderate: number;
    high: number;
  };
  clinicalContext: string;
}

/**
 * V7 — VO2max Provenance Tagging & Optional Research Estimation
 * Discloses provenance clearly. The research non-exercise regression remains strictly disabled
 * unless an explicit experimental flag is enabled, displaying validation status.
 */
export function evaluateVO2maxRecord(
  record: VO2Record,
  age?: number,
): VO2EvaluationResult {
  const isLab = record.sourceType === "lab_measured";
  const label =
    record.sourceType === "lab_measured"
      ? "Laboratory Measured (Cardiopulmonary Exercise Testing - CPET)"
      : record.sourceType === "wearable_estimated"
        ? `Wearable Submaximal Estimate (${record.device || "Fitness Tracker"})`
        : "Algorithmic Non-Exercise Estimate (Experimental)";

  // Reference bands (approximated population medians for 20-59 age brackets)
  const cohortBand =
    age && age >= 50
      ? { low: 22, moderate: 32, high: 42 }
      : { low: 28, moderate: 38, high: 48 };

  return {
    record,
    provenanceLabel: label,
    isLabMeasured: isLab,
    ageSexCohortReferenceBand: cohortBand,
    clinicalContext: isLab
      ? "Laboratory CPET measurement provides high clinical precision."
      : "Wearable GPS/HR algorithms provide approximate trend estimates; individual accuracy varies with terrain and sensor contact.",
  };
}

/**
 * Experimental Non-Exercise VO2max Formula (Nes et al. 2011 candidate)
 * BLOCKED by default per Specification Section 1.1 & Section 6.
 */
export function estimateNonExerciseVO2max(input: ResearchEquationInput): {
  estimatedVO2: number | null;
  status: string;
  notice: string;
} {
  if (!input.enableExperimentalFlag) {
    return {
      estimatedVO2: null,
      status: "DISABLED_PENDING_CLINICAL_VALIDATION",
      notice:
        "Estimation unavailable: research equation validation and calibration pending. Wearable or lab measurements are preferred.",
    };
  }

  // Research equation: 56.36 + 4.47*sex - 0.381*age - 0.754*BMI - 0.190*night_RHR + 0.325*PAI
  const raw =
    56.36 +
    4.47 * input.sexBinary -
    0.381 * input.age -
    0.754 * input.bmi -
    0.19 * input.nightRhr +
    0.325 * input.pai;

  return {
    estimatedVO2: Number(Math.max(10, Math.min(85, raw)).toFixed(1)),
    status: "EXPERIMENTAL_ESTIMATE",
    notice:
      "Experimental non-exercise estimation provided for research comparison only. Not validated for clinical triage.",
  };
}
