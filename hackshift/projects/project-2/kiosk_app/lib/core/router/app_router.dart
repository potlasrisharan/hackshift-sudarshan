import "package:go_router/go_router.dart";
import "package:kiosk_app/features/intake/presentation/screens/language_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/identify_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/converse_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/scan_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/summarize_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/queue_token_screen.dart";

final appRouter = GoRouter(
  initialLocation: "/",
  routes: [
    GoRoute(
      path: "/",
      builder: (context, state) => const LanguageScreen(),
    ),
    GoRoute(
      path: "/identify",
      builder: (context, state) => const IdentifyScreen(),
    ),
    GoRoute(
      path: "/converse",
      builder: (context, state) => const ConverseScreen(),
    ),
    GoRoute(
      path: "/scan",
      builder: (context, state) => const ScanScreen(),
    ),
    GoRoute(
      path: "/summarize",
      builder: (context, state) => const SummarizeScreen(),
    ),
    GoRoute(
      path: "/queue",
      builder: (context, state) => const QueueTokenScreen(),
    ),
  ],
);
