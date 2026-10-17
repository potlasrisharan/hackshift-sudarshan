import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../providers/her_provider.dart";

class HerDemoSelectorSheet extends ConsumerWidget {
  const HerDemoSelectorSheet({super.key});

  static const List<Map<String, String>> scenarios = [
    {
      "key": "SCENARIO_A_NORMAL",
      "title": "Scenario A: Regular Physiological Cycle",
      "subtitle": "27yo, predictable 28-day intervals, minimal dysmenorrhea, baseline wellness tracking.",
      "tag": "Normal Routine",
    },
    {
      "key": "SCENARIO_B_PCOS",
      "title": "Scenario B: Adult Oligomenorrhea & Hyperandrogenism",
      "subtitle": "25yo, 48-55 day cycle gaps, facial hair, cystic acne. Clinical review suggested.",
      "tag": "PCOS Pattern",
    },
    {
      "key": "SCENARIO_C_ADOLESCENT",
      "title": "Scenario C: Adolescent Normal Maturation",
      "subtitle": "16yo, 1.5 yr post-menarche, 42-day cycle. Adult criteria strictly suppressed.",
      "tag": "Adolescent Safe",
    },
    {
      "key": "SCENARIO_D_ENDO",
      "title": "Scenario D: Severe Dysmenorrhea & Functional Disruption",
      "subtitle": "29yo, pain 9/10, work absenteeism, cyclic bowel discomfort. Pelvic pain evaluation.",
      "tag": "Endometriosis Flag",
    },
    {
      "key": "SCENARIO_E_BLEEDING",
      "title": "Scenario E: Heavy Bleeding & Iron Risk",
      "subtitle": "34yo, flooding <2 hrs, 9-day menses, persistent fatigue. Ferritin workup flag.",
      "tag": "Menorrhagia",
    },
    {
      "key": "SCENARIO_F_ACUTE",
      "title": "Scenario F: Acute Red Flag Emergency",
      "subtitle": "28yo, possible pregnancy with acute severe pelvic pain (9/10) and fainting.",
      "tag": "Immediate E.R.",
    },
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeKey = ref.watch(herProvider).activeScenario;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: const Color(0xFFFDA4AF),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const Row(
            children: [
              Icon(Icons.science_outlined, color: Color(0xFFE11D48), size: 24),
              SizedBox(width: 10),
              Expanded(
                child: Text(
                  "Synthetic Clinical Demo Profiles",
                  style: TextStyle(
                    color: Color(0xFF9F1239),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            "Select a validated synthetic clinical profile to test deterministic algorithm responses instantly.",
            style: TextStyle(color: Color(0xFF475569), fontSize: 13),
          ),
          const SizedBox(height: 16),
          Flexible(
            child: ListView.separated(
              shrinkWrap: true,
              itemCount: scenarios.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (context, idx) {
                final s = scenarios[idx];
                final isSelected = s["key"] == activeKey;

                return InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () {
                    ref.read(herProvider.notifier).seedScenario(s["key"]!);
                    Navigator.pop(context);
                  },
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFFFF1F3) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF),
                        width: isSelected ? 1.5 : 1.0,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFFDA4AF).withValues(alpha: isSelected ? 0.2 : 0.08),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(
                          isSelected ? Icons.check_circle : Icons.radio_button_unchecked,
                          color: isSelected ? const Color(0xFFE11D48) : const Color(0xFFFDA4AF),
                          size: 20,
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      s["title"]!,
                                      style: TextStyle(
                                        color: isSelected
                                            ? const Color(0xFF9F1239)
                                            : const Color(0xFF0F172A),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                                    decoration: BoxDecoration(
                                      color: isSelected
                                          ? const Color(0xFFE11D48)
                                          : const Color(0xFFFFF1F3),
                                      borderRadius: BorderRadius.circular(6),
                                      border: isSelected
                                          ? null
                                          : Border.all(color: const Color(0xFFFDA4AF), width: 0.8),
                                    ),
                                    child: Text(
                                      s["tag"]!,
                                      style: TextStyle(
                                        color: isSelected ? Colors.white : const Color(0xFFE11D48),
                                        fontSize: 10,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                s["subtitle"]!,
                                style: const TextStyle(
                                  color: Color(0xFF475569),
                                  fontSize: 12,
                                  height: 1.3,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
