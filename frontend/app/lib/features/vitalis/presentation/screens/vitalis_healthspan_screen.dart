import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisHealthspanScreen extends ConsumerWidget {
  const VitalisHealthspanScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final hpi = state.hpiResult;
    final hasScore = hpi.hpiScore != null;

    return AppScaffoldShell(
      title: "Healthspan Progress Index (HPI)",
      subtitle: "Deterministic 8-Domain Behavioral Analytics",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.vitalisTeal.withValues(alpha: 0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("Composite Score", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                            const SizedBox(height: 4),
                            Text(
                              hasScore ? "${hpi.hpiScore} / 100" : "Insufficient Data",
                              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      TextButton.icon(
                        onPressed: () {
                          showModalBottomSheet(
                            context: context,
                            backgroundColor: Colors.transparent,
                            isScrollControlled: true,
                            builder: (_) => const VitalisExplainabilitySheet(
                              title: "Healthspan Progress Index (HPI)",
                              algorithmId: "V1-HPI-2026.1",
                              methodology: "HPI = Σ(w_i * s_i) / Σ(w_i) over observed domains. Evaluates verified behavioral tracking data without statistical age imputation. Minimum 40% stream coverage required.",
                              inputsUsed: ["Daily steps", "Resting heart rate", "Sleep duration & schedule consistency", "Dietary pulse & protein ratio", "Biomarker records (HbA1c/BP)", "Preventive screening schedule"],
                              limitations: [
                                "Behavioral progress tracking only.",
                                "Does NOT predict years of life gained or biological age.",
                                "Missing domains are omitted, never hallucinated.",
                              ],
                              evidenceCitations: [
                                "AHA Life's Essential 8 (Circulation 2022)",
                                "WHO Guidelines on Physical Activity (2020)",
                                "ICMR Dietary Guidelines for Indians (2024)",
                              ],
                            ),
                          );
                        },
                        icon: const Icon(Icons.info_outline, size: 16),
                        label: const Text("Formula"),
                        style: TextButton.styleFrom(
                          foregroundColor: AppColors.vitalisTeal,
                          visualDensity: VisualDensity.compact,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Expanded(
                        child: Text(
                          "Data Coverage & Completeness",
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                        ),
                      ),
                      Text(
                        "${(hpi.coverage * 100).toInt()}%",
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.vitalisTeal),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  LinearProgressIndicator(
                    value: hpi.coverage,
                    backgroundColor: AppColors.surfaceElevated,
                    valueColor: const AlwaysStoppedAnimation<Color>(AppColors.vitalisTeal),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              "Domain Breakdown & Component Weights",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 12),
            for (final d in hpi.domains)
              Container(
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
                            d.title,
                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: d.observed
                                ? AppColors.vitalisTeal.withValues(alpha: 0.15)
                                : AppColors.surfaceElevated,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            d.observed ? "${d.score}/100" : "Unobserved",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: d.observed ? AppColors.vitalisTeal : AppColors.textMuted,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      d.rationale,
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      "Algorithm Component Weight: ${d.weight}x",
                      style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
