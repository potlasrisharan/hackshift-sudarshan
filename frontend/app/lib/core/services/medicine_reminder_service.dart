import "dart:async";
import "package:flutter/foundation.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";

enum DoseSlot {
  morning(displayName: "Morning", defaultHour: 8, defaultMinute: 0),
  afternoon(displayName: "Afternoon", defaultHour: 13, defaultMinute: 0),
  evening(displayName: "Evening", defaultHour: 18, defaultMinute: 0),
  night(displayName: "Night", defaultHour: 20, defaultMinute: 30);

  final String displayName;
  final int defaultHour;
  final int defaultMinute;

  const DoseSlot({required this.displayName, required this.defaultHour, required this.defaultMinute});

  static DoseSlot fromString(String value) => DoseSlot.values.firstWhere(
        (slot) => slot.name.toLowerCase() == value.toLowerCase() || slot.displayName.toLowerCase() == value.toLowerCase(),
        orElse: () => DoseSlot.morning,
      );
}

@immutable
class ScheduledMedication {
  final String id;
  final String prescriptionId;
  final String name;
  final String dosage;
  final String instructions;
  final List<DoseSlot> slots;
  final DateTime startDate;
  final DateTime? endDate;
  final bool isActive;

  const ScheduledMedication({
    required this.id,
    required this.prescriptionId,
    required this.name,
    required this.dosage,
    required this.instructions,
    required this.slots,
    required this.startDate,
    this.endDate,
    this.isActive = true,
  });

  Map<String, dynamic> toMap() => {
        "id": id,
        "prescriptionId": prescriptionId,
        "name": name,
        "dosage": dosage,
        "instructions": instructions,
        "slots": slots.map((slot) => slot.name).toList(),
        "startDate": startDate.toIso8601String(),
        "endDate": endDate?.toIso8601String(),
        "isActive": isActive,
      };

  factory ScheduledMedication.fromMap(Map<String, dynamic> map) => ScheduledMedication(
        id: map["id"] as String,
        prescriptionId: map["prescriptionId"] as String,
        name: map["name"] as String,
        dosage: map["dosage"] as String,
        instructions: map["instructions"] as String? ?? "",
        slots: (map["slots"] as List<dynamic>?)?.map((slot) => DoseSlot.fromString(slot as String)).toList() ?? const [DoseSlot.morning],
        startDate: DateTime.tryParse(map["startDate"] as String? ?? "") ?? DateTime.now(),
        endDate: map["endDate"] == null ? null : DateTime.tryParse(map["endDate"] as String),
        isActive: map["isActive"] as bool? ?? true,
      );
}

@immutable
class AdherenceEvent {
  final String medicationId;
  final String prescriptionId;
  final DoseSlot slot;
  final String action;
  final DateTime timestamp;

  const AdherenceEvent({
    required this.medicationId,
    required this.prescriptionId,
    required this.slot,
    required this.action,
    required this.timestamp,
  });
}

/// Medicine reminders are shown in the app from the active prescription state.
/// This service intentionally does not schedule local or push notifications.
class MedicineReminderService {
  MedicineReminderService._();
  static final MedicineReminderService instance = MedicineReminderService._();

  final StreamController<AdherenceEvent> _adherenceController = StreamController<AdherenceEvent>.broadcast();
  Stream<AdherenceEvent> get adherenceStream => _adherenceController.stream;

  Map<DoseSlot, ({int hour, int minute})> slotTimes = {
    for (final slot in DoseSlot.values) slot: (hour: slot.defaultHour, minute: slot.defaultMinute),
  };

  Future<void> initialize() async {}
  Future<void> scheduleMedicationReminders(ScheduledMedication medication) async {}
  Future<void> schedulePrescription(List<ScheduledMedication> medications) async {}
  Future<void> scheduleSnooze({
    required String medicationId,
    required String prescriptionId,
    required String medicationName,
    required String dosage,
    required DoseSlot slot,
    int minutes = 15,
  }) async {}
  Future<void> cancelMedicationReminders(ScheduledMedication medication) async {}
  Future<void> cancelPrescriptionReminders(List<ScheduledMedication> medications) async {}
  Future<void> cancelAllReminders() async {}

  void dispose() => _adherenceController.close();
}

final medicineReminderServiceProvider = Provider<MedicineReminderService>((ref) {
  final service = MedicineReminderService.instance;
  ref.onDispose(service.dispose);
  return service;
});
