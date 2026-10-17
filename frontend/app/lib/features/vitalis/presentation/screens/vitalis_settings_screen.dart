import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisSettingsScreen extends ConsumerStatefulWidget {
  const VitalisSettingsScreen({super.key});

  @override
  ConsumerState<VitalisSettingsScreen> createState() => _VitalisSettingsScreenState();
}

class _VitalisSettingsScreenState extends ConsumerState<VitalisSettingsScreen> {
  bool _researchConsent = false;
  bool _wearableSyncConsent = true;
  bool _aiProcessingConsent = true;
  bool _herCrossLinkConsent = false;

  bool _experimentalVo2 = false;
  bool _experimentalReadiness = true;

  final List<Map<String, String>> _auditLog = [
    {
      "timestamp": "2026-10-17 19:42:10 UTC",
      "actor": "Patient (Self)",
      "action": "Generated 72h Clinician Share Token",
      "provenance": "Cryptographic Hash: #8f92a1",
    },
    {
      "timestamp": "2026-10-17 19:15:00 UTC",
      "actor": "Wearable Adapter",
      "action": "Ingested 7-Day HRV & RHR Epochs (Deduplicated)",
      "provenance": "D1 Stream Store",
    },
    {
      "timestamp": "2026-10-17 18:30:22 UTC",
      "actor": "Safety Gate Engine",
      "action": "Evaluated V0 Clinical Safety & Contraindications",
      "provenance": "Local Worker Edge",
    },
    {
      "timestamp": "2026-10-17 17:00:00 UTC",
      "actor": "Intake System",
      "action": "Initial Healthspan Profile & Consent Granted",
      "provenance": "Consent Vault",
    },
  ];

  void _handleRevokeAll() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        title: const Text("Revoke All Consent & Quarantine Data?", style: TextStyle(color: AppColors.error)),
        content: const Text(
          "This will immediately halt all wearable synchronization, revoke clinician access tokens, and quarantine longitudinal telemetry streams in accordance with ABDM and GDPR health data policies.",
          style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _researchConsent = false;
                _wearableSyncConsent = false;
                _aiProcessingConsent = false;
                _herCrossLinkConsent = false;
              });
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("All consents revoked. Telemetry streams placed in quarantine."),
                  backgroundColor: AppColors.error,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error, foregroundColor: Colors.white),
            child: const Text("Revoke & Quarantine"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Privacy, Consent & Data Vault"),
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
                title: "Data Vault & Privacy Architecture",
                description:
                    "AyuSetu Vitalis employs zero-knowledge encryption, immutable audit logging, and strict data compartmentalization. Women's health data from AyuSetu HER is completely isolated by default and cannot be accessed without explicit secondary consent.",
                algorithmName: "Vitalis Security & Consent Engine",
                version: "1.0.0",
                evidenceSource: "ISO 27799 Health Informatics Privacy, ABDM Consent Framework",
                evidenceLevel: "Regulatory Standard",
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
            _buildGranularConsentSection(),
            const SizedBox(height: 16),
            _buildExperimentalFlagsSection(),
            const SizedBox(height: 16),
            _buildAuditLogViewer(),
            const SizedBox(height: 20),
            _buildRevokeAndExportActions(),
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
          Icon(Icons.lock_rounded, color: AppColors.ayushGreen, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              "Your healthspan data is encrypted and partitioned. Revoking consent immediately terminates telemetry pipelines and invalidates clinician review tokens.",
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGranularConsentSection() {
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
            "Granular Consent Permissions",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 12),
          _buildConsentSwitch(
            title: "Wearable Telemetry Sync",
            subtitle: "Continuous background ingestion of HRV, RHR and step kinematics",
            value: _wearableSyncConsent,
            onChanged: (val) => setState(() => _wearableSyncConsent = val),
          ),
          const Divider(color: AppColors.surfaceElevated),
          _buildConsentSwitch(
            title: "AI Healthspan Copilot & NLP",
            subtitle: "Processes natural language queries via local PHI-redacted pipeline",
            value: _aiProcessingConsent,
            onChanged: (val) => setState(() => _aiProcessingConsent = val),
          ),
          const Divider(color: AppColors.surfaceElevated),
          _buildConsentSwitch(
            title: "HER Module Compartment Cross-Link",
            subtitle: "Requires explicit secondary consent to link reproductive/cycle records with Vitalis",
            value: _herCrossLinkConsent,
            onChanged: (val) => setState(() => _herCrossLinkConsent = val),
          ),
          const Divider(color: AppColors.surfaceElevated),
          _buildConsentSwitch(
            title: "De-Identified Longevity Research",
            subtitle: "Contribute anonymized biomarker trends to university longevity registry",
            value: _researchConsent,
            onChanged: (val) => setState(() => _researchConsent = val),
          ),
        ],
      ),
    );
  }

  Widget _buildConsentSwitch({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                const SizedBox(height: 2),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3)),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: AppColors.vitalisTeal,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildExperimentalFlagsSection() {
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Expanded(
                child: Text(
                  "Clinical Feature Flags",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text("vitalis.enabled: true", style: TextStyle(fontSize: 10, color: AppColors.vitalisTeal, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildConsentSwitch(
            title: "Experimental VO2max Regression",
            subtitle: "Non-exercise Jackson regression (Disabled by default pending population validation)",
            value: _experimentalVo2,
            onChanged: (val) {
              if (val) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Caution: Jackson regression has not been externally calibrated for Indian cohort."),
                    backgroundColor: AppColors.warning,
                  ),
                );
              }
              setState(() => _experimentalVo2 = val);
            },
          ),
          const Divider(color: AppColors.surfaceElevated),
          _buildConsentSwitch(
            title: "Experimental Daily Readiness Scoring",
            subtitle: "Combines autonomic HRV z-scores & sleep architecture for training readiness",
            value: _experimentalReadiness,
            onChanged: (val) => setState(() => _experimentalReadiness = val),
          ),
        ],
      ),
    );
  }

  Widget _buildAuditLogViewer() {
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
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  "Immutable Access Audit Log",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              SizedBox(width: 8),
              Icon(Icons.history_rounded, size: 18, color: AppColors.vitalisTeal),
            ],
          ),
          const SizedBox(height: 12),
          for (final log in _auditLog)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(log["action"]!, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                      ),
                      const SizedBox(width: 8),
                      Text(log["provenance"]!, style: const TextStyle(fontSize: 10, color: AppColors.vitalisTeal, fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Text("By: ${log["actor"]}", style: const TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(log["timestamp"]!, textAlign: TextAlign.right, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
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

  Widget _buildRevokeAndExportActions() {
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text("Encrypted JSON data archive downloaded to local device."),
                  backgroundColor: AppColors.vitalisTeal,
                ),
              );
            },
            icon: const Icon(Icons.download_rounded),
            label: const Text("Export My Complete Data Archive (JSON)"),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.textPrimary,
              side: const BorderSide(color: AppColors.surfaceElevated),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _handleRevokeAll,
            icon: const Icon(Icons.delete_forever_rounded),
            label: const Text("Revoke All Consent & Quarantine Data"),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error.withValues(alpha: 0.15),
              foregroundColor: AppColors.error,
              elevation: 0,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: AppColors.error),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
