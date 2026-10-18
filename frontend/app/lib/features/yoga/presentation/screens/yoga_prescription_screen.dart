import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../../her/data/models/her_models.dart";
import "../../../her/data/services/her_api_service.dart";
import "../../../her/presentation/providers/her_provider.dart";

class YogaPrescriptionScreen extends ConsumerStatefulWidget {
  const YogaPrescriptionScreen({super.key});

  @override
  ConsumerState<YogaPrescriptionScreen> createState() => _YogaPrescriptionScreenState();
}

class _YogaPrescriptionScreenState extends ConsumerState<YogaPrescriptionScreen> {
  late Future<List<HerWellnessItemModel>> _yogaFuture;

  @override
  void initState() {
    super.initState();
    _yogaFuture = ref.read(herApiServiceProvider).fetchWellness(category: "yoga_movement");
  }

  @override
  Widget build(BuildContext context) {
    final her = ref.watch(herProvider);

    return AppScaffoldShell(
      title: AppStrings.yogaHeader,
      subtitle: "Safety screened and personalized by AyuSetu algorithms",
      child: FutureBuilder<List<HerWellnessItemModel>>(
        future: _yogaFuture,
        builder: (context, snapshot) {
          final yogaItems = snapshot.data ?? const <HerWellnessItemModel>[];
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              if (her.activeSafetyAlert?.isUrgent == true)
                _NoticeCard(
                  icon: Icons.health_and_safety_rounded,
                  color: const Color(0xFFB42318),
                  title: "Movement recommendations paused",
                  body: her.activeSafetyAlert?.emergencyGuidance ?? "Please seek timely medical care before exercise.",
                )
              else if (snapshot.connectionState == ConnectionState.waiting)
                const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator()))
              else ...[
                if (snapshot.hasError || yogaItems.isEmpty)
                  const _NoticeCard(
                    icon: Icons.info_outline_rounded,
                    color: Color(0xFF087D71),
                    title: "Safety-Screened Routine (Offline / Baseline)",
                    body: "Showing certified general restorative movements designed for gentle recovery while connection sync is pending.",
                  )
                else
                  const _NoticeCard(
                    icon: Icons.verified_user_outlined,
                    color: Color(0xFF087D71),
                    title: "Personalized recommendations",
                    body: "AyuSetu ranks gentle movement options against your recorded health information and safety limits. These movements do not diagnose or treat a condition.",
                  ),
                const SizedBox(height: 14),
                for (final (index, item) in (yogaItems.isEmpty ? HerApiService.defaultYogaItems : yogaItems).indexed)
              Card(
                margin: const EdgeInsets.only(bottom: 12),
                clipBehavior: Clip.antiAlias,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: const Color(0xFF087D71).withValues(alpha: 0.10),
                              borderRadius: BorderRadius.circular(15),
                            ),
                            child: Icon(_movementIcon(item.id), color: const Color(0xFF087D71)),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text("MOVEMENT ${index + 1}", style: const TextStyle(fontSize: 10, letterSpacing: 1.1, fontWeight: FontWeight.w700, color: Color(0xFF087D71))),
                                const SizedBox(height: 3),
                                Text(item.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(item.description),
                      if (item.rationale.isNotEmpty) ...[
                        const SizedBox(height: 9),
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
          );
        },
      ),
    );
  }
}

IconData _movementIcon(String id) {
  if (id.contains("rest") || id.contains("supta")) return Icons.self_improvement_rounded;
  if (id.contains("breath") || id.contains("nadi")) return Icons.air_rounded;
  if (id.contains("cat-cow")) return Icons.accessibility_new_rounded;
  if (id.contains("mountain")) return Icons.chair_alt_rounded;
  return Icons.spa_rounded;
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
