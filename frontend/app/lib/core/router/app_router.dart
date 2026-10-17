import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart' show Ref;
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../features/intake/domain/entities/intake_flow_state.dart';
import '../../features/intake/presentation/providers/core_providers.dart';
import '../../features/intake/presentation/screens/language_screen.dart';
import '../../features/intake/presentation/screens/identify_screen.dart';
import '../../features/intake/presentation/screens/converse_screen.dart';
import '../../features/intake/presentation/screens/summarize_screen.dart';
import '../../features/intake/presentation/screens/queue_token_screen.dart';
part 'app_router.g.dart';

@Riverpod(keepAlive: true)
GoRouter appRouter(Ref<Object?> ref) {
  final refresh = ValueNotifier<int>(0);
  ref.listen(intakeFlowProvider, (_, next) {
    refresh.value++;
  });
  final router = GoRouter(
    initialLocation: '/',
    refreshListenable: refresh,
    redirect: (context, state) {
      final flow = ref.read(intakeFlowProvider);
      final target = flow.isLoading
          ? '/identify'
          : switch (flow.valueOrNull) {
              ChoosingLanguage() || null => '/',
              AwaitingIdentity() || IntakeBlocked() => '/identify',
              EditingIntake(:final step) => switch (step) {
                IntakeStep.identity => '/identify',
                IntakeStep.converse => '/converse',
                IntakeStep.summary => '/summary',
              },
              SubmittingIntake() => '/summary',
              IntakeComplete() => '/queue',
            };
      return state.uri.path == target ? null : target;
    },
    routes: [
      GoRoute(path: '/', builder: (_, state) => const LanguageScreen()),
      GoRoute(path: '/identify', builder: (_, state) => const IdentifyScreen()),
      GoRoute(path: '/converse', builder: (_, state) => const ConverseScreen()),
      GoRoute(path: '/summary', builder: (_, state) => const SummaryScreen()),
      GoRoute(path: '/queue', builder: (_, state) => const QueueTokenScreen()),
      GoRoute(path: '/scan', redirect: (_, state) => '/summary'),
    ],
  );
  ref.onDispose(() {
    router.dispose();
    refresh.dispose();
  });
  return router;
}
