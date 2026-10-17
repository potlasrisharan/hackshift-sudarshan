import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../data/models/prescription_models.dart";

class MedicineCard extends StatelessWidget {
  final MedicineItem medicine;
  final ValueChanged<bool?> onToggleTaken;
  final ValueChanged<bool> onToggleReminder;

  const MedicineCard({
    super.key,
    required this.medicine,
    required this.onToggleTaken,
    required this.onToggleReminder,
  });

  @override
  Widget build(BuildContext context) {
    final isTaken = medicine.isTaken;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isTaken
            ? AppColors.surface.withValues(alpha: 0.6)
            : AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isTaken
              ? AppColors.success.withValues(alpha: 0.35)
              : AppColors.surfaceElevated,
          width: 1.2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                GestureDetector(
                  onTap: () => onToggleTaken(!isTaken),
                  child: Container(
                    width: 26,
                    height: 26,
                    margin: const EdgeInsets.only(top: 2, right: 12),
                    decoration: BoxDecoration(
                      color: isTaken ? AppColors.success : Colors.transparent,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: isTaken ? AppColors.success : AppColors.textMuted,
                        width: 2,
                      ),
                    ),
                    child: isTaken
                        ? const Icon(Icons.check_rounded, color: Colors.white, size: 16)
                        : null,
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              medicine.name,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: isTaken
                                    ? AppColors.textMuted
                                    : AppColors.textPrimary,
                                decoration:
                                    isTaken ? TextDecoration.lineThrough : null,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              medicine.strength,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppColors.primaryLight,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        medicine.dosageForm,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.background.withValues(alpha: 0.8),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded,
                      size: 14, color: AppColors.yogaAmber),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      medicine.instructions,
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.textPrimary,
                        height: 1.25,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.qr_code_2_rounded,
                          size: 13, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          "${AppStrings.batchLabel}: ${medicine.batchNumber} · ${AppStrings.expLabel}: ${medicine.expiryDate}",
                          style: const TextStyle(
                              fontSize: 10, color: AppColors.textMuted),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      medicine.reminderEnabled
                          ? Icons.notifications_active_rounded
                          : Icons.notifications_off_rounded,
                      size: 14,
                      color: medicine.reminderEnabled
                          ? AppColors.primaryLight
                          : AppColors.textMuted,
                    ),
                    const SizedBox(width: 4),
                    SizedBox(
                      height: 24,
                      width: 36,
                      child: Transform.scale(
                        scale: 0.75,
                        child: Switch(
                          value: medicine.reminderEnabled,
                          activeThumbColor: AppColors.primaryLight,
                          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          onChanged: onToggleReminder,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
