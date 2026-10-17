import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../data/models/vitalis_models.dart";
import "../../data/services/vitalis_api_service.dart";
import "../../data/services/vitalis_wearable_adapter.dart";
import "../../data/fixtures/vitalis_synthetic_fixtures.dart";

export "../../data/models/vitalis_models.dart";
export "../../data/fixtures/vitalis_synthetic_fixtures.dart";

final vitalisApiServiceProvider = Provider<VitalisApiService>((ref) {
  return const VitalisApiService();
});

final vitalisWearableAdapterProvider = Provider<VitalisWearableAdapter>((ref) {
  return VitalisWearableAdapter();
});

class VitalisState {
  final VitalisSyntheticPersona activePersona;
  final VitalisProfileModel profile;
  final VitalisHpiResultModel hpiResult;
  final VitalisBiomarkerTrendModel biomarkerTrend;
  final VitalisCardioModel cardio;
  final VitalisReadinessModel readiness;
  final VitalisExercisePlanModel exercisePlan;
  final VitalisNutritionPlanModel nutritionPlan;
  final List<VitalisPreventiveItemModel> preventiveItems;
  final List<VitalisRecommendationModel> recommendations;
  final VitalisSafetyAlertModel? safetyAlert;
  final bool isWearableConnected;
  final bool isLoading;

  const VitalisState({
    required this.activePersona,
    required this.profile,
    required this.hpiResult,
    required this.biomarkerTrend,
    required this.cardio,
    required this.readiness,
    required this.exercisePlan,
    required this.nutritionPlan,
    required this.preventiveItems,
    required this.recommendations,
    this.safetyAlert,
    this.isWearableConnected = true,
    this.isLoading = false,
  });

  FunctionalHealth get functional => const FunctionalHealth();
  VitalisCardioModel get activity => cardio;
  VitalisReadinessModel get sleep => readiness;
  VitalisHpiResultModel get healthspanIndex => hpiResult;
  BiomarkerSnapshot get biomarkers => const BiomarkerSnapshot();
  VitalisWearableAdapter get wearables => VitalisWearableAdapter();

