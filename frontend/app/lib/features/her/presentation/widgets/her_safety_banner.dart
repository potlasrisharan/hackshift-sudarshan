import "package:flutter/material.dart";
import "../../data/models/her_models.dart";

class HerSafetyBanner extends StatelessWidget {
  final SafetyCheckResultModel alert;
  final VoidCallback onDismiss;

  const HerSafetyBanner({
    super.key,
    required this.alert,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF1F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE11D48), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFE11D48).withValues(alpha: 0.15),
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
              const Icon(Icons.warning_amber_rounded, color: Color(0xFFE11D48), size: 24),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  "URGENT CLINICAL REVIEW SUGGESTED",
                  style: TextStyle(
                    color: Color(0xFF9F1239),
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Color(0xFF9F1239), size: 18),
                onPressed: onDismiss,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            alert.emergencyGuidance ??
                "Reported acute symptoms warrant prompt medical review at an emergency clinic or gynecological center.",
            style: const TextStyle(
              color: Color(0xFF0F172A),
              fontSize: 13,
              fontWeight: FontWeight.w500,
              height: 1.4,
            ),
          ),
          if (alert.evidence.isNotEmpty) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              runSpacing: 4,
              children: alert.evidence.map((e) {
                return Chip(
                  label: Text(
                    e,
                    style: const TextStyle(color: Color(0xFF9F1239), fontSize: 11, fontWeight: FontWeight.w600),
                  ),
                  backgroundColor: const Color(0xFFFCE7EC),
                  side: const BorderSide(color: Color(0xFFFDA4AF)),
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                );
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }
}
