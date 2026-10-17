import 'package:flutter_riverpod/flutter_riverpod.dart' show Ref;
import 'dart:async';
import 'package:dio/dio.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/constants/app_config.dart';
import '../../../../core/error/result.dart';
import '../../../../core/network/api_client.dart';
import '../../data/repositories/service_repository_impl.dart';
import '../../data/sources/health_remote_source.dart';
import '../../domain/entities/intake_flow_state.dart';
import '../../domain/entities/service_health.dart';
import '../../domain/use_cases/check_service_health.dart';
part 'core_providers.g.dart';

@Riverpod(keepAlive: true)
Result<AppConfig> appConfig(Ref<Object?> ref) => AppConfig.fromEnvironment();

@Riverpod(keepAlive: true)
Result<CheckServiceHealth> healthUseCase(Ref<Object?> ref) {
  switch (ref.watch(appConfigProvider)) {
    case Failed(:final failure):
      return Failed(failure);
    case Success(:final value):
      final client = ApiClient(value, dio: Dio());
      ref.onDispose(client.close);
      return Success(
        CheckServiceHealth(ServiceRepositoryImpl(HealthRemoteSource(client))),
      );
  }
}

@Riverpod(keepAlive: true)
class HealthController extends _$HealthController {
  int _generation = 0;
  @override
  FutureOr<ServiceHealth?> build() {
    ref.onDispose(() {
      _generation++;
    });
    return null;
  }

  Future<void> check() async {
    if (state.isLoading) return;
    final generation = ++_generation;
    state = const AsyncLoading();
    final useCase = ref.read(healthUseCaseProvider);
    final Result<ServiceHealth> result = switch (useCase) {
      Failed(:final failure) => Failed(failure),
      Success(:final value) => await value(),
    };
    if (generation != _generation) return;
    state = switch (result) {
      Success(:final value) => AsyncData(value),
      Failed(:final failure) => AsyncError(failure, StackTrace.empty),
    };
  }
}

@Riverpod(keepAlive: true)
class IntakeFlow extends _$IntakeFlow {
  @override
  FutureOr<IntakeFlowState> build() => const ChoosingLanguage();
  void chooseLanguage(KioskLanguage language) =>
      state = AsyncData(AwaitingIdentity(language));
  void reset() => state = const AsyncData(ChoosingLanguage());
}

final class KioskPreferences {
  final KioskLanguage language;
  final bool elderMode;
  const KioskPreferences({
    this.language = KioskLanguage.en,
    this.elderMode = false,
  });
}

@Riverpod(keepAlive: true)
class Preferences extends _$Preferences {
  @override
  KioskPreferences build() => const KioskPreferences();
  void language(KioskLanguage value) =>
      state = KioskPreferences(language: value, elderMode: state.elderMode);
  void elderMode(bool value) =>
      state = KioskPreferences(language: state.language, elderMode: value);
}
