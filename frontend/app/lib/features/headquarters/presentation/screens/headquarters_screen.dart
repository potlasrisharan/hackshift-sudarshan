import "package:flutter/material.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class HeadquartersScreen extends StatelessWidget {
  const HeadquartersScreen({super.key});

  final List<Map<String, dynamic>> _clinics = const [
    {
      "id": "clinic-central-hq",
      "name": "AyuSetu Central Hospital Hub (HQ)",
      "occupancy": "88%",
      "occupancyValue": 0.88,
      "revenue": "₹3,42,800",
      "patients": 218,
      "bedsAvailable": 14,
      "status": "OPTIMAL",
      "statusColor": Color(0xFF16A34A),
      "statusBg": Color(0xFFDCFCE7),
    },
    {
      "id": "clinic-north-opd",
      "name": "AyuSetu North Satellite Clinic (OPD)",
      "occupancy": "72%",
      "occupancyValue": 0.72,
      "revenue": "₹1,18,500",
      "patients": 142,
      "bedsAvailable": 28,
      "status": "NORMAL",
      "statusColor": Color(0xFF087D71),
      "statusBg": Color(0xFFE6F7F2),
    },
    {
      "id": "clinic-south-trauma",
      "name": "AyuSetu South Satellite Clinic (Trauma)",
      "occupancy": "94%",
      "occupancyValue": 0.94,
      "revenue": "₹4,20,900",
      "patients": 286,
      "bedsAvailable": 4,
      "status": "HIGH LOAD",
      "statusColor": Color(0xFFDC2626),
      "statusBg": Color(0xFFFEE2E2),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return AppScaffoldShell(
      isLight: true,
      title: AppStrings.hqCommand,
      subtitle: "Executive Command & Telemetry",
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildKpiGrid(),
            const SizedBox(height: 18),
            _buildEmergencyLoadSummaryCard(),
            const SizedBox(height: 18),
            const Text(
              "Multi-Clinic Network Overview",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.clinicalTextDark,
              ),
            ),
            const SizedBox(height: 10),
            _buildClinicsList(context),
            const SizedBox(height: 16),
            _buildFinancialRunRateCard(),
            const SizedBox(height: 14),
            _buildDoctorRosterSummary(),
            const SizedBox(height: 16),
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
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      childAspectRatio: 1.15,
      children: [
        _buildMetricTile("Total Bed Occupancy", "84.6%", Icons.hotel_rounded, AppColors.medicalTeal, "+3.2% vs baseline"),
        _buildMetricTile("Daily Outpatients", "646", Icons.people_alt_rounded, const Color(0xFF16A34A), "+12.4% vs last week"),
        _buildMetricTile("Consolidated Revenue", "₹8,82,200", Icons.currency_rupee_rounded, AppColors.saffron, "100% D1 reconciled"),
        _buildMetricTile("Active Clinicians", "24 / 28", Icons.badge_rounded, const Color(0xFF8B5CF6), "Biometrics verified"),
      ],
    );
  }

  Widget _buildMetricTile(String title, String value, IconData icon, Color color, String trend) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.clinicalCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.clinicalBorder, width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0x060F172A),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
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
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppColors.clinicalTextMuted,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 4),
              Icon(icon, size: 18, color: color),
            ],
          ),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.w800,
                color: AppColors.clinicalTextDark,
              ),
            ),
          ),
          Text(
            trend,
            style: const TextStyle(
              fontSize: 10,
              color: Color(0xFF16A34A),
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmergencyLoadSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.clinicalCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.clinicalBorder, width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0x060F172A),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: const [
                    Icon(Icons.warning_amber_rounded, size: 18, color: AppColors.saffron),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "Emergency Load Balancing",
                        style: TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.clinicalTextDark,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  "AUTO-REROUTE READY",
                  style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w800, color: Color(0xFFD97706)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            "South Trauma Clinic is running near peak capacity (94%). Ambulances are advised to route stable non-trauma cases to North Satellite.",
            style: TextStyle(fontSize: 11.5, color: AppColors.clinicalTextSub, height: 1.3),
          ),
        ],
      ),
    );
  }

  Widget _buildClinicsList(BuildContext context) {
    return Column(
      children: [
        for (final clinic in _clinics)
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                context.push("/clinical", extra: {
                  "id": clinic["id"] as String,
                  "name": clinic["name"] as String,
                  "occupancy": clinic["occupancy"] as String,
                  "status": clinic["status"] as String,
                });
              },
              borderRadius: BorderRadius.circular(12),
              child: Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.clinicalCard,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.clinicalBorder, width: 1),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x060F172A),
                      blurRadius: 4,
                      offset: Offset(0, 1.5),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            clinic["name"] as String,
                            style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w700,
                              color: AppColors.clinicalTextDark,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: clinic["statusBg"] as Color,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            clinic["status"] as String,
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              color: clinic["statusColor"] as Color,
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppColors.clinicalTextMuted),
                      ],
                    ),
                    const SizedBox(height: 8),
                    // Occupancy progress bar
                    Row(
                      children: [
                        Text(
                          "Occupancy: ${clinic['occupancy']}",
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.clinicalTextSub,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: clinic["occupancyValue"] as double,
                              minHeight: 6,
                              backgroundColor: const Color(0xFFF1F5F9),
                              valueColor: AlwaysStoppedAnimation<Color>(
                                clinic["status"] == "HIGH LOAD"
                                    ? const Color(0xFFDC2626)
                                    : AppColors.medicalTeal,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            "${clinic['patients']} patients · ${clinic['bedsAvailable']} beds free",
                            style: const TextStyle(fontSize: 11, color: AppColors.clinicalTextMuted),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          clinic["revenue"] as String,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: AppColors.clinicalTextDark,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildFinancialRunRateCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.clinicalCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.clinicalBorder, width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0x060F172A),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Expanded(
                child: Text(
                  "ABDM & PM-JAY Claim Clearinghouse",
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.clinicalTextDark,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              SizedBox(width: 8),
              AyuSetuLogoBadge(height: 18),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            "98.4% First-Pass Approval Rate on Cloudflare D1 Ledger",
            style: TextStyle(fontSize: 11.5, color: AppColors.clinicalTextSub),
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: const LinearProgressIndicator(
              value: 0.984,
              minHeight: 6,
              backgroundColor: Color(0xFFF1F5F9),
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF16A34A)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorRosterSummary() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.clinicalCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.clinicalBorder, width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0x060F172A),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
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
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.clinicalTextDark,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  "All 24 duty doctors clocked in via biometrics",
                  style: TextStyle(fontSize: 11.5, color: AppColors.clinicalTextSub),
                ),
              ],
            ),
          ),
          SizedBox(width: 8),
          Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 22),
        ],
      ),
    );
  }
}
