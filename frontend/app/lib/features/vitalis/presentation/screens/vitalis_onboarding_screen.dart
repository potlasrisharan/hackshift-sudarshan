import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:shared_preferences/shared_preferences.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../../../core/app_session.dart";
import "../providers/vitalis_provider.dart";
import "../../../her/presentation/providers/her_provider.dart";
import "../../../her/data/models/her_models.dart";

class VitalisOnboardingScreen extends ConsumerStatefulWidget {
  const VitalisOnboardingScreen({super.key});

  @override
  ConsumerState<VitalisOnboardingScreen> createState() => _VitalisOnboardingScreenState();
}

class _VitalisOnboardingScreenState extends ConsumerState<VitalisOnboardingScreen> {
  int _currentStep = 0;
  bool _isSaving = false;

  late TextEditingController _yobController;
  late TextEditingController _heightController;
  late TextEditingController _weightController;
  late TextEditingController _waistController;
  late TextEditingController _conditionsController;
  late TextEditingController _medsController;

  // HER Controllers
  late TextEditingController _menarcheAgeController;
  late TextEditingController _cycleLengthController;
  late TextEditingController _periodDurationController;

  String _sex = "FEMALE";
  String _diet = "vegetarian";
  String _smokingStatus = "never";
  String _alcoholIntake = "none";
  bool _clinicianRestrictedExertion = false;
  final Set<String> _selectedLongevityGoals = {"energy", "sleep", "cardio", "metabolic"};
  bool _consentGranted = true;

  // HER State
  String _flowIntensity = "medium";
  double _crampsSeverity = 3.0;
  bool _isPregnantOrLactating = false;
  bool _hormonalContraception = false;
  final Set<String> _selectedHerGoals = {"cycle_regularity", "hormonal_balance"};

  int get _totalSteps => _sex == "FEMALE" ? 5 : 4;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(vitalisProvider).profile;
    _yobController = TextEditingController(text: profile.yearOfBirth.toString());
    _heightController = TextEditingController(text: profile.heightCm?.toString() ?? "168");
    _weightController = TextEditingController(text: profile.weightKg?.toString() ?? "64");
    _waistController = TextEditingController(text: profile.waistCircumferenceCm?.toString() ?? "78");
    _conditionsController = TextEditingController(text: profile.diagnosedConditions.join(", "));
    _medsController = TextEditingController(text: profile.medications.join(", "));
    _sex = profile.sex == "OTHER" ? "FEMALE" : profile.sex;
    _diet = profile.dietPreference;
    _smokingStatus = profile.smokingStatus;
    _alcoholIntake = profile.alcoholIntake;
    _clinicianRestrictedExertion = profile.clinicianRestrictedExertion;
    if (profile.goals.isNotEmpty) {
      _selectedLongevityGoals.clear();
      _selectedLongevityGoals.addAll(profile.goals);
    }