  VitalisState copyWith({
    VitalisSyntheticPersona? activePersona,
    VitalisProfileModel? profile,
    VitalisHpiResultModel? hpiResult,
    VitalisBiomarkerTrendModel? biomarkerTrend,
    VitalisCardioModel? cardio,
    VitalisReadinessModel? readiness,
    VitalisExercisePlanModel? exercisePlan,
    VitalisNutritionPlanModel? nutritionPlan,
    List<VitalisPreventiveItemModel>? preventiveItems,
    List<VitalisRecommendationModel>? recommendations,
    VitalisSafetyAlertModel? safetyAlert,
    bool? isWearableConnected,
    bool? isLoading,
  }) {
    return VitalisState(
      activePersona: activePersona ?? this.activePersona,
      profile: profile ?? this.profile,
      hpiResult: hpiResult ?? this.hpiResult,
      biomarkerTrend: biomarkerTrend ?? this.biomarkerTrend,
      cardio: cardio ?? this.cardio,
      readiness: readiness ?? this.readiness,
      exercisePlan: exercisePlan ?? this.exercisePlan,
      nutritionPlan: nutritionPlan ?? this.nutritionPlan,
      preventiveItems: preventiveItems ?? this.preventiveItems,
      recommendations: recommendations ?? this.recommendations,
      safetyAlert: safetyAlert ?? this.safetyAlert,
      isWearableConnected: isWearableConnected ?? this.isWearableConnected,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class VitalisNotifier extends StateNotifier<VitalisState> {
  final VitalisApiService apiService;

  VitalisNotifier(this.apiService)
      : super(
          VitalisState(
            activePersona: VitalisSyntheticFixtures.personaA,
            profile: VitalisSyntheticFixtures.personaA.profile,
            hpiResult: VitalisSyntheticFixtures.personaA.hpiResult,
            biomarkerTrend: VitalisSyntheticFixtures.personaA.biomarkerTrend,
            cardio: VitalisSyntheticFixtures.personaA.cardio,
            readiness: VitalisSyntheticFixtures.personaA.readiness,
            exercisePlan: VitalisSyntheticFixtures.personaA.exercisePlan,
            nutritionPlan: VitalisSyntheticFixtures.personaA.nutritionPlan,
            preventiveItems: VitalisSyntheticFixtures.personaA.preventiveItems,
            recommendations: const [
              VitalisRecommendationModel(id: "REC-1", title: "150 Minutes Moderate Aerobic Walking", category: "lifestyle_activity", priorityScore: 0.92, evidenceSource: "WHO 2020 Guidelines"),
              VitalisRecommendationModel(id: "REC-2", title: "Daily Dals & Pulses with Lemon (Vitamin C)", category: "nutrition", priorityScore: 0.88, evidenceSource: "ICMR Dietary Guidelines"),
              VitalisRecommendationModel(id: "REC-3", title: "Consistent 30-min Sleep Schedule Window", category: "sleep", priorityScore: 0.84, evidenceSource: "National Sleep Foundation"),
            ],
            safetyAlert: VitalisSyntheticFixtures.personaA.safetyAlert,
            isWearableConnected: true,
          ),
        ) {
    refreshFromBackend();
  }

  Future<void> refreshFromBackend() async {
    state = state.copyWith(isLoading: true);
    final profile = await apiService.fetchProfile();
    final hpi = await apiService.fetchHealthspanIndex();
    final trends = await apiService.fetchBiomarkerTrend();
    final cardio = await apiService.fetchCardioFitness();
    final readiness = await apiService.fetchDailyReadiness();
    final exercisePlan = await apiService.fetchExercisePlan();
    final nutritionPlan = await apiService.fetchNutritionPlan();
    final preventiveItems = await apiService.fetchPreventiveCare();
    final recommendations = await apiService.fetchRecommendations();
    state = state.copyWith(
      profile: profile,
      hpiResult: hpi,
      biomarkerTrend: trends,
      cardio: cardio,
      readiness: readiness,
      exercisePlan: exercisePlan,
      nutritionPlan: nutritionPlan,
      preventiveItems: preventiveItems,
      recommendations: recommendations,
      isLoading: false,
    );
  }

  void switchPersona(VitalisSyntheticPersona persona) {
    state = state.copyWith(
      activePersona: persona,
      profile: persona.profile,
      hpiResult: persona.hpiResult,
      biomarkerTrend: persona.biomarkerTrend,
      cardio: persona.cardio,
      readiness: persona.readiness,
      exercisePlan: persona.exercisePlan,
      nutritionPlan: persona.nutritionPlan,
      preventiveItems: persona.preventiveItems,
      safetyAlert: persona.safetyAlert,
      isWearableConnected: persona.isWearableConnected,
    );
  }

  void updateProfile(VitalisProfileModel updated) {
    state = state.copyWith(profile: updated);
  }

  Future<void> saveProfile(VitalisProfileModel updated) async {
    state = state.copyWith(isLoading: true, profile: updated);
    try {
      final saved = await apiService.updateProfile(updated);
      state = state.copyWith(isLoading: false, profile: saved);
    } catch (_) {
      state = state.copyWith(isLoading: false, profile: updated);
    }
  }

  void dismissSafetyAlert() {
    state = state.copyWith(safetyAlert: null);
  }

  void triggerChestPainEmergency() {
    state = state.copyWith(
      safetyAlert: const VitalisSafetyAlertModel(
        isUrgent: true,
        decision: "URGENT_EVALUATION",
        ruleId: "V0-RED01-CHEST-PAIN",
        reason: "Acute chest discomfort / tightness reported.",
        emergencyGuidance: "Seek immediate medical attention or emergency hospital triage. Do not engage in exercise or physical exertion.",
        evidence: ["Chest pain / discomfort reported on evaluation."],
      ),
    );
  }
}

final vitalisProvider = StateNotifierProvider<VitalisNotifier, VitalisState>((ref) {
  final api = ref.watch(vitalisApiServiceProvider);
  return VitalisNotifier(api);
});
