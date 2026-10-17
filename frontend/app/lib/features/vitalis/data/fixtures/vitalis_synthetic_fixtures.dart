import "../models/vitalis_models.dart";

class VitalisSyntheticPersona implements Persona {
  @override
  final String id;
  @override
  final String name;
  @override
  final String description;
  final VitalisProfileModel profile;
  final VitalisHpiResultModel hpiResult;
  final VitalisBiomarkerTrendModel biomarkerTrend;
  final VitalisCardioModel cardio;
  final VitalisReadinessModel readiness;
  final VitalisExercisePlanModel exercisePlan;
  final VitalisNutritionPlanModel nutritionPlan;
  final List<VitalisPreventiveItemModel> preventiveItems;
  final VitalisSafetyAlertModel? safetyAlert;
  final bool isWearableConnected;

  const VitalisSyntheticPersona({
    required this.id,
    required this.name,
    required this.description,
    required this.profile,
    required this.hpiResult,
    required this.biomarkerTrend,
    required this.cardio,
    required this.readiness,
    required this.exercisePlan,
    required this.nutritionPlan,
    required this.preventiveItems,
    this.safetyAlert,
    this.isWearableConnected = true,
  });

  @override
  int get age => profile.age;

  @override
  String get gender => profile.sex;

  @override
  String get clinicalLabel => description;
}

