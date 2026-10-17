import "package:flutter/foundation.dart";

@immutable
class HerProfileModel {
  final String patientId;
  final int yearOfBirth;
  final int? menarcheAge;
  final bool isPregnantOrLactating;
  final bool hormonalContraception;
  final String dietPreference;
  final List<String> allergies;
  final List<String> lifestyleGoals;

  const HerProfileModel({
    required this.patientId,
    required this.yearOfBirth,
    this.menarcheAge,
    this.isPregnantOrLactating = false,
    this.hormonalContraception = false,
    this.dietPreference = "vegetarian",
    this.allergies = const [],
    this.lifestyleGoals = const [],
  });

  int get age => DateTime.now().year - yearOfBirth;

  factory HerProfileModel.fromJson(Map<String, Object?> json) {
    return HerProfileModel(
      patientId: json["patientId"] as String? ?? "demo_patient_her",
      yearOfBirth: (json["yearOfBirth"] as num?)?.toInt() ?? 1999,
      menarcheAge: (json["menarcheAge"] as num?)?.toInt(),
      isPregnantOrLactating: json["isPregnantOrLactating"] as bool? ?? false,
      hormonalContraception: json["hormonalContraception"] as bool? ?? false,
      dietPreference: json["dietPreference"] as String? ?? "vegetarian",
      allergies: (json["allergies"] as List<Object?>?)?.cast<String>() ?? const [],
      lifestyleGoals: (json["lifestyleGoals"] as List<Object?>?)?.cast<String>() ?? const [],
    );
  }

  Map<String, Object?> toJson() => {
        "patientId": patientId,
        "yearOfBirth": yearOfBirth,
        "menarcheAge": menarcheAge,
        "isPregnantOrLactating": isPregnantOrLactating,
        "hormonalContraception": hormonalContraception,
        "dietPreference": dietPreference,
        "allergies": allergies,
        "lifestyleGoals": lifestyleGoals,
      };
}

@immutable
class HerCycleModel {
  final String id;
  final String startDate;
  final String? endDate;
  final int? cycleLengthDays;
  final int? periodLengthDays;
  final String flowIntensity;
  final int crampsSeverity;
  final String? notes;

  const HerCycleModel({
    required this.id,
    required this.startDate,
    this.endDate,
    this.cycleLengthDays,
    this.periodLengthDays,
    this.flowIntensity = "medium",
    this.crampsSeverity = 0,
    this.notes,
  });

  factory HerCycleModel.fromJson(Map<String, Object?> json) {
    return HerCycleModel(
      id: json["id"] as String? ?? "",
      startDate: json["startDate"] as String? ?? "",
      endDate: json["endDate"] as String?,
      cycleLengthDays: (json["cycleLengthDays"] as num?)?.toInt(),
      periodLengthDays: (json["periodLengthDays"] as num?)?.toInt(),
      flowIntensity: json["flowIntensity"] as String? ?? "medium",
      crampsSeverity: (json["crampsSeverity"] as num?)?.toInt() ?? 0,
      notes: json["notes"] as String?,
    );
  }

  Map<String, Object?> toJson() => {
        "id": id,
        "startDate": startDate,
        "endDate": endDate,
        "cycleLengthDays": cycleLengthDays,
        "periodLengthDays": periodLengthDays,
        "flowIntensity": flowIntensity,
        "crampsSeverity": crampsSeverity,
        "notes": notes,
      };
}

@immutable
class HerCycleAnalysisModel {
  final String status;
  final int totalIntervals;
  final double? meanLengthDays;
  final double? stdDevDays;
  final int? medianLengthDays;
  final int? shortestCycleDays;
  final int? longestCycleDays;
  final String? predictedNextWindowStart;
  final String? predictedNextWindowEnd;
  final bool hasIrregularity;
  final bool hasAmenorrhea;
  final List<String> irregularityFlags;
  final List<String> caveats;

  const HerCycleAnalysisModel({
    this.status = "INSUFFICIENT_DATA",
    this.totalIntervals = 0,
    this.meanLengthDays,
    this.stdDevDays,
    this.medianLengthDays,
    this.shortestCycleDays,
    this.longestCycleDays,
    this.predictedNextWindowStart,
    this.predictedNextWindowEnd,
    this.hasIrregularity = false,
    this.hasAmenorrhea = false,
    this.irregularityFlags = const [],
    this.caveats = const [],
  });

