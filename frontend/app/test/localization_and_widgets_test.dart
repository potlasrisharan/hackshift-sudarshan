import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:kiosk_app/core/localization/app_strings.dart';
import 'package:kiosk_app/core/router/app_router.dart';
import 'package:kiosk_app/core/theme/app_theme.dart';
import 'package:kiosk_app/features/intake/domain/entities/intake_flow_state.dart';
import 'package:kiosk_app/features/intake/presentation/providers/core_providers.dart';
import 'package:kiosk_app/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    for (final family in [
      'NotoSans',
      'NotoSansDevanagari',
      'NotoSansGurmukhi',
      'NotoSansTamil',
    ]) {
      final loader = FontLoader(family)
        ..addFont(rootBundle.load('assets/fonts/$family.ttf'));
      await loader.load();
    }
  });
  test('four locales have translated labels and complete dictionaries', () {
    expect(
      AppStrings.supportedLocales.map((l) => l.languageCode),
      containsAll(['en', 'hi', 'pa', 'ta']),
    );
    for (final language in ['en', 'hi', 'pa', 'ta']) {
      final strings = lookupAppStrings(Locale(language));
      expect(strings.chooseLanguage, isNotEmpty);
      expect(strings.networkFailure, isNotEmpty);
      expect(strings.unavailableBody, isNotEmpty);
    }
    expect(
      lookupAppStrings(const Locale('hi')).chooseLanguage,
      contains('भाषा'),
    );
    expect(
      lookupAppStrings(const Locale('pa')).chooseLanguage,
      contains('ਭਾਸ਼ਾ'),
    );
    expect(
      lookupAppStrings(const Locale('ta')).chooseLanguage,
      contains('மொழி'),
    );
  });
  test(
    'Elder Mode primary and body foreground pairs meet AAA text contrast',
    () {
      final scheme = AppTheme.dark(elderMode: true).colorScheme;
      double contrast(Color a, Color b) {
        final values = [a.computeLuminance(), b.computeLuminance()]..sort();
        return (values.last + .05) / (values.first + .05);
      }

      expect(
        contrast(scheme.onSurface, scheme.surface),
        greaterThanOrEqualTo(7),
      );
      expect(contrast(scheme.primary, scheme.surface), greaterThanOrEqualTo(7));
      expect(
        contrast(scheme.onPrimary, scheme.primary),
        greaterThanOrEqualTo(7),
      );
      expect(
        contrast(scheme.onSurfaceVariant, scheme.surface),
        greaterThanOrEqualTo(7),
      );
      expect(contrast(scheme.error, scheme.surface), greaterThanOrEqualTo(7));
    },
  );
  for (final language in KioskLanguage.values) {
    testWidgets(
      'language picker renders ${language.name} at 2x scale with Elder Mode',
      (tester) async {
        tester.view.physicalSize = const Size(800, 1280);
        tester.view.devicePixelRatio = 1;
        tester.platformDispatcher.textScaleFactorTestValue = 2;
        addTearDown(tester.view.resetPhysicalSize);
        addTearDown(tester.view.resetDevicePixelRatio);
        addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
        final container = ProviderContainer();
        addTearDown(container.dispose);
        container.read(preferencesProvider.notifier).language(language);
        container.read(preferencesProvider.notifier).elderMode(true);

        await tester.pumpWidget(
          UncontrolledProviderScope(
            container: container,
            child: const DhaagaApp(),
          ),
        );
        await tester.pumpAndSettle();
        final labels = lookupAppStrings(Locale(language.name));
        expect(find.text(labels.chooseLanguage), findsOneWidget);
        await tester.scrollUntilVisible(
          find.byKey(Key('language-${language.name}')),
          300,
        );
        expect(find.byKey(Key('language-${language.name}')), findsOneWidget);
        expect(tester.takeException(), isNull);
        await tester.scrollUntilVisible(find.byKey(const Key('continue')), 300);
        await Scrollable.ensureVisible(
          tester.element(find.byKey(const Key('continue'))),
          alignment: 0.5,
        );
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const Key('continue')));
        await tester.pumpAndSettle();

        expect(find.text(labels.staffTitle), findsOneWidget);
        expect(tester.takeException(), isNull);
      },
    );
  }
  testWidgets('language controls expose semantics and minimum touch targets', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final semantics = tester.ensureSemantics();

    await tester.pumpWidget(const ProviderScope(child: DhaagaApp()));
    await tester.pumpAndSettle();
    for (final language in KioskLanguage.values) {
      final control = find.byKey(Key('language-${language.name}'));
      expect(tester.getSize(control).height, greaterThanOrEqualTo(48));
      expect(tester.getSize(control).width, greaterThanOrEqualTo(48));
    }
    expect(find.bySemanticsLabel('हिन्दी'), findsOneWidget);
    await tester.tap(find.byKey(const Key('language-ta')));
    await tester.pumpAndSettle();
    expect(
      find.text(lookupAppStrings(const Locale('ta')).chooseLanguage),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
    semantics.dispose();
  });
  testWidgets('deep links cannot display a fabricated queue token', (
    tester,
  ) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);
    await tester.pumpWidget(
      UncontrolledProviderScope(container: container, child: const DhaagaApp()),
    );
    await tester.pumpAndSettle();
    container.read(appRouterProvider).go('/queue');
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('language-en')), findsOneWidget);
    expect(find.text('#042'), findsNothing);
  });
}