class VitalisSyntheticFixtures {
  // Persona A — Sedentary 48-year-old vegetarian with pre-diabetes trajectory
  static final VitalisSyntheticPersona personaA = VitalisSyntheticPersona(
    id: "persona_a",
    name: "Persona A (Ramesh, 48)",
    description: "Sedentary vegetarian with climbing HbA1c (5.7→5.9→6.1%), 3,200 steps/day, 6h sleep.",
    profile: const VitalisProfileModel(
      patientId: "pat_synthetic_a",
      yearOfBirth: 1978,
      sex: "MALE",
      heightCm: 172,
      weightKg: 78,
      waistCircumferenceCm: 92,
      diagnosedConditions: ["Pre-diabetes"],
      medications: ["Metformin 500mg"],
      allergies: [],
      dietPreference: "vegetarian",
      activityLimitations: [],
      goals: ["metabolic", "cardio", "energy"],
      smokingStatus: "never",
      alcoholIntake: "none",
      clinicianRestrictedExertion: false,
    ),
    hpiResult: const VitalisHpiResultModel(
      hpiScore: 68,
      coverage: 0.85,
      status: "ADEQUATE_DATA",
      domains: [
        DomainScoreModel(domainKey: "physical_activity", title: "Physical Activity", score: 55, weight: 1.5, observed: true, rationale: "Averaging 3,200 steps/day; below WHO 150 min aerobic benchmark."),
        DomainScoreModel(domainKey: "strength_mobility", title: "Strength & Mobility", score: 60, weight: 1.2, observed: true, rationale: "0 recorded strength sessions last week."),
        DomainScoreModel(domainKey: "sleep_recovery", title: "Sleep & Recovery", score: 68, weight: 1.4, observed: true, rationale: "Average 6.1 hours sleep with moderate schedule consistency."),
        DomainScoreModel(domainKey: "nutrition_quality", title: "Nutrition Quality", score: 75, weight: 1.3, observed: true, rationale: "Traditional vegetarian diet; benefits from higher pulse protein distribution."),
        DomainScoreModel(domainKey: "cardio_health", title: "Cardiovascular Fitness", score: 68, weight: 1.2, observed: true, rationale: "Resting HR 68 bpm; estimated VO2max 36.2 mL/kg/min."),
        DomainScoreModel(domainKey: "metabolic_health", title: "Metabolic Health", score: 58, weight: 1.4, observed: true, rationale: "HbA1c trending upward across last 3 lab encounters (6.1%)."),
        DomainScoreModel(domainKey: "preventive_care", title: "Preventive Care Adherence", score: 85, weight: 1.0, observed: true, rationale: "Annual BP checked; HbA1c screening due for physician follow-up."),
        DomainScoreModel(domainKey: "psychosocial_wellbeing", title: "Psychosocial Wellbeing", score: 75, weight: 1.0, observed: true, rationale: "Normal energy levels; occasional work-related sleep delay."),
      ],
    ),
    biomarkerTrend: const VitalisBiomarkerTrendModel(
      metricName: "HbA1c",
      unit: "%",
      sampleCount: 3,
      latestValue: 6.1,
      previousValue: 5.9,
      delta: 0.2,
      slopePerMonth: 0.04,
      rollingMean: 5.9,
      direction: "INCREASING",
      status: "ELEVATED_ATTENTION",
      clinicalNote: "HbA1c shifted from 5.7% (Oct 2025) to 5.9% (Mar 2026) to 6.1% (Aug 2026). Pre-diabetes range.",
      validPoints: [
        BiomarkerDataPoint(dateUtc: "2025-10-15T09:00:00Z", value: 5.7, unit: "%"),
        BiomarkerDataPoint(dateUtc: "2026-03-10T09:00:00Z", value: 5.9, unit: "%"),
        BiomarkerDataPoint(dateUtc: "2026-08-20T09:00:00Z", value: 6.1, unit: "%"),
      ],
    ),
    cardio: const VitalisCardioModel(
      vo2Max: 36.2,
      recordedDate: "2026-10-12",
      sourceType: "wearable_estimated",
      provenanceLabel: "Wearable GPS/HR Submaximal Estimate",
      isLabMeasured: false,
      clinicalContext: "Gradual 30-minute daily walking suggested to improve aerobic base.",
    ),
    readiness: const VitalisReadinessModel(
      score: 65,
      coveragePercentage: 90,
      wellnessLabel: "MODERATE_CAPACITY",
      clinicalNotice: "Sleep was 6.1h; light aerobic walking recommended today.",
    ),
    exercisePlan: const VitalisExercisePlanModel(
      id: "plan_a",
      weeklyAerobicMinutesTarget: 150,
      weeklyStrengthSessionsTarget: 2,
      recommendedActivities: ["Daily 30-min Brisk Walk", "Chair Squats", "Tadasana & Anulom Vilom"],
      contraindicatedActivities: ["Unaccustomed HIIT"],
      intensityLevel: "moderate",
      yogaRoutine: [
        YogaAsanaItem(asana: "Tadasana", durationMins: 5, focus: "Posture & Joint Balance"),
        YogaAsanaItem(asana: "Vrikshasana (with wall support)", durationMins: 5, focus: "Unilateral Stability"),
      ],
      safetyStatus: "ALLOWED",
    ),
    nutritionPlan: const VitalisNutritionPlanModel(
      dietPreference: "vegetarian",
      keyFoods: [
        IndianFoodItem(foodName: "Sprouted Moong & Chana", hindiName: "अंकुरित मूंग", category: "Legumes", proteinGramsPer100g: 24, fiberGramsPer100g: 16, benefits: "Low glycemic impact, rich in soluble fiber"),
        IndianFoodItem(foodName: "Roasted Makhana", hindiName: "मखाना", category: "Snacks", proteinGramsPer100g: 9.7, fiberGramsPer100g: 14.5, benefits: "Magnesium-rich satiety snack"),
      ],
      exclusions: ["High-glycemic sweets", "Deep-fried farsan"],
      guidelines: ["Combine dals with whole grains like jowar/bajra for balanced amino acids."],
      herbalCautionNotes: ["Avoid unprescribed glycemic herbal powders without physician monitoring."],
    ),
    preventiveItems: const [
      VitalisPreventiveItemModel(ruleId: "PREV-DIABETES-HBA1C", title: "HbA1c Follow-up Consultation", category: "metabolic", status: "due", recommendedIntervalMonths: 6, guidelineSource: "ICMR-INDIAB", rationale: "Climbing HbA1c trajectory warrants clinician discussion."),
      VitalisPreventiveItemModel(ruleId: "PREV-BLOOD-PRESSURE", title: "Annual Blood Pressure Check", category: "cardiovascular", status: "completed", recommendedIntervalMonths: 12, guidelineSource: "AHA", rationale: "BP checked 126/80 mmHg in April 2026."),
    ],
  );

