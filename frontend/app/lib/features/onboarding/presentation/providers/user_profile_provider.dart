import "package:flutter/foundation.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../data/models/user_profile_model.dart";
import "../../data/repositories/user_profile_repository.dart";
import "../../../auth/presentation/providers/auth_provider.dart";

final userProfileRepositoryProvider = Provider<UserProfileRepository>((ref) {
  return UserProfileRepository();
});

@immutable
class UserProfileState {
  final UserProfile profile;
  final bool isLoading;
  final String? errorMessage;

  const UserProfileState({
    required this.profile,
    this.isLoading = false,
    this.errorMessage,
  });

  UserProfileState copyWith({
    UserProfile? profile,
    bool? isLoading,
    String? errorMessage,
  }) {
    return UserProfileState(
      profile: profile ?? this.profile,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

class UserProfileNotifier extends StateNotifier<UserProfileState> {
  final UserProfileRepository repository;
  final Ref ref;

  UserProfileNotifier(this.repository, this.ref)
      : super(
          const UserProfileState(
            profile: UserProfile(
              patientId: "pat-048291",
              name: "Aarav Sharma",
              phone: "+91 98765 43210",
              dob: "1994-06-15",
              abhaNumber: "91-2024-5839-2041@abdm",
              primaryDosha: "PITTA_KAPHA",
              primaryFocus: "longevity",
              onboardingComplete: false,
            ),
          ),
        ) {
    _init();
  }

  Future<void> _init() async {
    final auth = ref.read(authProvider);
    if (auth.session != null) {
      await loadProfile(auth.session!.patientId, auth.session!.token);
    }
  }

  Future<void> loadProfile(String patientId, String token) async {
    state = state.copyWith(isLoading: true);
    final p = await repository.fetchAndSyncProfile(patientId: patientId, token: token);
    state = state.copyWith(isLoading: false, profile: p);
  }

  Future<void> saveCompleteOnboarding(UserProfile completedProfile) async {
    state = state.copyWith(isLoading: true);
    final auth = ref.read(authProvider);
    final token = auth.session?.token ?? "local.token";

    final finalProfile = completedProfile.copyWith(onboardingComplete: true);
    await repository.syncProfileToBackend(finalProfile, token);
    await ref.read(authProvider.notifier).markOnboardingComplete();

    state = state.copyWith(isLoading: false, profile: finalProfile);
  }

  Future<void> updatePrimaryFocus(String newFocus) async {
    final auth = ref.read(authProvider);
    final token = auth.session?.token ?? "local.token";
    final updated = state.profile.copyWith(primaryFocus: newFocus);
    state = state.copyWith(profile: updated);
    await repository.syncProfileToBackend(updated, token);
  }

  Future<void> updateTheme(String themeMode) async {
    final auth = ref.read(authProvider);
    final token = auth.session?.token ?? "local.token";
    final updated = state.profile.copyWith(themeMode: themeMode);
    state = state.copyWith(profile: updated);
    await repository.syncProfileToBackend(updated, token);
  }
}

final userProfileProvider = StateNotifierProvider<UserProfileNotifier, UserProfileState>((ref) {
  final repo = ref.watch(userProfileRepositoryProvider);
  return UserProfileNotifier(repo, ref);
});
