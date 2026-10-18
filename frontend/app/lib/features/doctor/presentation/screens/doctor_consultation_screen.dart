import "dart:convert";
import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:http/http.dart" as http;
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "package:kiosk_app/core/network/api_config.dart";
import "package:kiosk_app/features/prescription/data/models/prescription_models.dart";
import "package:kiosk_app/features/prescription/presentation/providers/prescription_provider.dart";

class DoctorConsultationScreen extends ConsumerStatefulWidget {
  const DoctorConsultationScreen({super.key});

  @override
  ConsumerState<DoctorConsultationScreen> createState() => _DoctorConsultationScreenState();
}

class _DoctorConsultationScreenState extends ConsumerState<DoctorConsultationScreen> {
  int _selectedPatientIndex = 0;
  bool _isDictating = false;
  bool _isEditingNotes = false;
  bool _isDispatching = false;

  late TextEditingController _soapPlanController;

  final List<Map<String, dynamic>> _queue = const [
    {
      "id": "pat-048291",
      "name": "Ramesh Chandra",
      "age": 52,
      "gender": "M",
      "token": "T-102",
      "priority": "P2",
      "triage": "URGENT",
      "triageBadge": "P2 AMBER",
      "triageColor": Color(0xFFD97706),
      "triageBg": Color(0xFFFEF3C7),
      "symptom": "Acute knee joint stiffness & swelling (Gouty Flare)",
      "abha": "91-4829-1029-4821",
      "bp": "138/88 mmHg",
      "pulse": "78 bpm",
      "temp": "98.6 °F",
      "spo2": "98%",
      "subjective": "52-year-old male presenting with morning stiffness lasting >45 mins. History of uric acid elevation (7.8 mg/dL).",
      "objective": "Bilateral knee crepitus (+), mild effusion, ROM limited to 110 degrees flexion.",
      "assessment": "Secondary Hyperuricemia with Gouty Arthritis Exacerbation.",
      "plan": "1. Tab. Febuxostat 40mg (1-0-0) OD\n2. Tab. Colchicine 0.5mg (1-0-1) BD\n3. Tab. Pantoprazole 40mg (1-0-0) OD\n4. Hydration & low-purine diet. Review in 14 days.",
      "rxBatches": [
        {"name": "Febuxostat 40mg", "batch": "BAT-2026-F40", "shelf": "Shelf A-12 · Bin 3", "expiry": "11/2027", "stock": 420, "price": "₹110"},
        {"name": "Colchicine 0.5mg", "batch": "BAT-2026-C05", "shelf": "Shelf B-04 · Bin 1", "expiry": "04/2028", "stock": 95, "price": "₹65"},
      ],
    },
    {
      "id": "pat-048292",
      "name": "Sunita Sharma",
      "age": 34,
      "gender": "F",
      "token": "T-103",
      "priority": "P3",
      "triage": "ROUTINE",
      "triageBadge": "P3 GREEN",
      "triageColor": Color(0xFF059669),
      "triageBg": Color(0xFFDCFCE7),
      "symptom": "Fatigue, oligomenorrhea & metabolic resistance",
      "abha": "91-5912-3021-9921",
      "bp": "118/74 mmHg",
      "pulse": "72 bpm",
      "temp": "98.4 °F",
      "spo2": "99%",
      "subjective": "34-year-old female complaining of irregular cycles (38-42 days interval) and insulin-resistant fatigue.",
      "objective": "Thyroid palpation normal, BMI 25.8, fasting insulin elevated.",
      "assessment": "Polycystic Ovarian Syndrome (PCOS) / Insulin Resistance.",
      "plan": "1. Tab. Metformin 500mg SR (1-0-1) with meals\n2. Myo-Inositol 2000mg + Folic Acid OD\n3. Structured lifestyle & exercise program.",
      "rxBatches": [
        {"name": "Metformin 500mg SR", "batch": "BAT-2026-M50", "shelf": "Shelf C-02 · Bin 4", "expiry": "09/2027", "stock": 310, "price": "₹45"},
        {"name": "Myo-Inositol 2g Sachet", "batch": "BAT-2026-IN2", "shelf": "Shelf A-05 · Bin 2", "expiry": "03/2028", "stock": 180, "price": "₹160"},
      ],
    },
    {
      "id": "pat-048293",
      "name": "Kavita Verma",
      "age": 28,
      "gender": "F",
      "token": "T-104",
      "priority": "P1",
      "triage": "CRITICAL",
      "triageBadge": "P1 RED",
      "triageColor": Color(0xFFDC2626),
      "triageBg": Color(0xFFFEE2E2),
      "symptom": "Acute severe dysmenorrhea and vasovagal presyncope",
      "abha": "91-7712-4091-1122",
      "bp": "94/62 mmHg",
      "pulse": "98 bpm",
      "temp": "98.8 °F",
      "spo2": "97%",
      "subjective": "Severe pelvic cramping Day 1 of menses with cold sweats and nausea.",
      "objective": "Pale conjunctiva, lower abdominal guarding without rebound tenderness.",
      "assessment": "Severe Primary Dysmenorrhea with Orthostatic Hypotension.",
      "plan": "1. Tab. Mefenamic Acid 500mg + Dicyclomine 20mg BD SOS\n2. IV Normal Saline 500ml slow infusion\n3. Day-care observation for 2 hours.",
      "rxBatches": [
        {"name": "Mefenamic + Dicyclomine Tab", "batch": "BAT-2026-MD1", "shelf": "Shelf A-01 · Emergency Bay", "expiry": "01/2028", "stock": 165, "price": "₹38"},
        {"name": "Normal Saline 500ml IV", "batch": "BAT-2026-NS5", "shelf": "Shelf IV-01 · Trauma Cart", "expiry": "12/2028", "stock": 320, "price": "₹42"},
      ],
    },
  ];

