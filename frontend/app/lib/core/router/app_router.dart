import "package:go_router/go_router.dart";
import "../app_session.dart";
import "../../features/portal/presentation/screens/portal_selection_screen.dart";
import "../../features/nurse/presentation/screens/nurse_triage_screen.dart";
import "../../features/headquarters/presentation/screens/headquarters_screen.dart";
import "../../features/clinical_mgmt/presentation/screens/clinical_management_screen.dart";
import "../../features/yoga/presentation/screens/yoga_prescription_screen.dart";
import "../../features/longevity/presentation/screens/longevity_screen.dart";
import "../../features/womens_health/presentation/screens/womens_health_screen.dart";
import "../../features/her/presentation/screens/her_hub_screen.dart";
import "../../features/her/presentation/screens/her_cycle_screen.dart";
import "../../features/her/presentation/screens/her_symptom_journal_screen.dart";
import "../../features/her/presentation/screens/her_questionnaire_screen.dart";
import "../../features/her/presentation/screens/her_wellness_studio_screen.dart";
import "../../features/her/presentation/screens/her_doctor_summary_screen.dart";
import "../../features/her/presentation/screens/her_wearable_screen.dart";

// AyuSetu Vitalis Module Screens
import "../../features/vitalis/presentation/screens/vitalis_dashboard_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_onboarding_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_questionnaire_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_healthspan_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_biomarkers_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_cardio_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_wearables_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_activity_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_nutrition_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_sleep_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_functional_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_preventive_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_simulator_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_trajectory_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_copilot_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_summary_screen.dart";
import "../../features/vitalis/presentation/screens/vitalis_settings_screen.dart";
import "../../features/prescription/presentation/screens/medicine_reminder_screen.dart";

