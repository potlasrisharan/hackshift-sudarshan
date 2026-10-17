// GENERATED CODE - DO NOT MODIFY BY HAND.
// Source: lib/l10n/app_{en,hi,pa,ta}.arb; build_runner typed ARB generator.
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

final class AppStrings {
  final String localeName;
  const AppStrings._(this.localeName);
  static AppStrings of(BuildContext context) =>
      Localizations.of<AppStrings>(context, AppStrings) ??
      lookupAppStrings(
        Localizations.maybeLocaleOf(context) ?? const Locale('en'),
      );
  static const LocalizationsDelegate<AppStrings> delegate =
      _AppStringsDelegate();
  static const List<LocalizationsDelegate<Object>> localizationsDelegates = [
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];
  static const supportedLocales = [
    Locale('en'),
    Locale('hi'),
    Locale('pa'),
    Locale('ta'),
  ];
  String get appTitle => switch (localeName) {
    'hi' => "धागा",
    'pa' => "ਧਾਗਾ",
    'ta' => "தாக்கா",
    _ => "DHAAGA",
  };
  String get tagline => switch (localeName) {
    'hi' => "देखभाल का जुड़ा हुआ सफ़र",
    'pa' => "ਜੁੜੀ ਰਹਿਣ ਵਾਲੀ ਦੇਖਭਾਲ",
    'ta' => "தொடர்ந்து இணைந்த பராமரிப்பு",
    _ => "Care that stays connected",
  };
  String get chooseLanguage => switch (localeName) {
    'hi' => "अपनी भाषा चुनें",
    'pa' => "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    'ta' => "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    _ => "Choose your language",
  };
  String get languageHint => switch (localeName) {
    'hi' => "जिस भाषा में आप सहज हों, उसे चुनें।",
    'pa' => "ਉਹ ਭਾਸ਼ਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਆਰਾਮ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ।",
    'ta' => "உங்களுக்கு வசதியான மொழியைத் தொடவும்.",
    _ => "Tap the language you are most comfortable with.",
  };
  String get languageHindi => switch (localeName) {
    'hi' => "हिन्दी",
    'pa' => "हिन्दी",
    'ta' => "हिन्दी",
    _ => "हिन्दी",
  };
  String get languageEnglish => switch (localeName) {
    'hi' => "English",
    'pa' => "English",
    'ta' => "English",
    _ => "English",
  };
  String get languagePunjabi => switch (localeName) {
    'hi' => "ਪੰਜਾਬੀ",
    'pa' => "ਪੰਜਾਬੀ",
    'ta' => "ਪੰਜਾਬੀ",
    _ => "ਪੰਜਾਬੀ",
  };
  String get languageTamil => switch (localeName) {
    'hi' => "தமிழ்",
    'pa' => "தமிழ்",
    'ta' => "தமிழ்",
    _ => "தமிழ்",
  };
  String get elderMode => switch (localeName) {
    'hi' => "बड़े अक्षर और अधिक स्पष्टता",
    'pa' => "ਵੱਡੇ ਅੱਖਰ ਅਤੇ ਸਪਸ਼ਟ ਰੰਗ",
    'ta' => "பெரிய எழுத்துகள் மற்றும் தெளிவான நிறங்கள்",
    _ => "High-contrast Elder Mode",
  };
  String get elderHint => switch (localeName) {
    'hi' => "पढ़ने में आसान अक्षर और रंग",
    'pa' => "ਪੜ੍ਹਨ ਵਿੱਚ ਆਸਾਨ ਅੱਖਰ ਅਤੇ ਰੰਗ",
    'ta' => "எளிதாகப் படிக்க பெரிய எழுத்துகள்",
    _ => "Larger text and clearer contrast",
  };
  String get languageSelected => switch (localeName) {
    'hi' => "भाषा चुन ली गई",
    'pa' => "ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ",
    'ta' => "மொழி தேர்ந்தெடுக்கப்பட்டது",
    _ => "Language selected",
  };
  String get connectionTitle => switch (localeName) {
    'hi' => "सेवा से संपर्क",
    'pa' => "ਸੇਵਾ ਨਾਲ ਸੰਪਰਕ",
    'ta' => "சேவை இணைப்பு",
    _ => "Service connection",
  };
  String get checkConnection => switch (localeName) {
    'hi' => "संपर्क जाँचें",
    'pa' => "ਸੰਪਰਕ ਜਾਂਚੋ",
    'ta' => "இணைப்பைச் சரிபார்க்கவும்",
    _ => "Check connection",
  };
  String get checking => switch (localeName) {
    'hi' => "संपर्क जाँचा जा रहा है…",
    'pa' => "ਸੰਪਰਕ ਜਾਂਚਿਆ ਜਾ ਰਿਹਾ ਹੈ…",
    'ta' => "இணைப்பு சரிபார்க்கப்படுகிறது…",
    _ => "Checking connection…",
  };
  String get notChecked => switch (localeName) {
    'hi' => "संपर्क अभी नहीं जाँचा गया है।",
    'pa' => "ਸੰਪਰਕ ਅਜੇ ਨਹੀਂ ਜਾਂਚਿਆ ਗਿਆ।",
    'ta' => "இணைப்பு இன்னும் சரிபார்க்கப்படவில்லை.",
    _ => "Connection has not been checked.",
  };
  String get connected => switch (localeName) {
    'hi' => "सेवा से संपर्क हो गया",
    'pa' => "ਸੇਵਾ ਨਾਲ ਸੰਪਰਕ ਹੋ ਗਿਆ",
    'ta' => "சேவையுடன் இணைப்பு உள்ளது",
    _ => "Service is reachable",
  };
  String get demoNotice => switch (localeName) {
    'hi' =>
      "यह सेवा अभी केवल काल्पनिक जानकारी के प्रदर्शन के लिए है। असली मरीज़ की जानकारी न डालें।",
    'pa' =>
      "ਇਹ ਸੇਵਾ ਹਾਲੇ ਸਿਰਫ਼ ਕਾਲਪਨਿਕ ਜਾਣਕਾਰੀ ਦੇ ਪ੍ਰਦਰਸ਼ਨ ਲਈ ਹੈ। ਅਸਲੀ ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ ਨਾ ਭਰੋ।",
    'ta' =>
      "இந்தச் சேவை தற்போது கற்பனைத் தகவல்களின் விளக்கத்திற்காக மட்டுமே உள்ளது. உண்மையான நோயாளித் தகவல்களை உள்ளிட வேண்டாம்.",
    _ =>
      "This service currently supports synthetic demonstrations only. Do not enter real patient information.",
  };
  String get retry => switch (localeName) {
    'hi' => "फिर कोशिश करें",
    'pa' => "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    'ta' => "மீண்டும் முயலவும்",
    _ => "Try again",
  };
  String get back => switch (localeName) {
    'hi' => "भाषा चयन पर लौटें",
    'pa' => "ਭਾਸ਼ਾ ਚੋਣ ਤੇ ਵਾਪਸ ਜਾਓ",
    'ta' => "மொழித் தேர்வுக்குத் திரும்பவும்",
    _ => "Back to languages",
  };
  String get next => switch (localeName) {
    'hi' => "आगे बढ़ें",
    'pa' => "ਅੱਗੇ ਵਧੋ",
    'ta' => "தொடரவும்",
    _ => "Continue",
  };
  String get unavailableTitle => switch (localeName) {
    'hi' => "जानकारी दर्ज करने की सुविधा अभी उपलब्ध नहीं है",
    'pa' => "ਜਾਣਕਾਰੀ ਦਰਜ ਕਰਨ ਦੀ ਸਹੂਲਤ ਹਾਲੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ",
    'ta' => "தகவல் பதிவு இன்னும் கிடைக்கவில்லை",
    _ => "Intake is not available yet",
  };
  String get unavailableBody => switch (localeName) {
    'hi' =>
      "कृपया क्लिनिक के कर्मचारी से मदद लें। यह कियोस्क अभी जानकारी भेज या टोकन जारी नहीं कर सकता।",
    'pa' =>
      "ਕਿਰਪਾ ਕਰਕੇ ਕਲੀਨਿਕ ਦੇ ਕਰਮਚਾਰੀ ਤੋਂ ਮਦਦ ਲਓ। ਇਹ ਕਿਓਸਕ ਹਾਲੇ ਜਾਣਕਾਰੀ ਭੇਜ ਜਾਂ ਟੋਕਨ ਜਾਰੀ ਨਹੀਂ ਕਰ ਸਕਦਾ।",
    'ta' =>
      "மருத்துவமனை ஊழியரிடம் உதவி கேளுங்கள். இந்தக் கருவி இன்னும் தகவல் அனுப்பவோ டோக்கன் வழங்கவோ முடியாது.",
    _ =>
      "Please ask the clinic staff for help. This kiosk cannot submit an intake or issue a token yet.",
  };
  String get identifyTitle => switch (localeName) {
    'hi' => "मरीज़ की पहचान",
    'pa' => "ਮਰੀਜ਼ ਦੀ ਪਛਾਣ",
    'ta' => "நோயாளி அடையாளம்",
    _ => "Patient identification",
  };
  String get converseTitle => switch (localeName) {
    'hi' => "अपनी तकलीफ़ बताएँ",
    'pa' => "ਆਪਣੀ ਤਕਲੀਫ਼ ਦੱਸੋ",
    'ta' => "உங்கள் அறிகுறிகளைக் கூறுங்கள்",
    _ => "Tell us how you feel",
  };
  String get scanTitle => switch (localeName) {
    'hi' => "पर्चे की तस्वीर लें",
    'pa' => "ਪਰਚੇ ਦੀ ਤਸਵੀਰ ਲਓ",
    'ta' => "மருந்துச் சீட்டைப் படம் எடுக்கவும்",
    _ => "Scan a prescription",
  };
  String get summaryTitle => switch (localeName) {
    'hi' => "अपनी जानकारी जाँचें",
    'pa' => "ਆਪਣੀ ਜਾਣਕਾਰੀ ਜਾਂਚੋ",
    'ta' => "உங்கள் தகவலைச் சரிபார்க்கவும்",
    _ => "Review your intake",
  };
  String get queueTitle => switch (localeName) {
    'hi' => "आपका टोकन",
    'pa' => "ਤੁਹਾਡਾ ਟੋਕਨ",
    'ta' => "உங்கள் டோக்கன்",
    _ => "Your queue token",
  };
  String get flowChoosing => switch (localeName) {
    'hi' => "शुरू करने के लिए भाषा चुनें",
    'pa' => "ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਭਾਸ਼ਾ ਚੁਣੋ",
    'ta' => "தொடங்க ஒரு மொழியைத் தேர்ந்தெடுக்கவும்",
    _ => "Choose a language to begin",
  };
  String get flowIdentity => switch (localeName) {
    'hi' => "भाषा चुन ली गई है। कर्मचारी से मदद मिल सकती है।",
    'pa' => "ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ ਹੈ। ਕਰਮਚਾਰੀ ਦੀ ਮਦਦ ਉਪਲਬਧ ਹੈ।",
    'ta' => "மொழி தேர்ந்தெடுக்கப்பட்டது. ஊழியரின் உதவி கிடைக்கும்.",
    _ => "Language selected. Staff assistance is available.",
  };
  String get flowBlocked => switch (localeName) {
    'hi' => "इस चरण में कर्मचारी की मदद लें।",
    'pa' => "ਇਸ ਪੜਾਅ ਤੇ ਕਰਮਚਾਰੀ ਦੀ ਮਦਦ ਲਓ।",
    'ta' => "இந்தப் படியில் ஊழியரின் உதவி தேவை.",
    _ => "This step needs staff assistance.",
  };
  String get networkFailure => switch (localeName) {
    'hi' => "संपर्क नहीं हो सका। इंटरनेट जाँचकर फिर कोशिश करें।",
    'pa' => "ਸੰਪਰਕ ਨਹੀਂ ਹੋਇਆ। ਇੰਟਰਨੈੱਟ ਜਾਂਚ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    'ta' => "இணைக்க முடியவில்லை. இணையத்தைச் சரிபார்த்து மீண்டும் முயலவும்.",
    _ => "Cannot connect. Check the network and try again.",
  };
  String get timeoutFailure => switch (localeName) {
    'hi' => "सेवा में अधिक समय लगा। फिर कोशिश करें।",
    'pa' => "ਸੇਵਾ ਨੇ ਜ਼ਿਆਦਾ ਸਮਾਂ ਲਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    'ta' => "சேவை அதிக நேரம் எடுத்தது. மீண்டும் முயலவும்.",
    _ => "The service took too long. Please try again.",
  };
  String get serverFailure => switch (localeName) {
    'hi' => "सेवा उपलब्ध नहीं है। फिर कोशिश करें या कर्मचारी से मदद लें।",
    'pa' => "ਸੇਵਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਮਦਦ ਲਓ।",
    'ta' => "சேவை கிடைக்கவில்லை. மீண்டும் முயலவும் அல்லது உதவி கேளுங்கள்.",
    _ => "The service is unavailable. Please try again or ask staff.",
  };
  String get validationFailure => switch (localeName) {
    'hi' => "सेवा से सही जवाब नहीं मिला। कर्मचारी से मदद लें।",
    'pa' => "ਸੇਵਾ ਤੋਂ ਠੀਕ ਜਵਾਬ ਨਹੀਂ ਮਿਲਿਆ। ਕਰਮਚਾਰੀ ਤੋਂ ਮਦਦ ਲਓ।",
    'ta' => "சேவையிலிருந்து சரியான பதில் கிடைக்கவில்லை. உதவி கேளுங்கள்.",
    _ => "The service returned an unexpected response. Please ask staff.",
  };
  String get unknownFailure => switch (localeName) {
    'hi' => "यह काम पूरा नहीं हुआ। फिर कोशिश करें।",
    'pa' => "ਇਹ ਕੰਮ ਪੂਰਾ ਨਹੀਂ ਹੋਇਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    'ta' => "இந்தச் செயலை முடிக்க முடியவில்லை. மீண்டும் முயலவும்.",
    _ => "This action could not be completed. Please try again.",
  };
  String get configurationFailure => switch (localeName) {
    'hi' => "कियोस्क की सेवा सेटिंग ज़रूरी है। कर्मचारी से मदद लें।",
    'pa' => "ਕਿਓਸਕ ਦੀ ਸੇਵਾ ਸੈਟਿੰਗ ਚਾਹੀਦੀ ਹੈ। ਕਰਮਚਾਰੀ ਤੋਂ ਮਦਦ ਲਓ।",
    'ta' => "சேவை அமைப்பு தேவை. ஊழியரிடம் உதவி கேளுங்கள்.",
    _ => "This kiosk needs its service configuration. Please ask staff.",
  };
  String get cancelledFailure => switch (localeName) {
    'hi' => "संपर्क जाँच रद्द कर दी गई।",
    'pa' => "ਸੰਪਰਕ ਜਾਂਚ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ।",
    'ta' => "இணைப்புச் சரிபார்ப்பு நிறுத்தப்பட்டது.",
    _ => "The connection check was cancelled.",
  };
  String get previewLabel => switch (localeName) {
    'hi' => "कियोस्क पूर्वावलोकन",
    'pa' => "ਕਿਓਸਕ ਝਲਕ",
    'ta' => "கியோஸ்க் முன்னோட்டம்",
    _ => "Kiosk preview",
  };
  String get privacyNotice => switch (localeName) {
    'hi' => "इस स्क्रीन पर मरीज़ की जानकारी नहीं ली जाती।",
    'pa' => "ਇਸ ਸਕ੍ਰੀਨ ਤੇ ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਲਈ ਜਾਂਦੀ।",
    'ta' => "இந்தத் திரையில் நோயாளித் தகவல் சேகரிக்கப்படாது.",
    _ => "No patient information is collected on this screen.",
  };
  String get developmentNotice => switch (localeName) {
    'hi' => "संपर्क जाँच में मरीज़ की जानकारी नहीं भेजी जाती।",
    'pa' => "ਸੰਪਰਕ ਜਾਂਚ ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਭੇਜਦੀ।",
    'ta' => "இணைப்புச் சரிபார்ப்பு நோயாளித் தகவலை அனுப்பாது.",
    _ => "Connection checks do not submit patient information.",
  };
  String get homeTitle => switch (localeName) {
    'hi' => "स्वागत है",
    'pa' => "ਜੀ ਆਇਆਂ ਨੂੰ",
    'ta' => "வரவேற்கிறோம்",
    _ => "Welcome",
  };
  String get loading => switch (localeName) {
    'hi' => "कृपया प्रतीक्षा करें…",
    'pa' => "ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ…",
    'ta' => "காத்திருக்கவும்…",
    _ => "Please wait…",
  };
  String get newPatient => switch (localeName) {
    'hi' => "फिर से शुरू करें",
    'pa' => "ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ",
    'ta' => "மீண்டும் தொடங்கவும்",
    _ => "Start again",
  };
}

AppStrings lookupAppStrings(Locale locale) => AppStrings._(
  {'en', 'hi', 'pa', 'ta'}.contains(locale.languageCode)
      ? locale.languageCode
      : 'en',
);

final class _AppStringsDelegate extends LocalizationsDelegate<AppStrings> {
  const _AppStringsDelegate();
  @override
  Future<AppStrings> load(Locale locale) =>
      SynchronousFuture(lookupAppStrings(locale));
  @override
  bool isSupported(Locale locale) =>
      {'en', 'hi', 'pa', 'ta'}.contains(locale.languageCode);
  @override
  bool shouldReload(_AppStringsDelegate old) => false;
}
