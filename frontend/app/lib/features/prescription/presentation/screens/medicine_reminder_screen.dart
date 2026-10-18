import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../data/models/prescription_models.dart";
import "../providers/prescription_provider.dart";
import "../widgets/adherence_summary_card.dart";
import "../widgets/doctor_advice_card.dart";
import "../widgets/medicine_card.dart";
import "../widgets/reminder_settings_sheet.dart";

class MedicineReminderScreen extends ConsumerWidget {
  const MedicineReminderScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(prescriptionProvider);
    final notifier = ref.read(prescriptionProvider.notifier);

    return AppScaffoldShell(
      title: AppStrings.prescriptionHeader,
      subtitle: AppStrings.prescriptionSubtitle,
      child: Container(
        color: const Color(0xFFF8FAFC),
        width: double.infinity,
        height: double.infinity,
        child: RefreshIndicator(
          color: const Color(0xFF087D71),
          onRefresh: () => notifier.loadPrescription(),
          child: LayoutBuilder(
            builder: (context, constraints) {
              if (state.isLoading) {
                return const _MedicineReminderSkeletonLoader();
              }

              if (state.errorMessage != null) {
                return _buildErrorState(context, state.errorMessage!, notifier);
              }

              if (state.medicines.isEmpty) {
                return _buildEmptyState(context);
              }

              final isWide = constraints.maxWidth >= 720;

              if (isWide) {
                return SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(24),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        flex: 5,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (state.doctorAdvice != null) ...[
                              DoctorAdviceCard(advice: state.doctorAdvice!),
                              const SizedBox(height: 16),
                            ],
                            AdherenceSummaryCard(
                              takenCount: state.takenCount,
                              totalCount: state.totalCount,
                              streakDays: state.streakDays,
                              progress: state.adherenceProgress,
                              onConfigureRoutine: () =>
                                  _openRoutineSheet(context, ref),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 24),
                      Expanded(
                        flex: 6,
                        child: _buildTimelineSection(context, ref, state),
                      ),
                    ],
                  ),
                );
              }

              // Mobile Single Column
              return SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    AdherenceSummaryCard(
                      takenCount: state.takenCount,
                      totalCount: state.totalCount,
                      streakDays: state.streakDays,
                      progress: state.adherenceProgress,
                      onConfigureRoutine: () => _openRoutineSheet(context, ref),
                    ),
                    const SizedBox(height: 16),
                    if (state.doctorAdvice != null) ...[
                      DoctorAdviceCard(advice: state.doctorAdvice!),
                      const SizedBox(height: 20),
                    ],
                    _buildTimelineSection(context, ref, state),
                  ],
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildTimelineSection(
      BuildContext context, WidgetRef ref, PrescriptionState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (state.morningMedicines.isNotEmpty) ...[
          _buildSlotHeader(
            context,
            ref,
            slot: MedicineTimeSlot.morning,
            title: AppStrings.morningSlotTitle,
            medicines: state.morningMedicines,
          ),
          const SizedBox(height: 8),
          for (final med in state.morningMedicines) ...[
            _buildMedicineCard(context, ref, med),
            const SizedBox(height: 10),
          ],
          const SizedBox(height: 12),
        ],
        if (state.afternoonMedicines.isNotEmpty) ...[
          _buildSlotHeader(
            context,
            ref,
            slot: MedicineTimeSlot.afternoon,
            title: AppStrings.afternoonSlotTitle,
            medicines: state.afternoonMedicines,
          ),
          const SizedBox(height: 8),
          for (final med in state.afternoonMedicines) ...[
            _buildMedicineCard(context, ref, med),
            const SizedBox(height: 10),
          ],
          const SizedBox(height: 12),
        ],
        if (state.nightMedicines.isNotEmpty) ...[
          _buildSlotHeader(
            context,
            ref,
            slot: MedicineTimeSlot.night,
            title: AppStrings.nightSlotTitle,
            medicines: state.nightMedicines,
          ),
          const SizedBox(height: 8),
          for (final med in state.nightMedicines) ...[
            _buildMedicineCard(context, ref, med),
            const SizedBox(height: 10),
          ],
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  Widget _buildMedicineCard(
      BuildContext context, WidgetRef ref, MedicineItem med) {
    return MedicineCard(
      medicine: med,
      onToggleTaken: (newVal) {
        ref.read(prescriptionProvider.notifier).toggleTaken(med.id);
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(
                  newVal == true
                      ? Icons.check_circle_rounded
                      : Icons.history_rounded,
                  color: Colors.white,
                  size: 18,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    newVal == true
                        ? "Dose recorded · Backend synced (${med.name})"
                        : "Dose unmarked · Backend synced (${med.name})",
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF0F172A),
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 2),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      },
      onToggleReminder: (enabled) {
        ref.read(prescriptionProvider.notifier).toggleReminder(med.id);
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                Icon(
                  enabled
                      ? Icons.notifications_active_rounded
                      : Icons.notifications_off_rounded,
                  color: Colors.white,
                  size: 18,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    enabled
                        ? "Reminder set for ${med.name} (${med.scheduledTime})"
                        : "Reminder paused for ${med.name}",
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF0F172A),
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 2),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSlotHeader(
    BuildContext context,
    WidgetRef ref, {
    required MedicineTimeSlot slot,
    required String title,
    required List<MedicineItem> medicines,
  }) {
    final allDone = medicines.every((m) => m.isTaken);

    return Container(
      margin: const EdgeInsets.only(bottom: 8, top: 4),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE6F7F2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(slot.icon, size: 16, color: const Color(0xFF087D71)),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F172A),
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        slot.label.split("(").last.replaceAll(")", ""),
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 6),
          if (!allDone) ...[
            TextButton.icon(
              style: TextButton.styleFrom(
                minimumSize: const Size(48, 48),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                backgroundColor: const Color(0xFFE6F7F2),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              icon: const Icon(Icons.done_all_rounded,
                  size: 14, color: Color(0xFF087D71)),
              label: const Text(
                AppStrings.markSlotDone,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF087D71),
                ),
              ),
              onPressed: () {
                ref.read(prescriptionProvider.notifier).markSlotDone(slot);
                ScaffoldMessenger.of(context).hideCurrentSnackBar();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Row(
                      children: [
                        const Icon(Icons.done_all_rounded, color: Colors.white, size: 18),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "All ${slot.name} doses recorded · Backend synced",
                            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                    backgroundColor: const Color(0xFF087D71),
                    behavior: SnackBarBehavior.floating,
                    duration: const Duration(seconds: 2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                );
              },
            ),
          ] else ...[
            Container(
              constraints: const BoxConstraints(minHeight: 48),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF86EFAC)),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.check_circle_rounded, size: 14, color: Color(0xFF16A34A)),
                  SizedBox(width: 4),
                  Text(
                    "All Taken",
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF16A34A),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildErrorState(
      BuildContext context, String message, PrescriptionNotifier notifier) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline_rounded,
                color: Color(0xFFDC2626), size: 48),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFF475569), fontSize: 13),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(120, 48),
                backgroundColor: const Color(0xFF087D71),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () => notifier.loadPrescription(),
              child: const Text(AppStrings.retryButton,
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: const [
            Icon(Icons.medication_liquid_rounded,
                color: Color(0xFF94A3B8), size: 54),
            SizedBox(height: 14),
            Text(
              AppStrings.emptyPrescriptionTitle,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 6),
            Text(
              AppStrings.emptyPrescriptionDesc,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
          ],
        ),
      ),
    );
  }

  void _openRoutineSheet(BuildContext context, WidgetRef ref) {
    final currentRoutine = ref.read(prescriptionProvider).routine;
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ReminderSettingsSheet(
        currentRoutine: currentRoutine,
        onSave: (updated) =>
            ref.read(prescriptionProvider.notifier).updateRoutine(updated),
      ),
    );
  }
}

