import '../error/failure.dart';
import '../error/result.dart';

final class AppConfig {
  final Uri apiBaseUrl;
  const AppConfig._(this.apiBaseUrl);
  static Result<AppConfig> fromEnvironment() =>
      parse(const String.fromEnvironment('API_BASE_URL'));
  static Result<AppConfig> parse(String value) {
    final uri = Uri.tryParse(value);
    if (uri == null ||
        uri.scheme != 'https' ||
        uri.host.isEmpty ||
        uri.userInfo.isNotEmpty ||
        uri.hasQuery ||
        uri.hasFragment ||
        !uri.path.endsWith('/api/v1')) {
      return const Failed(ConfigurationFailure());
    }
    return Success(AppConfig._(uri));
  }
}
