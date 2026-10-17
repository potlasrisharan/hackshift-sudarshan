import "package:flutter/material.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class PortalSelectionScreen extends StatelessWidget {
  const PortalSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              _buildSectionTitle("HOSPITAL & CLINIC OPERATIONS"),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: AppStrings.patientKiosk,
                subtitle: "Voice intake, ABDM ABHA verification & AI symptom triage",
                icon: Icons.personal_injury_rounded,
                accentColor: AppColors.primaryLight,
                route: "/kiosk",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: AppStrings.prescriptionHeader,
                subtitle: "Doctor's advice, medication schedule, FEFO batches & timed dosage alarms",
                icon: Icons.medication_liquid_rounded,
                accentColor: AppColors.ayushGreen,
                route: "/prescription",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: AppStrings.doctorPortal,
                subtitle: "Active patient queue, AI SOAP notes & Rx-to-Shelf allocation",
                icon: Icons.medical_services_rounded,
                accentColor: AppColors.primary,
                route: "/doctor",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: AppStrings.nursePortal,
                subtitle: "Triage Sentinel alerts (<3s bypass), IPD bed board & vitals",
                icon: Icons.health_and_safety_rounded,
                accentColor: AppColors.error,
                route: "/nurse",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: AppStrings.hqCommand,
                subtitle: "Multi-clinic telemetry, bed occupancy rates & financial run-rate",
                icon: Icons.admin_panel_settings_rounded,
                accentColor: AppColors.secondary,
                route: "/hq",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: AppStrings.clinicalManagement,
                subtitle: "FEFO inventory radar, fast POS counter & shift rosters",
                icon: Icons.inventory_2_rounded,
                accentColor: AppColors.ayushGreen,
                route: "/clinical",
              ),
              const SizedBox(height: 28),
              _buildSectionTitle("WELLNESS & LONGEVITY INNOVATIONS"),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: "Yoga & Somatic Therapy",
                subtitle: "Women's symptom-guided Ayurvedic & somatic asana prescriptions",
                icon: Icons.self_improvement_rounded,
                accentColor: AppColors.yogaAmber,
                route: "/yoga",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: "AyuSetu Vitalis (Longevity)",
                subtitle: "Healthspan Progress Index, VO2max provenance, biomarker radar & clinical summaries",
                icon: Icons.health_and_safety_rounded,
                accentColor: AppColors.vitalisTeal,
                route: "/vitalis",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: "Women's Cycle & Care",
                subtitle: "Cycle phase predictor, medication timetable & AI symptom checker",
                icon: Icons.female_rounded,
                accentColor: AppColors.wellnessPink,
                route: "/womens-health",
              ),
              const SizedBox(height: 12),
              _buildPortalCard(
                context,
                title: "AyuSetu HER Studio",
                subtitle: "Hormonal wellness, deterministic screening radar & doctor-ready summaries",
                icon: Icons.auto_awesome,
                accentColor: AppColors.wellnessPink,
                route: "/her",
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: Row(
                  children: [
                    const AyuSetuLogoBadge(
                      height: 24,
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    ),
                    const SizedBox(width: 8),
                    const Flexible(
                      child: Text(
                        AppStrings.appName,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primaryLight.withValues(alpha: 0.3)),
                ),
                child: const Text(
                  "v1.0",
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primaryLight,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            AppStrings.tagline,
            style: TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.2,
        color: AppColors.textMuted,
      ),
    );
  }

  Widget _buildPortalCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color accentColor,
    required String route,
  }) {
    return InkWell(
      onTap: () => context.push(route),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.surfaceElevated),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: accentColor.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: accentColor, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: AppColors.textMuted,
            ),
          ],
        ),
      ),
    );
  }
}
