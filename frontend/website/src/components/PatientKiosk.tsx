import { useState } from 'react';
import { VoiceInput } from './VoiceInput';
import { ArrowLeft, Volume2, VolumeX, ShieldCheck, Accessibility } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { dataService } from '@/lib/dataService';

export interface PatientKioskProps {
  onTokenGenerated?: (tokenData: any) => void;
  onNavigate?: (view: string) => void;
}

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  phone: string;
  authMethod: string;
  abhaId: string;
  abhaAddress: string;
  hasPmjay: boolean;
  selectedSymptom: string;
  englishTranslation?: string;
  tokenNumber: string;
  isVerified: boolean;
  isEmergency?: boolean;
}

const PATIENT_DATABASE: Record<string, {
  name: string;
  age: number;
  gender: string;
  city: string;
  abha: string;
  abhaAddr: string;
  pmjay: boolean;
  pmjayId: string;
  symptom: string;
  englishTranslation: string;
  phone: string;
  aadhaar: string;
}> = {
  '9876543210': {
    name: 'Ramesh Chandra',
    age: 52,
    gender: 'Male',
    city: 'Khammam, Telangana',
    abha: '91-4829-1029-4821',
    abhaAddr: 'ramesh.chandra@abdm',
    pmjay: true,
    pmjayId: 'PMJAY-TS-482910',
    symptom: 'मुझे 6 महीने से दोनों घुटनों में दर्द है',
    englishTranslation: 'Bilateral knee joint pain with morning stiffness for 6 months.',
    phone: '9876543210',
    aadhaar: '892019204821'
  },
  '9811122334': {
    name: 'Priya Sharma',
    age: 34,
    gender: 'Female',
    city: 'Hyderabad, Telangana',
    abha: '91-5910-2941-8402',
    abhaAddr: 'priya.sharma@abdm',
    pmjay: true,
    pmjayId: 'PMJAY-TS-591029',
    symptom: 'पेट में बहुत तेज जलन, गैस और खट्टी डकारें आ रही हैं',
    englishTranslation: 'Severe retrosternal epigastric burning with acid peptic dyspepsia.',
    phone: '9811122334',
    aadhaar: '771240193382'
  },
  '9777788899': {
    name: 'Mohan Das',
    age: 61,
    gender: 'Male',
    city: 'Warangal, Telangana',
    abha: '91-7712-4019-3382',
    abhaAddr: 'mohan.das@abdm',
    pmjay: true,
    pmjayId: 'PMJAY-TS-771240',
    symptom: 'अचानक सीने में बहुत तेज दर्द हो रहा है, सांस फूल रही है',
    englishTranslation: 'Acute crushing retrosternal chest pain with left arm radiation (STAT RED-FLAG).',
    phone: '9777788899',
    aadhaar: '665544332211'
  },
  '9123456789': {
    name: 'Ananya Verma',
    age: 28,
    gender: 'Female',
    city: 'Nizamabad, Telangana',
    abha: '91-9123-4567-8901',
    abhaAddr: 'ananya.verma@abdm',
    pmjay: true,
    pmjayId: 'PMJAY-TS-912345',
    symptom: 'मुझे 3 दिनों से तेज बुखार, बदन दर्द और कंपकंपी है',
    englishTranslation: 'High grade pyrexia with rigors, chills, and myalgia for 3 days.',
    phone: '9123456789',
    aadhaar: '998877665544'
  }
};

