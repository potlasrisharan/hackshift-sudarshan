import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/her_provider.dart";

class HerDoctorSummaryScreen extends ConsumerWidget {
  const HerDoctorSummaryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(herProvider);
    final summary = state.doctorSummary;

    return AppScaffoldShell(
      title: "Doctor-Ready Clinical Summary",
      subtitle: "Consent-Gated Clinical Consultation Packet",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Consent & Privacy Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.secondary.withValues(alpha: 0.4)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.lock_clock, color: AppColors.secondary, size: 24),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Patient-Controlled Sharing",
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "Generate a secure, time-limited summary link for your OB/GYN or endocrinologist. You can revoke access at any second.",
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            if (summary == null)
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.secondary,
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.share, color: Colors.white),
                label: const Text(
                  "Generate Clinical Summary Packet",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                onPressed: () => ref.read(herProvider.notifier).generateDoctorSummary(),
              )
            else
              _buildSummaryDetailsCard(context, ref, summary),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryDetailsCard(BuildContext context, WidgetRef ref, dynamic summary) {
    final isRevoked = summary.isRevoked as bool;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isRevoked ? AppColors.error : AppColors.success,
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isRevoked ? Icons.cancel : Icons.check_circle,
                color: isRevoked ? AppColors.error : AppColors.success,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  isRevoked ? "Access Revoked" : "Active Clinical Share Link",
                  style: TextStyle(
                    color: isRevoked ? AppColors.error : AppColors.success,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              if (!isRevoked)
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.error,
                    side: const BorderSide(color: AppColors.error),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    minimumSize: Size.zero,
                  ),
                  onPressed: () => ref.read(herProvider.notifier).revokeDoctorSummary(),
                  child: const Text("Revoke Access", style: TextStyle(fontSize: 11)),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const AyuSetuLogoBadge(
                  height: 16,
                  padding: EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "https://ayusetu.care/summary/${summary.shareToken}",
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 12,
                      fontFamily: "monospace",
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            "Packet Contents Included:",
            style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          const Text("• Chronological menstrual cycle interval statistics", style: TextStyle(color: AppColors.textPrimary, fontSize: 12)),
          const Text("• Deterministic screening findings with supporting evidence", style: TextStyle(color: AppColors.textPrimary, fontSize: 12)),
          const Text("• 90-day pelvic symptom log distribution", style: TextStyle(color: AppColors.textPrimary, fontSize: 12)),
          const Text("• Basal biometric telemetry (resting HR & sleep duration)", style: TextStyle(color: AppColors.textPrimary, fontSize: 12)),
          const SizedBox(height: 14),
          if (isRevoked)
            const Text(
              "Note: This token is permanently deactivated and can no longer be accessed by any provider.",
              style: TextStyle(color: AppColors.error, fontSize: 11),
            )
          else
            const Text(
              "Valid for 7 days. End-to-end encrypted under Indian Personal Data Protection standards.",
              style: TextStyle(color: AppColors.textMuted, fontSize: 11),
            ),
        ],
      ),
    );
  }
}
