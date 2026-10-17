import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kiosk_app/core/constants/app_config.dart';
import 'package:kiosk_app/core/error/failure.dart';
import 'package:kiosk_app/core/error/result.dart';
import 'package:kiosk_app/core/network/api_client.dart';
import 'package:kiosk_app/core/network/failure_mapper.dart';
import 'support/scripted_adapter.dart';

AppConfig config() => switch (AppConfig.parse('https://unit.test/api/v1')) {
  Success(:final value) => value,
  Failed() => throw StateError('Test configuration invalid'),
};
void main() {
  test(
    'configuration accepts only an HTTPS API origin with no credentials/query/fragment',
    () {
      for (final value in [
        '',
        'http://unit.test/api/v1',
        'https://secret@unit.test/api/v1',
        'https://unit.test/api/v1?phone=sensitive',
        'https://unit.test/api/v1#secret',
        'https://unit.test/',
      ]) {
        expect(AppConfig.parse(value), isA<Failed<AppConfig>>());
      }
      expect(
        AppConfig.parse('https://unit.test/api/v1'),
        isA<Success<AppConfig>>(),
      );
    },
  );
  test('health uses the real root contract and configured origin', () async {
    final adapter = ScriptedAdapter([
      (r) => jsonReply({'status': 'ok'}),
    ]);
    final dio = Dio()..httpClientAdapter = adapter;
    final client = ApiClient(config(), dio: dio);
    expect(await client.rootHealth(), isA<Success<Object?>>());
    expect(adapter.requests.single.uri.toString(), 'https://unit.test/healthz');
    expect(dio.options.connectTimeout, const Duration(seconds: 10));
    expect(dio.options.followRedirects, isFalse);
    client.close();
    expect(adapter.closed, isTrue);
  });
  test('transient GET failures back off and retry at most twice', () async {
    final adapter = ScriptedAdapter([
      (r) => jsonReply({}, 503),
      (r) => jsonReply({}, 502),
      (r) => jsonReply({'status': 'ok'}),
    ]);
    final delays = <Duration>[];
    final client = ApiClient(
      config(),
      dio: Dio()..httpClientAdapter = adapter,
      delay: (d) async {
        delays.add(d);
      },
    );
    addTearDown(client.close);
    expect(await client.rootHealth(), isA<Success<Object?>>());
    expect(adapter.requests.length, 3);
    expect(delays, [
      const Duration(milliseconds: 250),
      const Duration(milliseconds: 500),
    ]);
  });
  test(
    'retry exhaustion returns a safe failure and no raw server text',
    () async {
      final adapter = ScriptedAdapter(
        List.generate(
          3,
          (_) =>
              (r) => jsonReply({'error': 'private-server-detail'}, 503),
        ),
      );
      final client = ApiClient(
        config(),
        dio: Dio()..httpClientAdapter = adapter,
        delay: (_) async {},
      );
      addTearDown(client.close);
      final result = await client.rootHealth();
      expect(result, isA<Failed<Object?>>());
      if (result case Failed(:final failure)) {
        expect(failure, isA<ServerFailure>());
      }
      expect(adapter.requests.length, 3);
    },
  );
  test('authentication and validation failures are never retried', () async {
    for (final status in [401, 403, 422]) {
      final adapter = ScriptedAdapter([(r) => jsonReply({}, status)]);
      final client = ApiClient(
        config(),
        dio: Dio()..httpClientAdapter = adapter,
        delay: (_) async {},
      );
      await client.rootHealth();
      expect(adapter.requests.length, 1);
      client.close();
    }
  });
  test(
    'unverified writes and empty idempotency keys are not retried',
    () async {
      for (final verified in [false, true]) {
        final adapter = ScriptedAdapter([(r) => jsonReply({}, 503)]);
        final dio = Dio()..httpClientAdapter = adapter;
        dio.interceptors.add(
          IdempotentRetryInterceptor(dio, delay: (_) async {}),
        );
        await expectLater(
          dio.post<Object?>(
            'https://unit.test/api/v1/unused',
            data: <String, Object?>{'note': 'private'},
            options: Options(
              extra: {'verifiedIdempotent': verified},
              headers: {'Idempotency-Key': ''},
            ),
          ),
          throwsA(isA<DioException>()),
        );
        expect(adapter.requests.length, 1);
        dio.close();
      }
    },
  );
  test(
    'explicitly verified repeatable writes preserve their nonempty key',
    () async {
      final adapter = ScriptedAdapter([
        (r) => jsonReply({}, 503),
        (r) => jsonReply({}),
      ]);
      final dio = Dio()..httpClientAdapter = adapter;
      dio.interceptors.add(
        IdempotentRetryInterceptor(dio, delay: (_) async {}),
      );
      await dio.post<Object?>(
        'https://unit.test/api/v1/unused',
        data: <String, Object?>{'note': 'private'},
        options: Options(
          extra: {'verifiedIdempotent': true},
          headers: {'Idempotency-Key': 'test-request-key'},
        ),
      );
      expect(adapter.requests.length, 2);
      expect(
        adapter.requests.map((r) => r.headers['Idempotency-Key']),
        everyElement('test-request-key'),
      );
      dio.close();
    },
  );
  test('Retry-After delay is bounded', () async {
    final response = ResponseBody.fromString(
      '{}',
      429,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
        'retry-after': ['99999'],
      },
    );
    final adapter = ScriptedAdapter([(r) => response, (r) => jsonReply({})]);
    final delays = <Duration>[];
    final client = ApiClient(
      config(),
      dio: Dio()..httpClientAdapter = adapter,
      delay: (d) async {
        delays.add(d);
      },
    );
    await client.rootHealth();
    expect(delays, [const Duration(seconds: 10)]);
    client.close();
  });
  test('cancellation during backoff prevents a second request', () async {
    final token = CancelToken();
    final adapter = ScriptedAdapter([(r) => jsonReply({}, 503)]);
    final client = ApiClient(
      config(),
      dio: Dio()..httpClientAdapter = adapter,
      delay: (_) async {
        token.cancel('private');
      },
    );
    final result = await client.rootHealth(cancelToken: token);
    expect(result, isA<Failed<Object?>>());
    expect(adapter.requests.length, 1);
    client.close();
  });
  test('logger emits only allowlisted method, status and outcome', () async {
    final events = <SafeNetworkEvent>[];
    final adapter = ScriptedAdapter([
      (r) => jsonReply({'sensitive': 'never-log-this'}),
    ]);
    final client = ApiClient(
      config(),
      dio: Dio()..httpClientAdapter = adapter,
      auditSink: events.add,
    );
    await client.rootHealth();
    expect(events, isNotEmpty);
    expect(events.single.method, 'GET');
    expect(events.single.statusCode, 200);
    expect(events.single.toString(), isNot(contains('never-log-this')));
    client.close();
  });
  test('all Dio failures map to safe sealed failures', () {
    for (final type in DioExceptionType.values) {
      final error = DioException(
        requestOptions: RequestOptions(),
        type: type,
        error: StateError('sensitive'),
      );
      expect(mapDioFailure(error), isA<Failure>());
      expect(mapDioFailure(error).toString(), isNot(contains('sensitive')));
    }
  });
}
