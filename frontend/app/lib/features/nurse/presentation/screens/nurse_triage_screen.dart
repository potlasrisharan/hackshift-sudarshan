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
  final List<Map<String, dynamic>> _sentinelAlerts = [
    {
      "id": "alert-01",
      "patient": "Kavita Verma",
      "age": 28,
      "bed": "Triage Bay 02",
      "redFlag": "Acute Dysmenorrhea + Vasovagal Presyncope",
      "ruleTrigger": "SBP < 95 mmHg + Presyncope reported",
      "latency": "14ms",
      "urgency": "RED-FLAG ESCALATION",
      "status": "Under Observation",
      "acknowledged": false,
    },
    {
      "id": "alert-02",
      "patient": "Harpreet Singh",
      "age": 61,
      "bed": "Emergency Bay 01",
      "redFlag": "Diaphoresis + Epigastric Radiating Pain",
      "ruleTrigger": "Sentinel Rule 104 (Atypical ACS)",
      "latency": "11ms",
      "urgency": "STAT ECG ORDERED",
      "status": "Attending Dr. Verma",
      "acknowledged": false,
    },
  ];

  final List<Map<String, dynamic>> _beds = [
    {"bedNo": "ICU-01", "patient": "Gurpreet Singh", "status": "OCCUPIED", "color": const Color(0xFFDC2626), "bg": const Color(0xFFFEE2E2), "spo2": "94%", "hr": "104 bpm"},
    {"bedNo": "ICU-02", "patient": "Available", "status": "AVAILABLE", "color": const Color(0xFF16A34A), "bg": const Color(0xFFDCFCE7), "spo2": "--", "hr": "--"},
    {"bedNo": "GW-101", "patient": "Ramesh Chandra", "status": "OCCUPIED", "color": const Color(0xFF087D71), "bg": const Color(0xFFE6F7F2), "spo2": "98%", "hr": "78 bpm"},
    {"bedNo": "GW-102", "patient": "Deepak Mehta", "status": "DISCHARGE READY", "color": const Color(0xFFD97706), "bg": const Color(0xFFFEF3C7), "spo2": "99%", "hr": "72 bpm"},
    {"bedNo": "GW-103", "patient": "Sunita Sharma", "status": "OCCUPIED", "color": const Color(0xFF087D71), "bg": const Color(0xFFE6F7F2), "spo2": "99%", "hr": "72 bpm"},
    {"bedNo": "GW-104", "patient": "Available", "status": "AVAILABLE", "color": const Color(0xFF16A34A), "bg": const Color(0xFFDCFCE7), "spo2": "--", "hr": "--"},
  ];

  @override
  Widget build(BuildContext context) {
    return AppScaffoldShell(
      isLight: true,
      title: AppStrings.nursePortal,
      subtitle: "Nurse Station: Rapid Triage & IPD",
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSentinelHeader(),
            const SizedBox(height: 14),
            _buildAlertsList(),
            const SizedBox(height: 16),
            _buildCardiogramMonitor(),
            const SizedBox(height: 18),
            _buildIpdSectionHeader(),
            const SizedBox(height: 10),
            _buildBedGrid(),
            const SizedBox(height: 20),
            _buildQuickVitalsButton(),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildSentinelHeader() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFCA5A5), width: 1.2),
        boxShadow: const [
          BoxShadow(
            color: Color(0x080F172A),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: const Color(0xFFDC2626).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.flash_on_rounded, color: Color(0xFFDC2626), size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "Triage Sentinel Active (<3s Bypass Engine)",
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF991B1B),
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      "Deterministic rule triggers for immediate clinical handoff",
                      style: TextStyle(fontSize: 11.5, color: Color(0xFF7F1D1D)),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              const AyuSetuLogoBadge(height: 18),
            ],
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFFECACA)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFF16A34A),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Expanded(
                        child: Text(
                          "Latency: 11ms · Bypass <3s Guaranteed",
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF0F172A)),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 6),
                const Text(
                  "Zero-Queue Protocol",
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Color(0xFFDC2626)),
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
        for (int i = 0; i < _sentinelAlerts.length; i++)
          _buildAlertCard(_sentinelAlerts[i], i),
      ],
    );
  }

  Widget _buildAlertCard(Map<String, dynamic> alert, int index) {
    final bool isAck = alert["acknowledged"] as bool;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.clinicalCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: isAck ? AppColors.clinicalBorder : const Color(0xFFFECACA),
          width: isAck ? 1 : 1.3,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x060F172A),
            blurRadius: 8,
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
                child: Text(
                  alert["patient"],
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.clinicalTextDark,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: isAck ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Text(
                  isAck ? "ACKNOWLEDGED" : alert["urgency"],
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: isAck ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 3),
          Text(
            "${alert['bed']} · Triggered in ${alert['latency']}",
            style: const TextStyle(
              fontSize: 11.5,
              color: AppColors.medicalTeal,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.clinicalBg,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.clinicalBorderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  alert["redFlag"],
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.clinicalTextDark,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  alert["ruleTrigger"],
                  style: const TextStyle(fontSize: 11, color: AppColors.clinicalTextMuted),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    backgroundColor: isAck ? const Color(0xFFF1F5F9) : Colors.white,
                    side: BorderSide(color: isAck ? const Color(0xFFCBD5E1) : AppColors.clinicalBorder, width: 1.2),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () {
                    setState(() {
                      alert["acknowledged"] = true;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: AppColors.medicalTeal,
                        content: Text("Alert for ${alert['patient']} acknowledged by Nurse Priya."),
                      ),
                    );
                  },
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      isAck ? "Acknowledged" : "Acknowledge",
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isAck ? AppColors.clinicalTextMuted : AppColors.clinicalTextDark,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFFDC2626),
                        content: Text("Emergency transfer initialized: ${alert['patient']} -> ICU Bed 02"),
                      ),
                    );
                  },
                  child: const FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      "Transfer to ICU",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCardiogramMonitor() {
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
            children: [
              Expanded(
                child: Row(
                  children: const [
                    Icon(Icons.monitor_heart_rounded, color: AppColors.medicalTeal, size: 18),
                    SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        "Patient Vital Signs Monitor",
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.clinicalTextDark,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  "LEAD II · LIVE",
                  style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: Color(0xFF16A34A)),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          // Cardiogram graph container
          Container(
            height: 60,
            width: double.infinity,
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A),
              borderRadius: BorderRadius.circular(8),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: CustomPaint(
                painter: _CardiogramWavePainter(),
                child: Container(),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildTelemetryChip("HR", "76", "bpm", Icons.favorite, const Color(0xFFDC2626), const Color(0xFFFEF2F2)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildTelemetryChip("SpO2", "98", "%", Icons.air_rounded, const Color(0xFF059669), const Color(0xFFF0FDF4)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildTelemetryChip("NIBP", "118/78", "", Icons.speed_rounded, AppColors.medicalTeal, const Color(0xFFF0FDFA)),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildTelemetryChip("Resp", "16", "/m", Icons.water_drop_outlined, const Color(0xFFD97706), const Color(0xFFFFFBEB)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTelemetryChip(String label, String value, String unit, IconData icon, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 11, color: color),
              const SizedBox(width: 3),
              Text(
                label,
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: color),
              ),
            ],
          ),
          const SizedBox(height: 2),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              unit.isEmpty ? value : "$value $unit",
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: AppColors.clinicalTextDark,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIpdSectionHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: const [
        Expanded(
          child: Text(
            AppStrings.ipdBedBoard,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.clinicalTextDark,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
        SizedBox(width: 8),
        Text(
          "4 Occupied · 2 Available",
          style: TextStyle(fontSize: 12, color: AppColors.clinicalTextMuted, fontWeight: FontWeight.w500),
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
        childAspectRatio: 1.35,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
      ),
      itemCount: _beds.length,
      itemBuilder: (context, index) {
        final b = _beds[index];
        final Color col = b["color"] as Color;
        final Color bgCol = b["bg"] as Color;

        return InkWell(
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                backgroundColor: AppColors.medicalTeal,
                content: Text("Bed ${b['bedNo']} selected: ${b['patient']} (${b['status']})"),
              ),
            );
          },
          borderRadius: BorderRadius.circular(12),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
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
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        b["bedNo"],
                        style: const TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          color: AppColors.clinicalTextDark,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                      decoration: BoxDecoration(
                        color: bgCol,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        b["status"],
                        style: TextStyle(
                          fontSize: 8,
                          fontWeight: FontWeight.w800,
                          color: col,
                        ),
                        maxLines: 1,
                      ),
                    ),
                  ],
                ),
                Text(
                  b["patient"],
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.clinicalTextDark,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        b["spo2"] != "--" ? "SpO2: ${b['spo2']}" : "Standby",
                        style: const TextStyle(fontSize: 10, color: AppColors.clinicalTextMuted),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        b["hr"] != "--" ? "${b['hr']}" : "Unoccupied",
                        textAlign: TextAlign.end,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: col,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
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

  Widget _buildQuickVitalsButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.medicalTeal,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 14),
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
        icon: const Icon(Icons.add_chart_rounded, color: Colors.white, size: 18),
        label: const Text(
          "Record Patient Vitals & Blood Sugar",
          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
        ),
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: AppColors.medicalTeal,
              content: Text("Bluetooth BP & Glucometer synced. Recording vitals stream..."),
            ),
          );
        },
      ),
    );
  }
}

class _CardiogramWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..strokeWidth = 0.5;

    // Draw subtle grid lines
    const double step = 15;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    final wavePaint = Paint()
      ..color = const Color(0xFF10B981)
      ..strokeWidth = 2.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final path = Path();
    final double midY = size.height / 2;
    path.moveTo(0, midY);

    double x = 0;
    while (x < size.width) {
      path.lineTo(x + 20, midY);
      path.lineTo(x + 25, midY - 6); // P wave
      path.lineTo(x + 30, midY);
      path.lineTo(x + 36, midY);
      path.lineTo(x + 40, midY + 4); // Q dip
      path.lineTo(x + 44, midY - 24); // R peak
      path.lineTo(x + 48, midY + 8); // S wave
      path.lineTo(x + 52, midY);
      path.lineTo(x + 60, midY);
      path.lineTo(x + 66, midY - 10); // T wave
      path.lineTo(x + 74, midY);
      path.lineTo(x + 95, midY);
      x += 95;
    }

    canvas.drawPath(path, wavePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
