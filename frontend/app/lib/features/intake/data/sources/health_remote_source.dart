import '../../../../core/network/api_client.dart';
import '../../../../core/error/result.dart';

final class HealthRemoteSource {
  final ApiClient client;
  const HealthRemoteSource(this.client);
  Future<Result<Object?>> fetch() => client.rootHealth();
}
