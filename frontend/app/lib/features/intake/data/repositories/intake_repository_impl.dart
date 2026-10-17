import 'package:dio/dio.dart';
import '../../../../core/error/failure.dart';
import '../../../../core/error/result.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/entities/intake_draft.dart';
import '../../domain/repositories/intake_repository.dart';
import '../dtos/intake_dto.dart';

final class IntakeRepositoryImpl implements IntakeRepository {
  final ApiClient client;
  final CancelToken cancelToken;
  IntakeRepositoryImpl(this.client, this.cancelToken);
  @override
  Future<Result<StaffSession>> login(
    String org,
    String email,
    String password,
  ) async {
    final result = await client.login({
      'orgId': org.trim(),
      'email': email.trim(),
      'password': password,
    }, cancelToken);
    switch (result) {
      case Failed(:final failure):
        return Failed(failure);
      case Success(:final value):
        try {
          if (value is! Map<String, Object?>) {
            return const Failed(ValidationFailure());
          }
          final dto = LoginResponseDto.fromJson(value);
          final session = StaffSession(dto.token, dto.expiresAt);
          if (!session.active) return const Failed(ValidationFailure());
          return Success(session);
        } catch (_) {
          return const Failed(ValidationFailure());
        }
    }
  }

  @override
  Future<Result<EncounterReceipt>> submit(
    IntakeDraft draft,
    StaffSession session,
    String key,
  ) async {
    final result = await client.createEncounter(
      IntakeRequestDto.fromDomain(draft).toJson(),
      session.token,
      key,
      cancelToken,
    );
    switch (result) {
      case Failed(:final failure):
        return Failed(failure);
      case Success(:final value):
        try {
          if (value is! Map<String, Object?>) {
            return const Failed(ValidationFailure());
          }
          return Success(EncounterDto.fromJson(value).toDomain());
        } catch (_) {
          return const Failed(ValidationFailure());
        }
    }
  }
}