  // Persona B — Older Adult (72yo) with Fall History & WHO ICOPE Focus
  static final VitalisSyntheticPersona personaB = VitalisSyntheticPersona(
    id: "persona_b",
    name: "Persona B (Savitri Devi, 72)",
    description: "Older adult with fall history in past year, WHO ICOPE functional capacity evaluation.",
    profile: const VitalisProfileModel(
      patientId: "pat_synthetic_b",
      yearOfBirth: 1954,
      sex: "FEMALE",
      heightCm: 155,
      weightKg: 58,
      diagnosedConditions: ["Osteopenia", "Mild Osteoarthritis"],
      medications: ["Calcium + Vit D3"],
      dietPreference: "vegetarian",
      activityLimitations: ["Knee pain on climbing stairs"],
      goals: ["mobility", "strength"],
      clinicianRestrictedExertion: true,
    ),
    hpiResult: const VitalisHpiResultModel(
      hpiScore: 71,
      coverage: 0.80,
      status: "ADEQUATE_DATA",
      domains: [
        DomainScoreModel(domainKey: "physical_activity", title: "Physical Activity", score: 62, weight: 1.5, observed: true, rationale: "Gentle daily home walking."),
        DomainScoreModel(domainKey: "strength_mobility", title: "Strength & Mobility", score: 55, weight: 1.2, observed: true, rationale: "Chair rise time 16.2s; fall prevention protocols active."),
        DomainScoreModel(domainKey: "preventive_care", title: "Preventive Care Adherence", score: 90, weight: 1.0, observed: true, rationale: "DEXA scan and bone health screening up to date."),
      ],
    ),
    biomarkerTrend: const VitalisBiomarkerTrendModel(
      metricName: "Serum 25-OH Vitamin D",
      unit: "ng/mL",
      sampleCount: 2,
      latestValue: 34.0,
      previousValue: 22.0,
      delta: 12.0,
      direction: "INCREASING",
      status: "NORMAL_PROGRESSION",
      clinicalNote: "Supplementation has brought 25-OH Vitamin D into adequate reference range.",
    ),
    cardio: const VitalisCardioModel(
      vo2Max: 24.5,
      recordedDate: "2026-09-20",
      sourceType: "wearable_estimated",
      provenanceLabel: "Submaximal Walking Test",
      isLabMeasured: false,
      clinicalContext: "Focus on functional balance and supported walking rather than cardiovascular intensity.",
    ),
    readiness: const VitalisReadinessModel(
      score: 72,
      coveragePercentage: 75,
      wellnessLabel: "MODERATE_CAPACITY",
      clinicalNotice: "Adequate recovery. Maintain gentle mobility routine.",
    ),
    exercisePlan: const VitalisExercisePlanModel(
      id: "plan_b",
      weeklyAerobicMinutesTarget: 100,
      weeklyStrengthSessionsTarget: 2,
      recommendedActivities: ["Assisted Chair Rises", "Wall Pushups", "Seated Ankle Rotations"],
      contraindicatedActivities: ["Floor exercises with sudden transitions", "Unassisted single-leg balance"],
      intensityLevel: "low",
      yogaRoutine: [
        YogaAsanaItem(asana: "Chair Tadasana", durationMins: 5, focus: "Spine & Core Stability"),
        YogaAsanaItem(asana: "Gentle Marjaryasana (Cat-Cow on chair)", durationMins: 6, focus: "Thoracic Mobility"),
      ],
      safetyStatus: "ALLOWED",
      safetyNotes: ["Exercise near a sturdy support bar or chair."],
    ),
    nutritionPlan: const VitalisNutritionPlanModel(
      dietPreference: "vegetarian",
      keyFoods: [
        IndianFoodItem(foodName: "Paneer / Tofu Cubes", hindiName: "पनीर", category: "Dairy", proteinGramsPer100g: 18, fiberGramsPer100g: 0, benefits: "Bioavailable protein and calcium for bone preservation"),
        IndianFoodItem(foodName: "Ragi (Finger Millet) Porridge", hindiName: "रागी", category: "Whole Grains", proteinGramsPer100g: 7.3, fiberGramsPer100g: 11.5, benefits: "Exceptional plant calcium content"),
      ],
      exclusions: ["High-sodium processed snacks"],
      guidelines: ["Ensure 15g protein at each meal to maintain muscle protein synthesis."],
      herbalCautionNotes: ["Check with clinician before adding new herbal tonics."],
    ),
    preventiveItems: const [
      VitalisPreventiveItemModel(ruleId: "PREV-FUNCTIONAL-ICOPE", title: "WHO ICOPE Mobility & Fall Screening", category: "musculoskeletal", status: "completed", recommendedIntervalMonths: 12, guidelineSource: "WHO ICOPE", rationale: "Annual locomotor screening for fall mitigation."),
    ],
  );

