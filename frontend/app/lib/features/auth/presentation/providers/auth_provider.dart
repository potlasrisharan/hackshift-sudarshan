import "package:flutter/foundation.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../data/models/auth_models.dart";
import "../../data/repositories/auth_repository.dart";

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});

@immutable
class AuthState {
  final bool isLoading;
  final AuthSession? session;
  final String? errorMessage;

  const AuthState({
    this.isLoading = false,
    this.session,
    this.errorMessage,
  });

  bool get isAuthenticated => session != null && session!.token.isNotEmpty;

  AuthState copyWith({
    bool? isLoading,
    AuthSession? session,
    String? errorMessage,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      session: session ?? this.session,
      errorMessage: errorMessage,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository repository;

  AuthNotifier(this.repository) : super(const AuthState()) {
    init();
  }

  Future<void> init() async {
    state = state.copyWith(isLoading: true);
    final restored = await repository.restoreSession();
    state = state.copyWith(isLoading: false, session: restored);
  }

  Future<bool> login(String identifier, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final session = await repository.login(identifier: identifier, password: password);
      state = state.copyWith(isLoading: false, session: session);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString().replaceFirst("Exception: ", ""));
      return false;
    }
  }

  Future<bool> signup({
    required String name,
    required String phone,
    required String password,
    required String dob,
    required String sex,
    String? email,
    String? abhaNumber,
    String preferredLang = "hi",
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final session = await repository.signup(
        name: name,
        phone: phone,
        password: password,
        dob: dob,
        sex: sex,
        email: email,
        abhaNumber: abhaNumber,
        preferredLang: preferredLang,
      );
      state = state.copyWith(isLoading: false, session: session);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString().replaceFirst("Exception: ", ""));
      return false;
    }
  }

  Future<void> markOnboardingComplete() async {
    if (state.session != null) {
      final updated = state.session!.copyWith(onboardingComplete: true);
      await repository.saveSession(updated);
      state = state.copyWith(session: updated);
    }
  }

  Future<void> logout() async {
    if (state.session != null) {
      await repository.logout(state.session!.token);
    }
    state = const AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repo = ref.watch(authRepositoryProvider);
  return AuthNotifier(repo);
});
