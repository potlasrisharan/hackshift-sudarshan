import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";
import "package:kiosk_app/core/widgets/app_scaffold_shell.dart";
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
        title: const Text(
          "Step 1: Patient Identification",
          overflow: TextOverflow.ellipsis,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.canPop() ? context.pop() : context.go("/"),
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 8),
            child: AyuSetuLogoBadge(height: 20),
          ),
        ],
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isWide = constraints.maxWidth >= 720;

          final scanCard = Card(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: isWide ? 220 : 180,
                    height: isWide ? 220 : 180,
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.primary, width: 2),
                    ),
                    child: Center(
                      child: _isScanning
                          ? const CircularProgressIndicator()
                          : Icon(Icons.qr_code_scanner, size: isWide ? 100 : 80, color: AppColors.primaryLight),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    "Scan ABHA QR Code / Card",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    "Position your ABHA QR under the kiosk scanner or enter mobile number",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 16),
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
          );

          final detailsSection = Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (state.patient != null) ...[
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(18.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Row(
                                children: [
                                  const CircleAvatar(
                                    radius: 24,
                                    backgroundColor: AppColors.primary,
                                    child: Icon(Icons.person, color: Colors.white, size: 28),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          state.patient!.name,
                                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        Text(
                                          "${state.patient!.gender} • ${state.patient!.age} Yrs",
                                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: AppColors.success.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(color: AppColors.success),
                              ),
                              child: const Text("ABHA VERIFIED", style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 11)),
                            ),
                          ],
                        ),
                        const Divider(height: 24),
                        Text("ABHA ID: ${state.patient!.abhaNumber}", style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                        const SizedBox(height: 2),
                        Text("Address: ${state.patient!.abhaAddress}", style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                        const SizedBox(height: 14),
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: AppColors.pmjayGold.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.pmjayGold),
                          ),
                          child: Row(
                            children: const [
                              Icon(Icons.verified_user, color: AppColors.pmjayGold, size: 28),
                              SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text("Ayushman Bharat PM-JAY Active", style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.pmjayGold, fontSize: 14)),
                                    SizedBox(height: 2),
                                    Text("₹5,00,000 Annual Coverage • Cashless AYUSH OPD & Meds Approved", style: TextStyle(color: Colors.white70, fontSize: 11)),
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
                const SizedBox(height: 14),
                Card(
                  color: AppColors.surfaceElevated,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.volume_up, color: AppColors.primaryLight, size: 20),
                            SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                "Audio Consent Granted (DPDPA 2023): Clinical history will be shared with the consulting doctor only.",
                                style: TextStyle(fontSize: 12, color: Colors.white70),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        ElevatedButton(
                          onPressed: () => context.push("/converse"),
                          child: const Text("Begin Voice Intake ➔"),
                        ),
                      ],
                    ),
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
                          Icon(Icons.qr_code, size: 50, color: AppColors.textMuted),
                          SizedBox(height: 12),
                          Text("Awaiting Patient Scan", style: TextStyle(fontSize: 15, color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ],
          );

          if (isWide) {
            return Padding(
              padding: const EdgeInsets.all(24.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 5, child: scanCard),
                  const SizedBox(width: 20),
                  Expanded(flex: 6, child: detailsSection),
                ],
              ),
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                scanCard,
                const SizedBox(height: 16),
                detailsSection,
              ],
            ),
          );
        },
      ),
    );
  }
}
