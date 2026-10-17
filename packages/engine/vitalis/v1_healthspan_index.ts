export interface DomainObservation {
  score: number | null; // 0-100 or null if not observed
  observed: boolean;
  rawMetricSummary?: string;
}

export interface HealthspanIndexInput {
  domains: {
    physical_activity?: DomainObservation;
    strength_mobility?: DomainObservation;
    sleep_recovery?: DomainObservation;
    nutrition_quality?: DomainObservation;
    cardio_health?: DomainObservation;
    metabolic_health?: DomainObservation;
    preventive_care?: DomainObservation;
    psychosocial_wellbeing?: DomainObservation;
  };
  minCoverageThreshold?: number; // Default 0.40 (40%)
}

export interface HealthspanIndexResult {
  hpiScore: number | null;
  coverage: number; // 0.0 to 1.0
  status: "ADEQUATE_DATA" | "INSUFFICIENT_DATA";
  domains: Record<string, {
    score: number | null;
    weight: number;
    observed: boolean;
    rationale: string;
  }>;
  algorithmVersion: string;
  computedAt: string;
  limitations: string[];
}

const DEFAULT_WEIGHTS: Record<string, number> = {
  physical_activity: 1.5,
  strength_mobility: 1.2,
  sleep_recovery: 1.4,
  nutrition_quality: 1.3,
  cardio_health: 1.2,
  metabolic_health: 1.4,
  preventive_care: 1.0,
  psychosocial_wellbeing: 1.0,
};

/**
 * V1 — Healthspan Progress Index (HPI)
 * Behavioral, non-clinical tracking metric. Computes normalized progress across 8 modifiable wellness domains.
 * Strictly avoids biological age or life expectancy claims.
 */
export function vitalisHealthspanIndex(input: HealthspanIndexInput): HealthspanIndexResult {
  const minCoverage = input.minCoverageThreshold ?? 0.4;
  const inputDomains = input.domains || {};

  let totalEligibleWeight = 0;
  let observedWeight = 0;
  let weightedScoreSum = 0;

  const domainBreakdown: HealthspanIndexResult["domains"] = {};

  for (const [key, weight] of Object.entries(DEFAULT_WEIGHTS)) {
    totalEligibleWeight += weight;
    const obs = (inputDomains as Record<string, DomainObservation | undefined>)[key];

    const isObserved = Boolean(obs && obs.observed && obs.score !== null && obs.score !== undefined);
    const scoreVal = isObserved ? Math.max(0, Math.min(100, obs!.score!)) : null;

    if (isObserved && scoreVal !== null) {
      observedWeight += weight;
      weightedScoreSum += weight * scoreVal;
    }

    domainBreakdown[key] = {
      score: scoreVal,
      weight,
      observed: isObserved,
      rationale: isObserved
        ? `Observed data recorded. Domain normalized score: ${scoreVal}/100.`
        : "Insufficient recent observations to calibrate this wellness factor.",
    };
  }

  const coverage = totalEligibleWeight > 0 ? Number((observedWeight / totalEligibleWeight).toFixed(2)) : 0;
  const hasAdequateCoverage = coverage >= minCoverage && observedWeight > 0;

  const hpiScore = hasAdequateCoverage
    ? Math.round(weightedScoreSum / observedWeight)
    : null;

  return {
    hpiScore,
    coverage,
    status: hasAdequateCoverage ? "ADEQUATE_DATA" : "INSUFFICIENT_DATA",
    domains: domainBreakdown,
    algorithmVersion: "V1-HPI-2026.1",
    computedAt: new Date().toISOString(),
    limitations: [
      "Healthspan Progress Index reflects modifiable lifestyle and preventive behavior adherence, not biological age or chronological lifespan expectancy.",
      "Scores are computed only from documented observations; missing domains are excluded rather than imputed.",
    ],
  };
}
