import '../../../../core/error/result.dart';
import '../entities/intake_draft.dart';

abstract interface class IntakeRepository {
  Future<Result<StaffSession>> login(String org, String email, String password);
  Future<Result<EncounterReceipt>> submit(
    IntakeDraft draft,
    StaffSession session,
    String key,
  );
}
