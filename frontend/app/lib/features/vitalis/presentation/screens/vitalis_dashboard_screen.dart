import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_safety_banner.dart";
import "../widgets/vitalis_demo_selector_sheet.dart";
import "../widgets/vitalis_metric_card.dart";

class VitalisDashboardScreen extends ConsumerWidget {
  const VitalisDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final notifier = ref.read(vitalisProvider.notifier);

    return AppScaffoldShell(
      title: AppStrings.vitalisHeader,
      subtitle: AppStrings.vitalisSubtitle,
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (state.safetyAlert != null)
              VitalisSafetyBanner(
                alert: state.safetyAlert!,
                onDismiss: () => notifier.dismissSafetyAlert(),
              ),
            _buildPersonaSwitcherBar(context, state),
            const SizedBox(height: 16),
            _buildHpiScoreCard(context, state),
            const SizedBox(height: 16),
            _buildQuickActionsRow(context),
            const SizedBox(height: 20),
            const Text(
              "Health Telemetry & Modifiable Factors",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            _buildTelemetryGrid(context, state),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    "Priority Evidence-Based Actions",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                TextButton(
                  onPressed: () => context.push("/vitalis/trajectory"),
                  child: const Text("View Trajectory", style: TextStyle(color: AppColors.vitalisTeal, fontSize: 13)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            _buildPrioritiesList(context, state),
            const SizedBox(height: 16),
            _buildModuleNavSection(context),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildPersonaSwitcherBar(BuildContext context, VitalisState state) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
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
                const Icon(Icons.person_pin_rounded, color: AppColors.vitalisTeal, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        state.activePersona.name,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        state.isWearableConnected ? "Wearables Synced" : "Wearable Disconnected",
                        style: TextStyle(
                          fontSize: 10,
                          color: state.isWearableConnected ? AppColors.success : AppColors.warning,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          InkWell(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                isScrollControlled: true,
                builder: (_) => const VitalisDemoSelectorSheet(),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.vitalisTeal.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.swap_horiz_rounded, size: 14, color: AppColors.vitalisTeal),
                  SizedBox(width: 4),
                  Text(
                    "Switch Demo",
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.vitalisTeal),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHpiScoreCard(BuildContext context, VitalisState state) {
    final hpi = state.hpiResult;
    final hasScore = hpi.hpiScore != null;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.vitalisTeal.withValues(alpha: 0.2),
            AppColors.surface,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.vitalisTeal.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      AppStrings.healthspanIndex,
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerLeft,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.baseline,
                        textBaseline: TextBaseline.alphabetic,
                        children: [
                          Text(
                            hasScore ? "${hpi.hpiScore}" : "N/A",
                            style: const TextStyle(
                              fontSize: 38,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Text("/ 100", style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: (hasScore ? AppColors.success : AppColors.warning).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerLeft,
                        child: Text(
                          hasScore
                              ? "Data Coverage: ${Math.round(hpi.coverage * 100)}% (Adequate)"
                              : "Insufficient Streams (<40% Coverage)",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: hasScore ? AppColors.success : AppColors.warning,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      SizedBox(
                        width: 72,
                        height: 72,
                        child: CircularProgressIndicator(
                          value: hasScore ? (hpi.hpiScore! / 100) : 0.05,
                          strokeWidth: 7,
                          backgroundColor: AppColors.surfaceElevated,
                          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.vitalisTeal),
                        ),
                      ),
                      Text(
                        hasScore ? "${hpi.hpiScore}%" : "0%",
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    "Behavioral Metric",
                    style: TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(color: AppColors.surfaceElevated, height: 1),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "Not a biological age or mortality score.",
                  style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontStyle: FontStyle.italic),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: () => context.push("/vitalis/healthspan"),
                child: const Row(
                  children: [
                    Text("Breakdown", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.vitalisTeal)),
                    Icon(Icons.chevron_right, size: 16, color: AppColors.vitalisTeal),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsRow(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildQuickActionChip(context, "Assessment", Icons.assignment_outlined, "/vitalis/assessment"),
          _buildQuickActionChip(context, "Exercise Plan", Icons.fitness_center_outlined, "/vitalis/activity"),
          _buildQuickActionChip(context, "Indian Meals", Icons.restaurant_outlined, "/vitalis/nutrition"),
          _buildQuickActionChip(context, "Biomarkers", Icons.science_outlined, "/vitalis/biomarkers"),
          _buildQuickActionChip(context, "Copilot AI", Icons.auto_awesome, "/vitalis/copilot"),
          _buildQuickActionChip(context, "Doctor Summary", Icons.print_outlined, "/vitalis/summary"),
        ],
      ),
    );
  }

  Widget _buildQuickActionChip(BuildContext context, String label, IconData icon, String route) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: ActionChip(
        avatar: Icon(icon, size: 16, color: AppColors.vitalisTeal),
        label: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        backgroundColor: AppColors.surface,
        side: const BorderSide(color: AppColors.surfaceElevated),
        onPressed: () => context.push(route),
      ),
    );
  }

  Widget _buildTelemetryGrid(BuildContext context, VitalisState state) {
    final hasWearables = state.isWearableConnected;
    final rScore = state.readiness.score;

    return GridView.count(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.25,
      children: [
        VitalisMetricCard(
          label: "Daily Steps",
          value: hasWearables ? "6,840" : "3,200",
          unit: "steps",
          icon: Icons.directions_walk_rounded,
          iconColor: AppColors.vitalisEmerald,
          provenance: hasWearables ? "Apple Watch S9" : "Manual Log",
          onTap: () => context.push("/vitalis/activity"),
        ),
        VitalisMetricCard(
          label: "Resting Heart Rate",
          value: hasWearables ? "62" : "68",
          unit: "bpm",
          icon: Icons.favorite_rounded,
          iconColor: AppColors.error,
          provenance: hasWearables ? "21-Day Baseline" : "Clinic Record",
          onTap: () => context.push("/vitalis/wearables"),
        ),
        VitalisMetricCard(
          label: "Daily Readiness",
          value: rScore != null ? "$rScore" : "N/A",
          unit: rScore != null ? "/ 100" : "",
          icon: Icons.battery_charging_full_rounded,
          iconColor: AppColors.vitalisTeal,
          provenance: "Experimental Wellness",
          onTap: () => context.push("/vitalis/sleep"),
        ),
        VitalisMetricCard(
          label: "VO2max Estimate",
          value: state.cardio.vo2Max > 0 ? "${state.cardio.vo2Max}" : "N/A",
          unit: state.cardio.vo2Max > 0 ? "mL/kg" : "",
          icon: Icons.speed_rounded,
          iconColor: AppColors.primaryLight,
          provenance: state.cardio.provenanceLabel,
          onTap: () => context.push("/vitalis/cardio"),
        ),
      ],
    );
  }

  Widget _buildPrioritiesList(BuildContext context, VitalisState state) {
    return Column(
      children: [
        for (final rec in state.recommendations.take(3))
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.surfaceElevated),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.check_circle_outline, color: AppColors.vitalisTeal, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        rec.title,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        rec.evidenceSource,
                        style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildModuleNavSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Complete Healthspan Intelligence Modules",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        _buildModuleTile(context, "Cardiorespiratory Fitness & VO2max", "Aerobic zones, resting HR trends & provenance", Icons.speed_rounded, "/vitalis/cardio"),
        _buildModuleTile(context, "Functional Capacity & Ageing", "Grip strength, chair rise & WHO ICOPE criteria", Icons.elderly_rounded, "/vitalis/functional-health"),
        _buildModuleTile(context, "Indian Nutrition Intelligence", "Pulses, makhana, vegetarian protein & safety", Icons.eco_rounded, "/vitalis/nutrition"),
        _buildModuleTile(context, "Sleep Regularity & Bedtime SRI", "Circadian stability & sleep epoch agreement", Icons.nightlight_round, "/vitalis/sleep"),
        _buildModuleTile(context, "Preventive Care Timeline", "Guidelines-based screenings & consultation schedule", Icons.event_available_rounded, "/vitalis/preventive-care"),
        _buildModuleTile(context, "What-If Behavior Simulator", "Model schedule volume without false lifespan claims", Icons.tune_rounded, "/vitalis/scenarios"),
        _buildModuleTile(context, "Consent, Data Vault & Privacy", "Granular consent grants and audit log viewer", Icons.security_rounded, "/vitalis/settings"),
      ],
    );
  }

  Widget _buildModuleTile(BuildContext context, String title, String subtitle, IconData icon, String route) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppColors.vitalisTeal),
        title: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textMuted),
        onTap: () => context.push(route),
      ),
    );
  }
}

class Math {
  static int round(num val) => val.round();
}
