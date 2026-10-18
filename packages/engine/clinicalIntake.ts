export type IntakeSystem = "ALLOPATHY" | "AYURVEDA" | "COMBINED";

const allopathyQuestions = [
  "When did this problem start, and has it changed over time?",
  "Where exactly do you feel it?",
  "How would you describe the feeling or discomfort?",
  "Does it spread or move to another part of your body?",
  "What other symptoms happen at the same time?",
  "Do you have any medicine or food allergies?",
];

const ayurvedaQuestions = [
  "How has your appetite and digestion been?",
  "Have you noticed any change in your bowel movements?",
  "How have your sleep and energy been?",
  "Do you feel more comfortable in warm or cool conditions?",
];

const redFlagPatterns: Array<{ id: string; pattern: RegExp }> = [
  {
    id: "chest_pain",
    pattern:
      /(\bchest pain\b|\bchest pressure\b|\bheart pain\b|\bangina\b|seene? me(?:n)? dard|सीने में.{0,20}दर्द|छाती में.{0,20}दर्द|छाती दुख|గుండె నొప్పి|மார்பு வலி|என் மார்பில் வலி|ಎದೆ ನೋವು|છાતીમાં દુખાવો|બুকে ব্যথা|বুকে ব্যথা)/i,
  },
  {
    id: "breathlessness",
    pattern:
      /(\bshortness of breath\b|\bdifficulty breathing\b|\bcannot breathe\b|\bcan't breathe\b|\bbreathless\b|saans (?:nahi|nahin) aa|दम घुट|सांस नहीं|साँस नहीं|శ్వాస తీసుకోలేను|மூச்சு விட முடியவில்லை|ಉಸಿರಾಡಲು ಆಗುತ್ತಿಲ್ಲ|શ્વાસ લેવામાં તકલીફ|শ্বাস নিতে পারছি না)/i,
  },
  {
    id: "fainting",
    pattern:
      /(\bfainted\b|\bfainting\b|\bpassed out\b|\bunconscious\b|\bsyncope\b|\bsudden severe dizziness\b|chakkar|बेहोश|चक्कर|చైతన్యం కోల్పోయ|మూర్ఛ|மயங்கி விழு|மயக்கம்|ಪ್ರಜ್ಞೆ ತಪ್ಪಿ|ತಲೆ ಸುತ್ತು|બેભાન|ચક્કર|অজ্ঞান|মাথা ঘুরে)/i,
  },
  {
    id: "bleeding",
    pattern:
      /(\bvomiting blood\b|\bblood in vomit\b|\bcoughing blood\b|\bsevere bleeding\b|खून की उल्टी|खून की खांसी|తీవ్ర రక్తస్రావం|இரத்த வாந்தி|ರಕ್ತ ವಾಂತಿ|લોહીની ઉલટી|রক্ত বমি)/i,
  },
  {
    id: "stroke_signs",
    pattern:
      /(\bsudden paralysis\b|\bface drooping\b|\bslurred speech\b|\bspeech difficulty\b|अचानक लकवा|चेहरा टेढ़ा|बोलने में दिक्कत|మాట్లాడలేక|முகம் ஒரு பக்கம்|ಮಾತು ತೊದಲಿಕೆ|ચહેરો વાંકો|কথা জড়িয়ে)/i,
  },
];

export function getClinicalRedFlags(text: string): string[] {
  return redFlagPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ id }) => id);
}

export function getIntakeQuestion(
  system: IntakeSystem,
  stepIndex: number,
): string | null {
  const questions =
    system === "AYURVEDA"
      ? ayurvedaQuestions
      : system === "COMBINED"
        ? [...allopathyQuestions, ...ayurvedaQuestions]
        : allopathyQuestions;
  return questions[stepIndex] ?? null;
}
