/**
 * AyuSetu HER — Algorithm A0: Deterministic Safety Gate
 * Evaluates immediate red-flag patterns BEFORE any recommendation or LLM generation.
 * Clinically grounded rule-based emergency triage.
 */

export interface SafetyCheckInput {
  isPregnantOrPossible?: boolean;
  pelvicPainSeverity?: number; // 0-10
  suddenSeverePain?: boolean;
  heavyBleedingWithDizziness?: boolean;
  faintingOrSyncope?: boolean;
  severeShortnessOfBreath?: boolean;
  selfHarmIdeation?: boolean;
  bleedingBetweenPeriods?: boolean;
}

export interface SafetyCheckResult {
  isUrgent: boolean;
  category: "URGENT_REVIEW" | "NORMAL";
  ruleId: string | null;
  emergencyGuidance: string | null;
  evidence: string[];
  suppressWellnessAdvice: boolean;
  timestamp: string;
}

export function herSafetyGate(input: SafetyCheckInput): SafetyCheckResult {
  const evidence: string[] = [];
  const now = new Date().toISOString();

  // Red-flag 1: Possible pregnancy + pelvic pain or acute bleeding
  if (
    input.isPregnantOrPossible &&
    ((input.pelvicPainSeverity ?? 0) >= 5 ||
      input.suddenSeverePain ||
      input.bleedingBetweenPeriods)
  ) {
    evidence.push(
      "Possible pregnancy reported alongside moderate/severe pelvic pain or unexpected bleeding (Rule A0-OB01)",
    );
    return {
      isUrgent: true,
      category: "URGENT_REVIEW",
      ruleId: "A0-OB01-ECTOPIC-TRIAGE",
      emergencyGuidance:
        "URGENT: Possible pregnancy combined with pelvic pain or bleeding requires immediate in-person gynecological/emergency assessment to rule out ectopic pregnancy.",
      evidence,
      suppressWellnessAdvice: true,
      timestamp: now,
    };
  }

  // Red-flag 2: Sudden acute severe pelvic pain
  if ((input.pelvicPainSeverity ?? 0) >= 8 || input.suddenSeverePain) {
    evidence.push(
      "Acute severe pelvic pain reported (severity >= 8/10 or sudden onset) (Rule A0-GYN02)",
    );
    return {
      isUrgent: true,
      category: "URGENT_REVIEW",
      ruleId: "A0-GYN02-ACUTE-ABDOMEN",
      emergencyGuidance:
        "URGENT: Sudden or severe pelvic pain warrants immediate clinical evaluation at an emergency clinic to rule out acute causes like ovarian torsion or rupture.",
      evidence,
      suppressWellnessAdvice: true,
      timestamp: now,
    };
  }

  // Red-flag 3: Heavy bleeding with syncope / severe dizziness
  if (input.heavyBleedingWithDizziness || input.faintingOrSyncope) {
    evidence.push(
      "Severe menstrual hemorrhage with fainting or orthostatic dizziness (Rule A0-HEM03)",
    );
    return {
      isUrgent: true,
      category: "URGENT_REVIEW",
      ruleId: "A0-HEM03-HEAVY-SYNCOPE",
      emergencyGuidance:
        "URGENT: Rapid blood loss accompanied by fainting, near-syncope, or lightheadedness requires immediate emergency medical resuscitation and fluid support.",
      evidence,
      suppressWellnessAdvice: true,
      timestamp: now,
    };
  }

  // Red-flag 4: Severe shortness of breath or collapse
  if (input.severeShortnessOfBreath) {
    evidence.push("Acute severe respiratory distress reported (Rule A0-RES04)");
    return {
      isUrgent: true,
      category: "URGENT_REVIEW",
      ruleId: "A0-RES04-DYSPNEA",
      emergencyGuidance:
        "URGENT: Severe breathlessness requires immediate emergency medical evaluation.",
      evidence,
      suppressWellnessAdvice: true,
      timestamp: now,
    };
  }

  // Red-flag 5: Self-harm or crisis ideation
  if (input.selfHarmIdeation) {
    evidence.push(
      "Mental health crisis or self-harm risk reported (Rule A0-PSY05)",
    );
    return {
      isUrgent: true,
      category: "URGENT_REVIEW",
      ruleId: "A0-PSY05-CRISIS",
      emergencyGuidance:
        "URGENT: If you are experiencing thoughts of self-harm, please reach out to emergency psychiatric support (National Tele-MANAS: 14416 or KIRAN: 1800-599-0019) immediately.",
      evidence,
      suppressWellnessAdvice: true,
      timestamp: now,
    };
  }

  return {
    isUrgent: false,
    category: "NORMAL",
    ruleId: null,
    emergencyGuidance: null,
    evidence: [],
    suppressWellnessAdvice: false,
    timestamp: now,
  };
}
