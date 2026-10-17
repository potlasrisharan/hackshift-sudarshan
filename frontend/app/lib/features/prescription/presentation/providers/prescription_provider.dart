import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/services/medicine_reminder_service.dart";
import "../../data/models/prescription_models.dart";

@immutable
class PrescriptionState {
  final bool isLoading;
  final String? errorMessage;
  final DoctorAdvice? doctorAdvice;
  final List<MedicineItem> medicines;
  final ReminderRoutine routine;
  final int streakDays;

  const PrescriptionState({
    this.isLoading = false,
    this.errorMessage,
    this.doctorAdvice,
    this.medicines = const [],
    this.routine = const ReminderRoutine(),
    this.streakDays = 5,
  });

  PrescriptionState copyWith({
    bool? isLoading,
    String? errorMessage,
    DoctorAdvice? doctorAdvice,
    List<MedicineItem>? medicines,
    ReminderRoutine? routine,
    int? streakDays,
  }) {
    return PrescriptionState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      doctorAdvice: doctorAdvice ?? this.doctorAdvice,
      medicines: medicines ?? this.medicines,
      routine: routine ?? this.routine,
      streakDays: streakDays ?? this.streakDays,
    );
  }

  List<MedicineItem> get morningMedicines =>
      medicines.where((m) => m.timeSlot == MedicineTimeSlot.morning).toList();

  List<MedicineItem> get afternoonMedicines =>
      medicines.where((m) => m.timeSlot == MedicineTimeSlot.afternoon).toList();

  List<MedicineItem> get nightMedicines =>
      medicines.where((m) => m.timeSlot == MedicineTimeSlot.night).toList();

  int get takenCount => medicines.where((m) => m.isTaken).length;
  int get totalCount => medicines.length;

  double get adherenceProgress =>
      totalCount == 0 ? 0.0 : (takenCount / totalCount).clamp(0.0, 1.0);

  bool get isAllTakenToday => totalCount > 0 && takenCount == totalCount;
}

const mockDoctorAdvice = DoctorAdvice(
  doctorName: "Dr. Ananya Sharma",
  specialty: "Senior Physician · Rheumatology & Integrative Ayurveda",
  hospital: "All India Institute of Ayurveda (AIIA)",
  opdRoom: "OPD-3",
  rxId: "#RX-2026-A8921",
  prescriptionDate: "18 Oct 2026",
  validTillDate: "01 Nov 2026",
  dietRestrictions: [
    "Avoid fermented curds, refrigerated foods, and carbonated beverages",
    "Restrict high-purine lentils (toor dal, black gram) during acute flare-ups",
    "Prefer warm moong soup, boiled vegetables with cow's ghee and roasted cumin",
  ],
  hydrationTarget: "2.8L of warm water or CCF (Cumin-Coriander-Fennel) infusion daily",
  followUpDate: "Nov 02, 2026 · OPD-3 · In 14 Days",
  doctorNotes:
      "Vata-shamana & Rasayana protocol: Continue medication consistently for 14 days. If knee stiffness flares up in morning, apply warm castor oil pack for 15 mins.",
);

const mockMedicines = [
  MedicineItem(
    id: "med-01",
    prescriptionId: "rx-98124a-2026",
    name: "Yograj Guggulu",
    dosageForm: "Tablet",
    strength: "500 mg",
    timeSlot: MedicineTimeSlot.morning,
    scheduledTime: "08:00 AM",
    instructions: "1 tablet with lukewarm water 15 mins after breakfast",
    batchNumber: "BAT-2026-Y89",
    expiryDate: "11/2027",
    isTaken: true,
    reminderEnabled: true,
  ),
  MedicineItem(
    id: "med-02",
    prescriptionId: "rx-98124a-2026",
    name: "Dashamularishta",
    dosageForm: "Asava / Elixir",
    strength: "20 ml",
    timeSlot: MedicineTimeSlot.afternoon,
    scheduledTime: "01:00 PM",
    instructions: "20 ml mixed with 20 ml equal warm water after lunch",
    batchNumber: "BAT-2026-D12",
    expiryDate: "04/2028",
    isTaken: false,
    reminderEnabled: true,
  ),
  MedicineItem(
    id: "med-03",
    prescriptionId: "rx-98124a-2026",
    name: "Shatavari Churna",
    dosageForm: "Churna / Powder",
    strength: "3 g",
    timeSlot: MedicineTimeSlot.night,
    scheduledTime: "08:30 PM",
    instructions: "3 grams with warm almond/cow milk 30 mins before sleep",
    batchNumber: "BAT-2026-S44",
    expiryDate: "09/2027",
    isTaken: false,
    reminderEnabled: true,
  ),
  MedicineItem(
    id: "med-04",
    prescriptionId: "rx-98124a-2026",
    name: "Triphala Churna",
    dosageForm: "Churna / Powder",
    strength: "5 g",
    timeSlot: MedicineTimeSlot.night,
    scheduledTime: "09:30 PM",
    instructions: "1 teaspoon with hot water right before bedtime",
    batchNumber: "BAT-2026-T10",
    expiryDate: "12/2027",
    isTaken: false,
    reminderEnabled: true,
  ),
];

