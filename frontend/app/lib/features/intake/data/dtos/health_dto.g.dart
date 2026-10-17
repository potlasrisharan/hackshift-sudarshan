// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'health_dto.dart';

// **************************************************************************
// TypedJsonGenerator
// **************************************************************************

HealthDto _$HealthDtoFromJson(Map<String, Object?> json) => HealthDto(
  status: json['status'] as String,
  mode: json['mode'] as String,
  persistentStorage: json['persistentStorage'] as bool,
  speechConfigured: json['speechConfigured'] as bool,
);

Map<String, Object?> _$HealthDtoToJson(HealthDto instance) => <String, Object?>{
  'status': instance.status,
  'mode': instance.mode,
  'persistentStorage': instance.persistentStorage,
  'speechConfigured': instance.speechConfigured,
};

IntegrationHealthDto _$IntegrationHealthDtoFromJson(
  Map<String, Object?> json,
) => IntegrationHealthDto(
  status: json['status'] as String,
  service: json['service'] as String,
  syntheticOnly: json['syntheticOnly'] as bool,
);

Map<String, Object?> _$IntegrationHealthDtoToJson(
  IntegrationHealthDto instance,
) => <String, Object?>{
  'status': instance.status,
  'service': instance.service,
  'syntheticOnly': instance.syntheticOnly,
};
