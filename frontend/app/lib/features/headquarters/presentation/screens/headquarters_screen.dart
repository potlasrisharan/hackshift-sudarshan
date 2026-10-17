import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class HeadquartersScreen extends StatelessWidget {
  const HeadquartersScreen({super.key});

  final List<Map<String, dynamic>> _clinics = const [
    {"name": "AyuSetu Central Hospital Hub (HQ)", "occupancy": "88%", "revenue": "₹3,42,800", "patients": 218, "status": "OPTIMAL"},
    {"name": "AyuSetu North Satellite Clinic (OPD)", "occupancy": "72%", "revenue": "₹1,18,500", "patients": 142, "status": "NORMAL"},
    {"name": "AyuSetu South Satellite Clinic (Trauma)", "occupancy": "94%", "revenue": "₹4,20,900", "patients": 286, "status": "HIGH LOAD"},
  ];

  @override
  Widget build(BuildContext context) {
    return AppScaffoldShell(
      title: AppStrings.hqCommand,
      subtitle: "Executive Command & Telemetry",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildKpiGrid(),
            const SizedBox(height: 20),
            const Text(
              "Multi-Clinic Network Overview",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 12),
            _buildClinicsList(),
            const SizedBox(height: 20),
            _buildFinancialRunRateCard(),
            const SizedBox(height: 20),
            _buildDoctorRosterSummary(),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiGrid() {
    return GridView.count(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.1,
      children: [
        _buildMetricTile("Total Bed Occupancy", "84.6%", Icons.hotel_rounded, AppColors.primaryLight),
        _buildMetricTile("Daily Outpatients", "646", Icons.people_alt_rounded, AppColors.success),
        _buildMetricTile("Consolidated Revenue", "₹8,82,200", Icons.currency_rupee_rounded, AppColors.pmjayGold),
        _buildMetricTile("Active Clinicians", "24 / 28", Icons.badge_rounded, AppColors.secondary),
      ],
    );
  }

  Widget _buildMetricTile(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Icon(icon, size: 18, color: color),
            ],
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
          ),
          Text(
            "+12.4% vs last week",
            style: TextStyle(fontSize: 10, color: AppColors.success, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildClinicsList() {
    return Column(
      children: [
        for (final clinic in _clinics)
          Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.surfaceElevated),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        clinic["name"],
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Occupancy: ${clinic['occupancy']} · ${clinic['patients']} patients seen today",
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      clinic["revenue"],
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.pmjayGold),
                    ),
                    const SizedBox(height: 2),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: clinic["status"] == "HIGH LOAD"
                            ? AppColors.error.withValues(alpha: 0.2)
                            : AppColors.success.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        clinic["status"],
                        style: TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: clinic["status"] == "HIGH LOAD" ? AppColors.error : AppColors.success,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildFinancialRunRateCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  "ABDM & PM-JAY Claim Clearinghouse",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              SizedBox(width: 8),
              AyuSetuLogoBadge(height: 18),
            ],
          ),
          SizedBox(height: 10),
          Text(
            "98.4% First-Pass Approval Rate on Cloudflare D1 Ledger",
            style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
          ),
          SizedBox(height: 6),
          LinearProgressIndicator(
            value: 0.984,
            backgroundColor: AppColors.surfaceElevated,
            valueColor: AlwaysStoppedAnimation<Color>(AppColors.success),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorRosterSummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: const [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Clinical Shift Compliance",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
                SizedBox(height: 4),
                Text(
                  "All 24 duty doctors clocked in via biometrics",
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          SizedBox(width: 8),
          Icon(Icons.check_circle_rounded, color: AppColors.success, size: 24),
        ],
      ),
    );
  }
}
