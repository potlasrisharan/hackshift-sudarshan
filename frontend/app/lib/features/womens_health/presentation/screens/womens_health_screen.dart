import "package:flutter/material.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class WomensHealthScreen extends StatefulWidget {
  const WomensHealthScreen({super.key});

  @override
  State<WomensHealthScreen> createState() => _WomensHealthScreenState();
}

class _WomensHealthScreenState extends State<WomensHealthScreen> {
  final List<Map<String, dynamic>> _medications = [
    {"name": "Folic Acid & Elemental Iron", "dosage": "1 Tab (Morning post-meal)", "taken": true},
    {"name": "Shatavari Churna", "dosage": "3g with warm almond milk (Night)", "taken": true},
    {"name": "Vitamin D3 (60,000 IU)", "dosage": "Weekly Sunday", "taken": false},
    {"name": "Evening Primrose Oil", "dosage": "500mg capsule (Evening)", "taken": false},
  ];

  String _selectedSymptom = "Severe Pelvic Cramping (Dysmenorrhea)";

  final Map<String, Map<String, dynamic>> _symptomSolutions = const {
    "Severe Pelvic Cramping (Dysmenorrhea)": {
      "severity": "Moderate to High",
      "herbalSolution": "Sukumaram Kashayam 15ml + warm ginger water twice daily.",
      "lifestyle": "Warm castor oil pack on lower abdomen for 20 mins. Rest in Supta Baddha Konasana.",
      "avoid": "Cold/carbonated drinks, excess caffeine, and raw unheated salads.",
      "redFlag": "If pain accompanied by syncope, fever >101°F, or heavy bleeding (>1 pad/hr), consult doctor immediately.",
    },
    "PMS Mood Swings & Brain Fog": {
      "severity": "Luteal Phase Progesterone Fluctuation",
      "herbalSolution": "Ashwagandha 500mg with warm chamomile tea before sleep.",
      "lifestyle": "15-minute morning sunlight walk, limit screen exposure past 9 PM.",
      "avoid": "Refined sugars and high-sodium processed foods that spike aldosterone.",
      "redFlag": "If severe depression or panic attacks persist, request clinical mental health evaluation.",
    },
    "Luteal Phase Bloating & Water Retention": {
      "severity": "Mild Aldosterone Surge",
      "herbalSolution": "Coriander-Cumin-Fennel (CCF) tea steeped in hot water 3 times a day.",
      "lifestyle": "Legs-Up-The-Wall (Viparita Karani) for 10 minutes to drain lymphatic fluid.",
      "avoid": "Excess table salt and canned foods.",
      "redFlag": "Sudden facial or lower limb pitting edema requires urgent kidney & albumin check.",
    },
    "Hormonal Acne Breakouts (Jawline/Chin)": {
      "severity": "Androgen / DHT Sensitivity",
      "herbalSolution": "Neem & Manjistha blood-purifying formulation post-dinner.",
      "lifestyle": "Double-cleanse with gentle tea tree wash, change pillowcase every 2 days.",
      "avoid": "High-glycemic whey protein and dairy milk.",
      "redFlag": "Cystic lesions with scarring warrant dermatologist hormonal workup.",
    },
  };

