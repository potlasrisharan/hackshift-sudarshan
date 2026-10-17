import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisSimulatorScreen extends ConsumerStatefulWidget {
  const VitalisSimulatorScreen({super.key});

  @override
  ConsumerState<VitalisSimulatorScreen> createState() => _VitalisSimulatorScreenState();
}

class _VitalisSimulatorScreenState extends ConsumerState<VitalisSimulatorScreen> {
  double _zone2Minutes = 120;
  double _strengthSessions = 2;
  double _bedtimeConsistencyMins = 45;
  double _veggieServings = 4;
  bool _smokeFree = true;

  void _resetToBaseline(VitalisState state) {
    setState(() {
      _zone2Minutes = state.activity.weeklyZone2Minutes.toDouble();
      _strengthSessions = state.activity.strengthSessionsWeekly.toDouble();
      _bedtimeConsistencyMins = state.sleep.bedtimeConsistencyMinutes.toDouble();
      _veggieServings = 4;
      _smokeFree = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);

    // Deterministic simulation projections (Algorithm V14)
    final cardioDelta = ((_zone2Minutes - 90) / 30).clamp(-4.0, 8.0);
    final functionalDelta = ((_strengthSessions - 1) * 3).clamp(-3.0, 9.0);
    final sleepDelta = ((60 - _bedtimeConsistencyMins) / 10).clamp(-5.0, 7.0);
    final nutritionDelta = ((_veggieServings - 3) * 2).clamp(-4.0, 6.0);
    final tobaccoPenalty = _smokeFree ? 0.0 : -12.0;

    final projectedHpiDelta = (cardioDelta * 0.25 +
            functionalDelta * 0.20 +
            sleepDelta * 0.20 +
            nutritionDelta * 0.20 +
            tobaccoPenalty * 0.15)
        .clamp(-15.0, 15.0);

    final baselineHpi = state.healthspanIndex.hpiScore ?? 50;
    final projectedHpi = (baselineHpi + projectedHpiDelta).clamp(10.0, 99.0).round();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("What-If Behavior Simulator"),
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
                title: "Behavior Simulator & Scenario Modeling",
                description:
                    "Models expected directional shifts across healthspan domains under hypothetical lifestyle modifications. Derived from epidemiological meta-analyses. It does NOT predict individual lifespan gains or diagnostic outcomes.",
                algorithmName: "V14 Behavior Simulator & Scenario Engine",
                version: "1.0.0",
                evidenceSource: "AHA Life's Essential 8; WHO Physical Activity Guidelines 2020",
                evidenceLevel: "Epidemiological Projection",
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
            _buildProjectionCard(baselineHpi, projectedHpi, projectedHpiDelta),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    "Modifiable Lifestyle Levers",
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                TextButton.icon(
                  onPressed: () => _resetToBaseline(state),
                  icon: const Icon(Icons.refresh, size: 16, color: AppColors.vitalisTeal),
                  label: const Text("Reset", style: TextStyle(color: AppColors.vitalisTeal, fontSize: 12)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            _buildSliderLever(
              title: "Weekly Zone 2 Aerobic Base",
              value: _zone2Minutes,
              min: 0,
              max: 300,
              divisions: 30,
              unit: "min/week",
              icon: Icons.directions_run_rounded,
              onChanged: (val) => setState(() => _zone2Minutes = val),
            ),
            const SizedBox(height: 12),
            _buildSliderLever(
              title: "Strength & Resistance Sessions",
              value: _strengthSessions,
              min: 0,
              max: 5,
              divisions: 5,
              unit: "sessions/week",
              icon: Icons.fitness_center_rounded,
              onChanged: (val) => setState(() => _strengthSessions = val),
            ),
            const SizedBox(height: 12),
            _buildSliderLever(
              title: "Bedtime Consistency Interval",
              value: _bedtimeConsistencyMins,
              min: 15,
              max: 120,
              divisions: 21,
              unit: "± min variance",
              icon: Icons.nightlight_round,
              onChanged: (val) => setState(() => _bedtimeConsistencyMins = val),
            ),
            const SizedBox(height: 12),
            _buildSliderLever(
              title: "Daily Vegetable & Fiber Servings",
              value: _veggieServings,
              min: 1,
              max: 8,
              divisions: 7,
              unit: "servings/day",
              icon: Icons.eco_rounded,
              onChanged: (val) => setState(() => _veggieServings = val),
            ),
            const SizedBox(height: 12),
            _buildToggleLever(
              title: "Tobacco & Nicotine Abstinence",
              value: _smokeFree,
              icon: Icons.smoke_free_rounded,
              onChanged: (val) => setState(() => _smokeFree = val),
            ),
            const SizedBox(height: 24),
            _buildDomainBreakdown(cardioDelta, functionalDelta, sleepDelta, nutritionDelta),
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
              "STRICT RESEARCH BOUNDARY: Simulations illustrate potential directional impact on domain scores. AyuSetu strictly does NOT calculate 'years of life gained' or claim biological age reversal.",
              style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.4, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectionCard(int baseline, int projected, double delta) {
    final isPositive = delta >= 0;
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.vitalisTeal.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Projected Healthspan Progress Index (HPI)",
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Current Baseline", style: TextStyle(fontSize: 11, color: AppColors.textMuted), overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 2),
                    Text("$baseline", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 4),
                child: Icon(Icons.arrow_forward_rounded, color: AppColors.vitalisTeal, size: 20),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text("Projected", style: TextStyle(fontSize: 11, color: AppColors.vitalisTeal, fontWeight: FontWeight.w700), overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 2),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text("$projected", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                        const SizedBox(width: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                          decoration: BoxDecoration(
                            color: (isPositive ? AppColors.ayushGreen : AppColors.warning).withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            "${isPositive ? '+' : ''}${delta.toStringAsFixed(1)}",
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: isPositive ? AppColors.ayushGreen : AppColors.warning,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSliderLever({
    required String title,
    required double value,
    required double min,
    required double max,
    required int divisions,
    required String unit,
    required IconData icon,
    required ValueChanged<double> onChanged,
  }) {
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Icon(icon, size: 18, color: AppColors.vitalisTeal),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text("${value.toInt()} $unit", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.vitalisTeal)),
            ],
          ),
          Slider(
            value: value,
            min: min,
            max: max,
            divisions: divisions,
            activeColor: AppColors.vitalisTeal,
            inactiveColor: AppColors.surfaceElevated,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildToggleLever({
    required String title,
    required bool value,
    required IconData icon,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Icon(icon, size: 18, color: AppColors.vitalisTeal),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Switch(
            value: value,
            activeTrackColor: AppColors.vitalisTeal,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildDomainBreakdown(double cardio, double functional, double sleep, double nutrition) {
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
            "Projected Domain Trajectory",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 12),
          _DomainBar(label: "Cardiovascular Fitness", delta: cardio),
          _DomainBar(label: "Functional Reserve", delta: functional),
          _DomainBar(label: "Circadian Stability", delta: sleep),
          _DomainBar(label: "Metabolic Nutrition", delta: nutrition),
        ],
      ),
    );
  }
}

class _DomainBar extends StatelessWidget {
  final String label;
  final double delta;

  const _DomainBar({required this.label, required this.delta});

  @override
  Widget build(BuildContext context) {
    final isPos = delta >= 0;
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(child: Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary))),
          Text(
            "${isPos ? '+' : ''}${delta.toStringAsFixed(1)} pts",
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: isPos ? AppColors.ayushGreen : AppColors.warning,
            ),
          ),
        ],
      ),
    );
  }
}
