import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/service_health.dart';
part 'health_dto.g.dart';

@JsonSerializable()
final class HealthDto {
  final String status;
  final String mode;
  final bool persistentStorage;
  final bool speechConfigured;
  const HealthDto({
    required this.status,
    required this.mode,
    required this.persistentStorage,
    required this.speechConfigured,
  });
  factory HealthDto.fromJson(Map<String, Object?> json) =>
      _$HealthDtoFromJson(json);
  Map<String, Object?> toJson() => _$HealthDtoToJson(this);
  ServiceHealth toDomain() => ServiceHealth(
    reachable: status == 'ok',
    syntheticDemo: mode == 'synthetic-demo',
    persistentStorage: persistentStorage,
    speechConfigured: speechConfigured,
  );
}
