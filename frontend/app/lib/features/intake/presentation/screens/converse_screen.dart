import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../domain/entities/intake_draft.dart';
import '../../domain/entities/intake_flow_state.dart';
import '../providers/core_providers.dart';
import '../widgets/kiosk_shell.dart';

import 'package:flutter/foundation.dart';
import '../providers/speech_providers.dart';
import 'identify_screen.dart';

class ConverseScreen extends ConsumerStatefulWidget {
  const ConverseScreen({super.key});
  @override
  ConsumerState<ConverseScreen> createState() => _ConverseScreenState();
}

class _ConverseScreenState extends ConsumerState<ConverseScreen> {
  final _text = TextEditingController();
  @override
  void initState() {
    super.initState();
    final value = ref.read(intakeFlowProvider).valueOrNull;
    if (value is EditingIntake) _text.text = value.draft.complaint;
  }

  @override
  void dispose() {
    _text.clear();
    _text.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStrings.of(context);
    final flow = ref.watch(intakeFlowProvider).valueOrNull;
    final voice = ref.watch(voiceControllerProvider).valueOrNull;
    ref.listen(voiceControllerProvider, (_, next) {
      final value = next.valueOrNull;
      if (value != null && value.transcript != _text.text) {
        _text.value = TextEditingValue(
          text: value.transcript,
          selection: TextSelection.collapsed(offset: value.transcript.length),
        );
        final current = ref.read(intakeFlowProvider).valueOrNull;
        if (current is EditingIntake) {
          ref
              .read(intakeFlowProvider.notifier)
              .edit(current.draft.copyWith(complaint: value.transcript));
        }
      }
    });
    if (flow is! EditingIntake) return const SizedBox.shrink();
    final listening =
        voice?.status == VoiceStatus.listening ||
        voice?.status == VoiceStatus.starting;
    final symptomLabels = <Symptom, String>{
      Symptom.chestPain: s.chestPain,
      Symptom.breathless: s.breathless,
      Symptom.fainting: s.fainting,
      Symptom.fever: s.fever,
      Symptom.cough: s.cough,
      Symptom.fatigue: s.fatigue,
      Symptom.thirst: s.thirst,
    };
    return KioskShell(
      title: s.converseTitle,
      children: [
        Text(kIsWeb ? s.webTyped : s.speechNotice),
        if (!kIsWeb)
          KioskAction(
            label: listening ? s.stopSpeech : s.speak,
            onPressed: voice?.status == VoiceStatus.starting
                ? null
                : () => unawaited(
                    listening
                        ? ref.read(voiceControllerProvider.notifier).stop()
                        : ref
                              .read(voiceControllerProvider.notifier)
                              .start(
                                '${flow.draft.language.name}-IN',
                                _text.text,
                              ),
                  ),
          ),
        if (voice?.status == VoiceStatus.typedFallback) Text(s.typedFallback),
        if (listening) ...[
          Text(s.listening),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: voice?.level ?? 0),
            duration: const Duration(milliseconds: 120),
            builder: (context, value, child) => LinearProgressIndicator(
              value: value,
              semanticsLabel: s.listening,
            ),
          ),
        ],
        KioskField(
          controller: _text,
          label: s.complaint,
          fieldKey: 'complaint',
          lines: 5,
          enabled: !listening,
          onChanged: (v) => ref
              .read(intakeFlowProvider.notifier)
              .edit(flow.draft.copyWith(complaint: v)),
        ),
        Text(s.redFlagHelp),
        for (final symptom in Symptom.values)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: DropdownButtonFormField<Answer>(
              key: Key('answer-${symptom.name}'),
              initialValue: flow.draft.answers[symptom],
              isExpanded: true,
              decoration: InputDecoration(labelText: symptomLabels[symptom]),
              items: [
                for (final answer in Answer.values)
                  DropdownMenuItem(
                    value: answer,
                    child: Text(switch (answer) {
                      Answer.yes => s.yes,
                      Answer.no => s.no,
                      Answer.unsure => s.unsure,
                    }),
                  ),
              ],
              onChanged: (answer) {
                if (answer != null) {
                  ref
                      .read(intakeFlowProvider.notifier)
                      .edit(
                        flow.draft.copyWith(
                          answers: {...flow.draft.answers, symptom: answer},
                        ),
                      );
                }
              },
            ),
          ),
        if (flow.draft.danger) EmergencyNotice(text: s.informStaff),
        KioskAction(
          label: s.review,
          onPressed: flow.draft.validComplaint && !listening
              ? () {
                  ref
                      .read(intakeFlowProvider.notifier)
                      .step(IntakeStep.summary);
                  context.go('/summary');
                }
              : null,
        ),
        const SizedBox(height: 16),
        KioskAction(
          label: s.back,
          outlined: true,
          onPressed: () {
            ref.invalidate(voiceControllerProvider);
            ref.read(intakeFlowProvider.notifier).reset();
            context.go('/');
          },
        ),
      ],
    );
  }
}

class EmergencyNotice extends StatelessWidget {
  final String text;
  const EmergencyNotice({super.key, required this.text});
  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    liveRegion: true,
    child: Card(
      color: Theme.of(context).colorScheme.error,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Text(
          text,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
            color: Theme.of(context).colorScheme.onError,
          ),
        ),
      ),
    ),
  );
}
