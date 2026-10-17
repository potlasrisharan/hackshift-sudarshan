import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";
import "package:kiosk_app/features/intake/presentation/providers/intake_provider.dart";

class IdentifyScreen extends ConsumerStatefulWidget {
  const IdentifyScreen({super.key});

  @override
  ConsumerState<IdentifyScreen> createState() => _IdentifyScreenState();
}

class _IdentifyScreenState extends ConsumerState<IdentifyScreen> {
  bool _isScanning = false;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(intakeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Step 1: Patient Identification & Consent"),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go("/"),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Row(
          children: [
            Expanded(
              flex: 5,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(28.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 220,
                        height: 220,
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.primary, width: 2),
                        ),
                        child: Center(
                          child: _isScanning
                              ? const CircularProgressIndicator()
                              : const Icon(Icons.qr_code_scanner, size: 100, color: AppColors.primaryLight),
                        ),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        "Scan ABHA QR Code / Card",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        "Position your ABHA QR under the kiosk scanner or enter mobile number",
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton.icon(
                        onPressed: () async {
                          setState(() => _isScanning = true);
                          await Future.delayed(const Duration(milliseconds: 600));
                          await ref.read(intakeProvider.notifier).scanAbha();
                          setState(() => _isScanning = false);
                        },
                        icon: const Icon(Icons.flash_on),
                        label: const Text("Simulate Rapid ABHA Scan"),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 28),
            Expanded(
              flex: 6,
              child: Column(
                children: [
                  if (state.patient != null) ...[
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const CircleAvatar(
                                      radius: 28,
                                      backgroundColor: AppColors.primary,
                                      child: Icon(Icons.person, color: Colors.white, size: 32),
                                    ),
                                    const SizedBox(width: 16),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(state.patient!.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                                        Text("${state.patient!.gender} • ${state.patient!.age} Yrs", style: const TextStyle(color: AppColors.textSecondary)),
                                      ],
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: AppColors.success.withValues(alpha: 0.2),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: AppColors.success),
                                  ),
                                  child: const Text("ABHA VERIFIED", style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 12)),
                                ),
                              ],
                            ),
                            const Divider(height: 32),
                            Text("ABHA ID: ${state.patient!.abhaNumber}", style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                            Text("Address: ${state.patient!.abhaAddress}", style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.pmjayGold.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.pmjayGold),
                              ),
                              child: Row(
                                children: const [
                                  Icon(Icons.verified_user, color: AppColors.pmjayGold, size: 32),
                                  SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text("Ayushman Bharat PM-JAY Active", style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.pmjayGold, fontSize: 15)),
                                        Text("₹5,00,000 Annual Coverage • Cashless AYUSH OPD & Meds Approved", style: TextStyle(color: Colors.white70, fontSize: 12)),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Card(
                      color: AppColors.surfaceElevated,
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Row(
                          children: [
                            const Icon(Icons.volume_up, color: AppColors.primaryLight),
                            const SizedBox(width: 16),
                            const Expanded(
                              child: Text(
                                "Audio Consent Granted (DPDPA 2023): Clinical history will be shared with the consulting doctor only.",
                                style: TextStyle(fontSize: 12, color: Colors.white70),
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () => context.go("/converse"),
                              child: const Text("Begin Voice Intake ➔"),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ] else ...[
                    Expanded(
                      child: Card(
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.qr_code, size: 60, color: AppColors.textMuted),
                              SizedBox(height: 16),
                              Text("Awaiting Patient Scan", style: TextStyle(fontSize: 16, color: AppColors.textSecondary)),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
