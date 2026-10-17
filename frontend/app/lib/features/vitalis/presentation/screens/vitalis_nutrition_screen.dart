import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisNutritionScreen extends ConsumerStatefulWidget {
  const VitalisNutritionScreen({super.key});

  @override
  ConsumerState<VitalisNutritionScreen> createState() => _VitalisNutritionScreenState();
}

class _VitalisNutritionScreenState extends ConsumerState<VitalisNutritionScreen> {
  String _selectedCategory = "All";
  final String _searchQuery = "";

  final List<Map<String, dynamic>> _indianFoods = [
    {
      "name": "Makhana (Fox Nuts) Roasted",
      "category": "Snacks & Seeds",
      "serving": "30g (1 bowl)",
      "protein": "3.0g",
      "fiber": "4.2g",
      "benefits": "Low glycemic index, rich in magnesium and anti-oxidants kaempferol.",
      "caution": "Avoid heavy commercial palm oil frying; roast dry with ghee/turmeric.",
      "icmrCategory": "Nuts & Seeds",
    },
    {
      "name": "Moong Dal (Yellow / Green)",
      "category": "Pulses & Legumes",
      "serving": "1 bowl cooked (150g)",
      "protein": "7.2g",
      "fiber": "4.8g",
      "benefits": "High digestibility, complete amino-acid complement when paired with brown rice.",
      "caution": "Sprouting increases bioavailable folate and reduces phytate anti-nutrients.",
      "icmrCategory": "Pulses",
    },
    {
      "name": "Sattu (Roasted Gram Flour)",
      "category": "Traditional Protein",
      "serving": "40g (2 tbsp in water/buttermilk)",
      "protein": "8.5g",
      "fiber": "5.6g",
      "benefits": "Indigenous plant protein source, cooling thermal profile, low GI satiety.",
      "caution": "High potassium; monitor in stage 3+ chronic kidney disease.",
      "icmrCategory": "Pulses",
    },
    {
      "name": "Paneer (Low-Fat) / Tofu",
      "category": "Vegetarian Protein",
      "serving": "100g",
      "protein": "18.0g",
      "fiber": "0.5g",
      "benefits": "Dense bioavailable protein and calcium for musculoskeletal preservation.",
      "caution": "Standard buffalo paneer is high in saturated fat; prefer cow milk or tofu for dyslipidemia.",
      "icmrCategory": "Dairy / Soy",
    },
    {
      "name": "Sprouted Chana (Bengal Gram)",
      "category": "Pulses & Legumes",
      "serving": "100g",
      "protein": "8.9g",
      "fiber": "7.6g",
      "benefits": "Highest polyphenol & slow-digesting complex carbohydrate profile.",
      "caution": "Ensure proper hygiene during sprouting to prevent microbial contamination.",
      "icmrCategory": "Pulses",
    },
    {
      "name": "Flaxseeds & Sesame Laddu (Jaggery Base)",
      "category": "Snacks & Seeds",
      "serving": "1 small piece (25g)",
      "protein": "3.5g",
      "fiber": "3.1g",
      "benefits": "Alpha-linolenic acid (plant omega-3), lignans for cardiovascular health.",
      "caution": "Limit to 1 daily if managing insulin resistance or caloric surplus.",
      "icmrCategory": "Oilseeds",
    },
    {
      "name": "Ragi (Finger Millet) Dosa / Roti",
      "category": "Millets & Grains",
      "serving": "2 medium rotis",
      "protein": "4.6g",
      "fiber": "6.8g",
      "benefits": "Highest calcium among cereals (344mg/100g), excellent bone mineral support.",
      "caution": "Contains goitrogens; ensure adequate dietary iodine if hypothyroid.",
      "icmrCategory": "Millets",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);
    final categories = ["All", "Pulses & Legumes", "Vegetarian Protein", "Snacks & Seeds", "Millets & Grains", "Traditional Protein"];

    final filteredFoods = _indianFoods.where((food) {
      final matchesCategory = _selectedCategory == "All" || food["category"] == _selectedCategory;
      final matchesSearch = _searchQuery.isEmpty ||
          food["name"].toString().toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Indian Nutrition Intelligence"),
        backgroundColor: AppColors.surface,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: AppColors.vitalisTeal),
            onPressed: () {
              VitalisExplainabilitySheet.show(
                context,
                title: "Nutrition & Metabolic Healthspan",
                description:
                    "Nutrition recommendations in AyuSetu Vitalis are derived from ICMR-NIN 2024 Dietary Guidelines for Indians. We prioritize adequate protein, dietary fiber, and micronutrient status (B12, Vitamin D, Ferritin) while avoiding hyper-processed foods.",
                algorithmName: "V13 Preventive Eligibility & Nutrition Rules",
                version: "1.0.0",
                evidenceSource: "ICMR-National Institute of Nutrition (2024), WHO Healthy Diet Fact Sheet #394",
                evidenceLevel: "Guideline Consensus",
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
            _buildDietProfileCard(state),
            const SizedBox(height: 20),
            _buildCategoryFilter(categories),
            const SizedBox(height: 16),
            Text(
              "Evidence-Grounded Indian Food Database (${filteredFoods.length})",
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            for (final food in filteredFoods) _buildFoodCard(food),
            const SizedBox(height: 24),
            _buildMicronutrientAlerts(),
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
              "Nutritional suggestions do not replace medical nutrition therapy for diagnosed conditions (e.g. chronic kidney disease, gestational diabetes, severe dyslipidemia).",
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDietProfileCard(VitalisState state) {
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
                  "Metabolic Intake Goals",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  "ICMR Guidelines 2024",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.vitalisTeal),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Row(
            children: [
              Expanded(
                child: _NutrientTarget(
                  label: "Target Protein",
                  value: "0.8 - 1.2",
                  unit: "g/kg body weight",
                  note: "Safely adjusted for renal risk",
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: _NutrientTarget(
                  label: "Dietary Fiber",
                  value: "30 - 35",
                  unit: "grams / day",
                  note: "Pulses, millets, veggies",
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryFilter(List<String> categories) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: categories.map((cat) {
          final isSelected = cat == _selectedCategory;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(cat),
              selected: isSelected,
              selectedColor: AppColors.vitalisTeal,
              backgroundColor: AppColors.surfaceElevated,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : AppColors.textSecondary,
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
              onSelected: (selected) {
                if (selected) setState(() => _selectedCategory = cat);
              },
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildFoodCard(Map<String, dynamic> food) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
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
                child: Text(
                  food["name"],
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  food["icmrCategory"],
                  style: const TextStyle(fontSize: 10, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Wrap(
            spacing: 12,
            runSpacing: 4,
            children: [
              Text("Serving: ${food["serving"]}", style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              Text("Protein: ${food["protein"]}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.vitalisTeal)),
              Text("Fiber: ${food["fiber"]}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.ayushGreen)),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            food["benefits"],
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
          ),
          const SizedBox(height: 6),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.tips_and_updates_outlined, size: 14, color: AppColors.warning),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  food["caution"],
                  style: const TextStyle(fontSize: 11, color: AppColors.warning, height: 1.3),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMicronutrientAlerts() {
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
          Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: AppColors.warning, size: 20),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Vegetarian Healthspan Watchpoints",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          SizedBox(height: 10),
          Text(
            "Over 70% of urban Indian vegetarians present with sub-clinical Vitamin B12 and Vitamin D3 deficiency. If fatigue or paresthesia develops, request serum B12 and 25-OH Vitamin D screening from your physician.",
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
          ),
        ],
      ),
    );
  }
}

class _NutrientTarget extends StatelessWidget {
  final String label;
  final String value;
  final String unit;
  final String note;

  const _NutrientTarget({
    required this.label,
    required this.value,
    required this.unit,
    required this.note,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
          Text(unit, style: const TextStyle(fontSize: 10, color: AppColors.vitalisTeal, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          Text(note, style: const TextStyle(fontSize: 9, color: AppColors.textMuted)),
        ],
      ),
    );
  }
}
