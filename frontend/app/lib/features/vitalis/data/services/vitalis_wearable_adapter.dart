class WearableTelemetryPoint {
  final String metricCode;
  final double value;
  final String unit;
  final DateTime timestamp;
  final String sourceDevice;

  const WearableTelemetryPoint({
    required this.metricCode,
    required this.value,
    required this.unit,
    required this.timestamp,
    required this.sourceDevice,
  });
}

class VitalisWearableAdapter {
  bool isAppleHealthConnected = true;
  bool isHealthConnectConnected = false;
  DateTime? lastSyncTime = DateTime.now();

  int get restingHeartRateBpm => 62;
  double get hrvRmssdMs => 52.0;

  Future<bool> connectAppleHealth() async {
    isAppleHealthConnected = true;
    lastSyncTime = DateTime.now();
    return true;
  }

  Future<bool> disconnectAppleHealth() async {
    isAppleHealthConnected = false;
    return false;
  }

  Future<bool> connectHealthConnect() async {
    isHealthConnectConnected = true;
    lastSyncTime = DateTime.now();
    return true;
  }

  Future<bool> disconnectHealthConnect() async {
    isHealthConnectConnected = false;
    return false;
  }

  List<WearableTelemetryPoint> getSimulatedTelemetryStream() {
    if (!isAppleHealthConnected && !isHealthConnectConnected) {
      return const [];
    }

    final now = DateTime.now();
    return [
      WearableTelemetryPoint(metricCode: "steps", value: 6840, unit: "steps", timestamp: now, sourceDevice: "Apple Watch S9"),
      WearableTelemetryPoint(metricCode: "resting_hr", value: 62, unit: "bpm", timestamp: now, sourceDevice: "Apple Watch S9"),
      WearableTelemetryPoint(metricCode: "hrv_rmssd", value: 52, unit: "ms", timestamp: now, sourceDevice: "Apple Watch S9"),
      WearableTelemetryPoint(metricCode: "deep_sleep_minutes", value: 105, unit: "mins", timestamp: now, sourceDevice: "Apple Watch S9"),
      WearableTelemetryPoint(metricCode: "vo2max", value: 38.2, unit: "mL/kg/min", timestamp: now, sourceDevice: "Apple Watch S9"),
    ];
  }
}
