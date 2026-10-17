import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/her_provider.dart";

class HerQuestionnaireScreen extends ConsumerStatefulWidget {
  const HerQuestionnaireScreen({super.key});

  @override
  ConsumerState<HerQuestionnaireScreen> createState() => _HerQuestionnaireScreenState();
}

class _HerQuestionnaireScreenState extends ConsumerState<HerQuestionnaireScreen> {
  String _selectedDomain = "PCOS";
  final Map<String, String> _answers = {};

  final Map<String, List<Map<String, Object>>> _domainQuestions = {
    "PCOS": [
      {
        "id": "P01",
        "question": "Are your menstrual cycles typically longer than 35 days apart?",
        "options": ["yes", "no", "unsure"],
      },
      {
        "id": "P02",
        "question": "Have you missed periods for 3 or more consecutive months (without pregnancy)?",
        "options": ["yes", "no"],
      },
      {
        "id": "P05",
        "question": "Do you experience coarse, dark hair growth on your chin, upper lip, or abdomen?",
        "options": ["yes", "no"],
      },
      {
        "id": "P06",
        "question": "Do you experience persistent adult acne resistant to standard skincare?",
        "options": ["mild", "moderate", "severe", "none"],
      },
      {
        "id": "P07",
        "question": "Have you noticed thinning of hair at your scalp crown?",
        "options": ["yes", "no"],
      },
    ],
    "ENDO": [
      {
        "id": "E01",
        "question": "On a scale of 0 to 10, how intense is your typical period cramp pain?",
        "options": ["mild (1-3)", "moderate (4-6)", "severe (7-10)"],
      },
      {
        "id": "E02",
        "question": "Does pelvic pain force you to miss work, school, or daily routine?",
        "options": ["rarely", "sometimes", "often", "always"],
      },
      {
        "id": "E04",
        "question": "Do you feel persistent aching or pelvic pain between periods?",
        "options": ["yes", "no"],
      },
      {
        "id": "E05",
        "question": "Do you experience painful bowel movements or bladder discomfort during your period?",
        "options": ["yes", "no"],
      },
    ],
    "CORE": [
      {
        "id": "C03",
        "question": "Could you currently be pregnant?",
        "options": ["yes", "no", "unsure"],
      },
      {
        "id": "B03",
        "question": "Do you soak through pads or tampons in less than 2 hours?",
        "options": ["yes", "no"],
      },
      {
        "id": "B08",
        "question": "Do you experience persistent unexplained fatigue or cold intolerance?",
        "options": ["yes", "no"],
      },
    ],
  };

  Future<void> _submitAnswers() async {
    final Map<String, Object?> parsedAnswers = {};
    _answers.forEach((k, v) {
      if (k == "E01") {
        parsedAnswers[k] = v.contains("severe") ? 9 : (v.contains("moderate") ? 5 : 2);
      } else {
        parsedAnswers[k] = v;
      }
    });

    final api = ref.read(herApiServiceProvider);
    await api.evaluateScreening(answers: parsedAnswers);
    await ref.read(herProvider.notifier).loadAll();

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Adaptive questionnaire evaluated with deterministic evidence."),
        backgroundColor: Color(0xFF059669),
      ),
    );

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    final questions = _domainQuestions[_selectedDomain] ?? [];

    return AppScaffoldShell(
      title: "Adaptive Questionnaire",
      subtitle: "Deterministic Clinical Questioning",
      child: Container(
        color: const Color(0xFFFFF1F3),
        width: double.infinity,
        height: double.infinity,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Domain Segmented Buttons
              Row(
                children: [
                  _buildDomainTab("PCOS", "Hormonal (PCOS)"),
                  const SizedBox(width: 8),
                  _buildDomainTab("ENDO", "Pelvic Pain (Endo)"),
                  const SizedBox(width: 8),
                  _buildDomainTab("CORE", "Heavy Bleeding"),
                ],
              ),
              const SizedBox(height: 16),

              // Questions Card List
              ...questions.map((q) {
                final id = q["id"] as String;
                final prompt = q["question"] as String;
                final options = q["options"] as List<String>;
                final selected = _answers[id];

                return Container(
                  margin: const EdgeInsets.only(bottom: 14),
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
                      Text(
                        prompt,
                        style: const TextStyle(
                          color: Color(0xFF0F172A),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: options.map((opt) {
                          final isSelected = selected == opt;
                          return ChoiceChip(
                            label: Text(opt[0].toUpperCase() + opt.substring(1)),
                            selected: isSelected,
                            selectedColor: const Color(0xFFE11D48),
                            backgroundColor: const Color(0xFFFFF1F3),
                            side: BorderSide(color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF)),
                            labelStyle: TextStyle(
                              color: isSelected ? Colors.white : const Color(0xFF0F172A),
                              fontSize: 12,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            ),
                            onSelected: (_) => setState(() => _answers[id] = opt),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 16),

              // Submit Button
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE11D48),
                  minimumSize: const Size.fromHeight(48),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 2,
                ),
                icon: const Icon(Icons.analytics_outlined, color: Colors.white),
                label: const Text(
                  "Run Deterministic Evaluation",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                onPressed: _submitAnswers,
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDomainTab(String code, String label) {
    final isSelected = _selectedDomain == code;
    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => setState(() => _selectedDomain = code),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFCE7EC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF)),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: const Color(0xFFE11D48).withValues(alpha: 0.25),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : const Color(0xFF9F1239),
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ),
    );
  }
}
