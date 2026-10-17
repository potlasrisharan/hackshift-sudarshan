import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";
import "package:kiosk_app/core/constants/app_strings.dart";
import "package:kiosk_app/core/widgets/app_scaffold_shell.dart";
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
      backgroundColor: AppColors.clinicalBg,
      appBar: AppBar(
        backgroundColor: AppColors.clinicalCard,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.clinicalTextPrimary),
        titleTextStyle: const TextStyle(
          color: AppColors.clinicalTextPrimary,
          fontSize: 17,
          fontWeight: FontWeight.w700,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          tooltip: "Back to Portals",
          onPressed: () => context.canPop() ? context.pop() : context.go("/"),
        ),
        title: const Text("Select Language / भाषा चुनें"),
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(1),
          child: Divider(height: 1, thickness: 1, color: AppColors.clinicalBorder),
        ),
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
                            const Padding(
                              padding: EdgeInsets.only(bottom: 6),
                              child: AyuSetuLogoBadge(
                                height: 26,
                                borderRadius: 10,
                                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              ),
                            ),
                            Text(
                              AppStrings.hospitalName,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppColors.clinicalTextMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.medicalTeal.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.medicalTeal.withValues(alpha: 0.2)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.mic, color: AppColors.medicalTeal, size: 15),
                            SizedBox(width: 6),
                            Text(
                              "Sarvam Voice AI",
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppColors.medicalTeal,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.medicalTeal.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.record_voice_over_rounded, size: 40, color: AppColors.medicalTeal),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    "कृपया अपनी पसंदीदा भाषा चुनें",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: AppColors.clinicalTextPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    "Select your preferred language to begin voice case-taking",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppColors.clinicalTextMuted, fontSize: 13),
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
                            color: AppColors.clinicalCard,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.clinicalBorder, width: 1.5),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF0F172A).withValues(alpha: 0.04),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  l["native"]!,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.clinicalTextPrimary,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  l["name"]!,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.medicalTeal,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 24),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.security, size: 14, color: AppColors.clinicalTextMuted),
                      SizedBox(width: 6),
                      Flexible(
                        child: Text(
                          "DPDPA 2023 Compliant • 100% In-Country Voice Processing",
                          style: TextStyle(fontSize: 11, color: AppColors.clinicalTextMuted),
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
