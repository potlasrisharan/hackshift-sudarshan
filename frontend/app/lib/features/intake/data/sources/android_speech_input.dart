import 'package:flutter/foundation.dart';
import 'package:speech_to_text/speech_to_text.dart';
import '../../domain/repositories/speech_input.dart';

/// Single recognizer instance; callbacks are routed to the active utterance.
/// Web intentionally uses the typed fallback without invoking browser speech.
final class AndroidSpeechInput implements SpeechInput {
  final SpeechToText _speech = SpeechToText();
  void Function()? _done;
  int _generation = 0;
  @override
  bool get supported =>
      !kIsWeb && defaultTargetPlatform == TargetPlatform.android;
  @override
  Future<bool> start(
    String locale,
    SpeechText onText,
    SpeechLevel onLevel,
    void Function() onDone,
  ) async {
    if (!supported) return false;
    final generation = ++_generation;
    _done = onDone;
    final ready = await _speech.initialize(
      debugLogging: false,
      onStatus: (status) {
        if (status == 'done' || status == 'notListening') _done?.call();
      },
      onError: (_) => _done?.call(),
    );
    if (!ready || generation != _generation) return false;
    final locales = await _speech.locales();
    final matches = locales.where(
      (v) =>
          v.localeId.replaceAll('_', '-').toLowerCase() == locale.toLowerCase(),
    );
    if (matches.isEmpty || generation != _generation) return false;
    await _speech.listen(
      localeId: matches.first.localeId,
      listenFor: const Duration(seconds: 45),
      pauseFor: const Duration(seconds: 5),
      listenOptions: SpeechListenOptions(
        partialResults: true,
        cancelOnError: true,
        onDevice: true,
      ),
      onResult: (result) {
        if (generation == _generation) onText(result.recognizedWords);
      },
      onSoundLevelChange: (level) {
        if (generation == _generation) onLevel(level);
      },
    );
    return generation == _generation && _speech.isListening;
  }

  @override
  Future<void> stop() async {
    _generation++;
    _done = null;
    if (supported) await _speech.cancel();
  }
}
