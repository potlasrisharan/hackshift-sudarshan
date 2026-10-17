import '../../domain/entities/intake_draft.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/error/failure.dart';
import '../../../../core/error/localized_failure.dart';
import '../../domain/entities/intake_flow_state.dart';
import '../providers/core_providers.dart';
import '../widgets/kiosk_shell.dart';

import 'converse_screen.dart';

class SummaryScreen extends ConsumerWidget {
  const SummaryScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final s = AppStrings.of(context);
    final value = ref.watch(intakeFlowProvider).valueOrNull;
    final EditingIntake? editing = switch (value) {
      EditingIntake() => value,
      SubmittingIntake(:final pending) => pending,
      _ => null,
    };
    if (editing == null) return const SizedBox.shrink();
    final draft = editing.draft;
    final busy = value is SubmittingIntake;
    final locked = ref.read(intakeFlowProvider.notifier).submissionLocked;
    return KioskShell(
      title: s.summaryTitle,
      children: [
        Text(s.demoNotice),
        const SizedBox(height: 16),
        Text('${s.patientName}: ${draft.name}'),
        Text('${s.birthDate}: ${draft.birthDate}'),
        const SizedBox(height: 16),
        Text(draft.complaint),
        const SizedBox(height: 16),
        Text(s.noVitals),
        Text(s.noOcr),
        for (final entry in draft.answers.entries)
          Text(
            '${switch (entry.key) {
              Symptom.chestPain => s.chestPain,
              Symptom.breathless => s.breathless,
              Symptom.fainting => s.fainting,
              Symptom.fever => s.fever,
              Symptom.cough => s.cough,
              Symptom.fatigue => s.fatigue,
              Symptom.thirst => s.thirst,
            }}: ${switch (entry.value) {
              Answer.yes => s.yes,
              Answer.no => s.no,
              Answer.unsure => s.unsure,
            }}',
          ),
        if (draft.danger) EmergencyNotice(text: s.informStaff),
        SwitchListTile(
          key: const Key('care-consent'),
          title: Text(s.careConsent),
          value: draft.consent,
          onChanged: busy || locked
              ? null
              : (v) => ref
                    .read(intakeFlowProvider.notifier)
                    .edit(draft.copyWith(consent: v)),
        ),
        if (editing.failure case final Failure failure) ...[
          Text(localizedFailure(failure, s)),
          Text(s.retryUncertain),
        ],
        KioskAction(
          key: const Key('submit-intake'),
          label: busy ? s.loading : s.submitIntake,
          onPressed: !busy && draft.canSubmit
              ? () => unawaited(ref.read(intakeFlowProvider.notifier).submit())
              : null,
        ),
        const SizedBox(height: 16),
        KioskAction(
          label: s.editComplaint,
          outlined: true,
          onPressed: busy || locked
              ? null
              : () {
                  ref
                      .read(intakeFlowProvider.notifier)
                      .step(IntakeStep.converse);
                  context.go('/converse');
                },
        ),
        const SizedBox(height: 16),
        KioskAction(
          label: s.newPatient,
          outlined: true,
          onPressed: busy
              ? null
              : () {
                  ref.read(intakeFlowProvider.notifier).reset();
                  context.go('/');
                },
        ),
      ],
    );
  }
}
