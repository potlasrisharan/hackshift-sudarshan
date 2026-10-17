import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisBiomarkersScreen extends ConsumerStatefulWidget {
  const VitalisBiomarkersScreen({super.key});

  @override
  ConsumerState<VitalisBiomarkersScreen> createState() => _VitalisBiomarkersScreenState();
}

class _VitalisBiomarkersScreenState extends ConsumerState<VitalisBiomarkersScreen> {
  String _selectedMetric = "HbA1c";

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);
    final trend = state.biomarkerTrend;

    return AppScaffoldShell(
      title: "Biomarker Intelligence",
      subtitle: "Longitudinal Trends & Verified Laboratory History",
      child: Container(
        color: const Color(0xFFF8FAFC),
        width: double.infinity,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildMetricSelectorChips(),
              const SizedBox(height: 16),
              _buildTrajectoryCard(trend),
              const SizedBox(height: 20),
              const Text(
                "Chronological Laboratory History",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 12),
              _buildHistoryList(trend),
              const SizedBox(height: 20),
              _buildReferenceRangeCard(),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricSelectorChips() {
    final metrics = ["HbA1c", "Fasting Glucose", "Lipid Panel", "Blood Pressure", "eGFR", "TSH"];
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: metrics.map((m) {
          final isSelected = _selectedMetric == m;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              selected: isSelected,
              label: Text(
                m,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                  color: isSelected ? const Color(0xFF059669) : const Color(0xFF475569),
                ),
              ),
              selectedColor: const Color(0xFFE6F7F2),
              backgroundColor: const Color(0xFFFFFFFF),
              side: BorderSide(
                color: isSelected ? const Color(0xFF059669) : const Color(0xFFE2E8F0),
                width: isSelected ? 1.5 : 1.0,
              ),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              onSelected: (val) {
                if (val) setState(() => _selectedMetric = m);
              },
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTrajectoryCard(VitalisBiomarkerTrendModel trend) {
    final isIncreasing = trend.direction == "INCREASING";
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
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
                  "$_selectedMetric Trajectory",
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isIncreasing ? const Color(0xFFFFFBEB) : const Color(0xFFE6F7F2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isIncreasing ? const Color(0xFFFDE68A) : const Color(0xFFA7F3D0),
                  ),
                ),
                child: Text(
                  trend.direction,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isIncreasing ? const Color(0xFFD97706) : const Color(0xFF059669),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Text(
                "${trend.latestValue ?? 'N/A'}",
                style: const TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(width: 6),
              Text(trend.unit, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: Color(0xFF64748B))),
              const Spacer(),
              if (trend.delta != null)
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: (trend.delta! > 0 ? const Color(0xFFFFFBEB) : const Color(0xFFE6F7F2)),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: trend.delta! > 0 ? const Color(0xFFFDE68A) : const Color(0xFFA7F3D0),
                          ),
                        ),
                        child: Text(
                          "${trend.delta! > 0 ? '+' : ''}${trend.delta} ${trend.unit}",
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: trend.delta! > 0 ? const Color(0xFFD97706) : const Color(0xFF059669),
                          ),
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        "Net Shift",
                        style: TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            trend.clinicalNote,
            style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569), height: 1.35),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryList(VitalisBiomarkerTrendModel trend) {
    if (trend.validPoints.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFFFFFFFF),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: const Text("No verified lab history found for this test.", style: TextStyle(color: Color(0xFF64748B), fontSize: 13)),
      );
    }

    return Column(
      children: [
        for (final p in trend.validPoints.reversed)
          Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFFFFFF),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.03),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: Color(0xFFE6F7F2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.verified_outlined, color: Color(0xFF059669), size: 18),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              p.dateUtc.split("T").first,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const Text(
                              "Accredited Clinical Lab Encounter",
                              style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    "${p.value} ${p.unit}",
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildReferenceRangeCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            "Guideline Reference Bands (ICMR-INDIAB / ADA)",
            style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
          ),
          SizedBox(height: 6),
          Text(
            "• Normal: < 5.7%\n• Pre-diabetes: 5.7% – 6.4%\n• Diabetes Threshold: ≥ 6.5%",
            style: TextStyle(fontSize: 11.5, color: Color(0xFF475569), height: 1.4),
          ),
        ],
      ),
    );
  }
}
