import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";

class VitalisExplainabilitySheet extends StatelessWidget {
  final String title;
  final String algorithmId;
  final String methodology;
  final List<String> inputsUsed;
  final List<String> limitations;
  final List<String> evidenceCitations;

  const VitalisExplainabilitySheet({
    super.key,
    required this.title,
    required this.algorithmId,
    required this.methodology,
    required this.inputsUsed,
    required this.limitations,
    required this.evidenceCitations,
  });

  static void show(
    BuildContext context, {
    required String title,
    String? description,
    String? algorithmName,
    String? algorithmId,
    String? version,
    String? evidenceSource,
    String? evidenceLevel,
    String? methodology,
    List<String>? inputsUsed,
    List<String>? limitations,
    List<String>? evidenceCitations,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => VitalisExplainabilitySheet(
        title: title,
        algorithmId: algorithmId ?? algorithmName ?? "VITALIS-ALGO",
        methodology: methodology ?? description ?? "",
        inputsUsed: inputsUsed ?? const [],
        limitations: limitations ?? const [],
        evidenceCitations: evidenceCitations ?? (evidenceSource != null ? [evidenceSource] : const []),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: AppColors.textSecondary),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                "Deterministic Algorithm: $algorithmId",
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.vitalisTeal,
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Calculation Methodology",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 6),
            Text(
              methodology,
              style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.4),
            ),
            const SizedBox(height: 16),
            const Text(
              "Inputs & Observations Evaluated",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            for (final inp in inputsUsed)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("• ", style: TextStyle(color: AppColors.vitalisTeal, fontWeight: FontWeight.bold)),
                    Expanded(
                      child: Text(
                        inp,
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            const Text(
              "Clinical Limitations & Boundaries",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            for (final lim in limitations)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("⚠️ ", style: TextStyle(fontSize: 11)),
                    Expanded(
                      child: Text(
                        lim,
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ),
                  ],
                ),
              ),
            const SizedBox(height: 16),
            const Text(
              "Evidence Citations",
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            for (final cite in evidenceCitations)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  "📖 $cite",
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}
