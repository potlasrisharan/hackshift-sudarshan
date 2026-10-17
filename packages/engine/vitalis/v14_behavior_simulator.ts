export interface SimulationInput {
  currentDailySteps: number;
  currentWeeklyStrengthSessions: number;
  currentSleepHours: number;
  simulatedExtraWalkMinutes: number; // e.g. +30 mins
  simulatedExtraStrengthSessions: number; // e.g. +2 sessions
  simulatedEarlierBedtimeMinutes: number; // e.g. 30 mins
}

export interface SimulationResult {
  projectedDailySteps: number;
  projectedWeeklyActiveMinutes: number;
  projectedWeeklyStrengthTotal: number;
  projectedSleepHours: number;
  whoAerobicGuidelineAchievementPct: number; // Relative to 150 min/wk
  weeklyScheduleAdherenceImpact: string;
  illustrativeNotice: string;
}

/**
 * V14 — Behavior What-If Simulator
 * Models schedule and volume feasibility of planned behavioral changes.
 * Strictly avoids biological age predictions or claims of years of life gained.
 */
export function vitalisBehaviorSimulator(input: SimulationInput): SimulationResult {
  // Approximate 1 minute of purposeful walking ~ 100 steps
  const extraSteps = input.simulatedExtraWalkMinutes * 100;
  const projectedSteps = input.currentDailySteps + extraSteps;

  const extraActiveMinutesWeekly = input.simulatedExtraWalkMinutes * 7;
  const projectedActiveWeekly = Math.round(extraActiveMinutesWeekly + (input.currentDailySteps / 100));

  const projectedStrength = input.currentWeeklyStrengthSessions + input.simulatedExtraStrengthSessions;
  const extraSleepHours = input.simulatedEarlierBedtimeMinutes / 60;
  const projectedSleep = Number((input.currentSleepHours + extraSleepHours).toFixed(1));

  // WHO guideline benchmark: 150 minutes moderate activity / week
  const guidelinePct = Math.min(200, Math.round((projectedActiveWeekly / 150) * 100));

  return {
    projectedDailySteps: projectedSteps,
    projectedWeeklyActiveMinutes: projectedActiveWeekly,
    projectedWeeklyStrengthTotal: projectedStrength,
    projectedSleepHours: projectedSleep,
    whoAerobicGuidelineAchievementPct: guidelinePct,
    weeklyScheduleAdherenceImpact: `Adding ${input.simulatedExtraWalkMinutes} mins daily walking projects to ~${extraSteps.toLocaleString()} additional steps/day, reaching ${guidelinePct}% of the WHO weekly aerobic target.`,
    illustrativeNotice:
      "This simulation models planned routine feasibility and schedule volume only. It does not predict biological age reduction, mortality risk changes, or guaranteed biomarker changes.",
  };
}
