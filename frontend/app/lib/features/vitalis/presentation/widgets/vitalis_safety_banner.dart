import "package:flutter/material.dart";
import "../../data/models/vitalis_models.dart";

class VitalisSafetyBanner extends StatelessWidget {
  final VitalisSafetyAlertModel alert;
  final VoidCallback onDismiss;

  const VitalisSafetyBanner({
    super.key,
    required this.alert,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final isEmergency = alert.decision == "URGENT_EVALUATION";
    final bgColor = isEmergency ? const Color(0xFFFEF2F2) : const Color(0xFFFFFBEB);
    final borderColor = isEmergency ? const Color(0xFFFCA5A5) : const Color(0xFFFDE68A);
    final iconColor = isEmergency ? const Color(0xFFDC2626) : const Color(0xFFD97706);
    final headingColor = isEmergency ? const Color(0xFFB91C1C) : const Color(0xFFB45309);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
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
                decoration: BoxDecoration(
                  color: iconColor.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isEmergency ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
                  color: iconColor,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  isEmergency ? "URGENT CLINICAL EVALUATION SUGGESTED" : "SAFETY CONSTRAINT ACTIVE",
                  style: TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: headingColor,
                    letterSpacing: 0.4,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 18, color: Color(0xFF64748B)),
                onPressed: onDismiss,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            alert.reason,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1E293B),
              height: 1.35,
            ),
          ),
          if (alert.emergencyGuidance != null) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: borderColor),
              ),
              child: Text(
                alert.emergencyGuidance!,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: headingColor,
                  height: 1.3,
                ),
              ),
            ),
          ],
          if (alert.ruleId != null) ...[
            const SizedBox(height: 8),
            Text(
              "Deterministic Rule: ${alert.ruleId}",
              style: const TextStyle(
                fontSize: 11,
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
