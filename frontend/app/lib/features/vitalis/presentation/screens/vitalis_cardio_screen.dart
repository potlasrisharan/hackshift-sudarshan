import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisCardioScreen extends ConsumerWidget {
  const VitalisCardioScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final cardio = state.cardio;

    return AppScaffoldShell(
      title: "Cardiorespiratory Fitness",
      subtitle: "VO2max Provenance & Aerobic Capacity",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildVO2Card(cardio),
            const SizedBox(height: 16),
            _buildProvenanceDisclosureCard(cardio),
            const SizedBox(height: 16),
            _buildCohortReferenceCard(cardio),
            const SizedBox(height: 16),
            _buildZone2EducationCard(),
            const SizedBox(height: 16),
            _buildResearchRegressionNotice(),
          ],
        ),
      ),
    );
  }

  Widget _buildVO2Card(VitalisCardioModel cardio) {
    final hasVal = cardio.vo2Max > 0;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryLight.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "Recorded VO2max",
                  style: TextStyle(fontSize: 13, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    cardio.isLabMeasured ? "LAB MEASURED (CPET)" : "WEARABLE ESTIMATED",
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primaryLight),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                hasVal ? "${cardio.vo2Max}" : "N/A",
                style: const TextStyle(fontSize: 36, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
              ),
              const SizedBox(width: 6),
              const Text("mL/kg/min", style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            "Last recorded on ${cardio.recordedDate}",
            style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
          ),
        ],
      ),
    );
  }

  Widget _buildProvenanceDisclosureCard(VitalisCardioModel cardio) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Source & Provenance Traceability", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          const SizedBox(height: 6),
          Text(
            cardio.provenanceLabel,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.vitalisTeal),
          ),
          const SizedBox(height: 4),
          Text(
            cardio.clinicalContext,
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
          ),
        ],
      ),
    );
  }

  Widget _buildCohortReferenceCard(VitalisCardioModel cardio) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text("Population Cohort Reference Bands (Age 40–49)", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          SizedBox(height: 8),
          Text("• Low Aerobic Capacity: < 30 mL/kg/min\n• Moderate / Average: 30 – 38 mL/kg/min\n• High Aerobic Fitness: > 38 mL/kg/min", style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildZone2EducationCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text("Zone 2 Aerobic Base Protocol", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          SizedBox(height: 6),
          Text(
            "Low-to-moderate steady state exercise (where you can maintain a conversation without gasping) stimulates mitochondrial efficiency and fatty acid oxidation without high autonomic stress.",
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
          ),
        ],
      ),
    );
  }

  Widget _buildResearchRegressionNotice() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Icon(Icons.lock_clock_outlined, size: 18, color: AppColors.textMuted),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              "Non-exercise regression models are kept disabled pending independent clinical calibration to prevent uncalibrated biological age or mortality claims.",
              style: TextStyle(fontSize: 11, color: AppColors.textMuted, height: 1.3),
            ),
          ),
        ],
      ),
    );
  }
}
