import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kiosk_app/core/error/result.dart';
import 'package:kiosk_app/core/network/api_client.dart';
import 'package:kiosk_app/core/localization/app_strings.dart';
import 'package:kiosk_app/features/intake/data/repositories/intake_repository_impl.dart';
import 'package:kiosk_app/features/intake/domain/entities/intake_flow_state.dart';
import 'package:kiosk_app/features/intake/domain/repositories/speech_input.dart';
import 'package:kiosk_app/features/intake/presentation/providers/core_providers.dart';
import 'package:kiosk_app/features/intake/presentation/providers/speech_providers.dart';
import 'package:kiosk_app/main.dart';
import 'support/scripted_adapter.dart';
import 'core_test.dart' show config;
import 'intake_test.dart' show receiptJson, receiptId;

Future<void> reveal(WidgetTester tester, Finder finder) async {
  if (finder.evaluate().isEmpty) {
    tester
        .state<ScrollableState>(find.byType(Scrollable).first)
        .position
        .jumpTo(0);
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      finder,
      300,
      scrollable: find.byType(Scrollable).first,
    );
  }
  await tester.ensureVisible(finder);
  await tester.pumpAndSettle();
}

Future<void> tap(WidgetTester tester, Finder finder) async {
  await reveal(tester, finder);
  await tester.tap(finder);
  await tester.pumpAndSettle();
}

final class FakeSpeech implements SpeechInput {
  bool ready = true;
  bool throwOnStart = false;
  int stops = 0;
  SpeechText? onText;
  SpeechLevel? onLevel;
  void Function()? onDone;
  @override
  bool get supported => true;
  @override
  Future<bool> start(
    String locale,
    SpeechText text,
    SpeechLevel level,
    void Function() done,
  ) async {
    if (throwOnStart) throw StateError('permission denied');
    onText = text;
    onLevel = level;
    onDone = done;
    return ready;
  }

  @override
  Future<void> stop() async {
    stops++;
  }
}