  @override
  Widget build(BuildContext context) {
    final solution = _symptomSolutions[_selectedSymptom] ?? _symptomSolutions.values.first;

    return AppScaffoldShell(
      title: AppStrings.womensHealthHeader,
      subtitle: "Cycle, Medicine & Symptom Solver",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHerModuleLauncher(),
            const SizedBox(height: 16),
            _buildCycleTrackerCard(),
            const SizedBox(height: 20),
            _buildMedicationTracker(),
            const SizedBox(height: 20),
            _buildSymptomSolver(solution),
          ],
        ),
      ),
    );
  }

  Widget _buildHerModuleLauncher() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF831843), Color(0xFF1E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.wellnessPink.withValues(alpha: 0.6), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const AyuSetuLogoBadge(
                height: 22,
                borderRadius: 10,
                padding: EdgeInsets.all(6),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "AYUSETU HER INTELLIGENCE",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: AppColors.wellnessPink,
                      ),
                    ),
                    Text(
                      "Hormonal Wellness, Screening Radar & Doctor Sharing",
                      style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            "Evidence-informed screening flags (PCOS, dysmenorrhea, heavy bleeding), deterministic safety gates, phase-matched somatic yoga, and patient-controlled clinical summaries.",
            style: TextStyle(fontSize: 12, color: AppColors.textPrimary, height: 1.35),
          ),
          const SizedBox(height: 14),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.wellnessPink,
              minimumSize: const Size.fromHeight(40),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            icon: const Icon(Icons.arrow_forward, color: Colors.white, size: 16),
            label: const Text(
              "Open AyuSetu HER Studio",
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
            onPressed: () => context.push("/her"),
          ),
        ],
      ),
    );
  }

  Widget _buildCycleTrackerCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.wellnessPink.withValues(alpha: 0.2),
            AppColors.surface,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.wellnessPink.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "Day 14 of 28 · Ovulatory Phase",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "Estrogen peak · High energy & metabolic resilience",
                      style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.wellnessPink.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  "Fertile Window",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.wellnessPink),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: const LinearProgressIndicator(
              value: 14 / 28,
              minHeight: 10,
              backgroundColor: AppColors.surfaceElevated,
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.wellnessPink),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Expanded(
                child: Text(
                  "Last Period: 14 days ago",
                  style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Next Period: In 14 days",
                  textAlign: TextAlign.right,
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primaryLight),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMedicationTracker() {
    final int takenCount = _medications.where((m) => m["taken"] == true).length;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: const [
                    Icon(Icons.medication_rounded, color: AppColors.primaryLight, size: 20),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "Daily Medication Timetable",
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                "$takenCount / ${_medications.length} Done",
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.success),
              ),
            ],
          ),
          const SizedBox(height: 12),
          for (int i = 0; i < _medications.length; i++)
            Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.surfaceElevated),
              ),
              child: Row(
                children: [
                  Checkbox(
                    value: _medications[i]["taken"] as bool,
                    activeColor: AppColors.success,
                    onChanged: (val) {
                      setState(() {
                        _medications[i]["taken"] = val ?? false;
                      });
                    },
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _medications[i]["name"] as String,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: _medications[i]["taken"] as bool ? AppColors.textMuted : AppColors.textPrimary,
                            decoration: _medications[i]["taken"] as bool ? TextDecoration.lineThrough : null,
                          ),
                        ),
                        Text(
                          _medications[i]["dosage"] as String,
                          style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSymptomSolver(Map<String, dynamic> solution) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.psychology_alt_rounded, color: AppColors.wellnessPink, size: 22),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Health Issue & Solution Engine",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text("Select Current Issue / Symptom", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            isExpanded: true,
            initialValue: _selectedSymptom,
            dropdownColor: AppColors.surfaceElevated,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: InputDecoration(
              filled: true,
              fillColor: AppColors.background,
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
            ),
            items: _symptomSolutions.keys
                .map((e) => DropdownMenuItem(value: e, child: Text(e, overflow: TextOverflow.ellipsis)))
                .toList(),
            onChanged: (val) {
              if (val != null) setState(() => _selectedSymptom = val);
            },
          ),
          const SizedBox(height: 16),
          _buildSolutionCard("Herbal / Clinical Remedy", solution["herbalSolution"], AppColors.success),
          const SizedBox(height: 8),
          _buildSolutionCard("Somatic & Lifestyle Guidance", solution["lifestyle"], AppColors.primaryLight),
          const SizedBox(height: 8),
          _buildSolutionCard("Dietary Exclusions", solution["avoid"], AppColors.warning),
          const SizedBox(height: 8),
          _buildSolutionCard("Clinical Red-Flag Warning", solution["redFlag"], AppColors.error),
        ],
      ),
    );
  }

  Widget _buildSolutionCard(String title, String content, Color accent) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: accent.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: accent),
          ),
          const SizedBox(height: 4),
          Text(
            content,
            style: const TextStyle(fontSize: 12, color: AppColors.textPrimary, height: 1.3),
          ),
        ],
      ),
    );
  }
}
