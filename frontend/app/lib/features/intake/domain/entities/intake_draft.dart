import 'dart:math';
import 'intake_flow_state.dart';

enum PatientGender { female, male, other, unknown }

enum Answer { yes, no, unsure }

enum Symptom { chestPain, breathless, fainting, fever, cough, fatigue, thirst }

abstract final class IntakeValidation {
  static bool phone(String value) => RegExp(r'^[6-9]\d{9}$').hasMatch(value);
  static bool abha(String value) => RegExp(r'^\d{14}$').hasMatch(value);
  static bool birthDate(String value, DateTime now) {
    if (!RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(value)) return false;
    final parsed = DateTime.tryParse(value);
    return parsed != null &&
        parsed.toIso8601String().startsWith(value) &&
        value.compareTo(now.toIso8601String().substring(0, 10)) <= 0;
  }

  static String newKey() {
    final random = Random.secure();
    final bytes = List<int>.generate(16, (_) => random.nextInt(256));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    final hex = bytes.map((v) => v.toRadixString(16).padLeft(2, '0')).join();
    return '${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}';
  }
}

final class IntakeDraft {
  final KioskLanguage language;
  final String name;
  final String birthDate;
  final PatientGender gender;
  final String complaint;
  final Map<Symptom, Answer> answers;
  final bool consent;
  final bool synthetic;
  IntakeDraft({
    required this.language,
    this.name = '',
    this.birthDate = '',
    this.gender = PatientGender.unknown,
    this.complaint = '',
    Map<Symptom, Answer> answers = const {},
    this.consent = false,
    this.synthetic = false,
  }) : answers = Map.unmodifiable(answers);
  bool get validIdentity =>
      name.trim().isNotEmpty &&
      name.trim().length <= 120 &&
      IntakeValidation.birthDate(birthDate, DateTime.now()) &&
      synthetic;
  bool get danger => [
    Symptom.chestPain,
    Symptom.breathless,
    Symptom.fainting,
  ].any((s) => answers[s] == Answer.yes);
  bool get validComplaint =>
      complaint.trim().length >= 3 &&
      complaint.trim().length <= 2000 &&
      (danger ||
          [
            Symptom.chestPain,
            Symptom.breathless,
            Symptom.fainting,
          ].every(answers.containsKey));
  bool get canSubmit => validIdentity && validComplaint && consent;
  IntakeDraft copyWith({
    String? name,
    String? birthDate,
    PatientGender? gender,
    String? complaint,
    Map<Symptom, Answer>? answers,
    bool? consent,
    bool? synthetic,
  }) => IntakeDraft(
    language: language,
    name: name ?? this.name,
    birthDate: birthDate ?? this.birthDate,
    gender: gender ?? this.gender,
    complaint: complaint ?? this.complaint,
    answers: Map.unmodifiable(answers ?? this.answers),
    consent: consent ?? this.consent,
    synthetic: synthetic ?? this.synthetic,
  );
}

final class StaffSession {
  final String token;
  final DateTime expiresAt;
  const StaffSession(this.token, this.expiresAt);
  bool get active => token.isNotEmpty && expiresAt.isAfter(DateTime.now());
}

final class EncounterReceipt {
  final String id;
  final String patientId;
  final String clinicId;
  final String status;
  final DateTime createdAt;
  final bool consentActive;
  const EncounterReceipt({
    required this.id,
    required this.patientId,
    required this.clinicId,
    required this.status,
    required this.createdAt,
    required this.consentActive,
  });
  bool get emergency => status == 'emergency';
}
