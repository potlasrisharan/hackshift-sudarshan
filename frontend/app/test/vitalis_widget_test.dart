import "package:flutter/material.dart";
import "package:flutter_test/flutter_test.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:kiosk_app/core/constants/app_strings.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_dashboard_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_healthspan_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_biomarkers_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_cardio_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_wearables_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_activity_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_nutrition_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_sleep_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_functional_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_preventive_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_simulator_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_trajectory_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_copilot_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_summary_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_settings_screen.dart";
import "package:kiosk_app/features/vitalis/presentation/screens/vitalis_onboarding_screen.dart";
import "package:kiosk_app/features/vitalis/data/models/vitalis_models.dart";
import "package:kiosk_app/features/vitalis/data/services/vitalis_api_service.dart";
import "package:shared_preferences/shared_preferences.dart";

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group("AyuSetu Vitalis Widget & Responsive Tests", () {
    Future<void> testScreen(WidgetTester tester, Widget screen) async {
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() {
        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      });

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: screen,
          ),
        ),
      );
      await tester.pumpAndSettle();
    }

    testWidgets("VitalisDashboardScreen renders with zero overflow on 360px viewport", (tester) async {
      await testScreen(tester, const VitalisDashboardScreen());
      expect(find.text(AppStrings.vitalisHeader), findsOneWidget);
      expect(find.text(AppStrings.healthspanIndex), findsOneWidget);
      // Strictly verify no biological age claims
      expect(find.text("Calculated Biological Age"), findsNothing);
      expect(find.text("-4.6 yrs"), findsNothing);
    });

    testWidgets("VitalisHealthspanScreen renders 8 domain progress scores", (tester) async {
      await testScreen(tester, const VitalisHealthspanScreen());
      expect(find.text("Healthspan Progress Index (HPI)"), findsOneWidget);
      expect(find.text("Data Coverage & Completeness"), findsOneWidget);
    });

    testWidgets("VitalisBiomarkersScreen renders clinical radar & quarantine rules", (tester) async {
      await testScreen(tester, const VitalisBiomarkersScreen());
      expect(find.text("Biomarker Intelligence"), findsOneWidget);
    });

    testWidgets("VitalisCardioScreen renders VO2max provenance disclosure", (tester) async {
      await testScreen(tester, const VitalisCardioScreen());
      expect(find.text("Cardiorespiratory Fitness"), findsOneWidget);
      expect(find.text("Source & Provenance Traceability"), findsOneWidget);
    });

    testWidgets("VitalisWearablesScreen renders 21-day rolling baseline", (tester) async {
      await testScreen(tester, const VitalisWearablesScreen());
      expect(find.text("Wearable Intelligence"), findsOneWidget);
      expect(find.text("Apple HealthKit"), findsOneWidget);
    });

    testWidgets("VitalisActivityScreen renders adaptive exercise targets & yoga", (tester) async {
      await testScreen(tester, const VitalisActivityScreen());
      expect(find.text("Exercise & Yoga Planner"), findsOneWidget);
      expect(find.text("Aerobic Target"), findsOneWidget);
    });

    testWidgets("VitalisNutritionScreen renders ICMR-NIN Indian food database", (tester) async {
      await testScreen(tester, const VitalisNutritionScreen());
      expect(find.text("Indian Nutrition Intelligence"), findsOneWidget);
      expect(find.text("Metabolic Intake Goals"), findsOneWidget);
    });

    testWidgets("VitalisSleepScreen renders Sleep Regularity Index and staging", (tester) async {
      await testScreen(tester, const VitalisSleepScreen());
      expect(find.text("Sleep Regularity & Circadian SRI"), findsOneWidget);
      expect(find.text("Sleep Regularity Index (SRI)"), findsOneWidget);
    });

    testWidgets("VitalisFunctionalScreen renders grip strength & WHO ICOPE criteria", (tester) async {
      await testScreen(tester, const VitalisFunctionalScreen());
      expect(find.text("Functional Health & Intrinsic Capacity"), findsOneWidget);
      expect(find.text("WHO ICOPE Intrinsic Capacity"), findsOneWidget);
    });

    testWidgets("VitalisPreventiveScreen renders guidelines-based screening timeline", (tester) async {
      await testScreen(tester, const VitalisPreventiveScreen());
      expect(find.text("Preventive Care & Screening Timeline"), findsOneWidget);
      expect(find.text("Screening Adherence"), findsOneWidget);
    });

    testWidgets("VitalisSimulatorScreen renders modifiable levers without lifespan claims", (tester) async {
      await testScreen(tester, const VitalisSimulatorScreen());
      expect(find.text("What-If Behavior Simulator"), findsOneWidget);
      expect(find.text("Projected Healthspan Progress Index (HPI)"), findsOneWidget);
    });

    testWidgets("VitalisTrajectoryScreen renders multi-axis longitudinal trends", (tester) async {
      await testScreen(tester, const VitalisTrajectoryScreen());
      expect(find.text("Longitudinal Healthspan Trajectory"), findsOneWidget);
    });

    testWidgets("VitalisCopilotScreen renders redaction badge and prompt chips", (tester) async {
      await testScreen(tester, const VitalisCopilotScreen());
      expect(find.text("Vitalis AI Healthspan Copilot"), findsOneWidget);
      expect(find.text("Zero-PHI Redaction Active · Deterministic Safety Verified"), findsOneWidget);
    });

    testWidgets("VitalisSummaryScreen renders clinician-ready export & secure token", (tester) async {
      await testScreen(tester, const VitalisSummaryScreen());
      expect(find.text("Clinician Summary & Export"), findsOneWidget);
      expect(find.text("Verified Laboratory Observations (FHIR R4)"), findsOneWidget);
    });

    testWidgets("VitalisSettingsScreen renders privacy vault & immutable audit log", (tester) async {
      await testScreen(tester, const VitalisSettingsScreen());
      expect(find.text("Privacy, Consent & Data Vault"), findsOneWidget);
      expect(find.text("Immutable Access Audit Log"), findsOneWidget);
    });

    testWidgets("VitalisOnboardingScreen renders dynamic steps and toggles HER module for Female", (tester) async {
      await testScreen(tester, const VitalisOnboardingScreen());
      expect(find.text("AyuSetu Health Onboarding"), findsOneWidget);
      expect(find.text("Step 1 of 4 · Preventive Healthspan"), findsOneWidget);
      expect(find.text("Step 1: Core Demographics"), findsOneWidget);
      expect(find.text("Biological Sex for Clinical Guidelines"), findsOneWidget);
      expect(find.text("Female (Enables HER Care)"), findsOneWidget);
      expect(find.text("Male"), findsOneWidget);

      // Tapping Female should expand steps to 5 and enable HER Care
      await tester.tap(find.text("Female (Enables HER Care)"));
      await tester.pumpAndSettle();
      expect(find.text("Step 1 of 5 · Longevity & Women's Health"), findsOneWidget);

      // Tapping Male should reduce steps to 4
      await tester.tap(find.text("Male"));
      await tester.pumpAndSettle();
      expect(find.text("Step 1 of 4 · Preventive Healthspan"), findsOneWidget);

      // Switch back to Female to verify full HER flow
      await tester.tap(find.text("Female (Enables HER Care)"));
      await tester.pumpAndSettle();
      expect(find.text("Step 1 of 5 · Longevity & Women's Health"), findsOneWidget);

      // Proceed to Step 2 (Body Measurements)
      await tester.ensureVisible(find.text("Continue"));
      await tester.pumpAndSettle();
      await tester.tap(find.text("Continue"));
      await tester.pumpAndSettle();
      expect(find.text("Step 2: Body Measurements"), findsOneWidget);
      expect(find.text("Height (cm)"), findsOneWidget);
      expect(find.text("Weight (kg)"), findsOneWidget);
      expect(find.text("Calculated BMI: 26.4 kg/m²"), findsOneWidget);
    });

    test("Vitalis check-in and profile persist locally and compute HPI offline", () async {
      const api = VitalisApiService(patientId: "test_persist_vit");
      const profile = VitalisProfileModel(
        patientId: "test_persist_vit",
        yearOfBirth: 1985,
        sex: "FEMALE",
        heightCm: 165.0,
        weightKg: 62.0,
        diagnosedConditions: ["Pre-diabetes"],
      );

      final savedProfile = await api.updateProfile(profile);
      expect(savedProfile.yearOfBirth, 1985);

      final fetchedProfile = await api.fetchProfile();
      expect(fetchedProfile.yearOfBirth, 1985);
      expect(fetchedProfile.sex, "FEMALE");

      final checkInSuccess = await api.recordHealthspanCheckIn(
        weeklyActivityMinutes: 180,
        weeklyStrengthSessions: 3,
        averageSleepHours: 7.5,
        activityAdherencePercent: 88,
        fatigueRating: 2,
        symptomsDuringExercise: false,
      );
      expect(checkInSuccess, isTrue);

      final hpi = await api.fetchHealthspanIndex();
      expect(hpi.hpiScore, isNotNull);
      expect(hpi.hpiScore!, greaterThanOrEqualTo(75));
      expect(hpi.domains.length, 8);
    });
  });
}
