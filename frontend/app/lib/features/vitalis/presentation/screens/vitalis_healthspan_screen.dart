import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisHealthspanScreen extends ConsumerWidget {
  const VitalisHealthspanScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);
    final hpi = state.hpiResult;
    final hasScore = hpi.hpiScore != null;

    return AppScaffoldShell(
      title: "Healthspan Progress",
      subtitle: "A view of your health habits over time",
      child: RefreshIndicator(
        color: const Color(0xFF059669),
        onRefresh: ref.read(vitalisProvider.notifier).refreshFromBackend,
        child: Container(
        color: const Color(0xFFF8FAFC),
        width: double.infinity,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
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
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                "HEALTHSPAN HABITS INDEX",
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  letterSpacing: 0.5,
                                  color: Color(0xFF64748B),
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                hasScore ? "${hpi.hpiScore} / 100" : "Building baseline",
                                style: const TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF0F172A),
                                  letterSpacing: -0.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        TextButton.icon(
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              backgroundColor: Colors.transparent,
                              isScrollControlled: true,
                              builder: (_) => const VitalisExplainabilitySheet(
                                title: "Healthspan Progress Index (HPI)",
                                algorithmId: "V1-HPI-2026.1",
                                methodology: "HPI = Σ(w_i × s_i) / Σ(w_i) across recent observed healthspan domains. Missing domains are excluded, never estimated. Self-reported check-in domains are labeled unverified. At least 40% of domain weight must be observed before a score is shown.",
                                inputsUsed: ["Recent verified observations and explicitly labeled self-reported activity, strength and sleep check-ins", "Domain weights defined in the deterministic engine", "Wearable and lab measurements are not yet mapped to HPI domains"],
                                limitations: [
                                  "Behavioral progress tracking only.",
                                  "Does NOT predict years of life gained or biological age.",
                                  "Missing domains are omitted, never hallucinated.",
                                ],
                                evidenceCitations: [
                                  "AHA Life's Essential 8 (Circulation 2022)",
                                  "WHO Guidelines on Physical Activity (2020)",
                                  "ICMR Dietary Guidelines for Indians (2024)",
                                ],
                              ),
                            );
                          },
                          icon: const Icon(Icons.info_outline, size: 16),
                          label: const Text("Formula"),
                          style: TextButton.styleFrom(
                            foregroundColor: const Color(0xFF059669),
                            backgroundColor: const Color(0xFFE6F7F2),
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            visualDensity: VisualDensity.compact,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Expanded(
                          child: Text(
                            "Data Coverage & Completeness",
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE6F7F2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            "${(hpi.coverage * 100).toInt()}%",
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF059669)),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: LinearProgressIndicator(
                        value: hpi.coverage,
                        minHeight: 8,
                        backgroundColor: const Color(0xFFE2E8F0),
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF059669)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => showDialog<void>(context: context, builder: (_) => const _HealthspanCheckInDialog()),
                  icon: const Icon(Icons.edit_note_rounded),
                  label: const Text("Log this week’s habits"),
                  style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFF087F5B), side: const BorderSide(color: Color(0xFFB7DCCB)), padding: const EdgeInsets.symmetric(vertical: 12)),
                ),
              ),
                    if (!hasScore) ...[
                      const SizedBox(height: 18),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF8F4),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFFCFE9DD)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(children: [
                              Icon(Icons.insights_rounded, color: Color(0xFF087F5B)),
                              SizedBox(width: 8),
                              Expanded(child: Text("Your baseline needs more observations", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF145943)))),
                            ]),
                            const SizedBox(height: 7),
                            const Text("Your check-ins are self-reported and marked unverified. They can inform the activity, strength and sleep habit domains; they are not clinical measurements.", style: TextStyle(fontSize: 12, height: 1.4, color: Color(0xFF426657))),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: 24),
              const Text(
                "Domain Breakdown & Component Weights",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
              ),
              const SizedBox(height: 12),
              for (final d in hpi.domains)
                Container(
                  margin: const EdgeInsets.only(bottom: 12),
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
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              d.title,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: d.observed
                                  ? const Color(0xFFE6F7F2)
                                  : const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: d.observed
                                    ? const Color(0xFFA7F3D0)
                                    : const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: Text(
                              d.observed ? "${d.score}/100" : "Unobserved",
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: d.observed ? const Color(0xFF059669) : const Color(0xFF64748B),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        d.rationale,
                        style: const TextStyle(fontSize: 12, color: Color(0xFF475569), height: 1.35),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Text(
                          "Algorithm Component Weight: ${d.weight}x",
                          style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        ),
      ),
    );
  }
}

