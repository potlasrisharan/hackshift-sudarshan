import '../../../../core/error/failure.dart';
import '../../../../core/error/result.dart';
import '../../domain/entities/service_health.dart';
import '../../domain/repositories/service_repository.dart';
import '../dtos/health_dto.dart';
import '../sources/health_remote_source.dart';

final class ServiceRepositoryImpl implements ServiceRepository {
  final HealthRemoteSource source;
  const ServiceRepositoryImpl(this.source);
  @override
  Future<Result<ServiceHealth>> checkHealth() async {
    final result = await source.fetch();
    switch (result) {
      case Failed(:final failure):
        return Failed(failure);
      case Success(:final value):
        if (value is! Map<String, Object?>) {
          return const Failed(ValidationFailure());
        }
        try {
          final health = HealthDto.fromJson(value).toDomain();
          return health.reachable
              ? Success(health)
              : const Failed(ServerFailure(503));
        } catch (_) {
          return const Failed(ValidationFailure());
        }
    }
  }
}