  // Persona C — HER + Vitalis User (31yo Female) with Strict Data Isolation
  static final VitalisSyntheticPersona personaC = VitalisSyntheticPersona(
    id: "persona_c",
    name: "Persona C (Ananya, 31)",
    description: "Active AyuSetu HER user; general health telemetry shared with Vitalis while reproductive data remains isolated.",
    profile: const VitalisProfileModel(
      patientId: "pat_synthetic_c",
      yearOfBirth: 1995,
      sex: "FEMALE",
      heightCm: 164,
      weightKg: 59,
      diagnosedConditions: [],
      medications: [],
      dietPreference: "vegetarian",
      goals: ["energy", "cardio", "sleep"],
    ),
    hpiResult: const VitalisHpiResultModel(
      hpiScore: 84,
      coverage: 0.90,
      status: "ADEQUATE_DATA",
      domains: [
        DomainScoreModel(domainKey: "physical_activity", title: "Physical Activity", score: 88, weight: 1.5, observed: true, rationale: "9,400 daily steps; 180 min weekly cardio."),
        DomainScoreModel(domainKey: "sleep_recovery", title: "Sleep & Recovery", score: 82, weight: 1.4, observed: true, rationale: "Consistent 7.4 hours nocturnal sleep."),
      ],
    ),
    biomarkerTrend: const VitalisBiomarkerTrendModel(
      metricName: "Serum Ferritin",
      unit: "ng/mL",
      sampleCount: 2,
      latestValue: 48.0,
      previousValue: 24.0,
      delta: 24.0,
      direction: "INCREASING",
      status: "NORMAL_PROGRESSION",
      clinicalNote: "Iron stores normalized through dietary adjustments.",
    ),
    cardio: const VitalisCardioModel(
      vo2Max: 41.5,
      recordedDate: "2026-10-14",
      sourceType: "wearable_estimated",
      provenanceLabel: "Apple Watch Outdoor Run Estimate",
      isLabMeasured: false,
      clinicalContext: "Cardiorespiratory fitness in top quartile for age-sex cohort.",
    ),
    readiness: const VitalisReadinessModel(
      score: 86,
      coveragePercentage: 95,
      wellnessLabel: "OPTIMAL_READINESS",
      clinicalNotice: "High recovery readiness. Full capacity for planned workout.",
    ),
    exercisePlan: const VitalisExercisePlanModel(
      id: "plan_c",
      weeklyAerobicMinutesTarget: 180,
      weeklyStrengthSessionsTarget: 3,
      recommendedActivities: ["Running", "Dumbbell Resistance Training", "Vinyasa Flow"],
      contraindicatedActivities: [],
      intensityLevel: "moderate",
      yogaRoutine: [
        YogaAsanaItem(asana: "Surya Namaskar (6 cycles)", durationMins: 10, focus: "Full Body Dynamic Mobility"),
      ],
      safetyStatus: "ALLOWED",
    ),
    nutritionPlan: const VitalisNutritionPlanModel(
      dietPreference: "vegetarian",
      keyFoods: [
        IndianFoodItem(foodName: "Methi (Fenugreek) & Palak", hindiName: "मेथी व पालक", category: "Greens", proteinGramsPer100g: 4.4, fiberGramsPer100g: 3.2, benefits: "Non-heme iron and folate"),
      ],
      exclusions: [],
      guidelines: ["Pair iron-rich greens with vitamin C (lemon juice) to enhance absorption."],
      herbalCautionNotes: [],
    ),
    preventiveItems: const [],
  );

