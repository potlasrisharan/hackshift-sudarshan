import type { WebsiteLocale } from "./website";

/** Reviewed fixed billing, receipt, notification, and testimonial UI copy.
 * Dynamic account, clinic, patient, transaction, and user-entered values stay untouched.
 */
export const websiteBillingCopy: Record<
  string,
  Record<WebsiteLocale, string>
> = {
  "Current billing period": {
    "en-IN": "Current billing period",
    "hi-IN": "वर्तमान बिलिंग अवधि",
    "pa-IN": "ਮੌਜੂਦਾ ਬਿਲਿੰਗ ਮਿਆਦ",
    "ta-IN": "தற்போதைய கட்டணக் காலம்",
  },
  MRR: {
    "en-IN": "MRR",
    "hi-IN": "मासिक आवर्ती आय",
    "pa-IN": "ਮਹੀਨਾਵਾਰ ਆਵਰਤੀ ਆਮਦਨ",
    "ta-IN": "மாதாந்திர தொடர்ச்சியான வருவாய்",
  },
  Paid: {
    "en-IN": "Paid",
    "hi-IN": "भुगतान किया गया",
    "pa-IN": "ਭੁਗਤਾਨ ਕੀਤਾ ਗਿਆ",
    "ta-IN": "செலுத்தப்பட்டது",
  },
  Trialing: {
    "en-IN": "Trialing",
    "hi-IN": "परीक्षण अवधि में",
    "pa-IN": "ਅਜ਼ਮਾਇਸ਼ ਮਿਆਦ ਵਿੱਚ",
    "ta-IN": "சோதனைக் காலத்தில்",
  },
  "active trials": {
    "en-IN": "active trials",
    "hi-IN": "सक्रिय परीक्षण अवधि",
    "pa-IN": "ਚਾਲੂ ਅਜ਼ਮਾਇਸ਼ਾਂ",
    "ta-IN": "செயலில் உள்ள சோதனைகள்",
  },
  "failed payments": {
    "en-IN": "failed payments",
    "hi-IN": "विफल भुगतान",
    "pa-IN": "ਅਸਫਲ ਭੁਗਤਾਨ",
    "ta-IN": "தோல்வியடைந்த கட்டணங்கள்",
  },
  "Trial Extension Requests": {
    "en-IN": "Trial Extension Requests",
    "hi-IN": "परीक्षण अवधि बढ़ाने के अनुरोध",
    "pa-IN": "ਅਜ਼ਮਾਇਸ਼ ਮਿਆਦ ਵਧਾਉਣ ਦੀਆਂ ਬੇਨਤੀਆਂ",
    "ta-IN": "சோதனைக் கால நீட்டிப்பு கோரிக்கைகள்",
  },
  "/mo": {
    "en-IN": "/mo",
    "hi-IN": "/माह",
    "pa-IN": "/ਮਹੀਨਾ",
    "ta-IN": "/மாதம்",
  },
  Custom: {
    "en-IN": "Custom",
    "hi-IN": "अनुकूलित",
    "pa-IN": "ਕਸਟਮ",
    "ta-IN": "தனிப்பயன்",
  },
  "Account Paused (Read-Only) — Subscribe to resume": {
    "en-IN": "Account Paused (Read-Only) — Subscribe to resume",
    "hi-IN": "खाता रुका हुआ है (केवल पढ़ने के लिए) — फिर से शुरू करने के लिए सदस्यता लें",
    "pa-IN": "ਖਾਤਾ ਰੋਕਿਆ ਗਿਆ ਹੈ (ਸਿਰਫ਼ ਪੜ੍ਹਨ ਲਈ) — ਮੁੜ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਗਾਹਕੀ ਲਵੋ",
    "ta-IN":
      "கணக்கு இடைநிறுத்தப்பட்டுள்ளது (படிக்க மட்டும்) — மீண்டும் தொடங்க சந்தா செலுத்தவும்",
  },
  "All Clear": {
    "en-IN": "All Clear",
    "hi-IN": "सब ठीक है",
    "pa-IN": "ਸਭ ਠੀਕ ਹੈ",
    "ta-IN": "அனைத்தும் சரியாக உள்ளது",
  },
  Approve: {
    "en-IN": "Approve",
    "hi-IN": "स्वीकृत करें",
    "pa-IN": "ਮਨਜ਼ੂਰ ਕਰੋ",
    "ta-IN": "ஒப்புதல் அளிக்கவும்",
  },
  "Billing Cycle": {
    "en-IN": "Billing Cycle",
    "hi-IN": "बिलिंग चक्र",
    "pa-IN": "ਬਿਲਿੰਗ ਚੱਕਰ",
    "ta-IN": "கட்டணச் சுழற்சி",
  },
  "Contact Email": {
    "en-IN": "Contact Email",
    "hi-IN": "संपर्क ईमेल",
    "pa-IN": "ਸੰਪਰਕ ਈਮੇਲ",
    "ta-IN": "தொடர்பு மின்னஞ்சல்",
  },
  "Contact us": {
    "en-IN": "Contact us",
    "hi-IN": "हमसे संपर्क करें",
    "pa-IN": "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    "ta-IN": "எங்களைத் தொடர்புகொள்ளவும்",
  },
  "Contact us for pricing": {
    "en-IN": "Contact us for pricing",
    "hi-IN": "कीमत जानने के लिए संपर्क करें",
    "pa-IN": "ਕੀਮਤ ਲਈ ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    "ta-IN": "விலை விவரங்களுக்கு எங்களைத் தொடர்புகொள்ளவும்",
  },
  "Critical Stock Alert": {
    "en-IN": "Critical Stock Alert",
    "hi-IN": "स्टॉक की गंभीर चेतावनी",
    "pa-IN": "ਸਟਾਕ ਦੀ ਗੰਭੀਰ ਚੇਤਾਵਨੀ",
    "ta-IN": "முக்கியமான இருப்பு எச்சரிக்கை",
  },
  "Current Stock (Packs)": {
    "en-IN": "Current Stock (Packs)",
    "hi-IN": "मौजूदा स्टॉक (पैक)",
    "pa-IN": "ਮੌਜੂਦਾ ਸਟਾਕ (ਪੈਕ)",
    "ta-IN": "தற்போதைய இருப்பு (பொதிகள்)",
  },
  "Detailed information about this notification and related actions": {
    "en-IN": "Detailed information about this notification and related actions",
    "hi-IN": "इस सूचना और संबंधित कार्रवाइयों की विस्तृत जानकारी",
    "pa-IN": "ਇਸ ਸੂਚਨਾ ਅਤੇ ਸੰਬੰਧਿਤ ਕਾਰਵਾਈਆਂ ਬਾਰੇ ਵਿਸਥਾਰਪੂਰਵਕ ਜਾਣਕਾਰੀ",
    "ta-IN": "இந்த அறிவிப்பு மற்றும் தொடர்புடைய செயல்கள் பற்றிய விரிவான தகவல்",
  },
  "Extend for free": {
    "en-IN": "Extend for free",
    "hi-IN": "निःशुल्क बढ़ाएँ",
    "pa-IN": "ਮੁਫ਼ਤ ਵਧਾਓ",
    "ta-IN": "இலவசமாக நீட்டிக்கவும்",
  },
  "Extend Trial for Free": {
    "en-IN": "Extend Trial for Free",
    "hi-IN": "ट्रायल निःशुल्क बढ़ाएँ",
    "pa-IN": "ਟ੍ਰਾਇਲ ਮੁਫ਼ਤ ਵਧਾਓ",
    "ta-IN": "சோதனைக் காலத்தை இலவசமாக நீட்டிக்கவும்",
  },
  "Extension Request Pending": {
    "en-IN": "Extension Request Pending",
    "hi-IN": "अवधि बढ़ाने का अनुरोध लंबित है",
    "pa-IN": "ਮਿਆਦ ਵਧਾਉਣ ਦੀ ਬੇਨਤੀ ਬਕਾਇਆ ਹੈ",
    "ta-IN": "நீட்டிப்பு கோரிக்கை நிலுவையில் உள்ளது",
  },
  "Expiry/Renews": {
    "en-IN": "Expiry/Renews",
    "hi-IN": "समाप्ति/नवीनीकरण",
    "pa-IN": "ਮਿਆਦ ਪੁੱਗਣ/ਨਵੀਨੀਕਰਨ",
    "ta-IN": "காலாவதி/புதுப்பிப்பு",
  },
  "Failed to pause clinics. Please try again or contact support.": {
    "en-IN": "Failed to pause clinics. Please try again or contact support.",
    "hi-IN": "क्लिनिक रोकने में विफल। कृपया फिर प्रयास करें या सहायता से संपर्क करें।",
    "pa-IN":
      "ਕਲੀਨਿਕ ਰੋਕਣ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    "ta-IN":
      "கிளினிக்குகளை இடைநிறுத்த முடியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது ஆதரவைத் தொடர்புகொள்ளவும்.",
  },
  Hospital: {
    "en-IN": "Hospital",
    "hi-IN": "अस्पताल",
    "pa-IN": "ਹਸਪਤਾਲ",
    "ta-IN": "மருத்துவமனை",
  },
  "Hospital Usage Limit Reached": {
    "en-IN": "Hospital Usage Limit Reached",
    "hi-IN": "अस्पताल की उपयोग सीमा पूरी हो गई",
    "pa-IN": "ਹਸਪਤਾਲ ਦੀ ਵਰਤੋਂ ਸੀਮਾ ਪੂਰੀ ਹੋ ਗਈ",
    "ta-IN": "மருத்துவமனை பயன்பாட்டு வரம்பு எட்டப்பட்டது",
  },
  "How would you rate AyuSetu?": {
    "en-IN": "How would you rate AyuSetu?",
    "hi-IN": "आप आयुसेतु को कितनी रेटिंग देंगे?",
    "pa-IN": "ਤੁਸੀਂ ਆਯੁਸੇਤੂ ਨੂੰ ਕਿੰਨੀ ਰੇਟਿੰਗ ਦਿਓਗੇ?",
    "ta-IN": "ஆயுசேதுவுக்கு நீங்கள் எவ்வளவு மதிப்பீடு அளிப்பீர்கள்?",
  },
  "Important Data Deletion Notice": {
    "en-IN": "Important Data Deletion Notice",
    "hi-IN": "डेटा हटाने की महत्वपूर्ण सूचना",
    "pa-IN": "ਡਾਟਾ ਮਿਟਾਉਣ ਬਾਰੇ ਮਹੱਤਵਪੂਰਨ ਸੂਚਨਾ",
    "ta-IN": "தரவு நீக்கம் குறித்த முக்கிய அறிவிப்பு",
  },
  "Invoice History": {
    "en-IN": "Invoice History",
    "hi-IN": "चालान इतिहास",
    "pa-IN": "ਚਲਾਨ ਇਤਿਹਾਸ",
    "ta-IN": "விலைப்பட்டியல் வரலாறு",
  },
  "Invoices will appear here once you subscribe to a paid plan.": {
    "en-IN": "Invoices will appear here once you subscribe to a paid plan.",
    "hi-IN": "भुगतान वाली योजना की सदस्यता लेने के बाद चालान यहाँ दिखाई देंगे।",
    "pa-IN": "ਭੁਗਤਾਨ ਵਾਲੀ ਯੋਜਨਾ ਦੀ ਗਾਹਕੀ ਲੈਣ ਤੋਂ ਬਾਅਦ ਚਲਾਨ ਇੱਥੇ ਦਿਖਣਗੇ।",
    "ta-IN": "கட்டணத் திட்டத்தில் சேர்ந்த பிறகு விலைப்பட்டியல்கள் இங்கே தோன்றும்.",
  },
  "Item Description": {
    "en-IN": "Item Description",
    "hi-IN": "वस्तु का विवरण",
    "pa-IN": "ਆਈਟਮ ਦਾ ਵੇਰਵਾ",
    "ta-IN": "பொருள் விவரம்",
  },
  "Item Name": {
    "en-IN": "Item Name",
    "hi-IN": "वस्तु का नाम",
    "pa-IN": "ਆਈਟਮ ਦਾ ਨਾਮ",
    "ta-IN": "பொருளின் பெயர்",
  },
  "Link to YouTube, Loom, or Drive video": {
    "en-IN": "Link to YouTube, Loom, or Drive video",
    "hi-IN": "YouTube, Loom या Drive वीडियो का लिंक",
    "pa-IN": "YouTube, Loom ਜਾਂ Drive ਵੀਡੀਓ ਦਾ ਲਿੰਕ",
    "ta-IN": "YouTube, Loom அல்லது Drive வீடியோ இணைப்பு",
  },
  "Manually Extend Trial (+8 days)": {
    "en-IN": "Manually Extend Trial (+8 days)",
    "hi-IN": "ट्रायल मैन्युअल रूप से बढ़ाएँ (+8 दिन)",
    "pa-IN": "ਟ੍ਰਾਇਲ ਹੱਥੀਂ ਵਧਾਓ (+8 ਦਿਨ)",
    "ta-IN": "சோதனைக் காலத்தை கைமுறையாக நீட்டிக்கவும் (+8 நாட்கள்)",
  },
  "Minimum 20 words recommended": {
    "en-IN": "Minimum 20 words recommended",
    "hi-IN": "कम से कम 20 शब्द लिखने की सलाह है",
    "pa-IN": "ਘੱਟੋ-ਘੱਟ 20 ਸ਼ਬਦ ਲਿਖਣ ਦੀ ਸਲਾਹ ਹੈ",
    "ta-IN": "குறைந்தது 20 சொற்கள் எழுத பரிந்துரைக்கப்படுகிறது",
  },
  Monthly: {
    "en-IN": "Monthly",
    "hi-IN": "मासिक",
    "pa-IN": "ਮਾਸਿਕ",
    "ta-IN": "மாதாந்திரம்",
  },
  "Most Popular": {
    "en-IN": "Most Popular",
    "hi-IN": "सबसे लोकप्रिय",
    "pa-IN": "ਸਭ ਤੋਂ ਮਸ਼ਹੂਰ",
    "ta-IN": "மிகவும் பிரபலமானது",
  },
  "No invoices yet": {
    "en-IN": "No invoices yet",
    "hi-IN": "अभी कोई चालान नहीं है",
    "pa-IN": "ਹਾਲੇ ਕੋਈ ਚਲਾਨ ਨਹੀਂ ਹੈ",
    "ta-IN": "இன்னும் விலைப்பட்டியல்கள் இல்லை",
  },
  "No notifications yet today": {
    "en-IN": "No notifications yet today",
    "hi-IN": "आज अभी तक कोई सूचना नहीं",
    "pa-IN": "ਅੱਜ ਹਾਲੇ ਤੱਕ ਕੋਈ ਸੂਚਨਾ ਨਹੀਂ",
    "ta-IN": "இன்று இதுவரை அறிவிப்புகள் இல்லை",
  },
  "No pending extension requests at the moment.": {
    "en-IN": "No pending extension requests at the moment.",
    "hi-IN": "इस समय अवधि बढ़ाने का कोई अनुरोध लंबित नहीं है।",
    "pa-IN": "ਇਸ ਵੇਲੇ ਮਿਆਦ ਵਧਾਉਣ ਦੀ ਕੋਈ ਬੇਨਤੀ ਬਕਾਇਆ ਨਹੀਂ ਹੈ।",
    "ta-IN": "தற்போது நீட்டிப்பு கோரிக்கைகள் எதுவும் நிலுவையில் இல்லை.",
  },
  Notifications: {
    "en-IN": "Notifications",
    "hi-IN": "सूचनाएँ",
    "pa-IN": "ਸੂਚਨਾਵਾਂ",
    "ta-IN": "அறிவிப்புகள்",
  },
  "Official Invoice": {
    "en-IN": "Official Invoice",
    "hi-IN": "आधिकारिक चालान",
    "pa-IN": "ਅਧਿਕਾਰਤ ਚਲਾਨ",
    "ta-IN": "அதிகாரப்பூர்வ விலைப்பட்டியல்",
  },
  "Permanently Delete Hospital Data": {
    "en-IN": "Permanently Delete Hospital Data",
    "hi-IN": "अस्पताल का डेटा स्थायी रूप से हटाएँ",
    "pa-IN": "ਹਸਪਤਾਲ ਦਾ ਡਾਟਾ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟਾਓ",
    "ta-IN": "மருத்துவமனைத் தரவை நிரந்தரமாக நீக்கவும்",
  },
  "Paused clinics will be completely inaccessible and their data will be permanently deleted after 30 days.":
    {
      "en-IN":
        "Paused clinics will be completely inaccessible and their data will be permanently deleted after 30 days.",
      "hi-IN":
        "रुके हुए क्लिनिक पूरी तरह अनुपलब्ध होंगे और उनका डेटा 30 दिनों बाद स्थायी रूप से मिटा दिया जाएगा।",
      "pa-IN":
        "ਰੋਕੇ ਗਏ ਕਲੀਨਿਕ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਹੁੰਚ ਤੋਂ ਬਾਹਰ ਹੋਣਗੇ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਡਾਟਾ 30 ਦਿਨਾਂ ਬਾਅਦ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟਾ ਦਿੱਤਾ ਜਾਵੇਗਾ।",
      "ta-IN":
        "இடைநிறுத்தப்பட்ட கிளினிக்குகளை அணுக முடியாது; அவற்றின் தரவு 30 நாட்களுக்குப் பிறகு நிரந்தரமாக நீக்கப்படும்.",
    },
  "Payment failed — your account may be restricted soon": {
    "en-IN": "Payment failed — your account may be restricted soon",
    "hi-IN": "भुगतान विफल — आपका खाता जल्द सीमित किया जा सकता है",
    "pa-IN": "ਭੁਗਤਾਨ ਅਸਫਲ — ਤੁਹਾਡੇ ਖਾਤੇ 'ਤੇ ਜਲਦੀ ਪਾਬੰਦੀ ਲੱਗ ਸਕਦੀ ਹੈ",
    "ta-IN": "கட்டணம் தோல்வியடைந்தது — உங்கள் கணக்கு விரைவில் கட்டுப்படுத்தப்படலாம்",
  },
  "Payment overdue — please update your payment method": {
    "en-IN": "Payment overdue — please update your payment method",
    "hi-IN": "भुगतान बकाया है — कृपया भुगतान का तरीका अपडेट करें",
    "pa-IN": "ਭੁਗਤਾਨ ਬਕਾਇਆ ਹੈ — ਕਿਰਪਾ ਕਰਕੇ ਭੁਗਤਾਨ ਦਾ ਤਰੀਕਾ ਅੱਪਡੇਟ ਕਰੋ",
    "ta-IN": "கட்டணம் நிலுவையில் உள்ளது — உங்கள் கட்டண முறையைப் புதுப்பிக்கவும்",
  },
  Paused: {
    "en-IN": "Paused",
    "hi-IN": "रुका हुआ",
    "pa-IN": "ਰੋਕਿਆ ਹੋਇਆ",
    "ta-IN": "இடைநிறுத்தப்பட்டது",
  },
  "Pause Selected Clinics": {
    "en-IN": "Pause Selected Clinics",
    "hi-IN": "चुने हुए क्लिनिक रोकें",
    "pa-IN": "ਚੁਣੇ ਕਲੀਨਿਕ ਰੋਕੋ",
    "ta-IN": "தேர்ந்தெடுத்த கிளினிக்குகளை இடைநிறுத்தவும்",
  },
  "Pause Subscription": {
    "en-IN": "Pause Subscription",
    "hi-IN": "सदस्यता रोकें",
    "pa-IN": "ਗਾਹਕੀ ਰੋਕੋ",
    "ta-IN": "சந்தாவை இடைநிறுத்தவும்",
  },
  "Pausing Clinics...": {
    "en-IN": "Pausing Clinics...",
    "hi-IN": "क्लिनिक रोके जा रहे हैं...",
    "pa-IN": "ਕਲੀਨਿਕ ਰੋਕੇ ਜਾ ਰਹੇ ਹਨ...",
    "ta-IN": "கிளினிக்குகள் இடைநிறுத்தப்படுகின்றன...",
  },
  "Past Due": {
    "en-IN": "Past Due",
    "hi-IN": "भुगतान बकाया",
    "pa-IN": "ਭੁਗਤਾਨ ਬਕਾਇਆ",
    "ta-IN": "நிலுவை",
  },
  Patient: {
    "en-IN": "Patient",
    "hi-IN": "मरीज़",
    "pa-IN": "ਮਰੀਜ਼",
    "ta-IN": "நோயாளர்",
  },
  "Pending Data Deletion Requests": {
    "en-IN": "Pending Data Deletion Requests",
    "hi-IN": "डेटा हटाने के लंबित अनुरोध",
    "pa-IN": "ਡਾਟਾ ਮਿਟਾਉਣ ਦੀਆਂ ਬਕਾਇਆ ਬੇਨਤੀਆਂ",
    "ta-IN": "நிலுவையில் உள்ள தரவு நீக்க கோரிக்கைகள்",
  },
  Plan: {
    "en-IN": "Plan",
    "hi-IN": "योजना",
    "pa-IN": "ਯੋਜਨਾ",
    "ta-IN": "திட்டம்",
  },
  "Plan Distribution": {
    "en-IN": "Plan Distribution",
    "hi-IN": "योजना वितरण",
    "pa-IN": "ਯੋਜਨਾ ਵੰਡ",
    "ta-IN": "திட்டப் பகிர்வு",
  },
  "Platform-wide billing overview": {
    "en-IN": "Platform-wide billing overview",
    "hi-IN": "पूरे प्लेटफ़ॉर्म का बिलिंग सारांश",
    "pa-IN": "ਪੂਰੇ ਪਲੇਟਫਾਰਮ ਦੀ ਬਿਲਿੰਗ ਜਾਣਕਾਰੀ",
    "ta-IN": "தளம் முழுவதற்குமான கட்டணக் கண்ணோட்டம்",
  },
  Price: {
    "en-IN": "Price",
    "hi-IN": "कीमत",
    "pa-IN": "ਕੀਮਤ",
    "ta-IN": "விலை",
  },
  "PRO TIP": {
    "en-IN": "PRO TIP",
    "hi-IN": "खास सुझाव",
    "pa-IN": "ਖਾਸ ਸੁਝਾਅ",
    "ta-IN": "சிறந்த உதவிக்குறிப்பு",
  },
  Rate: { "en-IN": "Rate", "hi-IN": "दर", "pa-IN": "ਦਰ", "ta-IN": "விகிதம்" },
  "Receipt Number": {
    "en-IN": "Receipt Number",
    "hi-IN": "रसीद संख्या",
    "pa-IN": "ਰਸੀਦ ਨੰਬਰ",
    "ta-IN": "ரசீது எண்",
  },
  "Revenue & Subscriptions": {
    "en-IN": "Revenue & Subscriptions",
    "hi-IN": "राजस्व और सदस्यताएँ",
    "pa-IN": "ਆਮਦਨ ਅਤੇ ਗਾਹਕੀਆਂ",
    "ta-IN": "வருவாய் மற்றும் சந்தாக்கள்",
  },
  "Revenue Generated": {
    "en-IN": "Revenue Generated",
    "hi-IN": "प्राप्त राजस्व",
    "pa-IN": "ਪੈਦਾ ਹੋਈ ਆਮਦਨ",
    "ta-IN": "ஈட்டிய வருவாய்",
  },
  Return: {
    "en-IN": "Return",
    "hi-IN": "वापस जाएँ",
    "pa-IN": "ਵਾਪਸ",
    "ta-IN": "திரும்பு",
  },
  "Resume Subscription": {
    "en-IN": "Resume Subscription",
    "hi-IN": "सदस्यता फिर शुरू करें",
    "pa-IN": "ਗਾਹਕੀ ਮੁੜ ਸ਼ੁਰੂ ਕਰੋ",
    "ta-IN": "சந்தாவை மீண்டும் தொடங்கவும்",
  },
  "Search hospital...": {
    "en-IN": "Search hospital...",
    "hi-IN": "अस्पताल खोजें...",
    "pa-IN": "ਹਸਪਤਾਲ ਖੋਜੋ...",
    "ta-IN": "மருத்துவமனையைத் தேடுங்கள்...",
  },
  "Select clinics to pause": {
    "en-IN": "Select clinics to pause",
    "hi-IN": "रोकने के लिए क्लिनिक चुनें",
    "pa-IN": "ਰੋਕਣ ਲਈ ਕਲੀਨਿਕ ਚੁਣੋ",
    "ta-IN": "இடைநிறுத்த வேண்டிய கிளினிக்குகளைத் தேர்ந்தெடுக்கவும்",
  },
  "Selection Incomplete": {
    "en-IN": "Selection Incomplete",
    "hi-IN": "चयन अधूरा है",
    "pa-IN": "ਚੋਣ ਅਧੂਰੀ ਹੈ",
    "ta-IN": "தேர்வு முழுமையடையவில்லை",
  },
  "Share your experience using AyuSetu. What features do you like most? How has it helped your clinic operations?":
    {
      "en-IN":
        "Share your experience using AyuSetu. What features do you like most? How has it helped your clinic operations?",
      "hi-IN":
        "आयुसेतु का उपयोग करने का अपना अनुभव बताएँ। आपको कौन-सी सुविधाएँ सबसे अधिक पसंद हैं? इससे आपके क्लिनिक के काम में कैसे मदद मिली?",
      "pa-IN":
        "ਆਯੁਸੇਤੂ ਵਰਤਣ ਦਾ ਆਪਣਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ। ਤੁਹਾਨੂੰ ਕਿਹੜੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਸਭ ਤੋਂ ਵੱਧ ਪਸੰਦ ਹਨ? ਇਸ ਨੇ ਕਲੀਨਿਕ ਦੇ ਕੰਮ ਵਿੱਚ ਕਿਵੇਂ ਮਦਦ ਕੀਤੀ?",
      "ta-IN":
        "ஆயுசேதுவைப் பயன்படுத்திய அனுபவத்தைப் பகிரவும். எந்த அம்சங்கள் உங்களுக்கு மிகவும் பிடித்தன? உங்கள் கிளினிக் செயல்பாடுகளுக்கு இது எவ்வாறு உதவியது?",
    },
  "Show Video Testimonial": {
    "en-IN": "Show Video Testimonial",
    "hi-IN": "वीडियो प्रतिक्रिया देखें",
    "pa-IN": "ਵੀਡੀਓ ਸਮੀਖਿਆ ਵੇਖੋ",
    "ta-IN": "வீடியோ கருத்தைப் பார்க்கவும்",
  },
  "Sign Out": {
    "en-IN": "Sign Out",
    "hi-IN": "साइन आउट करें",
    "pa-IN": "ਸਾਈਨ ਆਉਟ ਕਰੋ",
    "ta-IN": "வெளியேறவும்",
  },
  "Sign Out Instead": {
    "en-IN": "Sign Out Instead",
    "hi-IN": "इसके बजाय साइन आउट करें",
    "pa-IN": "ਇਸ ਦੀ ਬਜਾਏ ਸਾਈਨ ਆਉਟ ਕਰੋ",
    "ta-IN": "அதற்குப் பதிலாக வெளியேறவும்",
  },
  Status: {
    "en-IN": "Status",
    "hi-IN": "स्थिति",
    "pa-IN": "ਸਥਿਤੀ",
    "ta-IN": "நிலை",
  },
  "Status & Mode": {
    "en-IN": "Status & Mode",
    "hi-IN": "स्थिति और तरीका",
    "pa-IN": "ਸਥਿਤੀ ਅਤੇ ਢੰਗ",
    "ta-IN": "நிலை மற்றும் முறை",
  },
  "Subscription Downgrade Requires Action": {
    "en-IN": "Subscription Downgrade Requires Action",
    "hi-IN": "सदस्यता घटाने के लिए कार्रवाई आवश्यक है",
    "pa-IN": "ਗਾਹਕੀ ਘਟਾਉਣ ਲਈ ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ ਹੈ",
    "ta-IN": "சந்தாவைக் குறைக்க நடவடிக்கை தேவை",
  },
  "Subscription Management": {
    "en-IN": "Subscription Management",
    "hi-IN": "सदस्यता प्रबंधन",
    "pa-IN": "ਗਾਹਕੀ ਪ੍ਰਬੰਧਨ",
    "ta-IN": "சந்தா மேலாண்மை",
  },
  "Subscription Health": {
    "en-IN": "Subscription Health",
    "hi-IN": "सदस्यता की स्थिति",
    "pa-IN": "ਗਾਹਕੀ ਦੀ ਸਥਿਤੀ",
    "ta-IN": "சந்தா நிலை",
  },
  Subtotal: {
    "en-IN": "Subtotal",
    "hi-IN": "उप-योग",
    "pa-IN": "ਉਪ-ਕੁੱਲ",
    "ta-IN": "கூட்டுத்தொகை",
  },
  "Thank you for your feedback!": {
    "en-IN": "Thank you for your feedback!",
    "hi-IN": "आपकी प्रतिक्रिया के लिए धन्यवाद!",
    "pa-IN": "ਤੁਹਾਡੇ ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ!",
    "ta-IN": "உங்கள் கருத்துக்கு நன்றி!",
  },
  "The selected clinics have been paused and will be deleted in 30 days.": {
    "en-IN":
      "The selected clinics have been paused and will be deleted in 30 days.",
    "hi-IN": "चुने हुए क्लिनिक रोक दिए गए हैं और 30 दिनों में हटाए जाएँगे।",
    "pa-IN": "ਚੁਣੇ ਕਲੀਨਿਕ ਰੋਕ ਦਿੱਤੇ ਗਏ ਹਨ ਅਤੇ 30 ਦਿਨਾਂ ਵਿੱਚ ਮਿਟਾ ਦਿੱਤੇ ਜਾਣਗੇ।",
    "ta-IN": "தேர்ந்தெடுத்த கிளினிக்குகள் இடைநிறுத்தப்பட்டுள்ளன; 30 நாட்களில் நீக்கப்படும்.",
  },
  "This hospital has exceeded the limits of its current subscription plan. Please contact your hospital administrator to resolve this issue.":
    {
      "en-IN":
        "This hospital has exceeded the limits of its current subscription plan. Please contact your hospital administrator to resolve this issue.",
      "hi-IN":
        "इस अस्पताल ने अपनी मौजूदा सदस्यता योजना की सीमा पार कर ली है। इसे हल करने के लिए अस्पताल प्रशासक से संपर्क करें।",
      "pa-IN":
        "ਇਸ ਹਸਪਤਾਲ ਨੇ ਆਪਣੀ ਮੌਜੂਦਾ ਗਾਹਕੀ ਯੋਜਨਾ ਦੀ ਸੀਮਾ ਪਾਰ ਕਰ ਲਈ ਹੈ। ਇਸ ਮਸਲੇ ਨੂੰ ਹੱਲ ਕਰਨ ਲਈ ਹਸਪਤਾਲ ਪ੍ਰਸ਼ਾਸਕ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
      "ta-IN":
        "இந்த மருத்துவமனை தற்போதைய சந்தாத் திட்ட வரம்பை மீறியுள்ளது. இதைத் தீர்க்க மருத்துவமனை நிர்வாகியைத் தொடர்புகொள்ளவும்.",
    },
  "Today's activity": {
    "en-IN": "Today's activity",
    "hi-IN": "आज की गतिविधि",
    "pa-IN": "ਅੱਜ ਦੀ ਗਤੀਵਿਧੀ",
    "ta-IN": "இன்றைய செயல்பாடு",
  },
  "Token No": {
    "en-IN": "Token No",
    "hi-IN": "टोकन संख्या",
    "pa-IN": "ਟੋਕਨ ਨੰਬਰ",
    "ta-IN": "டோக்கன் எண்",
  },
  "Transaction Date": {
    "en-IN": "Transaction Date",
    "hi-IN": "लेन-देन की तारीख",
    "pa-IN": "ਲੈਣ-ਦੇਣ ਦੀ ਮਿਤੀ",
    "ta-IN": "பரிவர்த்தனை தேதி",
  },
  "Transaction ID": {
    "en-IN": "Transaction ID",
    "hi-IN": "लेन-देन आईडी",
    "pa-IN": "ਲੈਣ-ਦੇਣ ਆਈਡੀ",
    "ta-IN": "பரிவர்த்தனை அடையாள எண்",
  },
  "Transaction Receipt": {
    "en-IN": "Transaction Receipt",
    "hi-IN": "लेन-देन की रसीद",
    "pa-IN": "ਲੈਣ-ਦੇਣ ਦੀ ਰਸੀਦ",
    "ta-IN": "பரிவர்த்தனை ரசீது",
  },
  "Treating Doctor": {
    "en-IN": "Treating Doctor",
    "hi-IN": "इलाज करने वाले डॉक्टर",
    "pa-IN": "ਇਲਾਜ ਕਰਨ ਵਾਲੇ ਡਾਕਟਰ",
    "ta-IN": "சிகிச்சையளிக்கும் மருத்துவர்",
  },
  "Trial Expired — Upgrade to continue using all features": {
    "en-IN": "Trial Expired — Upgrade to continue using all features",
    "hi-IN": "ट्रायल समाप्त — सभी सुविधाएँ जारी रखने के लिए अपग्रेड करें",
    "pa-IN": "ਟ੍ਰਾਇਲ ਖਤਮ — ਸਾਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਵਰਤਣ ਲਈ ਅੱਪਗ੍ਰੇਡ ਕਰੋ",
    "ta-IN": "சோதனைக் காலம் முடிந்தது — அனைத்து அம்சங்களையும் தொடர மேம்படுத்தவும்",
  },
  "Trial extension request approved.": {
    "en-IN": "Trial extension request approved.",
    "hi-IN": "ट्रायल बढ़ाने का अनुरोध स्वीकृत हुआ।",
    "pa-IN": "ਟ੍ਰਾਇਲ ਵਧਾਉਣ ਦੀ ਬੇਨਤੀ ਮਨਜ਼ੂਰ ਹੋ ਗਈ।",
    "ta-IN": "சோதனைக் கால நீட்டிப்பு கோரிக்கை ஒப்புதல் அளிக்கப்பட்டது.",
  },
  "Trial extension request rejected.": {
    "en-IN": "Trial extension request rejected.",
    "hi-IN": "ट्रायल बढ़ाने का अनुरोध अस्वीकार हुआ।",
    "pa-IN": "ਟ੍ਰਾਇਲ ਵਧਾਉਣ ਦੀ ਬੇਨਤੀ ਰੱਦ ਹੋ ਗਈ।",
    "ta-IN": "சோதனைக் கால நீட்டிப்பு கோரிக்கை நிராகரிக்கப்பட்டது.",
  },
  "Usage Overview": {
    "en-IN": "Usage Overview",
    "hi-IN": "उपयोग का सारांश",
    "pa-IN": "ਵਰਤੋਂ ਦੀ ਜਾਣਕਾਰੀ",
    "ta-IN": "பயன்பாட்டு கண்ணோட்டம்",
  },
  "Billed To": {
    "en-IN": "Billed To",
    "hi-IN": "बिल किसके नाम",
    "pa-IN": "ਬਿੱਲ ਕਿਸ ਦੇ ਨਾਮ",
    "ta-IN": "பில் பெறுபவர்",
  },
  "Consultant / Staff": {
    "en-IN": "Consultant / Staff",
    "hi-IN": "परामर्शदाता / कर्मचारी",
    "pa-IN": "ਸਲਾਹਕਾਰ / ਸਟਾਫ਼",
    "ta-IN": "ஆலோசகர் / பணியாளர்",
  },
  "Print Receipt": {
    "en-IN": "Print Receipt",
    "hi-IN": "रसीद प्रिंट करें",
    "pa-IN": "ਰਸੀਦ ਪ੍ਰਿੰਟ ਕਰੋ",
    "ta-IN": "ரசீதை அச்சிடவும்",
  },
  Restock: {
    "en-IN": "Restock",
    "hi-IN": "स्टॉक फिर भरें",
    "pa-IN": "ਸਟਾਕ ਮੁੜ ਭਰੋ",
    "ta-IN": "இருப்பை மீண்டும் நிரப்பவும்",
  },
  "Restock Now": {
    "en-IN": "Restock Now",
    "hi-IN": "अभी स्टॉक भरें",
    "pa-IN": "ਹੁਣੇ ਸਟਾਕ ਭਰੋ",
    "ta-IN": "இப்போது இருப்பை நிரப்பவும்",
  },
  "Powered by": {
    "en-IN": "Powered by",
    "hi-IN": "द्वारा संचालित",
    "pa-IN": "ਵੱਲੋਂ ਸੰਚਾਲਿਤ",
    "ta-IN": "வழங்குவது",
  },
  "Care That Stays Connected &bull; AyuSetu Clinical OS": {
    "en-IN": "Care That Stays Connected &bull; AyuSetu Clinical OS",
    "hi-IN": "जुड़ी रहने वाली देखभाल • आयुसेतु क्लिनिकल OS",
    "pa-IN": "ਜੁੜੀ ਰਹਿਣ ਵਾਲੀ ਦੇਖਭਾਲ • ਆਯੁਸੇਤੂ ਕਲੀਨਿਕਲ OS",
    "ta-IN": "தொடர்புடன் நீடிக்கும் பராமரிப்பு • ஆயுசேது மருத்துவ OS",
  },
  "This is a computer-generated document. No signature is required. All disputes subject to local jurisdiction.":
    {
      "en-IN":
        "This is a computer-generated document. No signature is required. All disputes subject to local jurisdiction.",
      "hi-IN":
        "यह कंप्यूटर द्वारा बनाया गया दस्तावेज़ है। हस्ताक्षर आवश्यक नहीं है। सभी विवाद स्थानीय न्यायक्षेत्र के अधीन होंगे।",
      "pa-IN":
        "ਇਹ ਕੰਪਿਊਟਰ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਦਸਤਾਵੇਜ਼ ਹੈ। ਦਸਤਖ਼ਤ ਦੀ ਲੋੜ ਨਹੀਂ। ਸਾਰੇ ਵਿਵਾਦ ਸਥਾਨਕ ਅਧਿਕਾਰ-ਖੇਤਰ ਦੇ ਅਧੀਨ ਹਨ।",
      "ta-IN":
        "இது கணினியால் உருவாக்கப்பட்ட ஆவணம். கையொப்பம் தேவையில்லை. அனைத்து தகராறுகளும் உள்ளூர் அதிகார வரம்பிற்கு உட்பட்டவை.",
    },
  "of free access.": {
    "en-IN": "of free access.",
    "hi-IN": "निःशुल्क उपयोग।",
    "pa-IN": "ਮੁਫ਼ਤ ਵਰਤੋਂ।",
    "ta-IN": "இலவச அணுகல்.",
  },
  "No items listed in this transaction": {
    "en-IN": "No items listed in this transaction",
    "hi-IN": "इस लेन-देन में कोई वस्तु सूचीबद्ध नहीं है",
    "pa-IN": "ਇਸ ਲੈਣ-ਦੇਣ ਵਿੱਚ ਕੋਈ ਆਈਟਮ ਸੂਚੀਬੱਧ ਨਹੀਂ ਹੈ",
    "ta-IN": "இந்தப் பரிவர்த்தனையில் பொருட்கள் பட்டியலிடப்படவில்லை",
  },
  "View Video Testimonial": {
    "en-IN": "View Video Testimonial",
    "hi-IN": "वीडियो प्रतिक्रिया देखें",
    "pa-IN": "ਵੀਡੀਓ ਸਮੀਖਿਆ ਵੇਖੋ",
    "ta-IN": "வீடியோ கருத்தைப் பார்க்கவும்",
  },
  "Recording a video testimonial increases your chances of fast approval!": {
    "en-IN":
      "Recording a video testimonial increases your chances of fast approval!",
    "hi-IN": "वीडियो प्रतिक्रिया रिकॉर्ड करने से जल्दी मंज़ूरी मिलने की संभावना बढ़ती है!",
    "pa-IN": "ਵੀਡੀਓ ਸਮੀਖਿਆ ਰਿਕਾਰਡ ਕਰਨ ਨਾਲ ਜਲਦੀ ਮਨਜ਼ੂਰੀ ਦੀ ਸੰਭਾਵਨਾ ਵਧਦੀ ਹੈ!",
    "ta-IN":
      "வீடியோ கருத்தைப் பதிவு செய்வது விரைவான ஒப்புதல் பெறுவதற்கான வாய்ப்பை அதிகரிக்கும்!",
  },
  "Your request has been sent to the Super Admin. If approved, your trial will be extended by":
    {
      "en-IN":
        "Your request has been sent to the Super Admin. If approved, your trial will be extended by",
      "hi-IN":
        "आपका अनुरोध सुपर एडमिन को भेज दिया गया है। मंज़ूरी मिलने पर आपका ट्रायल इतने समय के लिए बढ़ाया जाएगा:",
      "pa-IN":
        "ਤੁਹਾਡੀ ਬੇਨਤੀ ਸੁਪਰ ਐਡਮਿਨ ਨੂੰ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ। ਮਨਜ਼ੂਰੀ ਮਿਲਣ 'ਤੇ ਤੁਹਾਡਾ ਟ੍ਰਾਇਲ ਇੰਨੇ ਸਮੇਂ ਲਈ ਵਧਾਇਆ ਜਾਵੇਗਾ:",
      "ta-IN":
        "உங்கள் கோரிக்கை சூப்பர் நிர்வாகியிடம் அனுப்பப்பட்டது. ஒப்புதல் கிடைத்தால் உங்கள் சோதனைக் காலம் இவ்வளவு நீட்டிக்கப்படும்:",
    },
  "Video Testimonial Link (Required)": {
    "en-IN": "Video Testimonial Link (Required)",
    "hi-IN": "वीडियो प्रतिक्रिया का लिंक (आवश्यक)",
    "pa-IN": "ਵੀਡੀਓ ਸਮੀਖਿਆ ਲਿੰਕ (ਲਾਜ਼ਮੀ)",
    "ta-IN": "வீடியோ கருத்து இணைப்பு (கட்டாயம்)",
  },
  "Written Review": {
    "en-IN": "Written Review",
    "hi-IN": "लिखित समीक्षा",
    "pa-IN": "ਲਿਖਤੀ ਸਮੀਖਿਆ",
    "ta-IN": "எழுத்துப்பூர்வ மதிப்புரை",
  },
  "Added to IPD Bill": {
    "en-IN": "Added to IPD Bill",
    "hi-IN": "IPD बिल में जोड़ा गया",
    "pa-IN": "IPD ਬਿੱਲ ਵਿੱਚ ਜੋੜਿਆ ਗਿਆ",
    "ta-IN": "IPD கட்டணத்தில் சேர்க்கப்பட்டது",
  },
  "Active:": {
    "en-IN": "Active:",
    "hi-IN": "सक्रिय:",
    "pa-IN": "ਚਾਲੂ:",
    "ta-IN": "செயலில்:",
  },
  "Paused:": {
    "en-IN": "Paused:",
    "hi-IN": "रुके हुए:",
    "pa-IN": "ਰੋਕੇ ਹੋਏ:",
    "ta-IN": "இடைநிறுத்தப்பட்டது:",
  },
  "Selected:": {
    "en-IN": "Selected:",
    "hi-IN": "चयनित:",
    "pa-IN": "ਚੁਣੇ ਗਏ:",
    "ta-IN": "தேர்ந்தெடுக்கப்பட்டது:",
  },
  "all clinics": {
    "en-IN": "all clinics",
    "hi-IN": "सभी क्लिनिक",
    "pa-IN": "ਸਾਰੇ ਕਲੀਨਿਕ",
    "ta-IN": "அனைத்து கிளினிக்குகள்",
  },
  "your clinic": {
    "en-IN": "your clinic",
    "hi-IN": "आपका क्लिनिक",
    "pa-IN": "ਤੁਹਾਡਾ ਕਲੀਨਿਕ",
    "ta-IN": "உங்கள் கிளினிக்",
  },
  "Approve Deletion": {
    "en-IN": "Approve Deletion",
    "hi-IN": "हटाने की मंज़ूरी दें",
    "pa-IN": "ਮਿਟਾਉਣ ਨੂੰ ਮਨਜ਼ੂਰੀ ਦਿਓ",
    "ta-IN": "நீக்கத்தை ஒப்புதல் அளிக்கவும்",
  },
  "Action Failed": {
    "en-IN": "Action Failed",
    "hi-IN": "कार्रवाई विफल हुई",
    "pa-IN": "ਕਾਰਵਾਈ ਅਸਫਲ ਹੋਈ",
    "ta-IN": "செயல் தோல்வியடைந்தது",
  },
  "Action Successful": {
    "en-IN": "Action Successful",
    "hi-IN": "कार्रवाई सफल रही",
    "pa-IN": "ਕਾਰਵਾਈ ਸਫਲ ਰਹੀ",
    "ta-IN": "செயல் வெற்றிகரமாக முடிந்தது",
  },
  Cash: { "en-IN": "Cash", "hi-IN": "नकद", "pa-IN": "ਨਕਦ", "ta-IN": "ரொக்கம்" },
  "Clinics Paused": {
    "en-IN": "Clinics Paused",
    "hi-IN": "क्लिनिक रोक दिए गए",
    "pa-IN": "ਕਲੀਨਿਕ ਰੋਕ ਦਿੱਤੇ ਗਏ",
    "ta-IN": "கிளினிக்குகள் இடைநிறுத்தப்பட்டன",
  },
  "CRITICAL: This will PERMANENTLY delete all data for this hospital. This cannot be undone. Are you sure?":
    {
      "en-IN":
        "CRITICAL: This will PERMANENTLY delete all data for this hospital. This cannot be undone. Are you sure?",
      "hi-IN":
        "गंभीर चेतावनी: इससे इस अस्पताल का सारा डेटा स्थायी रूप से मिट जाएगा। इसे वापस नहीं किया जा सकता। क्या आप सुनिश्चित हैं?",
      "pa-IN":
        "ਗੰਭੀਰ ਚੇਤਾਵਨੀ: ਇਸ ਨਾਲ ਇਸ ਹਸਪਤਾਲ ਦਾ ਸਾਰਾ ਡਾਟਾ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟ ਜਾਵੇਗਾ। ਇਸਨੂੰ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ। ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਹੋ?",
      "ta-IN":
        "முக்கிய எச்சரிக்கை: இந்த மருத்துவமனையின் எல்லா தரவும் நிரந்தரமாக நீக்கப்படும். இதை மீட்டெடுக்க முடியாது. உறுதியாக உள்ளீர்களா?",
    },
  "Data preservation extended.": {
    "en-IN": "Data preservation extended.",
    "hi-IN": "डेटा सुरक्षित रखने की अवधि बढ़ाई गई।",
    "pa-IN": "ਡਾਟਾ ਸੰਭਾਲਣ ਦੀ ਮਿਆਦ ਵਧਾਈ ਗਈ।",
    "ta-IN": "தரவு பாதுகாப்பு காலம் நீட்டிக்கப்பட்டது.",
  },
  "Deletion Approved": {
    "en-IN": "Deletion Approved",
    "hi-IN": "हटाने की मंज़ूरी दी गई",
    "pa-IN": "ਮਿਟਾਉਣ ਨੂੰ ਮਨਜ਼ੂਰੀ ਮਿਲੀ",
    "ta-IN": "நீக்கத்திற்கு ஒப்புதல் அளிக்கப்பட்டது",
  },
  "Deletion Rejected": {
    "en-IN": "Deletion Rejected",
    "hi-IN": "हटाने का अनुरोध अस्वीकार हुआ",
    "pa-IN": "ਮਿਟਾਉਣ ਦੀ ਬੇਨਤੀ ਰੱਦ ਹੋਈ",
    "ta-IN": "நீக்க கோரிக்கை நிராகரிக்கப்பட்டது",
  },
  "Hospital data permanently deleted.": {
    "en-IN": "Hospital data permanently deleted.",
    "hi-IN": "अस्पताल का डेटा स्थायी रूप से मिटा दिया गया।",
    "pa-IN": "ਹਸਪਤਾਲ ਦਾ ਡਾਟਾ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟਾ ਦਿੱਤਾ ਗਿਆ।",
    "ta-IN": "மருத்துவமனைத் தரவு நிரந்தரமாக நீக்கப்பட்டது.",
  },
  "Hospital has been granted 8 extra days.": {
    "en-IN": "Hospital has been granted 8 extra days.",
    "hi-IN": "अस्पताल को 8 अतिरिक्त दिन दिए गए हैं।",
    "pa-IN": "ਹਸਪਤਾਲ ਨੂੰ 8 ਵਾਧੂ ਦਿਨ ਦਿੱਤੇ ਗਏ ਹਨ।",
    "ta-IN": "மருத்துவமனைக்கு கூடுதலாக 8 நாட்கள் வழங்கப்பட்டுள்ளன.",
  },
  "Medical Staff": {
    "en-IN": "Medical Staff",
    "hi-IN": "चिकित्सा कर्मचारी",
    "pa-IN": "ਮੈਡੀਕਲ ਸਟਾਫ਼",
    "ta-IN": "மருத்துவப் பணியாளர்",
  },
  "Paid / Confirmed": {
    "en-IN": "Paid / Confirmed",
    "hi-IN": "भुगतान हुआ / पुष्टि की गई",
    "pa-IN": "ਭੁਗਤਾਨ ਕੀਤਾ / ਪੁਸ਼ਟੀ ਹੋਈ",
    "ta-IN": "செலுத்தப்பட்டது / உறுதிசெய்யப்பட்டது",
  },
  "Please select exactly": {
    "en-IN": "Please select exactly",
    "hi-IN": "कृपया ठीक इतने चुनें:",
    "pa-IN": "ਕਿਰਪਾ ਕਰਕੇ ਬਿਲਕੁਲ ਇੰਨੇ ਚੁਣੋ:",
    "ta-IN": "சரியாக இத்தனை தேர்ந்தெடுக்கவும்:",
  },
  "Request Rejected": {
    "en-IN": "Request Rejected",
    "hi-IN": "अनुरोध अस्वीकार हुआ",
    "pa-IN": "ਬੇਨਤੀ ਰੱਦ ਹੋਈ",
    "ta-IN": "கோரிக்கை நிராகரிக்கப்பட்டது",
  },
  "Trial Extended": {
    "en-IN": "Trial Extended",
    "hi-IN": "ट्रायल बढ़ाया गया",
    "pa-IN": "ਟ੍ਰਾਇਲ ਵਧਾਇਆ ਗਿਆ",
    "ta-IN": "சோதனைக் காலம் நீட்டிக்கப்பட்டது",
  },
  Upgrade: {
    "en-IN": "Upgrade",
    "hi-IN": "अपग्रेड करें",
    "pa-IN": "ਅੱਪਗ੍ਰੇਡ ਕਰੋ",
    "ta-IN": "மேம்படுத்தவும்",
  },
  "Upgrade Now": {
    "en-IN": "Upgrade Now",
    "hi-IN": "अभी अपग्रेड करें",
    "pa-IN": "ਹੁਣੇ ਅੱਪਗ੍ਰੇਡ ਕਰੋ",
    "ta-IN": "இப்போது மேம்படுத்தவும்",
  },
  "— Upgrade now to keep all your features": {
    "en-IN": "— Upgrade now to keep all your features",
    "hi-IN": "— सभी सुविधाएँ जारी रखने के लिए अभी अपग्रेड करें",
    "pa-IN": "— ਸਾਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਜਾਰੀ ਰੱਖਣ ਲਈ ਹੁਣੇ ਅੱਪਗ੍ਰੇਡ ਕਰੋ",
    "ta-IN": "— அனைத்து அம்சங்களையும் தொடர்ந்து பயன்படுத்த இப்போது மேம்படுத்தவும்",
  },
  "Your account may be restricted soon": {
    "en-IN": "Your account may be restricted soon",
    "hi-IN": "आपका खाता जल्द सीमित किया जा सकता है",
    "pa-IN": "ਤੁਹਾਡੇ ਖਾਤੇ 'ਤੇ ਜਲਦੀ ਪਾਬੰਦੀ ਲੱਗ ਸਕਦੀ ਹੈ",
    "ta-IN": "உங்கள் கணக்கு விரைவில் கட்டுப்படுத்தப்படலாம்",
  },
  "Your Name": {
    "en-IN": "Your Name",
    "hi-IN": "आपका नाम",
    "pa-IN": "ਤੁਹਾਡਾ ਨਾਮ",
    "ta-IN": "உங்கள் பெயர்",
  },
  "Your account is in read-only mode — subscribe to a plan to continue using AyuSetu":
    {
      "en-IN":
        "Your account is in read-only mode — subscribe to a plan to continue using AyuSetu",
      "hi-IN":
        "आपका खाता केवल पढ़ने की स्थिति में है — आयुसेतु का उपयोग जारी रखने के लिए योजना की सदस्यता लें",
      "pa-IN":
        "ਤੁਹਾਡਾ ਖਾਤਾ ਸਿਰਫ਼ ਪੜ੍ਹਨ ਲਈ ਹੈ — ਆਯੁਸੇਤੂ ਵਰਤਣਾ ਜਾਰੀ ਰੱਖਣ ਲਈ ਯੋਜਨਾ ਦੀ ਗਾਹਕੀ ਲਵੋ",
      "ta-IN":
        "உங்கள் கணக்கு படிக்க மட்டும் உள்ளது — ஆயுசேதுவைத் தொடர்ந்து பயன்படுத்தத் திட்டத்தில் சேரவும்",
    },
  "You can prevent this deletion by upgrading your plan and unpausing the clinics before the 30-day period ends.":
    {
      "en-IN":
        "You can prevent this deletion by upgrading your plan and unpausing the clinics before the 30-day period ends.",
      "hi-IN":
        "30 दिन पूरे होने से पहले योजना अपग्रेड करके और क्लिनिक फिर शुरू करके इस डेटा हटने से रोक सकते हैं।",
      "pa-IN":
        "30 ਦਿਨਾਂ ਦੀ ਮਿਆਦ ਮੁੱਕਣ ਤੋਂ ਪਹਿਲਾਂ ਯੋਜਨਾ ਅੱਪਗ੍ਰੇਡ ਕਰਕੇ ਅਤੇ ਕਲੀਨਿਕ ਮੁੜ ਚਾਲੂ ਕਰਕੇ ਡਾਟਾ ਮਿਟਣ ਤੋਂ ਰੋਕਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
      "ta-IN":
        "30 நாள் காலம் முடிவதற்கு முன் திட்டத்தை மேம்படுத்தி கிளினிக்குகளை மீண்டும் தொடங்குவதன் மூலம் இந்த நீக்கத்தைத் தடுக்கலாம்.",
    },
  "You currently have": {
    "en-IN": "You currently have",
    "hi-IN": "आपके पास अभी",
    "pa-IN": "ਤੁਹਾਡੇ ਕੋਲ ਇਸ ਵੇਲੇ",
    "ta-IN": "தற்போது உங்களிடம்",
  },
  "You can subscribe to a paid plan to view invoices.": {
    "en-IN": "You can subscribe to a paid plan to view invoices.",
    "hi-IN": "चालान देखने के लिए आप भुगतान वाली योजना की सदस्यता ले सकते हैं।",
    "pa-IN": "ਚਲਾਨ ਦੇਖਣ ਲਈ ਤੁਸੀਂ ਭੁਗਤਾਨ ਵਾਲੀ ਯੋਜਨਾ ਦੀ ਗਾਹਕੀ ਲੈ ਸਕਦੇ ਹੋ।",
    "ta-IN": "விலைப்பட்டியல்களைப் பார்க்க கட்டணத் திட்டத்தில் சேரலாம்.",
  },
};
