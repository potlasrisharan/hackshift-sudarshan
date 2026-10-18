import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../auth/presentation/providers/auth_provider.dart";
import "../providers/user_profile_provider.dart";
import "../../data/models/user_profile_model.dart";
import "../../../vitalis/presentation/providers/vitalis_provider.dart";
import "../../../her/data/models/her_models.dart";
import "../../../her/presentation/providers/her_provider.dart";

class OnboardingWizardScreen extends ConsumerStatefulWidget {
  const OnboardingWizardScreen({super.key});

  @override
  ConsumerState<OnboardingWizardScreen> createState() => _OnboardingWizardScreenState();
}

class _OnboardingWizardScreenState extends ConsumerState<OnboardingWizardScreen> {
  int _currentStep = 0;
  bool _isSaving = false;

  // Step 1: Demographics & Vitals
  String _selectedSex = "FEMALE";
  String _selectedBloodGroup = "B+";
  final _heightController = TextEditingController(text: "168");
  final _weightController = TextEditingController(text: "64");
  final _waistController = TextEditingController(text: "78");
  final _emergencyController = TextEditingController(text: "+91 98765 43210");
  final _addressController = TextEditingController(text: "New Delhi, India");

  // Flo-style Women's Health & Cycle Profile Intake
  DateTime _lastPeriodDate = DateTime.now().subtract(const Duration(days: 12));
  int _typicalCycleDays = 28;
  int _typicalPeriodDays = 5;
  String _cycleRegularity = "regular"; // regular | mostly_regular | irregular | unsure
  String _herPrimaryGoal = "cycle_tracking"; // cycle_tracking | pregnancy_planning | pcos_management | pain_relief
  String _periodFlowIntensity = "medium"; // light | medium | heavy
  int _crampSeverity = 2; // 1 to 5
  final Set<String> _selectedPcodSymptoms = {
    "irregular_cycles",
    "facial_hair",
  };

  // Step 2: Health Profile
  final Set<String> _selectedConditions = {"Hypertension"};
  final Set<String> _selectedAllergies = {"None"};
  final _medsController = TextEditingController(text: "Febuxostat 40mg");

  // Step 3: Ayurvedic Prakriti
  int _q1Answer = 1; // 0: Vata, 1: Pitta, 2: Kapha
  int _q2Answer = 1;
  int _q3Answer = 0;
  String _dietPreference = "vegetarian";
  final double _sleepHours = 7.5;
  final int _stressLevel = 2;

  // Step 4: Customization Focus
  String _primaryFocus = "longevity"; // longevity | womens_health | yoga | opd
  String _themeMode = "light";
  String _language = "hi";

  final List<String> _sexList = ["FEMALE", "MALE", "OTHER"];
  final List<String> _bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
  final List<String> _conditionsList = [
    "Hypertension",
    "Type 2 Diabetes",
    "Thyroid Disorder",
    "PCOS / PCOD",
    "Arthritis / Joint Pain",
    "Asthma / Allergies",
    "High Cholesterol",
    "None",
  ];
  final List<String> _allergiesList = [
    "None",
    "Penicillin",
    "Sulfa Drugs",
    "Peanuts",
    "Gluten",
    "Dairy / Lactose",
    "Dust / Pollen",
  ];

  @override
  void initState() {
    super.initState();
    final current = ref.read(userProfileProvider).profile;
    _heightController.text = current.heightCm?.toString() ?? "168";
    _weightController.text = current.weightKg?.toString() ?? "64";
    _waistController.text = current.waistCircumferenceCm?.toString() ?? "78";
    if (current.bloodGroup != null) _selectedBloodGroup = current.bloodGroup!;
    if (current.emergencyContact != null) _emergencyController.text = current.emergencyContact!;
    if (current.address != null) _addressController.text = current.address!;
    _primaryFocus = current.primaryFocus;
    if (current.sex.isNotEmpty) {
      _selectedSex = current.sex;
    } else {
      final name = ref.read(authProvider).session?.patientName ?? "";
      if (name.contains("Sunita")) {
        _selectedSex = "FEMALE";
        _primaryFocus = "womens_health";
      }
    }
  }

