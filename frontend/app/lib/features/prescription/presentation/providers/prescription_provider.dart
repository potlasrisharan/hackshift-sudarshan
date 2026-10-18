import "dart:convert";
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:http/http.dart" as http;
import "package:shared_preferences/shared_preferences.dart";
import "../../../../core/services/medicine_reminder_service.dart";
import "../../../../core/network/api_config.dart";
import "../../data/models/prescription_models.dart";

const String _prescriptionApiBaseUrl = ApiConfig.baseUrl;

DoctorAdvice _parseDoctorAdvice(Map<String, dynamic> json) {
  final diet = (json["dietRestrictions"] as List<dynamic>?)
          ?.map((e) => e.toString())
          .toList() ??
      mockDoctorAdvice.dietRestrictions;

  return DoctorAdvice(
    doctorName: json["doctorName"]?.toString() ?? mockDoctorAdvice.doctorName,
    specialty: json["specialty"]?.toString() ?? mockDoctorAdvice.specialty,
    hospital: json["hospital"]?.toString() ?? mockDoctorAdvice.hospital,
    opdRoom: json["opdRoom"]?.toString() ?? mockDoctorAdvice.opdRoom,
    rxId: json["rxId"]?.toString() ?? json["prescriptionId"]?.toString() ?? mockDoctorAdvice.rxId,
    prescriptionDate: json["prescriptionDate"]?.toString() ?? mockDoctorAdvice.prescriptionDate,
    validTillDate: json["validTillDate"]?.toString() ?? mockDoctorAdvice.validTillDate,
    dietRestrictions: diet,
    hydrationTarget: json["hydrationTarget"]?.toString() ?? mockDoctorAdvice.hydrationTarget,
    followUpDate: json["followUpDate"]?.toString() ?? mockDoctorAdvice.followUpDate,
    doctorNotes: json["doctorNotes"]?.toString() ?? mockDoctorAdvice.doctorNotes,
  );
}

MedicineTimeSlot _parseSlot(String? slotStr) {
  final s = (slotStr ?? "").toLowerCase();
  if (s.contains("morn")) return MedicineTimeSlot.morning;
  if (s.contains("after")) return MedicineTimeSlot.afternoon;
  return MedicineTimeSlot.night;
}

List<MedicineItem> _parseMedicines(List<dynamic>? rawList, String rxId) {
  if (rawList == null || rawList.isEmpty) return const [];
  return rawList.map((m) {
    final map = m as Map<String, dynamic>;
    final slot = _parseSlot(map["timeSlot"]?.toString());
    DateTime? takenAt;
    if (map["takenAt"] != null) {
      takenAt = DateTime.tryParse(map["takenAt"].toString());
    }
    return MedicineItem(
      id: map["id"]?.toString() ?? "med-${map['name']}",
      prescriptionId: map["prescriptionId"]?.toString() ?? rxId,
      name: map["name"]?.toString() ?? "Medication",
      dosageForm: map["dosageForm"]?.toString() ?? "Tablet",
      strength: map["strength"]?.toString() ?? "500 mg",
      timeSlot: slot,
      scheduledTime: map["scheduledTime"]?.toString() ??
          (slot == MedicineTimeSlot.morning
              ? "08:00 AM"
              : slot == MedicineTimeSlot.afternoon
                  ? "01:00 PM"
                  : "08:30 PM"),
      instructions: map["instructions"]?.toString() ?? "1 dose with water after meals",
      batchNumber: map["batchNumber"]?.toString() ?? "BAT-2026",
      expiryDate: map["expiryDate"]?.toString() ?? "12/2027",
      isTaken: map["isTaken"] == true,
      reminderEnabled: map["reminderEnabled"] != false,
      takenAt: takenAt,
    );
  }).toList();
}

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
  specialty: "Senior Physician · Rheumatology & Internal Medicine",
  hospital: "AIIMS New Delhi / Central OPD Clinic",
  opdRoom: "OPD-3",
  rxId: "#RX-2026-A8921",
  prescriptionDate: "18 Oct 2026",
  validTillDate: "01 Nov 2026",
  dietRestrictions: [
    "Low-purine diet (limit organ meats and lentils during acute pain)",
    "Avoid excess sodium and carbonated beverages",
    "Maintain balanced hydration",
  ],
  hydrationTarget: "3.0L water daily",
  followUpDate: "Nov 02, 2026 · OPD-3 · In 14 Days",
  doctorNotes:
      "Evidence-based allopathic regimen for inflammatory arthritis and joint stiffness: Follow medication schedule with meals. Avoid high-purine foods and maintain adequate hydration.",
);

