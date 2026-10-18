import "dart:convert";
import "package:http/http.dart" as http;
import "package:shared_preferences/shared_preferences.dart";
import "../models/her_models.dart";
import "../../../../core/network/api_config.dart";

class HerApiService {
  final String baseUrl;
  final String patientId;

  const HerApiService({
    this.baseUrl = "${ApiConfig.baseUrl}/her",
    this.patientId = "demo_patient_her",
  });

  Map<String, String> get _headers => {
        "Content-Type": "application/json",
        "X-Patient-Id": patientId,
      };

  String _cacheKey(String sub) => "ayusetu_her_${patientId}_$sub";

  Future<SharedPreferences?> _getPrefs() async {
    try {
      return await SharedPreferences.getInstance();
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveLocalProfile(HerProfileModel profile) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;
    await prefs.setString(_cacheKey("profile"), jsonEncode(profile.toJson()));
  }

  Future<HerProfileModel?> _loadLocalProfile() async {
    final prefs = await _getPrefs();
    if (prefs == null) return null;
    final raw = prefs.getString(_cacheKey("profile"));
    if (raw == null) return null;
    try {
      final data = jsonDecode(raw) as Map<String, Object?>;
      return HerProfileModel.fromJson(data);
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveLocalCycles(
      List<HerCycleModel> cycles, HerCycleAnalysisModel analysis) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;
    await prefs.setString(
      _cacheKey("cycles"),
      jsonEncode(cycles.map((c) => c.toJson()).toList()),
    );
    await prefs.setString(
      _cacheKey("cycle_analysis"),
      jsonEncode(analysis.toJson()),
    );
  }

  Future<(List<HerCycleModel>, HerCycleAnalysisModel)?> _loadLocalCycles() async {
    final prefs = await _getPrefs();
    if (prefs == null) return null;
    final rawCycles = prefs.getString(_cacheKey("cycles"));
    if (rawCycles == null) return null;
    try {
      final list = (jsonDecode(rawCycles) as List<Object?>)
          .map((c) => HerCycleModel.fromJson(c as Map<String, Object?>))
          .toList();
      final rawAnalysis = prefs.getString(_cacheKey("cycle_analysis"));
      final analysis = rawAnalysis != null
          ? HerCycleAnalysisModel.fromJson(
              jsonDecode(rawAnalysis) as Map<String, Object?>)
          : _computeLocalCycleAnalysis(list);
      return (list, analysis);
    } catch (_) {
      return null;
    }
  }

  HerCycleAnalysisModel _computeLocalCycleAnalysis(List<HerCycleModel> cycles) {
    if (cycles.isEmpty) {
      return const HerCycleAnalysisModel(status: "INSUFFICIENT_DATA");
    }
    if (cycles.length == 1) {
      final c = cycles.first;
      final len = c.cycleLengthDays ?? 28;
      return HerCycleAnalysisModel(
        status: "RECORDING_BASELINE",
        totalIntervals: 0,
        meanLengthDays: len.toDouble(),
        medianLengthDays: len,
        shortestCycleDays: len,
        longestCycleDays: len,
        caveats: const ["Baseline cycle recorded. Log consecutive cycles to calibrate interval radar."],
      );
    }

    final lengths = <int>[];
    for (int i = 0; i < cycles.length; i++) {
      if (cycles[i].cycleLengthDays != null) {
        lengths.add(cycles[i].cycleLengthDays!);
      } else if (i < cycles.length - 1) {
        final d1 = DateTime.tryParse(cycles[i].startDate);
        final d2 = DateTime.tryParse(cycles[i + 1].startDate);
        if (d1 != null && d2 != null) {
          final diff = (d1.difference(d2).inDays).abs();
          if (diff >= 15 && diff <= 120) lengths.add(diff);
        }
      }
    }

    if (lengths.isEmpty) {
      return HerCycleAnalysisModel(
        status: "RECORDING_BASELINE",
        totalIntervals: cycles.length - 1,
        caveats: const ["Dates logged. Cycle interval calculations will update automatically."],
      );
    }

    final mean = lengths.reduce((a, b) => a + b) / lengths.length;
    final sorted = [...lengths]..sort();
    final median = sorted[sorted.length ~/ 2];
    final shortest = sorted.first;
    final longest = sorted.last;
    final variance = lengths
            .map((x) => (x - mean) * (x - mean))
            .reduce((a, b) => a + b) /
        lengths.length;
    double stdDev = 0.0;
    if (variance > 0) {
      double g = variance / 2.0;
      for (int i = 0; i < 10; i++) {
        g = (g + variance / g) / 2.0;
      }
      stdDev = g;
    }

    final hasIrregularity = (longest - shortest) > 7 || stdDev > 4.5 || shortest < 21 || longest > 35;
    final irregularityFlags = <String>[];
    if (shortest < 21) irregularityFlags.add("Polymenorrhea (cycle < 21 days)");
    if (longest > 35) irregularityFlags.add("Oligomenorrhea (cycle > 35 days)");
    if ((longest - shortest) > 7) irregularityFlags.add("Interval variance > 7 days");

    return HerCycleAnalysisModel(
      status: hasIrregularity ? "IRREGULAR" : "NORMAL",
      totalIntervals: lengths.length,
      meanLengthDays: double.parse(mean.toStringAsFixed(1)),
      stdDevDays: double.parse(stdDev.toStringAsFixed(1)),
      medianLengthDays: median,
      shortestCycleDays: shortest,
      longestCycleDays: longest,
      hasIrregularity: hasIrregularity,
      irregularityFlags: irregularityFlags,
      caveats: const ["Deterministic interval telemetry calculated from patient logs."],
    );
  }

  Future<void> _saveLocalSymptoms(List<HerSymptomModel> symptoms) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;
    await prefs.setString(
      _cacheKey("symptoms"),
      jsonEncode(symptoms.map((s) => s.toJson()).toList()),
    );
  }

  Future<List<HerSymptomModel>> _loadLocalSymptoms() async {
    final prefs = await _getPrefs();
    if (prefs == null) return const [];
    final raw = prefs.getString(_cacheKey("symptoms"));
    if (raw == null) return const [];
    try {
      return (jsonDecode(raw) as List<Object?>)
          .map((s) => HerSymptomModel.fromJson(s as Map<String, Object?>))
          .toList();
    } catch (_) {
      return const [];
    }
  }

  Future<void> _saveLocalFindings(List<HerScreeningFindingModel> findings) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;
    await prefs.setString(
      _cacheKey("findings"),
      jsonEncode(findings.map((f) => f.toJson()).toList()),
    );
  }

