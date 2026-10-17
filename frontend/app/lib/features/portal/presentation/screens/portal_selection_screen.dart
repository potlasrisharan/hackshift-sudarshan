import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../prescription/presentation/providers/prescription_provider.dart";

/// Subagent 2: Home Dashboard & App Shell for AyuSetu
/// Reference fidelity implementation with botanical accents, 2x2 quick action grid,
/// health modules, clinical operations accordion, and floating navigation bar.
class PortalSelectionScreen extends ConsumerStatefulWidget {
  const PortalSelectionScreen({super.key});

  @override
  ConsumerState<PortalSelectionScreen> createState() => _PortalSelectionScreenState();
}

class _PortalSelectionScreenState extends ConsumerState<PortalSelectionScreen> {
  int _selectedNavIndex = 0;

  void _openNotificationCenter(BuildContext context, PrescriptionState prescription) {
    final dueMedicines = prescription.medicines.where((medicine) => !medicine.isTaken).toList();
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      backgroundColor: Colors.white,
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Notifications", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
              const SizedBox(height: 14),
              if (dueMedicines.isEmpty)
                const ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: Icon(Icons.check_circle_outline_rounded, color: Color(0xFF087D71)),
                  title: Text("You're all caught up"),
                  subtitle: Text("New care updates will appear here."),
                )
              else ...[
                const Text("Medicine reminders", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
                const SizedBox(height: 6),
                ...dueMedicines.take(5).map((medicine) => ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.medication_outlined, color: Color(0xFF087D71)),
                      title: Text(medicine.name),
                      subtitle: Text("${medicine.scheduledTime} · ${medicine.instructions}"),
                    )),
              ],
              const SizedBox(height: 8),
              const Text("Notifications stay inside the app. No push or device alerts are sent.", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final prescription = ref.watch(prescriptionProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Stack(
          children: [
            // Subtle botanical leaf illustration in top-right background
            const Positioned(
              top: -15,
              right: -20,
              child: IgnorePointer(
                child: CustomPaint(
                  size: Size(160, 160),
                  painter: BotanicalLeafPainter(),
                ),
              ),
            ),

            // Main scrollable content
            SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 18, 20, 110),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTopHeader(context),
                  const SizedBox(height: 20),
                  _buildGreeting(),
                  const SizedBox(height: 18),
                  _buildGetMyReportsCard(context, prescription),
                  const SizedBox(height: 14),
                  _buildMedicinesPrescribedCard(context, prescription),
                  const SizedBox(height: 24),
                  _buildHealthModules(context),
                  const SizedBox(height: 16),
                  const Center(
                    child: Text(
                      AppStrings.appName,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.5,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildFloatingBottomBar(context),
    );
  }

  // ---------------------------------------------------------------------------
  // TOP HEADER: AyuSetu Logo + Status
  // ---------------------------------------------------------------------------
  Widget _buildTopHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Flexible(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: const Color(0xFFE6F7F2),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF087D71).withValues(alpha: 0.2)),
                ),
                child: const Icon(
                  Icons.spa_rounded,
                  size: 18,
                  color: Color(0xFF087D71),
                ),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                      children: [
                        TextSpan(
                          text: "Ayu",
                          style: TextStyle(
                            color: Color(0xFF0F172A),
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        TextSpan(
                          text: "+",
                          style: TextStyle(
                            color: Color(0xFFEF4444),
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        TextSpan(
                          text: "सेतु",
                          style: TextStyle(
                            color: Color(0xFFE11D48),
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              tooltip: "In-app notifications",
              onPressed: () => _openNotificationCenter(context, ref.read(prescriptionProvider)),
              icon: const Icon(Icons.notifications_none_rounded, color: Color(0xFF475569)),
            ),
            InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => _openProfileSheet(context),
              child: Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: const Icon(
                  Icons.person_outline_rounded,
                  size: 16,
                  color: Color(0xFF475569),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // GREETING (DYNAMIC TIME-BASED)
  // ---------------------------------------------------------------------------
  MapEntry<String, IconData> _getTimeGreeting() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) {
      return const MapEntry("Good morning,", Icons.wb_sunny_rounded);
    } else if (hour >= 12 && hour < 17) {
      return const MapEntry("Good afternoon,", Icons.wb_sunny_rounded);
    } else if (hour >= 17 && hour < 21) {
      return const MapEntry("Good evening,", Icons.wb_twilight_rounded);
    } else {
      return const MapEntry("Good night,", Icons.bedtime_rounded);
    }
  }

  Widget _buildGreeting() {
    final greeting = _getTimeGreeting();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              greeting.value,
              size: 15,
              color: const Color(0xFF087D71),
            ),
            const SizedBox(width: 6),
            Text(
              greeting.key,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Color(0xFF087D71),
                letterSpacing: 0.2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        RichText(
          text: const TextSpan(
            style: TextStyle(
              fontSize: 27,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
              height: 1.18,
              letterSpacing: -0.6,
            ),
            children: [
              TextSpan(text: "Your health journey\n"),
              TextSpan(text: "matters"),
              TextSpan(
                text: ".",
                style: TextStyle(color: Color(0xFF087D71)),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // SEARCH PILL BAR
  // ---------------------------------------------------------------------------
  Widget _buildHealthModules(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Health Modules",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
            letterSpacing: -0.4,
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            // HER Card
            Expanded(
              child: _buildModuleCard(
                context,
                title: "HER",
                subtitle: "Women's Health",
                bgColor: const Color(0xFFFFF1F3),
                borderColor: const Color(0xFFFCE7EC),
                avatarBg: const Color(0xFFFCE7F3),
                avatarColor: const Color(0xFFDB2777),
                arrowColor: const Color(0xFFDB2777),
                icon: Icons.face_3_rounded,
                route: "/her",
              ),
            ),
            const SizedBox(width: 14),
            // Vitalis Card
            Expanded(
              child: _buildModuleCard(
                context,
                title: "Vitalis",
                subtitle: "Longevity & Healthspan",
                bgColor: const Color(0xFFE6F7F2),
                borderColor: const Color(0xFFD1FAE5),
                avatarBg: const Color(0xFFDCFCE7),
                avatarColor: const Color(0xFF059669),
                arrowColor: const Color(0xFF059669),
                icon: Icons.eco_rounded,
                route: "/vitalis",
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildModuleCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required Color bgColor,
    required Color borderColor,
    required Color avatarBg,
    required Color avatarColor,
    required Color arrowColor,
    required IconData icon,
    required String route,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () => context.push(route),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: avatarBg,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        icon,
                        color: avatarColor,
                        size: 22,
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward_rounded,
                      color: arrowColor,
                      size: 20,
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: avatarColor,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // HOSPITAL & CLINICAL OPERATIONS ACCORDION
  // ---------------------------------------------------------------------------
  Widget _buildFloatingBottomBar(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        margin: const EdgeInsets.fromLTRB(10, 0, 10, 10),
        padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 18,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: _buildNavItem(
                icon: Icons.home_rounded,
                label: "Home",
                isSelected: _selectedNavIndex == 0,
                onTap: () => setState(() => _selectedNavIndex = 0),
              ),
            ),
            Expanded(
              child: _buildNavItem(
                icon: Icons.description_outlined,
                label: "Records",
                isSelected: _selectedNavIndex == 1,
                onTap: () => context.push("/prescription"),
              ),
            ),
            Expanded(
              child: _buildNavItem(
                icon: Icons.favorite_outline_rounded,
                label: "Health",
                isSelected: _selectedNavIndex == 2,
                onTap: () => context.push("/vitalis"),
              ),
            ),
            Expanded(
              child: _buildNavItem(
                icon: Icons.self_improvement_rounded,
                label: "Yoga",
                isSelected: _selectedNavIndex == 3,
                onTap: () => context.push("/yoga"),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final color = isSelected ? const Color(0xFF087D71) : const Color(0xFF64748B);
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: color, size: 19),
            const SizedBox(height: 2),
            Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 9.5,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGetMyReportsCard(BuildContext context, PrescriptionState prescription) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDBEAFE),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.assignment_turned_in_rounded,
                    color: Color(0xFF2563EB),
                    size: 20,
                  ),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "My Care Records",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      Text(
                        "Doctor-issued prescription and treatment notes",
                        style: TextStyle(
                          fontSize: 11,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: const Color(0xFFBFDBFE)),
                  ),
                child: Text(
                    prescription.isLoading ? "Syncing" : prescription.doctorAdvice == null ? "No record" : "Doctor issued",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF2563EB),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            if (prescription.doctorAdvice case final advice?)
              _buildReportItem(
                title: "Prescription ${advice.rxId}",
                doctor: "${advice.doctorName} · ${advice.hospital}",
                date: advice.prescriptionDate,
                status: "Synced",
                statusColor: const Color(0xFF087D71),
              )
            else
              Text(
                prescription.isLoading ? "Loading your records from the clinic…" : "No doctor-issued records are available yet.",
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => context.push("/prescription"),
                icon: const Icon(Icons.file_download_outlined, size: 16),
                label: const Text("View prescription details"),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF2563EB),
                  side: const BorderSide(color: Color(0xFF93C5FD)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReportItem({
    required String title,
    required String doctor,
    required String date,
    required String status,
    required Color statusColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          const Icon(Icons.description_rounded, size: 18, color: Color(0xFF64748B)),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 1),
                Text(
                  doctor,
                  style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              status,
              style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w700, color: statusColor),
            ),
          ),
        ],
      ),
    );
  }

  // b) Medicines Prescribed Card
  Widget _buildMedicinesPrescribedCard(BuildContext context, PrescriptionState prescription) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFEDD5),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.medication_liquid_rounded,
                    color: Color(0xFFEA580C),
                    size: 20,
                  ),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Medicines Prescribed",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                      Text(
                        "Medicines prescribed by your doctor",
                        style: TextStyle(
                          fontSize: 11,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    prescription.isLoading
                        ? "Syncing"
                        : "${prescription.takenCount}/${prescription.totalCount} taken",
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFB45309),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: prescription.adherenceProgress,
                backgroundColor: Color(0xFFF1F5F9),
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 12),
            if (prescription.medicines.isEmpty)
              Text(
                prescription.isLoading ? "Loading doctor-prescribed medicines…" : "No active doctor-prescribed medicines.",
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B)),
              )
            else
              ...prescription.medicines.map((medicine) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: _buildMedicinePrescribedItem(
                      name: "${medicine.name} ${medicine.strength}",
                      instructions: "${medicine.instructions} · ${medicine.scheduledTime}",
                      batchNumber: medicine.batchNumber,
                      expiry: medicine.expiryDate,
                      isTaken: medicine.isTaken,
                    ),
                  )),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => context.push("/prescription"),
                icon: const Icon(Icons.alarm_on_rounded, size: 16),
                label: const Text("Open prescribed medicine details"),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFFEA580C),
                  side: const BorderSide(color: Color(0xFFFDBA74)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMedicinePrescribedItem({
    required String name,
    required String instructions,
    required String batchNumber,
    required String expiry,
    required bool isTaken,
  }) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Row(
        children: [
          Icon(
            isTaken ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
            color: isTaken ? const Color(0xFF10B981) : const Color(0xFF94A3B8),
            size: 20,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 1),
                Text(
                  "$instructions · Batch $batchNumber (Exp: $expiry)",
                  style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: isTaken ? const Color(0xFFE6F7F2) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              isTaken ? "Taken ✓" : "Due 9 PM",
              style: TextStyle(
                fontSize: 9.5,
                fontWeight: FontWeight.w700,
                color: isTaken ? const Color(0xFF087D71) : const Color(0xFF64748B),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // c) Health Insights Card
  void _openProfileSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE2E8F0),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(
                      color: Color(0xFFE6F7F2),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.person_rounded, color: Color(0xFF087D71), size: 26),
                  ),
                  const SizedBox(width: 14),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            "Aarav Sharma",
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          SizedBox(width: 6),
                          Icon(Icons.verified_rounded, color: Color(0xFF10B981), size: 16),
                        ],
                      ),
                      Text(
                        "ABHA: 91-2024-5839-2041@abdm",
                        style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: const Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Hospital Center", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        Text("AyuSetu Health Center", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                      ],
                    ),
                    SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Health & Metabolic Profile", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        Text("Calibrated · Optimal Balance", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF087D71))),
                      ],
                    ),
                    SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Active Medications", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        Text("2 Prescriptions (FEFO Tracked)", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFFEA580C))),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              SizedBox(
                width: double.infinity,
                height: 46,
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.sync_rounded, size: 18),
                  label: const Text("Manage Patient Health Profile"),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF087D71),
                    side: const BorderSide(color: Color(0xFF087D71)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () {
                    Navigator.pop(ctx);
                    context.push("/vitalis");
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// ---------------------------------------------------------------------------
// BOTANICAL LEAF PAINTER
// ---------------------------------------------------------------------------
class BotanicalLeafPainter extends CustomPainter {
  const BotanicalLeafPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final fillPaint = Paint()
      ..color = const Color(0xFF0D9488).withValues(alpha: 0.09)
      ..style = PaintingStyle.fill;

    final linePaint = Paint()
      ..color = const Color(0xFF0D9488).withValues(alpha: 0.16)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2
      ..strokeCap = StrokeCap.round;

    // Stem curve
    final stemPath = Path();
    stemPath.moveTo(size.width * 0.95, size.height * 0.05);
    stemPath.quadraticBezierTo(
      size.width * 0.65,
      size.height * 0.38,
      size.width * 0.38,
      size.height * 0.88,
    );
    canvas.drawPath(stemPath, linePaint);

    // Leaf 1 (top right)
    final leaf1 = Path();
    leaf1.moveTo(size.width * 0.86, size.height * 0.14);
    leaf1.quadraticBezierTo(
      size.width * 0.58,
      size.height * 0.04,
      size.width * 0.46,
      size.height * 0.18,
    );
    leaf1.quadraticBezierTo(
      size.width * 0.68,
      size.height * 0.28,
      size.width * 0.86,
      size.height * 0.14,
    );
    canvas.drawPath(leaf1, fillPaint);

    // Leaf 2 (middle left)
    final leaf2 = Path();
    leaf2.moveTo(size.width * 0.68, size.height * 0.38);
    leaf2.quadraticBezierTo(
      size.width * 0.32,
      size.height * 0.28,
      size.width * 0.22,
      size.height * 0.46,
    );
    leaf2.quadraticBezierTo(
      size.width * 0.50,
      size.height * 0.56,
      size.width * 0.68,
      size.height * 0.38,
    );
    canvas.drawPath(leaf2, fillPaint);

    // Leaf 3 (lower right)
    final leaf3 = Path();
    leaf3.moveTo(size.width * 0.54, size.height * 0.60);
    leaf3.quadraticBezierTo(
      size.width * 0.78,
      size.height * 0.55,
      size.width * 0.84,
      size.height * 0.72,
    );
    leaf3.quadraticBezierTo(
      size.width * 0.60,
      size.height * 0.78,
      size.width * 0.54,
      size.height * 0.60,
    );
    canvas.drawPath(leaf3, fillPaint);

    // Accent dewdrops
    canvas.drawCircle(
      Offset(size.width * 0.38, size.height * 0.24),
      3.0,
      Paint()..color = const Color(0xFF10B981).withValues(alpha: 0.16),
    );
    canvas.drawCircle(
      Offset(size.width * 0.76, size.height * 0.50),
      2.5,
      Paint()..color = const Color(0xFF0D9488).withValues(alpha: 0.16),
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
