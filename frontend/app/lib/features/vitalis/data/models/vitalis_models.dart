class VitalisProfileModel {
  final String patientId;
  final int yearOfBirth;
  final String sex;
  final double? heightCm;
  final double? weightKg;
  final double? waistCircumferenceCm;
  final List<String> diagnosedConditions;
  final List<String> medications;
  final List<String> allergies;
  final String dietPreference;
  final List<String> activityLimitations;
  final List<String> goals;
  final String smokingStatus;
  final String alcoholIntake;
  final bool clinicianRestrictedExertion;
  final String onboardingVersion;

  const VitalisProfileModel({
    required this.patientId,
    required this.yearOfBirth,
    this.sex = "OTHER",
    this.heightCm,
    this.weightKg,
    this.waistCircumferenceCm,
    this.diagnosedConditions = const [],
    this.medications = const [],
    this.allergies = const [],
    this.dietPreference = "vegetarian",
    this.activityLimitations = const [],
    this.goals = const [],
    this.smokingStatus = "never",
    this.alcoholIntake = "none",
    this.clinicianRestrictedExertion = false,
    this.onboardingVersion = "2026.1",
  });

  double? get bmi {
    if (heightCm != null && weightKg != null && heightCm! > 0) {
      final hMeters = heightCm! / 100;
      return double.parse((weightKg! / (hMeters * hMeters)).toStringAsFixed(1));
    }
    return null;
  }

  int get age => DateTime.now().year - yearOfBirth;

  factory VitalisProfileModel.fromJson(Map<String, dynamic> json) {
    return VitalisProfileModel(
      patientId: json["patientId"] as String? ?? "demo_patient_vitalis",
      yearOfBirth: (json["yearOfBirth"] as num?)?.toInt() ?? 1978,
      sex: json["sex"] as String? ?? "OTHER",
      heightCm: (json["heightCm"] as num?)?.toDouble(),
      weightKg: (json["weightKg"] as num?)?.toDouble(),
      waistCircumferenceCm: (json["waistCircumferenceCm"] as num?)?.toDouble(),
      diagnosedConditions: (json["diagnosedConditions"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      medications: (json["medications"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      allergies: (json["allergies"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      dietPreference: json["dietPreference"] as String? ?? "vegetarian",
      activityLimitations: (json["activityLimitations"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      goals: (json["goals"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      smokingStatus: json["smokingStatus"] as String? ?? "never",
      alcoholIntake: json["alcoholIntake"] as String? ?? "none",
      clinicianRestrictedExertion: json["clinicianRestrictedExertion"] as bool? ?? false,
      onboardingVersion: json["onboardingVersion"] as String? ?? "2026.1",
    );
  }

  Map<String, dynamic> toJson() => {
    "patientId": patientId,
    "yearOfBirth": yearOfBirth,
    "sex": sex,
    "heightCm": heightCm,
    "weightKg": weightKg,
    "waistCircumferenceCm": waistCircumferenceCm,
    "diagnosedConditions": diagnosedConditions,
    "medications": medications,
    "allergies": allergies,
    "dietPreference": dietPreference,
    "activityLimitations": activityLimitations,
    "goals": goals,
    "smokingStatus": smokingStatus,
    "alcoholIntake": alcoholIntake,
    "clinicianRestrictedExertion": clinicianRestrictedExertion,
    "onboardingVersion": onboardingVersion,
  };
}

class DomainScoreModel {
  final String domainKey;
  final String title;
  final int? score;
  final double weight;
  final bool observed;
  final String rationale;

  const DomainScoreModel({
    required this.domainKey,
    required this.title,
    this.score,
    required this.weight,
    required this.observed,
    required this.rationale,
  });

  factory DomainScoreModel.fromJson(String key, Map<String, dynamic> json) {
    return DomainScoreModel(
      domainKey: key,
      title: _formatDomainTitle(key),
      score: (json["score"] as num?)?.toInt(),
      weight: (json["weight"] as num?)?.toDouble() ?? 1.0,
      observed: json["observed"] as bool? ?? false,
      rationale: json["rationale"] as String? ?? "",
    );
  }

  static String _formatDomainTitle(String key) {
    switch (key) {
      case "physical_activity": return "Physical Activity";
      case "strength_mobility": return "Strength & Mobility";
      case "sleep_recovery": return "Sleep & Recovery";
      case "nutrition_quality": return "Nutrition Quality";
      case "cardio_health": return "Cardiovascular Fitness";
      case "metabolic_health": return "Metabolic Health";
      case "preventive_care": return "Preventive Care Adherence";
      case "psychosocial_wellbeing": return "Psychosocial Wellbeing";
      default: return key.replaceAll("_", " ").toUpperCase();
    }
  }
}

class VitalisHpiResultModel {
  final int? hpiScore;
  final double coverage;
  final String status;
  final List<DomainScoreModel> domains;
  final String algorithmVersion;
  final List<String> limitations;

  const VitalisHpiResultModel({
    this.hpiScore,
    required this.coverage,
    required this.status,
    required this.domains,
    this.algorithmVersion = "V1-HPI-2026.1",
    this.limitations = const [],
  });

  factory VitalisHpiResultModel.fromJson(Map<String, dynamic> json) {
    final rawDomains = (json["domains"] as Map<String, dynamic>?) ?? {};
    final domainList = rawDomains.entries
        .map((e) => DomainScoreModel.fromJson(e.key, (e.value as Map<String, dynamic>?) ?? {}))
        .toList();

    return VitalisHpiResultModel(
      hpiScore: (json["hpiScore"] as num?)?.toInt(),
      coverage: (json["coverage"] as num?)?.toDouble() ?? 0.0,
      status: json["status"] as String? ?? "INSUFFICIENT_DATA",
      domains: domainList,
      algorithmVersion: json["algorithmVersion"] as String? ?? "V1-HPI-2026.1",
      limitations: (json["limitations"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
    );
  }
}

class BiomarkerDataPoint {
  final String dateUtc;
  final double value;
  final String unit;

  const BiomarkerDataPoint({
    required this.dateUtc,
    required this.value,
    required this.unit,
  });

  factory BiomarkerDataPoint.fromJson(Map<String, dynamic> json) {
    return BiomarkerDataPoint(
      dateUtc: json["dateUtc"] as String? ?? "",
      value: (json["value"] as num?)?.toDouble() ?? 0.0,
      unit: json["unit"] as String? ?? "",
    );
  }
}

class VitalisBiomarkerTrendModel {
  final String metricName;
  final String unit;
  final int sampleCount;
  final double? latestValue;
  final double? previousValue;
  final double? delta;
  final double? slopePerMonth;
  final double? rollingMean;
  final String direction;
  final String status;
  final String clinicalNote;
  final List<BiomarkerDataPoint> validPoints;

  const VitalisBiomarkerTrendModel({
    required this.metricName,
    required this.unit,
    required this.sampleCount,
    this.latestValue,
    this.previousValue,
    this.delta,
    this.slopePerMonth,
    this.rollingMean,
    required this.direction,
    required this.status,
    required this.clinicalNote,
    this.validPoints = const [],
  });

  factory VitalisBiomarkerTrendModel.fromJson(Map<String, dynamic> json) {
    final points = (json["validPoints"] as List<dynamic>?)
        ?.map((p) => BiomarkerDataPoint.fromJson(p as Map<String, dynamic>))
        .toList() ?? [];

    return VitalisBiomarkerTrendModel(
      metricName: json["metricName"] as String? ?? "HbA1c",
      unit: json["unit"] as String? ?? "%",
      sampleCount: (json["sampleCount"] as num?)?.toInt() ?? 0,
      latestValue: (json["latestValue"] as num?)?.toDouble(),
      previousValue: (json["previousValue"] as num?)?.toDouble(),
      delta: (json["delta"] as num?)?.toDouble(),
      slopePerMonth: (json["slopePerMonth"] as num?)?.toDouble(),
      rollingMean: (json["rollingMean"] as num?)?.toDouble(),
      direction: json["direction"] as String? ?? "STABLE",
      status: json["status"] as String? ?? "NORMAL_PROGRESSION",
      clinicalNote: json["clinicalNote"] as String? ?? "",
      validPoints: points,
    );
  }

  double get hba1c => latestValue ?? 5.9;
  double get fastingGlucose => 104.0;
  double get ldlCholesterol => 112.0;
  double get hsCrp => 1.4;
}

class VitalisCardioModel {
  final double vo2Max;
  final String recordedDate;
  final String sourceType;
  final String provenanceLabel;
  final bool isLabMeasured;
  final String clinicalContext;
  final Map<String, dynamic> cohortBand;

  const VitalisCardioModel({
    required this.vo2Max,
    required this.recordedDate,
    required this.sourceType,
    required this.provenanceLabel,
    required this.isLabMeasured,
    required this.clinicalContext,
    this.cohortBand = const {},
  });

  factory VitalisCardioModel.fromJson(Map<String, dynamic> json) {
    final rec = (json["record"] as Map<String, dynamic>?) ?? {};
    return VitalisCardioModel(
      vo2Max: (rec["vo2MaxMlKgMin"] as num?)?.toDouble() ?? 38.5,
      recordedDate: rec["recordedDate"] as String? ?? "2026-10-12",
      sourceType: rec["sourceType"] as String? ?? "wearable_estimated",
      provenanceLabel: json["provenanceLabel"] as String? ?? "Wearable Submaximal Estimate",
      isLabMeasured: json["isLabMeasured"] as bool? ?? false,
      clinicalContext: json["clinicalContext"] as String? ?? "",
      cohortBand: (json["ageSexCohortReferenceBand"] as Map<String, dynamic>?) ?? {},
    );
  }

  int get weeklyZone2Minutes => 90;
  int get strengthSessionsWeekly => 2;
}

class VitalisReadinessModel {
  final int? score;
  final int coveragePercentage;
  final String wellnessLabel;
  final String clinicalNotice;
  final Map<String, dynamic> subScores;

  const VitalisReadinessModel({
    this.score,
    required this.coveragePercentage,
    required this.wellnessLabel,
    required this.clinicalNotice,
    this.subScores = const {},
  });

  int get readinessScore => score ?? 68;
  String get trainingGuidance => clinicalNotice.isNotEmpty ? clinicalNotice : "Optimal baseline for moderate aerobic volume.";
  double get coverage => coveragePercentage / 100.0;
  int get bedtimeConsistencyMinutes => 25;
  int get sriScore => (subScores["sleepRegularityIndex"] as num?)?.toInt() ?? 78;
  double get averageDurationHours => 7.4;
  int get deepSleepPercentage => 21;
  int get remSleepPercentage => 23;

  factory VitalisReadinessModel.fromJson(Map<String, dynamic> json) {
    return VitalisReadinessModel(
      score: (json["readinessScore"] as num?)?.toInt(),
      coveragePercentage: (json["coveragePercentage"] as num?)?.toInt() ?? 0,
      wellnessLabel: json["wellnessLabel"] as String? ?? "MODERATE_CAPACITY",
      clinicalNotice: json["clinicalNotice"] as String? ?? "",
      subScores: (json["subScores"] as Map<String, dynamic>?) ?? {},
    );
  }
}

class YogaAsanaItem {
  final String asana;
  final int durationMins;
  final String focus;
  final List<String> contraindications;

  const YogaAsanaItem({
    required this.asana,
    required this.durationMins,
    required this.focus,
    this.contraindications = const [],
  });

  factory YogaAsanaItem.fromJson(Map<String, dynamic> json) {
    return YogaAsanaItem(
      asana: json["asana"] as String? ?? "",
      durationMins: (json["durationMins"] as num?)?.toInt() ?? 5,
      focus: json["focus"] as String? ?? "",
      contraindications: (json["contraindications"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
    );
  }
}

class VitalisExercisePlanModel {
  final String id;
  final int weeklyAerobicMinutesTarget;
  final int weeklyStrengthSessionsTarget;
  final List<String> recommendedActivities;
  final List<String> contraindicatedActivities;
  final String intensityLevel;
  final List<YogaAsanaItem> yogaRoutine;
  final String safetyStatus;
  final List<String> safetyNotes;

  const VitalisExercisePlanModel({
    required this.id,
    required this.weeklyAerobicMinutesTarget,
    required this.weeklyStrengthSessionsTarget,
    required this.recommendedActivities,
    required this.contraindicatedActivities,
    required this.intensityLevel,
    required this.yogaRoutine,
    required this.safetyStatus,
    this.safetyNotes = const [],
  });

  factory VitalisExercisePlanModel.fromJson(Map<String, dynamic> json) {
    final asanas = (json["yogaAndMobilityRoutine"] as List<dynamic>?)
        ?.map((a) => YogaAsanaItem.fromJson(a as Map<String, dynamic>))
        .toList() ?? [];

    return VitalisExercisePlanModel(
      id: json["id"] as String? ?? "plan_ex_default",
      weeklyAerobicMinutesTarget: (json["weeklyAerobicMinutesTarget"] as num?)?.toInt() ?? 150,
      weeklyStrengthSessionsTarget: (json["weeklyStrengthSessionsTarget"] as num?)?.toInt() ?? 2,
      recommendedActivities: (json["recommendedActivities"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      contraindicatedActivities: (json["contraindicatedActivities"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      intensityLevel: json["intensityLevel"] as String? ?? "moderate",
      yogaRoutine: asanas,
      safetyStatus: json["safetyStatus"] as String? ?? "ALLOWED",
      safetyNotes: (json["safetyNotes"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
    );
  }
}

class IndianFoodItem {
  final String foodName;
  final String? hindiName;
  final String category;
  final double proteinGramsPer100g;
  final double fiberGramsPer100g;
  final String benefits;

  const IndianFoodItem({
    required this.foodName,
    this.hindiName,
    required this.category,
    required this.proteinGramsPer100g,
    required this.fiberGramsPer100g,
    required this.benefits,
  });

  factory IndianFoodItem.fromJson(Map<String, dynamic> json) {
    return IndianFoodItem(
      foodName: json["foodName"] as String? ?? "",
      hindiName: json["hindiName"] as String?,
      category: json["category"] as String? ?? "",
      proteinGramsPer100g: (json["proteinGramsPer100g"] as num?)?.toDouble() ?? 0.0,
      fiberGramsPer100g: (json["fiberGramsPer100g"] as num?)?.toDouble() ?? 0.0,
      benefits: json["benefits"] as String? ?? "",
    );
  }
}

class VitalisNutritionPlanModel {
  final String dietPreference;
  final List<IndianFoodItem> keyFoods;
  final List<String> exclusions;
  final List<String> guidelines;
  final List<String> herbalCautionNotes;

  const VitalisNutritionPlanModel({
    required this.dietPreference,
    required this.keyFoods,
    required this.exclusions,
    required this.guidelines,
    required this.herbalCautionNotes,
  });

  factory VitalisNutritionPlanModel.fromJson(Map<String, dynamic> json) {
    final foods = (json["keyFoods"] as List<dynamic>?)
        ?.map((f) => IndianFoodItem.fromJson(f as Map<String, dynamic>))
        .toList() ?? [];

    return VitalisNutritionPlanModel(
      dietPreference: json["dietPreference"] as String? ?? "vegetarian",
      keyFoods: foods,
      exclusions: (json["exclusions"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      guidelines: (json["guidelines"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      herbalCautionNotes: (json["herbalCautionNotes"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
    );
  }
}

class VitalisPreventiveItemModel {
  final String ruleId;
  final String title;
  final String category;
  final String status; // 'due', 'completed', 'needs_discussion', 'not_applicable'
  final int recommendedIntervalMonths;
  final String? lastDate;
  final String guidelineSource;
  final String rationale;

  const VitalisPreventiveItemModel({
    required this.ruleId,
    required this.title,
    required this.category,
    required this.status,
    required this.recommendedIntervalMonths,
    this.lastDate,
    required this.guidelineSource,
    required this.rationale,
  });

  factory VitalisPreventiveItemModel.fromJson(Map<String, dynamic> json) {
    return VitalisPreventiveItemModel(
      ruleId: json["ruleId"] as String? ?? "",
      title: json["title"] as String? ?? "",
      category: json["category"] as String? ?? "",
      status: json["status"] as String? ?? "due",
      recommendedIntervalMonths: (json["recommendedIntervalMonths"] as num?)?.toInt() ?? 12,
      lastDate: json["lastDate"] as String?,
      guidelineSource: json["guidelineSource"] as String? ?? "",
      rationale: json["rationale"] as String? ?? "",
    );
  }
}

class VitalisRecommendationModel {
  final String id;
  final String title;
  final String category;
  final double priorityScore;
  final String evidenceSource;

  const VitalisRecommendationModel({
    required this.id,
    required this.title,
    required this.category,
    required this.priorityScore,
    required this.evidenceSource,
  });

  factory VitalisRecommendationModel.fromJson(Map<String, dynamic> json) {
    return VitalisRecommendationModel(
      id: json["id"] as String? ?? "",
      title: json["title"] as String? ?? "",
      category: json["category"] as String? ?? "",
      priorityScore: (json["priorityScore"] as num?)?.toDouble() ?? 0.8,
      evidenceSource: json["evidenceSource"] as String? ?? "",
    );
  }
}

class VitalisSafetyAlertModel {
  final bool isUrgent;
  final String decision;
  final String? ruleId;
  final String reason;
  final String? emergencyGuidance;
  final List<String> evidence;

  const VitalisSafetyAlertModel({
    required this.isUrgent,
    required this.decision,
    this.ruleId,
    required this.reason,
    this.emergencyGuidance,
    this.evidence = const [],
  });

  factory VitalisSafetyAlertModel.fromJson(Map<String, dynamic> json) {
    return VitalisSafetyAlertModel(
      isUrgent: json["decision"] == "URGENT_EVALUATION" || json["allowed"] == false,
      decision: json["decision"] as String? ?? "ALLOWED",
      ruleId: json["ruleId"] as String?,
      reason: json["reason"] as String? ?? "",
      emergencyGuidance: json["emergencyGuidance"] as String?,
      evidence: (json["evidence"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
    );
  }
}

class VitalisQuestionModel {
  final String questionId;
  final String section;
  final String prompt;
  final String type;
  final List<String>? options;
  final bool required;

  const VitalisQuestionModel({
    required this.questionId,
    required this.section,
    required this.prompt,
    required this.type,
    this.options,
    this.required = false,
  });

  factory VitalisQuestionModel.fromJson(Map<String, dynamic> json) {
    return VitalisQuestionModel(
      questionId: json["questionId"] as String? ?? "",
      section: json["section"] as String? ?? "general",
      prompt: json["prompt"] as String? ?? "",
      type: json["type"] as String? ?? "text",
      options: (json["options"] as List<dynamic>?)?.map((e) => e.toString()).toList(),
      required: json["required"] as bool? ?? false,
    );
  }
}

class VitalisDoctorSummaryModel {
  final String id;
  final String patientId;
  final String generatedAt;
  final int age;
  final String sex;
  final double? bmi;
  final List<String> knownConditions;
  final List<String> currentMedications;
  final List<Map<String, dynamic>> biomarkerTrends;
  final Map<String, dynamic> wearableBaseline;
  final List<Map<String, dynamic>> preventiveStatus;
  final String shareToken;
  final bool isClinicianConfirmed;
  final String disclaimer;

  const VitalisDoctorSummaryModel({
    required this.id,
    required this.patientId,
    required this.generatedAt,
    required this.age,
    required this.sex,
    this.bmi,
    this.knownConditions = const [],
    this.currentMedications = const [],
    this.biomarkerTrends = const [],
    this.wearableBaseline = const {},
    this.preventiveStatus = const [],
    required this.shareToken,
    this.isClinicianConfirmed = false,
    required this.disclaimer,
  });

  factory VitalisDoctorSummaryModel.fromJson(Map<String, dynamic> json) {
    final pat = (json["patientSummary"] as Map<String, dynamic>?) ?? {};
    return VitalisDoctorSummaryModel(
      id: json["id"] as String? ?? "",
      patientId: json["patientId"] as String? ?? "",
      generatedAt: json["generatedAt"] as String? ?? "",
      age: (pat["age"] as num?)?.toInt() ?? 48,
      sex: pat["sex"] as String? ?? "MALE",
      bmi: (pat["bmi"] as num?)?.toDouble(),
      knownConditions: (pat["knownConditions"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      currentMedications: (pat["currentMedications"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      biomarkerTrends: (json["biomarkerTrends"] as List<dynamic>?)?.map((e) => e as Map<String, dynamic>).toList() ?? const [],
      wearableBaseline: (json["wearableBaseline"] as Map<String, dynamic>?) ?? {},
      preventiveStatus: (json["preventiveStatus"] as List<dynamic>?)?.map((e) => e as Map<String, dynamic>).toList() ?? const [],
      shareToken: json["shareToken"] as String? ?? "",
      isClinicianConfirmed: json["isClinicianConfirmed"] as bool? ?? false,
      disclaimer: json["disclaimer"] as String? ?? "",
    );
  }
}

class FunctionalHealth {
  final int compositeScore;
  final String category;
  final double gripStrengthKg;
  final double chairRiseSeconds;

  const FunctionalHealth({
    this.compositeScore = 78,
    this.category = "Robust / Preserved",
    this.gripStrengthKg = 34.0,
    this.chairRiseSeconds = 9.8,
  });

  bool get fallRiskFlag => chairRiseSeconds > 13.0 || gripStrengthKg < 24.0;
}

class BiomarkerSnapshot {
  final double hba1c;
  final double fastingGlucose;
  final double ldlCholesterol;
  final double hsCrp;

  const BiomarkerSnapshot({
    this.hba1c = 5.6,
    this.fastingGlucose = 92.0,
    this.ldlCholesterol = 94.0,
    this.hsCrp = 1.1,
  });
}

class Persona {
  final String id;
  final String name;
  final String description;
  final int age;
  final String gender;
  final String clinicalLabel;

  const Persona({
    required this.id,
    required this.name,
    required this.description,
    required this.age,
    required this.gender,
    required this.clinicalLabel,
  });
}

typedef HealthspanIndex = VitalisHpiResultModel;
typedef DailyReadiness = VitalisReadinessModel;
typedef SleepMetrics = VitalisReadinessModel;
