// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'speech_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$speechInputHash() => r'72945c521647ce116a2a9029be5432c646968768';

/// See also [speechInput].
@ProviderFor(speechInput)
final speechInputProvider = Provider<SpeechInput>.internal(
  speechInput,
  name: r'speechInputProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$speechInputHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef SpeechInputRef = ProviderRef<SpeechInput>;
String _$voiceControllerHash() => r'bc738237cb1441e987c2e0f6dd1de3248e5fb73d';

/// See also [VoiceController].
@ProviderFor(VoiceController)
final voiceControllerProvider =
    AutoDisposeAsyncNotifierProvider<VoiceController, VoiceState>.internal(
      VoiceController.new,
      name: r'voiceControllerProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$voiceControllerHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$VoiceController = AutoDisposeAsyncNotifier<VoiceState>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
