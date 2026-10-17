// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'intake_dto.dart';

// **************************************************************************
// TypedJsonGenerator
// **************************************************************************

PatientInputDto _$PatientInputDtoFromJson(Map<String, Object?> json) =>
    PatientInputDto(
      name: json['name'] as String,
      birthDate: json['birthDate'] as String,
      gender: json['gender'] as String,
      language: json['language'] as String,
    );

Map<String, Object?> _$PatientInputDtoToJson(PatientInputDto instance) =>
    <String, Object?>{
      'name': instance.name,
      'birthDate': instance.birthDate,
      'gender': instance.gender,
      'language': instance.language,
    };

IntakeRequestDto _$IntakeRequestDtoFromJson(Map<String, Object?> json) =>
    IntakeRequestDto(
      patient: PatientInputDto.fromJson(
        json['patient'] as Map<String, Object?>,
      ),
      chiefComplaint: json['chiefComplaint'] as String,
      answers: Map<String, String>.from(json['answers'] as Map),
      careConsent: json['careConsent'] as bool,
      synthetic: json['synthetic'] as bool,
    );

Map<String, Object?> _$IntakeRequestDtoToJson(IntakeRequestDto instance) =>
    <String, Object?>{
      'patient': instance.patient.toJson(),
      'chiefComplaint': instance.chiefComplaint,
      'answers': instance.answers,
      'careConsent': instance.careConsent,
      'synthetic': instance.synthetic,
    };

LoginResponseDto _$LoginResponseDtoFromJson(Map<String, Object?> json) =>
    LoginResponseDto(
      token: json['token'] as String,
      expiresAt: DateTime.parse(json['expiresAt'] as String),
    );

Map<String, Object?> _$LoginResponseDtoToJson(LoginResponseDto instance) =>
    <String, Object?>{
      'token': instance.token,
      'expiresAt': instance.expiresAt.toIso8601String(),
    };

EncounterDto _$EncounterDtoFromJson(Map<String, Object?> json) => EncounterDto(
  id: json['id'] as String,
  patientId: json['patientId'] as String,
  clinicId: json['clinicId'] as String,
  status: json['status'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  consentActive: json['consentActive'] as bool,
);

Map<String, Object?> _$EncounterDtoToJson(EncounterDto instance) =>
    <String, Object?>{
      'id': instance.id,
      'patientId': instance.patientId,
      'clinicId': instance.clinicId,
      'status': instance.status,
      'createdAt': instance.createdAt.toIso8601String(),
      'consentActive': instance.consentActive,
    };
