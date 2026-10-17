import '../../../../core/error/failure.dart';

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

final class IntakeBlocked extends IntakeFlowState {
  final Failure failure;
  const IntakeBlocked(this.failure);
}
