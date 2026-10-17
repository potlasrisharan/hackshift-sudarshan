import "package:flutter/material.dart";
import "package:flutter_test/flutter_test.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:kiosk_app/main.dart";
import "package:kiosk_app/core/constants/app_strings.dart";
import "package:kiosk_app/features/portal/presentation/screens/portal_selection_screen.dart";
import "package:kiosk_app/features/doctor/presentation/screens/doctor_consultation_screen.dart";
import "package:kiosk_app/features/nurse/presentation/screens/nurse_triage_screen.dart";
import "package:kiosk_app/features/headquarters/presentation/screens/headquarters_screen.dart";
import "package:kiosk_app/features/clinical_mgmt/presentation/screens/clinical_management_screen.dart";
import "package:kiosk_app/features/yoga/presentation/screens/yoga_prescription_screen.dart";
import "package:kiosk_app/features/longevity/presentation/screens/longevity_screen.dart";
import "package:kiosk_app/features/womens_health/presentation/screens/womens_health_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/identify_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/language_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/scan_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/summarize_screen.dart";
import "package:kiosk_app/features/intake/presentation/screens/queue_token_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_hub_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_cycle_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_doctor_summary_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_wearable_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_wellness_studio_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_questionnaire_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_symptom_journal_screen.dart";
import "package:kiosk_app/features/prescription/presentation/screens/medicine_reminder_screen.dart";

void main() {
  testWidgets("AyuSetu app initializes properly", (WidgetTester tester) async {
    await tester.pumpWidget(const ProviderScope(child: AyuSetuApp()));
    expect(find.text(AppStrings.appName), findsOneWidget);
  });

  group("Mobile 360x640 Viewport Zero-Overflow Tests", () {
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

    testWidgets("PortalSelectionScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const PortalSelectionScreen());
      expect(find.text(AppStrings.appName), findsOneWidget);
    });

    testWidgets("DoctorConsultationScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const DoctorConsultationScreen());
      expect(find.text(AppStrings.doctorPortal), findsOneWidget);
    });

    testWidgets("NurseTriageScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const NurseTriageScreen());
      expect(find.text(AppStrings.nursePortal), findsOneWidget);
    });

    testWidgets("HeadquartersScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HeadquartersScreen());
      expect(find.text(AppStrings.hqCommand), findsOneWidget);
    });

    testWidgets("ClinicalManagementScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const ClinicalManagementScreen());
      expect(find.text(AppStrings.clinicalManagement), findsOneWidget);
    });

    testWidgets("YogaPrescriptionScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const YogaPrescriptionScreen());
      expect(find.text(AppStrings.yogaHeader), findsOneWidget);
    });

    testWidgets("LongevityScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const LongevityScreen());
      expect(find.text(AppStrings.vitalisHeader), findsOneWidget);
    });

    testWidgets("WomensHealthScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const WomensHealthScreen());
      expect(find.text(AppStrings.womensHealthHeader), findsOneWidget);
    });

    testWidgets("LanguageScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const LanguageScreen());
      expect(find.text("Select your preferred language to begin voice case-taking"), findsOneWidget);
    });

    testWidgets("IdentifyScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const IdentifyScreen());
      expect(find.text("Step 1: Patient Identification"), findsOneWidget);
    });

    testWidgets("ScanScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const ScanScreen());
      expect(find.text("Step 3: Document Digitization"), findsOneWidget);
    });

    testWidgets("SummarizeScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const SummarizeScreen());
      expect(find.text("Step 4: Structured SOAP Note"), findsOneWidget);
    });

    testWidgets("QueueTokenScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const QueueTokenScreen());
      expect(find.text("Intake Complete & Token Issued"), findsOneWidget);
    });

    testWidgets("HerHubScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HerHubScreen());
      expect(find.text("AyuSetu HER"), findsOneWidget);
    });

    testWidgets("HerCycleScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HerCycleScreen());
      expect(find.text("Cycle & Menstrual History"), findsOneWidget);
    });

    testWidgets("HerDoctorSummaryScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HerDoctorSummaryScreen());
      expect(find.text("Doctor-Ready Clinical Summary"), findsOneWidget);
    });

    testWidgets("HerWearableScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HerWearableScreen());
      expect(find.text("Wearables & Telemetry"), findsOneWidget);
    });

    testWidgets("HerWellnessStudioScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HerWellnessStudioScreen());
      expect(find.text("Wellness & Yoga Studio"), findsOneWidget);
    });

    testWidgets("HerQuestionnaireScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HerQuestionnaireScreen());
      expect(find.text("Adaptive Questionnaire"), findsOneWidget);
    });

    testWidgets("HerSymptomJournalScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const HerSymptomJournalScreen());
      expect(find.text("Daily Symptom Journal"), findsOneWidget);
    });

    testWidgets("MedicineReminderScreen renders on 360px width with no overflow", (tester) async {
      await testScreen(tester, const MedicineReminderScreen());
      expect(find.text(AppStrings.prescriptionHeader), findsOneWidget);
      expect(find.text("Dr. Ananya Sharma"), findsOneWidget);
      expect(find.text("Yograj Guggulu"), findsOneWidget);
    });
  });
}
