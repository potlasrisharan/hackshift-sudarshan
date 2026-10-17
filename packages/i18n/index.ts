export const languages = {
  "en-IN": "English",
  "hi-IN": "हिन्दी",
  "ta-IN": "தமிழ்",
  "te-IN": "తెలుగు",
} as const;
export type Language = keyof typeof languages;
// MOCK: interface strings are illustrative translations, not clinician verified.
export const words: Record<
  Language,
  {
    today: string;
    thread: string;
    medicines: string;
    monitor: string;
    privacy: string;
    lab: string;
    welcome: string;
    demo: string;
  }
> = {
  "en-IN": {
    today: "Today",
    thread: "Your health thread",
    medicines: "Medicine access",
    monitor: "Home monitoring",
    privacy: "Privacy",
    lab: "Algorithm lab",
    welcome: "A little care, every day.",
    demo: "Demo data",
  },
  "hi-IN": {
    today: "आज",
    thread: "आपका स्वास्थ्य रिकॉर्ड",
    medicines: "दवा की उपलब्धता",
    monitor: "घर पर निगरानी",
    privacy: "गोपनीयता",
    lab: "एल्गोरिदम लैब",
    welcome: "हर दिन, थोड़ा ख्याल।",
    demo: "डेमो डेटा",
  },
  "ta-IN": {
    today: "இன்று",
    thread: "உங்கள் சுகாதார பதிவு",
    medicines: "மருந்து அணுகல்",
    monitor: "வீட்டுக் கண்காணிப்பு",
    privacy: "தனியுரிமை",
    lab: "வழிமுறை ஆய்வகம்",
    welcome: "ஒவ்வொரு நாளும் சிறிது கவனிப்பு.",
    demo: "மாதிரி தரவு",
  },
  "te-IN": {
    today: "ఈరోజు",
    thread: "మీ ఆరోగ్య రికార్డు",
    medicines: "మందుల లభ్యత",
    monitor: "ఇంటి పర్యవేక్షణ",
    privacy: "గోప్యత",
    lab: "అల్గోరిథం ల్యాబ్",
    welcome: "ప్రతి రోజు, కొంత శ్రద్ధ.",
    demo: "నమూనా డేటా",
  },
};
