import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
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
                    style: TextStyle(color: AppColors.textMuted),
                  ),
                ),
              )
            else
              ...items.map((item) => _buildWellnessCard(item)),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildPhaseBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.ayushGreen.withValues(alpha: 0.25),
            AppColors.surface,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.ayushGreen.withValues(alpha: 0.4)),
      ),
      child: const Row(
        children: [
          Icon(Icons.spa, color: AppColors.ayushGreen, size: 28),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Luteal Phase Protocol Active",
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  "Focusing on warmth, restorative poses, progesterone support, and lymphatic decompression.",
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
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
            color: isSelected ? AppColors.ayushGreen : AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(10),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : AppColors.textSecondary,
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
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isYoga ? Icons.self_improvement : Icons.restaurant,
                color: isYoga ? AppColors.ayushGreen : AppColors.yogaAmber,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  item.title,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  item.targetPhase.toUpperCase(),
                  style: const TextStyle(color: AppColors.primaryLight, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            item.description,
            style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.3),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.lightbulb_outline, size: 14, color: AppColors.yogaAmber),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    "Clinical Rationale: ${item.rationale}",
                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 11),
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