class PrescriptionNotifier extends StateNotifier<PrescriptionState> {
  final MedicineReminderService _reminderService;

  PrescriptionNotifier(this._reminderService)
      : super(const PrescriptionState(
          isLoading: false,
          doctorAdvice: mockDoctorAdvice,
          medicines: mockMedicines,
          streakDays: 5,
        )) {
    loadPrescription();
  }

  Future<void> loadPrescription() async {
    try {
      try {
        await _reminderService.initialize();
      } catch (e) {
        debugPrint("Service init: $e");
      }

      // Schedule active reminders
      final activeScheduled = mockMedicines
          .where((m) => m.reminderEnabled && !m.isTaken)
          .map((m) => m.toScheduledMedication())
          .toList();
      try {
        await _reminderService.schedulePrescription(activeScheduled);
      } catch (e) {
        debugPrint("Schedule prescription: $e");
      }
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
    }
  }

  Future<void> toggleTaken(String medicineId) async {
    final updatedList = state.medicines.map((med) {
      if (med.id == medicineId) {
        final newTaken = !med.isTaken;
        final updated = med.copyWith(
          isTaken: newTaken,
          takenAt: newTaken ? DateTime.now() : null,
        );
        if (newTaken) {
          _reminderService.cancelMedicationReminders(updated.toScheduledMedication());
        } else if (updated.reminderEnabled) {
          _reminderService.scheduleMedicationReminders(updated.toScheduledMedication());
        }
        return updated;
      }
      return med;
    }).toList();

    state = state.copyWith(medicines: updatedList);
  }

  Future<void> toggleReminder(String medicineId) async {
    final updatedList = state.medicines.map((med) {
      if (med.id == medicineId) {
        final updated = med.copyWith(reminderEnabled: !med.reminderEnabled);
        if (updated.reminderEnabled && !updated.isTaken) {
          _reminderService.scheduleMedicationReminders(updated.toScheduledMedication());
        } else {
          _reminderService.cancelMedicationReminders(updated.toScheduledMedication());
        }
        return updated;
      }
      return med;
    }).toList();

    state = state.copyWith(medicines: updatedList);
  }

  Future<void> markSlotDone(MedicineTimeSlot slot) async {
    final updatedList = state.medicines.map((med) {
      if (med.timeSlot == slot && !med.isTaken) {
        final updated = med.copyWith(isTaken: true, takenAt: DateTime.now());
        _reminderService.cancelMedicationReminders(updated.toScheduledMedication());
        return updated;
      }
      return med;
    }).toList();

    state = state.copyWith(medicines: updatedList);
  }

  Future<void> updateRoutine(ReminderRoutine routine) async {
    state = state.copyWith(routine: routine);

    _reminderService.slotTimes[DoseSlot.morning] = (
      hour: routine.morningTime.hour,
      minute: routine.morningTime.minute,
    );
    _reminderService.slotTimes[DoseSlot.afternoon] = (
      hour: routine.afternoonTime.hour,
      minute: routine.afternoonTime.minute,
    );
    _reminderService.slotTimes[DoseSlot.night] = (
      hour: routine.nightTime.hour,
      minute: routine.nightTime.minute,
    );

    // Reschedule all active reminders with new slot times
    final active = state.medicines
        .where((m) => m.reminderEnabled && !m.isTaken)
        .map((m) => m.toScheduledMedication())
        .toList();
    await _reminderService.cancelAllReminders();
    await _reminderService.schedulePrescription(active);
  }
}

final prescriptionProvider =
    StateNotifierProvider<PrescriptionNotifier, PrescriptionState>((ref) {
  final reminderService = ref.watch(medicineReminderServiceProvider);
  return PrescriptionNotifier(reminderService);
});
