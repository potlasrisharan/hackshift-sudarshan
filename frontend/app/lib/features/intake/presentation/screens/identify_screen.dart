import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../../../core/error/localized_failure.dart';
import '../../domain/entities/intake_draft.dart';
import '../../domain/entities/intake_flow_state.dart';
import '../providers/core_providers.dart';
import '../widgets/kiosk_shell.dart';

class IdentifyScreen extends ConsumerStatefulWidget {
  const IdentifyScreen({super.key});
  @override
  ConsumerState<IdentifyScreen> createState() => _IdentifyScreenState();
}

class _IdentifyScreenState extends ConsumerState<IdentifyScreen> {
  final _org = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _name = TextEditingController();
  final _birth = TextEditingController();
  @override
  void initState() {
    super.initState();
    final flow = ref.read(intakeFlowProvider).valueOrNull;
    if (flow is EditingIntake) {
      _name.text = flow.draft.name;
      _birth.text = flow.draft.birthDate;
    }
  }

  @override
  void dispose() {
    for (final c in [_org, _email, _password, _name, _birth]) {
      c.clear();
      c.dispose();
    }
    super.dispose();
  }

  void _edit(IntakeDraft Function(IntakeDraft) update) {
    final value = ref.read(intakeFlowProvider).valueOrNull;
    if (value is EditingIntake) {
      ref.read(intakeFlowProvider.notifier).edit(update(value.draft));
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStrings.of(context);
    final async = ref.watch(intakeFlowProvider);
    final flow = async.valueOrNull;
    final editing = flow is EditingIntake ? flow : null;
    return KioskShell(
      title: editing == null ? s.staffTitle : s.identifyTitle,
      children: [
        Text(s.demoNotice),
        const SizedBox(height: 16),
        if (editing == null) ...[
          Text(s.staffHelp),
          if (flow is IntakeBlocked) Text(localizedFailure(flow.failure, s)),
          if (flow is! IntakeBlocked) ...[
            KioskField(
              controller: _org,
              label: s.organization,
              fieldKey: 'organization',

              maxLength: 80,
            ),
            KioskField(
              controller: _email,
              label: s.email,
              fieldKey: 'email',

              maxLength: 160,
              keyboard: TextInputType.emailAddress,
            ),
            KioskField(
              controller: _password,
              label: s.password,
              fieldKey: 'password',

              maxLength: 200,
              obscure: true,
            ),
            KioskAction(
              label: async.isLoading ? s.loading : s.signIn,
              onPressed: async.isLoading
                  ? null
                  : () {
                      final password = _password.text;
                      _password.clear();
                      unawaited(
                        ref
                            .read(intakeFlowProvider.notifier)
                            .login(_org.text, _email.text, password),
                      );
                    },
            ),
          ],
        ] else ...[
          Text(s.identityHelp),
          const SizedBox(height: 12),
          Text(s.identifierUnavailable),
          KioskField(
            controller: _name,
            label: s.patientName,
            fieldKey: 'patient-name',
            maxLength: 120,
            onChanged: (v) => _edit((d) => d.copyWith(name: v)),
          ),
          KioskField(
            controller: _birth,
            label: s.birthDate,
            fieldKey: 'birth-date',
            maxLength: 10,
            keyboard: TextInputType.datetime,
            onChanged: (v) => _edit((d) => d.copyWith(birthDate: v)),
          ),
          DropdownButtonFormField<PatientGender>(
            key: const Key('gender'),
            initialValue: editing.draft.gender,
            isExpanded: true,
            decoration: InputDecoration(labelText: s.gender),
            items: [
              for (final g in PatientGender.values)
                DropdownMenuItem(
                  value: g,
                  child: Text(switch (g) {
                    PatientGender.female => s.female,
                    PatientGender.male => s.male,
                    PatientGender.other => s.other,
                    PatientGender.unknown => s.unknown,
                  }),
                ),
            ],
            onChanged: (g) {
              if (g != null) _edit((d) => d.copyWith(gender: g));
            },
          ),
          SwitchListTile(
            title: Text(s.syntheticConfirm),
            value: editing.draft.synthetic,
            onChanged: (v) => _edit((d) => d.copyWith(synthetic: v)),
          ),
          KioskAction(
            label: s.next,
            onPressed: editing.draft.validIdentity
                ? () {
                    ref
                        .read(intakeFlowProvider.notifier)
                        .step(IntakeStep.converse);
                    context.go('/converse');
                  }
                : null,
          ),
        ],
        const SizedBox(height: 16),
        KioskAction(
          label: s.back,
          outlined: true,
          onPressed: () {
            ref.read(intakeFlowProvider.notifier).reset();
            context.go('/');
          },
        ),
      ],
    );
  }
}

class KioskField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String fieldKey;
  final bool enabled;
  final bool obscure;
  final int maxLength;
  final int lines;
  final TextInputType? keyboard;
  final ValueChanged<String>? onChanged;
  const KioskField({
    super.key,
    required this.controller,
    required this.label,
    required this.fieldKey,
    this.enabled = true,
    this.obscure = false,
    this.maxLength = 2000,
    this.lines = 1,
    this.keyboard,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 16),
    child: TextField(
      key: Key(fieldKey),
      controller: controller,
      enabled: enabled,
      obscureText: obscure,
      enableSuggestions: false,
      autocorrect: false,
      enableIMEPersonalizedLearning: false,
      keyboardType: keyboard,
      maxLength: maxLength,
      maxLines: lines,
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
    ),
  );
}
