import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisTrajectoryScreen extends ConsumerStatefulWidget {
  const VitalisTrajectoryScreen({super.key});

  @override
  ConsumerState<VitalisTrajectoryScreen> createState() => _VitalisTrajectoryScreenState();
}

class _VitalisTrajectoryScreenState extends ConsumerState<VitalisTrajectoryScreen> {
  int _selectedWindowDays = 90;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);
    final hpi = state.healthspanIndex;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Longitudinal Healthspan Trajectory"),
        backgroundColor: AppColors.surface,
        actions: [
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: AyuSetuLogoBadge(height: 20),
          ),
          IconButton(
            icon: const Icon(Icons.info_outline, color: AppColors.vitalisTeal),
            onPressed: () {
              VitalisExplainabilitySheet.show(
                context,
                title: "Longitudinal Trajectory & Drift Radar",
                description:
                    "Tracks multi-axis biomarker and physiological signals over 30, 90, and 365-day horizons. Detects early physiological drift (e.g., creep in resting HR or glycemic variability) before clinical disease manifests.",
                algorithmName: "V4 Longitudinal Drift Radar & Trend Engine",
                version: "1.0.0",
                evidenceSource: "Framingham Heart Study, UK Biobank Longitudinal Biomarker Cohorts",
                evidenceLevel: "Longitudinal Epidemiological",
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
            _buildWindowSelector(),
            const SizedBox(height: 16),
            _buildTrendSummaryCard(hpi),
            const SizedBox(height: 16),
            _buildTrajectoryChartCard(
              title: "Healthspan Progress Index (HPI)",
              currentVal: "${hpi.hpiScore ?? 'N/A'}",
              unit: "/ 100",
              status: "Velocity: +2.1 pts/quarter (Improving)",
              color: AppColors.vitalisTeal,
              points: [62, 64, 63, 67, 69, 71, 74],
            ),
            const SizedBox(height: 16),
            _buildTrajectoryChartCard(
              title: "Resting Heart Rate (21-Day Rolling)",
              currentVal: "${state.wearables.restingHeartRateBpm}",
              unit: "bpm",
              status: "Velocity: -3 bpm (Autonomic adaptation)",
              color: AppColors.primaryLight,
              points: [68, 67, 66, 65, 64, 63, 62],
            ),
            const SizedBox(height: 16),
            _buildTrajectoryChartCard(
              title: "Cardiorespiratory VO2max",
              currentVal: "${state.cardio.vo2Max}",
              unit: "mL/kg/min",
              status: "Wearable-estimated · Stable plateau",
              color: AppColors.ayushGreen,
              points: [38.2, 38.5, 38.9, 39.4, 40.1, 40.8, 41.2],
            ),
            const SizedBox(height: 16),
            _buildClinicalEventOverlay(),
          ],
        ),
      ),
    );
  }

  Widget _buildWindowSelector() {
    final windows = [30, 90, 365];
    return Wrap(
      spacing: 8,
      runSpacing: 6,
      children: windows.map((days) {
        final isSelected = _selectedWindowDays == days;
        return ChoiceChip(
          label: Text("$days Days"),
          selected: isSelected,
          selectedColor: AppColors.vitalisTeal,
          backgroundColor: AppColors.surfaceElevated,
          labelStyle: TextStyle(
            color: isSelected ? Colors.white : AppColors.textSecondary,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
          ),
          onSelected: (selected) {
            if (selected) setState(() => _selectedWindowDays = days);
          },
        );
      }).toList(),
    );
  }

  Widget _buildTrendSummaryCard(HealthspanIndex hpi) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: const Row(
        children: [
          Icon(Icons.trending_up_rounded, color: AppColors.ayushGreen, size: 28),
          SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Positive Multi-System Concordance",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
                SizedBox(height: 2),
                Text(
                  "Resting HR decrease aligns with increased weekly Zone 2 volume. No negative physiological drift detected across active biometrics.",
                  style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrajectoryChartCard({
    required String title,
    required String currentVal,
    required String unit,
    required String status,
    required Color color,
    required List<double> points,
  }) {
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
                  title,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Row(
                children: [
                  Text(currentVal, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                  const SizedBox(width: 3),
                  Text(unit, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(status, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
          const SizedBox(height: 16),
          // Synthetic sparkline representation
          SizedBox(
            height: 48,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: points.map((p) {
                final min = points.reduce((a, b) => a < b ? a : b);
                final max = points.reduce((a, b) => a > b ? a : b);
                final range = max - min == 0 ? 1.0 : (max - min);
                final normalizedHeight = (p - min) / range;
                final height = 12.0 + (normalizedHeight * 36.0);
                return Container(
                  width: 14,
                  height: height,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.8),
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClinicalEventOverlay() {
    final events = [
      {"date": "14 Days Ago", "event": "Zone 2 Aerobic Progression +30 min/week"},
      {"date": "42 Days Ago", "event": "Comprehensive Lab Profile (HbA1c & Lipids)"},
      {"date": "85 Days Ago", "event": "Baseline Health Intake & Wearable Pair"},
    ];

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
            "Clinical & Lifestyle Timeline Overlay",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 12),
          for (final e in events)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  const Icon(Icons.circle, size: 8, color: AppColors.vitalisTeal),
                  const SizedBox(width: 10),
                  Text(e["date"]!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(e["event"]!, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