final appRouter = GoRouter(
  initialLocation: "/",
  redirect: (context, state) {
    final onOnboarding = state.matchedLocation == "/onboarding" ||
        state.matchedLocation == "/vitalis/onboarding";
    if (!AppSession.onboardingComplete && !onOnboarding) return "/onboarding";
    if (AppSession.onboardingComplete && onOnboarding) return "/";
    return null;
  },
  routes: [
    GoRoute(
      path: "/",
      builder: (context, state) => const PortalSelectionScreen(),
    ),
    // Patient Prescription & Medicine Reminder
    GoRoute(
      path: "/prescription",
      builder: (context, state) => const MedicineReminderScreen(),
    ),
    // Deprecated Patient Kiosk Routes (Safely Redirect to Home)
    GoRoute(
      path: "/kiosk",
      redirect: (context, state) => "/",
    ),
    GoRoute(
      path: "/identify",
      redirect: (context, state) => "/",
    ),
    GoRoute(
      path: "/converse",
      redirect: (context, state) => "/",
    ),
    GoRoute(
      path: "/scan",
      redirect: (context, state) => "/",
    ),
    GoRoute(
      path: "/summarize",
      redirect: (context, state) => "/",
    ),
    GoRoute(
      path: "/queue",
      redirect: (context, state) => "/",
    ),
    // Hospital & Clinic Operations
    GoRoute(
      path: "/nurse",
      builder: (context, state) => const NurseTriageScreen(),
    ),
    GoRoute(
      path: "/hq",
      builder: (context, state) => const HeadquartersScreen(),
    ),
    GoRoute(
      path: "/clinical",
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>?;
        return ClinicalManagementScreen(
          clinicId: state.uri.queryParameters["id"] ?? extra?["id"] as String?,
          clinicName: state.uri.queryParameters["name"] ?? extra?["name"] as String?,
          occupancy: state.uri.queryParameters["occupancy"] ?? extra?["occupancy"] as String?,
          status: state.uri.queryParameters["status"] ?? extra?["status"] as String?,
        );
      },
    ),
    // Wellness & Longevity Innovations
    GoRoute(
      path: "/yoga",
      builder: (context, state) => const YogaPrescriptionScreen(),
    ),
    GoRoute(
      path: "/longevity",
      builder: (context, state) => const LongevityScreen(),
    ),
    GoRoute(
      path: "/womens-health",
      builder: (context, state) => const WomensHealthScreen(),
    ),
    // AyuSetu HER Module Routes
    GoRoute(
      path: "/her",
      builder: (context, state) => const HerHubScreen(),
    ),
    GoRoute(
      path: "/her/cycle-calendar",
      builder: (context, state) => const HerCycleScreen(),
    ),
    GoRoute(
      path: "/her/symptom-journal",
      builder: (context, state) => const HerSymptomJournalScreen(),
    ),
    GoRoute(
      path: "/her/questionnaire",
      builder: (context, state) => const HerQuestionnaireScreen(),
    ),
    GoRoute(
      path: "/her/wellness-studio",
      builder: (context, state) => const HerWellnessStudioScreen(),
    ),
    GoRoute(
      path: "/her/doctor-summary",
      builder: (context, state) => const HerDoctorSummaryScreen(),
    ),
    GoRoute(
      path: "/her/wearables",
      builder: (context, state) => const HerWearableScreen(),
    ),

    // AyuSetu General & Vitalis Onboarding
    GoRoute(
      path: "/onboarding",
      builder: (context, state) => const VitalisOnboardingScreen(),
    ),
    GoRoute(
      path: "/vitalis",
      builder: (context, state) => const VitalisDashboardScreen(),
    ),
    GoRoute(
      path: "/vitalis/onboarding",
      builder: (context, state) => const VitalisOnboardingScreen(),
    ),
    GoRoute(
      path: "/vitalis/questionnaire",
      builder: (context, state) => const VitalisQuestionnaireScreen(),
    ),
    GoRoute(
      path: "/vitalis/healthspan",
      builder: (context, state) => const VitalisHealthspanScreen(),
    ),
    GoRoute(
      path: "/vitalis/biomarkers",
      builder: (context, state) => const VitalisBiomarkersScreen(),
    ),
    GoRoute(
      path: "/vitalis/cardio",
      builder: (context, state) => const VitalisCardioScreen(),
    ),
    GoRoute(
      path: "/vitalis/wearables",
      builder: (context, state) => const VitalisWearablesScreen(),
    ),
    GoRoute(
      path: "/vitalis/activity",
      builder: (context, state) => const VitalisActivityScreen(),
    ),
    GoRoute(
      path: "/vitalis/nutrition",
      builder: (context, state) => const VitalisNutritionScreen(),
    ),
    GoRoute(
      path: "/vitalis/sleep",
      builder: (context, state) => const VitalisSleepScreen(),
    ),
    GoRoute(
      path: "/vitalis/functional",
      builder: (context, state) => const VitalisFunctionalScreen(),
    ),
    GoRoute(
      path: "/vitalis/functional-health",
      builder: (context, state) => const VitalisFunctionalScreen(),
    ),
    GoRoute(
      path: "/vitalis/preventive",
      builder: (context, state) => const VitalisPreventiveScreen(),
    ),
    GoRoute(
      path: "/vitalis/preventive-care",
      builder: (context, state) => const VitalisPreventiveScreen(),
    ),
    GoRoute(
      path: "/vitalis/simulator",
      builder: (context, state) => const VitalisSimulatorScreen(),
    ),
    GoRoute(
      path: "/vitalis/scenarios",
      builder: (context, state) => const VitalisSimulatorScreen(),
    ),
    GoRoute(
      path: "/vitalis/trajectory",
      builder: (context, state) => const VitalisTrajectoryScreen(),
    ),
    GoRoute(
      path: "/vitalis/copilot",
      builder: (context, state) => const VitalisCopilotScreen(),
    ),
    GoRoute(
      path: "/vitalis/summary",
      builder: (context, state) => const VitalisSummaryScreen(),
    ),
    GoRoute(
      path: "/vitalis/settings",
      builder: (context, state) => const VitalisSettingsScreen(),
    ),
  ],
);
