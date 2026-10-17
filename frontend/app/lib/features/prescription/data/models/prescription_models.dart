import "package:flutter/material.dart";
import "../../../../core/services/medicine_reminder_service.dart";

enum MedicineTimeSlot { morning, afternoon, night }

extension MedicineTimeSlotExt on MedicineTimeSlot {
  String get label {
    switch (this) {
      case MedicineTimeSlot.morning:
        return "Morning (8:00 AM)";
      case MedicineTimeSlot.afternoon:
        return "Afternoon (1:00 PM)";
      case MedicineTimeSlot.night:
        return "Night (8:30 PM)";
    }
  }

  IconData get icon {
    switch (this) {
      case MedicineTimeSlot.morning:
        return Icons.wb_sunny_rounded;
      case MedicineTimeSlot.afternoon:
        return Icons.wb_twilight_rounded;
      case MedicineTimeSlot.night:
        return Icons.bedtime_rounded;
    }
  }

  DoseSlot get toDoseSlot {
    switch (this) {
      case MedicineTimeSlot.morning:
        return DoseSlot.morning;
      case MedicineTimeSlot.afternoon:
        return DoseSlot.afternoon;
      case MedicineTimeSlot.night:
        return DoseSlot.night;
    }
  }
}

@immutable
class MedicineItem {
  final String id;
  final String prescriptionId;
  final String name;
  final String dosageForm;
  final String strength;
  final MedicineTimeSlot timeSlot;
  final String scheduledTime;
  final String instructions;
  final String batchNumber;
  final String expiryDate;
  final bool isTaken;
  final bool reminderEnabled;
  final DateTime? takenAt;

  const MedicineItem({
    required this.id,
    required this.prescriptionId,
    required this.name,
    required this.dosageForm,
    required this.strength,
    required this.timeSlot,
    required this.scheduledTime,
    required this.instructions,
    required this.batchNumber,
    required this.expiryDate,
    this.isTaken = false,
    this.reminderEnabled = true,
    this.takenAt,
  });

  ScheduledMedication toScheduledMedication() {
    return ScheduledMedication(
      id: id,
      prescriptionId: prescriptionId,
      name: name,
      dosage: "$strength ($dosageForm)",
      instructions: instructions,
      slots: [timeSlot.toDoseSlot],
      startDate: DateTime.now(),
      isActive: reminderEnabled && !isTaken,
    );
  }

  MedicineItem copyWith({
    String? id,
    String? prescriptionId,
    String? name,
    String? dosageForm,
    String? strength,
    MedicineTimeSlot? timeSlot,
    String? scheduledTime,
    String? instructions,
    String? batchNumber,
    String? expiryDate,
    bool? isTaken,
    bool? reminderEnabled,
    DateTime? takenAt,
  }) {
    return MedicineItem(
      id: id ?? this.id,
      prescriptionId: prescriptionId ?? this.prescriptionId,
      name: name ?? this.name,
      dosageForm: dosageForm ?? this.dosageForm,
      strength: strength ?? this.strength,
      timeSlot: timeSlot ?? this.timeSlot,
      scheduledTime: scheduledTime ?? this.scheduledTime,
      instructions: instructions ?? this.instructions,
      batchNumber: batchNumber ?? this.batchNumber,
      expiryDate: expiryDate ?? this.expiryDate,
      isTaken: isTaken ?? this.isTaken,
      reminderEnabled: reminderEnabled ?? this.reminderEnabled,
      takenAt: takenAt ?? this.takenAt,
    );
  }
}

@immutable
class DoctorAdvice {
  final String doctorName;
  final String specialty;
  final String hospital;
  final String opdRoom;
  final String rxId;
  final String prescriptionDate;
  final String validTillDate;
  final List<String> dietRestrictions;
  final String hydrationTarget;
  final String followUpDate;
  final String doctorNotes;

  const DoctorAdvice({
    required this.doctorName,
    required this.specialty,
    required this.hospital,
    required this.opdRoom,
    required this.rxId,
    required this.prescriptionDate,
    required this.validTillDate,
    required this.dietRestrictions,
    required this.hydrationTarget,
    required this.followUpDate,
    required this.doctorNotes,
  });
}

@immutable
class ReminderRoutine {
  final TimeOfDay morningTime;
  final TimeOfDay afternoonTime;
  final TimeOfDay nightTime;
  final bool soundEnabled;
  final bool vibrationEnabled;

  const ReminderRoutine({
    this.morningTime = const TimeOfDay(hour: 8, minute: 0),
    this.afternoonTime = const TimeOfDay(hour: 13, minute: 0),
    this.nightTime = const TimeOfDay(hour: 20, minute: 30),
    this.soundEnabled = true,
    this.vibrationEnabled = true,
  });

  ReminderRoutine copyWith({
    TimeOfDay? morningTime,
    TimeOfDay? afternoonTime,
    TimeOfDay? nightTime,
    bool? soundEnabled,
    bool? vibrationEnabled,
  }) {
    return ReminderRoutine(
      morningTime: morningTime ?? this.morningTime,
      afternoonTime: afternoonTime ?? this.afternoonTime,
      nightTime: nightTime ?? this.nightTime,
      soundEnabled: soundEnabled ?? this.soundEnabled,
      vibrationEnabled: vibrationEnabled ?? this.vibrationEnabled,
    );
  }
}
