import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../data/models/her_models.dart";
import "../providers/her_provider.dart";
import "../widgets/her_demo_selector_sheet.dart";
import "../widgets/her_safety_banner.dart";

class HerHubScreen extends ConsumerWidget {
  const HerHubScreen({super.key});

  static const _ink = Color(0xFF342A3A);
  static const _plum = Color(0xFF744D70);
  static const _paper = Color(0xFFFFF9F7);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(herProvider);
    final analysis = state.cycleAnalysis;

    return AppScaffoldShell(
      title: "HER",
      subtitle: "Your cycle and wellbeing, in one calm space",
      actions: [
        IconButton(
          tooltip: "Switch demo profile",
          icon: const Icon(Icons.tune_rounded, color: _plum),
          onPressed: () => showModalBottomSheet<void>(
            context: context,
            backgroundColor: Colors.transparent,
            isScrollControlled: true,
            builder: (_) => const HerDemoSelectorSheet(),
          ),
        ),
      ],
      child: ColoredBox(
        color: _paper,
        child: state.isLoading
            ? const Center(child: CircularProgressIndicator(color: _plum))
            : RefreshIndicator(
                color: _plum,
                onRefresh: ref.read(herProvider.notifier).loadAll,
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(18, 12, 18, 28),
                  children: [
                    _cycleCard(analysis),
                    if (state.activeSafetyAlert != null) ...[
                      const SizedBox(height: 14),
                      HerSafetyBanner(
                        alert: state.activeSafetyAlert!,
                        onDismiss: () => ref.read(herProvider.notifier).dismissSafetyAlert(),
                      ),
                    ],
                    const SizedBox(height: 24),
                    const Text("A little care, when you need it", style: TextStyle(color: _ink, fontSize: 19, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 12),
                    _featureTile(
                      context,
                      icon: Icons.edit_note_rounded,
                      title: "Log how you feel",
                      detail: state.symptoms.isEmpty ? "Add a symptom or mood check-in" : "${state.symptoms.length} recent check-ins",
                      route: "/her/symptom-journal",
                      tint: const Color(0xFFFFE9E7),
                    ),
                    const SizedBox(height: 10),
                    _featureTile(
                      context,
                      icon: Icons.spa_outlined,
                      title: "Wellness ideas",
                      detail: "Gentle movement and everyday support",
                      route: "/her/wellness-studio",
                      tint: const Color(0xFFECE8F1),
                    ),
                    const SizedBox(height: 10),
                    _featureTile(
                      context,
                      icon: Icons.calendar_month_outlined,
                      title: "Cycle history",
                      detail: "${analysis.totalIntervals} intervals recorded",
                      route: "/her/cycle-calendar",
                      tint: const Color(0xFFEAF0E7),
                    ),
                    if (state.findings.isNotEmpty) ...[
                      const SizedBox(height: 22),
                      _screeningCard(state.findings.first),
                    ],
                    const SizedBox(height: 18),
                    const Text(
                      "Cycle estimates are based on the dates you record. They are not a diagnosis or a substitute for care from a clinician.",
                      style: TextStyle(color: Color(0xFF756E78), fontSize: 12, height: 1.45),
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _cycleCard(HerCycleAnalysisModel analysis) {
    final hasPrediction = analysis.predictedNextWindowStart != null;
    final cycleLength = analysis.medianLengthDays;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF75516E), Color(0xFF9D7180)]),
        borderRadius: BorderRadius.circular(26),
        boxShadow: [BoxShadow(color: _plum.withValues(alpha: .18), blurRadius: 22, offset: const Offset(0, 10))],
      ),
      child: Stack(
        children: [
          Positioned(right: 2, top: 0, child: Icon(Icons.spa_rounded, size: 110, color: Colors.white.withValues(alpha: .09))),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                const Icon(Icons.auto_awesome_rounded, size: 17, color: Color(0xFFFFDCE2)),
                const SizedBox(width: 7),
                Text(analysis.hasIrregularity ? "A pattern to keep an eye on" : "Your cycle at a glance", style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
              ]),
              const SizedBox(height: 20),
              Text(
                hasPrediction ? analysis.predictedNextWindowStart! : "Your rhythm, your pace",
                style: const TextStyle(color: Colors.white, fontSize: 25, fontWeight: FontWeight.w700, height: 1.12),
              ),
              const SizedBox(height: 6),
              Text(
                hasPrediction
                    ? "Estimated next period window${analysis.predictedNextWindowEnd == null ? '' : ' · through ${analysis.predictedNextWindowEnd}'}"
                    : "Log a few cycle dates to see your personal estimate",
                style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 22),
              Row(children: [
                _statChip("Typical cycle", cycleLength == null ? "Building" : "$cycleLength days"),
                const SizedBox(width: 9),
                _statChip("Tracked", "${analysis.totalIntervals} cycles"),
              ]),
              if (analysis.irregularityFlags.isNotEmpty) ...[
                const SizedBox(height: 14),
                Text(analysis.irregularityFlags.first, style: const TextStyle(color: Color(0xFFFFE9C8), fontSize: 12, height: 1.35)),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _statChip(String label, String value) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
        decoration: BoxDecoration(color: Colors.white.withValues(alpha: .13), borderRadius: BorderRadius.circular(14), border: Border.all(color: Colors.white24)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 10)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700)),
        ]),
      );

  Widget _featureTile(BuildContext context, {required IconData icon, required String title, required String detail, required String route, required Color tint}) =>
      Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: () => context.push(route),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            child: Row(children: [
              Container(width: 46, height: 46, decoration: BoxDecoration(color: tint, borderRadius: BorderRadius.circular(15)), child: Icon(icon, color: _plum, size: 23)),
              const SizedBox(width: 13),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: const TextStyle(color: _ink, fontSize: 14, fontWeight: FontWeight.w700)),
                const SizedBox(height: 3),
                Text(detail, style: const TextStyle(color: Color(0xFF77717A), fontSize: 12)),
              ])),
              const Icon(Icons.arrow_forward_ios_rounded, size: 15, color: Color(0xFF9B8F9A)),
            ]),
          ),
        ),
      );

  Widget _screeningCard(HerScreeningFindingModel finding) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: const Color(0xFFFFF1E5), borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFF0D3B6))),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Icon(Icons.lightbulb_outline_rounded, color: Color(0xFF9B5F2C)),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(finding.title, style: const TextStyle(color: _ink, fontSize: 14, fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            Text(finding.suggestedAction, style: const TextStyle(color: Color(0xFF6E5A4C), fontSize: 12, height: 1.4)),
          ])),
        ]),
      );
}