  factory HerCycleAnalysisModel.fromJson(Map<String, Object?> json) {
    return HerCycleAnalysisModel(
      status: json["status"] as String? ?? "INSUFFICIENT_DATA",
      totalIntervals: (json["totalIntervals"] as num?)?.toInt() ?? 0,
      meanLengthDays: (json["meanLengthDays"] as num?)?.toDouble(),
      stdDevDays: (json["stdDevDays"] as num?)?.toDouble(),
      medianLengthDays: (json["medianLengthDays"] as num?)?.toInt(),
      shortestCycleDays: (json["shortestCycleDays"] as num?)?.toInt(),
      longestCycleDays: (json["longestCycleDays"] as num?)?.toInt(),
      predictedNextWindowStart: json["predictedNextWindowStart"] as String?,
      predictedNextWindowEnd: json["predictedNextWindowEnd"] as String?,
      hasIrregularity: json["hasIrregularity"] as bool? ?? false,
      hasAmenorrhea: json["hasAmenorrhea"] as bool? ?? false,
      irregularityFlags: (json["irregularityFlags"] as List<Object?>?)?.cast<String>() ?? const [],
      caveats: (json["caveats"] as List<Object?>?)?.cast<String>() ?? const [],
    );
  }
}

@immutable
class HerSymptomModel {
  final String id;
  final String logDate;
  final int? energyLevel;
  final String? mood;
  final int pelvicPain;
  final int bloating;
  final int headache;
  final String? acneSeverity;
  final double? sleepHours;
  final List<String> tags;
  final String? notes;

  const HerSymptomModel({
    required this.id,
    required this.logDate,
    this.energyLevel,
    this.mood,
    this.pelvicPain = 0,
    this.bloating = 0,
    this.headache = 0,
    this.acneSeverity,
    this.sleepHours,
    this.tags = const [],
    this.notes,
  });

  factory HerSymptomModel.fromJson(Map<String, Object?> json) {
    return HerSymptomModel(
      id: json["id"] as String? ?? "",
      logDate: json["logDate"] as String? ?? "",
      energyLevel: (json["energyLevel"] as num?)?.toInt(),
      mood: json["mood"] as String?,
      pelvicPain: (json["pelvicPain"] as num?)?.toInt() ?? 0,
      bloating: (json["bloating"] as num?)?.toInt() ?? 0,
      headache: (json["headache"] as num?)?.toInt() ?? 0,
      acneSeverity: json["acneSeverity"] as String?,
      sleepHours: (json["sleepHours"] as num?)?.toDouble(),
      tags: (json["tags"] as List<Object?>?)?.cast<String>() ?? const [],
      notes: json["notes"] as String?,
    );
  }

  Map<String, Object?> toJson() => {
        "id": id,
        "logDate": logDate,
        "energyLevel": energyLevel,
        "mood": mood,
        "pelvicPain": pelvicPain,
        "bloating": bloating,
        "headache": headache,
        "acneSeverity": acneSeverity,
        "sleepHours": sleepHours,
        "tags": tags,
        "notes": notes,
      };
}

@immutable
class SafetyCheckResultModel {
  final bool isUrgent;
  final String category;
  final String? ruleId;
  final String? emergencyGuidance;
  final List<String> evidence;
  final bool suppressWellnessAdvice;

  const SafetyCheckResultModel({
    this.isUrgent = false,
    this.category = "NORMAL",
    this.ruleId,
    this.emergencyGuidance,
    this.evidence = const [],
    this.suppressWellnessAdvice = false,
  });

  factory SafetyCheckResultModel.fromJson(Map<String, Object?> json) {
    return SafetyCheckResultModel(
      isUrgent: json["isUrgent"] as bool? ?? false,
      category: json["category"] as String? ?? "NORMAL",
      ruleId: json["ruleId"] as String?,
      emergencyGuidance: json["emergencyGuidance"] as String?,
      evidence: (json["evidence"] as List<Object?>?)?.cast<String>() ?? const [],
      suppressWellnessAdvice: json["suppressWellnessAdvice"] as bool? ?? false,
    );
  }
}

@immutable
class HerEvidenceItemModel {
  final String source;
  final String label;
  final bool verified;

  const HerEvidenceItemModel({
    required this.source,
    required this.label,
    required this.verified,
  });

  factory HerEvidenceItemModel.fromJson(Map<String, Object?> json) {
    return HerEvidenceItemModel(
      source: json["source"] as String? ?? "patient_report",
      label: json["label"] as String? ?? "",
      verified: json["verified"] as bool? ?? false,
    );
  }
}

@immutable
class HerScreeningFindingModel {
  final String domain;
  final String category;
  final bool isDiagnosis;
  final String title;
  final String rationale;
  final List<HerEvidenceItemModel> supportingEvidence;
  final List<String> missingInformation;
  final List<String> limitations;
  final String ruleVersion;
  final String suggestedAction;

  const HerScreeningFindingModel({
    required this.domain,
    required this.category,
    required this.isDiagnosis,
    required this.title,
    required this.rationale,
    this.supportingEvidence = const [],
    this.missingInformation = const [],
    this.limitations = const [],
    required this.ruleVersion,
    required this.suggestedAction,
  });

