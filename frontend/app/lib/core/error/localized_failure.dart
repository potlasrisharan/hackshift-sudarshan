import '../localization/app_strings.dart';
import 'failure.dart';

String localizedFailure(Failure failure, AppStrings strings) =>
    switch (failure) {
      NetworkFailure() => strings.networkFailure,
      TimeoutFailure() => strings.timeoutFailure,
      ServerFailure() => strings.serverFailure,
      ValidationFailure() => strings.validationFailure,
      ConfigurationFailure() => strings.configurationFailure,
      CancelledFailure() => strings.cancelledFailure,
      UnknownFailure() => strings.unknownFailure,
    };
