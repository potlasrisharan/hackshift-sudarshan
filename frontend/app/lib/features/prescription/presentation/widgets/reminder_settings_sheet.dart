import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../data/models/prescription_models.dart";

class ReminderSettingsSheet extends StatefulWidget {
  final ReminderRoutine currentRoutine;
  final ValueChanged<ReminderRoutine> onSave;

  const ReminderSettingsSheet({
    super.key,
    required this.currentRoutine,
    required this.onSave,
  });

  @override
  State<ReminderSettingsSheet> createState() => _ReminderSettingsSheetState();
}

class _ReminderSettingsSheetState extends State<ReminderSettingsSheet> {
  late TimeOfDay _morning;
  late TimeOfDay _afternoon;
  late TimeOfDay _night;
  late bool _sound;
  late bool _vibration;

  @override
  void initState() {
    super.initState();
    _morning = widget.currentRoutine.morningTime;
    _afternoon = widget.currentRoutine.afternoonTime;
    _night = widget.currentRoutine.nightTime;
    _sound = widget.currentRoutine.soundEnabled;
    _vibration = widget.currentRoutine.vibrationEnabled;
  }

  Future<void> _pickTime(
      BuildContext context, TimeOfDay initial, ValueChanged<TimeOfDay> onSelected) async {
    final picked = await showTimePicker(
      context: context,
      initialTime: initial,
    );
    if (picked != null) {
      onSelected(picked);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            AppStrings.reminderSettingsTitle,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            "Sync your medication alerts with your daily wake-up, meal, and bed schedules.",
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 18),

          _buildTimeRow(
            label: AppStrings.morningAlarmLabel,
            time: _morning,
            icon: Icons.wb_sunny_rounded,
            onTap: () => _pickTime(context, _morning, (t) => setState(() => _morning = t)),
          ),
          const SizedBox(height: 10),
          _buildTimeRow(
            label: AppStrings.afternoonAlarmLabel,
            time: _afternoon,
            icon: Icons.wb_twilight_rounded,
            onTap: () =>
                _pickTime(context, _afternoon, (t) => setState(() => _afternoon = t)),
          ),
          const SizedBox(height: 10),
          _buildTimeRow(
            label: AppStrings.nightAlarmLabel,
            time: _night,
            icon: Icons.bedtime_rounded,
            onTap: () => _pickTime(context, _night, (t) => setState(() => _night = t)),
          ),

          const SizedBox(height: 16),
          const Divider(color: AppColors.surfaceElevated),
          const SizedBox(height: 8),

          SwitchListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            title: const Text(AppStrings.soundAlertsLabel,
                style: TextStyle(fontSize: 13, color: AppColors.textPrimary)),
            value: _sound,
            activeThumbColor: AppColors.primary,
            onChanged: (val) => setState(() => _sound = val),
          ),
          SwitchListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            title: const Text(AppStrings.vibrationAlertsLabel,
                style: TextStyle(fontSize: 13, color: AppColors.textPrimary)),
            value: _vibration,
            activeThumbColor: AppColors.primary,
            onChanged: (val) => setState(() => _vibration = val),
          ),

          const SizedBox(height: 18),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () {
              final updated = widget.currentRoutine.copyWith(
                morningTime: _morning,
                afternoonTime: _afternoon,
                nightTime: _night,
                soundEnabled: _sound,
                vibrationEnabled: _vibration,
              );
              widget.onSave(updated);
              Navigator.pop(context);
            },
            child: const Text(
              AppStrings.saveRoutineButton,
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeRow({
    required String label,
    required TimeOfDay time,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.surfaceElevated),
        ),
        child: Row(
          children: [
            Icon(icon, size: 18, color: AppColors.primaryLight),
            const SizedBox(width: 10),
            Expanded(
              child: Text(label,
                  style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                time.format(context),
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primaryLight,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