  factory HerScreeningFindingModel.fromJson(Map<String, Object?> json) {
    final evList = (json["supportingEvidence"] as List<Object?>?) ?? const [];
    return HerScreeningFindingModel(
      domain: json["domain"] as String? ?? "",
      category: json["category"] as String? ?? "NO_CURRENT_SCREENING_FLAGS",
      isDiagnosis: json["isDiagnosis"] as bool? ?? false,
      title: json["title"] as String? ?? "",
      rationale: json["rationale"] as String? ?? "",
      supportingEvidence: evList
          .map((e) => HerEvidenceItemModel.fromJson(e as Map<String, Object?>))
          .toList(),
      missingInformation: (json["missingInformation"] as List<Object?>?)?.cast<String>() ?? const [],
      limitations: (json["limitations"] as List<Object?>?)?.cast<String>() ?? const [],
      ruleVersion: json["ruleVersion"] as String? ?? "",
      suggestedAction: json["suggestedAction"] as String? ?? "",
    );
  }
}

@immutable
class HerWellnessItemModel {
  final String id;
  final String category;
  final String title;
  final String description;
  final String rationale;
  final String targetPhase;
  final List<String> contraindications;

  const HerWellnessItemModel({
    required this.id,
    required this.category,
    required this.title,
    required this.description,
    required this.rationale,
    required this.targetPhase,
    this.contraindications = const [],
  });

  factory HerWellnessItemModel.fromJson(Map<String, Object?> json) {
    return HerWellnessItemModel(
      id: json["id"] as String? ?? "",
      category: json["category"] as String? ?? "NUTRITION",
      title: json["title"] as String? ?? "",
      description: json["description"] as String? ?? "",
      rationale: json["rationale"] as String? ?? "",
      targetPhase: json["targetPhase"] as String? ?? "all",
      contraindications: (json["contraindications"] as List<Object?>?)?.cast<String>() ?? const [],
    );
  }
}

@immutable
class HerDoctorSummaryModel {
  final String id;
  final String patientId;
  final String generatedAt;
  final String? expiresAt;
  final bool isRevoked;
  final String shareToken;
  final List<HerScreeningFindingModel> screeningEvidence;

  const HerDoctorSummaryModel({
    required this.id,
    required this.patientId,
    required this.generatedAt,
    this.expiresAt,
    this.isRevoked = false,
    required this.shareToken,
    this.screeningEvidence = const [],
  });

  factory HerDoctorSummaryModel.fromJson(Map<String, Object?> json) {
    final findings = (json["screeningEvidence"] as List<Object?>?) ?? const [];
    return HerDoctorSummaryModel(
      id: json["id"] as String? ?? "",
      patientId: json["patientId"] as String? ?? "",
      generatedAt: json["generatedAt"] as String? ?? "",
      expiresAt: json["expiresAt"] as String?,
      isRevoked: json["isRevoked"] as bool? ?? false,
      shareToken: json["shareToken"] as String? ?? "",
      screeningEvidence: findings
          .map((f) => HerScreeningFindingModel.fromJson(f as Map<String, Object?>))
          .toList(),
    );
  }
}

@immutable
class HerWearableModel {
  final String date;
  final int? restingHeartRateBpm;
  final int? hrvMs;
  final int? sleepDurationMinutes;
  final int? sleepEfficiencyPercent;
  final int? stepCount;
  final double? basalBodyTempCelsius;
  final String source;

  const HerWearableModel({
    required this.date,
    this.restingHeartRateBpm,
    this.hrvMs,
    this.sleepDurationMinutes,
    this.sleepEfficiencyPercent,
    this.stepCount,
    this.basalBodyTempCelsius,
    this.source = "synthetic_simulator",
  });

  factory HerWearableModel.fromJson(Map<String, Object?> json) {
    return HerWearableModel(
      date: json["date"] as String? ?? "",
      restingHeartRateBpm: (json["restingHeartRateBpm"] as num?)?.toInt(),
      hrvMs: (json["hrvMs"] as num?)?.toInt(),
      sleepDurationMinutes: (json["sleepDurationMinutes"] as num?)?.toInt(),
      sleepEfficiencyPercent: (json["sleepEfficiencyPercent"] as num?)?.toInt(),
      stepCount: (json["stepCount"] as num?)?.toInt(),
      basalBodyTempCelsius: (json["basalBodyTempCelsius"] as num?)?.toDouble(),
      source: json["source"] as String? ?? "synthetic_simulator",
    );
  }

  Map<String, Object?> toJson() => {
        "date": date,
        "restingHeartRateBpm": restingHeartRateBpm,
        "hrvMs": hrvMs,
        "sleepDurationMinutes": sleepDurationMinutes,
        "sleepEfficiencyPercent": sleepEfficiencyPercent,
        "stepCount": stepCount,
        "basalBodyTempCelsius": basalBodyTempCelsius,
        "source": source,
      };
}