class _MedicineReminderSkeletonLoader extends StatefulWidget {
  const _MedicineReminderSkeletonLoader();

  @override
  State<_MedicineReminderSkeletonLoader> createState() =>
      _MedicineReminderSkeletonLoaderState();
}

class _MedicineReminderSkeletonLoaderState
    extends State<_MedicineReminderSkeletonLoader>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;
  late final Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.4, end: 0.95).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  Widget _buildBox({
    required double width,
    required double height,
    double radius = 6,
  }) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFFE2E8F0),
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }

  Widget _buildSkeletonCard({required Widget child, EdgeInsets? padding}) {
    return Container(
      padding: padding ?? const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _buildMedicineCardSkeleton() {
    return _buildSkeletonCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: const BoxDecoration(
                  color: Color(0xFFE2E8F0),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildBox(width: 130, height: 16),
                    const SizedBox(height: 6),
                    _buildBox(width: 80, height: 11),
                  ],
                ),
              ),
              _buildBox(width: 54, height: 22, radius: 6),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: _buildBox(width: double.infinity, height: 12),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildBox(width: 140, height: 22, radius: 6),
              _buildBox(width: 80, height: 26, radius: 8),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Opacity(
          opacity: _pulseAnimation.value,
          child: child,
        );
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Adherence summary card skeleton
            _buildSkeletonCard(
              child: Row(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: const BoxDecoration(
                      color: Color(0xFFE2E8F0),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildBox(width: 150, height: 18),
                        const SizedBox(height: 8),
                        _buildBox(width: 100, height: 12),
                        const SizedBox(height: 10),
                        _buildBox(width: double.infinity, height: 8, radius: 4),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Doctor advice card skeleton
            _buildSkeletonCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 36,
                        height: 36,
                        decoration: BoxDecoration(
                          color: const Color(0xFFE2E8F0),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildBox(width: 140, height: 14),
                          const SizedBox(height: 6),
                          _buildBox(width: 190, height: 11),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildBox(width: double.infinity, height: 12),
                  const SizedBox(height: 6),
                  _buildBox(width: 220, height: 12),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // Slot header skeleton
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildBox(width: 140, height: 32, radius: 10),
                _buildBox(width: 90, height: 32, radius: 8),
              ],
            ),
            const SizedBox(height: 12),
            _buildMedicineCardSkeleton(),
            const SizedBox(height: 12),
            _buildMedicineCardSkeleton(),
          ],
        ),
      ),
    );
  }
}
