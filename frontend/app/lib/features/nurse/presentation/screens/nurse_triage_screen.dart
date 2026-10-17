import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class NurseTriageScreen extends StatefulWidget {
  const NurseTriageScreen({super.key});

  @override
  State<NurseTriageScreen> createState() => _NurseTriageScreenState();
}

class _NurseTriageScreenState extends State<NurseTriageScreen> {
  final List<Map<String, dynamic>> _sentinelAlerts = const [
    {
      "patient": "Kavita Verma",
      "age": 28,
      "bed": "Triage Bay 02",
      "redFlag": "Acute Dysmenorrhea + Vasovagal Presyncope",
      "ruleTrigger": "SBP < 95 mmHg + Presyncope reported",
      "latency": "14ms",
      "urgency": "RED-FLAG ESCALATION",
      "status": "Under Observation",
    },
    {
      "patient": "Harpreet Singh",
      "age": 61,
      "bed": "Emergency Bay 01",
      "redFlag": "Diaphoresis + Epigastric Radiating Pain",
      "ruleTrigger": "Sentinel Rule 104 (Atypical ACS)",
      "latency": "11ms",
      "urgency": "STAT ECG ORDERED",
      "status": "Attending Dr. Verma",
    },
  ];

  final List<Map<String, dynamic>> _beds = const [
    {"bedNo": "ICU-01", "patient": "Gurpreet Singh", "status": "OCCUPIED", "color": AppColors.error},
    {"bedNo": "ICU-02", "patient": "Available", "status": "AVAILABLE", "color": AppColors.success},
    {"bedNo": "GW-101", "patient": "Ramesh Chandra", "status": "OCCUPIED", "color": AppColors.primaryLight},
    {"bedNo": "GW-102", "patient": "Deepak Mehta", "status": "DISCHARGE READY", "color": AppColors.warning},
    {"bedNo": "GW-103", "patient": "Sunita Sharma", "status": "OCCUPIED", "color": AppColors.primaryLight},
    {"bedNo": "GW-104", "patient": "Available", "status": "AVAILABLE", "color": AppColors.success},
  ];

  @override
  Widget build(BuildContext context) {
    return AppScaffoldShell(
      title: AppStrings.nursePortal,
      subtitle: "Nurse Station: Rapid Triage & IPD",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSentinelHeader(),
            const SizedBox(height: 16),
            _buildAlertsList(),
            const SizedBox(height: 24),
            _buildIpdSectionHeader(),
            const SizedBox(height: 12),
            _buildBedGrid(),
            const SizedBox(height: 24),
            _buildQuickVitalsButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildSentinelHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: const [
          Icon(Icons.warning_amber_rounded, color: AppColors.error, size: 28),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Triage Sentinel Active (<3s Bypass Engine)",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
                Text(
                  "Deterministic rule triggers for immediate clinical handoff",
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlertsList() {
    return Column(
      children: [
        for (final alert in _sentinelAlerts)
          Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
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
                  children: [
                    Expanded(
                      child: Text(
                        alert["patient"],
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.error.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        alert["urgency"],
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.error),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  "${alert['bed']} · Triggered in ${alert['latency']}",
                  style: const TextStyle(fontSize: 12, color: AppColors.primaryLight, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 8),
                Text(
                  alert["redFlag"],
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                ),
                Text(
                  alert["ruleTrigger"],
                  style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.surfaceElevated,
                        foregroundColor: AppColors.textPrimary,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                      onPressed: () {},
                      child: const Text("Acknowledge", style: TextStyle(fontSize: 12)),
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.error,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      ),
                      onPressed: () {},
                      child: const Text("Transfer to ICU", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
                    ),
                  ],
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildIpdSectionHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: const [
        Expanded(
          child: Text(
            AppStrings.ipdBedBoard,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        SizedBox(width: 8),
        Text(
          "4 Occupied · 2 Available",
          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
        ),
      ],
    );
  }

  Widget _buildBedGrid() {
    return GridView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 1.25,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: _beds.length,
      itemBuilder: (context, index) {
        final b = _beds[index];
        final Color col = b["color"] as Color;

        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: col.withValues(alpha: 0.3)),
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
                      b["bedNo"],
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(color: col, shape: BoxShape.circle),
                  ),
                ],
              ),
              Text(
                b["patient"],
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              Text(
                b["status"],
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: col),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildQuickVitalsButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          padding: const EdgeInsets.symmetric(vertical: 14),
        ),
        icon: const Icon(Icons.add_chart_rounded, color: Colors.white),
        label: const Text("Record Patient Vitals & Blood Sugar", style: TextStyle(fontWeight: FontWeight.w700)),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: AppColors.primary,
              content: Text("Bluetooth BP monitor synced. Recording vitals stream..."),
            ),
          );
        },
      ),
    );
  }
}
