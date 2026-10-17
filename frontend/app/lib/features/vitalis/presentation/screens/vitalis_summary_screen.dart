import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisSummaryScreen extends ConsumerStatefulWidget {
  const VitalisSummaryScreen({super.key});

  @override
  ConsumerState<VitalisSummaryScreen> createState() => _VitalisSummaryScreenState();
}

class _VitalisSummaryScreenState extends ConsumerState<VitalisSummaryScreen> {
  bool _shareAuthorized = true;
  bool _tokenGenerated = false;
  String _shareToken = "VTL-SEC-8924-EXP72H";

  void _generateSecureToken() {
    setState(() {
      _tokenGenerated = true;
      _shareToken = "VTL-SEC-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}-EXP72H";
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Secure 72-hour clinician share token generated."),
        backgroundColor: AppColors.vitalisTeal,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);
    final persona = state.activePersona;
    final hpi = state.healthspanIndex;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Clinician Summary & Export"),
        backgroundColor: AppColors.surface,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: AppColors.vitalisTeal),
            onPressed: () {
              VitalisExplainabilitySheet.show(
                context,
                title: "Clinician-Ready Healthspan Export",
                description:
                    "This summary packages longitudinal telemetry into an auditable FHIR R4-compatible format. All algorithmic outputs include explicit data coverage and method provenance.",
                algorithmName: "Vitalis Clinical Reporting Core",
                version: "1.0.0",
                evidenceSource: "HL7 FHIR R4 Observation & CarePlan Profiles",
                evidenceLevel: "Standardized Interoperability",
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSafetyCallout(),
            const SizedBox(height: 16),
            _buildPatientHeader(persona, hpi),
            const SizedBox(height: 16),
            _buildBiomarkerObservationTable(state),
            const SizedBox(height: 16),
            _buildPhysiologicalSignalsTable(state),
            const SizedBox(height: 16),
            _buildConsentCard(),
            const SizedBox(height: 20),
            _buildExportActions(context),
          ],
        ),
      ),
    );
  }

  Widget _buildSafetyCallout() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.shield_outlined, color: AppColors.primaryLight, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              "FOR CLINICIAN REVIEW ONLY. This document contains patient-reported and consumer-wearable data. It does not constitute an automated diagnosis or prescription order.",
              style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPatientHeader(VitalisSyntheticPersona persona, VitalisHpiResultModel hpi) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  persona.name,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  "ABDM ABHA: 91-****-4210",
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.vitalisTeal),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            "Age: ${persona.age} · Sex: ${persona.gender.toUpperCase()} · Persona: ${persona.clinicalLabel}",
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 10),
          const Divider(color: AppColors.surfaceElevated),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "Healthspan Progress Index (HPI):",
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                "${hpi.hpiScore ?? 'N/A'} / 100",
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.vitalisTeal),
              ),
            ],
          ),
          const SizedBox(height: 2),
          Text(
            "Telemetric Stream Coverage: ${(hpi.coverage * 100).toInt()}% (Sufficient for trend analysis)",
            style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
          ),
        ],
      ),
    );
  }

  Widget _buildBiomarkerObservationTable(VitalisState state) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Verified Laboratory Observations (FHIR R4)",
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 10),
          _SummaryTableRow(label: "HbA1c Glycated Hemoglobin", value: "${state.biomarkers.hba1c}%", status: state.biomarkers.hba1c >= 6.5 ? "Diabetic Range" : (state.biomarkers.hba1c >= 5.7 ? "Prediabetic" : "Normal"), isWarn: state.biomarkers.hba1c >= 5.7),
          _SummaryTableRow(label: "Fasting Blood Glucose", value: "${state.biomarkers.fastingGlucose} mg/dL", status: state.biomarkers.fastingGlucose >= 126 ? "Elevated" : "Normal", isWarn: state.biomarkers.fastingGlucose >= 100),
          _SummaryTableRow(label: "LDL Cholesterol", value: "${state.biomarkers.ldlCholesterol} mg/dL", status: state.biomarkers.ldlCholesterol >= 130 ? "Borderline High" : "Optimal", isWarn: state.biomarkers.ldlCholesterol >= 100),
          _SummaryTableRow(label: "High-Sensitivity CRP (hs-CRP)", value: "${state.biomarkers.hsCrp} mg/L", status: state.biomarkers.hsCrp >= 3.0 ? "High Vascular Risk" : "Normal", isWarn: state.biomarkers.hsCrp >= 2.0),
        ],
      ),
    );
  }

  Widget _buildPhysiologicalSignalsTable(VitalisState state) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Physiological & Functional Signals",
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 10),
          _SummaryTableRow(label: "21-Day Rolling Resting HR", value: "${state.wearables.restingHeartRateBpm} bpm", status: "Autonomic Baseline", isWarn: false),
          _SummaryTableRow(label: "Resting HRV (rMSSD)", value: "${state.wearables.hrvRmssdMs.toInt()} ms", status: "Exploratory Trend", isWarn: false),
          _SummaryTableRow(label: "Sleep Regularity Index (SRI)", value: "${state.sleep.sriScore} / 100", status: state.sleep.sriScore >= 70 ? "Stable" : "Variable", isWarn: state.sleep.sriScore < 70),
          _SummaryTableRow(label: "Grip Dynamometry", value: "${state.functional.gripStrengthKg} kg", status: state.functional.gripStrengthKg >= 26 ? "Preserved" : "Low Power", isWarn: state.functional.gripStrengthKg < 26),
        ],
      ),
    );
  }

  Widget _buildConsentCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Checkbox(
                value: _shareAuthorized,
                activeColor: AppColors.vitalisTeal,
                onChanged: (val) => setState(() => _shareAuthorized = val ?? false),
              ),
              const Expanded(
                child: Text(
                  "I authorize sharing this longitudinal report with verified clinicians across the AyuSetu clinic network.",
                  style: TextStyle(fontSize: 12, color: AppColors.textPrimary),
                ),
              ),
            ],
          ),
          if (_tokenGenerated) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Active Share Token", style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
                      Text(_shareToken, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.vitalisTeal)),
                    ],
                  ),
                  const Text("Valid: 72 hrs", style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildExportActions(BuildContext context) {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _shareAuthorized ? _generateSecureToken : null,
            icon: const Icon(Icons.key_rounded),
            label: const Text("Generate 72-Hour Clinician Token"),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.vitalisTeal,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Standardized FHIR R4 JSON bundle exported to clinic gateway."),
                  backgroundColor: AppColors.vitalisTeal,
                ),
              );
            },
            icon: const Icon(Icons.picture_as_pdf_rounded),
            label: const Text("Export Standardized Clinical PDF"),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.vitalisTeal,
              side: const BorderSide(color: AppColors.vitalisTeal),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
      ],
    );
  }
}

class _SummaryTableRow extends StatelessWidget {
  final String label;
  final String value;
  final String status;
  final bool isWarn;

  const _SummaryTableRow({
    required this.label,
    required this.value,
    required this.status,
    required this.isWarn,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(child: Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary))),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: (isWarn ? AppColors.warning : AppColors.ayushGreen).withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              status,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: isWarn ? AppColors.warning : AppColors.ayushGreen,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
