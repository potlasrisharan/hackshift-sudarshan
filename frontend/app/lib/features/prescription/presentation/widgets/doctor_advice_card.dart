import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../data/models/prescription_models.dart";

class DoctorAdviceCard extends StatefulWidget {
  final DoctorAdvice advice;

  const DoctorAdviceCard({super.key, required this.advice});

  @override
  State<DoctorAdviceCard> createState() => _DoctorAdviceCardState();
}

class _DoctorAdviceCardState extends State<DoctorAdviceCard> {
  bool _isExpanded = true;

  @override
  Widget build(BuildContext context) {
    final advice = widget.advice;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppColors.ayushGreen.withValues(alpha: 0.4),
          width: 1.2,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.ayushGreen.withValues(alpha: 0.08),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.ayushGreen.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.medical_services_rounded,
                    color: AppColors.ayushGreen,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              advice.doctorName,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.ayushGreen,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              "AYUSH VERIFIED",
                              style: TextStyle(
                                fontSize: 8.5,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        advice.specialty,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Text(
                        "${advice.hospital} · ${advice.opdRoom}",
                        style: const TextStyle(
                          fontSize: 10,
                          color: AppColors.textMuted,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(
                    _isExpanded
                        ? Icons.keyboard_arrow_up_rounded
                        : Icons.keyboard_arrow_down_rounded,
                    color: AppColors.textSecondary,
                  ),
                  onPressed: () => setState(() => _isExpanded = !_isExpanded),
                ),
              ],
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: AppColors.surfaceElevated),
                        ),
                        child: Text(
                          "${AppStrings.rxIdLabel}: ${advice.rxId}",
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primaryLight,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        "${AppStrings.validTillLabel}: ${advice.validTillDate}",
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                          fontWeight: FontWeight.w500,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),

                if (_isExpanded) ...[
                  const SizedBox(height: 14),
                  const Divider(color: AppColors.surfaceElevated, height: 1),
                  const SizedBox(height: 12),

                  const Text(
                    AppStrings.dietRestrictionsTitle,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.warning,
                      letterSpacing: 0.3,
                    ),
                  ),
                  const SizedBox(height: 6),
                  for (final restriction in advice.dietRestrictions)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("• ",
                              style: TextStyle(
                                  color: AppColors.warning, fontSize: 13)),
                          Expanded(
                            child: Text(
                              restriction,
                              style: const TextStyle(
                                fontSize: 11.5,
                                color: AppColors.textPrimary,
                                height: 1.3,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  const SizedBox(height: 10),

                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.vitalisTeal.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: AppColors.vitalisTeal.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.water_drop_rounded,
                            color: AppColors.vitalisTeal, size: 20),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                AppStrings.hydrationGoalTitle,
                                style: TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.vitalisTeal,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                advice.hydrationTarget,
                                style: const TextStyle(
                                  fontSize: 11.5,
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 10),

                  Row(
                    children: [
                      const Icon(Icons.event_available_rounded,
                          size: 16, color: AppColors.primaryLight),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text.rich(
                          TextSpan(
                            children: [
                              const TextSpan(
                                text: "${AppStrings.followUpScheduleTitle}: ",
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              TextSpan(
                                text: advice.followUpDate,
                                style: const TextStyle(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.primaryLight,
                                ),
                              ),
                            ],
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  Text(
                    advice.doctorNotes,
                    style: const TextStyle(
                      fontSize: 11,
                      fontStyle: FontStyle.italic,
                      color: AppColors.textSecondary,
                      height: 1.35,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
