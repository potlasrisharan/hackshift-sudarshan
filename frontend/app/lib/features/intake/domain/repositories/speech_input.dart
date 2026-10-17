typedef SpeechText = void Function(String text);
typedef SpeechLevel = void Function(double level);

abstract interface class SpeechInput {
  bool get supported;
  Future<bool> start(
    String locale,
    SpeechText onText,
    SpeechLevel onLevel,
    void Function() onDone,
  );
  Future<void> stop();
}
