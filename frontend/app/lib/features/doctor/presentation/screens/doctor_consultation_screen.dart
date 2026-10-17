import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class DoctorConsultationScreen extends StatefulWidget {
  const DoctorConsultationScreen({super.key});

  @override
  State<DoctorConsultationScreen> createState() => _DoctorConsultationScreenState();
}

class _DoctorConsultationScreenState extends State<DoctorConsultationScreen> {
  int _selectedPatientIndex = 0;

  final List<Map<String, dynamic>> _queue = const [
    {
      "id": "pat-048291",
      "name": "Ramesh Chandra",
      "age": 52,
      "gender": "M",
      "token": "T-102",
      "triage": "URGENT",
      "triageColor": AppColors.warning,
      "symptom": "Acute knee joint stiffness & bilateral swelling (Amavata)",
      "abha": "91-4829-1029-4821",
      "bp": "138/88 mmHg",
      "pulse": "78 bpm",
      "temp": "98.6 °F",
      "subjective": "52-year-old male presenting with morning stiffness lasting >45 mins. History of uric acid elevation (7.8 mg/dL).",
      "objective": "Bilateral knee crepitus (+), mild effusion, ROM limited to 110 degrees flexion.",
      "assessment": "Sandhigata Vata with Secondary Hyperuricemia (Gouty exacerbation).",
      "plan": "1. Yograj Guggulu 500mg (1-0-1)\n2. Dashamularishta 20ml with warm water\n3. Reduce high purine dal intake\n4. Refill scheduled in 14 days.",
      "rxBatches": [
        {"name": "Yograj Guggulu 500mg", "batch": "BAT-2026-Y89", "expiry": "11/2027", "stock": 420, "price": "₹180"},
        {"name": "Dashamularishta 450ml", "batch": "BAT-2026-D12", "expiry": "04/2028", "stock": 95, "price": "₹220"},
      ],
    },
    {
      "id": "pat-048292",
      "name": "Sunita Sharma",
      "age": 34,
      "gender": "F",
      "token": "T-103",
      "triage": "ROUTINE",
      "triageColor": AppColors.success,
      "symptom": "Fatigue, irregular cycle & sleep disturbance",
      "abha": "91-5912-3021-9921",
      "bp": "118/74 mmHg",
      "pulse": "72 bpm",
      "temp": "98.4 °F",
      "subjective": "34-year-old female complaining of irregular cycles (38-42 days interval) and afternoon energy crashes.",
      "objective": "Thyroid palpation normal, BMI 23.4, no acanthosis nigricans.",
      "assessment": "Artava Kshaya / Subclinical hormonal dysregulation.",
      "plan": "1. Shatavari Churna 3g with milk\n2. Ashwagandha 500mg hs\n3. Daily morning Suryanamaskar 6 cycles.",
      "rxBatches": [
        {"name": "Shatavari Churna 100g", "batch": "BAT-2026-S44", "expiry": "09/2027", "stock": 310, "price": "₹140"},
      ],
    },
    {
      "id": "pat-048293",
      "name": "Kavita Verma",
      "age": 28,
      "gender": "F",
      "token": "T-104",
      "triage": "CRITICAL",
      "triageColor": AppColors.error,
      "symptom": "Acute dysmenorrhea and vasovagal presyncope",
      "abha": "91-7712-4091-1122",
      "bp": "94/62 mmHg",
      "pulse": "98 bpm",
      "temp": "98.8 °F",
      "subjective": "Severe pelvic cramping Day 1 of menses with cold sweats and nausea.",
      "objective": "Pale conjunctiva, lower abdominal guarding without rebound tenderness.",
      "assessment": "Kashtartava with secondary orthostatic hypotension.",
      "plan": "1. Oral hydration + Sukumaram Kashayam 15ml\n2. Local warm compress\n3. Monitor in day-care observation 2 hours.",
      "rxBatches": [
        {"name": "Sukumaram Kashayam 200ml", "batch": "BAT-2026-SK1", "expiry": "01/2028", "stock": 65, "price": "₹160"},
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    final patient = _queue[_selectedPatientIndex];

    return AppScaffoldShell(
      title: AppStrings.doctorPortal,
      subtitle: "Dr. Ananya Sharma (OPD-3)",
      child: Column(
        children: [
          _buildQueueBar(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPatientHeader(patient),
                  const SizedBox(height: 16),
                  _buildVitalsCard(patient),
                  const SizedBox(height: 16),
                  _buildSoapNotesCard(patient),
                  const SizedBox(height: 16),
                  _buildRxToShelfCard(patient),
                  const SizedBox(height: 24),
                  _buildActionButtons(patient),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQueueBar() {
    return Container(
      height: 72,
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.surfaceElevated)),
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _queue.length,
        itemBuilder: (context, index) {
          final item = _queue[index];
          final isSelected = index == _selectedPatientIndex;
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ChoiceChip(
              selected: isSelected,
              onSelected: (_) => setState(() => _selectedPatientIndex = index),
              selectedColor: AppColors.primary,
              backgroundColor: AppColors.surfaceElevated,
              label: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: item["triageColor"] as Color,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    "${item['token']} · ${item['name']}",
                    style: TextStyle(
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildPatientHeader(Map<String, dynamic> patient) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: AppColors.primary.withValues(alpha: 0.2),
            child: Text(
              patient["name"].toString().substring(0, 1),
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.primaryLight),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        patient["name"],
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: (patient["triageColor"] as Color).withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        patient["triage"],
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: patient["triageColor"] as Color,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  "${patient['gender']}, ${patient['age']} yrs · ABHA: ${patient['abha']}",
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVitalsCard(Map<String, dynamic> patient) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Row(
        children: [
          Expanded(child: _buildVitalMetric("BP", patient["bp"], Icons.speed_rounded, AppColors.primaryLight)),
          Expanded(child: _buildVitalMetric("Pulse", patient["pulse"], Icons.favorite_rounded, AppColors.error)),
          Expanded(child: _buildVitalMetric("Temp", patient["temp"], Icons.thermostat_rounded, AppColors.warning)),
        ],
      ),
    );
  }

  Widget _buildVitalMetric(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 4),
            Text(label, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
          ],
        ),
        const SizedBox(height: 4),
        FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(
            value,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
        ),
      ],
    );
  }

  Widget _buildSoapNotesCard(Map<String, dynamic> patient) {
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
          Row(
            children: const [
              Icon(Icons.auto_awesome, color: AppColors.secondary, size: 20),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "AI-Synthesized SOAP Notes",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildSoapRow("S (Subjective)", patient["subjective"]),
          const SizedBox(height: 8),
          _buildSoapRow("O (Objective)", patient["objective"]),
          const SizedBox(height: 8),
          _buildSoapRow("A (Assessment)", patient["assessment"]),
          const SizedBox(height: 8),
          _buildSoapRow("P (Plan)", patient["plan"]),
        ],
      ),
    );
  }

  Widget _buildSoapRow(String prefix, String content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          prefix,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primaryLight),
        ),
        const SizedBox(height: 2),
        Text(
          content,
          style: const TextStyle(fontSize: 13, color: AppColors.textPrimary, height: 1.3),
        ),
      ],
    );
  }

  Widget _buildRxToShelfCard(Map<String, dynamic> patient) {
    final List<Map<String, dynamic>> batches = (patient["rxBatches"] as List).cast<Map<String, dynamic>>();

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
          Row(
            children: const [
              Icon(Icons.shelves, color: AppColors.ayushGreen, size: 20),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Rx-to-Shelf Allocation (FEFO In-Stock)",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          for (final b in batches)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.surfaceElevated),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            b["name"],
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            "Batch: ${b['batch']} · Exp: ${b['expiry']}",
                            style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          b["price"],
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.ayushGreen),
                        ),
                        Text(
                          "${b['stock']} available",
                          style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(Map<String, dynamic> patient) {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
              side: const BorderSide(color: AppColors.surfaceElevated),
            ),
            icon: const Icon(Icons.edit_note, color: AppColors.textSecondary),
            label: const FittedBox(
              fit: BoxFit.scaleDown,
              child: Text("Edit Notes", style: TextStyle(color: AppColors.textPrimary)),
            ),
            onPressed: () {},
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          flex: 2,
          child: ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            icon: const Icon(Icons.check_circle_outline, color: Colors.white),
            label: const FittedBox(
              fit: BoxFit.scaleDown,
              child: Text("Approve & Dispatch Rx", style: TextStyle(fontWeight: FontWeight.w700)),
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: AppColors.success,
                  content: Text("Encounter finalized for ${patient['name']}. Rx pushed to pharmacy shelf."),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
