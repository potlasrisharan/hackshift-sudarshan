import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "core/theme/app_theme.dart";
import "core/router/app_router.dart";

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: MediKioskApp()));
}

class MediKioskApp extends StatelessWidget {
  const MediKioskApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: "MediKiosk Patient Intake",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: appRouter,
    );
  }
}
