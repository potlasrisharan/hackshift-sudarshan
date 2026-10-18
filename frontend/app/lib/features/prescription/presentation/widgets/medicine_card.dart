import "package:flutter/material.dart";
import "../../data/models/prescription_models.dart";

class MedicineCard extends StatelessWidget {
  final MedicineItem medicine;
  final ValueChanged<bool?> onToggleTaken;
  final ValueChanged<bool> onToggleReminder;

  const MedicineCard({
    super.key,
    required this.medicine,
    required this.onToggleTaken,
    required this.onToggleReminder,
  });

  @override
  Widget build(BuildContext context) {
    final isTaken = medicine.isTaken;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isTaken
            ? const Color(0xFFF0FDF4)
            : const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isTaken
              ? const Color(0xFFA7F3D0)
              : const Color(0xFFE2E8F0),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                InkWell(
                  onTap: () => onToggleTaken(!isTaken),
                  borderRadius: BorderRadius.circular(24),
                  child: Container(
                    constraints: const BoxConstraints(minWidth: 48, minHeight: 48),
                    alignment: Alignment.centerLeft,
                    child: Container(
                      width: 28,
                      height: 28,
                      margin: const EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        color: isTaken ? const Color(0xFF059669) : Colors.white,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isTaken ? const Color(0xFF059669) : const Color(0xFFCBD5E1),
                          width: 2,
                        ),
                      ),
                      child: isTaken
                          ? const Icon(Icons.check_rounded, color: Colors.white, size: 18)
                          : null,
                    ),
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              medicine.name,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: isTaken
                                    ? const Color(0xFF94A3B8)
                                    : const Color(0xFF0F172A),
                                decoration:
                                    isTaken ? TextDecoration.lineThrough : null,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE6F7F2),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: const Color(0xFFA7F3D0)),
                            ),
                            child: Text(
                              medicine.strength,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF087D71),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        medicine.dosageForm,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline_rounded,
                      size: 15, color: Color(0xFFD97706)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      medicine.instructions,
                      style: const TextStyle(
                        fontSize: 11.5,
                        color: Color(0xFF334155),
                        height: 1.3,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            // FEFO batch indicator & Dosage status buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.inventory_2_outlined,
                            size: 13, color: Color(0xFF087D71)),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            "FEFO: ${medicine.batchNumber} · Exp: ${medicine.expiryDate}",
                            style: const TextStyle(
                              fontSize: 10.5,
                              color: Color(0xFF475569),
                              fontWeight: FontWeight.w600,
                            ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                // Status action buttons: Taken / Pending
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    InkWell(
                      onTap: () => onToggleTaken(!isTaken),
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        decoration: BoxDecoration(
                          color: isTaken ? const Color(0xFFE6F7F2) : const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: isTaken ? const Color(0xFFA7F3D0) : const Color(0xFFCBD5E1),
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              isTaken ? Icons.check_circle_rounded : Icons.radio_button_unchecked,
                              size: 13,
                              color: isTaken ? const Color(0xFF059669) : const Color(0xFF64748B),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              isTaken ? "Taken" : "Mark Done",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: isTaken ? const Color(0xFF059669) : const Color(0xFF475569),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    InkWell(
                      onTap: () => onToggleReminder(!medicine.reminderEnabled),
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
                        alignment: Alignment.center,
                        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              medicine.reminderEnabled
                                  ? Icons.notifications_active_rounded
                                  : Icons.notifications_off_rounded,
                              size: 16,
                              color: medicine.reminderEnabled
                                  ? const Color(0xFF087D71)
                                  : const Color(0xFF94A3B8),
                            ),
                            const SizedBox(width: 2),
                            SizedBox(
                              height: 32,
                              width: 38,
                              child: Transform.scale(
                                scale: 0.8,
                                child: Switch(
                                  value: medicine.reminderEnabled,
                                  activeTrackColor: const Color(0xFF087D71),
                                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                  onChanged: onToggleReminder,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
