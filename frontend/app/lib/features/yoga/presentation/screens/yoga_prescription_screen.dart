import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class YogaPrescriptionScreen extends StatefulWidget {
  const YogaPrescriptionScreen({super.key});

  @override
  State<YogaPrescriptionScreen> createState() => _YogaPrescriptionScreenState();
}

class _YogaPrescriptionScreenState extends State<YogaPrescriptionScreen> {
  String _selectedIssue = "PCOS & Hormonal Irregularity";
  String _selectedAgeGroup = "25 - 35 yrs";
  String _selectedDosha = "Pitta-Vata";
  final bool _hasPrescription = true;

  final List<String> _healthIssues = const [
    "PCOS & Hormonal Irregularity",
    "Severe Dysmenorrhea (Menstrual Cramps)",
    "Pelvic Floor & Postpartum Weakness",
    "Chronic Stress, Fatigue & Cortisol",
    "Thyroid & Metabolism Sluggishness",
  ];

  final Map<String, List<Map<String, String>>> _asanasByIssue = const {
    "PCOS & Hormonal Irregularity": [
      {
        "name": "Supta Baddha Konasana (Reclined Butterfly)",
        "duration": "5 - 8 mins",
        "focus": "Stimulates ovaries and improves pelvic blood circulation",
        "benefits": "Reduces cortisol and regulates hypothalamic-pituitary-ovarian axis.",
      },
      {
        "name": "Bhujangasana (Cobra Pose)",
        "duration": "3 repetitions x 30s",
        "focus": "Tones ovaries, stimulates adrenal glands and opens pelvic corridor",
        "benefits": "Reduces abdominal stagnation and promotes healthy follicle maturation.",
      },
      {
        "name": "Nadi Shodhana Pranayama (Alternate Nostril)",
        "duration": "10 minutes morning",
        "focus": "Sympathetic-parasympathetic nervous balance",
        "benefits": "Downregulates androgen production triggered by chronic stress.",
      },
    ],
    "Severe Dysmenorrhea (Menstrual Cramps)": [
      {
        "name": "Balasana (Child's Pose with Bolster)",
        "duration": "6 - 10 mins",
        "focus": "Relieves lumbar and sacral tension",
        "benefits": "Calms uterine muscle contractions and reduces pelvic venous congestion.",
      },
      {
        "name": "Viparita Karani (Legs-Up-The-Wall)",
        "duration": "8 - 12 mins",
        "focus": "Passive pelvic decompression and lymph drainage",
        "benefits": "Eases menstrual cramps and restores autonomic equilibrium.",
      },
      {
        "name": "Bhramari Pranayama (Humming Bee Breath)",
        "duration": "5 mins",
        "focus": "Nitric oxide generation and deep somatic vagal stimulation",
        "benefits": "Natural endorphin release for visceral cramp relief.",
      },
    ],
    "Pelvic Floor & Postpartum Weakness": [
      {
        "name": "Setu Bandhasana (Bridge Pose)",
        "duration": "5 repetitions with pelvic locks (Mula Bandha)",
        "focus": "Strengthens pelvic diaphragm and core stabilizers",
        "benefits": "Counteracts prolapse symptoms and improves urinary continence.",
      },
      {
        "name": "Malasana (Garland Pose with Block)",
        "duration": "3 - 5 mins",
        "focus": "Deep hip opening and pelvic floor stretching",
        "benefits": "Prevents chronic pelvic muscle hypertonicity.",
      },
    ],
    "Chronic Stress, Fatigue & Cortisol": [
      {
        "name": "Shavasana with Ujjayi Breath",
        "duration": "15 mins",
        "focus": "Full neuromuscular restoration",
        "benefits": "Reduces morning salivary cortisol and improves HRV.",
      },
      {
        "name": "Marjaryasana-Bitilasana (Cat-Cow)",
        "duration": "10 cycles with breath awareness",
        "focus": "Spinal mobilization and sympathetic decompression",
        "benefits": "Alleviates mid-day fatigue and chronic neck tension.",
      },
    ],
    "Thyroid & Metabolism Sluggishness": [
      {
        "name": "Sarvangasana (Supported Shoulder Stand)",
        "duration": "3 mins",
        "focus": "Jalandhara Bandha (Chin Lock) and thyroid stimulation",
        "benefits": "Increases metabolic rate and thyroid vascular perfusion.",
      },
      {
        "name": "Matsyasana (Fish Pose)",
        "duration": "2 mins counter-pose",
        "focus": "Throat expansion and parathyroid activation",
        "benefits": "Complements shoulder stand to balance endocrine signaling.",
      },
    ],
  };

  @override
  Widget build(BuildContext context) {
    final asanas = _asanasByIssue[_selectedIssue] ?? _asanasByIssue.values.first;

    return AppScaffoldShell(
      title: AppStrings.yogaHeader,
      subtitle: "Women's Somatic & Ayurvedic Therapy",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildAssessmentForm(),
            const SizedBox(height: 20),
            if (_hasPrescription) ...[
              _buildPrescriptionSummary(),
              const SizedBox(height: 16),
              _buildAsanaList(asanas),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildAssessmentForm() {
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
              Icon(Icons.spa_rounded, color: AppColors.yogaAmber, size: 22),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Ayurvedic Symptom Assessment",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text("Primary Health Concern", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          const SizedBox(height: 6),
          DropdownButtonFormField<String>(
            isExpanded: true,
            initialValue: _selectedIssue,
            dropdownColor: AppColors.surfaceElevated,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: InputDecoration(
              filled: true,
              fillColor: AppColors.background,
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
            ),
            items: _healthIssues
                .map((e) => DropdownMenuItem(value: e, child: Text(e, overflow: TextOverflow.ellipsis)))
                .toList(),
            onChanged: (val) {
              if (val != null) setState(() => _selectedIssue = val);
            },
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Age Bracket", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      isExpanded: true,
                      initialValue: _selectedAgeGroup,
                      dropdownColor: AppColors.surfaceElevated,
                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.background,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                      ),
                      items: const ["18 - 25 yrs", "25 - 35 yrs", "35 - 45 yrs", "45+ yrs"]
                          .map((e) => DropdownMenuItem(value: e, child: Text(e, overflow: TextOverflow.ellipsis)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedAgeGroup = val);
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("Dominant Dosha", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      isExpanded: true,
                      initialValue: _selectedDosha,
                      dropdownColor: AppColors.surfaceElevated,
                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.background,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
                      ),
                      items: const ["Vata (Air/Space)", "Pitta (Fire)", "Kapha (Earth)", "Pitta-Vata"]
                          .map((e) => DropdownMenuItem(value: e, child: Text(e, overflow: TextOverflow.ellipsis)))
                          .toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedDosha = val);
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPrescriptionSummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.yogaAmber.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.yogaAmber.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: const [
              Icon(Icons.self_improvement, color: AppColors.yogaAmber, size: 22),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Personalized Asana Prescription",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            "Tailored for $_selectedIssue with $_selectedDosha constitutional pacification. Perform on empty stomach at dawn or dusk.",
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
          ),
        ],
      ),
    );
  }

  Widget _buildAsanaList(List<Map<String, String>> asanas) {
    return Column(
      children: [
        for (int i = 0; i < asanas.length; i++)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
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
                      child: Text(
                        "${i + 1}. ${asanas[i]['name']!}",
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.yogaAmber.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        asanas[i]["duration"]!,
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.yogaAmber),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  asanas[i]["focus"]!,
                  style: const TextStyle(fontSize: 12, color: AppColors.primaryLight, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 4),
                Text(
                  asanas[i]["benefits"]!,
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
