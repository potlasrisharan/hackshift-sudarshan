/// Safe UI-facing failures contain no raw request, response or exception text.
sealed class Failure {
  const Failure();
}

final class NetworkFailure extends Failure {
  const NetworkFailure();
}

final class TimeoutFailure extends Failure {
  const TimeoutFailure();
}

final class ServerFailure extends Failure {
  final int? statusCode;
  const ServerFailure(this.statusCode);
}

final class ValidationFailure extends Failure {
  const ValidationFailure();
}

final class UnknownFailure extends Failure {
  const UnknownFailure();
}

final class ConfigurationFailure extends Failure {
  const ConfigurationFailure();
}

final class CancelledFailure extends Failure {
  const CancelledFailure();
}