void main() {
  for (final language in [
    KioskLanguage.en,
    KioskLanguage.hi,
    KioskLanguage.ta,
    KioskLanguage.pa,
  ]) {
    testWidgets(
      'full typed intake, consent, receipt and reset in ${language.name}',
      (tester) async {
        tester.view.physicalSize = const Size(800, 1280);
        tester.view.devicePixelRatio = 1;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);
        if (language == KioskLanguage.hi || language == KioskLanguage.ta) {
          tester.platformDispatcher.textScaleFactorTestValue = 2;
          addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
        }
        final adapter = ScriptedAdapter([
          (_) => jsonReply({
            'token': 'opaque',
            'expiresAt': DateTime.now()
                .add(const Duration(hours: 1))
                .toIso8601String(),
          }),
          (_) => jsonReply(receiptJson(), 201),
        ]);
        final client = ApiClient(
          config(),
          dio: Dio()..httpClientAdapter = adapter,
          delay: (_) async {},
        );
        addTearDown(client.close);
        final container = ProviderContainer(
          overrides: [
            intakeRepositoryProvider.overrideWithValue(
              Success(IntakeRepositoryImpl(client, CancelToken())),
            ),
            kioskClockProvider.overrideWithValue(
              () => tester.binding.clock.now(),
            ),
          ],
        );
        addTearDown(container.dispose);
        if (language == KioskLanguage.hi || language == KioskLanguage.ta) {
          container.read(preferencesProvider.notifier).elderMode(true);
        }
        await tester.pumpWidget(
          UncontrolledProviderScope(
            container: container,
            child: const DhaagaApp(),
          ),
        );
        await tester.pumpAndSettle();
        await tap(tester, find.byKey(Key('language-${language.name}')));
        final s = lookupAppStrings(Locale(language.name));
        await tap(tester, find.byKey(const Key('continue')));
        for (final entry in {
          'organization': 'org',
          'email': 'staff@example.test',
          'password': 'synthetic-test',
        }.entries) {
          await reveal(tester, find.byKey(Key(entry.key)));
          await tester.enterText(find.byKey(Key(entry.key)), entry.value);
        }
        await tap(tester, find.text(s.signIn));
        await reveal(tester, find.byKey(const Key('patient-name')));
        await tester.enterText(
          find.byKey(const Key('patient-name')),
          'Synthetic widget patient',
        );
        await reveal(tester, find.byKey(const Key('birth-date')));
        await tester.enterText(
          find.byKey(const Key('birth-date')),
          '1980-02-29',
        );
        await tester.pumpAndSettle();
        await tap(
          tester,
          find.widgetWithText(SwitchListTile, s.syntheticConfirm),
        );
        await tap(tester, find.text(s.next));
        await reveal(tester, find.byKey(const Key('complaint')));
        await tester.enterText(
          find.byKey(const Key('complaint')),
          'Synthetic widget complaint',
        );
        for (final symptom in ['chestPain', 'breathless', 'fainting']) {
          await tap(tester, find.byKey(Key('answer-$symptom')));
          await tester.tap(find.text(s.no).last);
          await tester.pumpAndSettle();
        }
        await tap(tester, find.text(s.review));
        final submit = find.byKey(const Key('submit-intake'));
        await reveal(tester, submit);
        expect(
          tester
              .widget<FilledButton>(
                find.descendant(
                  of: submit,
                  matching: find.byType(FilledButton),
                ),
              )
              .onPressed,
          isNull,
        );
        await tap(tester, find.byKey(const Key('care-consent')));
        await tap(tester, submit);
        await reveal(tester, find.byKey(const Key('encounter-reference')));
        expect(find.byKey(const Key('encounter-reference')), findsOneWidget);
        expect(find.text(receiptId), findsOneWidget);
        await reveal(tester, find.text(s.tokenUnavailable));
        expect(find.text(s.tokenUnavailable), findsOneWidget);
        expect(adapter.requests.length, 2);
        final request = adapter.requests.last.data as Map<String, Object?>;
        expect(request['chiefComplaint'], 'Synthetic widget complaint');
        expect(request['careConsent'], true);
        await tester.pump(const Duration(seconds: 40));
        await tester.pump();
        expect(
          tester.widget<Text>(find.byKey(const Key('reset-countdown'))).data,
          anyOf(endsWith(': 20'), endsWith(': 21')),
        );
        // An interaction extends the full idle window; then real elapsed time expires it.
        await tester.tap(find.byKey(const Key('reset-countdown')));
        await tester.pump();
        await tester.pump(const Duration(seconds: 40));
        await tester.pump();
        expect(
          container.read(intakeFlowProvider).valueOrNull,
          isA<IntakeComplete>(),
        );
        await tester.pump(const Duration(seconds: 21));
        await tester.pumpAndSettle();
        expect(
          container.read(intakeFlowProvider).valueOrNull,
          isA<ChoosingLanguage>(),
        );
        expect(find.text(receiptId), findsNothing);
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox.shrink());
        await tester.pump();
      },
    );
  }
  testWidgets(
    'speech denial and exceptions keep typed fallback; silence stops capture',
    (tester) async {
      final input = FakeSpeech();
      final c = ProviderContainer(
        overrides: [speechInputProvider.overrideWithValue(input)],
      );
      addTearDown(c.dispose);
      final sub = c.listen(voiceControllerProvider, (_, next) {});
      addTearDown(sub.close);
      await c.read(voiceControllerProvider.future);
      input.ready = false;
      await c.read(voiceControllerProvider.notifier).start('hi-IN', 'previous');
      expect(
        c.read(voiceControllerProvider).valueOrNull?.status,
        VoiceStatus.typedFallback,
      );
      input.ready = true;
      await c.read(voiceControllerProvider.notifier).start('hi-IN', 'previous');
      input.onText?.call('new transcript');
      input.onLevel?.call(4);
      expect(
        c.read(voiceControllerProvider).valueOrNull?.transcript,
        'previous new transcript',
      );
      expect(
        c.read(voiceControllerProvider).valueOrNull?.level,
        greaterThan(0),
      );
      await tester.pump(const Duration(seconds: 6));
      expect(
        c.read(voiceControllerProvider).valueOrNull?.status,
        VoiceStatus.idle,
      );
      input.onText?.call('late audio');
      expect(
        c.read(voiceControllerProvider).valueOrNull?.transcript,
        'previous new transcript',
      );
      input.throwOnStart = true;
      await c.read(voiceControllerProvider.notifier).start('hi-IN', 'previous');
      expect(
        c.read(voiceControllerProvider).valueOrNull?.status,
        VoiceStatus.typedFallback,
      );
    },
  );
}
