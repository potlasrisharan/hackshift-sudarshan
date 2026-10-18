import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisQuestionnaireScreen extends ConsumerStatefulWidget {
  const VitalisQuestionnaireScreen({super.key});

  @override
  ConsumerState<VitalisQuestionnaireScreen> createState() => _VitalisQuestionnaireScreenState();
}

class _VitalisQuestionnaireScreenState extends ConsumerState<VitalisQuestionnaireScreen> {
  int _currentIndex = 0;
  final Map<String, dynamic> _answers = {};
  bool _isCompleted = false;
  String _triageResult = "wellness_plan_available";
  String _triageMessage = "";

  final List<Map<String, dynamic>> _questions = const [
    {
      "id": "Q01",
      "section": "Demographics",
      "prompt": "What is your birth year?",
      "subtitle": "Adult screening pathway applies to age 18 and older.",
      "type": "number",
      "default": 1978,
    },
    {
      "id": "Q04",
      "section": "Medical History",
      "prompt": "Do you have any diagnosed chronic health conditions?",
      "subtitle": "Select all that currently apply.",
      "type": "multi",
      "options": ["Pre-diabetes / Diabetes", "Hypertension", "Cardiovascular Disease (CAD)", "Chronic Kidney Disease (CKD)", "None / Unsure"],
    },
    {
      "id": "Q18",
      "section": "Safety & Exertion",
      "prompt": "Do you ever experience chest tightness, pressure, or unusual shortness of breath during physical exertion?",
      "subtitle": "Critical clinical triage check.",
      "type": "boolean",
    },
    {
      "id": "Q19",
      "section": "Clinical Guidance",
      "prompt": "Has your doctor or cardiologist specifically advised you to limit vigorous physical activity?",
      "subtitle": "Helps calibrate safe exercise volume.",
      "type": "boolean",
    },
    {
      "id": "Q23",
      "section": "Sleep Architecture",
      "prompt": "Has anyone observed you snoring loudly or having pauses in breathing while asleep?",
      "subtitle": "Screening for obstructive sleep apnea risk.",
      "type": "boolean",
    },
    {
      "id": "Q30",
      "section": "Functional Independence",
      "prompt": "Have you experienced any accidental falls in the past 12 months?",
      "subtitle": "WHO ICOPE locomotor assessment.",
      "type": "boolean",
    },
    {
      "id": "Q38",
      "section": "Immediate Safety Gate",
      "prompt": "Are you currently feeling acute chest discomfort, severe lightheadedness, or alarming pain right now?",
      "subtitle": "Immediate emergency escalation check.",
      "type": "boolean",
    },
  ];

  void _submitAnswer(dynamic val) {
    final q = _questions[_currentIndex];
    _answers[q["id"] as String] = val;

    // Check emergency red flags
    if (q["id"] == "Q38" && val == true) {
      ref.read(vitalisProvider.notifier).triggerChestPainEmergency();
      setState(() {
        _isCompleted = true;
        _triageResult = "urgent_evaluation";
        _triageMessage = "URGENT: Acute chest discomfort or severe symptoms reported. Seek immediate medical attention at an emergency clinic.";
      });
      return;
    }

    if (_currentIndex < _questions.length - 1) {
      setState(() {
        _currentIndex++;
      });
    } else {
      _finalizeAssessment();
    }
  }

