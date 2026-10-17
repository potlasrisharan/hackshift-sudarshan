import { websiteBillingCopy } from "./website-billing";
import { websiteClinicalCopy } from "./website-clinical";
import { websiteClinicianCopy } from "./website-clinician";
import { websiteDashboardCopy } from "./website-dashboard";
import { websiteFinanceCopy } from "./website-finance";
import { websiteMarketingCopy } from "./website-marketing";
import { websitePublicCopy } from "./website-public";
import { websiteRoutedCopy } from "./website-routed";
import { websiteRoutesExtraCopy } from "./website-routes-extra";
import { websiteSettingsCopy } from "./website-settings";

/**
 * Shared, reviewed UI copy for the website surfaces.
 * Medical records and patient-entered values are deliberately never translated
 * by this UI layer. Add only fixed interface copy here.
 */
export const websiteLocales = {
  "en-IN": "English",
  "hi-IN": "हिन्दी",
  "pa-IN": "ਪੰਜਾਬੀ",
  "ta-IN": "தமிழ்",
} as const;

export type WebsiteLocale = keyof typeof websiteLocales;

type Copy = Record<WebsiteLocale, string>;

const copy: Record<string, Copy> = {
  "Skip to content": {
    "en-IN": "Skip to content",
    "hi-IN": "मुख्य सामग्री पर जाएँ",
    "pa-IN": "ਮੁੱਖ ਸਮੱਗਰੀ 'ਤੇ ਜਾਓ",
    "ta-IN": "முதன்மை உள்ளடக்கத்திற்குச் செல்லவும்",
  },
  Platform: {
    "en-IN": "Platform",
    "hi-IN": "प्लेटफ़ॉर्म",
    "pa-IN": "ਪਲੇਟਫਾਰਮ",
    "ta-IN": "தளம்",
  },
  "Our approach": {
    "en-IN": "Our approach",
    "hi-IN": "हमारा तरीका",
    "pa-IN": "ਸਾਡਾ ਤਰੀਕਾ",
    "ta-IN": "எங்கள் அணுகுமுறை",
  },
  "Trust & care": {
    "en-IN": "Trust & care",
    "hi-IN": "भरोसा और देखभाल",
    "pa-IN": "ਭਰੋਸਾ ਅਤੇ ਦੇਖਭਾਲ",
    "ta-IN": "நம்பிக்கையும் பராமரிப்பும்",
  },
  "Enter workspace": {
    "en-IN": "Enter workspace",
    "hi-IN": "कार्यक्षेत्र खोलें",
    "pa-IN": "ਵਰਕਸਪੇਸ ਖੋਲ੍ਹੋ",
    "ta-IN": "பணியிடத்தைத் திறக்கவும்",
  },
  "A more connected kind of care": {
    "en-IN": "A more connected kind of care",
    "hi-IN": "देखभाल का अधिक जुड़ा हुआ रूप",
    "pa-IN": "ਹੋਰ ਜੁੜੀ ਹੋਈ ਦੇਖਭਾਲ",
    "ta-IN": "மேலும் இணைந்த பராமரிப்பு",
  },
  "Healthcare,": {
    "en-IN": "Healthcare,",
    "hi-IN": "स्वास्थ्य सेवा,",
    "pa-IN": "ਸਿਹਤ ਸੰਭਾਲ,",
    "ta-IN": "சுகாதாரம்,",
  },
  "One continuous journey from first symptom to recovery. For patients, care teams, and everyone in between.":
    {
      "en-IN":
        "One continuous journey from first symptom to recovery. For patients, care teams, and everyone in between.",
      "hi-IN":
        "पहले लक्षण से स्वस्थ होने तक एक निरंतर यात्रा—मरीज़ों, देखभाल टीमों और सभी के लिए।",
      "pa-IN":
        "ਪਹਿਲੇ ਲੱਛਣ ਤੋਂ ਸਿਹਤਯਾਬੀ ਤੱਕ ਇੱਕ ਲਗਾਤਾਰ ਸਫ਼ਰ—ਮਰੀਜ਼ਾਂ, ਦੇਖਭਾਲ ਟੀਮਾਂ ਅਤੇ ਸਭ ਲਈ।",
      "ta-IN":
        "முதல் அறிகுறியிலிருந்து குணமடையும் வரை தொடரும் பயணம்—நோயாளிகள், பராமரிப்பு குழுக்கள் மற்றும் அனைவருக்கும்.",
    },
  "Explore AyuSetu": {
    "en-IN": "Explore AyuSetu",
    "hi-IN": "आयुसेतु देखें",
    "pa-IN": "ਆਯੁਸੇਤੂ ਵੇਖੋ",
    "ta-IN": "ஆயுசேதுவைப் பாருங்கள்",
  },
  "View platform": {
    "en-IN": "View platform",
    "hi-IN": "प्लेटफ़ॉर्म देखें",
    "pa-IN": "ਪਲੇਟਫਾਰਮ ਵੇਖੋ",
    "ta-IN": "தளத்தைப் பாருங்கள்",
  },
  "Built around people. Guided by clinical oversight.": {
    "en-IN": "Built around people. Guided by clinical oversight.",
    "hi-IN": "लोगों को केंद्र में रखकर बनाया गया। चिकित्सकीय निगरानी के साथ।",
    "pa-IN": "ਲੋਕਾਂ ਨੂੰ ਕੇਂਦਰ ਵਿੱਚ ਰੱਖ ਕੇ ਬਣਾਇਆ। ਡਾਕਟਰੀ ਨਿਗਰਾਨੀ ਨਾਲ।",
    "ta-IN": "மக்களை மையமாகக் கொண்டு உருவாக்கப்பட்டது. மருத்துவ மேற்பார்வையுடன்.",
  },
  "Connected workspaces": {
    "en-IN": "Connected workspaces",
    "hi-IN": "जुड़े हुए कार्यक्षेत्र",
    "pa-IN": "ਜੁੜੇ ਹੋਏ ਵਰਕਸਪੇਸ",
    "ta-IN": "இணைந்த பணியிடங்கள்",
  },
  "Deterministic core engines": {
    "en-IN": "Deterministic core engines",
    "hi-IN": "निश्चित नियमों वाले मुख्य इंजन",
    "pa-IN": "ਨਿਯਮ-ਅਧਾਰਿਤ ਮੁੱਖ ਇੰਜਣ",
    "ta-IN": "நிலையான விதி இயந்திரங்கள்",
  },
  "Intake language options": {
    "en-IN": "Intake language options",
    "hi-IN": "प्रवेश के लिए भाषा विकल्प",
    "pa-IN": "ਦਾਖ਼ਲੇ ਲਈ ਭਾਸ਼ਾ ਚੋਣਾਂ",
    "ta-IN": "உள்ளீட்டு மொழி விருப்பங்கள்",
  },
  "Continuous care journey": {
    "en-IN": "Continuous care journey",
    "hi-IN": "निरंतर देखभाल यात्रा",
    "pa-IN": "ਲਗਾਤਾਰ ਦੇਖਭਾਲ ਦਾ ਸਫ਼ਰ",
    "ta-IN": "தொடர்ச்சியான பராமரிப்பு பயணம்",
  },
  "Care without the gaps": {
    "en-IN": "Care without the gaps",
    "hi-IN": "बिना रुकावट देखभाल",
    "pa-IN": "ਬਿਨਾਂ ਰੁਕਾਵਟ ਦੇਖਭਾਲ",
    "ta-IN": "இடைவெளியற்ற பராமரிப்பு",
  },
  "Your place in the care journey": {
    "en-IN": "Your place in the care journey",
    "hi-IN": "देखभाल यात्रा में आपकी जगह",
    "pa-IN": "ਦੇਖਭਾਲ ਦੇ ਸਫ਼ਰ ਵਿੱਚ ਤੁਹਾਡੀ ਥਾਂ",
    "ta-IN": "பராமரிப்பு பயணத்தில் உங்கள் இடம்",
  },
  "Choose your workspace. Each brings a different part of care into focus.": {
    "en-IN":
      "Choose your workspace. Each brings a different part of care into focus.",
    "hi-IN": "अपना कार्यक्षेत्र चुनें। हर कार्यक्षेत्र देखभाल के एक अलग पहलू पर ध्यान देता है।",
    "pa-IN": "ਆਪਣਾ ਵਰਕਸਪੇਸ ਚੁਣੋ। ਹਰ ਵਰਕਸਪੇਸ ਦੇਖਭਾਲ ਦੇ ਵੱਖਰੇ ਪੱਖ 'ਤੇ ਧਿਆਨ ਦਿੰਦਾ ਹੈ।",
    "ta-IN":
      "உங்கள் பணியிடத்தைத் தேர்ந்தெடுக்கவும். ஒவ்வொன்றும் பராமரிப்பின் ஒரு பகுதியை முன்னிறுத்துகிறது.",
  },
  "Patient intake system": {
    "en-IN": "Patient intake system",
    "hi-IN": "मरीज़ पंजीकरण प्रणाली",
    "pa-IN": "ਮਰੀਜ਼ ਦਾਖ਼ਲਾ ਪ੍ਰਣਾਲੀ",
    "ta-IN": "நோயாளர் பதிவு அமைப்பு",
  },
  "Doctor consultation": {
    "en-IN": "Doctor consultation",
    "hi-IN": "डॉक्टर परामर्श",
    "pa-IN": "ਡਾਕਟਰ ਦੀ ਸਲਾਹ",
    "ta-IN": "மருத்துவர் ஆலோசனை",
  },
  Headquarters: {
    "en-IN": "Headquarters",
    "hi-IN": "मुख्यालय",
    "pa-IN": "ਮੁੱਖ ਦਫ਼ਤਰ",
    "ta-IN": "தலைமையகம்",
  },
  "Emergency triage": {
    "en-IN": "Emergency triage",
    "hi-IN": "आपातकालीन प्राथमिक जाँच",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ਮੁੱਢਲੀ ਜਾਂਚ",
    "ta-IN": "அவசர முன்னுரிமை மதிப்பீடு",
  },
  "Clinic operations": {
    "en-IN": "Clinic operations",
    "hi-IN": "क्लिनिक संचालन",
    "pa-IN": "ਕਲੀਨਿਕ ਪ੍ਰਬੰਧਨ",
    "ta-IN": "மருத்துவமனை செயல்பாடுகள்",
  },
  "Choose language": {
    "en-IN": "Choose language",
    "hi-IN": "भाषा चुनें",
    "pa-IN": "ਭਾਸ਼ਾ ਚੁਣੋ",
    "ta-IN": "மொழியைத் தேர்ந்தெடுக்கவும்",
  },
  Language: {
    "en-IN": "Language",
    "hi-IN": "भाषा",
    "pa-IN": "ਭਾਸ਼ਾ",
    "ta-IN": "மொழி",
  },
  "Sign in": {
    "en-IN": "Sign in",
    "hi-IN": "साइन इन करें",
    "pa-IN": "ਸਾਈਨ ਇਨ ਕਰੋ",
    "ta-IN": "உள்நுழையவும்",
  },
  "Sign out": {
    "en-IN": "Sign out",
    "hi-IN": "साइन आउट करें",
    "pa-IN": "ਸਾਈਨ ਆਉਟ ਕਰੋ",
    "ta-IN": "வெளியேறவும்",
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
  "Welcome to your care workspace": {
    "en-IN": "Welcome to your care workspace",
    "hi-IN": "आपके देखभाल कार्यक्षेत्र में स्वागत है",
    "pa-IN": "ਤੁਹਾਡੇ ਦੇਖਭਾਲ ਵਰਕਸਪੇਸ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
    "ta-IN": "உங்கள் பராமரிப்பு பணியிடத்திற்கு வரவேற்கிறோம்",
  },
  "Sign in with your clinic account to continue.": {
    "en-IN": "Sign in with your clinic account to continue.",
    "hi-IN": "जारी रखने के लिए अपने क्लिनिक खाते से साइन इन करें।",
    "pa-IN": "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੇ ਕਲੀਨਿਕ ਖਾਤੇ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ।",
    "ta-IN": "தொடர உங்கள் மருத்துவமனை கணக்கில் உள்நுழையவும்.",
  },
  Dashboard: {
    "en-IN": "Dashboard",
    "hi-IN": "डैशबोर्ड",
    "pa-IN": "ਡੈਸ਼ਬੋਰਡ",
    "ta-IN": "டாஷ்போர்டு",
  },
  "HQ Command Center": {
    "en-IN": "HQ Command Center",
    "hi-IN": "मुख्यालय नियंत्रण केंद्र",
    "pa-IN": "ਮੁੱਖ ਦਫ਼ਤਰ ਕੰਟਰੋਲ ਕੇਂਦਰ",
    "ta-IN": "தலைமையக கட்டுப்பாட்டு மையம்",
  },
  "Hospitals Registry": {
    "en-IN": "Hospitals Registry",
    "hi-IN": "अस्पताल सूची",
    "pa-IN": "ਹਸਪਤਾਲ ਰਜਿਸਟਰੀ",
    "ta-IN": "மருத்துவமனைப் பட்டியல்",
  },
  "Audit Logs": {
    "en-IN": "Audit Logs",
    "hi-IN": "ऑडिट लॉग",
    "pa-IN": "ਆਡਿਟ ਲੌਗ",
    "ta-IN": "தணிக்கைப் பதிவுகள்",
  },
  "Finance Suite": {
    "en-IN": "Finance Suite",
    "hi-IN": "वित्त प्रबंधन",
    "pa-IN": "ਵਿੱਤੀ ਪ੍ਰਬੰਧਨ",
    "ta-IN": "நிதித் தொகுப்பு",
  },
  "Central Procurement": {
    "en-IN": "Central Procurement",
    "hi-IN": "केंद्रीय खरीद",
    "pa-IN": "ਕੇਂਦਰੀ ਖ਼ਰੀਦ",
    "ta-IN": "மைய கொள்முதல்",
  },
  "Group Expenses": {
    "en-IN": "Group Expenses",
    "hi-IN": "समूह खर्च",
    "pa-IN": "ਸਮੂਹ ਖ਼ਰਚੇ",
    "ta-IN": "குழுச் செலவுகள்",
  },
  "Equipments Listing": {
    "en-IN": "Equipments Listing",
    "hi-IN": "उपकरण सूची",
    "pa-IN": "ਸਾਜ਼ੋ-ਸਾਮਾਨ ਦੀ ਸੂਚੀ",
    "ta-IN": "உபகரணப் பட்டியல்",
  },
  "Subscription & Billing": {
    "en-IN": "Subscription & Billing",
    "hi-IN": "सदस्यता और बिलिंग",
    "pa-IN": "ਗਾਹਕੀ ਅਤੇ ਬਿਲਿੰਗ",
    "ta-IN": "சந்தா மற்றும் கட்டணம்",
  },
  "Clinic Operations Hub": {
    "en-IN": "Clinic Operations Hub",
    "hi-IN": "क्लिनिक संचालन केंद्र",
    "pa-IN": "ਕਲੀਨਿਕ ਪ੍ਰਬੰਧਨ ਕੇਂਦਰ",
    "ta-IN": "மருத்துவமனை செயல்பாட்டு மையம்",
  },
  "Patient Intake (Kiosk)": {
    "en-IN": "Patient Intake (Kiosk)",
    "hi-IN": "मरीज़ पंजीकरण (कियोस्क)",
    "pa-IN": "ਮਰੀਜ਼ ਦਾਖ਼ਲਾ (ਕਿਓਸਕ)",
    "ta-IN": "நோயாளர் பதிவு (கியோஸ்க்)",
  },
  "Billing & POS": {
    "en-IN": "Billing & POS",
    "hi-IN": "बिलिंग और POS",
    "pa-IN": "ਬਿਲਿੰਗ ਅਤੇ POS",
    "ta-IN": "கட்டணம் மற்றும் POS",
  },
  "Inventory Control": {
    "en-IN": "Inventory Control",
    "hi-IN": "भंडार नियंत्रण",
    "pa-IN": "ਸਟਾਕ ਨਿਯੰਤਰਣ",
    "ta-IN": "சரக்கு கட்டுப்பாடு",
  },
  "Staff Management": {
    "en-IN": "Staff Management",
    "hi-IN": "कर्मचारी प्रबंधन",
    "pa-IN": "ਸਟਾਫ਼ ਪ੍ਰਬੰਧਨ",
    "ta-IN": "பணியாளர் மேலாண்மை",
  },
  Attendance: {
    "en-IN": "Attendance",
    "hi-IN": "उपस्थिति",
    "pa-IN": "ਹਾਜ਼ਰੀ",
    "ta-IN": "வருகைப் பதிவு",
  },
  "Shift Management": {
    "en-IN": "Shift Management",
    "hi-IN": "शिफ्ट प्रबंधन",
    "pa-IN": "ਸ਼ਿਫ਼ਟ ਪ੍ਰਬੰਧਨ",
    "ta-IN": "பணி நேர மேலாண்மை",
  },
  "IPD Inpatients": {
    "en-IN": "IPD Inpatients",
    "hi-IN": "आईपीडी मरीज़",
    "pa-IN": "IPD ਮਰੀਜ਼",
    "ta-IN": "உள்நோயாளிகள்",
  },
  "Earnings & Ledger": {
    "en-IN": "Earnings & Ledger",
    "hi-IN": "आय और खाता-बही",
    "pa-IN": "ਕਮਾਈ ਅਤੇ ਖਾਤਾ-ਬਹੀ",
    "ta-IN": "வருவாய் மற்றும் பேரேடு",
  },
  Settings: {
    "en-IN": "Settings",
    "hi-IN": "सेटिंग्स",
    "pa-IN": "ਸੈਟਿੰਗਾਂ",
    "ta-IN": "அமைப்புகள்",
  },
  "Collapse navigation": {
    "en-IN": "Collapse navigation",
    "hi-IN": "नेविगेशन छोटा करें",
    "pa-IN": "ਨੈਵੀਗੇਸ਼ਨ ਸਮੇਟੋ",
    "ta-IN": "வழிசெலுத்தலைச் சுருக்கவும்",
  },
  "Expand sidebar": {
    "en-IN": "Expand sidebar",
    "hi-IN": "साइडबार खोलें",
    "pa-IN": "ਸਾਈਡਬਾਰ ਖੋਲ੍ਹੋ",
    "ta-IN": "பக்கப்பட்டியை விரிக்கவும்",
  },
  "Clinic Paused": {
    "en-IN": "Clinic Paused",
    "hi-IN": "क्लिनिक रुका हुआ है",
    "pa-IN": "ਕਲੀਨਿਕ ਰੁਕਿਆ ਹੋਇਆ ਹੈ",
    "ta-IN": "மருத்துவமனை இடைநிறுத்தப்பட்டுள்ளது",
  },
  "Sign Out": {
    "en-IN": "Sign Out",
    "hi-IN": "साइन आउट करें",
    "pa-IN": "ਸਾਈਨ ਆਉਟ ਕਰੋ",
    "ta-IN": "வெளியேறவும்",
  },
  Save: { "en-IN": "Save", "hi-IN": "सहेजें", "pa-IN": "ਸੰਭਾਲੋ", "ta-IN": "சேமி" },
  Cancel: {
    "en-IN": "Cancel",
    "hi-IN": "रद्द करें",
    "pa-IN": "ਰੱਦ ਕਰੋ",
    "ta-IN": "ரத்துசெய்",
  },
  Delete: {
    "en-IN": "Delete",
    "hi-IN": "हटाएँ",
    "pa-IN": "ਮਿਟਾਓ",
    "ta-IN": "நீக்கு",
  },
  Edit: { "en-IN": "Edit", "hi-IN": "बदलें", "pa-IN": "ਸੋਧੋ", "ta-IN": "திருத்து" },
  Search: { "en-IN": "Search", "hi-IN": "खोजें", "pa-IN": "ਖੋਜੋ", "ta-IN": "தேடு" },
  "Loading…": {
    "en-IN": "Loading…",
    "hi-IN": "लोड हो रहा है…",
    "pa-IN": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…",
    "ta-IN": "ஏற்றப்படுகிறது…",
  },
  "Try again": {
    "en-IN": "Try again",
    "hi-IN": "फिर से कोशिश करें",
    "pa-IN": "ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    "ta-IN": "மீண்டும் முயற்சிக்கவும்",
  },
  "No data available": {
    "en-IN": "No data available",
    "hi-IN": "कोई डेटा उपलब्ध नहीं है",
    "pa-IN": "ਕੋਈ ਡਾਟਾ ਉਪਲਬਧ ਨਹੀਂ",
    "ta-IN": "தரவு எதுவும் இல்லை",
  },
  Notifications: {
    "en-IN": "Notifications",
    "hi-IN": "सूचनाएँ",
    "pa-IN": "ਸੂਚਨਾਵਾਂ",
    "ta-IN": "அறிவிப்புகள்",
  },
  "Enable Desktop Alerts": {
    "en-IN": "Enable Desktop Alerts",
    "hi-IN": "डेस्कटॉप अलर्ट चालू करें",
    "pa-IN": "ਡੈਸਕਟਾਪ ਅਲਰਟ ਚਾਲੂ ਕਰੋ",
    "ta-IN": "டெஸ்க்டாப் எச்சரிக்கைகளை இயக்கு",
  },
  "New to this workspace?": {
    "en-IN": "New to this workspace?",
    "hi-IN": "इस कार्यक्षेत्र में नए हैं?",
    "pa-IN": "ਇਸ ਵਰਕਸਪੇਸ ਵਿੱਚ ਨਵੇਂ ਹੋ?",
    "ta-IN": "இந்தப் பணியிடத்திற்கு புதியவரா?",
  },
  "Take a short guide without leaving this page.": {
    "en-IN": "Take a short guide without leaving this page.",
    "hi-IN": "इस पेज को छोड़े बिना छोटा परिचय देखें।",
    "pa-IN": "ਇਸ ਪੰਨੇ ਤੋਂ ਬਾਹਰ ਜਾਏ ਬਿਨਾਂ ਛੋਟੀ ਜਾਣ-ਪਛਾਣ ਵੇਖੋ।",
    "ta-IN": "இந்தப் பக்கத்தை விட்டு வெளியேறாமல் குறுகிய வழிகாட்டியைப் பாருங்கள்.",
  },
  "Show me around": {
    "en-IN": "Show me around",
    "hi-IN": "मुझे परिचय दें",
    "pa-IN": "ਮੈਨੂੰ ਜਾਣ-ਪਛਾਣ ਕਰਵਾਓ",
    "ta-IN": "சுற்றிக் காட்டுங்கள்",
  },
  "Not now": {
    "en-IN": "Not now",
    "hi-IN": "अभी नहीं",
    "pa-IN": "ਹੁਣ ਨਹੀਂ",
    "ta-IN": "இப்போது வேண்டாம்",
  },
  "Workspace Recovery": {
    "en-IN": "Workspace Recovery",
    "hi-IN": "कार्यक्षेत्र पुनर्प्राप्ति",
    "pa-IN": "ਵਰਕਸਪੇਸ ਮੁੜ ਪ੍ਰਾਪਤੀ",
    "ta-IN": "பணியிட மீட்பு",
  },
  "Reload Workspace": {
    "en-IN": "Reload Workspace",
    "hi-IN": "कार्यक्षेत्र फिर से लोड करें",
    "pa-IN": "ਵਰਕਸਪੇਸ ਮੁੜ ਲੋਡ ਕਰੋ",
    "ta-IN": "பணியிடத்தை மீண்டும் ஏற்றவும்",
  },
  "Active workspace": {
    "en-IN": "Active workspace",
    "hi-IN": "सक्रिय कार्यक्षेत्र",
    "pa-IN": "ਸਰਗਰਮ ਵਰਕਸਪੇਸ",
    "ta-IN": "செயலில் உள்ள பணியிடம்",
  },
  Workspace: {
    "en-IN": "Workspace",
    "hi-IN": "कार्यक्षेत्र",
    "pa-IN": "ਵਰਕਸਪੇਸ",
    "ta-IN": "பணியிடம்",
  },
  "Patient intake": {
    "en-IN": "Patient intake",
    "hi-IN": "मरीज़ पंजीकरण",
    "pa-IN": "ਮਰੀਜ਼ ਦਾਖ਼ਲਾ",
    "ta-IN": "நோயாளர் பதிவு",
  },
  "Clinical care": {
    "en-IN": "Clinical care",
    "hi-IN": "चिकित्सकीय देखभाल",
    "pa-IN": "ਡਾਕਟਰੀ ਦੇਖਭਾਲ",
    "ta-IN": "மருத்துவ பராமரிப்பு",
  },
  "Local workspace": {
    "en-IN": "Local workspace",
    "hi-IN": "स्थानीय कार्यक्षेत्र",
    "pa-IN": "ਸਥਾਨਕ ਵਰਕਸਪੇਸ",
    "ta-IN": "உள்ளூர் பணியிடம்",
  },
  "Offline · changes cannot sync": {
    "en-IN": "Offline · changes cannot sync",
    "hi-IN": "ऑफ़लाइन · बदलाव सिंक नहीं हो सकते",
    "pa-IN": "ਔਫ਼ਲਾਈਨ · ਤਬਦੀਲੀਆਂ ਸਿੰਕ ਨਹੀਂ ਹੋ ਸਕਦੀਆਂ",
    "ta-IN": "ஆஃப்லைன் · மாற்றங்களை ஒத்திசைக்க முடியாது",
  },
  "You are offline. Server actions will show errors; no fabricated records are substituted.":
    {
      "en-IN":
        "You are offline. Server actions will show errors; no fabricated records are substituted.",
      "hi-IN":
        "आप ऑफ़लाइन हैं। सर्वर कार्रवाइयों में त्रुटि दिखेगी; नकली रिकॉर्ड नहीं दिखाए जाएँगे।",
      "pa-IN":
        "ਤੁਸੀਂ ਔਫ਼ਲਾਈਨ ਹੋ। ਸਰਵਰ ਕਾਰਵਾਈਆਂ ਵਿੱਚ ਗਲਤੀ ਆਵੇਗੀ; ਜਾਅਲੀ ਰਿਕਾਰਡ ਨਹੀਂ ਦਿਖਾਏ ਜਾਣਗੇ।",
      "ta-IN":
        "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள். சேவையகச் செயல்களில் பிழை வரும்; போலிப் பதிவுகள் காட்டப்படாது.",
    },
  "Clinical access restricted": {
    "en-IN": "Clinical access restricted",
    "hi-IN": "चिकित्सकीय पहुँच प्रतिबंधित",
    "pa-IN": "ਡਾਕਟਰੀ ਪਹੁੰਚ ਸੀਮਿਤ ਹੈ",
    "ta-IN": "மருத்துவ அணுகல் கட்டுப்படுத்தப்பட்டுள்ளது",
  },
  "Your cashier role cannot read clinical encounters. Pharmacy integration is planned.":
    {
      "en-IN":
        "Your cashier role cannot read clinical encounters. Pharmacy integration is planned.",
      "hi-IN":
        "कैशियर भूमिका में चिकित्सकीय मुलाक़ातें नहीं देखी जा सकतीं। फ़ार्मेसी एकीकरण की योजना है।",
      "pa-IN":
        "ਕੈਸ਼ੀਅਰ ਭੂਮਿਕਾ ਵਿੱਚ ਡਾਕਟਰੀ ਮੁਲਾਕਾਤਾਂ ਨਹੀਂ ਵੇਖੀਆਂ ਜਾ ਸਕਦੀਆਂ। ਫਾਰਮੇਸੀ ਏਕੀਕਰਨ ਦੀ ਯੋਜਨਾ ਹੈ।",
      "ta-IN":
        "காசாளர் பொறுப்பில் மருத்துவச் சந்திப்புகளைப் பார்க்க முடியாது. மருந்தக இணைப்பு திட்டமிடப்பட்டுள்ளது.",
    },
  "Clinician queue": {
    "en-IN": "Clinician queue",
    "hi-IN": "चिकित्सक कतार",
    "pa-IN": "ਡਾਕਟਰ ਕਤਾਰ",
    "ta-IN": "மருத்துவர் வரிசை",
  },
  "Patient intake (Kiosk)": {
    "en-IN": "Patient intake (Kiosk)",
    "hi-IN": "मरीज़ पंजीकरण (कियोस्क)",
    "pa-IN": "ਮਰੀਜ਼ ਦਾਖ਼ਲਾ (ਕਿਓਸਕ)",
    "ta-IN": "நோயாளர் பதிவு (கியோஸ்க்)",
  },
  "Care that stays connected": {
    "en-IN": "Care that stays connected",
    "hi-IN": "जुड़ी रहने वाली देखभाल",
    "pa-IN": "ਜੁੜੀ ਰਹਿਣ ਵਾਲੀ ਦੇਖਭਾਲ",
    "ta-IN": "தொடர்ந்து இணைந்த பராமரிப்பு",
  },
  "From the first hello to a healthier tomorrow.": {
    "en-IN": "From the first hello to a healthier tomorrow.",
    "hi-IN": "पहली बातचीत से स्वस्थ कल तक।",
    "pa-IN": "ਪਹਿਲੀ ਗੱਲਬਾਤ ਤੋਂ ਸਿਹਤਮੰਦ ਭਵਿੱਖ ਤੱਕ।",
    "ta-IN": "முதல் உரையாடலிலிருந்து ஆரோக்கியமான நாளை வரை.",
  },
  "From the first conversation to the clinician's desk. A shared workspace for care teams and the people they care for.":
    {
      "en-IN":
        "From the first conversation to the clinician's desk. A shared workspace for care teams and the people they care for.",
      "hi-IN":
        "पहली बातचीत से चिकित्सक तक। देखभाल टीमों और उनकी सेवा पाने वाले लोगों के लिए साझा कार्यक्षेत्र।",
      "pa-IN":
        "ਪਹਿਲੀ ਗੱਲਬਾਤ ਤੋਂ ਡਾਕਟਰ ਤੱਕ। ਦੇਖਭਾਲ ਟੀਮਾਂ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੇਵਾ ਲੈਣ ਵਾਲੇ ਲੋਕਾਂ ਲਈ ਸਾਂਝਾ ਵਰਕਸਪੇਸ।",
      "ta-IN":
        "முதல் உரையாடலிலிருந்து மருத்துவரிடம் வரை. பராமரிப்பு குழுக்களுக்கும் அவர்கள் கவனிக்கும் மக்களுக்கும் பகிரப்பட்ட பணியிடம்.",
    },
  "Explore AyuSetu and all workspaces": {
    "en-IN": "Explore AyuSetu and all workspaces",
    "hi-IN": "आयुसेतु और सभी कार्यक्षेत्र देखें",
    "pa-IN": "ਆਯੁਸੇਤੂ ਅਤੇ ਸਾਰੇ ਵਰਕਸਪੇਸ ਵੇਖੋ",
    "ta-IN": "ஆயுசேதுவையும் அனைத்து பணியிடங்களையும் பாருங்கள்",
  },
  "CARE THAT STAYS CONNECTED": {
    "en-IN": "CARE THAT STAYS CONNECTED",
    "hi-IN": "जुड़ी रहने वाली देखभाल",
    "pa-IN": "ਜੁੜੀ ਰਹਿਣ ਵਾਲੀ ਦੇਖਭਾਲ",
    "ta-IN": "தொடர்ந்து இணைந்த பராமரிப்பு",
  },
  "AYUSETU WORKSPACE": {
    "en-IN": "AYUSETU WORKSPACE",
    "hi-IN": "आयुसेतु कार्यक्षेत्र",
    "pa-IN": "ਆਯੁਸੇਤੂ ਵਰਕਸਪੇਸ",
    "ta-IN": "ஆயுசேது பணியிடம்",
  },
  "Your words. Your language.": {
    "en-IN": "Your words. Your language.",
    "hi-IN": "आपकी बात। आपकी भाषा।",
    "pa-IN": "ਤੁਹਾਡੇ ਸ਼ਬਦ। ਤੁਹਾਡੀ ਭਾਸ਼ਾ।",
    "ta-IN": "உங்கள் சொற்கள். உங்கள் மொழி.",
  },
  "Preferred language": {
    "en-IN": "Preferred language",
    "hi-IN": "पसंदीदा भाषा",
    "pa-IN": "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ",
    "ta-IN": "விருப்ப மொழி",
  },
  "Choose your workspace": {
    "en-IN": "Choose your workspace",
    "hi-IN": "अपना कार्यक्षेत्र चुनें",
    "pa-IN": "ਆਪਣਾ ਵਰਕਸਪੇਸ ਚੁਣੋ",
    "ta-IN": "உங்கள் பணியிடத்தைத் தேர்ந்தெடுக்கவும்",
  },
  "Create account": {
    "en-IN": "Create account",
    "hi-IN": "खाता बनाएँ",
    "pa-IN": "ਖਾਤਾ ਬਣਾਓ",
    "ta-IN": "கணக்கை உருவாக்கவும்",
  },
  "Forgot password?": {
    "en-IN": "Forgot password?",
    "hi-IN": "पासवर्ड भूल गए?",
    "pa-IN": "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    "ta-IN": "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
  },
  Continue: {
    "en-IN": "Continue",
    "hi-IN": "जारी रखें",
    "pa-IN": "ਜਾਰੀ ਰੱਖੋ",
    "ta-IN": "தொடரவும்",
  },
  Back: { "en-IN": "Back", "hi-IN": "वापस", "pa-IN": "ਪਿੱਛੇ", "ta-IN": "பின்னால்" },
  Close: {
    "en-IN": "Close",
    "hi-IN": "बंद करें",
    "pa-IN": "ਬੰਦ ਕਰੋ",
    "ta-IN": "மூடு",
  },
  Download: {
    "en-IN": "Download",
    "hi-IN": "डाउनलोड करें",
    "pa-IN": "ਡਾਊਨਲੋਡ ਕਰੋ",
    "ta-IN": "பதிவிறக்கு",
  },
  Export: {
    "en-IN": "Export",
    "hi-IN": "निर्यात करें",
    "pa-IN": "ਐਕਸਪੋਰਟ ਕਰੋ",
    "ta-IN": "ஏற்றுமதி செய்",
  },
  Refresh: {
    "en-IN": "Refresh",
    "hi-IN": "रीफ़्रेश करें",
    "pa-IN": "ਤਾਜ਼ਾ ਕਰੋ",
    "ta-IN": "புதுப்பி",
  },
  "View details": {
    "en-IN": "View details",
    "hi-IN": "विवरण देखें",
    "pa-IN": "ਵੇਰਵੇ ਵੇਖੋ",
    "ta-IN": "விவரங்களைப் பாருங்கள்",
  },
  "View all": {
    "en-IN": "View all",
    "hi-IN": "सभी देखें",
    "pa-IN": "ਸਭ ਵੇਖੋ",
    "ta-IN": "அனைத்தையும் பாருங்கள்",
  },
  "See more": {
    "en-IN": "See more",
    "hi-IN": "और देखें",
    "pa-IN": "ਹੋਰ ਵੇਖੋ",
    "ta-IN": "மேலும் பார்க்கவும்",
  },
  All: { "en-IN": "All", "hi-IN": "सभी", "pa-IN": "ਸਾਰੇ", "ta-IN": "அனைத்தும்" },
  Today: { "en-IN": "Today", "hi-IN": "आज", "pa-IN": "ਅੱਜ", "ta-IN": "இன்று" },
  Yesterday: {
    "en-IN": "Yesterday",
    "hi-IN": "कल",
    "pa-IN": "ਕੱਲ੍ਹ",
    "ta-IN": "நேற்று",
  },
  "This week": {
    "en-IN": "This week",
    "hi-IN": "इस सप्ताह",
    "pa-IN": "ਇਸ ਹਫ਼ਤੇ",
    "ta-IN": "இந்த வாரம்",
  },
  "This month": {
    "en-IN": "This month",
    "hi-IN": "इस महीने",
    "pa-IN": "ਇਸ ਮਹੀਨੇ",
    "ta-IN": "இந்த மாதம்",
  },
  Total: { "en-IN": "Total", "hi-IN": "कुल", "pa-IN": "ਕੁੱਲ", "ta-IN": "மொத்தம்" },
  Status: {
    "en-IN": "Status",
    "hi-IN": "स्थिति",
    "pa-IN": "ਸਥਿਤੀ",
    "ta-IN": "நிலை",
  },
  Name: { "en-IN": "Name", "hi-IN": "नाम", "pa-IN": "ਨਾਮ", "ta-IN": "பெயர்" },
  Date: {
    "en-IN": "Date",
    "hi-IN": "तारीख़",
    "pa-IN": "ਤਾਰੀਖ਼",
    "ta-IN": "தேதி",
  },
  Amount: {
    "en-IN": "Amount",
    "hi-IN": "राशि",
    "pa-IN": "ਰਕਮ",
    "ta-IN": "தொகை",
  },
  Notes: {
    "en-IN": "Notes",
    "hi-IN": "टिप्पणियाँ",
    "pa-IN": "ਨੋਟਸ",
    "ta-IN": "குறிப்புகள்",
  },
  Confirm: {
    "en-IN": "Confirm",
    "hi-IN": "पुष्टि करें",
    "pa-IN": "ਪੁਸ਼ਟੀ ਕਰੋ",
    "ta-IN": "உறுதிப்படுத்து",
  },
  Submit: {
    "en-IN": "Submit",
    "hi-IN": "जमा करें",
    "pa-IN": "ਜਮ੍ਹਾਂ ਕਰੋ",
    "ta-IN": "சமர்ப்பி",
  },
  Required: {
    "en-IN": "Required",
    "hi-IN": "ज़रूरी",
    "pa-IN": "ਲਾਜ਼ਮੀ",
    "ta-IN": "தேவை",
  },
  Optional: {
    "en-IN": "Optional",
    "hi-IN": "वैकल्पिक",
    "pa-IN": "ਵਿਕਲਪਿਕ",
    "ta-IN": "விருப்பத்தேர்வு",
  },
  "finally connected.": {
    "en-IN": "finally connected.",
    "hi-IN": "आख़िरकार जुड़ा हुआ।",
    "pa-IN": "ਆਖ਼ਿਰਕਾਰ ਜੁੜਿਆ ਹੋਇਆ।",
    "ta-IN": "இறுதியாக இணைக்கப்பட்டது.",
  },
  "deeply human.": {
    "en-IN": "deeply human.",
    "hi-IN": "पूरी तरह मानवीय।",
    "pa-IN": "ਪੂਰੀ ਤਰ੍ਹਾਂ ਮਨੁੱਖੀ।",
    "ta-IN": "மனிதநேயமிக்கது.",
  },
  "from clinic to home.": {
    "en-IN": "from clinic to home.",
    "hi-IN": "क्लिनिक से घर तक।",
    "pa-IN": "ਕਲੀਨਿਕ ਤੋਂ ਘਰ ਤੱਕ।",
    "ta-IN": "மருத்துவமனையிலிருந்து வீடு வரை.",
  },
  "care without gaps.": {
    "en-IN": "care without gaps.",
    "hi-IN": "बिना रुकावट देखभाल।",
    "pa-IN": "ਬਿਨਾਂ ਰੁਕਾਵਟ ਦੇਖਭਾਲ।",
    "ta-IN": "இடைவெளியற்ற பராமரிப்பு.",
  },
  "A warm welcome": {
    "en-IN": "A warm welcome",
    "hi-IN": "स्नेहभरा स्वागत",
    "pa-IN": "ਨਿੱਘਾ ਸਵਾਗਤ",
    "ta-IN": "அன்பான வரவேற்பு",
  },
  "Start in your language": {
    "en-IN": "Start in your language",
    "hi-IN": "अपनी भाषा में शुरू करें",
    "pa-IN": "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ",
    "ta-IN": "உங்கள் மொழியில் தொடங்குங்கள்",
  },
  "Begin patient intake": {
    "en-IN": "Begin patient intake",
    "hi-IN": "मरीज़ पंजीकरण शुरू करें",
    "pa-IN": "ਮਰੀਜ਼ ਦਾਖ਼ਲਾ ਸ਼ੁਰੂ ਕਰੋ",
    "ta-IN": "நோயாளர் பதிவைத் தொடங்குங்கள்",
  },
  "A welcoming first step. Voice symptom input, ABHA verification and queue tokens.":
    {
      "en-IN":
        "A welcoming first step. Voice symptom input, ABHA verification and queue tokens.",
      "hi-IN":
        "एक स्वागतयोग्य पहला कदम। आवाज़ से लक्षण दर्ज करें, ABHA सत्यापित करें और कतार टोकन पाएँ।",
      "pa-IN":
        "ਇੱਕ ਨਿੱਘਾ ਪਹਿਲਾ ਕਦਮ। ਆਵਾਜ਼ ਰਾਹੀਂ ਲੱਛਣ ਦਿਓ, ABHA ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਕਤਾਰ ਟੋਕਨ ਲਵੋ।",
      "ta-IN":
        "அன்பான முதல் படி. குரல் மூலம் அறிகுறிகளைப் பதிவு செய்து, ABHA சரிபார்த்து, வரிசை எண்ணைப் பெறுங்கள்.",
    },
  "The patient story, ready for your review.": {
    "en-IN": "The patient story, ready for your review.",
    "hi-IN": "मरीज़ की जानकारी आपकी समीक्षा के लिए तैयार है।",
    "pa-IN": "ਮਰੀਜ਼ ਦੀ ਜਾਣਕਾਰੀ ਤੁਹਾਡੀ ਸਮੀਖਿਆ ਲਈ ਤਿਆਰ ਹੈ।",
    "ta-IN": "நோயாளர் விவரம் உங்கள் மதிப்பாய்வுக்குத் தயாராக உள்ளது.",
  },
  "Open clinical workspace": {
    "en-IN": "Open clinical workspace",
    "hi-IN": "चिकित्सकीय कार्यक्षेत्र खोलें",
    "pa-IN": "ਡਾਕਟਰੀ ਵਰਕਸਪੇਸ ਖੋਲ੍ਹੋ",
    "ta-IN": "மருத்துவ பணியிடத்தைத் திறக்கவும்",
  },
  "A connected view of your healthcare network.": {
    "en-IN": "A connected view of your healthcare network.",
    "hi-IN": "आपके स्वास्थ्य सेवा नेटवर्क का एक जुड़ा हुआ दृश्य।",
    "pa-IN": "ਤੁਹਾਡੇ ਸਿਹਤ ਸੰਭਾਲ ਨੈੱਟਵਰਕ ਦਾ ਇੱਕ ਜੁੜਿਆ ਦ੍ਰਿਸ਼।",
    "ta-IN": "உங்கள் சுகாதார வலையமைப்பின் இணைந்த பார்வை.",
  },
  "Explore headquarters": {
    "en-IN": "Explore headquarters",
    "hi-IN": "मुख्यालय देखें",
    "pa-IN": "ਮੁੱਖ ਦਫ਼ਤਰ ਵੇਖੋ",
    "ta-IN": "தலைமையகத்தைப் பாருங்கள்",
  },
  "Clear priorities when every moment matters.": {
    "en-IN": "Clear priorities when every moment matters.",
    "hi-IN": "हर पल अहम हो, तो प्राथमिकताएँ स्पष्ट रखें।",
    "pa-IN": "ਜਦੋਂ ਹਰ ਪਲ ਅਹਿਮ ਹੋਵੇ ਤਾਂ ਤਰਜੀਹਾਂ ਸਪਸ਼ਟ ਰੱਖੋ।",
    "ta-IN": "ஒவ்வொரு நொடியும் முக்கியமானபோது முன்னுரிமைகள் தெளிவாக இருக்கட்டும்.",
  },
  "Open emergency workspace": {
    "en-IN": "Open emergency workspace",
    "hi-IN": "आपातकालीन कार्यक्षेत्र खोलें",
    "pa-IN": "ਐਮਰਜੈਂਸੀ ਵਰਕਸਪੇਸ ਖੋਲ੍ਹੋ",
    "ta-IN": "அவசர பணியிடத்தைத் திறக்கவும்",
  },
  "Keep pharmacy, inventory and daily work in step.": {
    "en-IN": "Keep pharmacy, inventory and daily work in step.",
    "hi-IN": "फ़ार्मेसी, भंडार और रोज़मर्रा के काम को साथ रखें।",
    "pa-IN": "ਫਾਰਮੇਸੀ, ਸਟਾਕ ਅਤੇ ਰੋਜ਼ਾਨਾ ਕੰਮ ਨੂੰ ਤਾਲਮੇਲ ਵਿੱਚ ਰੱਖੋ।",
    "ta-IN": "மருந்தகம், சரக்கு மற்றும் அன்றாடப் பணிகளை ஒருங்கிணைக்கவும்.",
  },
  "Open operations": {
    "en-IN": "Open operations",
    "hi-IN": "संचालन खोलें",
    "pa-IN": "ਕਾਰਜ ਖੋਲ੍ਹੋ",
    "ta-IN": "செயல்பாடுகளைத் திறக்கவும்",
  },
  "An informed consultation": {
    "en-IN": "An informed consultation",
    "hi-IN": "जानकारीपूर्ण परामर्श",
    "pa-IN": "ਜਾਣਕਾਰੀ ਨਾਲ ਸਲਾਹ-ਮਸ਼ਵਰਾ",
    "ta-IN": "தகவலுடன் கூடிய ஆலோசனை",
  },
  "Put the patient story first": {
    "en-IN": "Put the patient story first",
    "hi-IN": "मरीज़ की बात को पहले रखें",
    "pa-IN": "ਮਰੀਜ਼ ਦੀ ਗੱਲ ਨੂੰ ਪਹਿਲ ਦਿਓ",
    "ta-IN": "நோயாளியின் அனுபவத்திற்கு முன்னுரிமை அளிக்கவும்",
  },
  "Treatment, connected": {
    "en-IN": "Treatment, connected",
    "hi-IN": "जुड़ा हुआ उपचार",
    "pa-IN": "ਜੁੜਿਆ ਹੋਇਆ ਇਲਾਜ",
    "ta-IN": "இணைந்த சிகிச்சை",
  },
  "Bring clinical and pharmacy work together": {
    "en-IN": "Bring clinical and pharmacy work together",
    "hi-IN": "चिकित्सकीय और फ़ार्मेसी कार्य को जोड़ें",
    "pa-IN": "ਡਾਕਟਰੀ ਅਤੇ ਫਾਰਮੇਸੀ ਕੰਮ ਨੂੰ ਜੋੜੋ",
    "ta-IN": "மருத்துவ மற்றும் மருந்தகப் பணிகளை இணைக்கவும்",
  },
  "Support beyond the visit": {
    "en-IN": "Support beyond the visit",
    "hi-IN": "मुलाक़ात के बाद भी सहायता",
    "pa-IN": "ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਵੀ ਸਹਾਇਤਾ",
    "ta-IN": "சந்திப்பிற்குப் பின்னரும் ஆதரவு",
  },
  "Keep the next step in sight": {
    "en-IN": "Keep the next step in sight",
    "hi-IN": "अगला कदम स्पष्ट रखें",
    "pa-IN": "ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਰੱਖੋ",
    "ta-IN": "அடுத்த படியைத் தெளிவாக வைத்திருங்கள்",
  },
  "Thoughtfully connected": {
    "en-IN": "Thoughtfully connected",
    "hi-IN": "सोच-समझकर जुड़ा हुआ",
    "pa-IN": "ਸੋਚ-ਸਮਝ ਕੇ ਜੋੜਿਆ",
    "ta-IN": "கவனமாக இணைக்கப்பட்டது",
  },
  "Find your workspace": {
    "en-IN": "Find your workspace",
    "hi-IN": "अपना कार्यक्षेत्र खोजें",
    "pa-IN": "ਆਪਣਾ ਵਰਕਸਪੇਸ ਲੱਭੋ",
    "ta-IN": "உங்கள் பணியிடத்தைக் கண்டறியுங்கள்",
  },
  "One thread from first symptom to recovery.": {
    "en-IN": "One thread from first symptom to recovery.",
    "hi-IN": "पहले लक्षण से स्वस्थ होने तक एक जुड़ी कड़ी।",
    "pa-IN": "ਪਹਿਲੇ ਲੱਛਣ ਤੋਂ ਸਿਹਤਯਾਬੀ ਤੱਕ ਇੱਕ ਜੁੜੀ ਲੜੀ।",
    "ta-IN": "முதல் அறிகுறியிலிருந்து குணமடையும் வரை ஒரே தொடர்.",
  },
  "Human decisions.": {
    "en-IN": "Human decisions.",
    "hi-IN": "निर्णय लोगों के।",
    "pa-IN": "ਫ਼ੈਸਲੇ ਲੋਕਾਂ ਦੇ।",
    "ta-IN": "முடிவுகள் மனிதர்களால்.",
  },
  "Thoughtful support.": {
    "en-IN": "Thoughtful support.",
    "hi-IN": "समझदारी भरा सहयोग।",
    "pa-IN": "ਸੋਚ-ਸਮਝ ਵਾਲਾ ਸਹਿਯੋਗ।",
    "ta-IN": "கவனமான ஆதரவு.",
  },
  "Clinical oversight": {
    "en-IN": "Clinical oversight",
    "hi-IN": "चिकित्सकीय निगरानी",
    "pa-IN": "ਡਾਕਟਰੀ ਨਿਗਰਾਨੀ",
    "ta-IN": "மருத்துவ மேற்பார்வை",
  },
  "Decision support keeps the clinician in the loop.": {
    "en-IN": "Decision support keeps the clinician in the loop.",
    "hi-IN": "निर्णय सहायता में चिकित्सक शामिल रहते हैं।",
    "pa-IN": "ਫ਼ੈਸਲਾ ਸਹਾਇਤਾ ਵਿੱਚ ਡਾਕਟਰ ਸ਼ਾਮਲ ਰਹਿੰਦੇ ਹਨ।",
    "ta-IN": "முடிவு ஆதரவில் மருத்துவர் தொடர்ந்து பங்கேற்கிறார்.",
  },
  "Consent, with clarity": {
    "en-IN": "Consent, with clarity",
    "hi-IN": "स्पष्ट सहमति",
    "pa-IN": "ਸਪਸ਼ਟ ਸਹਿਮਤੀ",
    "ta-IN": "தெளிவான ஒப்புதல்",
  },
  "Understand what is shared and how it is used.": {
    "en-IN": "Understand what is shared and how it is used.",
    "hi-IN": "समझें कि क्या साझा किया जाता है और उसका उपयोग कैसे होता है।",
    "pa-IN": "ਸਮਝੋ ਕਿ ਕੀ ਸਾਂਝਾ ਹੁੰਦਾ ਹੈ ਅਤੇ ਇਸਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਹੁੰਦੀ ਹੈ।",
    "ta-IN":
      "எது பகிரப்படுகிறது, அது எவ்வாறு பயன்படுத்தப்படுகிறது என்பதைப் புரிந்துகொள்ளுங்கள்.",
  },
  "Explainable by design": {
    "en-IN": "Explainable by design",
    "hi-IN": "डिज़ाइन से समझने योग्य",
    "pa-IN": "ਡਿਜ਼ਾਈਨ ਤੋਂ ਹੀ ਸਮਝਣਯੋਗ",
    "ta-IN": "வடிவமைப்பிலேயே விளக்கக்கூடியது",
  },
  "Deterministic core algorithms and FHIR-aligned records.": {
    "en-IN": "Deterministic core algorithms and FHIR-aligned records.",
    "hi-IN": "निश्चित नियमों वाले मुख्य एल्गोरिदम और FHIR के अनुरूप रिकॉर्ड।",
    "pa-IN": "ਨਿਯਮ-ਅਧਾਰਿਤ ਮੁੱਖ ਐਲਗੋਰਿਦਮ ਅਤੇ FHIR-ਅਨੁਕੂਲ ਰਿਕਾਰਡ।",
    "ta-IN": "நிலையான விதி வழிமுறைகளும் FHIR-க்கு இணையான பதிவுகளும்.",
  },
  "A healthier tomorrow,": {
    "en-IN": "A healthier tomorrow,",
    "hi-IN": "स्वस्थ कल,",
    "pa-IN": "ਸਿਹਤਮੰਦ ਭਵਿੱਖ,",
    "ta-IN": "ஆரோக்கியமான நாளை,",
  },
  "together.": {
    "en-IN": "together.",
    "hi-IN": "साथ मिलकर।",
    "pa-IN": "ਇਕੱਠੇ।",
    "ta-IN": "ஒன்றாக.",
  },
  "One continuous journey from first symptom to recovery.": {
    "en-IN": "One continuous journey from first symptom to recovery.",
    "hi-IN": "पहले लक्षण से स्वस्थ होने तक एक निरंतर यात्रा।",
    "pa-IN": "ਪਹਿਲੇ ਲੱਛਣ ਤੋਂ ਸਿਹਤਯਾਬੀ ਤੱਕ ਇੱਕ ਲਗਾਤਾਰ ਸਫ਼ਰ।",
    "ta-IN": "முதல் அறிகுறியிலிருந்து குணமடையும் வரை தொடரும் பயணம்.",
  },
  "Where would you": {
    "en-IN": "Where would you",
    "hi-IN": "आप कहाँ",
    "pa-IN": "ਤੁਸੀਂ ਕਿੱਥੋਂ",
    "ta-IN": "நீங்கள் எங்கே",
  },
  "like to begin?": {
    "en-IN": "like to begin?",
    "hi-IN": "शुरू करना चाहेंगे?",
    "pa-IN": "ਸ਼ੁਰੂ ਕਰਨਾ ਚਾਹੋਗੇ?",
    "ta-IN": "தொடங்க விரும்புகிறீர்கள்?",
  },
  "One platform.": {
    "en-IN": "One platform.",
    "hi-IN": "एक प्लेटफ़ॉर्म।",
    "pa-IN": "ਇੱਕ ਪਲੇਟਫਾਰਮ।",
    "ta-IN": "ஒரே தளம்.",
  },
  "Every stage of care.": {
    "en-IN": "Every stage of care.",
    "hi-IN": "देखभाल का हर चरण।",
    "pa-IN": "ਦੇਖਭਾਲ ਦਾ ਹਰ ਪੜਾਅ।",
    "ta-IN": "பராமரிப்பின் ஒவ்வொரு கட்டமும்.",
  },
  "The whole picture.": {
    "en-IN": "The whole picture.",
    "hi-IN": "पूरी तस्वीर।",
    "pa-IN": "ਪੂਰੀ ਤਸਵੀਰ।",
    "ta-IN": "முழுப் படம்.",
  },
  "A clearer next step.": {
    "en-IN": "A clearer next step.",
    "hi-IN": "अगला कदम और स्पष्ट।",
    "pa-IN": "ਅਗਲਾ ਕਦਮ ਹੋਰ ਸਪਸ਼ਟ।",
    "ta-IN": "அடுத்த படி தெளிவாக.",
  },
  "From the first hello to the next healthy day.": {
    "en-IN": "From the first hello to the next healthy day.",
    "hi-IN": "पहली बातचीत से अगले स्वस्थ दिन तक।",
    "pa-IN": "ਪਹਿਲੀ ਗੱਲਬਾਤ ਤੋਂ ਅਗਲੇ ਸਿਹਤਮੰਦ ਦਿਨ ਤੱਕ।",
    "ta-IN": "முதல் உரையாடலிலிருந்து அடுத்த ஆரோக்கியமான நாள் வரை.",
  },
  "Let’s bring care together.": {
    "en-IN": "Let’s bring care together.",
    "hi-IN": "आइए, देखभाल को जोड़ें।",
    "pa-IN": "ਆਓ, ਦੇਖਭਾਲ ਨੂੰ ਇਕੱਠਾ ਜੋੜੀਏ।",
    "ta-IN": "பராமரிப்பை ஒன்றிணைப்போம்.",
  },
  "Not an emergency service.": {
    "en-IN": "Not an emergency service.",
    "hi-IN": "यह आपातकालीन सेवा नहीं है।",
    "pa-IN": "ਇਹ ਐਮਰਜੈਂਸੀ ਸੇਵਾ ਨਹੀਂ ਹੈ।",
    "ta-IN": "இது அவசரச் சேவை அல்ல.",
  },
  "Care continues": {
    "en-IN": "Care continues",
    "hi-IN": "देखभाल जारी रहती है",
    "pa-IN": "ਦੇਖਭਾਲ ਜਾਰੀ ਰਹਿੰਦੀ ਹੈ",
    "ta-IN": "பராமரிப்பு தொடர்கிறது",
  },
  Prevention: {
    "en-IN": "Prevention",
    "hi-IN": "रोकथाम",
    "pa-IN": "ਰੋਕਥਾਮ",
    "ta-IN": "தடுப்பு",
  },
  Consultation: {
    "en-IN": "Consultation",
    "hi-IN": "परामर्श",
    "pa-IN": "ਸਲਾਹ-ਮਸ਼ਵਰਾ",
    "ta-IN": "ஆலோசனை",
  },
  "Our approach to care": {
    "en-IN": "Our approach to care",
    "hi-IN": "देखभाल का हमारा तरीका",
    "pa-IN": "ਦੇਖਭਾਲ ਲਈ ਸਾਡਾ ਤਰੀਕਾ",
    "ta-IN": "பராமரிப்பிற்கான எங்கள் அணுகுமுறை",
  },
  Overview: {
    "en-IN": "Overview",
    "hi-IN": "अवलोकन",
    "pa-IN": "ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
    "ta-IN": "கண்ணோட்டம்",
  },
  Hospitals: {
    "en-IN": "Hospitals",
    "hi-IN": "अस्पताल",
    "pa-IN": "ਹਸਪਤਾਲ",
    "ta-IN": "மருத்துவமனைகள்",
  },
  Clinics: {
    "en-IN": "Clinics",
    "hi-IN": "क्लिनिक",
    "pa-IN": "ਕਲੀਨਿਕ",
    "ta-IN": "மருத்துவமனைகள்",
  },
  Patients: {
    "en-IN": "Patients",
    "hi-IN": "मरीज़",
    "pa-IN": "ਮਰੀਜ਼",
    "ta-IN": "நோயாளிகள்",
  },
  Doctors: {
    "en-IN": "Doctors",
    "hi-IN": "डॉक्टर",
    "pa-IN": "ਡਾਕਟਰ",
    "ta-IN": "மருத்துவர்கள்",
  },
  Staff: {
    "en-IN": "Staff",
    "hi-IN": "कर्मचारी",
    "pa-IN": "ਸਟਾਫ਼",
    "ta-IN": "பணியாளர்கள்",
  },
  Inventory: {
    "en-IN": "Inventory",
    "hi-IN": "भंडार",
    "pa-IN": "ਸਟਾਕ",
    "ta-IN": "சரக்கு",
  },
  Billing: {
    "en-IN": "Billing",
    "hi-IN": "बिलिंग",
    "pa-IN": "ਬਿਲਿੰਗ",
    "ta-IN": "கட்டணம்",
  },
  Revenue: {
    "en-IN": "Revenue",
    "hi-IN": "राजस्व",
    "pa-IN": "ਆਮਦਨ",
    "ta-IN": "வருவாய்",
  },
  Expenses: {
    "en-IN": "Expenses",
    "hi-IN": "खर्च",
    "pa-IN": "ਖ਼ਰਚੇ",
    "ta-IN": "செலவுகள்",
  },
  Reports: {
    "en-IN": "Reports",
    "hi-IN": "रिपोर्ट",
    "pa-IN": "ਰਿਪੋਰਟਾਂ",
    "ta-IN": "அறிக்கைகள்",
  },
  Analytics: {
    "en-IN": "Analytics",
    "hi-IN": "विश्लेषण",
    "pa-IN": "ਵਿਸ਼ਲੇਸ਼ਣ",
    "ta-IN": "பகுப்பாய்வு",
  },
  Operations: {
    "en-IN": "Operations",
    "hi-IN": "संचालन",
    "pa-IN": "ਕਾਰਜ",
    "ta-IN": "செயல்பாடுகள்",
  },
  "Quick Actions": {
    "en-IN": "Quick Actions",
    "hi-IN": "त्वरित कार्रवाइयाँ",
    "pa-IN": "ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ",
    "ta-IN": "விரைவு செயல்கள்",
  },
  "Recent Activity": {
    "en-IN": "Recent Activity",
    "hi-IN": "हाल की गतिविधि",
    "pa-IN": "ਹਾਲੀਆ ਗਤੀਵਿਧੀ",
    "ta-IN": "சமீபத்திய செயல்பாடு",
  },
  "Financial Overview": {
    "en-IN": "Financial Overview",
    "hi-IN": "वित्तीय अवलोकन",
    "pa-IN": "ਵਿੱਤੀ ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
    "ta-IN": "நிதிக் கண்ணோட்டம்",
  },
  "Hospital Performance": {
    "en-IN": "Hospital Performance",
    "hi-IN": "अस्पताल का प्रदर्शन",
    "pa-IN": "ਹਸਪਤਾਲ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ",
    "ta-IN": "மருத்துவமனை செயல்திறன்",
  },
  "Clinic Performance": {
    "en-IN": "Clinic Performance",
    "hi-IN": "क्लिनिक का प्रदर्शन",
    "pa-IN": "ਕਲੀਨਿਕ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ",
    "ta-IN": "மருத்துவமனை செயல்திறன்",
  },
  "Total Patients": {
    "en-IN": "Total Patients",
    "hi-IN": "कुल मरीज़",
    "pa-IN": "ਕੁੱਲ ਮਰੀਜ਼",
    "ta-IN": "மொத்த நோயாளிகள்",
  },
  "Total Visits": {
    "en-IN": "Total Visits",
    "hi-IN": "कुल मुलाक़ातें",
    "pa-IN": "ਕੁੱਲ ਮੁਲਾਕਾਤਾਂ",
    "ta-IN": "மொத்த வருகைகள்",
  },
  "Today's Patients": {
    "en-IN": "Today's Patients",
    "hi-IN": "आज के मरीज़",
    "pa-IN": "ਅੱਜ ਦੇ ਮਰੀਜ਼",
    "ta-IN": "இன்றைய நோயாளிகள்",
  },
  "Monthly Revenue": {
    "en-IN": "Monthly Revenue",
    "hi-IN": "मासिक राजस्व",
    "pa-IN": "ਮਹੀਨਾਵਾਰ ਆਮਦਨ",
    "ta-IN": "மாத வருவாய்",
  },
  Appointments: {
    "en-IN": "Appointments",
    "hi-IN": "अपॉइंटमेंट",
    "pa-IN": "ਮੁਲਾਕਾਤਾਂ",
    "ta-IN": "சந்திப்புகள்",
  },
  Pending: {
    "en-IN": "Pending",
    "hi-IN": "लंबित",
    "pa-IN": "ਬਕਾਇਆ",
    "ta-IN": "நிலுவையில்",
  },
  Completed: {
    "en-IN": "Completed",
    "hi-IN": "पूरा हुआ",
    "pa-IN": "ਮੁਕੰਮਲ",
    "ta-IN": "முடிந்தது",
  },
  Active: {
    "en-IN": "Active",
    "hi-IN": "सक्रिय",
    "pa-IN": "ਸਰਗਰਮ",
    "ta-IN": "செயலில்",
  },
  Inactive: {
    "en-IN": "Inactive",
    "hi-IN": "निष्क्रिय",
    "pa-IN": "ਨਿਸ਼ਕਿਰਿਆ",
    "ta-IN": "செயலற்றது",
  },
  "Add New": {
    "en-IN": "Add New",
    "hi-IN": "नया जोड़ें",
    "pa-IN": "ਨਵਾਂ ਸ਼ਾਮਲ ਕਰੋ",
    "ta-IN": "புதியதைச் சேர்",
  },
  "New Patient": {
    "en-IN": "New Patient",
    "hi-IN": "नया मरीज़",
    "pa-IN": "ਨਵਾਂ ਮਰੀਜ਼",
    "ta-IN": "புதிய நோயாளர்",
  },
  "Add Patient": {
    "en-IN": "Add Patient",
    "hi-IN": "मरीज़ जोड़ें",
    "pa-IN": "ਮਰੀਜ਼ ਸ਼ਾਮਲ ਕਰੋ",
    "ta-IN": "நோயாளியைச் சேர்",
  },
  "Create Invoice": {
    "en-IN": "Create Invoice",
    "hi-IN": "इनवॉइस बनाएँ",
    "pa-IN": "ਇਨਵੌਇਸ ਬਣਾਓ",
    "ta-IN": "விலைப்பட்டியலை உருவாக்கவும்",
  },
  "New Admission": {
    "en-IN": "New Admission",
    "hi-IN": "नया दाख़िला",
    "pa-IN": "ਨਵਾਂ ਦਾਖ਼ਲਾ",
    "ta-IN": "புதிய சேர்க்கை",
  },
  Approve: {
    "en-IN": "Approve",
    "hi-IN": "स्वीकृत करें",
    "pa-IN": "ਮਨਜ਼ੂਰ ਕਰੋ",
    "ta-IN": "ஒப்புதல் அளி",
  },
  Reject: {
    "en-IN": "Reject",
    "hi-IN": "अस्वीकार करें",
    "pa-IN": "ਰੱਦ ਕਰੋ",
    "ta-IN": "நிராகரி",
  },
  Filter: {
    "en-IN": "Filter",
    "hi-IN": "फ़िल्टर",
    "pa-IN": "ਫ਼ਿਲਟਰ",
    "ta-IN": "வடிகட்டி",
  },
  Apply: {
    "en-IN": "Apply",
    "hi-IN": "लागू करें",
    "pa-IN": "ਲਾਗੂ ਕਰੋ",
    "ta-IN": "பயன்படுத்து",
  },
  Clear: {
    "en-IN": "Clear",
    "hi-IN": "साफ़ करें",
    "pa-IN": "ਸਾਫ਼ ਕਰੋ",
    "ta-IN": "அழி",
  },
  "AYUSETU | Hospital Business Operations & Inventory": {
    "en-IN": "AYUSETU | Hospital Business Operations & Inventory",
    "hi-IN": "आयुसेतु | अस्पताल संचालन और भंडार",
    "pa-IN": "ਆਯੁਸੇਤੂ | ਹਸਪਤਾਲ ਕਾਰਜ ਅਤੇ ਸਟਾਕ",
    "ta-IN": "ஆயுசேது | மருத்துவமனை செயல்பாடுகள் மற்றும் சரக்கு",
  },
  "About AYUSETU | Hospital Operations Platform": {
    "en-IN": "About AYUSETU | Hospital Operations Platform",
    "hi-IN": "आयुसेतु के बारे में | अस्पताल संचालन प्लेटफ़ॉर्म",
    "pa-IN": "ਆਯੁਸੇਤੂ ਬਾਰੇ | ਹਸਪਤਾਲ ਕਾਰਜ ਪਲੇਟਫਾਰਮ",
    "ta-IN": "ஆயுசேது பற்றி | மருத்துவமனை செயல்பாட்டுத் தளம்",
  },
  "AYUSETU News | Hospital Business Insights": {
    "en-IN": "AYUSETU News | Hospital Business Insights",
    "hi-IN": "आयुसेतु समाचार | अस्पताल व्यवसाय की जानकारी",
    "pa-IN": "ਆਯੁਸੇਤੂ ਖ਼ਬਰਾਂ | ਹਸਪਤਾਲ ਕਾਰੋਬਾਰੀ ਜਾਣਕਾਰੀ",
    "ta-IN": "ஆயுசேது செய்திகள் | மருத்துவமனை வணிகக் குறிப்புகள்",
  },
  "Contact AYUSETU | Hospital Management Support": {
    "en-IN": "Contact AYUSETU | Hospital Management Support",
    "hi-IN": "आयुसेतु से संपर्क | अस्पताल प्रबंधन सहायता",
    "pa-IN": "ਆਯੁਸੇਤੂ ਨਾਲ ਸੰਪਰਕ | ਹਸਪਤਾਲ ਪ੍ਰਬੰਧਨ ਸਹਾਇਤਾ",
    "ta-IN": "ஆயுசேதுவைத் தொடர்புகொள்ளவும் | மருத்துவமனை மேலாண்மை உதவி",
  },
  "Clinic Operations Management | AYUSETU": {
    "en-IN": "Clinic Operations Management | AYUSETU",
    "hi-IN": "क्लिनिक संचालन प्रबंधन | आयुसेतु",
    "pa-IN": "ਕਲੀਨਿਕ ਕਾਰਜ ਪ੍ਰਬੰਧਨ | ਆਯੁਸੇਤੂ",
    "ta-IN": "மருத்துவமனை செயல்பாட்டு மேலாண்மை | ஆயுசேது",
  },
  "Hospital Command Center | AYUSETU": {
    "en-IN": "Hospital Command Center | AYUSETU",
    "hi-IN": "अस्पताल नियंत्रण केंद्र | आयुसेतु",
    "pa-IN": "ਹਸਪਤਾਲ ਕੰਟਰੋਲ ਕੇਂਦਰ | ਆਯੁਸੇਤੂ",
    "ta-IN": "மருத்துவமனை கட்டுப்பாட்டு மையம் | ஆயுசேது",
  },
  "Privacy Policy | AYUSETU": {
    "en-IN": "Privacy Policy | AYUSETU",
    "hi-IN": "गोपनीयता नीति | आयुसेतु",
    "pa-IN": "ਪਰਦੇਦਾਰੀ ਨੀਤੀ | ਆਯੁਸੇਤੂ",
    "ta-IN": "தனியுரிமைக் கொள்கை | ஆயுசேது",
  },
  "Careers at AYUSETU | Build Healthcare Ops Tech": {
    "en-IN": "Careers at AYUSETU | Build Healthcare Ops Tech",
    "hi-IN": "आयुसेतु में करियर | स्वास्थ्य सेवा तकनीक बनाएँ",
    "pa-IN": "ਆਯੁਸੇਤੂ ਵਿੱਚ ਕਰੀਅਰ | ਸਿਹਤ ਤਕਨਾਲੋਜੀ ਬਣਾਓ",
    "ta-IN": "ஆயுசேதுவில் வேலைவாய்ப்புகள் | சுகாதார தொழில்நுட்பத்தை உருவாக்குங்கள்",
  },
  "Support | AYUSETU Hospital Management System": {
    "en-IN": "Support | AYUSETU Hospital Management System",
    "hi-IN": "सहायता | आयुसेतु अस्पताल प्रबंधन प्रणाली",
    "pa-IN": "ਸਹਾਇਤਾ | ਆਯੁਸੇਤੂ ਹਸਪਤਾਲ ਪ੍ਰਬੰਧਨ ਸਿਸਟਮ",
    "ta-IN": "ஆதரவு | ஆயுசேது மருத்துவமனை மேலாண்மை அமைப்பு",
  },
  "Login | AYUSETU": {
    "en-IN": "Login | AYUSETU",
    "hi-IN": "लॉगिन | आयुसेतु",
    "pa-IN": "ਲੌਗਇਨ | ਆਯੁਸੇਤੂ",
    "ta-IN": "உள்நுழைவு | ஆயுசேது",
  },
  "Register | AYUSETU": {
    "en-IN": "Register | AYUSETU",
    "hi-IN": "पंजीकरण | आयुसेतु",
    "pa-IN": "ਰਜਿਸਟਰ | ਆਯੁਸੇਤੂ",
    "ta-IN": "பதிவு | ஆயுசேது",
  },
  "AYUSETU — Your health, connected": {
    "en-IN": "AYUSETU — Your health, connected",
    "hi-IN": "आयुसेतु — आपका स्वास्थ्य, जुड़ा हुआ",
    "pa-IN": "ਆਯੁਸੇਤੂ — ਤੁਹਾਡੀ ਸਿਹਤ, ਜੁੜੀ ਹੋਈ",
    "ta-IN": "ஆயுசேது — உங்கள் ஆரோக்கியம், இணைந்தது",
  },
  "Access Denied": {
    "en-IN": "Access Denied",
    "hi-IN": "पहुँच अस्वीकृत",
    "pa-IN": "ਪਹੁੰਚ ਅਸਵੀਕਾਰ",
    "ta-IN": "அணுகல் மறுக்கப்பட்டது",
  },
  "You need administrative privileges to view settings.": {
    "en-IN": "You need administrative privileges to view settings.",
    "hi-IN": "सेटिंग्स देखने के लिए प्रशासनिक अधिकार चाहिए।",
    "pa-IN": "ਸੈਟਿੰਗਾਂ ਵੇਖਣ ਲਈ ਪ੍ਰਸ਼ਾਸਕੀ ਅਧਿਕਾਰ ਲੋੜੀਂਦੇ ਹਨ।",
    "ta-IN": "அமைப்புகளைப் பார்க்க நிர்வாக அனுமதி தேவை.",
  },
  "System Settings": {
    "en-IN": "System Settings",
    "hi-IN": "सिस्टम सेटिंग्स",
    "pa-IN": "ਸਿਸਟਮ ਸੈਟਿੰਗਾਂ",
    "ta-IN": "கணினி அமைப்புகள்",
  },
  "configurations and preferences.": {
    "en-IN": "configurations and preferences.",
    "hi-IN": "कॉन्फ़िगरेशन और प्राथमिकताएँ।",
    "pa-IN": "ਸੈਟਿੰਗਾਂ ਅਤੇ ਤਰਜੀਹਾਂ।",
    "ta-IN": "உள்ளமைவுகள் மற்றும் விருப்பத்தேர்வுகள்.",
  },
  "Hospital Profile": {
    "en-IN": "Hospital Profile",
    "hi-IN": "अस्पताल प्रोफ़ाइल",
    "pa-IN": "ਹਸਪਤਾਲ ਪ੍ਰੋਫ਼ਾਈਲ",
    "ta-IN": "மருத்துவமனை விவரம்",
  },
  "Global Security": {
    "en-IN": "Global Security",
    "hi-IN": "वैश्विक सुरक्षा",
    "pa-IN": "ਗਲੋਬਲ ਸੁਰੱਖਿਆ",
    "ta-IN": "உலகளாவிய பாதுகாப்பு",
  },
  "Global Policies": {
    "en-IN": "Global Policies",
    "hi-IN": "वैश्विक नीतियाँ",
    "pa-IN": "ਗਲੋਬਲ ਨੀਤੀਆਂ",
    "ta-IN": "உலகளாவிய கொள்கைகள்",
  },
  "WhatsApp Bot": {
    "en-IN": "WhatsApp Bot",
    "hi-IN": "व्हाट्सऐप बॉट",
    "pa-IN": "ਵਟਸਐਪ ਬੋਟ",
    "ta-IN": "வாட்ஸ்அப் போட்",
  },
  "Clinic Profile": {
    "en-IN": "Clinic Profile",
    "hi-IN": "क्लिनिक प्रोफ़ाइल",
    "pa-IN": "ਕਲੀਨਿਕ ਪ੍ਰੋਫ਼ਾਈਲ",
    "ta-IN": "மருத்துவமனை விவரம்",
  },
  "Working Hours": {
    "en-IN": "Working Hours",
    "hi-IN": "काम के घंटे",
    "pa-IN": "ਕੰਮ ਦੇ ਘੰਟੇ",
    "ta-IN": "வேலை நேரம்",
  },
  "Billing Defaults": {
    "en-IN": "Billing Defaults",
    "hi-IN": "डिफ़ॉल्ट बिलिंग",
    "pa-IN": "ਮੂਲ ਬਿਲਿੰਗ ਸੈਟਿੰਗਾਂ",
    "ta-IN": "இயல்புநிலை கட்டணம்",
  },
  "Hospital Information": {
    "en-IN": "Hospital Information",
    "hi-IN": "अस्पताल की जानकारी",
    "pa-IN": "ਹਸਪਤਾਲ ਦੀ ਜਾਣਕਾਰੀ",
    "ta-IN": "மருத்துவமனைத் தகவல்",
  },
  "Update your primary healthcare organization details.": {
    "en-IN": "Update your primary healthcare organization details.",
    "hi-IN": "अपनी मुख्य स्वास्थ्य सेवा संस्था का विवरण अपडेट करें।",
    "pa-IN": "ਆਪਣੀ ਮੁੱਖ ਸਿਹਤ ਸੰਸਥਾ ਦੇ ਵੇਰਵੇ ਅੱਪਡੇਟ ਕਰੋ।",
    "ta-IN": "உங்கள் முதன்மை சுகாதார நிறுவன விவரங்களைப் புதுப்பிக்கவும்.",
  },
  "Registration Number (CIN)": {
    "en-IN": "Registration Number (CIN)",
    "hi-IN": "पंजीकरण संख्या (CIN)",
    "pa-IN": "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ (CIN)",
    "ta-IN": "பதிவு எண் (CIN)",
  },
  "Primary Contact Email": {
    "en-IN": "Primary Contact Email",
    "hi-IN": "मुख्य संपर्क ईमेल",
    "pa-IN": "ਮੁੱਖ ਸੰਪਰਕ ਈਮੇਲ",
    "ta-IN": "முதன்மை தொடர்பு மின்னஞ்சல்",
  },
  "Headquarters Address": {
    "en-IN": "Headquarters Address",
    "hi-IN": "मुख्यालय का पता",
    "pa-IN": "ਮੁੱਖ ਦਫ਼ਤਰ ਦਾ ਪਤਾ",
    "ta-IN": "தலைமையக முகவரி",
  },
  "Network Security Policies": {
    "en-IN": "Network Security Policies",
    "hi-IN": "नेटवर्क सुरक्षा नीतियाँ",
    "pa-IN": "ਨੈੱਟਵਰਕ ਸੁਰੱਖਿਆ ਨੀਤੀਆਂ",
    "ta-IN": "வலையமைப்பு பாதுகாப்புக் கொள்கைகள்",
  },
  "Enforce security across all integrated clinics.": {
    "en-IN": "Enforce security across all integrated clinics.",
    "hi-IN": "सभी जुड़े क्लिनिकों में सुरक्षा लागू करें।",
    "pa-IN": "ਸਾਰੇ ਜੁੜੇ ਕਲੀਨਿਕਾਂ ਵਿੱਚ ਸੁਰੱਖਿਆ ਲਾਗੂ ਕਰੋ।",
    "ta-IN": "இணைக்கப்பட்ட அனைத்து மருத்துவமனைகளிலும் பாதுகாப்பைச் செயல்படுத்தவும்.",
  },
  "Require 2-Factor Authentication": {
    "en-IN": "Require 2-Factor Authentication",
    "hi-IN": "2-चरणीय प्रमाणीकरण ज़रूरी करें",
    "pa-IN": "2-ਪੜਾਅ ਪ੍ਰਮਾਣੀਕਰਨ ਲਾਜ਼ਮੀ ਕਰੋ",
    "ta-IN": "இரு-கட்ட அங்கீகாரத்தைக் கட்டாயப்படுத்து",
  },
  "Force all medical staff to use SMS or Authenticator App.": {
    "en-IN": "Force all medical staff to use SMS or Authenticator App.",
    "hi-IN":
      "सभी चिकित्सा कर्मचारियों के लिए SMS या Authenticator ऐप का उपयोग अनिवार्य करें।",
    "pa-IN": "ਸਾਰੇ ਡਾਕਟਰੀ ਸਟਾਫ਼ ਲਈ SMS ਜਾਂ Authenticator ਐਪ ਦੀ ਵਰਤੋਂ ਲਾਜ਼ਮੀ ਕਰੋ।",
    "ta-IN":
      "அனைத்து மருத்துவப் பணியாளர்களும் SMS அல்லது அங்கீகாரச் செயலியைப் பயன்படுத்த வேண்டும்.",
  },
  "Session Timeout (Idle Minutes)": {
    "en-IN": "Session Timeout (Idle Minutes)",
    "hi-IN": "सत्र समाप्ति (निष्क्रिय मिनट)",
    "pa-IN": "ਸੈਸ਼ਨ ਸਮਾਂ-ਮਿਆਦ (ਨਿਸ਼ਕਿਰਿਆ ਮਿੰਟ)",
    "ta-IN": "அமர்வு காலாவதி (செயலற்ற நிமிடங்கள்)",
  },
  "Automatically log out inactive terminals.": {
    "en-IN": "Automatically log out inactive terminals.",
    "hi-IN": "निष्क्रिय टर्मिनलों से अपने आप साइन आउट करें।",
    "pa-IN": "ਨਿਸ਼ਕਿਰਿਆ ਟਰਮੀਨਲਾਂ ਤੋਂ ਆਪਣੇ ਆਪ ਸਾਈਨ ਆਉਟ ਕਰੋ।",
    "ta-IN": "செயலற்ற முனையங்களிலிருந்து தானாக வெளியேறவும்.",
  },
  "Save Security Rules": {
    "en-IN": "Save Security Rules",
    "hi-IN": "सुरक्षा नियम सहेजें",
    "pa-IN": "ਸੁਰੱਖਿਆ ਨਿਯਮ ਸੰਭਾਲੋ",
    "ta-IN": "பாதுகாப்பு விதிகளைச் சேமி",
  },
  "Global Operation Policies": {
    "en-IN": "Global Operation Policies",
    "hi-IN": "वैश्विक संचालन नीतियाँ",
    "pa-IN": "ਗਲੋਬਲ ਕਾਰਜ ਨੀਤੀਆਂ",
    "ta-IN": "உலகளாவிய செயல்பாட்டுக் கொள்கைகள்",
  },
  "Define standards applied instantly across the network.": {
    "en-IN": "Define standards applied instantly across the network.",
    "hi-IN": "पूरे नेटवर्क में तुरंत लागू होने वाले मानक तय करें।",
    "pa-IN": "ਪੂਰੇ ਨੈੱਟਵਰਕ ਵਿੱਚ ਤੁਰੰਤ ਲਾਗੂ ਹੋਣ ਵਾਲੇ ਮਿਆਰ ਤੈਅ ਕਰੋ।",
    "ta-IN": "முழு வலையமைப்பிலும் உடனடியாகப் பொருந்தும் தரநிலைகளை வரையறுக்கவும்.",
  },
  "Inventory Alert Policy": {
    "en-IN": "Inventory Alert Policy",
    "hi-IN": "भंडार अलर्ट नीति",
    "pa-IN": "ਸਟਾਕ ਚੇਤਾਵਨੀ ਨੀਤੀ",
    "ta-IN": "சரக்கு எச்சரிக்கைக் கொள்கை",
  },
  "Master threshold for low-stock warnings (in packs) across all clinics.": {
    "en-IN":
      "Master threshold for low-stock warnings (in packs) across all clinics.",
    "hi-IN": "सभी क्लिनिकों में कम भंडार चेतावनी की मुख्य सीमा (पैक में)।",
    "pa-IN": "ਸਾਰੇ ਕਲੀਨਿਕਾਂ ਲਈ ਘੱਟ ਸਟਾਕ ਚੇਤਾਵਨੀ ਦੀ ਮੁੱਖ ਹੱਦ (ਪੈਕਾਂ ਵਿੱਚ)।",
    "ta-IN":
      "அனைத்து மருத்துவமனைகளிலும் குறைந்த சரக்கிற்கான முதன்மை எச்சரிக்கை வரம்பு (பொட்டலங்களில்).",
  },
  "Global Low Stock Threshold (Packs)": {
    "en-IN": "Global Low Stock Threshold (Packs)",
    "hi-IN": "वैश्विक कम भंडार सीमा (पैक)",
    "pa-IN": "ਗਲੋਬਲ ਘੱਟ ਸਟਾਕ ਹੱਦ (ਪੈਕ)",
    "ta-IN": "உலகளாவிய குறைந்த சரக்கு வரம்பு (பொட்டலங்கள்)",
  },
  "Packs remaining before warning": {
    "en-IN": "Packs remaining before warning",
    "hi-IN": "चेतावनी से पहले बचे पैक",
    "pa-IN": "ਚੇਤਾਵਨੀ ਤੋਂ ਪਹਿਲਾਂ ਬਾਕੀ ਪੈਕ",
    "ta-IN": "எச்சரிக்கைக்கு முன் மீதமுள்ள பொட்டலங்கள்",
  },
  "Automated Procurement": {
    "en-IN": "Automated Procurement",
    "hi-IN": "स्वचालित खरीद",
    "pa-IN": "ਸਵੈਚਾਲਿਤ ਖ਼ਰੀਦ",
    "ta-IN": "தானியங்கி கொள்முதல்",
  },
  "Auto-generate purchase orders when stock is low. (Coming Soon)": {
    "en-IN": "Auto-generate purchase orders when stock is low. (Coming Soon)",
    "hi-IN": "भंडार कम होने पर खरीद आदेश अपने आप बनाएँ। (जल्द आ रहा है)",
    "pa-IN": "ਸਟਾਕ ਘੱਟ ਹੋਣ 'ਤੇ ਖ਼ਰੀਦ ਆਰਡਰ ਆਪਣੇ ਆਪ ਬਣਾਓ। (ਜਲਦੀ ਆ ਰਿਹਾ ਹੈ)",
    "ta-IN": "சரக்கு குறையும்போது கொள்முதல் ஆணைகளைத் தானாக உருவாக்கவும். (விரைவில்)",
  },
  "Save Global Policies": {
    "en-IN": "Save Global Policies",
    "hi-IN": "वैश्विक नीतियाँ सहेजें",
    "pa-IN": "ਗਲੋਬਲ ਨੀਤੀਆਂ ਸੰਭਾਲੋ",
    "ta-IN": "உலகளாவிய கொள்கைகளைச் சேமி",
  },
  "Partner Integrations": {
    "en-IN": "Partner Integrations",
    "hi-IN": "साझेदार एकीकरण",
    "pa-IN": "ਭਾਈਵਾਲ ਏਕੀਕਰਨ",
    "ta-IN": "கூட்டாளர் இணைப்புகள்",
  },
  "Manage connection keys to external gateways.": {
    "en-IN": "Manage connection keys to external gateways.",
    "hi-IN": "बाहरी गेटवे की कनेक्शन कुंजियाँ प्रबंधित करें।",
    "pa-IN": "ਬਾਹਰੀ ਗੇਟਵੇ ਦੀਆਂ ਕਨੈਕਸ਼ਨ ਕੁੰਜੀਆਂ ਸੰਭਾਲੋ।",
    "ta-IN": "வெளிப்புற நுழைவாயில்களுக்கான இணைப்பு விசைகளை நிர்வகிக்கவும்.",
  },
  "Twilio SMS Gateway Key (Patient Alerts)": {
    "en-IN": "Twilio SMS Gateway Key (Patient Alerts)",
    "hi-IN": "Twilio SMS गेटवे कुंजी (मरीज़ अलर्ट)",
    "pa-IN": "Twilio SMS ਗੇਟਵੇ ਕੁੰਜੀ (ਮਰੀਜ਼ ਚੇਤਾਵਨੀਆਂ)",
    "ta-IN": "Twilio SMS நுழைவாயில் விசை (நோயாளர் எச்சரிக்கைகள்)",
  },
  "Razorpay / Stripe Webhook Secret": {
    "en-IN": "Razorpay / Stripe Webhook Secret",
    "hi-IN": "Razorpay / Stripe वेबहुक सीक्रेट",
    "pa-IN": "Razorpay / Stripe ਵੈਬਹੁੱਕ ਸੀਕ੍ਰੇਟ",
    "ta-IN": "Razorpay / Stripe வெப்ஹுக் ரகசியம்",
  },
  "Update Credentials": {
    "en-IN": "Update Credentials",
    "hi-IN": "प्रमाण-पत्र अपडेट करें",
    "pa-IN": "ਪ੍ਰਮਾਣ-ਪੱਤਰ ਅੱਪਡੇਟ ਕਰੋ",
    "ta-IN": "சான்றுகளைப் புதுப்பிக்கவும்",
  },
  "Clinic Identity": {
    "en-IN": "Clinic Identity",
    "hi-IN": "क्लिनिक पहचान",
    "pa-IN": "ਕਲੀਨਿਕ ਪਛਾਣ",
    "ta-IN": "மருத்துவமனை அடையாளம்",
  },
  "Local contact and identification details for receipts.": {
    "en-IN": "Local contact and identification details for receipts.",
    "hi-IN": "रसीदों के लिए स्थानीय संपर्क और पहचान विवरण।",
    "pa-IN": "ਰਸੀਦਾਂ ਲਈ ਸਥਾਨਕ ਸੰਪਰਕ ਅਤੇ ਪਛਾਣ ਵੇਰਵੇ।",
    "ta-IN": "ரசீதுகளுக்கான உள்ளூர் தொடர்பு மற்றும் அடையாள விவரங்கள்.",
  },
  "Public Contact Number": {
    "en-IN": "Public Contact Number",
    "hi-IN": "सार्वजनिक संपर्क नंबर",
    "pa-IN": "ਜਨਤਕ ਸੰਪਰਕ ਨੰਬਰ",
    "ta-IN": "பொது தொடர்பு எண்",
  },
  "Local Tax / GST Number": {
    "en-IN": "Local Tax / GST Number",
    "hi-IN": "स्थानीय कर / GST नंबर",
    "pa-IN": "ਸਥਾਨਕ ਟੈਕਸ / GST ਨੰਬਰ",
    "ta-IN": "உள்ளூர் வரி / GST எண்",
  },
  "Local Address": {
    "en-IN": "Local Address",
    "hi-IN": "स्थानीय पता",
    "pa-IN": "ਸਥਾਨਕ ਪਤਾ",
    "ta-IN": "உள்ளூர் முகவரி",
  },
  "Clinic street address for receipts": {
    "en-IN": "Clinic street address for receipts",
    "hi-IN": "रसीदों के लिए क्लिनिक का सड़क पता",
    "pa-IN": "ਰਸੀਦਾਂ ਲਈ ਕਲੀਨਿਕ ਦਾ ਗਲੀ ਪਤਾ",
    "ta-IN": "ரசீதுகளுக்கான மருத்துவமனை தெரு முகவரி",
  },
  "Update Profile": {
    "en-IN": "Update Profile",
    "hi-IN": "प्रोफ़ाइल अपडेट करें",
    "pa-IN": "ਪ੍ਰੋਫ਼ਾਈਲ ਅੱਪਡੇਟ ਕਰੋ",
    "ta-IN": "விவரத்தைப் புதுப்பிக்கவும்",
  },
  "Working Hours & Shifts": {
    "en-IN": "Working Hours & Shifts",
    "hi-IN": "काम के घंटे और शिफ़्ट",
    "pa-IN": "ਕੰਮ ਦੇ ਘੰਟੇ ਅਤੇ ਸ਼ਿਫ਼ਟਾਂ",
    "ta-IN": "வேலை நேரம் மற்றும் பணிப்பகுதிகள்",
  },
  "Define operational boundaries for attendance tracking.": {
    "en-IN": "Define operational boundaries for attendance tracking.",
    "hi-IN": "उपस्थिति ट्रैक करने के लिए संचालन समय तय करें।",
    "pa-IN": "ਹਾਜ਼ਰੀ ਦਰਜ ਕਰਨ ਲਈ ਕੰਮ ਦੇ ਸਮੇਂ ਨਿਰਧਾਰਤ ਕਰੋ।",
    "ta-IN": "வருகைப் பதிவுக்கான செயல்பாட்டு நேர வரம்புகளை வரையறுக்கவும்.",
  },
  "Clinic Opening Time": {
    "en-IN": "Clinic Opening Time",
    "hi-IN": "क्लिनिक खुलने का समय",
    "pa-IN": "ਕਲੀਨਿਕ ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ",
    "ta-IN": "மருத்துவமனை திறக்கும் நேரம்",
  },
  "Clinic Closing Time": {
    "en-IN": "Clinic Closing Time",
    "hi-IN": "क्लिनिक बंद होने का समय",
    "pa-IN": "ਕਲੀਨਿਕ ਬੰਦ ਹੋਣ ਦਾ ਸਮਾਂ",
    "ta-IN": "மருத்துவமனை மூடும் நேரம்",
  },
  "Shift Overrides": {
    "en-IN": "Shift Overrides",
    "hi-IN": "शिफ़्ट बदलाव",
    "pa-IN": "ਸ਼ਿਫ਼ਟ ਤਬਦੀਲੀਆਂ",
    "ta-IN": "பணி நேர மாற்றங்கள்",
  },
  "Allow Overnight Shifts": {
    "en-IN": "Allow Overnight Shifts",
    "hi-IN": "रातभर की शिफ़्ट की अनुमति दें",
    "pa-IN": "ਰਾਤ ਦੀਆਂ ਸ਼ਿਫ਼ਟਾਂ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ",
    "ta-IN": "இரவு முழுவதும் பணிபுரிய அனுமதி",
  },
  "Enable check-ins spanning across midnight.": {
    "en-IN": "Enable check-ins spanning across midnight.",
    "hi-IN": "आधी रात पार करने वाले चेक-इन की अनुमति दें।",
    "pa-IN": "ਅੱਧੀ ਰਾਤ ਪਾਰ ਕਰਨ ਵਾਲੀ ਹਾਜ਼ਰੀ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।",
    "ta-IN": "நள்ளிரவைக் கடக்கும் வருகைப் பதிவுகளை அனுமதிக்கவும்.",
  },
  "Save Schedule": {
    "en-IN": "Save Schedule",
    "hi-IN": "समय-सारणी सहेजें",
    "pa-IN": "ਸਮਾਂ-ਸਾਰਣੀ ਸੰਭਾਲੋ",
    "ta-IN": "அட்டவணையைச் சேமி",
  },
  "Billing Constraints": {
    "en-IN": "Billing Constraints",
    "hi-IN": "बिलिंग सीमाएँ",
    "pa-IN": "ਬਿਲਿੰਗ ਪਾਬੰਦੀਆਂ",
    "ta-IN": "கட்டண வரம்புகள்",
  },
  "Customize the local Point of Sale experience.": {
    "en-IN": "Customize the local Point of Sale experience.",
    "hi-IN": "स्थानीय पॉइंट ऑफ़ सेल अनुभव को अपनी ज़रूरत के अनुसार बनाएँ।",
    "pa-IN": "ਸਥਾਨਕ ਵਿਕਰੀ-ਬਿੰਦੂ ਤਜਰਬੇ ਨੂੰ ਆਪਣੀ ਲੋੜ ਅਨੁਸਾਰ ਬਣਾਓ।",
    "ta-IN": "உள்ளூர் விற்பனை முனை அனுபவத்தைத் தனிப்பயனாக்கவும்.",
  },
  "Default Receipt Footer Message": {
    "en-IN": "Default Receipt Footer Message",
    "hi-IN": "रसीद के नीचे का डिफ़ॉल्ट संदेश",
    "pa-IN": "ਰਸੀਦ ਦੇ ਹੇਠਾਂ ਮੂਲ ਸੁਨੇਹਾ",
    "ta-IN": "ரசீது அடிப்பகுதி இயல்புநிலை செய்தி",
  },
  "Enforce Exact MRP Match": {
    "en-IN": "Enforce Exact MRP Match",
    "hi-IN": "सटीक MRP मिलान लागू करें",
    "pa-IN": "ਸਹੀ MRP ਮਿਲਾਨ ਲਾਗੂ ਕਰੋ",
    "ta-IN": "சரியான MRP பொருத்தத்தைச் செயல்படுத்து",
  },
  "Staff cannot manually discount items at POS.": {
    "en-IN": "Staff cannot manually discount items at POS.",
    "hi-IN": "कर्मचारी POS पर वस्तुओं पर खुद से छूट नहीं दे सकते।",
    "pa-IN": "ਸਟਾਫ਼ POS 'ਤੇ ਚੀਜ਼ਾਂ ਦੀ ਆਪਣੀ ਮਰਜ਼ੀ ਨਾਲ ਛੂਟ ਨਹੀਂ ਦੇ ਸਕਦਾ।",
    "ta-IN": "POS-இல் பணியாளர்கள் பொருட்களுக்கு கைமுறையாக தள்ளுபடி வழங்க முடியாது.",
  },
  "Apply Constraints": {
    "en-IN": "Apply Constraints",
    "hi-IN": "सीमाएँ लागू करें",
    "pa-IN": "ਪਾਬੰਦੀਆਂ ਲਾਗੂ ਕਰੋ",
    "ta-IN": "வரம்புகளைப் பயன்படுத்து",
  },
  "Alert Preferences": {
    "en-IN": "Alert Preferences",
    "hi-IN": "अलर्ट प्राथमिकताएँ",
    "pa-IN": "ਚੇਤਾਵਨੀ ਤਰਜੀਹਾਂ",
    "ta-IN": "எச்சரிக்கை விருப்பத்தேர்வுகள்",
  },
  "Determine what events trigger push or email notifications to you.": {
    "en-IN":
      "Determine what events trigger push or email notifications to you.",
    "hi-IN": "तय करें कि किन घटनाओं पर आपको पुश या ईमेल सूचनाएँ मिलें।",
    "pa-IN": "ਤੈਅ ਕਰੋ ਕਿ ਕਿਹੜੀਆਂ ਘਟਨਾਵਾਂ 'ਤੇ ਤੁਹਾਨੂੰ ਪੁਸ਼ ਜਾਂ ਈਮੇਲ ਸੂਚਨਾਵਾਂ ਮਿਲਣ।",
    "ta-IN":
      "எந்த நிகழ்வுகள் உங்களுக்கு புஷ் அல்லது மின்னஞ்சல் அறிவிப்புகளைத் தூண்ட வேண்டும் என்பதைத் தேர்ந்தெடுக்கவும்.",
  },
  "Inventory Low-Stock Alerts": {
    "en-IN": "Inventory Low-Stock Alerts",
    "hi-IN": "कम भंडार अलर्ट",
    "pa-IN": "ਘੱਟ ਸਟਾਕ ਚੇਤਾਵਨੀਆਂ",
    "ta-IN": "குறைந்த சரக்கு எச்சரிக்கைகள்",
  },
  "Daily summary of items below threshold.": {
    "en-IN": "Daily summary of items below threshold.",
    "hi-IN": "सीमा से कम वस्तुओं का दैनिक सारांश।",
    "pa-IN": "ਹੱਦ ਤੋਂ ਘੱਟ ਚੀਜ਼ਾਂ ਦਾ ਰੋਜ਼ਾਨਾ ਸਾਰ।",
    "ta-IN": "வரம்புக்குக் கீழுள்ள பொருட்களின் தினசரி சுருக்கம்.",
  },
  "Shift Anomaly Warnings": {
    "en-IN": "Shift Anomaly Warnings",
    "hi-IN": "शिफ़्ट असामान्यता चेतावनी",
    "pa-IN": "ਸ਼ਿਫ਼ਟ ਗੜਬੜ ਚੇਤਾਵਨੀਆਂ",
    "ta-IN": "பணி நேர முரண்பாட்டு எச்சரிக்கைகள்",
  },
  "Daily Revenue Summary": {
    "en-IN": "Daily Revenue Summary",
    "hi-IN": "दैनिक राजस्व सारांश",
    "pa-IN": "ਰੋਜ਼ਾਨਾ ਆਮਦਨ ਸਾਰ",
    "ta-IN": "தினசரி வருவாய் சுருக்கம்",
  },
  "Save Preferences": {
    "en-IN": "Save Preferences",
    "hi-IN": "प्राथमिकताएँ सहेजें",
    "pa-IN": "ਤਰਜੀਹਾਂ ਸੰਭਾਲੋ",
    "ta-IN": "விருப்பத்தேர்வுகளைச் சேமி",
  },
  "No notifications yet today": {
    "en-IN": "No notifications yet today",
    "hi-IN": "आज अभी तक कोई सूचना नहीं",
    "pa-IN": "ਅੱਜ ਹਾਲੇ ਕੋਈ ਸੂਚਨਾ ਨਹੀਂ",
    "ta-IN": "இன்று இதுவரை அறிவிப்புகள் இல்லை",
  },
  "Today's activity": {
    "en-IN": "Today's activity",
    "hi-IN": "आज की गतिविधि",
    "pa-IN": "ਅੱਜ ਦੀ ਗਤੀਵਿਧੀ",
    "ta-IN": "இன்றைய செயல்பாடு",
  },
  "Detailed information about this notification and related actions": {
    "en-IN": "Detailed information about this notification and related actions",
    "hi-IN": "इस सूचना और संबंधित कार्रवाइयों का विस्तृत विवरण",
    "pa-IN": "ਇਸ ਸੂਚਨਾ ਅਤੇ ਸੰਬੰਧਿਤ ਕਾਰਵਾਈਆਂ ਦੇ ਵੇਰਵੇ",
    "ta-IN": "இந்த அறிவிப்பு மற்றும் தொடர்புடைய செயல்களின் விரிவான தகவல்",
  },
  "Critical Stock Alert": {
    "en-IN": "Critical Stock Alert",
    "hi-IN": "गंभीर भंडार चेतावनी",
    "pa-IN": "ਗੰਭੀਰ ਸਟਾਕ ਚੇਤਾਵਨੀ",
    "ta-IN": "முக்கிய சரக்கு எச்சரிக்கை",
  },
  "Current Stock (Packs)": {
    "en-IN": "Current Stock (Packs)",
    "hi-IN": "वर्तमान भंडार (पैक)",
    "pa-IN": "ਮੌਜੂਦਾ ਸਟਾਕ (ਪੈਕ)",
    "ta-IN": "தற்போதைய சரக்கு (பொட்டலங்கள்)",
  },
  "Threshold (Packs)": {
    "en-IN": "Threshold (Packs)",
    "hi-IN": "सीमा (पैक)",
    "pa-IN": "ਹੱਦ (ਪੈਕ)",
    "ta-IN": "வரம்பு (பொட்டலங்கள்)",
  },
  "Restock Now": {
    "en-IN": "Restock Now",
    "hi-IN": "अभी भंडार भरें",
    "pa-IN": "ਹੁਣ ਸਟਾਕ ਭਰੋ",
    "ta-IN": "இப்போது மறுசேமிப்பு செய்",
  },
  "Revenue Generated": {
    "en-IN": "Revenue Generated",
    "hi-IN": "कुल राजस्व",
    "pa-IN": "ਕੁੱਲ ਆਮਦਨ",
    "ta-IN": "ஈட்டிய வருவாய்",
  },
  "Treating Doctor": {
    "en-IN": "Treating Doctor",
    "hi-IN": "इलाज करने वाले डॉक्टर",
    "pa-IN": "ਇਲਾਜ ਕਰਨ ਵਾਲੇ ਡਾਕਟਰ",
    "ta-IN": "சிகிச்சை அளிக்கும் மருத்துவர்",
  },
  "Transaction ID": {
    "en-IN": "Transaction ID",
    "hi-IN": "लेन-देन आईडी",
    "pa-IN": "ਲੈਣ-ਦੇਣ ID",
    "ta-IN": "பரிவர்த்தனை அடையாள எண்",
  },
  "Reset Password": {
    "en-IN": "Reset Password",
    "hi-IN": "पासवर्ड रीसेट करें",
    "pa-IN": "ਪਾਸਵਰਡ ਰੀਸੈੱਟ ਕਰੋ",
    "ta-IN": "கடவுச்சொல்லை மீட்டமை",
  },
  "Enter your new password below.": {
    "en-IN": "Enter your new password below.",
    "hi-IN": "नीचे नया पासवर्ड दर्ज करें।",
    "pa-IN": "ਹੇਠਾਂ ਨਵਾਂ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ।",
    "ta-IN": "கீழே புதிய கடவுச்சொல்லை உள்ளிடவும்.",
  },
  "New Password": {
    "en-IN": "New Password",
    "hi-IN": "नया पासवर्ड",
    "pa-IN": "ਨਵਾਂ ਪਾਸਵਰਡ",
    "ta-IN": "புதிய கடவுச்சொல்",
  },
  "Confirm Password": {
    "en-IN": "Confirm Password",
    "hi-IN": "पासवर्ड की पुष्टि करें",
    "pa-IN": "ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    "ta-IN": "கடவுச்சொல்லை உறுதிப்படுத்து",
  },
  "Update Password": {
    "en-IN": "Update Password",
    "hi-IN": "पासवर्ड अपडेट करें",
    "pa-IN": "ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਕਰੋ",
    "ta-IN": "கடவுச்சொல்லைப் புதுப்பி",
  },
  "Cancel & Return to Login": {
    "en-IN": "Cancel & Return to Login",
    "hi-IN": "रद्द करें और लॉगिन पर लौटें",
    "pa-IN": "ਰੱਦ ਕਰੋ ਅਤੇ ਲੌਗਇਨ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    "ta-IN": "ரத்துசெய்து உள்நுழைவுக்குத் திரும்பு",
  },
  "Back to Public Overview": {
    "en-IN": "Back to Public Overview",
    "hi-IN": "सार्वजनिक परिचय पर लौटें",
    "pa-IN": "ਜਨਤਕ ਜਾਣਕਾਰੀ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    "ta-IN": "பொது அறிமுகத்திற்குத் திரும்பு",
  },
  "Select a Dashboard Profile to Enter": {
    "en-IN": "Select a Dashboard Profile to Enter",
    "hi-IN": "खोलने के लिए डैशबोर्ड प्रोफ़ाइल चुनें",
    "pa-IN": "ਖੋਲ੍ਹਣ ਲਈ ਡੈਸ਼ਬੋਰਡ ਪ੍ਰੋਫ਼ਾਈਲ ਚੁਣੋ",
    "ta-IN": "திறக்க டாஷ்போர்டு சுயவிவரத்தைத் தேர்ந்தெடுக்கவும்",
  },
  "Connecting Portal...": {
    "en-IN": "Connecting Portal...",
    "hi-IN": "पोर्टल से जुड़ रहे हैं...",
    "pa-IN": "ਪੋਰਟਲ ਨਾਲ ਜੁੜ ਰਿਹਾ ਹੈ...",
    "ta-IN": "இணையதளத்துடன் இணைக்கிறது...",
  },
  "Finance & CA Suite": {
    "en-IN": "Finance & CA Suite",
    "hi-IN": "वित्त और CA सुइट",
    "pa-IN": "ਵਿੱਤ ਅਤੇ CA ਸੂਟ",
    "ta-IN": "நிதி மற்றும் CA தொகுப்பு",
  },
  "Finance & Tax Compliance": {
    "en-IN": "Finance & Tax Compliance",
    "hi-IN": "वित्त और कर अनुपालन",
    "pa-IN": "ਵਿੱਤ ਅਤੇ ਟੈਕਸ ਪਾਲਣਾ",
    "ta-IN": "நிதி மற்றும் வரி இணக்கம்",
  },
  "Bank Reconciliation (BRS)": {
    "en-IN": "Bank Reconciliation (BRS)",
    "hi-IN": "बैंक मिलान (BRS)",
    "pa-IN": "ਬੈਂਕ ਮਿਲਾਨ (BRS)",
    "ta-IN": "வங்கி ஒப்புமை (BRS)",
  },
  "Need traditional email & password sign-in?": {
    "en-IN": "Need traditional email & password sign-in?",
    "hi-IN": "ईमेल और पासवर्ड से साइन इन करना है?",
    "pa-IN": "ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰਨਾ ਹੈ?",
    "ta-IN": "மின்னஞ்சல் மற்றும் கடவுச்சொல் மூலம் உள்நுழைய வேண்டுமா?",
  },
  "Email Address": {
    "en-IN": "Email Address",
    "hi-IN": "ईमेल पता",
    "pa-IN": "ਈਮੇਲ ਪਤਾ",
    "ta-IN": "மின்னஞ்சல் முகவரி",
  },
  "Forgot?": {
    "en-IN": "Forgot?",
    "hi-IN": "भूल गए?",
    "pa-IN": "ਭੁੱਲ ਗਏ?",
    "ta-IN": "மறந்துவிட்டீர்களா?",
  },
  "Back to Sign In": {
    "en-IN": "Back to Sign In",
    "hi-IN": "साइन इन पर लौटें",
    "pa-IN": "ਸਾਈਨ ਇਨ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    "ta-IN": "உள்நுழைவுக்குத் திரும்பு",
  },
  "Item Name": {
    "en-IN": "Item Name",
    "hi-IN": "वस्तु का नाम",
    "pa-IN": "ਚੀਜ਼ ਦਾ ਨਾਮ",
    "ta-IN": "பொருளின் பெயர்",
  },
  "Patient Details": {
    "en-IN": "Patient Details",
    "hi-IN": "मरीज़ का विवरण",
    "pa-IN": "ਮਰੀਜ਼ ਦੇ ਵੇਰਵੇ",
    "ta-IN": "நோயாளர் விவரங்கள்",
  },
  "Hospital Name": {
    "en-IN": "Hospital Name",
    "hi-IN": "अस्पताल का नाम",
    "pa-IN": "ਹਸਪਤਾਲ ਦਾ ਨਾਮ",
    "ta-IN": "மருத்துவமனை பெயர்",
  },
  "Full Name": {
    "en-IN": "Full Name",
    "hi-IN": "पूरा नाम",
    "pa-IN": "ਪੂਰਾ ਨਾਮ",
    "ta-IN": "முழுப் பெயர்",
  },
  "Calculation Method": {
    "en-IN": "Calculation Method",
    "hi-IN": "गणना विधि",
    "pa-IN": "ਗਣਨਾ ਵਿਧੀ",
    "ta-IN": "கணக்கீட்டு முறை",
  },
  "Payment Mode": {
    "en-IN": "Payment Mode",
    "hi-IN": "भुगतान का तरीका",
    "pa-IN": "ਭੁਗਤਾਨ ਦਾ ਤਰੀਕਾ",
    "ta-IN": "கட்டண முறை",
  },
  "Destination Clinic": {
    "en-IN": "Destination Clinic",
    "hi-IN": "गंतव्य क्लिनिक",
    "pa-IN": "ਮੰਜ਼ਿਲ ਕਲੀਨਿਕ",
    "ta-IN": "சேருமிட மருத்துவமனை",
  },
  "Expiry Date": {
    "en-IN": "Expiry Date",
    "hi-IN": "समाप्ति तिथि",
    "pa-IN": "ਮਿਆਦ ਪੁੱਗਣ ਦੀ ਤਾਰੀਖ਼",
    "ta-IN": "காலாவதி தேதி",
  },
  "Patient Name*": {
    "en-IN": "Patient Name*",
    "hi-IN": "मरीज़ का नाम*",
    "pa-IN": "ਮਰੀਜ਼ ਦਾ ਨਾਮ*",
    "ta-IN": "நோயாளர் பெயர்*",
  },
  "Patient Phone": {
    "en-IN": "Patient Phone",
    "hi-IN": "मरीज़ का फ़ोन",
    "pa-IN": "ਮਰੀਜ਼ ਦਾ ਫ਼ੋਨ",
    "ta-IN": "நோயாளர் தொலைபேசி",
  },
  "Patient Address": {
    "en-IN": "Patient Address",
    "hi-IN": "मरीज़ का पता",
    "pa-IN": "ਮਰੀਜ਼ ਦਾ ਪਤਾ",
    "ta-IN": "நோயாளர் முகவரி",
  },
  "Joining Date": {
    "en-IN": "Joining Date",
    "hi-IN": "शामिल होने की तारीख़",
    "pa-IN": "ਸ਼ਾਮਲ ਹੋਣ ਦੀ ਤਾਰੀਖ਼",
    "ta-IN": "சேர்ந்த தேதி",
  },
  "Privacy Policy": {
    "en-IN": "Privacy Policy",
    "hi-IN": "गोपनीयता नीति",
    "pa-IN": "ਪਰਦੇਦਾਰੀ ਨੀਤੀ",
    "ta-IN": "தனியுரிமைக் கொள்கை",
  },
  "Select Account...": {
    "en-IN": "Select Account...",
    "hi-IN": "खाता चुनें...",
    "pa-IN": "ਖਾਤਾ ਚੁਣੋ...",
    "ta-IN": "கணக்கைத் தேர்ந்தெடுக்கவும்...",
  },
  "Export CSV": {
    "en-IN": "Export CSV",
    "hi-IN": "CSV निर्यात करें",
    "pa-IN": "CSV ਐਕਸਪੋਰਟ ਕਰੋ",
    "ta-IN": "CSV ஏற்றுமதி செய்",
  },
  "Today's Revenue": {
    "en-IN": "Today's Revenue",
    "hi-IN": "आज का राजस्व",
    "pa-IN": "ਅੱਜ ਦੀ ਆਮਦਨ",
    "ta-IN": "இன்றைய வருவாய்",
  },
  "Total Transactions": {
    "en-IN": "Total Transactions",
    "hi-IN": "कुल लेन-देन",
    "pa-IN": "ਕੁੱਲ ਲੈਣ-ਦੇਣ",
    "ta-IN": "மொத்த பரிவர்த்தனைகள்",
  },
  "Manage Shifts": {
    "en-IN": "Manage Shifts",
    "hi-IN": "शिफ़्ट प्रबंधित करें",
    "pa-IN": "ਸ਼ਿਫ਼ਟਾਂ ਸੰਭਾਲੋ",
    "ta-IN": "பணி நேரங்களை நிர்வகி",
  },
  "ABHA ID:": {
    "en-IN": "ABHA ID:",
    "hi-IN": "ABHA आईडी:",
    "pa-IN": "ABHA ID:",
    "ta-IN": "ABHA அடையாள எண்:",
  },
  "Blood Pressure": {
    "en-IN": "Blood Pressure",
    "hi-IN": "रक्तचाप",
    "pa-IN": "ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ",
    "ta-IN": "இரத்த அழுத்தம்",
  },
  "Jan Aushadhi Generic": {
    "en-IN": "Jan Aushadhi Generic",
    "hi-IN": "जन औषधि जेनेरिक",
    "pa-IN": "ਜਨ ਔਸ਼ਧੀ ਜੈਨਰਿਕ",
    "ta-IN": "ஜன் அவுஷதி பொதுமருந்து",
  },
  "Pharmacy Sales": {
    "en-IN": "Pharmacy Sales",
    "hi-IN": "फ़ार्मेसी बिक्री",
    "pa-IN": "ਫਾਰਮੇਸੀ ਵਿਕਰੀ",
    "ta-IN": "மருந்தக விற்பனை",
  },
  "Clinic Name": {
    "en-IN": "Clinic Name",
    "hi-IN": "क्लिनिक का नाम",
    "pa-IN": "ਕਲੀਨਿਕ ਦਾ ਨਾਮ",
    "ta-IN": "மருத்துவமனை பெயர்",
  },
  "Hospital Wide / Global": {
    "en-IN": "Hospital Wide / Global",
    "hi-IN": "पूरे अस्पताल / वैश्विक",
    "pa-IN": "ਪੂਰੇ ਹਸਪਤਾਲ ਲਈ / ਗਲੋਬਲ",
    "ta-IN": "மருத்துவமனை முழுவதும் / உலகளாவிய",
  },
  "OPD Consultation": {
    "en-IN": "OPD Consultation",
    "hi-IN": "OPD परामर्श",
    "pa-IN": "OPD ਸਲਾਹ",
    "ta-IN": "வெளிநோயாளர் ஆலோசனை",
  },
  "Total Users": {
    "en-IN": "Total Users",
    "hi-IN": "कुल उपयोगकर्ता",
    "pa-IN": "ਕੁੱਲ ਵਰਤੋਂਕਾਰ",
    "ta-IN": "மொத்த பயனர்கள்",
  },
  "Current Bill": {
    "en-IN": "Current Bill",
    "hi-IN": "वर्तमान बिल",
    "pa-IN": "ਮੌਜੂਦਾ ਬਿੱਲ",
    "ta-IN": "தற்போதைய ரசீது",
  },
  "Bed Number": {
    "en-IN": "Bed Number",
    "hi-IN": "बिस्तर नंबर",
    "pa-IN": "ਬੈੱਡ ਨੰਬਰ",
    "ta-IN": "படுக்கை எண்",
  },
  "Search by name or batch...": {
    "en-IN": "Search by name or batch...",
    "hi-IN": "नाम या बैच से खोजें...",
    "pa-IN": "ਨਾਮ ਜਾਂ ਬੈਚ ਨਾਲ ਖੋਜੋ...",
    "ta-IN": "பெயர் அல்லது தொகுப்பின் மூலம் தேடவும்...",
  },
  "Item Reference Name": {
    "en-IN": "Item Reference Name",
    "hi-IN": "वस्तु का संदर्भ नाम",
    "pa-IN": "ਚੀਜ਼ ਦਾ ਹਵਾਲਾ ਨਾਮ",
    "ta-IN": "பொருள் குறிப்புப் பெயர்",
  },
  "Batch Number": {
    "en-IN": "Batch Number",
    "hi-IN": "बैच नंबर",
    "pa-IN": "ਬੈਚ ਨੰਬਰ",
    "ta-IN": "தொகுதி எண்",
  },
  "Payment Method": {
    "en-IN": "Payment Method",
    "hi-IN": "भुगतान विधि",
    "pa-IN": "ਭੁਗਤਾਨ ਵਿਧੀ",
    "ta-IN": "கட்டண முறை",
  },
  "Record Note": {
    "en-IN": "Record Note",
    "hi-IN": "नोट दर्ज करें",
    "pa-IN": "ਨੋਟ ਦਰਜ ਕਰੋ",
    "ta-IN": "குறிப்பைப் பதிவு செய்",
  },
  "Bank Details": {
    "en-IN": "Bank Details",
    "hi-IN": "बैंक विवरण",
    "pa-IN": "ਬੈਂਕ ਵੇਰਵੇ",
    "ta-IN": "வங்கி விவரங்கள்",
  },
  "Record Payment": {
    "en-IN": "Record Payment",
    "hi-IN": "भुगतान दर्ज करें",
    "pa-IN": "ਭੁਗਤਾਨ ਦਰਜ ਕਰੋ",
    "ta-IN": "கட்டணத்தைப் பதிவு செய்",
  },
  "Process Payroll": {
    "en-IN": "Process Payroll",
    "hi-IN": "वेतन प्रक्रिया करें",
    "pa-IN": "ਤਨਖ਼ਾਹ ਦੀ ਕਾਰਵਾਈ ਕਰੋ",
    "ta-IN": "ஊதியத்தைச் செயலாக்கு",
  },
  "Role*": {
    "en-IN": "Role*",
    "hi-IN": "भूमिका*",
    "pa-IN": "ਭੂਮਿਕਾ*",
    "ta-IN": "பங்கு*",
  },
  "Clinic Admin": {
    "en-IN": "Clinic Admin",
    "hi-IN": "क्लिनिक व्यवस्थापक",
    "pa-IN": "ਕਲੀਨਿਕ ਪ੍ਰਬੰਧਕ",
    "ta-IN": "மருத்துவமனை நிர்வாகி",
  },
  "Regular Staff": {
    "en-IN": "Regular Staff",
    "hi-IN": "नियमित कर्मचारी",
    "pa-IN": "ਨਿਯਮਤ ਸਟਾਫ਼",
    "ta-IN": "வழக்கமான பணியாளர்",
  },
  "Department*": {
    "en-IN": "Department*",
    "hi-IN": "विभाग*",
    "pa-IN": "ਵਿਭਾਗ*",
    "ta-IN": "துறை*",
  },
  "Select Dept": {
    "en-IN": "Select Dept",
    "hi-IN": "विभाग चुनें",
    "pa-IN": "ਵਿਭਾਗ ਚੁਣੋ",
    "ta-IN": "துறையைத் தேர்ந்தெடுக்கவும்",
  },
  "Contact Sales": {
    "en-IN": "Contact Sales",
    "hi-IN": "बिक्री टीम से संपर्क करें",
    "pa-IN": "ਵਿਕਰੀ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    "ta-IN": "விற்பனை அணியைத் தொடர்புகொள்ளவும்",
  },
  "Clinic Interface": {
    "en-IN": "Clinic Interface",
    "hi-IN": "क्लिनिक इंटरफ़ेस",
    "pa-IN": "ਕਲੀਨਿਕ ਇੰਟਰਫੇਸ",
    "ta-IN": "மருத்துவமனை இடைமுகம்",
  },
  "Hospital Interface": {
    "en-IN": "Hospital Interface",
    "hi-IN": "अस्पताल इंटरफ़ेस",
    "pa-IN": "ਹਸਪਤਾਲ ਇੰਟਰਫੇਸ",
    "ta-IN": "மருத்துவமனை இடைமுகம்",
  },
  "Enter your email": {
    "en-IN": "Enter your email",
    "hi-IN": "अपना ईमेल दर्ज करें",
    "pa-IN": "ਆਪਣਾ ਈਮੇਲ ਦਰਜ ਕਰੋ",
    "ta-IN": "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
  },
  "Primary contact for billing and verification links.": {
    "en-IN": "Primary contact for billing and verification links.",
    "hi-IN": "बिलिंग और सत्यापन लिंक के लिए मुख्य संपर्क।",
    "pa-IN": "ਬਿਲਿੰਗ ਅਤੇ ਤਸਦੀਕ ਲਿੰਕਾਂ ਲਈ ਮੁੱਖ ਸੰਪਰਕ।",
    "ta-IN": "கட்டணம் மற்றும் சரிபார்ப்பு இணைப்புகளுக்கான முதன்மை தொடர்பு.",
  },
  "Choose your primary brand color": {
    "en-IN": "Choose your primary brand color",
    "hi-IN": "अपने ब्रांड का मुख्य रंग चुनें",
    "pa-IN": "ਆਪਣੇ ਬ੍ਰਾਂਡ ਦਾ ਮੁੱਖ ਰੰਗ ਚੁਣੋ",
    "ta-IN": "உங்கள் முதன்மை பிராண்ட் நிறத்தைத் தேர்ந்தெடுக்கவும்",
  },
  "Create Organization": {
    "en-IN": "Create Organization",
    "hi-IN": "संस्था बनाएँ",
    "pa-IN": "ਸੰਸਥਾ ਬਣਾਓ",
    "ta-IN": "நிறுவனத்தை உருவாக்கவும்",
  },
  "Not a Hospital Owner?": {
    "en-IN": "Not a Hospital Owner?",
    "hi-IN": "क्या आप अस्पताल के मालिक नहीं हैं?",
    "pa-IN": "ਕੀ ਤੁਸੀਂ ਹਸਪਤਾਲ ਦੇ ਮਾਲਕ ਨਹੀਂ ਹੋ?",
    "ta-IN": "நீங்கள் மருத்துவமனை உரிமையாளர் இல்லையா?",
  },
  "I am a Clinic Admin (Fix My Role)": {
    "en-IN": "I am a Clinic Admin (Fix My Role)",
    "hi-IN": "मैं क्लिनिक व्यवस्थापक हूँ (मेरी भूमिका ठीक करें)",
    "pa-IN": "ਮੈਂ ਕਲੀਨਿਕ ਪ੍ਰਬੰਧਕ ਹਾਂ (ਮੇਰੀ ਭੂਮਿਕਾ ਠੀਕ ਕਰੋ)",
    "ta-IN": "நான் மருத்துவமனை நிர்வாகி (என் பொறுப்பைச் சரிசெய்)",
  },
  "Hospital Registered!": {
    "en-IN": "Hospital Registered!",
    "hi-IN": "अस्पताल पंजीकृत हो गया!",
    "pa-IN": "ਹਸਪਤਾਲ ਰਜਿਸਟਰ ਹੋ ਗਿਆ!",
    "ta-IN": "மருத்துவமனை பதிவு செய்யப்பட்டது!",
  },
  "Now, let's set up your first clinic location.": {
    "en-IN": "Now, let's set up your first clinic location.",
    "hi-IN": "अब अपना पहला क्लिनिक स्थान सेट करें।",
    "pa-IN": "ਹੁਣ ਆਪਣਾ ਪਹਿਲਾ ਕਲੀਨਿਕ ਸਥਾਨ ਸੈੱਟ ਕਰੋ।",
    "ta-IN": "இப்போது உங்கள் முதல் மருத்துவமனை இடத்தை அமைக்கவும்.",
  },
  "Clinic / Branch Name": {
    "en-IN": "Clinic / Branch Name",
    "hi-IN": "क्लिनिक / शाखा का नाम",
    "pa-IN": "ਕਲੀਨਿਕ / ਸ਼ਾਖਾ ਦਾ ਨਾਮ",
    "ta-IN": "மருத்துவமனை / கிளை பெயர்",
  },
  "Address / Location": {
    "en-IN": "Address / Location",
    "hi-IN": "पता / स्थान",
    "pa-IN": "ਪਤਾ / ਟਿਕਾਣਾ",
    "ta-IN": "முகவரி / இடம்",
  },
  "Launch Dashboard": {
    "en-IN": "Launch Dashboard",
    "hi-IN": "डैशबोर्ड खोलें",
    "pa-IN": "ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ",
    "ta-IN": "டாஷ்போர்டைத் திறக்கவும்",
  },
  "You can add more clinics and pharmacy counters later from the dashboard.": {
    "en-IN":
      "You can add more clinics and pharmacy counters later from the dashboard.",
    "hi-IN": "बाद में डैशबोर्ड से और क्लिनिक और फ़ार्मेसी काउंटर जोड़ सकते हैं।",
    "pa-IN": "ਬਾਅਦ ਵਿੱਚ ਡੈਸ਼ਬੋਰਡ ਤੋਂ ਹੋਰ ਕਲੀਨਿਕ ਅਤੇ ਫਾਰਮੇਸੀ ਕਾਊਂਟਰ ਜੋੜ ਸਕਦੇ ਹੋ।",
    "ta-IN":
      "பின்னர் டாஷ்போர்டிலிருந்து கூடுதல் மருத்துவமனைகளையும் மருந்தக கவுண்டர்களையும் சேர்க்கலாம்.",
  },
  "No logs found matching criteria.": {
    "en-IN": "No logs found matching criteria.",
    "hi-IN": "चुने गए मानदंडों से मेल खाने वाले लॉग नहीं मिले।",
    "pa-IN": "ਚੁਣੇ ਮਾਪਦੰਡਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਲੌਗ ਨਹੀਂ ਮਿਲੇ।",
    "ta-IN": "தேர்ந்தெடுத்த அளவுகோல்களுக்குப் பொருந்தும் பதிவுகள் இல்லை.",
  },
  "No ledger entries found for this period.": {
    "en-IN": "No ledger entries found for this period.",
    "hi-IN": "इस अवधि के लिए कोई खाता प्रविष्टि नहीं मिली।",
    "pa-IN": "ਇਸ ਮਿਆਦ ਲਈ ਕੋਈ ਖਾਤਾ ਐਂਟਰੀ ਨਹੀਂ ਮਿਲੀ।",
    "ta-IN": "இந்த காலத்திற்கான பேரேடு பதிவுகள் இல்லை.",
  },
  "No expenses found.": {
    "en-IN": "No expenses found.",
    "hi-IN": "कोई खर्च नहीं मिला।",
    "pa-IN": "ਕੋਈ ਖ਼ਰਚਾ ਨਹੀਂ ਮਿਲਿਆ।",
    "ta-IN": "செலவுகள் எதுவும் இல்லை.",
  },
  "No matching transactions": {
    "en-IN": "No matching transactions",
    "hi-IN": "कोई मेल खाता लेन-देन नहीं",
    "pa-IN": "ਕੋਈ ਮੇਲ ਖਾਂਦਾ ਲੈਣ-ਦੇਣ ਨਹੀਂ",
    "ta-IN": "பொருந்தும் பரிவர்த்தனைகள் இல்லை",
  },
  "Try adjusting your search query or channel filters": {
    "en-IN": "Try adjusting your search query or channel filters",
    "hi-IN": "खोज शब्द या चैनल फ़िल्टर बदलकर देखें।",
    "pa-IN": "ਖੋਜ ਸ਼ਬਦ ਜਾਂ ਚੈਨਲ ਫ਼ਿਲਟਰ ਬਦਲ ਕੇ ਵੇਖੋ।",
    "ta-IN": "தேடல் சொல் அல்லது வழி வடிகட்டிகளை மாற்றிப் பாருங்கள்.",
  },
  "No equipment found matching your criteria.": {
    "en-IN": "No equipment found matching your criteria.",
    "hi-IN": "आपके मानदंडों से मेल खारा कोई उपकरण नहीं मिला।",
    "pa-IN": "ਤੁਹਾਡੇ ਮਾਪਦੰਡਾਂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਕੋਈ ਸਾਜ਼ੋ-ਸਾਮਾਨ ਨਹੀਂ ਮਿਲਿਆ।",
    "ta-IN": "உங்கள் அளவுகோலுக்குப் பொருந்தும் உபகரணம் இல்லை.",
  },
  "No active staff found for this clinic.": {
    "en-IN": "No active staff found for this clinic.",
    "hi-IN": "इस क्लिनिक में कोई सक्रिय कर्मचारी नहीं मिला।",
    "pa-IN": "ਇਸ ਕਲੀਨਿਕ ਲਈ ਕੋਈ ਸਰਗਰਮ ਸਟਾਫ਼ ਨਹੀਂ ਮਿਲਿਆ।",
    "ta-IN": "இந்த மருத்துவமனையில் செயலில் உள்ள பணியாளர்கள் இல்லை.",
  },
  "A complete hospital management system focused on core business operations. Seamlessly manage clinic inventory, OPD billing, consultation fees, staff, and CA balance sheets.":
    {
      "en-IN":
        "A complete hospital management system focused on core business operations. Seamlessly manage clinic inventory, OPD billing, consultation fees, staff, and CA balance sheets.",
      "hi-IN":
        "मुख्य व्यावसायिक संचालन पर केंद्रित अस्पताल प्रबंधन प्रणाली। क्लिनिक भंडार, OPD बिलिंग, परामर्श शुल्क, कर्मचारी और CA बैलेंस शीट सहजता से प्रबंधित करें।",
      "pa-IN":
        "ਮੁੱਖ ਕਾਰੋਬਾਰੀ ਕਾਰਜਾਂ ਲਈ ਪੂਰਾ ਹਸਪਤਾਲ ਪ੍ਰਬੰਧਨ ਸਿਸਟਮ। ਕਲੀਨਿਕ ਸਟਾਕ, OPD ਬਿਲਿੰਗ, ਸਲਾਹ ਫ਼ੀਸ, ਸਟਾਫ਼ ਅਤੇ CA ਬੈਲੈਂਸ ਸ਼ੀਟ ਆਸਾਨੀ ਨਾਲ ਸੰਭਾਲੋ।",
      "ta-IN":
        "முக்கிய வணிகச் செயல்பாடுகளை மையமாகக் கொண்ட முழுமையான மருத்துவமனை மேலாண்மை அமைப்பு. சரக்கு, வெளிநோயாளர் கட்டணம், ஆலோசனைக் கட்டணம், பணியாளர்கள் மற்றும் கணக்குப் பதிவுகளை எளிதாக நிர்வகிக்கவும்.",
    },
  "Learn how AYUSETU helps hospitals and clinics run smoother operations across billing, inventory, staff workflows, and financial oversight.":
    {
      "en-IN":
        "Learn how AYUSETU helps hospitals and clinics run smoother operations across billing, inventory, staff workflows, and financial oversight.",
      "hi-IN":
        "जानें कि आयुसेतु बिलिंग, भंडार, कर्मचारी कार्यप्रवाह और वित्तीय निगरानी में अस्पतालों और क्लिनिकों का संचालन कैसे आसान बनाता है।",
      "pa-IN":
        "ਜਾਣੋ ਕਿ ਆਯੁਸੇਤੂ ਬਿਲਿੰਗ, ਸਟਾਕ, ਸਟਾਫ਼ ਦੇ ਕੰਮ ਅਤੇ ਵਿੱਤੀ ਨਿਗਰਾਨੀ ਵਿੱਚ ਹਸਪਤਾਲਾਂ ਅਤੇ ਕਲੀਨਿਕਾਂ ਦੀ ਮਦਦ ਕਿਵੇਂ ਕਰਦਾ ਹੈ।",
      "ta-IN":
        "கட்டணம், சரக்கு, பணியாளர் பணிச்சூழல் மற்றும் நிதிக் கண்காணிப்பில் மருத்துவமனைகளுக்கு ஆயுசேது எவ்வாறு உதவுகிறது என்பதை அறியுங்கள்.",
    },
  "Explore updates, announcements, and practical insights on hospital business operations, inventory control, and clinic financial workflows.":
    {
      "en-IN":
        "Explore updates, announcements, and practical insights on hospital business operations, inventory control, and clinic financial workflows.",
      "hi-IN":
        "अस्पताल संचालन, भंडार नियंत्रण और क्लिनिक वित्तीय कार्यप्रवाह पर अपडेट, घोषणाएँ और उपयोगी जानकारी देखें।",
      "pa-IN":
        "ਹਸਪਤਾਲ ਕਾਰਜ, ਸਟਾਕ ਨਿਯੰਤਰਣ ਅਤੇ ਕਲੀਨਿਕ ਦੇ ਵਿੱਤੀ ਕੰਮਾਂ ਬਾਰੇ ਅੱਪਡੇਟ, ਘੋਸ਼ਣਾਵਾਂ ਅਤੇ ਲਾਭਕਾਰੀ ਜਾਣਕਾਰੀ ਵੇਖੋ।",
      "ta-IN":
        "மருத்துவமனை செயல்பாடுகள், சரக்குக் கட்டுப்பாடு மற்றும் மருத்துவமனை நிதிப் பணிகள் குறித்த புதுப்பிப்புகள் மற்றும் அறிவிப்புகளைப் பாருங்கள்.",
    },
  "Connect with AYUSETU to discuss hospital operations, clinic inventory, OPD billing, staff workflows, and CA-ready reporting needs.":
    {
      "en-IN":
        "Connect with AYUSETU to discuss hospital operations, clinic inventory, OPD billing, staff workflows, and CA-ready reporting needs.",
      "hi-IN":
        "अस्पताल संचालन, क्लिनिक भंडार, OPD बिलिंग, कर्मचारी कार्यप्रवाह और CA रिपोर्टिंग पर आयुसेतु से बात करें।",
      "pa-IN":
        "ਹਸਪਤਾਲ ਕਾਰਜ, ਕਲੀਨਿਕ ਸਟਾਕ, OPD ਬਿਲਿੰਗ, ਸਟਾਫ਼ ਦੇ ਕੰਮ ਅਤੇ CA ਰਿਪੋਰਟਾਂ ਬਾਰੇ ਆਯੁਸੇਤੂ ਨਾਲ ਗੱਲ ਕਰੋ।",
      "ta-IN":
        "மருத்துவமனை செயல்பாடுகள், சரக்கு, வெளிநோயாளர் கட்டணம், பணியாளர் பணிச்சூழல் மற்றும் கணக்கறிக்கைகள் குறித்து ஆயுசேதுவுடன் பேசுங்கள்.",
    },
  "Streamline day-to-day clinic operations with centralized workflows for OPD billing, inventory, consultation fees, and staff coordination.":
    {
      "en-IN":
        "Streamline day-to-day clinic operations with centralized workflows for OPD billing, inventory, consultation fees, and staff coordination.",
      "hi-IN":
        "OPD बिलिंग, भंडार, परामर्श शुल्क और कर्मचारी समन्वय के केंद्रीकृत कार्यप्रवाह से रोज़मर्रा के क्लिनिक संचालन को आसान बनाएँ।",
      "pa-IN":
        "OPD ਬਿਲਿੰਗ, ਸਟਾਕ, ਸਲਾਹ ਫ਼ੀਸ ਅਤੇ ਸਟਾਫ਼ ਤਾਲਮੇਲ ਦੇ ਕੇਂਦਰੀਕ੍ਰਿਤ ਕੰਮਾਂ ਨਾਲ ਰੋਜ਼ਾਨਾ ਕਲੀਨਿਕ ਪ੍ਰਬੰਧਨ ਸੁਚਾਰੂ ਬਣਾਓ।",
      "ta-IN":
        "வெளிநோயாளர் கட்டணம், சரக்கு, ஆலோசனைக் கட்டணம் மற்றும் பணியாளர் ஒருங்கிணைப்புக்கான மையப்படுத்தப்பட்ட பணிச்சூழல்கள் மூலம் அன்றாட செயல்பாடுகளை எளிதாக்குங்கள்.",
    },
  "Get a unified command center for hospital business performance, from operations tracking and billing to inventory and staff management.":
    {
      "en-IN":
        "Get a unified command center for hospital business performance, from operations tracking and billing to inventory and staff management.",
      "hi-IN":
        "संचालन ट्रैकिंग और बिलिंग से लेकर भंडार और कर्मचारी प्रबंधन तक, अस्पताल के प्रदर्शन के लिए एकीकृत नियंत्रण केंद्र पाएँ।",
      "pa-IN":
        "ਕਾਰਜ ਨਿਗਰਾਨੀ ਅਤੇ ਬਿਲਿੰਗ ਤੋਂ ਲੈ ਕੇ ਸਟਾਕ ਅਤੇ ਸਟਾਫ਼ ਪ੍ਰਬੰਧਨ ਤੱਕ, ਹਸਪਤਾਲ ਦੇ ਪ੍ਰਦਰਸ਼ਨ ਲਈ ਇੱਕ ਸਾਂਝਾ ਕੰਟਰੋਲ ਕੇਂਦਰ ਲਵੋ।",
      "ta-IN":
        "செயல்பாட்டு கண்காணிப்பு, கட்டணம், சரக்கு மற்றும் பணியாளர் மேலாண்மை உள்ளிட்ட மருத்துவமனை செயல்திறனுக்கான ஒருங்கிணைந்த கட்டுப்பாட்டு மையத்தைப் பெறுங்கள்.",
    },
  "Read AYUSETU privacy practices for handling data across hospital and clinic operations, billing, and business management workflows.":
    {
      "en-IN":
        "Read AYUSETU privacy practices for handling data across hospital and clinic operations, billing, and business management workflows.",
      "hi-IN":
        "अस्पताल और क्लिनिक संचालन, बिलिंग तथा व्यवसाय प्रबंधन में डेटा संभालने की आयुसेतु गोपनीयता पद्धतियाँ पढ़ें।",
      "pa-IN":
        "ਹਸਪਤਾਲ ਅਤੇ ਕਲੀਨਿਕ ਕਾਰਜਾਂ, ਬਿਲਿੰਗ ਅਤੇ ਕਾਰੋਬਾਰੀ ਪ੍ਰਬੰਧਨ ਵਿੱਚ ਡਾਟਾ ਸੰਭਾਲਣ ਲਈ ਆਯੁਸੇਤੂ ਦੀ ਪਰਦੇਦਾਰੀ ਨੀਤੀ ਪੜ੍ਹੋ।",
      "ta-IN":
        "மருத்துவமனை செயல்பாடுகள், கட்டணம் மற்றும் வணிக மேலாண்மையில் தரவை கையாளும் ஆயுசேதுவின் தனியுரிமை நடைமுறைகளைப் படியுங்கள்.",
    },
  "Join AYUSETU and help build technology that improves hospital business operations, inventory systems, billing, and financial reporting.":
    {
      "en-IN":
        "Join AYUSETU and help build technology that improves hospital business operations, inventory systems, billing, and financial reporting.",
      "hi-IN":
        "आयुसेतु से जुड़ें और अस्पताल संचालन, भंडार प्रणालियों, बिलिंग तथा वित्तीय रिपोर्टिंग को बेहतर बनाने वाली तकनीक बनाएँ।",
      "pa-IN":
        "ਆਯੁਸੇਤੂ ਨਾਲ ਜੁੜੋ ਅਤੇ ਹਸਪਤਾਲ ਕਾਰਜ, ਸਟਾਕ ਸਿਸਟਮ, ਬਿਲਿੰਗ ਅਤੇ ਵਿੱਤੀ ਰਿਪੋਰਟਿੰਗ ਨੂੰ ਬਿਹਤਰ ਬਣਾਉਣ ਵਾਲੀ ਤਕਨਾਲੋਜੀ ਬਣਾਓ।",
      "ta-IN":
        "ஆயுசேதுவில் இணைந்து மருத்துவமனை செயல்பாடுகள், சரக்கு அமைப்புகள், கட்டணம் மற்றும் நிதி அறிக்கைகளை மேம்படுத்தும் தொழில்நுட்பத்தை உருவாக்குங்கள்.",
    },
  "Access support for AYUSETU features spanning inventory, OPD billing, consultation fees, staff workflows, and CA balance-sheet readiness.":
    {
      "en-IN":
        "Access support for AYUSETU features spanning inventory, OPD billing, consultation fees, staff workflows, and CA balance-sheet readiness.",
      "hi-IN":
        "भंडार, OPD बिलिंग, परामर्श शुल्क, कर्मचारी कार्यप्रवाह और CA बैलेंस शीट के लिए आयुसेतु सहायता पाएँ।",
      "pa-IN":
        "ਸਟਾਕ, OPD ਬਿਲਿੰਗ, ਸਲਾਹ ਫ਼ੀਸ, ਸਟਾਫ਼ ਦੇ ਕੰਮ ਅਤੇ CA ਬੈਲੈਂਸ ਸ਼ੀਟ ਲਈ ਆਯੁਸੇਤੂ ਸਹਾਇਤਾ ਲਵੋ।",
      "ta-IN":
        "சரக்கு, வெளிநோயாளர் கட்டணம், ஆலோசனைக் கட்டணம், பணியாளர் பணிச்சூழல் மற்றும் கணக்கறிக்கைகளுக்கான ஆயுசேது ஆதரவைப் பெறுங்கள்.",
    },
};

const reverseCopy = new Map<string, string>();
const englishCopy = new Set<string>();
const textOrigins = new WeakMap<Text, { source: string; rendered: string }>();
const attributeOrigins = new WeakMap<
  Element,
  Map<string, { source: string; rendered: string }>
>();
const allCatalogs = [
  copy,
  websiteDashboardCopy,
  websiteFinanceCopy,
  websiteClinicalCopy,
  websiteBillingCopy,
  websiteSettingsCopy,
  websiteRoutedCopy,
  websitePublicCopy,
];
const allCatalogsWithAdditional = [
  ...allCatalogs,
  websiteClinicianCopy,
  websiteMarketingCopy,
  websiteRoutesExtraCopy,
];
for (const catalog of allCatalogsWithAdditional) {
  for (const english of Object.keys(catalog)) englishCopy.add(english);
}
for (const [english, translations] of Object.entries(websitePublicCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteDashboardCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteFinanceCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteClinicalCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteBillingCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteSettingsCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteRoutedCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteClinicianCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteMarketingCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(websiteRoutesExtraCopy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}
for (const [english, translations] of Object.entries(copy)) {
  for (const translated of Object.values(translations))
    reverseCopy.set(translated, english);
}

const localeStorageKey = "ayusetu.website.locale";
const supportedLocales = Object.keys(websiteLocales) as WebsiteLocale[];

export function getWebsiteLocale(): WebsiteLocale {
  try {
    const saved = localStorage.getItem(localeStorageKey);
    if (saved && supportedLocales.includes(saved as WebsiteLocale))
      return saved as WebsiteLocale;
  } catch {
    // Private browsing can disable storage; English remains a safe default.
  }
  return "en-IN";
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function translateWebsiteCopy(
  text: string,
  locale: WebsiteLocale,
): string {
  const normalized = normalize(text);
  const english = englishCopy.has(normalized)
    ? normalized
    : (reverseCopy.get(normalized) ?? normalized);
  const translated =
    copy[english]?.[locale] ??
    websiteDashboardCopy[english]?.[locale] ??
    websiteFinanceCopy[english]?.[locale] ??
    websiteClinicalCopy[english]?.[locale] ??
    websiteBillingCopy[english]?.[locale] ??
    websiteSettingsCopy[english]?.[locale] ??
    websiteRoutedCopy[english]?.[locale] ??
    websiteClinicianCopy[english]?.[locale] ??
    websiteMarketingCopy[english]?.[locale] ??
    websiteRoutesExtraCopy[english]?.[locale] ??
    websitePublicCopy[english]?.[locale];
  if (!translated) return text;
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function translateTrackedText(node: Text, locale: WebsiteLocale) {
  const value = node.nodeValue;
  if (value === null) return;
  const previous = textOrigins.get(node);
  const source =
    previous && value === previous.rendered ? previous.source : value;
  const rendered = translateWebsiteCopy(source, locale);
  textOrigins.set(node, { source, rendered });
  if (rendered !== value) node.nodeValue = rendered;
}

function translateTrackedAttribute(
  element: Element,
  attr: string,
  locale: WebsiteLocale,
) {
  const value = element.getAttribute(attr);
  if (!value) return;
  let attributes = attributeOrigins.get(element);
  if (!attributes) {
    attributes = new Map();
    attributeOrigins.set(element, attributes);
  }
  const previous = attributes.get(attr);
  const source =
    previous && value === previous.rendered ? previous.source : value;
  const rendered = translateWebsiteCopy(source, locale);
  attributes.set(attr, { source, rendered });
  if (rendered !== value) element.setAttribute(attr, rendered);
}

function translateElement(element: Element, locale: WebsiteLocale) {
  const attrs = ["aria-label", "placeholder", "title", "alt"];
  for (const attr of attrs) {
    translateTrackedAttribute(element, attr, locale);
  }
  if (
    element.tagName === "META" &&
    element.getAttribute("name") === "description"
  ) {
    translateTrackedAttribute(element, "content", locale);
  }
  if (
    element instanceof HTMLInputElement &&
    ["button", "submit", "reset"].includes(element.type)
  ) {
    const previous = attributeOrigins.get(element)?.get("value");
    const source =
      previous && element.value === previous.rendered
        ? previous.source
        : element.value;
    const rendered = translateWebsiteCopy(source, locale);
    let attributes = attributeOrigins.get(element);
    if (!attributes) {
      attributes = new Map();
      attributeOrigins.set(element, attributes);
    }
    attributes.set("value", { source, rendered });
    if (rendered !== element.value) element.value = rendered;
  }
}

export function applyWebsiteLocale(root: Node, locale: WebsiteLocale) {
  if (root instanceof HTMLElement) root.lang = locale;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const current = node;
    node = walker.nextNode();
    const parent = current.parentElement;
    if (
      !parent ||
      parent.closest("script,style,textarea,input,[data-no-translate]")
    )
      continue;
    if (!current.nodeValue) continue;
    translateTrackedText(current as Text, locale);
  }
  if (root instanceof Element) translateElement(root, locale);
  const queryRoot = root as unknown as {
    querySelectorAll: (selector: string) => ArrayLike<Element>;
  };
  Array.from(queryRoot.querySelectorAll("*")).forEach((element) => {
    translateElement(element, locale);
  });
  document.documentElement.lang = locale;
}

export function setWebsiteLocale(locale: WebsiteLocale) {
  try {
    localStorage.setItem(localeStorageKey, locale);
  } catch {
    // The selected language remains active for this page view.
  }
  document.dispatchEvent(
    new CustomEvent("ayusetu:locale-change", { detail: locale }),
  );
}

export function startWebsiteLocalization(): () => void {
  let locale = getWebsiteLocale();
  applyWebsiteLocale(document.documentElement, locale);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) applyWebsiteLocale(node, locale);
        else if (node instanceof Text && node.parentElement) {
          translateTrackedText(node, locale);
        }
      }
      if (
        mutation.type === "characterData" &&
        mutation.target instanceof Text
      ) {
        translateTrackedText(mutation.target, locale);
      }
      if (
        mutation.type === "attributes" &&
        mutation.target instanceof Element
      ) {
        translateElement(mutation.target, locale);
      }
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [
      "aria-label",
      "placeholder",
      "title",
      "alt",
      "content",
      "value",
    ],
  });
  const update = (event: Event) => {
    const selected = (event as CustomEvent<WebsiteLocale>).detail;
    if (!supportedLocales.includes(selected)) return;
    locale = selected;
    applyWebsiteLocale(document.documentElement, locale);
    Array.from(document.querySelectorAll("[data-website-locale]")).forEach(
      (node) => {
        (node as unknown as HTMLSelectElement).value = locale;
      },
    );
  };
  document.addEventListener("ayusetu:locale-change", update);
  const onChange = (event: Event) => {
    const target = event.target;
    if (
      target instanceof HTMLSelectElement &&
      target.matches("[data-website-locale]")
    ) {
      setWebsiteLocale(target.value as WebsiteLocale);
    }
  };
  document.addEventListener("change", onChange);
  Array.from(document.querySelectorAll("[data-website-locale]")).forEach(
    (node) => {
      (node as unknown as HTMLSelectElement).value = locale;
    },
  );
  return () => {
    observer.disconnect();
    document.removeEventListener("ayusetu:locale-change", update);
    document.removeEventListener("change", onChange);
  };
}
