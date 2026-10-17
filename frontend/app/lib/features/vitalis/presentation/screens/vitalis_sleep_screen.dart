import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisSleepScreen extends ConsumerWidget {
  const VitalisSleepScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final sleep = state.sleep;
    final readiness = state.readiness;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Sleep Regularity & Circadian SRI"),
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
                title: "Sleep Regularity Index (SRI) Algorithm",
                description:
                    "Sleep Regularity Index (SRI) evaluates the probability of being in the same state (sleep vs wake) at any two timepoints 24 hours apart across rolling epochs. It is a more robust predictor of cardiometabolic healthspan than total sleep duration alone.",
                algorithmName: "V9 Sleep Regularity & Circadian Concordance",
                version: "1.0.0",
                evidenceSource: "Phillips et al., Scientific Reports (2017); Windred et al., Sleep (2024)",
                evidenceLevel: "Peer-Reviewed Cohort",
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
            _buildReadinessOverview(readiness),
            const SizedBox(height: 16),
            _buildSriMetricCard(sleep),
            const SizedBox(height: 16),
            _buildBedtimeConsistencyCard(sleep),
            const SizedBox(height: 16),
            _buildHypnogramCard(sleep),
            const SizedBox(height: 16),
            _buildCircadianHygieneList(),
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
              "Wearable sleep staging and SRI are wellness indicators. They are NOT diagnostic polysomnography. If experiencing severe snoring, daytime somnolence or nocturnal awakenings, consult a sleep specialist.",
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReadinessOverview(DailyReadiness readiness) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Row(
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 64,
                height: 64,
                child: CircularProgressIndicator(
                  value: readiness.readinessScore / 100,
                  strokeWidth: 6,
                  backgroundColor: AppColors.surfaceElevated,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.vitalisTeal),
                ),
              ),
              Text(
                "${readiness.readinessScore}",
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    const Text(
                      "Daily Readiness",
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        "Exploratory",
                        style: TextStyle(fontSize: 9, color: AppColors.textMuted),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  readiness.trainingGuidance,
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
                const SizedBox(height: 4),
                Text(
                  "Data Coverage: ${(readiness.coverage * 100).toInt()}% of required telemetry",
                  style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSriMetricCard(SleepMetrics sleep) {
    final sri = sleep.sriScore;
    final isGood = sri >= 70;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isGood ? AppColors.vitalisTeal.withValues(alpha: 0.3) : AppColors.warning.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "Sleep Regularity Index (SRI)",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: (isGood ? AppColors.vitalisTeal : AppColors.warning).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  isGood ? "High Stability" : "Variable Schedule",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: isGood ? AppColors.vitalisTeal : AppColors.warning,
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
                "$sri",
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
              ),
              const SizedBox(width: 4),
              const Text("/ 100", style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  "Target: ≥ 75",
                  style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                  textAlign: TextAlign.right,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: sri / 100,
            backgroundColor: AppColors.surfaceElevated,
            valueColor: AlwaysStoppedAnimation<Color>(isGood ? AppColors.vitalisTeal : AppColors.warning),
            borderRadius: BorderRadius.circular(4),
            minHeight: 6,
          ),
          const SizedBox(height: 10),
          const Text(
            "Maintaining regular wake and sleep intervals anchors peripheral circadian clocks in liver, skeletal muscle, and cardiovascular tissue.",
            style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildBedtimeConsistencyCard(SleepMetrics sleep) {
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
            "Circadian Bedtime Consistency",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _ConsistencyMetric(
                  label: "Consistency SD",
                  value: "±${sleep.bedtimeConsistencyMinutes} min",
                  status: sleep.bedtimeConsistencyMinutes <= 45 ? "Optimal (≤45m)" : "Social Jetlag Warning",
                  statusColor: sleep.bedtimeConsistencyMinutes <= 45 ? AppColors.ayushGreen : AppColors.warning,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ConsistencyMetric(
                  label: "Avg Duration",
                  value: "${sleep.averageDurationHours}h",
                  status: sleep.averageDurationHours >= 7.0 ? "Adequate (7-9h)" : "Sleep Deficit Alert",
                  statusColor: sleep.averageDurationHours >= 7.0 ? AppColors.ayushGreen : AppColors.warning,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHypnogramCard(SleepMetrics sleep) {
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
              const Expanded(
                child: Text(
                  "Sleep Architecture Staging",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  "Wearable-Estimated",
                  style: TextStyle(fontSize: 10, color: AppColors.textMuted),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _StageBlock(
                  label: "Deep / N3",
                  percentage: "${sleep.deepSleepPercentage}%",
                  subtext: "Glyphatic clearance",
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _StageBlock(
                  label: "REM",
                  percentage: "${sleep.remSleepPercentage}%",
                  subtext: "Emotional memory",
                  color: AppColors.vitalisTeal,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _StageBlock(
                  label: "Light / N1-N2",
                  percentage: "${100 - sleep.deepSleepPercentage - sleep.remSleepPercentage}%",
                  subtext: "Baseline sleep",
                  color: AppColors.surfaceElevated,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCircadianHygieneList() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Evidence-Based Circadian Anchors",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          SizedBox(height: 10),
          _HygieneBullet(
            icon: Icons.wb_sunny_outlined,
            title: "Morning Sunlight Exposure",
            desc: "10-15 minutes of outdoor light within 60 minutes of waking suppresses melatonin and resets the suprachiasmatic nucleus.",
          ),
          SizedBox(height: 8),
          _HygieneBullet(
            icon: Icons.coffee_outlined,
            title: "Caffeine Cutoff (10 Hours Pre-Sleep)",
            desc: "Adenosine receptor antagonism has a half-life of 5-7 hours; avoid stimulants past 2:00 PM.",
          ),
          SizedBox(height: 8),
          _HygieneBullet(
            icon: Icons.dark_mode_outlined,
            title: "Dim Environment 90 Minutes Pre-Bed",
            desc: "Minimizes blue-wavelength light inhibition of natural pineal melatonin release.",
          ),
        ],
      ),
    );
  }
}

class _ConsistencyMetric extends StatelessWidget {
  final String label;
  final String value;
  final String status;
  final Color statusColor;

  const _ConsistencyMetric({
    required this.label,
    required this.value,
    required this.status,
    required this.statusColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
          const SizedBox(height: 4),
          Text(status, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: statusColor)),
        ],
      ),
    );
  }
}

class _StageBlock extends StatelessWidget {
  final String label;
  final String percentage;
  final String subtext;
  final Color color;

  const _StageBlock({
    required this.label,
    required this.percentage,
    required this.subtext,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(percentage, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
          const SizedBox(height: 2),
          Text(subtext, style: const TextStyle(fontSize: 9, color: AppColors.textMuted)),
        ],
      ),
    );
  }
}

class _HygieneBullet extends StatelessWidget {
  final IconData icon;
  final String title;
  final String desc;

  const _HygieneBullet({
    required this.icon,
    required this.title,
    required this.desc,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 18, color: AppColors.vitalisTeal),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              const SizedBox(height: 2),
              Text(desc, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3)),
            ],
          ),
        ),
      ],
    );
  }
}
