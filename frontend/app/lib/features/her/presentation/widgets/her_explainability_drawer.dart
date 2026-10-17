import "package:flutter/material.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../data/models/her_models.dart";

class HerExplainabilitySheet extends StatelessWidget {
  final HerScreeningFindingModel finding;

  const HerExplainabilitySheet({super.key, required this.finding});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 5,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: const Color(0xFFFDA4AF),
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
            Row(
              children: [
                const Icon(Icons.info_outline, color: Color(0xFFE11D48), size: 24),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    finding.title,
                    style: const TextStyle(
                      color: Color(0xFF9F1239),
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                const AyuSetuLogoBadge(height: 18),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFCE7EC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFFDA4AF)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.verified_user_outlined, color: Color(0xFFE11D48), size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Deterministic Algorithm ${finding.ruleVersion} (Not an autonomous diagnosis)",
                      style: const TextStyle(
                        color: Color(0xFF9F1239),
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Clinical Rationale",
              style: TextStyle(
                color: Color(0xFF9F1239),
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              finding.rationale,
              style: const TextStyle(
                color: Color(0xFF475569),
                fontSize: 13,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Supporting Evidence Gathered",
              style: TextStyle(
                color: Color(0xFF9F1239),
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            if (finding.supportingEvidence.isEmpty)
              const Text("No abnormal features logged.", style: TextStyle(color: Color(0xFF64748B), fontSize: 13))
            else
              ...finding.supportingEvidence.map(
                (e) => Padding(
                  padding: const EdgeInsets.only(bottom: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        e.verified ? Icons.check_circle : Icons.radio_button_checked,
                        size: 16,
                        color: e.verified ? const Color(0xFF059669) : const Color(0xFFE11D48),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "${e.label} (${e.verified ? 'Verified Lab' : 'Patient Log'})",
                          style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 16),
            const Text(
              "Missing Diagnostic Information",
              style: TextStyle(
                color: Color(0xFFD97706),
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ...finding.missingInformation.map(
              (m) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  children: [
                    const Icon(Icons.help_outline, size: 14, color: Color(0xFFD97706)),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        m,
                        style: const TextStyle(color: Color(0xFF475569), fontSize: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Known Limitations",
              style: TextStyle(
                color: Color(0xFF64748B),
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            ...finding.limitations.map(
              (l) => Text("• $l", style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE11D48),
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 2,
              ),
              onPressed: () => Navigator.pop(context),
              child: const Text("Understood", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}
