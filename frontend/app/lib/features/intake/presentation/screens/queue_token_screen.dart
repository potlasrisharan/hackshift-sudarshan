import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/localization/app_strings.dart';
import '../../domain/entities/intake_flow_state.dart';
import '../providers/core_providers.dart';
import '../widgets/kiosk_shell.dart';

import 'converse_screen.dart';
import '../providers/speech_providers.dart';

class QueueTokenScreen extends ConsumerStatefulWidget {
  const QueueTokenScreen({super.key});
  @override
  ConsumerState<QueueTokenScreen> createState() => _QueueTokenScreenState();
}

class _QueueTokenScreenState extends ConsumerState<QueueTokenScreen> {
  Timer? _timer;
  late DateTime _deadline;
  DateTime _now() => ref.read(kioskClockProvider)();
  int _seconds = 60;
  @override
  void initState() {
    super.initState();
    _deadline = _now().add(const Duration(seconds: 60));
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      final seconds = (_deadline.difference(_now()).inMilliseconds / 1000)
          .ceil();
      if (seconds <= 0) {
        _reset();
        return;
      }
      if (mounted) setState(() => _seconds = seconds);
    });
  }

  void _touch() {
    _deadline = _now().add(const Duration(seconds: 60));
  }

  void _reset() {
    _timer?.cancel();
    ref.invalidate(voiceControllerProvider);
    ref.read(intakeFlowProvider.notifier).reset();
    ref.invalidate(preferencesProvider);
    context.go('/');
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStrings.of(context);
    final value = ref.watch(intakeFlowProvider).valueOrNull;
    if (value is! IntakeComplete) return const SizedBox.shrink();
    return Listener(
      onPointerDown: (_) => _touch(),
      onPointerSignal: (_) => _touch(),
      child: Focus(
        onKeyEvent: (_, event) {
          _touch();
          return KeyEventResult.ignored;
        },
        child: KioskShell(
          title: s.receiptTitle,
          bottom: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                '${s.resetCountdown}: $_seconds',
                key: const Key('reset-countdown'),
              ),
            ),
          ),
          children: [
            if (value.receipt.emergency)
              EmergencyNotice(text: s.informStaff)
            else
              Text(s.routineReceived),
            const SizedBox(height: 24),
            Text(s.reference),
            Text(
              value.receipt.id,
              key: const Key('encounter-reference'),
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),
            Text(s.consentRecorded),
            Text(s.tokenUnavailable),
            const SizedBox(height: 24),
            const SizedBox(height: 16),
            KioskAction(label: s.newPatient, onPressed: _reset),
          ],
        ),
      ),
    );
  }
}
