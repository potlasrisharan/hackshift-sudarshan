import 'package:flutter/material.dart';
import '../../../../core/localization/app_strings.dart';
import '../widgets/unavailable_step.dart';

class ConverseScreen extends StatelessWidget {
  const ConverseScreen({super.key});
  @override
  Widget build(BuildContext context) =>
      UnavailableStep(title: AppStrings.of(context).converseTitle);
}