class _HealthspanCheckInDialog extends ConsumerStatefulWidget {
  const _HealthspanCheckInDialog();

  @override
  ConsumerState<_HealthspanCheckInDialog> createState() => _HealthspanCheckInDialogState();
}

class _HealthspanCheckInDialogState extends ConsumerState<_HealthspanCheckInDialog> {
  final _formKey = GlobalKey<FormState>();
  final _activity = TextEditingController();
  final _strength = TextEditingController();
  final _sleep = TextEditingController();
  final _adherence = TextEditingController();
  final _fatigue = TextEditingController();
  bool _symptoms = false;
  bool _saving = false;

  @override
  void dispose() {
    _activity.dispose();
    _strength.dispose();
    _sleep.dispose();
    _adherence.dispose();
    _fatigue.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AlertDialog(
        title: const Text("Your weekly check-in"),
        content: SizedBox(
          width: 420,
          child: Form(
            key: _formKey,
            child: SingleChildScrollView(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Text("These answers are saved as self-reported, unverified behavior data. They do not replace clinical measurements.", style: TextStyle(fontSize: 12, height: 1.35)),
                const SizedBox(height: 14),
                _numberField(_activity, "Activity minutes this week", "Minutes", 0, 1680),
                _numberField(_strength, "Strength sessions this week", "0–7", 0, 7),
                _numberField(_sleep, "Average sleep each night", "Hours, e.g. 7.5", 0, 24, allowDecimal: true),
                _numberField(_adherence, "Activity plan adherence", "Percent, 0–100", 0, 100),
                _numberField(_fatigue, "Recent fatigue", "Scale 0–10", 0, 10),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  value: _symptoms,
                  onChanged: _saving ? null : (value) => setState(() => _symptoms = value ?? false),
                  title: const Text("Symptoms during exercise", style: TextStyle(fontSize: 13)),
                  subtitle: const Text("For example, chest discomfort, dizziness or unusual breathlessness", style: TextStyle(fontSize: 11)),
                  controlAffinity: ListTileControlAffinity.leading,
                  activeColor: const Color(0xFF087F5B),
                ),
              ]),
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: _saving ? null : () => Navigator.pop(context), child: const Text("Cancel")),
          FilledButton(onPressed: _saving ? null : _save, child: _saving ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)) : const Text("Save check-in")),
        ],
      );

  Widget _numberField(TextEditingController controller, String label, String hint, double minimum, double maximum, {bool allowDecimal = false}) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: TextFormField(
          controller: controller,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          decoration: InputDecoration(labelText: label, hintText: hint, border: const OutlineInputBorder(), isDense: true),
          validator: (text) {
            final value = double.tryParse(text ?? "");
            if (value == null || value < minimum || value > maximum || (!allowDecimal && value != value.roundToDouble())) {
              return "Enter a value from ${minimum.round()} to ${maximum.round()}.";
            }
            return null;
          },
        ),
      );

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    final saved = await ref.read(vitalisProvider.notifier).recordHealthspanCheckIn(
          weeklyActivityMinutes: double.parse(_activity.text),
          weeklyStrengthSessions: int.parse(_strength.text),
          averageSleepHours: double.parse(_sleep.text),
          activityAdherencePercent: double.parse(_adherence.text),
          fatigueRating: int.parse(_fatigue.text),
          symptomsDuringExercise: _symptoms,
        );
    if (!mounted) return;
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(saved ? "Check-in saved. The safe activity plan and healthspan index have refreshed." : "Check-in could not be saved. Check your connection and try again.")),
    );
  }
}
