import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";
import "package:kiosk_app/core/constants/app_strings.dart";
import "package:kiosk_app/features/intake/presentation/providers/intake_provider.dart";

class LanguageScreen extends ConsumerWidget {
  const LanguageScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final languages = [
      {"name": "Hindi", "native": "हिन्दी", "code": "hi"},
      {"name": "English", "native": "English", "code": "en"},
      {"name": "Telugu", "native": "తెలుగు", "code": "te"},
      {"name": "Tamil", "native": "தமிழ்", "code": "ta"},
      {"name": "Marathi", "native": "मराठी", "code": "mr"},
      {"name": "Bengali", "native": "বাংলা", "code": "bn"},
      {"name": "Kannada", "native": "ಕನ್ನಡ", "code": "kn"},
      {"name": "Gujarati", "native": "ગુજરાતી", "code": "gu"},
    ];

    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth > 800;
            final crossAxisCount = isWide ? 4 : 2;

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              AppStrings.appName,
                              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: AppColors.primaryLight,
                              ),
                            ),
                            Text(
                              AppStrings.hospitalName,
                              overflow: TextOverflow.ellipsis,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(Icons.mic, color: AppColors.primaryLight, size: 16),
                            SizedBox(width: 6),
                            Text("Sarvam Voice AI", style: TextStyle(fontSize: 11, color: Colors.white)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  const Icon(Icons.record_voice_over, size: 60, color: AppColors.primaryLight),
                  const SizedBox(height: 12),
                  Text(
                    "कृपया अपनी पसंदीदा भाषा चुनें",
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  const Text("Select your preferred language to begin voice case-taking", textAlign: TextAlign.center, style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                  const SizedBox(height: 24),
                  Expanded(
                    flex: 4,
                    child: GridView.builder(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: crossAxisCount,
                        childAspectRatio: isWide ? 2.2 : 2.0,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                      ),
                      itemCount: languages.length,
                      itemBuilder: (context, idx) {
                        final l = languages[idx];
                        return InkWell(
                          onTap: () {
                            ref.read(intakeProvider.notifier).setLanguage(l["name"]!);
                            context.go("/identify");
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.surfaceElevated, width: 1.5),
                            ),
                            child: Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(l["native"]!, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                                  Text(l["name"]!, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const Spacer(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.security, size: 14, color: AppColors.textMuted),
                      SizedBox(width: 6),
                      Text("DPDPA 2023 Compliant • 100% In-Country Voice Processing", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
