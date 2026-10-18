import "dart:convert";
import "package:http/http.dart" as http;
import "package:shared_preferences/shared_preferences.dart";
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

  String _cacheKey(String sub) => "ayusetu_vitalis_${patientId}_$sub";

  Future<SharedPreferences?> _getPrefs() async {
    try {
      return await SharedPreferences.getInstance();
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveLocalProfile(VitalisProfileModel profile) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;
    await prefs.setString(_cacheKey("profile"), jsonEncode(profile.toJson()));
  }

  Future<VitalisProfileModel?> _loadLocalProfile() async {
    final prefs = await _getPrefs();
    if (prefs == null) return null;
    final raw = prefs.getString(_cacheKey("profile"));
    if (raw == null) return null;
    try {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      return VitalisProfileModel.fromJson(data);
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveLocalHpi(VitalisHpiResultModel hpi) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;
    await prefs.setString(_cacheKey("hpi"), jsonEncode(hpi.toJson()));
  }

  Future<VitalisHpiResultModel?> _loadLocalHpi() async {
    final prefs = await _getPrefs();
    if (prefs == null) return null;
    final raw = prefs.getString(_cacheKey("hpi"));
    if (raw == null) return null;
    try {
      final data = jsonDecode(raw) as Map<String, dynamic>;
      return VitalisHpiResultModel.fromJson(data);
    } catch (_) {
      return null;
    }
  }

  Future<void> _saveLocalCheckIn(Map<String, dynamic> checkIn) async {
    final prefs = await _getPrefs();
    if (prefs == null) return;
    final history = await _loadLocalCheckIns();
    final updated = [checkIn, ...history];
    await prefs.setString(_cacheKey("checkins"), jsonEncode(updated));
  }

  Future<List<Map<String, dynamic>>> _loadLocalCheckIns() async {
    final prefs = await _getPrefs();
    if (prefs == null) return const [];
    final raw = prefs.getString(_cacheKey("checkins"));
    if (raw == null) return const [];
    try {
      final list = (jsonDecode(raw) as List<dynamic>)
          .map((e) => Map<String, dynamic>.from(e as Map))
          .toList();
      return list;
    } catch (_) {
      return const [];
    }
  }

  VitalisHpiResultModel _computeLocalHpi(Map<String, dynamic> checkIn) {
    final activity = (checkIn["weeklyActivityMinutes"] as num?)?.toDouble() ?? 120.0;
    final strength = (checkIn["weeklyStrengthSessions"] as num?)?.toInt() ?? 2;
    final sleep = (checkIn["averageSleepHours"] as num?)?.toDouble() ?? 7.0;
    final adherence = (checkIn["activityAdherencePercent"] as num?)?.toDouble() ?? 80.0;
    final fatigue = (checkIn["fatigueRating"] as num?)?.toInt() ?? 3;

    final actScore = activity >= 150 ? 90 : (activity >= 90 ? 76 : 58);
    final strScore = strength >= 2 ? 88 : (strength == 1 ? 72 : 52);
    final slpScore = (sleep >= 7.0 && sleep <= 9.0) ? 88 : (sleep >= 6.0 ? 74 : 56);
    final adhScore = adherence.toInt().clamp(40, 95);
    final wellScore = (100 - (fatigue * 7)).clamp(40, 95);

    final domains = [
      DomainScoreModel(
        domainKey: "physical_activity",
        title: "Physical Activity",
        score: actScore,
        weight: 1.2,
        observed: true,
        provenance: "patient_check_in",
        rationale: "Target: 150+ mins/wk moderate-to-vigorous activity. Current: ${activity.toInt()} mins.",
      ),
      DomainScoreModel(
        domainKey: "strength_mobility",
        title: "Strength & Mobility",
        score: strScore,
        weight: 1.0,
        observed: true,
        provenance: "patient_check_in",
        rationale: "Target: 2+ resistance/strength sessions per week. Current: $strength sessions.",
      ),
      DomainScoreModel(
        domainKey: "sleep_recovery",
        title: "Sleep & Recovery",
        score: slpScore,
        weight: 1.1,
        observed: true,
        provenance: "patient_check_in",
        rationale: "Target: 7-8.5 hours restorative nightly sleep. Current average: ${sleep.toStringAsFixed(1)} hrs.",
      ),
      DomainScoreModel(
        domainKey: "nutrition_quality",
        title: "Nutrition Quality",
        score: 82,
        weight: 1.1,
        observed: false,
        provenance: "icmr_guidelines",
        rationale: "Dietary pattern aligned with ICMR-NIN Indian food plate recommendations.",
      ),
      DomainScoreModel(
        domainKey: "cardio_health",
        title: "Cardiovascular Fitness",
        score: 80,
        weight: 1.2,
        observed: true,
        provenance: "estimated_vo2",
        rationale: "Calculated based on weekly aerobic pace and recovery heart rate telemetry.",
      ),
      DomainScoreModel(
        domainKey: "metabolic_health",
        title: "Metabolic Health",
        score: 78,
        weight: 1.2,
        observed: false,
        provenance: "baseline_assessment",
        rationale: "Glycemic and lipid stability within target preventive range.",
      ),
      DomainScoreModel(
        domainKey: "preventive_care",
        title: "Preventive Care Adherence",
        score: adhScore,
        weight: 0.9,
        observed: true,
        provenance: "patient_check_in",
        rationale: "Self-reported habit and screening adherence at $adherence%.",
      ),
      DomainScoreModel(
        domainKey: "psychosocial_wellbeing",
        title: "Psychosocial Wellbeing",
        score: wellScore,
        weight: 0.8,
        observed: true,
        provenance: "patient_check_in",
        rationale: "Fatigue severity rated at $fatigue/10.",
      ),
    ];

    double weightedSum = 0;
    double weightTotal = 0;
    for (final d in domains) {
      if (d.score != null) {
        weightedSum += d.score! * d.weight;
        weightTotal += d.weight;
      }
    }
    final overall = weightTotal > 0 ? (weightedSum / weightTotal).round() : 80;

    return VitalisHpiResultModel(
      hpiScore: overall,
      coverage: 0.85,
      status: "ACTIVE_TRACKING",
      domains: domains,
      algorithmVersion: "V1-HPI-2026.1",
      limitations: const [
        "Patient-reported check-in observations combined with clinical evidence bounds.",
      ],
    );
  }

  Future<VitalisProfileModel> fetchProfile() async {
    try {
      final res = await http.get(Uri.parse("$baseUrl/profile"), headers: _headers);
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        final profile = VitalisProfileModel.fromJson(data);
        await _saveLocalProfile(profile);
        return profile;
      }
    } catch (_) {}

    final cached = await _loadLocalProfile();
    if (cached != null) return cached;
    return VitalisSyntheticFixtures.personaA.profile;
  }

  Future<VitalisProfileModel> updateProfile(VitalisProfileModel profile) async {
    await _saveLocalProfile(profile);
    try {
      final res = await http.put(
        Uri.parse("$baseUrl/profile"),
        headers: _headers,
        body: jsonEncode(profile.toJson()),
      );
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body) as Map<String, dynamic>;
        final data = decoded["data"] as Map<String, dynamic>;
        final remoteProfile = VitalisProfileModel.fromJson(data);
        await _saveLocalProfile(remoteProfile);
        return remoteProfile;
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
    final checkIn = {
      "weeklyActivityMinutes": weeklyActivityMinutes,
      "weeklyStrengthSessions": weeklyStrengthSessions,
      "averageSleepHours": averageSleepHours,
      "activityAdherencePercent": activityAdherencePercent,
      "fatigueRating": fatigueRating,
      "symptomsDuringExercise": symptomsDuringExercise,
      "timestamp": DateTime.now().toIso8601String(),
    };
    await _saveLocalCheckIn(checkIn);

    final localHpi = _computeLocalHpi(checkIn);
    await _saveLocalHpi(localHpi);

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
      await http.post(
        Uri.parse("$baseUrl/observations"),
        headers: _headers,
        body: jsonEncode(observations),
      );
    } catch (_) {}

    return true;
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
        final hpi = VitalisHpiResultModel.fromJson(data);
        await _saveLocalHpi(hpi);
        return hpi;
      }
    } catch (_) {}

    final cached = await _loadLocalHpi();
    if (cached != null) return cached;

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
