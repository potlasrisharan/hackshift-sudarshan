import '../../../../core/error/failure.dart';
import '../../../../core/error/result.dart';
import '../entities/intake_draft.dart';
import '../repositories/intake_repository.dart';

final class SubmitIntake {
  final IntakeRepository repository;
  const SubmitIntake(this.repository);
  Future<Result<EncounterReceipt>> call(
    IntakeDraft draft,
    StaffSession session,
    String key,
  ) {
    if (!draft.canSubmit ||
        !session.active ||
        !RegExp(
          r'^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$',
        ).hasMatch(key)) {
      return Future.value(const Failed(ValidationFailure()));
    }
    return repository.submit(draft, session, key);
  }
}
