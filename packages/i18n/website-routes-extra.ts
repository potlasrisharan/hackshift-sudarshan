import type { WebsiteLocale } from "./website";

/**
 * Reviewed fixed UI copy for secondary clinic/operations routes.
 * Excludes patient records, clinical findings and algorithm-generated results,
 * identifiers and values supplied by an API or user.
 */
export const websiteRoutesExtraCopy: Record<
  string,
  Record<WebsiteLocale, string>
> = {
  // Doctor consultation controls and section labels. Clinical notes, diagnoses,
  // vitals, medicine names and generated recommendations remain as recorded.
  "Reset to Initial Live Queue": {
    "en-IN": "Reset to Initial Live Queue",
    "hi-IN": "प्रारंभिक लाइव कतार पर रीसेट करें",
    "pa-IN": "ਸ਼ੁਰੂਆਤੀ ਲਾਈਵ ਕਤਾਰ ਮੁੜ ਸੈੱਟ ਕਰੋ",
    "ta-IN": "தொடக்க நேரடி வரிசைக்கு மீட்டமை",
  },
  "Search patient, token, ABHA, symptom...": {
    "en-IN": "Search patient, token, ABHA, symptom...",
    "hi-IN": "मरीज़, टोकन, ABHA या लक्षण खोजें...",
    "pa-IN": "ਮਰੀਜ਼, ਟੋਕਨ, ABHA ਜਾਂ ਲੱਛਣ ਖੋਜੋ...",
    "ta-IN": "நோயாளி, டோக்கன், ABHA அல்லது அறிகுறியைத் தேடுங்கள்...",
  },
  "Status:": {
    "en-IN": "Status:",
    "hi-IN": "स्थिति:",
    "pa-IN": "ਸਥਿਤੀ:",
    "ta-IN": "நிலை:",
  },
  "🚨 STAT Alert": {
    "en-IN": "🚨 STAT Alert",
    "hi-IN": "🚨 तत्काल अलर्ट",
    "pa-IN": "🚨 ਤੁਰੰਤ ਚੇਤਾਵਨੀ",
    "ta-IN": "🚨 அவசர எச்சரிக்கை",
  },
  "Waiting Room": {
    "en-IN": "Waiting Room",
    "hi-IN": "प्रतीक्षालय",
    "pa-IN": "ਉਡੀਕ ਕਮਰਾ",
    "ta-IN": "காத்திருப்பு அறை",
  },
  "In Consultation": {
    "en-IN": "In Consultation",
    "hi-IN": "परामर्श जारी है",
    "pa-IN": "ਸਲਾਹ-ਮਸ਼ਵਰਾ ਜਾਰੀ ਹੈ",
    "ta-IN": "ஆலோசனையில்",
  },
  "Dispensed / Completed": {
    "en-IN": "Dispensed / Completed",
    "hi-IN": "दवा दी गई / पूरा हुआ",
    "pa-IN": "ਦਵਾਈ ਦਿੱਤੀ / ਪੂਰਾ ਹੋਇਆ",
    "ta-IN": "மருந்து வழங்கப்பட்டது / முடிந்தது",
  },
  "Admit to IPD Emergency": {
    "en-IN": "Admit to IPD Emergency",
    "hi-IN": "IPD आपातकालीन वार्ड में भर्ती करें",
    "pa-IN": "IPD ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਦਾਖ਼ਲ ਕਰੋ",
    "ta-IN": "உள்நோயாளர் அவசரப் பிரிவில் சேர்க்கவும்",
  },
  "Blood Pressure": {
    "en-IN": "Blood Pressure",
    "hi-IN": "रक्तचाप",
    "pa-IN": "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ",
    "ta-IN": "இரத்த அழுத்தம்",
  },
  "Pulse Rate": {
    "en-IN": "Pulse Rate",
    "hi-IN": "नाड़ी दर",
    "pa-IN": "ਨਬਜ਼ ਦੀ ਦਰ",
    "ta-IN": "நாடித்துடிப்பு விகிதம்",
  },
  "Oxygen SpO2": {
    "en-IN": "Oxygen SpO2",
    "hi-IN": "ऑक्सीजन SpO2",
    "pa-IN": "ਆਕਸੀਜਨ SpO2",
    "ta-IN": "ஆக்சிஜன் SpO2",
  },
  "Body Temp": {
    "en-IN": "Body Temp",
    "hi-IN": "शरीर का तापमान",
    "pa-IN": "ਸਰੀਰ ਦਾ ਤਾਪਮਾਨ",
    "ta-IN": "உடல் வெப்பநிலை",
  },
  "S: Subjective (Voice Intake)": {
    "en-IN": "S: Subjective (Voice Intake)",
    "hi-IN": "S: व्यक्तिपरक (आवाज़ से प्राप्त जानकारी)",
    "pa-IN": "S: ਮਰੀਜ਼ ਵੱਲੋਂ ਦੱਸਿਆ (ਆਵਾਜ਼ ਰਾਹੀਂ ਜਾਣਕਾਰੀ)",
    "ta-IN": "S: நோயாளி கூறியது (குரல் வழி பதிவு)",
  },
  "Voice Provenance Citations (Click to inspect):": {
    "en-IN": "Voice Provenance Citations (Click to inspect):",
    "hi-IN": "आवाज़ के स्रोत के संदर्भ (जाँचने के लिए क्लिक करें):",
    "pa-IN": "ਆਵਾਜ਼ ਦੇ ਸਰੋਤ ਦੇ ਹਵਾਲੇ (ਜਾਂਚਣ ਲਈ ਕਲਿੱਕ ਕਰੋ):",
    "ta-IN": "குரல் ஆதார மேற்கோள்கள் (பார்க்க கிளிக் செய்யவும்):",
  },
  "O: Objective (Biomarkers & Exam)": {
    "en-IN": "O: Objective (Biomarkers & Exam)",
    "hi-IN": "O: वस्तुनिष्ठ (बायोमार्कर और जाँच)",
    "pa-IN": "O: ਵਸਤੂਨਿਸ਼ਠ (ਬਾਇਓਮਾਰਕਰ ਅਤੇ ਜਾਂਚ)",
    "ta-IN": "O: புறநிலை (உயிர்க்குறியீடுகள் மற்றும் பரிசோதனை)",
  },
  "A: Assessment & Standard Diagnostic Coding": {
    "en-IN": "A: Assessment & Standard Diagnostic Coding",
    "hi-IN": "A: मूल्यांकन और मानक निदान कोडिंग",
    "pa-IN": "A: ਮੁਲਾਂਕਣ ਅਤੇ ਮਿਆਰੀ ਨਿਦਾਨ ਕੋਡਿੰਗ",
    "ta-IN": "A: மதிப்பீடு மற்றும் தரநிலை நோயறிதல் குறியீடு",
  },
  "P: Smart Rx-to-Shelf Prescription Builder": {
    "en-IN": "P: Smart Rx-to-Shelf Prescription Builder",
    "hi-IN": "P: स्मार्ट Rx-to-Shelf प्रिस्क्रिप्शन निर्माता",
    "pa-IN": "P: ਸਮਾਰਟ Rx-to-Shelf ਨੁਸਖ਼ਾ ਬਣਾਉਣ ਵਾਲਾ",
    "ta-IN": "P: ஸ்மார்ட் Rx-to-Shelf மருந்துச் சீட்டு உருவாக்கி",
  },
  "Add Medication": {
    "en-IN": "Add Medication",
    "hi-IN": "दवा जोड़ें",
    "pa-IN": "ਦਵਾਈ ਸ਼ਾਮਲ ਕਰੋ",
    "ta-IN": "மருந்தைச் சேர்க்கவும்",
  },
  "Run FEFO Batch Allocation Algorithm": {
    "en-IN": "Run FEFO Batch Allocation Algorithm",
    "hi-IN": "FEFO बैच आवंटन एल्गोरिदम चलाएँ",
    "pa-IN": "FEFO ਬੈਚ ਵੰਡ ਐਲਗੋਰਿਦਮ ਚਲਾਓ",
    "ta-IN": "FEFO தொகுதி ஒதுக்கீட்டு அல்காரிதத்தை இயக்கவும்",
  },
  "Recommended Western Medicines (Evidence-Based CDS)": {
    "en-IN": "Recommended Western Medicines (Evidence-Based CDS)",
    "hi-IN": "अनुशंसित आधुनिक दवाएँ (साक्ष्य-आधारित CDS)",
    "pa-IN": "ਸੁਝਾਈਆਂ ਆਧੁਨਿਕ ਦਵਾਈਆਂ (ਸਬੂਤ-ਅਧਾਰਿਤ CDS)",
    "ta-IN": "பரிந்துரைக்கப்படும் நவீன மருந்துகள் (ஆதார அடிப்படையிலான CDS)",
  },
  Added: {
    "en-IN": "Added",
    "hi-IN": "जोड़ा गया",
    "pa-IN": "ਸ਼ਾਮਲ ਕੀਤਾ",
    "ta-IN": "சேர்க்கப்பட்டது",
  },
  "Add to Rx": {
    "en-IN": "Add to Rx",
    "hi-IN": "नुस्ख़े में जोड़ें",
    "pa-IN": "ਨੁਸਖ਼ੇ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ",
    "ta-IN": "மருந்துச் சீட்டில் சேர்க்கவும்",
  },
  "Remove Medication": {
    "en-IN": "Remove Medication",
    "hi-IN": "दवा हटाएँ",
    "pa-IN": "ਦਵਾਈ ਹਟਾਓ",
    "ta-IN": "மருந்தை நீக்கவும்",
  },
  "Branded Formulation": {
    "en-IN": "Branded Formulation",
    "hi-IN": "ब्रांडेड दवा",
    "pa-IN": "ਬ੍ਰਾਂਡ ਵਾਲੀ ਦਵਾਈ",
    "ta-IN": "முத்திரை மருந்து",
  },
  "Jan Aushadhi Generic": {
    "en-IN": "Jan Aushadhi Generic",
    "hi-IN": "जन औषधि जेनेरिक दवा",
    "pa-IN": "ਜਨ ਔਸ਼ਧੀ ਜੈਨਰਿਕ ਦਵਾਈ",
    "ta-IN": "ஜன் ஔஷதி பொதுப்பெயர் மருந்து",
  },
  "Patient Out-of-Pocket Savings": {
    "en-IN": "Patient Out-of-Pocket Savings",
    "hi-IN": "मरीज़ की जेब से होने वाली बचत",
    "pa-IN": "ਮਰੀਜ਼ ਦੀ ਜੇਬ ਵਿੱਚੋਂ ਹੋਣ ਵਾਲੀ ਬਚਤ",
    "ta-IN": "நோயாளியின் சொந்தச் செலவு சேமிப்பு",
  },
  "Prescription routed to Pharmacy POS with automated FEFO batch reservation!":
    {
      "en-IN":
        "Prescription routed to Pharmacy POS with automated FEFO batch reservation!",
      "hi-IN": "नुस्ख़ा फ़ार्मेसी POS को भेजा गया और FEFO बैच आरक्षण अपने-आप किया गया!",
      "pa-IN": "ਨੁਸਖ਼ਾ ਫਾਰਮੇਸੀ POS ਨੂੰ ਭੇਜਿਆ ਗਿਆ ਅਤੇ FEFO ਬੈਚ ਆਪਣੇ-ਆਪ ਰਾਖਵਾਂ ਕੀਤਾ ਗਿਆ!",
      "ta-IN":
        "மருந்துச் சீட்டு மருந்தக POS-க்கு அனுப்பப்பட்டு FEFO தொகுதி தானாக ஒதுக்கப்பட்டது!",
    },
  "NRCeS FHIR R4 Bundle": {
    "en-IN": "NRCeS FHIR R4 Bundle",
    "hi-IN": "NRCeS FHIR R4 बंडल",
    "pa-IN": "NRCeS FHIR R4 தொகுப்பு",
    "ta-IN": "NRCeS FHIR R4 தொகுப்பு",
  },
  "Download Official Rx (PDF)": {
    "en-IN": "Download Official Rx (PDF)",
    "hi-IN": "आधिकारिक Rx डाउनलोड करें (PDF)",
    "pa-IN": "ਅਧਿਕਾਰਤ Rx ਡਾਊਨਲੋਡ ਕਰੋ (PDF)",
    "ta-IN": "அதிகாரப்பூர்வ Rx-ஐப் பதிவிறக்கவும் (PDF)",
  },
  "Generate QR code and deep link for AyuSetu Patient Companion App": {
    "en-IN": "Generate QR code and deep link for AyuSetu Patient Companion App",
    "hi-IN": "AyuSetu मरीज़ साथी ऐप के लिए QR कोड और डीप लिंक बनाएँ",
    "pa-IN": "AyuSetu ਮਰੀਜ਼ ਸਾਥੀ ਐਪ ਲਈ QR ਕੋਡ ਅਤੇ ਡੀਪ ਲਿੰਕ ਬਣਾਓ",
    "ta-IN": "AyuSetu நோயாளி துணை செயலிக்கான QR குறியீடு மற்றும் ஆழ் இணைப்பை உருவாக்கவும்",
  },
  "Sync to Patient App (QR)": {
    "en-IN": "Sync to Patient App (QR)",
    "hi-IN": "मरीज़ ऐप से सिंक करें (QR)",
    "pa-IN": "ਮਰੀਜ਼ ਐਪ ਨਾਲ ਸਿੰਕ ਕਰੋ (QR)",
    "ta-IN": "நோயாளி செயலியுடன் ஒத்திசைக்கவும் (QR)",
  },
  "Admit to IPD Bed": {
    "en-IN": "Admit to IPD Bed",
    "hi-IN": "IPD बेड में भर्ती करें",
    "pa-IN": "IPD ਬੈੱਡ ਵਿੱਚ ਦਾਖ਼ਲ ਕਰੋ",
    "ta-IN": "உள்நோயாளர் படுக்கையில் சேர்க்கவும்",
  },
  "1-Click Send to POS Billing": {
    "en-IN": "1-Click Send to POS Billing",
    "hi-IN": "एक क्लिक में POS बिलिंग को भेजें",
    "pa-IN": "ਇੱਕ ਕਲਿੱਕ ਵਿੱਚ POS ਬਿਲਿੰਗ ਨੂੰ ਭੇਜੋ",
    "ta-IN": "ஒரே கிளிக்கில் POS பில்லிங்கிற்கு அனுப்பவும்",
  },
  "Add Medication to Prescription": {
    "en-IN": "Add Medication to Prescription",
    "hi-IN": "नुस्ख़े में दवा जोड़ें",
    "pa-IN": "ਨੁਸਖ਼ੇ ਵਿੱਚ ਦਵਾਈ ਸ਼ਾਮਲ ਕਰੋ",
    "ta-IN": "மருந்துச் சீட்டில் மருந்தைச் சேர்க்கவும்",
  },
  "Medication / Salt Formulation *": {
    "en-IN": "Medication / Salt Formulation *",
    "hi-IN": "दवा / सॉल्ट फ़ॉर्मूलेशन *",
    "pa-IN": "ਦਵਾਈ / ਸਾਲਟ ਫਾਰਮੂਲੇਸ਼ਨ *",
    "ta-IN": "மருந்து / உப்பு கலவை *",
  },
  "e.g. Telmisartan 40mg or Pantoprazole 40mg": {
    "en-IN": "e.g. Telmisartan 40mg or Pantoprazole 40mg",
    "hi-IN": "जैसे Telmisartan 40mg या Pantoprazole 40mg",
    "pa-IN": "ਜਿਵੇਂ Telmisartan 40mg ਜਾਂ Pantoprazole 40mg",
    "ta-IN": "எ.கா. Telmisartan 40mg அல்லது Pantoprazole 40mg",
  },
  Dosage: {
    "en-IN": "Dosage",
    "hi-IN": "खुराक",
    "pa-IN": "ਖੁਰਾਕ",
    "ta-IN": "மருந்தளவு",
  },
  "e.g. 40mg": {
    "en-IN": "e.g. 40mg",
    "hi-IN": "जैसे 40mg",
    "pa-IN": "ਜਿਵੇਂ 40mg",
    "ta-IN": "எ.கா. 40mg",
  },
  Frequency: {
    "en-IN": "Frequency",
    "hi-IN": "आवृत्ति",
    "pa-IN": "ਵਾਰਵਾਰਤਾ",
    "ta-IN": "அடிக்கடி எடுத்தல்",
  },
  "1-0-0 (Morning)": {
    "en-IN": "1-0-0 (Morning)",
    "hi-IN": "1-0-0 (सुबह)",
    "pa-IN": "1-0-0 (ਸਵੇਰੇ)",
    "ta-IN": "1-0-0 (காலை)",
  },
  "0-1-0 (Afternoon)": {
    "en-IN": "0-1-0 (Afternoon)",
    "hi-IN": "0-1-0 (दोपहर)",
    "pa-IN": "0-1-0 (ਦੁਪਹਿਰ)",
    "ta-IN": "0-1-0 (மதியம்)",
  },
  "0-0-1 (Night)": {
    "en-IN": "0-0-1 (Night)",
    "hi-IN": "0-0-1 (रात)",
    "pa-IN": "0-0-1 (ਰਾਤ)",
    "ta-IN": "0-0-1 (இரவு)",
  },
  "1-0-1 (Twice Daily)": {
    "en-IN": "1-0-1 (Twice Daily)",
    "hi-IN": "1-0-1 (दिन में दो बार)",
    "pa-IN": "1-0-1 (ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ)",
    "ta-IN": "1-0-1 (தினமும் இருமுறை)",
  },
  "1-1-1 (Thrice Daily)": {
    "en-IN": "1-1-1 (Thrice Daily)",
    "hi-IN": "1-1-1 (दिन में तीन बार)",
    "pa-IN": "1-1-1 (ਦਿਨ ਵਿੱਚ ਤਿੰਨ ਵਾਰ)",
    "ta-IN": "1-1-1 (தினமும் மூன்று முறை)",
  },
  "STAT (Immediately)": {
    "en-IN": "STAT (Immediately)",
    "hi-IN": "STAT (तुरंत)",
    "pa-IN": "STAT (ਤੁਰੰਤ)",
    "ta-IN": "STAT (உடனடியாக)",
  },
  "SOS (As Needed)": {
    "en-IN": "SOS (As Needed)",
    "hi-IN": "SOS (ज़रूरत पड़ने पर)",
    "pa-IN": "SOS (ਲੋੜ ਅਨੁਸਾਰ)",
    "ta-IN": "SOS (தேவைப்படும்போது)",
  },
  Duration: {
    "en-IN": "Duration",
    "hi-IN": "अवधि",
    "pa-IN": "ਮਿਆਦ",
    "ta-IN": "கால அளவு",
  },
  "e.g. 10 Days": {
    "en-IN": "e.g. 10 Days",
    "hi-IN": "जैसे 10 दिन",
    "pa-IN": "ਜਿਵੇਂ 10 ਦਿਨ",
    "ta-IN": "எ.கா. 10 நாட்கள்",
  },
  Instructions: {
    "en-IN": "Instructions",
    "hi-IN": "निर्देश",
    "pa-IN": "ਹਦਾਇਤਾਂ",
    "ta-IN": "வழிமுறைகள்",
  },
  "e.g. Before breakfast": {
    "en-IN": "e.g. Before breakfast",
    "hi-IN": "जैसे नाश्ते से पहले",
    "pa-IN": "ਜਿਵੇਂ ਨਾਸ਼ਤੇ ਤੋਂ ਪਹਿਲਾਂ",
    "ta-IN": "எ.கா. காலை உணவுக்கு முன்",
  },
  "Branded Est. Price (₹)": {
    "en-IN": "Branded Est. Price (₹)",
    "hi-IN": "ब्रांडेड दवा की अनुमानित कीमत (₹)",
    "pa-IN": "ਬ੍ਰਾਂਡ ਵਾਲੀ ਦਵਾਈ ਦੀ ਅੰਦਾਜ਼ਨ ਕੀਮਤ (₹)",
    "ta-IN": "முத்திரை மருந்தின் மதிப்பிடப்பட்ட விலை (₹)",
  },
  "Jan Aushadhi Price (₹)": {
    "en-IN": "Jan Aushadhi Price (₹)",
    "hi-IN": "जन औषधि की कीमत (₹)",
    "pa-IN": "ਜਨ ਔਸ਼ਧੀ ਦੀ ਕੀਮਤ (₹)",
    "ta-IN": "ஜன் ஔஷதி விலை (₹)",
  },
  "NRCeS HL7 FHIR R4 Clinical Bundle": {
    "en-IN": "NRCeS HL7 FHIR R4 Clinical Bundle",
    "hi-IN": "NRCeS HL7 FHIR R4 क्लिनिकल बंडल",
    "pa-IN": "NRCeS HL7 FHIR R4 ਕਲੀਨਿਕਲ ਬੰਡਲ",
    "ta-IN": "NRCeS HL7 FHIR R4 மருத்துவத் தொகுப்பு",
  },
  "Patient Companion Mobile Sync": {
    "en-IN": "Patient Companion Mobile Sync",
    "hi-IN": "मरीज़ साथी मोबाइल सिंक",
    "pa-IN": "ਮਰੀਜ਼ ਸਾਥੀ ਮੋਬਾਈਲ ਸਿੰਕ",
    "ta-IN": "நோயாளி துணை மொபைல் ஒத்திசைவு",
  },
  "Auto-configure medicine doses, reminders & schedule": {
    "en-IN": "Auto-configure medicine doses, reminders & schedule",
    "hi-IN": "दवा की खुराक, रिमाइंडर और समय-सारणी अपने-आप सेट करें",
    "pa-IN": "ਦਵਾਈ ਦੀਆਂ ਖੁਰਾਕਾਂ, ਯਾਦ-ਦਿਹਾਨੀਆਂ ਅਤੇ ਸਮਾਂ-ਸਾਰਣੀ ਆਪਣੇ-ਆਪ ਸੈੱਟ ਕਰੋ",
    "ta-IN": "மருந்தளவு, நினைவூட்டல்கள் மற்றும் அட்டவணையைத் தானாக அமைக்கவும்",
  },
  Copied: {
    "en-IN": "Copied",
    "hi-IN": "कॉपी किया गया",
    "pa-IN": "ਕਾਪੀ ਕੀਤਾ",
    "ta-IN": "நகலெடுக்கப்பட்டது",
  },
  Copy: {
    "en-IN": "Copy",
    "hi-IN": "कॉपी करें",
    "pa-IN": "ਕਾਪੀ ਕਰੋ",
    "ta-IN": "நகலெடு",
  },

  // WhatsApp settings; no IDs, secret keys or API/server messages are included.
  "Use your own phone to send automated OPD token and billing alerts.": {
    "en-IN":
      "Use your own phone to send automated OPD token and billing alerts.",
    "hi-IN": "स्वचालित OPD टोकन और बिलिंग अलर्ट भेजने के लिए अपना फ़ोन इस्तेमाल करें।",
    "pa-IN": "ਆਟੋਮੈਟਿਕ OPD ਟੋਕਨ ਅਤੇ ਬਿਲਿੰਗ ਚੇਤਾਵਨੀਆਂ ਭੇਜਣ ਲਈ ਆਪਣਾ ਫ਼ੋਨ ਵਰਤੋ।",
    "ta-IN":
      "தானியங்கி OPD டோக்கன் மற்றும் பில்லிங் எச்சரிக்கைகளை அனுப்ப உங்கள் தொலைபேசியைப் பயன்படுத்தவும்.",
  },
  "Setup Your WhatsApp Gateway": {
    "en-IN": "Setup Your WhatsApp Gateway",
    "hi-IN": "अपना WhatsApp गेटवे सेटअप करें",
    "pa-IN": "ਆਪਣਾ WhatsApp ਗੇਟਵੇ ਸੈੱਟਅੱਪ ਕਰੋ",
    "ta-IN": "உங்கள் WhatsApp நுழைவாயிலை அமைக்கவும்",
  },
  "Ready to automate your patient communication? Click below to generate your private connection keys.":
    {
      "en-IN":
        "Ready to automate your patient communication? Click below to generate your private connection keys.",
      "hi-IN":
        "मरीज़ों से संवाद स्वचालित करने के लिए तैयार हैं? निजी कनेक्शन कुंजियाँ बनाने के लिए नीचे क्लिक करें।",
      "pa-IN":
        "ਕੀ ਤੁਸੀਂ ਮਰੀਜ਼ਾਂ ਨਾਲ ਸੰਚਾਰ ਆਟੋਮੈਟਿਕ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ? ਨਿੱਜੀ ਕਨੈਕਸ਼ਨ ਕੁੰਜੀਆਂ ਬਣਾਉਣ ਲਈ ਹੇਠਾਂ ਕਲਿੱਕ ਕਰੋ।",
      "ta-IN":
        "நோயாளி தொடர்புகளைத் தானியக்கமாக்கத் தயாரா? தனிப்பட்ட இணைப்பு விசைகளை உருவாக்க கீழே கிளிக் செய்யவும்.",
    },
  Enabled: {
    "en-IN": "Enabled",
    "hi-IN": "चालू",
    "pa-IN": "ਚਾਲੂ",
    "ta-IN": "இயக்கப்பட்டது",
  },
  "Automated Alerts": {
    "en-IN": "Automated Alerts",
    "hi-IN": "स्वचालित अलर्ट",
    "pa-IN": "ਆਟੋਮੈਟிக் ਚੇਤਾਵਨੀਆਂ",
    "ta-IN": "தானியங்கி எச்சரிக்கைகள்",
  },
  "Your Hospital ID": {
    "en-IN": "Your Hospital ID",
    "hi-IN": "आपकी अस्पताल ID",
    "pa-IN": "ਤੁਹਾਡੀ ਹਸਪਤਾਲ ID",
    "ta-IN": "உங்கள் மருத்துவமனை ID",
  },
  "Agent Secret Key": {
    "en-IN": "Agent Secret Key",
    "hi-IN": "एजेंट की गुप्त कुंजी",
    "pa-IN": "ਏਜੰਟ ਦੀ ਗੁਪਤ ਕੁੰਜੀ",
    "ta-IN": "ஏஜென்ட் ரகசிய விசை",
  },
  "Download Agent": {
    "en-IN": "Download Agent",
    "hi-IN": "एजेंट डाउनलोड करें",
    "pa-IN": "ਏਜੰਟ ਡਾਊਨਲੋਡ ਕਰੋ",
    "ta-IN": "ஏஜென்டைப் பதிவிறக்கவும்",
  },
  "Download the `whatsapp_agent.py` script to a Windows/Mac PC at your clinic.":
    {
      "en-IN":
        "Download the `whatsapp_agent.py` script to a Windows/Mac PC at your clinic.",
      "hi-IN":
        "अपने क्लिनिक के Windows/Mac PC पर `whatsapp_agent.py` स्क्रिप्ट डाउनलोड करें।",
      "pa-IN":
        "ਆਪਣੇ ਕਲੀਨਿਕ ਦੇ Windows/Mac PC ਉੱਤੇ `whatsapp_agent.py` ਸਕ੍ਰਿਪਟ ਡਾਊਨਲੋਡ ਕਰੋ।",
      "ta-IN":
        "உங்கள் கிளினிக்கின் Windows/Mac கணினியில் `whatsapp_agent.py` ஸ்கிரிப்டைப் பதிவிறக்கவும்.",
    },
  "Download Script": {
    "en-IN": "Download Script",
    "hi-IN": "स्क्रिप्ट डाउनलोड करें",
    "pa-IN": "ਸਕ੍ਰਿਪਟ ਡਾਊਨਲੋਡ ਕਰੋ",
    "ta-IN": "ஸ்கிரிப்டைப் பதிவிறக்கவும்",
  },
  "Paste Keys": {
    "en-IN": "Paste Keys",
    "hi-IN": "कुंजियाँ पेस्ट करें",
    "pa-IN": "ਕੁੰਜੀਆਂ ਪੇਸਟ ਕਰੋ",
    "ta-IN": "விசைகளை ஒட்டவும்",
  },
  "Open the script and paste your Hospital ID and Secret Key provided above.": {
    "en-IN":
      "Open the script and paste your Hospital ID and Secret Key provided above.",
    "hi-IN": "स्क्रिप्ट खोलें और ऊपर दी गई अस्पताल ID तथा गुप्त कुंजी पेस्ट करें।",
    "pa-IN": "ਸਕ੍ਰਿਪਟ ਖੋਲ੍ਹੋ ਅਤੇ ਉੱਪਰ ਦਿੱਤੀ ਹਸਪਤਾਲ ID ਅਤੇ ਗੁਪਤ ਕੁੰਜੀ ਪੇਸਟ ਕਰੋ।",
    "ta-IN":
      "ஸ்கிரிப்டைத் திறந்து மேலே கொடுக்கப்பட்ட மருத்துவமனை ID மற்றும் ரகசிய விசையை ஒட்டவும்.",
  },
  "Scan QR Code": {
    "en-IN": "Scan QR Code",
    "hi-IN": "QR कोड स्कैन करें",
    "pa-IN": "QR ਕੋਡ ਸਕੈਨ ਕਰੋ",
    "ta-IN": "QR குறியீட்டை ஸ்கேன் செய்யவும்",
  },
  "Run the script. A window will pop up. Scan it once with your phone. That's it!":
    {
      "en-IN":
        "Run the script. A window will pop up. Scan it once with your phone. That's it!",
      "hi-IN": "स्क्रिप्ट चलाएँ। एक विंडो खुलेगी। उसे अपने फ़ोन से एक बार स्कैन करें। बस!",
      "pa-IN": "ਸਕ੍ਰਿਪਟ ਚਲਾਓ। ਇੱਕ ਵਿੰਡੋ ਖੁੱਲ੍ਹੇਗੀ। ਇਸਨੂੰ ਆਪਣੇ ਫ਼ੋਨ ਨਾਲ ਇੱਕ ਵਾਰ ਸਕੈਨ ਕਰੋ। ਬੱਸ!",
      "ta-IN":
        "ஸ்கிரிப்டை இயக்கவும். ஒரு சாளரம் திறக்கும். அதை உங்கள் தொலைபேசியில் ஒருமுறை ஸ்கேன் செய்யவும். அவ்வளவுதான்!",
    },
  "Settings Updated": {
    "en-IN": "Settings Updated",
    "hi-IN": "सेटिंग अपडेट हुई",
    "pa-IN": "ਸੈਟਿੰਗਾਂ ਅੱਪਡੇਟ ਹੋਈਆਂ",
    "ta-IN": "அமைப்புகள் புதுப்பிக்கப்பட்டன",
  },
  "WhatsApp preferences saved.": {
    "en-IN": "WhatsApp preferences saved.",
    "hi-IN": "WhatsApp प्राथमिकताएँ सहेजी गईं।",
    "pa-IN": "WhatsApp ਤਰਜੀਹਾਂ ਸੰਭਾਲੀਆਂ ਗਈਆਂ।",
    "ta-IN": "WhatsApp விருப்பத்தேர்வுகள் சேமிக்கப்பட்டன.",
  },
  "New Key Generated": {
    "en-IN": "New Key Generated",
    "hi-IN": "नई कुंजी बनाई गई",
    "pa-IN": "ਨਵੀਂ ਕੁੰਜੀ ਬਣਾਈ ਗਈ",
    "ta-IN": "புதிய விசை உருவாக்கப்பட்டது",
  },
  "Please update your local agent.": {
    "en-IN": "Please update your local agent.",
    "hi-IN": "कृपया अपना लोकल एजेंट अपडेट करें।",
    "pa-IN": "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਲੋਕਲ ਏਜੰਟ ਅੱਪਡੇਟ ਕਰੋ।",
    "ta-IN": "உங்கள் உள்ளூர் ஏஜென்டைப் புதுப்பிக்கவும்.",
  },
  "Failed to update settings.": {
    "en-IN": "Failed to update settings.",
    "hi-IN": "सेटिंग अपडेट नहीं हो सकी।",
    "pa-IN": "ਸੈਟਿੰਗਾਂ ਅੱਪਡੇਟ ਨਹੀਂ ਹੋ ਸਕੀਆਂ।",
    "ta-IN": "அமைப்புகளைப் புதுப்பிக்க முடியவில்லை.",
  },
  "Failed to generate key.": {
    "en-IN": "Failed to generate key.",
    "hi-IN": "कुंजी नहीं बनाई जा सकी।",
    "pa-IN": "ਕੁੰਜੀ ਨਹੀਂ ਬਣਾਈ ਜਾ ਸਕੀ।",
    "ta-IN": "விசையை உருவாக்க முடியவில்லை.",
  },
  "Copied!": {
    "en-IN": "Copied!",
    "hi-IN": "कॉपी किया गया!",
    "pa-IN": "ਕਾਪੀ ਕੀਤਾ ਗਿਆ!",
    "ta-IN": "நகலெடுக்கப்பட்டது!",
  },

  // Tax invoice labels and fixed footer terms; business/patient/invoice values stay untouched.
  "Tax Invoice": {
    "en-IN": "Tax Invoice",
    "hi-IN": "कर चालान",
    "pa-IN": "ਟੈਕਸ ਚਲਾਨ",
    "ta-IN": "வரி விலைப்பட்டியல்",
  },
  "Invoice Number": {
    "en-IN": "Invoice Number",
    "hi-IN": "चालान संख्या",
    "pa-IN": "ਚਲਾਨ ਨੰਬਰ",
    "ta-IN": "விலைப்பட்டியல் எண்",
  },
  "Supplier (Bill From)": {
    "en-IN": "Supplier (Bill From)",
    "hi-IN": "आपूर्तिकर्ता (बिल भेजने वाला)",
    "pa-IN": "ਸਪਲਾਇਰ (ਬਿੱਲ ਭੇਜਣ ਵਾਲਾ)",
    "ta-IN": "வழங்குநர் (பில் அனுப்புபவர்)",
  },
  "Ship To (Place of Supply)": {
    "en-IN": "Ship To (Place of Supply)",
    "hi-IN": "यहाँ भेजें (आपूर्ति का स्थान)",
    "pa-IN": "ਇੱਥੇ ਭੇਜੋ (ਸਪਲਾਈ ਦਾ ਸਥਾਨ)",
    "ta-IN": "அனுப்ப வேண்டிய இடம் (வழங்கல் இடம்)",
  },
  "Description of Goods": {
    "en-IN": "Description of Goods",
    "hi-IN": "माल का विवरण",
    "pa-IN": "ਸਾਮਾਨ ਦਾ ਵੇਰਵਾ",
    "ta-IN": "பொருட்களின் விவரம்",
  },
  HSN: { "en-IN": "HSN", "hi-IN": "HSN", "pa-IN": "HSN", "ta-IN": "HSN" },
  Qty: { "en-IN": "Qty", "hi-IN": "मात्रा", "pa-IN": "ਮਾਤਰਾ", "ta-IN": "அளவு" },
  Rate: { "en-IN": "Rate", "hi-IN": "दर", "pa-IN": "ਦਰ", "ta-IN": "விகிதம்" },
  "Disc %": {
    "en-IN": "Disc %",
    "hi-IN": "छूट %",
    "pa-IN": "ਛੋਟ %",
    "ta-IN": "தள்ளுபடி %",
  },
  "Taxable Val": {
    "en-IN": "Taxable Val",
    "hi-IN": "कर योग्य मूल्य",
    "pa-IN": "ਟੈਕਸਯੋਗ ਮੁੱਲ",
    "ta-IN": "வரிக்குட்பட்ட மதிப்பு",
  },
  "GST %": {
    "en-IN": "GST %",
    "hi-IN": "GST %",
    "pa-IN": "GST %",
    "ta-IN": "GST %",
  },
  Amount: {
    "en-IN": "Amount",
    "hi-IN": "राशि",
    "pa-IN": "ਰਕਮ",
    "ta-IN": "தொகை",
  },
  "Amount in Words": {
    "en-IN": "Amount in Words",
    "hi-IN": "राशि शब्दों में",
    "pa-IN": "ਸ਼ਬਦਾਂ ਵਿੱਚ ਰਕਮ",
    "ta-IN": "தொகை எழுத்துகளில்",
  },
  "Bank Details": {
    "en-IN": "Bank Details",
    "hi-IN": "बैंक विवरण",
    "pa-IN": "ਬੈਂਕ ਵੇਰਵੇ",
    "ta-IN": "வங்கி விவரங்கள்",
  },
  "Bank Name:": {
    "en-IN": "Bank Name:",
    "hi-IN": "बैंक का नाम:",
    "pa-IN": "ਬੈਂਕ ਦਾ ਨਾਮ:",
    "ta-IN": "வங்கியின் பெயர்:",
  },
  "A/c No:": {
    "en-IN": "A/c No:",
    "hi-IN": "खाता संख्या:",
    "pa-IN": "ਖਾਤਾ ਨੰਬਰ:",
    "ta-IN": "கணக்கு எண்:",
  },
  "IFSC:": {
    "en-IN": "IFSC:",
    "hi-IN": "IFSC:",
    "pa-IN": "IFSC:",
    "ta-IN": "IFSC:",
  },
  "Branch:": {
    "en-IN": "Branch:",
    "hi-IN": "शाखा:",
    "pa-IN": "ਸ਼ਾਖਾ:",
    "ta-IN": "கிளை:",
  },
  "Taxable Amount:": {
    "en-IN": "Taxable Amount:",
    "hi-IN": "कर योग्य राशि:",
    "pa-IN": "ਟੈਕਸਯੋਗ ਰਕਮ:",
    "ta-IN": "வரிக்குட்பட்ட தொகை:",
  },
  "Discount:": {
    "en-IN": "Discount:",
    "hi-IN": "छूट:",
    "pa-IN": "ਛੋਟ:",
    "ta-IN": "தள்ளுபடி:",
  },
  "Grand Total (Incl. Taxes)": {
    "en-IN": "Grand Total (Incl. Taxes)",
    "hi-IN": "कुल योग (कर सहित)",
    "pa-IN": "ਕੁੱਲ ਜੋੜ (ਟੈਕਸ ਸਮੇਤ)",
    "ta-IN": "மொத்தம் (வரி உட்பட)",
  },
  "Advance Paid:": {
    "en-IN": "Advance Paid:",
    "hi-IN": "अग्रिम भुगतान:",
    "pa-IN": "ਪੇਸ਼ਗੀ ਭੁਗਤਾਨ:",
    "ta-IN": "முன்பணம் செலுத்தப்பட்டது:",
  },
  "Net Balance Due": {
    "en-IN": "Net Balance Due",
    "hi-IN": "शुद्ध बकाया राशि",
    "pa-IN": "ਬਾਕੀ ਸ਼ੁੱਧ ਰਕਮ",
    "ta-IN": "நிகர நிலுவைத் தொகை",
  },
  "Terms & Conditions:": {
    "en-IN": "Terms & Conditions:",
    "hi-IN": "नियम और शर्तें:",
    "pa-IN": "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ:",
    "ta-IN": "விதிமுறைகள் மற்றும் நிபந்தனைகள்:",
  },
  "Goods once sold will not be taken back.": {
    "en-IN": "Goods once sold will not be taken back.",
    "hi-IN": "एक बार बेचा गया माल वापस नहीं लिया जाएगा।",
    "pa-IN": "ਇੱਕ ਵਾਰ ਵੇਚਿਆ ਸਾਮਾਨ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾਵੇਗਾ।",
    "ta-IN": "விற்கப்பட்ட பொருட்கள் திரும்பப் பெறப்படமாட்டாது.",
  },
  "Interest @18% p.a. will be charged if payment is not made within the credit period.":
    {
      "en-IN":
        "Interest @18% p.a. will be charged if payment is not made within the credit period.",
      "hi-IN": "उधार अवधि में भुगतान न होने पर 18% वार्षिक ब्याज लिया जाएगा।",
      "pa-IN": "ਉਧਾਰ ਮਿਆਦ ਵਿੱਚ ਭੁਗਤਾਨ ਨਾ ਹੋਣ 'ਤੇ 18% ਸਾਲਾਨਾ ਵਿਆਜ ਲਿਆ ਜਾਵੇਗਾ।",
      "ta-IN":
        "கடன் காலத்திற்குள் பணம் செலுத்தப்படாவிட்டால் ஆண்டுக்கு 18% வட்டி வசூலிக்கப்படும்.",
    },
  "Subject to local jurisdiction.": {
    "en-IN": "Subject to local jurisdiction.",
    "hi-IN": "स्थानीय न्यायक्षेत्र के अधीन।",
    "pa-IN": "ਸਥਾਨਕ ਅਧਿਕਾਰ ਖੇਤਰ ਦੇ ਅਧੀਨ।",
    "ta-IN": "உள்ளூர் நீதித்துறை அதிகார வரம்பிற்கு உட்பட்டது.",
  },
  "Authorized Signatory": {
    "en-IN": "Authorized Signatory",
    "hi-IN": "अधिकृत हस्ताक्षरकर्ता",
    "pa-IN": "ਅਧਿਕਾਰਤ ਦਸਤਖ਼ਤਕਰਤਾ",
    "ta-IN": "அங்கீகரிக்கப்பட்ட கையொப்பமிடுபவர்",
  },
  "Generated via": {
    "en-IN": "Generated via",
    "hi-IN": "इसके माध्यम से बनाया गया",
    "pa-IN": "ਇਸ ਰਾਹੀਂ ਤਿਆਰ ਕੀਤਾ",
    "ta-IN": "இதன் மூலம் உருவாக்கப்பட்டது",
  },
  "AyuSetu Operations": {
    "en-IN": "AyuSetu Operations",
    "hi-IN": "आयुसेतु संचालन",
    "pa-IN": "ਆਯੁਸੇਤੂ ਓਪਰੇਸ਼ਨਜ਼",
    "ta-IN": "ஆயுசேது செயல்பாடுகள்",
  },
  "Computer Generated Document • Valid Without Physical Signature": {
    "en-IN": "Computer Generated Document • Valid Without Physical Signature",
    "hi-IN": "कंप्यूटर से बना दस्तावेज़ • भौतिक हस्ताक्षर के बिना मान्य",
    "pa-IN": "ਕੰਪਿਊਟਰ ਦੁਆਰਾ ਬਣਾਇਆ ਦਸਤਾਵੇਜ਼ • ਭੌਤਿਕ ਦਸਤਖ਼ਤ ਤੋਂ ਬਿਨਾਂ ਵੈਧ",
    "ta-IN": "கணினி உருவாக்கிய ஆவணம் • நேரடி கையொப்பமின்றியும் செல்லுபடியாகும்",
  },

  // Stock migration controls; runtime clinic names, selected counts and stock values are excluded.
  "Medicine Migration": {
    "en-IN": "Medicine Migration",
    "hi-IN": "दवा स्टॉक स्थानांतरण",
    "pa-IN": "ਦਵਾਈ ਸਟਾਕ ਤਬਦੀਲੀ",
    "ta-IN": "மருந்து இருப்பு மாற்றம்",
  },
  "Transfer stock between clinic facilities": {
    "en-IN": "Transfer stock between clinic facilities",
    "hi-IN": "क्लिनिक केंद्रों के बीच स्टॉक स्थानांतरित करें",
    "pa-IN": "ਕਲੀਨਿਕ ਕੇਂਦਰਾਂ ਵਿਚਕਾਰ ਸਟਾਕ ਭੇਜੋ",
    "ta-IN": "கிளினிக் மையங்களுக்கு இடையே இருப்பை மாற்றவும்",
  },
  "Migrating...": {
    "en-IN": "Migrating...",
    "hi-IN": "स्थानांतरित हो रहा है...",
    "pa-IN": "ਤਬਦੀਲ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    "ta-IN": "மாற்றப்படுகிறது...",
  },
  "Execute Migration": {
    "en-IN": "Execute Migration",
    "hi-IN": "स्थानांतरण करें",
    "pa-IN": "ਤਬਦੀਲੀ ਕਰੋ",
    "ta-IN": "மாற்றத்தைச் செயல்படுத்தவும்",
  },
  "facility Selection": {
    "en-IN": "facility Selection",
    "hi-IN": "केंद्र चुनें",
    "pa-IN": "ਕੇਂਦਰ ਚੋਣ",
    "ta-IN": "மையத் தேர்வு",
  },
  "Select source and target clinics": {
    "en-IN": "Select source and target clinics",
    "hi-IN": "स्रोत और लक्ष्य क्लिनिक चुनें",
    "pa-IN": "ਸਰੋਤ ਅਤੇ ਮੰਜ਼ਿਲ ਕਲੀਨਿਕ ਚੁਣੋ",
    "ta-IN": "மூல மற்றும் இலக்கு கிளினிக்குகளைத் தேர்ந்தெடுக்கவும்",
  },
  "Source Clinic": {
    "en-IN": "Source Clinic",
    "hi-IN": "स्रोत क्लिनिक",
    "pa-IN": "ਸਰੋਤ ਕਲੀਨਿਕ",
    "ta-IN": "மூல கிளினிக்",
  },
  "Select Source Facility": {
    "en-IN": "Select Source Facility",
    "hi-IN": "स्रोत केंद्र चुनें",
    "pa-IN": "ਸਰੋਤ ਕੇਂਦਰ ਚੁਣੋ",
    "ta-IN": "மூல மையத்தைத் தேர்ந்தெடுக்கவும்",
  },
  "Destination Clinic": {
    "en-IN": "Destination Clinic",
    "hi-IN": "गंतव्य क्लिनिक",
    "pa-IN": "ਮੰਜ਼ਿਲ ਕਲੀਨਿਕ",
    "ta-IN": "சேருமிட கிளினிக்",
  },
  "Select Destination Facility": {
    "en-IN": "Select Destination Facility",
    "hi-IN": "गंतव्य केंद्र चुनें",
    "pa-IN": "ਮੰਜ਼ਿਲ ਕੇਂਦਰ ਚੁਣੋ",
    "ta-IN": "சேருமிட மையத்தைத் தேர்ந்தெடுக்கவும்",
  },
  "Migration Summary": {
    "en-IN": "Migration Summary",
    "hi-IN": "स्थानांतरण सारांश",
    "pa-IN": "ਤਬਦੀਲੀ ਦਾ ਸਾਰ",
    "ta-IN": "மாற்றச் சுருக்கம்",
  },
  "Safe Transfer": {
    "en-IN": "Safe Transfer",
    "hi-IN": "सुरक्षित स्थानांतरण",
    "pa-IN": "ਸੁਰੱਖਿਅਤ ਤਬਦੀਲੀ",
    "ta-IN": "பாதுகாப்பான மாற்றம்",
  },
  "All migrations are audited and stock levels are updated instantly.": {
    "en-IN":
      "All migrations are audited and stock levels are updated instantly.",
    "hi-IN": "सभी स्थानांतरण दर्ज किए जाते हैं और स्टॉक स्तर तुरंत अपडेट होते हैं।",
    "pa-IN": "ਸਾਰੀਆਂ ਤਬਦੀਲੀਆਂ ਦਾ ਆਡਿਟ ਹੁੰਦਾ ਹੈ ਅਤੇ ਸਟਾਕ ਪੱਧਰ ਤੁਰੰਤ ਅੱਪਡੇਟ ਹੁੰਦੇ ਹਨ।",
    "ta-IN": "அனைத்து மாற்றங்களும் தணிக்கை செய்யப்பட்டு இருப்பு உடனடியாகப் புதுப்பிக்கப்படும்.",
  },
  "Select Medicines": {
    "en-IN": "Select Medicines",
    "hi-IN": "दवाएँ चुनें",
    "pa-IN": "ਦਵਾਈਆਂ ਚੁਣੋ",
    "ta-IN": "மருந்துகளைத் தேர்ந்தெடுக்கவும்",
  },
  "Search inventory...": {
    "en-IN": "Search inventory...",
    "hi-IN": "इन्वेंटरी खोजें...",
    "pa-IN": "ਵਸਤੂ-ਸੂਚੀ ਖੋਜੋ...",
    "ta-IN": "சரக்குப் பட்டியலைத் தேடுங்கள்...",
  },
  "Source Clinic Not Selected": {
    "en-IN": "Source Clinic Not Selected",
    "hi-IN": "स्रोत क्लिनिक नहीं चुना गया",
    "pa-IN": "ਸਰੋਤ ਕਲੀਨਿਕ ਨਹੀਂ ਚੁਣਿਆ",
    "ta-IN": "மூல கிளினிக் தேர்ந்தெடுக்கப்படவில்லை",
  },
  "Please select a source clinic facility to view its available inventory for migration.":
    {
      "en-IN":
        "Please select a source clinic facility to view its available inventory for migration.",
      "hi-IN": "स्थानांतरण के लिए उपलब्ध इन्वेंटरी देखने हेतु स्रोत क्लिनिक केंद्र चुनें।",
      "pa-IN": "ਤਬਦੀਲੀ ਲਈ ਉਪਲਬਧ ਵਸਤੂ-ਸੂਚੀ ਦੇਖਣ ਵਾਸਤੇ ਸਰੋਤ ਕਲੀਨਿਕ ਕੇਂਦਰ ਚੁਣੋ।",
      "ta-IN":
        "மாற்றத்திற்குக் கிடைக்கும் சரக்கைப் பார்க்க மூல கிளினிக் மையத்தைத் தேர்ந்தெடுக்கவும்.",
    },
  "No Matches Found": {
    "en-IN": "No Matches Found",
    "hi-IN": "कोई मेल नहीं मिला",
    "pa-IN": "ਕੋਈ ਮੇਲ ਨਹੀਂ ਮਿਲਿਆ",
    "ta-IN": "பொருத்தங்கள் எதுவும் இல்லை",
  },
  "Try adjusting your search terms or verify the clinic has stock items.": {
    "en-IN":
      "Try adjusting your search terms or verify the clinic has stock items.",
    "hi-IN": "खोज शब्द बदलें या जाँचें कि क्लिनिक में स्टॉक उपलब्ध है।",
    "pa-IN": "ਖੋਜ ਸ਼ਬਦ ਬਦਲ ਕੇ ਵੇਖੋ ਜਾਂ ਜਾਂਚੋ ਕਿ ਕਲੀਨਿਕ ਵਿੱਚ ਸਟਾਕ ਮੌਜੂਦ ਹੈ।",
    "ta-IN":
      "தேடல் சொற்களை மாற்றிப் பார்க்கவும் அல்லது கிளினிக்கில் இருப்பு உள்ளதா எனச் சரிபார்க்கவும்.",
  },
  "Batch:": {
    "en-IN": "Batch:",
    "hi-IN": "बैच:",
    "pa-IN": "ਬੈਚ:",
    "ta-IN": "தொகுதி:",
  },
  "Available:": {
    "en-IN": "Available:",
    "hi-IN": "उपलब्ध:",
    "pa-IN": "ਉਪਲਬਧ:",
    "ta-IN": "கிடைப்பவை:",
  },
  "MRP:": {
    "en-IN": "MRP:",
    "hi-IN": "अधिकतम खुदरा मूल्य:",
    "pa-IN": "ਵੱਧ ਤੋਂ ਵੱਧ ਖੁਦਰਾ ਕੀਮਤ:",
    "ta-IN": "அதிகபட்ச சில்லறை விலை:",
  },

  // Hospital registry/details controls; organization-specific names, IDs and metrics stay untouched.
  "Hospital Not Found": {
    "en-IN": "Hospital Not Found",
    "hi-IN": "अस्पताल नहीं मिला",
    "pa-IN": "ਹਸਪਤਾਲ ਨਹੀਂ ਮਿਲਿਆ",
    "ta-IN": "மருத்துவமனை கிடைக்கவில்லை",
  },
  "The requested hospital ID could not be loaded.": {
    "en-IN": "The requested hospital ID could not be loaded.",
    "hi-IN": "अनुरोधित अस्पताल ID लोड नहीं हो सकी।",
    "pa-IN": "ਮੰਗੀ ਗਈ ਹਸਪਤਾਲ ID ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੀ।",
    "ta-IN": "கோரிய மருத்துவமனை ID-ஐ ஏற்ற முடியவில்லை.",
  },
  "Hospital Administrator": {
    "en-IN": "Hospital Administrator",
    "hi-IN": "अस्पताल प्रशासक",
    "pa-IN": "ਹਸਪਤਾਲ ਪ੍ਰਸ਼ਾਸਕ",
    "ta-IN": "மருத்துவமனை நிர்வாகி",
  },
  "Unclaimed / No Admin": {
    "en-IN": "Unclaimed / No Admin",
    "hi-IN": "असाइन नहीं / प्रशासक नहीं",
    "pa-IN": "ਦਾਅਵਾ ਨਹੀਂ ਕੀਤਾ / ਪ੍ਰਸ਼ਾਸਕ ਨਹੀਂ",
    "ta-IN": "உரிமை கோரப்படவில்லை / நிர்வாகி இல்லை",
  },
  "This hospital has no linked admin profile.": {
    "en-IN": "This hospital has no linked admin profile.",
    "hi-IN": "इस अस्पताल से कोई प्रशासक प्रोफ़ाइल जुड़ी नहीं है।",
    "pa-IN": "ਇਸ ਹਸਪਤਾਲ ਨਾਲ ਕੋਈ ਪ੍ਰਸ਼ਾਸਕ ਪ੍ਰੋਫ਼ਾਈਲ ਜੁੜੀ ਨਹੀਂ ਹੈ।",
    "ta-IN": "இந்த மருத்துவமனையுடன் நிர்வாகி சுயவிவரம் இணைக்கப்படவில்லை.",
  },
  "Total Users": {
    "en-IN": "Total Users",
    "hi-IN": "कुल उपयोगकर्ता",
    "pa-IN": "ਕੁੱਲ ਵਰਤੋਂਕਾਰ",
    "ta-IN": "மொத்த பயனர்கள்",
  },
  Clinics: {
    "en-IN": "Clinics",
    "hi-IN": "क्लिनिक",
    "pa-IN": "ਕਲੀਨਿਕ",
    "ta-IN": "கிளினிக்குகள்",
  },
  "Storage Used": {
    "en-IN": "Storage Used",
    "hi-IN": "इस्तेमाल किया गया स्टोरेज",
    "pa-IN": "ਵਰਤੀ ਗਈ ਸਟੋਰੇਜ",
    "ta-IN": "பயன்படுத்திய சேமிப்பிடம்",
  },
  "Database & Media": {
    "en-IN": "Database & Media",
    "hi-IN": "डेटाबेस और मीडिया",
    "pa-IN": "ਡਾਟਾਬੇਸ ਅਤੇ ਮੀਡੀਆ",
    "ta-IN": "தரவுத்தளம் மற்றும் ஊடகம்",
  },
  "Current Plan": {
    "en-IN": "Current Plan",
    "hi-IN": "वर्तमान योजना",
    "pa-IN": "ਮੌਜੂਦਾ ਯੋਜਨਾ",
    "ta-IN": "தற்போதைய திட்டம்",
  },
  "Billing History": {
    "en-IN": "Billing History",
    "hi-IN": "बिलिंग इतिहास",
    "pa-IN": "ਬਿਲਿੰਗ ਇਤਿਹਾਸ",
    "ta-IN": "பில்லிங் வரலாறு",
  },
  PAID: {
    "en-IN": "PAID",
    "hi-IN": "भुगतान हुआ",
    "pa-IN": "ਭੁਗਤਾਨ ਹੋਇਆ",
    "ta-IN": "செலுத்தப்பட்டது",
  },
  FREE: { "en-IN": "FREE", "hi-IN": "मुफ़्त", "pa-IN": "ਮੁਫ਼ਤ", "ta-IN": "இலவசம்" },

  // Equipment management; free-form names, dates, amounts and category values are excluded.
  "Equipments & Assets": {
    "en-IN": "Equipments & Assets",
    "hi-IN": "उपकरण और संपत्तियाँ",
    "pa-IN": "ਉਪਕਰਣ ਅਤੇ ਸੰਪਤੀਆਂ",
    "ta-IN": "உபகரணங்கள் மற்றும் சொத்துகள்",
  },
  "Manage hospital machines, furniture, and fixed assets": {
    "en-IN": "Manage hospital machines, furniture, and fixed assets",
    "hi-IN": "अस्पताल की मशीनें, फर्नीचर और स्थायी संपत्तियाँ प्रबंधित करें",
    "pa-IN": "ਹਸਪਤਾਲ ਦੀਆਂ ਮਸ਼ੀਨਾਂ, ਫਰਨੀਚਰ ਅਤੇ ਸਥਾਈ ਸੰਪਤੀਆਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
    "ta-IN": "மருத்துவமனை இயந்திரங்கள், மரச்சாமான்கள் மற்றும் நிலையான சொத்துகளை நிர்வகிக்கவும்",
  },
  "Add New Equipment": {
    "en-IN": "Add New Equipment",
    "hi-IN": "नया उपकरण जोड़ें",
    "pa-IN": "ਨਵਾਂ ਉਪਕਰਣ ਸ਼ਾਮਲ ਕਰੋ",
    "ta-IN": "புதிய உபகரணத்தைச் சேர்க்கவும்",
  },
  "Equipment Name": {
    "en-IN": "Equipment Name",
    "hi-IN": "उपकरण का नाम",
    "pa-IN": "ਉਪਕਰਣ ਦਾ ਨਾਮ",
    "ta-IN": "உபகரணத்தின் பெயர்",
  },
  "e.g. Samsung Smart TV, ICU Bed Model X": {
    "en-IN": "e.g. Samsung Smart TV, ICU Bed Model X",
    "hi-IN": "जैसे Samsung Smart TV, ICU Bed Model X",
    "pa-IN": "ਜਿਵੇਂ Samsung Smart TV, ICU Bed Model X",
    "ta-IN": "எ.கா. Samsung Smart TV, ICU Bed Model X",
  },
  Category: {
    "en-IN": "Category",
    "hi-IN": "श्रेणी",
    "pa-IN": "ਸ਼੍ਰੇਣੀ",
    "ta-IN": "வகை",
  },
  Quantity: {
    "en-IN": "Quantity",
    "hi-IN": "मात्रा",
    "pa-IN": "ਮਾਤਰਾ",
    "ta-IN": "அளவு",
  },
  "Unit Cost (₹)": {
    "en-IN": "Unit Cost (₹)",
    "hi-IN": "प्रति इकाई लागत (₹)",
    "pa-IN": "ਪ੍ਰਤੀ ਇਕਾਈ ਲਾਗਤ (₹)",
    "ta-IN": "அலகு விலை (₹)",
  },
  "Purchase Date": {
    "en-IN": "Purchase Date",
    "hi-IN": "खरीद की तारीख",
    "pa-IN": "ਖਰੀਦ ਦੀ ਮਿਤੀ",
    "ta-IN": "கொள்முதல் தேதி",
  },
  "Assign to Clinic (Optional)": {
    "en-IN": "Assign to Clinic (Optional)",
    "hi-IN": "क्लिनिक को असाइन करें (वैकल्पिक)",
    "pa-IN": "ਕਲੀਨਿਕ ਨੂੰ ਸੌਂਪੋ (ਵਿਕਲਪਿਕ)",
    "ta-IN": "கிளினிக்கிற்கு ஒதுக்கவும் (விருப்பம்)",
  },
  "Hospital Wide / Global": {
    "en-IN": "Hospital Wide / Global",
    "hi-IN": "पूरे अस्पताल के लिए / वैश्विक",
    "pa-IN": "ਪੂਰੇ ਹਸਪਤਾਲ ਲਈ / ਵਿਸ਼ਵਵਿਆਪੀ",
    "ta-IN": "மருத்துவமனை முழுவதும் / பொது",
  },
  Cancel: {
    "en-IN": "Cancel",
    "hi-IN": "रद्द करें",
    "pa-IN": "ਰੱਦ ਕਰੋ",
    "ta-IN": "ரத்துசெய்",
  },
  "Total Assets": {
    "en-IN": "Total Assets",
    "hi-IN": "कुल संपत्तियाँ",
    "pa-IN": "ਕੁੱਲ ਸੰਪਤੀਆਂ",
    "ta-IN": "மொத்த சொத்துகள்",
  },
  "Units tracked": {
    "en-IN": "Units tracked",
    "hi-IN": "ट्रैक की गई इकाइयाँ",
    "pa-IN": "ਟਰੈਕ ਕੀਤੀਆਂ ਇਕਾਈਆਂ",
    "ta-IN": "கண்காணிக்கப்படும் அலகுகள்",
  },
  "Total Valuation": {
    "en-IN": "Total Valuation",
    "hi-IN": "कुल मूल्यांकन",
    "pa-IN": "ਕੁੱਲ ਮੁੱਲਾਂਕਣ",
    "ta-IN": "மொத்த மதிப்பீடு",
  },
  "Acquisition cost": {
    "en-IN": "Acquisition cost",
    "hi-IN": "अधिग्रहण लागत",
    "pa-IN": "ਖਰੀਦ ਲਾਗਤ",
    "ta-IN": "கையகப்படுத்தல் செலவு",
  },
  Functional: {
    "en-IN": "Functional",
    "hi-IN": "कार्यशील",
    "pa-IN": "ਚਾਲੂ ਹਾਲਤ ਵਿੱਚ",
    "ta-IN": "செயல்பாட்டில்",
  },
  "Active categories": {
    "en-IN": "Active categories",
    "hi-IN": "सक्रिय श्रेणियाँ",
    "pa-IN": "ਸਰਗਰਮ ਸ਼੍ਰੇਣੀਆਂ",
    "ta-IN": "செயலில் உள்ள வகைகள்",
  },
  "Recent Activity": {
    "en-IN": "Recent Activity",
    "hi-IN": "हाल की गतिविधि",
    "pa-IN": "ਹਾਲੀਆ ਸਰਗਰਮੀ",
    "ta-IN": "சமீபத்திய செயல்பாடு",
  },
  Active: {
    "en-IN": "Active",
    "hi-IN": "सक्रिय",
    "pa-IN": "ਸਰਗਰਮ",
    "ta-IN": "செயலில்",
  },
  "N/A": {
    "en-IN": "N/A",
    "hi-IN": "उपलब्ध नहीं",
    "pa-IN": "ਉਪਲਬਧ ਨਹੀਂ",
    "ta-IN": "கிடைக்கவில்லை",
  },
  "Asset registry": {
    "en-IN": "Asset registry",
    "hi-IN": "संपत्ति रजिस्टर",
    "pa-IN": "ਸੰਪਤੀ ਰਜਿਸਟਰੀ",
    "ta-IN": "சொத்துப் பதிவேடு",
  },
  "Inventory Insight": {
    "en-IN": "Inventory Insight",
    "hi-IN": "इन्वेंटरी जानकारी",
    "pa-IN": "ਵਸਤੂ-ਸੂਚੀ ਜਾਣਕਾਰੀ",
    "ta-IN": "சரக்கு விவரம்",
  },
  "Search equipment by name or model...": {
    "en-IN": "Search equipment by name or model...",
    "hi-IN": "उपकरण को नाम या मॉडल से खोजें...",
    "pa-IN": "ਉਪਕਰਣ ਨੂੰ ਨਾਮ ਜਾਂ ਮਾਡਲ ਨਾਲ ਖੋਜੋ...",
    "ta-IN": "பெயர் அல்லது மாதிரி மூலம் உபகரணத்தைத் தேடுங்கள்...",
  },
  "Asset Item": {
    "en-IN": "Asset Item",
    "hi-IN": "संपत्ति वस्तु",
    "pa-IN": "ਸੰਪਤੀ ਆਈਟਮ",
    "ta-IN": "சொத்து உருப்படி",
  },
  "Purchase Cost": {
    "en-IN": "Purchase Cost",
    "hi-IN": "खरीद लागत",
    "pa-IN": "ਖਰੀਦ ਲਾਗਤ",
    "ta-IN": "கொள்முதல் செலவு",
  },
  Status: {
    "en-IN": "Status",
    "hi-IN": "स्थिति",
    "pa-IN": "ਸਥਿਤੀ",
    "ta-IN": "நிலை",
  },
  Actions: {
    "en-IN": "Actions",
    "hi-IN": "कार्रवाइयाँ",
    "pa-IN": "ਕਾਰਵਾਈਆਂ",
    "ta-IN": "செயல்கள்",
  },

  // Fixed emergency operations controls. Patient-specific alerts/vitals and sentinel rule outputs are excluded.
  "All Bays Stable": {
    "en-IN": "All Bays Stable",
    "hi-IN": "सभी बे स्थिर हैं",
    "pa-IN": "ਸਾਰੇ ਬੇ ਸਥਿਰ ਹਨ",
    "ta-IN": "அனைத்து படுக்கைப் பகுதிகளும் நிலையாக உள்ளன",
  },
  "Continuous hospital kiosk & waiting hall surveillance": {
    "en-IN": "Continuous hospital kiosk & waiting hall surveillance",
    "hi-IN": "अस्पताल कियोस्क और प्रतीक्षालय की लगातार निगरानी",
    "pa-IN": "ਹਸਪਤਾਲ ਕਿਓਸਕ ਅਤੇ ਉਡੀਕ ਹਾਲ ਦੀ ਲਗਾਤਾਰ ਨਿਗਰਾਨੀ",
    "ta-IN": "மருத்துவமனை கியோஸ்க் மற்றும் காத்திருப்பு மண்டபத்தின் தொடர்ச்சியான கண்காணிப்பு",
  },
  "Toggle Dark / Light Theme": {
    "en-IN": "Toggle Dark / Light Theme",
    "hi-IN": "डार्क / लाइट थीम बदलें",
    "pa-IN": "ਡਾਰਕ / ਲਾਈਟ ਥੀਮ ਬਦਲੋ",
    "ta-IN": "இருள் / ஒளி தோற்றத்தை மாற்றவும்",
  },
  "Simulate STAT Alert": {
    "en-IN": "Simulate STAT Alert",
    "hi-IN": "तत्काल अलर्ट का अनुकरण करें",
    "pa-IN": "ਤੁਰੰਤ ਚੇਤਾਵਨੀ ਦੀ ਨਕਲ ਚਲਾਓ",
    "ta-IN": "அவசர எச்சரிக்கையை உருவகப்படுத்தவும்",
  },
  "Clear Bay Filter": {
    "en-IN": "Clear Bay Filter",
    "hi-IN": "बे फ़िल्टर हटाएँ",
    "pa-IN": "ਬੇ ਫਿਲਟਰ ਸਾਫ਼ ਕਰੋ",
    "ta-IN": "படுக்கைப் பகுதி வடிகட்டியை நீக்கவும்",
  },
  "Ready for Casualty Intake": {
    "en-IN": "Ready for Casualty Intake",
    "hi-IN": "आपातकालीन मरीज़ को लेने के लिए तैयार",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ਮਰੀਜ਼ ਨੂੰ ਲੈਣ ਲਈ ਤਿਆਰ",
    "ta-IN": "அவசர நோயாளியை ஏற்கத் தயார்",
  },
  "Deterministic Sentinel Socket Stream Active": {
    "en-IN": "Deterministic Sentinel Socket Stream Active",
    "hi-IN": "नियतात्मक Sentinel सॉकेट स्ट्रीम सक्रिय",
    "pa-IN": "ਨਿਰਧਾਰਤ Sentinel ਸਾਕਟ ਸਟ੍ਰੀਮ ਸਰਗਰਮ",
    "ta-IN": "நிர்ணயிக்கப்பட்ட Sentinel சாக்கெட் ஸ்ட்ரீம் செயல்பாட்டில்",
  },
  "Search patient, token, complaint, bay...": {
    "en-IN": "Search patient, token, complaint, bay...",
    "hi-IN": "मरीज़, टोकन, शिकायत या बे खोजें...",
    "pa-IN": "ਮਰੀਜ਼, ਟੋਕਨ, ਸ਼ਿਕਾਇਤ ਜਾਂ ਬੇ ਖੋਜੋ...",
    "ta-IN": "நோயாளி, டோக்கன், புகார் அல்லது படுக்கைப் பகுதியைத் தேடுங்கள்...",
  },
  "No Emergency Cases Matching Filter": {
    "en-IN": "No Emergency Cases Matching Filter",
    "hi-IN": "फ़िल्टर से मेल खाते आपातकालीन मामले नहीं हैं",
    "pa-IN": "ਫਿਲਟਰ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਐਮਰਜੈਂਸੀ ਕੇਸ ਨਹੀਂ ਹਨ",
    "ta-IN": "வடிகட்டியுடன் பொருந்தும் அவசர வழக்குகள் இல்லை",
  },
  "All casualty resuscitation bays and triage streams are currently balanced.":
    {
      "en-IN":
        "All casualty resuscitation bays and triage streams are currently balanced.",
      "hi-IN": "सभी आपातकालीन पुनर्जीवन बे और ट्रायेज़ स्ट्रीम अभी संतुलित हैं।",
      "pa-IN": "ਸਾਰੇ ਐਮਰਜੈਂਸੀ ਪੁਨਰਜੀਵਨ ਬੇ ਅਤੇ ਟ੍ਰਾਇਏਜ ਸਟ੍ਰੀਮ ਇਸ ਵੇਲੇ ਸੰਤੁਲਿਤ ਹਨ।",
      "ta-IN":
        "அனைத்து அவசர உயிர்ப்பிப்பு பகுதிகளும் வகைப்படுத்தல் ஓட்டங்களும் தற்போது சமநிலையில் உள்ளன.",
    },
  "Dispatch Crash Cart & Code Team": {
    "en-IN": "Dispatch Crash Cart & Code Team",
    "hi-IN": "क्रैश कार्ट और कोड टीम भेजें",
    "pa-IN": "ਕ੍ਰੈਸ਼ ਕਾਰਟ ਅਤੇ ਕੋਡ ਟੀਮ ਭੇਜੋ",
    "ta-IN": "அவசர சிகிச்சை வண்டி மற்றும் அவசரக் குழுவை அனுப்பவும்",
  },
  "Stabilize & Clear Bay": {
    "en-IN": "Stabilize & Clear Bay",
    "hi-IN": "स्थिति स्थिर करें और बे खाली करें",
    "pa-IN": "ਹਾਲਤ ਸਥਿਰ ਕਰੋ ਅਤੇ ਬੇ ਖਾਲੀ ਕਰੋ",
    "ta-IN": "நிலைப்படுத்தி படுக்கைப் பகுதியை காலி செய்யவும்",
  },
  "Emergency Bed Admission (IPD)": {
    "en-IN": "Emergency Bed Admission (IPD)",
    "hi-IN": "आपातकालीन बेड भर्ती (IPD)",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ਬੈੱਡ ਦਾਖ਼ਲਾ (IPD)",
    "ta-IN": "அவசர படுக்கை அனுமதி (உள்நோயாளர்)",
  },

  // AYUSH operations headings; named patients, formulas/doses, and assessments are deliberately omitted.
  "Print Case Sheet": {
    "en-IN": "Print Case Sheet",
    "hi-IN": "केस शीट प्रिंट करें",
    "pa-IN": "ਕੇਸ ਸ਼ੀਟ ਪ੍ਰਿੰਟ ਕਰੋ",
    "ta-IN": "வழக்கு தாளை அச்சிடவும்",
  },
  "AYUSH OPD Queue": {
    "en-IN": "AYUSH OPD Queue",
    "hi-IN": "आयुष OPD कतार",
    "pa-IN": "AYUSH OPD ਕਤਾਰ",
    "ta-IN": "AYUSH வெளிநோயாளர் வரிசை",
  },
  "AyuSetu AYUSH Clinical Centre": {
    "en-IN": "AyuSetu AYUSH Clinical Centre",
    "hi-IN": "आयुसेतु आयुष क्लिनिकल केंद्र",
    "pa-IN": "ਆਯੁਸੇਤੂ AYUSH ਕਲੀਨਿਕਲ ਕੇਂਦਰ",
    "ta-IN": "ஆயுசேது AYUSH மருத்துவ மையம்",
  },
  "Ministry of Ayush Standardized OPD Case Sheet": {
    "en-IN": "Ministry of Ayush Standardized OPD Case Sheet",
    "hi-IN": "आयुष मंत्रालय की मानकीकृत OPD केस शीट",
    "pa-IN": "ਆਯੁਸ਼ ਮੰਤਰਾਲੇ ਦੀ ਮਿਆਰੀ OPD ਕੇਸ ਸ਼ੀਟ",
    "ta-IN": "ஆயுஷ் அமைச்சகத்தின் தரப்படுத்தப்பட்ட வெளிநோயாளர் வழக்கு தாள்",
  },
  "ABDM Milestone 2": {
    "en-IN": "ABDM Milestone 2",
    "hi-IN": "ABDM माइलस्टोन 2",
    "pa-IN": "ABDM ਮੀਲਪੱਥਰ 2",
    "ta-IN": "ABDM மைல்கல் 2",
  },
  "Approve & Push to POS": {
    "en-IN": "Approve & Push to POS",
    "hi-IN": "स्वीकृत करें और POS पर भेजें",
    "pa-IN": "ਮਨਜ਼ੂਰ ਕਰਕੇ POS ਨੂੰ ਭੇਜੋ",
    "ta-IN": "ஒப்புதல் அளித்து POS-க்கு அனுப்பவும்",
  },
  "Tridosha Prakriti Analysis": {
    "en-IN": "Tridosha Prakriti Analysis",
    "hi-IN": "त्रिदोष प्रकृति विश्लेषण",
    "pa-IN": "ਤ੍ਰਿਦੋਸ਼ ਪ੍ਰਕਿਰਤੀ ਵਿਸ਼ਲੇਸ਼ਣ",
    "ta-IN": "திரிதோஷ பிரகிருதி பகுப்பாய்வு",
  },
  "Dashavidha Pariksha (10-Fold Clinical Clinical Diagnostic Suite)": {
    "en-IN": "Dashavidha Pariksha (10-Fold Clinical Clinical Diagnostic Suite)",
    "hi-IN": "दशविध परीक्षा (दस-भागीय क्लिनिकल निदान प्रणाली)",
    "pa-IN": "ਦਸ਼ਵਿਧ ਪਰਿਕਸ਼ਾ (ਦਸ-ਭਾਗੀ ਕਲੀਨਿਕਲ ਨਿਦਾਨ ਪ੍ਰਣਾਲੀ)",
    "ta-IN": "தசவித பரீக்ஷை (பத்து-பகுதி மருத்துவ நோயறிதல் தொகுப்பு)",
  },
  "Classical Ayurvedic Formulations (Rx)": {
    "en-IN": "Classical Ayurvedic Formulations (Rx)",
    "hi-IN": "शास्त्रीय आयुर्वेदिक औषध योग (Rx)",
    "pa-IN": "ਪ੍ਰਾਚੀਨ ਆਯੁਰਵੈਦਿਕ ਫਾਰਮੂਲੇ (Rx)",
    "ta-IN": "பாரம்பரிய ஆயுர்வேத மருந்துக் கலவைகள் (Rx)",
  },

  Beds: { "en-IN": "Beds", "hi-IN": "बेड", "pa-IN": "ਬੈੱਡ", "ta-IN": "படுக்கைகள்" },
  "Medical Machines": {
    "en-IN": "Medical Machines",
    "hi-IN": "चिकित्सा मशीनें",
    "pa-IN": "ਮੈਡੀਕਲ ਮਸ਼ੀਨਾਂ",
    "ta-IN": "மருத்துவ இயந்திரங்கள்",
  },
  "IT / Electronics": {
    "en-IN": "IT / Electronics",
    "hi-IN": "IT / इलेक्ट्रॉनिक्स",
    "pa-IN": "IT / ਇਲੈਕਟ੍ਰਾਨਿਕਸ",
    "ta-IN": "IT / மின்னணுவியல்",
  },
  Furniture: {
    "en-IN": "Furniture",
    "hi-IN": "फर्नीचर",
    "pa-IN": "ਫਰਨੀਚਰ",
    "ta-IN": "மரச்சாமான்கள்",
  },
  "Maintenance Tools": {
    "en-IN": "Maintenance Tools",
    "hi-IN": "रखरखाव के औज़ार",
    "pa-IN": "ਰੱਖ-ਰਖਾਅ ਦੇ ਸੰਦ",
    "ta-IN": "பராமரிப்புக் கருவிகள்",
  },
  Other: { "en-IN": "Other", "hi-IN": "अन्य", "pa-IN": "ਹੋਰ", "ta-IN": "மற்றவை" },
  Error: {
    "en-IN": "Error",
    "hi-IN": "त्रुटि",
    "pa-IN": "ਗਲਤੀ",
    "ta-IN": "பிழை",
  },
  Success: {
    "en-IN": "Success",
    "hi-IN": "सफलता",
    "pa-IN": "ਸਫਲਤਾ",
    "ta-IN": "வெற்றி",
  },
  "Failed to load equipments": {
    "en-IN": "Failed to load equipments",
    "hi-IN": "उपकरण लोड नहीं हो सके",
    "pa-IN": "ਉਪਕਰਣ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੇ",
    "ta-IN": "உபகரணங்களை ஏற்ற முடியவில்லை",
  },
  "Equipment added to inventory successfully": {
    "en-IN": "Equipment added to inventory successfully",
    "hi-IN": "उपकरण इन्वेंटरी में सफलतापूर्वक जोड़ा गया",
    "pa-IN": "ਉਪਕਰਣ ਸਫਲਤਾਪੂਰਵਕ ਵਸਤੂ-ਸੂਚੀ ਵਿੱਚ ਸ਼ਾਮਲ ਕੀਤਾ ਗਿਆ",
    "ta-IN": "உபகரணம் சரக்குப் பட்டியலில் வெற்றிகரமாகச் சேர்க்கப்பட்டது",
  },
  "Failed to add equipment": {
    "en-IN": "Failed to add equipment",
    "hi-IN": "उपकरण नहीं जोड़ा जा सका",
    "pa-IN": "ਉਪਕਰਣ ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਿਆ",
    "ta-IN": "உபகரணத்தைச் சேர்க்க முடியவில்லை",
  },
  "Are you sure you want to remove this equipment record?": {
    "en-IN": "Are you sure you want to remove this equipment record?",
    "hi-IN": "क्या आप वाकई इस उपकरण रिकॉर्ड को हटाना चाहते हैं?",
    "pa-IN": "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਉਪਕਰਣ ਦਾ ਰਿਕਾਰਡ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    "ta-IN": "இந்த உபகரணப் பதிவை நீக்க விரும்புகிறீர்களா?",
  },
  "Equipment record removed": {
    "en-IN": "Equipment record removed",
    "hi-IN": "उपकरण रिकॉर्ड हटाया गया",
    "pa-IN": "ਉਪਕਰਣ ਦਾ ਰਿਕਾਰਡ ਹਟਾਇਆ ਗਿਆ",
    "ta-IN": "உபகரணப் பதிவு நீக்கப்பட்டது",
  },
  "Failed to delete record": {
    "en-IN": "Failed to delete record",
    "hi-IN": "रिकॉर्ड हटाया नहीं जा सका",
    "pa-IN": "ਰਿਕਾਰਡ ਮਿਟਾਇਆ ਨਹੀਂ ਜਾ ਸਕਿਆ",
    "ta-IN": "பதிவை நீக்க முடியவில்லை",
  },
  "No Data": {
    "en-IN": "No Data",
    "hi-IN": "कोई डेटा नहीं",
    "pa-IN": "ਕੋਈ ਡਾਟਾ ਨਹੀਂ",
    "ta-IN": "தரவு இல்லை",
  },
  "No equipment records found to generate report": {
    "en-IN": "No equipment records found to generate report",
    "hi-IN": "रिपोर्ट बनाने के लिए उपकरण रिकॉर्ड नहीं मिले",
    "pa-IN": "ਰਿਪੋਰਟ ਬਣਾਉਣ ਲਈ ਉਪਕਰਣਾਂ ਦੇ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲੇ",
    "ta-IN": "அறிக்கையை உருவாக்க உபகரணப் பதிவுகள் இல்லை",
  },
  "Asset report generated and downloaded": {
    "en-IN": "Asset report generated and downloaded",
    "hi-IN": "संपत्ति रिपोर्ट बनाई और डाउनलोड की गई",
    "pa-IN": "ਸੰਪਤੀ ਰਿਪੋਰਟ ਬਣਾਈ ਅਤੇ ਡਾਊਨਲੋਡ ਕੀਤੀ ਗਈ",
    "ta-IN": "சொத்து அறிக்கை உருவாக்கப்பட்டு பதிவிறக்கப்பட்டது",
  },
  "Audio Alerts Enabled": {
    "en-IN": "Audio Alerts Enabled",
    "hi-IN": "ऑडियो अलर्ट चालू",
    "pa-IN": "ਆਡੀਓ ਚੇਤਾਵਨੀਆਂ ਚਾਲੂ",
    "ta-IN": "ஒலி எச்சரிக்கைகள் இயக்கப்பட்டன",
  },
  "Audio Alerts Muted": {
    "en-IN": "Audio Alerts Muted",
    "hi-IN": "ऑडियो अलर्ट म्यूट",
    "pa-IN": "ਆਡੀਓ ਚੇਤਾਵਨੀਆਂ ਮਿਊਟ",
    "ta-IN": "ஒலி எச்சரிக்கைகள் முடக்கப்பட்டன",
  },
  "Decision Latency": {
    "en-IN": "Decision Latency",
    "hi-IN": "निर्णय में लगने वाला समय",
    "pa-IN": "ਫੈਸਲੇ ਦੀ ਦੇਰੀ",
    "ta-IN": "முடிவு தாமதம்",
  },
  "Code Team Engaged": {
    "en-IN": "Code Team Engaged",
    "hi-IN": "कोड टीम सक्रिय",
    "pa-IN": "ਕੋਡ ਟੀਮ ਸਰਗਰਮ",
    "ta-IN": "அவசரக் குழு செயல்பாட்டில்",
  },
  "AYUSETU Cryptographic Hash Seal:": {
    "en-IN": "AYUSETU Cryptographic Hash Seal:",
    "hi-IN": "AYUSETU क्रिप्टोग्राफ़िक हैश सील:",
    "pa-IN": "AYUSETU ਕ੍ਰਿਪਟੋਗ੍ਰਾਫਿਕ ਹੈਸ਼ ਸੀਲ:",
    "ta-IN": "AYUSETU குறியாக்க ஹாஷ் முத்திரை:",
  },
  " (Tamper-Proof Escrow)": {
    "en-IN": " (Tamper-Proof Escrow)",
    "hi-IN": " (छेड़छाड़-सुरक्षित अभिरक्षा)",
    "pa-IN": " (ਛੇੜਛਾੜ-ਸੁਰੱਖਿਅਤ ਹਿਰਾਸਤ)",
    "ta-IN": " (மாற்றமுடியாத பாதுகாப்புக் காப்பு)",
  },
  "Please select both source and destination clinics.": {
    "en-IN": "Please select both source and destination clinics.",
    "hi-IN": "कृपया स्रोत और गंतव्य दोनों क्लिनिक चुनें।",
    "pa-IN": "ਕਿਰਪਾ ਕਰਕੇ ਸਰੋਤ ਅਤੇ ਮੰਜ਼ਿਲ ਦੋਵੇਂ ਕਲੀਨਿਕ ਚੁਣੋ।",
    "ta-IN": "மூல மற்றும் சேருமிட கிளினிக்குகள் இரண்டையும் தேர்ந்தெடுக்கவும்.",
  },
  "Source and destination clinics must be different.": {
    "en-IN": "Source and destination clinics must be different.",
    "hi-IN": "स्रोत और गंतव्य क्लिनिक अलग-अलग होने चाहिए।",
    "pa-IN": "ਸਰੋਤ ਅਤੇ ਮੰਜ਼ਿਲ ਕਲੀਨਿਕ ਵੱਖਰੇ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।",
    "ta-IN": "மூல மற்றும் சேருமிட கிளினிக்குகள் வேறுபட்டிருக்க வேண்டும்.",
  },
  "Please select at least one medicine to migrate.": {
    "en-IN": "Please select at least one medicine to migrate.",
    "hi-IN": "स्थानांतरित करने के लिए कम से कम एक दवा चुनें।",
    "pa-IN": "ਤਬਦੀਲ ਕਰਨ ਲਈ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਦਵਾਈ ਚੁਣੋ।",
    "ta-IN": "மாற்றுவதற்கு குறைந்தது ஒரு மருந்தையாவது தேர்ந்தெடுக்கவும்.",
  },
  "Failed to perform migration. Please try again.": {
    "en-IN": "Failed to perform migration. Please try again.",
    "hi-IN": "स्थानांतरण नहीं हो सका। कृपया फिर से प्रयास करें।",
    "pa-IN": "ਤਬਦੀਲੀ ਨਹੀਂ ਹੋ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    "ta-IN": "மாற்றத்தைச் செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  },

  // Patient kiosk form and document controls. Example patient records, symptoms,
  // and any values entered by the patient are deliberately excluded.
  "Enter Registered 10-Digit Mobile Number:": {
    "en-IN": "Enter Registered 10-Digit Mobile Number:",
    "hi-IN": "पंजीकृत 10 अंकों का मोबाइल नंबर दर्ज करें:",
    "pa-IN": "ਰਜਿਸਟਰ ਕੀਤਾ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ:",
    "ta-IN": "பதிவு செய்யப்பட்ட 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்:",
  },
  "Enter 12-Digit Aadhaar Number (UIDAI):": {
    "en-IN": "Enter 12-Digit Aadhaar Number (UIDAI):",
    "hi-IN": "12 अंकों का आधार नंबर दर्ज करें (UIDAI):",
    "pa-IN": "12 ਅੰਕਾਂ ਦਾ ਆਧਾਰ ਨੰਬਰ ਦਰਜ ਕਰੋ (UIDAI):",
    "ta-IN": "12 இலக்க ஆதார் எண்ணை உள்ளிடவும் (UIDAI):",
  },
  "Full Name:": {
    "en-IN": "Full Name:",
    "hi-IN": "पूरा नाम:",
    "pa-IN": "ਪੂਰਾ ਨਾਮ:",
    "ta-IN": "முழுப் பெயர்:",
  },
  "Age:": {
    "en-IN": "Age:",
    "hi-IN": "आयु:",
    "pa-IN": "ਉਮਰ:",
    "ta-IN": "வயது:",
  },
  "Gender:": {
    "en-IN": "Gender:",
    "hi-IN": "लिंग:",
    "pa-IN": "ਲਿੰਗ:",
    "ta-IN": "பாலினம்:",
  },
  "Mobile:": {
    "en-IN": "Mobile:",
    "hi-IN": "मोबाइल:",
    "pa-IN": "ਮੋਬਾਈਲ:",
    "ta-IN": "மொபைல்:",
  },
  "Aadhaar (Optional):": {
    "en-IN": "Aadhaar (Optional):",
    "hi-IN": "आधार (वैकल्पिक):",
    "pa-IN": "ਆਧਾਰ (ਵਿਕਲਪਿਕ):",
    "ta-IN": "ஆதார் (விருப்பம்):",
  },
  "Auth Method:": {
    "en-IN": "Auth Method:",
    "hi-IN": "प्रमाणीकरण का तरीका:",
    "pa-IN": "ਪ੍ਰਮਾਣੀਕਰਨ ਦਾ ਤਰੀਕਾ:",
    "ta-IN": "அங்கீகார முறை:",
  },
  Female: {
    "en-IN": "Female",
    "hi-IN": "महिला",
    "pa-IN": "ਔਰਤ",
    "ta-IN": "பெண்",
  },
  Male: { "en-IN": "Male", "hi-IN": "पुरुष", "pa-IN": "ਮਰਦ", "ta-IN": "ஆண்" },
  "Capture Photo": {
    "en-IN": "Capture Photo",
    "hi-IN": "फ़ोटो लें",
    "pa-IN": "ਫ਼ੋਟੋ ਖਿੱਚੋ",
    "ta-IN": "புகைப்படம் எடுக்கவும்",
  },
  Scanned: {
    "en-IN": "Scanned",
    "hi-IN": "स्कैन किया गया",
    "pa-IN": "ਸਕੈਨ ਕੀਤਾ",
    "ta-IN": "ஸ்கேன் செய்யப்பட்டது",
  },
  "Camera Scan": {
    "en-IN": "Camera Scan",
    "hi-IN": "कैमरे से स्कैन करें",
    "pa-IN": "ਕੈਮਰੇ ਨਾਲ ਸਕੈਨ ਕਰੋ",
    "ta-IN": "கேமரா ஸ்கேன்",
  },
  "Upload Image": {
    "en-IN": "Upload Image",
    "hi-IN": "तस्वीर अपलोड करें",
    "pa-IN": "ਤਸਵੀਰ ਅੱਪਲੋਡ ਕਰੋ",
    "ta-IN": "படத்தைப் பதிவேற்றவும்",
  },
  "Uploaded Documents / Pages:": {
    "en-IN": "Uploaded Documents / Pages:",
    "hi-IN": "अपलोड किए गए दस्तावेज़ / पृष्ठ:",
    "pa-IN": "ਅੱਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ / ਪੰਨੇ:",
    "ta-IN": "பதிவேற்றிய ஆவணங்கள் / பக்கங்கள்:",
  },
  "Download / Print OPD Slip & Prescription (PDF)": {
    "en-IN": "Download / Print OPD Slip & Prescription (PDF)",
    "hi-IN": "OPD पर्ची और प्रिस्क्रिप्शन डाउनलोड / प्रिंट करें (PDF)",
    "pa-IN": "OPD ਪਰਚੀ ਅਤੇ ਨੁਸਖ਼ਾ ਡਾਊਨਲੋਡ / ਪ੍ਰਿੰਟ ਕਰੋ (PDF)",
    "ta-IN": "OPD சீட்டு மற்றும் மருந்துச் சீட்டை பதிவிறக்க / அச்சிடவும் (PDF)",
  },
  "Voice Intake": {
    "en-IN": "Voice Intake",
    "hi-IN": "आवाज़ से जानकारी दर्ज करें",
    "pa-IN": "ਆਵਾਜ਼ ਰਾਹੀਂ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ",
    "ta-IN": "குரல் வழி பதிவு",
  },
  "Submit & Translate": {
    "en-IN": "Submit & Translate",
    "hi-IN": "जमा करें और अनुवाद करें",
    "pa-IN": "ਜਮ੍ਹਾਂ ਕਰੋ ਅਤੇ ਅਨੁਵਾਦ ਕਰੋ",
    "ta-IN": "சமர்ப்பித்து மொழிபெயர்க்கவும்",
  },

  // Frequently used inventory selectors and empty states.
  "All Clinics Stock": {
    "en-IN": "All Clinics Stock",
    "hi-IN": "सभी क्लिनिक का स्टॉक",
    "pa-IN": "ਸਾਰੇ ਕਲੀਨਿਕਾਂ ਦਾ ਸਟਾਕ",
    "ta-IN": "அனைத்து கிளினிக்குகளின் இருப்பு",
  },
  "Download Excel (Live)": {
    "en-IN": "Download Excel (Live)",
    "hi-IN": "Excel डाउनलोड करें (लाइव डेटा)",
    "pa-IN": "Excel ਡਾਊਨਲੋਡ ਕਰੋ (ਲਾਈਵ ਡਾਟਾ)",
    "ta-IN": "Excel-ஐப் பதிவிறக்கவும் (நேரடி தரவு)",
  },
  "Date-Specific Export": {
    "en-IN": "Date-Specific Export",
    "hi-IN": "तारीख़ के अनुसार निर्यात",
    "pa-IN": "ਮਿਤੀ ਅਨੁਸਾਰ ਐਕਸਪੋਰਟ",
    "ta-IN": "தேதி சார்ந்த ஏற்றுமதி",
  },
  "Import Spreadsheet": {
    "en-IN": "Import Spreadsheet",
    "hi-IN": "स्प्रेडशीट आयात करें",
    "pa-IN": "ਸਪ੍ਰੈਡਸ਼ੀਟ ਇੰਪੋਰਟ ਕਰੋ",
    "ta-IN": "விரிதாளை இறக்குமதி செய்யவும்",
  },
  "Migrate Medicines": {
    "en-IN": "Migrate Medicines",
    "hi-IN": "दवाओं का स्थानांतरण करें",
    "pa-IN": "ਦਵਾਈਆਂ ਤਬਦੀਲ ਕਰੋ",
    "ta-IN": "மருந்துகளை மாற்றவும்",
  },
  "Search by name or batch...": {
    "en-IN": "Search by name or batch...",
    "hi-IN": "नाम या बैच से खोजें...",
    "pa-IN": "ਨਾਮ ਜਾਂ ਬੈਚ ਨਾਲ ਖੋਜੋ...",
    "ta-IN": "பெயர் அல்லது தொகுதி மூலம் தேடுங்கள்...",
  },
  "Select All": {
    "en-IN": "Select All",
    "hi-IN": "सभी चुनें",
    "pa-IN": "ਸਾਰੇ ਚੁਣੋ",
    "ta-IN": "அனைத்தையும் தேர்ந்தெடுக்கவும்",
  },
  "Item Name": {
    "en-IN": "Item Name",
    "hi-IN": "वस्तु का नाम",
    "pa-IN": "ਆਈਟਮ ਦਾ ਨਾਮ",
    "ta-IN": "பொருளின் பெயர்",
  },
  Store: {
    "en-IN": "Store",
    "hi-IN": "स्टोर",
    "pa-IN": "ਸਟੋਰ",
    "ta-IN": "கிடங்கு",
  },
  "Batch No": {
    "en-IN": "Batch No",
    "hi-IN": "बैच नंबर",
    "pa-IN": "ਬੈਚ ਨੰਬਰ",
    "ta-IN": "தொகுதி எண்",
  },
  "No inventory items match your current filters.": {
    "en-IN": "No inventory items match your current filters.",
    "hi-IN": "आपके मौजूदा फ़िल्टर से कोई इन्वेंटरी वस्तु मेल नहीं खाती।",
    "pa-IN": "ਤੁਹਾਡੇ ਮੌਜੂਦਾ ਫਿਲਟਰਾਂ ਨਾਲ ਕੋਈ ਵਸਤੂ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ।",
    "ta-IN": "தற்போதைய வடிகட்டிகளுடன் சரக்குப் பொருட்கள் எதுவும் பொருந்தவில்லை.",
  },
  "Select Clinic": {
    "en-IN": "Select Clinic",
    "hi-IN": "क्लिनिक चुनें",
    "pa-IN": "ਕਲੀਨਿਕ ਚੁਣੋ",
    "ta-IN": "கிளினிக்கைத் தேர்ந்தெடுக்கவும்",
  },
  "Export Historical Snapshot": {
    "en-IN": "Export Historical Snapshot",
    "hi-IN": "पुराना स्नैपशॉट निर्यात करें",
    "pa-IN": "ਪੁਰਾਣਾ ਸਨੈਪਸ਼ਾਟ ਐਕਸਪੋਰਟ ਕਰੋ",
    "ta-IN": "வரலாற்று நிலைப்படத்தை ஏற்றுமதி செய்யவும்",
  },
  "Snapshot Date": {
    "en-IN": "Snapshot Date",
    "hi-IN": "स्नैपशॉट की तारीख़",
    "pa-IN": "ਸਨੈਪਸ਼ਾਟ ਦੀ ਮਿਤੀ",
    "ta-IN": "நிலைப்படத் தேதி",
  },
  "Restock your inventory by selecting existing items. This allows you to generate a procurement bill for products already tracked in the system.":
    {
      "en-IN":
        "Restock your inventory by selecting existing items. This allows you to generate a procurement bill for products already tracked in the system.",
      "hi-IN":
        "मौजूदा वस्तुएँ चुनकर इन्वेंटरी फिर से भरें। इससे सिस्टम में पहले से दर्ज उत्पादों के लिए खरीद बिल बनाया जा सकता है।",
      "pa-IN":
        "ਮੌਜੂਦਾ ਆਈਟਮਾਂ ਚੁਣ ਕੇ ਆਪਣਾ ਸਟਾਕ ਮੁੜ ਭਰੋ। ਇਸ ਨਾਲ ਸਿਸਟਮ ਵਿੱਚ ਪਹਿਲਾਂ ਤੋਂ ਦਰਜ ਉਤਪਾਦਾਂ ਲਈ ਖਰੀਦ ਬਿੱਲ ਬਣਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।",
      "ta-IN":
        "ஏற்கனவே உள்ள பொருட்களைத் தேர்ந்தெடுத்து சரக்கை மீண்டும் நிரப்பவும். இதன் மூலம் அமைப்பில் ஏற்கனவே கண்காணிக்கப்படும் பொருட்களுக்கு கொள்முதல் பில் உருவாக்கலாம்.",
    },
  "Add and order completely new products. You'll be redirected to the procurement dashboard to create a fresh purchase order.":
    {
      "en-IN":
        "Add and order completely new products. You'll be redirected to the procurement dashboard to create a fresh purchase order.",
      "hi-IN":
        "बिल्कुल नए उत्पाद जोड़ें और ऑर्डर करें। नया खरीद ऑर्डर बनाने के लिए आपको खरीद डैशबोर्ड पर भेजा जाएगा।",
      "pa-IN":
        "ਬਿਲਕੁਲ ਨਵੇਂ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ ਆਰਡਰ ਕਰੋ। ਨਵਾਂ ਖਰੀਦ ਆਰਡਰ ਬਣਾਉਣ ਲਈ ਤੁਹਾਨੂੰ ਖਰੀਦ ਡੈਸ਼ਬੋਰਡ ਉੱਤੇ ਭੇਜਿਆ ਜਾਵੇਗਾ।",
      "ta-IN":
        "முற்றிலும் புதிய பொருட்களைச் சேர்த்து ஆர்டர் செய்யவும். புதிய கொள்முதல் ஆர்டரை உருவாக்க கொள்முதல் டாஷ்போர்டுக்கு அனுப்பப்படுவீர்கள்.",
    },
  "E.g. B-012": {
    "en-IN": "E.g. B-012",
    "hi-IN": "जैसे B-012",
    "pa-IN": "ਜਿਵੇਂ B-012",
    "ta-IN": "எ.கா. B-012",
  },

  // Emergency operations headings and system controls, excluding all case-specific data and rule results.
  "Casualty ER & STAT Red-Flag Triage": {
    "en-IN": "Casualty ER & STAT Red-Flag Triage",
    "hi-IN": "आपातकालीन ER और STAT रेड-फ़्लैग ट्रायेज",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ER ਅਤੇ STAT ਰੈੱਡ-ਫਲੈਗ ਟ੍ਰਾਇਏਜ",
    "ta-IN": "அவசர ER மற்றும் STAT அபாயக் குறி வகைப்படுத்தல்",
  },
  "Live Emergency Triage Stream": {
    "en-IN": "Live Emergency Triage Stream",
    "hi-IN": "लाइव आपातकालीन ट्रायेज स्ट्रीम",
    "pa-IN": "ਲਾਈਵ ਐਮਰਜੈਂਸੀ ਟ੍ਰਾਇਏਜ ਸਟ੍ਰੀਮ",
    "ta-IN": "நேரடி அவசர வகைப்படுத்தல் ஓட்டம்",
  },
  "Sentinel Deterministic Rule Core": {
    "en-IN": "Sentinel Deterministic Rule Core",
    "hi-IN": "Sentinel नियतात्मक नियम कोर",
    "pa-IN": "Sentinel ਨਿਰਧਾਰਤ ਨਿਯਮ ਕੋਰ",
    "ta-IN": "Sentinel நிர்ணய விதி மையம்",
  },
  "Local engine benchmark": {
    "en-IN": "Local engine benchmark",
    "hi-IN": "स्थानीय इंजन बेंचमार्क",
    "pa-IN": "ਲੋਕਲ ਇੰਜਣ ਬੈਂਚਮਾਰਕ",
    "ta-IN": "உள்ளூர் இயந்திர அளவீடு",
  },
  "Casualty Resuscitation Bays (1 to 4) Management": {
    "en-IN": "Casualty Resuscitation Bays (1 to 4) Management",
    "hi-IN": "आपातकालीन पुनर्जीवन बे (1 से 4) प्रबंधन",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ਪੁਨਰਜੀਵਨ ਬੇ (1 ਤੋਂ 4) ਪ੍ਰਬੰਧਨ",
    "ta-IN": "அவசர உயிர்ப்பிப்பு பகுதிகள் (1 முதல் 4) நிர்வாகம்",
  },
  "Critical Vital Telemetry Matrix": {
    "en-IN": "Critical Vital Telemetry Matrix",
    "hi-IN": "महत्वपूर्ण जीवन संकेत टेलीमेट्री मैट्रिक्स",
    "pa-IN": "ਮਹੱਤਵਪੂਰਨ ਜੀਵਨ ਸੰਕੇਤ ਟੈਲੀਮੈਟਰੀ ਮੈਟ੍ਰਿਕਸ",
    "ta-IN": "முக்கிய உயிர் அறிகுறி தொலைஅளவீட்டு அட்டவணை",
  },
  Pulse: {
    "en-IN": "Pulse",
    "hi-IN": "नाड़ी",
    "pa-IN": "ਨਬਜ਼",
    "ta-IN": "நாடித்துடிப்பு",
  },
  "SpO2 Oxygen": {
    "en-IN": "SpO2 Oxygen",
    "hi-IN": "SpO2 ऑक्सीजन",
    "pa-IN": "SpO2 ਆਕਸੀਜਨ",
    "ta-IN": "SpO2 ஆக்சிஜன்",
  },
  "CODE BLUE / CRASH CART DEPLOYED": {
    "en-IN": "CODE BLUE / CRASH CART DEPLOYED",
    "hi-IN": "कोड ब्लू / क्रैश कार्ट भेजी गई",
    "pa-IN": "ਕੋਡ ਬਲੂ / ਕ੍ਰੈਸ਼ ਕਾਰਟ ਭੇਜੀ ਗਈ",
    "ta-IN": "கோட் ப்ளூ / அவசர சிகிச்சை வண்டி அனுப்பப்பட்டது",
  },

  // Doctor workspace feature labels; patient notes, measurements, diagnoses and generated content are omitted.
  "Your consultation workspace": {
    "en-IN": "Your consultation workspace",
    "hi-IN": "आपका परामर्श कार्यक्षेत्र",
    "pa-IN": "ਤੁਹਾਡਾ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਕਾਰਜ-ਖੇਤਰ",
    "ta-IN": "உங்கள் ஆலோசனை பணியிடம்",
  },
  "AI Decision Support Active": {
    "en-IN": "AI Decision Support Active",
    "hi-IN": "AI निर्णय सहायता सक्रिय",
    "pa-IN": "AI ਫੈਸਲਾ ਸਹਾਇਤਾ ਸਰਗਰਮ",
    "ta-IN": "AI முடிவு ஆதரவு செயல்பாட்டில்",
  },
  "Live Audio Stream": {
    "en-IN": "Live Audio Stream",
    "hi-IN": "लाइव ऑडियो स्ट्रीम",
    "pa-IN": "ਲਾਈਵ ਆਡੀਓ ਸਟ੍ਰੀਮ",
    "ta-IN": "நேரடி ஒலி ஓட்டம்",
  },
  "Intelligent AI SOAP Notes & Clinical Intake": {
    "en-IN": "Intelligent AI SOAP Notes & Clinical Intake",
    "hi-IN": "स्मार्ट AI SOAP नोट्स और क्लिनिकल जानकारी",
    "pa-IN": "ਸਮਾਰਟ AI SOAP ਨੋਟਸ ਅਤੇ ਕਲੀਨਿਕਲ ਜਾਣਕਾਰੀ",
    "ta-IN": "நுண்ணறிவு AI SOAP குறிப்புகள் மற்றும் மருத்துவப் பதிவு",
  },
  "Instant Mobile Handshake": {
    "en-IN": "Instant Mobile Handshake",
    "hi-IN": "तत्काल मोबाइल हैंडशेक",
    "pa-IN": "ਤੁਰੰਤ ਮੋਬਾਈਲ ਹੈਂਡਸ਼ੇਕ",
    "ta-IN": "உடனடி மொபைல் இணைப்பு",
  },
  "Companion Deep Link URL": {
    "en-IN": "Companion Deep Link URL",
    "hi-IN": "साथी ऐप डीप लिंक URL",
    "pa-IN": "ਸਾਥੀ ਐਪ ਡੀਪ ਲਿੰਕ URL",
    "ta-IN": "துணை செயலி ஆழ் இணைப்பு URL",
  },
  "Zero-Cloud Leak · Encrypted Handshake": {
    "en-IN": "Zero-Cloud Leak · Encrypted Handshake",
    "hi-IN": "क्लाउड पर कोई डेटा लीक नहीं · एन्क्रिप्टेड हैंडशेक",
    "pa-IN": "ਕਲਾਉਡ ਵਿੱਚ ਕੋਈ ਡਾਟਾ ਲੀਕ ਨਹੀਂ · ਇਨਕ੍ਰਿਪਟਡ ਹੈਂਡਸ਼ੇਕ",
    "ta-IN": "கிளவுடில் தரவு கசிவு இல்லை · மறையாக்கப்பட்ட இணைப்பு",
  },
  "Download PDF": {
    "en-IN": "Download PDF",
    "hi-IN": "PDF डाउनलोड करें",
    "pa-IN": "PDF ਡਾਊਨਲੋਡ ਕਰੋ",
    "ta-IN": "PDF-ஐப் பதிவிறக்கவும்",
  },
  "Print Invoice": {
    "en-IN": "Print Invoice",
    "hi-IN": "चालान प्रिंट करें",
    "pa-IN": "ਚਲਾਨ ਪ੍ਰਿੰਟ ਕਰੋ",
    "ta-IN": "விலைப்பட்டியலை அச்சிடவும்",
  },

  // Remaining global shell and dashboard controls found in the final route scan.
  "Show guide": {
    "en-IN": "Show guide",
    "hi-IN": "गाइड दिखाएँ",
    "pa-IN": "ਗਾਈਡ ਦਿਖਾਓ",
    "ta-IN": "வழிகாட்டியைக் காட்டு",
  },
  "Close guide": {
    "en-IN": "Close guide",
    "hi-IN": "गाइड बंद करें",
    "pa-IN": "ਗਾਈਡ ਬੰਦ ਕਰੋ",
    "ta-IN": "வழிகாட்டியை மூடு",
  },
  "Workspace introduction": {
    "en-IN": "Workspace introduction",
    "hi-IN": "कार्यक्षेत्र परिचय",
    "pa-IN": "ਕਾਰਜ-ਖੇਤਰ ਜਾਣ-ਪਛਾਣ",
    "ta-IN": "பணியிட அறிமுகம்",
  },
  "Exit to Portals": {
    "en-IN": "Exit to Portals",
    "hi-IN": "पोर्टल पर जाएँ",
    "pa-IN": "ਪੋਰਟਲਾਂ ਉੱਤੇ ਜਾਓ",
    "ta-IN": "போர்டல்களுக்குச் செல்லவும்",
  },
  "Return to Portal Selection (Choose a different dashboard)": {
    "en-IN": "Return to Portal Selection (Choose a different dashboard)",
    "hi-IN": "पोर्टल चयन पर लौटें (दूसरा डैशबोर्ड चुनें)",
    "pa-IN": "ਪੋਰਟਲ ਚੋਣ ਉੱਤੇ ਵਾਪਸ ਜਾਓ (ਹੋਰ ਡੈਸ਼ਬੋਰਡ ਚੁਣੋ)",
    "ta-IN": "போர்டல் தேர்வுக்குத் திரும்பவும் (வேறு டாஷ்போர்டைத் தேர்ந்தெடுக்கவும்)",
  },
  Contrast: {
    "en-IN": "Contrast",
    "hi-IN": "कंट्रास्ट",
    "pa-IN": "ਕੰਟ੍ਰਾਸਟ",
    "ta-IN": "மாறுபாடு",
  },
  "How to set up your phone (3 mins)": {
    "en-IN": "How to set up your phone (3 mins)",
    "hi-IN": "अपना फ़ोन कैसे सेट करें (3 मिनट)",
    "pa-IN": "ਆਪਣਾ ਫ਼ੋਨ ਕਿਵੇਂ ਸੈੱਟ ਕਰਨਾ ਹੈ (3 ਮਿੰਟ)",
    "ta-IN": "உங்கள் தொலைபேசியை அமைப்பது எப்படி (3 நிமிடங்கள்)",
  },
  "Master Controls": {
    "en-IN": "Master Controls",
    "hi-IN": "मुख्य नियंत्रण",
    "pa-IN": "ਮੁੱਖ ਨਿਯੰਤਰਣ",
    "ta-IN": "முதன்மைக் கட்டுப்பாடுகள்",
  },
  Regenerate: {
    "en-IN": "Regenerate",
    "hi-IN": "फिर से बनाएँ",
    "pa-IN": "ਮੁੜ ਬਣਾਓ",
    "ta-IN": "மீண்டும் உருவாக்கவும்",
  },
  Transfer: {
    "en-IN": "Transfer",
    "hi-IN": "स्थानांतरण",
    "pa-IN": "ਤਬਦੀਲੀ",
    "ta-IN": "மாற்றம்",
  },
  Invoices: {
    "en-IN": "Invoices",
    "hi-IN": "चालान",
    "pa-IN": "ਚਲਾਨ",
    "ta-IN": "விலைப்பட்டியல்கள்",
  },
  "Past 7 Days": {
    "en-IN": "Past 7 Days",
    "hi-IN": "पिछले 7 दिन",
    "pa-IN": "ਪਿਛਲੇ 7 ਦਿਨ",
    "ta-IN": "கடந்த 7 நாட்கள்",
  },
  "Past 30 Days": {
    "en-IN": "Past 30 Days",
    "hi-IN": "पिछले 30 दिन",
    "pa-IN": "ਪਿਛਲੇ 30 ਦਿਨ",
    "ta-IN": "கடந்த 30 நாட்கள்",
  },
  "IPD Advance": {
    "en-IN": "IPD Advance",
    "hi-IN": "IPD अग्रिम",
    "pa-IN": "IPD ਪੇਸ਼ਗੀ",
    "ta-IN": "உள்நோயாளர் முன்பணம்",
  },
  "IPD Settlement": {
    "en-IN": "IPD Settlement",
    "hi-IN": "IPD निपटान",
    "pa-IN": "IPD ਨਿਪਟਾਰਾ",
    "ta-IN": "உள்நோயாளர் கணக்குத் தீர்வு",
  },
  "General Procedures": {
    "en-IN": "General Procedures",
    "hi-IN": "सामान्य प्रक्रियाएँ",
    "pa-IN": "ਆਮ ਪ੍ਰਕਿਰਿਆਵਾਂ",
    "ta-IN": "பொது நடைமுறைகள்",
  },
};
