import "package:flutter/material.dart";
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
      padding: const EdgeInsets.fromLTRB(20, 14, 20, 28),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 44,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFE6F7F2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.alarm_rounded,
                    size: 20, color: Color(0xFF087D71)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      AppStrings.reminderSettingsTitle,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      "Sync alert times with your daily routine",
                      style: TextStyle(
                        fontSize: 12,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

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

          const SizedBox(height: 18),
          const Divider(color: Color(0xFFE2E8F0), height: 1),
          const SizedBox(height: 14),

          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  dense: true,
                  contentPadding: EdgeInsets.zero,
                  secondary: const Icon(Icons.volume_up_rounded,
                      size: 18, color: Color(0xFF087D71)),
                  title: const Text(AppStrings.soundAlertsLabel,
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF0F172A))),
                  value: _sound,
                  activeThumbColor: const Color(0xFF087D71),
                  activeTrackColor: const Color(0xFFE6F7F2),
                  onChanged: (val) => setState(() => _sound = val),
                ),
                const Divider(color: Color(0xFFE2E8F0), height: 1),
                SwitchListTile(
                  dense: true,
                  contentPadding: EdgeInsets.zero,
                  secondary: const Icon(Icons.vibration_rounded,
                      size: 18, color: Color(0xFF087D71)),
                  title: const Text(AppStrings.vibrationAlertsLabel,
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF0F172A))),
                  value: _vibration,
                  activeThumbColor: const Color(0xFF087D71),
                  activeTrackColor: const Color(0xFFE6F7F2),
                  onChanged: (val) => setState(() => _vibration = val),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF087D71),
              foregroundColor: Colors.white,
              elevation: 0,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
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
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: const Color(0xFFE6F7F2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, size: 16, color: const Color(0xFF087D71)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF0F172A),
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFFE6F7F2),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFB2E8DC)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    time.format(context),
                    style: const TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF087D71),
                    ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(Icons.edit_rounded, size: 12, color: Color(0xFF087D71)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
