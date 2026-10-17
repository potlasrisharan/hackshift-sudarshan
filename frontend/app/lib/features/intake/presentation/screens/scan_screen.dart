import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";
import "package:kiosk_app/features/intake/presentation/providers/intake_provider.dart";

class ScanScreen extends ConsumerStatefulWidget {
  const ScanScreen({super.key});

  @override
  ConsumerState<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends ConsumerState<ScanScreen> {
  bool _isProcessing = false;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(intakeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Step 3: Document Digitization",
          overflow: TextOverflow.ellipsis,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.canPop() ? context.pop() : context.go("/converse"),
        ),
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isCompact = constraints.maxWidth < 720;
          final cameraSection = Card(
            child: Padding(
              padding: EdgeInsets.all(isCompact ? 16.0 : 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: double.infinity,
                    height: isCompact ? 200 : 260,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primary, width: 2),
                    ),
                    child: Center(
                      child: _isProcessing
                          ? Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                CircularProgressIndicator(),
                                SizedBox(height: 16),
                                Text(
                                  "Sarvam Vision 3B VLM Extracting Cursive Rx...",
                                  style: TextStyle(color: AppColors.primaryLight, fontSize: 12),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            )
                          : Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(Icons.document_scanner, size: 56, color: AppColors.primaryLight),
                                SizedBox(height: 12),
                                Text(
                                  "Place Physical Prescription under Camera",
                                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                                SizedBox(height: 4),
                                Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 16),
                                  child: Text(
                                    "Supports Cursive Handwriting & Multi-column Labs in 23 Languages",
                                    style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                    onPressed: () async {
                      setState(() => _isProcessing = true);
                      await Future.delayed(const Duration(milliseconds: 800));
                      await ref.read(intakeProvider.notifier).triggerOcr();
                      setState(() => _isProcessing = false);
                    },
                    icon: const Icon(Icons.camera_alt),
                    label: const Text("Capture & Digitize Prescription"),
                  ),
                ],
              ),
            ),
          );

          final resultsSection = Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Extracted Clinical Entities (96% Confidence):",
                style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              if (state.extractedMedications.isNotEmpty) ...[
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Active Medications (OCR Digitized):",
                          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryLight, fontSize: 13),
                        ),
                        const SizedBox(height: 8),
                        ...state.extractedMedications.map((m) => Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  const Icon(Icons.medication, size: 16, color: AppColors.secondary),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      "${m["name"]} • ${m["dosage"]}",
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    "${m["frequency"]} (${m["duration"]})",
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                  ),
                                ],
                              ),
                            )),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Laboratory Results (Abnormal Highlighted):",
                          style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.warning, fontSize: 13),
                        ),
                        const SizedBox(height: 8),
                        ...state.extractedLabs.map((l) => Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  Icon(Icons.science, size: 16, color: l["is_abnormal"] ? AppColors.error : AppColors.success),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      l["test_name"],
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    "${l["value"]} ${l["unit"]}",
                                    style: TextStyle(color: l["is_abnormal"] ? AppColors.error : Colors.white, fontWeight: FontWeight.bold),
                                  ),
                                  if (l["is_abnormal"]) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(color: AppColors.error.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(4)),
                                      child: const Text("HIGH", style: TextStyle(color: AppColors.error, fontSize: 10, fontWeight: FontWeight.bold)),
                                    )
                                  ],
                                ],
                              ),
                            )),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: isCompact ? Alignment.center : Alignment.centerRight,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.success,
                      minimumSize: isCompact ? const Size.fromHeight(48) : null,
                    ),
                    onPressed: () => context.push("/summarize"),
                    icon: const Icon(Icons.check_circle),
                    label: const Text("Generate SOAP Summary ➔"),
                  ),
                ),
              ] else ...[
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(32.0),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.receipt_long, size: 50, color: AppColors.textMuted),
                          SizedBox(height: 12),
                          Text(
                            "Click Capture & Digitize Prescription to run Sarvam Vision OCR",
                            style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ],
          );

          if (isCompact) {
            return SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  cameraSection,
                  const SizedBox(height: 16),
                  resultsSection,
                  const SizedBox(height: 24),
                ],
              ),
            );
          }

          return Padding(
            padding: const EdgeInsets.all(24.0),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(flex: 5, child: cameraSection),
                const SizedBox(width: 24),
                Expanded(flex: 6, child: SingleChildScrollView(child: resultsSection)),
              ],
            ),
          );
        },
      ),
    );
  }
}