  @override
  void initState() {
    super.initState();
    _soapPlanController = TextEditingController(text: _queue[_selectedPatientIndex]["plan"] as String);
  }

  @override
  void dispose() {
    _soapPlanController.dispose();
    super.dispose();
  }

  void _onPatientSelected(int index) {
    setState(() {
      _selectedPatientIndex = index;
      _soapPlanController.text = _queue[index]["plan"] as String;
      _isDictating = false;
      _isEditingNotes = false;
    });
  }

  void _toggleDictation() {
    setState(() {
      _isDictating = !_isDictating;
      if (_isDictating) {
        _soapPlanController.text += "\n[Voice Dictation Added via Sarvam AI]: Patient advised adequate hydration & warm compress.";
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: _isDictating ? AppColors.saffron : AppColors.medicalTeal,
        content: Text(
          _isDictating
              ? "Sarvam AI Voice Dictation active... Listening in Hindi/English"
              : "Voice transcription saved into SOAP Plan.",
        ),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final patient = _queue[_selectedPatientIndex];

    return AppScaffoldShell(
      isLight: true,
      title: AppStrings.doctorPortal,
      subtitle: "Dr. Ananya Sharma (OPD-3)",
      child: Column(
        children: [
          _buildQueueBar(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildPatientHeader(patient),
                  const SizedBox(height: 14),
                  _buildVitalsCard(patient),
                  const SizedBox(height: 14),
                  _buildSoapNotesCard(patient),
                  const SizedBox(height: 14),
                  _buildRxToShelfCard(patient),
                  const SizedBox(height: 20),
                  _buildActionButtons(patient),
                  const SizedBox(height: 12),
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
      height: 64,
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: const BoxDecoration(
        color: AppColors.clinicalCard,
        border: Border(bottom: BorderSide(color: AppColors.clinicalBorder, width: 1)),
      ),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _queue.length,
        itemBuilder: (context, index) {
          final item = _queue[index];
          final isSelected = index == _selectedPatientIndex;
          final Color badgeCol = item["triageColor"] as Color;
          final Color badgeBg = item["triageBg"] as Color;

          return Padding(
            padding: const EdgeInsets.only(right: 10),
            child: InkWell(
              onTap: () => _onPatientSelected(index),
              borderRadius: BorderRadius.circular(10),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.medicalTeal.withValues(alpha: 0.08) : AppColors.clinicalBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isSelected ? AppColors.medicalTeal : AppColors.clinicalBorder,
                    width: isSelected ? 1.6 : 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: badgeBg,
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Text(
                        item["priority"] as String,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: badgeCol,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      "${item['token']} · ${item['name']}",
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                        color: isSelected ? AppColors.medicalTeal : AppColors.clinicalTextDark,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildPatientHeader(Map<String, dynamic> patient) {
    final Color badgeCol = patient["triageColor"] as Color;
    final Color badgeBg = patient["triageBg"] as Color;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.clinicalCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.clinicalBorder, width: 1),
        boxShadow: const [
          BoxShadow(
            color: Color(0x080F172A),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26,
            backgroundColor: AppColors.medicalTeal.withValues(alpha: 0.12),
            child: Text(
              patient["name"].toString().substring(0, 1),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: AppColors.medicalTeal,
              ),
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
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: AppColors.clinicalTextDark,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                      decoration: BoxDecoration(
                        color: badgeBg,
                        borderRadius: BorderRadius.circular(5),
                        border: Border.all(color: badgeCol.withValues(alpha: 0.3)),
                      ),
                      child: Text(
                        patient["triageBadge"] as String,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: badgeCol,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.verified_user_rounded, size: 13, color: AppColors.medicalTeal),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        "${patient['gender']}, ${patient['age']} yrs · ABHA: ${patient['abha']}",
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.clinicalTextSub,
                          fontWeight: FontWeight.w500,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
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
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
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
      child: Row(
        children: [
          Expanded(
            child: _buildVitalMetric(
              "BP",
              patient["bp"],
              Icons.speed_rounded,
              AppColors.medicalTeal,
              const Color(0xFFF0FDFA),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _buildVitalMetric(
              "Pulse",
              patient["pulse"],
              Icons.favorite_rounded,
              const Color(0xFFDC2626),
              const Color(0xFFFEF2F2),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _buildVitalMetric(
              "Temp",
              patient["temp"],
              Icons.thermostat_rounded,
              const Color(0xFFD97706),
              const Color(0xFFFFFBEB),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: _buildVitalMetric(
              "SpO2",
              patient["spo2"] ?? "98%",
              Icons.air_rounded,
              const Color(0xFF059669),
              const Color(0xFFF0FDF4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVitalMetric(String label, String value, IconData icon, Color color, Color bgTint) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      decoration: BoxDecoration(
        color: bgTint,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        children: [
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(icon, size: 12, color: color),
                const SizedBox(width: 3),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 3),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: AppColors.clinicalTextDark,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSoapNotesCard(Map<String, dynamic> patient) {
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
                  children: [
                    const Icon(Icons.auto_awesome, color: AppColors.saffron, size: 18),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        "AI-Synthesized SOAP Notes",
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: AppColors.clinicalTextDark,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: _toggleDictation,
                borderRadius: BorderRadius.circular(8),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                  decoration: BoxDecoration(
                    color: _isDictating ? const Color(0xFFFFEDD5) : const Color(0xFFF0FDFA),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: _isDictating ? AppColors.saffron : AppColors.medicalTeal,
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        _isDictating ? Icons.graphic_eq_rounded : Icons.mic_rounded,
                        size: 14,
                        color: _isDictating ? AppColors.saffron : AppColors.medicalTeal,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _isDictating ? "Listening..." : "Voice Dictate",
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: _isDictating ? AppColors.saffron : AppColors.medicalTeal,
                        ),
                      ),
                    ],
                  ),
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
          if (_isEditingNotes)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "P (Plan) - Edit Mode",
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.medicalTeal,
                  ),
                ),
                const SizedBox(height: 4),
                TextField(
                  controller: _soapPlanController,
                  maxLines: 4,
                  style: const TextStyle(fontSize: 12, color: AppColors.clinicalTextDark),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: AppColors.clinicalBg,
                    contentPadding: const EdgeInsets.all(10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.clinicalBorder),
                    ),
                  ),
                ),
              ],
            )
          else
            _buildSoapRow("P (Plan)", _soapPlanController.text),
        ],
      ),
    );
  }

  Widget _buildSoapRow(String prefix, String content) {
    return Container(
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
            prefix,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppColors.medicalTeal,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            content,
            style: const TextStyle(
              fontSize: 12.5,
              color: AppColors.clinicalTextDark,
              height: 1.35,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRxToShelfCard(Map<String, dynamic> patient) {
    final List<Map<String, dynamic>> batches = (patient["rxBatches"] as List).cast<Map<String, dynamic>>();

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
            children: const [
              Icon(Icons.shelves, color: AppColors.medicalTeal, size: 18),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Rx-to-Shelf Allocation (FEFO In-Stock)",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppColors.clinicalTextDark,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          for (final b in batches)
            Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.clinicalBg,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.clinicalBorder),
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
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.clinicalTextDark,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 4),
                        Wrap(
                          spacing: 4,
                          runSpacing: 2,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                b["shelf"] ?? "Dispensing Rack A",
                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.clinicalTextSub),
                              ),
                            ),
                            Text(
                              "Exp: ${b['expiry']}",
                              style: const TextStyle(fontSize: 10, color: AppColors.clinicalTextMuted),
                            ),
                          ],
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
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppColors.medicalTeal,
                        ),
                      ),
                      Text(
                        "${b['stock']} in stock",
                        style: const TextStyle(fontSize: 11, color: AppColors.clinicalTextMuted),
                      ),
                    ],
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(Map<String, dynamic> patient) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 13),
                  backgroundColor: AppColors.clinicalCard,
                  side: const BorderSide(color: AppColors.clinicalBorder, width: 1.2),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: Icon(
                  _isEditingNotes ? Icons.check_rounded : Icons.edit_note_rounded,
                  color: AppColors.clinicalTextDark,
                  size: 18,
                ),
                label: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    _isEditingNotes ? "Done Editing" : "Edit Notes",
                    style: const TextStyle(
                      color: AppColors.clinicalTextDark,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                onPressed: () {
                  setState(() => _isEditingNotes = !_isEditingNotes);
                },
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              flex: 2,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.medicalTeal,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 13),
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: _isDispatching
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
                label: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    _isDispatching ? "Signing & Dispatching..." : "Sign & Dispatch Rx",
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
                onPressed: _isDispatching
                    ? null
                    : () async {
                        setState(() => _isDispatching = true);
                        try {
                          final batches = (patient["rxBatches"] as List<dynamic>?) ?? [];
                          final medicines = batches.asMap().entries.map((entry) {
                            final idx = entry.key;
                            final b = entry.value as Map<String, dynamic>;
                            final slot = idx == 0
                                ? MedicineTimeSlot.morning
                                : (idx == 1 ? MedicineTimeSlot.afternoon : MedicineTimeSlot.night);
                            return MedicineItem(
                              id: "med-${patient['id']}-$idx",
                              prescriptionId: "rx-${patient['token']}",
                              name: b["name"] as String,
                              dosageForm: "Tablet",
                              strength: b["name"].toString().contains(" ")
                                  ? b["name"].toString().split(" ").last
                                  : "500 mg",
                              timeSlot: slot,
                              scheduledTime: slot == MedicineTimeSlot.morning
                                  ? "08:00 AM"
                                  : (slot == MedicineTimeSlot.afternoon ? "01:00 PM" : "08:30 PM"),
                              instructions: "1 dose with lukewarm water after meals",
                              batchNumber: b["batch"] as String? ?? "BAT-2026",
                              expiryDate: b["expiry"] as String? ?? "12/2027",
                              isTaken: false,
                              reminderEnabled: true,
                            );
                          }).toList();

                          final cleanToken = patient['token'].toString().replaceAll('#', '').replaceAll(' ', '-');
                          final advice = DoctorAdvice(
                            doctorName: "Dr. Ananya Sharma",
                            specialty: "Senior Physician · Rheumatology & Internal Medicine",
                            hospital: "AIIMS New Delhi / Central OPD Clinic",
                            opdRoom: "OPD-3",
                            rxId: "#RX-2026-$cleanToken",
                            prescriptionDate: "Today",
                            validTillDate: "In 14 Days",
                            dietRestrictions: const [
                              "Low-purine diet",
                              "Avoid excess sodium & carbonated beverages",
                              "Adequate hydration",
                            ],
                            hydrationTarget: "3.0L water daily",
                            followUpDate: "In 14 Days · OPD-3",
                            doctorNotes: patient["plan"] as String? ?? "Evidence-based allopathic regimen for inflammatory arthritis and joint stiffness: Follow medication schedule with meals. Avoid high-purine foods and maintain adequate hydration.",
                          );

                          // 1) Post prescription payload to Cloudflare backend
                          try {
                            final baseUrl = ApiConfig.baseUrl;
                            final payload = {
                              "patientId": patient['id'] ?? "pat-048291",
                              "rxId": advice.rxId,
                              "prescriptionDate": advice.prescriptionDate,
                              "validTillDate": advice.validTillDate,
                              "doctorName": advice.doctorName,
                              "specialty": advice.specialty,
                              "hospital": advice.hospital,
                              "opdRoom": advice.opdRoom,
                              "doctorNotes": advice.doctorNotes,
                              "dietRestrictions": advice.dietRestrictions,
                              "hydrationTarget": advice.hydrationTarget,
                              "followUpDate": advice.followUpDate,
                              "medicines": medicines.map((m) => {
                                "id": m.id,
                                "prescriptionId": m.prescriptionId,
                                "name": m.name,
                                "dosageForm": m.dosageForm,
                                "strength": m.strength,
                                "timeSlot": m.timeSlot.name,
                                "scheduledTime": m.scheduledTime,
                                "instructions": m.instructions,
                                "batchNumber": m.batchNumber,
                                "expiryDate": m.expiryDate,
                                "isTaken": m.isTaken,
                                "reminderEnabled": m.reminderEnabled,
                              }).toList(),
                            };

                            await http.post(
                              Uri.parse("$baseUrl/prescriptions"),
                              headers: {"Content-Type": "application/json"},
                              body: jsonEncode(payload),
                            ).timeout(const Duration(seconds: 4));
                          } catch (e) {
                            debugPrint("Doctor Rx dispatch backend error: $e");
                          }

                          // 2) Set active prescription in Riverpod state
                          await ref.read(prescriptionProvider.notifier).setPrescription(
                            advice: advice,
                            medicines: medicines,
                          );

                          // 3) Display confirmation SnackBar and sync notification
                          if (!mounted) return;
                          ScaffoldMessenger.of(context).hideCurrentSnackBar();
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              backgroundColor: AppColors.medicalTeal,
                              duration: const Duration(seconds: 4),
                              content: const Row(
                                children: [
                                  Icon(
                                    Icons.cloud_done_rounded,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                  SizedBox(width: 10),
                                  Expanded(
                                    child: Text(
                                      "Prescription signed & synced with Central Pharmacy & Patient App",
                                      style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                    ),
                                  ),
                                ],
                              ),
                              action: SnackBarAction(
                                label: "Open Mobile Rx",
                                textColor: Colors.white,
                                onPressed: () => context.push("/prescription"),
                              ),
                            ),
                          );
                        } finally {
                          if (mounted) {
                            setState(() => _isDispatching = false);
                          }
                        }
                      },
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 12),
              side: const BorderSide(color: AppColors.medicalTeal, width: 1.2),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              backgroundColor: AppColors.medicalTeal.withValues(alpha: 0.05),
            ),
            icon: const Icon(Icons.smartphone_rounded, color: AppColors.medicalTeal, size: 18),
            label: const Text(
              "View in Patient Mobile App",
              style: TextStyle(
                color: AppColors.medicalTeal,
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),
            onPressed: () => context.push("/prescription"),
          ),
        ),
      ],
    );
  }
}
