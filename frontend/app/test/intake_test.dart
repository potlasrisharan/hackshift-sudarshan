import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kiosk_app/core/error/failure.dart';
import 'package:kiosk_app/core/error/result.dart';
import 'package:kiosk_app/core/network/api_client.dart';
import 'package:kiosk_app/features/intake/data/dtos/intake_dto.dart';
import 'package:kiosk_app/features/intake/data/repositories/intake_repository_impl.dart';
import 'package:kiosk_app/features/intake/domain/entities/intake_draft.dart';
import 'package:kiosk_app/features/intake/domain/entities/intake_flow_state.dart';
import 'package:kiosk_app/features/intake/domain/repositories/intake_repository.dart';
import 'package:kiosk_app/features/intake/domain/use_cases/submit_intake.dart';
import 'package:kiosk_app/features/intake/presentation/providers/core_providers.dart';
import 'support/scripted_adapter.dart';
import 'core_test.dart' show config;

const receiptId = '4b5ba711-d4e2-423d-a33e-9c9a002c037e';
final draft = IntakeDraft(
  language: KioskLanguage.pa,
  name: 'Synthetic case',
  birthDate: '1980-02-29',
  synthetic: true,
  complaint: 'Synthetic test complaint',
  consent: true,
  answers: {
    Symptom.chestPain: Answer.no,
    Symptom.breathless: Answer.no,
    Symptom.fainting: Answer.no,
  },
);
final session = StaffSession(
  'test-opaque',
  DateTime.now().add(const Duration(hours: 1)),
);
final receipt = EncounterReceipt(
  id: receiptId,
  patientId: 'patient',
  clinicId: 'clinic',
  status: 'waiting',
  createdAt: DateTime.utc(2026),
  consentActive: true,
);
Map<String, Object?> receiptJson({String status = 'waiting'}) => {
  'id': receiptId,
  'patientId': 'patient',
  'clinicId': 'clinic',
  'status': status,
  'createdAt': '2026-10-17T00:00:00.000Z',
  'consentActive': true,
};

final class FakeIntake implements IntakeRepository {
  int logins = 0;
  final keys = <String>[];
  final drafts = <IntakeDraft>[];
  Future<Result<EncounterReceipt>> Function()? response;
  Future<Result<StaffSession>>? loginResult;
  @override
  Future<Result<StaffSession>> login(
    String org,
    String email,
    String password,
  ) {
    logins++;
    return loginResult ?? Future.value(Success(session));
  }

  @override
  Future<Result<EncounterReceipt>> submit(
    IntakeDraft draft,
    StaffSession session,
    String key,
  ) {
    keys.add(key);
    drafts.add(draft);
    return response?.call() ?? Future.value(Success(receipt));
  }
}

Future<ProviderContainer> containerFor(FakeIntake repo) async {
  final c = ProviderContainer(
    overrides: [intakeRepositoryProvider.overrideWithValue(Success(repo))],
  );
  await c.read(intakeFlowProvider.future);
  c.read(intakeFlowProvider.notifier).chooseLanguage(KioskLanguage.pa);
  await c
      .read(intakeFlowProvider.notifier)
      .login('org', 'test@example.test', 'test');
  return c;
}

