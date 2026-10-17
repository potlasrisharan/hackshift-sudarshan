import 'package:flutter_riverpod/flutter_riverpod.dart' show Ref;
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../features/intake/domain/entities/intake_flow_state.dart';
import '../../features/intake/presentation/providers/core_providers.dart';
import '../../features/intake/presentation/screens/language_screen.dart';
import '../../features/intake/presentation/screens/identify_screen.dart';
part 'app_router.g.dart';

@Riverpod(keepAlive: true)
GoRouter appRouter(Ref<Object?> ref) {
  final router = GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      if (state.uri.path == '/') return null;
      final flow = ref.read(intakeFlowProvider).valueOrNull;
      if (flow is! AwaitingIdentity) return '/';
      return state.uri.path == '/identify' ? null : '/identify';
    },
    routes: [
      GoRoute(path: '/', builder: (context, state) => const LanguageScreen()),
      GoRoute(
        path: '/identify',
        builder: (context, state) => const IdentifyScreen(),
      ),
      GoRoute(path: '/converse', redirect: (context, state) => '/identify'),
      GoRoute(path: '/scan', redirect: (context, state) => '/identify'),
      GoRoute(path: '/summary', redirect: (context, state) => '/identify'),
      GoRoute(path: '/queue', redirect: (context, state) => '/identify'),
    ],
  );
  ref.onDispose(router.dispose);
  return router;
}
