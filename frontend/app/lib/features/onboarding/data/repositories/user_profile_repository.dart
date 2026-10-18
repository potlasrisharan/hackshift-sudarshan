import "dart:convert";
import "package:flutter/foundation.dart";
import "package:http/http.dart" as http;
import "package:shared_preferences/shared_preferences.dart";
import "../../../../core/network/api_config.dart";
import "../models/user_profile_model.dart";

class UserProfileRepository {
  static const String _profilePrefix = "ayusetu_user_profile_";

  Future<UserProfile?> getLocalProfile(String patientId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString("$_profilePrefix$patientId");
      if (str != null && str.isNotEmpty) {
        return UserProfile.fromJson(jsonDecode(str) as Map<String, dynamic>);
      }
    } catch (e) {
      debugPrint("Error reading local profile: $e");
    }
    return null;
  }

  Future<void> saveLocalProfile(UserProfile profile) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("$_profilePrefix${profile.patientId}", jsonEncode(profile.toJson()));
      // Also save to generic current profile key
      await prefs.setString("ayusetu_active_profile_v1", jsonEncode(profile.toJson()));
    } catch (e) {
      debugPrint("Error saving local profile: $e");
    }
  }

  Future<UserProfile> fetchAndSyncProfile({
    required String patientId,
    required String token,
  }) async {
    // Check local first
    final local = await getLocalProfile(patientId);

    try {
      final headers = {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      };

      // 1. Fetch preferences
      final prefRes = await http
          .get(Uri.parse("${ApiConfig.baseUrl}/patient/$patientId/preferences"), headers: headers)
          .timeout(const Duration(seconds: 4));

      Map<String, dynamic>? prefData;
      if (prefRes.statusCode == 200) {
        final d = jsonDecode(prefRes.body) as Map<String, dynamic>;
        prefData = d["preferences"] as Map<String, dynamic>?;
      }

      // 2. Fetch ayurveda
      final ayurRes = await http
          .get(Uri.parse("${ApiConfig.baseUrl}/patient/$patientId/ayurveda"), headers: headers)
          .timeout(const Duration(seconds: 4));

      Map<String, dynamic>? ayurData;
      if (ayurRes.statusCode == 200) {
        final d = jsonDecode(ayurRes.body) as Map<String, dynamic>;
        ayurData = d["ayurveda"] as Map<String, dynamic>?;
      }

      if (local != null) {
        final updated = local.copyWith(
          primaryFocus: prefData?["primaryFocus"]?.toString() ?? local.primaryFocus,
          themeMode: prefData?["themeMode"]?.toString() ?? local.themeMode,
          language: prefData?["language"]?.toString() ?? local.language,
          primaryDosha: ayurData?["primaryDosha"]?.toString() ?? local.primaryDosha,
          secondaryDosha: ayurData?["secondaryDosha"]?.toString() ?? local.secondaryDosha,
          prakritiSummary: ayurData?["prakritiSummary"]?.toString() ?? local.prakritiSummary,
        );
        await saveLocalProfile(updated);
        return updated;
      }
    } catch (e) {
      debugPrint("Error fetching remote profile: $e");
    }

    return local ??
        UserProfile(
          patientId: patientId,
          name: "AyuSetu Patient",
          phone: "+91 98765 43210",
          dob: "1994-06-15",
          onboardingComplete: false,
        );
  }

  Future<void> syncProfileToBackend(UserProfile profile, String token) async {
    await saveLocalProfile(profile);

    try {
      final headers = {
        "Authorization": "Bearer $token",
        "Content-Type": "application/json",
      };

      // Sync Profile
      await http.put(
        Uri.parse("${ApiConfig.baseUrl}/patient/${profile.patientId}/profile"),
        headers: headers,
        body: jsonEncode({
          "name": profile.name,
          "dob": profile.dob,
          "sex": profile.sex,
          "bloodGroup": profile.bloodGroup,
          "address": profile.address,
          "emergencyContact": profile.emergencyContact,
          "allergies": profile.allergies,
          "chronicConditions": profile.chronicConditions,
          "preferredLang": profile.language,
        }),
      );

      // Sync Preferences
      await http.put(
        Uri.parse("${ApiConfig.baseUrl}/patient/${profile.patientId}/preferences"),
        headers: headers,
        body: jsonEncode({
          "primaryFocus": profile.primaryFocus,
          "themeMode": profile.themeMode,
          "language": profile.language,
        }),
      );

      // Sync Ayurveda
      await http.put(
        Uri.parse("${ApiConfig.baseUrl}/patient/${profile.patientId}/ayurveda"),
        headers: headers,
        body: jsonEncode({
          "primaryDosha": profile.primaryDosha,
          "secondaryDosha": profile.secondaryDosha,
          "prakritiSummary": profile.prakritiSummary,
          "agniType": profile.agniType,
        }),
      );
    } catch (e) {
      debugPrint("Sync to backend skipped or queued: $e");
    }
  }
}
