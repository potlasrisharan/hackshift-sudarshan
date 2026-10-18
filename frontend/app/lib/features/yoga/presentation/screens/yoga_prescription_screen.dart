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
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = "All";
  String _searchQuery = "";

  static const List<String> _categories = [
    "All",
    "Restorative",
    "Spine & Mobility",
    "Pranayama",
    "Chair & Supported",
  ];

  @override
  void initState() {
    super.initState();
    _yogaFuture = ref.read(herApiServiceProvider).fetchWellness(category: "yoga_movement");
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  bool _matchesCategory(HerWellnessItemModel item, String category) {
    if (category == "All") return true;
    final id = item.id.toLowerCase();
    final text = "${item.title} ${item.description}".toLowerCase();
    if (category == "Restorative") {
      return id.contains("rest") ||
          id.contains("supta") ||
          id.contains("balasana") ||
          id.contains("viparita") ||
          id.contains("shavasana") ||
          id.contains("ananda") ||
          text.contains("restorative");
    }
    if (category == "Spine & Mobility") {
      return id.contains("cat-cow") ||
          id.contains("setu") ||
          id.contains("bridge") ||
          id.contains("bhujang") ||
          id.contains("cobra") ||
          id.contains("matsyendr") ||
          id.contains("twist") ||
          id.contains("trikon") ||
          id.contains("virabhadra") ||
          id.contains("vriksha") ||
          id.contains("surya") ||
          text.contains("spine") ||
          text.contains("mobility");
    }
    if (category == "Pranayama") {
      return id.contains("breath") ||
          id.contains("nadi") ||
          id.contains("bhramari") ||
          id.contains("sheetali") ||
          text.contains("pranayama") ||
          text.contains("breathing");
    }
    if (category == "Chair & Supported") {
      return id.contains("chair") ||
          id.contains("supported") ||
          id.contains("mountain") ||
          id.contains("pigeon") ||
          text.contains("chair") ||
          text.contains("wall support");
    }
    return true;
  }

  (String, Color) _doshaBadge(HerWellnessItemModel item) {
    final lower = "${item.id} ${item.title} ${item.description}".toLowerCase();
    if (lower.contains("sheetali") || lower.contains("cooling") || lower.contains("paschimottan")) {
      return ("Pitta Pacifying", const Color(0xFF0284C7));
    }
    if (lower.contains("surya") || lower.contains("virabhadra") || lower.contains("warrior")) {
      return ("Kapha Energizing", const Color(0xFFD97706));
    }
    if (lower.contains("balasana") || lower.contains("rest") || lower.contains("shavasana") || lower.contains("nadi")) {
      return ("Vata Calming", const Color(0xFF7C3AED));
    }
    return ("Tridoshic Harmony", const Color(0xFF059669));
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
          final rawItems = snapshot.data ?? const <HerWellnessItemModel>[];
          final baseItems = rawItems.isEmpty ? HerApiService.defaultYogaItems : rawItems;

          final filteredItems = baseItems.where((item) {
            final matchesCat = _matchesCategory(item, _selectedCategory);
            if (!matchesCat) return false;
            if (_searchQuery.trim().isEmpty) return true;
            final query = _searchQuery.toLowerCase();
            return item.title.toLowerCase().contains(query) ||
                item.description.toLowerCase().contains(query) ||
                item.rationale.toLowerCase().contains(query);
          }).toList();

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
                if (snapshot.hasError || rawItems.isEmpty)
                  const _NoticeCard(
                    icon: Icons.info_outline_rounded,
                    color: Color(0xFF087D71),
                    title: "Safety-Screened Routine (Offline / Baseline)",
                    body: "Showing certified clinical restorative movements designed for gentle recovery while connection sync is pending.",
                  )
                else
                  const _NoticeCard(
                    icon: Icons.verified_user_outlined,
                    color: Color(0xFF087D71),
                    title: "Personalized recommendations",
                    body: "AyuSetu ranks gentle movement options against your recorded health information and safety limits. These movements do not diagnose or treat a condition.",
                  ),
                const SizedBox(height: 16),
                // Search Input
                TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: "Search asanas, pranayamas, benefits...",
                    prefixIcon: const Icon(Icons.search_rounded, size: 20),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, size: 18),
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchQuery = "");
                            },
                          )
                        : null,
                    filled: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onChanged: (val) => setState(() => _searchQuery = val),
                ),
                const SizedBox(height: 12),
                // Category Filter Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _categories.map((cat) {
                      final isSelected = _selectedCategory == cat;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(cat),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) setState(() => _selectedCategory = cat);
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "PRACTICE CATALOG (${filteredItems.length})",
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1.1, color: Color(0xFF087D71)),
                    ),
                    Text(
                      _selectedCategory,
                      style: TextStyle(fontSize: 11, color: Theme.of(context).colorScheme.onSurfaceVariant),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                if (filteredItems.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(24),
                    alignment: Alignment.center,
                    child: Text(
                      "No practices found matching '$_searchQuery'. Try clearing filters.",
                      style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant),
                    ),
                  )
                else
                  for (final (index, item) in filteredItems.indexed) ...[
                    Builder(
                      builder: (ctx) {
                        final (doshaLabel, doshaColor) = _doshaBadge(item);
                        return Card(
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
                                          Wrap(
                                            alignment: WrapAlignment.spaceBetween,
                                            crossAxisAlignment: WrapCrossAlignment.center,
                                            spacing: 6,
                                            runSpacing: 4,
                                            children: [
                                              Text(
                                                "PRACTICE ${index + 1}",
                                                style: const TextStyle(fontSize: 10, letterSpacing: 1.1, fontWeight: FontWeight.w700, color: Color(0xFF087D71)),
                                              ),
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: doshaColor.withValues(alpha: 0.12),
                                                  borderRadius: BorderRadius.circular(6),
                                                ),
                                                child: Text(
                                                  doshaLabel,
                                                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: doshaColor),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text(item.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(item.description, style: const TextStyle(fontSize: 13, height: 1.35)),
                                if (item.rationale.isNotEmpty) ...[
                                  const SizedBox(height: 9),
                                  Text(
                                    item.rationale,
                                    style: TextStyle(fontSize: 12, color: Theme.of(context).colorScheme.onSurfaceVariant),
                                  ),
                                ],
                                if (item.contraindications.isNotEmpty) ...[
                                  const SizedBox(height: 10),
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF59E0B).withValues(alpha: 0.10),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: const Color(0xFFF59E0B).withValues(alpha: 0.3)),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(Icons.warning_amber_rounded, size: 16, color: Color(0xFFB45309)),
                                        const SizedBox(width: 6),
                                        Expanded(
                                          child: Text(
                                            "Precautions: ${item.contraindications.join(", ")}",
                                            style: const TextStyle(fontSize: 11, color: Color(0xFFB45309), fontWeight: FontWeight.w600),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ],
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
