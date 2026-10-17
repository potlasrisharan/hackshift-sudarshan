import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../../her/presentation/providers/her_provider.dart";

class YogaPrescriptionScreen extends ConsumerWidget {
  const YogaPrescriptionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final her = ref.watch(herProvider);
    final yogaItems = her.wellnessItems
        .where((item) => item.category.toUpperCase() == "SOMATIC_YOGA" || item.category.toUpperCase() == "YOGA_MOVEMENT")
        .toList();

    return AppScaffoldShell(
      title: AppStrings.yogaHeader,
      subtitle: "Safety screened and personalized by AyuSetu algorithms",
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          if (her.activeSafetyAlert?.isUrgent == true)
            _NoticeCard(
              icon: Icons.health_and_safety_rounded,
              color: const Color(0xFFB42318),
              title: "Movement recommendations paused",
              body: her.activeSafetyAlert?.emergencyGuidance ?? "Please seek timely medical care before exercise.",
            )
          else if (her.isLoading && yogaItems.isEmpty)
            const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()))
          else if (yogaItems.isEmpty)
            const _NoticeCard(
              icon: Icons.self_improvement_rounded,
              color: Color(0xFF087D71),
              title: "No personalized movements yet",
              body: "Complete your health profile to receive safety-screened recommendations.",
            )
          else ...[
            const _NoticeCard(
              icon: Icons.verified_user_outlined,
              color: Color(0xFF087D71),
              title: "Personalized recommendations",
              body: "The HER wellness ranker filters contraindications and prioritizes suitable options. These movements do not diagnose or treat a condition.",
            ),
            const SizedBox(height: 14),
            for (final item in yogaItems)
              Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      Text(item.description),
                      if (item.rationale.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(item.rationale, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                      ],
                      if (item.contraindications.isNotEmpty) ...[
                        const SizedBox(height: 10),
                        Text("Safety notes: ${item.contraindications.join(", ")}", style: const TextStyle(fontSize: 12, color: Color(0xFF9A6700))),
                      ],
                    ],
                  ),
                ),
              ),
          ],
        ],
      ),
    );
  }
}

class _NoticeCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String body;

  const _NoticeCard({required this.icon, required this.color, required this.title, required this.body});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          border: Border.all(color: color.withValues(alpha: 0.22)),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(title, style: TextStyle(fontWeight: FontWeight.w700, color: color)),
              const SizedBox(height: 4),
              Text(body),
            ])),
          ],
        ),
      );
}

class HomeYogaBanner extends StatelessWidget {
  final String focusTitle;
  final String selectedIssue;
  final String selectedAgeGroup;
  final String selectedDosha;

  const HomeYogaBanner({super.key, this.focusTitle = "", this.selectedIssue = "", this.selectedAgeGroup = "", this.selectedDosha = ""});

  @override
  Widget build(BuildContext context) => Card(
        child: ListTile(
          leading: const Icon(Icons.self_improvement_rounded, color: Color(0xFF087D71)),
          title: const Text("Personalized movement"),
          subtitle: Text(focusTitle.isEmpty ? "Recommendations are safety screened" : focusTitle, maxLines: 2, overflow: TextOverflow.ellipsis),
          trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
          onTap: () => context.push("/yoga"),
        ),
      );
}
