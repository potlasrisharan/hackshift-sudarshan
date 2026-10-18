import "dart:math" as math;
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../data/models/her_models.dart";
import "../providers/her_provider.dart";
import "../widgets/her_demo_selector_sheet.dart";
import "../widgets/her_safety_banner.dart";

class HerHubScreen extends ConsumerWidget {
  const HerHubScreen({super.key});

  static const _ink = Color(0xFF342A3A);
  static const _plum = Color(0xFF744D70);
  static const _paper = Color(0xFFFFF9F7);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(herProvider);
    final analysis = state.cycleAnalysis;
    final todayPhase = state.todayPhase;

    return AppScaffoldShell(
      title: "AyuSetu HER",
      subtitle: "Your cycle and wellbeing, in one calm space",
      actions: [
        IconButton(
          tooltip: "Switch demo profile",
          icon: const Icon(Icons.tune_rounded, color: _plum),
          onPressed: () => showModalBottomSheet<void>(
            context: context,
            backgroundColor: Colors.transparent,
            isScrollControlled: true,
            builder: (_) => const HerDemoSelectorSheet(),
          ),
        ),
      ],
      child: ColoredBox(
        color: _paper,
        child: state.isLoading
            ? const Center(child: CircularProgressIndicator(color: _plum))
            : RefreshIndicator(
                color: _plum,
                onRefresh: ref.read(herProvider.notifier).loadAll,
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(18, 12, 18, 28),
                  children: [
                    // 1. Flo Animated Circular Cycle Wheel Dial
                    _buildCycleWheelCard(context, ref, state),
                    const SizedBox(height: 16),

                    // Quick Feature Actions
                    const Text(
                      "A little care, when you need it",
                      style: TextStyle(color: _ink, fontSize: 18, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 12),
                    _featureTile(
                      context,
                      icon: Icons.edit_note_rounded,
                      title: "Log how you feel",
                      detail: state.symptoms.isEmpty ? "Add a symptom or mood check-in" : "${state.symptoms.length} recent check-ins",
                      route: "/her/symptom-journal",
                      tint: const Color(0xFFFFE9E7),
                    ),
                    const SizedBox(height: 10),
                    _featureTile(
                      context,
                      icon: Icons.spa_outlined,
                      title: "Wellness ideas",
                      detail: "Gentle movement and everyday support",
                      route: "/her/wellness-studio",
                      tint: const Color(0xFFECE8F1),
                    ),
                    const SizedBox(height: 10),
                    _featureTile(
                      context,
                      icon: Icons.calendar_month_outlined,
                      title: "Cycle history & intervals",
                      detail: "${analysis.totalIntervals} intervals recorded · full breakdown",
                      route: "/her/cycle-calendar",
                      tint: const Color(0xFFEAF0E7),
                    ),
                    const SizedBox(height: 16),

                    // 2. Horizontal Day-by-Day Timeline Strip
                    _buildCalendarStrip(context, ref, state),
                    const SizedBox(height: 16),

                    // 3. Daily Phase & Hormone Radar Insights
                    if (todayPhase != null) ...[
                      _buildDailyInsightsCard(todayPhase),
                      const SizedBox(height: 16),
                    ],

                    // 4. 1-Tap Quick Symptom & Mood Logger
                    _buildQuickSymptomLogger(context, ref),
                    const SizedBox(height: 16),

                    // 5. PCOD / PCOS Health Tracker (Rotterdam Consensus)
                    if (state.pcodAssessment != null) ...[
                      _buildPcodCard(context, state.pcodAssessment!),
                      const SizedBox(height: 16),
                    ],

                    // Active Safety Alert Gate Banner
                    if (state.activeSafetyAlert != null) ...[
                      HerSafetyBanner(
                        alert: state.activeSafetyAlert!,
                        onDismiss: () => ref.read(herProvider.notifier).dismissSafetyAlert(),
                      ),
                      const SizedBox(height: 16),
                    ],
                    if (state.findings.isNotEmpty) ...[
                      const SizedBox(height: 18),
                      _screeningCard(state.findings.first),
                    ],
                    const SizedBox(height: 18),
                    const Text(
                      "Cycle estimates are calculated from your recorded parameters. They are not a clinical diagnosis or substitute for physician advice.",
                      style: TextStyle(color: Color(0xFF756E78), fontSize: 12, height: 1.45),
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  // --- 1. FLO CIRCULAR CYCLE WHEEL DIAL ---
  Widget _buildCycleWheelCard(BuildContext context, WidgetRef ref, HerState state) {
    final phase = state.todayPhase;
    final profile = state.profile;
    final cycleDay = phase?.cycleDay ?? 12;
    final cycleLength = profile.typicalCycleDays > 0 ? profile.typicalCycleDays : 28;
    final periodLength = profile.typicalPeriodDays > 0 ? profile.typicalPeriodDays : 5;
    final phaseName = phase?.phase ?? "FOLLICULAR";
    final pregnancyChance = phase?.pregnancyChance ?? "LOW";
    final daysUntilNext = phase?.daysUntilNextPeriod ?? 16;

    String phaseTitle;
    Color phaseColor;
    switch (phaseName) {
      case "MENSTRUAL":
        phaseTitle = "Period Day $cycleDay";
        phaseColor = const Color(0xFFE11D48);
        break;
      case "FOLLICULAR":
        phaseTitle = "Follicular Phase";
        phaseColor = const Color(0xFFDB2777);
        break;
      case "OVULATION":
        phaseTitle = "Fertile Window";
        phaseColor = const Color(0xFF0D9488);
        break;
      case "LUTEAL":
      default:
        phaseTitle = "Luteal Phase";
        phaseColor = const Color(0xFF7C3AED);
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: const Color(0xFFF1EBF0)),
        boxShadow: [
          BoxShadow(
            color: _plum.withValues(alpha: 0.08),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.auto_awesome_rounded, size: 14, color: _plum),
              const SizedBox(width: 6),
              Text(
                state.cycleAnalysis.hasIrregularity ? "A pattern to keep an eye on" : "Your cycle at a glance",
                style: const TextStyle(color: Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.w700),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Circular Dial
          SizedBox(
            width: 200,
            height: 200,
            child: _AnimatedCycleWheel(
              cycleDay: cycleDay,
              cycleLength: cycleLength,
              periodLength: periodLength,
              phase: phaseName,
              phaseTitle: phaseTitle,
              phaseColor: phaseColor,
              pregnancyChance: pregnancyChance,
              daysUntilNext: daysUntilNext,
            ),
          ),
          const SizedBox(height: 18),

          // Two Action Buttons Under Wheel
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => _showQuickLogPeriod(context, ref),
                  icon: const Icon(Icons.water_drop_rounded, size: 14),
                  label: const Text("Log Period", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFE11D48),
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => _showEditCycleSheet(context, ref, profile),
                  icon: const Icon(Icons.tune_rounded, size: 14),
                  label: const Text("Edit Cycle", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: _plum,
                    side: const BorderSide(color: Color(0xFFCBD5E1)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 10),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- 2. HORIZONTAL DAY-BY-DAY CALENDAR STRIP ---
  Widget _buildCalendarStrip(BuildContext context, WidgetRef ref, HerState state) {
    final now = DateTime.now();
    final todayPhase = state.todayPhase;
    final selectedDateStr = todayPhase?.targetDate ?? now.toIso8601String().split("T").first;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFF1EBF0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Expanded(
                child: Text(
                  "Cycle Compass",
                  style: TextStyle(color: _ink, fontSize: 13, fontWeight: FontWeight.w800),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: () => context.push("/her/cycle-calendar"),
                child: const Text(
                  "Full Month →",
                  style: TextStyle(color: _plum, fontSize: 12, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: List.generate(7, (idx) {
              final date = now.subtract(Duration(days: 3 - idx));
              final dateStr = date.toIso8601String().split("T").first;
              final isSelected = dateStr == selectedDateStr;
              final isToday = idx == 3;
              const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
              final dayLetter = weekdays[date.weekday - 1];

              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 1.5),
                  child: InkWell(
                    onTap: () => ref.read(herProvider.notifier).selectDatePhase(dateStr),
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? _plum
                            : (isToday ? const Color(0xFFFFF1F3) : Colors.transparent),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSelected
                              ? _plum
                              : (isToday ? const Color(0xFFFDA4AF) : Colors.transparent),
                        ),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            dayLetter,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? Colors.white70 : const Color(0xFF94A3B8),
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            "${date.day}",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? Colors.white : _ink,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Container(
                            width: 4,
                            height: 4,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isSelected
                                  ? Colors.white
                                  : (isToday ? const Color(0xFFE11D48) : const Color(0xFFCBD5E1)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }

  // --- 3. DAILY PHASE & HORMONE RADAR ---
  Widget _buildDailyInsightsCard(HerCyclePhaseDetailModel phase) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFF1EBF0)),
        boxShadow: [
          BoxShadow(color: _plum.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4)),
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
                child: const Icon(Icons.bolt_rounded, color: Color(0xFFE11D48), size: 18),
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  "Daily Phase & Hormone Radar",
                  style: TextStyle(color: _ink, fontSize: 14, fontWeight: FontWeight.w800),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF86EFAC)),
                ),
                child: Text(
                  phase.pregnancyChance.replaceAll("_", " "),
                  style: const TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.w700, fontSize: 10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Hormones Row
          Row(
            children: [
              Expanded(child: _buildHormonePill("Estrogen", phase.estrogenLevel, const Color(0xFFF472B6))),
              const SizedBox(width: 8),
              Expanded(child: _buildHormonePill("Progesterone", phase.progesteroneLevel, const Color(0xFF8B5CF6))),
              const SizedBox(width: 8),
              Expanded(child: _buildHormonePill("LH Surge", phase.lhLevel, const Color(0xFF0D9488))),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(color: Color(0xFFF1EBF0), height: 1),
          const SizedBox(height: 14),

          // 3 Insights
          _buildInsightBullet(
            icon: Icons.psychology_outlined,
            title: "Body & Energy Rhythm",
            text: phase.bodyAndEnergy,
            color: const Color(0xFF744D70),
          ),
          const SizedBox(height: 10),
          _buildInsightBullet(
            icon: Icons.restaurant_menu_rounded,
            title: "Ayurvedic Ahara (Food as Medicine)",
            text: phase.nutritionFocus,
            color: const Color(0xFFD97706),
          ),
          const SizedBox(height: 10),
          _buildInsightBullet(
            icon: Icons.self_improvement_rounded,
            title: "Movement & Dinacharya Yoga",
            text: phase.movementAdvice,
            color: const Color(0xFF087D71),
          ),
        ],
      ),
    );
  }

  Widget _buildHormonePill(String name, String level, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(name, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w700)),
          const SizedBox(height: 2),
          Text(level, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  Widget _buildInsightBullet({
    required IconData icon,
    required String title,
    required String text,
    required Color color,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(5),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color, size: 16),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: color)),
              const SizedBox(height: 2),
              Text(text, style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.35)),
            ],
          ),
        ),
      ],
    );
  }

  // --- 4. 1-TAP QUICK SYMPTOM & MOOD LOGGER ---
  Widget _buildQuickSymptomLogger(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFF1EBF0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                "How are you feeling today?",
                style: TextStyle(color: _ink, fontSize: 14, fontWeight: FontWeight.w800),
              ),
              InkWell(
                onTap: () => context.push("/her/symptom-journal"),
                child: const Text(
                  "Full Journal →",
                  style: TextStyle(color: _plum, fontSize: 12, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Flow Category
          const Text("Flow", style: TextStyle(color: Color(0xFF64748B), fontSize: 11, fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              _quickSymptomChip(context, ref, "Spotting", {"flow": "spotting", "energyLevel": 6}),
              _quickSymptomChip(context, ref, "Light Flow", {"flow": "light", "energyLevel": 6}),
              _quickSymptomChip(context, ref, "Medium Flow", {"flow": "medium", "energyLevel": 5}),
              _quickSymptomChip(context, ref, "Heavy Flow", {"flow": "heavy", "energyLevel": 4}),
            ],
          ),
          const SizedBox(height: 10),

          // Mood Category
          const Text("Mood", style: TextStyle(color: Color(0xFF64748B), fontSize: 11, fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              _quickSymptomChip(context, ref, "Calm 😌", {"mood": "calm"}),
              _quickSymptomChip(context, ref, "Happy 😊", {"mood": "happy"}),
              _quickSymptomChip(context, ref, "Sensitive 🥺", {"mood": "sensitive"}),
              _quickSymptomChip(context, ref, "Low Energy 😴", {"mood": "low_energy", "energyLevel": 3}),
            ],
          ),
          const SizedBox(height: 10),

          // Physical Symptoms
          const Text("Body Symptoms", style: TextStyle(color: Color(0xFF64748B), fontSize: 11, fontWeight: FontWeight.w700)),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              _quickSymptomChip(context, ref, "Cramps ⚡", {"pelvicPain": 2}),
              _quickSymptomChip(context, ref, "Bloating 🫧", {"bloating": 2}),
              _quickSymptomChip(context, ref, "Headache 🤕", {"headache": 2}),
              _quickSymptomChip(context, ref, "Cravings 🍫", {"cravings": "sweet"}),
            ],
          ),
        ],
      ),
    );
  }

  Widget _quickSymptomChip(BuildContext context, WidgetRef ref, String label, Map<String, Object?> payload) {
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
      backgroundColor: const Color(0xFFF8FAFC),
      side: const BorderSide(color: Color(0xFFE2E8F0)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      onPressed: () async {
        final fullPayload = <String, Object?>{
          "logDate": DateTime.now().toIso8601String().split("T").first,
          "energyLevel": payload["energyLevel"] ?? 6,
          "mood": payload["mood"] ?? "calm",
          "pelvicPain": payload["pelvicPain"] ?? 0,
          "bloating": payload["bloating"] ?? 0,
          "headache": payload["headache"] ?? 0,
          ...payload,
        };
        await ref.read(herProvider.notifier).logSymptom(fullPayload);
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Logged: $label"),
              duration: const Duration(seconds: 2),
              backgroundColor: _plum,
            ),
          );
        }
      },
    );
  }

  // --- 5. PCOD / PCOS HEALTH TRACKER CARD ---
  Widget _buildPcodCard(BuildContext context, HerPcodAssessmentModel pcod) {
    final isHigh = pcod.riskLevel == "HIGH_CLINICAL_REVIEW";
    final isMild = pcod.riskLevel == "MILD_WATCH";
    final badgeColor = isHigh
        ? const Color(0xFFE11D48)
        : (isMild ? const Color(0xFFD97706) : const Color(0xFF15803D));
    final badgeBg = isHigh
        ? const Color(0xFFFFF1F3)
        : (isMild ? const Color(0xFFFEF3C7) : const Color(0xFFF0FDF4));

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: badgeColor.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: badgeBg,
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.favorite_outline_rounded, color: badgeColor, size: 18),
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  "PCOD / PCOS Radar (Rotterdam)",
                  style: TextStyle(color: _ink, fontSize: 14, fontWeight: FontWeight.w800),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: badgeBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: badgeColor.withValues(alpha: 0.3)),
                ),
                child: Text(
                  "${pcod.rotterdamCriteriaMet}/${pcod.maxCriteria} Criteria Met",
                  style: TextStyle(color: badgeColor, fontWeight: FontWeight.w700, fontSize: 10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            pcod.summary.isNotEmpty ? pcod.summary : "Hormonal baseline evaluated according to Rotterdam clinical consensus criteria.",
            style: const TextStyle(color: Color(0xFF475569), fontSize: 12, height: 1.4),
          ),
          const SizedBox(height: 12),

          // Herbal & Lifestyle Recommendation
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.eco_rounded, color: Color(0xFF15803D), size: 16),
                    const SizedBox(width: 6),
                    Text(
                      "Ayurvedic Protocol · ${pcod.doshaFocus}",
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11, color: Color(0xFF15803D)),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  "Recommended herbs: ${pcod.recommendedHerbs.join(', ')}",
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                ),
                const SizedBox(height: 2),
                Text(
                  pcod.lifestyleAdvice,
                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => context.push("/her/questionnaire"),
              style: OutlinedButton.styleFrom(
                foregroundColor: _plum,
                side: const BorderSide(color: _plum),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                padding: const EdgeInsets.symmetric(vertical: 10),
              ),
              child: const Text("Take / Update PCOD Screening →", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
            ),
          ),
        ],
      ),
    );
  }

  void _showQuickLogPeriod(BuildContext context, WidgetRef ref) {
    showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 30)),
      lastDate: DateTime.now(),
    ).then((picked) {
      if (picked != null) {
        final dateStr = picked.toIso8601String().split("T").first;
        final newCycle = HerCycleModel(
          id: "cyc_${DateTime.now().millisecondsSinceEpoch}",
          startDate: dateStr,
          flowIntensity: "medium",
          crampsSeverity: 2,
          notes: "Logged from Cycle Wheel Dial",
        );
        ref.read(herProvider.notifier).logCycle(newCycle);
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Period start logged for $dateStr"),
              backgroundColor: const Color(0xFFE11D48),
            ),
          );
        }
      }
    });
  }

  void _showEditCycleSheet(BuildContext context, WidgetRef ref, HerProfileModel profile) {
    var cycleDays = profile.typicalCycleDays;
    var periodDays = profile.typicalPeriodDays;
    var selectedDate = DateTime.tryParse(profile.lastPeriodStartDate ?? "") ?? DateTime.now().subtract(const Duration(days: 12));
    var regularity = profile.cycleRegularity;

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Edit Cycle Parameters", style: TextStyle(fontWeight: FontWeight.w800, fontSize: 17, color: _ink)),
                      IconButton(icon: const Icon(Icons.close_rounded), onPressed: () => Navigator.pop(ctx)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text("Update your cycle baseline to recalculate your wheel and phase timings.", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                  const SizedBox(height: 16),

                  // Last Period Start Date
                  const Text("Last Period Start Date", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: _ink)),
                  const SizedBox(height: 6),
                  InkWell(
                    onTap: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: selectedDate,
                        firstDate: DateTime.now().subtract(const Duration(days: 90)),
                        lastDate: DateTime.now(),
                      );
                      if (picked != null) {
                        setModalState(() => selectedDate = picked);
                      }
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_month_rounded, color: Color(0xFFE11D48), size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              "${selectedDate.day}/${selectedDate.month}/${selectedDate.year} (Started ${DateTime.now().difference(selectedDate).inDays}d ago)",
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: _ink),
                            ),
                          ),
                          const Text("Change", style: TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w700, fontSize: 12)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Cycle Length Slider
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Cycle Length", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: _ink)),
                      Text("$cycleDays days", style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: _plum)),
                    ],
                  ),
                  Slider(
                    value: cycleDays.toDouble(),
                    min: 21,
                    max: 45,
                    divisions: 24,
                    activeColor: _plum,
                    onChanged: (v) => setModalState(() => cycleDays = v.toInt()),
                  ),
                  const SizedBox(height: 8),

                  // Period Duration Slider
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Period Duration", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: _ink)),
                      Text("$periodDays days", style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Color(0xFFE11D48))),
                    ],
                  ),
                  Slider(
                    value: periodDays.toDouble(),
                    min: 2,
                    max: 10,
                    divisions: 8,
                    activeColor: const Color(0xFFE11D48),
                    onChanged: (v) => setModalState(() => periodDays = v.toInt()),
                  ),
                  const SizedBox(height: 14),

                  // Regularity Chips
                  const Text("Cycle Regularity", style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: _ink)),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 6,
                    children: ["regular", "mostly_regular", "irregular", "unsure"].map((reg) {
                      final isSel = regularity == reg;
                      return ChoiceChip(
                        label: Text(
                          reg == "regular" ? "Regular" : (reg == "mostly_regular" ? "Mostly Regular" : (reg == "irregular" ? "Irregular" : "Unsure")),
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: isSel ? Colors.white : const Color(0xFF334155)),
                        ),
                        selected: isSel,
                        selectedColor: _plum,
                        onSelected: (val) {
                          if (val) setModalState(() => regularity = reg);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  // Save Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        final updated = HerProfileModel(
                          patientId: profile.patientId,
                          yearOfBirth: profile.yearOfBirth,
                          menarcheAge: profile.menarcheAge,
                          isPregnantOrLactating: profile.isPregnantOrLactating,
                          hormonalContraception: profile.hormonalContraception,
                          dietPreference: profile.dietPreference,
                          knownConditions: profile.knownConditions,
                          mobilityRestrictions: profile.mobilityRestrictions,
                          allergies: profile.allergies,
                          lifestyleGoals: profile.lifestyleGoals,
                          lastPeriodStartDate: selectedDate.toIso8601String().split("T").first,
                          typicalCycleDays: cycleDays,
                          typicalPeriodDays: periodDays,
                          cycleRegularity: regularity,
                          primaryGoal: profile.primaryGoal,
                          pcodSymptoms: profile.pcodSymptoms,
                        );
                        await ref.read(herProvider.notifier).updateProfile(updated);
                        if (context.mounted) Navigator.pop(ctx);
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _plum,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text("Save & Recalculate Compass", style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _featureTile(BuildContext context, {required IconData icon, required String title, required String detail, required String route, required Color tint}) =>
      Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: () => context.push(route),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            child: Row(children: [
              Container(width: 46, height: 46, decoration: BoxDecoration(color: tint, borderRadius: BorderRadius.circular(15)), child: Icon(icon, color: _plum, size: 23)),
              const SizedBox(width: 13),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(title, style: const TextStyle(color: _ink, fontSize: 14, fontWeight: FontWeight.w700)),
                const SizedBox(height: 3),
                Text(detail, style: const TextStyle(color: Color(0xFF77717A), fontSize: 12)),
              ])),
              const Icon(Icons.arrow_forward_ios_rounded, size: 15, color: Color(0xFF9B8F9A)),
            ]),
          ),
        ),
      );

  Widget _screeningCard(HerScreeningFindingModel finding) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: const Color(0xFFFFF1E5), borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFF0D3B6))),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Icon(Icons.lightbulb_outline_rounded, color: Color(0xFF9B5F2C)),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(finding.title, style: const TextStyle(color: _ink, fontSize: 14, fontWeight: FontWeight.w700)),
            const SizedBox(height: 4),
            Text(finding.suggestedAction, style: const TextStyle(color: Color(0xFF6E5A4C), fontSize: 12, height: 1.4)),
          ])),
        ]),
      );
}

