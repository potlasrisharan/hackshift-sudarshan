/**
 * AyuSetu HER — Algorithm A2: Deterministic Screening Evidence Engine
 * Evidence-based evaluation generating routing categories without diagnostic claims.
 * Strictly non-diagnostic; no arbitrary probabilities; transparent evidence mapping.
 */

import { HerScreeningFinding } from "../../shared/her_contracts";
import { herSafetyGate, SafetyCheckInput } from "./safety_gate";

export interface PatientScreeningContext {
  patientId: string;
  age: number;
  yearsSinceMenarche?: number;
  isPregnantOrLactating?: boolean;
  hormonalContraception?: boolean | string;
  cycleStats?: {
    hasIrregularity: boolean;
    longestCycle?: number | null;
    hasAmenorrhea?: boolean;
  };
  answers: Record<string, any>;
  verifiedLabs?: {
    tsh?: number;
    hba1c?: number;
    hemoglobin?: number;
    ferritin?: number;
    totalTestosterone?: number;
  };
}

export function herScreeningEngine(context: PatientScreeningContext): HerScreeningFinding[] {
  const ruleVersion = "A2-SCREEN-2026.1";
  const findings: HerScreeningFinding[] = [];

  // Step 1: Execute Safety Gate first
  const isPregnant = context.isPregnantOrLactating || context.answers["C03"] === "yes" || context.answers["B10"] === "yes";
  const typicalPain = context.answers["E01"] ?? context.answers["C11"] ?? 0;
  const isSuddenAcutePain = context.answers["E11"] === "yes";

  const safetyInput: SafetyCheckInput = {
    isPregnantOrPossible: isPregnant,
    // Only escalate typical cramp severity to acute emergency triage if sudden onset is affirmed or possible pregnancy
    pelvicPainSeverity: (isPregnant || isSuddenAcutePain) ? typicalPain : 0,
    suddenSeverePain: isSuddenAcutePain,
    heavyBleedingWithDizziness: context.answers["B06"] === "yes",
    faintingOrSyncope: context.answers["B06"] === "yes",
    severeShortnessOfBreath: context.answers["B07"] === "yes",
    selfHarmIdeation: context.answers["M09"] === "crisis",
    bleedingBetweenPeriods: context.answers["B05"] === "yes",
  };

  const safetyResult = herSafetyGate(safetyInput);
  if (safetyResult.isUrgent) {
    findings.push({
      domain: "HEAVY_BLEEDING_ANEMIA",
      category: "URGENT_REVIEW",
      isDiagnosis: false,
      title: "Urgent Clinical Review Required",
      rationale: safetyResult.emergencyGuidance ?? "Acute symptoms flagged by safety gate.",
      supportingEvidence: safetyResult.evidence.map((e) => ({ source: "safety_gate", label: e, verified: false })),
      missingInformation: ["Immediate in-person physical assessment"],
      limitations: ["Remote screening cannot substitute for in-person emergency triage."],
      ruleVersion,
      suggestedAction: "Seek immediate emergency or urgent gynecological medical attention.",
    });
    return findings;
  }

  const isAdolescent = context.age < 19 || (context.yearsSinceMenarche ?? 5) < 3;

  // ----------------------------------------------------
  // Domain 1: PCOS Features Screening
  // ----------------------------------------------------
  const pcosEvidence: { source: string; label: string; verified: boolean }[] = [];
  const pcosMissing: string[] = [];

  const hasCycleIrregularity =
    context.cycleStats?.hasIrregularity ||
    context.answers["P01"] === "yes" ||
    context.answers["P02"] === "yes" ||
    context.answers["C07"] === ">35" ||
    context.answers["C08"] === "<6";

  const hasHyperandrogenism =
    context.answers["P05"] === "yes" || // Coarse facial hair
    context.answers["P06"] === "yes" || // Body hair
    (context.answers["P03"] === "moderate" || context.answers["P03"] === "severe") || // Significant acne
    context.answers["P07"] === "yes"; // Scalp thinning

  if (hasCycleIrregularity) {
    pcosEvidence.push({
      source: "cycle_history",
      label: "Chronological menstrual cycle irregularity or gap >35 days",
      verified: false,
    });
  }

  if (hasHyperandrogenism) {
    pcosEvidence.push({
      source: "symptom_report",
      label: "Self-reported features consistent with hyperandrogenism (acne, hirsutism, or hair thinning)",
      verified: false,
    });
  }

  if (context.verifiedLabs?.totalTestosterone && context.verifiedLabs.totalTestosterone > 70) {
    pcosEvidence.push({
      source: "laboratory",
      label: `Verified serum total testosterone elevation (${context.verifiedLabs.totalTestosterone} ng/dL)`,
      verified: true,
    });
  }

  pcosMissing.push("Clinical laboratory exclusion of thyroid, prolactin, and adrenal causes");
  pcosMissing.push("In-person clinical physical examination and pelvic history");

  if (isAdolescent) {
    findings.push({
      domain: "PCOS_FEATURES",
      category: "MONITOR_AND_TRACK",
      isDiagnosis: false,
      title: "Adolescent Ovulatory Maturation",
      rationale: "During the first 2-3 years post-menarche, anovulatory cycles are common. Adult diagnostic thresholds and pelvic ultrasounds cannot be applied.",
      supportingEvidence: pcosEvidence,
      missingInformation: pcosMissing,
      limitations: ["International guidelines prohibit using ovarian ultrasound as diagnostic criteria in adolescents."],
      ruleVersion,
      suggestedAction: "Continue tracking cycle intervals for longitudinal pattern observation.",
    });
  } else if (hasCycleIrregularity && hasHyperandrogenism) {
    findings.push({
      domain: "PCOS_FEATURES",
      category: "CLINICAL_REVIEW_SUGGESTED",
      isDiagnosis: false,
      title: "Consider Discussing These Patterns with a Clinician",
      rationale: "Reported combination of irregular cycles and hyperandrogenic features aligns with patterns that warrant comprehensive clinical evaluation.",
      supportingEvidence: pcosEvidence,
      missingInformation: pcosMissing,
      limitations: ["Self-reported symptoms alone cannot establish or rule out PCOS. A formal diagnosis requires clinical evaluation and alternative cause exclusions."],
      ruleVersion,
      suggestedAction: "Generate a Doctor-Ready Clinical Summary for consultation with an OB/GYN or endocrinologist.",
    });
  } else if (hasCycleIrregularity || hasHyperandrogenism) {
    findings.push({
      domain: "PCOS_FEATURES",
      category: "MONITOR_AND_TRACK",
      isDiagnosis: false,
      title: "Isolated Features Noted — Ongoing Monitoring Advised",
      rationale: "Isolated cycle irregularity or dermatological signs do not meet the criteria for clinical review on their own.",
      supportingEvidence: pcosEvidence,
      missingInformation: pcosMissing,
      limitations: ["Single symptoms are non-specific."],
      ruleVersion,
      suggestedAction: "Log cycles and symptoms for 3 consecutive months to assess stability.",
    });
  } else {
    findings.push({
      domain: "PCOS_FEATURES",
      category: "NO_CURRENT_SCREENING_FLAGS",
      isDiagnosis: false,
      title: "No Typical PCOS Screening Flags Identified",
      rationale: "Cycles and symptom entries reflect standard physiological parameters.",
      supportingEvidence: [],
      missingInformation: [],
      limitations: ["Screening check-in is informational."],
      ruleVersion,
      suggestedAction: "Maintain healthy routine check-ins.",
    });
  }

  // ----------------------------------------------------
  // Domain 2: Endometriosis / Pelvic Pain
  // ----------------------------------------------------
  const endoEvidence: { source: string; label: string; verified: boolean }[] = [];
  const painScore = context.answers["E01"] ?? context.answers["C11"] ?? 0;
  const missesWork = context.answers["E02"] === "often" || context.answers["C12"] === "often";
  const cyclicBowelPain = context.answers["E05"] === "yes";
  const painOutsideMenses = context.answers["E04"] === "yes";

  if (painScore >= 7) {
    endoEvidence.push({
      source: "pain_score",
      label: `Severe period pain reported (${painScore}/10)`,
      verified: false,
    });
  }
  if (missesWork) {
    endoEvidence.push({
      source: "lifestyle_impact",
      label: "Pain causes frequent disruption to work, school, or daily function",
      verified: false,
    });
  }
  if (cyclicBowelPain || painOutsideMenses) {
    endoEvidence.push({
      source: "pain_symptoms",
      label: "Non-menstrual pelvic discomfort or cyclic bowel/urinary pain",
      verified: false,
    });
  }

  if (endoEvidence.length >= 2) {
    findings.push({
      domain: "ENDOMETRIOSIS_PELVIC_PAIN",
      category: "CLINICAL_REVIEW_SUGGESTED",
      isDiagnosis: false,
      title: "Pelvic Pain Evaluation Recommended",
      rationale: "Recurrent dysmenorrhea interfering with daily function alongside non-menstrual or cyclic gastrointestinal pain warrants structured clinical investigation.",
      supportingEvidence: endoEvidence,
      missingInformation: ["Clinical pelvic ultrasound/MRI", "Surgical/laparoscopic history", "Response to first-line NSAIDs"],
      limitations: ["Pelvic pain has multiple benign and clinical etiologies; definitive evaluation requires clinician workup."],
      ruleVersion,
      suggestedAction: "Schedule a pelvic health review with an OB/GYN specialist.",
    });
  }

  // ----------------------------------------------------
  // Domain 3: Heavy Bleeding & Anemia Flags
  // ----------------------------------------------------
  const bleedingEvidence: { source: string; label: string; verified: boolean }[] = [];
  const rapidSoaking = context.answers["B03"] === "yes";
  const prolongedBleeding = (context.answers["B01"] ?? context.answers["C09"] ?? 0) > 7;
  const fatigue = context.answers["B08"] === "yes" || context.answers["T02"] === "yes";

  if (rapidSoaking) bleedingEvidence.push({ source: "flow_pattern", label: "Flooding/soaking menstrual products in <2 hours", verified: false });
  if (prolongedBleeding) bleedingEvidence.push({ source: "flow_duration", label: "Menstrual bleeding duration exceeding 7 days", verified: false });
  if (fatigue) bleedingEvidence.push({ source: "symptom", label: "Persistent fatigue and lethargy", verified: false });

  if (context.verifiedLabs?.hemoglobin && context.verifiedLabs.hemoglobin < 11.0) {
    bleedingEvidence.push({
      source: "laboratory",
      label: `Verified low hemoglobin level (${context.verifiedLabs.hemoglobin} g/dL)`,
      verified: true,
    });
  }

  if (bleedingEvidence.length >= 2) {
    findings.push({
      domain: "HEAVY_BLEEDING_ANEMIA",
      category: "CLINICAL_REVIEW_SUGGESTED",
      isDiagnosis: false,
      title: "Heavy Menstrual Bleeding & Iron Evaluation Advised",
      rationale: "Bleeding volume or duration pattern alongside fatigue or low hemoglobin requires hematologic and gynecologic evaluation.",
      supportingEvidence: bleedingEvidence,
      missingInformation: ["Recent Complete Blood Count (CBC) and serum Ferritin"],
      limitations: ["Product soaking counts are subjective indicators; formal clinical diagnosis requires lab corroboration."],
      ruleVersion,
      suggestedAction: "Request a Complete Blood Count (CBC) and discuss iron status with your healthcare provider.",
    });
  }

  return findings;
}
