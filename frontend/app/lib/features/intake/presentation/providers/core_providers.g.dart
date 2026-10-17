// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'core_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$appConfigHash() => r'b1d3814a11243e31e4797d8cf62cfc6c9aa5f710';

/// See also [appConfig].
@ProviderFor(appConfig)
final appConfigProvider = Provider<Result<AppConfig>>.internal(
  appConfig,
  name: r'appConfigProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$appConfigHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AppConfigRef = ProviderRef<Result<AppConfig>>;
String _$healthUseCaseHash() => r'a50ba02691cb5f3a9dcb3466b8823213c0453a89';

/// See also [healthUseCase].
@ProviderFor(healthUseCase)
final healthUseCaseProvider = Provider<Result<CheckServiceHealth>>.internal(
  healthUseCase,
  name: r'healthUseCaseProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$healthUseCaseHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef HealthUseCaseRef = ProviderRef<Result<CheckServiceHealth>>;
String _$healthControllerHash() => r'd02ed1dbd4c75768b188ef57de8ca15aa00f421c';

/// See also [HealthController].
@ProviderFor(HealthController)
final healthControllerProvider =
    AsyncNotifierProvider<HealthController, ServiceHealth?>.internal(
      HealthController.new,
      name: r'healthControllerProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$healthControllerHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$HealthController = AsyncNotifier<ServiceHealth?>;
String _$intakeFlowHash() => r'1e1cb25651afdaf455f93ce76d6715e9e62fccef';

/// See also [IntakeFlow].
@ProviderFor(IntakeFlow)
final intakeFlowProvider =
    AsyncNotifierProvider<IntakeFlow, IntakeFlowState>.internal(
      IntakeFlow.new,
      name: r'intakeFlowProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$intakeFlowHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$IntakeFlow = AsyncNotifier<IntakeFlowState>;
String _$preferencesHash() => r'23d087f274ec1c0b01922fa72551f5d88eb1fdad';

/// See also [Preferences].
@ProviderFor(Preferences)
final preferencesProvider =
    NotifierProvider<Preferences, KioskPreferences>.internal(
      Preferences.new,
      name: r'preferencesProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$preferencesHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$Preferences = Notifier<KioskPreferences>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
