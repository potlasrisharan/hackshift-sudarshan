import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
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
    final bgColor = isEmergency ? AppColors.error.withValues(alpha: 0.15) : AppColors.warning.withValues(alpha: 0.15);
    final borderColor = isEmergency ? AppColors.error : AppColors.warning;
    final iconColor = isEmergency ? AppColors.error : AppColors.warning;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                isEmergency ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
                color: iconColor,
                size: 22,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  isEmergency ? "URGENT CLINICAL EVALUATION SUGGESTED" : "SAFETY CONSTRAINT ACTIVE",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: iconColor,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 18, color: AppColors.textSecondary),
                onPressed: onDismiss,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            alert.reason,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
              height: 1.3,
            ),
          ),
          if (alert.emergencyGuidance != null) ...[
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.background.withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                alert.emergencyGuidance!,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
          ],
          if (alert.ruleId != null) ...[
            const SizedBox(height: 6),
            Text(
              "Deterministic Rule: ${alert.ruleId}",
              style: const TextStyle(
                fontSize: 11,
                color: AppColors.textMuted,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
