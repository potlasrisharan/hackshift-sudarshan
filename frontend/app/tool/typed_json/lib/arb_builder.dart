import 'dart:convert';
import 'package:build/build.dart';

/// Generates the AppStrings delegate from the four ARBs with Object? JSON
/// boundaries and no generated null assertions or untyped delegate lists.
class TypedArbBuilder implements Builder {
  @override
  Map<String, List<String>> get buildExtensions => const {
    'lib/l10n/app_en.arb': ['lib/core/localization/app_strings.dart'],
  };
  @override
  Future<void> build(BuildStep step) async {
    const locales = ['en', 'hi', 'pa', 'ta'];
    final translations = <String, Map<String, String>>{};
    for (final locale in locales) {
      final source = await step.readAsString(
        AssetId(step.inputId.package, 'lib/l10n/app_$locale.arb'),
      );
      final Object? decoded = jsonDecode(source);
      if (decoded is! Map<String, Object?>) {
        throw StateError('ARB must be an object');
      }
      final values = <String, String>{};
      for (final entry in decoded.entries) {
        if (entry.key.startsWith('@')) continue;
        if (!RegExp(r'^[a-zA-Z][a-zA-Z0-9]*$').hasMatch(entry.key) ||
            entry.value is! String) {
          throw StateError('ARB keys must be identifiers with string values');
        }
        values[entry.key] = entry.value as String;
      }
      translations[locale] = values;
    }
    final english = translations['en'] ?? const <String, String>{};
    for (final values in translations.values) {
      if (values.length != english.length ||
          !values.keys.toSet().containsAll(english.keys)) {
        throw StateError('All four ARBs must contain exactly the same keys');
      }
    }
    String literal(String value) => jsonEncode(value).replaceAll(r'$', r'\$');
    final output = StringBuffer('''
// GENERATED CODE - DO NOT MODIFY BY HAND.
// Source: lib/l10n/app_{en,hi,pa,ta}.arb; build_runner typed ARB generator.
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

final class AppStrings {
  final String localeName;
  const AppStrings._(this.localeName);
  static AppStrings of(BuildContext context) =>
      Localizations.of<AppStrings>(context, AppStrings) ??
      lookupAppStrings(Localizations.maybeLocaleOf(context) ?? const Locale('en'));
  static const LocalizationsDelegate<AppStrings> delegate = _AppStringsDelegate();
  static const List<LocalizationsDelegate<Object>> localizationsDelegates = [
    delegate, GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate, GlobalWidgetsLocalizations.delegate,
  ];
  static const supportedLocales = [Locale('en'),Locale('hi'),Locale('pa'),Locale('ta')];
''');
    for (final key in english.keys) {
      output.writeln('  String get $key => switch (localeName) {');
      for (final locale in locales.skip(1)) {
        final value = translations[locale]?[key];
        if (value == null) throw StateError('Missing translation');
        output.writeln("    '$locale' => ${literal(value)},");
      }
      output.writeln('    _ => ${literal(english[key] ?? '')},\n  };');
    }
    output.writeln('''
}
AppStrings lookupAppStrings(Locale locale) => AppStrings._(
    {'en','hi','pa','ta'}.contains(locale.languageCode) ? locale.languageCode : 'en');
final class _AppStringsDelegate extends LocalizationsDelegate<AppStrings> {
  const _AppStringsDelegate();
  @override
  Future<AppStrings> load(Locale locale) => SynchronousFuture(lookupAppStrings(locale));
  @override
  bool isSupported(Locale locale) => {'en','hi','pa','ta'}.contains(locale.languageCode);
  @override
  bool shouldReload(_AppStringsDelegate old) => false;
}
''');
    await step.writeAsString(step.allowedOutputs.single, output.toString());
  }
}

Builder typedArb(BuilderOptions options) => TypedArbBuilder();
