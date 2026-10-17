import type { WebsiteLocale } from "./website";

/**
 * Reviewed fixed interface copy for the clinician intake workspace and the
 * remaining operations, scheduling, setup, and voice-input controls. Patient
 * data, observations, diagnoses, record values, and generated assessments are
 * intentionally excluded.
 */
export const websiteClinicianCopy: Record<
  string,
  Record<WebsiteLocale, string>
> = {
  "CARE THAT STAYS CONNECTED": {
    "en-IN": "CARE THAT STAYS CONNECTED",
    "hi-IN": "जुड़ी हुई देखभाल",
    "pa-IN": "ਜੁੜੀ ਹੋਈ ਦੇਖਭਾਲ",
    "ta-IN": "இணைந்த பராமரிப்பு",
  },
  "From the first": {
    "en-IN": "From the first",
    "hi-IN": "पहली मुलाक़ात से",
    "pa-IN": "ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਤੋਂ",
    "ta-IN": "முதல் சந்திப்பிலிருந்து",
  },
  "hello to a": {
    "en-IN": "hello to a",
    "hi-IN": "नमस्ते से",
    "pa-IN": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਤੋਂ",
    "ta-IN": "வணக்கம் முதல்",
  },
  "healthier tomorrow.": {
    "en-IN": "healthier tomorrow.",
    "hi-IN": "बेहतर कल तक।",
    "pa-IN": "ਬਿਹਤਰ ਕੱਲ੍ਹ ਤੱਕ।",
    "ta-IN": "ஆரோக்கியமான நாளை வரை.",
  },
  "From the first conversation to the clinician's desk. A shared workspace for care teams and the people they care for.":
    {
      "en-IN":
        "From the first conversation to the clinician's desk. A shared workspace for care teams and the people they care for.",
      "hi-IN":
        "पहली बातचीत से चिकित्सक तक। देखभाल टीमों और उनकी देखरेख में रहने वाले लोगों के लिए साझा कार्यस्थल।",
      "pa-IN":
        "ਪਹਿਲੀ ਗੱਲਬਾਤ ਤੋਂ ਡਾਕਟਰ ਤੱਕ। ਦੇਖਭਾਲ ਟੀਮਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਦੇਖਭਾਲ ਹੇਠ ਲੋਕਾਂ ਲਈ ਸਾਂਝਾ ਕਾਰਜ-ਸਥਾਨ।",
      "ta-IN":
        "முதல் உரையாடலிலிருந்து மருத்துவரிடம் வரை. பராமரிப்பு குழுக்களுக்கும் அவர்கள் கவனிக்கும் மக்களுக்கும் பகிரப்பட்ட பணியிடம்.",
    },
  "Explore AyuSetu and all workspaces →": {
    "en-IN": "Explore AyuSetu and all workspaces →",
    "hi-IN": "आयुसेतु और सभी कार्यस्थलों को देखें →",
    "pa-IN": "ਆਯੁਸੇਤੂ ਅਤੇ ਸਾਰੇ ਕਾਰਜ-ਸਥਾਨ ਵੇਖੋ →",
    "ta-IN": "ஆயுசேது மற்றும் அனைத்து பணியிடங்களையும் பார்க்கவும் →",
  },
  "AYUSETU WORKSPACE": {
    "en-IN": "AYUSETU WORKSPACE",
    "hi-IN": "आयुसेतु कार्यस्थल",
    "pa-IN": "ਆਯੁਸੇਤੂ ਕਾਰਜ-ਸਥਾਨ",
    "ta-IN": "ஆயுசேது பணியிடம்",
  },
  "Welcome to your care workspace": {
    "en-IN": "Welcome to your care workspace",
    "hi-IN": "आपके देखभाल कार्यस्थल में स्वागत है",
    "pa-IN": "ਤੁਹਾਡੇ ਦੇਖਭਾਲ ਕਾਰਜ-ਸਥਾਨ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
    "ta-IN": "உங்கள் பராமரிப்பு பணியிடத்திற்கு வரவேற்கிறோம்",
  },
  "Sign in with your clinic account to continue.": {
    "en-IN": "Sign in with your clinic account to continue.",
    "hi-IN": "आगे बढ़ने के लिए अपने क्लिनिक खाते से साइन इन करें।",
    "pa-IN": "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੇ ਕਲੀਨਿਕ ਖਾਤੇ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰੋ।",
    "ta-IN": "தொடர உங்கள் மருத்துவமனை கணக்கில் உள்நுழையவும்.",
  },
  Organization: {
    "en-IN": "Organization",
    "hi-IN": "संस्था",
    "pa-IN": "ਸੰਸਥਾ",
    "ta-IN": "நிறுவனம்",
  },
  Email: {
    "en-IN": "Email",
    "hi-IN": "ईमेल",
    "pa-IN": "ਈਮੇਲ",
    "ta-IN": "மின்னஞ்சல்",
  },
  Password: {
    "en-IN": "Password",
    "hi-IN": "पासवर्ड",
    "pa-IN": "ਪਾਸਵਰਡ",
    "ta-IN": "கடவுச்சொல்",
  },
  "Signing in…": {
    "en-IN": "Signing in…",
    "hi-IN": "साइन इन हो रहा है…",
    "pa-IN": "ਸਾਈਨ ਇਨ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ…",
    "ta-IN": "உள்நுழைகிறது…",
  },
  "Sign in to workspace →": {
    "en-IN": "Sign in to workspace →",
    "hi-IN": "कार्यक्षेत्र में साइन इन करें →",
    "pa-IN": "ਕਾਰਜ-ਸਥਾਨ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰੋ →",
    "ta-IN": "பணியிடத்தில் உள்நுழையவும் →",
  },
  "Local demo sign-in": {
    "en-IN": "Local demo sign-in",
    "hi-IN": "स्थानीय डेमो साइन-इन",
    "pa-IN": "ਸਥਾਨਕ ਡੈਮੋ ਸਾਈਨ-ਇਨ",
    "ta-IN": "உள்ளூர் மாதிரி உள்நுழைவு",
  },
  "Doctor:": {
    "en-IN": "Doctor:",
    "hi-IN": "डॉक्टर:",
    "pa-IN": "ਡਾਕਟਰ:",
    "ta-IN": "மருத்துவர்:",
  },
  "Nurse:": {
    "en-IN": "Nurse:",
    "hi-IN": "नर्स:",
    "pa-IN": "ਨਰਸ:",
    "ta-IN": "செவிலியர்:",
  },
  "AyuSetu encrypted healthcare workspace.": {
    "en-IN": "AyuSetu encrypted healthcare workspace.",
    "hi-IN": "आयुसेतु एन्क्रिप्टेड स्वास्थ्य सेवा कार्यस्थल।",
    "pa-IN": "ਆਯੁਸੇਤੂ ਇਨਕ੍ਰਿਪਟ ਕੀਤਾ ਸਿਹਤ-ਸੇਵਾ ਕਾਰਜ-ਸਥਾਨ।",
    "ta-IN": "ஆயுசேது மறையாக்கப்பட்ட சுகாதார பணியிடம்.",
  },
  "Check the patient details and confirm care consent before submitting.": {
    "en-IN":
      "Check the patient details and confirm care consent before submitting.",
    "hi-IN": "जमा करने से पहले मरीज़ का विवरण जाँचें और देखभाल की सहमति की पुष्टि करें।",
    "pa-IN": "ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਮਰੀਜ਼ ਦੇ ਵੇਰਵੇ ਜਾਂਚੋ ਅਤੇ ਦੇਖਭਾਲ ਦੀ ਸਹਿਮਤੀ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।",
    "ta-IN":
      "சமர்ப்பிக்கும் முன் நோயாளர் விவரங்களைச் சரிபார்த்து பராமரிப்பு ஒப்புதலை உறுதிப்படுத்தவும்.",
  },
  "AYUSETU KIOSK → CARE TEAM": {
    "en-IN": "AYUSETU KIOSK → CARE TEAM",
    "hi-IN": "आयुसेतु कियोस्क → देखभाल टीम",
    "pa-IN": "ਆਯੁਸੇਤੂ ਕਿਓਸਕ → ਦੇਖਭਾਲ ਟੀਮ",
    "ta-IN": "ஆயுசேது கியோஸ்க் → பராமரிப்பு குழு",
  },
  "Start with a conversation.": {
    "en-IN": "Start with a conversation.",
    "hi-IN": "बातचीत से शुरुआत करें।",
    "pa-IN": "ਗੱਲਬਾਤ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ।",
    "ta-IN": "உரையாடலுடன் தொடங்குங்கள்.",
  },
  "Capture a consented intake. The clinician receives the same encounter.": {
    "en-IN":
      "Capture a consented intake. The clinician receives the same encounter.",
    "hi-IN": "सहमति के साथ जानकारी दर्ज करें। चिकित्सक को वही मुलाक़ात विवरण मिलेगा।",
    "pa-IN": "ਸਹਿਮਤੀ ਨਾਲ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ। ਡਾਕਟਰ ਨੂੰ ਇਹੀ ਮੁਲਾਕਾਤ ਵੇਰਵਾ ਮਿਲੇਗਾ।",
    "ta-IN":
      "ஒப்புதலுடன் வருகை விவரங்களைப் பதிவு செய்யுங்கள். மருத்துவருக்கும் அதே பதிவு கிடைக்கும்.",
  },
  "STAFF-ASSISTED INTAKE": {
    "en-IN": "STAFF-ASSISTED INTAKE",
    "hi-IN": "कर्मचारी-सहायता प्राप्त जानकारी",
    "pa-IN": "ਸਟਾਫ਼ ਦੀ ਮਦਦ ਨਾਲ ਜਾਣਕਾਰੀ ਦਰਜ",
    "ta-IN": "ஊழியர் உதவியுடன் பதிவு",
  },
  "Patient & visit": {
    "en-IN": "Patient & visit",
    "hi-IN": "मरीज़ और मुलाक़ात",
    "pa-IN": "ਮਰੀਜ਼ ਅਤੇ ਮੁਲਾਕਾਤ",
    "ta-IN": "நோயாளர் மற்றும் வருகை",
  },
  "Enter patient registration details for intake.": {
    "en-IN": "Enter patient registration details for intake.",
    "hi-IN": "जानकारी दर्ज करने के लिए मरीज़ का पंजीकरण विवरण भरें।",
    "pa-IN": "ਜਾਣਕਾਰੀ ਦਰਜ ਕਰਨ ਲਈ ਮਰੀਜ਼ ਦੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਵੇਰਵੇ ਭਰੋ।",
    "ta-IN": "பதிவுக்காக நோயாளர் பதிவு விவரங்களை உள்ளிடவும்.",
  },
  "Patient name": {
    "en-IN": "Patient name",
    "hi-IN": "मरीज़ का नाम",
    "pa-IN": "ਮਰੀਜ਼ ਦਾ ਨਾਮ",
    "ta-IN": "நோயாளர் பெயர்",
  },
  "e.g. Patient Full Name": {
    "en-IN": "e.g. Patient Full Name",
    "hi-IN": "जैसे, मरीज़ का पूरा नाम",
    "pa-IN": "ਉਦਾਹਰਨ: ਮਰੀਜ਼ ਦਾ ਪੂਰਾ ਨਾਮ",
    "ta-IN": "எ.கா. நோயாளரின் முழுப் பெயர்",
  },
  "Confirmed date of birth": {
    "en-IN": "Confirmed date of birth",
    "hi-IN": "पुष्टि की गई जन्मतिथि",
    "pa-IN": "ਪੁਸ਼ਟੀ ਕੀਤੀ ਜਨਮ ਮਿਤੀ",
    "ta-IN": "உறுதிப்படுத்தப்பட்ட பிறந்த தேதி",
  },
  "Preferred language": {
    "en-IN": "Preferred language",
    "hi-IN": "पसंदीदा भाषा",
    "pa-IN": "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ",
    "ta-IN": "விருப்ப மொழி",
  },
  "What brings the patient in today?": {
    "en-IN": "What brings the patient in today?",
    "hi-IN": "मरीज़ आज किस समस्या के लिए आए हैं?",
    "pa-IN": "ਮਰੀਜ਼ ਅੱਜ ਕਿਸ ਸਮੱਸਿਆ ਲਈ ਆਏ ਹਨ?",
    "ta-IN": "நோயாளர் இன்று எதற்காக வந்துள்ளார்?",
  },
  "Record the patient's own words. This is a source statement, not a diagnosis.":
    {
      "en-IN":
        "Record the patient's own words. This is a source statement, not a diagnosis.",
      "hi-IN": "मरीज़ के अपने शब्द दर्ज करें। यह मूल कथन है, निदान नहीं।",
      "pa-IN": "ਮਰੀਜ਼ ਦੇ ਆਪਣੇ ਸ਼ਬਦ ਦਰਜ ਕਰੋ। ਇਹ ਮੂਲ ਬਿਆਨ ਹੈ, ਨਿਦਾਨ ਨਹੀਂ।",
      "ta-IN":
        "நோயாளரின் சொந்த வார்த்தைகளைப் பதிவு செய்யுங்கள். இது மூலக் கூற்று; நோயறிதல் அல்ல.",
    },
  "Language preference is saved. Browser dictation transcribes your words; clinical translation is not connected.":
    {
      "en-IN":
        "Language preference is saved. Browser dictation transcribes your words; clinical translation is not connected.",
      "hi-IN":
        "भाषा प्राथमिकता सहेजी गई है। ब्राउज़र डिक्टेशन आपके शब्द लिखता है; चिकित्सीय अनुवाद उपलब्ध नहीं है।",
      "pa-IN":
        "ਭਾਸ਼ਾ ਦੀ ਪਸੰਦ ਸੰਭਾਲੀ ਗਈ ਹੈ। ਬ੍ਰਾਊਜ਼ਰ ਡਿਕਟੇਸ਼ਨ ਤੁਹਾਡੇ ਸ਼ਬਦ ਲਿਖਦਾ ਹੈ; ਕਲੀਨਿਕਲ ਅਨੁਵਾਦ ਜੁੜਿਆ ਨਹੀਂ ਹੈ।",
      "ta-IN":
        "மொழி விருப்பம் சேமிக்கப்பட்டது. உலாவி குரல் உள்ளீட்டை உரையாக்கும்; மருத்துவ மொழிபெயர்ப்பு இணைக்கப்படவில்லை.",
    },
  "Safety screen": {
    "en-IN": "Safety screen",
    "hi-IN": "सुरक्षा जाँच",
    "pa-IN": "ਸੁਰੱਖਿਆ ਜਾਂਚ",
    "ta-IN": "பாதுகாப்பு பரிசோதனை",
  },
  "Deterministic checks · clinician review required": {
    "en-IN": "Deterministic checks · clinician review required",
    "hi-IN": "नियम-आधारित जाँच · चिकित्सक की समीक्षा आवश्यक",
    "pa-IN": "ਨਿਯਮ-ਅਧਾਰਿਤ ਜਾਂਚ · ਡਾਕਟਰ ਦੀ ਸਮੀਖਿਆ ਲਾਜ਼ਮੀ",
    "ta-IN": "விதி சார்ந்த சரிபார்ப்பு · மருத்துவர் மதிப்பாய்வு அவசியம்",
  },
  "Chest pain": {
    "en-IN": "Chest pain",
    "hi-IN": "सीने में दर्द",
    "pa-IN": "ਛਾਤੀ ਵਿੱਚ ਦਰਦ",
    "ta-IN": "மார்பு வலி",
  },
  "Difficulty breathing": {
    "en-IN": "Difficulty breathing",
    "hi-IN": "साँस लेने में कठिनाई",
    "pa-IN": "ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ",
    "ta-IN": "சுவாசிப்பதில் சிரமம்",
  },
  Fainting: {
    "en-IN": "Fainting",
    "hi-IN": "बेहोशी",
    "pa-IN": "ਬੇਹੋਸ਼ੀ",
    "ta-IN": "மயக்கம்",
  },
  Fever: {
    "en-IN": "Fever",
    "hi-IN": "बुखार",
    "pa-IN": "ਬੁਖ਼ਾਰ",
    "ta-IN": "காய்ச்சல்",
  },
  Cough: { "en-IN": "Cough", "hi-IN": "खाँसी", "pa-IN": "ਖੰਘ", "ta-IN": "இருமல்" },
  Fatigue: {
    "en-IN": "Fatigue",
    "hi-IN": "थकान",
    "pa-IN": "ਥਕਾਵਟ",
    "ta-IN": "சோர்வு",
  },
  "Increased thirst": {
    "en-IN": "Increased thirst",
    "hi-IN": "अधिक प्यास",
    "pa-IN": "ਵਧੇਰੇ ਪਿਆਸ",
    "ta-IN": "அதிக தாகம்",
  },
  "Red-flag screen": {
    "en-IN": "Red-flag screen",
    "hi-IN": "जोखिम संकेत जाँच",
    "pa-IN": "ਖ਼ਤਰੇ ਦੇ ਸੰਕੇਤਾਂ ਦੀ ਜਾਂਚ",
    "ta-IN": "அபாய அறிகுறி பரிசோதனை",
  },
  Select: {
    "en-IN": "Select",
    "hi-IN": "चुनें",
    "pa-IN": "ਚੁਣੋ",
    "ta-IN": "தேர்ந்தெடுக்கவும்",
  },
  No: { "en-IN": "No", "hi-IN": "नहीं", "pa-IN": "ਨਹੀਂ", "ta-IN": "இல்லை" },
  Yes: { "en-IN": "Yes", "hi-IN": "हाँ", "pa-IN": "ਹਾਂ", "ta-IN": "ஆம்" },
  Unsure: {
    "en-IN": "Unsure",
    "hi-IN": "निश्चित नहीं",
    "pa-IN": "ਪੱਕਾ ਨਹੀਂ",
    "ta-IN": "உறுதியாகத் தெரியவில்லை",
  },
  "Emergency escalation": {
    "en-IN": "Emergency escalation",
    "hi-IN": "आपातकालीन सहायता",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ",
    "ta-IN": "அவசர உதவி",
  },
  "Seek emergency help now. Do not wait for this app. The care team will see this as an emergency encounter.":
    {
      "en-IN":
        "Seek emergency help now. Do not wait for this app. The care team will see this as an emergency encounter.",
      "hi-IN":
        "अभी आपातकालीन सहायता लें। इस ऐप की प्रतीक्षा न करें। देखभाल टीम इसे आपातकालीन मामले के रूप में देखेगी।",
      "pa-IN":
        "ਹੁਣੇ ਐਮਰਜੈਂਸੀ ਸਹਾਇਤਾ ਲਵੋ। ਇਸ ਐਪ ਦੀ ਉਡੀਕ ਨਾ ਕਰੋ। ਦੇਖਭਾਲ ਟੀਮ ਇਸ ਨੂੰ ਐਮਰਜੈਂਸੀ ਮਾਮਲੇ ਵਜੋਂ ਵੇਖੇਗੀ।",
      "ta-IN":
        "உடனே அவசர உதவியை நாடுங்கள். இந்த செயலிக்காகக் காத்திருக்க வேண்டாம். பராமரிப்பு குழு இதை அவசர வருகையாகக் காணும்.",
    },
  "No diagnosis is generated. A negative screen does not establish safety.": {
    "en-IN":
      "No diagnosis is generated. A negative screen does not establish safety.",
    "hi-IN":
      "कोई निदान तैयार नहीं किया जाता। नकारात्मक जाँच से सुरक्षा की पुष्टि नहीं होती।",
    "pa-IN": "ਕੋਈ ਨਿਦਾਨ ਤਿਆਰ ਨਹੀਂ ਹੁੰਦਾ। ਨਕਾਰਾਤਮਕ ਜਾਂਚ ਸੁਰੱਖਿਆ ਦੀ ਪੁਸ਼ਟੀ ਨਹੀਂ ਕਰਦੀ।",
    "ta-IN": "நோயறிதல் உருவாக்கப்படாது. எதிர்மறை பரிசோதனை பாதுகாப்பை உறுதி செய்யாது.",
  },
  "I confirm the patient's consent to care processing and that all entered details are verified.":
    {
      "en-IN":
        "I confirm the patient's consent to care processing and that all entered details are verified.",
      "hi-IN":
        "मैं पुष्टि करता/करती हूँ कि मरीज़ ने देखभाल प्रक्रिया के लिए सहमति दी है और दर्ज किए गए सभी विवरण सत्यापित हैं।",
      "pa-IN":
        "ਮੈਂ ਪੁਸ਼ਟੀ ਕਰਦਾ/ਕਰਦੀ ਹਾਂ ਕਿ ਮਰੀਜ਼ ਨੇ ਦੇਖਭਾਲ ਪ੍ਰਕਿਰਿਆ ਲਈ ਸਹਿਮਤੀ ਦਿੱਤੀ ਹੈ ਅਤੇ ਦਰਜ ਸਾਰੇ ਵੇਰਵੇ ਤਸਦੀਕ ਕੀਤੇ ਹਨ।",
      "ta-IN":
        "பராமரிப்பு செயலாக்கத்திற்கு நோயாளர் ஒப்புதல் அளித்துள்ளார் என்றும் உள்ளிடப்பட்ட விவரங்கள் சரிபார்க்கப்பட்டுள்ளன என்றும் உறுதிப்படுத்துகிறேன்.",
    },
  "Sending to care team…": {
    "en-IN": "Sending to care team…",
    "hi-IN": "देखभाल टीम को भेजा जा रहा है…",
    "pa-IN": "ਦੇਖਭਾਲ ਟੀਮ ਨੂੰ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ…",
    "ta-IN": "பராமரிப்பு குழுவிற்கு அனுப்பப்படுகிறது…",
  },
  "Send intake to clinician →": {
    "en-IN": "Send intake to clinician →",
    "hi-IN": "जानकारी चिकित्सक को भेजें →",
    "pa-IN": "ਜਾਣਕਾਰੀ ਡਾਕਟਰ ਨੂੰ ਭੇਜੋ →",
    "ta-IN": "விவரங்களை மருத்துவருக்கு அனுப்பவும் →",
  },
  "CLINICAL WORKSPACE": {
    "en-IN": "CLINICAL WORKSPACE",
    "hi-IN": "चिकित्सीय कार्यस्थल",
    "pa-IN": "ਕਲੀਨਿਕਲ ਕਾਰਜ-ਸਥਾਨ",
    "ta-IN": "மருத்துவ பணியிடம்",
  },
  "The patient thread.": {
    "en-IN": "The patient thread.",
    "hi-IN": "मरीज़ की देखभाल-श्रृंखला।",
    "pa-IN": "ਮਰੀਜ਼ ਦੀ ਦੇਖਭਾਲ ਲੜੀ।",
    "ta-IN": "நோயாளர் பராமரிப்பு தொடர்.",
  },
  "Every handoff, in view.": {
    "en-IN": "Every handoff, in view.",
    "hi-IN": "देखभाल का हर हस्तांतरण, एक जगह।",
    "pa-IN": "ਦੇਖਭਾਲ ਦਾ ਹਰ ਹਵਾਲਾ, ਇੱਕ ਥਾਂ।",
    "ta-IN": "ஒவ்வொரு பராமரிப்பு மாற்றமும் ஒரே பார்வையில்.",
  },
  "Intake and clinician review on one record": {
    "en-IN": "Intake and clinician review on one record",
    "hi-IN": "एक ही रिकॉर्ड में जानकारी और चिकित्सक की समीक्षा",
    "pa-IN": "ਇੱਕੋ ਰਿਕਾਰਡ ਵਿੱਚ ਜਾਣਕਾਰੀ ਅਤੇ ਡਾਕਟਰ ਦੀ ਸਮੀਖਿਆ",
    "ta-IN": "ஒரே பதிவில் வருகை விவரங்களும் மருத்துவர் மதிப்பாய்வும்",
  },
  "+ New intake": {
    "en-IN": "+ New intake",
    "hi-IN": "+ नई जानकारी",
    "pa-IN": "+ ਨਵੀਂ ਜਾਣਕਾਰੀ",
    "ta-IN": "+ புதிய பதிவு",
  },
  "Awaiting review": {
    "en-IN": "Awaiting review",
    "hi-IN": "समीक्षा की प्रतीक्षा",
    "pa-IN": "ਸਮੀਖਿਆ ਦੀ ਉਡੀਕ",
    "ta-IN": "மதிப்பாய்வுக்காக காத்திருக்கிறது",
  },
  "Consented encounters": {
    "en-IN": "Consented encounters",
    "hi-IN": "सहमति वाली मुलाक़ातें",
    "pa-IN": "ਸਹਿਮਤੀ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ",
    "ta-IN": "ஒப்புதல் அளிக்கப்பட்ட வருகைகள்",
  },
  "Requires immediate staff attention": {
    "en-IN": "Requires immediate staff attention",
    "hi-IN": "कर्मचारी का तुरंत ध्यान आवश्यक है",
    "pa-IN": "ਸਟਾਫ਼ ਦਾ ਤੁਰੰਤ ਧਿਆਨ ਲੋੜੀਂਦਾ ਹੈ",
    "ta-IN": "ஊழியர்களின் உடனடி கவனம் தேவை",
  },
  "Patient threads": {
    "en-IN": "Patient threads",
    "hi-IN": "मरीज़ की देखभाल-श्रृंखलाएँ",
    "pa-IN": "ਮਰੀਜ਼ ਦੇਖਭਾਲ ਲੜੀਆਂ",
    "ta-IN": "நோயாளர் பராமரிப்பு தொடர்கள்",
  },
  "Latest 100 consented records · persisted locally": {
    "en-IN": "Latest 100 consented records · persisted locally",
    "hi-IN": "नवीनतम 100 सहमति वाले रिकॉर्ड · स्थानीय रूप से सहेजे गए",
    "pa-IN": "ਨਵੀਨਤਮ 100 ਸਹਿਮਤੀ ਵਾਲੇ ਰਿਕਾਰਡ · ਸਥਾਨਕ ਤੌਰ 'ਤੇ ਸੁਰੱਖਿਅਤ",
    "ta-IN": "சமீபத்திய 100 ஒப்புதல் பதிவுகள் · உள்ளூரில் சேமிக்கப்பட்டவை",
  },
  "Recorded safety answers": {
    "en-IN": "Recorded safety answers",
    "hi-IN": "दर्ज किए गए सुरक्षा उत्तर",
    "pa-IN": "ਦਰਜ ਕੀਤੇ ਸੁਰੱਖਿਆ ਜਵਾਬ",
    "ta-IN": "பதிவுசெய்யப்பட்ட பாதுகாப்பு பதில்கள்",
  },
  "Not recorded": {
    "en-IN": "Not recorded",
    "hi-IN": "दर्ज नहीं किया गया",
    "pa-IN": "ਦਰਜ ਨਹੀਂ ਕੀਤਾ",
    "ta-IN": "பதிவு செய்யப்படவில்லை",
  },
  "Emergency pathway remains active": {
    "en-IN": "Emergency pathway remains active",
    "hi-IN": "आपातकालीन प्रक्रिया सक्रिय बनी हुई है",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ਕਾਰਵਾਈ ਹਾਲੇ ਵੀ ਸਰਗਰਮ ਹੈ",
    "ta-IN": "அவசர நடைமுறை தொடர்ந்து செயலில் உள்ளது",
  },
  "Record your review. Prescription signing is a later milestone.": {
    "en-IN": "Record your review. Prescription signing is a later milestone.",
    "hi-IN": "अपनी समीक्षा दर्ज करें। नुस्खे पर हस्ताक्षर की सुविधा बाद में आएगी।",
    "pa-IN": "ਆਪਣੀ ਸਮੀਖਿਆ ਦਰਜ ਕਰੋ। ਨੁਸਖ਼ੇ 'ਤੇ ਦਸਤਖ਼ਤ ਦੀ ਸਹੂਲਤ ਬਾਅਦ ਵਿੱਚ ਆਵੇਗੀ।",
    "ta-IN":
      "உங்கள் மதிப்பாய்வைப் பதிவு செய்யுங்கள். மருந்துச் சீட்டில் கையொப்பமிடுவது பின்னர் சேர்க்கப்படும்.",
  },
  "Saving…": {
    "en-IN": "Saving…",
    "hi-IN": "सहेजा जा रहा है…",
    "pa-IN": "ਸੰਭਾਲਿਆ ਜਾ ਰਿਹਾ ਹੈ…",
    "ta-IN": "சேமிக்கப்படுகிறது…",
  },
  "Save clinician review": {
    "en-IN": "Save clinician review",
    "hi-IN": "चिकित्सक की समीक्षा सहेजें",
    "pa-IN": "ਡਾਕਟਰ ਦੀ ਸਮੀਖਿਆ ਸੰਭਾਲੋ",
    "ta-IN": "மருத்துவர் மதிப்பாய்வைச் சேமிக்கவும்",
  },
  "Consent & record access": {
    "en-IN": "Consent & record access",
    "hi-IN": "सहमति और रिकॉर्ड तक पहुँच",
    "pa-IN": "ਸਹਿਮਤੀ ਅਤੇ ਰਿਕਾਰਡ ਪਹੁੰਚ",
    "ta-IN": "ஒப்புதல் மற்றும் பதிவு அணுகல்",
  },
  "Encounter unavailable": {
    "en-IN": "Encounter unavailable",
    "hi-IN": "मुलाक़ात का रिकॉर्ड उपलब्ध नहीं",
    "pa-IN": "ਮੁਲਾਕਾਤ ਰਿਕਾਰਡ ਉਪਲਬਧ ਨਹੀਂ",
    "ta-IN": "வருகைப் பதிவு கிடைக்கவில்லை",
  },
  "Back to queue": {
    "en-IN": "Back to queue",
    "hi-IN": "कतार पर वापस जाएँ",
    "pa-IN": "ਕਤਾਰ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    "ta-IN": "வரிசைக்குத் திரும்பவும்",
  },
  "Clinic queue": {
    "en-IN": "Clinic queue",
    "hi-IN": "क्लिनिक कतार",
    "pa-IN": "ਕਲੀਨਿਕ ਕਤਾਰ",
    "ta-IN": "மருத்துவமனை வரிசை",
  },
  "Your words": {
    "en-IN": "Your words",
    "hi-IN": "आपके शब्द",
    "pa-IN": "ਤੁਹਾਡੇ ਸ਼ਬਦ",
    "ta-IN": "உங்கள் வார்த்தைகள்",
  },
  "No inventory items found.": {
    "en-IN": "No inventory items found.",
    "hi-IN": "भंडार में कोई वस्तु नहीं मिली।",
    "pa-IN": "ਸਟਾਕ ਵਿੱਚ ਕੋਈ ਵਸਤੂ ਨਹੀਂ ਮਿਲੀ।",
    "ta-IN": "சரக்குப் பொருட்கள் எதுவும் இல்லை.",
  },
  "Add items from inventory": {
    "en-IN": "Add items from inventory",
    "hi-IN": "भंडार से वस्तुएँ जोड़ें",
    "pa-IN": "ਸਟਾਕ ਵਿੱਚੋਂ ਵਸਤਾਂ ਸ਼ਾਮਲ ਕਰੋ",
    "ta-IN": "சரக்கிலிருந்து பொருட்களைச் சேர்க்கவும்",
  },
  "Select Clinic Location": {
    "en-IN": "Select Clinic Location",
    "hi-IN": "क्लिनिक स्थान चुनें",
    "pa-IN": "ਕਲੀਨਿਕ ਦਾ ਸਥਾਨ ਚੁਣੋ",
    "ta-IN": "மருத்துவமனை இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்",
  },
  "Select Consulting Doctor*": {
    "en-IN": "Select Consulting Doctor*",
    "hi-IN": "परामर्श देने वाले डॉक्टर चुनें*",
    "pa-IN": "ਸਲਾਹਕਾਰ ਡਾਕਟਰ ਚੁਣੋ*",
    "ta-IN": "ஆலோசனை மருத்துவரைத் தேர்ந்தெடுக்கவும்*",
  },
  "Select Prescribing Doctor*": {
    "en-IN": "Select Prescribing Doctor*",
    "hi-IN": "नुस्खा लिखने वाले डॉक्टर चुनें*",
    "pa-IN": "ਨੁਸਖ਼ਾ ਲਿਖਣ ਵਾਲੇ ਡਾਕਟਰ ਚੁਣੋ*",
    "ta-IN": "மருந்துச் சீட்டு எழுதும் மருத்துவரைத் தேர்ந்தெடுக்கவும்*",
  },
  "Admit Patient & Finalize": {
    "en-IN": "Admit Patient & Finalize",
    "hi-IN": "मरीज़ को भर्ती करें और पूरा करें",
    "pa-IN": "ਮਰੀਜ਼ ਨੂੰ ਦਾਖ਼ਲ ਕਰਕੇ ਪੂਰਾ ਕਰੋ",
    "ta-IN": "நோயாளரைச் சேர்த்து முடிக்கவும்",
  },
  "Admit patient to hospital ward and process initial deposit.": {
    "en-IN": "Admit patient to hospital ward and process initial deposit.",
    "hi-IN": "मरीज़ को अस्पताल के वार्ड में भर्ती करें और शुरुआती जमा राशि दर्ज करें।",
    "pa-IN": "ਮਰੀਜ਼ ਨੂੰ ਹਸਪਤਾਲ ਵਾਰਡ ਵਿੱਚ ਦਾਖ਼ਲ ਕਰੋ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਜਮ੍ਹਾਂ ਰਕਮ ਦਰਜ ਕਰੋ।",
    "ta-IN":
      "நோயாளரை மருத்துவமனை வார்டில் சேர்த்து ஆரம்ப வைப்புத் தொகையைப் பதிவு செய்யவும்.",
  },
  "Setup Wards First": {
    "en-IN": "Setup Wards First",
    "hi-IN": "पहले वार्ड सेटअप करें",
    "pa-IN": "ਪਹਿਲਾਂ ਵਾਰਡ ਸੈੱਟ ਕਰੋ",
    "ta-IN": "முதலில் வார்டுகளை அமைக்கவும்",
  },
  "Print Reciept & Complete": {
    "en-IN": "Print Reciept & Complete",
    "hi-IN": "रसीद प्रिंट करें और पूरा करें",
    "pa-IN": "ਰਸੀਦ ਛਾਪੋ ਅਤੇ ਪੂਰਾ ਕਰੋ",
    "ta-IN": "ரசீதை அச்சிட்டு முடிக்கவும்",
  },
  "No items found.": {
    "en-IN": "No items found.",
    "hi-IN": "कोई वस्तु नहीं मिली।",
    "pa-IN": "ਕੋਈ ਵਸਤੂ ਨਹੀਂ ਮਿਲੀ।",
    "ta-IN": "பொருட்கள் எதுவும் இல்லை.",
  },
  "Choose the designated clinic to start billing and POS operations.": {
    "en-IN":
      "Choose the designated clinic to start billing and POS operations.",
    "hi-IN": "बिलिंग और POS शुरू करने के लिए निर्धारित क्लिनिक चुनें।",
    "pa-IN": "ਬਿਲਿੰਗ ਅਤੇ POS ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਨਿਰਧਾਰਤ ਕਲੀਨਿਕ ਚੁਣੋ।",
    "ta-IN":
      "பில்லிங் மற்றும் POS செயல்பாடுகளைத் தொடங்க குறிப்பிட்ட மருத்துவமனையைத் தேர்ந்தெடுக்கவும்.",
  },
  "Search clinic inventory for items to add to the cart": {
    "en-IN": "Search clinic inventory for items to add to the cart",
    "hi-IN": "कार्ट में जोड़ने के लिए क्लिनिक के भंडार में वस्तुएँ खोजें",
    "pa-IN": "ਕਾਰਟ ਵਿੱਚ ਪਾਉਣ ਲਈ ਕਲੀਨਿਕ ਸਟਾਕ ਵਿੱਚ ਵਸਤਾਂ ਖੋਜੋ",
    "ta-IN": "கூடையில் சேர்க்க பொருட்களை மருத்துவமனை சரக்கில் தேடவும்",
  },
  "Real-time presence and absence monitoring": {
    "en-IN": "Real-time presence and absence monitoring",
    "hi-IN": "उपस्थिति और अनुपस्थिति की वास्तविक समय निगरानी",
    "pa-IN": "ਹਾਜ਼ਰੀ ਅਤੇ ਗੈਰਹਾਜ਼ਰੀ ਦੀ ਰੀਅਲ-ਟਾਈਮ ਨਿਗਰਾਨੀ",
    "ta-IN": "நிகழ்நேர வருகை மற்றும் வராமை கண்காணிப்பு",
  },
  "Full attendance today!": {
    "en-IN": "Full attendance today!",
    "hi-IN": "आज सभी उपस्थित हैं!",
    "pa-IN": "ਅੱਜ ਪੂਰੀ ਹਾਜ਼ਰੀ ਹੈ!",
    "ta-IN": "இன்று அனைவரும் வந்துள்ளனர்!",
  },
  "No staff currently clocked in.": {
    "en-IN": "No staff currently clocked in.",
    "hi-IN": "अभी किसी कर्मचारी ने हाज़िरी दर्ज नहीं की है।",
    "pa-IN": "ਇਸ ਵੇਲੇ ਕਿਸੇ ਸਟਾਫ਼ ਨੇ ਹਾਜ਼ਰੀ ਦਰਜ ਨਹੀਂ ਕੀਤੀ।",
    "ta-IN": "தற்போது எந்த ஊழியரும் வருகைப் பதிவு செய்யவில்லை.",
  },
  "No attendance records found yet.": {
    "en-IN": "No attendance records found yet.",
    "hi-IN": "अभी तक उपस्थिति रिकॉर्ड नहीं मिले।",
    "pa-IN": "ਹਾਲੇ ਤੱਕ ਹਾਜ਼ਰੀ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲੇ।",
    "ta-IN": "வருகைப் பதிவுகள் இன்னும் இல்லை.",
  },
  "No staff records found.": {
    "en-IN": "No staff records found.",
    "hi-IN": "कर्मचारियों के रिकॉर्ड नहीं मिले।",
    "pa-IN": "ਸਟਾਫ਼ ਦੇ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲੇ।",
    "ta-IN": "ஊழியர் பதிவுகள் எதுவும் இல்லை.",
  },
  "No pending actions.": {
    "en-IN": "No pending actions.",
    "hi-IN": "कोई कार्रवाई लंबित नहीं है।",
    "pa-IN": "ਕੋਈ ਕਾਰਵਾਈ ਬਕਾਇਆ ਨਹੀਂ ਹੈ।",
    "ta-IN": "நிலுவையில் எந்தச் செயல்களும் இல்லை.",
  },
  "Please select a clinic to view staff.": {
    "en-IN": "Please select a clinic to view staff.",
    "hi-IN": "कर्मचारी देखने के लिए क्लिनिक चुनें।",
    "pa-IN": "ਸਟਾਫ਼ ਵੇਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਕਲੀਨਿਕ ਚੁਣੋ।",
    "ta-IN": "ஊழியர்களைக் காண மருத்துவமனையைத் தேர்ந்தெடுக்கவும்.",
  },
  "No Shifts Created": {
    "en-IN": "No Shifts Created",
    "hi-IN": "कोई शिफ्ट नहीं बनाई गई",
    "pa-IN": "ਕੋਈ ਸ਼ਿਫਟ ਨਹੀਂ ਬਣਾਈ",
    "ta-IN": "பணிப்பொழுதுகள் உருவாக்கப்படவில்லை",
  },
  "No shift assigned": {
    "en-IN": "No shift assigned",
    "hi-IN": "कोई शिफ्ट निर्धारित नहीं",
    "pa-IN": "ਕੋਈ ਸ਼ਿਫਟ ਨਿਰਧਾਰਤ ਨਹੀਂ",
    "ta-IN": "பணிப்பொழுது ஒதுக்கப்படவில்லை",
  },
  "Create Shift Template": {
    "en-IN": "Create Shift Template",
    "hi-IN": "शिफ्ट टेम्पलेट बनाएँ",
    "pa-IN": "ਸ਼ਿਫਟ ਟੈਂਪਲੇਟ ਬਣਾਓ",
    "ta-IN": "பணிப்பொழுது வார்ப்புருவை உருவாக்கவும்",
  },
  "Assign each staff member to a shift for attendance enforcement": {
    "en-IN": "Assign each staff member to a shift for attendance enforcement",
    "hi-IN": "उपस्थिति नियम लागू करने के लिए हर कर्मचारी को शिफ्ट दें",
    "pa-IN": "ਹਾਜ਼ਰੀ ਨਿਯਮ ਲਾਗੂ ਕਰਨ ਲਈ ਹਰ ਸਟਾਫ਼ ਮੈਂਬਰ ਨੂੰ ਸ਼ਿਫਟ ਦਿਓ",
    "ta-IN": "வருகை விதிகளைச் செயல்படுத்த ஒவ்வொரு ஊழியருக்கும் பணிப்பொழுதை ஒதுக்கவும்",
  },
  "Manage staff schedules and attendance windows": {
    "en-IN": "Manage staff schedules and attendance windows",
    "hi-IN": "कर्मचारियों का समय-सारणी और उपस्थिति अवधि प्रबंधित करें",
    "pa-IN": "ਸਟਾਫ਼ ਦੀ ਸਮਾਂ-ਸਾਰਣੀ ਅਤੇ ਹਾਜ਼ਰੀ ਸਮਾਂ ਪ੍ਰਬੰਧੋ",
    "ta-IN": "ஊழியர் அட்டவணைகள் மற்றும் வருகை நேரங்களை நிர்வகிக்கவும்",
  },
  "How early staff can punch in before shift start": {
    "en-IN": "How early staff can punch in before shift start",
    "hi-IN": "शिफ्ट शुरू होने से कितनी देर पहले कर्मचारी हाज़िरी लगा सकते हैं",
    "pa-IN": "ਸ਼ਿਫਟ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਕਿੰਨਾ ਪਹਿਲਾਂ ਸਟਾਫ਼ ਹਾਜ਼ਰੀ ਲਗਾ ਸਕਦਾ ਹੈ",
    "ta-IN":
      "பணிப்பொழுது தொடங்குவதற்கு முன் எவ்வளவு நேரம் முன்னதாக வருகைப் பதிவு செய்யலாம்",
  },
  "After this, punch-in is blocked (auto-absent)": {
    "en-IN": "After this, punch-in is blocked (auto-absent)",
    "hi-IN": "इसके बाद हाज़िरी बंद हो जाएगी (अपने-आप अनुपस्थित)",
    "pa-IN": "ਇਸ ਤੋਂ ਬਾਅਦ ਹਾਜ਼ਰੀ ਬੰਦ ਹੋਵੇਗੀ (ਆਪਣੇ-ਆਪ ਗੈਰਹਾਜ਼ਰ)",
    "ta-IN": "இதற்குப் பிறகு வருகைப் பதிவு தடுக்கப்படும் (தானாக வரவில்லை எனக் குறிக்கும்)",
  },
  "Create Shift": {
    "en-IN": "Create Shift",
    "hi-IN": "शिफ्ट बनाएँ",
    "pa-IN": "ਸ਼ਿਫਟ ਬਣਾਓ",
    "ta-IN": "பணிப்பொழுதை உருவாக்கவும்",
  },
  "Edit Shift": {
    "en-IN": "Edit Shift",
    "hi-IN": "शिफ्ट संपादित करें",
    "pa-IN": "ਸ਼ਿਫਟ ਸੋਧੋ",
    "ta-IN": "பணிப்பொழுதைத் திருத்தவும்",
  },
  "Shift Name": {
    "en-IN": "Shift Name",
    "hi-IN": "शिफ्ट का नाम",
    "pa-IN": "ਸ਼ਿਫਟ ਦਾ ਨਾਮ",
    "ta-IN": "பணிப்பொழுது பெயர்",
  },
  "Shift Preview": {
    "en-IN": "Shift Preview",
    "hi-IN": "शिफ्ट पूर्वावलोकन",
    "pa-IN": "ਸ਼ਿਫਟ ਝਲਕ",
    "ta-IN": "பணிப்பொழுது முன்னோட்டம்",
  },
  "Assigned Shift": {
    "en-IN": "Assigned Shift",
    "hi-IN": "निर्धारित शिफ्ट",
    "pa-IN": "ਨਿਰਧਾਰਤ ਸ਼ਿਫਟ",
    "ta-IN": "ஒதுக்கப்பட்ட பணிப்பொழுது",
  },
  "Early Grace (min)": {
    "en-IN": "Early Grace (min)",
    "hi-IN": "पहले आने की छूट (मिनट)",
    "pa-IN": "ਜਲਦੀ ਆਉਣ ਦੀ ਛੋਟ (ਮਿੰਟ)",
    "ta-IN": "முன்கூட்டிய அனுமதி (நிமிடங்கள்)",
  },
  "Late Cutoff (min)": {
    "en-IN": "Late Cutoff (min)",
    "hi-IN": "देर की सीमा (मिनट)",
    "pa-IN": "ਦੇਰੀ ਦੀ ਹੱਦ (ਮਿੰਟ)",
    "ta-IN": "தாமத வரம்பு (நிமிடங்கள்)",
  },
  "Shift Operations": {
    "en-IN": "Shift Operations",
    "hi-IN": "शिफ्ट संचालन",
    "pa-IN": "ਸ਼ਿਫਟ ਕਾਰਜ",
    "ta-IN": "பணிப்பொழுது செயல்பாடுகள்",
  },
  "Hospital Entity Name": {
    "en-IN": "Hospital Entity Name",
    "hi-IN": "अस्पताल संस्था का नाम",
    "pa-IN": "ਹਸਪਤਾਲ ਸੰਸਥਾ ਦਾ ਨਾਮ",
    "ta-IN": "மருத்துவமனை நிறுவனத்தின் பெயர்",
  },
  "Clinic / Branch Name": {
    "en-IN": "Clinic / Branch Name",
    "hi-IN": "क्लिनिक / शाखा का नाम",
    "pa-IN": "ਕਲੀਨਿਕ / ਸ਼ਾਖਾ ਦਾ ਨਾਮ",
    "ta-IN": "மருத்துவமனை / கிளை பெயர்",
  },
  "Administrative Email": {
    "en-IN": "Administrative Email",
    "hi-IN": "प्रशासनिक ईमेल",
    "pa-IN": "ਪ੍ਰਸ਼ਾਸਕੀ ਈਮੇਲ",
    "ta-IN": "நிர்வாக மின்னஞ்சல்",
  },
  "Primary contact for billing and verification links.": {
    "en-IN": "Primary contact for billing and verification links.",
    "hi-IN": "बिलिंग और सत्यापन लिंक के लिए मुख्य संपर्क।",
    "pa-IN": "ਬਿਲਿੰਗ ਅਤੇ ਤਸਦੀਕ ਲਿੰਕਾਂ ਲਈ ਮੁੱਖ ਸੰਪਰਕ।",
    "ta-IN": "பில்லிங் மற்றும் சரிபார்ப்பு இணைப்புகளுக்கான முதன்மை தொடர்பு.",
  },
  "Unique Slug (ID)": {
    "en-IN": "Unique Slug (ID)",
    "hi-IN": "अद्वितीय पहचान (ID)",
    "pa-IN": "ਵਿਲੱਖਣ ਸਲੱਗ (ID)",
    "ta-IN": "தனித்துவ அடையாளம் (ID)",
  },
  "Used for URL identification. Must be unique.": {
    "en-IN": "Used for URL identification. Must be unique.",
    "hi-IN": "URL पहचान के लिए उपयोग होता है। यह अद्वितीय होना चाहिए।",
    "pa-IN": "URL ਪਛਾਣ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਵਿਲੱਖਣ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
    "ta-IN": "URL அடையாளத்திற்கு பயன்படுத்தப்படும். இது தனித்துவமாக இருக்க வேண்டும்.",
  },
  "Branding Color": {
    "en-IN": "Branding Color",
    "hi-IN": "ब्रांड रंग",
    "pa-IN": "ਬ੍ਰਾਂਡ ਰੰਗ",
    "ta-IN": "பிராண்ட் நிறம்",
  },
  "Setup Organization": {
    "en-IN": "Setup Organization",
    "hi-IN": "संस्था सेटअप करें",
    "pa-IN": "ਸੰਸਥਾ ਸੈੱਟ ਕਰੋ",
    "ta-IN": "நிறுவனத்தை அமைக்கவும்",
  },
  "Hospital Registered!": {
    "en-IN": "Hospital Registered!",
    "hi-IN": "अस्पताल पंजीकृत हो गया!",
    "pa-IN": "ਹਸਪਤਾਲ ਰਜਿਸਟਰ ਹੋ ਗਿਆ!",
    "ta-IN": "மருத்துவமனை பதிவு செய்யப்பட்டது!",
  },
  "Not a Hospital Owner?": {
    "en-IN": "Not a Hospital Owner?",
    "hi-IN": "क्या आप अस्पताल के मालिक नहीं हैं?",
    "pa-IN": "ਕੀ ਤੁਸੀਂ ਹਸਪਤਾਲ ਦੇ ਮਾਲਕ ਨਹੀਂ ਹੋ?",
    "ta-IN": "நீங்கள் மருத்துவமனை உரிமையாளர் இல்லையா?",
  },
  "You can add more clinics and pharmacy counters later from the dashboard.": {
    "en-IN":
      "You can add more clinics and pharmacy counters later from the dashboard.",
    "hi-IN": "आप बाद में डैशबोर्ड से और क्लिनिक तथा फ़ार्मेसी काउंटर जोड़ सकते हैं।",
    "pa-IN": "ਤੁਸੀਂ ਬਾਅਦ ਵਿੱਚ ਡੈਸ਼ਬੋਰਡ ਤੋਂ ਹੋਰ ਕਲੀਨਿਕ ਅਤੇ ਫਾਰਮੇਸੀ ਕਾਊਂਟਰ ਜੋੜ ਸਕਦੇ ਹੋ।",
    "ta-IN":
      "பின்னர் டாஷ்போர்டிலிருந்து மேலும் மருத்துவமனைகளையும் மருந்தக கவுண்டர்களையும் சேர்க்கலாம்.",
  },
  "No matching transactions": {
    "en-IN": "No matching transactions",
    "hi-IN": "कोई मेल खाता लेन-देन नहीं",
    "pa-IN": "ਕੋਈ ਮੇਲ ਖਾਂਦਾ ਲੈਣ-ਦੇਣ ਨਹੀਂ",
    "ta-IN": "பொருந்தும் பரிவர்த்தனைகள் இல்லை",
  },
  "No sales recorded yet today.": {
    "en-IN": "No sales recorded yet today.",
    "hi-IN": "आज अभी तक कोई बिक्री दर्ज नहीं हुई।",
    "pa-IN": "ਅੱਜ ਹਾਲੇ ਤੱਕ ਕੋਈ ਵਿਕਰੀ ਦਰਜ ਨਹੀਂ ਹੋਈ।",
    "ta-IN": "இன்று இதுவரை விற்பனை பதிவு செய்யப்படவில்லை.",
  },
  "No transactions match these filter criteria": {
    "en-IN": "No transactions match these filter criteria",
    "hi-IN": "इन फ़िल्टर मानदंडों से कोई लेन-देन मेल नहीं खाता",
    "pa-IN": "ਇਨ੍ਹਾਂ ਫਿਲਟਰ ਮਾਪਦੰਡਾਂ ਨਾਲ ਕੋਈ ਲੈਣ-ਦੇਣ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ",
    "ta-IN": "இந்த வடிகட்டி நிபந்தனைகளுக்கு எந்தப் பரிவர்த்தனையும் பொருந்தவில்லை",
  },
  "No matching orders found.": {
    "en-IN": "No matching orders found.",
    "hi-IN": "कोई मेल खाता ऑर्डर नहीं मिला।",
    "pa-IN": "ਕੋਈ ਮੇਲ ਖਾਂਦਾ ਆਰਡਰ ਨਹੀਂ ਮਿਲਿਆ।",
    "ta-IN": "பொருந்தும் ஆர்டர்கள் எதுவும் இல்லை.",
  },
  "No matching payments found.": {
    "en-IN": "No matching payments found.",
    "hi-IN": "कोई मेल खाता भुगतान नहीं मिला।",
    "pa-IN": "ਕੋਈ ਮੇਲ ਖਾਂਦਾ ਭੁਗਤਾਨ ਨਹੀਂ ਮਿਲਿਆ।",
    "ta-IN": "பொருந்தும் கட்டணங்கள் எதுவும் இல்லை.",
  },
  "No notes recorded yet.": {
    "en-IN": "No notes recorded yet.",
    "hi-IN": "अभी तक कोई नोट दर्ज नहीं हुआ।",
    "pa-IN": "ਹਾਲੇ ਤੱਕ ਕੋਈ ਨੋਟ ਦਰਜ ਨਹੀਂ ਹੋਇਆ।",
    "ta-IN": "குறிப்புகள் எதுவும் இன்னும் பதிவு செய்யப்படவில்லை.",
  },
  "No prices saved yet. Upload a CSV to get started.": {
    "en-IN": "No prices saved yet. Upload a CSV to get started.",
    "hi-IN": "अभी कोई कीमत सहेजी नहीं गई। शुरू करने के लिए CSV अपलोड करें।",
    "pa-IN": "ਹਾਲੇ ਕੋਈ ਕੀਮਤ ਸੰਭਾਲੀ ਨਹੀਂ ਗਈ। ਸ਼ੁਰੂ ਕਰਨ ਲਈ CSV ਅੱਪਲੋਡ ਕਰੋ।",
    "ta-IN": "விலைகள் எதுவும் சேமிக்கப்படவில்லை. தொடங்க CSV கோப்பைப் பதிவேற்றவும்.",
  },
  "Negotiated items and prices for this supplier.": {
    "en-IN": "Negotiated items and prices for this supplier.",
    "hi-IN": "इस आपूर्तिकर्ता के लिए तय की गई वस्तुएँ और कीमतें।",
    "pa-IN": "ਇਸ ਸਪਲਾਇਰ ਲਈ ਤੈਅ ਕੀਤੀਆਂ ਵਸਤਾਂ ਅਤੇ ਕੀਮਤਾਂ।",
    "ta-IN": "இந்த வழங்குநருக்காக ஒப்பந்தம் செய்யப்பட்ட பொருட்களும் விலைகளும்.",
  },
  "Recent adjustments for this supplier.": {
    "en-IN": "Recent adjustments for this supplier.",
    "hi-IN": "इस आपूर्तिकर्ता के हाल के समायोजन।",
    "pa-IN": "ਇਸ ਸਪਲਾਇਰ ਲਈ ਹਾਲੀਆ ਤਬਦੀਲੀਆਂ।",
    "ta-IN": "இந்த வழங்குநருக்கான சமீபத்திய சரிசெய்தல்கள்.",
  },
  "Track pending dues and payment history.": {
    "en-IN": "Track pending dues and payment history.",
    "hi-IN": "बकाया राशि और भुगतान इतिहास देखें।",
    "pa-IN": "ਬਕਾਇਆ ਰਕਮ ਅਤੇ ਭੁਗਤਾਨ ਇਤਿਹਾਸ ਵੇਖੋ।",
    "ta-IN": "நிலுவைத் தொகை மற்றும் கட்டண வரலாற்றைக் கண்காணிக்கவும்.",
  },
  "No critical shortages below minimum safety stock.": {
    "en-IN": "No critical shortages below minimum safety stock.",
    "hi-IN": "न्यूनतम सुरक्षा स्टॉक से नीचे कोई गंभीर कमी नहीं है।",
    "pa-IN": "ਘੱਟੋ-ਘੱਟ ਸੁਰੱਖਿਆ ਸਟਾਕ ਤੋਂ ਹੇਠਾਂ ਕੋਈ ਗੰਭੀਰ ਘਾਟ ਨਹੀਂ।",
    "ta-IN": "குறைந்தபட்ச பாதுகாப்பு இருப்புக்குக் கீழே முக்கிய பற்றாக்குறை இல்லை.",
  },
  "No inventory items match your current filters.": {
    "en-IN": "No inventory items match your current filters.",
    "hi-IN": "आपके मौजूदा फ़िल्टर से कोई भंडार वस्तु मेल नहीं खाती।",
    "pa-IN": "ਤੁਹਾਡੇ ਮੌਜੂਦਾ ਫਿਲਟਰਾਂ ਨਾਲ ਕੋਈ ਸਟਾਕ ਵਸਤੂ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।",
    "ta-IN": "தற்போதைய வடிகட்டிகளுக்கு சரக்கு பொருட்கள் எதுவும் பொருந்தவில்லை.",
  },
  "Exit Historical Mode to add new stock records": {
    "en-IN": "Exit Historical Mode to add new stock records",
    "hi-IN": "नया स्टॉक रिकॉर्ड जोड़ने के लिए ऐतिहासिक मोड से बाहर निकलें",
    "pa-IN": "ਨਵੇਂ ਸਟਾਕ ਰਿਕਾਰਡ ਜੋੜਨ ਲਈ ਇਤਿਹਾਸਕ ਮੋਡ ਤੋਂ ਬਾਹਰ ਆਓ",
    "ta-IN": "புதிய சரக்கு பதிவுகளைச் சேர்க்க வரலாற்று முறையிலிருந்து வெளியேறவும்",
  },
  "Select a date to export the inventory state as it was on that day": {
    "en-IN":
      "Select a date to export the inventory state as it was on that day",
    "hi-IN": "उस दिन की भंडार स्थिति निर्यात करने के लिए तारीख चुनें",
    "pa-IN": "ਉਸ ਦਿਨ ਦੀ ਸਟਾਕ ਸਥਿਤੀ ਨਿਰਯਾਤ ਕਰਨ ਲਈ ਮਿਤੀ ਚੁਣੋ",
    "ta-IN": "அந்த நாளின் சரக்கு நிலையை ஏற்றுமதி செய்ய தேதியைத் தேர்ந்தெடுக்கவும்",
  },
  "You need administrative privileges to view settings.": {
    "en-IN": "You need administrative privileges to view settings.",
    "hi-IN": "सेटिंग देखने के लिए प्रशासनिक अनुमति आवश्यक है।",
    "pa-IN": "ਸੈਟਿੰਗਾਂ ਵੇਖਣ ਲਈ ਪ੍ਰਸ਼ਾਸਕੀ ਅਧਿਕਾਰ ਲੋੜੀਂਦੇ ਹਨ।",
    "ta-IN": "அமைப்புகளைக் காண நிர்வாக அனுமதி தேவை.",
  },
  "Automatically log out inactive terminals.": {
    "en-IN": "Automatically log out inactive terminals.",
    "hi-IN": "निष्क्रिय टर्मिनलों को अपने-आप लॉग आउट करें।",
    "pa-IN": "ਨਿਸ਼ਕ੍ਰਿਆ ਟਰਮੀਨਲਾਂ ਨੂੰ ਆਪਣੇ-ਆਪ ਲੌਗ ਆਉਟ ਕਰੋ।",
    "ta-IN": "செயலற்ற முனையங்களைத் தானாக வெளியேற்றவும்.",
  },
  "Auto-generate purchase orders when stock is low. (Coming Soon)": {
    "en-IN": "Auto-generate purchase orders when stock is low. (Coming Soon)",
    "hi-IN": "स्टॉक कम होने पर खरीद ऑर्डर अपने-आप बनाएँ। (जल्द आ रहा है)",
    "pa-IN": "ਸਟਾਕ ਘੱਟ ਹੋਣ 'ਤੇ ਖਰੀਦ ਆਰਡਰ ਆਪਣੇ-ਆਪ ਬਣਾਓ। (ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ)",
    "ta-IN": "சரக்கு குறையும்போது கொள்முதல் ஆர்டர்களைத் தானாக உருவாக்கவும். (விரைவில்)",
  },
  "Determine what events trigger push or email notifications to you.": {
    "en-IN":
      "Determine what events trigger push or email notifications to you.",
    "hi-IN": "तय करें कि किन घटनाओं पर आपको पुश या ईमेल सूचनाएँ मिलें।",
    "pa-IN": "ਚੁਣੋ ਕਿ ਕਿਹੜੀਆਂ ਘਟਨਾਵਾਂ 'ਤੇ ਤੁਹਾਨੂੰ ਪੁਸ਼ ਜਾਂ ਈਮੇਲ ਸੂਚਨਾਵਾਂ ਮਿਲਣ।",
    "ta-IN":
      "எந்த நிகழ்வுகளுக்கு உங்களுக்கு புஷ் அல்லது மின்னஞ்சல் அறிவிப்புகள் வர வேண்டும் என்பதைத் தேர்வுசெய்யவும்.",
  },
  "Manage connection keys to external gateways.": {
    "en-IN": "Manage connection keys to external gateways.",
    "hi-IN": "बाहरी गेटवे के कनेक्शन कुंजी प्रबंधित करें।",
    "pa-IN": "ਬਾਹਰੀ ਗੇਟਵੇ ਦੀਆਂ ਕਨੈਕਸ਼ਨ ਕੁੰਜੀਆਂ ਪ੍ਰਬੰਧੋ।",
    "ta-IN": "வெளிப்புற நுழைவாயில்களுக்கான இணைப்பு விசைகளை நிர்வகிக்கவும்.",
  },
  "Daily summary of items below threshold.": {
    "en-IN": "Daily summary of items below threshold.",
    "hi-IN": "सीमा से नीचे की वस्तुओं का दैनिक सारांश।",
    "pa-IN": "ਹੱਦ ਤੋਂ ਹੇਠਾਂ ਵਸਤਾਂ ਦਾ ਰੋਜ਼ਾਨਾ ਸਾਰ।",
    "ta-IN": "வரம்புக்குக் கீழுள்ள பொருட்களின் தினசரி சுருக்கம்.",
  },
  "Define operational boundaries for attendance tracking.": {
    "en-IN": "Define operational boundaries for attendance tracking.",
    "hi-IN": "उपस्थिति निगरानी के लिए संचालन सीमाएँ तय करें।",
    "pa-IN": "ਹਾਜ਼ਰੀ ਨਿਗਰਾਨੀ ਲਈ ਕਾਰਜ ਸੀਮਾਵਾਂ ਨਿਰਧਾਰਤ ਕਰੋ।",
    "ta-IN": "வருகை கண்காணிப்புக்கான செயல்பாட்டு வரம்புகளை வரையறுக்கவும்.",
  },
  "Define standards applied instantly across the network.": {
    "en-IN": "Define standards applied instantly across the network.",
    "hi-IN": "पूरे नेटवर्क पर तुरंत लागू होने वाले मानक तय करें।",
    "pa-IN": "ਪੂਰੇ ਨੈੱਟਵਰਕ 'ਤੇ ਤੁਰੰਤ ਲਾਗੂ ਹੋਣ ਵਾਲੇ ਮਿਆਰ ਨਿਰਧਾਰਤ ਕਰੋ।",
    "ta-IN": "முழு வலையமைப்பிலும் உடனடியாகப் பயன்படுத்தப்படும் தரநிலைகளை வரையறுக்கவும்.",
  },
  "Enable check-ins spanning across midnight.": {
    "en-IN": "Enable check-ins spanning across midnight.",
    "hi-IN": "आधी रात पार करने वाली शिफ्टों की हाज़िरी सक्षम करें।",
    "pa-IN": "ਅੱਧੀ ਰਾਤ ਤੋਂ ਪਾਰ ਵਾਲੀਆਂ ਸ਼ਿਫਟਾਂ ਦੀ ਹਾਜ਼ਰੀ ਚਾਲੂ ਕਰੋ।",
    "ta-IN": "நள்ளிரவைக் கடக்கும் பணிப்பொழுதுகளுக்கான வருகைப் பதிவை இயக்கவும்.",
  },
  "Force all medical staff to use SMS or Authenticator App.": {
    "en-IN": "Force all medical staff to use SMS or Authenticator App.",
    "hi-IN":
      "सभी चिकित्सा कर्मचारियों के लिए SMS या Authenticator App का उपयोग अनिवार्य करें।",
    "pa-IN": "ਸਾਰੇ ਮੈਡੀਕਲ ਸਟਾਫ਼ ਲਈ SMS ਜਾਂ Authenticator App ਦੀ ਵਰਤੋਂ ਲਾਜ਼ਮੀ ਕਰੋ।",
    "ta-IN":
      "அனைத்து மருத்துவ ஊழியர்களும் SMS அல்லது Authenticator செயலியைப் பயன்படுத்துவதை கட்டாயமாக்கவும்.",
  },
  "Staff cannot manually discount items at POS.": {
    "en-IN": "Staff cannot manually discount items at POS.",
    "hi-IN": "कर्मचारी POS पर वस्तुओं पर मैन्युअल छूट नहीं दे सकते।",
    "pa-IN": "ਸਟਾਫ਼ POS 'ਤੇ ਵਸਤਾਂ ਲਈ ਹੱਥੀਂ ਛੋਟ ਨਹੀਂ ਦੇ ਸਕਦਾ।",
    "ta-IN": "ஊழியர்கள் POS-இல் பொருட்களுக்கு கைமுறையாக தள்ளுபடி வழங்க முடியாது.",
  },
  "Update your primary healthcare organization details.": {
    "en-IN": "Update your primary healthcare organization details.",
    "hi-IN": "अपनी मुख्य स्वास्थ्य सेवा संस्था का विवरण अपडेट करें।",
    "pa-IN": "ਆਪਣੀ ਮੁੱਖ ਸਿਹਤ ਸੰਸਥਾ ਦੇ ਵੇਰਵੇ ਅੱਪਡੇਟ ਕਰੋ।",
    "ta-IN": "உங்கள் முதன்மை சுகாதார நிறுவன விவரங்களைப் புதுப்பிக்கவும்.",
  },
  "Customize the local Point of Sale experience.": {
    "en-IN": "Customize the local Point of Sale experience.",
    "hi-IN": "स्थानीय Point of Sale अनुभव को अनुकूलित करें।",
    "pa-IN": "ਸਥਾਨਕ Point of Sale ਅਨੁਭਵ ਨੂੰ ਅਨੁਕੂਲ ਬਣਾਓ।",
    "ta-IN": "உள்ளூர் Point of Sale அனுபவத்தைத் தனிப்பயனாக்கவும்.",
  },
  "Enforce security across all integrated clinics.": {
    "en-IN": "Enforce security across all integrated clinics.",
    "hi-IN": "सभी जुड़े हुए क्लिनिकों में सुरक्षा लागू करें।",
    "pa-IN": "ਸਾਰੇ ਜੁੜੇ ਕਲੀਨਿਕਾਂ ਵਿੱਚ ਸੁਰੱਖਿਆ ਲਾਗੂ ਕਰੋ।",
    "ta-IN": "இணைக்கப்பட்ட அனைத்து மருத்துவமனைகளிலும் பாதுகாப்பைச் செயல்படுத்தவும்.",
  },
  "Local contact and identification details for receipts.": {
    "en-IN": "Local contact and identification details for receipts.",
    "hi-IN": "रसीदों के लिए स्थानीय संपर्क और पहचान विवरण।",
    "pa-IN": "ਰਸੀਦਾਂ ਲਈ ਸਥਾਨਕ ਸੰਪਰਕ ਅਤੇ ਪਛਾਣ ਵੇਰਵੇ।",
    "ta-IN": "ரசீதுகளுக்கான உள்ளூர் தொடர்பு மற்றும் அடையாள விவரங்கள்.",
  },
  "Master threshold for low-stock warnings (in packs) across all clinics.": {
    "en-IN":
      "Master threshold for low-stock warnings (in packs) across all clinics.",
    "hi-IN": "सभी क्लिनिकों में कम स्टॉक चेतावनी की मुख्य सीमा (पैक में)।",
    "pa-IN": "ਸਾਰੇ ਕਲੀਨਿਕਾਂ ਵਿੱਚ ਘੱਟ ਸਟਾਕ ਚੇਤਾਵਨੀ ਦੀ ਮੁੱਖ ਹੱਦ (ਪੈਕਾਂ ਵਿੱਚ)।",
    "ta-IN":
      "அனைத்து மருத்துவமனைகளிலும் குறைந்த சரக்கு எச்சரிக்கைக்கான முதன்மை வரம்பு (பொதிகளில்).",
  },
  "AyuSetu Operations": {
    "en-IN": "AyuSetu Operations",
    "hi-IN": "आयुसेतु संचालन",
    "pa-IN": "ਆਯੁਸੇਤੂ ਕਾਰਜ",
    "ta-IN": "ஆயுசேது செயல்பாடுகள்",
  },
  "Your words. Your language.": {
    "en-IN": "Your words. Your language.",
    "hi-IN": "आपके शब्द। आपकी भाषा।",
    "pa-IN": "ਤੁਹਾਡੇ ਸ਼ਬਦ। ਤੁਹਾਡੀ ਭਾਸ਼ਾ।",
    "ta-IN": "உங்கள் வார்த்தைகள். உங்கள் மொழி.",
  },
  "Preparing your microphone…": {
    "en-IN": "Preparing your microphone…",
    "hi-IN": "माइक्रोफ़ोन तैयार हो रहा है…",
    "pa-IN": "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਤਿਆਰ ਹੋ ਰਿਹਾ ਹੈ…",
    "ta-IN": "ஒலிவாங்கி தயாராகிறது…",
  },
  "Listening to you…": {
    "en-IN": "Listening to you…",
    "hi-IN": "आपकी बात सुनी जा रही है…",
    "pa-IN": "ਤੁਹਾਡੀ ਗੱਲ ਸੁਣੀ ਜਾ ਰਹੀ ਹੈ…",
    "ta-IN": "உங்கள் பேச்சைக் கேட்கிறது…",
  },
  "Finishing your transcript…": {
    "en-IN": "Finishing your transcript…",
    "hi-IN": "आपकी बात का लेखन पूरा हो रहा है…",
    "pa-IN": "ਤੁਹਾਡੀ ਗੱਲ ਦਾ ਲਿਖਤ ਰੂਪ ਪੂਰਾ ਹੋ ਰਿਹਾ ਹੈ…",
    "ta-IN": "உங்கள் பேச்சு உரை முடிக்கப்படுகிறது…",
  },
  "Recording paused": {
    "en-IN": "Recording paused",
    "hi-IN": "रिकॉर्डिंग रुकी हुई है",
    "pa-IN": "ਰਿਕਾਰਡਿੰਗ ਰੋਕੀ ਗਈ",
    "ta-IN": "பதிவு இடைநிறுத்தப்பட்டது",
  },
  "Playing your transcript…": {
    "en-IN": "Playing your transcript…",
    "hi-IN": "आपकी लिखी हुई बात चल रही है…",
    "pa-IN": "ਤੁਹਾਡੀ ਲਿਖਤੀ ਗੱਲ ਚਲਾਈ ਜਾ ਰਹੀ ਹੈ…",
    "ta-IN": "உங்கள் உரை ஒலிக்கப்படுகிறது…",
  },
  "Transcript ready for your review": {
    "en-IN": "Transcript ready for your review",
    "hi-IN": "लिखित रूप समीक्षा के लिए तैयार है",
    "pa-IN": "ਲਿਖਤ ਸਮੀਖਿਆ ਲਈ ਤਿਆਰ ਹੈ",
    "ta-IN": "உரை மதிப்பாய்வுக்கு தயாராக உள்ளது",
  },
  "You can always type instead": {
    "en-IN": "You can always type instead",
    "hi-IN": "आप इसकी जगह लिख सकते हैं",
    "pa-IN": "ਤੁਸੀਂ ਇਸ ਦੀ ਥਾਂ ਲਿਖ ਸਕਦੇ ਹੋ",
    "ta-IN": "இதற்குப் பதிலாக எப்போதும் தட்டச்சு செய்யலாம்",
  },
  "Tap to speak. Review and edit your words before continuing.": {
    "en-IN": "Tap to speak. Review and edit your words before continuing.",
    "hi-IN": "बोलने के लिए टैप करें। आगे बढ़ने से पहले अपने शब्द जाँचें और संपादित करें।",
    "pa-IN": "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ। ਅੱਗੇ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੇ ਸ਼ਬਦਾਂ ਦੀ ਸਮੀਖਿਆ ਅਤੇ ਸੋਧ ਕਰੋ।",
    "ta-IN": "பேசத் தட்டவும். தொடர்வதற்கு முன் உங்கள் வார்த்தைகளைப் பார்த்துத் திருத்தவும்.",
  },
  "Stop playback": {
    "en-IN": "Stop playback",
    "hi-IN": "चलाना रोकें",
    "pa-IN": "ਚਲਾਉਣਾ ਰੋਕੋ",
    "ta-IN": "ஒலிப்பதை நிறுத்தவும்",
  },
  "Stop voice input": {
    "en-IN": "Stop voice input",
    "hi-IN": "आवाज़ से इनपुट रोकें",
    "pa-IN": "ਆਵਾਜ਼ ਰਾਹੀਂ ਇਨਪੁੱਟ ਰੋਕੋ",
    "ta-IN": "குரல் உள்ளீட்டை நிறுத்தவும்",
  },
  "Start voice input": {
    "en-IN": "Start voice input",
    "hi-IN": "आवाज़ से इनपुट शुरू करें",
    "pa-IN": "ਆਵਾਜ਼ ਰਾਹੀਂ ਇਨਪੁੱਟ ਸ਼ੁਰੂ ਕਰੋ",
    "ta-IN": "குரல் உள்ளீட்டைத் தொடங்கவும்",
  },
  "Type instead": {
    "en-IN": "Type instead",
    "hi-IN": "इसके बजाय लिखें",
    "pa-IN": "ਇਸ ਦੀ ਥਾਂ ਲਿਖੋ",
    "ta-IN": "இதற்குப் பதிலாக தட்டச்சு செய்யவும்",
  },
  Pause: {
    "en-IN": "Pause",
    "hi-IN": "रोकें",
    "pa-IN": "ਰੋਕੋ",
    "ta-IN": "இடைநிறுத்து",
  },
  Resume: {
    "en-IN": "Resume",
    "hi-IN": "फिर शुरू करें",
    "pa-IN": "ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ",
    "ta-IN": "மீண்டும் தொடங்கு",
  },
  Replay: {
    "en-IN": "Replay",
    "hi-IN": "फिर सुनें",
    "pa-IN": "ਦੁਬਾਰਾ ਸੁਣੋ",
    "ta-IN": "மீண்டும் இயக்கு",
  },
  "Record again": {
    "en-IN": "Record again",
    "hi-IN": "फिर से रिकॉर्ड करें",
    "pa-IN": "ਦੁਬਾਰਾ ਰਿਕਾਰਡ ਕਰੋ",
    "ta-IN": "மீண்டும் பதிவு செய்யவும்",
  },
  "Browser dictation processes audio with real-time Indic transcription. Zero PHI is transmitted unredacted.":
    {
      "en-IN":
        "Browser dictation processes audio with real-time Indic transcription. Zero PHI is transmitted unredacted.",
      "hi-IN":
        "ब्राउज़र डिक्टेशन ऑडियो को रीयल-टाइम भारतीय भाषा प्रतिलेखन के साथ संसाधित करता है। कोई भी PHI बिना छिपाए नहीं भेजा जाता।",
      "pa-IN":
        "ਬ੍ਰਾਊਜ਼ਰ ਡਿਕਟੇਸ਼ਨ ਆਡੀਓ ਨੂੰ ਰੀਅਲ-ਟਾਈਮ ਭਾਰਤੀ ਭਾਸ਼ਾ ਲਿਪਿਆਂਤਰਨ ਨਾਲ ਸੰਸਾਧਿਤ ਕਰਦਾ ਹੈ। ਕੋਈ PHI ਬਿਨਾਂ ਓਹਲੇ ਕੀਤੇ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ।",
      "ta-IN":
        "உலாவி குரல் உள்ளீடு ஒலியை நிகழ்நேர இந்திய மொழி உரையாக்கத்துடன் செயலாக்குகிறது. மறைக்கப்படாத PHI எதுவும் அனுப்பப்படாது.",
    },
  "Voice input is unavailable in this browser. Please type your concern below.":
    {
      "en-IN":
        "Voice input is unavailable in this browser. Please type your concern below.",
      "hi-IN": "इस ब्राउज़र में आवाज़ से इनपुट उपलब्ध नहीं है। कृपया नीचे अपनी समस्या लिखें।",
      "pa-IN":
        "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਆਵਾਜ਼ ਰਾਹੀਂ ਇਨਪੁੱਟ ਉਪਲਬਧ ਨਹੀਂ। ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ।",
      "ta-IN":
        "இந்த உலாவியில் குரல் உள்ளீடு கிடைக்கவில்லை. கீழே உங்கள் பிரச்சினையைத் தட்டச்சு செய்யவும்.",
    },
  "Microphone access was denied. Allow it in browser settings, or type below.":
    {
      "en-IN":
        "Microphone access was denied. Allow it in browser settings, or type below.",
      "hi-IN": "माइक्रोफ़ोन की अनुमति नहीं मिली। ब्राउज़र सेटिंग में अनुमति दें या नीचे लिखें।",
      "pa-IN":
        "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਮਿਲੀ। ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਇਜਾਜ਼ਤ ਦਿਓ ਜਾਂ ਹੇਠਾਂ ਲਿਖੋ।",
      "ta-IN":
        "ஒலிவாங்கி அணுகல் மறுக்கப்பட்டது. உலாவி அமைப்புகளில் அனுமதிக்கவும் அல்லது கீழே தட்டச்சு செய்யவும்.",
    },
  "Voice input stopped. Retry or type your concern below.": {
    "en-IN": "Voice input stopped. Retry or type your concern below.",
    "hi-IN": "आवाज़ से इनपुट रुक गया। फिर कोशिश करें या नीचे अपनी समस्या लिखें।",
    "pa-IN": "ਆਵਾਜ਼ ਰਾਹੀਂ ਇਨਪੁੱਟ ਰੁਕ ਗਿਆ। ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਹੇਠਾਂ ਆਪਣੀ ਸਮੱਸਿਆ ਲਿਖੋ।",
    "ta-IN":
      "குரல் உள்ளீடு நிறுத்தப்பட்டது. மீண்டும் முயற்சிக்கவும் அல்லது கீழே தட்டச்சு செய்யவும்.",
  },
  "Microphone unavailable. Check your browser permissions, or type below.": {
    "en-IN":
      "Microphone unavailable. Check your browser permissions, or type below.",
    "hi-IN": "माइक्रोफ़ोन उपलब्ध नहीं है। ब्राउज़र की अनुमति जाँचें या नीचे लिखें।",
    "pa-IN": "ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਉਪਲਬਧ ਨਹੀਂ। ਬ੍ਰਾਊਜ਼ਰ ਦੀਆਂ ਇਜਾਜ਼ਤਾਂ ਜਾਂਚੋ ਜਾਂ ਹੇਠਾਂ ਲਿਖੋ।",
    "ta-IN":
      "ஒலிவாங்கி கிடைக்கவில்லை. உலாவி அனுமதிகளைச் சரிபார்க்கவும் அல்லது கீழே தட்டச்சு செய்யவும்.",
  },
  "Playback unavailable. Your transcript is still available to read and edit.":
    {
      "en-IN":
        "Playback unavailable. Your transcript is still available to read and edit.",
      "hi-IN":
        "ऑडियो चलाना उपलब्ध नहीं है। आपका लिखा हुआ पाठ अब भी पढ़ने और संपादित करने के लिए उपलब्ध है।",
      "pa-IN":
        "ਆਡੀਓ ਚਲਾਉਣਾ ਉਪਲਬਧ ਨਹੀਂ। ਤੁਹਾਡਾ ਲਿਖਤ ਹਾਲੇ ਵੀ ਪੜ੍ਹਨ ਅਤੇ ਸੋਧਣ ਲਈ ਉਪਲਬਧ ਹੈ।",
      "ta-IN":
        "ஒலிப்பதிவு இயக்கம் கிடைக்கவில்லை. உங்கள் உரையை இன்னும் படித்துத் திருத்தலாம்.",
    },
};
