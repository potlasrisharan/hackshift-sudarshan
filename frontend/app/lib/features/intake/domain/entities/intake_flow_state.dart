import '../../../../core/error/failure.dart';
import 'intake_draft.dart';

enum KioskLanguage { hi, en, pa, ta }

sealed class IntakeFlowState {
  const IntakeFlowState();
}

final class ChoosingLanguage extends IntakeFlowState {
  const ChoosingLanguage();
}

final class AwaitingIdentity extends IntakeFlowState {
  final KioskLanguage language;
  const AwaitingIdentity(this.language);
}

enum IntakeStep { identity, converse, summary }

final class EditingIntake extends IntakeFlowState {
  final IntakeDraft draft;
  final StaffSession session;
  final IntakeStep step;
  final String key;
  final Failure? failure;
  const EditingIntake(
    this.draft,
    this.session,
    this.step,
    this.key, {
    this.failure,
  });
}

final class SubmittingIntake extends IntakeFlowState {
  final EditingIntake pending;
  const SubmittingIntake(this.pending);
}

final class IntakeComplete extends IntakeFlowState {
  final EncounterReceipt receipt;
  const IntakeComplete(this.receipt);
}

final class IntakeBlocked extends IntakeFlowState {
  final Failure failure;
  const IntakeBlocked(this.failure);
}
