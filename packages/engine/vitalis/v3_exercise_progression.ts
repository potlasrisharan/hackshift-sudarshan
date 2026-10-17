export interface ExerciseProgressionInput {
  currentWeeklyMinutes: number; // e.g. 90 mins
  adherencePercentage: number;   // 0 to 100
  recentFatigueRating: number;   // 0 to 10 scale
  symptomsReported: boolean;
  clinicianRestricted: boolean;
  hasCardiovascularCondition: boolean;
}

export interface ExerciseProgressionResult {
  nextTargetMinutes: number;
  deltaMinutes: number;
  intensityCap: "low" | "moderate" | "challenging_educational_only";
  action: "INCREASE" | "MAINTAIN" | "DELOAD" | "CLINICAL_HOLD";
  reason: string;
}

/**
 * V3 — Adaptive Exercise Progression
 * Governs safe volume escalation based on empirical adherence and symptom check-ins.
 */
export function vitalisExerciseProgression(
  input: ExerciseProgressionInput
): ExerciseProgressionResult {
  if (input.symptomsReported) {
    return {
      nextTargetMinutes: Math.max(30, Math.round(input.currentWeeklyMinutes * 0.7)),
      deltaMinutes: -Math.round(input.currentWeeklyMinutes * 0.3),
      intensityCap: "low",
      action: "CLINICAL_HOLD",
      reason: "Symptoms reported during activity. Targets scaled down; clinician clearance advised.",
    };
  }

  if (input.clinicianRestricted || input.hasCardiovascularCondition) {
    return {
      nextTargetMinutes: Math.min(150, input.currentWeeklyMinutes),
      deltaMinutes: 0,
      intensityCap: "low",
      action: "MAINTAIN",
      reason: "Cardiovascular history or active clinical restrictions restrict volume to safe baseline.",
    };
  }

  if (input.recentFatigueRating >= 7) {
    return {
      nextTargetMinutes: Math.max(45, Math.round(input.currentWeeklyMinutes * 0.8)),
      deltaMinutes: -Math.round(input.currentWeeklyMinutes * 0.2),
      intensityCap: "low",
      action: "DELOAD",
      reason: "Elevated subjective fatigue (≥7/10). Active deload recovery recommended.",
    };
  }

  // Check compliance: if adherence >= 80% and fatigue < 5, progressive overload of max 10% or +15m
  if (input.adherencePercentage >= 80 && input.recentFatigueRating <= 4) {
    const increment = Math.min(20, Math.max(10, Math.round(input.currentWeeklyMinutes * 0.1)));
    const nextTarget = Math.min(300, input.currentWeeklyMinutes + increment);
    return {
      nextTargetMinutes: nextTarget,
      deltaMinutes: nextTarget - input.currentWeeklyMinutes,
      intensityCap: "moderate",
      action: "INCREASE",
      reason: "Consistent adherence and low fatigue. Safe progressive overload (+10% volume).",
    };
  }

  return {
    nextTargetMinutes: input.currentWeeklyMinutes,
    deltaMinutes: 0,
    intensityCap: "moderate",
    action: "MAINTAIN",
    reason: "Consistent baseline maintained. Adapt to current targets before advancing volume.",
  };
}
