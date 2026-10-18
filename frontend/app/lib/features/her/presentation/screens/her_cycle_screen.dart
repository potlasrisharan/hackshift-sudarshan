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
      child: Container(
        color: const Color(0xFFFFF1F3),
        width: double.infinity,
        height: double.infinity,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Flo Month Calendar Phase Map
              _buildMonthCalendarView(state.monthPhases),
              const SizedBox(height: 16),

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
      ),
    );
  }

  Widget _buildWindowSpreadCard(HerCycleAnalysisModel analysis) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF1F3),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.show_chart, color: Color(0xFFE11D48), size: 18),
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  "Statistical Interval Analytics",
                  style: TextStyle(
                    color: Color(0xFF9F1239),
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFCE7EC),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFFDA4AF)),
                ),
                child: Text(
                  "${analysis.totalIntervals} intervals",
                  style: const TextStyle(
                    color: Color(0xFF9F1239),
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
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
          if (analysis.caveats.isNotEmpty) ...[
            const SizedBox(height: 12),
            ...analysis.caveats.map(
              (c) => Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text("• $c", style: const TextStyle(color: Color(0xFF64748B), fontSize: 11)),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(value, style: const TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.bold, fontSize: 13)),
        ),
        const SizedBox(height: 2),
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(label, style: const TextStyle(color: Color(0xFF64748B), fontSize: 10)),
        ),
      ],
    );
  }

  Widget _buildLogCycleCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Log Cycle Start",
            style: TextStyle(
              color: Color(0xFF9F1239),
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
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1F3),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFFDA4AF)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.calendar_today, size: 16, color: Color(0xFFE11D48)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Start Date: ${_selectedDate.toIso8601String().split('T').first}",
                      style: const TextStyle(color: Color(0xFF0F172A), fontSize: 13, fontWeight: FontWeight.w600),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text("Change", style: TextStyle(color: Color(0xFFE11D48), fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),

          // Flow Intensity Chips
          const Text("Flow Intensity", style: TextStyle(color: Color(0xFF475569), fontSize: 12, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: ["spotting", "light", "medium", "heavy", "flooding"].map((flow) {
              final isSelected = _selectedFlow == flow;
              return ChoiceChip(
                label: Text(flow[0].toUpperCase() + flow.substring(1)),
                selected: isSelected,
                selectedColor: const Color(0xFFE11D48),
                backgroundColor: const Color(0xFFFFF1F3),
                side: BorderSide(color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF)),
                labelStyle: TextStyle(
                  color: isSelected ? Colors.white : const Color(0xFF0F172A),
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
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
                  style: TextStyle(color: Color(0xFF475569), fontSize: 12, fontWeight: FontWeight.w600),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                "${_crampSeverity.toInt()} / 10",
                style: TextStyle(
                  color: _crampSeverity > 6 ? const Color(0xFFE11D48) : const Color(0xFF9F1239),
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                ),
              ),
            ],
          ),
          Slider(
            value: _crampSeverity,
            min: 0,
            max: 10,
            divisions: 10,
            activeColor: _crampSeverity > 6 ? const Color(0xFFE11D48) : const Color(0xFFEC4899),
            inactiveColor: const Color(0xFFFCE7EC),
            onChanged: (val) => setState(() => _crampSeverity = val),
          ),
          const SizedBox(height: 12),

          // Submit Button
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE11D48),
              minimumSize: const Size.fromHeight(46),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 2,
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
          child: Text("No recorded cycles yet. Log your first cycle above.", style: TextStyle(color: Color(0xFF64748B))),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Recorded Historical Cycles",
          style: TextStyle(
            color: Color(0xFF9F1239),
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
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFFDA4AF)),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFFFDA4AF).withValues(alpha: 0.12),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: Color(0xFFFFF1F3),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.water_drop_outlined, color: Color(0xFFE11D48), size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Cycle Start: ${c.startDate}",
                          style: const TextStyle(
                            color: Color(0xFF0F172A),
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          "Flow: ${c.flowIntensity} • Cramps: ${c.crampsSeverity}/10${c.cycleLengthDays != null ? ' • Length: ${c.cycleLengthDays}d' : ''}",
                          style: const TextStyle(color: Color(0xFF475569), fontSize: 11),
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

  Widget _buildMonthCalendarView(List<HerMonthPhaseEntryModel> monthPhases) {
    if (monthPhases.isEmpty) return const SizedBox.shrink();

    final now = DateTime.now();
    const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFDA4AF)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFDA4AF).withValues(alpha: 0.15),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF1F3),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.calendar_month_rounded, color: Color(0xFFE11D48), size: 18),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Flo Month Phase Map (${now.year})",
                  style: const TextStyle(
                    color: Color(0xFF9F1239),
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Phase Legends
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: [
              _legendDot(const Color(0xFFE11D48), "Menstrual"),
              _legendDot(const Color(0xFFF472B6), "Follicular"),
              _legendDot(const Color(0xFF0D9488), "Fertile/Ovulation"),
              _legendDot(const Color(0xFF8B5CF6), "Luteal"),
            ],
          ),
          const SizedBox(height: 14),

          // Weekday Headers
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: weekdays
                .map((w) => Expanded(
                      child: Center(
                        child: Text(
                          w,
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: Color(0xFF64748B)),
                        ),
                      ),
                    ))
                .toList(),
          ),
          const SizedBox(height: 8),

          // Days Grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: monthPhases.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              crossAxisSpacing: 4,
              mainAxisSpacing: 4,
              childAspectRatio: 0.95,
            ),
            itemBuilder: (context, idx) {
              final entry = monthPhases[idx];
              final dayNum = idx + 1;
              Color phaseBg;
              Color phaseFg;

              if (entry.isPeriod) {
                phaseBg = const Color(0xFFFFF1F3);
                phaseFg = const Color(0xFFE11D48);
              } else if (entry.isFertile || entry.isOvulation) {
                phaseBg = const Color(0xFFF0FDF4);
                phaseFg = const Color(0xFF0D9488);
              } else if (entry.phase == "LUTEAL") {
                phaseBg = const Color(0xFFF5F3FF);
                phaseFg = const Color(0xFF8B5CF6);
              } else {
                phaseBg = const Color(0xFFFDF2F8);
                phaseFg = const Color(0xFFDB2777);
              }

              final isToday = dayNum == now.day;

              return InkWell(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        "${entry.date}: Cycle Day ${entry.cycleDay} · ${entry.phase.replaceAll('_', ' ')} · Pregnancy: ${entry.pregnancyChance}",
                      ),
                      duration: const Duration(seconds: 2),
                      backgroundColor: phaseFg,
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  decoration: BoxDecoration(
                    color: phaseBg,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isToday ? phaseFg : Colors.transparent,
                      width: isToday ? 1.5 : 1.0,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "$dayNum",
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: phaseFg,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Container(
                        width: 4,
                        height: 4,
                        decoration: BoxDecoration(shape: BoxShape.circle, color: phaseFg),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _legendDot(Color color, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
      ],
    );
  }
}
