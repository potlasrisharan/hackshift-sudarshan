import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

abstract final class AppTheme {
  static ThemeData dark({bool elderMode = false}) {
    final background = elderMode
        ? AppColors.elderBackground
        : AppColors.background;
    final surface = elderMode ? AppColors.elderSurface : AppColors.surface;
    final text = elderMode ? AppColors.elderText : AppColors.text;
    final primary = elderMode ? AppColors.elderPrimary : AppColors.primary;
    final scheme = ColorScheme.dark(
      primary: primary,
      onPrimary: AppColors.onPrimary,
      surface: surface,
      onSurface: text,
      onSurfaceVariant: elderMode ? AppColors.elderText : AppColors.muted,
      error: AppColors.error,
      onError: AppColors.onError,
      outline: elderMode ? AppColors.elderText : AppColors.outline,
    );
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: background,
      fontFamily: 'NotoSans',
      fontFamilyFallback: const [
        'NotoSansDevanagari',
        'NotoSansGurmukhi',
        'NotoSansTamil',
      ],
      visualDensity: VisualDensity.standard,
      materialTapTargetSize: MaterialTapTargetSize.padded,
    );
    return base.copyWith(
      textTheme: base.textTheme.copyWith(
        bodyLarge: base.textTheme.bodyLarge?.copyWith(
          fontSize: elderMode ? 24 : 20,
          height: 1.6,
        ),
        bodyMedium: base.textTheme.bodyMedium?.copyWith(
          fontSize: elderMode ? 22 : 18,
          height: 1.6,
        ),
        labelLarge: base.textTheme.labelLarge?.copyWith(
          fontSize: elderMode ? 22 : 18,
          height: 1.5,
        ),
        titleLarge: base.textTheme.titleLarge?.copyWith(
          fontSize: elderMode ? 28 : 24,
          height: 1.5,
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(56, 56),
          padding: const EdgeInsets.all(20),
          textStyle: TextStyle(
            fontFamily: 'NotoSans',
            fontFamilyFallback: const [
              'NotoSansDevanagari',
              'NotoSansGurmukhi',
              'NotoSansTamil',
            ],
            fontSize: elderMode ? 22 : 18,
            height: 1.5,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: primary,
          minimumSize: const Size(56, 56),
          padding: const EdgeInsets.all(20),
          side: BorderSide(color: scheme.outline, width: 2),
          textStyle: TextStyle(
            fontFamily: 'NotoSans',
            fontFamilyFallback: const [
              'NotoSansDevanagari',
              'NotoSansGurmukhi',
              'NotoSansTamil',
            ],
            fontSize: elderMode ? 22 : 18,
            height: 1.5,
          ),
        ),
      ),
      cardTheme: CardThemeData(
        color: surface,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: scheme.outline, width: elderMode ? 2 : 1),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        foregroundColor: text,
      ),
      focusColor: primary.withValues(alpha: 0.3),
      dividerTheme: DividerThemeData(color: scheme.outline),
    );
  }
}
