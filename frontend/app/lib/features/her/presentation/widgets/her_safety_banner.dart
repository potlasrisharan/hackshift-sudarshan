import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
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
        color: AppColors.error.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.error, width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 24),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  "URGENT CLINICAL REVIEW SUGGESTED",
                  style: TextStyle(
                    color: AppColors.error,
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: AppColors.textSecondary, size: 18),
                onPressed: onDismiss,
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            alert.emergencyGuidance ??
                "Reported acute symptoms warrant prompt medical review at an emergency clinic or gynecological center.",
            style: const TextStyle(
              color: AppColors.textPrimary,
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
                    style: const TextStyle(color: AppColors.textPrimary, fontSize: 11),
                  ),
                  backgroundColor: AppColors.surfaceElevated,
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
