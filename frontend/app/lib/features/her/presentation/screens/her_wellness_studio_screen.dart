import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../data/models/her_models.dart";
import "../providers/her_provider.dart";

class HerWellnessStudioScreen extends ConsumerStatefulWidget {
  const HerWellnessStudioScreen({super.key});

  @override
  ConsumerState<HerWellnessStudioScreen> createState() => _HerWellnessStudioScreenState();
}

class _HerWellnessStudioScreenState extends ConsumerState<HerWellnessStudioScreen> {
  String _activeCategory = "ALL";

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(herProvider);
    final items = state.wellnessItems.where((w) {
      if (_activeCategory == "ALL") return true;
      return w.category == _activeCategory;
    }).toList();

    return AppScaffoldShell(
      title: "Wellness & Yoga Studio",
      subtitle: "Phase-Matched Ayurvedic & Somatic Therapy",
      child: Container(
        color: const Color(0xFFFFF1F3),
        width: double.infinity,
        height: double.infinity,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Phase Banner
              _buildPhaseBanner(),
              const SizedBox(height: 16),

              // Category Filter Tabs
              Row(
                children: [
                  _buildCategoryTab("ALL", "All Practices"),
                  const SizedBox(width: 8),
                  _buildCategoryTab("NUTRITION", "Ayurvedic Diet"),
                  const SizedBox(width: 8),
                  _buildCategoryTab("SOMATIC_YOGA", "Restorative Yoga"),
                ],
              ),
              const SizedBox(height: 16),

              // Practice Cards List
              if (items.isEmpty)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(32),
                    child: Text(
                      "No recommendations found for active category.",
                      style: TextStyle(color: Color(0xFF64748B)),
                    ),
                  ),
                )
              else
                ...items.map((item) => _buildWellnessCard(item)),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhaseBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xFFFFF1F3),
            Color(0xFFFCE7EC),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.2),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: const Row(
        children: [
          Icon(Icons.spa, color: Color(0xFFE11D48), size: 28),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Luteal Phase Protocol Active",
                  style: TextStyle(
                    color: Color(0xFF9F1239),
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  "Focusing on warmth, restorative poses, progesterone support, and lymphatic decompression.",
                  style: TextStyle(color: Color(0xFF475569), fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryTab(String code, String label) {
    final isSelected = _activeCategory == code;
    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: () => setState(() => _activeCategory = code),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFCE7EC),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF)),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFFE11D48).withValues(alpha: 0.25),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : const Color(0xFF9F1239),
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ),
    );
  }

  Widget _buildWellnessCard(HerWellnessItemModel item) {
    final isYoga = item.category == "SOMATIC_YOGA";

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF1F3),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isYoga ? Icons.self_improvement : Icons.restaurant,
                  color: const Color(0xFFE11D48),
                  size: 18,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  item.title,
                  style: const TextStyle(
                    color: Color(0xFF0F172A),
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFFCE7EC),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFFDA4AF)),
                ),
                child: Text(
                  item.targetPhase.toUpperCase(),
                  style: const TextStyle(color: Color(0xFF9F1239), fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            item.description,
            style: const TextStyle(color: Color(0xFF475569), fontSize: 13, height: 1.3),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1F3),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFFDA4AF).withValues(alpha: 0.5)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.lightbulb_outline, size: 14, color: Color(0xFFE11D48)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    "Clinical Rationale: ${item.rationale}",
                    style: const TextStyle(color: Color(0xFF0F172A), fontSize: 11),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
