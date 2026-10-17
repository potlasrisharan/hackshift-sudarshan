import 'package:flutter/material.dart';
import '../../../../core/localization/app_strings.dart';
import '../widgets/unavailable_step.dart';

class ScanScreen extends StatelessWidget {
  const ScanScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      UnavailableStep(title: AppStrings.of(context).scanTitle);
}
