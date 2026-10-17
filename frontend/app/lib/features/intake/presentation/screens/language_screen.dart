import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/error/failure.dart';
import '../../../../core/error/localized_failure.dart';
import '../../../../core/localization/app_strings.dart';
import '../../domain/entities/intake_flow_state.dart';
import '../providers/core_providers.dart';
import '../widgets/kiosk_shell.dart';

class LanguageScreen extends ConsumerWidget {
  const LanguageScreen({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = AppStrings.of(context);
    final selected = ref.watch(preferencesProvider).language;
    final health = ref.watch(healthControllerProvider);
    final languageLabels = <KioskLanguage, String>{
      KioskLanguage.hi: strings.languageHindi,
      KioskLanguage.en: strings.languageEnglish,
      KioskLanguage.pa: strings.languagePunjabi,
      KioskLanguage.ta: strings.languageTamil,
    };
    return KioskShell(
      title: strings.chooseLanguage,
      children: [
        Text(strings.languageHint),
        const SizedBox(height: 20),
        LayoutBuilder(
          builder: (context, constraints) {
            final twoColumns =
                constraints.maxWidth >= 650 &&
                MediaQuery.textScalerOf(context).scale(1) < 1.8;
            final width = twoColumns
                ? (constraints.maxWidth - 16) / 2
                : constraints.maxWidth;
            return Wrap(
              spacing: 16,
              runSpacing: 16,
              children: [
                for (final language in KioskLanguage.values)
                  SizedBox(
                    width: width,
                    child: Semantics(
                      container: true,
                      button: true,
                      selected: selected == language,
                      label: languageLabels[language],
                      excludeSemantics: true,
                      onTap: () => ref
                          .read(preferencesProvider.notifier)
                          .language(language),
                      child: OutlinedButton(
                        key: Key('language-${language.name}'),
                        onPressed: () => ref
                            .read(preferencesProvider.notifier)
                            .language(language),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Row(
                            children: [
                              Icon(
                                selected == language
                                    ? Icons.radio_button_checked
                                    : Icons.radio_button_unchecked,
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Text(
                                  languageLabels[language] ??
                                      strings.languageEnglish,
                                  style: TextStyle(
                                    fontFamily: switch (language) {
                                      KioskLanguage.hi => 'NotoSansDevanagari',
                                      KioskLanguage.pa => 'NotoSansGurmukhi',
                                      KioskLanguage.ta => 'NotoSansTamil',
                                      KioskLanguage.en => 'NotoSans',
                                    },
                                    fontSize:
                                        ref.watch(preferencesProvider).elderMode
                                        ? 28
                                        : 24,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
        const SizedBox(height: 20),
        KioskAction(
          key: const Key('continue'),
          label: strings.next,
          onPressed: () {
            ref.read(intakeFlowProvider.notifier).chooseLanguage(selected);
            context.go('/identify');
          },
        ),
        const SizedBox(height: 28),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  strings.connectionTitle,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),
                health.when(
                  loading: () => Semantics(
                    container: true,
                    liveRegion: true,
                    child: Column(
                      children: [
                        const LinearProgressIndicator(),
                        const SizedBox(height: 12),
                        Text(strings.checking),
                      ],
                    ),
                  ),
                  error: (error, _) => Semantics(
                    container: true,
                    liveRegion: true,
                    child: Text(
                      localizedFailure(
                        error is Failure ? error : const UnknownFailure(),
                        strings,
                      ),
                    ),
                  ),
                  data: (value) => Semantics(
                    container: true,
                    liveRegion: true,
                    child: Text(
                      value == null ? strings.notChecked : strings.connected,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(strings.demoNotice),
                const SizedBox(height: 16),
                KioskAction(
                  key: const Key('check-connection'),
                  label: strings.checkConnection,
                  outlined: true,
                  onPressed: health.isLoading
                      ? null
                      : () => unawaited(
                          ref.read(healthControllerProvider.notifier).check(),
                        ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
