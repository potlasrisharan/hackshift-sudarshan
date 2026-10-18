import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../auth/presentation/providers/auth_provider.dart";
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
  final HerCyclePhaseDetailModel? todayPhase;
  final List<HerMonthPhaseEntryModel> monthPhases;
  final HerPcodAssessmentModel? pcodAssessment;
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
    this.todayPhase,
    this.monthPhases = const [],
    this.pcodAssessment,
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
    HerCyclePhaseDetailModel? todayPhase,
    List<HerMonthPhaseEntryModel>? monthPhases,
    HerPcodAssessmentModel? pcodAssessment,
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
      todayPhase: todayPhase ?? this.todayPhase,
      monthPhases: monthPhases ?? this.monthPhases,
      pcodAssessment: pcodAssessment ?? this.pcodAssessment,
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
      final todayPhase = await _apiService.fetchTodayPhase();
      final now = DateTime.now();
      final monthPhases = await _apiService.fetchMonthPhases(now.year, now.month);
      final pcod = await _apiService.fetchPcodAssessment();

      final resolvedCycles = cycles.isNotEmpty ? cycles : state.cycles;
      final resolvedSymptoms = symptoms.isNotEmpty ? symptoms : state.symptoms;
      final resolvedAnalysis = cycles.isNotEmpty ? analysis : state.cycleAnalysis;

      state = state.copyWith(
        isLoading: false,
        profile: profile,
        cycles: resolvedCycles,
        cycleAnalysis: resolvedAnalysis,
        symptoms: resolvedSymptoms,
        findings: findings.isNotEmpty ? findings : state.findings,
        wellnessItems: wellness,
        wearableRecords: wearables,
        todayPhase: todayPhase,
        monthPhases: monthPhases,
        pcodAssessment: pcod,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> selectDatePhase(String date) async {
    try {
      final detail = await _apiService.fetchTodayPhase(date: date);
      state = state.copyWith(todayPhase: detail);
    } catch (_) {}
  }

  Future<void> loadMonthPhases(int year, int month) async {
    try {
      final entries = await _apiService.fetchMonthPhases(year, month);
      state = state.copyWith(monthPhases: entries);
    } catch (_) {}
  }

  Future<void> refreshPcod() async {
    try {
      final pcod = await _apiService.fetchPcodAssessment();
      state = state.copyWith(pcodAssessment: pcod);
    } catch (_) {}
  }

  Future<void> seedScenario(String scenarioKey) async {
    state = state.copyWith(isLoading: true, activeScenario: scenarioKey);
    await _apiService.seedDemoScenario(scenarioKey);
    await loadAll();
  }

  Future<void> updateProfile(HerProfileModel updated) async {
    state = state.copyWith(isLoading: true);
    try {
      final saved = await _apiService.updateProfile(updated);
      final (cycles, analysis) = await _apiService.fetchCycles();
      final findings = await _apiService.evaluateScreening();
      final wellness = await _apiService.fetchWellness();
      final todayPhase = await _apiService.fetchTodayPhase();
      final pcod = await _apiService.fetchPcodAssessment();
      state = state.copyWith(
        isLoading: false,
        profile: saved,
        cycles: cycles.isNotEmpty ? cycles : state.cycles,
        cycleAnalysis: analysis,
        findings: findings.isNotEmpty ? findings : state.findings,
        wellnessItems: wellness,
        todayPhase: todayPhase,
        pcodAssessment: pcod,
      );
    } catch (_) {
      state = state.copyWith(isLoading: false, profile: updated);
    }
  }

  Future<void> logCycle(HerCycleModel cycle) async {
    state = state.copyWith(isLoading: true);
    await _apiService.logCycle(cycle);
    final (cycles, analysis) = await _apiService.fetchCycles();
    state = state.copyWith(
      isLoading: false,
      cycles: cycles.isNotEmpty ? cycles : [cycle, ...state.cycles],
      cycleAnalysis: analysis,
    );
  }

  Future<void> logSymptom(Map<String, Object?> payload) async {
    state = state.copyWith(isLoading: true);
    final (sym, safety) = await _apiService.logSymptom(payload);
    final symptoms = [sym, ...state.symptoms.where((s) => s.id != sym.id)];

    state = state.copyWith(
      isLoading: false,
      symptoms: symptoms,
      activeSafetyAlert: safety.isUrgent ? safety : null,
    );
  }

  Future<void> evaluateScreening({Map<String, Object?>? answers}) async {
    state = state.copyWith(isLoading: true);
    final findings = await _apiService.evaluateScreening(answers: answers);
    state = state.copyWith(
      isLoading: false,
      findings: findings,
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
  final authState = ref.watch(authProvider);
  final patientId = authState.session?.patientId;
  final effectivePatientId = (patientId != null && patientId.isNotEmpty)
      ? patientId
      : "demo_patient_her";
  return HerApiService(patientId: effectivePatientId);
});

final wearableAdapterProvider = Provider<HealthPlatformAdapter>((ref) {
  return SyntheticWearableDemoAdapter();
});

final herProvider = StateNotifierProvider<HerNotifier, HerState>((ref) {
  final api = ref.watch(herApiServiceProvider);
  final adapter = ref.watch(wearableAdapterProvider);
  return HerNotifier(api, adapter);
});