  Future<List<HerScreeningFindingModel>?> _loadLocalFindings() async {
    final prefs = await _getPrefs();
    if (prefs == null) return null;
    final raw = prefs.getString(_cacheKey("findings"));
    if (raw == null) return null;
    try {
      return (jsonDecode(raw) as List<Object?>)
          .map((f) => HerScreeningFindingModel.fromJson(f as Map<String, Object?>))
          .toList();
    } catch (_) {
      return null;
    }
  }

  Future<HerProfileModel> fetchProfile() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/profile"), headers: _headers);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final profile = HerProfileModel.fromJson(data);
        await _saveLocalProfile(profile);
        return profile;
      }
    } catch (_) {}

    final cached = await _loadLocalProfile();
    if (cached != null) return cached;
    return HerProfileModel(patientId: patientId, yearOfBirth: 1999);
  }

  Future<HerProfileModel> updateProfile(HerProfileModel profile) async {
    await _saveLocalProfile(profile);
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/profile"),
        headers: _headers,
        body: jsonEncode(profile.toJson()),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final saved = HerProfileModel.fromJson(data);
        await _saveLocalProfile(saved);
        return saved;
      }
    } catch (_) {}
    return profile;
  }

  Future<(List<HerCycleModel>, HerCycleAnalysisModel)> fetchCycles() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/cycles"), headers: _headers);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final list = (data["cycles"] as List<Object?>? ?? [])
            .map((c) => HerCycleModel.fromJson(c as Map<String, Object?>))
            .toList();
        final analysis = HerCycleAnalysisModel.fromJson(
            (data["analysis"] as Map<String, Object?>?) ?? {});
        await _saveLocalCycles(list, analysis);
        return (list, analysis);
      }
    } catch (_) {}

    final cached = await _loadLocalCycles();
    if (cached != null && cached.$1.isNotEmpty) {
      return cached;
    }

    return (
      <HerCycleModel>[],
      const HerCycleAnalysisModel(status: "INSUFFICIENT_DATA"),
    );
  }

  Future<HerCycleModel> logCycle(HerCycleModel cycle) async {
    final current = await _loadLocalCycles();
    final existingCycles = current?.$1 ?? <HerCycleModel>[];
    final updatedCycles = [cycle, ...existingCycles.where((c) => c.id != cycle.id)];
    final analysis = _computeLocalCycleAnalysis(updatedCycles);
    await _saveLocalCycles(updatedCycles, analysis);

    try {
      final res = await http.post(
        Uri.parse("$baseUrl/cycles"),
        headers: _headers,
        body: jsonEncode(cycle.toJson()),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        return HerCycleModel.fromJson(data["cycle"] as Map<String, Object?>);
      }
    } catch (_) {}
    return cycle;
  }

  Future<HerCyclePhaseDetailModel> fetchTodayPhase({String? date}) async {
    try {
      final uri = Uri.parse("$baseUrl/phases/today").replace(
        queryParameters: date == null ? null : {"date": date},
      );
      final res = await http.get(uri, headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, Object?>;
        final data = decoded["data"] as Map<String, Object?>;
        return HerCyclePhaseDetailModel.fromJson(data);
      }
    } catch (_) {}

    final profile = await _loadLocalProfile();
    final cyclesData = await _loadLocalCycles();
    final cycles = cyclesData?.$1 ?? const <HerCycleModel>[];

    final now = DateTime.now();
    final todayStr = date ?? now.toIso8601String().substring(0, 10);
    DateTime startDate;

    if (cycles.isNotEmpty && cycles.first.startDate.isNotEmpty) {
      startDate = DateTime.tryParse(cycles.first.startDate) ?? now.subtract(const Duration(days: 8));
    } else if (profile?.lastPeriodStartDate != null && profile!.lastPeriodStartDate!.isNotEmpty) {
      startDate = DateTime.tryParse(profile.lastPeriodStartDate!) ?? now.subtract(const Duration(days: 8));
    } else {
      startDate = now.subtract(const Duration(days: 8));
    }

    final targetDate = DateTime.tryParse(todayStr) ?? now;
    final diffDays = targetDate.difference(startDate).inDays;
    final cycleLen = profile?.typicalCycleDays ?? 28;
    final periodLen = profile?.typicalPeriodDays ?? 5;

    final normDay = diffDays >= 0
        ? (diffDays % cycleLen) + 1
        : cycleLen - (diffDays.abs() % cycleLen) + 1;

    final ovulationDay = (cycleLen - 14).clamp(periodLen + 2, cycleLen - 2);
    final fertileStart = (ovulationDay - 5).clamp(periodLen + 1, cycleLen);
    final fertileEnd = (ovulationDay + 1).clamp(1, cycleLen);

    String phase = "FOLLICULAR";
    String title = "Follicular Phase";
    String subtitle = "Energy is rising as estrogen builds";
    String pregnancyChance = "LOW";
    bool isPeriod = false;
    bool isOvulation = false;
    bool isFertile = false;

    if (normDay <= periodLen) {
      phase = "MENSTRUAL";
      title = "Menstrual Phase";
      subtitle = "Day $normDay of period · Endometrium is shedding";
      pregnancyChance = "VERY_LOW";
      isPeriod = true;
    } else if (normDay == ovulationDay) {
      phase = "OVULATION";
      title = "Ovulation Day";
      subtitle = "Peak fertility window · Egg release underway";
      pregnancyChance = "PEAK";
      isOvulation = true;
      isFertile = true;
    } else if (normDay >= fertileStart && normDay <= fertileEnd) {
      phase = "FOLLICULAR";
      title = "Fertile Window";
      subtitle = "High chance of conception · Estrogen peak approaching";
      pregnancyChance = normDay >= ovulationDay - 2 ? "HIGH" : "MEDIUM";
      isFertile = true;
    } else if (normDay > ovulationDay + 1) {
      phase = "LUTEAL";
      title = "Luteal Phase";
      subtitle = "Progesterone dominant · Body preparing for renewal";
      pregnancyChance = "VERY_LOW";
    }

    final cyclesElapsed = (diffDays / cycleLen).floor().clamp(0, 999);
    final nextPeriod = startDate.add(Duration(days: (cyclesElapsed + 1) * cycleLen));
    final daysUntilNext = nextPeriod.difference(targetDate).inDays.clamp(0, 45);

    return HerCyclePhaseDetailModel(
      targetDate: todayStr,
      cycleDay: normDay,
      totalCycleDays: cycleLen,
      phase: phase,
      phaseTitle: title,
      phaseSubtitle: subtitle,
      pregnancyChance: pregnancyChance,
      isOvulationDay: isOvulation,
      isFertileWindow: isFertile,
      isPeriodDay: isPeriod,
      daysUntilNextPeriod: daysUntilNext,
      predictedNextPeriodDate: nextPeriod.toIso8601String().substring(0, 10),
      periodLengthDays: periodLen,
      estrogenLevel: phase == "MENSTRUAL" ? "LOW" : phase == "OVULATION" ? "PEAK" : phase == "LUTEAL" ? "MODERATE" : "RISING",
      progesteroneLevel: phase == "LUTEAL" ? "HIGH" : "LOW",
      lhLevel: isOvulation ? "SURGING" : "BASELINE",
      bodyAndEnergy: phase == "MENSTRUAL"
          ? "Resting metabolic rate is slightly lower. Prioritize rest and hydration."
          : phase == "FOLLICULAR"
              ? "Estradiol rise supports increased stamina, mental focus, and verbal fluency."
              : phase == "OVULATION"
                  ? "Peak energy, confidence, and cervical fluid hydration."
                  : "Progesterone promotes mental calm but may elevate core temperature and water retention.",
      nutritionFocus: phase == "MENSTRUAL"
          ? "Warm soups, iron-rich greens (palak, methi), and magnesium."
          : phase == "FOLLICULAR"
              ? "Fresh sprouts, pumpkin and flax seeds for healthy estrogen metabolism."
              : phase == "OVULATION"
                  ? "Antioxidant berries, zinc, and leafy vegetables to support liver clearance."
                  : "Sunflower and sesame seeds, complex grains, and hydration to reduce PMS bloat.",
      movementAdvice: phase == "MENSTRUAL"
          ? "Gentle restorative: Supta Baddha Konasana, child's pose, and breathwork."
          : phase == "FOLLICULAR"
              ? "Progressive flows, strength training, and cardiovascular intervals."
              : phase == "OVULATION"
                  ? "Full body resistance, dynamic flows, and peak stamina movements."
                  : "Slow restorative Hatha, yin stretches, and Nadi Shodhana pranayama.",
      ayurvedicDosha: phase == "MENSTRUAL"
          ? "Apana Vayu downward flow active. Pacify aggravated Vata with warm, unctuous meals."
          : phase == "FOLLICULAR"
              ? "Kapha builds Ojas and tissue integrity. Kindle Agni with gentle spices."
              : phase == "OVULATION"
                  ? "Pitta energy surges. Cool internal heat with coriander and fennel."
                  : "Vata tends to accumulate late luteal. Ground with warm sesame Abhyanga.",
    );
  }

  Future<List<HerMonthPhaseEntryModel>> fetchMonthPhases(int year, int month) async {
    try {
      final res = await http.get(
        Uri.parse("$baseUrl/phases/calendar?year=$year&month=$month"),
        headers: _headers,
      );
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, Object?>;
        final data = decoded["data"] as Map<String, Object?>;
        final entries = (data["entries"] as List<Object?>? ?? [])
            .map((e) => HerMonthPhaseEntryModel.fromJson(e as Map<String, Object?>))
            .toList();
        if (entries.isNotEmpty) return entries;
      }
    } catch (_) {}

    final daysInMonth = DateTime(year, month + 1, 0).day;
    final list = <HerMonthPhaseEntryModel>[];
    for (int d = 1; d <= daysInMonth; d++) {
      final dateStr = "$year-${month.toString().padLeft(2, '0')}-${d.toString().padLeft(2, '0')}";
      final detail = await fetchTodayPhase(date: dateStr);
      list.add(HerMonthPhaseEntryModel(
        date: dateStr,
        cycleDay: detail.cycleDay,
        phase: detail.phase,
        isPeriod: detail.isPeriodDay,
        isFertile: detail.isFertileWindow,
        isOvulation: detail.isOvulationDay,
        pregnancyChance: detail.pregnancyChance,
      ));
    }
    return list;
  }

  Future<HerPcodAssessmentModel> fetchPcodAssessment() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/pcod-assessment"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, Object?>;
        final data = decoded["data"] as Map<String, Object?>;
        return HerPcodAssessmentModel.fromJson(data);
      }
    } catch (_) {}

    final profile = await _loadLocalProfile();
    final pcodSymptoms = profile?.pcodSymptoms ?? const [];
    final isIrregular = profile?.cycleRegularity == "irregular";
    int criteria = 0;
    final evidence = <String>[];
    if (isIrregular) {
      criteria++;
      evidence.add("Irregular cycle intervals reported in personal onboarding profile");
    }
    if (pcodSymptoms.contains("facial_hair") || pcodSymptoms.contains("severe_acne")) {
      criteria++;
      evidence.add("Clinical hyperandrogenism markers noted (acne / facial hair)");
    }
    if (pcodSymptoms.contains("ultrasound_cysts")) {
      criteria++;
      evidence.add("Ultrasound polycystic morphology documented");
    }

    final risk = criteria >= 2
        ? "HIGH_CLINICAL_REVIEW"
        : (criteria == 1 ? "MODERATE_MONITOR" : "LOW_RISK");

    return HerPcodAssessmentModel(
      riskLevel: risk,
      rotterdamCriteriaMet: criteria,
      evidence: evidence,
      summary: criteria >= 2
          ? "Meets Rotterdam Consensus diagnostic thresholds (≥2 criteria). Clinical consultation advised."
          : "Standard baseline with balanced hormonal indicators.",
      clinicalAction: criteria >= 2
          ? "Consult gynecologist for endocrine panel & pelvic ultrasound."
          : "Maintain healthy low-GI diet and cycle tracking.",
      doshaFocus: "Kapha-Vata Balance",
      recommendedHerbs: const ["Kanchnar Guggulu", "Shatavari", "Ashoka"],
      lifestyleAdvice: "Daily morning movement, seed cycling, and circadian nutrition.",
    );
  }

  Future<List<HerSymptomModel>> fetchSymptoms() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/symptoms"), headers: _headers);
      if (res.statusCode == 200) {
        final list = (jsonDecode(res.body) as List<Object?>)
            .map((s) => HerSymptomModel.fromJson(s as Map<String, Object?>))
            .toList();
        await _saveLocalSymptoms(list);
        return list;
      }
    } catch (_) {}

    final cached = await _loadLocalSymptoms();
    if (cached.isNotEmpty) return cached;
    return const [];
  }

  Future<(HerSymptomModel, SafetyCheckResultModel)> logSymptom(
      Map<String, Object?> payload) async {
    final sym = HerSymptomModel.fromJson(payload);
    final pain = (payload["pelvicPain"] as num?)?.toInt() ?? 0;
    final sudden = payload["suddenSeverePain"] == true;
    final isUrgent = pain >= 8 || sudden;
    final safetyCheck = SafetyCheckResultModel(
      isUrgent: isUrgent,
      category: isUrgent ? "URGENT_REVIEW" : "NORMAL",
      emergencyGuidance: isUrgent
          ? "URGENT: Sudden or severe pelvic pain warrants immediate in-person gynecological or emergency clinic evaluation."
          : null,
    );

    final existing = await _loadLocalSymptoms();
    final updated = [sym, ...existing.where((s) => s.id != sym.id)];
    await _saveLocalSymptoms(updated);

    try {
      final res = await http.post(
        Uri.parse("$baseUrl/symptoms"),
        headers: _headers,
        body: jsonEncode(payload),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final s = HerSymptomModel.fromJson(data["symptom"] as Map<String, Object?>);
        final safety = SafetyCheckResultModel.fromJson(
            (data["safety"] as Map<String, Object?>?) ?? {});
        return (s, safety);
      }
    } catch (_) {}

    return (sym, safetyCheck);
  }

  Future<List<HerScreeningFindingModel>> evaluateScreening({
    Map<String, Object?>? answers,
  }) async {
    if (answers != null && answers.isNotEmpty) {
      final findings = <HerScreeningFindingModel>[];
      final e01 = (answers["E01"] as num?)?.toInt() ?? 0;
      final p01 = answers["P01"] == "irregular" || answers["P01"] == "absent";
      final p02 = answers["P02"] == "yes";
      final e02 = answers["E02"] == "yes";

      if (e01 >= 7 || e02) {
        findings.add(
          const HerScreeningFindingModel(
            domain: "ENDOMETRIOSIS_RISK",
            category: "EVALUATION_INDICATED",
            isDiagnosis: false,
            title: "Elevated Pelvic Pain Symptom Cluster",
            rationale: "Reported cyclic or chronic pelvic pain severity warrants structured clinical review.",
            ruleVersion: "A2-SCREEN-2026.1",
            suggestedAction: "Schedule a pelvic evaluation with an OB/GYN specialist.",
          ),
        );
      }
      if (p01 || p02) {
        findings.add(
          const HerScreeningFindingModel(
            domain: "PCOS_FEATURES",
            category: "EVALUATION_INDICATED",
            isDiagnosis: false,
            title: "PCOS Phenotype Observation",
            rationale: "Reported menstrual interval irregularity or androgenic features align with Rotterdam phenotypic criteria.",
            ruleVersion: "A2-SCREEN-2026.1",
            suggestedAction: "Consider an ultrasound and hormone panel (LH/FSH, DHEAS, Free Testosterone).",
          ),
        );
      }
      if (findings.isEmpty) {
        findings.add(
          const HerScreeningFindingModel(
            domain: "GENERAL_REPRODUCTIVE",
            category: "NO_CURRENT_SCREENING_FLAGS",
            isDiagnosis: false,
            title: "Normal Menstrual Profile",
            rationale: "Reported survey answers show no acute red flags or irregular cycle patterns.",
            ruleVersion: "A2-SCREEN-2026.1",
            suggestedAction: "Continue regular cycle logging and preventive check-ins.",
          ),
        );
      }
      await _saveLocalFindings(findings);
    }

    try {
      final res = await http.post(
        Uri.parse("$baseUrl/screening/evaluate"),
        headers: _headers,
        body: jsonEncode({"answers": answers ?? {}}),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final list = (data["findings"] as List<Object?>? ?? [])
            .map((f) => HerScreeningFindingModel.fromJson(f as Map<String, Object?>))
            .toList();
        if (list.isNotEmpty) {
          await _saveLocalFindings(list);
          return list;
        }
      }
    } catch (_) {}

    final cached = await _loadLocalFindings();
    if (cached != null && cached.isNotEmpty) return cached;

    return const [
      HerScreeningFindingModel(
        domain: "PCOS_FEATURES",
        category: "MONITOR_AND_TRACK",
        isDiagnosis: false,
        title: "Ongoing Symptom & Cycle Observation",
        rationale: "Tracking logs are being recorded for longitudinal trend synthesis.",
        ruleVersion: "A2-SCREEN-2026.1",
        suggestedAction: "Log 3 consecutive cycles for evidence-informed clinical review.",
      ),
    ];
  }

  static const List<HerWellnessItemModel> defaultYogaItems = [
    HerWellnessItemModel(
      id: "yoga_sukhasana",
      category: "yoga_movement",
      title: "Sukhasana (Easy Pose & Breathwork)",
      description: "5 minutes of seated grounding with steady diaphragmatic pranayama. Reduces sympathetic overdrive and stabilizes blood pressure.",
      rationale: "Safety screened for gentle restorative movement across all doshas and energy levels.",
      targetPhase: "all",
      contraindications: ["Acute knee inflammation (sit on folded blanket)"],
    ),
    HerWellnessItemModel(
      id: "yoga_balasana",
      category: "yoga_movement",
      title: "Balasana (Child's Pose)",
      description: "3 to 5 minutes gentle restorative back and hip elongator. Rest forehead gently on mat or support block.",
      rationale: "Decompresses lumbar spine, relieves pelvic congestion, and reduces daily fatigue.",
      targetPhase: "all",
      contraindications: ["Severe knee joint injury"],
    ),
    HerWellnessItemModel(
      id: "yoga_tadasana",
      category: "yoga_movement",
      title: "Tadasana (Mountain Pose Alignment)",
      description: "3 minutes active postural grounding. Focus on symmetric weight distribution through arches and lengthened spine.",
      rationale: "Builds core neuromuscular stability and improves circulation without musculoskeletal strain.",
      targetPhase: "all",
      contraindications: ["Acute dizziness or vertigo (perform against wall)"],
    ),
    HerWellnessItemModel(
      id: "yoga_cat_cow",
      category: "yoga_movement",
      title: "Marjaryasana-Bitilasana (Cat-Cow Movement)",
      description: "8-10 breath-synchronized gentle spinal flexions. Inhale to open chest, exhale to round spine smoothly.",
      rationale: "Improves spinal disc mobility, eases pelvic floor tension, and stimulates digestive agni.",
      targetPhase: "all",
      contraindications: ["Recent wrist injury (modify by supporting on forearms)"],
    ),
    HerWellnessItemModel(
      id: "yoga_virabhadrasana_i",
      category: "yoga_movement",
      title: "Virabhadrasana I (Gentle Warrior I)",
      description: "3 minutes per side holding a supported stance with hips squared forward and arms gently raised.",
      rationale: "Strengthens pelvic and thigh musculature, expands thoracic capacity, and builds stamina.",
      targetPhase: "all",
      contraindications: ["Uncontrolled high blood pressure (keep hands on hips)"],
    ),
    HerWellnessItemModel(
      id: "yoga_supta_rest",
      category: "yoga_movement",
      title: "Supta Baddha Konasana (Reclined Restorative)",
      description: "5 minutes supine relaxation with knees gently supported by cushions and arms open by sides.",
      rationale: "Aids lymphatic drainage, relieves abdominal discomfort, and promotes systemic cellular recovery.",
      targetPhase: "all",
      contraindications: ["Active acid reflux (elevate torso with bolster)"],
    ),
    HerWellnessItemModel(
      id: "yoga_viparita_karani",
      category: "yoga_movement",
      title: "Viparita Karani (Legs-Up-The-Wall Pose)",
      description: "5 to 8 minutes passive elevation of legs against wall to decongest pelvic veins and facilitate lymphatic return.",
      rationale: "Soothes tired lower extremities, activates parasympathetic tone, and calms sleep onset.",
      targetPhase: "all",
      contraindications: ["Glaucoma", "Uncontrolled hypertension", "Day 1 of heavy menstrual flow"],
    ),
    HerWellnessItemModel(
      id: "yoga_setu_bandhasana",
      category: "yoga_movement",
      title: "Setu Bandhasana (Supported Bridge Pose)",
      description: "4 minutes with yoga block under sacrum. Opens the chest and anterior hip flexors while resting parasympathetic tone.",
      rationale: "Strengthens posterior chain endurance and promotes thoracic cage expansion.",
      targetPhase: "all",
      contraindications: ["Acute neck trauma", "Severe lumbar disc herniation"],
    ),
    HerWellnessItemModel(
      id: "yoga_bhujangasana",
      category: "yoga_movement",
      title: "Bhujangasana (Gentle Cobra Pose)",
      description: "3 repetitions of gentle low cobra, focusing on mid-back extension and abdominal elongation without lumbar jamming.",
      rationale: "Stimulates adrenal regulation and fortifies postural spinal extensors.",
      targetPhase: "all",
      contraindications: ["Active abdominal surgery recovery", "Second/third trimester pregnancy"],
    ),
    HerWellnessItemModel(
      id: "yoga_vrikshasana",
      category: "yoga_movement",
      title: "Vrikshasana (Tree Pose with Wall Support)",
      description: "2 minutes per side single-leg balance. Foot placed against calf or inner thigh, avoiding the knee joint.",
      rationale: "Enhances proprioception, ankle stability, and mental focus under neuromuscular load.",
      targetPhase: "all",
      contraindications: ["Acute vertigo", "Recent ankle sprain"],
    ),
    HerWellnessItemModel(
      id: "yoga_ardha_matsyendrasana",
      category: "yoga_movement",
      title: "Ardha Matsyendrasana (Gentle Seated Twist)",
      description: "Seated upright spinal rotation initiated from the thoracic cage. 1 to 2 minutes each side with steady breathing.",
      rationale: "Stimulates gastrointestinal motility, enhances spinal disc hydration, and aids detoxification.",
      targetPhase: "all",
      contraindications: ["Acute disc herniation", "Deep twists during pregnancy"],
    ),
    HerWellnessItemModel(
      id: "yoga_janu_sirsasana",
      category: "yoga_movement",
      title: "Janu Sirsasana (Head-to-Knee Bend with Strap)",
      description: "Seated single-leg forward fold using a strap. Keeps spine long and hamstring stretch gentle.",
      rationale: "Calms nervous agitation and releases chronic lumbosacral tension.",
      targetPhase: "all",
      contraindications: ["Acute hamstring tear", "Sacroiliac joint instability"],
    ),
    HerWellnessItemModel(
      id: "yoga_paschimottanasana",
      category: "yoga_movement",
      title: "Paschimottanasana (Supported Seated Fold)",
      description: "Seated forward fold draped over pillows or bolsters. Breathe into the posterior ribcage.",
      rationale: "Cools excess internal heat (Pitta) and settles restlessness (Vata).",
      targetPhase: "all",
      contraindications: ["Acute sciatica", "Lumbar disc extrusion"],
    ),
    HerWellnessItemModel(
      id: "yoga_trikonasana",
      category: "yoga_movement",
      title: "Utthita Trikonasana (Triangle Pose with Block)",
      description: "Standing lateral stretch with bottom hand resting on block. Lengthens obliques and expands ribcage.",
      rationale: "Improves breathing mechanics and strengthens lateral pelvic stabilizers.",
      targetPhase: "all",
      contraindications: ["Acute migraine flare", "Unsupported cervical spine weakness"],
    ),
    HerWellnessItemModel(
      id: "yoga_virabhadrasana_ii",
      category: "yoga_movement",
      title: "Virabhadrasana II (Warrior II Posture)",
      description: "Wide stance with arms parallel to ground. Gaze softly over front fingertips for 1 to 2 minutes per side.",
      rationale: "Builds lower body muscular stamina, open hip mobility, and cardiovascular resilience.",
      targetPhase: "all",
      contraindications: ["Acute hip bursitis", "Uncontrolled hypertension (keep hands on hips)"],
    ),
    HerWellnessItemModel(
      id: "yoga_shavasana",
      category: "yoga_movement",
      title: "Shavasana (Supported Corpse Pose)",
      description: "6 to 8 minutes of silent, supported supine rest with bolster under knees. Full neuromuscular recovery.",
      rationale: "Maximizes vagal tone, normalizes heart rate variability, and drops circulating cortisol.",
      targetPhase: "all",
      contraindications: ["Third trimester supine hypotensive syndrome (switch to left-side lie)"],
    ),
    HerWellnessItemModel(
      id: "yoga_ananda_balasana",
      category: "yoga_movement",
      title: "Ananda Balasana (Happy Baby Pose)",
      description: "Supine gentle hip opener holding shins or outer feet. Decompresses sacrum and relaxes pelvic floor.",
      rationale: "Alleviates hypertonic pelvic floor tightness and restores hip joint mobility.",
      targetPhase: "all",
      contraindications: ["Acute groin strain", "Late pregnancy"],
    ),
    HerWellnessItemModel(
      id: "yoga_nadi_shodhana",
      category: "yoga_movement",
      title: "Nadi Shodhana (Alternate Nostril Breath)",
      description: "5 minutes of rhythmic alternate nostril breathing without breath retention. Inhale 4s, exhale 4s.",
      rationale: "Proven clinical balancing of the autonomic nervous system and reduction of cognitive stress.",
      targetPhase: "all",
      contraindications: ["Complete structural nasal obstruction"],
    ),
    HerWellnessItemModel(
      id: "yoga_bhramari",
      category: "yoga_movement",
      title: "Bhramari Pranayama (Humming Bee Breath)",
      description: "Low steady humming vibration on exhalation with ears gently closed. 6 to 8 slow cycles.",
      rationale: "Stimulates endogenous nitric oxide in paranasal sinuses and activates vagal nerve soothing.",
      targetPhase: "all",
      contraindications: ["Active severe middle ear infection"],
    ),
    HerWellnessItemModel(
      id: "yoga_sheetali",
      category: "yoga_movement",
      title: "Sheetali Pranayama (Cooling Breath)",
      description: "Inhale through rolled tongue (or Sitkari through teeth) and exhale through nose. 8 to 10 cycles.",
      rationale: "Thermoregulatory cooling practice effective for hot flashes and physiological heat irritation.",
      targetPhase: "all",
      contraindications: ["Severe acute respiratory congestion", "Extreme cold weather"],
    ),
    HerWellnessItemModel(
      id: "yoga_chair_pigeon",
      category: "yoga_movement",
      title: "Seated Chair Pigeon (Figure Four Stretch)",
      description: "Crossing ankle over opposite knee while seated upright in a chair. Gentle hinge from hips.",
      rationale: "Accessible piriformis release and sciatic nerve decompression for desk or mobility-limited users.",
      targetPhase: "all",
      contraindications: ["Recent hip joint replacement", "Severe knee torsion"],
    ),
    HerWellnessItemModel(
      id: "yoga_chair_mountain",
      category: "yoga_movement",
      title: "Seated Mountain with Gentle Shoulder Rolls",
      description: "Seated tall with feet flat on the floor, releasing trapped trapezius tension with slow circular rolls.",
      rationale: "Instantly accessible desk posture reset and upper back circulation booster.",
      targetPhase: "all",
      contraindications: ["Acute rotator cuff tear"],
    ),
    HerWellnessItemModel(
      id: "yoga_surya_namaskar",
      category: "yoga_movement",
      title: "Surya Namaskar (Slow Restorative Flow)",
      description: "3 to 5 slow, breath-synchronized cycles transitioning between standing, lunge, and gentle extension.",
      rationale: "Full-body joint lubrication, cardiovascular warmup, and metabolic stimulation.",
      targetPhase: "all",
      contraindications: ["Uncontrolled high blood pressure", "Acute lumbar disc herniation"],
    ),
  ];

  Future<List<HerWellnessItemModel>> fetchWellness({String? category}) async {
    try {
      final uri = Uri.parse("$baseUrl/wellness").replace(
        queryParameters: category == null ? null : {"category": category},
      );
      final res = await http.get(uri, headers: _headers);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final list = (data["recommendations"] as List<Object?>? ?? [])
            .map((w) => HerWellnessItemModel.fromJson(w as Map<String, Object?>))
            .toList();
        if (list.isNotEmpty) return list;
      }
    } catch (_) {}

    return defaultYogaItems;
  }

  Future<HerDoctorSummaryModel?> generateDoctorSummary() async {
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/doctor-summary"),
        headers: _headers,
        body: jsonEncode({}),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        return HerDoctorSummaryModel.fromJson(data);
      }
    } catch (_) {}

    return HerDoctorSummaryModel(
      id: "sum_local_demo",
      patientId: patientId,
      generatedAt: DateTime.now().toIso8601String(),
      shareToken: "her_share_demo88",
    );
  }

  Future<bool> revokeDoctorSummary(String summaryId) async {
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/doctor-summary/$summaryId/revoke"),
        headers: _headers,
      );
      return res.statusCode == 200;
    } catch (_) {}
    return true;
  }

  Future<bool> seedDemoScenario(String scenario) async {
    final prefs = await _getPrefs();
    if (prefs != null) {
      await prefs.setString(_cacheKey("active_scenario"), scenario);
    }

    final now = DateTime.now();
    if (scenario == "SCENARIO_A_REGULAR") {
      final cycles = [
        HerCycleModel(
          id: "cyc_seed_a1",
          startDate: now.subtract(const Duration(days: 28)).toIso8601String().substring(0, 10),
          cycleLengthDays: 28,
          periodLengthDays: 5,
          flowIntensity: "medium",
          crampsSeverity: 2,
          notes: "Regular cycle, minimal cramps",
        ),
        HerCycleModel(
          id: "cyc_seed_a2",
          startDate: now.subtract(const Duration(days: 56)).toIso8601String().substring(0, 10),
          cycleLengthDays: 28,
          periodLengthDays: 5,
          flowIntensity: "medium",
          crampsSeverity: 3,
        ),
        HerCycleModel(
          id: "cyc_seed_a3",
          startDate: now.subtract(const Duration(days: 84)).toIso8601String().substring(0, 10),
          cycleLengthDays: 28,
          periodLengthDays: 4,
          flowIntensity: "light",
          crampsSeverity: 1,
        ),
      ];
      final analysis = _computeLocalCycleAnalysis(cycles);
      await _saveLocalCycles(cycles, analysis);
    } else if (scenario == "SCENARIO_B_PCOS") {
      final cycles = [
        HerCycleModel(
          id: "cyc_seed_b1",
          startDate: now.subtract(const Duration(days: 42)).toIso8601String().substring(0, 10),
          cycleLengthDays: 42,
          periodLengthDays: 7,
          flowIntensity: "heavy",
          crampsSeverity: 6,
          notes: "Delayed cycle with significant cramping",
        ),
        HerCycleModel(
          id: "cyc_seed_b2",
          startDate: now.subtract(const Duration(days: 80)).toIso8601String().substring(0, 10),
          cycleLengthDays: 38,
          periodLengthDays: 6,
          flowIntensity: "heavy",
          crampsSeverity: 5,
        ),
        HerCycleModel(
          id: "cyc_seed_b3",
          startDate: now.subtract(const Duration(days: 104)).toIso8601String().substring(0, 10),
          cycleLengthDays: 24,
          periodLengthDays: 4,
          flowIntensity: "medium",
          crampsSeverity: 3,
        ),
      ];
      final analysis = _computeLocalCycleAnalysis(cycles);
      await _saveLocalCycles(cycles, analysis);
      final symptoms = [
        HerSymptomModel(
          id: "sym_seed_b1",
          logDate: now.subtract(const Duration(days: 2)).toIso8601String().substring(0, 10),
          pelvicPain: 5,
          bloating: 6,
          headache: 3,
          acneSeverity: "moderate",
          sleepHours: 6.5,
          tags: const ["fatigue", "acne", "bloating"],
        ),
      ];
      await _saveLocalSymptoms(symptoms);
      final findings = const [
        HerScreeningFindingModel(
          domain: "PCOS_FEATURES",
          category: "EVALUATION_INDICATED",
          isDiagnosis: false,
          title: "Ovulatory Irregularity & Hyperandrogenism Markers",
          rationale: "Longitudinal cycle variation (24-42 days) exceeds Rotterdam 8-day threshold.",
          ruleVersion: "A2-SCREEN-2026.1",
          suggestedAction: "Discuss with gynecologist for ultrasound & endocrine panel screening.",
        ),
      ];
      await _saveLocalFindings(findings);
    } else if (scenario == "SCENARIO_C_PERIMENO") {
      final cycles = [
        HerCycleModel(
          id: "cyc_seed_c1",
          startDate: now.subtract(const Duration(days: 55)).toIso8601String().substring(0, 10),
          cycleLengthDays: 55,
          periodLengthDays: 3,
          flowIntensity: "spotting",
          crampsSeverity: 2,
        ),
        HerCycleModel(
          id: "cyc_seed_c2",
          startDate: now.subtract(const Duration(days: 100)).toIso8601String().substring(0, 10),
          cycleLengthDays: 45,
          periodLengthDays: 4,
          flowIntensity: "light",
          crampsSeverity: 1,
        ),
      ];
      final analysis = _computeLocalCycleAnalysis(cycles);
      await _saveLocalCycles(cycles, analysis);
      final symptoms = [
        HerSymptomModel(
          id: "sym_seed_c1",
          logDate: now.subtract(const Duration(days: 1)).toIso8601String().substring(0, 10),
          pelvicPain: 2,
          bloating: 4,
          headache: 4,
          sleepHours: 5.5,
          tags: const ["night_sweats", "hot_flashes", "sleep_disturbances"],
        ),
      ];
      await _saveLocalSymptoms(symptoms);
    }

    try {
      final res = await http.post(
        Uri.parse("$baseUrl/demo/seed"),
        headers: _headers,
        body: jsonEncode({"scenario": scenario}),
      );
      return res.statusCode == 200;
    } catch (_) {}
    return true;
  }
}
