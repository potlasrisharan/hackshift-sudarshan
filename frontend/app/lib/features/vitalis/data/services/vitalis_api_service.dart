import "dart:convert";
import "package:http/http.dart" as http;
import "../models/vitalis_models.dart";
import "../fixtures/vitalis_synthetic_fixtures.dart";
import "../../../../core/network/api_config.dart";

class VitalisApiService {
  final String baseUrl;
  final String patientId;

  const VitalisApiService({
    this.baseUrl = "${ApiConfig.baseUrl}/vitalis",
    this.patientId = "demo_patient_vitalis",
  });

  Map<String, String> get _headers => {
        "Content-Type": "application/json",
        "X-Patient-Id": patientId,
      };

  Future<VitalisProfileModel> fetchProfile() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/profile"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisProfileModel.fromJson(data);
      }
    } catch (_) {}
    return VitalisSyntheticFixtures.personaA.profile;
  }

  Future<VitalisProfileModel> updateProfile(VitalisProfileModel profile) async {
    try {
      final res = await http.put(
        Uri.parse("$baseUrl/profile"),
        headers: _headers,
        body: jsonEncode(profile.toJson()),
      );
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisProfileModel.fromJson(data);
      }
    } catch (_) {}
    return profile;
  }

  Future<VitalisHpiResultModel> fetchHealthspanIndex() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/healthspan-index"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisHpiResultModel.fromJson(data);
      }
    } catch (_) {}
    return VitalisSyntheticFixtures.personaA.hpiResult;
  }

  Future<VitalisBiomarkerTrendModel> fetchBiomarkerTrend() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/biomarkers/trends"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisBiomarkerTrendModel.fromJson(data);
      }
    } catch (_) {}
    return VitalisSyntheticFixtures.personaA.biomarkerTrend;
  }

  Future<VitalisCardioModel> fetchCardioFitness() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/fitness/cardio"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisCardioModel.fromJson(data);
      }
    } catch (_) {}
    return VitalisSyntheticFixtures.personaA.cardio;
  }

  Future<VitalisReadinessModel> fetchDailyReadiness() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/readiness"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisReadinessModel.fromJson(data);
      }
    } catch (_) {}
    return VitalisSyntheticFixtures.personaA.readiness;
  }

  Future<VitalisExercisePlanModel> fetchExercisePlan() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/plans/exercise"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisExercisePlanModel.fromJson(data);
      }
    } catch (_) {}
    return const VitalisExercisePlanModel(
      id: "plan_unavailable",
      weeklyAerobicMinutesTarget: 0,
      weeklyStrengthSessionsTarget: 0,
      recommendedActivities: [],
      contraindicatedActivities: [],
      intensityLevel: "unavailable",
      yogaRoutine: [],
      safetyStatus: "UNAVAILABLE",
      safetyNotes: ["Connect to AyuSetu Cloudflare services to load a safety-screened plan."],
    );
  }

  Future<VitalisNutritionPlanModel> fetchNutritionPlan() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/plans/nutrition"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisNutritionPlanModel.fromJson(data);
      }
    } catch (_) {}
    return VitalisSyntheticFixtures.personaA.nutritionPlan;
  }

  Future<List<VitalisPreventiveItemModel>> fetchPreventiveCare() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/preventive-care"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final list = (decoded["data"] as List<dynamic>?)
            ?.map((i) => VitalisPreventiveItemModel.fromJson(i as Map<String, dynamic>))
            .toList() ?? [];
        return list;
      }
    } catch (_) {}
    return VitalisSyntheticFixtures.personaA.preventiveItems;
  }

  Future<List<VitalisRecommendationModel>> fetchRecommendations() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/recommendations"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        final list = (data["recommendedActions"] as List<dynamic>?)
            ?.map((i) => VitalisRecommendationModel.fromJson(i as Map<String, dynamic>))
            .toList() ?? [];
        return list;
      }
    } catch (_) {}
    return const [];
  }

  Future<VitalisDoctorSummaryModel> fetchDoctorSummary() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/doctor-summary"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisDoctorSummaryModel.fromJson(data);
      }
    } catch (_) {}
    return VitalisDoctorSummaryModel(
      id: "sum_fallback",
      patientId: patientId,
      generatedAt: DateTime.now().toIso8601String(),
      age: 48,
      sex: "MALE",
      bmi: 26.4,
      knownConditions: const ["Pre-diabetes"],
      currentMedications: const ["Metformin 500mg"],
      biomarkerTrends: const [
        {"metric": "HbA1c", "baseline": "5.7%", "latest": "6.1%", "delta": "+0.4%", "status": "PRE_DIABETES_RANGE"}
      ],
      wearableBaseline: const {
        "meanRestingHr": 62,
        "meanHrvRmssd": 48,
        "dailyStepsAverage": 6800,
      },
      preventiveStatus: const [
        {"item": "HbA1c Screening", "status": "DUE_FOR_REVIEW"}
      ],
      shareToken: "vit_share_99a82f",
      isClinicianConfirmed: false,
      disclaimer: "Patient-authorized longitudinal telemetry & clinical records summary. Not machine-diagnosed.",
    );
  }

  Future<String> askCopilot(String message) async {
    try {
      final res = await http.post(
        Uri.parse("$baseUrl/copilot/chat"),
        headers: _headers,
        body: jsonEncode({"message": message}),
      );
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        return decoded["data"]["reply"] as String? ?? "No response received.";
      }
    } catch (_) {}
    return "I can explain your biomarker trends, summarize exercise targets, or review Indian nutrition ideas based on clinical guidelines.";
  }
}
