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
      "symptom": "Acute knee joint stiffness & swelling (Gouty Flare)",
      "abha": "91-4829-1029-4821",
      "bp": "138/88 mmHg",
      "pulse": "78 bpm",
      "temp": "98.6 °F",
      "subjective": "52-year-old male presenting with morning stiffness lasting >45 mins. History of uric acid elevation (7.8 mg/dL).",
      "objective": "Bilateral knee crepitus (+), mild effusion, ROM limited to 110 degrees flexion.",
      "assessment": "Secondary Hyperuricemia with Gouty Arthritis Exacerbation.",
      "plan": "1. Tab. Febuxostat 40mg (1-0-0) OD\n2. Tab. Colchicine 0.5mg (1-0-1) BD\n3. Tab. Pantoprazole 40mg (1-0-0) OD\n4. Hydration & low-purine diet. Review in 14 days.",
      "rxBatches": [
        {"name": "Febuxostat 40mg", "batch": "BAT-2026-F40", "expiry": "11/2027", "stock": 420, "price": "₹110"},
        {"name": "Colchicine 0.5mg", "batch": "BAT-2026-C05", "expiry": "04/2028", "stock": 95, "price": "₹65"},
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
      "symptom": "Fatigue, oligomenorrhea & metabolic resistance",
      "abha": "91-5912-3021-9921",
      "bp": "118/74 mmHg",
      "pulse": "72 bpm",
      "temp": "98.4 °F",
      "subjective": "34-year-old female complaining of irregular cycles (38-42 days interval) and insulin-resistant fatigue.",
      "objective": "Thyroid palpation normal, BMI 25.8, fasting insulin elevated.",
      "assessment": "Polycystic Ovarian Syndrome (PCOS) / Insulin Resistance.",
      "plan": "1. Tab. Metformin 500mg SR (1-0-1) with meals\n2. Myo-Inositol 2000mg + Folic Acid OD\n3. Structured lifestyle & exercise program.",
      "rxBatches": [
        {"name": "Metformin 500mg SR", "batch": "BAT-2026-M50", "expiry": "09/2027", "stock": 310, "price": "₹45"},
        {"name": "Myo-Inositol 2g Sachet", "batch": "BAT-2026-IN2", "expiry": "03/2028", "stock": 180, "price": "₹160"},
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
      "symptom": "Acute severe dysmenorrhea and vasovagal presyncope",
      "abha": "91-7712-4091-1122",
      "bp": "94/62 mmHg",
      "pulse": "98 bpm",
      "temp": "98.8 °F",
      "subjective": "Severe pelvic cramping Day 1 of menses with cold sweats and nausea.",
      "objective": "Pale conjunctiva, lower abdominal guarding without rebound tenderness.",
      "assessment": "Severe Primary Dysmenorrhea with Orthostatic Hypotension.",
      "plan": "1. Tab. Mefenamic Acid 500mg + Dicyclomine 20mg BD SOS\n2. IV Normal Saline 500ml slow infusion\n3. Day-care observation for 2 hours.",
      "rxBatches": [
        {"name": "Mefenamic + Dicyclomine Tab", "batch": "BAT-2026-MD1", "expiry": "01/2028", "stock": 165, "price": "₹38"},
        {"name": "Normal Saline 500ml IV", "batch": "BAT-2026-NS5", "expiry": "12/2028", "stock": 320, "price": "₹42"},
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
                    const SizedBox(width: 8),
                    const AyuSetuLogoBadge(height: 18),
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
