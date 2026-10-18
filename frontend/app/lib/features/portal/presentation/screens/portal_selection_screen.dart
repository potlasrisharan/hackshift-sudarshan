import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../prescription/presentation/providers/prescription_provider.dart";
import "../../../auth/presentation/providers/auth_provider.dart";
import "../../../onboarding/presentation/providers/user_profile_provider.dart";
import "../../../onboarding/data/models/user_profile_model.dart";

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
    final userProfileState = ref.watch(userProfileProvider);
    final profile = userProfileState.profile;

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
                  _buildTopHeader(context, profile),
                  const SizedBox(height: 20),
                  _buildGreeting(profile),
                  const SizedBox(height: 18),
                  _buildDynamicHeroCard(context, profile),
                  const SizedBox(height: 14),
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
  Widget _buildTopHeader(BuildContext context, UserProfile profile) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Image.asset(
          "assets/images/ayusetu_logo.png",
          height: 38,
          fit: BoxFit.contain,
          errorBuilder: (context, error, stackTrace) => Container(
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
              onTap: () => _openProfileSheet(context, profile),
              child: Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF087D71).withValues(alpha: 0.3)),
                ),
                child: const Icon(
                  Icons.person_outline_rounded,
                  size: 18,
                  color: Color(0xFF087D71),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // GREETING (DYNAMIC TIME-BASED & PERSONALIZED)
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

  Widget _buildGreeting(UserProfile profile) {
    final greeting = _getTimeGreeting();
    final firstName = profile.name.trim().split(" ").first;

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
            Flexible(
              child: Text(
                "${greeting.key} $firstName",
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF087D71),
                  letterSpacing: 0.2,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        RichText(
          text: TextSpan(
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
              height: 1.18,
              letterSpacing: -0.6,
            ),
            children: [
              TextSpan(text: "Your ${profile.primaryFocus == 'womens_health' ? 'hormonal balance' : profile.primaryFocus == 'yoga' ? 'ayush & recovery' : profile.primaryFocus == 'opd' ? 'clinical care' : 'health journey'}\n"),
              const TextSpan(text: "matters"),
              const TextSpan(
                text: ".",
                style: TextStyle(color: Color(0xFF087D71)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        // Prakriti Pill
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: const Color(0xFF087D71).withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFF087D71).withValues(alpha: 0.2)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.eco_rounded, size: 14, color: Color(0xFF087D71)),
              const SizedBox(width: 5),
              Flexible(
                child: Text(
                  profile.prakritiBadgeLabel,
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF087D71)),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // DYNAMIC HERO CARD (ADAPTS TO USER'S SELECTED PRIMARY HEALTH FOCUS)
  // ---------------------------------------------------------------------------
  Widget _buildDynamicHeroCard(BuildContext context, UserProfile profile) {
    switch (profile.primaryFocus) {
      case "womens_health":
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFFFF1F2), Color(0xFFFCE7EC)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFDA4AF)),
            boxShadow: [
              BoxShadow(color: const Color(0xFFE11D48).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFE11D48), borderRadius: BorderRadius.circular(8)),
                    child: const Text("HER COMPASS", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 0.5)),
                  ),
                  const Icon(Icons.spa_rounded, color: Color(0xFFE11D48), size: 22),
                ],
              ),
              const SizedBox(height: 12),
              const Text("Follicular Phase · Day 8", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF881337))),
              const SizedBox(height: 4),
              const Text("Estrogen rising. Optimal window for aerobic activity and metabolic conditioning.", style: TextStyle(fontSize: 12, color: Color(0xFF9F1239))),
              const SizedBox(height: 14),
              SizedBox(
                height: 38,
                child: ElevatedButton.icon(
                  onPressed: () => context.push("/her"),
                  icon: const Icon(Icons.arrow_forward_rounded, size: 16),
                  label: const Text("Open Women's Health Studio", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE11D48),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        );

      case "yoga":
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFFEF3C7), Color(0xFFFDE68A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFFCD34D)),
            boxShadow: [
              BoxShadow(color: const Color(0xFFD97706).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFD97706), borderRadius: BorderRadius.circular(8)),
                    child: const Text("AYUSH & YOGA", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 0.5)),
                  ),
                  const Icon(Icons.self_improvement_rounded, color: Color(0xFFD97706), size: 24),
                ],
              ),
              const SizedBox(height: 12),
              Text("Daily ${profile.primaryDosha} Routine", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF78350F))),
              const SizedBox(height: 4),
              const Text("Sheetali Pranayama & Moon Salutations · 15 minutes of Dosha-balancing flow.", style: TextStyle(fontSize: 12, color: Color(0xFF92400E))),
              const SizedBox(height: 14),
              SizedBox(
                height: 38,
                child: ElevatedButton.icon(
                  onPressed: () => context.push("/yoga"),
                  icon: const Icon(Icons.play_arrow_rounded, size: 18),
                  label: const Text("Start Today's Yoga Routine", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD97706),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        );

      case "opd":
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFEFF6FF), Color(0xFFDBEAFE)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFF93C5FD)),
            boxShadow: [
              BoxShadow(color: const Color(0xFF2563EB).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFF2563EB), borderRadius: BorderRadius.circular(8)),
                    child: const Text("CLINICAL OPD", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 0.5)),
                  ),
                  const Icon(Icons.local_hospital_rounded, color: Color(0xFF2563EB), size: 22),
                ],
              ),
              const SizedBox(height: 12),
              const Text("Central OPD Clinic · Room 3", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF1E3A8A))),
              const SizedBox(height: 4),
              const Text("Dr. Ananya Sharma · Live Token Queue #14 · 2 Prescriptions active.", style: TextStyle(fontSize: 12, color: Color(0xFF1E40AF))),
              const SizedBox(height: 14),
              SizedBox(
                height: 38,
                child: ElevatedButton.icon(
                  onPressed: () => context.push("/doctor"),
                  icon: const Icon(Icons.medical_services_rounded, size: 16),
                  label: const Text("Open Doctor Consultation", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        );

      case "longevity":
      default:
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFFE6F7F2), Color(0xFFD1FAE5)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFA7F3D0)),
            boxShadow: [
              BoxShadow(color: const Color(0xFF087D71).withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFF087D71), borderRadius: BorderRadius.circular(8)),
                    child: const Text("VITALIS HEALTHSPAN", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 0.5)),
                  ),
                  const Icon(Icons.favorite_rounded, color: Color(0xFF087D71), size: 22),
                ],
              ),
              const SizedBox(height: 12),
              const Text("Biological Age Delta: -2.8 Years", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF064E3B))),
              const SizedBox(height: 4),
              const Text("Healthspan Progress Index: 84/100 · Optimal zone 2 cardio & insulin sensitivity.", style: TextStyle(fontSize: 12, color: Color(0xFF065F46))),
              const SizedBox(height: 14),
              SizedBox(
                height: 38,
                child: ElevatedButton.icon(
                  onPressed: () => context.push("/vitalis"),
                  icon: const Icon(Icons.speed_rounded, size: 16),
                  label: const Text("View Longevity Radar", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF087D71),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ),
        );
    }
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
  void _openProfileSheet(BuildContext context, UserProfile profile) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
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
                      child: Center(
                        child: Text(
                          profile.name.isNotEmpty ? profile.name[0].toUpperCase() : "P",
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 20, color: Color(0xFF087D71)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  profile.name,
                                  style: const TextStyle(
                                    fontSize: 17,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF0F172A),
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 6),
                              const Icon(Icons.verified_rounded, color: Color(0xFF10B981), size: 16),
                            ],
                          ),
                          Text(
                            profile.abhaNumber ?? profile.phone,
                            style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
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
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Blood Group", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                          Text(profile.bloodGroup ?? "B+", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF0F172A))),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Ayurvedic Prakriti", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                          Text(profile.primaryDosha, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF087D71))),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("BMI & Healthspan", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                          Text("BMI ${profile.bmi ?? 22.7} · Optimal", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF0D9488))),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text("Switch Primary Health Focus", style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF0F172A))),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildFocusChoiceChip(ctx, "longevity", "🌿 Vitalis", profile.primaryFocus),
                    _buildFocusChoiceChip(ctx, "womens_health", "🌸 HER", profile.primaryFocus),
                    _buildFocusChoiceChip(ctx, "yoga", "🧘 Yoga", profile.primaryFocus),
                    _buildFocusChoiceChip(ctx, "opd", "🏥 OPD", profile.primaryFocus),
                  ],
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.tune_rounded, size: 16),
                        label: const Text("Edit Onboarding", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF087D71),
                          side: const BorderSide(color: Color(0xFF087D71)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        onPressed: () {
                          Navigator.pop(ctx);
                          context.push("/onboarding");
                        },
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.logout_rounded, size: 16, color: Color(0xFFDC2626)),
                        label: const Text("Sign Out", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFFDC2626))),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Color(0xFFFCA5A5)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        onPressed: () async {
                          Navigator.pop(ctx);
                          await ref.read(authProvider.notifier).logout();
                          if (context.mounted) {
                            context.go("/login");
                          }
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildFocusChoiceChip(BuildContext ctx, String focusKey, String label, String currentFocus) {
    final isSelected = currentFocus == focusKey;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: isSelected ? Colors.white : const Color(0xFF334155))),
      selected: isSelected,
      selectedColor: const Color(0xFF087D71),
      backgroundColor: Colors.white,
      onSelected: (val) {
        if (val) {
          ref.read(userProfileProvider.notifier).updatePrimaryFocus(focusKey);
          Navigator.pop(ctx);
        }
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