  @override
  void dispose() {
    _heightController.dispose();
    _weightController.dispose();
    _waistController.dispose();
    _emergencyController.dispose();
    _addressController.dispose();
    _medsController.dispose();
    super.dispose();
  }

  double? _computeBmi() {
    final h = double.tryParse(_heightController.text);
    final w = double.tryParse(_weightController.text);
    if (h != null && w != null && h > 0) {
      final hm = h / 100;
      return double.parse((w / (hm * hm)).toStringAsFixed(1));
    }
    return null;
  }

  String _getBmiCategory(double bmi) {
    if (bmi < 18.5) return "Underweight (Clinical Nutrition Advisory)";
    if (bmi < 23.0) return "Optimal Asian Reference (WHO-NIN)";
    if (bmi < 27.5) return "Overweight (Metabolic Surveillance)";
    return "Obese (High Priority Optimization)";
  }

  String _calculatePrimaryDosha() {
    final counts = [0, 0, 0]; // 0: Vata, 1: Pitta, 2: Kapha
    counts[_q1Answer]++;
    counts[_q2Answer]++;
    counts[_q3Answer]++;

    if (counts[0] >= 2) return "VATA";
    if (counts[1] >= 2) return "PITTA";
    if (counts[2] >= 2) return "KAPHA";
    if (counts[1] > 0 && counts[0] > 0) return "VATA_PITTA";
    if (counts[1] > 0 && counts[2] > 0) return "PITTA_KAPHA";
    return "VATA_KAPHA";
  }

  String _generatePrakritiSummary(String dosha) {
    switch (dosha) {
      case "VATA":
        return "Vata-dominant: High agility, creative thoughts, sensitive nervous system.";
      case "PITTA":
        return "Pitta-dominant: Strong digestive Agni, sharp intellect, robust metabolism.";
      case "KAPHA":
        return "Kapha-dominant: Stable constitution, strong stamina, calm temperament.";
      case "VATA_PITTA":
        return "Vata-Pitta: Dynamic mobility paired with sharp digestive fire.";
      case "PITTA_KAPHA":
        return "Pitta-Kapha: Exceptional stamina, endurance, and strong metabolic processing.";
      default:
        return "Tridoshic blend: Harmonious balance requiring seasonal adjustment.";
    }
  }

