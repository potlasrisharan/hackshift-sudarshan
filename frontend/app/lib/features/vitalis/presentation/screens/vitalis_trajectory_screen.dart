import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisTrajectoryScreen extends ConsumerWidget {
  const VitalisTrajectoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final hpi = state.hpiResult;
    final observedDomains = hpi.domains.where((domain) => domain.observed && domain.score != null).toList();

    return AppScaffoldShell(
      title: "Longitudinal Healthspan Trajectory",
      subtitle: "Progress across observed health domains",
      child: RefreshIndicator(
        color: AppColors.vitalisTeal,
        onRefresh: ref.read(vitalisProvider.notifier).refreshFromBackend,
        child: ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF0F766E), Color(0xFF38A68B)], begin: Alignment.topLeft, end: Alignment.bottomRight),
                borderRadius: BorderRadius.circular(22),
              ),
              child: Row(children: [
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text("Your healthspan snapshot", style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Text(hpi.hpiScore == null ? "Baseline in progress" : "${hpi.hpiScore} / 100", style: const TextStyle(color: Colors.white, fontSize: 27, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 5),
                  Text("${(hpi.coverage * 100).round()}% of domain weight observed · ${hpi.algorithmVersion}", style: const TextStyle(color: Colors.white70, fontSize: 11)),
                ])),
                const SizedBox(width: 12),
                SizedBox(width: 64, height: 64, child: CircularProgressIndicator(value: hpi.coverage.clamp(0.0, 1.0), strokeWidth: 7, backgroundColor: Colors.white24, valueColor: const AlwaysStoppedAnimation<Color>(Colors.white))),
              ]),
            ),
            const SizedBox(height: 18),
            if (observedDomains.isEmpty)
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(18), border: Border.all(color: AppColors.surfaceElevated)),
                child: const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Icon(Icons.query_stats_rounded, color: AppColors.vitalisTeal, size: 26),
                  SizedBox(height: 10),
                  Text("No healthspan domains have enough recorded data yet", style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                  SizedBox(height: 5),
                  Text("Verified healthspan feeds are not connected in this build. Missing domains stay blank instead of receiving estimated scores.", style: TextStyle(fontSize: 12, height: 1.4, color: AppColors.textSecondary)),
                ]),
              )
            else ...[
              const Text("Observed domains", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              const SizedBox(height: 10),
              for (final domain in observedDomains) _domainCard(domain),
            ],
            if (hpi.domains.any((domain) => !domain.observed)) ...[
              const SizedBox(height: 18),
              const Text("Still building", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              const SizedBox(height: 10),
              for (final domain in hpi.domains.where((domain) => !domain.observed)) _missingDomainCard(domain),
            ],
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: const Color(0xFFF0F8F5), borderRadius: BorderRadius.circular(14)),
              child: Text("This is a behavioral progress measure, not biological age or a prediction of lifespan. ${hpi.limitations.join(' ')}", style: const TextStyle(color: Color(0xFF426657), fontSize: 11, height: 1.45)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _domainCard(DomainScoreModel domain) => Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.surfaceElevated)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Text(domain.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary))),
            Text("${domain.score} / 100", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.vitalisTeal)),
          ]),
          const SizedBox(height: 9),
          ClipRRect(borderRadius: BorderRadius.circular(5), child: LinearProgressIndicator(value: (domain.score ?? 0) / 100, minHeight: 7, backgroundColor: AppColors.surfaceElevated, valueColor: const AlwaysStoppedAnimation<Color>(AppColors.vitalisTeal))),
          const SizedBox(height: 7),
          Text(domain.rationale, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.35)),
        ]),
      );

  Widget _missingDomainCard(DomainScoreModel domain) => Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.surfaceElevated)),
        child: Row(children: [
          const Icon(Icons.radio_button_unchecked_rounded, size: 17, color: AppColors.textMuted),
          const SizedBox(width: 9),
          Expanded(child: Text(domain.title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary))),
          const Text("No data", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
        ]),
      );
}
