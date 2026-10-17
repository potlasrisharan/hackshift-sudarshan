import "dart:math";
import "../models/her_models.dart";

/// Production-grade Wearable Adapter Interface (Apple Health / Health Connect)
abstract class HealthPlatformAdapter {
  String get platformName;
  Future<bool> isAvailable();
  Future<bool> requestPermissions();
  Future<List<HerWearableModel>> fetchRecentMetrics({required int days});
}

/// Production Native Health Platform Adapter
/// Ready for integration with HealthKit / Health Connect native platform channels.
class ProductionHealthPlatformAdapter implements HealthPlatformAdapter {
  @override
  String get platformName => "Production Health Connect / HealthKit";

  @override
  Future<bool> isAvailable() async {
    // Requires physical device with Apple HealthKit or Android Health Connect entitlements
    return false;
  }

  @override
  Future<bool> requestPermissions() async {
    return false;
  }

  @override
  Future<List<HerWearableModel>> fetchRecentMetrics({required int days}) async {
    return const [];
  }
}

/// Clearly Labeled Synthetic Demo Adapter
/// Simulates realistic menstrual and circadian physiology:
/// - Luteal phase basal body temperature rise (+0.3°C to 0.5°C)
/// - Resting heart rate fluctuations (60-74 bpm)
/// - Sleep architecture and HRV metrics
class SyntheticWearableDemoAdapter implements HealthPlatformAdapter {
  final Random _rng = Random(42);

  @override
  String get platformName => "Synthetic Device Simulator (AyuSetu Lab)";

  @override
  Future<bool> isAvailable() async => true;

  @override
  Future<bool> requestPermissions() async => true;

  @override
  Future<List<HerWearableModel>> fetchRecentMetrics({required int days}) async {
    final List<HerWearableModel> records = [];
    final now = DateTime.now();

    for (int i = 0; i < days; i++) {
      final date = now.subtract(Duration(days: i));
      final dateString = date.toIso8601String().split("T").first;
      
      // Simulating a 28-day cycle phase for temperature and resting heart rate
      final dayOfCycle = (date.difference(DateTime(2026, 9, 1)).inDays) % 28;
      final isLuteal = dayOfCycle >= 14;

      final bbt = 36.3 + (isLuteal ? 0.38 : 0.0) + (_rng.nextDouble() * 0.1);
      final rhr = 64 + (isLuteal ? 4 : 0) + _rng.nextInt(4);
      final sleepMin = 420 + _rng.nextInt(60);
      final hrv = 52 - (isLuteal ? 6 : 0) + _rng.nextInt(8);
      final steps = 7500 + _rng.nextInt(3500);

      records.add(
        HerWearableModel(
          date: dateString,
          restingHeartRateBpm: rhr,
          hrvMs: hrv,
          sleepDurationMinutes: sleepMin,
          sleepEfficiencyPercent: 88 + _rng.nextInt(8),
          stepCount: steps,
          basalBodyTempCelsius: double.parse(bbt.toStringAsFixed(2)),
          source: "synthetic_simulator",
        ),
      );
    }

    return records;
  }
}
