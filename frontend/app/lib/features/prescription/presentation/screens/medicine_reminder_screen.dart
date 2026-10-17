import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
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
      child: RefreshIndicator(
        color: AppColors.primary,
        onRefresh: () => notifier.loadPrescription(),
        child: LayoutBuilder(
          builder: (context, constraints) {
            if (state.isLoading) {
              return const Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              );
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
                padding: const EdgeInsets.all(20),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 5,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (state.doctorAdvice != null)
                            DoctorAdviceCard(advice: state.doctorAdvice!),
                          const SizedBox(height: 16),
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
                    const SizedBox(width: 20),
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
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                  if (state.doctorAdvice != null)
                    DoctorAdviceCard(advice: state.doctorAdvice!),
                  const SizedBox(height: 20),
                  _buildTimelineSection(context, ref, state),
                ],
              ),
            );
          },
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
          for (final med in state.morningMedicines)
            MedicineCard(
              medicine: med,
              onToggleTaken: (_) =>
                  ref.read(prescriptionProvider.notifier).toggleTaken(med.id),
              onToggleReminder: (_) => ref
                  .read(prescriptionProvider.notifier)
                  .toggleReminder(med.id),
            ),
          const SizedBox(height: 16),
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
          for (final med in state.afternoonMedicines)
            MedicineCard(
              medicine: med,
              onToggleTaken: (_) =>
                  ref.read(prescriptionProvider.notifier).toggleTaken(med.id),
              onToggleReminder: (_) => ref
                  .read(prescriptionProvider.notifier)
                  .toggleReminder(med.id),
            ),
          const SizedBox(height: 16),
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
          for (final med in state.nightMedicines)
            MedicineCard(
              medicine: med,
              onToggleTaken: (_) =>
                  ref.read(prescriptionProvider.notifier).toggleTaken(med.id),
              onToggleReminder: (_) => ref
                  .read(prescriptionProvider.notifier)
                  .toggleReminder(med.id),
            ),
          const SizedBox(height: 16),
        ],
      ],
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

    return Row(
      children: [
        Icon(slot.icon, size: 18, color: AppColors.primaryLight),
        const SizedBox(width: 6),
        Flexible(
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        const SizedBox(width: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            slot.label.split("(").last.replaceAll(")", ""),
            style: const TextStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.w600,
              color: AppColors.textMuted,
            ),
          ),
        ),
        const Spacer(),
        if (!allDone) ...[
          const SizedBox(width: 4),
          TextButton.icon(
            style: TextButton.styleFrom(
              visualDensity: VisualDensity.compact,
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            ),
            icon: const Icon(Icons.done_all_rounded,
                size: 14, color: AppColors.primaryLight),
            label: const Text(
              AppStrings.markSlotDone,
              style: TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                color: AppColors.primaryLight,
              ),
            ),
            onPressed: () =>
                ref.read(prescriptionProvider.notifier).markSlotDone(slot),
          ),
        ],
      ],
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
                color: AppColors.error, size: 48),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textSecondary, fontSize: 13),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              onPressed: () => notifier.loadPrescription(),
              child: const Text(AppStrings.retryButton,
                  style: TextStyle(color: Colors.white)),
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
                color: AppColors.textMuted, size: 54),
            SizedBox(height: 14),
            Text(
              AppStrings.emptyPrescriptionTitle,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 6),
            Text(
              AppStrings.emptyPrescriptionDesc,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
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
