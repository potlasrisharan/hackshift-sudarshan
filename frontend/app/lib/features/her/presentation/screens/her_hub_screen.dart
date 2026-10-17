import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/her_provider.dart";
import "../widgets/her_safety_banner.dart";
import "../widgets/her_explainability_drawer.dart";
import "../widgets/her_demo_selector_sheet.dart";

class HerHubScreen extends ConsumerWidget {
  const HerHubScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(herProvider);

    return AppScaffoldShell(
      title: "AyuSetu HER",
      subtitle: "Hormonal Wellness & Preventive Intelligence",
      actions: [
        IconButton(
          icon: const Icon(Icons.science_outlined, color: AppColors.wellnessPink),
          tooltip: "Switch Demo Profile",
          onPressed: () {
            showModalBottomSheet(
              context: context,
              backgroundColor: Colors.transparent,
              isScrollControlled: true,
              builder: (_) => const HerDemoSelectorSheet(),
            );
          },
        ),
      ],
      child: state.isLoading
          ? const Center(child: CircularProgressIndicator(color: AppColors.wellnessPink))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Active Scenario Indicator
                  _buildScenarioBanner(context, ref, state.activeScenario),
                  const SizedBox(height: 12),

                  // Emergency Red-Flag Alert
                  if (state.activeSafetyAlert != null)
                    HerSafetyBanner(
                      alert: state.activeSafetyAlert!,
                      onDismiss: () => ref.read(herProvider.notifier).dismissSafetyAlert(),
                    ),

                  // Cycle & Ovulatory Status Card
                  _buildCycleHeroCard(context, state),
                  const SizedBox(height: 16),

                  // Screening Evidence & Clinical Flags
                  _buildScreeningEvidenceSection(context, state),
                  const SizedBox(height: 16),

                  // Interactive Feature Grid
                  _buildQuickActionGrid(context),
                  const SizedBox(height: 16),

                  // Wearable Biometrics Strip
                  _buildWearableMetricsSection(context, ref, state),
                  const SizedBox(height: 16),

                  // Ethical AI & Safety Disclaimer
                  _buildSafetyDisclaimer(),
                  const SizedBox(height: 24),
                ],
              ),
            ),
    );
  }

  Widget _buildScenarioBanner(BuildContext context, WidgetRef ref, String scenario) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.wellnessPink.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.tune, color: AppColors.wellnessPink, size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              "Active Profile: ${scenario.replaceAll('_', ' ')}",
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          InkWell(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                isScrollControlled: true,
                builder: (_) => const HerDemoSelectorSheet(),
              );
            },
            child: const Text(
              "Change",
              style: TextStyle(
                color: AppColors.primaryLight,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCycleHeroCard(BuildContext context, HerState state) {
    final analysis = state.cycleAnalysis;
    final nextStart = analysis.predictedNextWindowStart ?? "Tracking...";
    final nextEnd = analysis.predictedNextWindowEnd ?? "Tracking...";

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.wellnessPink.withValues(alpha: 0.25),
            AppColors.surface,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.wellnessPink.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "Cycle Dynamics & Rhythm",
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: analysis.hasIrregularity
                      ? AppColors.warning.withValues(alpha: 0.2)
                      : AppColors.success.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: analysis.hasIrregularity ? AppColors.warning : AppColors.success,
                  ),
                ),
                child: Text(
                  analysis.hasIrregularity ? "Irregular Intervals" : "Regular Rhythm",
                  style: TextStyle(
                    color: analysis.hasIrregularity ? AppColors.warning : AppColors.success,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildMetricTile(
                  label: "Typical Cycle",
                  value: analysis.medianLengthDays != null
                      ? "${analysis.medianLengthDays} Days"
                      : "—",
                  subtext: analysis.stdDevDays != null
                      ? "± ${analysis.stdDevDays}d variability"
                      : "Needs 3 cycles",
                ),
              ),
              Container(width: 1, height: 48, color: AppColors.surfaceElevated),
              Expanded(
                child: _buildMetricTile(
                  label: "Next Window",
                  value: analysis.predictedNextWindowStart != null
                      ? "$nextStart to $nextEnd"
                      : "Gathering data",
                  subtext: "Explicit statistical spread",
                ),
              ),
            ],
          ),
          if (analysis.irregularityFlags.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: analysis.irregularityFlags
                    .map((f) => Text("• $f", style: const TextStyle(color: AppColors.warning, fontSize: 11)))
                    .toList(),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildMetricTile({
    required String label,
    required String value,
    required String subtext,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 2),
          Text(subtext, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        ],
      ),
    );
  }

  Widget _buildScreeningEvidenceSection(BuildContext context, HerState state) {
    if (state.findings.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Clinical Screening Intelligence",
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          "Transparent rule-engine evaluation (no arbitrary disease percentages).",
          style: TextStyle(color: AppColors.textMuted, fontSize: 12),
        ),
        const SizedBox(height: 10),
        ...state.findings.map((finding) {
          final isReview = finding.category == "CLINICAL_REVIEW_SUGGESTED";
          final isUrgent = finding.category == "URGENT_REVIEW";

          final Color badgeColor = isUrgent
              ? AppColors.error
              : (isReview ? AppColors.warning : AppColors.success);

          return Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: badgeColor.withValues(alpha: 0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        finding.title,
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: badgeColor.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        finding.category.replaceAll('_', ' '),
                        style: TextStyle(
                          color: badgeColor,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  finding.rationale,
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        "Rule: ${finding.ruleVersion}",
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    TextButton.icon(
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      icon: const Icon(Icons.info_outline, size: 14, color: AppColors.primaryLight),
                      label: const Text(
                        "Explain Evidence",
                        style: TextStyle(color: AppColors.primaryLight, fontSize: 12),
                      ),
                      onPressed: () {
                        showModalBottomSheet(
                          context: context,
                          backgroundColor: Colors.transparent,
                          isScrollControlled: true,
                          builder: (_) => HerExplainabilitySheet(finding: finding),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildQuickActionGrid(BuildContext context) {
    final actions = [
      {
        "title": "Log Symptoms",
        "subtitle": "Daily wellbeing & cramps",
        "icon": Icons.edit_calendar_outlined,
        "color": AppColors.wellnessPink,
        "route": "/her/symptom-journal",
      },
      {
        "title": "Cycle History",
        "subtitle": "Intervals & flow trends",
        "icon": Icons.calendar_month_outlined,
        "color": AppColors.longevityCyan,
        "route": "/her/cycle-calendar",
      },
      {
        "title": "Questionnaire",
        "subtitle": "Adaptive health check",
        "icon": Icons.quiz_outlined,
        "color": AppColors.primaryLight,
        "route": "/her/questionnaire",
      },
      {
        "title": "Wellness Studio",
        "subtitle": "Diet & restorative yoga",
        "icon": Icons.self_improvement_outlined,
        "color": AppColors.ayushGreen,
        "route": "/her/wellness-studio",
      },
      {
        "title": "Doctor Summary",
        "subtitle": "Shareable clinical brief",
        "icon": Icons.medical_information_outlined,
        "color": AppColors.secondary,
        "route": "/her/doctor-summary",
      },
      {
        "title": "Wearable Sync",
        "subtitle": "Apple / Health Connect",
        "icon": Icons.watch_outlined,
        "color": AppColors.pmjayGold,
        "route": "/her/wearables",
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Care & Intelligence Modules",
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 10),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 1.25,
          ),
          itemCount: actions.length,
          itemBuilder: (context, idx) {
            final a = actions[idx];
            final color = a["color"] as Color;

            return InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () => context.push(a["route"] as String),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.surfaceElevated),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(a["icon"] as IconData, color: color, size: 24),
                    const SizedBox(height: 6),
                    Text(
                      a["title"] as String,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      a["subtitle"] as String,
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildWearableMetricsSection(BuildContext context, WidgetRef ref, HerState state) {
    final latest = state.wearableRecords.isNotEmpty ? state.wearableRecords.first : null;

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
                child: Row(
                  children: const [
                    Icon(Icons.monitor_heart_outlined, color: AppColors.longevityCyan, size: 20),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "Wearable Telemetry Stream",
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              TextButton(
                onPressed: () => ref.read(herProvider.notifier).syncWearables(),
                child: const Text("Sync Now", style: TextStyle(color: AppColors.primaryLight, fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildWearableMetric(
                label: "Resting HR",
                value: latest?.restingHeartRateBpm != null ? "${latest!.restingHeartRateBpm} bpm" : "68 bpm",
              ),
              _buildWearableMetric(
                label: "Sleep",
                value: latest?.sleepDurationMinutes != null
                    ? "${(latest!.sleepDurationMinutes! / 60).toStringAsFixed(1)} hrs"
                    : "7.4 hrs",
              ),
              _buildWearableMetric(
                label: "Basal Temp",
                value: latest?.basalBodyTempCelsius != null
                    ? "${latest!.basalBodyTempCelsius}°C"
                    : "36.6°C",
              ),
              _buildWearableMetric(
                label: "HRV",
                value: latest?.hrvMs != null ? "${latest!.hrvMs} ms" : "50 ms",
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWearableMetric({required String label, required String value}) {
    return Expanded(
      child: Column(
        children: [
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(value, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 2),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
          ),
        ],
      ),
    );
  }

  Widget _buildSafetyDisclaimer() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.shield_outlined, color: AppColors.ayushGreen, size: 18),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              "AyuSetu uses AI to listen, read, and explain, never to decide alone. Transparent, clinician-reviewed rules generate screening insights. All medical diagnosis and prescription decisions belong exclusively to qualified clinicians.",
              style: TextStyle(
                color: AppColors.textMuted,
                fontSize: 11,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
