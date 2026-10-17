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
  String get staffTitle => switch (localeName) {
    'hi' => "कर्मचारी साइन इन",
    'pa' => "ਸਟਾਫ ਸਾਈਨ ਇਨ",
    'ta' => "பணியாளர் உள்நுழைவு",
    _ => "Staff sign-in",
  };
  String get staffHelp => switch (localeName) {
    'hi' => "केवल परीक्षण के लिए। क्लिनिक कर्मचारी से साइन इन करवाएँ।",
    'pa' => "ਕੇਵਲ ਜਾਂਚ ਲਈ। ਕਲੀਨਿਕ ਸਟਾਫ ਨੂੰ ਸਾਈਨ ਇਨ ਕਰਨ ਲਈ ਕਹੋ।",
    'ta' => "சோதனைக்கு மட்டும். மருத்துவமனை பணியாளரை உள்நுழையச் சொல்லவும்.",
    _ =>
      "Synthetic integration only. Ask clinic staff to sign in. Production kiosk authentication is not configured.",
  };
  String get organization => switch (localeName) {
    'hi' => "संस्था",
    'pa' => "ਸੰਸਥਾ",
    'ta' => "நிறுவனம்",
    _ => "Organization",
  };
  String get email => switch (localeName) {
    'hi' => "कर्मचारी ईमेल",
    'pa' => "ਸਟਾਫ ਈਮੇਲ",
    'ta' => "பணியாளர் மின்னஞ்சல்",
    _ => "Staff email",
  };
  String get password => switch (localeName) {
    'hi' => "पासवर्ड",
    'pa' => "ਪਾਸਵਰਡ",
    'ta' => "கடவுச்சொல்",
    _ => "Password",
  };
  String get signIn => switch (localeName) {
    'hi' => "साइन इन",
    'pa' => "ਸਾਈਨ ਇਨ",
    'ta' => "உள்நுழைக",
    _ => "Sign in",
  };
  String get patientName => switch (localeName) {
    'hi' => "काल्पनिक रोगी का नाम",
    'pa' => "ਕਾਲਪਨਿਕ ਮਰੀਜ਼ ਦਾ ਨਾਮ",
    'ta' => "கற்பனை நோயாளி பெயர்",
    _ => "Synthetic patient name",
  };
  String get birthDate => switch (localeName) {
    'hi' => "जन्म तिथि (YYYY-MM-DD)",
    'pa' => "ਜਨਮ ਮਿਤੀ (YYYY-MM-DD)",
    'ta' => "பிறந்த தேதி (YYYY-MM-DD)",
    _ => "Birth date (YYYY-MM-DD)",
  };
  String get identityHelp => switch (localeName) {
    'hi' =>
      "पुष्ट काल्पनिक विवरण भरें। नाम और सही जन्म तिथि आवश्यक हैं। वास्तविक जानकारी न दें।",
    'pa' =>
      "ਪੁਸ਼ਟ ਕਾਲਪਨਿਕ ਵੇਰਵੇ ਭਰੋ। ਨਾਮ ਅਤੇ ਸਹੀ ਜਨਮ ਮਿਤੀ ਲੋੜੀਂਦੇ ਹਨ। ਅਸਲੀ ਜਾਣਕਾਰੀ ਨਾ ਦਿਓ।",
    'ta' =>
      "உறுதிப்படுத்திய கற்பனை விவரங்களை உள்ளிடவும். பெயரும் சரியான பிறந்த தேதியும் தேவை. உண்மையான தகவல் வேண்டாம்.",
    _ =>
      "Enter confirmed synthetic demographics. Name and a valid birth date are required. No real patient data.",
  };
  String get identifierUnavailable => switch (localeName) {
    'hi' =>
      "फोन / ABHA खोज उपलब्ध नहीं है। कोई फोन नंबर या ABHA नहीं लिया जाता।",
    'pa' => "ਫ਼ੋਨ / ABHA ਖੋਜ ਉਪਲਬਧ ਨਹੀਂ। ਫ਼ੋਨ ਨੰਬਰ ਜਾਂ ABHA ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ।",
    'ta' => "தொலைபேசி / ABHA தேடல் கிடைக்கவில்லை. இவை சேகரிக்கப்படாது.",
    _ =>
      "Phone / ABHA lookup is unavailable. No phone number or ABHA is collected.",
  };
  String get gender => switch (localeName) {
    'hi' => "लिंग",
    'pa' => "ਲਿੰਗ",
    'ta' => "பாலினம்",
    _ => "Gender",
  };
  String get female => switch (localeName) {
    'hi' => "महिला",
    'pa' => "ਔਰਤ",
    'ta' => "பெண்",
    _ => "Female",
  };
  String get male => switch (localeName) {
    'hi' => "पुरुष",
    'pa' => "ਮਰਦ",
    'ta' => "ஆண்",
    _ => "Male",
  };
  String get other => switch (localeName) {
    'hi' => "अन्य",
    'pa' => "ਹੋਰ",
    'ta' => "மற்றவை",
    _ => "Other",
  };
  String get unknown => switch (localeName) {
    'hi' => "नहीं बताना चाहते",
    'pa' => "ਦੱਸਣਾ ਨਹੀਂ ਚਾਹੁੰਦੇ",
    'ta' => "தெரிவிக்க விரும்பவில்லை",
    _ => "Prefer not to say",
  };
  String get syntheticConfirm => switch (localeName) {
    'hi' => "मैं पुष्टि करता हूँ कि सभी रोगी विवरण काल्पनिक हैं।",
    'pa' => "ਮੈਂ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹਾਂ ਕਿ ਮਰੀਜ਼ ਦੇ ਸਾਰੇ ਵੇਰਵੇ ਕਾਲਪਨਿਕ ਹਨ।",
    'ta' =>
      "உள்ளிட்ட நோயாளி தகவல்கள் அனைத்தும் கற்பனையானவை என உறுதி செய்கிறேன்.",
    _ => "I confirm all entered patient information is synthetic.",
  };
  String get complaint => switch (localeName) {
    'hi' => "अपनी परेशानी बताएँ (3–2000 अक्षर)",
    'pa' => "ਆਪਣੀ ਤਕਲੀਫ਼ ਦੱਸੋ (3–2000 ਅੱਖਰ)",
    'ta' => "உங்கள் உடல்நிலையை விவரிக்கவும் (3–2000 எழுத்துகள்)",
    _ => "Describe how you feel (3–2000 characters)",
  };
  String get redFlagHelp => switch (localeName) {
    'hi' => "पहले तीन सुरक्षा प्रश्नों के उत्तर दें। बाकी वैकल्पिक हैं।",
    'pa' => "ਪਹਿਲੇ ਤਿੰਨ ਸੁਰੱਖਿਆ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿਓ। ਬਾਕੀ ਚੋਣਵੇਂ ਹਨ।",
    'ta' =>
      "முதல் மூன்று பாதுகாப்புக் கேள்விகளுக்கு பதிலளிக்கவும். மற்றவை விருப்பத்தேர்வு.",
    _ =>
      "Answer each of the first three safety questions. Remaining questions are optional.",
  };
  String get chestPain => switch (localeName) {
    'hi' => "सीने में दर्द?",
    'pa' => "ਛਾਤੀ ਵਿੱਚ ਦਰਦ?",
    'ta' => "நெஞ்சு வலி உள்ளதா?",
    _ => "Chest pain?",
  };
  String get breathless => switch (localeName) {
    'hi' => "साँस लेने में परेशानी?",
    'pa' => "ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ?",
    'ta' => "மூச்சு விடுவதில் சிரமமா?",
    _ => "Difficulty breathing?",
  };
  String get fainting => switch (localeName) {
    'hi' => "बेहोशी?",
    'pa' => "ਬੇਹੋਸ਼ੀ?",
    'ta' => "மயக்கம் உள்ளதா?",
    _ => "Fainting?",
  };
  String get fever => switch (localeName) {
    'hi' => "बुखार?",
    'pa' => "ਬੁਖ਼ਾਰ?",
    'ta' => "காய்ச்சல் உள்ளதா?",
    _ => "Fever?",
  };
  String get cough => switch (localeName) {
    'hi' => "खाँसी?",
    'pa' => "ਖੰਘ?",
    'ta' => "இருமல் உள்ளதா?",
    _ => "Cough?",
  };
  String get fatigue => switch (localeName) {
    'hi' => "थकान?",
    'pa' => "ਥਕਾਵਟ?",
    'ta' => "சோர்வு உள்ளதா?",
    _ => "Fatigue?",
  };
  String get thirst => switch (localeName) {
    'hi' => "अधिक प्यास?",
    'pa' => "ਵੱਧ ਪਿਆਸ?",
    'ta' => "அதிக தாகமா?",
    _ => "Increased thirst?",
  };
  String get yes => switch (localeName) {
    'hi' => "हाँ",
    'pa' => "ਹਾਂ",
    'ta' => "ஆம்",
    _ => "Yes",
  };
  String get no => switch (localeName) {
    'hi' => "नहीं",
    'pa' => "ਨਹੀਂ",
    'ta' => "இல்லை",
    _ => "No",
  };
  String get unsure => switch (localeName) {
    'hi' => "पता नहीं",
    'pa' => "ਪਤਾ ਨਹੀਂ",
    'ta' => "உறுதியாகத் தெரியவில்லை",
    _ => "Unsure",
  };
  String get informStaff => switch (localeName) {
    'hi' => "क्लिनिक कर्मचारी को तुरंत बताएँ। इस फॉर्म के लिए न रुकें।",
    'pa' => "ਕਲੀਨਿਕ ਸਟਾਫ ਨੂੰ ਤੁਰੰਤ ਦੱਸੋ। ਇਸ ਫਾਰਮ ਲਈ ਉਡੀਕ ਨਾ ਕਰੋ।",
    'ta' =>
      "உடனே மருத்துவமனை பணியாளரிடம் தெரிவிக்கவும். இந்தப் படிவத்திற்காக காத்திருக்க வேண்டாம்.",
    _ => "Inform clinic staff immediately. Do not wait for this form.",
  };
  String get speak => switch (localeName) {
    'hi' => "माइक्रोफ़ोन शुरू करें",
    'pa' => "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਚਾਲੂ ਕਰੋ",
    'ta' => "ஒலிவாங்கியைத் தொடங்கு",
    _ => "Start microphone",
  };
  String get stopSpeech => switch (localeName) {
    'hi' => "माइक्रोफ़ोन रोकें",
    'pa' => "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਬੰਦ ਕਰੋ",
    'ta' => "ஒலிவாங்கியை நிறுத்து",
    _ => "Stop microphone",
  };
  String get speechNotice => switch (localeName) {
    'hi' =>
      "Android पर वैकल्पिक वॉइस इनपुट है। केवल काल्पनिक बातें बोलें। आगे बढ़ने से पहले पाठ जाँचें।",
    'pa' =>
      "Android ਉੱਤੇ ਚੋਣਵਾਂ ਆਵਾਜ਼ ਇਨਪੁਟ ਹੈ। ਕੇਵਲ ਕਾਲਪਨਿਕ ਗੱਲਾਂ ਬੋਲੋ। ਅੱਗੇ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਲਿਖਤ ਜਾਂਚੋ।",
    'ta' =>
      "Android குரல் உள்ளீடு விருப்பத்தேர்வு. கற்பனைத் தகவல்களை மட்டும் பேசவும். தொடரும் முன் உரையைச் சரிபார்க்கவும்.",
    _ =>
      "Optional Android speech input uses the device recognizer. Use synthetic speech only. Review and edit the transcript before continuing.",
  };
  String get typedFallback => switch (localeName) {
    'hi' => "नीचे लिखें। माइक्रोफ़ोन, यह भाषा या वॉइस सेवा उपलब्ध नहीं है।",
    'pa' => "ਹੇਠਾਂ ਲਿਖੋ। ਮਾਈਕ੍ਰੋਫ਼ੋਨ, ਇਹ ਭਾਸ਼ਾ ਜਾਂ ਆਵਾਜ਼ ਸੇਵਾ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    'ta' =>
      "கீழே தட்டச்சு செய்யவும். ஒலிவாங்கி, இந்த மொழி அல்லது குரல் சேவை கிடைக்கவில்லை.",
    _ =>
      "Type below. Microphone permission, this language, or speech recognition is unavailable.",
  };
  String get webTyped => switch (localeName) {
    'hi' => "वेब पर लिखें। Android पर वॉइस इनपुट उपलब्ध है।",
    'pa' => "ਵੈੱਬ ਉੱਤੇ ਲਿਖੋ। Android ਉੱਤੇ ਆਵਾਜ਼ ਇਨਪੁਟ ਹੈ।",
    'ta' => "இணையத்தில் தட்டச்சு செய்யவும். Android இல் குரல் உள்ளீடு உள்ளது.",
    _ => "Use typed input on Web. Android supports optional speech input.",
  };
  String get listening => switch (localeName) {
    'hi' => "सुन रहे हैं — चुप्पी पर रुक जाएगा",
    'pa' => "ਸੁਣ ਰਹੇ ਹਾਂ — ਚੁੱਪ ਹੋਣ ਤੇ ਰੁਕੇਗਾ",
    'ta' => "கேட்கிறது — அமைதிக்குப் பின் நிற்கும்",
    _ => "Listening — stops after silence",
  };
  String get review => switch (localeName) {
    'hi' => "विवरण जाँचें",
    'pa' => "ਵੇਰਵੇ ਜਾਂਚੋ",
    'ta' => "விவரங்களைச் சரிபார்",
    _ => "Review intake",
  };
  String get editComplaint => switch (localeName) {
    'hi' => "परेशानी का विवरण बदलें",
    'pa' => "ਤਕਲੀਫ਼ ਦੇ ਵੇਰਵੇ ਬਦਲੋ",
    'ta' => "உடல்நிலை விவரத்தைத் திருத்து",
    _ => "Edit complaint",
  };
  String get careConsent => switch (localeName) {
    'hi' =>
      "मैं देखभाल के लिए यह विवरण क्लिनिक कर्मचारी से साझा करने को सहमत हूँ।",
    'pa' => "ਮੈਂ ਦੇਖਭਾਲ ਲਈ ਇਹ ਵੇਰਵੇ ਕਲੀਨਿਕ ਸਟਾਫ ਨਾਲ ਸਾਂਝੇ ਕਰਨ ਲਈ ਸਹਿਮਤ ਹਾਂ।",
    'ta' =>
      "பராமரிப்புக்காக இந்த விவரங்களை மருத்துவமனை பணியாளருடன் பகிர ஒப்புக்கொள்கிறேன்.",
    _ => "I agree to share this intake with clinic staff for care.",
  };
  String get submitIntake => switch (localeName) {
    'hi' => "विवरण भेजें",
    'pa' => "ਵੇਰਵੇ ਭੇਜੋ",
    'ta' => "விவரங்களை அனுப்பு",
    _ => "Submit intake",
  };
  String get noVitals => switch (localeName) {
    'hi' => "शारीरिक माप नहीं लिए गए।",
    'pa' => "ਸਰੀਰਕ ਮਾਪ ਨਹੀਂ ਲਏ ਗਏ।",
    'ta' => "உடல் அளவீடுகள் சேகரிக்கப்படவில்லை.",
    _ => "Vitals were not collected.",
  };
  String get noOcr => switch (localeName) {
    'hi' =>
      "इस चरण में प्रिस्क्रिप्शन स्कैन उपलब्ध नहीं है। कोई दवा निकाली नहीं गई।",
    'pa' => "ਇਸ ਪੜਾਅ ਵਿੱਚ ਪਰਚੀ ਸਕੈਨ ਉਪਲਬਧ ਨਹੀਂ। ਕੋਈ ਦਵਾਈ ਨਹੀਂ ਪੜ੍ਹੀ ਗਈ।",
    'ta' =>
      "இந்தக் கட்டத்தில் மருந்துச்சீட்டு ஸ்கேன் இல்லை. மருந்துகள் எதுவும் பிரித்தெடுக்கப்படவில்லை.",
    _ =>
      "Prescription scanning is not available in this phase. No medications were extracted.",
  };
  String get receiptTitle => switch (localeName) {
    'hi' => "विवरण की रसीद",
    'pa' => "ਵੇਰਵਿਆਂ ਦੀ ਰਸੀਦ",
    'ta' => "பதிவு ரசீது",
    _ => "Intake receipt",
  };
  String get reference => switch (localeName) {
    'hi' => "मुलाकात संदर्भ",
    'pa' => "ਮੁਲਾਕਾਤ ਹਵਾਲਾ",
    'ta' => "சந்திப்பு குறிப்பு",
    _ => "Encounter reference",
  };
  String get routineReceived => switch (localeName) {
    'hi' =>
      "क्लिनिक ने विवरण प्राप्त किया। अपनी बारी के बारे में कर्मचारी से पूछें।",
    'pa' => "ਕਲੀਨਿਕ ਨੇ ਵੇਰਵੇ ਪ੍ਰਾਪਤ ਕੀਤੇ। ਆਪਣੀ ਵਾਰੀ ਬਾਰੇ ਸਟਾਫ ਨੂੰ ਪੁੱਛੋ।",
    'ta' =>
      "மருத்துவமனை விவரங்களைப் பெற்றது. உங்கள் முறை பற்றி பணியாளரிடம் கேளுங்கள்.",
    _ => "Intake received by the clinic. Ask staff about your turn.",
  };
  String get tokenUnavailable => switch (localeName) {
    'hi' =>
      "वर्तमान API में OPD टोकन, प्रतीक्षा समय और QR उपलब्ध नहीं हैं। यह संदर्भ कतार टोकन नहीं है।",
    'pa' =>
      "ਮੌਜੂਦਾ API ਵਿੱਚ OPD ਟੋਕਨ, ਉਡੀਕ ਸਮਾਂ ਅਤੇ QR ਉਪਲਬਧ ਨਹੀਂ। ਇਹ ਹਵਾਲਾ ਕਤਾਰ ਟੋਕਨ ਨਹੀਂ ਹੈ।",
    'ta' =>
      "தற்போதைய API இல் OPD எண், காத்திருப்பு நேரம், QR இல்லை. இந்தக் குறிப்பு வரிசை எண் அல்ல.",
    _ =>
      "OPD token, estimated wait and QR code are unavailable in the current API. This reference is not a queue token.",
  };
  String get consentRecorded => switch (localeName) {
    'hi' => "देखभाल की सहमति दर्ज हुई",
    'pa' => "ਦੇਖਭਾਲ ਦੀ ਸਹਿਮਤੀ ਦਰਜ ਹੋਈ",
    'ta' => "பராமரிப்பு ஒப்புதல் பதிவானது",
    _ => "Care consent recorded",
  };
  String get resetCountdown => switch (localeName) {
    'hi' => "निष्क्रियता पर रीसेट (सेकंड)",
    'pa' => "ਨਿਸ਼ਕਿਰਿਆ ਹੋਣ ਤੇ ਰੀਸੈੱਟ (ਸਕਿੰਟ)",
    'ta' => "செயல்பாடின்றி மீட்டமைப்பு (வினாடிகள்)",
    _ => "Automatic reset after inactivity (seconds)",
  };
  String get retryUncertain => switch (localeName) {
    'hi' =>
      "परिणाम की पुष्टि नहीं हुई। पुनः प्रयास वही अनुरोध भेजेगा। नया विवरण शुरू करने से पहले कर्मचारी से पूछें।",
    'pa' =>
      "ਨਤੀਜੇ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਹੋਈ। ਮੁੜ ਕੋਸ਼ਿਸ਼ ਉਹੀ ਬੇਨਤੀ ਭੇਜੇਗੀ। ਨਵਾਂ ਵੇਰਵਾ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਟਾਫ ਨੂੰ ਪੁੱਛੋ।",
    'ta' =>
      "முடிவு உறுதியாகவில்லை. மீண்டும் முயல்வது அதே கோரிக்கையை அனுப்பும். புதிய பதிவுக்கு முன் பணியாளரிடம் கேளுங்கள்.",
    _ =>
      "The outcome is not confirmed. Retry sends the same request and key. Ask staff before starting another intake.",
  };
  String get sessionPrivacy => switch (localeName) {
    'hi' =>
      "काल्पनिक विवरण रीसेट तक मेमोरी में रहता है। पूरा होने या रीसेट पर साइन इन मिट जाता है। फोन या ABHA नहीं लिया जाता।",
    'pa' =>
      "ਕਾਲਪਨਿਕ ਵੇਰਵੇ ਰੀਸੈੱਟ ਤੱਕ ਮੈਮੋਰੀ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ। ਪੂਰਾ ਹੋਣ ਜਾਂ ਰੀਸੈੱਟ ਤੇ ਸਾਈਨ ਇਨ ਮਿਟਦਾ ਹੈ। ਫ਼ੋਨ ਜਾਂ ABHA ਨਹੀਂ ਲਿਆ ਜਾਂਦਾ।",
    'ta' =>
      "கற்பனை விவரங்கள் மீட்டமைப்பு வரை நினைவகத்தில் இருக்கும். முடிவில் அல்லது மீட்டமைப்பில் உள்நுழைவு அழிக்கப்படும். தொலைபேசி அல்லது ABHA சேகரிக்கப்படாது.",
    _ =>
      "Synthetic intake stays in memory until reset. Staff sign-in is cleared at completion or reset. No phone or ABHA is collected.",
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