  Future<void> _handleFinish() async {
    setState(() => _isSaving = true);
    final authSession = ref.read(authProvider).session;
    final patientId = authSession?.patientId ?? "pat-048291";
    final patientName = authSession?.patientName ?? "AyuSetu Patient";
    final phone = authSession?.phone ?? "+91 98765 43210";
    final abha = authSession?.abhaNumber;

    final primaryDosha = _calculatePrimaryDosha();
    final summary = _generatePrakritiSummary(primaryDosha);

    final conditions = _selectedConditions.where((c) => c != "None").toList();
    final allergies = _selectedAllergies.where((a) => a != "None").toList();
    final meds = _medsController.text
        .split(",")
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final userProfile = UserProfile(
      patientId: patientId,
      name: patientName,
      phone: phone,
      dob: "1994-06-15",
      sex: _selectedSex,
      bloodGroup: _selectedBloodGroup,
      heightCm: double.tryParse(_heightController.text) ?? 168.0,
      weightKg: double.tryParse(_weightController.text) ?? 64.0,
      waistCircumferenceCm: double.tryParse(_waistController.text) ?? 78.0,
      abhaNumber: abha,
      emergencyContact: _emergencyController.text.trim(),
      address: _addressController.text.trim(),
      chronicConditions: conditions,
      allergies: allergies,
      medications: meds,
      primaryDosha: primaryDosha,
      secondaryDosha: "VATA",
      prakritiSummary: summary,
      dietPreference: _dietPreference,
      sleepHours: _sleepHours,
      stressLevel: _stressLevel,
      primaryFocus: _primaryFocus,
      themeMode: _themeMode,
      language: _language,
      onboardingComplete: true,
    );

    await ref.read(userProfileProvider.notifier).saveCompleteOnboarding(userProfile);

    // Sync baseline to Vitalis and HER modules
    try {
      final vitalisProf = VitalisProfileModel(
        patientId: patientId,
        yearOfBirth: 1994,
        sex: userProfile.sex,
        heightCm: userProfile.heightCm,
        weightKg: userProfile.weightKg,
        waistCircumferenceCm: userProfile.waistCircumferenceCm,
        diagnosedConditions: conditions,
        medications: meds,
        dietPreference: _dietPreference,
        goals: [_primaryFocus, "metabolic", "vitality"],
      );
      await ref.read(vitalisProvider.notifier).saveProfile(vitalisProf);

      if (_selectedSex == "FEMALE" || _primaryFocus == "womens_health") {
        final lastPeriodStr = _lastPeriodDate.toIso8601String().split("T").first;
        final herProf = HerProfileModel(
          patientId: patientId,
          yearOfBirth: 1994,
          menarcheAge: 13,
          dietPreference: _dietPreference,
          lifestyleGoals: [_herPrimaryGoal, "cycle_regularity", "hormonal_balance"],
          lastPeriodStartDate: lastPeriodStr,
          typicalCycleDays: _typicalCycleDays,
          typicalPeriodDays: _typicalPeriodDays,
          cycleRegularity: _cycleRegularity,
          primaryGoal: _herPrimaryGoal,
          pcodSymptoms: _selectedPcodSymptoms.toList(),
        );
        await ref.read(herProvider.notifier).updateProfile(herProf);

        final initialCycle = HerCycleModel(
          id: "cyc_onboarding_${DateTime.now().millisecondsSinceEpoch}",
          startDate: lastPeriodStr,
          flowIntensity: _periodFlowIntensity,
          crampsSeverity: _crampSeverity,
          notes: "Logged during initial Flo onboarding",
        );
        await ref.read(herProvider.notifier).logCycle(initialCycle);
        await ref.read(herProvider.notifier).loadAll();
      }
    } catch (_) {}

    if (!mounted) return;
    setState(() => _isSaving = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Welcome, $patientName! Your personalized portal is ready."),
        backgroundColor: AppColors.primary,
      ),
    );

