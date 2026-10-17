import 'failure.dart';

sealed class Result<T> {
  const Result();
}

final class Success<T> extends Result<T> {
  final T value;
  const Success(this.value);
}

final class Failed<T> extends Result<T> {
  final Failure failure;
  const Failed(this.failure);
}