  // Persona D — Disconnected Wearables (Manual Telemetry Only)
  static final VitalisSyntheticPersona personaD = VitalisSyntheticPersona(
    id: "persona_d",
    name: "Persona D (Vikram, 39)",
    description: "No wearable connected; manual entry only. Demonstrates honest INSUFFICIENT_DATA states without fabricated readiness.",
    isWearableConnected: false,
    profile: const VitalisProfileModel(
      patientId: "pat_synthetic_d",
      yearOfBirth: 1987,
      sex: "MALE",
      dietPreference: "mixed",
      goals: ["sleep", "stress"],
    ),
    hpiResult: const VitalisHpiResultModel(
      hpiScore: null,
      coverage: 0.25,
      status: "INSUFFICIENT_DATA",
      domains: [
        DomainScoreModel(domainKey: "physical_activity", title: "Physical Activity", score: null, weight: 1.5, observed: false, rationale: "No wearable telemetry or manual logs recorded."),
        DomainScoreModel(domainKey: "sleep_recovery", title: "Sleep & Recovery", score: null, weight: 1.4, observed: false, rationale: "No sleep tracking stream connected."),
      ],
      limitations: ["Insufficient observation streams. Connect a wearable or log manual habits to calibrate progress."],
    ),
    biomarkerTrend: const VitalisBiomarkerTrendModel(
      metricName: "Fasting Glucose",
      unit: "mg/dL",
      sampleCount: 1,
      latestValue: 94.0,
      direction: "INSUFFICIENT_DATA",
      status: "NORMAL_PROGRESSION",
      clinicalNote: "Single test logged. Minimum 2 chronological tests needed to track rate-of-change.",
    ),
    cardio: const VitalisCardioModel(
      vo2Max: 0,
      recordedDate: "None",
      sourceType: "model_estimated",
      provenanceLabel: "No Measurement Available",
      isLabMeasured: false,
      clinicalContext: "Connect Apple Health / Health Connect or perform a submaximal Cooper walk test to record fitness.",
    ),
    readiness: const VitalisReadinessModel(
      score: null,
      coveragePercentage: 0,
      wellnessLabel: "MODERATE_CAPACITY",
      clinicalNotice: "Readiness score unavailable: no continuous HRV or sleep interval data.",
    ),
    exercisePlan: const VitalisExercisePlanModel(
      id: "plan_d",
      weeklyAerobicMinutesTarget: 150,
      weeklyStrengthSessionsTarget: 2,
      recommendedActivities: ["Brisk Walking", "Stair Climbing"],
      contraindicatedActivities: [],
      intensityLevel: "moderate",
      yogaRoutine: [],
      safetyStatus: "ALLOWED",
    ),
    nutritionPlan: const VitalisNutritionPlanModel(
      dietPreference: "mixed",
      keyFoods: [],
      exclusions: [],
      guidelines: ["Log your daily water intake and meal frequency."],
      herbalCautionNotes: [],
    ),
    preventiveItems: const [],
  );

