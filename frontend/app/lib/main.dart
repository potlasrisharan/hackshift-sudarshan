import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "core/constants/app_strings.dart";
import "core/theme/app_theme.dart";
import "core/router/app_router.dart";

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: AyuSetuApp()));
}

class AyuSetuApp extends StatelessWidget {
  const AyuSetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: appRouter,
    );
  }
}

typedef MediKioskApp = AyuSetuApp;
