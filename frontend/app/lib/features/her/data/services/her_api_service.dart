import "dart:convert";
import "package:http/http.dart" as http;
import "../models/her_models.dart";

class HerApiService {
  final String baseUrl;
  final String patientId;

  const HerApiService({
    this.baseUrl = "http://localhost:8787/api/v1/her",
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

  Future<List<HerWellnessItemModel>> fetchWellness() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/wellness"), headers: _headers);
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, Object?>;
        final list = (data["recommendations"] as List<Object?>? ?? [])
            .map((w) => HerWellnessItemModel.fromJson(w as Map<String, Object?>))
            .toList();
        return list;
      }
    } catch (_) {}

    return const [
      HerWellnessItemModel(
        id: "w_spearmint",
        category: "NUTRITION",
        title: "Spearmint & CCF Infusion",
        description: "Fresh spearmint tea with cumin, coriander, and fennel seeds twice daily.",
        rationale: "Helps calm ovarian and androgen activity while alleviating abdominal bloating.",
        targetPhase: "all",
      ),
      HerWellnessItemModel(
        id: "w_baddha_konasana",
        category: "SOMATIC_YOGA",
        title: "Supta Baddha Konasana (Reclining Bound Angle)",
        description: "10-15 minutes supported by bolsters under knees with deep diaphragmatic breathing.",
        rationale: "Relieves pelvic floor hypertonicity and down-regulates sympathetic nervous tone.",
        targetPhase: "luteal",
      ),
    ];
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
