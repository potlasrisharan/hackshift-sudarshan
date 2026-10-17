import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
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
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text(
          "What-If Behavior Simulator",
          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 17, color: Color(0xFF0F172A)),
        ),
        backgroundColor: const Color(0xFFFFFFFF),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF0F172A)),
        actions: [
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: AyuSetuLogoBadge(height: 20),
          ),
          IconButton(
            icon: const Icon(Icons.info_outline, color: Color(0xFF059669)),
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
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                TextButton.icon(
                  onPressed: () => _resetToBaseline(state),
                  icon: const Icon(Icons.refresh, size: 16, color: Color(0xFF059669)),
                  label: const Text(
                    "Reset",
                    style: TextStyle(color: Color(0xFF059669), fontSize: 13, fontWeight: FontWeight.w700),
                  ),
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
            const SizedBox(height: 20),
            _buildDomainBreakdown(cardioDelta, functionalDelta, sleepDelta, nutritionDelta),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSafetyCallout() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDFA),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF99F6E4)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.shield_outlined, color: Color(0xFF0D9488), size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              "STRICT RESEARCH BOUNDARY: Simulations illustrate potential directional impact on domain scores. AyuSetu strictly does NOT calculate 'years of life gained' or claim biological age reversal.",
              style: TextStyle(fontSize: 11.5, color: Color(0xFF134E4A), height: 1.4, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectionCard(int baseline, int projected, double delta) {
    final isPositive = delta >= 0;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Projected Healthspan Progress Index (HPI)",
            style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Current Baseline", style: TextStyle(fontSize: 11, color: Color(0xFF64748B)), overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text("$baseline", style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: Color(0xFF475569))),
                  ],
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 8),
                child: Icon(Icons.arrow_forward_rounded, color: Color(0xFF059669), size: 22),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Text("Projected", style: TextStyle(fontSize: 11, color: Color(0xFF059669), fontWeight: FontWeight.w700), overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text("$projected", style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                          decoration: BoxDecoration(
                            color: isPositive ? const Color(0xFFE6F7F2) : const Color(0xFFFFFBEB),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(
                              color: isPositive ? const Color(0xFFA7F3D0) : const Color(0xFFFDE68A),
                            ),
                          ),
                          child: Text(
                            "${isPositive ? '+' : ''}${delta.toStringAsFixed(1)}",
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: isPositive ? const Color(0xFF059669) : const Color(0xFFD97706),
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
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
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: Color(0xFFE6F7F2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, size: 16, color: const Color(0xFF059669)),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        title,
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFE6F7F2),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  "${value.toInt()} $unit",
                  style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF059669)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Slider(
            value: value,
            min: min,
            max: max,
            divisions: divisions,
            activeColor: const Color(0xFF059669),
            inactiveColor: const Color(0xFFE2E8F0),
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
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(
                    color: Color(0xFFE6F7F2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 16, color: const Color(0xFF059669)),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Switch(
            value: value,
            activeTrackColor: const Color(0xFF059669),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildDomainBreakdown(double cardio, double functional, double sleep, double nutrition) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Projected Domain Trajectory",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 14),
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
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Expanded(child: Text(label, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w500, color: Color(0xFF475569)))),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: isPos ? const Color(0xFFE6F7F2) : const Color(0xFFFFFBEB),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              "${isPos ? '+' : ''}${delta.toStringAsFixed(1)} pts",
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w700,
                color: isPos ? const Color(0xFF059669) : const Color(0xFFD97706),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
