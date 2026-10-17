import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/her_provider.dart";

class HerSymptomJournalScreen extends ConsumerStatefulWidget {
  const HerSymptomJournalScreen({super.key});

  @override
  ConsumerState<HerSymptomJournalScreen> createState() => _HerSymptomJournalScreenState();
}

class _HerSymptomJournalScreenState extends ConsumerState<HerSymptomJournalScreen> {
  double _energyLevel = 7.0;
  String _selectedMood = "calm";
  double _pelvicPain = 1.0;
  double _bloating = 1.0;
  double _headache = 0.0;
  String _acneSeverity = "none";
  double _sleepHours = 7.5;
  bool _suddenSeverePain = false;
  bool _faintingOrSyncope = false;
  final TextEditingController _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submitJournal() async {
    final payload = <String, Object?>{
      "logDate": DateTime.now().toIso8601String().split("T").first,
      "energyLevel": _energyLevel.toInt(),
      "mood": _selectedMood,
      "pelvicPain": _pelvicPain.toInt(),
      "bloating": _bloating.toInt(),
      "headache": _headache.toInt(),
      "acneSeverity": _acneSeverity,
      "sleepHours": _sleepHours,
      "suddenSeverePain": _suddenSeverePain,
      "faintingOrSyncope": _faintingOrSyncope,
      "notes": _notesController.text.isNotEmpty ? _notesController.text : null,
    };

    await ref.read(herProvider.notifier).logSymptom(payload);

    if (!mounted) return;

    final alert = ref.read(herProvider).activeSafetyAlert;
    if (alert != null && alert.isUrgent) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          backgroundColor: AppColors.surface,
          title: const Row(
            children: [
              Icon(Icons.warning, color: AppColors.error),
              SizedBox(width: 8),
              Text("Urgent Clinical Review", style: TextStyle(color: AppColors.error, fontSize: 16)),
            ],
          ),
          content: Text(
            alert.emergencyGuidance ?? "Acute symptoms flagged by safety gate.",
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
          ),
          actions: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
              onPressed: () => Navigator.pop(ctx),
              child: const Text("I Understand", style: TextStyle(color: Colors.white)),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Daily symptom journal logged successfully."),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffoldShell(
      title: "Daily Symptom Journal",
      subtitle: "Deterministic Wellbeing & Safety Check",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Energy Level
            _buildSliderCard(
              title: "Energy & Vitality Level",
              value: _energyLevel,
              min: 1,
              max: 10,
              divisions: 9,
              display: "${_energyLevel.toInt()} / 10",
              onChanged: (v) => setState(() => _energyLevel = v),
            ),
            const SizedBox(height: 12),

            // Mood Selector
            _buildMoodCard(),
            const SizedBox(height: 12),

            // Acne Severity Selector
            _buildAcneCard(),
            const SizedBox(height: 12),

            // Pelvic Discomfort
            _buildSliderCard(
              title: "Pelvic / Cramp Discomfort",
              value: _pelvicPain,
              min: 0,
              max: 10,
              divisions: 10,
              display: "${_pelvicPain.toInt()} / 10",
              activeColor: _pelvicPain > 6 ? AppColors.error : AppColors.wellnessPink,
              onChanged: (v) => setState(() => _pelvicPain = v),
            ),
            const SizedBox(height: 12),

            // Bloating & Headache Sliders
            Row(
              children: [
                Expanded(
                  child: _buildMiniSliderCard(
                    title: "Bloating (0-5)",
                    value: _bloating,
                    max: 5,
                    display: "${_bloating.toInt()}",
                    onChanged: (v) => setState(() => _bloating = v),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _buildMiniSliderCard(
                    title: "Headache (0-5)",
                    value: _headache,
                    max: 5,
                    display: "${_headache.toInt()}",
                    onChanged: (v) => setState(() => _headache = v),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Red Flag Checkboxes
            _buildAcuteRedFlagsCard(),
            const SizedBox(height: 12),

            // Sleep Hours Slider
            _buildSliderCard(
              title: "Night Sleep Duration",
              value: _sleepHours,
              min: 4,
              max: 12,
              divisions: 16,
              display: "${_sleepHours.toStringAsFixed(1)} hrs",
              activeColor: AppColors.longevityCyan,
              onChanged: (v) => setState(() => _sleepHours = v),
            ),
            const SizedBox(height: 16),

            // Submit Button
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              icon: const Icon(Icons.check_circle_outline, color: Colors.white),
              label: const Text("Save Journal & Run Safety Check", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              onPressed: _submitJournal,
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSliderCard({
    required String title,
    required double value,
    required double min,
    required double max,
    required int divisions,
    required String display,
    Color activeColor = AppColors.primaryLight,
    required ValueChanged<double> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(display, style: TextStyle(color: activeColor, fontWeight: FontWeight.bold, fontSize: 13)),
            ],
          ),
          Slider(
            value: value,
            min: min,
            max: max,
            divisions: divisions,
            activeColor: activeColor,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildMiniSliderCard({
    required String title,
    required double value,
    required double max,
    required String display,
    required ValueChanged<double> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Text(display, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 11)),
            ],
          ),
          Slider(
            value: value,
            min: 0,
            max: max,
            divisions: max.toInt(),
            activeColor: AppColors.primaryLight,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildMoodCard() {
    final moods = ["calm", "anxious", "irritable", "fatigue", "focused"];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Predominant Mental State", style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: moods.map((m) {
              final isSelected = _selectedMood == m;
              return ChoiceChip(
                label: Text(m[0].toUpperCase() + m.substring(1)),
                selected: isSelected,
                selectedColor: AppColors.wellnessPink,
                backgroundColor: AppColors.surfaceElevated,
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                  fontSize: 12,
                ),
                onSelected: (_) => setState(() => _selectedMood = m),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildAcneCard() {
    final severities = ["none", "mild", "moderate", "severe"];

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Acne / Skin Flares", style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: severities.map((sev) {
              final isSelected = _acneSeverity == sev;
              return ChoiceChip(
                label: Text(sev[0].toUpperCase() + sev.substring(1)),
                selected: isSelected,
                selectedColor: AppColors.wellnessPink,
                backgroundColor: AppColors.surfaceElevated,
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                  fontSize: 12,
                ),
                onSelected: (_) => setState(() => _acneSeverity = sev),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildAcuteRedFlagsCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.crisis_alert, color: AppColors.error, size: 18),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Acute Safety Gate Triggers",
                  style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold, fontSize: 13),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          CheckboxListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            activeColor: AppColors.error,
            title: const Text("Sudden severe pain unlike normal cramps", style: TextStyle(color: AppColors.textPrimary, fontSize: 12)),
            value: _suddenSeverePain,
            onChanged: (val) => setState(() => _suddenSeverePain = val ?? false),
          ),
          CheckboxListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            activeColor: AppColors.error,
            title: const Text("Severe dizziness, lightheadedness or syncope", style: TextStyle(color: AppColors.textPrimary, fontSize: 12)),
            value: _faintingOrSyncope,
            onChanged: (val) => setState(() => _faintingOrSyncope = val ?? false),
          ),
        ],
      ),
    );
  }
}
