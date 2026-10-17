export interface PreventiveProfileInput {
  age: number;
  sex: "MALE" | "FEMALE" | "OTHER";
  diagnosedConditions: string[];
  familyHistory: string[];
  lastCompletedDates: Record<string, string>; // ruleId -> YYYY-MM-DD
}

export interface PreventiveRuleEvaluation {
  ruleId: string;
  title: string;
  category:
    | "metabolic"
    | "cardiovascular"
    | "cancer_screening"
    | "musculoskeletal"
    | "immunization";
  status:
    | "due"
    | "completed"
    | "needs_discussion"
    | "not_applicable"
    | "unknown";
  recommendedIntervalMonths: number;
  lastDate?: string;
  dueDate?: string;
  guidelineSource: string;
  rationale: string;
}

/**
 * V13 — Preventive-Care Eligibility Engine
 * Evidence-based screening schedule mapping based on national and global clinical guidelines.
 */
export function vitalisPreventiveEligibility(
  profile: PreventiveProfileInput,
): PreventiveRuleEvaluation[] {
  const evaluations: PreventiveRuleEvaluation[] = [];
  const now = new Date();

  function monthsSince(dateStr?: string): number {
    if (!dateStr) return 9999;
    const d = new Date(dateStr);
    return Math.max(
      0,
      (now.getFullYear() - d.getFullYear()) * 12 +
        (now.getMonth() - d.getMonth()),
    );
  }

  // 1. Diabetes / HbA1c Screening
  const hasPreDiabetes = profile.diagnosedConditions.some(
    (c) =>
      c.toLowerCase().includes("prediabetes") ||
      c.toLowerCase().includes("pre-diabetes"),
  );
  const familyDiabetes = profile.familyHistory.some((f) =>
    f.toLowerCase().includes("diabetes"),
  );
  const diabetesInterval = hasPreDiabetes ? 12 : 36; // 1 year for prediabetes, 3 years standard
  const eligibleDiabetes =
    profile.age >= 35 || familyDiabetes || hasPreDiabetes;

  if (eligibleDiabetes) {
    const lastDate = profile.lastCompletedDates["PREV-DIABETES-HBA1C"];
    const m = monthsSince(lastDate);
    evaluations.push({
      ruleId: "PREV-DIABETES-HBA1C",
      title: "Glycated Hemoglobin (HbA1c) / Fasting Glucose",
      category: "metabolic",
      status: m >= diabetesInterval ? "due" : "completed",
      recommendedIntervalMonths: diabetesInterval,
      lastDate,
      guidelineSource: "ICMR-INDIAB & ADA Standards of Care (2026)",
      rationale: hasPreDiabetes
        ? "Annual HbA1c tracking recommended for documented pre-diabetes."
        : "Periodic metabolic screening for adults age ≥35 or family history.",
    });
  }

  // 2. Blood Pressure Check
  const lastBp = profile.lastCompletedDates["PREV-BLOOD-PRESSURE"];
  const bpMonths = monthsSince(lastBp);
  evaluations.push({
    ruleId: "PREV-BLOOD-PRESSURE",
    title: "Clinical Blood Pressure Screening",
    category: "cardiovascular",
    status: bpMonths >= 12 ? "due" : "completed",
    recommendedIntervalMonths: 12,
    lastDate: lastBp,
    guidelineSource: "AHA / Indian Society of Hypertension Guidelines",
    rationale:
      "Annual professional blood pressure screening recommended for all adults.",
  });

  // 3. Lipid Profile
  const eligibleLipid =
    profile.age >= (profile.sex === "MALE" ? 35 : 40) ||
    profile.familyHistory.includes("cad");
  if (eligibleLipid) {
    const lastLipid = profile.lastCompletedDates["PREV-LIPID-PANEL"];
    const lipidMonths = monthsSince(lastLipid);
    evaluations.push({
      ruleId: "PREV-LIPID-PANEL",
      title:
        "Comprehensive Lipid Profile (Cholesterol, LDL, HDL, Triglycerides)",
      category: "cardiovascular",
      status: lipidMonths >= 36 ? "due" : "completed",
      recommendedIntervalMonths: 36,
      lastDate: lastLipid,
      guidelineSource: "AHA / NLA Primary Prevention of Atherosclerotic CVD",
      rationale:
        "Fasting lipid panel to assess cardiovascular atherogenic risk.",
    });
  }

  // 4. Functional Mobility & Fall Risk (Age 60+)
  if (profile.age >= 60) {
    const lastFunctional = profile.lastCompletedDates["PREV-FUNCTIONAL-ICOPE"];
    const funcMonths = monthsSince(lastFunctional);
    evaluations.push({
      ruleId: "PREV-FUNCTIONAL-ICOPE",
      title: "WHO ICOPE Functional Capacity & Fall Risk Assessment",
      category: "musculoskeletal",
      status: funcMonths >= 12 ? "due" : "completed",
      recommendedIntervalMonths: 12,
      lastDate: lastFunctional,
      guidelineSource: "WHO Integrated Care for Older People (ICOPE)",
      rationale:
        "Annual locomotor and balance check to prevent accidental falls and preserve independence.",
    });
  }

  return evaluations;
}
