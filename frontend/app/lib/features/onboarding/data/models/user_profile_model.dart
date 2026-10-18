import "package:flutter/foundation.dart";

@immutable
class UserProfile {
  final String patientId;
  final String name;
  final String phone;
  final String? email;
  final String dob;
  final String sex;
  final String? bloodGroup;
  final double? heightCm;
  final double? weightKg;
  final double? waistCircumferenceCm;
  final String? abhaNumber;
  final String? emergencyContact;
  final String? address;
  final List<String> chronicConditions;
  final List<String> allergies;
  final List<String> medications;
  final String primaryDosha;
  final String secondaryDosha;
  final String prakritiSummary;
  final String agniType;
  final String dietPreference;
  final double sleepHours;
  final int stressLevel;
  final String primaryFocus; // 'longevity' | 'womens_health' | 'yoga' | 'opd'
  final String themeMode; // 'light' | 'dark' | 'system'
  final String language;
  final bool onboardingComplete;

  const UserProfile({
    required this.patientId,
    required this.name,
    required this.phone,
    this.email,
    required this.dob,
    this.sex = "FEMALE",
    this.bloodGroup,
    this.heightCm,
    this.weightKg,
    this.waistCircumferenceCm,
    this.abhaNumber,
    this.emergencyContact,
    this.address,
    this.chronicConditions = const [],
    this.allergies = const [],
    this.medications = const [],
    this.primaryDosha = "PITTA_KAPHA",
    this.secondaryDosha = "VATA",
    this.prakritiSummary = "Pitta-Kapha Prakriti: balanced metabolism and endurance.",
    this.agniType = "SAMAGNI",
    this.dietPreference = "vegetarian",
    this.sleepHours = 7.5,
    this.stressLevel = 2,
    this.primaryFocus = "longevity",
    this.themeMode = "light",
    this.language = "hi",
    this.onboardingComplete = false,
  });

  double? get bmi {
    if (heightCm != null && weightKg != null && heightCm! > 0) {
      final hM = heightCm! / 100;
      return double.parse((weightKg! / (hM * hM)).toStringAsFixed(1));
    }
    return null;
  }

  String get bmiCategory {
    final b = bmi;
    if (b == null) return "Unknown";
    if (b < 18.5) return "Underweight (Clinical Nutrition Advisory)";
    if (b < 23.0) return "Optimal Asian Reference (WHO-NIN)";
    if (b < 27.5) return "Overweight (Metabolic Surveillance)";
    return "Obese (High Priority Optimization)";
  }

  String get prakritiBadgeLabel {
    switch (primaryDosha) {
      case "VATA":
        return "Vata Dominant · Creative & Energetic";
      case "PITTA":
        return "Pitta Dominant · Strong Digestion";
      case "KAPHA":
        return "Kapha Dominant · Calm & Steady";
      case "VATA_PITTA":
        return "Vata-Pitta · Dynamic Balance";
      case "PITTA_KAPHA":
        return "Pitta-Kapha · Strong Vitality";
      case "VATA_KAPHA":
        return "Vata-Kapha · Endurance & Motion";
      default:
        return "Tridoshic · Rare Harmony";
    }
  }

