import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart' show Ref;
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/sources/android_speech_input.dart';
import '../../domain/repositories/speech_input.dart';
part 'speech_providers.g.dart';

@Riverpod(keepAlive: true)
SpeechInput speechInput(Ref<Object?> ref) {
  final input = AndroidSpeechInput();
  ref.onDispose(() {
    unawaited(input.stop());
  });
  return input;
}

enum VoiceStatus { idle, starting, listening, typedFallback }

final class VoiceState {
  final VoiceStatus status;
  final String transcript;
  final double level;
  const VoiceState(this.status, {this.transcript = '', this.level = 0});
}

@riverpod
class VoiceController extends _$VoiceController {
  Timer? _silence;
  Timer? _hardLimit;
  int _generation = 0;
  @override
  FutureOr<VoiceState> build() {
    final input = ref.watch(speechInputProvider);
    ref.onDispose(() {
      _generation++;
      _silence?.cancel();
      _hardLimit?.cancel();
      unawaited(input.stop());
    });
    return const VoiceState(VoiceStatus.idle);
  }

  Future<void> start(String locale, String previous) async {
    if (state.valueOrNull?.status == VoiceStatus.starting ||
        state.valueOrNull?.status == VoiceStatus.listening) {
      return;
    }
    final generation = ++_generation;
    final input = ref.read(speechInputProvider);
    state = AsyncData(VoiceState(VoiceStatus.starting, transcript: previous));
    void silence() {
      _silence?.cancel();
      _silence = Timer(const Duration(seconds: 5), () {
        unawaited(stop());
      });
    }

    silence();
    _hardLimit = Timer(const Duration(seconds: 45), () {
      unawaited(stop());
    });
    try {
      final ready = await input.start(
        locale,
        (words) {
          if (generation != _generation) return;
          silence();
          final text = [
            previous.trim(),
            words.trim(),
          ].where((s) => s.isNotEmpty).join(' ');
          state = AsyncData(
            VoiceState(
              VoiceStatus.listening,
              transcript: text.length > 2000 ? text.substring(0, 2000) : text,
              level: state.valueOrNull?.level ?? 0,
            ),
          );
        },
        (level) {
          if (generation != _generation) return;
          final current = state.valueOrNull;
          state = AsyncData(
            VoiceState(
              VoiceStatus.listening,
              transcript: current?.transcript ?? previous,
              level: ((level + 2) / 12).clamp(0.0, 1.0),
            ),
          );
        },
        () {
          if (generation == _generation) unawaited(stop());
        },
      );
      if (generation != _generation) return;
      if (!ready) {
        await stop(fallback: true);
      } else {
        state = AsyncData(
          VoiceState(
            VoiceStatus.listening,
            transcript: state.valueOrNull?.transcript ?? previous,
          ),
        );
      }
    } catch (_) {
      if (generation == _generation) await stop(fallback: true);
    }
  }

  Future<void> stop({bool fallback = false}) async {
    final input = ref.read(speechInputProvider);
    _generation++;
    _silence?.cancel();
    _hardLimit?.cancel();
    final text = state.valueOrNull?.transcript ?? '';
    state = AsyncData(
      VoiceState(
        fallback ? VoiceStatus.typedFallback : VoiceStatus.idle,
        transcript: text,
      ),
    );
    try {
      await input.stop();
    } catch (_) {
      /* Typed input remains available. */
    }
  }
}
