import '../../../../core/error/result.dart';
import '../entities/service_health.dart';
import '../repositories/service_repository.dart';

final class CheckServiceHealth {
  final ServiceRepository repository;
  const CheckServiceHealth(this.repository);
  Future<Result<ServiceHealth>> call() => repository.checkHealth();
}
