import 'package:flutter_test/flutter_test.dart';
import 'package:kiosk_app/core/constants/app_config.dart';
import 'package:kiosk_app/core/error/result.dart';
import 'package:kiosk_app/core/network/api_client.dart';
import 'package:kiosk_app/features/intake/data/repositories/service_repository_impl.dart';
import 'package:kiosk_app/features/intake/data/sources/health_remote_source.dart';
import 'package:kiosk_app/features/intake/domain/entities/service_health.dart';

void main() {
  test(
    'opt-in live health read (no session submission or patient data)',
    () async {
      final config = AppConfig.fromEnvironment();
      if (config case Success(:final value)) {
        final client = ApiClient(value);
        addTearDown(client.close);
        final result = await ServiceRepositoryImpl(
          HealthRemoteSource(client),
        ).checkHealth();
        expect(result, isA<Success<ServiceHealth>>());
      } else {
        fail('API_BASE_URL must be configured for live smoke');
      }
    },
    skip: !const bool.fromEnvironment('LIVE_API'),
  );
}
