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

  Future<bool> recordHealthspanCheckIn({
    required double weeklyActivityMinutes,
    required int weeklyStrengthSessions,
    required double averageSleepHours,
    required double activityAdherencePercent,
    required int fatigueRating,
    required bool symptomsDuringExercise,
  }) async {
    final now = DateTime.now().toUtc();
    final observedAt = now.toIso8601String();
    final weekStart = DateTime.utc(now.year, now.month, now.day - ((now.weekday + 6) % 7));
    final timestamp = weekStart.millisecondsSinceEpoch;
    final observations = <Map<String, Object?>>[
      _behaviorObservation("weekly_activity_minutes", "Weekly activity minutes", weeklyActivityMinutes, "minutes/week", observedAt, timestamp),
      _behaviorObservation("weekly_strength_sessions", "Weekly strength sessions", weeklyStrengthSessions.toDouble(), "sessions/week", observedAt, timestamp),
      _behaviorObservation("sleep_hours_average", "Average sleep duration", averageSleepHours, "hours/night", observedAt, timestamp),
      _behaviorObservation("activity_adherence_percent", "Activity plan adherence", activityAdherencePercent, "percent", observedAt, timestamp),
      _behaviorObservation("fatigue_rating", "Recent fatigue rating", fatigueRating.toDouble(), "0-10", observedAt, timestamp),
      _behaviorObservation("exercise_symptoms_reported", "Symptoms during exercise", symptomsDuringExercise ? 1 : 0, "boolean", observedAt, timestamp),
    ];
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/observations"),
        headers: _headers,
        body: jsonEncode(observations),
      );
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Map<String, Object?> _behaviorObservation(
    String metricCode,
    String metricName,
    double value,
    String unit,
    String observedAt,
    int timestamp,
  ) => {
        "id": "vitalis_${patientId}_${metricCode}_$timestamp",
        "metricCode": metricCode,
        "metricName": metricName,
        "valueNumeric": value,
        "unit": unit,
        "observedStartUtc": observedAt,
        "ianaTimezone": "Asia/Kolkata",
        "sourceType": "patient_reported",
        "sourceId": "mobile_healthspan_check_in",
        "quality": "unverified",
      };

  Future<VitalisHpiResultModel> fetchHealthspanIndex() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/healthspan-index"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        return VitalisHpiResultModel.fromJson(data);
      }
    } catch (_) {}
    return const VitalisHpiResultModel(
      hpiScore: null,
      coverage: 0,
      status: "INSUFFICIENT_DATA",
      domains: [],
      limitations: ["Healthspan data could not be loaded. Reconnect and refresh to retrieve your observations."],
    );
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