    context.go("/");
  }

  @override
  Widget build(BuildContext context) {
    final bmi = _computeBmi();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: const Text(
          "Personalized Care Setup",
          style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.w800, fontSize: 17),
        ),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Text(
                "Step ${_currentStep + 1} of 4",
                style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700, fontSize: 13),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress Indicator Bar
            LinearProgressIndicator(
              value: (_currentStep + 1) / 4,
              backgroundColor: const Color(0xFFE2E8F0),
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
              minHeight: 4,
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (_currentStep == 0) _buildStep1Demographics(bmi),
                    if (_currentStep == 1) _buildStep2HealthHistory(),
                    if (_currentStep == 2) _buildStep3Ayurveda(),
                    if (_currentStep == 3) _buildStep4Customization(),
                  ],
                ),
              ),
            ),

            // Bottom Navigation Footer
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
              ),
              child: Row(
                children: [
                  if (_currentStep > 0)
                    OutlinedButton(
                      onPressed: () => setState(() => _currentStep--),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF475569),
                        side: const BorderSide(color: Color(0xFFCBD5E1)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      ),
                      child: const Text("Back", style: TextStyle(fontWeight: FontWeight.w700)),
                    ),
                  const Spacer(),
                  ElevatedButton(
                    onPressed: _isSaving
                        ? null
                        : () {
                            if (_currentStep < 3) {
                              setState(() => _currentStep++);
                            } else {
                              _handleFinish();
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    ),
                    child: _isSaving
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : Text(
                            _currentStep < 3 ? "Next Step →" : "Complete & Enter AyuSetu",
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                          ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- STEP 1: DEMOGRAPHICS & VITALS ---
  Widget _buildStep1Demographics(double? bmi) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Biometrics & Physical Baseline", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
        const SizedBox(height: 4),
        const Text("Accurate vitals calibrate your longevity index, drug dosages, and daily metabolic advice.", style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
        const SizedBox(height: 20),

        // Biological Sex Selection
        const Text("Biological Sex", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF334155))),
        const SizedBox(height: 8),
        Row(
          children: _sexList.map((sex) {
            final isSelected = _selectedSex == sex;
            return Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: ChoiceChip(
                  label: Center(
                    child: Text(
                      sex == "FEMALE" ? "Female" : (sex == "MALE" ? "Male" : "Other"),
                      style: TextStyle(fontWeight: FontWeight.w700, color: isSelected ? Colors.white : const Color(0xFF334155)),
                    ),
                  ),
                  selected: isSelected,
                  selectedColor: sex == "FEMALE" ? const Color(0xFFE11D48) : AppColors.primary,
                  backgroundColor: Colors.white,
                  onSelected: (val) {
                    if (val) {
                      setState(() {
                        _selectedSex = sex;
                        if (sex == "FEMALE") _primaryFocus = "womens_health";
                      });
                    }
                  },
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 16),

        // Blood Group Chips
        const Text("Blood Group", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF334155))),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _bloodGroups.map((bg) {
            final isSelected = _selectedBloodGroup == bg;
            return ChoiceChip(
              label: Text(bg, style: TextStyle(fontWeight: FontWeight.w700, color: isSelected ? Colors.white : const Color(0xFF334155))),
              selected: isSelected,
              selectedColor: AppColors.primary,
              backgroundColor: Colors.white,
              onSelected: (val) {
                if (val) setState(() => _selectedBloodGroup = bg);
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 20),

        // Height, Weight, Waist Row
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _heightController,
                keyboardType: TextInputType.number,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  labelText: "Height (cm)",
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TextField(
                controller: _weightController,
                keyboardType: TextInputType.number,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  labelText: "Weight (kg)",
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: TextField(
                controller: _waistController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "Waist (cm)",
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Real-time BMI card
        if (bmi != null)
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF087D71).withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text("BMI $bmi", style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primary, fontSize: 15)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    _getBmiCategory(bmi),
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Color(0xFF0F172A)),
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 20),

        TextField(
          controller: _emergencyController,
          keyboardType: TextInputType.phone,
          decoration: InputDecoration(
            labelText: "Emergency Contact Phone",
            prefixIcon: const Icon(Icons.emergency_outlined, color: Color(0xFFEF4444)),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
          ),
        ),
      ],
    );
  }

  // --- STEP 2: HEALTH PROFILE ---
  Widget _buildStep2HealthHistory() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Clinical Health Profile", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
        const SizedBox(height: 4),
        const Text("Declare diagnosed conditions and allergies for safe algorithmic cross-checks and prescription safety gates.", style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
        const SizedBox(height: 20),

        // Flo-style Women's Health & Cycle Profile Intake
        if (_selectedSex == "FEMALE" || _primaryFocus == "womens_health") ...[
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFFF1F3), Color(0xFFFFE4E6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFFDA4AF)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: const BoxDecoration(
                        color: Color(0xFFE11D48),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.water_drop_rounded, color: Colors.white, size: 16),
                    ),
                    const SizedBox(width: 8),
                    const Expanded(
                      child: Text(
                        "Flo Cycle & Hormonal Baseline Intake",
                        style: TextStyle(
                          color: Color(0xFF9F1239),
                          fontWeight: FontWeight.w800,
                          fontSize: 14,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFFDA4AF)),
                      ),
                      child: const Text(
                        "AyuSetu HER",
                        style: TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w700, fontSize: 10),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Text(
                  "Calibrates your cycle wheel, fertile window, and PCOD risk radar before entering your portal.",
                  style: TextStyle(color: Color(0xFF881337), fontSize: 12),
                ),
                const Divider(color: Color(0xFFFDA4AF), height: 22),

                // 1. Last Period Start Date
                const Text(
                  "1. First day of your last period",
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                InkWell(
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _lastPeriodDate,
                      firstDate: DateTime.now().subtract(const Duration(days: 90)),
                      lastDate: DateTime.now(),
                    );
                    if (picked != null) {
                      setState(() => _lastPeriodDate = picked);
                    }
                  },
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0xFFFDA4AF)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_month_rounded, color: Color(0xFFE11D48), size: 18),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "${_lastPeriodDate.day} ${_monthName(_lastPeriodDate.month)} ${_lastPeriodDate.year} (Started ${DateTime.now().difference(_lastPeriodDate).inDays} days ago)",
                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A)),
                          ),
                        ),
                        const Text("Change", style: TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w700, fontSize: 12)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // 2. Typical Cycle Length & Period Duration
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text("Cycle Length", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                              Text("$_typicalCycleDays days", style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Color(0xFFE11D48))),
                            ],
                          ),
                          Slider(
                            value: _typicalCycleDays.toDouble(),
                            min: 21,
                            max: 45,
                            divisions: 24,
                            activeColor: const Color(0xFFE11D48),
                            inactiveColor: Colors.white,
                            onChanged: (v) => setState(() => _typicalCycleDays = v.toInt()),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text("Period Duration", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                              Text("$_typicalPeriodDays days", style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Color(0xFFE11D48))),
                            ],
                          ),
                          Slider(
                            value: _typicalPeriodDays.toDouble(),
                            min: 2,
                            max: 10,
                            divisions: 8,
                            activeColor: const Color(0xFFE11D48),
                            inactiveColor: Colors.white,
                            onChanged: (v) => setState(() => _typicalPeriodDays = v.toInt()),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // 3. Regularity
                const Text("Cycle Regularity", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    _regularityChip("regular", "Regular (±2 days)"),
                    _regularityChip("mostly_regular", "Mostly Regular"),
                    _regularityChip("irregular", "Irregular (>5d variance)"),
                    _regularityChip("unsure", "Not Sure"),
                  ],
                ),
                const SizedBox(height: 12),

                // 4. Primary Goal
                const Text("Primary Focus in Flo / HER", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    _goalChip("cycle_tracking", "Track Cycle & PMS"),
                    _goalChip("pregnancy_planning", "Ovulation & Fertility"),
                    _goalChip("pcos_management", "Manage PCOD / PCOS"),
                    _goalChip("pain_relief", "Relieve Cramps & Pain"),
                  ],
                ),
                const SizedBox(height: 12),

                // 5. PCOD / PCOS Symptoms Screener
                const Text("PCOD / Hormonal Symptoms Experienced", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    _pcodChip("irregular_cycles", "Irregular / Skipped Periods"),
                    _pcodChip("facial_hair", "Facial Hair (Hirsutism)"),
                    _pcodChip("severe_acne", "Persistent Acne"),
                    _pcodChip("hair_thinning", "Scalp Hair Thinning"),
                    _pcodChip("weight_gain", "Difficulty Losing Weight"),
                    _pcodChip("pelvic_discomfort", "Pelvic Aching / Cramps"),
                  ],
                ),
                const SizedBox(height: 12),

                // 6. Typical Flow Intensity & Cramps
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("Period Flow", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                          const SizedBox(height: 4),
                          Wrap(
                            spacing: 4,
                            children: ["light", "medium", "heavy"].map((fl) {
                              final isSel = _periodFlowIntensity == fl;
                              return ChoiceChip(
                                label: Text(fl[0].toUpperCase() + fl.substring(1), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: isSel ? Colors.white : const Color(0xFF334155))),
                                selected: isSel,
                                selectedColor: const Color(0xFFE11D48),
                                backgroundColor: Colors.white,
                                onSelected: (val) {
                                  if (val) setState(() => _periodFlowIntensity = fl);
                                },
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text("Cramp Pain", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F172A))),
                              Text("$_crampSeverity / 5", style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: Color(0xFFE11D48))),
                            ],
                          ),
                          Slider(
                            value: _crampSeverity.toDouble(),
                            min: 1,
                            max: 5,
                            divisions: 4,
                            activeColor: const Color(0xFFE11D48),
                            inactiveColor: Colors.white,
                            onChanged: (v) => setState(() => _crampSeverity = v.toInt()),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],

        const Text("Diagnosed Chronic Conditions", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF334155))),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _conditionsList.map((cond) {
            final isSelected = _selectedConditions.contains(cond);
            return FilterChip(
              label: Text(cond, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: isSelected ? Colors.white : const Color(0xFF334155))),
              selected: isSelected,
              selectedColor: const Color(0xFF0D9488),
              backgroundColor: Colors.white,
              onSelected: (val) {
                setState(() {
                  if (cond == "None") {
                    _selectedConditions.clear();
                    if (val) _selectedConditions.add("None");
                  } else {
                    _selectedConditions.remove("None");
                    if (val) {
                      _selectedConditions.add(cond);
                    } else {
                      _selectedConditions.remove(cond);
                    }
                  }
                });
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 24),

        const Text("Known Drug & Food Allergies", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF334155))),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _allergiesList.map((allergy) {
            final isSelected = _selectedAllergies.contains(allergy);
            return FilterChip(
              label: Text(allergy, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: isSelected ? Colors.white : const Color(0xFF334155))),
              selected: isSelected,
              selectedColor: const Color(0xFFEF4444),
              backgroundColor: Colors.white,
              onSelected: (val) {
                setState(() {
                  if (allergy == "None") {
                    _selectedAllergies.clear();
                    if (val) _selectedAllergies.add("None");
                  } else {
                    _selectedAllergies.remove("None");
                    if (val) {
                      _selectedAllergies.add(allergy);
                    } else {
                      _selectedAllergies.remove(allergy);
                    }
                  }
                });
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 24),

        TextField(
          controller: _medsController,
          decoration: InputDecoration(
            labelText: "Current Medications (Comma separated)",
            hintText: "e.g. Febuxostat 40mg, Metformin 500mg",
            prefixIcon: const Icon(Icons.medication_outlined, color: AppColors.primary),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
          ),
        ),
      ],
    );
  }

  // --- STEP 3: AYURVEDIC DOSHA BASELINE ---
  Widget _buildStep3Ayurveda() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Ayurvedic Prakriti Assessment", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
        const SizedBox(height: 4),
        const Text("Discover your biological constitution (Tridosha) to personalize daily Dinacharya, nutrition, and yoga routines.", style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
        const SizedBox(height: 20),

        // Diagnostic Question 1
        _buildQuestionCard(
          question: "1. Body Frame & Energy Nature",
          selected: _q1Answer,
          options: const [
            "Slender, quick movements, prone to dryness (Vata)",
            "Medium build, warm skin, athletic, focused intensity (Pitta)",
            "Solid sturdy build, smooth skin, calm & steady endurance (Kapha)",
          ],
          onChanged: (val) => setState(() => _q1Answer = val),
        ),
        const SizedBox(height: 14),

        // Diagnostic Question 2
        _buildQuestionCard(
          question: "2. Digestion & Appetite (Agni)",
          selected: _q2Answer,
          options: const [
            "Irregular appetite, prone to bloating/gas (Vishamagni)",
            "Intense sharp hunger, irritable if meal is delayed (Tikshnagni)",
            "Slow steady digestion, can comfortably skip meals (Mandagni)",
          ],
          onChanged: (val) => setState(() => _q2Answer = val),
        ),
        const SizedBox(height: 14),

        // Diagnostic Question 3
        _buildQuestionCard(
          question: "3. Climate Sensitivity & Stress Reaction",
          selected: _q3Answer,
          options: const [
            "Dislikes cold and wind; stress manifests as worry or restlessness",
            "Dislikes extreme heat; stress manifests as frustration or impatience",
            "Dislikes cold damp weather; stress manifests as withdrawal or lethargy",
          ],
          onChanged: (val) => setState(() => _q3Answer = val),
        ),
        const SizedBox(height: 20),

        // Calculated Dosha Preview Pill
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFF0FDF4),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF86EFAC)),
          ),
          child: Row(
            children: [
              const Icon(Icons.eco_rounded, color: Color(0xFF15803D), size: 22),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Calculated Prakriti: ${_calculatePrimaryDosha()}", style: const TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF15803D), fontSize: 14)),
                    const SizedBox(height: 2),
                    Text(_generatePrakritiSummary(_calculatePrimaryDosha()), style: const TextStyle(fontSize: 12, color: Color(0xFF166534))),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Diet Preference Dropdown
        DropdownButtonFormField<String>(
          initialValue: _dietPreference,
          decoration: InputDecoration(
            labelText: "Dietary Preference",
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
          ),
          items: const [
            DropdownMenuItem(value: "vegetarian", child: Text("Lacto-Vegetarian")),
            DropdownMenuItem(value: "satvic", child: Text("Satvic Pure Ayurvedic")),
            DropdownMenuItem(value: "non-veg", child: Text("Non-Vegetarian")),
            DropdownMenuItem(value: "vegan", child: Text("Plant-Based / Vegan")),
          ],
          onChanged: (v) {
            if (v != null) setState(() => _dietPreference = v);
          },
        ),
      ],
    );
  }

  Widget _buildQuestionCard({
    required String question,
    required int selected,
    required List<String> options,
    required ValueChanged<int> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(question, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A))),
          const SizedBox(height: 8),
          ...List.generate(options.length, (idx) {
            final isChosen = selected == idx;
            return InkWell(
              onTap: () => onChanged(idx),
              borderRadius: BorderRadius.circular(8),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    Icon(
                      isChosen ? Icons.radio_button_checked : Icons.radio_button_off,
                      color: isChosen ? AppColors.primary : const Color(0xFF94A3B8),
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        options[idx],
                        style: TextStyle(fontSize: 12, fontWeight: isChosen ? FontWeight.w700 : FontWeight.w500, color: isChosen ? const Color(0xFF0F172A) : const Color(0xFF475569)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // --- STEP 4: APP CUSTOMIZATION PREFERENCES ---
  Widget _buildStep4Customization() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Customize Your Portal", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
        const SizedBox(height: 4),
        const Text("Choose your primary health focus. The home dashboard dynamically re-architects its hero card, quick actions, and alerts to match your goals.", style: TextStyle(fontSize: 13, color: Color(0xFF64748B))),
        const SizedBox(height: 20),

        const Text("Primary Health Focus", style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF0F172A))),
        const SizedBox(height: 10),

        _buildFocusCard(
          id: "longevity",
          title: "Longevity & Healthspan (Vitalis)",
          subtitle: "Cardiovascular health, biological age delta, and daily chrono-habits.",
          icon: Icons.favorite_rounded,
          accentColor: const Color(0xFF087D71),
        ),
        const SizedBox(height: 10),

        _buildFocusCard(
          id: "womens_health",
          title: "Women's Hormonal Health (HER)",
          subtitle: "Cycle compass, ovulation tracking, PCOS/PCOD monitoring, and holistic wellness.",
          icon: Icons.spa_rounded,
          accentColor: const Color(0xFFE11D48),
        ),
        const SizedBox(height: 10),

        _buildFocusCard(
          id: "yoga",
          title: "Yoga, Ayush & Recovery",
          subtitle: "Personalized Dosha asana routines, pranayama breathwork, and herbal guidance.",
          icon: Icons.self_improvement_rounded,
          accentColor: const Color(0xFFD97706),
        ),
        const SizedBox(height: 10),

        _buildFocusCard(
          id: "opd",
          title: "Clinic Operations & Doctor Visits",
          subtitle: "Active OPD token queue, doctor consultation, and prescription refills.",
          icon: Icons.local_hospital_rounded,
          accentColor: const Color(0xFF2563EB),
        ),
        const SizedBox(height: 24),

        // Language & Theme Row
        Row(
          children: [
            Expanded(
              child: DropdownButtonFormField<String>(
                initialValue: _language,
                decoration: InputDecoration(
                  labelText: "App Language",
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                ),
                items: const [
                  DropdownMenuItem(value: "hi", child: Text("Hindi (हिंदी)")),
                  DropdownMenuItem(value: "en", child: Text("English")),
                  DropdownMenuItem(value: "te", child: Text("Telugu (తెలుగు)")),
                  DropdownMenuItem(value: "ta", child: Text("Tamil (தமிழ்)")),
                ],
                onChanged: (v) {
                  if (v != null) setState(() => _language = v);
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: DropdownButtonFormField<String>(
                initialValue: _themeMode,
                decoration: InputDecoration(
                  labelText: "Theme Mode",
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                ),
                items: const [
                  DropdownMenuItem(value: "light", child: Text("Light Botanical")),
                  DropdownMenuItem(value: "dark", child: Text("Dark Slate")),
                  DropdownMenuItem(value: "system", child: Text("System Default")),
                ],
                onChanged: (v) {
                  if (v != null) setState(() => _themeMode = v);
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildFocusCard({
    required String id,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
  }) {
    final isSelected = _primaryFocus == id;

    return InkWell(
      onTap: () => setState(() => _primaryFocus = id),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? accentColor : const Color(0xFFE2E8F0),
            width: isSelected ? 2.0 : 1.0,
          ),
          boxShadow: isSelected
              ? [BoxShadow(color: accentColor.withValues(alpha: 0.12), blurRadius: 8, offset: const Offset(0, 2))]
              : null,
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: accentColor.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: accentColor, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: isSelected ? accentColor : const Color(0xFF0F172A))),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.3)),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
              color: isSelected ? accentColor : const Color(0xFFCBD5E1),
              size: 22,
            ),
          ],
        ),
      ),
    );
  }

  Widget _regularityChip(String id, String label) {
    final isSelected = _cycleRegularity == id;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: isSelected ? Colors.white : const Color(0xFF334155))),
      selected: isSelected,
      selectedColor: const Color(0xFFE11D48),
      backgroundColor: Colors.white,
      onSelected: (val) {
        if (val) setState(() => _cycleRegularity = id);
      },
    );
  }

  Widget _goalChip(String id, String label) {
    final isSelected = _herPrimaryGoal == id;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: isSelected ? Colors.white : const Color(0xFF334155))),
      selected: isSelected,
      selectedColor: const Color(0xFFE11D48),
      backgroundColor: Colors.white,
      onSelected: (val) {
        if (val) setState(() => _herPrimaryGoal = id);
      },
    );
  }

  Widget _pcodChip(String id, String label) {
    final isSelected = _selectedPcodSymptoms.contains(id);
    return FilterChip(
      label: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: isSelected ? Colors.white : const Color(0xFF334155))),
      selected: isSelected,
      selectedColor: const Color(0xFFBE185D),
      backgroundColor: Colors.white,
      onSelected: (val) {
        setState(() {
          if (val) {
            _selectedPcodSymptoms.add(id);
          } else {
            _selectedPcodSymptoms.remove(id);
          }
        });
      },
    );
  }

  String _monthName(int month) {
    const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return m[(month - 1) % 12];
  }
}
