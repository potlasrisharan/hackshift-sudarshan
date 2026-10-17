import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisFunctionalScreen extends ConsumerWidget {
  const VitalisFunctionalScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final functional = state.functional;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Functional Health & Intrinsic Capacity"),
        backgroundColor: AppColors.surface,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: AppColors.vitalisTeal),
            onPressed: () {
              VitalisExplainabilitySheet.show(
                context,
                title: "Functional Capacity & Sarcopenia Screening",
                description:
                    "Functional health scoring evaluates physical independence and neuromuscular reserve using validated tests: isometric handgrip dynamometry (kg), 5-times sit-to-stand chair rise (seconds), and WHO ICOPE intrinsic capacity standards.",
                algorithmName: "V11 Functional Capacity & Fall Risk Screener",
                version: "1.0.0",
                evidenceSource: "WHO Integrated Care for Older People (ICOPE) Guidelines (2019); EWGSOP2 Consensus (2019)",
                evidenceLevel: "WHO Clinical Guideline",
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
            if (functional.fallRiskFlag) _buildFallRiskAlert(),
            const SizedBox(height: 16),
            _buildFunctionalScoreCard(functional),
            const SizedBox(height: 16),
            _buildBiomarkerTestsGrid(functional),
            const SizedBox(height: 16),
            _buildIcopeDomainsCard(),
            const SizedBox(height: 16),
            _buildAgeAdaptivePrescription(state),
          ],
        ),
      ),
    );
  }

  Widget _buildFallRiskAlert() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.4)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.warning_rounded, color: AppColors.error, size: 22),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Elevated Fall Risk / Low Neuromuscular Reserve",
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.error),
                ),
                SizedBox(height: 4),
                Text(
                  "Chair-rise duration > 14s or low grip strength indicates diminished lower-extremity power. Clinical assessment and supervised balance/physiotherapy are recommended.",
                  style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFunctionalScoreCard(FunctionalHealth functional) {
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
                width: 70,
                height: 70,
                child: CircularProgressIndicator(
                  value: functional.compositeScore / 100,
                  strokeWidth: 7,
                  backgroundColor: AppColors.surfaceElevated,
                  valueColor: AlwaysStoppedAnimation<Color>(
                    functional.compositeScore >= 60 ? AppColors.vitalisTeal : AppColors.warning,
                  ),
                ),
              ),
              Text(
                "${functional.compositeScore}",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Functional Capacity Index",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
                const SizedBox(height: 4),
                Text(
                  "Status: ${functional.category}",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: functional.compositeScore >= 60 ? AppColors.ayushGreen : AppColors.warning,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  "Predicts mobility preservation & independent living across age brackets.",
                  style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBiomarkerTestsGrid(FunctionalHealth functional) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _TestCard(
                title: "Grip Strength",
                value: "${functional.gripStrengthKg}",
                unit: "kg",
                benchmark: "Ref: ≥ 28kg (M) / ≥ 18kg (F)",
                icon: Icons.fitness_center_rounded,
                status: functional.gripStrengthKg >= 26 ? "Adequate Power" : "Sarcopenia Risk",
                isOk: functional.gripStrengthKg >= 26,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _TestCard(
                title: "5x Chair Rise",
                value: "${functional.chairRiseSeconds}",
                unit: "seconds",
                benchmark: "Target: < 12 seconds",
                icon: Icons.airline_seat_recline_normal_rounded,
                status: functional.chairRiseSeconds <= 12 ? "Optimal Speed" : "Elevated Time",
                isOk: functional.chairRiseSeconds <= 12,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildIcopeDomainsCard() {
    final domains = [
      {"name": "Locomotion", "status": "Preserved", "icon": Icons.directions_walk_rounded, "ok": true},
      {"name": "Cognition", "status": "Normal Memory", "icon": Icons.psychology_outlined, "ok": true},
      {"name": "Vitality (Nutrition)", "status": "Stable Weight", "icon": Icons.restaurant_rounded, "ok": true},
      {"name": "Psychological", "status": "Resilient", "icon": Icons.sentiment_satisfied_alt_rounded, "ok": true},
      {"name": "Sensory (Vision/Hearing)", "status": "Screening Due", "icon": Icons.visibility_outlined, "ok": false},
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "WHO ICOPE Intrinsic Capacity",
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
                child: const Text("5 Core Domains", style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          for (final d in domains)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                children: [
                  Icon(d["icon"] as IconData, size: 18, color: AppColors.vitalisTeal),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      d["name"] as String,
                      style: const TextStyle(fontSize: 12, color: AppColors.textPrimary),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    d["status"] as String,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: (d["ok"] as bool) ? AppColors.ayushGreen : AppColors.warning,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildAgeAdaptivePrescription(VitalisState state) {
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
            "Evidence-Based Functional Routine",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          SizedBox(height: 10),
          _RoutineTile(
            title: "Multi-Joint Resistance Training",
            subtitle: "Squats / Sit-to-stands, wall pushups (2x/week)",
            desc: "Prevents type-II muscle fiber atrophy and preserves bone mineral density.",
          ),
          SizedBox(height: 8),
          _RoutineTile(
            title: "Single-Leg & Tandem Balance",
            subtitle: "30-60s hold near stable surface (Daily)",
            desc: "Strengthens proprioception and vestibular-cerebellar pathways to eliminate fall risks.",
          ),
        ],
      ),
    );
  }
}

class _TestCard extends StatelessWidget {
  final String title;
  final String value;
  final String unit;
  final String benchmark;
  final IconData icon;
  final String status;
  final bool isOk;

  const _TestCard({
    required this.title,
    required this.value,
    required this.unit,
    required this.benchmark,
    required this.icon,
    required this.status,
    required this.isOk,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
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
                child: Text(
                  title,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Icon(icon, size: 16, color: AppColors.vitalisTeal),
            ],
          ),
          const SizedBox(height: 8),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                const SizedBox(width: 4),
                Text(
                  unit,
                  style: const TextStyle(fontSize: 10, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          Text(status, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: isOk ? AppColors.ayushGreen : AppColors.warning)),
          const SizedBox(height: 2),
          Text(benchmark, style: const TextStyle(fontSize: 9, color: AppColors.textMuted)),
        ],
      ),
    );
  }
}

class _RoutineTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final String desc;

  const _RoutineTile({
    required this.title,
    required this.subtitle,
    required this.desc,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        Text(subtitle, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.vitalisTeal)),
        const SizedBox(height: 2),
        Text(desc, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3)),
      ],
    );
  }
}
