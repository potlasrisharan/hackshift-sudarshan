import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../data/models/her_models.dart";
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
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFFFDA4AF)),
          ),
          title: const Row(
            children: [
              Icon(Icons.warning, color: Color(0xFFE11D48)),
              SizedBox(width: 8),
              Text("Urgent Clinical Review", style: TextStyle(color: Color(0xFF9F1239), fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: Text(
            alert.emergencyGuidance ?? "Acute symptoms flagged by safety gate.",
            style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13),
          ),
          actions: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE11D48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () => Navigator.pop(ctx),
              child: const Text("I Understand", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Daily symptom journal logged successfully."),
          backgroundColor: Color(0xFF059669),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final herState = ref.watch(herProvider);
    final todayPhase = herState.todayPhase;

    return AppScaffoldShell(
      title: "Daily Symptom Journal",
      subtitle: "Deterministic Wellbeing & Safety Check",
      child: Container(
        color: const Color(0xFFFFF1F3),
        width: double.infinity,
        height: double.infinity,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Flo Cycle Phase Context Card
              if (todayPhase != null) ...[
                _buildPhaseContextCard(todayPhase),
                const SizedBox(height: 12),
              ],

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
                activeColor: _pelvicPain > 6 ? const Color(0xFFE11D48) : const Color(0xFFEC4899),
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
                activeColor: const Color(0xFFE11D48),
                onChanged: (v) => setState(() => _sleepHours = v),
              ),
              const SizedBox(height: 16),

              // Submit Button
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48),
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                ),
                icon: const Icon(Icons.check_circle_outline, color: Colors.white),
                label: const Text("Save Journal & Run Safety Check", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                onPressed: _submitJournal,
              ),
              const SizedBox(height: 24),
            ],
          ),
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
    Color activeColor = const Color(0xFFE11D48),
    required ValueChanged<double> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
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
                  style: const TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 13),
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
            inactiveColor: const Color(0xFFFCE7EC),
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
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.12),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
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
                  style: const TextStyle(color: Color(0xFF475569), fontSize: 11, fontWeight: FontWeight.w600),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Text(display, style: const TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
          Slider(
            value: value,
            min: 0,
            max: max,
            divisions: max.toInt(),
            activeColor: const Color(0xFFE11D48),
            inactiveColor: const Color(0xFFFCE7EC),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildMoodCard() {
    final moods = ["calm", "anxious", "irritable", "fatigue", "focused"];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Predominant Mental State", style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            children: moods.map((m) {
              final isSelected = _selectedMood == m;
              return ChoiceChip(
                label: Text(m[0].toUpperCase() + m.substring(1)),
                selected: isSelected,
                selectedColor: const Color(0xFFE11D48),
                backgroundColor: const Color(0xFFFFF1F3),
                side: BorderSide(color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF)),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : const Color(0xFF0F172A),
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Acne / Skin Flares", style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            children: severities.map((sev) {
              final isSelected = _acneSeverity == sev;
              return ChoiceChip(
                label: Text(sev[0].toUpperCase() + sev.substring(1)),
                selected: isSelected,
                selectedColor: const Color(0xFFE11D48),
                backgroundColor: const Color(0xFFFFF1F3),
                side: BorderSide(color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF)),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : const Color(0xFF0F172A),
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF1F2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFE11D48).withValues(alpha: 0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.crisis_alert, color: Color(0xFFE11D48), size: 18),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Acute Safety Gate Triggers",
                  style: TextStyle(color: Color(0xFF9F1239), fontWeight: FontWeight.bold, fontSize: 13),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          CheckboxListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            activeColor: const Color(0xFFE11D48),
            title: const Text("Sudden severe pain unlike normal cramps", style: TextStyle(color: Color(0xFF0F172A), fontSize: 12, fontWeight: FontWeight.w500)),
            value: _suddenSeverePain,
            onChanged: (val) => setState(() => _suddenSeverePain = val ?? false),
          ),
          CheckboxListTile(
            dense: true,
            contentPadding: EdgeInsets.zero,
            activeColor: const Color(0xFFE11D48),
            title: const Text("Severe dizziness, lightheadedness or syncope", style: TextStyle(color: Color(0xFF0F172A), fontSize: 12, fontWeight: FontWeight.w500)),
            value: _faintingOrSyncope,
            onChanged: (val) => setState(() => _faintingOrSyncope = val ?? false),
          ),
        ],
      ),
    );
  }

  Widget _buildPhaseContextCard(HerCyclePhaseDetailModel phase) {
    String phaseTitle;
    Color phaseColor;
    switch (phase.phase) {
      case "MENSTRUAL":
        phaseTitle = "Menstrual Phase · Day ${phase.cycleDay}";
        phaseColor = const Color(0xFFE11D48);
        break;
      case "FOLLICULAR":
        phaseTitle = "Follicular Phase · Day ${phase.cycleDay}";
        phaseColor = const Color(0xFFDB2777);
        break;
      case "OVULATION":
        phaseTitle = "Ovulation Window · Day ${phase.cycleDay}";
        phaseColor = const Color(0xFF0D9488);
        break;
      case "LUTEAL":
      default:
        phaseTitle = "Luteal Phase · Day ${phase.cycleDay}";
        phaseColor = const Color(0xFF7C3AED);
        break;
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: phaseColor.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: phaseColor.withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(color: phaseColor, shape: BoxShape.circle),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  phaseTitle,
                  style: TextStyle(
                    color: phaseColor,
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: phaseColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  phase.daysUntilNextPeriod == 0
                      ? "Period starts today"
                      : "${phase.daysUntilNextPeriod}d to period",
                  style: TextStyle(color: phaseColor, fontSize: 10, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            phase.nutritionFocus,
            style: const TextStyle(color: Color(0xFF475569), fontSize: 11, height: 1.35),
          ),
        ],
      ),
    );
  }
}
