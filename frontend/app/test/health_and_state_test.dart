import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kiosk_app/core/error/failure.dart';
import 'package:kiosk_app/core/error/result.dart';
import 'package:kiosk_app/core/network/api_client.dart';
import 'package:kiosk_app/features/intake/data/dtos/health_dto.dart';
import 'package:kiosk_app/features/intake/data/repositories/service_repository_impl.dart';
import 'package:kiosk_app/features/intake/data/sources/health_remote_source.dart';
import 'package:kiosk_app/features/intake/domain/entities/service_health.dart';
import 'package:kiosk_app/features/intake/domain/entities/intake_flow_state.dart';
import 'package:kiosk_app/features/intake/domain/repositories/service_repository.dart';
import 'package:kiosk_app/features/intake/domain/use_cases/check_service_health.dart';
import 'package:kiosk_app/features/intake/presentation/providers/core_providers.dart';
import 'support/scripted_adapter.dart';
import 'core_test.dart' show config;

const health = ServiceHealth(
  reachable: true,
  syntheticDemo: true,
  persistentStorage: false,
  speechConfigured: false,
);

class Repository implements ServiceRepository {
  final Future<Result<ServiceHealth>> result;
  int calls = 0;
  Repository(this.result);
  @override
  Future<Result<ServiceHealth>> checkHealth() {
    calls++;
    return result;
  }
}

void main() {
  test('health DTO round-trips the actual Worker fields', () {
    const input = <String, Object?>{
      'status': 'ok',
      'mode': 'synthetic-demo',
      'persistentStorage': false,
      'speechConfigured': false,
    };
    final dto = HealthDto.fromJson(input);
    expect(dto.toJson(), input);
    expect(dto.toDomain().syntheticDemo, isTrue);
    expect(dto.toDomain().speechConfigured, isFalse);
    expect(dto.toDomain().persistentStorage, isFalse);
  });
  test('invalid JSON field types become a validation failure', () async {
    final adapter = ScriptedAdapter([
      (r) => jsonReply({
        'status': 42,
        'mode': 'synthetic-demo',
        'persistentStorage': false,
        'speechConfigured': false,
      }),
    ]);
    final client = ApiClient(config(), dio: Dio()..httpClientAdapter = adapter);
    final result = await ServiceRepositoryImpl(
      HealthRemoteSource(client),
    ).checkHealth();
    expect(result, isA<Failed<ServiceHealth>>());
    if (result case Failed(:final failure)) {
      expect(failure, isA<ValidationFailure>());
    }
    client.close();
  });
  test('non-object or missing fields cannot be treated as healthy', () async {
    for (final value in [<String, Object?>{}, <Object?>[], null]) {
      final adapter = ScriptedAdapter([(r) => jsonReply(value)]);
      final client = ApiClient(
        config(),
        dio: Dio()..httpClientAdapter = adapter,
      );
      expect(
        await ServiceRepositoryImpl(HealthRemoteSource(client)).checkHealth(),
        isA<Failed<ServiceHealth>>(),
      );
      client.close();
    }
  });
  test('repository carries success and non-ok status faithfully', () async {
    for (final status in ['ok', 'degraded']) {
      final adapter = ScriptedAdapter([
        (r) => jsonReply({
          'status': status,
          'mode': 'synthetic-demo',
          'persistentStorage': false,
          'speechConfigured': false,
        }),
      ]);
      final client = ApiClient(
        config(),
        dio: Dio()..httpClientAdapter = adapter,
      );
      final result = await ServiceRepositoryImpl(
        HealthRemoteSource(client),
      ).checkHealth();
      expect(
        result,
        status == 'ok'
            ? isA<Success<ServiceHealth>>()
            : isA<Failed<ServiceHealth>>(),
      );
      client.close();
    }
  });
  test('repository preserves mapped network failure', () async {
    final adapter = ScriptedAdapter([
      (r) => throw DioException(
        requestOptions: r,
        type: DioExceptionType.connectionError,
      ),
    ]);
    final client = ApiClient(
      config(),
      dio: Dio()..httpClientAdapter = adapter,
      delay: (_) async {},
    );
    final result = await ServiceRepositoryImpl(
      HealthRemoteSource(client),
    ).checkHealth();
    expect(result, isA<Failed<ServiceHealth>>());
    client.close();
  });
  test('sealed flow transitions select language then clear on reset', () async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    expect(
      await container.read(intakeFlowProvider.future),
      isA<ChoosingLanguage>(),
    );
    container
        .read(intakeFlowProvider.notifier)
        .chooseLanguage(KioskLanguage.pa);
    expect(
      container.read(intakeFlowProvider).valueOrNull,
      isA<AwaitingIdentity>(),
    );
    container.read(intakeFlowProvider.notifier).reset();
    expect(
      container.read(intakeFlowProvider).valueOrNull,
      isA<ChoosingLanguage>(),
    );
  });
  test(
    'health controller disables duplicate requests and exposes safe failure',
    () async {
      final completer = Completer<Result<ServiceHealth>>();
      final repo = Repository(completer.future);
      final container = ProviderContainer(
        overrides: [
          healthUseCaseProvider.overrideWithValue(
            Success(CheckServiceHealth(repo)),
          ),
        ],
      );
      addTearDown(container.dispose);
      await container.read(healthControllerProvider.future);
      final pending = container.read(healthControllerProvider.notifier).check();
      await container.read(healthControllerProvider.notifier).check();
      expect(container.read(healthControllerProvider).isLoading, isTrue);
      expect(repo.calls, 1);
      completer.complete(const Failed(NetworkFailure()));
      await pending;
      expect(
        container.read(healthControllerProvider).error,
        isA<NetworkFailure>(),
      );
    },
  );
  test(
    'health controller and preferences use immutable typed values',
    () async {
      final repo = Repository(Future.value(const Success(health)));
      final container = ProviderContainer(
        overrides: [
          healthUseCaseProvider.overrideWithValue(
            Success(CheckServiceHealth(repo)),
          ),
        ],
      );
      addTearDown(container.dispose);
      await container.read(healthControllerProvider.future);
      await container.read(healthControllerProvider.notifier).check();
      expect(
        container.read(healthControllerProvider).valueOrNull?.reachable,
        isTrue,
      );
      final old = container.read(preferencesProvider);
      container.read(preferencesProvider.notifier).elderMode(true);
      container.read(preferencesProvider.notifier).language(KioskLanguage.ta);
      expect(old.elderMode, isFalse);
      expect(container.read(preferencesProvider).language, KioskLanguage.ta);
      expect(container.read(preferencesProvider).elderMode, isTrue);
    },
  );
  test('missing configuration results in a configuration failure', () async {
    final container = ProviderContainer(
      overrides: [
        appConfigProvider.overrideWithValue(
          const Failed(ConfigurationFailure()),
        ),
      ],
    );
    addTearDown(container.dispose);
    await container.read(healthControllerProvider.future);
    await container.read(healthControllerProvider.notifier).check();
    expect(
      container.read(healthControllerProvider).error,
      isA<ConfigurationFailure>(),
    );
  });
}
