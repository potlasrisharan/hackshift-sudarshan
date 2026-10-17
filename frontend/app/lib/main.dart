import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "core/constants/app_strings.dart";
import "core/services/medicine_reminder_service.dart";
import "core/theme/app_theme.dart";
import "core/router/app_router.dart";
import "core/app_session.dart";
import "package:shared_preferences/shared_preferences.dart";

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final preferences = await SharedPreferences.getInstance();
  AppSession.onboardingComplete = preferences.getBool(AppSession.onboardingKey) ?? false;
  try {
    await MedicineReminderService.instance.initialize();
  } catch (e) {
    debugPrint("Failed to initialize MedicineReminderService at boot: $e");
  }
  runApp(const ProviderScope(child: AyuSetuApp()));
}

class AyuSetuApp extends StatelessWidget {
  const AyuSetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      routerConfig: appRouter,
    );
  }
}
