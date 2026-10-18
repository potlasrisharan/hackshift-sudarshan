import "package:flutter/foundation.dart";

@immutable
class AuthSession {
  final String token;
  final String patientId;
  final String patientName;
  final String phone;
  final String? email;
  final String? abhaNumber;
  final bool onboardingComplete;

  const AuthSession({
    required this.token,
    required this.patientId,
    required this.patientName,
    required this.phone,
    this.email,
    this.abhaNumber,
    this.onboardingComplete = false,
  });

  Map<String, dynamic> toJson() => {
        "token": token,
        "patientId": patientId,
        "patientName": patientName,
        "phone": phone,
        "email": email,
        "abhaNumber": abhaNumber,
        "onboardingComplete": onboardingComplete,
      };

  factory AuthSession.fromJson(Map<String, dynamic> json) {
    return AuthSession(
      token: json["token"]?.toString() ?? "",
      patientId: json["patientId"]?.toString() ?? "",
      patientName: json["patientName"]?.toString() ?? "AyuSetu Patient",
      phone: json["phone"]?.toString() ?? "",
      email: json["email"]?.toString(),
      abhaNumber: json["abhaNumber"]?.toString(),
      onboardingComplete: json["onboardingComplete"] == true,
    );
  }

  AuthSession copyWith({
    String? token,
    String? patientId,
    String? patientName,
    String? phone,
    String? email,
    String? abhaNumber,
    bool? onboardingComplete,
  }) {
    return AuthSession(
      token: token ?? this.token,
      patientId: patientId ?? this.patientId,
      patientName: patientName ?? this.patientName,
      phone: phone ?? this.phone,
      email: email ?? this.email,
      abhaNumber: abhaNumber ?? this.abhaNumber,
      onboardingComplete: onboardingComplete ?? this.onboardingComplete,
    );
  }
}
