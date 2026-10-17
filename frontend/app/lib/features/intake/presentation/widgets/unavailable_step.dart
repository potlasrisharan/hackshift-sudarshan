import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../domain/entities/intake_flow_state.dart';
import '../providers/core_providers.dart';
import 'kiosk_shell.dart';

class UnavailableStep extends ConsumerWidget {
  final String title;
  const UnavailableStep({super.key, required this.title});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = AppStrings.of(context);
    final flow = ref.watch(intakeFlowProvider);
    final caption = flow.when(
      loading: () => strings.loading,
      error: (_, _) => strings.flowBlocked,
      data: (value) => switch (value) {
        ChoosingLanguage() => strings.flowChoosing,
        AwaitingIdentity() => strings.flowIdentity,
        IntakeBlocked() => strings.flowBlocked,
        EditingIntake() ||
        SubmittingIntake() ||
        IntakeComplete() => strings.flowBlocked,
      },
    );
    return KioskShell(
      title: title,
      children: [
        Text(caption),
        const SizedBox(height: 24),
        Semantics(
          header: true,
          child: Text(
            strings.unavailableTitle,
            style: Theme.of(context).textTheme.titleLarge,
          ),
        ),
        const SizedBox(height: 16),
        Text(strings.unavailableBody),
        const SizedBox(height: 24),
        KioskAction(
          label: strings.back,
          onPressed: () {
            ref.read(intakeFlowProvider.notifier).reset();
            context.go('/');
          },
        ),
      ],
    );
  }
}
