import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisPreventiveScreen extends ConsumerWidget {
  const VitalisPreventiveScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(vitalisProvider);

    final screenings = [
      {
        "title": "Metabolic & Diabetes Screening (HbA1c / FBG)",
        "guideline": "ADA Standards of Care / ICMR Guidelines",
        "interval": "Annually (Age ≥35 or BMI ≥23 for South Asians)",
        "status": "Due Soon",
        "statusColor": AppColors.warning,
        "lastCompleted": "10 months ago",
        "action": "Schedule Lab",
      },
      {
        "title": "Comprehensive Lipid Profile (ASCVD Risk)",
        "guideline": "AHA/ACC Secondary Prevention Standards",
        "interval": "Every 1-3 years based on baseline LDL",
        "status": "Up to Date",
        "statusColor": AppColors.ayushGreen,
        "lastCompleted": "2 months ago (LDL 94 mg/dL)",
        "action": "View Lab",
      },
      {
        "title": "Resting Blood Pressure & Ambulatory Monitor",
        "guideline": "ISH / AHA Hypertension Guidelines",
        "interval": "Every 6 months",
        "status": "Up to Date",
        "statusColor": AppColors.ayushGreen,
        "lastCompleted": "1 week ago (118/76 mmHg)",
        "action": "Log BP",
      },
      {
        "title": "Colorectal Screening (FIT / Colonoscopy)",
        "guideline": "USPSTF Recommendation Statement",
        "interval": "Every 1-10 years starting at age 45",
        "status": state.activePersona.age >= 45 ? "Screening Due" : "Age Ineligible (<45)",
        "statusColor": state.activePersona.age >= 45 ? AppColors.error : AppColors.textMuted,
        "lastCompleted": "Never logged",
        "action": "Consult Physician",
      },
      {
        "title": "Comprehensive Dilated Eye & Fundus Exam",
        "guideline": "All India Ophthalmological Society",
        "interval": "Every 2 years (Annual if diabetic)",
        "status": "Overdue",
        "statusColor": AppColors.error,
        "lastCompleted": "26 months ago",
        "action": "Book Eye Clinic",
      },
      {
        "title": "Adult Immunization (Influenza, Zoster, Tdap)",
        "guideline": "WHO / Indian National Immunization Board",
        "interval": "Flu: Annual; Shingles (Zoster): Age ≥50",
        "status": state.activePersona.age >= 50 ? "Zoster Due (≥50)" : "Flu Vaccine Due",
        "statusColor": AppColors.warning,
        "lastCompleted": "14 months ago",
        "action": "View Vaccine Tracker",
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Preventive Care & Screening Timeline"),
        backgroundColor: AppColors.surface,
        actions: [
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: AyuSetuLogoBadge(height: 20),
          ),
          IconButton(
            icon: const Icon(Icons.info_outline, color: AppColors.vitalisTeal),
            onPressed: () {
              VitalisExplainabilitySheet.show(
                context,
                title: "Preventive Care Eligibility Algorithm",
                description:
                    "Eligible screenings are determined by demographic data (age, sex, South Asian cardiometabolic thresholds) and longitudinal clinical history using USPSTF Grade A/B and ICMR guidelines.",
                algorithmName: "V13 Preventive Eligibility & Screening Timeline",
                version: "1.0.0",
                evidenceSource: "USPSTF A/B Recommendations, ICMR National Guidelines for Preventive Medicine (2023)",
                evidenceLevel: "Grade A Clinical Recommendation",
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSafetyCallout(),
            const SizedBox(height: 16),
            _buildSummaryHeader(screenings),
            const SizedBox(height: 16),
            const Text(
              "Recommended Clinical Screenings",
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            for (final s in screenings) _buildScreeningCard(context, s),
            const SizedBox(height: 20),
            _buildDoctorConsultationCta(context),
          ],
        ),
      ),
    );
  }

  Widget _buildSafetyCallout() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.primary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.shield_outlined, color: AppColors.primaryLight, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              "Preventive screening guidelines provide general age/risk intervals. Final screening decisions, imaging referrals, and frequency adjustments must be made by your licensed physician.",
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryHeader(List<Map<String, dynamic>> screenings) {
    int upToDate = 0;
    int due = 0;
    for (final s in screenings) {
      if (s["status"] == "Up to Date") {
        upToDate++;
      } else {
        due++;
      }
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Screening Adherence", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                const SizedBox(height: 4),
                Text("$upToDate of ${screenings.length} On Schedule", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                const SizedBox(height: 4),
                Text("$due tests require scheduling or clinical review", style: const TextStyle(fontSize: 11, color: AppColors.warning)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.vitalisTeal.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.event_note_rounded, color: AppColors.vitalisTeal, size: 28),
          ),
        ],
      ),
    );
  }

  Widget _buildScreeningCard(BuildContext context, Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  item["title"] as String,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: (item["statusColor"] as Color).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  item["status"] as String,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: item["statusColor"] as Color,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text("Guideline: ${item["guideline"]}", style: const TextStyle(fontSize: 11, color: AppColors.vitalisTeal)),
          const SizedBox(height: 2),
          Text("Interval: ${item["interval"]}", style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
          const SizedBox(height: 2),
          Text("Last recorded: ${item["lastCompleted"]}", style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
          const SizedBox(height: 10),
          Align(
            alignment: Alignment.centerRight,
            child: OutlinedButton(
              onPressed: () {
                context.push("/doctor");
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.vitalisTeal,
                side: const BorderSide(color: AppColors.vitalisTeal),
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(item["action"] as String, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDoctorConsultationCta(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.vitalisTeal.withValues(alpha: 0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.vitalisTeal.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.medical_services_rounded, color: AppColors.vitalisTeal, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Order Screenings via Clinic", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                const SizedBox(height: 2),
                const Text("Connect directly with AyuSetu Physician Queue", style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () => context.push("/doctor"),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.vitalisTeal,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text("Book", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}
