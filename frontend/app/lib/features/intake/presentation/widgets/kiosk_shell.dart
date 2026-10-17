import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/localization/app_strings.dart';
import '../providers/core_providers.dart';

class KioskShell extends ConsumerWidget {
  final String title;
  final List<Widget> children;
  const KioskShell({super.key, required this.title, required this.children});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final strings = AppStrings.of(context);
    final preferences = ref.watch(preferencesProvider);
    return Scaffold(
      body: SafeArea(
        child: FocusTraversalGroup(
          policy: WidgetOrderTraversalPolicy(),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 980),
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  Semantics(
                    header: true,
                    child: Text(
                      strings.appTitle,
                      style: Theme.of(context).textTheme.headlineLarge,
                    ),
                  ),
                  Text(
                    strings.tagline,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 20),
                  Semantics(
                    container: true,
                    label: strings.elderMode,
                    hint: strings.elderHint,
                    excludeSemantics: true,
                    toggled: preferences.elderMode,
                    onTap: () => ref
                        .read(preferencesProvider.notifier)
                        .elderMode(!preferences.elderMode),
                    child: SwitchListTile(
                      key: const Key('elder-mode'),
                      contentPadding: EdgeInsets.zero,
                      title: Text(strings.elderMode),
                      subtitle: Text(strings.elderHint),
                      value: preferences.elderMode,
                      onChanged: ref
                          .read(preferencesProvider.notifier)
                          .elderMode,
                    ),
                  ),
                  const Divider(height: 32),
                  Semantics(
                    header: true,
                    child: Text(
                      title,
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...children,
                  const SizedBox(height: 32),
                  Text(
                    strings.privacyNotice,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class KioskAction extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool outlined;
  const KioskAction({
    super.key,
    required this.label,
    required this.onPressed,
    this.outlined = false,
  });
  @override
  Widget build(BuildContext context) => Semantics(
    container: true,
    button: true,
    enabled: onPressed != null,
    label: label,
    onTap: onPressed,
    child: ExcludeSemantics(
      child: outlined
          ? OutlinedButton(
              onPressed: onPressed,
              child: Text(label, textAlign: TextAlign.center),
            )
          : FilledButton(
              onPressed: onPressed,
              child: Text(label, textAlign: TextAlign.center),
            ),
    ),
  );
}
