import "package:flutter/material.dart";
import "package:go_router/go_router.dart";
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
      child: Container(
        color: const Color(0xFFFFF1F3),
        width: double.infinity,
        height: double.infinity,
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
      ),
    );
  }

  Widget _buildHerModuleLauncher() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFF1F3), Color(0xFFFCE7EC)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.2),
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
                        color: Color(0xFF9F1239),
                      ),
                    ),
                    Text(
                      "Hormonal Wellness, Screening Radar & Doctor Sharing",
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            "Evidence-informed screening flags (PCOS, dysmenorrhea, heavy bleeding), deterministic safety gates, phase-matched somatic yoga, and patient-controlled clinical summaries.",
            style: TextStyle(fontSize: 12, color: Color(0xFF0F172A), height: 1.35),
          ),
          const SizedBox(height: 14),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE11D48),
              minimumSize: const Size.fromHeight(42),
              elevation: 0,
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Day 14 of 28 · Ovulatory Phase",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF9F1239)),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "Estrogen peak · High energy & metabolic resilience",
                      style: TextStyle(fontSize: 12, color: Color(0xFF475569)),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF1F3),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFFDA4AF), width: 0.8),
                ),
                child: const Text(
                  "Fertile Window",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFFE11D48)),
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
              backgroundColor: Color(0xFFFFF1F3),
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE11D48)),
            ),
          ),
          const SizedBox(height: 12),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  "Last Period: 14 days ago",
                  style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Next Period: In 14 days",
                  textAlign: TextAlign.right,
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF9F1239)),
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Row(
                  children: [
                    Icon(Icons.medication_rounded, color: Color(0xFFE11D48), size: 20),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "Daily Medication Timetable",
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Color(0xFF9F1239)),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Text(
                  "$takenCount / ${_medications.length} Done",
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF059669)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          for (int i = 0; i < _medications.length; i++)
            Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1F3),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFFDA4AF).withValues(alpha: 0.5)),
              ),
              child: Row(
                children: [
                  Checkbox(
                    value: _medications[i]["taken"] as bool,
                    activeColor: const Color(0xFFE11D48),
                    checkColor: Colors.white,
                    side: const BorderSide(color: Color(0xFFFDA4AF), width: 1.5),
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
                            color: _medications[i]["taken"] as bool ? const Color(0xFF94A3B8) : const Color(0xFF0F172A),
                            decoration: _medications[i]["taken"] as bool ? TextDecoration.lineThrough : null,
                          ),
                        ),
                        Text(
                          _medications[i]["dosage"] as String,
                          style: const TextStyle(fontSize: 11, color: Color(0xFF475569)),
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFDA4AF), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.psychology_alt_rounded, color: Color(0xFFE11D48), size: 22),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Health Issue & Solution Engine",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Color(0xFF9F1239)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Text("Select Current Issue / Symptom", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            isExpanded: true,
            initialValue: _selectedSymptom,
            dropdownColor: Colors.white,
            style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13, fontWeight: FontWeight.w600),
            decoration: InputDecoration(
              filled: true,
              fillColor: const Color(0xFFFFF1F3),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFFDA4AF)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFFDA4AF)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: const BorderSide(color: Color(0xFFE11D48), width: 1.5),
              ),
            ),
            items: _symptomSolutions.keys
                .map((e) => DropdownMenuItem(value: e, child: Text(e, overflow: TextOverflow.ellipsis)))
                .toList(),
            onChanged: (val) {
              if (val != null) setState(() => _selectedSymptom = val);
            },
          ),
          const SizedBox(height: 16),
          _buildSolutionCard(
            "Herbal / Clinical Remedy",
            solution["herbalSolution"] as String,
            const Color(0xFF059669),
            const Color(0xFFECFDF5),
            const Color(0xFFA7F3D0),
          ),
          const SizedBox(height: 8),
          _buildSolutionCard(
            "Somatic & Lifestyle Guidance",
            solution["lifestyle"] as String,
            const Color(0xFF0284C7),
            const Color(0xFFF0F9FF),
            const Color(0xFFBAE6FD),
          ),
          const SizedBox(height: 8),
          _buildSolutionCard(
            "Dietary Exclusions",
            solution["avoid"] as String,
            const Color(0xFFD97706),
            const Color(0xFFFFFBEB),
            const Color(0xFFFDE68A),
          ),
          const SizedBox(height: 8),
          _buildSolutionCard(
            "Clinical Red-Flag Warning",
            solution["redFlag"] as String,
            const Color(0xFFE11D48),
            const Color(0xFFFFF1F2),
            const Color(0xFFFECDD3),
          ),
        ],
      ),
    );
  }

  Widget _buildSolutionCard(String title, String content, Color accent, Color bgColor, Color borderColor) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: borderColor),
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
            style: const TextStyle(fontSize: 12, color: Color(0xFF0F172A), height: 1.35),
          ),
        ],
      ),
    );
  }
}