    final herProfile = ref.read(herProvider).profile;
    _menarcheAgeController = TextEditingController(text: herProfile.menarcheAge?.toString() ?? "13");
    _cycleLengthController = TextEditingController(text: "28");
    _periodDurationController = TextEditingController(text: "5");
    _isPregnantOrLactating = herProfile.isPregnantOrLactating;
    _hormonalContraception = herProfile.hormonalContraception;
    if (herProfile.lifestyleGoals.isNotEmpty) {
      _selectedHerGoals.clear();
      _selectedHerGoals.addAll(herProfile.lifestyleGoals);
    }
  }

  @override
  void dispose() {
    _yobController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _waistController.dispose();
    _conditionsController.dispose();
    _medsController.dispose();
    _menarcheAgeController.dispose();
    _cycleLengthController.dispose();
    _periodDurationController.dispose();
    super.dispose();
  }

  double? _calculateBmi() {
    final h = double.tryParse(_heightController.text);
    final w = double.tryParse(_weightController.text);
    if (h != null && w != null && h > 0) {
      final hm = h / 100;
      return double.parse((w / (hm * hm)).toStringAsFixed(1));
    }
    return null;
  }

  String _bmiRiskCategory(double bmi) {
    if (bmi < 18.5) return "Underweight (Clinical Nutrition Advisory)";
    if (bmi < 23.0) return "Optimal Asian Reference Band (WHO-NIN)";
    if (bmi < 27.5) return "Overweight (Cardiometabolic Surveillance)";
    return "Obese (Priority Metabolic & Insulin Optimization)";
  }

  Future<void> _saveProfile() async {
    setState(() => _isSaving = true);
    final yob = int.tryParse(_yobController.text) ?? 1990;
    final h = double.tryParse(_heightController.text);
    final w = double.tryParse(_weightController.text);
    final waist = double.tryParse(_waistController.text);

    final conditions = _conditionsController.text
        .split(",")
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final meds = _medsController.text
        .split(",")
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final vitalisProfile = VitalisProfileModel(
      patientId: ref.read(vitalisProvider).profile.patientId,
      yearOfBirth: yob,
      sex: _sex,
      heightCm: h,
      weightKg: w,
      waistCircumferenceCm: waist,
      diagnosedConditions: conditions,
      medications: meds,
      dietPreference: _diet,
      smokingStatus: _smokingStatus,
      alcoholIntake: _alcoholIntake,
      clinicianRestrictedExertion: _clinicianRestrictedExertion,
      goals: _selectedLongevityGoals.toList(),
    );

    await ref.read(vitalisProvider.notifier).saveProfile(vitalisProfile);

    if (_sex == "FEMALE") {
      final menarche = int.tryParse(_menarcheAgeController.text);
      final herProfile = HerProfileModel(
        patientId: ref.read(herProvider).profile.patientId,
        yearOfBirth: yob,
        menarcheAge: menarche,
        isPregnantOrLactating: _isPregnantOrLactating,
        hormonalContraception: _hormonalContraception,
        dietPreference: _diet,
        lifestyleGoals: _selectedHerGoals.toList(),
      );

      await ref.read(herProvider.notifier).updateProfile(herProfile);

      final cycleLen = int.tryParse(_cycleLengthController.text);
      final periodLen = int.tryParse(_periodDurationController.text);
      if (cycleLen != null || periodLen != null) {
        final baselineCycle = HerCycleModel(
          id: "cyc_onboard_${DateTime.now().millisecondsSinceEpoch}",
          startDate: DateTime.now().subtract(Duration(days: periodLen ?? 5)).toIso8601String().substring(0, 10),
          cycleLengthDays: cycleLen ?? 28,
          periodLengthDays: periodLen ?? 5,
          flowIntensity: _flowIntensity,
          crampsSeverity: _crampsSeverity.toInt(),
          notes: "Baseline cycle entered during onboarding",
        );
        await ref.read(herProvider.notifier).logCycle(baselineCycle);
      }
    }

    final preferences = await SharedPreferences.getInstance();
    await preferences.setBool(AppSession.onboardingKey, true);
    AppSession.onboardingComplete = true;

    if (!mounted) return;
    setState(() => _isSaving = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Your health profile is ready"),
        backgroundColor: AppColors.medicalTeal,
      ),
    );

    context.go("/");
  }

  @override
  Widget build(BuildContext context) {
    if (_currentStep >= _totalSteps) {
      _currentStep = _totalSteps - 1;
    }
    final bmi = _calculateBmi();

    return AppScaffoldShell(
      title: "AyuSetu Health Onboarding",
      subtitle: _sex == "FEMALE"
          ? "Step ${_currentStep + 1} of 5 · Longevity & Women's Health"
          : "Step ${_currentStep + 1} of 4 · Preventive Healthspan",
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFE5ECE9)),
                boxShadow: const [
                  BoxShadow(color: Color(0x0A173C34), blurRadius: 20, offset: Offset(0, 8)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStepIndicator(),
                  const SizedBox(height: 24),
                  if (_currentStep == 0) _buildDemographicsStep(),
                  if (_currentStep == 1) _buildAnthropometricsStep(bmi),
                  if (_currentStep == 2) _buildConditionsStep(),
                  if (_currentStep == 3) _buildLifestyleStep(),
                  if (_currentStep == 4 && _sex == "FEMALE") _buildHerStep(),
                ],
              ),
            ),
            const SizedBox(height: 28),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (_currentStep > 0) ...[
                  Expanded(
                    flex: 2,
                    child: OutlinedButton.icon(
                      onPressed: _isSaving ? null : () => setState(() => _currentStep--),
                      icon: const Icon(Icons.arrow_back_rounded, size: 16),
                      label: const Text("Previous", overflow: TextOverflow.ellipsis),
                    ),
                  ),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  flex: 3,
                  child: ElevatedButton.icon(
                    onPressed: _isSaving
                        ? null
                        : () {
                            if (_currentStep < _totalSteps - 1) {
                              setState(() => _currentStep++);
                            } else {
                              _saveProfile();
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _sex == "FEMALE" && _currentStep == 4 ? AppColors.herPink : AppColors.vitalisTeal,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    icon: _isSaving
                        ? const SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : Icon(
                            _currentStep < _totalSteps - 1 ? Icons.arrow_forward_rounded : Icons.check_circle_outline_rounded,
                            size: 16,
                          ),
                    label: Text(
                      _isSaving
                          ? "Saving..."
                          : (_currentStep < _totalSteps - 1 ? "Continue" : "Complete & Save"),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Center(
              child: Text(
                AppStrings.appName,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.5,
                  color: Color(0xFF94A3B8),
                ),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildStepIndicator() {
    final steps = _totalSteps;
    return Row(
      children: [
        for (int i = 0; i < steps; i++)
          Expanded(
            child: Container(
              height: 5,
              margin: const EdgeInsets.symmetric(horizontal: 2),
              decoration: BoxDecoration(
                color: i <= _currentStep
                    ? (i == 4 ? AppColors.herPink : AppColors.vitalisTeal)
                    : AppColors.lightBorder,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildDemographicsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Step 1: Core Demographics", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 6),
        const Text("Used strictly for clinical guidelines, longevity baselines, and age-adjusted risk scoring.", style: TextStyle(fontSize: 12, color: AppColors.lightTextSecondary)),
        const SizedBox(height: 16),
        TextField(
          controller: _yobController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: "Year of birth",
            hintText: "For example, 1994",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 18),
        const Text("Biological Sex for Clinical Guidelines", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 4),
        const Text("Selecting Female unlocks the AyuSetu HER hormonal wellness and cycle tracking module.", style: TextStyle(fontSize: 11, color: AppColors.lightTextSecondary)),
        const SizedBox(height: 10),
        Wrap(
          spacing: 10,
          runSpacing: 8,
          children: [
            _buildRadioChip("FEMALE", "Female (Enables HER Care)"),
            _buildRadioChip("MALE", "Male"),
            _buildRadioChip("OTHER", "Other"),
          ],
        ),
      ],
    );
  }

  Widget _buildAnthropometricsStep(double? bmi) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Step 2: Body Measurements", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 6),
        const Text("Computes body composition indices and evidence-based metabolic risk bands.", style: TextStyle(fontSize: 12, color: AppColors.lightTextSecondary)),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _heightController,
                keyboardType: TextInputType.number,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(labelText: "Height (cm)"),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: _weightController,
                keyboardType: TextInputType.number,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(labelText: "Weight (kg)"),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _waistController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: "Waist circumference (optional)", suffixText: "cm"),
        ),
        const SizedBox(height: 16),
        if (bmi != null)
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.lightSurfaceElevated,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.vitalisTeal.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.calculate_outlined, color: AppColors.vitalisTeal),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Calculated BMI: $bmi kg/m²", style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary)),
                      const SizedBox(height: 2),
                      Text(_bmiRiskCategory(bmi), style: const TextStyle(fontSize: 11, color: AppColors.lightTextSecondary)),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildConditionsStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Step 3: Clinical Background & Safety Gate", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 6),
        const Text("Informs the Vitalis V0 safety gate and medication interaction safeguards.", style: TextStyle(fontSize: 12, color: AppColors.lightTextSecondary)),
        const SizedBox(height: 16),
        TextField(
          controller: _conditionsController,
          decoration: const InputDecoration(
            labelText: "Diagnosed conditions",
            hintText: "For example, hypertension or asthma",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _medsController,
          decoration: const InputDecoration(
            labelText: "Current medicines",
            hintText: "Separate multiple medicines with commas",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 18),
        Container(
          decoration: BoxDecoration(
            color: AppColors.lightSurfaceElevated,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.lightBorder),
          ),
          child: SwitchListTile(
            value: _clinicianRestrictedExertion,
            onChanged: (val) => setState(() => _clinicianRestrictedExertion = val),
            title: const Text("Clinician Restricted Physical Exertion", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary)),
            subtitle: const Text("Has a cardiologist or physician instructed avoiding vigorous physical exercise?", style: TextStyle(fontSize: 11, color: AppColors.lightTextSecondary)),
            activeThumbColor: AppColors.warning,
          ),
        ),
      ],
    );
  }

  Widget _buildLifestyleStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Step 4: Lifestyle, Habits & Goals", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 6),
        const Text("Tunes Indian nutritional models, sleep regularity indices, and longevity priorities.", style: TextStyle(fontSize: 12, color: AppColors.lightTextSecondary)),
        const SizedBox(height: 14),
        const Text("Dietary Pattern", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            _buildDietChip("vegetarian", "Vegetarian"),
            _buildDietChip("vegan", "Vegan"),
            _buildDietChip("eggetarian", "Eggetarian"),
            _buildDietChip("mixed", "Mixed / Non-Veg"),
          ],
        ),
        const SizedBox(height: 14),
        const Text("Smoking Status", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            _buildSmokingChip("never", "Never"),
            _buildSmokingChip("former", "Former Smoker"),
            _buildSmokingChip("current", "Current Smoker"),
          ],
        ),
        const SizedBox(height: 14),
        const Text("Alcohol Consumption", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            _buildAlcoholChip("none", "None"),
            _buildAlcoholChip("occasional", "Occasional"),
            _buildAlcoholChip("moderate", "Moderate"),
          ],
        ),
        const SizedBox(height: 16),
        const Text("Primary Longevity & Healthspan Goals", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            _buildLongevityGoalChip("energy", "Energy & Vitality"),
            _buildLongevityGoalChip("sleep", "Restorative Sleep"),
            _buildLongevityGoalChip("cardio", "Cardio VO2max"),
            _buildLongevityGoalChip("strength", "Muscle & Strength"),
            _buildLongevityGoalChip("metabolic", "Metabolic Health"),
            _buildLongevityGoalChip("mobility", "Joint Mobility"),
            _buildLongevityGoalChip("preventive", "Preventive Longevity"),
          ],
        ),
        const SizedBox(height: 18),
        CheckboxListTile(
          value: _consentGranted,
          onChanged: (val) => setState(() => _consentGranted = val ?? true),
          title: const Text("Consent to ingest health telemetry", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
          subtitle: const Text("Allows computing evidence-grounded healthspan trends. HER reproductive data remains isolated.", style: TextStyle(fontSize: 11, color: AppColors.lightTextSecondary)),
          activeColor: AppColors.vitalisTeal,
          contentPadding: EdgeInsets.zero,
        ),
      ],
    );
  }

  Widget _buildHerStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppColors.herPink.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text("HER SUITE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.herPink)),
            ),
            const SizedBox(width: 8),
            const Expanded(
              child: Text(
                "Step 5: Women's Health & Hormonal Care",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        const Text("Reproductive telemetry is kept strictly isolated. Evaluates cycle deviation, ovulation phases, and screening risk.", style: TextStyle(fontSize: 12, color: AppColors.lightTextSecondary)),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _menarcheAgeController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: "Age at first period"),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: _cycleLengthController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: "Cycle length", suffixText: "days"),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        TextField(
          controller: _periodDurationController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: "Period duration", suffixText: "days"),
        ),
        const SizedBox(height: 16),
        const Text("Menstrual Flow Intensity", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            _buildFlowChip("light", "Light"),
            _buildFlowChip("medium", "Medium / Moderate"),
            _buildFlowChip("heavy", "Heavy"),
            _buildFlowChip("very_heavy", "Very Heavy (Clots)"),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("Cramps / Dysmenorrhea Severity (0-10)", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
            Text("${_crampsSeverity.toInt()} / 10", style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.herPink)),
          ],
        ),
        Slider(
          value: _crampsSeverity,
          min: 0,
          max: 10,
          divisions: 10,
          activeColor: AppColors.herPink,
          onChanged: (val) => setState(() => _crampsSeverity = val),
        ),
        const SizedBox(height: 10),
        Container(
          decoration: BoxDecoration(
            color: AppColors.lightSurfaceElevated,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.lightBorder),
          ),
          child: Column(
            children: [
              SwitchListTile(
                value: _isPregnantOrLactating,
                onChanged: (val) => setState(() => _isPregnantOrLactating = val),
                title: const Text("Currently Pregnant or Lactating", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
                subtitle: const Text("Adapts screening algorithms and nutritional allowances.", style: TextStyle(fontSize: 11, color: AppColors.lightTextSecondary)),
                activeThumbColor: AppColors.herPink,
              ),
              const Divider(height: 1, color: AppColors.lightBorder),
              SwitchListTile(
                value: _hormonalContraception,
                onChanged: (val) => setState(() => _hormonalContraception = val),
                title: const Text("Hormonal Contraceptive Use", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
                subtitle: const Text("Accounts for synthetic progestin / estrogen withdrawal bleeds.", style: TextStyle(fontSize: 11, color: AppColors.lightTextSecondary)),
                activeThumbColor: AppColors.herPink,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        const Text("Women's Health & Hormonal Priorities", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            _buildHerGoalChip("cycle_regularity", "Cycle Regularity"),
            _buildHerGoalChip("hormonal_balance", "Hormonal Balance"),
            _buildHerGoalChip("fertility_tracking", "Fertility & Ovulation"),
            _buildHerGoalChip("pcos_management", "PCOS / PCOD Support"),
            _buildHerGoalChip("menopause_support", "Perimenopause Care"),
          ],
        ),
      ],
    );
  }

  Widget _buildRadioChip(String val, String label) {
    return ChoiceChip(
      selected: _sex == val,
      label: Text(label),
      selectedColor: val == "FEMALE" ? AppColors.herPink.withValues(alpha: 0.25) : null,
      onSelected: (selected) {
        if (selected) setState(() => _sex = val);
      },
    );
  }

  Widget _buildDietChip(String val, String label) {
    return ChoiceChip(
      selected: _diet == val,
      label: Text(label),
      onSelected: (selected) {
        if (selected) setState(() => _diet = val);
      },
    );
  }

  Widget _buildSmokingChip(String val, String label) {
    return ChoiceChip(
      selected: _smokingStatus == val,
      label: Text(label),
      onSelected: (selected) {
        if (selected) setState(() => _smokingStatus = val);
      },
    );
  }

  Widget _buildAlcoholChip(String val, String label) {
    return ChoiceChip(
      selected: _alcoholIntake == val,
      label: Text(label),
      onSelected: (selected) {
        if (selected) setState(() => _alcoholIntake = val);
      },
    );
  }

  Widget _buildFlowChip(String val, String label) {
    return ChoiceChip(
      selected: _flowIntensity == val,
      label: Text(label),
      selectedColor: AppColors.herPink.withValues(alpha: 0.25),
      onSelected: (selected) {
        if (selected) setState(() => _flowIntensity = val);
      },
    );
  }

  Widget _buildLongevityGoalChip(String val, String label) {
    final selected = _selectedLongevityGoals.contains(val);
    return FilterChip(
      selected: selected,
      label: Text(label),
      onSelected: (active) {
        setState(() {
          if (active) {
            _selectedLongevityGoals.add(val);
          } else {
            _selectedLongevityGoals.remove(val);
          }
        });
      },
    );
  }

  Widget _buildHerGoalChip(String val, String label) {
    final selected = _selectedHerGoals.contains(val);
    return FilterChip(
      selected: selected,
      label: Text(label),
      selectedColor: AppColors.herPink.withValues(alpha: 0.2),
      onSelected: (active) {
        setState(() {
          if (active) {
            _selectedHerGoals.add(val);
          } else {
            _selectedHerGoals.remove(val);
          }
        });
      },
    );
  }
}
