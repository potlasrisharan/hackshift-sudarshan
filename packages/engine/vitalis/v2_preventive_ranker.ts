export interface CandidateAction {
  id: string;
  title: string;
  category:
    | "preventive_screening"
    | "lifestyle_activity"
    | "nutrition"
    | "sleep"
    | "functional";
  evidenceStrength: number; // 0.0 to 1.0 (based on WHO / AHA guidelines)
  relevanceScore: number; // 0.0 to 1.0 (patient age, condition, goal fit)
  feasibilityScore: number; // 0.0 to 1.0 (time, equipment, access)
  patientBurden: number; // 0.0 to 1.0 (cost, invasiveness, complexity)
  evidenceSource: string;
}

export interface RankedAction extends CandidateAction {
  priorityScore: number; // 0.0 to 1.0
  scoreBreakdown: {
    evidenceComponent: number;
    relevanceComponent: number;
    feasibilityComponent: number;
    burdenPenalty: number;
  };
}

export interface RankerConfig {
  alpha?: number; // evidence weight, default 0.35
  beta?: number; // relevance weight, default 0.35
  gamma?: number; // feasibility weight, default 0.20
  delta?: number; // burden penalty weight, default 0.10
}

/**
 * V2 — Preventive Priority Ranker
 * Deterministic multi-factor scoring of evidence-based healthspan actions.
 */
export function vitalisPreventiveRanker(
  actions: CandidateAction[],
  config?: RankerConfig,
): RankedAction[] {
  const alpha = config?.alpha ?? 0.35;
  const beta = config?.beta ?? 0.35;
  const gamma = config?.gamma ?? 0.2;
  const delta = config?.delta ?? 0.1;

  return actions
    .map((action) => {
      const e = Math.max(0, Math.min(1, action.evidenceStrength));
      const r = Math.max(0, Math.min(1, action.relevanceScore));
      const f = Math.max(0, Math.min(1, action.feasibilityScore));
      const b = Math.max(0, Math.min(1, action.patientBurden));

      const evidenceComp = alpha * e;
      const relevanceComp = beta * r;
      const feasibilityComp = gamma * f;
      const burdenComp = delta * b;

      const rawScore =
        evidenceComp + relevanceComp + feasibilityComp - burdenComp;
      const priorityScore = Number(
        Math.max(0, Math.min(1, rawScore)).toFixed(3),
      );

      return {
        ...action,
        priorityScore,
        scoreBreakdown: {
          evidenceComponent: Number(evidenceComp.toFixed(3)),
          relevanceComponent: Number(relevanceComp.toFixed(3)),
          feasibilityComponent: Number(feasibilityComp.toFixed(3)),
          burdenPenalty: Number(burdenComp.toFixed(3)),
        },
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
