import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
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
      child: Container(
        color: const Color(0xFFFFF1F3),
        width: double.infinity,
        height: double.infinity,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Consent & Privacy Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFFDA4AF)),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: const Row(
                  children: [
                    Icon(Icons.lock_clock, color: Color(0xFFE11D48), size: 26),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Patient-Controlled Sharing",
                            style: TextStyle(
                              color: Color(0xFF9F1239),
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          SizedBox(height: 3),
                          Text(
                            "Generate a secure, time-limited summary link for your OB/GYN or endocrinologist. You can revoke access at any second.",
                            style: TextStyle(color: Color(0xFF475569), fontSize: 12),
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
                    backgroundColor: const Color(0xFFE11D48),
                    minimumSize: const Size.fromHeight(48),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 2,
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
      ),
    );
  }

  Widget _buildSummaryDetailsCard(BuildContext context, WidgetRef ref, dynamic summary) {
    final isRevoked = summary.isRevoked as bool;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isRevoked ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isRevoked ? Icons.cancel : Icons.check_circle,
                color: isRevoked ? const Color(0xFFE11D48) : const Color(0xFF059669),
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  isRevoked ? "Access Revoked" : "Active Clinical Share Link",
                  style: TextStyle(
                    color: isRevoked ? const Color(0xFFE11D48) : const Color(0xFF059669),
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
                    foregroundColor: const Color(0xFFE11D48),
                    side: const BorderSide(color: Color(0xFFE11D48)),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    minimumSize: Size.zero,
                  ),
                  onPressed: () => ref.read(herProvider.notifier).revokeDoctorSummary(),
                  child: const Text("Revoke Access", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1F3),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFFDA4AF)),
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
                      color: Color(0xFF9F1239),
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      fontFamily: "monospace",
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            "Packet Contents Included:",
            style: TextStyle(color: Color(0xFF9F1239), fontSize: 13, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text("• Chronological menstrual cycle interval statistics", style: TextStyle(color: Color(0xFF0F172A), fontSize: 12)),
          const SizedBox(height: 4),
          const Text("• Deterministic screening findings with supporting evidence", style: TextStyle(color: Color(0xFF0F172A), fontSize: 12)),
          const SizedBox(height: 4),
          const Text("• 90-day pelvic symptom log distribution", style: TextStyle(color: Color(0xFF0F172A), fontSize: 12)),
          const SizedBox(height: 4),
          const Text("• Basal biometric telemetry (resting HR & sleep duration)", style: TextStyle(color: Color(0xFF0F172A), fontSize: 12)),
          const SizedBox(height: 14),
          if (isRevoked)
            const Text(
              "Note: This token is permanently deactivated and can no longer be accessed by any provider.",
              style: TextStyle(color: Color(0xFFE11D48), fontSize: 11),
            )
          else
            const Text(
              "Valid for 7 days. End-to-end encrypted under Indian Personal Data Protection standards.",
              style: TextStyle(color: Color(0xFF64748B), fontSize: 11),
            ),
        ],
      ),
    );
  }
}
