import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";
import "package:kiosk_app/features/intake/presentation/providers/intake_provider.dart";

class QueueTokenScreen extends ConsumerWidget {
  const QueueTokenScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(intakeProvider);

    return Scaffold(
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 550),
          padding: const EdgeInsets.all(32),
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(36.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.check_circle, color: AppColors.success, size: 70),
                  const SizedBox(height: 16),
                  const Text("Intake Complete & Token Issued", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text("All India Institute of Ayurveda (AIIA) - OPD Room 4", style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  const Divider(height: 36),
                  const Text("YOUR OPD TOKEN NUMBER", style: TextStyle(color: AppColors.textMuted, fontSize: 12, letterSpacing: 1.5)),
                  const SizedBox(height: 8),
                  Text(state.tokenNumber, style: const TextStyle(fontSize: 56, fontWeight: FontWeight.bold, color: AppColors.primaryLight)),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(color: AppColors.pmjayGold.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Text("PM-JAY Beneficiary • Cashless Approved", style: TextStyle(color: AppColors.pmjayGold, fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                  const SizedBox(height: 24),
                  const Text("Your case summary has been sent directly to the doctor consultation screen.", textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 13)),
                  const SizedBox(height: 28),
                  ElevatedButton.icon(
                    onPressed: () => context.go("/"),
                    icon: const Icon(Icons.refresh),
                    label: const Text("Start Next Patient Intake"),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
