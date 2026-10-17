import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:kiosk_app/features/intake/data/models/patient_model.dart";
import "package:kiosk_app/features/intake/data/sources/api_client.dart";

class IntakeState {
  final String selectedLanguage;
  final String systemType;
  final PatientModel? patient;
  final bool isPmjayActive;
  final List<Map<String, String>> chatMessages;
  final List<String> currentOptions;
  final bool redFlagTriggered;
  final List<Map<String, dynamic>> extractedMedications;
  final List<Map<String, dynamic>> extractedLabs;
  final String tokenNumber;

  IntakeState({
    this.selectedLanguage = "Hindi (हिन्दी)",
    this.systemType = "HYBRID",
    this.patient,
    this.isPmjayActive = true,
    this.chatMessages = const [],
    this.currentOptions = const ["Haan, bilkul", "Nahi", "Thoda bohot"],
    this.redFlagTriggered = false,
    this.extractedMedications = const [],
    this.extractedLabs = const [],
    this.tokenNumber = "#042",
  });

  IntakeState copyWith({
    String? selectedLanguage,
    String? systemType,
    PatientModel? patient,
    bool? isPmjayActive,
    List<Map<String, String>>? chatMessages,
    List<String>? currentOptions,
    bool? redFlagTriggered,
    List<Map<String, dynamic>>? extractedMedications,
    List<Map<String, dynamic>>? extractedLabs,
    String? tokenNumber,
  }) {
    return IntakeState(
      selectedLanguage: selectedLanguage ?? this.selectedLanguage,
      systemType: systemType ?? this.systemType,
      patient: patient ?? this.patient,
      isPmjayActive: isPmjayActive ?? this.isPmjayActive,
      chatMessages: chatMessages ?? this.chatMessages,
      currentOptions: currentOptions ?? this.currentOptions,
      redFlagTriggered: redFlagTriggered ?? this.redFlagTriggered,
      extractedMedications: extractedMedications ?? this.extractedMedications,
      extractedLabs: extractedLabs ?? this.extractedLabs,
      tokenNumber: tokenNumber ?? this.tokenNumber,
    );
  }
}

class IntakeNotifier extends StateNotifier<IntakeState> {
  final ApiClient _api = ApiClient();

  IntakeNotifier() : super(IntakeState());

  void setLanguage(String lang) {
    state = state.copyWith(selectedLanguage: lang);
  }

  void setSystemType(String type) {
    state = state.copyWith(systemType: type);
  }

  Future<void> scanAbha() async {
    final patientData = await _api.verifyAbha("91-4829-1029-4821");
    final coverage = await _api.checkCoverage("91-4829-1029-4821");
    
    state = state.copyWith(
      patient: PatientModel(
        patientId: patientData["patient_id"] ?? "pat-048291",
        abhaNumber: patientData["abha_number"] ?? "91-4829-1029-4821",
        abhaAddress: patientData["abha_address"] ?? "ramesh.chandra@abdm",
        name: patientData["name"] ?? "Ramesh Chandra",
        gender: patientData["gender"] ?? "MALE",
        age: patientData["age"] ?? 52,
        phone: patientData["phone"] ?? "+91 9876543210",
        address: patientData["address"] ?? "Khammam, Telangana, India",
        pmjayEligible: coverage["eligible"] ?? true,
      ),
      isPmjayActive: coverage["eligible"] ?? true,
    );
  }

  Future<void> sendPatientSpeech(String text) async {
    final updatedMessages = List<Map<String, String>>.from(state.chatMessages);
    updatedMessages.add({"role": "patient", "text": text});
    
    final response = await _api.sendChat(text, state.systemType);
    final reply = response["reply_text"] ?? "Samajh gaya.";
    final opts = List<String>.from(response["suggested_options"] ?? []);
    final isRed = response["red_flag"]?["is_triggered"] ?? false;

    updatedMessages.add({"role": "system", "text": reply});

    state = state.copyWith(
      chatMessages: updatedMessages,
      currentOptions: opts,
      redFlagTriggered: isRed,
    );
  }

  Future<void> triggerOcr() async {
    final ocrData = await _api.processOcr();
    state = state.copyWith(
      extractedMedications: List<Map<String, dynamic>>.from(ocrData["medications"] ?? []),
      extractedLabs: List<Map<String, dynamic>>.from(ocrData["lab_results"] ?? []),
    );
  }
}

final intakeProvider = StateNotifierProvider<IntakeNotifier, IntakeState>((ref) {
  return IntakeNotifier();
});
