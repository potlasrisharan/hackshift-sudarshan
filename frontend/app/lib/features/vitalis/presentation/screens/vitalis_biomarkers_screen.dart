import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisBiomarkersScreen extends ConsumerStatefulWidget {
  const VitalisBiomarkersScreen({super.key});

  @override
  ConsumerState<VitalisBiomarkersScreen> createState() => _VitalisBiomarkersScreenState();
}

class _VitalisBiomarkersScreenState extends ConsumerState<VitalisBiomarkersScreen> {
  String _selectedMetric = "HbA1c";

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);
    final trend = state.biomarkerTrend;

    return AppScaffoldShell(
      title: "Biomarker Intelligence",
      subtitle: "Longitudinal Trends & Verified Laboratory History",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildMetricSelectorChips(),
            const SizedBox(height: 16),
            _buildTrajectoryCard(trend),
            const SizedBox(height: 20),
            const Text(
              "Chronological Laboratory History",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 12),
            _buildHistoryList(trend),
            const SizedBox(height: 20),
            _buildReferenceRangeCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricSelectorChips() {
    final metrics = ["HbA1c", "Fasting Glucose", "Lipid Panel", "Blood Pressure", "eGFR", "TSH"];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: metrics.map((m) {
          final isSelected = _selectedMetric == m;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              selected: isSelected,
              label: Text(m),
              selectedColor: AppColors.vitalisTeal.withValues(alpha: 0.2),
              onSelected: (val) {
                if (val) setState(() => _selectedMetric = m);
              },
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTrajectoryCard(VitalisBiomarkerTrendModel trend) {
    return Container(
      padding: const EdgeInsets.all(18),
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
                  "$_selectedMetric Trajectory",
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: trend.direction == "INCREASING"
                      ? AppColors.warning.withValues(alpha: 0.15)
                      : AppColors.success.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  trend.direction,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: trend.direction == "INCREASING" ? AppColors.warning : AppColors.success,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Text(
                "${trend.latestValue ?? 'N/A'}",
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
              ),
              const SizedBox(width: 6),
              Text(trend.unit, style: const TextStyle(fontSize: 14, color: AppColors.textSecondary)),
              const Spacer(),
              if (trend.delta != null)
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          "${trend.delta! > 0 ? '+' : ''}${trend.delta} ${trend.unit}",
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: trend.delta! > 0 ? AppColors.warning : AppColors.success,
                          ),
                        ),
                      ),
                      const Text(
                        "Net Chronological Shift",
                        style: TextStyle(fontSize: 10, color: AppColors.textMuted),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            trend.clinicalNote,
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryList(VitalisBiomarkerTrendModel trend) {
    if (trend.validPoints.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Text("No verified lab history found for this test.", style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
      );
    }

    return Column(
      children: [
        for (final p in trend.validPoints.reversed)
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.surfaceElevated),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.verified_outlined, color: AppColors.vitalisTeal, size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              p.dateUtc.split("T").first,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const Text(
                              "Accredited Clinical Lab Encounter",
                              style: TextStyle(fontSize: 10, color: AppColors.textMuted),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  "${p.value} ${p.unit}",
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildReferenceRangeCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text("Guideline Reference Bands (ICMR-INDIAB / ADA)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          SizedBox(height: 6),
          Text("• Normal: < 5.7%\n• Pre-diabetes: 5.7% – 6.4%\n• Diabetes Threshold: ≥ 6.5%", style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4)),
        ],
      ),
    );
  }
}
