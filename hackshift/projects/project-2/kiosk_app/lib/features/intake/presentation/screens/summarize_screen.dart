import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";


class SummarizeScreen extends ConsumerWidget {
  const SummarizeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 4: Structured SOAP Note & NRCeS FHIR R4 Bundle"),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go("/scan"),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(28.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Synthesized Clinical Intake Summary", style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(8)),
                  child: const Text("NRCeS FHIR R4 bdl-11 Invariant Compliant", style: TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView(
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(18.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text("S - Subjective (History & Present Complaints):", style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryLight)),
                          SizedBox(height: 6),
                          Text("52-year-old male presents with bilateral knee pain for 6 months, aggravated by walking and cold weather. Morning stiffness lasting ~20 mins. History of Hypertension for 3 years on Telmisartan 40mg. No known drug allergies.", style: TextStyle(color: Colors.white70, fontSize: 13.5)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(18.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text("O - Objective (Vitals & Document OCR Results):", style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.warning)),
                          SizedBox(height: 6),
                          Text("Vitals: BP 130/84 mmHg, Pulse 76 bpm. Musculoskeletal: Bilateral knee joint crepitus present. Lab Findings: Serum Uric Acid: 7.8 mg/dL [HIGH], HbA1c: 6.1%.", style: TextStyle(color: Colors.white70, fontSize: 13.5)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(18.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text("A - Assessment & Ayurvedic Dashavidha Pariksha:", style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.ayushGreen)),
                          SizedBox(height: 6),
                          Text("1. Osteoarthritis Bilateral Knees (Sandhigata Vata) with mild hyperuricemia. 2. Essential Hypertension (Controlled). Dashavidha: Prakriti: Vata-Kapha, Agni: Manda Agni, Koshtha: Madhyama.", style: TextStyle(color: Colors.white70, fontSize: 13.5)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: const [
                    Icon(Icons.check_circle_outline, color: AppColors.success, size: 20),
                    SizedBox(width: 8),
                    Text("Ready to push to Hospital Queue & Doctor Dashboard", style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  ],
                ),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                  onPressed: () => context.go("/queue"),
                  icon: const Icon(Icons.send),
                  label: const Text("Confirm & Print Token ➔"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
