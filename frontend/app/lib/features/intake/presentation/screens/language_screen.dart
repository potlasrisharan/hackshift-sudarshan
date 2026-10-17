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
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          tooltip: "Back to Portals",
          onPressed: () => context.canPop() ? context.pop() : context.go("/"),
        ),
        title: const Text("Select Language / भाषा चुनें"),
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth > 800;
            final crossAxisCount = isWide ? 4 : 2;

            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
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
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              margin: const EdgeInsets.only(bottom: 8),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Image.asset(
                                "assets/images/ayusetu_logo.png",
                                height: 28,
                                fit: BoxFit.contain,
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
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
                  const SizedBox(height: 24),
                  const Icon(Icons.record_voice_over, size: 54, color: AppColors.primaryLight),
                  const SizedBox(height: 12),
                  Text(
                    "कृपया अपनी पसंदीदा भाषा चुनें",
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    "Select your preferred language to begin voice case-taking",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 20),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
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
                          context.push("/identify");
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
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.security, size: 14, color: AppColors.textMuted),
                      SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          "DPDPA 2023 Compliant • 100% In-Country Voice Processing",
                          style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                          textAlign: TextAlign.center,
                        ),
                      ),
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
