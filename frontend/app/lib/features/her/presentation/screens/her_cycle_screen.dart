import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../data/models/her_models.dart";
import "../providers/her_provider.dart";

class HerCycleScreen extends ConsumerStatefulWidget {
  const HerCycleScreen({super.key});

  @override
  ConsumerState<HerCycleScreen> createState() => _HerCycleScreenState();
}

class _HerCycleScreenState extends ConsumerState<HerCycleScreen> {
  DateTime _selectedDate = DateTime.now();
  String _selectedFlow = "medium";
  double _crampSeverity = 2.0;
  final TextEditingController _notesController = TextEditingController();

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _submitCycle() {
    final dateStr = _selectedDate.toIso8601String().split("T").first;
    final cycle = HerCycleModel(
      id: "cyc_${DateTime.now().millisecondsSinceEpoch}",
      startDate: dateStr,
      flowIntensity: _selectedFlow,
      crampsSeverity: _crampSeverity.toInt(),
      notes: _notesController.text.isNotEmpty ? _notesController.text : null,
    );

    ref.read(herProvider.notifier).logCycle(cycle);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Menstrual cycle start logged successfully."),
        backgroundColor: AppColors.success,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(herProvider);
    final analysis = state.cycleAnalysis;

    return AppScaffoldShell(
      title: "Cycle & Menstrual History",
      subtitle: "Interval Statistics & Deviation Radar",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Next Cycle Window Spread Card
            _buildWindowSpreadCard(analysis),
            const SizedBox(height: 16),

            // Log New Cycle Form
            _buildLogCycleCard(),
            const SizedBox(height: 20),

            // Cycle History Table
            _buildCycleHistoryList(state.cycles),
          ],
        ),
      ),
    );
  }

  Widget _buildWindowSpreadCard(HerCycleAnalysisModel analysis) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.wellnessPink.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.show_chart, color: AppColors.wellnessPink, size: 20),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  "Statistical Interval Analytics",
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  "${analysis.totalIntervals} intervals",
                  style: const TextStyle(color: AppColors.primaryLight, fontSize: 11),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(child: _buildStat("Median", analysis.medianLengthDays != null ? "${analysis.medianLengthDays}d" : "—")),
              Expanded(child: _buildStat("Mean", analysis.meanLengthDays != null ? "${analysis.meanLengthDays}d" : "—")),
              Expanded(child: _buildStat("Std Dev", analysis.stdDevDays != null ? "±${analysis.stdDevDays}d" : "—")),
              Expanded(child: _buildStat("Shortest", analysis.shortestCycleDays != null ? "${analysis.shortestCycleDays}d" : "—")),
              Expanded(child: _buildStat("Longest", analysis.longestCycleDays != null ? "${analysis.longestCycleDays}d" : "—")),
            ],
          ),
          const SizedBox(height: 12),
          if (analysis.caveats.isNotEmpty)
            ...analysis.caveats.map(
              (c) => Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text("• $c", style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(value, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13)),
        ),
        const SizedBox(height: 2),
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
        ),
      ],
    );
  }

  Widget _buildLogCycleCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Log Cycle Start",
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),

          // Date Picker Tile
          InkWell(
            onTap: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: _selectedDate,
                firstDate: DateTime(2020),
                lastDate: DateTime.now(),
              );
              if (picked != null) {
                setState(() => _selectedDate = picked);
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  const Icon(Icons.calendar_today, size: 16, color: AppColors.primaryLight),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Start Date: ${_selectedDate.toIso8601String().split('T').first}",
                      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text("Change", style: TextStyle(color: AppColors.primaryLight, fontSize: 12)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Flow Intensity Chips
          const Text("Flow Intensity", style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(height: 6),
          Wrap(
            spacing: 8,
            children: ["spotting", "light", "medium", "heavy", "flooding"].map((flow) {
              final isSelected = _selectedFlow == flow;
              return ChoiceChip(
                label: Text(flow[0].toUpperCase() + flow.substring(1)),
                selected: isSelected,
                selectedColor: AppColors.wellnessPink,
                backgroundColor: AppColors.surfaceElevated,
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : AppColors.textPrimary,
                  fontSize: 12,
                ),
                onSelected: (_) => setState(() => _selectedFlow = flow),
              );
            }).toList(),
          ),
          const SizedBox(height: 14),

          // Cramp Severity Slider
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "Cramp Severity (0-10)",
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                "${_crampSeverity.toInt()} / 10",
                style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13),
              ),
            ],
          ),
          Slider(
            value: _crampSeverity,
            min: 0,
            max: 10,
            divisions: 10,
            activeColor: _crampSeverity > 6 ? AppColors.error : AppColors.wellnessPink,
            onChanged: (val) => setState(() => _crampSeverity = val),
          ),
          const SizedBox(height: 12),

          // Submit Button
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              minimumSize: const Size.fromHeight(44),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            icon: const Icon(Icons.check, color: Colors.white, size: 18),
            label: const Text("Save Cycle Entry", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            onPressed: _submitCycle,
          ),
        ],
      ),
    );
  }

  Widget _buildCycleHistoryList(List<HerCycleModel> cycles) {
    if (cycles.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(24),
          child: Text("No recorded cycles yet. Log your first cycle above.", style: TextStyle(color: AppColors.textMuted)),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Recorded Historical Cycles",
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 15,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 10),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: cycles.length,
          separatorBuilder: (_, _) => const SizedBox(height: 8),
          itemBuilder: (context, idx) {
            final c = cycles[idx];
            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.surfaceElevated),
              ),
              child: Row(
                children: [
                  const Icon(Icons.water_drop_outlined, color: AppColors.wellnessPink, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Cycle Start: ${c.startDate}",
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          "Flow: ${c.flowIntensity} • Cramps: ${c.crampsSeverity}/10${c.cycleLengthDays != null ? ' • Length: ${c.cycleLengthDays}d' : ''}",
                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
