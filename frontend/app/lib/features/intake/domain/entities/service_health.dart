final class ServiceHealth {
  final bool reachable;
  final bool syntheticDemo;
  final bool? persistentStorage;
  final bool? speechConfigured;
  const ServiceHealth({
    required this.reachable,
    required this.syntheticDemo,
    required this.persistentStorage,
    required this.speechConfigured,
  });
}
