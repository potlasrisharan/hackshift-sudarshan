import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisActivityScreen extends ConsumerWidget {
  const VitalisActivityScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final plan = state.exercisePlan;

    return AppScaffoldShell(
      title: "Exercise & Yoga Planner",
      subtitle: "Adaptive Volume & Somatic Protocols",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWeeklyTargetCard(plan),
            const SizedBox(height: 16),
            _buildSafetyStatusBanner(plan),
            const SizedBox(height: 16),
            const Text(
              "Recommended Movement Modalities",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 10),
            _buildActivitiesList(plan.recommendedActivities, true),
            if (plan.contraindicatedActivities.isNotEmpty) ...[
              const SizedBox(height: 16),
              const Text(
                "Contraindicated Activities (Safety Gated)",
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.error),
              ),
              const SizedBox(height: 10),
              _buildActivitiesList(plan.contraindicatedActivities, false),
            ],
            const SizedBox(height: 20),
            Card(
              child: ListTile(
                leading: const Icon(Icons.self_improvement_rounded, color: AppColors.primary),
                title: const Text("Personalized yoga"),
                subtitle: const Text("Open the safety-screened recommendations from the HER wellness algorithm."),
                trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                onTap: () => context.push("/yoga"),
              ),
            ),
            const SizedBox(height: 20),
            _buildLogExerciseButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildWeeklyTargetCard(VitalisExercisePlanModel plan) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Expanded(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: _buildTargetMetric("Aerobic Target", "${plan.weeklyAerobicMinutesTarget}", "mins / week", Icons.directions_run_rounded, AppColors.vitalisEmerald),
            ),
          ),
          Container(width: 1, height: 40, color: AppColors.surfaceElevated),
          Expanded(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: _buildTargetMetric("Strength", "${plan.weeklyStrengthSessionsTarget}", "sessions / week", Icons.fitness_center_rounded, AppColors.primaryLight),
            ),
          ),
          Container(width: 1, height: 40, color: AppColors.surfaceElevated),
          Expanded(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: _buildTargetMetric("Intensity", plan.intensityLevel.toUpperCase(), "Target Cap", Icons.speed_rounded, AppColors.yogaAmber),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTargetMetric(String label, String value, String sub, IconData icon, Color color) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 20, color: color),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textSecondary, fontWeight: FontWeight.w600)),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        Text(sub, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
      ],
    );
  }

  Widget _buildSafetyStatusBanner(VitalisExercisePlanModel plan) {
    final isBlocked = plan.safetyStatus == "BLOCKED" || plan.safetyStatus == "REVIEW";
    final hasBaseline = plan.safetyStatus == "ALLOWED" || plan.safetyStatus == "REVIEW";
    final tint = isBlocked ? AppColors.error : hasBaseline ? AppColors.vitalisTeal : AppColors.textMuted;
    final summary = plan.safetyNotes.isEmpty ? "No progression reason returned." : plan.safetyNotes.first;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: tint.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: tint.withValues(alpha: 0.5)),
      ),
      child: Row(
        children: [
          Icon(isBlocked ? Icons.block_rounded : hasBaseline ? Icons.verified_user_outlined : Icons.info_outline, color: tint, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              "V3 ${plan.progressionAction}: $summary",
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: tint),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivitiesList(List<String> items, bool isAllowed) {
    return Column(
      children: items.map((act) {
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isAllowed ? AppColors.surfaceElevated : AppColors.error.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              Icon(isAllowed ? Icons.check_circle_outline : Icons.cancel_outlined, color: isAllowed ? AppColors.success : AppColors.error, size: 18),
              const SizedBox(width: 10),
              Expanded(
                child: Text(act, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildLogExerciseButton(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Exercise session logged. Targets updated.")),
        );
      },
      icon: const Icon(Icons.add_task_rounded),
      label: const Text("Log Today's Workout Session"),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.vitalisTeal,
        minimumSize: const Size.fromHeight(48),
      ),
    );
  }
}