const mockMedicines = [
  MedicineItem(
    id: "med-01",
    prescriptionId: "rx-98124a-2026",
    name: "Febuxostat 40mg",
    dosageForm: "Tablet",
    strength: "40 mg",
    timeSlot: MedicineTimeSlot.morning,
    scheduledTime: "08:00 AM",
    instructions: "1 tablet with water after breakfast for uric acid control",
    batchNumber: "BAT-2026-F40",
    expiryDate: "11/2027",
    isTaken: true,
    reminderEnabled: true,
  ),
  MedicineItem(
    id: "med-02",
    prescriptionId: "rx-98124a-2026",
    name: "Colchicine 0.5mg",
    dosageForm: "Tablet",
    strength: "0.5 mg",
    timeSlot: MedicineTimeSlot.afternoon,
    scheduledTime: "01:00 PM",
    instructions: "1 tablet after lunch for anti-inflammatory prophylaxis",
    batchNumber: "BAT-2026-C05",
    expiryDate: "04/2028",
    isTaken: false,
    reminderEnabled: true,
  ),
  MedicineItem(
    id: "med-03",
    prescriptionId: "rx-98124a-2026",
    name: "Pantoprazole 40mg",
    dosageForm: "Tablet",
    strength: "40 mg",
    timeSlot: MedicineTimeSlot.morning,
    scheduledTime: "07:30 AM",
    instructions: "1 tablet with water 30 mins before breakfast for gastro-protection",
    batchNumber: "BAT-2026-P40",
    expiryDate: "09/2027",
    isTaken: false,
    reminderEnabled: true,
  ),
  MedicineItem(
    id: "med-04",
    prescriptionId: "rx-98124a-2026",
    name: "Paracetamol 650mg",
    dosageForm: "Tablet",
    strength: "650 mg",
    timeSlot: MedicineTimeSlot.night,
    scheduledTime: "09:00 PM",
    instructions: "1 tablet after dinner SOS/regular for joint analgesia",
    batchNumber: "BAT-2026-PCM",
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
          medicines: mockMedicines,
          doctorAdvice: mockDoctorAdvice,
          streakDays: 4,
        )) {
    loadPrescription();
  }

  Future<void> loadPrescription({String patientId = "pat-048291"}) async {
    if (state.medicines.isEmpty) {
      state = state.copyWith(isLoading: true);
    }
    try {
      try {
        await _reminderService.initialize();
      } catch (e) {
        debugPrint("Service init: $e");
      }

      final prefs = await SharedPreferences.getInstance();

      // 1. Restore cached routine from SharedPreferences
      ReminderRoutine currentRoutine = state.routine;
      if (prefs.containsKey("routine_morning_hour")) {
        currentRoutine = ReminderRoutine(
          morningTime: TimeOfDay(
            hour: prefs.getInt("routine_morning_hour") ?? 8,
            minute: prefs.getInt("routine_morning_minute") ?? 0,
          ),
          afternoonTime: TimeOfDay(
            hour: prefs.getInt("routine_afternoon_hour") ?? 13,
            minute: prefs.getInt("routine_afternoon_minute") ?? 0,
          ),
          nightTime: TimeOfDay(
            hour: prefs.getInt("routine_night_hour") ?? 20,
            minute: prefs.getInt("routine_night_minute") ?? 30,
          ),
        );
      }

      // 2. Load locally persisted values first so state remains intact offline
      DoctorAdvice? advice = state.doctorAdvice;
      List<MedicineItem> medicines = state.medicines.map((m) {
        final localTaken = prefs.getBool("adherence_${m.id}");
        final localReminder = prefs.getBool("reminder_${m.id}");
        final localTakenAt = prefs.getString("taken_at_${m.id}");
        return m.copyWith(
          isTaken: localTaken ?? m.isTaken,
          reminderEnabled: localReminder ?? m.reminderEnabled,
          takenAt: localTakenAt != null ? DateTime.tryParse(localTakenAt) : m.takenAt,
        );
      }).toList();

      state = state.copyWith(
        routine: currentRoutine,
        medicines: medicines,
        doctorAdvice: advice,
      );

      // 3. Fetch backend and merge
      try {
        final uri = Uri.parse("$_prescriptionApiBaseUrl/prescriptions/patient/$patientId");
        final res = await http.get(uri).timeout(const Duration(seconds: 3));
        if (res.statusCode == 200) {
          final data = jsonDecode(res.body) as Map<String, dynamic>;
          final rxData = data["prescription"] is Map<String, dynamic>
              ? data["prescription"] as Map<String, dynamic>
              : data;
          advice = _parseDoctorAdvice(rxData);
          final rawMeds = rxData["medicines"] as List<dynamic>?;
          final remoteMeds = _parseMedicines(rawMeds, advice.rxId);

          if (remoteMeds.isNotEmpty) {
            medicines = remoteMeds.map((m) {
              final localTaken = prefs.getBool("adherence_${m.id}");
              final localReminder = prefs.getBool("reminder_${m.id}");
              final localTakenAt = prefs.getString("taken_at_${m.id}");
              return m.copyWith(
                isTaken: localTaken ?? m.isTaken,
                reminderEnabled: localReminder ?? m.reminderEnabled,
                takenAt: localTakenAt != null ? DateTime.tryParse(localTakenAt) : m.takenAt,
              );
            }).toList();
          }
        }
      } catch (netErr) {
        debugPrint("Prescription fetch from backend fallback to offline: $netErr");
      }

      state = state.copyWith(
        isLoading: false,
        doctorAdvice: advice,
        medicines: medicines,
        routine: currentRoutine,
      );

      // Schedule active reminders
      final activeScheduled = medicines
          .where((m) => m.reminderEnabled && !m.isTaken)
          .map((m) => m.toScheduledMedication())
          .toList();
      try {
        await _reminderService.schedulePrescription(activeScheduled);
      } catch (e) {
        debugPrint("Schedule prescription: $e");
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> toggleTaken(String medicineId) async {
    MedicineItem? toggled;
    final updatedList = state.medicines.map((med) {
      if (med.id == medicineId) {
        final newTaken = !med.isTaken;
        final updated = med.copyWith(
          isTaken: newTaken,
          takenAt: newTaken ? DateTime.now() : null,
        );
        toggled = updated;
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

    if (toggled != null) {
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool("adherence_$medicineId", toggled!.isTaken);
        if (toggled!.isTaken && toggled!.takenAt != null) {
          await prefs.setString("taken_at_$medicineId", toggled!.takenAt!.toIso8601String());
        } else {
          await prefs.remove("taken_at_$medicineId");
        }
      } catch (e) {
        debugPrint("Error saving adherence to SharedPreferences: $e");
      }

      final rxId = state.doctorAdvice?.rxId ?? "pat-048291";
      final cleanRxId = Uri.encodeComponent(rxId);
      try {
        await http.put(
          Uri.parse("$_prescriptionApiBaseUrl/prescriptions/$cleanRxId/adherence"),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode({
            "medicineId": medicineId,
            "isTaken": toggled!.isTaken,
            "takenAt": toggled!.takenAt?.toIso8601String() ?? DateTime.now().toIso8601String(),
            "patientId": "pat-048291",
          }),
        ).timeout(const Duration(seconds: 3));
      } catch (err) {
        debugPrint("Adherence backend sync error: $err");
      }
    }
  }

  Future<void> toggleReminder(String medicineId) async {
    MedicineItem? toggled;
    final updatedList = state.medicines.map((med) {
      if (med.id == medicineId) {
        final updated = med.copyWith(reminderEnabled: !med.reminderEnabled);
        toggled = updated;
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

    if (toggled != null) {
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setBool("reminder_$medicineId", toggled!.reminderEnabled);
      } catch (e) {
        debugPrint("Error saving reminder to SharedPreferences: $e");
      }
    }
  }

  Future<void> markSlotDone(MedicineTimeSlot slot) async {
    final List<MedicineItem> itemsToggled = [];
    final updatedList = state.medicines.map((med) {
      if (med.timeSlot == slot && !med.isTaken) {
        final updated = med.copyWith(isTaken: true, takenAt: DateTime.now());
        itemsToggled.add(updated);
        _reminderService.cancelMedicationReminders(updated.toScheduledMedication());
        return updated;
      }
      return med;
    }).toList();

    state = state.copyWith(medicines: updatedList);

    try {
      final prefs = await SharedPreferences.getInstance();
      for (final item in itemsToggled) {
        await prefs.setBool("adherence_${item.id}", true);
        if (item.takenAt != null) {
          await prefs.setString("taken_at_${item.id}", item.takenAt!.toIso8601String());
        }
      }
    } catch (e) {
      debugPrint("Error saving slot adherence to SharedPreferences: $e");
    }

    final rxId = state.doctorAdvice?.rxId ?? "pat-048291";
    final cleanRxId = Uri.encodeComponent(rxId);
    for (final item in itemsToggled) {
      try {
        await http.put(
          Uri.parse("$_prescriptionApiBaseUrl/prescriptions/$cleanRxId/adherence"),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode({
            "medicineId": item.id,
            "isTaken": true,
            "takenAt": item.takenAt?.toIso8601String() ?? DateTime.now().toIso8601String(),
            "patientId": "pat-048291",
          }),
        ).timeout(const Duration(seconds: 3));
      } catch (err) {
        debugPrint("Slot adherence sync error: $err");
      }
    }
  }

  Future<void> updateRoutine(ReminderRoutine routine) async {
    state = state.copyWith(routine: routine);

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt("routine_morning_hour", routine.morningTime.hour);
      await prefs.setInt("routine_morning_minute", routine.morningTime.minute);
      await prefs.setInt("routine_afternoon_hour", routine.afternoonTime.hour);
      await prefs.setInt("routine_afternoon_minute", routine.afternoonTime.minute);
      await prefs.setInt("routine_night_hour", routine.nightTime.hour);
      await prefs.setInt("routine_night_minute", routine.nightTime.minute);
    } catch (e) {
      debugPrint("Error saving routine to SharedPreferences: $e");
    }

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

  Future<void> setPrescription({
    required DoctorAdvice advice,
    required List<MedicineItem> medicines,
  }) async {
    try {
      await _reminderService.cancelAllReminders();
    } catch (_) {}

    try {
      final prefs = await SharedPreferences.getInstance();
      final synced = medicines.map((m) {
        final localTaken = prefs.getBool("adherence_${m.id}");
        final localReminder = prefs.getBool("reminder_${m.id}");
        final localTakenAt = prefs.getString("taken_at_${m.id}");
        return m.copyWith(
          isTaken: localTaken ?? m.isTaken,
          reminderEnabled: localReminder ?? m.reminderEnabled,
          takenAt: localTakenAt != null ? DateTime.tryParse(localTakenAt) : m.takenAt,
        );
      }).toList();

      state = state.copyWith(
        doctorAdvice: advice,
        medicines: synced,
      );
    } catch (_) {
      state = state.copyWith(
        doctorAdvice: advice,
        medicines: medicines,
      );
    }

    final active = state.medicines
        .where((m) => m.reminderEnabled && !m.isTaken)
        .map((m) => m.toScheduledMedication())
        .toList();

    try {
      await _reminderService.schedulePrescription(active);
    } catch (e) {
      debugPrint("Schedule new prescription error: $e");
    }
  }
}

final prescriptionProvider =
    StateNotifierProvider<PrescriptionNotifier, PrescriptionState>((ref) {
  final reminderService = ref.watch(medicineReminderServiceProvider);
  return PrescriptionNotifier(reminderService);
});
