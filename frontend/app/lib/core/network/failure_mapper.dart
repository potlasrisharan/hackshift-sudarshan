import 'package:dio/dio.dart';
import '../error/failure.dart';

Failure mapDioFailure(DioException error) => switch (error.type) {
  DioExceptionType.connectionTimeout ||
  DioExceptionType.sendTimeout ||
  DioExceptionType.receiveTimeout ||
  DioExceptionType.transformTimeout => const TimeoutFailure(),
  DioExceptionType.connectionError => const NetworkFailure(),
  DioExceptionType.cancel => const CancelledFailure(),
  DioExceptionType.badResponse => switch (error.response?.statusCode) {
    400 || 422 => const ValidationFailure(),
    final code => ServerFailure(code),
  },
  DioExceptionType.badCertificate => const NetworkFailure(),
  DioExceptionType.unknown => const UnknownFailure(),
};
