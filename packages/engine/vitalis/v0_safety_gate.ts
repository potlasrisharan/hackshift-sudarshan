export interface SafetyGateInput {
  symptoms?: Record<string, any>;
  diagnosedConditions?: string[];
  medications?: string[];
  clinicianRestrictedExertion?: boolean;
  candidateAction?: string; // e.g. "hiit_exercise", "high_protein_diet", "general_wellness"
}

export interface SafetyDecision {
  allowed: boolean;
  decision: "ALLOWED" | "BLOCKED" | "CLINICIAN_REVIEW" | "URGENT_EVALUATION";
  ruleId?: string;
  reason: string;
  emergencyGuidance?: string;
  evidence: string[];
}

/**
 * V0 — Safety Triage & Contraindication Gate (Mandatory First Check)
 * Deterministic rule engine that intercepts high-intensity actions or red flags before any advice is generated.
 */
export function vitalisSafetyGate(input: SafetyGateInput): SafetyDecision {
  const symptoms = input.symptoms || {};
  const conditions = (input.diagnosedConditions || []).map((c) => c.toLowerCase());
  const restricted = input.clinicianRestrictedExertion || false;
  const action = (input.candidateAction || "general_wellness").toLowerCase();

  // 1. Immediate Red Flag Symptoms
  if (
    symptoms.chestPain === true ||
    symptoms.chestPain === "yes" ||
    symptoms.Q38_chest_discomfort === true ||
    symptoms.Q18_chest_discomfort === true
  ) {
    return {
      allowed: false,
      decision: "URGENT_EVALUATION",
      ruleId: "V0-RED01-CHEST-PAIN",
      reason: "Acute or exertion-related chest discomfort reported.",
      emergencyGuidance: "Seek immediate medical attention or emergency hospital triage. Do not engage in exercise or physical exertion.",
      evidence: ["Chest pain / discomfort reported on evaluation."],
    };
  }

  if (symptoms.syncope === true || symptoms.fainting === true || symptoms.fainting === "yes") {
    return {
      allowed: false,
      decision: "URGENT_EVALUATION",
      ruleId: "V0-RED02-SYNCOPE",
      reason: "Recent unexplained syncope (fainting) or severe loss of consciousness.",
      emergencyGuidance: "Clinical consultation required immediately to evaluate potential cardiovascular or neurological causes.",
      evidence: ["Fainting / syncope reported."],
    };
  }

  // 2. High-intensity training or exertion contraindications
  const isHighIntensity = action.includes("hiit") || action.includes("norwegian") || action.includes("intense");

  if (isHighIntensity) {
    if (restricted) {
      return {
        allowed: false,
        decision: "BLOCKED",
        ruleId: "V0-EX01-CLINICIAN-RESTRICTION",
        reason: "Clinician has explicitly placed restrictions on vigorous physical exertion.",
        evidence: ["Active clinician exertion restriction recorded in profile."],
      };
    }

    const hasCardio = conditions.some((c) =>
      c.includes("cardio") || c.includes("heart") || c.includes("coronary") || c.includes("hypertension")
    );
    if (hasCardio) {
      return {
        allowed: false,
        decision: "CLINICIAN_REVIEW",
        ruleId: "V0-EX02-CARDIOVASCULAR-REVIEW",
        reason: "History of cardiovascular disease or elevated blood pressure requires clinician clearance prior to high-intensity interval training.",
        evidence: ["Documented cardiovascular condition requires professional clearance."],
      };
    }
  }

  // 3. Chronic Kidney Disease (CKD) vs High-Protein Dietary Guidance
  if (action.includes("high_protein") || action.includes("protein_load")) {
    const hasCkd = conditions.some((c) => c.includes("ckd") || c.includes("kidney") || c.includes("renal"));
    if (hasCkd) {
      return {
        allowed: false,
        decision: "BLOCKED",
        ruleId: "V0-NUT01-CKD-PROTEIN-LIMIT",
        reason: "Unsupervised high-protein intake is contraindicated in chronic kidney disease without nephrologist-directed macro titration.",
        evidence: ["Chronic kidney disease contraindicates high dietary protein load."],
      };
    }
  }

  return {
    allowed: true,
    decision: "ALLOWED",
    reason: "No safety contraindications or red flags identified for this wellness action.",
    evidence: [],
  };
}
