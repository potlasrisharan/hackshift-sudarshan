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
import '../../domain/entities/intake_draft.dart';
import '../../domain/repositories/intake_repository.dart';
import '../../domain/use_cases/submit_intake.dart';
import '../../data/repositories/intake_repository_impl.dart';
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
Result<IntakeRepository> intakeRepository(Ref<Object?> ref) {
  switch (ref.watch(appConfigProvider)) {
    case Failed(:final failure):
      return Failed(failure);
    case Success(:final value):
      final client = ApiClient(value);
      final cancel = CancelToken();
      ref.onDispose(() {
        cancel.cancel();
        client.close();
      });
      return Success(IntakeRepositoryImpl(client, cancel));
  }
}

@Riverpod(keepAlive: true)
class IntakeFlow extends _$IntakeFlow {
  int _generation = 0;
  bool _authenticating = false;
  EditingIntake? _lockedSubmission;
  @override
  FutureOr<IntakeFlowState> build() {
    ref.onDispose(() {
      _generation++;
    });
    return const ChoosingLanguage();
  }

  void chooseLanguage(KioskLanguage language) {
    reset();
    state = AsyncData(AwaitingIdentity(language));
  }

  Future<void> login(String org, String email, String password) async {
    final before = state.valueOrNull;
    if (_authenticating || before is! AwaitingIdentity) return;
    _authenticating = true;
    final generation = _generation;
    state = const AsyncLoading();
    final repository = ref.read(intakeRepositoryProvider);
    final Result<StaffSession> result = switch (repository) {
      Failed(:final failure) => Failed(failure),
      Success(:final value) => await value.login(org, email, password),
    };
    if (generation != _generation) return;
    _authenticating = false;
    state = switch (result) {
      Success(:final value) => AsyncData(
        EditingIntake(
          IntakeDraft(language: before.language),
          value,
          IntakeStep.identity,
          IntakeValidation.newKey(),
        ),
      ),
      Failed(:final failure) => AsyncData(IntakeBlocked(failure)),
    };
  }

  void edit(IntakeDraft draft) {
    final value = state.valueOrNull;
    // After a potentially committed request, freeze its payload until replay resolves.
    if (value is! EditingIntake || _lockedSubmission != null) return;
    state = AsyncData(
      EditingIntake(draft, value.session, value.step, value.key),
    );
  }

  void step(IntakeStep step) {
    final value = state.valueOrNull;
    if (value is! EditingIntake ||
        _lockedSubmission != null ||
        !value.draft.validIdentity) {
      return;
    }
    if (step == IntakeStep.summary && !value.draft.validComplaint) return;
    state = AsyncData(
      EditingIntake(value.draft, value.session, step, value.key),
    );
  }

  Future<void> submit() async {
    final value = state.valueOrNull;
    if (value is! EditingIntake ||
        value.step != IntakeStep.summary ||
        !value.draft.canSubmit) {
      return;
    }
    final pending = _lockedSubmission ?? value;
    _lockedSubmission = pending;
    final generation = _generation;
    state = AsyncData(SubmittingIntake(pending));
    final repository = ref.read(intakeRepositoryProvider);
    final Result<EncounterReceipt> result = switch (repository) {
      Failed(:final failure) => Failed(failure),
      Success(:final value) => await SubmitIntake(value)(
        pending.draft,
        pending.session,
        pending.key,
      ),
    };
    if (generation != _generation) return;
    state = switch (result) {
      Success(:final value) => AsyncData(IntakeComplete(value)),
      Failed(:final failure) => AsyncData(
        EditingIntake(
          pending.draft,
          pending.session,
          pending.step,
          pending.key,
          failure: failure,
        ),
      ),
    };
    if (state.valueOrNull is IntakeComplete) {
      _lockedSubmission = null;
      ref.invalidate(intakeRepositoryProvider);
    }
  }

  bool get submissionLocked => _lockedSubmission != null;
  void reset() {
    _generation++;
    _authenticating = false;
    _lockedSubmission = null;
    ref.invalidate(intakeRepositoryProvider);
    state = const AsyncData(ChoosingLanguage());
  }
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

/// Injectable wall clock, so reset tests exercise elapsed time without real waits.
@Riverpod(keepAlive: true)
DateTime Function() kioskClock(Ref<Object?> ref) => DateTime.now;
