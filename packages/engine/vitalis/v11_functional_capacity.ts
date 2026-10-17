export interface FunctionalAssessmentInput {
  age: number;
  sex: "MALE" | "FEMALE" | "OTHER";
  gripStrengthKg?: number | null;
  chairRiseSeconds5x?: number | null; // 5-times sit-to-stand in seconds
  fallsPastYearCount?: number;
  difficultyStairsOrWalking?: "none" | "mild" | "moderate" | "severe";
  visionHearingDifficulties?: boolean;
}

export interface FunctionalCapacityResult {
  locomotorRisk: "LOW" | "MODERATE" | "ELEVATED_ATTENTION";
  sarcopeniaScreen:
    | "NORMAL"
    | "POSSIBLE_SARCOPENIA_CONSIDER_REVIEW"
    | "UNTESTED";
  chairRiseInterpretation: string;
  fallRiskCategory: "STANDARD" | "INCREASED_FALL_PRECAUTIONS";
  icopeRecommendations: string[];
  disclaimer: string;
}

/**
 * V11 — Functional Capacity & Healthy Ageing
 * Evaluates muscle strength, mobility, and fall risk using WHO ICOPE and EWGSOP2 criteria.
 * Avoids any direct lifespan translation from physical test results.
 */
export function vitalisFunctionalCapacity(
  input: FunctionalAssessmentInput,
): FunctionalCapacityResult {
  const disclaimer =
    "Functional capacity screenings are observational assessments of independence and musculoskeletal health. They do not predict mortality or lifespan duration.";

  // EWGSOP2 Grip Strength Cutoffs: <27 kg for Men, <16 kg for Women
  let sarcopeniaScreen: FunctionalCapacityResult["sarcopeniaScreen"] =
    "UNTESTED";
  if (input.gripStrengthKg !== null && input.gripStrengthKg !== undefined) {
    const isMale = input.sex === "MALE";
    const cutoff = isMale ? 27 : 16;
    if (input.gripStrengthKg < cutoff) {
      sarcopeniaScreen = "POSSIBLE_SARCOPENIA_CONSIDER_REVIEW";
    } else {
      sarcopeniaScreen = "NORMAL";
    }
  }

  // Chair Rise Test (5 times sit-to-stand): >15 seconds is indicative of impaired functional lower limb power
  let chairRiseInterpretation = "Not tested.";
  let slowChairRise = false;
  if (
    input.chairRiseSeconds5x !== null &&
    input.chairRiseSeconds5x !== undefined
  ) {
    if (input.chairRiseSeconds5x > 15.0) {
      slowChairRise = true;
      chairRiseInterpretation = `${input.chairRiseSeconds5x}s (Impaired lower-extremity power; >15s indicates fall precaution).`;
    } else {
      chairRiseInterpretation = `${input.chairRiseSeconds5x}s (Normal functional power; ≤15s).`;
    }
  }

  // Fall Risk
  const falls = input.fallsPastYearCount || 0;
  const severeMobility =
    input.difficultyStairsOrWalking === "moderate" ||
    input.difficultyStairsOrWalking === "severe";
  const fallRisk: FunctionalCapacityResult["fallRiskCategory"] =
    falls >= 1 || severeMobility || slowChairRise
      ? "INCREASED_FALL_PRECAUTIONS"
      : "STANDARD";

  // Locomotor Risk
  let locomotorRisk: FunctionalCapacityResult["locomotorRisk"] = "LOW";
  if (
    fallRisk === "INCREASED_FALL_PRECAUTIONS" ||
    sarcopeniaScreen === "POSSIBLE_SARCOPENIA_CONSIDER_REVIEW"
  ) {
    locomotorRisk = "ELEVATED_ATTENTION";
  } else if (input.difficultyStairsOrWalking === "mild") {
    locomotorRisk = "MODERATE";
  }

  const recommendations: string[] = [];
  if (fallRisk === "INCREASED_FALL_PRECAUTIONS") {
    recommendations.push(
      "Prioritize supervised balance, stability, and supported chair-rise exercises.",
    );
    recommendations.push(
      "Environmental safety check: ensure clear pathways, adequate lighting, and non-slip rugs.",
    );
  }
  if (sarcopeniaScreen === "POSSIBLE_SARCOPENIA_CONSIDER_REVIEW") {
    recommendations.push(
      "Discuss progressive resistance training and adequate dietary protein distribution with a clinician.",
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain functional agility through brisk walking, light bodyweight squats, and balance asanas.",
    );
  }

  return {
    locomotorRisk,
    sarcopeniaScreen,
    chairRiseInterpretation,
    fallRiskCategory: fallRisk,
    icopeRecommendations: recommendations,
    disclaimer,
  };
}
