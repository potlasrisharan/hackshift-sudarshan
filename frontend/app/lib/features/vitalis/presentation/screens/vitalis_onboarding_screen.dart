import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisOnboardingScreen extends ConsumerStatefulWidget {
  const VitalisOnboardingScreen({super.key});

  @override
  ConsumerState<VitalisOnboardingScreen> createState() => _VitalisOnboardingScreenState();
}

class _VitalisOnboardingScreenState extends ConsumerState<VitalisOnboardingScreen> {
  int _currentStep = 0;

  late TextEditingController _yobController;
  late TextEditingController _heightController;
  late TextEditingController _weightController;
  late TextEditingController _waistController;
  late TextEditingController _conditionsController;
  late TextEditingController _medsController;

  String _sex = "MALE";
  String _diet = "vegetarian";
  bool _consentGranted = true;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(vitalisProvider).profile;
    _yobController = TextEditingController(text: profile.yearOfBirth.toString());
    _heightController = TextEditingController(text: profile.heightCm?.toString() ?? "172");
    _weightController = TextEditingController(text: profile.weightKg?.toString() ?? "78");
    _waistController = TextEditingController(text: profile.waistCircumferenceCm?.toString() ?? "90");
    _conditionsController = TextEditingController(text: profile.diagnosedConditions.join(", "));
    _medsController = TextEditingController(text: profile.medications.join(", "));
    _sex = profile.sex;
    _diet = profile.dietPreference;
  }

  @override
  void dispose() {
    _yobController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _waistController.dispose();
    _conditionsController.dispose();
    _medsController.dispose();
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

  void _saveProfile() {
    final yob = int.tryParse(_yobController.text) ?? 1980;
    final h = double.tryParse(_heightController.text);
    final w = double.tryParse(_weightController.text);
    final waist = double.tryParse(_waistController.text);

    final conditions = _conditionsController.text
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.isNotEmpty)
        .toList();

    final meds = _medsController.text
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.isNotEmpty)
        .toList();

    final updated = VitalisProfileModel(
      patientId: ref.read(vitalisProvider).profile.patientId,
      yearOfBirth: yob,
      sex: _sex,
      heightCm: h,
      weightKg: w,
      waistCircumferenceCm: waist,
      diagnosedConditions: conditions,
      medications: meds,
      dietPreference: _diet,
    );

    ref.read(vitalisProvider.notifier).updateProfile(updated);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Vitalis Profile Saved Successfully")),
    );
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    final bmi = _calculateBmi();

    return AppScaffoldShell(
      title: "Vitalis Profile & Goals",
      subtitle: "Personalized Preventive Health Onboarding",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStepIndicator(),
            const SizedBox(height: 20),
            if (_currentStep == 0) _buildDemographicsStep(),
            if (_currentStep == 1) _buildAnthropometricsStep(bmi),
            if (_currentStep == 2) _buildConditionsStep(),
            if (_currentStep == 3) _buildLifestyleStep(),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (_currentStep > 0)
                  OutlinedButton(
                    onPressed: () => setState(() => _currentStep--),
                    child: const Text("Previous"),
                  )
                else
                  const SizedBox.shrink(),
                ElevatedButton(
                  onPressed: () {
                    if (_currentStep < 3) {
                      setState(() => _currentStep++);
                    } else {
                      _saveProfile();
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.vitalisTeal),
                  child: Text(_currentStep < 3 ? "Continue" : "Complete & Save"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Row(
      children: [
        for (int i = 0; i < 4; i++)
          Expanded(
            child: Container(
              height: 4,
              margin: const EdgeInsets.symmetric(horizontal: 2),
              decoration: BoxDecoration(
                color: i <= _currentStep ? AppColors.vitalisTeal : AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(2),
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
        const Text("Step 1: Core Demographics", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        const SizedBox(height: 6),
        const Text("Used strictly for age-appropriate preventive guidelines and cohort reference bands.", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
        const SizedBox(height: 16),
        TextField(
          controller: _yobController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(
            labelText: "Year of Birth (e.g. 1978)",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        const Text("Biological Sex for Clinical Guidelines", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        const SizedBox(height: 8),
        Row(
          children: [
            _buildRadioChip("MALE", "Male"),
            const SizedBox(width: 8),
            _buildRadioChip("FEMALE", "Female"),
            const SizedBox(width: 8),
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
        const Text("Step 2: Body Measurements", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _heightController,
                keyboardType: TextInputType.number,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(labelText: "Height (cm)", border: OutlineInputBorder()),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: _weightController,
                keyboardType: TextInputType.number,
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(labelText: "Weight (kg)", border: OutlineInputBorder()),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _waistController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: "Waist Circumference (cm, optional)", border: OutlineInputBorder()),
        ),
        const SizedBox(height: 16),
        if (bmi != null)
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
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
                      Text("Calculated BMI: $bmi kg/m²", style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      const Text("BMI is an anthropometric population screen, not a medical diagnosis.", style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
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
        const Text("Step 3: Clinical Background", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        const SizedBox(height: 16),
        TextField(
          controller: _conditionsController,
          decoration: const InputDecoration(
            labelText: "Diagnosed Conditions (comma-separated)",
            hintText: "e.g. Hypertension, Pre-diabetes, Hypothyroidism",
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _medsController,
          decoration: const InputDecoration(
            labelText: "Current Medications (comma-separated)",
            hintText: "e.g. Metformin 500mg, Telmisartan 40mg",
            border: OutlineInputBorder(),
          ),
        ),
      ],
    );
  }

  Widget _buildLifestyleStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Step 4: Dietary & Privacy Consent", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        const SizedBox(height: 16),
        const Text("Dietary Preference", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: [
            _buildDietChip("vegetarian", "Vegetarian"),
            _buildDietChip("vegan", "Vegan"),
            _buildDietChip("eggetarian", "Eggetarian"),
            _buildDietChip("mixed", "Mixed / Omnivore"),
          ],
        ),
        const SizedBox(height: 20),
        CheckboxListTile(
          value: _consentGranted,
          onChanged: (val) => setState(() => _consentGranted = val ?? true),
          title: const Text("Consent to ingest health telemetry", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
          subtitle: const Text("Allows computing evidence-grounded healthspan trends. HER reproductive data remains isolated.", style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          activeColor: AppColors.vitalisTeal,
          contentPadding: EdgeInsets.zero,
        ),
      ],
    );
  }

  Widget _buildRadioChip(String val, String label) {
    return ChoiceChip(
      selected: _sex == val,
      label: Text(label),
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
}

extension IterableExt<T> on Iterable<T> {
  Iterable<T> filter(bool Function(T) test) => where(test);
}
