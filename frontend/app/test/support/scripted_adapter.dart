import 'dart:async';
import 'dart:collection';
import 'dart:convert';
import 'dart:typed_data';
import 'package:dio/dio.dart';

typedef Reply = FutureOr<ResponseBody> Function(RequestOptions options);

class ScriptedAdapter implements HttpClientAdapter {
  final Queue<Reply> replies;
  final requests = <RequestOptions>[];
  bool closed = false;
  ScriptedAdapter(List<Reply> replies) : replies = Queue.of(replies);
  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    requests.add(options);
    if (replies.isEmpty) throw StateError('Unexpected request');
    return await replies.removeFirst()(options);
  }

  @override
  void close({bool force = false}) {
    closed = true;
  }
}

ResponseBody jsonReply(Object? body, [int status = 200]) =>
    ResponseBody.fromString(
      jsonEncode(body),
      status,
      headers: {
        Headers.contentTypeHeader: [Headers.jsonContentType],
      },
    );