  void _finalizeAssessment() {
    String result = "wellness_plan_available";
    String msg = "Your preventive health profile has been analyzed. Modifiable wellness recommendations are available.";

    final bool exertionRestricted = _answers["Q18"] == true || _answers["Q19"] == true;
    if (exertionRestricted) {
      result = "clinician_review";
      msg = "Clinician review recommended prior to escalating exercise intensity.";
    }

    final currentProfile = ref.read(vitalisProvider).profile;
    final birthYear = (_answers["Q01"] as num?)?.toInt() ?? currentProfile.yearOfBirth;
    final conditionsSelected = (_answers["Q04"] as List<dynamic>?)?.map((e) => e.toString()).toList();
    final chronicConditions = conditionsSelected != null && !conditionsSelected.contains("None / Unsure")
        ? conditionsSelected
        : currentProfile.diagnosedConditions;

    final updatedProfile = VitalisProfileModel(
      patientId: currentProfile.patientId,
      yearOfBirth: birthYear,
      sex: currentProfile.sex,
      heightCm: currentProfile.heightCm,
      weightKg: currentProfile.weightKg,
      waistCircumferenceCm: currentProfile.waistCircumferenceCm,
      diagnosedConditions: chronicConditions,
      medications: currentProfile.medications,
      allergies: currentProfile.allergies,
      dietPreference: currentProfile.dietPreference,
      activityLimitations: currentProfile.activityLimitations,
      goals: currentProfile.goals,
      smokingStatus: currentProfile.smokingStatus,
      alcoholIntake: currentProfile.alcoholIntake,
      clinicianRestrictedExertion: exertionRestricted || currentProfile.clinicianRestrictedExertion,
      onboardingVersion: currentProfile.onboardingVersion,
    );

    ref.read(vitalisProvider.notifier).saveProfile(updatedProfile);

    setState(() {
      _isCompleted = true;
      _triageResult = result;
      _triageMessage = msg;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isCompleted) {
      return AppScaffoldShell(
        title: "Assessment Complete",
        subtitle: "AyuSetu Vitalis Triage Result",
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: _triageResult == "urgent_evaluation"
                      ? AppColors.error.withValues(alpha: 0.15)
                      : _triageResult == "clinician_review"
                      ? AppColors.warning.withValues(alpha: 0.15)
                      : AppColors.success.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _triageResult == "urgent_evaluation"
                        ? AppColors.error
                        : _triageResult == "clinician_review"
                        ? AppColors.warning
                        : AppColors.success,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _triageResult == "urgent_evaluation"
                              ? Icons.emergency_rounded
                              : _triageResult == "clinician_review"
                              ? Icons.medical_services_rounded
                              : Icons.check_circle_rounded,
                          color: _triageResult == "urgent_evaluation"
                              ? AppColors.error
                              : _triageResult == "clinician_review"
                              ? AppColors.warning
                              : AppColors.success,
                          size: 24,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          _triageResult.replaceAll("_", " ").toUpperCase(),
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.textPrimary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(_triageMessage, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary, height: 1.4)),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () => context.canPop() ? context.pop() : context.go("/vitalis"),
                icon: const Icon(Icons.arrow_back),
                label: const Text("Return to Vitalis Hub"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.vitalisTeal,
                  minimumSize: const Size.fromHeight(48),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final q = _questions[_currentIndex];

    return AppScaffoldShell(
      title: "Healthspan Assessment",
      subtitle: "Question ${_currentIndex + 1} of ${_questions.length}",
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LinearProgressIndicator(
              value: (_currentIndex + 1) / _questions.length,
              backgroundColor: AppColors.surfaceElevated,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.vitalisTeal),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                q["section"] as String,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.vitalisTeal),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              q["prompt"] as String,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 6),
            Text(
              q["subtitle"] as String,
              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 24),
            if (q["type"] == "boolean")
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _submitAnswer(true),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.vitalisTeal),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text("Yes", style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _submitAnswer(false),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.vitalisTeal,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: const Text("No", style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            if (q["type"] == "number")
              Column(
                children: [
                  TextField(
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: "Enter value", border: OutlineInputBorder()),
                    onSubmitted: (val) => _submitAnswer(int.tryParse(val) ?? 1980),
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () => _submitAnswer(1978),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.vitalisTeal),
                    child: const Text("Next Question"),
                  ),
                ],
              ),
            if (q["type"] == "multi")
              Column(
                children: [
                  for (final opt in (q["options"] as List<String>))
                    ListTile(
                      title: Text(opt, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
                      trailing: const Icon(Icons.radio_button_unchecked, color: AppColors.vitalisTeal),
                      onTap: () => _submitAnswer([opt]),
                    ),
                ],
              ),
            const Spacer(),
            TextButton(
              onPressed: () {
                if (_currentIndex < _questions.length - 1) {
                  setState(() => _currentIndex++);
                } else {
                  _finalizeAssessment();
                }
              },
              child: const Text("Skip Question (Mark Unknown)", style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            ),
          ],
        ),
      ),
    );
  }
}