  // Persona E — Clinical Contraindication (Cardiac Restriction vs HIIT)
  static final VitalisSyntheticPersona personaE = VitalisSyntheticPersona(
    id: "persona_e",
    name: "Persona E (Karan, 55)",
    description: "Documented coronary stent & active exertion restriction; V0 Safety Gate intercepts high-intensity actions.",
    profile: const VitalisProfileModel(
      patientId: "pat_synthetic_e",
      yearOfBirth: 1971,
      sex: "MALE",
      diagnosedConditions: ["Coronary Artery Disease (CAD)", "Hypertension"],
      medications: ["Aspirin 75mg", "Atorvastatin 40mg", "Metoprolol 25mg"],
      clinicianRestrictedExertion: true,
      activityLimitations: ["No vigorous exertion above 120 bpm heart rate"],
      goals: ["cardio"],
    ),
    safetyAlert: const VitalisSafetyAlertModel(
      isUrgent: true,
      decision: "BLOCKED",
      ruleId: "V0-EX01-CLINICIAN-RESTRICTION",
      reason: "High-intensity interval training (HIIT 4x4) is contraindicated. Active clinician cardiac restriction recorded.",
      emergencyGuidance: "Consult your cardiologist before attempting any vigorous physical exertion.",
      evidence: ["Cardiovascular condition with active clinical exertion limit."],
    ),
    hpiResult: const VitalisHpiResultModel(
      hpiScore: 64,
      coverage: 0.85,
      status: "ADEQUATE_DATA",
      domains: [
        DomainScoreModel(domainKey: "cardio_health", title: "Cardiovascular Fitness", score: 50, weight: 1.2, observed: true, rationale: "Beta-blocker therapy dampens HR response. Supervised cardiac rehab indicated."),
      ],
    ),
    biomarkerTrend: const VitalisBiomarkerTrendModel(
      metricName: "LDL Cholesterol",
      unit: "mg/dL",
      sampleCount: 3,
      latestValue: 68.0,
      previousValue: 92.0,
      delta: -24.0,
      direction: "DECREASING",
      status: "NORMAL_PROGRESSION",
      clinicalNote: "Statin therapy achieving secondary prevention target (<70 mg/dL).",
    ),
    cardio: const VitalisCardioModel(
      vo2Max: 29.0,
      recordedDate: "2026-08-10",
      sourceType: "lab_measured",
      provenanceLabel: "Hospital Bruce Protocol Submaximal Stress Test",
      isLabMeasured: true,
      clinicalContext: "Monitored treadmill ECG protocol completed under cardiologist supervision.",
    ),
    readiness: const VitalisReadinessModel(
      score: 60,
      coveragePercentage: 80,
      wellnessLabel: "REST_RECOVERY",
      clinicalNotice: "Pacing advised. Avoid sudden heart rate spikes.",
    ),
    exercisePlan: const VitalisExercisePlanModel(
      id: "plan_e",
      weeklyAerobicMinutesTarget: 120,
      weeklyStrengthSessionsTarget: 0,
      recommendedActivities: ["Level Ground Walking", "Deep Diaphragmatic Breathing"],
      contraindicatedActivities: ["Norwegian 4x4 HIIT", "Heavy Valsalva Weightlifting"],
      intensityLevel: "low",
      yogaRoutine: [
        YogaAsanaItem(asana: "Shavasana & Gentle Pranayama", durationMins: 10, focus: "Parasympathetic Activation"),
      ],
      safetyStatus: "BLOCKED",
      safetyNotes: ["High intensity protocols blocked by V0 Safety Gate."],
    ),
    nutritionPlan: const VitalisNutritionPlanModel(
      dietPreference: "vegetarian",
      keyFoods: [],
      exclusions: ["High saturated fat foods"],
      guidelines: ["Maintain low-sodium DASH pattern (<2000mg sodium daily)."],
      herbalCautionNotes: ["Avoid Guggulu or licorice which may interact with cardiovascular medications."],
    ),
    preventiveItems: const [],
  );

  static final List<VitalisSyntheticPersona> allPersonas = [
    personaA,
    personaB,
    personaC,
    personaD,
    personaE,
  ];
}
