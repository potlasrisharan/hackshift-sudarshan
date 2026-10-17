import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/her_provider.dart";

class HerWearableScreen extends ConsumerWidget {
  const HerWearableScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(herProvider);
    final records = state.wearableRecords;

    return AppScaffoldShell(
      title: "Wearables & Telemetry",
      subtitle: "Biometric Rhythm & Longitudinal Trends",
      actions: [
        IconButton(
          icon: const Icon(Icons.sync, color: AppColors.primaryLight),
          tooltip: "Sync Biometrics",
          onPressed: () => ref.read(herProvider.notifier).syncWearables(),
        ),
      ],
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Connection Status Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.longevityCyan.withValues(alpha: 0.4)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.health_and_safety, color: AppColors.longevityCyan, size: 28),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Health Data Platform Ingestion",
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "Continuously aggregating Apple Health & Health Connect resting pulse, sleep efficiency, and basal temperature patterns.",
                          style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Stream List Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    "Recent Biometric Ingestion Stream",
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  "${records.length} records",
                  style: const TextStyle(color: AppColors.primaryLight, fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 10),

            if (records.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: Text("No wearable telemetry records ingested yet.", style: TextStyle(color: AppColors.textMuted)),
                ),
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: records.take(10).length,
                separatorBuilder: (_, _) => const SizedBox(height: 8),
                itemBuilder: (context, idx) {
                  final r = records[idx];
                  return Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
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
                                r.date,
                                style: const TextStyle(
                                  color: AppColors.textPrimary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Source: ${r.source.replaceAll('_', ' ')}",
                                style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Row(
                          children: [
                            _buildMiniMetric("RHR", "${r.restingHeartRateBpm ?? '—'} bpm"),
                            const SizedBox(width: 8),
                            _buildMiniMetric(
                              "Sleep",
                              r.sleepDurationMinutes != null
                                  ? "${(r.sleepDurationMinutes! / 60).toStringAsFixed(1)}h"
                                  : "—",
                            ),
                            const SizedBox(width: 8),
                            _buildMiniMetric("Temp", "${r.basalBodyTempCelsius ?? '—'}°C"),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniMetric(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
      ],
    );
  }
}
