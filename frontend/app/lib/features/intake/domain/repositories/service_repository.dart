import '../../../../core/error/result.dart';
import '../entities/service_health.dart';

abstract interface class ServiceRepository {
  Future<Result<ServiceHealth>> checkHealth();
}
