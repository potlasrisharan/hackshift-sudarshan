import { vitalisSafetyGate } from "./v0_safety_gate";
import { vitalisPreventiveRanker, CandidateAction, RankedAction } from "./v2_preventive_ranker";

export interface RecommendationProfileInput {
  age: number;
  sex: string;
  diagnosedConditions: string[];
  medications: string[];
  dietPreference: "vegetarian" | "vegan" | "eggetarian" | "mixed";
  clinicianRestrictedExertion: boolean;
  recentSymptoms?: Record<string, any>;
  primaryGoals: string[];
}

// Curated Evidence Library
const EVIDENCE_LIBRARY: CandidateAction[] = [
  {
    id: "REC-AEROBIC-BASE",
    title: "150 Minutes Moderate Aerobic Activity per Week",
    category: "lifestyle_activity",
    evidenceStrength: 0.95,
    relevanceScore: 0.9,
    feasibilityScore: 0.85,
    patientBurden: 0.2,
    evidenceSource: "WHO 2020 Guidelines on Physical Activity and Sedentary Behaviour",
  },
  {
    id: "REC-STRENGTH-BIWEEKLY",
    title: "Twice-Weekly Major Muscle Resistance Training",
    category: "functional",
    evidenceStrength: 0.90,
    relevanceScore: 0.85,
    feasibilityScore: 0.75,
    patientBurden: 0.25,
    evidenceSource: "AHA Life's Essential 8 & WHO Healthy Ageing Recommendations",
  },
  {
    id: "REC-INDIAN-LEGUMES",
    title: "Daily Whole Legumes & Pulses (Dals, Chickpeas, Rajma)",
    category: "nutrition",
    evidenceStrength: 0.85,
    relevanceScore: 0.95,
    feasibilityScore: 0.90,
    patientBurden: 0.15,
    evidenceSource: "WHO Healthy Diet & ICMR Dietary Guidelines for Indians",
  },
  {
    id: "REC-SLEEP-CONSISTENCY",
    title: "Consistent Bedtime and Wake Window (±30 mins)",
    category: "sleep",
    evidenceStrength: 0.85,
    relevanceScore: 0.80,
    feasibilityScore: 0.80,
    patientBurden: 0.15,
    evidenceSource: "National Sleep Foundation & AHA Cardiovascular Health Metrics",
  },
  {
    id: "REC-MOBILITY-YOGA",
    title: "Gentle Morning Somatic Mobility & Surya Namaskar",
    category: "lifestyle_activity",
    evidenceStrength: 0.80,
    relevanceScore: 0.80,
    feasibilityScore: 0.90,
    patientBurden: 0.10,
    evidenceSource: "Ministry of AYUSH & WHO Traditional Medicine Benchmark",
  },
  {
    id: "REC-HBA1C-SCREEN",
    title: "Periodic Glycated Hemoglobin (HbA1c) Screening",
    category: "preventive_screening",
    evidenceStrength: 0.95,
    relevanceScore: 0.85,
    feasibilityScore: 0.80,
    patientBurden: 0.30,
    evidenceSource: "ICMR-INDIAB & ADA Standards of Care in Diabetes",
  },
  {
    id: "REC-HIIT-CARDIO",
    title: "High-Intensity Interval Training (HIIT) Educational Protocol",
    category: "lifestyle_activity",
    evidenceStrength: 0.85,
    relevanceScore: 0.70,
    feasibilityScore: 0.60,
    patientBurden: 0.50,
    evidenceSource: "Cardiorespiratory Fitness & Exercise Physiology Literature",
  },
];

/**
 * V6 — Safety-Aware Recommendation Selector
 * Filters candidate actions through clinical safety gates, aligns to profile, and applies multi-factor ranking.
 */
export function vitalisRecommendationSelector(
  profile: RecommendationProfileInput
): {
  recommendedActions: RankedAction[];
  suppressedActions: Array<{ id: string; reason: string }>;
  safetyStatus: string;
} {
  const suppressedActions: Array<{ id: string; reason: string }> = [];
  const safeCandidates: CandidateAction[] = [];

  for (const action of EVIDENCE_LIBRARY) {
    const safetyCheck = vitalisSafetyGate({
      symptoms: profile.recentSymptoms,
      diagnosedConditions: profile.diagnosedConditions,
      medications: profile.medications,
      clinicianRestrictedExertion: profile.clinicianRestrictedExertion,
      candidateAction: action.id.toLowerCase(),
    });

    if (!safetyCheck.allowed) {
      suppressedActions.push({
        id: action.id,
        reason: safetyCheck.reason,
      });
      continue;
    }

    // Dynamic relevance boost based on user goals
    let adjustedRelevance = action.relevanceScore;
    if (profile.primaryGoals.includes("strength") && action.category === "functional") {
      adjustedRelevance = Math.min(1.0, adjustedRelevance + 0.1);
    }
    if (profile.primaryGoals.includes("sleep") && action.category === "sleep") {
      adjustedRelevance = Math.min(1.0, adjustedRelevance + 0.1);
    }

    safeCandidates.push({
      ...action,
      relevanceScore: adjustedRelevance,
    });
  }

  const ranked = vitalisPreventiveRanker(safeCandidates);

  return {
    recommendedActions: ranked,
    suppressedActions,
    safetyStatus: suppressedActions.length > 0 ? "FILTERED_FOR_SAFETY" : "ALL_CLEAR",
  };
}
