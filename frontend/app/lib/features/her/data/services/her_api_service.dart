import "dart:convert";
import "package:http/http.dart" as http;
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

  Future<HerProfileModel> fetchProfile() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/profile"), headers: _headers);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        return HerProfileModel.fromJson(data);
      }
    } catch (_) {}
    return HerProfileModel(patientId: patientId, yearOfBirth: 1999);
  }

  Future<HerProfileModel> updateProfile(HerProfileModel profile) async {
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/profile"),
        headers: _headers,
        body: jsonEncode(profile.toJson()),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        return HerProfileModel.fromJson(data);
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
        return (list, analysis);
      }
    } catch (_) {}
    return (
      <HerCycleModel>[],
      const HerCycleAnalysisModel(status: "INSUFFICIENT_DATA"),
    );
  }

  Future<HerCycleModel> logCycle(HerCycleModel cycle) async {
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

  Future<List<HerSymptomModel>> fetchSymptoms() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/symptoms"), headers: _headers);
      if (res.statusCode == 200) {
        final list = (jsonDecode(res.body) as List<Object?>)
            .map((s) => HerSymptomModel.fromJson(s as Map<String, Object?>))
            .toList();
        return list;
      }
    } catch (_) {}
    return const [];
  }

  Future<(HerSymptomModel, SafetyCheckResultModel)> logSymptom(
      Map<String, Object?> payload) async {
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/symptoms"),
        headers: _headers,
        body: jsonEncode(payload),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final sym = HerSymptomModel.fromJson(data["symptom"] as Map<String, Object?>);
        final safety = SafetyCheckResultModel.fromJson(
            (data["safety"] as Map<String, Object?>?) ?? {});
        return (sym, safety);
      }
    } catch (_) {}

    // Offline Safety Gate Fallback
    final pain = (payload["pelvicPain"] as num?)?.toInt() ?? 0;
    final sudden = payload["suddenSeverePain"] == true;
    final isUrgent = pain >= 8 || sudden;

    return (
      HerSymptomModel.fromJson(payload),
      SafetyCheckResultModel(
        isUrgent: isUrgent,
        category: isUrgent ? "URGENT_REVIEW" : "NORMAL",
        emergencyGuidance: isUrgent
            ? "URGENT: Sudden or severe pelvic pain warrants immediate in-person gynecological or emergency clinic evaluation."
            : null,
      ),
    );
  }

  Future<List<HerScreeningFindingModel>> evaluateScreening({
    Map<String, Object?>? answers,
  }) async {
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
        return list;
      }
    } catch (_) {}

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
      id: "yoga_virabhadrasana",
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
