import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../data/models/her_models.dart";
import "../../data/services/her_api_service.dart";
import "../../data/services/wearable_adapter.dart";

class HerState {
  final bool isLoading;
  final String activeScenario;
  final HerProfileModel profile;
  final List<HerCycleModel> cycles;
  final HerCycleAnalysisModel cycleAnalysis;
  final List<HerSymptomModel> symptoms;
  final SafetyCheckResultModel? activeSafetyAlert;
  final List<HerScreeningFindingModel> findings;
  final List<HerWellnessItemModel> wellnessItems;
  final List<HerWearableModel> wearableRecords;
  final HerDoctorSummaryModel? doctorSummary;
  final String? errorMessage;

  const HerState({
    this.isLoading = false,
    this.activeScenario = "SCENARIO_B_PCOS",
    this.profile = const HerProfileModel(patientId: "demo_patient_her", yearOfBirth: 1999),
    this.cycles = const [],
    this.cycleAnalysis = const HerCycleAnalysisModel(),
    this.symptoms = const [],
    this.activeSafetyAlert,
    this.findings = const [],
    this.wellnessItems = const [],
    this.wearableRecords = const [],
    this.doctorSummary,
    this.errorMessage,
  });

  HerState copyWith({
    bool? isLoading,
    String? activeScenario,
    HerProfileModel? profile,
    List<HerCycleModel>? cycles,
    HerCycleAnalysisModel? cycleAnalysis,
    List<HerSymptomModel>? symptoms,
    SafetyCheckResultModel? activeSafetyAlert,
    bool clearSafetyAlert = false,
    List<HerScreeningFindingModel>? findings,
    List<HerWellnessItemModel>? wellnessItems,
    List<HerWearableModel>? wearableRecords,
    HerDoctorSummaryModel? doctorSummary,
    String? errorMessage,
  }) {
    return HerState(
      isLoading: isLoading ?? this.isLoading,
      activeScenario: activeScenario ?? this.activeScenario,
      profile: profile ?? this.profile,
      cycles: cycles ?? this.cycles,
      cycleAnalysis: cycleAnalysis ?? this.cycleAnalysis,
      symptoms: symptoms ?? this.symptoms,
      activeSafetyAlert: clearSafetyAlert ? null : (activeSafetyAlert ?? this.activeSafetyAlert),
      findings: findings ?? this.findings,
      wellnessItems: wellnessItems ?? this.wellnessItems,
      wearableRecords: wearableRecords ?? this.wearableRecords,
      doctorSummary: doctorSummary ?? this.doctorSummary,
      errorMessage: errorMessage,
    );
  }
}

class HerNotifier extends StateNotifier<HerState> {
  final HerApiService _apiService;
  final HealthPlatformAdapter _wearableAdapter;

  HerNotifier(this._apiService, this._wearableAdapter) : super(const HerState()) {
    loadAll();
  }

  Future<void> loadAll() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final profile = await _apiService.fetchProfile();
      final (cycles, analysis) = await _apiService.fetchCycles();
      final symptoms = await _apiService.fetchSymptoms();
      final findings = await _apiService.evaluateScreening();
      final wellness = await _apiService.fetchWellness();
      final wearables = await _wearableAdapter.fetchRecentMetrics(days: 30);

      state = state.copyWith(
        isLoading: false,
        profile: profile,
        cycles: cycles,
        cycleAnalysis: analysis,
        symptoms: symptoms,
        findings: findings,
        wellnessItems: wellness,
        wearableRecords: wearables,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> seedScenario(String scenarioKey) async {
    state = state.copyWith(isLoading: true, activeScenario: scenarioKey);
    await _apiService.seedDemoScenario(scenarioKey);
    await loadAll();
  }

  Future<void> logCycle(HerCycleModel cycle) async {
    state = state.copyWith(isLoading: true);
    await _apiService.logCycle(cycle);
    final (cycles, analysis) = await _apiService.fetchCycles();
    state = state.copyWith(
      isLoading: false,
      cycles: cycles,
      cycleAnalysis: analysis,
    );
  }

  Future<void> logSymptom(Map<String, Object?> payload) async {
    state = state.copyWith(isLoading: true);
    final (sym, safety) = await _apiService.logSymptom(payload);
    final symptoms = [sym, ...state.symptoms];

    state = state.copyWith(
      isLoading: false,
      symptoms: symptoms,
      activeSafetyAlert: safety.isUrgent ? safety : null,
    );
  }

  void dismissSafetyAlert() {
    state = state.copyWith(clearSafetyAlert: true);
  }

  Future<void> generateDoctorSummary() async {
    state = state.copyWith(isLoading: true);
    final summary = await _apiService.generateDoctorSummary();
    state = state.copyWith(isLoading: false, doctorSummary: summary);
  }

  Future<void> revokeDoctorSummary() async {
    if (state.doctorSummary == null) return;
    await _apiService.revokeDoctorSummary(state.doctorSummary!.id);
    state = state.copyWith(
      doctorSummary: HerDoctorSummaryModel(
        id: state.doctorSummary!.id,
        patientId: state.doctorSummary!.patientId,
        generatedAt: state.doctorSummary!.generatedAt,
        isRevoked: true,
        shareToken: state.doctorSummary!.shareToken,
      ),
    );
  }

  Future<void> syncWearables() async {
    state = state.copyWith(isLoading: true);
    final data = await _wearableAdapter.fetchRecentMetrics(days: 14);
    state = state.copyWith(isLoading: false, wearableRecords: data);
  }
}

final herApiServiceProvider = Provider<HerApiService>((ref) {
  return const HerApiService();
});

final wearableAdapterProvider = Provider<HealthPlatformAdapter>((ref) {
  return SyntheticWearableDemoAdapter();
});

final herProvider = StateNotifierProvider<HerNotifier, HerState>((ref) {
  final api = ref.watch(herApiServiceProvider);
  final adapter = ref.watch(wearableAdapterProvider);
  return HerNotifier(api, adapter);
});