  UserProfile copyWith({
    String? patientId,
    String? name,
    String? phone,
    String? email,
    String? dob,
    String? sex,
    String? bloodGroup,
    double? heightCm,
    double? weightKg,
    double? waistCircumferenceCm,
    String? abhaNumber,
    String? emergencyContact,
    String? address,
    List<String>? chronicConditions,
    List<String>? allergies,
    List<String>? medications,
    String? primaryDosha,
    String? secondaryDosha,
    String? prakritiSummary,
    String? agniType,
    String? dietPreference,
    double? sleepHours,
    int? stressLevel,
    String? primaryFocus,
    String? themeMode,
    String? language,
    bool? onboardingComplete,
  }) {
    return UserProfile(
      patientId: patientId ?? this.patientId,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      dob: dob ?? this.dob,
      sex: sex ?? this.sex,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      heightCm: heightCm ?? this.heightCm,
      weightKg: weightKg ?? this.weightKg,
      waistCircumferenceCm: waistCircumferenceCm ?? this.waistCircumferenceCm,
      abhaNumber: abhaNumber ?? this.abhaNumber,
      emergencyContact: emergencyContact ?? this.emergencyContact,
      address: address ?? this.address,
      chronicConditions: chronicConditions ?? this.chronicConditions,
      allergies: allergies ?? this.allergies,
      medications: medications ?? this.medications,
      primaryDosha: primaryDosha ?? this.primaryDosha,
      secondaryDosha: secondaryDosha ?? this.secondaryDosha,
      prakritiSummary: prakritiSummary ?? this.prakritiSummary,
      agniType: agniType ?? this.agniType,
      dietPreference: dietPreference ?? this.dietPreference,
      sleepHours: sleepHours ?? this.sleepHours,
      stressLevel: stressLevel ?? this.stressLevel,
      primaryFocus: primaryFocus ?? this.primaryFocus,
      themeMode: themeMode ?? this.themeMode,
      language: language ?? this.language,
      onboardingComplete: onboardingComplete ?? this.onboardingComplete,
    );
  }

  Map<String, dynamic> toJson() => {
        "patientId": patientId,
        "name": name,
        "phone": phone,
        "email": email,
        "dob": dob,
        "sex": sex,
        "bloodGroup": bloodGroup,
        "heightCm": heightCm,
        "weightKg": weightKg,
        "waistCircumferenceCm": waistCircumferenceCm,
        "abhaNumber": abhaNumber,
        "emergencyContact": emergencyContact,
        "address": address,
        "chronicConditions": chronicConditions,
        "allergies": allergies,
        "medications": medications,
        "primaryDosha": primaryDosha,
        "secondaryDosha": secondaryDosha,
        "prakritiSummary": prakritiSummary,
        "agniType": agniType,
        "dietPreference": dietPreference,
        "sleepHours": sleepHours,
        "stressLevel": stressLevel,
        "primaryFocus": primaryFocus,
        "themeMode": themeMode,
        "language": language,
        "onboardingComplete": onboardingComplete,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      patientId: json["patientId"]?.toString() ?? "pat-048291",
      name: json["name"]?.toString() ?? "Aarav Sharma",
      phone: json["phone"]?.toString() ?? "+91 98765 43210",
      email: json["email"]?.toString(),
      dob: json["dob"]?.toString() ?? "1994-06-15",
      sex: json["sex"]?.toString() ?? "FEMALE",
      bloodGroup: json["bloodGroup"]?.toString(),
      heightCm: (json["heightCm"] as num?)?.toDouble() ?? 168.0,
      weightKg: (json["weightKg"] as num?)?.toDouble() ?? 64.0,
      waistCircumferenceCm: (json["waistCircumferenceCm"] as num?)?.toDouble() ?? 78.0,
      abhaNumber: json["abhaNumber"]?.toString() ?? "91-2024-5839-2041@abdm",
      emergencyContact: json["emergencyContact"]?.toString(),
      address: json["address"]?.toString(),
      chronicConditions: (json["chronicConditions"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      allergies: (json["allergies"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      medications: (json["medications"] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
      primaryDosha: json["primaryDosha"]?.toString() ?? "PITTA_KAPHA",
      secondaryDosha: json["secondaryDosha"]?.toString() ?? "VATA",
      prakritiSummary: json["prakritiSummary"]?.toString() ?? "Pitta-Kapha Prakriti: balanced metabolism and endurance.",
      agniType: json["agniType"]?.toString() ?? "SAMAGNI",
      dietPreference: json["dietPreference"]?.toString() ?? "vegetarian",
      sleepHours: (json["sleepHours"] as num?)?.toDouble() ?? 7.5,
      stressLevel: (json["stressLevel"] as num?)?.toInt() ?? 2,
      primaryFocus: json["primaryFocus"]?.toString() ?? "longevity",
      themeMode: json["themeMode"]?.toString() ?? "light",
      language: json["language"]?.toString() ?? "hi",
      onboardingComplete: json["onboardingComplete"] == true,
    );
  }
}