void main() {
  test('draft and DTO defensively copy mutable answer maps', () {
    final answers = <Symptom, Answer>{Symptom.chestPain: Answer.yes};
    final value = IntakeDraft(language: KioskLanguage.en, answers: answers);
    answers.clear();
    expect(value.danger, isTrue);
    expect(() => value.answers.clear(), throwsUnsupportedError);
    final raw = <String, String>{'chestPain': 'yes'};
    final dto = IntakeRequestDto(
      patient: IntakeRequestDto.fromDomain(draft).patient,
      chiefComplaint: 'test',
      answers: raw,
      careConsent: true,
      synthetic: true,
    );
    raw.clear();
    expect(dto.answers['chestPain'], 'yes');
    expect(() => dto.answers.clear(), throwsUnsupportedError);
  });
  test(
    'Indian phone and ABHA validation rejects whitespace, prefixes and bad lengths',
    () {
      expect(IntakeValidation.phone('9876543210'), isTrue);
      for (final s in [
        '',
        '5876543210',
        '+919876543210',
        '987654321',
        '98765432100',
        ' 9876543210',
      ]) {
        expect(IntakeValidation.phone(s), isFalse);
      }
      expect(IntakeValidation.abha('12345678901234'), isTrue);
      for (final s in [
        '',
        '1234567890123',
        '123456789012345',
        '1234567890123a',
      ]) {
        expect(IntakeValidation.abha(s), isFalse);
      }
    },
  );
  test('birth date validation rejects normalization and future dates', () {
    final now = DateTime.utc(2026, 10, 17);
    for (final s in [
      '2025-02-29',
      '1980-02-30',
      '2026-10-18',
      '1980-13-01',
      '1980-1-01',
      'bad',
    ]) {
      expect(IntakeValidation.birthDate(s, now), isFalse);
    }
    expect(IntakeValidation.birthDate('1980-02-29', now), isTrue);
    expect(IntakeValidation.birthDate('2026-10-17', now), isTrue);
  });
  test('identity, red flags and consent gate submission', () {
    expect(draft.canSubmit, isTrue);
    expect(draft.copyWith(synthetic: false).canSubmit, isFalse);
    expect(draft.copyWith(name: ' ').canSubmit, isFalse);
    expect(draft.copyWith(consent: false).canSubmit, isFalse);
    expect(draft.copyWith(complaint: 'ab').canSubmit, isFalse);
    expect(draft.copyWith(answers: {}).canSubmit, isFalse);
    expect(
      draft.copyWith(answers: {Symptom.chestPain: Answer.yes}).canSubmit,
      isTrue,
    );
    expect(
      draft.copyWith(answers: {Symptom.chestPain: Answer.yes}).danger,
      isTrue,
    );
  });
  test('keys are fresh UUID v4 values', () {
    final keys = List.generate(100, (_) => IntakeValidation.newKey());
    expect(keys.toSet().length, 100);
    for (final key in keys) {
      expect(
        key,
        matches(
          RegExp(
            r'^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$',
          ),
        ),
      );
    }
  });
  test(
    'request DTO matches shared strict schema and never adds identifiers',
    () {
      final dto = IntakeRequestDto.fromDomain(draft);
      final json = dto.toJson();
      expect(
        json.keys,
        unorderedEquals([
          'patient',
          'chiefComplaint',
          'answers',
          'careConsent',
          'synthetic',
        ]),
      );
      expect(json['patient'], {
        'name': 'Synthetic case',
        'birthDate': '1980-02-29',
        'gender': 'unknown',
        'language': 'pa-IN',
      });
      expect(IntakeRequestDto.fromJson(json).toJson(), json);
      expect(
        PatientInputDto.fromJson(dto.patient.toJson()).toJson(),
        dto.patient.toJson(),
      );
    },
  );
  test(
    'receipt parser accepts emergency and rejects invalid or revoked responses',
    () {
      expect(
        EncounterDto.fromJson(
          receiptJson(status: 'emergency'),
        ).toDomain().emergency,
        isTrue,
      );
      expect(
        EncounterDto.fromJson(receiptJson()).toJson()['status'],
        'waiting',
      );
      for (final body in [
        receiptJson(status: 'routine'),
        {...receiptJson(), 'id': 'fake-token'},
        {...receiptJson(), 'consentActive': false},
        {...receiptJson(), 'clinicId': ''},
      ]) {
        expect(
          () => EncounterDto.fromJson(body).toDomain(),
          throwsFormatException,
        );
      }
    },
  );
  test(
    'login maps safe response, rejects expired and malformed values',
    () async {
      final adapter = ScriptedAdapter([
        (_) => jsonReply({
          'token': 'opaque',
          'expiresAt': session.expiresAt.toIso8601String(),
        }),
        (_) => jsonReply({'token': '', 'expiresAt': '2000-01-01T00:00:00Z'}),
        (_) => jsonReply([]),
        (_) => jsonReply({'token': 42}),
        (_) => jsonReply({}, 401),
      ]);
      final client = ApiClient(
        config(),
        dio: Dio()..httpClientAdapter = adapter,
        delay: (_) async {},
      );
      addTearDown(client.close);
      final repo = IntakeRepositoryImpl(client, CancelToken());
      expect(
        await repo.login('org', 'test@example.test', 'synthetic'),
        isA<Success<StaffSession>>(),
      );
      for (var i = 0; i < 4; i++) {
        expect(
          await repo.login('org', 'test@example.test', 'synthetic'),
          isA<Failed<StaffSession>>(),
        );
      }
      expect(adapter.requests.first.uri.path, '/api/v1/auth/login');
      expect(
        adapter.requests.first.headers.containsKey('Idempotency-Key'),
        isFalse,
      );
      expect(
        LoginResponseDto.fromJson({
          'token': 'opaque',
          'expiresAt': session.expiresAt.toIso8601String(),
        }).toJson()['token'],
        'opaque',
      );
    },
  );
  test('encounter retry preserves key, authorization and exact JSON', () async {
    final adapter = ScriptedAdapter([
      (_) => jsonReply({}, 503),
      (_) => jsonReply(receiptJson(), 201),
    ]);
    final client = ApiClient(
      config(),
      dio: Dio()..httpClientAdapter = adapter,
      delay: (_) async {},
    );
    addTearDown(client.close);
    final key = IntakeValidation.newKey();
    final result = await IntakeRepositoryImpl(
      client,
      CancelToken(),
    ).submit(draft, session, key);
    expect(result, isA<Success<EncounterReceipt>>());
    expect(adapter.requests.length, 2);
    for (final request in adapter.requests) {
      expect(request.uri.path, '/api/v1/encounters');
      expect(request.headers['Idempotency-Key'], key);
      expect(request.headers['Authorization'], 'Bearer test-opaque');
      expect(request.data, IntakeRequestDto.fromDomain(draft).toJson());
    }
  });
  test(
    'malformed encounter and server conflict become typed failures',
    () async {
      final adapter = ScriptedAdapter([
        (_) => jsonReply([]),
        (_) => jsonReply({'id': 12}),
        (_) => jsonReply({}, 409),
      ]);
      final client = ApiClient(
        config(),
        dio: Dio()..httpClientAdapter = adapter,
        delay: (_) async {},
      );
      addTearDown(client.close);
      final repo = IntakeRepositoryImpl(client, CancelToken());
      for (var i = 0; i < 3; i++) {
        expect(
          await repo.submit(draft, session, IntakeValidation.newKey()),
          isA<Failed<EncounterReceipt>>(),
        );
      }
      expect(adapter.requests.length, 3);
    },
  );
  test(
    'use case rejects invalid input, expired session and invalid key before network',
    () async {
      final repo = FakeIntake();
      final use = SubmitIntake(repo);
      expect(
        await use(
          draft.copyWith(consent: false),
          session,
          IntakeValidation.newKey(),
        ),
        isA<Failed<EncounterReceipt>>(),
      );
      expect(
        await use(
          draft,
          StaffSession('token', DateTime.utc(2000)),
          IntakeValidation.newKey(),
        ),
        isA<Failed<EncounterReceipt>>(),
      );
      expect(await use(draft, session, 'bad'), isA<Failed<EncounterReceipt>>());
      expect(repo.keys, isEmpty);
    },
  );
  test(
    'flow freezes failed payload and reuses key, then drops draft and credentials',
    () async {
      final repo = FakeIntake();
      final c = await containerFor(repo);
      addTearDown(c.dispose);
      final notifier = c.read(intakeFlowProvider.notifier);
      notifier.edit(draft);
      notifier.step(IntakeStep.summary);
      repo.response = () async => const Failed(NetworkFailure());
      await notifier.submit();
      final failed = c.read(intakeFlowProvider).valueOrNull;
      expect(failed, isA<EditingIntake>());
      expect(notifier.submissionLocked, isTrue);
      notifier.edit(draft.copyWith(complaint: 'changed'));
      notifier.step(IntakeStep.converse);
      repo.response = () async => Success(receipt);
      await notifier.submit();
      expect(repo.keys[0], repo.keys[1]);
      expect(repo.drafts[0], same(repo.drafts[1]));
      expect(c.read(intakeFlowProvider).valueOrNull, isA<IntakeComplete>());
      notifier.reset();
      expect(c.read(intakeFlowProvider).valueOrNull, isA<ChoosingLanguage>());
    },
  );
  test('double tap submits once and reset ignores a late response', () async {
    final repo = FakeIntake();
    final c = await containerFor(repo);
    addTearDown(c.dispose);
    final notifier = c.read(intakeFlowProvider.notifier);
    notifier.edit(draft);
    notifier.step(IntakeStep.summary);
    final pending = Completer<Result<EncounterReceipt>>();
    repo.response = () => pending.future;
    final request = notifier.submit();
    await notifier.submit();
    expect(repo.keys.length, 1);
    notifier.reset();
    pending.complete(Success(receipt));
    await request;
    expect(c.read(intakeFlowProvider).valueOrNull, isA<ChoosingLanguage>());
  });
  test(
    'reset ignores late sign-in and prevents duplicate authentication',
    () async {
      final repo = FakeIntake();
      final pending = Completer<Result<StaffSession>>();
      repo.loginResult = pending.future;
      final c = ProviderContainer(
        overrides: [intakeRepositoryProvider.overrideWithValue(Success(repo))],
      );
      addTearDown(c.dispose);
      await c.read(intakeFlowProvider.future);
      final notifier = c.read(intakeFlowProvider.notifier);
      notifier.chooseLanguage(KioskLanguage.en);
      final login = notifier.login('org', 'test@example.test', 'test');
      await notifier.login('org', 'test@example.test', 'test');
      expect(repo.logins, 1);
      notifier.reset();
      pending.complete(Success(session));
      await login;
      expect(c.read(intakeFlowProvider).valueOrNull, isA<ChoosingLanguage>());
    },
  );
  test(
    'flow rejects skipping identity, missing red flags and absent consent',
    () async {
      final repo = FakeIntake();
      final c = await containerFor(repo);
      addTearDown(c.dispose);
      final n = c.read(intakeFlowProvider.notifier);
      n.step(IntakeStep.summary);
      expect(
        (c.read(intakeFlowProvider).valueOrNull as EditingIntake).step,
        IntakeStep.identity,
      );
      n.edit(draft.copyWith(answers: {}));
      n.step(IntakeStep.summary);
      expect(
        (c.read(intakeFlowProvider).valueOrNull as EditingIntake).step,
        IntakeStep.identity,
      );
      n.edit(draft.copyWith(consent: false));
      n.step(IntakeStep.summary);
      await n.submit();
      expect(repo.keys, isEmpty);
    },
  );
}
