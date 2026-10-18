import "package:flutter/material.dart";
import "package:flutter_test/flutter_test.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:kiosk_app/features/her/presentation/screens/her_hub_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_cycle_screen.dart";
import "package:kiosk_app/features/her/presentation/screens/her_symptom_journal_screen.dart";
import "package:kiosk_app/features/her/presentation/widgets/her_safety_banner.dart";
import "package:kiosk_app/features/her/presentation/widgets/her_explainability_drawer.dart";
import "package:kiosk_app/features/her/data/models/her_models.dart";
import "package:kiosk_app/features/her/data/services/her_api_service.dart";
import "package:kiosk_app/features/her/data/services/wearable_adapter.dart";
import "package:shared_preferences/shared_preferences.dart";

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets("AyuSetu HER Hub renders core navigation and header", (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HerHubScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text("AyuSetu HER"), findsOneWidget);
    expect(find.text("Your cycle at a glance"), findsOneWidget);
    expect(find.text("A little care, when you need it"), findsOneWidget);
  });

  testWidgets("AyuSetu HER Safety Banner renders urgent alert and guidance", (WidgetTester tester) async {
    bool dismissed = false;
    const alert = SafetyCheckResultModel(
      isUrgent: true,
      category: "URGENT_REVIEW",
      ruleId: "A0-GYN02-ACUTE-ABDOMEN",
      emergencyGuidance: "URGENT: Sudden or severe pelvic pain warrants immediate clinical evaluation.",
      evidence: ["Acute severe pelvic pain reported"],
    );

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: HerSafetyBanner(
            alert: alert,
            onDismiss: () => dismissed = true,
          ),
        ),
      ),
    );

    expect(find.text("URGENT CLINICAL REVIEW SUGGESTED"), findsOneWidget);
    expect(find.textContaining("Sudden or severe pelvic pain"), findsOneWidget);

    await tester.tap(find.byIcon(Icons.close));
    expect(dismissed, true);
  });

  testWidgets("AyuSetu HER Explainability Drawer renders deterministic evidence breakdown", (WidgetTester tester) async {
    const finding = HerScreeningFindingModel(
      domain: "PCOS_FEATURES",
      category: "CLINICAL_REVIEW_SUGGESTED",
      isDiagnosis: false,
      title: "Consider Discussing These Patterns with a Clinician",
      rationale: "Reported combination of irregular cycles and hyperandrogenic features.",
      supportingEvidence: [
        HerEvidenceItemModel(source: "cycle_history", label: "Cycle gap >48 days", verified: false),
      ],
      missingInformation: ["Thyroid and prolactin laboratory exclusion"],
      limitations: ["Self-reported symptoms alone cannot establish diagnosis."],
      ruleVersion: "A2-SCREEN-2026.1",
      suggestedAction: "Consult with an OB/GYN specialist.",
    );

    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: HerExplainabilitySheet(finding: finding),
        ),
      ),
    );

    expect(find.text("Consider Discussing These Patterns with a Clinician"), findsOneWidget);
    expect(find.textContaining("Deterministic Algorithm A2-SCREEN-2026.1"), findsOneWidget);
    expect(find.text("Supporting Evidence Gathered"), findsOneWidget);
    expect(find.text("Missing Diagnostic Information"), findsOneWidget);
  });

  testWidgets("AyuSetu HER Cycle Screen renders cycle tracking form", (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HerCycleScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text("Cycle & Menstrual History"), findsOneWidget);
    expect(find.text("Log Cycle Start"), findsOneWidget);
    expect(find.text("Flow Intensity"), findsOneWidget);
  });

  testWidgets("AyuSetu HER Symptom Journal renders sliders and red flag checks", (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(
          home: HerSymptomJournalScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text("Daily Symptom Journal"), findsOneWidget);
    expect(find.text("Energy & Vitality Level"), findsOneWidget);
    expect(find.text("Acute Safety Gate Triggers"), findsOneWidget);
  });

  test("Synthetic Wearable Demo Adapter simulates physiological luteal temperature rise", () async {
    final adapter = SyntheticWearableDemoAdapter();
    final metrics = await adapter.fetchRecentMetrics(days: 28);

    expect(metrics.length, 28);
    for (final m in metrics) {
      expect(m.restingHeartRateBpm, greaterThanOrEqualTo(60));
      expect(m.basalBodyTempCelsius, greaterThanOrEqualTo(36.0));
      expect(m.sleepDurationMinutes, greaterThan(300));
    }
  });

  test("HER cycle logging persists locally and survives re-fetch", () async {
    const api = HerApiService(patientId: "test_persist_her");
    const cycle = HerCycleModel(
      id: "cyc_test_101",
      startDate: "2026-10-18",
      cycleLengthDays: 29,
      periodLengthDays: 5,
      flowIntensity: "medium",
      crampsSeverity: 3,
      notes: "Test cycle persistence",
    );

    await api.logCycle(cycle);
    final (cycles, analysis) = await api.fetchCycles();

    expect(cycles.isNotEmpty, isTrue);
    expect(cycles.first.id, "cyc_test_101");
    expect(analysis.status, isNotNull);
  });
}