// --- ANIMATED CYCLE WHEEL WIDGET ---
class _AnimatedCycleWheel extends StatefulWidget {
  final int cycleDay;
  final int cycleLength;
  final int periodLength;
  final String phase;
  final String phaseTitle;
  final Color phaseColor;
  final String pregnancyChance;
  final int daysUntilNext;

  const _AnimatedCycleWheel({
    required this.cycleDay,
    required this.cycleLength,
    required this.periodLength,
    required this.phase,
    required this.phaseTitle,
    required this.phaseColor,
    required this.pregnancyChance,
    required this.daysUntilNext,
  });

  @override
  State<_AnimatedCycleWheel> createState() => _AnimatedCycleWheelState();
}

class _AnimatedCycleWheelState extends State<_AnimatedCycleWheel>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 950),
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic);
    _controller.forward();
  }

  @override
  void didUpdateWidget(covariant _AnimatedCycleWheel oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.cycleDay != widget.cycleDay || oldWidget.phase != widget.phase) {
      _controller.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return CustomPaint(
          painter: _CycleWheelPainter(
            cycleDay: widget.cycleDay,
            cycleLength: widget.cycleLength,
            periodLength: widget.periodLength,
            phase: widget.phase,
            animationProgress: _animation.value,
          ),
          child: child,
        );
      },
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "CYCLE DAY ${widget.cycleDay}",
                style: const TextStyle(
                  color: HerHubScreen._plum,
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                widget.phaseTitle,
                style: TextStyle(
                  color: widget.phaseColor,
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: widget.phaseColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  widget.pregnancyChance == "PEAK" || widget.pregnancyChance == "HIGH"
                      ? "High chance of pregnancy"
                      : (widget.pregnancyChance == "MEDIUM" ? "Medium chance" : "Low chance of pregnancy"),
                  style: TextStyle(
                    color: widget.phaseColor,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                widget.daysUntilNext == 0
                    ? "Period starts today"
                    : (widget.daysUntilNext < 0
                        ? "Period overdue by ${widget.daysUntilNext.abs()} ${widget.daysUntilNext.abs() == 1 ? 'day' : 'days'}"
                        : "Period in ${widget.daysUntilNext} ${widget.daysUntilNext == 1 ? 'day' : 'days'}"),
                style: const TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- CUSTOM PAINTER: CYCLIC WHEEL DIAL ---
class _CycleWheelPainter extends CustomPainter {
  final int cycleDay;
  final int cycleLength;
  final int periodLength;
  final String phase;
  final double animationProgress;

  _CycleWheelPainter({
    required this.cycleDay,
    required this.cycleLength,
    required this.periodLength,
    required this.phase,
    this.animationProgress = 1.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = math.min(size.width, size.height) / 2 - 14;
    const strokeWidth = 14.0;

    final bgPaint = Paint()
      ..color = const Color(0xFFF1EBF0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    canvas.drawCircle(center, radius, bgPaint);

    final totalDays = cycleLength > 0 ? cycleLength : 28;
    final periodDays = periodLength > 0 ? periodLength : 5;
    final ovDay = math.max(1, totalDays - 14);
    final fertileStart = math.max(1, ovDay - 5);
    final fertileEnd = math.min(totalDays, ovDay + 1);

    void drawSegment(int startDay, int endDay, Color color) {
      if (endDay <= startDay) return;
      final startAngle = -math.pi / 2 + (startDay / totalDays) * 2 * math.pi;
      final sweepAngle = ((endDay - startDay) / totalDays) * 2 * math.pi * animationProgress;

      final paint = Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = strokeWidth
        ..strokeCap = StrokeCap.round;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        false,
        paint,
      );
    }

    // 1. Menstrual: Days 0 to periodDays (Crimson)
    drawSegment(0, periodDays, const Color(0xFFE11D48));

    // 2. Follicular: Days periodDays to fertileStart (Rose Pink)
    drawSegment(periodDays, fertileStart, const Color(0xFFF472B6));

    // 3. Fertile Window & Ovulation (Mint Teal)
    drawSegment(fertileStart, fertileEnd, const Color(0xFF0D9488));

    // 4. Luteal Phase (Purple)
    drawSegment(fertileEnd, totalDays, const Color(0xFF8B5CF6));

    // Draw active cursor knob
    final normalizedDay = ((cycleDay - 1) % totalDays).clamp(0, totalDays - 1);
    final targetAngle = -math.pi / 2 + (normalizedDay / totalDays) * 2 * math.pi;
    final currentAngle = -math.pi / 2 + (targetAngle - (-math.pi / 2)) * animationProgress;
    final cursorX = center.dx + radius * math.cos(currentAngle);
    final cursorY = center.dy + radius * math.sin(currentAngle);

    final outerPulsePaint = Paint()
      ..color = const Color(0xFF744D70).withValues(alpha: 0.18)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(cursorX, cursorY), 13, outerPulsePaint);

    final glowPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(cursorX, cursorY), 9.5, glowPaint);

    final indicatorPaint = Paint()
      ..color = const Color(0xFF744D70)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(cursorX, cursorY), 6.0, indicatorPaint);
  }

  @override
  bool shouldRepaint(covariant _CycleWheelPainter oldDelegate) {
    return oldDelegate.cycleDay != cycleDay ||
        oldDelegate.cycleLength != cycleLength ||
        oldDelegate.periodLength != periodLength ||
        oldDelegate.phase != phase ||
        oldDelegate.animationProgress != animationProgress;
  }
}