const I18N: Record<string, Record<string, string>> = {
  'hi-IN': {
    langName: 'हिन्दी',
    welcomeVoice: 'हिन्दी भाषा चुनी गई है। कृपया अपनी पहचान का तरीका चुनें।',
    identifyTitle: 'आप अपनी पहचान कैसे सत्यापित करना चाहते हैं? (Identity Verification)',
    identifySub: 'नीचे दिए गए विकल्पों में से एक चुनें (Touch any option below)',
    optQrTitle: 'QR कोड स्कैन करें (Scan ABHA QR)',
    optQrSub: 'कैमरे के सामने रखें (Point QR at camera)',
    optMobTitle: 'मोबाइल नंबर (Mobile Number)',
    optMobSub: '10-अंकीय फोन नंबर (10-Digit Phone OTP)',
    optAbhaTitle: 'आभा कार्ड (14-Digit ABHA ID)',
    optAbhaSub: '14-अंकीय आभा संख्या (91-XXXX-XXXX-XXXX)',
    optAadhTitle: 'आधार कार्ड (Aadhaar Card)',
    optAadhSub: '12-अंकीय आधार संख्या (12-Digit UIDAI)',
    optRegTitle: 'नया मरीज? (New Patient?)',
    optRegSub: 'पंजीकरण और आभा बनाएं (Register & Create ABHA)',
    btnSelect: 'चुनें (Select)',
    btnSelected: '✓ चुना गया (Selected)',
    btnOpenCam: 'कैमरा खोलकर स्कैन करें (Open Camera to Scan)',
    btnVerifyMob: 'मोबाइल OTP सत्यापित करें (Verify Mobile OTP)',
    btnFetchAbha: 'ABHA प्रोफाइल प्राप्त करें (Fetch ABHA Profile)',
    btnVerifyAadh: 'आधार e-KYC सत्यापित करें (Verify Aadhaar e-KYC)',
    pmjayTitle: 'आयुष्मान भारत PM-JAY सक्रिय (PM-JAY Active)',
    pmjayDesc: '₹5,00,000 वार्षिक मुफ्त इलाज (Cashless OPD Approved)',
    continueVoiceBtn: 'लक्षण बताने के लिए आगे बढ़ें (Continue to Symptoms) ➔',
    headerBack: 'पीछे (Back)',
    aiQuestion: 'आपको कहाँ दर्द या तकलीफ है? नीचे दिए गए हिस्से को छुएं या बोलें।',
    aiQuestionSub: 'लक्षण चुनें या बोलने के लिए माइक दबाएं (Where does it hurt?)',
    aiVoicePrompt: 'आपको कहाँ दर्द या तकलीफ है? नीचे दिए गए हिस्से को छुएं या बोलें।',
    tabVoice: '🎙️ बोलें (Speak)',
    tabType: '⌨️ टाइप करें (Type)',
    typePrompt: 'अपनी समस्याओं का विवरण दें (Describe symptoms in Hindi/English):',
    typePlaceholder: 'उदा: मुझे पिछले 3 दिनों से तेज सिरदर्द, गले में दर्द और बुखार है...',
    quickChipsLabel: '⚡ त्वरित विकल्प (Quick 1-Tap Add Symptoms):',
    typeTranslateBtn: '⚡ अनुवाद और विश्लेषण (Translate & Analyze) ➔',
    kneeTitle: 'घुटनों व जोड़ों का दर्द (Knee & Joint Pain)',
    kneeVoice: 'घुटनों का दर्द दर्ज कर लिया गया है।',
    chestTitle: 'सीने में तेज दर्द (Severe Chest Pain - Emergency)',
    chestVoice: 'चेतावनी! सीने में तेज दर्द आपातकालीन लक्षण है। तुरंत कमरा 1 में जाएं।',
    feverTitle: 'तेज बुखार व ठंड (High Fever & Chills)',
    feverVoice: 'तेज बुखार दर्ज कर लिया गया है।',
    stomachTitle: 'पेट दर्द व गैस (Stomach Pain & Acidity)',
    stomachVoice: 'पेट दर्द दर्ज कर लिया गया है।',
    micLabel: 'बोलने के लिए माइक दबाएं (Tap Mic to Speak)',
    nextScanBtn: 'पर्चा स्कैन करें (Next: Scan Rx) ➔',
    scanRxTitle: 'पुराना पर्चा स्कैनर के नीचे रखें (Place Prescription)',
    scanRxSub: 'सर्वम विज़न 3B लिखावट को डिजिटाइज़ करता है (AI Digitization)',
    scanRxAct: 'पर्चा स्कैन करें (Capture & Digitize)',
    ocrSuccessVoice: 'दवाइयों का पर्चा सफलतापूर्वक स्कैन हो गया है।',
    ocrHead: 'निकाली गई दवाइयों की सूची (Extracted Clinical Entities)',
    confirmTokenBtn: 'पुष्टि करें और टोकन लें (Confirm & Generate Token) ➔',
    tokenDone: 'पंजीकरण पूर्ण हुआ (Clinical Intake Complete)',
    tokenSub: 'आपका ओपीडी टोकन नंबर (YOUR OPD TOKEN NUMBER)',
    tokenMsg: 'आपका विवरण डॉक्टर की स्क्रीन पर भेज दिया गया है (Sent directly to Doctor).',
    tokenVoice: 'आपका पंजीकरण पूरा हो गया है। आपका टोकन नंबर 42 है। कृपया कक्ष 4 में जाएं।',
    nextPatBtn: 'अगला मरीज शुरू करें (Start Next Patient)',
    transcriptionHint: 'मुझे 6 महीने से दोनों घुटनों में दर्द है',
    listenBtn: 'सुनें (Listen)',
    skipBtnText: 'पर्चे नहीं हैं ➔ आगे बढ़ें (Skip / No Documents ➔)'
  },
  'te-IN': {
    langName: 'తెలుగు',
    welcomeVoice: 'తెలుగు భాష ఎంచుకోబడింది. దయచేసి మీ వివరాలు ఎలా ఇవ్వాలనుకుంటున్నారో ఎంచుకోండి.',
    identifyTitle: 'మీ వివరాలు ఎలా ఇవ్వాలనుకుంటున్నారు? (Identity Verification)',
    identifySub: 'క్రింది పద్ధతుల్లో ఒకదానిపై నొక్కండి (Touch any option below)',
    optQrTitle: 'QR స్కాన్ చేయండి (Scan ABHA QR)',
    optQrSub: 'కెమెరా ముందు ఉంచండి (Point QR at camera)',
    optMobTitle: 'మొబైల్ నంబర్ (Mobile Number)',
    optMobSub: '10 అంకెల ఫోన్ నంబర్ (10-Digit Phone OTP)',
    optAbhaTitle: 'ఆభా కార్డ్ (14-Digit ABHA ID)',
    optAbhaSub: '14 అంకెల ఆభా సంఖ్య (91-XXXX-XXXX-XXXX)',
    optAadhTitle: 'ఆధార్ కార్డ్ (Aadhaar Card)',
    optAadhSub: '12 అంకెల ఆధార్ సంఖ్య (12-Digit UIDAI)',
    optRegTitle: 'కొత్త పేషెంట్? (New Patient?)',
    optRegSub: 'నమోదు & ఆభా సృష్టి (Register & Create ABHA)',
    btnSelect: 'ఎంచుకోండి (Select)',
    btnSelected: '✓ ఎంచుకోబడింది (Selected)',
    btnOpenCam: 'కెమెరా ప్రారంభించి స్కాన్ చేయండి (Open Camera to Scan)',
    btnVerifyMob: 'ఓటీపీ ధృవీకరించి రికార్డులు పొందండి (Verify Mobile OTP)',
    btnFetchAbha: 'ఆభా రికార్డ్ పొందండి (Fetch ABHA Profile)',
    btnVerifyAadh: 'ఆధార్ బయోమెట్రిక్ / ఓటీపీ (Verify Aadhaar e-KYC)',
    pmjayTitle: 'ఆయుష్మాన్ భారత్ PM-JAY యాక్టివ్ (PM-JAY Active)',
    pmjayDesc: '₹5,00,000 వార్షిక కవరేజ్ • 100% ఉచిత క్యాష్‌లెస్‌ చికిత్స (Cashless Approved)',
    continueVoiceBtn: 'లక్షణాలు చెప్పడానికి కొనసాగించండి (Continue to Symptoms) ➔',
    headerBack: 'వెనుకకు (Back)',
    aiQuestion: 'మీకు ఎక్కడ నొప్పిగా ఉంది? బొమ్మను తాకండి, మాట్లాడండి లేదా రాయండి.',
    aiQuestionSub: 'నొప్పి ఉన్న భాగాన్ని తాకండి లేదా మైక్ నొక్కి మాట్లాడండి (Where does it hurt?)',
    aiVoicePrompt: 'మీకు ఎక్కడ నొప్పిగా ఉంది? బొమ్మను తాకండి లేదా మైక్ నొక్కి మాట్లాడండి.',
    tabVoice: '🎙️ మాట్లాడండి (Speak)',
    tabType: '⌨️ రాయండి (Type)',
    typePrompt: 'మీ సమస్యలను వివరించండి (Describe your symptoms in Telugu/English):',
    typePlaceholder: 'ఉదా: నాకు గత 3 రోజులుగా తీవ్రమైన తలనొప్పి, గొంతు నొప్పి మరియు జ్వరం ఉంది...',
    quickChipsLabel: '⚡ త్వరిత ఎంపికలు (Quick 1-Tap Add Symptoms):',
    typeTranslateBtn: '⚡ అనువదించండి & విశ్లేషించండి (Translate & Analyze) ➔',
    kneeTitle: 'మోకాళ్ళ / కీళ్ళ నొప్పులు (Knee & Joint Pain)',
    kneeVoice: 'మోకాళ్ళ నొప్పులు నమోదు చేయబడ్డాయి.',
    chestTitle: 'ఛాతీలో తీవ్ర నొప్పి (Severe Chest Pain - Emergency)',
    chestVoice: 'జాగ్రత్త. ఛాతీ నొప్పి అత్యవసర లక్షణంగా గుర్తించబడింది. వెంటనే రూమ్ 1 కి వెళ్ళండి.',
    feverTitle: 'తీవ్ర జ్వరం / చలి (High Fever & Chills)',
    feverVoice: 'తీవ్ర జ్వరం మరియు చలి లక్షణాలు నమోదు చేయబడ్డాయి.',
    stomachTitle: 'కడుపు నొప్పి / అజీర్ణం (Stomach Pain & Acidity)',
    stomachVoice: 'కడుపు నొప్పి మరియు అజీర్ణం నమోదు చేయబడ్డాయి.',
    micLabel: 'మాట్లాడటానికి మైక్ నొక్కండి (Tap Mic to Speak)',
    nextScanBtn: 'ప్రిస్క్రిప్షన్ స్కాన్ చేయండి (Next: Scan Rx) ➔',
    scanRxTitle: 'పాత ప్రిస్క్రిప్షన్ పేపర్‌ను కెమెరా కింద ఉంచండి (Place Prescription)',
    scanRxSub: 'Sarvam Vision 3B చేతివ్రాతను డిజిటైజ్ చేస్తుంది (AI Digitization)',
    scanRxAct: 'ప్రిస్క్రిప్షన్ స్కాన్ చేయండి (Capture & Digitize)',
    ocrSuccessVoice: 'ప్రిస్క్రిప్షన్ రికార్డ్ విజయవంతంగా నమోదు చేయబడింది.',
    ocrHead: 'గుర్తించబడిన మందుల వివరాలు (Extracted Clinical Entities)',
    confirmTokenBtn: 'ధృవీకరించి టోకెన్ పొందండి (Confirm & Generate Token) ➔',
    tokenDone: 'కేస్ నమోదు పూర్తయింది (Clinical Intake Complete)',
    tokenSub: 'మీ ఓపీడీ టోకెన్ సంఖ్య (YOUR OPD TOKEN NUMBER)',
    tokenMsg: 'మీ వివరాలు డాక్టర్ గారి స్క్రీన్ కు పంపబడ్డాయి (Sent directly to Doctor).',
    tokenVoice: 'మీ నమోదు పూర్తయింది. మీ టోకెన్ సంఖ్య 42. దయచేసి రూమ్ నంబర్ 4 వద్ద వేచి ఉండండి.',
    nextPatBtn: 'మరో పేషెంట్ ప్రారంభించండి (Start Next Patient)',
    transcriptionHint: 'నాకు 6 నెలలుగా రెండు మోకాళ్ళలో నొప్పిగా ఉంది',
    listenBtn: 'వినండి (Listen)',
    skipBtnText: 'పత్రాలు లేవు ➔ స్కిప్ చేయండి (Skip / No Documents ➔)'
  },
  'en-IN': {
    langName: 'English',
    welcomeVoice: 'English selected. Please choose how you want to identify yourself.',
    identifyTitle: 'How would you like to identify yourself?',
    identifySub: 'Touch any one option below to verify your health records',
    optQrTitle: 'Scan ABHA QR',
    optQrSub: 'Point QR at camera scanner',
    optMobTitle: 'Mobile Number',
    optMobSub: '10-digit phone with OTP',
    optAbhaTitle: '14-Digit ABHA ID',
    optAbhaSub: '91-XXXX-XXXX-XXXX',
    optAadhTitle: 'Aadhaar Card',
    optAadhSub: '12-digit UIDAI number',
    optRegTitle: 'New Patient?',
    optRegSub: 'Register & Create ABHA',
    btnSelect: 'Select',
    btnSelected: '✓ Selected',
    btnOpenCam: 'Open Camera to Scan QR',
    btnVerifyMob: 'Verify Mobile OTP & Fetch Records',
    btnFetchAbha: 'Fetch ABHA Profile',
    btnVerifyAadh: 'Verify Aadhaar e-KYC',
    pmjayTitle: 'Ayushman Bharat PM-JAY Active',
    pmjayDesc: '₹5,00,000 Annual Coverage • Cashless OPD Approved',
    continueVoiceBtn: 'Continue to Symptom Intake ➔',
    headerBack: 'Back',
    aiQuestion: 'Where does it hurt? Touch the body area below, speak via microphone, or type below.',
    aiQuestionSub: 'Select symptom, tap microphone to speak, or type symptoms',
    aiVoicePrompt: 'Where does it hurt? Please touch the body area on the screen or press the microphone to speak.',
    tabVoice: '🎙️ Speak',
    tabType: '⌨️ Type',
    typePrompt: 'Describe your symptoms in your own words:',
    typePlaceholder: 'e.g., I have had severe headache, sore throat, and high fever for the last 3 days...',
    quickChipsLabel: '⚡ Quick 1-Tap Add Symptoms:',
    typeTranslateBtn: '⚡ Translate & Analyze ➔',
    kneeTitle: 'Knee & Joint Pain',
    kneeVoice: 'Bilateral knee joint pain recorded.',
    chestTitle: 'Severe Chest Pain (Emergency)',
    chestVoice: 'Warning! Acute chest pain detected. Priority emergency triage alert triggered. Please proceed to Room 1 immediately.',
    feverTitle: 'High Fever & Chills',
    feverVoice: 'High fever and chills recorded.',
    stomachTitle: 'Stomach Pain & Acidity',
    stomachVoice: 'Stomach pain and acid peptic disorder recorded.',
    micLabel: 'Tap Microphone to Speak',
    nextScanBtn: 'Next: Scan Paper Prescriptions ➔',
    scanRxTitle: 'Place Paper Prescription Under Scanner',
    scanRxSub: 'Sarvam Vision 3B VLM digitizes cursive handwriting',
    scanRxAct: 'Capture & Digitize Prescription',
    ocrSuccessVoice: 'Prescription OCR extraction complete. Active medications recorded.',
    ocrHead: 'Extracted Clinical Entities (96% Accuracy)',
    confirmTokenBtn: 'Confirm & Generate Token ➔',
    tokenDone: 'Clinical Intake Complete',
    tokenSub: 'YOUR OPD TOKEN NUMBER',
    tokenMsg: 'Your case summary has been sent directly to the doctor.',
    tokenVoice: 'Your intake is complete. Your token number is 42. Please proceed to OPD Consultation Room 4.',
    nextPatBtn: 'Start Next Patient Intake',
    transcriptionHint: 'I have had pain in both knees for 6 months',
    listenBtn: 'Listen',
    skipBtnText: 'Skip / No Documents ➔'
  },
  'ta-IN': {
    langName: 'தமிழ்',
    welcomeVoice: 'தமிழ் தேர்ந்தெடுக்கப்பட்டது. உங்கள் அடையாளத்தை எவ்வாறு சரிபார்க்க விரும்புகிறீர்கள் என்பதைத் தேர்ந்தெடுக்கவும்.',
    identifyTitle: 'உங்கள் அடையாளத்தை எவ்வாறு சரிபார்க்க விரும்புகிறீர்கள்? (Identity Verification)',
    identifySub: 'கீழே உள்ள ஏதேனும் ஒரு விருப்பத்தைத் தொடவும் (Touch any option below)',
    optQrTitle: 'QR குறியீட்டை ஸ்கேன் செய்க (Scan ABHA QR)',
    optQrSub: 'கேமரா முன் காட்டவும் (Point QR at camera)',
    optMobTitle: 'கைபேசி எண் (Mobile Number)',
    optMobSub: '10-இலக்க தொலைபேசி எண் (10-Digit Phone OTP)',
    optAbhaTitle: '14-இலக்க ABHA அட்டை (14-Digit ABHA ID)',
    optAbhaSub: '91-XXXX-XXXX-XXXX (ABHA Number)',
    optAadhTitle: 'ஆதார் அட்டை (Aadhaar Card)',
    optAadhSub: '12-இலக்க ஆதார் எண் (12-Digit UIDAI)',
    optRegTitle: 'புதிய நோயாளி? (New Patient?)',
    optRegSub: 'பதிவு & ABHA உருவாக்கம் (Register & Create ABHA)',
    btnSelect: 'தேர்ந்தெடு (Select)',
    btnSelected: '✓ தேர்ந்தெடுக்கப்பட்டது (Selected)',
    btnOpenCam: 'கேமராவைத் திறந்து ஸ்கேன் செய்க (Open Camera to Scan)',
    btnVerifyMob: 'OTP சரிபார்த்து பதிவுகளைப் பெறுக (Verify Mobile OTP)',
    btnFetchAbha: 'ABHA சுயவிவரத்தைப் பெறுக (Fetch ABHA Profile)',
    btnVerifyAadh: 'ஆதார் e-KYC சரிபார்க்கவும் (Verify Aadhaar e-KYC)',
    pmjayTitle: 'ஆயுஷ்மான் பாரத் PM-JAY செயலில் உள்ளது (PM-JAY Active)',
    pmjayDesc: '₹5,00,000 இலவச மருத்துவக் காப்பீடு • ரொக்கமில்லா சிகிச்சை (Cashless Approved)',
    continueVoiceBtn: 'அறிகுறிகளைக் கூற தொடரவும் (Continue to Symptoms) ➔',
    headerBack: 'பின்னே (Back)',
    aiQuestion: 'உங்களுக்கு எங்கு வலிக்கிறது? கீழே உள்ள பகுதியைத் தொடவும் அல்லது மைக்கில் பேசவும்.',
    aiQuestionSub: 'அறிகுறியைத் தேர்ந்தெடுக்கவும் அல்லது பேசவும் (Where does it hurt?)',
    aiVoicePrompt: 'உங்களுக்கு எங்கு வலிக்கிறது? கீழே உள்ள பகுதியைத் தொடவும் அல்லது மைக்கில் பேசவும்.',
    tabVoice: '🎙️ பேசுங்கள் (Speak)',
    tabType: '⌨️ தட்டச்சு செய்க (Type)',
    typePrompt: 'உங்கள் அறிகுறிகளை விவரிக்கவும் (Describe symptoms in Tamil/English):',
    typePlaceholder: 'உதா: எனக்கு 3 நாட்களாக கடுமையான தலைவலி, தொண்டை வலி மற்றும் காய்ச்சல் உள்ளது...',
    quickChipsLabel: '⚡ விரைவு தேர்வு (Quick 1-Tap Add Symptoms):',
    typeTranslateBtn: '⚡ மொழிபெயர்க்க & பகுப்பாய்வு (Translate & Analyze) ➔',
    kneeTitle: 'முழங்கால் மற்றும் மூட்டு வலி (Knee & Joint Pain)',
    kneeVoice: 'மூட்டு வலி பதிவு செய்யப்பட்டது.',
    chestTitle: 'கடுமையான மார்பு வலி (Severe Chest Pain - Emergency)',
    chestVoice: 'எச்சரிக்கை! கடுமையான மார்பு வலி கண்டறியப்பட்டது. அவசர அறை 1 க்கு உடனடியாக செல்லவும்.',
    feverTitle: 'அதிக காய்ச்சல் & குளிர் (High Fever & Chills)',
    feverVoice: 'காய்ச்சல் அறிகுறி பதிவு செய்யப்பட்டது.',
    stomachTitle: 'வயிற்று வலி & அஜீரணம் (Stomach Pain & Acidity)',
    stomachVoice: 'வயிற்று வலி பதிவு செய்யப்பட்டது.',
    micLabel: 'பேச மைக்கை அழுத்தவும் (Tap Mic to Speak)',
    nextScanBtn: 'மருந்து சீட்டை ஸ்கேன் செய்க (Next: Scan Rx) ➔',
    scanRxTitle: 'பழைய மருந்து சீட்டை ஸ்கேனரில் வைக்கவும் (Place Prescription)',
    scanRxSub: 'Sarvam Vision 3B கையெழுத்தை டிஜிட்டல் மயமாக்குகிறது (AI Digitization)',
    scanRxAct: 'மருந்து சீட்டை ஸ்கேன் செய்க (Capture & Digitize)',
    ocrSuccessVoice: 'மருந்து சீட்டு வெற்றிகரமாக பதிவு செய்யப்பட்டது.',
    ocrHead: 'கண்டறியப்பட்ட மருந்துகள் (Extracted Clinical Entities)',
    confirmTokenBtn: 'டோக்கனைப் பெறுக (Confirm & Generate Token) ➔',
    tokenDone: 'பதிவு முடிந்தது (Clinical Intake Complete)',
    tokenSub: 'உங்கள் OPD டோக்கன் எண் (YOUR OPD TOKEN NUMBER)',
    tokenMsg: 'உங்கள் விவரங்கள் மருத்துவருக்கு அனுப்பப்பட்டன (Sent directly to Doctor).',
    tokenVoice: 'உங்கள் பதிவு முடிந்தது. உங்கள் டோக்கன் எண் 42. அறை 4 க்கு செல்லவும்.',
    nextPatBtn: 'அடுத்த நோயாளி (Start Next Patient)',
    transcriptionHint: 'எனக்கு 6 மாதங்களாக இரு முழங்கால்களிலும் வலி உள்ளது',
    listenBtn: 'கேளுங்கள் (Listen)',
    skipBtnText: 'மருந்து சீட்டு இல்லை ➔ தொடரவும் (Skip / No Documents ➔)'
  },
  'kn-IN': {
    langName: 'ಕನ್ನಡ',
    welcomeVoice: 'ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಗುರುತಿನ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    identifyTitle: 'ನಿಮ್ಮ ಗುರುತನ್ನು ಹೇಗೆ ಪರಿಶೀಲಿಸಲು ಬಯಸುತ್ತೀರಿ? (Identity Verification)',
    identifySub: 'ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಸ್ಪರ್ಶಿಸಿ (Touch any option below)',
    optQrTitle: 'QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ (Scan ABHA QR)',
    optQrSub: 'ಕ್ಯಾಮೆರಾ ಮುಂದೆ ಇರಿಸಿ (Point QR at camera)',
    optMobTitle: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (Mobile Number)',
    optMobSub: '10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆ (10-Digit Phone OTP)',
    optAbhaTitle: '14-ಅಂಕಿಯ ABHA ಕಾರ್ಡ್ (14-Digit ABHA ID)',
    optAbhaSub: '91-XXXX-XXXX-XXXX (ABHA Number)',
    optAadhTitle: 'ಆಧಾರ್ ಕಾರ್ಡ್ (Aadhaar Card)',
    optAadhSub: '12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆ (12-Digit UIDAI)',
    optRegTitle: 'ಹೊಸ ರೋಗಿ? (New Patient?)',
    optRegSub: 'ನೋಂದಣಿ & ABHA ರಚಿಸಿ (Register & Create ABHA)',
    btnSelect: 'ಆಯ್ಕೆಮಾಡಿ (Select)',
    btnSelected: '✓ ಆಯ್ಕೆಯಾಗಿದೆ (Selected)',
    btnOpenCam: 'ಕ್ಯಾಮೆರಾ ತೆರೆದು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ (Open Camera to Scan)',
    btnVerifyMob: 'OTP ಪರಿಶೀಲಿಸಿ ದಾಖಲೆಗಳನ್ನು ಪಡೆಯಿರಿ (Verify Mobile OTP)',
    btnFetchAbha: 'ABHA ಪ್ರೊಫೈಲ್ ಪಡೆಯಿರಿ (Fetch ABHA Profile)',
    btnVerifyAadh: 'ಆಧಾರ್ e-KYC ಪರಿಶೀಲಿಸಿ (Verify Aadhaar e-KYC)',
    pmjayTitle: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ PM-JAY ಸಕ್ರಿಯವಾಗಿದೆ (PM-JAY Active)',
    pmjayDesc: '₹5,00,000 ವಾರ್ಷಿಕ ನಗದು ರಹಿತ ಚಿಕಿತ್ಸೆ (Cashless Approved)',
    continueVoiceBtn: 'ಲಕ್ಷಣಗಳನ್ನು ಹೇಳಲು ಮುಂದುವರಿಯಿರಿ (Continue to Symptoms) ➔',
    headerBack: 'ಹಿಂದಕ್ಕೆ (Back)',
    aiQuestion: 'ನಿಮಗೆ ಎಲ್ಲಿ ನೋವಾಗುತ್ತಿದೆ? ಕೆಳಗಿನ ಭಾಗವನ್ನು ಸ್ಪರ್ಶಿಸಿ ಅಥವಾ ಮೈಕ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ.',
    aiQuestionSub: 'ಲಕ್ಷಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ (Where does it hurt?)',
    aiVoicePrompt: 'ನಿಮಗೆ ಎಲ್ಲಿ ನೋವಾಗುತ್ತಿದೆ? ಕೆಳಗಿನ ಭಾಗವನ್ನು ಸ್ಪರ್ಶಿಸಿ ಅಥವಾ ಮೈಕ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ.',
    tabVoice: '🎙️ ಮಾತನಾಡಿ (Speak)',
    tabType: '⌨️ ಟೈಪ್ ಮಾಡಿ (Type)',
    typePrompt: 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ (Describe symptoms in Kannada/English):',
    typePlaceholder: 'ಉದಾ: ನನಗೆ 3 ದಿನಗಳಿಂದ ತೀವ್ರ ತಲೆನೋವು, ಗಂಟಲು ನೋವು ಮತ್ತು ಜ್ವರವಿದೆ...',
    quickChipsLabel: '⚡ ತ್ವರಿತ ಆಯ್ಕೆಗಳು (Quick 1-Tap Add Symptoms):',
    typeTranslateBtn: '⚡ ಅನುವಾದ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ (Translate & Analyze) ➔',
    kneeTitle: 'ಮಂಡಿ & ಕೀಲು ನೋವು (Knee & Joint Pain)',
    kneeVoice: 'ಮಂಡಿ ನೋವು ದಾಖಲಾಗಿದೆ.',
    chestTitle: 'ತೀವ್ರ ಎದೆ ನೋವು (Severe Chest Pain - Emergency)',
    chestVoice: 'ಎಚ್ಚರಿಕೆ! ಎದೆ ನೋವು ತುರ್ತು ಲಕ್ಷಣವಾಗಿದೆ. ತಕ್ಷಣ ಕೊಠಡಿ 1 ಕ್ಕೆ ತೆರಳಿ.',
    feverTitle: 'ತೀವ್ರ ಜ್ವರ & ಚಳಿ (High Fever & Chills)',
    feverVoice: 'ಜ್ವರ ದಾಖಲಾಗಿದೆ.',
    stomachTitle: 'ಹೊಟ್ಟೆ ನೋವು & ಗ್ಯಾಸ್ಟ್ರಿಕ್ (Stomach Pain & Acidity)',
    stomachVoice: 'ಹೊಟ್ಟೆ ನೋವು ದಾಖಲಾಗಿದೆ.',
    micLabel: 'ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ (Tap Mic to Speak)',
    nextScanBtn: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ (Next: Scan Rx) ➔',
    scanRxTitle: 'ಹಳೆಯ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಕಾಗದವನ್ನು ಇರಿಸಿ (Place Prescription)',
    scanRxSub: 'Sarvam Vision 3B ಕೈಬರಹವನ್ನು ಡಿಜಿಟೈಜ್ ಮಾಡುತ್ತದೆ (AI Digitization)',
    scanRxAct: 'ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ (Capture & Digitize)',
    ocrSuccessVoice: 'ಔಷಧಿ ವಿವರಗಳು ದಾಖಲಾಗಿವೆ.',
    ocrHead: 'ಗುರುತಿಸಲಾದ ಔಷಧಿಗಳು (Extracted Clinical Entities)',
    confirmTokenBtn: 'ಟೋಕನ್ ಪಡೆಯಿರಿ (Confirm & Generate Token) ➔',
    tokenDone: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಂಡಿದೆ (Clinical Intake Complete)',
    tokenSub: 'ನಿಮ್ಮ OPD ಟೋಕನ್ ಸಂಖ್ಯೆ (YOUR OPD TOKEN NUMBER)',
    tokenMsg: 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ವೈದ್ಯರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ (Sent directly to Doctor).',
    tokenVoice: 'ನೋಂದಣಿ ಮುಗಿದಿದೆ. ನಿಮ್ಮ ಟೋಕನ್ ಸಂಖ್ಯೆ 42. ಕೊಠಡಿ 4 ಕ್ಕೆ ತೆರಳಿ.',
    nextPatBtn: 'ಮುಂದಿನ ರೋಗಿ (Start Next Patient)',
    transcriptionHint: 'ನನಗೆ 6 ತಿಂಗಳಿಂದ ಎರಡೂ ಮೊಣಕಾಲುಗಳಲ್ಲಿ ನೋವು ಇದೆ',
    listenBtn: 'ಕೇಳಿ (Listen)',
    skipBtnText: 'ದಾಖಲೆಗಳಿಲ್ಲ ➔ ಮುಂದುವರಿಯಿರಿ (Skip / No Documents ➔)'
  },
  'mr-IN': {
    langName: 'मराठी',
    welcomeVoice: 'मराठी भाषा निवडली आहे. कृपया आपली ओळख पद्धत निवडा.',
    identifyTitle: 'आपण आपली ओळख कशी सत्यापित करू इच्छिता? (Identity Verification)',
    identifySub: 'खालील पर्यायांपैकी एक निवडा (Touch any option below)',
    optQrTitle: 'QR कोड स्कॅन करा (Scan ABHA QR)',
    optQrSub: 'कॅमेऱ्यासमोर ठेवा (Point QR at camera)',
    optMobTitle: 'मोबाईल नंबर (Mobile Number)',
    optMobSub: '10-अंकी फोन नंबर (10-Digit Phone OTP)',
    optAbhaTitle: '14-अंकी ABHA कार्ड (14-Digit ABHA ID)',
    optAbhaSub: '91-XXXX-XXXX-XXXX (ABHA Number)',
    optAadhTitle: 'आधार कार्ड (Aadhaar Card)',
    optAadhSub: '12-अंकी आधार क्रमांक (12-Digit UIDAI)',
    optRegTitle: 'नवीन रुग्ण? (New Patient?)',
    optRegSub: 'नोंदणी आणि ABHA तयार करा (Register & Create ABHA)',
    btnSelect: 'निवडा (Select)',
    btnSelected: '✓ निवडले (Selected)',
    btnOpenCam: 'कॅमेरा उघडून QR स्कॅन करा (Open Camera to Scan)',
    btnVerifyMob: 'OTP सत्यापित करा (Verify Mobile OTP)',
    btnFetchAbha: 'ABHA प्रोफाइल मिळवा (Fetch ABHA Profile)',
    btnVerifyAadh: 'आधार e-KYC सत्यापित करा (Verify Aadhaar e-KYC)',
    pmjayTitle: 'आयुष्मान भारत PM-JAY सक्रिय (PM-JAY Active)',
    pmjayDesc: '₹5,00,000 मोफत कॅशलेस उपचार (Cashless Approved)',
    continueVoiceBtn: 'लक्षणे सांगण्यासाठी पुढे जा (Continue to Symptoms) ➔',
    headerBack: 'मागे (Back)',
    aiQuestion: 'आपल्याला कुठे त्रास किंवा वेदना होत आहे? खालील भागाला स्पर्श करा किंवा माईकमध्ये बोला.',
    aiQuestionSub: 'लक्षण निवडा किंवा बोलण्यासाठी माईक दाबा (Where does it hurt?)',
    aiVoicePrompt: 'आपल्याला कुठे त्रास किंवा वेदना होत आहे? खालील भागाला स्पर्श करा किंवा माईकमध्ये बोला.',
    tabVoice: '🎙️ बोला (Speak)',
    tabType: '⌨️ टाईप करा (Type)',
    typePrompt: 'आपली लक्षणे सांगा (Describe symptoms in Marathi/English):',
    typePlaceholder: 'उदा: मला ३ दिवसांपासून तीव्र डोकेदुखी, घसादुखी आणि ताप आहे...',
    quickChipsLabel: '⚡ जलद पर्याय (Quick 1-Tap Add Symptoms):',
    typeTranslateBtn: '⚡ भाषांतर आणि विश्लेषण (Translate & Analyze) ➔',
    kneeTitle: 'गुडघे व सांधेदुखी (Knee & Joint Pain)',
    kneeVoice: 'गुडघेदुखी नोंदवली गेली आहे.',
    chestTitle: 'छातीत तीव्र वेदना (Severe Chest Pain - Emergency)',
    chestVoice: 'सावधान! छातीत तीव्र वेदना ही आणीबाणी आहे. ताबडतोब रूम 1 मध्ये जा.',
    feverTitle: 'तीव्र ताप व थंडी (High Fever & Chills)',
    feverVoice: 'ताप नोंदवला गेला आहे.',
    stomachTitle: 'पोटदुखी व ॲसिडिटी (Stomach Pain & Acidity)',
    stomachVoice: 'पोटदुखी नोंदवली गेली आहे.',
    micLabel: 'बोलण्यासाठी माईक दाबा (Tap Mic to Speak)',
    nextScanBtn: 'प्रिस्क्रिप्शन स्कॅन करा (Next: Scan Rx) ➔',
    scanRxTitle: 'जुने प्रिस्क्रिप्शन स्कॅनरखाली ठेवा (Place Prescription)',
    scanRxSub: 'Sarvam Vision 3B हस्ताक्षर डिजिटाईज करतो (AI Digitization)',
    scanRxAct: 'प्रिस्क्रिप्शन स्कॅन करा (Capture & Digitize)',
    ocrSuccessVoice: 'प्रिस्क्रिप्शन यशस्वीरित्या स्कॅन झाले.',
    ocrHead: 'काढलेली औषधांची यादी (Extracted Clinical Entities)',
    confirmTokenBtn: 'टोकन मिळवा (Confirm & Generate Token) ➔',
    tokenDone: 'नोंदणी पूर्ण झाली (Clinical Intake Complete)',
    tokenSub: 'आपला ओपीडी टोकन क्रमांक (YOUR OPD TOKEN NUMBER)',
    tokenMsg: 'आपले तपशील डॉक्टरांना पाठवले आहेत (Sent directly to Doctor).',
    tokenVoice: 'आपली नोंदणी पूर्ण झाली. टोकन नंबर 42. कृपया रूम 4 मध्ये जा.',
    nextPatBtn: 'पुढील रुग्ण (Start Next Patient)',
    transcriptionHint: 'मला ६ महिन्यांपासून दोन्ही गुडघ्यांत वेदना होत आहेत',
    listenBtn: 'ऐका (Listen)',
    skipBtnText: 'कागदपत्रे नाहीत ➔ पुढे जा (Skip / No Documents ➔)'
  },
  'bn-IN': {
    langName: 'বাংলা',
    welcomeVoice: 'বাংলা ভাষা নির্বাচিত হয়েছে। অনুগ্রহ করে আপনার পরিচয় যাচাই পদ্ধতি নির্বাচন করুন।',
    identifyTitle: 'আপনি কীভাবে আপনার পরিচয় যাচাই করতে চান? (Identity Verification)',
    identifySub: 'নীচের বিকল্পগুলির একটি স্পর্শ করুন (Touch any option below)',
    optQrTitle: 'QR কোড স্ক্যান করুন (Scan ABHA QR)',
    optQrSub: 'ক্যামেরার সামনে রাখুন (Point QR at camera)',
    optMobTitle: 'মোবাইল নম্বর (Mobile Number)',
    optMobSub: '১০-সংখ্যার ফোন নম্বর (10-Digit Phone OTP)',
    optAbhaTitle: '১৪-সংখ্যার ABHA আইডি (14-Digit ABHA ID)',
    optAbhaSub: '91-XXXX-XXXX-XXXX (ABHA Number)',
    optAadhTitle: 'আধার কার্ড (Aadhaar Card)',
    optAadhSub: '১২-সংখ্যার আধার নম্বর (12-Digit UIDAI)',
    optRegTitle: 'নতুন রোগী? (New Patient?)',
    optRegSub: 'নিবন্ধন ও ABHA তৈরি করুন (Register & Create ABHA)',
    btnSelect: 'নির্বাচন করুন (Select)',
    btnSelected: '✓ নির্বাচিত (Selected)',
    btnOpenCam: 'ক্যামেরা খুলে QR স্ক্যান করুন (Open Camera to Scan)',
    btnVerifyMob: 'OTP যাচাই করুন (Verify Mobile OTP)',
    btnFetchAbha: 'ABHA প্রোফাইল পান (Fetch ABHA Profile)',
    btnVerifyAadh: 'আধার e-KYC যাচাই করুন (Verify Aadhaar e-KYC)',
    pmjayTitle: 'আয়ুষ্মান ভারত PM-JAY সক্রিয় (PM-JAY Active)',
    pmjayDesc: '₹৫,০০,০০০ বার্ষিক ক্যাশলেস চিকিৎসা (Cashless Approved)',
    continueVoiceBtn: 'লক্ষণ জানাতে এগিয়ে যান (Continue to Symptoms) ➔',
    headerBack: 'পেছনে (Back)',
    aiQuestion: 'আপনার কোথায় ব্যথা বা সমস্যা হচ্ছে? নীচের অংশে স্পর্শ করুন বা মাইকে বলুন।',
    aiQuestionSub: 'লক্ষণ নির্বাচন করুন বা মাইক টিপে বলুন (Where does it hurt?)',
    aiVoicePrompt: 'আপনার কোথায় ব্যথা বা সমস্যা হচ্ছে? নীচের অংশে স্পর্শ করুন বা মাইকে বলুন।',
    tabVoice: '🎙️ বলুন (Speak)',
    tabType: '⌨️ টাইপ করুন (Type)',
    typePrompt: 'আপনার লক্ষণগুলি বর্ণনা করুন (Describe symptoms in Bengali/English):',
    typePlaceholder: 'উদা: আমার ৩ দিন ধরে তীব্র মাথাব্যথা, গলা ব্যথা এবং জ্বর রয়েছে...',
    quickChipsLabel: '⚡ দ্রুত বিকল্প (Quick 1-Tap Add Symptoms):',
    typeTranslateBtn: '⚡ অনুবাদ ও বিশ্লেষণ (Translate & Analyze) ➔',
    kneeTitle: 'হাঁটু ও জয়েন্টে ব্যথা (Knee & Joint Pain)',
    kneeVoice: 'হাঁটুর ব্যথা নথিভুক্ত করা হয়েছে।',
    chestTitle: 'বুকে তীব্র ব্যথা (Severe Chest Pain - Emergency)',
    chestVoice: 'সতর্কতা! বুকে তীব্র ব্যথা জরুরি লক্ষণ। অবিলম্বে রুম ১-এ যান।',
    feverTitle: 'তীব্র জ্বর ও কাঁপুনি (High Fever & Chills)',
    feverVoice: 'জ্বর নথিভুক্ত করা হয়েছে।',
    stomachTitle: 'পেট ব্যথা ও এসিডিটি (Stomach Pain & Acidity)',
    stomachVoice: 'পেট ব্যথা নথিভুক্ত করা হয়েছে।',
    micLabel: 'বলতে মাইক টিপুন (Tap Mic to Speak)',
    nextScanBtn: 'প্রেসক্রিপশন স্ক্যান করুন (Next: Scan Rx) ➔',
    scanRxTitle: 'পুরোনো প্রেসক্রিপশন স্ক্যানারের নিচে রাখুন (Place Prescription)',
    scanRxSub: 'Sarvam Vision 3B হাতের লেখা ডিজিটাইজ করে (AI Digitization)',
    scanRxAct: 'প্রেসক্রিপশন স্ক্যান করুন (Capture & Digitize)',
    ocrSuccessVoice: 'ওষুধের তালিকা নথিভুক্ত হয়েছে।',
    ocrHead: 'শনাক্তকৃত ওষুধসমূহ (Extracted Clinical Entities)',
    confirmTokenBtn: 'টোকেন নিন (Confirm & Generate Token) ➔',
    tokenDone: 'নিবন্ধন সম্পন্ন হয়েছে (Clinical Intake Complete)',
    tokenSub: 'আপনার ওপিডি টোকেন নম্বর (YOUR OPD TOKEN NUMBER)',
    tokenMsg: 'আপনার তথ্য ডাক্তারের কাছে পাঠানো হয়েছে (Sent directly to Doctor).',
    tokenVoice: 'নিবন্ধন সম্পন্ন হয়েছে। আপনার টোকেন নম্বর 42। রুম ৪-এ যান।',
    nextPatBtn: 'পরবর্তী রোগী (Start Next Patient)',
    transcriptionHint: 'আমার 6 মাস ধরে দুই হাঁটুতে ব্যথা',
    listenBtn: 'শুনুন (Listen)',
    skipBtnText: 'প্রেসক্রিপশন নেই ➔ এগিয়ে যান (Skip / No Documents ➔)'
  },
  'gu-IN': {
    langName: 'ગુજરાતી',
    welcomeVoice: 'ગુજરાતી ભાષા પસંદ કરવામાં આવી છે. કૃપા કરીને ઓળખ પદ્ધતિ પસંદ કરો.',
    identifyTitle: 'તમે તમારી ઓળખ કેવી રીતે ચકાસવા માંગો છો? (Identity Verification)',
    identifySub: 'નીચેના વિકલ્પોમાંથી એક પસંદ કરો (Touch any option below)',
    optQrTitle: 'QR કોડ સ્કેન કરો (Scan ABHA QR)',
    optQrSub: 'કેમેરા સામે રાખો (Point QR at camera)',
    optMobTitle: 'મોબાઇલ નંબર (Mobile Number)',
    optMobSub: '10-આંકડાનો ફોન નંબર (10-Digit Phone OTP)',
    optAbhaTitle: '14-આંકડાનું ABHA કાર્ડ (14-Digit ABHA ID)',
    optAbhaSub: '91-XXXX-XXXX-XXXX (ABHA Number)',
    optAadhTitle: 'આધાર કાર્ડ (Aadhaar Card)',
    optAadhSub: '12-આંકડાનો આધાર નંબર (12-Digit UIDAI)',
    optRegTitle: 'નવા દર્દી? (New Patient?)',
    optRegSub: 'નોંધણી અને ABHA બનાવો (Register & Create ABHA)',
    btnSelect: 'પસંદ કરો (Select)',
    btnSelected: '✓ પસંદ કરેલ (Selected)',
    btnOpenCam: 'કેમેરા ખોલીને QR સ્કેન કરો (Open Camera to Scan)',
    btnVerifyMob: 'OTP ચકાસો (Verify Mobile OTP)',
    btnFetchAbha: 'ABHA પ્રોફાઇલ મેળવો (Fetch ABHA Profile)',
    btnVerifyAadh: 'આધાર e-KYC ચકાસો (Verify Aadhaar e-KYC)',
    pmjayTitle: 'આયુષ્માન ભારત PM-JAY સક્રિય (PM-JAY Active)',
    pmjayDesc: '₹5,00,000 મફત કેશલેસ સારવાર (Cashless Approved)',
    continueVoiceBtn: 'લક્ષણો જણાવવા આગળ વધો (Continue to Symptoms) ➔',
    headerBack: 'પાછળ (Back)',
    aiQuestion: 'તમને ક્યાં દુખાવો થાય છે? નીચેના ભાગને સ્પર્શ કરો અથવા માઇકમાં બોલો.',
    aiQuestionSub: 'લક્ષણ પસંદ કરો અથવા બોલવા માટે માઇક દબાવો (Where does it hurt?)',
    aiVoicePrompt: 'તમને ક્યાં દુખાવો થાય છે? નીચેના ભાગને સ્પર્શ કરો અથવા માઇકમાં બોલો.',
    tabVoice: '🎙️ બોલો (Speak)',
    tabType: '⌨️ ટાઈપ કરો (Type)',
    typePrompt: 'તમારા લક્ષણો વર્ણવો (Describe symptoms in Gujarati/English):',
    typePlaceholder: 'દા.ત.: મને છેલ્લા 3 દિવસથી ગંભીર માથાનો દુખાવો, ગળામાં દુખાવો અને તાવ છે...',
    quickChipsLabel: '⚡ ઝડપી વિકલ્પો (Quick 1-Tap Add Symptoms):',
    typeTranslateBtn: '⚡ અનુવાદ અને વિશ્લેષણ (Translate & Analyze) ➔',
    kneeTitle: 'ઘૂંટણ અને સાંધાનો દુખાવો (Knee & Joint Pain)',
    kneeVoice: 'ઘૂંટણનો દુખાવો નોંધાયેલ છે.',
    chestTitle: 'છાતીમાં તીવ્ર દુખાવો (Severe Chest Pain - Emergency)',
    chestVoice: 'ચેતવણી! છાતીમાં દુખાવો કટોકટીનું લક્ષણ છે. તરત જ રૂમ 1 માં જાઓ.',
    feverTitle: 'તીવ્ર તાવ અને ઠંડી (High Fever & Chills)',
    feverVoice: 'તાવ નોંધાયેલ છે.',
    stomachTitle: 'પેટમાં દુખાવો અને એસિડિટી (Stomach Pain & Acidity)',
    stomachVoice: 'પેટનો દુખાવો નોંધાયેલ છે.',
    micLabel: 'બોલવા માટે માઇક દબાવો (Tap Mic to Speak)',
    nextScanBtn: 'પ્રિસ્ક્રિપ્શન સ્કેન કરો (Next: Scan Rx) ➔',
    scanRxTitle: 'જૂનું પ્રિસ્ક્રિપ્શન સ્કેનર નીચે મૂકો (Place Prescription)',
    scanRxSub: 'Sarvam Vision 3B હસ્તલેખનને ડિજિટાઈઝ કરે છે (AI Digitization)',
    scanRxAct: 'પ્રિસ્ક્રિપ્શન સ્કેન કરો (Capture & Digitize)',
    ocrSuccessVoice: 'દવાઓની વિગતો નોંધાઈ ગઈ છે.',
    ocrHead: 'શોધાયેલ દવાઓ (Extracted Clinical Entities)',
    confirmTokenBtn: 'ટોકન મેળવો (Confirm & Generate Token) ➔',
    tokenDone: 'નોંધણી પૂર્ણ થઈ (Clinical Intake Complete)',
    tokenSub: 'તમારો OPD ટોકન નંબર (YOUR OPD TOKEN NUMBER)',
    tokenMsg: 'તમારી વિગતો ડૉક્ટરને મોકલી દેવામાં આવી છે (Sent directly to Doctor).',
    tokenVoice: 'તમારી નોંધણી પૂર્ણ થઈ. તમારો ટોકન નંબર 42 છે. રૂમ 4 માં જાઓ.',
    nextPatBtn: 'આગળનો દર્દી (Start Next Patient)',
    transcriptionHint: 'મને 6 મહિનાથી બંને ઘૂંટણમાં દુખાવો છે',
    listenBtn: 'સાંભળો (Listen)',
    skipBtnText: 'દસ્તાવેજો નથી ➔ આગળ વધો (Skip / No Documents ➔)'
  }
};

