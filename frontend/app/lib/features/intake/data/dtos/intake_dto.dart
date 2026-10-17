import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/intake_draft.dart';
part 'intake_dto.g.dart';

@JsonSerializable()
final class PatientInputDto {
  final String name;
  final String birthDate;
  final String gender;
  final String language;
  const PatientInputDto({
    required this.name,
    required this.birthDate,
    required this.gender,
    required this.language,
  });
  factory PatientInputDto.fromJson(Map<String, Object?> json) =>
      _$PatientInputDtoFromJson(json);
  Map<String, Object?> toJson() => _$PatientInputDtoToJson(this);
}

@JsonSerializable(explicitToJson: true)
final class IntakeRequestDto {
  final PatientInputDto patient;
  final String chiefComplaint;
  final Map<String, String> answers;
  final bool careConsent;
  final bool synthetic;
  IntakeRequestDto({
    required this.patient,
    required this.chiefComplaint,
    required Map<String, String> answers,
    required this.careConsent,
    required this.synthetic,
  }) : answers = Map.unmodifiable(answers);
  factory IntakeRequestDto.fromJson(Map<String, Object?> json) =>
      _$IntakeRequestDtoFromJson(json);
  Map<String, Object?> toJson() => _$IntakeRequestDtoToJson(this);
  factory IntakeRequestDto.fromDomain(IntakeDraft draft) => IntakeRequestDto(
    patient: PatientInputDto(
      name: draft.name.trim(),
      birthDate: draft.birthDate,
      gender: draft.gender.name,
      language: '${draft.language.name}-IN',
    ),
    chiefComplaint: draft.complaint.trim(),
    answers: Map.unmodifiable(
      draft.answers.map((k, v) => MapEntry(k.name, v.name)),
    ),
    careConsent: draft.consent,
    synthetic: draft.synthetic,
  );
}

@JsonSerializable()
final class LoginResponseDto {
  final String token;
  final DateTime expiresAt;
  const LoginResponseDto({required this.token, required this.expiresAt});
  factory LoginResponseDto.fromJson(Map<String, Object?> json) =>
      _$LoginResponseDtoFromJson(json);
  Map<String, Object?> toJson() => _$LoginResponseDtoToJson(this);
}

@JsonSerializable()
final class EncounterDto {
  final String id;
  final String patientId;
  final String clinicId;
  final String status;
  final DateTime createdAt;
  final bool consentActive;
  const EncounterDto({
    required this.id,
    required this.patientId,
    required this.clinicId,
    required this.status,
    required this.createdAt,
    required this.consentActive,
  });
  factory EncounterDto.fromJson(Map<String, Object?> json) =>
      _$EncounterDtoFromJson(json);
  Map<String, Object?> toJson() => _$EncounterDtoToJson(this);
  EncounterReceipt toDomain() {
    if (!{'waiting', 'emergency', 'reviewed'}.contains(status) ||
        !RegExp(
          r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
        ).hasMatch(id) ||
        patientId.isEmpty ||
        clinicId.isEmpty ||
        !consentActive) {
      throw const FormatException();
    }
    return EncounterReceipt(
      id: id,
      patientId: patientId,
      clinicId: clinicId,
      status: status,
      createdAt: createdAt,
      consentActive: consentActive,
    );
  }
}
