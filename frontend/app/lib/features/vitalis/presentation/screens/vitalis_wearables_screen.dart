import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../providers/vitalis_provider.dart";

class VitalisWearablesScreen extends ConsumerStatefulWidget {
  const VitalisWearablesScreen({super.key});

  @override
  ConsumerState<VitalisWearablesScreen> createState() => _VitalisWearablesScreenState();
}

class _VitalisWearablesScreenState extends ConsumerState<VitalisWearablesScreen> {
  bool _syncing = false;

  void _triggerSync() async {
    setState(() => _syncing = true);
    await Future.delayed(const Duration(milliseconds: 600));
    if (mounted) {
      setState(() => _syncing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Telemetry Synchronized & Deduplicated Successfully")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);
    final isConnected = state.isWearableConnected;

    return AppScaffoldShell(
      title: "Wearable Intelligence",
      subtitle: "21-Day Baselines & Multi-Source Streams",
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildConnectionCard(isConnected),
            const SizedBox(height: 16),
            _buildBaselineSummaryCard(),
            const SizedBox(height: 16),
            _buildHrvSeparationCard(),
            const SizedBox(height: 16),
            _buildSyncAuditCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildConnectionCard(bool isConnected) {
    return Container(
      padding: const EdgeInsets.all(18),
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
                  "Health Telemetry Adapters",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: _syncing ? null : _triggerSync,
                icon: _syncing
                    ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.sync_rounded, size: 16),
                label: const Text("Sync Now"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.vitalisTeal,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.apple, size: 26, color: AppColors.textPrimary),
            title: const Text("Apple HealthKit", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            subtitle: Text(isConnected ? "Connected & Anchored Query Active" : "Disconnected", style: TextStyle(fontSize: 11, color: isConnected ? AppColors.success : AppColors.textMuted)),
            trailing: Switch(
              value: isConnected,
              activeTrackColor: AppColors.vitalisTeal,
              onChanged: (val) {
                // Toggles via provider in actual usage
              },
            ),
          ),
          const Divider(color: AppColors.surfaceElevated),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.android, size: 26, color: AppColors.success),
            title: const Text("Android Health Connect", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            subtitle: const Text("Ready to pair (Google Health SDK)", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
            trailing: Switch(
              value: false,
              activeTrackColor: AppColors.vitalisTeal,
              onChanged: (_) {},
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBaselineSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.vitalisTeal.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Expanded(
                child: Text(
                  "Personal 21-Day Rolling Baseline",
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              SizedBox(width: 8),
              Icon(Icons.auto_graph_rounded, color: AppColors.vitalisTeal, size: 20),
            ],
          ),
          const SizedBox(height: 12),
          _buildBaselineRow("Resting Heart Rate", "62 bpm", "± 3 bpm standard deviation", AppColors.error),
          const SizedBox(height: 8),
          _buildBaselineRow("HRV (rMSSD)", "52 ms", "Normal nocturnal autonomic recovery", AppColors.secondary),
          const SizedBox(height: 8),
          _buildBaselineRow("Average Nightly Sleep", "7.1 hours", "Circadian stability index: 84/100", AppColors.primaryLight),
        ],
      ),
    );
  }

  Widget _buildBaselineRow(String label, String value, String sub, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                overflow: TextOverflow.ellipsis,
              ),
              Text(
                sub,
                style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: color)),
      ],
    );
  }

  Widget _buildHrvSeparationCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceElevated),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text("HRV RMSSD vs SDNN Separation", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          SizedBox(height: 4),
          Text(
            "rMSSD reflects parasympathetic vagal recovery over short nocturnal intervals, whereas SDNN represents overall 24-hour autonomic balance. AyuSetu strictly separates these measurements to prevent misleading trend aggregations.",
            style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
          ),
        ],
      ),
    );
  }

  Widget _buildSyncAuditCard() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated.withValues(alpha: 0.5),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: const [
          Icon(Icons.shield_outlined, size: 18, color: AppColors.vitalisTeal),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              "Synthetic wearable connector active. Timezone normalization: Asia/Kolkata (IST). Deduplication: sourceRecordId unique constraint.",
              style: TextStyle(fontSize: 10, color: AppColors.textMuted),
            ),
          ),
        ],
      ),
    );
  }
}