export function PatientKiosk({ onTokenGenerated, onNavigate: _onNavigate }: PatientKioskProps) {
  // Start on Screen 0: Language Selection
  const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(0);
  const [currentLanguage, setCurrentLanguage] = useState<string>('hi-IN');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [authMethod, setAuthMethod] = useState<'qr' | 'mobile' | 'abha' | 'aadhaar' | 'register'>('qr');
  const [intakeMode, setIntakeMode] = useState<'voice' | 'type'>('voice');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(true);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showRedFlagBanner, setShowRedFlagBanner] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);

  // Form states
  const [mobileInput, setMobileInput] = useState<string>('9876543210');
  const [abhaInput, setAbhaInput] = useState<string>('91-4829-1029-4821');
  const [aadhaarInput, setAadhaarInput] = useState<string>('892019204821');
  const [regName, setRegName] = useState<string>('Ananya Verma');
  const [regAge, setRegAge] = useState<number>(28);
  const [regGender, setRegGender] = useState<string>('Female');
  const [regPhone, setRegPhone] = useState<string>('9123456789');
  const [regAadhaar, setRegAadhaar] = useState<string>('8920-1920-8901');

  // Typed symptom
  const [typedSymptom, setTypedSymptom] = useState<string>('मुझे 6 महीने से दोनों घुटनों में दर्द है');

  // Patient state (initialized matching screenshot)
  const [currentPatient, setCurrentPatient] = useState<PatientRecord>({
    id: 'pat-048291',
    name: 'Ramesh Chandra',
    age: 52,
    gender: 'Male',
    city: 'Khammam, Telangana',
    phone: '+91 98765 43210',
    authMethod: 'ABHA Scan & Share',
    abhaId: '91-4829-1029-4821',
    abhaAddress: 'ramesh.chandra@abdm',
    hasPmjay: true,
    selectedSymptom: 'मुझे 6 महीने से दोनों घुटनों में दर्द है',
    englishTranslation: 'Bilateral knee joint pain with morning stiffness for 6 months.',
    tokenNumber: '#042',
    isVerified: true,
    isEmergency: false
  });

  // Scanned documents
  const [scannedDocs, setScannedDocs] = useState<Array<{ name: string; meds: string; labs: string }>>([
    {
      name: 'Dr_Sharma_Prior_OPD.jpg',
      meds: 'Telmisartan 40mg OD • Paracetamol 650mg SOS',
      labs: 'Serum Uric Acid: 7.8 mg/dL (High) • HbA1c: 6.1%'
    }
  ]);

  const dict = I18N[currentLanguage] || I18N['en-IN'];

  // Audio speech synthesis helper
  const speakText = (text: string) => {
    if (!isVoiceActive || !text || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentScreenIndex(index);
  };

  const handleSelectLang = (code: string) => {
    setCurrentLanguage(code);
    setCurrentScreenIndex(1); // Go to Identify
    const newDict = I18N[code] || I18N['en-IN'];
    speakText(newDict.welcomeVoice);
  };

  // Demo patient auto-fill
  const loadDemoPatient = (key: string) => {
    const p = PATIENT_DATABASE[key];
    if (!p) return;
    const isEmerg = p.name.includes('Mohan');
    setCurrentPatient({
      id: `pat-${key}`,
      name: p.name,
      age: p.age,
      gender: p.gender,
      city: p.city,
      phone: `+91 ${p.phone}`,
      authMethod: 'ABHA Scan & Share',
      abhaId: p.abha,
      abhaAddress: p.abhaAddr,
      hasPmjay: p.pmjay,
      selectedSymptom: p.symptom,
      englishTranslation: p.englishTranslation,
      tokenNumber: isEmerg ? '#E-045' : '#042',
      isVerified: true,
      isEmergency: isEmerg
    });
    setTypedSymptom(p.symptom);
    if (isEmerg) {
      setShowRedFlagBanner(true);
    } else {
      setShowRedFlagBanner(false);
    }
    speakText(`${p.name} verified from database. Ayushman Bharat PM-JAY active.`);
  };

  // Zero-click emergency override
  const handleZeroClickEmergency = async () => {
    setShowRedFlagBanner(true);
    const emergPatient: PatientRecord = {
      ...currentPatient,
      name: 'STAT EMERGENCY OVERRIDE PATIENT',
      selectedSymptom: 'Zero-Click Emergency Button Pressed (Chest / Unconscious)',
      englishTranslation: 'Priority 1 Acute Undifferentiated Medical Emergency (Immediate Resuscitation Required)',
      tokenNumber: '#E-045',
      isEmergency: true
    };
    setCurrentPatient(emergPatient);
    setCurrentScreenIndex(4); // Screen Token
    speakText('Emergency Triage Activated! Please do not move. Nursing and ER staff has been alerted.');
    try {
      await dataService.create('encounters', {
        token_number: '#E-045',
        patient_name: emergPatient.name,
        chief_complaint: emergPatient.englishTranslation,
        triage_priority: 'EMERGENCY_RED',
        pmjay_eligible: false,
        status: 'EMERGENCY_TRIAGE'
      });
    } catch (e) {
      console.warn('Encounter sync notice:', e);
    }
    if (onTokenGenerated) {
      onTokenGenerated({ hasRedFlag: true, token: '#E-045' });
    }
  };

  // Symptom Card Selection
  const handleSymptomSelect = (type: 'knee' | 'chest' | 'fever' | 'stomach') => {
    let native = '';
    let english = '';
    let isRed = false;

    if (type === 'knee') {
      native = dict.kneeTitle || 'घुटनों व जोड़ों का दर्द';
      english = 'Bilateral knee joint pain with morning stiffness for 6 months.';
    } else if (type === 'chest') {
      native = dict.chestTitle || 'सीने में तेज दर्द';
      english = 'Acute crushing retrosternal chest pain with left arm radiation (STAT RED-FLAG).';
      isRed = true;
    } else if (type === 'fever') {
      native = dict.feverTitle || 'तेज बुखार व ठंड';
      english = 'High grade pyrexia with rigors, chills, and myalgia for 3 days.';
    } else {
      native = dict.stomachTitle || 'पेट दर्द व गैस';
      english = 'Severe retrosternal epigastric burning with acid peptic dyspepsia.';
    }

    if (isRed) {
      setShowRedFlagBanner(true);
    }

    setCurrentPatient(prev => ({
      ...prev,
      selectedSymptom: native,
      englishTranslation: english,
      isEmergency: isRed
    }));
    setTypedSymptom(native);
    speakText(native);
  };


  // Generate Token & Register Encounter
  const handleGenerateToken = async () => {
    const tokenStr = currentPatient.isEmergency ? '#E-045' : '#042';
    setCurrentPatient(prev => ({ ...prev, tokenNumber: tokenStr }));
    setCurrentScreenIndex(4); // Screen Token
    speakText(dict.tokenVoice || `Your intake is complete. Your token number is 42.`);

    try {
      await dataService.create('encounters', {
        token_number: tokenStr,
        patient_name: currentPatient.name,
        chief_complaint: currentPatient.englishTranslation || currentPatient.selectedSymptom,
        triage_priority: currentPatient.isEmergency ? 'EMERGENCY_RED' : 'ROUTINE',
        pmjay_eligible: currentPatient.hasPmjay,
        status: currentPatient.isEmergency ? 'EMERGENCY_TRIAGE' : 'WAITING'
      });
    } catch (e) {
      console.warn('Encounter sync notice:', e);
    }

    if (onTokenGenerated) {
      onTokenGenerated({ hasRedFlag: currentPatient.isEmergency, token: tokenStr });
    }
  };

  // Download official OPD PDF slip
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      // Tricolor top banner
      doc.setFillColor(255, 153, 51);
      doc.rect(0, 0, 70, 3, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(70, 0, 70, 3, 'F');
      doc.setFillColor(19, 136, 8);
      doc.rect(140, 0, 70, 3, 'F');

      // Header Navy
      doc.setFillColor(34, 61, 121);
      doc.rect(0, 3, 210, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('ALL INDIA INSTITUTE OF AYURVEDA (AIIA)', 105, 12, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Ministry of Ayush, Government of India • Central OPD Clinical Facility', 105, 18, { align: 'center' });
      doc.setTextColor(255, 165, 48);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('PATIENT OPD TOKEN SLIP & CLINICAL INTAKE SUMMARY', 105, 24, { align: 'center' });

      // Patient Box
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(12, 32, 186, 26, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setTextColor(34, 61, 121);
      doc.setFont('helvetica', 'bold');
      doc.text(`Token: ${currentPatient.tokenNumber}`, 16, 38);
      doc.text(`Patient: ${currentPatient.name}`, 65, 38);
      doc.text(`Age/Sex: ${currentPatient.age} Yrs / ${currentPatient.gender}`, 145, 38);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(`ABHA ID: ${currentPatient.abhaId}`, 16, 45);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 65, 45);
      doc.text(`OPD Chamber: Room 4 (Kayachikitsa)`, 145, 45);

      doc.text(`Encounter: KIOSK-${Date.now().toString().slice(-6)}`, 16, 52);
      doc.text(`Status: Waiting in OPD Queue`, 65, 52);
      doc.text(`Scheme: PM-JAY Cashless Beneficiary`, 145, 52);

      // Symptoms
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(34, 61, 121);
      doc.text('1. VOICE-ELICITED CHIEF COMPLAINTS & INTAKE:', 14, 66);

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(12, 70, 186, 20, 2, 2, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`• Mother Tongue Spoken Voice: "${currentPatient.selectedSymptom}"`, 16, 76);
      doc.text(`• Standardized Clinical English: ${currentPatient.englishTranslation}`, 16, 82);
      doc.text(`• Triage: ${currentPatient.isEmergency ? 'EMERGENCY RED STAT' : 'Routine OPD Case'} • Mapped to ABDM Milestone 2`, 16, 87);

      // Regimen Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(34, 61, 121);
      doc.text('2. PROVISIONAL FORMULATIONS & SUPPORTIVE MEASURES:', 14, 98);

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(12, 102, 186, 32, 2, 2, 'FD');
      doc.setFontSize(8);
      doc.text('1. Tab. Paracetamol 650mg - 1 Tab TDS SOS (Take after meals for pain/fever relief)', 16, 110);
      doc.text('2. Tab. Pantoprazole 40mg - 1 Tab OD (Take 30 mins before breakfast on empty stomach)', 16, 118);
      doc.text('3. Topical Diclofenac Gel 1.16% - Apply to affected area BD (For joint pain relief)', 16, 126);

      // Footer
      doc.setDrawColor(203, 213, 225);
      doc.line(12, 142, 198, 142);
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('NRCeS FHIR R4 Bundle Linked • ABDM Milestone 1 & 2 Completed', 14, 148);
      doc.text('Show this printed slip at OPD Room 4 when token is announced.', 14, 153);

      doc.save(`AyuSetu_Slip_${currentPatient.tokenNumber.replace('#', '')}_${currentPatient.name.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.warn('PDF generation fallback to print:', e);
      window.print();
    }
  };

  return (
    <div data-screen={currentScreenIndex} className={`ayu-kiosk min-h-screen flex flex-col font-sans select-none relative overflow-x-hidden ${isHighContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-900'}`} style={{ fontSize: `${100 + fontSizeLevel * 10}%` }}>
      
      {/* Full-screen background for Language Selection Screen */}
      {currentScreenIndex === 0 && (
        <div 
          className="ayu-kiosk-hero-bg pointer-events-none fixed inset-0 z-0 overflow-hidden" 
          aria-hidden="true"
        >
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat bg-[center_right] md:bg-right transition-opacity duration-500 max-md:opacity-20 md:opacity-[0.88]"
            style={{
              backgroundImage: `url('/assets/design/care-continuum.jpg')`,
              ...(isHighContrast ? { opacity: 0.05 } : {}),
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 15%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.85) 55%, #000 70%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.03) 15%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.85) 55%, #000 70%)',
            }}
          />
          <div 
            className={`absolute inset-0 pointer-events-none ${
              isHighContrast 
                ? 'bg-gradient-to-r from-black via-black/80 to-transparent' 
                : 'bg-gradient-to-r from-[#fffdf8] via-[#fffdf8]/90 to-transparent'
            } w-full md:w-3/5 lg:w-1/2`}
          />
        </div>
      )}

      <header className="ayu-kiosk-header relative z-10">
        <a href="#/" className="ds-wordmark flex items-center gap-2.5" aria-label="AyuSetu home">
          {!logoError ? (
            <img
              src="/assets/ayusetu_logo.png"
              alt="AyuSetu"
              className="h-8 md:h-9 w-auto object-contain shrink-0"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span>Ayu<span lang="hi">सेतु</span></span>
          )}
        </a>
        <nav className="ayu-stepper" aria-label="Intake progress">
          {['Language','Identity','Voice','Scan','Complete'].map((label,index)=><button key={label} type="button" aria-current={index===currentScreenIndex?'step':undefined} onClick={()=>handleStepClick(index)}><span>{index+1}</span>{label}</button>)}
        </nav>
        <div className="ayu-kiosk-access">
          <button type="button" onClick={()=>setFontSizeLevel(fontSizeLevel > 0 ? 0 : 1)} aria-label="Toggle larger text"><Accessibility size={18}/><span>Aa</span></button>
          <button type="button" onClick={()=>setIsHighContrast(!isHighContrast)} aria-label="Toggle high contrast">Contrast</button>
          <button type="button" onClick={()=>setIsVoiceActive(!isVoiceActive)} aria-label={isVoiceActive?'Turn spoken guidance off':'Turn spoken guidance on'}>{isVoiceActive?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
        </div>
      </header>
      <div className="ayu-kiosk-subnav relative z-10"><button type="button" onClick={()=>currentScreenIndex>0?setCurrentScreenIndex(currentScreenIndex-1):(window.location.hash='#/')}><ArrowLeft size={15}/> Back</button><span><ShieldCheck size={14}/> Patient Verification · Review all extracted information</span><span>{currentScreenIndex+1} / 5</span></div>

      {/* Emergency Red-Flag Banner */}
      {showRedFlagBanner && (
        <div className="bg-red-600 text-white px-6 py-3.5 shadow-md flex items-center justify-between animate-pulse relative z-10">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-extrabold text-sm tracking-wide">EMERGENCY SYMPTOM DETECTED (Safety screen)</p>
              <p className="text-xs text-red-100">Critical chest/cardiac symptom detected. Staff alerted. Please proceed directly to Room 1.</p>
            </div>
          </div>
          <button onClick={() => setShowRedFlagBanner(false)} className="text-white text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col justify-start relative z-10 ${currentScreenIndex === 0 ? 'max-w-7xl' : 'max-w-5xl'}`}>

        {/* =================================================================== */}
        {/* SCREEN 1: LANGUAGE SELECTION */}
        {/* =================================================================== */}
        {currentScreenIndex === 0 && (
          <section className="ayu-language-screen space-y-6 text-left w-full max-w-2xl">
            <div className="py-4 space-y-1.5">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Choose your language</h2>
              <p className="text-slate-500 text-xs">Select your preferred language to continue</p>
            </div>

            {/* Zero-Click Emergency Panic Button */}
            <div className="w-full">
              <button onClick={handleZeroClickEmergency} className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-base md:text-lg shadow-xl shadow-red-600/30 border-2 border-red-400 flex items-center justify-between transition transform hover:scale-[1.01] active:scale-[0.98] animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-white animate-ping" />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🚨</span>
                      <span className="tracking-wide">ZERO-CLICK EMERGENCY OVERRIDE</span>
                    </div>
                    <p className="text-[11px] font-medium text-red-100 mt-0.5">అత్యవసర చికిత్స • आपातकालीन • அவசர சிகிச்சை • ತಕ್ಷಣದ ತುರ್ತು</p>
                  </div>
                </div>
                <span className="text-xs uppercase bg-white text-red-700 font-black px-3.5 py-2 rounded-xl border border-red-200 shadow-sm">
                  STAT ER ➔
                </span>
              </button>
            </div>

            <div className="ayu-language-grid grid grid-cols-2 sm:grid-cols-3 gap-4 w-full pt-4">
              {[
                { code: 'te-IN', native: 'తెలుగు', name: 'Telugu' },
                { code: 'hi-IN', native: 'हिन्दी', name: 'Hindi' },
                { code: 'en-IN', native: 'English', name: 'English' },
                { code: 'ta-IN', native: 'தமிழ்', name: 'Tamil' },
                { code: 'kn-IN', native: 'ಕನ್ನಡ', name: 'Kannada' },
                { code: 'mr-IN', native: 'मराठी', name: 'Marathi' },
                { code: 'bn-IN', native: 'বাংলা', name: 'Bengali' },
                { code: 'gu-IN', native: 'ગુજરાતી', name: 'Gujarati' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLang(lang.code)}
                  aria-label={`${lang.name} · ${lang.native}`} className={`bg-white/95 backdrop-blur-sm border-2 hover:border-[#223D79] hover:bg-[#D9CDBA]/20 p-6 rounded-2xl text-center shadow-sm transition active:scale-98 ${currentLanguage === lang.code ? 'border-[#FFA530] ring-2 ring-[#FFA530]/30' : 'border-slate-300'}`}
                >
                  <div className="text-3xl font-bold text-slate-900 mb-1">{lang.native}</div>
                  <div className="text-xs font-bold text-[#223D79]">{lang.name}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SCREEN 2: IDENTIFY (ABHA QR & NHCX PM-JAY) */}
        {/* =================================================================== */}
        {currentScreenIndex === 1 && (
          <section className="space-y-6">
            <div className="text-center space-y-1.5 pb-2">
              <h3 className="font-extrabold text-xl md:text-2xl text-slate-900">{dict.identifyTitle}</h3>
              <p className="text-xs text-slate-600">{dict.identifySub}</p>
            </div>

            {/* 5 Pictorial Option Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                {
                  id: 'qr',
                  title: dict.optQrTitle || 'Scan ABHA QR',
                  sub: dict.optQrSub || 'Point QR at camera scanner',
                  icon: (
                    <svg className="w-12 h-12 text-[#223D79]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm-6 4h2v4h-2v-4zm4 0h2v2h-2v-2z" />
                    </svg>
                  )
                },
                {
                  id: 'mobile',
                  title: dict.optMobTitle || 'Mobile Number',
                  sub: dict.optMobSub || '10-digit phone with OTP',
                  icon: (
                    <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  id: 'abha',
                  title: dict.optAbhaTitle || '14-Digit ABHA ID',
                  sub: dict.optAbhaSub || '91-XXXX-XXXX-XXXX',
                  icon: (
                    <svg className="w-12 h-12 text-[#223D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )
                },
                {
                  id: 'aadhaar',
                  title: dict.optAadhTitle || 'Aadhaar Card',
                  sub: dict.optAadhSub || '12-digit UIDAI number',
                  icon: (
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  id: 'register',
                  title: dict.optRegTitle || 'New Patient?',
                  sub: dict.optRegSub || 'Register & Create ABHA',
                  icon: (
                    <svg className="w-10 h-10 text-[#FFA530]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  )
                }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAuthMethod(opt.id as any)}
                  className={`p-4 rounded-2xl border-2 transition text-center space-y-2 flex flex-col items-center justify-between cursor-pointer ${authMethod === opt.id ? 'border-[#FFA530] bg-[#D9CDBA]/20 shadow-md scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300 opacity-80 hover:opacity-100'}`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-sm">
                    {opt.icon}
                  </div>
                  <div>
                    <span className="block font-black text-slate-900 text-xs sm:text-sm">{opt.title}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{opt.sub}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full w-full ${authMethod === opt.id ? 'bg-[#223D79] text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {authMethod === opt.id ? dict.btnSelected || '✓ Selected' : dict.btnSelect || 'Select'}
                  </span>
                </button>
              ))}
            </div>

            {/* Action Panel for Selected Method */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
              {/* Left Panel (7 Cols) */}
              <div className="md:col-span-7 bg-white border-2 border-slate-300 p-6 rounded-2xl space-y-4 shadow-sm">
                {authMethod === 'qr' && (
                  <div className="space-y-4 text-center">
                    <div className="w-36 h-36 mx-auto bg-slate-50 border-2 border-dashed border-[#FFA530] rounded-2xl flex items-center justify-center p-3">
                      <svg className="w-24 h-24 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h2v4h-2v-4zm-4-4h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm-6 4h2v4h-2v-4zm4 0h2v2h-2v-2z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => loadDemoPatient('9876543210')} className="w-full bg-[#223D79] hover:bg-[#1a2f5e] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow flex items-center justify-center gap-2">
                        <span>{dict.btnOpenCam || 'Open Camera to Scan QR'}</span>
                      </button>
                      <button onClick={() => loadDemoPatient('9876543210')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-3 rounded-xl text-xs border border-slate-300 transition">
                        ⚡ Use Sample ABHA QR Card (Ramesh Chandra)
                      </button>
                    </div>
                  </div>
                )}

                {authMethod === 'mobile' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 block">Enter Registered 10-Digit Mobile Number:</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-600 font-bold text-sm">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileInput}
                        onChange={e => setMobileInput(e.target.value)}
                        className="flex-1 border border-slate-300 rounded-r-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#FFA530]"
                      />
                    </div>
                    <button onClick={() => loadDemoPatient(mobileInput in PATIENT_DATABASE ? mobileInput : '9876543210')} className="w-full bg-[#223D79] hover:bg-[#1a2f5e] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow flex items-center justify-center gap-2">
                      <span>{dict.btnVerifyMob || 'Verify Mobile OTP & Fetch Records'}</span>
                    </button>
                    <button onClick={() => setMobileInput('9876543210')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-xl text-xs border border-slate-300 transition">
                      ⚡ Fill Sample Mobile (+91 98765 43210)
                    </button>
                  </div>
                )}

                {authMethod === 'abha' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 block">Enter 14-Digit ABHA Number or ABHA Address:</label>
                    <input
                      type="text"
                      value={abhaInput}
                      onChange={e => setAbhaInput(e.target.value)}
                      placeholder="91-XXXX-XXXX-XXXX or name@abdm"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#FFA530]"
                    />
                    <button onClick={() => loadDemoPatient('9876543210')} className="w-full bg-[#223D79] hover:bg-[#1a2f5e] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow flex items-center justify-center gap-2">
                      <span>{dict.btnFetchAbha || 'Fetch ABHA Profile'}</span>
                    </button>
                  </div>
                )}

                {authMethod === 'aadhaar' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 block">Enter 12-Digit Aadhaar Number (UIDAI):</label>
                    <input
                      type="text"
                      value={aadhaarInput}
                      onChange={e => setAadhaarInput(e.target.value)}
                      placeholder="8920-1920-4821"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#FFA530]"
                    />
                    <button onClick={() => loadDemoPatient('9876543210')} className="w-full bg-[#223D79] hover:bg-[#1a2f5e] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow flex items-center justify-center gap-2">
                      <span>{dict.btnVerifyAadh || 'Verify Aadhaar e-KYC'}</span>
                    </button>
                  </div>
                )}

                {authMethod === 'register' && (
                  <div className="space-y-3 text-xs">
                    <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">New Patient ABHA Registration</h4>
                        <p className="text-[11px] text-slate-500">Creates a new patient profile and records unique ABHA</p>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">ABDM M1 Compliant</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Full Name:</label>
                        <input type="text" value={regName} onChange={e => setRegName(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Age:</label>
                          <input type="number" value={regAge} onChange={e => setRegAge(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold" />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Gender:</label>
                          <select value={regGender} onChange={e => setRegGender(e.target.value)} className="w-full border border-slate-300 rounded-xl px-2 py-2 text-slate-900 font-semibold">
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Mobile:</label>
                        <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Aadhaar (Optional):</label>
                        <input type="text" value={regAadhaar} onChange={e => setRegAadhaar(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold" />
                      </div>
                    </div>
                    <button onClick={() => loadDemoPatient('9123456789')} className="w-full bg-[#FFA530] hover:bg-amber-600 text-[#223D79] font-black py-3 px-4 rounded-xl text-sm transition shadow flex items-center justify-center gap-2">
                      <span>⚡ Generate 14-Digit ABHA & Save to DB ➔</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Panel: Verified Patient Card (5 Cols) */}
              <div className="md:col-span-5 bg-white border-2 border-slate-300 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Patient Status</span>
                  <span className="text-[11px] bg-[#FFA530]/20 text-[#223D79] font-bold px-2.5 py-0.5 rounded-full border border-[#FFA530]">
                    ✓ ABDM Verified
                  </span>
                </div>

                <div className="flex items-center space-x-3 pb-2">
                  <div className="w-12 h-12 rounded-full bg-[#D9CDBA]/40 flex items-center justify-center text-[#223D79] font-black text-lg">
                    {currentPatient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{currentPatient.name}</h4>
                    <p className="text-xs text-slate-600">{currentPatient.age} Yrs • {currentPatient.gender} • {currentPatient.city}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Auth Method:</span>
                    <span className="font-bold text-[#223D79]">{currentPatient.authMethod}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">ABHA ID:</span>
                    <span className="font-mono font-bold text-slate-900">{currentPatient.abhaId}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">ABHA Address:</span>
                    <span className="font-mono font-bold text-slate-900">{currentPatient.abhaAddress}</span>
                  </div>
                </div>

                {/* PM-JAY Verification Badge */}
                {currentPatient.hasPmjay && (
                  <div className="p-3.5 rounded-xl bg-[#D9CDBA]/30 border border-amber-300 flex items-center space-x-3">
                    <svg className="w-7 h-7 text-amber-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="font-extrabold text-xs text-amber-900">{dict.pmjayTitle}</p>
                      <p className="text-[11px] text-amber-800">{dict.pmjayDesc}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button onClick={() => setCurrentScreenIndex(0)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-3 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1 transition">
                    <span>{dict.headerBack || 'Back'}</span>
                  </button>
                  <button onClick={() => setCurrentScreenIndex(2)} className="flex-1 bg-slate-900 hover:bg-[#1a2f5e] text-white border border-[#D9CDBA]/30 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition shadow">
                    {dict.continueVoiceBtn || 'Continue to Voice Symptom Intake ➔'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SCREEN 3: VOICE (EXACT USER SCREENSHOT REPLICA) */}
        {/* =================================================================== */}
        {currentScreenIndex === 2 && (
          <section className="space-y-6">
            {/* DSP Ambient Noise Suppression Status */}
            <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-200 rounded-xl text-xs border border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-[11px]">DSP Noise Suppression Active</span>
                <span className="text-slate-400 text-[10px] hidden sm:inline">(≤70 dB Hospital Waiting Hall Noise Filtered)</span>
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-[10px] text-emerald-400">
                <span>Mic SNR: +18dB</span>
                <span className="w-12 bg-[#1a2f5e] text-white border border-[#D9CDBA]/30 h-1.5 rounded-full overflow-hidden inline-block">
                  <span className="bg-emerald-400 h-full w-3/4 block" />
                </span>
              </div>
            </div>

            {/* Voice Assistant Question Box */}
            <div className="bg-white border-2 border-slate-300 p-6 rounded-2xl shadow-sm text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs font-bold text-[#223D79] tracking-wide uppercase">AI Scribe & Triage Ready</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                "{dict.aiQuestion}"
              </h3>
              <p className="text-xs text-slate-600">{dict.aiQuestionSub}</p>
            </div>

            {/* Pictorial Symptom Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Knee / Joint Pain */}
              <button
                onClick={() => handleSymptomSelect('knee')}
                className="bg-white border-2 border-slate-300 hover:border-[#223D79] hover:bg-[#D9CDBA]/20 p-4 rounded-xl text-center flex flex-col items-center justify-center shadow-sm transition active:scale-98"
              >
                <svg className="w-10 h-10 text-[#223D79] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-slate-900 text-sm">{dict.kneeTitle}</span>
              </button>

              {/* Chest Pain (Red-Flag) */}
              <button
                onClick={() => handleSymptomSelect('chest')}
                className="bg-white border-2 border-red-300 hover:border-red-600 hover:bg-red-50 p-4 rounded-xl text-center flex flex-col items-center justify-center shadow-sm transition active:scale-98"
              >
                <svg className="w-10 h-10 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-bold text-slate-900 text-sm">{dict.chestTitle}</span>
              </button>

              {/* Fever */}
              <button
                onClick={() => handleSymptomSelect('fever')}
                className="bg-white border-2 border-slate-300 hover:border-[#223D79] hover:bg-[#D9CDBA]/20 p-4 rounded-xl text-center flex flex-col items-center justify-center shadow-sm transition active:scale-98"
              >
                <svg className="w-10 h-10 text-[#FFA530] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-bold text-slate-900 text-sm">{dict.feverTitle}</span>
              </button>

              {/* Stomach / Digestion */}
              <button
                onClick={() => handleSymptomSelect('stomach')}
                className="bg-white border-2 border-slate-300 hover:border-[#223D79] hover:bg-[#D9CDBA]/20 p-4 rounded-xl text-center flex flex-col items-center justify-center shadow-sm transition active:scale-98"
              >
                <svg className="w-10 h-10 text-emerald-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-bold text-slate-900 text-sm">{dict.stomachTitle}</span>
              </button>
            </div>

            {/* Dual Intake Engine: Speak (Mic) OR Type */}
            <div className="bg-white border-2 border-slate-300 p-6 rounded-2xl shadow-sm space-y-4">
              {/* Input Method Tabs */}
              <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl max-w-md mx-auto border border-slate-200">
                <button
                  onClick={() => setIntakeMode('voice')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${intakeMode === 'voice' ? 'bg-[#223D79] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  <span>{dict.tabVoice}</span>
                </button>
                <button
                  onClick={() => setIntakeMode('type')}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${intakeMode === 'type' ? 'bg-[#223D79] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>{dict.tabType}</span>
                </button>
              </div>

              {intakeMode === 'voice' && <VoiceInput language={currentLanguage} onType={()=>setIntakeMode("type")} onTranscript={(text) => { setTypedSymptom(text); setCurrentPatient(prev => ({...prev, selectedSymptom:text, englishTranslation:text})); }} />}

              {/* Type Mode */}
              {intakeMode === 'type' && (
                <div className="space-y-3 max-w-2xl mx-auto text-left">
                  <div className="space-y-1">
                    <label className="font-bold text-xs text-slate-800 block">{dict.typePrompt}</label>
                    <textarea
                      rows={3}
                      value={typedSymptom}
                      onChange={e => {
                        setTypedSymptom(e.target.value);
                        setCurrentPatient(prev => ({
                          ...prev,
                          selectedSymptom: e.target.value,
                          englishTranslation: e.target.value
                        }));
                      }}
                      className="w-full p-3 text-sm text-slate-900 border-2 border-slate-300 rounded-xl focus:border-[#223D79] focus:ring-2 focus:ring-[#223D79]/20 focus:outline-none transition font-medium"
                    />
                  </div>
                  {/* Quick Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 block">{dict.quickChipsLabel}</span>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {[
                        { text: '🚨 सीने में तेज दर्द (Chest Pain)', val: 'अचानक सीने में बहुत तेज दर्द और सांस फूलने की समस्या हो रही है' },
                        { text: '🦴 घुटनों में दर्द (Knee Pain)', val: 'मुझे दोनों घुटनों में पिछले 6 महीनों से दर्द और अकड़न है' },
                        { text: '🌡️ तेज बुखार और ठंड (Fever)', val: 'मुझे 3 दिनों से तेज बुखार, बदन दर्द और कंपकंपी है' },
                        { text: '🌿 पेट में जलन और गैस (Acidity)', val: 'पेट में बहुत तेज जलन, गैस और खट्टी डकारें आ रही हैं' }
                      ].map(chip => (
                        <button
                          key={chip.text}
                          onClick={() => {
                            setTypedSymptom(chip.val);
                            setCurrentPatient(prev => ({ ...prev, selectedSymptom: chip.val, englishTranslation: chip.val }));
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 hover:border-blue-400 rounded-lg text-[11px] font-medium transition text-left"
                        >
                          {chip.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Transcription & Translation Cards (EXACT SCREENSHOT) */}
              <div className="w-full space-y-2 mt-2 pt-2 border-t border-slate-100">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">🎙️ Spoken / Typed Patient Input (Native):</span>
                    <p className="text-xs text-slate-800 font-semibold italic mt-0.5 min-h-[18px]">
                      "{currentPatient.selectedSymptom || 'मुझे 6 महीने से दोनों घुटनों में दर्द है'}"
                    </p>
                  </div>
                  <button
                    onClick={() => speakText(currentPatient.selectedSymptom || 'मुझे 6 महीने से दोनों घुटनों में दर्द है')}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-[#223D79] border border-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm transition"
                  >
                    <svg className="w-3.5 h-3.5 text-[#223D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>{dict.listenBtn || 'Listen'}</span>
                  </button>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-left">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1">
                    <span>🌐 Sarvam AI Real-Time Translation (Clinical English):</span>
                  </span>
                  <p className="text-xs text-emerald-900 font-bold mt-0.5 min-h-[18px]">
                    {currentPatient.englishTranslation || 'Bilateral knee joint pain with morning stiffness for 6 months.'}
                  </p>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="w-full pt-2 flex justify-between gap-3">
                <button onClick={() => setCurrentScreenIndex(1)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-3 px-5 rounded-xl text-xs flex items-center gap-1.5 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>{dict.headerBack || 'Back'}</span>
                </button>
                <button onClick={() => setCurrentScreenIndex(3)} className="bg-slate-900 hover:bg-[#1a2f5e] text-white border border-[#D9CDBA]/30 font-bold py-3 px-6 rounded-xl text-sm transition">
                  {dict.nextScanBtn || 'Next: Scan Paper Prescriptions ➔'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SCREEN 4: PRESCRIPTION SCANNER */}
        {/* =================================================================== */}
        {currentScreenIndex === 3 && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left: Rx Scanner Placeholder */}
              <div className="bg-white border-2 border-slate-300 p-6 md:p-8 rounded-2xl text-center space-y-4 shadow-sm relative overflow-hidden">
                <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-center p-4">
                  <svg className="w-16 h-16 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-bold text-slate-800 text-sm">{dict.scanRxTitle}</span>
                  <span className="text-xs text-slate-500 mt-1">{dict.scanRxSub}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => {}} className="w-full bg-[#223D79] hover:bg-[#1a2f5e] text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm transition shadow flex items-center justify-center gap-1.5">
                    <span>📷 Camera Scan</span>
                  </button>
                  <label className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-3 rounded-xl text-xs sm:text-sm transition shadow flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>📁 Upload Image</span>
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e: any) => {
                      if (e.target.files?.[0]) {
                        setScannedDocs(prev => [...prev, {
                          name: e.target.files[0].name,
                          meds: 'Tab. Paracetamol 650mg TDS • Tab. Pantocid 40mg OD',
                          labs: 'Normal CBC • Platelets: 2.1 Lakhs'
                        }]);
                      }
                    }} />
                  </label>
                </div>

                {/* Uploaded Documents Tray */}
                <div className="text-left pt-2 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">📁 Uploaded Documents / Pages:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {scannedDocs.map((doc, idx) => (
                      <span key={doc.name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#223D79] text-[11px] font-bold shadow-sm">
                        <span>📄 {doc.name}</span>
                        <span className="text-[9px] bg-blue-200 text-blue-900 px-1 py-0.2 rounded font-black">#{idx + 1}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Extracted Data Cards */}
              <div className="bg-white border-2 border-slate-300 p-6 rounded-2xl space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#223D79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{dict.ocrHead}</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900">Current Medication:</span> Telmisartan 40mg OD • Paracetamol 650mg SOS
                  </div>
                  <div className="p-2.5 bg-[#D9CDBA]/30 rounded-lg border border-amber-200">
                    <span className="font-bold text-amber-900">Lab Results:</span> Serum Uric Acid: 7.8 mg/dL (High) • HbA1c: 6.1%
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button onClick={handleGenerateToken} className="w-full bg-[#223D79] hover:bg-[#1a2f5e] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-[#223D79]/20">
                    {dict.confirmTokenBtn || 'Confirm & Generate Token ➔'}
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => setCurrentScreenIndex(2)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 transition">
                      <span>{dict.headerBack || 'Back'}</span>
                    </button>
                    <button onClick={handleGenerateToken} className="flex-1 bg-white hover:bg-gray-50 text-slate-600 border border-slate-300 font-bold py-3.5 px-4 rounded-xl text-sm transition">
                      {dict.skipBtnText || 'Skip / No Documents ➔'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* SCREEN 5: TOKEN ISSUED */}
        {/* =================================================================== */}
        {currentScreenIndex === 4 && (
          <section className="text-center space-y-6">
            <div className={`p-8 rounded-3xl max-w-md mx-auto shadow-sm space-y-4 ${currentPatient.isEmergency ? 'bg-rose-50 border-4 border-rose-600 animate-pulse' : 'bg-white border-2 border-slate-300'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${currentPatient.isEmergency ? 'bg-rose-100 text-rose-700' : 'bg-[#FFA530]/20 text-emerald-700'}`}>
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className={`font-black text-2xl ${currentPatient.isEmergency ? 'text-rose-800' : 'text-slate-900'}`}>
                  {currentPatient.isEmergency ? '🚨 STAT EMERGENCY TRIAGE ACTIVATED' : dict.tokenDone}
                </h3>
                <p className="text-xs text-slate-600">All India Institute of Ayurveda • OPD Room 4</p>
              </div>

              <div className="py-4 border-y border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{dict.tokenSub}</p>
                <p className={`text-6xl font-black my-1 ${currentPatient.isEmergency ? 'text-rose-700' : 'text-[#223D79]'}`}>
                  {currentPatient.tokenNumber}
                </p>
                {currentPatient.hasPmjay && !currentPatient.isEmergency && (
                  <span className="inline-block bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-300">
                    PM-JAY Beneficiary • Cashless
                  </span>
                )}
              </div>

              <p className={`text-xs ${currentPatient.isEmergency ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                {currentPatient.isEmergency ? 'Emergency Crash Cart & Nursing Team alerted. ER staff approaching immediately.' : dict.tokenMsg}
              </p>

              <button onClick={handleDownloadPdf} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>📥 Download / Print OPD Slip & Prescription (PDF)</span>
              </button>

              <button onClick={() => setCurrentScreenIndex(0)} className="w-full bg-slate-900 hover:bg-[#1a2f5e] text-white border border-[#D9CDBA]/30 font-bold py-3.5 px-4 rounded-xl text-sm transition">
                {dict.nextPatBtn || 'Start Next Patient'}
              </button>
            </div>
          </section>
        )}

      </main>

      {/* Voice Modal Fallback */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border-2 border-[#223D79] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                <h3 className="font-bold text-base text-[#223D79]">🎙️ Voice Intake</h3>
              </div>
              <button onClick={() => setShowVoiceModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">✕</button>
            </div>
            <textarea
              rows={3}
              value={typedSymptom}
              onChange={e => setTypedSymptom(e.target.value)}
              className="w-full p-2.5 text-xs text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#223D79] focus:outline-none"
              placeholder="Describe your symptoms in your language..."
            />
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowVoiceModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                Cancel
              </button>
              <button
                onClick={() => {
                  setCurrentPatient(prev => ({ ...prev, selectedSymptom: typedSymptom, englishTranslation: typedSymptom }));
                  setShowVoiceModal(false);
                  speakText(typedSymptom);
                }}
                className="flex-1 py-2.5 bg-[#223D79] hover:bg-[#1a2f5e] text-white font-bold rounded-xl text-xs shadow"
              >
                ✓ Submit & Translate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Fixed Bottom Bar: 1-Click Demo Patient Credentials */}
      <footer className="ayu-demo-profiles mt-auto py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFA530] animate-ping" />
              <span className="text-xs font-black tracking-wider text-[#FFA530] uppercase">
                Clinical Test Profiles
              </span>
            </div>
            <button onClick={() => setIsFooterVisible(!isFooterVisible)} className="text-[11px] bg-white/10 hover:bg-white/20 text-[#D9CDBA] px-2 py-0.5 rounded border border-[#D9CDBA]/30">
              {isFooterVisible ? 'Hide' : 'Show profiles'}
            </button>
          </div>

          {isFooterVisible && (
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => loadDemoPatient('9876543210')} className="bg-[#1a2f5e] hover:bg-[#FFA530] hover:text-[#223D79] text-[#D9CDBA] border border-[#D9CDBA]/30 text-xs font-bold py-1.5 px-3 rounded-lg transition shadow flex items-center gap-1.5">
                <span>Ramesh Chandra (52M - Knee OA)</span>
              </button>
              <button onClick={() => loadDemoPatient('9811122334')} className="bg-[#1a2f5e] hover:bg-[#FFA530] hover:text-[#223D79] text-[#D9CDBA] border border-[#D9CDBA]/30 text-xs font-bold py-1.5 px-3 rounded-lg transition shadow flex items-center gap-1.5">
                <span>Priya Sharma (34F - Acidity)</span>
              </button>
              <button onClick={() => loadDemoPatient('9777788899')} className="bg-[#1a2f5e] hover:bg-[#FFA530] hover:text-[#223D79] text-[#D9CDBA] border border-[#D9CDBA]/30 text-xs font-bold py-1.5 px-3 rounded-lg transition shadow flex items-center gap-1.5">
                <span>Mohan Das (61M - Cardiac Red-Flag)</span>
              </button>
              <button onClick={() => loadDemoPatient('9123456789')} className="bg-[#1a2f5e] hover:bg-[#FFA530] hover:text-[#223D79] text-[#D9CDBA] border border-[#D9CDBA]/30 text-xs font-bold py-1.5 px-3 rounded-lg transition shadow flex items-center gap-1.5">
                <span>Ananya Verma (28F - New ABHA)</span>
              </button>
            </div>
          )}
        </div>
      </footer>

    </div>
  );
}
export default PatientKiosk;
