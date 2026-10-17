import 'dart:async';
import 'package:dio/dio.dart';
import '../constants/app_config.dart';
import '../error/failure.dart';
import 'failure_mapper.dart';
import '../error/result.dart';

enum NetworkOutcome { succeeded, failed }

final class SafeNetworkEvent {
  final String method;
  final int? statusCode;
  final NetworkOutcome outcome;
  const SafeNetworkEvent(this.method, this.statusCode, this.outcome);
}

typedef NetworkAuditSink = void Function(SafeNetworkEvent event);
typedef RetryDelay = Future<void> Function(Duration duration);

/// An allowlist logger: no URL, query, headers, payload, response or err text.
final class RedactedNetworkInterceptor extends Interceptor {
  final NetworkAuditSink sink;
  RedactedNetworkInterceptor(this.sink);
  String safeMethod(String value) => switch (value) {
    'GET' ||
    'HEAD' ||
    'OPTIONS' ||
    'POST' ||
    'PUT' ||
    'DELETE' ||
    'PATCH' => value,
    _ => 'OTHER',
  };
  void emit(SafeNetworkEvent event) {
    try {
      sink(event);
    } catch (_) {
      /* Diagnostics cannot affect care flow. */
    }
  }

  @override
  void onResponse(
    Response<Object?> response,
    ResponseInterceptorHandler handler,
  ) {
    emit(
      SafeNetworkEvent(
        safeMethod(response.requestOptions.method),
        response.statusCode,
        NetworkOutcome.succeeded,
      ),
    );
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    emit(
      SafeNetworkEvent(
        safeMethod(err.requestOptions.method),
        err.response?.statusCode,
        NetworkOutcome.failed,
      ),
    );
    handler.next(err);
  }
}

final class IdempotentRetryInterceptor extends Interceptor {
  final Dio dio;
  final RetryDelay delay;
  final int maxRetries;
  IdempotentRetryInterceptor(this.dio, {RetryDelay? delay, this.maxRetries = 2})
    : delay = delay ?? Future<void>.delayed;
  bool _canRepeat(RequestOptions request) {
    if ({'GET', 'HEAD', 'OPTIONS'}.contains(request.method)) return true;
    final key = request.headers['Idempotency-Key'];
    return request.extra['verifiedIdempotent'] == true &&
        key is String &&
        key.trim().isNotEmpty &&
        request.data is Map<String, Object?>;
  }

  bool _transient(DioException err) => switch (err.type) {
    DioExceptionType.connectionTimeout ||
    DioExceptionType.sendTimeout ||
    DioExceptionType.receiveTimeout ||
    DioExceptionType.connectionError => true,
    DioExceptionType.badResponse => {
      408,
      429,
      502,
      503,
      504,
    }.contains(err.response?.statusCode),
    _ => false,
  };
  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final request = err.requestOptions;
    final attempt = request.extra['retryAttempt'] as int? ?? 0;
    if (!_canRepeat(request) ||
        !_transient(err) ||
        attempt >= maxRetries ||
        (request.cancelToken?.isCancelled ?? false)) {
      handler.next(err);
      return;
    }
    final retryAfter = int.tryParse(
      err.response?.headers.value('retry-after') ?? '',
    );
    final milliseconds = retryAfter == null
        ? 250 * (1 << attempt)
        : retryAfter.clamp(0, 10) * 1000;
    try {
      await delay(Duration(milliseconds: milliseconds));
      final cancellation = request.cancelToken?.cancelError;
      if (cancellation != null) {
        throw cancellation;
      }
      final response = await dio.fetch<Object?>(
        request.copyWith(
          extra: {...request.extra, 'retryAttempt': attempt + 1},
        ),
      );
      handler.resolve(response);
    } on DioException catch (retryError) {
      handler.next(retryError);
    } catch (_) {
      handler.next(err);
    }
  }
}

final class ApiClient {
  final Dio _dio;
  final AppConfig config;
  ApiClient(
    this.config, {
    Dio? dio,
    NetworkAuditSink? auditSink,
    RetryDelay? delay,
  }) : _dio = dio ?? Dio() {
    _dio.options = BaseOptions(
      baseUrl: config.apiBaseUrl.toString(),
      connectTimeout: const Duration(seconds: 10),
      sendTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 20),
      followRedirects: false,
      headers: {'Accept': 'application/json'},
    );
    _dio.interceptors.add(IdempotentRetryInterceptor(_dio, delay: delay));
    if (auditSink != null) {
      _dio.interceptors.add(RedactedNetworkInterceptor(auditSink));
    }
  }

  /// The deployed health contract is at the origin root, outside /api/v1.
  Future<Result<Object?>> rootHealth({CancelToken? cancelToken}) async {
    try {
      final response = await _dio.get<Object?>(
        config.apiBaseUrl.replace(path: '/healthz').toString(),
        cancelToken: cancelToken,
      );
      return Success(response.data);
    } on DioException catch (err) {
      return Failed(mapDioFailure(err));
    } catch (_) {
      return const Failed(UnknownFailure());
    }
  }

  void close() => _dio.close(force: true);
}
