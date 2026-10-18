import { Hono } from "hono";
import { z } from "zod";
import { sentinel } from "../../../../packages/engine";
import { getClinicalRedFlags, getIntakeQuestion } from "../../../../packages/engine/clinicalIntake";
import { savePatientToStore, type PatientRecord } from "../../index";
import type { Database } from "../../database";
import { tokenHash } from "../../security";

export const intakeRouter = new Hono<{ Bindings: { SARVAM_API_KEY?: string; DB?: Database } }>();

intakeRouter.post("/session", async (c) => {
  let answers: Record<string, "yes" | "no" | "unsure"> = {};
  try {
    const body = (await c.req.json()) as { answers?: Record<string, "yes" | "no" | "unsure"> };
    if (body && typeof body === "object") {
      answers = body.answers ?? (body as Record<string, "yes" | "no" | "unsure">);
    }
  } catch {
    // If no body provided, defaults to empty answers
  }

  const triageResult = sentinel({ answers });
  const triageTier = triageResult.tier === "emergency" ? 3 : 1;

  return c.json({
    sessionId: "sess_" + Date.now(),
    status: "active",
    triageTier,
    triage: triageResult,
    timestamp: new Date().toISOString()
  });
});

intakeRouter.post("/sentinel", async (c) => {
  const body = await c.req.json();
  const triageResult = sentinel(body);
  return c.json(triageResult);
});

intakeRouter.post("/consent", async (c) => {
  return c.json({
    status: "granted",
    consentReceipt: "cr_" + Date.now(),
    purposes: ["care", "pharmacy", "home"]
  });
});

intakeRouter.post("/stt", async (c) => {
  return c.json({
    transcript: "Mujhe do din se sar dard aur bukhar hai",
    language: "hi",
    confidence: 0.94
  });
});

intakeRouter.post("/translate", async (c) => {
  let body: { text?: string; sourceLanguageCode?: string };
  try {
    body = z.object({
      text: z.string().trim().min(1).max(1000),
      sourceLanguageCode: z.string().regex(/^(auto|[a-z]{2,3}-IN)$/).optional(),
    }).parse(await c.req.json());
  } catch {
    return c.json({ error: "Provide text (1–1000 characters) and a valid source language." }, 400);
  }

  const text = body.text!;
  if (!c.env.SARVAM_API_KEY) {
    return c.json({ error: "Clinical translation is not configured. The original patient text is unchanged." }, 503);
  }

  // Keep common direct identifiers out of the third-party translation request.
  const providerInput = text
    .replace(/\b(?:\+?91[\s-]?)?[6-9]\d{9}\b/g, "[phone]")
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[identifier]")
    .replace(/\b[\w.+-]+@[\w.-]+\.[A-Z]{2,}\b/gi, "[email]")
    .replace(/\bmy name is\s+[^,.!?]+/gi, "my name is [redacted]")
    .replace(/मेरा नाम\s+[^,.!?]+/g, "मेरा नाम [redacted]");

  try {
    const response = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": c.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        input: providerInput,
        source_language_code: body.sourceLanguageCode || "auto",
        target_language_code: "en-IN",
        model: "mayura:v1",
        mode: "formal",
      }),
    });
    if (!response.ok) {
      return c.json({ error: "Translation service is temporarily unavailable. The original patient text is unchanged." }, 502);
    }
    const result = z.object({ translated_text: z.string().trim().min(1) }).safeParse(await response.json());
    if (!result.success) {
      return c.json({ error: "Translation service returned an invalid response. The original patient text is unchanged." }, 502);
    }
    return c.json({ original: text, clinicalTranslation: result.data.translated_text, source: "sarvam" });
  } catch {
    return c.json({ error: "Translation service is temporarily unavailable. The original patient text is unchanged." }, 502);
  }
});

intakeRouter.post("/soap", async (c) => {
  return c.json({
    soap: {
      subjective: "Patient reports headache and fever for 2 days.",
      objective: "Vitals stable, afebrile at intake.",
      assessment: "Acute febrile illness, likely viral.",
      plan: "Prescribed antipyretics and rest; hydration advised."
    },
    citations: ["utterance_0", "utterance_1"]
  });
});

intakeRouter.post("/chat", async (c) => {
  const kioskLanguages = ["en-IN", "hi-IN", "pa-IN", "ta-IN", "te-IN", "kn-IN", "mr-IN", "bn-IN", "gu-IN"] as const;
  const bodySchema = z.object({
    encounter_id: z.string().min(1).max(100).optional(),
    current_input: z.string().trim().min(1).max(1000),
    system_type: z.enum(["ALLOPATHY", "AYURVEDA", "COMBINED"]).default("ALLOPATHY"),
    language: z.enum(kioskLanguages).default("en-IN"),
    step_index: z.number().int().min(0).max(10).default(0),
    turns: z.array(z.object({
      question: z.string().max(300),
      answer: z.string().min(1).max(1000),
    })).max(10).default([]),
  });
  const parsed = bodySchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: "Provide a patient response and a valid intake step." }, 400);
  }

  const { current_input: currentInput, system_type: systemType, language, step_index: stepIndex, turns } = parsed.data;
  const transcript = [
    ...turns.map(({ answer }) => answer),
    currentInput,
  ].join(" ");
  const redFlags = getClinicalRedFlags(transcript);
  const answers: Record<string, "yes" | "no" | "unsure"> = {};
  if (redFlags.includes("chest_pain")) answers.chestPain = "yes";
  if (redFlags.includes("breathlessness")) answers.breathless = "yes";
  if (redFlags.includes("fainting")) answers.fainting = "yes";
  if (/\b(fever|bukhar|taap|बुखार|జ్వరం|காய்ச்சல்|ಜ್ವರ|તાવ|জ্বর)\b/i.test(transcript)) answers.fever = "yes";
  if (/\b(cough|khansi|खांसी|దగ్గు|இருமல்|ಕೆಮ್ಮು|ઉધરસ|কাশি)\b/i.test(transcript)) answers.cough = "yes";

  const start = performance.now();
  const triageResult = sentinel({ answers });
  const latencyMs = Number((performance.now() - start).toFixed(1));
  const isRedFlag = redFlags.length > 0 || triageResult.tier === "emergency";
  const nextQuestion = isRedFlag ? null : getIntakeQuestion(systemType, stepIndex);
  const complete = isRedFlag || nextQuestion === null;
  let replyText = nextQuestion ?? "Thank you. Your answers have been recorded for the clinician.";
  if (isRedFlag) {
    replyText = "Urgent symptoms need immediate in-person clinical assessment. Please alert the clinic staff now.";
  } else if (nextQuestion && language !== "en-IN" && c.env.SARVAM_API_KEY) {
    try {
      const translation = await fetch("https://api.sarvam.ai/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": c.env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
          input: nextQuestion,
          source_language_code: "en-IN",
          target_language_code: language,
          model: "mayura:v1",
          mode: "formal",
        }),
      });
      if (translation.ok) {
        const translated = z.object({ translated_text: z.string().trim().min(1).max(500) })
          .safeParse(await translation.json());
        if (translated.success) replyText = translated.data.translated_text;
      }
    } catch {
      // The English question remains usable when translation is unavailable.
    }
  }

  return c.json({
    encounter_id: parsed.data.encounter_id ?? null,
    system_type: systemType,
    reply_text: replyText,
    suggested_options: [],
    step_completed: complete,
    red_flag: {
      is_triggered: isRedFlag,
      trigger_symptoms: redFlags,
      latency_ms: latencyMs,
    },
    triage: triageResult,
  });
});

export interface EncounterRecord {
  id: string;
  token: string;
  token_number: string;
  clinic_id: string;
  org_id: string;
  patient_id: string;
  patient_name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER" | string;
  phone?: string;
  abha_id: string;
  pmjay_eligible: boolean;
  chief_complaint: string;
  selected_symptom: string;
  triage_priority: "EMERGENCY_RED" | "ROUTINE" | string;
  status: "WAITING" | "STAT_ALERT" | "IN_CONSULT" | "DISPENSED" | string;
  is_emergency: boolean;
  triage: any;
  vitals: Record<string, unknown>;
  soap: any;
  bay?: string | null;
  assigned_doctor?: string | null;
  created_at: string;
  updated_at: string;
}

export const encounterStore = new Map<string, EncounterRecord>();
const localTokenSequences = new Map<string, number>();

const defaultRameshEncounter: EncounterRecord = {
  id: "enc_ramesh_01",
  token: "TOKEN #042",
  token_number: "#042",
  clinic_id: "clinic-delhi-01",
  org_id: "org-ayusetu-primary",
  patient_id: "pat-048291",
  patient_name: "Ramesh Chandra",
  age: 52,
  gender: "MALE",
  phone: "+91 9876543210",
  abha_id: "91-4829-1029-4821",
  pmjay_eligible: true,
  chief_complaint: "Substernal Chest Pressure radiating to left arm",
  selected_symptom: "Chest pain",
  triage_priority: "EMERGENCY_RED",
  status: "STAT_ALERT",
  is_emergency: true,
  bay: "Emergency Bay 1",
  assigned_doctor: "Dr. Ananya Sharma",
  triage: { tier: "emergency", redFlags: ["chest_pain", "left_arm_radiation"] },
  vitals: { bp: "158/96 mmHg", pulse: 104, spo2: 95, temp: "98.6°F" },
  soap: {
    subjective: "52yo Male reports sudden onset retrosternal crushing pain radiating to left shoulder since 2 hours.",
    objective: "BP 158/96 mmHg (Critical elevation). Pulse 104 bpm regular. SpO2 95% on room air.",
    assessment: "Acute Coronary Syndrome (ACS) / NSTEMI rule-out.",
    plan: "STAT Aspirin 300mg + Clopidogrel 300mg + Cath Lab alert"
  },
  created_at: new Date(Date.now() - 3600000).toISOString(),
  updated_at: new Date(Date.now() - 3600000).toISOString()
};

const defaultSunitaEncounter: EncounterRecord = {
  id: "enc_sunita_02",
  token: "TOKEN #043",
  token_number: "#043",
  clinic_id: "clinic-delhi-01",
  org_id: "org-ayusetu-primary",
  patient_id: "pat_sunita",
  patient_name: "Sunita Devi",
  age: 48,
  gender: "FEMALE",
  phone: "+91 9876543211",
  abha_id: "91-2345-6789-0123",
  pmjay_eligible: true,
  chief_complaint: "Type 2 Diabetes routine checkup and Metformin refill",
  selected_symptom: "Routine Refill",
  triage_priority: "ROUTINE",
  status: "WAITING",
  is_emergency: false,
  bay: null,
  assigned_doctor: null,
  triage: { tier: "routine", redFlags: [] },
  vitals: { bp: "124/82 mmHg", pulse: 74, spo2: 98, temp: "98.4°F" },
  soap: null,
  created_at: new Date(Date.now() - 1800000).toISOString(),
  updated_at: new Date(Date.now() - 1800000).toISOString()
};

encounterStore.set(defaultRameshEncounter.id, defaultRameshEncounter);
encounterStore.set(defaultRameshEncounter.patient_id, defaultRameshEncounter);
encounterStore.set(defaultSunitaEncounter.id, defaultSunitaEncounter);
encounterStore.set(defaultSunitaEncounter.patient_id, defaultSunitaEncounter);

const defaultHarpreetEncounter: EncounterRecord = {
  id: "enc_harpreet_03",
  token: "TOKEN #044",
  token_number: "#044",
  clinic_id: "clinic-delhi-01",
  org_id: "org-ayusetu-primary",
  patient_id: "pat-048293",
  patient_name: "Harpreet Singh",
  age: 36,
  gender: "MALE",
  phone: "+91 9876543212",
  abha_id: "91-1029-4482-9912",
  pmjay_eligible: false,
  chief_complaint: "High Fever with Productive Cough and Purulent Sputum",
  selected_symptom: "Fever & Cough",
  triage_priority: "ROUTINE",
  status: "IN_CONSULT",
  is_emergency: false,
  bay: "OPD Consultation Room 2",
  assigned_doctor: "Dr. A. Sen, MD",
  triage: { tier: "routine", redFlags: [] },
  vitals: { bp: "122/78 mmHg", pulse: 92, spo2: 96, temp: "101.8°F" },
  soap: {
    subjective: "36yo Male presents with productive cough with yellow sputum for 3 days and fever spiking to 102F.",
    objective: "Bilateral basal coarse crepitations on auscultation. Temp 101.8F. SpO2 96%.",
    assessment: "Community-Acquired Acute Bronchitis / Lower Respiratory Tract Infection.",
    plan: "Amoxicillin-Clav 625mg + Paracetamol 650mg + Ambroxol Syrup"
  },
  created_at: new Date(Date.now() - 2400000).toISOString(),
  updated_at: new Date(Date.now() - 2400000).toISOString()
};

const defaultLakshmiEncounter: EncounterRecord = {
  id: "enc_lakshmi_04",
  token: "TOKEN #045",
  token_number: "#045",
  clinic_id: "clinic-delhi-01",
  org_id: "org-ayusetu-primary",
  patient_id: "pat-048294",
  patient_name: "Lakshmi Devi",
  age: 61,
  gender: "FEMALE",
  phone: "+91 9876543213",
  abha_id: "91-6621-9943-1205",
  pmjay_eligible: true,
  chief_complaint: "Bilateral Knee Pain and Joint Crepitus on Weight Bearing",
  selected_symptom: "Joint Pain",
  triage_priority: "ROUTINE",
  status: "DISPENSED",
  is_emergency: false,
  bay: null,
  assigned_doctor: "Dr. A. Sen, MD",
  triage: { tier: "routine", redFlags: [] },
  vitals: { bp: "136/82 mmHg", pulse: 74, spo2: 97, temp: "98.2°F" },
  soap: {
    subjective: "61yo Female presents with bilateral knee pain exacerbated by walking.",
    objective: "Bilateral knee joint line tenderness and coarse crepitus.",
    assessment: "Primary Bilateral Osteoarthritis of Knees (Grade II-III).",
    plan: "Aceclofenac + Paracetamol + Pantoprazole + Shelcal"
  },
  created_at: new Date(Date.now() - 4800000).toISOString(),
  updated_at: new Date(Date.now() - 1200000).toISOString()
};

const defaultAaravEncounter: EncounterRecord = {
  id: "enc_aarav_05",
  token: "TOKEN #046",
  token_number: "#046",
  clinic_id: "clinic-delhi-01",
  org_id: "org-ayusetu-primary",
  patient_id: "pat-048295",
  patient_name: "Aarav Patel",
  age: 8,
  gender: "MALE",
  phone: "+91 9876543214",
  abha_id: "91-8843-2019-3312",
  pmjay_eligible: true,
  chief_complaint: "Severe Acute Asthma Wheezing with Subcostal Retractions",
  selected_symptom: "Wheezing & Dyspnea",
  triage_priority: "EMERGENCY_RED",
  status: "STAT_ALERT",
  is_emergency: true,
  bay: "Pediatric Emergency Bay 2",
  assigned_doctor: "Dr. Ananya Sharma",
  triage: { tier: "emergency", redFlags: ["pediatric_hypoxia", "chest_retractions"] },
  vitals: { bp: "102/68 mmHg", pulse: 128, spo2: 91, temp: "99.1°F" },
  soap: {
    subjective: "8yo male brought with acute respiratory distress, tachypnea, and audible wheezing.",
    objective: "RR 34/min, marked intercostal indrawing, bilateral polyphonic wheeze. SpO2 91%.",
    assessment: "Severe Acute Bronchial Asthma Exacerbation (GINA 2024 Step-3).",
    plan: "STAT Nebulized Salbutamol + Ipratropium; Oral Prednisolone Syrup"
  },
  created_at: new Date(Date.now() - 1500000).toISOString(),
  updated_at: new Date(Date.now() - 1500000).toISOString()
};

const defaultPoojaEncounter: EncounterRecord = {
  id: "enc_pooja_06",
  token: "TOKEN #047",
  token_number: "#047",
  clinic_id: "clinic-delhi-01",
  org_id: "org-ayusetu-primary",
  patient_id: "pat-048296",
  patient_name: "Pooja Hegde",
  age: 28,
  gender: "FEMALE",
  phone: "+91 9876543215",
  abha_id: "91-5521-7784-9014",
  pmjay_eligible: true,
  chief_complaint: "Antenatal 28-Week Routine Checkup and Mild Pedal Edema",
  selected_symptom: "Antenatal Visit",
  triage_priority: "ROUTINE",
  status: "WAITING",
  is_emergency: false,
  bay: null,
  assigned_doctor: null,
  triage: { tier: "routine", redFlags: [] },
  vitals: { bp: "118/74 mmHg", pulse: 82, spo2: 99, temp: "98.4°F" },
  soap: null,
  created_at: new Date(Date.now() - 900000).toISOString(),
  updated_at: new Date(Date.now() - 900000).toISOString()
};

const defaultMohammedEncounter: EncounterRecord = {
  id: "enc_mohammed_07",
  token: "TOKEN #048",
  token_number: "#048",
  clinic_id: "clinic-delhi-01",
  org_id: "org-ayusetu-primary",
  patient_id: "pat-048297",
  patient_name: "Mohammed Rafiq",
  age: 64,
  gender: "MALE",
  phone: "+91 9876543216",
  abha_id: "91-3142-6689-1052",
  pmjay_eligible: false,
  chief_complaint: "CKD Stage 3b with Refractory Hypertension and Pruritus",
  selected_symptom: "Elevated BP & Kidney review",
  triage_priority: "ROUTINE",
  status: "IN_CONSULT",
  is_emergency: false,
  bay: "Nephrology Consultation Suite 1",
  assigned_doctor: "Dr. Potla Sri Sharan",
  triage: { tier: "routine", redFlags: [] },
  vitals: { bp: "162/98 mmHg", pulse: 68, spo2: 97, temp: "98.2°F" },
  soap: {
    subjective: "64yo male with CKD 3b, morning headaches and generalized pruritus.",
    objective: "BP 162/98 mmHg, Serum Creatinine 2.38 mg/dL, eGFR 38 mL/min.",
    assessment: "Diabetic Kidney Disease with Resistant Stage-2 Hypertension.",
    plan: "Telmisartan 40mg + Chlorthalidone 12.5mg + Sodamint 500mg"
  },
  created_at: new Date(Date.now() - 600000).toISOString(),
  updated_at: new Date(Date.now() - 600000).toISOString()
};

encounterStore.set(defaultHarpreetEncounter.id, defaultHarpreetEncounter);
encounterStore.set(defaultHarpreetEncounter.patient_id, defaultHarpreetEncounter);
encounterStore.set(defaultLakshmiEncounter.id, defaultLakshmiEncounter);
encounterStore.set(defaultLakshmiEncounter.patient_id, defaultLakshmiEncounter);
encounterStore.set(defaultAaravEncounter.id, defaultAaravEncounter);
encounterStore.set(defaultAaravEncounter.patient_id, defaultAaravEncounter);
encounterStore.set(defaultPoojaEncounter.id, defaultPoojaEncounter);
encounterStore.set(defaultPoojaEncounter.patient_id, defaultPoojaEncounter);
encounterStore.set(defaultMohammedEncounter.id, defaultMohammedEncounter);
encounterStore.set(defaultMohammedEncounter.patient_id, defaultMohammedEncounter);

intakeRouter.post("/encounter", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
  const rawAnswers = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Record<string, "yes" | "no">;
  const answers: Record<string, "yes" | "no"> = { ...rawAnswers };
  const intakeHistory = z.array(z.object({ answer: z.string().max(1000) })).max(10)
    .safeParse(body.intake_history);
  const historyText = intakeHistory.success
    ? intakeHistory.data.map(({ answer }) => answer).join(" ")
    : "";
  const symptomText = [body.chief_complaint, body.selected_symptom, body.selectedSymptom, body.symptom, historyText]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
  const detectedFlags = getClinicalRedFlags(symptomText);
  if (detectedFlags.includes("chest_pain")) answers.chestPain = "yes";
  if (detectedFlags.includes("breathlessness")) answers.breathless = "yes";
  if (detectedFlags.includes("fainting")) answers.fainting = "yes";

  if (
    symptomText.includes("chest") ||
    symptomText.includes("seene") ||
    symptomText.includes("sine") ||
    symptomText.includes("chhati") ||
    symptomText.includes("angina")
  ) {
    answers.chestPain = "yes";
  }
  if (symptomText.includes("breath") || symptomText.includes("saans")) {
    answers.breathless = "yes";
  }
  if (symptomText.includes("faint") || symptomText.includes("chakkar") || symptomText.includes("syncope")) {
    answers.fainting = "yes";
  }

  const triageResult = sentinel({ answers });
  const isEmergency = triageResult.tier === "emergency" || body.isEmergency === true || body.is_emergency === true;

  const rawId = body.patient_id ? String(body.patient_id) : body.patientId ? String(body.patientId) : undefined;
  const patientId = rawId || `pat_${Date.now()}`;
  const patientName = String(body.patient_name || body.name || "Patient");
  const genderRaw = String(body.gender || "MALE").toUpperCase();
  const gender: "MALE" | "FEMALE" | "OTHER" =
    genderRaw === "FEMALE" || genderRaw === "F" ? "FEMALE" : genderRaw === "OTHER" || genderRaw === "O" ? "OTHER" : "MALE";
  const phone = String(body.phone || body.contact || "+91 9876543210");
  const abhaId = body.abha_id ? String(body.abha_id) : body.abhaId ? String(body.abhaId) : body.abhaNumber ? String(body.abhaNumber) : "91-4829-1029-4821";
  const age = typeof body.age === "number" ? body.age : 45;
  const currentYear = new Date().getFullYear();
  const estimatedBirthYear = currentYear - age;
  const dob = String(body.dob || body.birthDate || body.birth_date || `${estimatedBirthYear}-01-01`);
  const bloodGroup = body.bloodGroup ? String(body.bloodGroup) : body.blood_group ? String(body.blood_group) : undefined;
  const address = body.address ? String(body.address) : undefined;
  const preferredLang = String(body.preferredLang || body.preferred_lang || body.language || "hi");

  const now = new Date().toISOString();
  const phoneHash = await tokenHash(phone);

  const patientRecord: PatientRecord = {
    id: patientId,
    orgId: "org-ayusetu-primary",
    name: patientName,
    phone,
    phoneHash,
    dob,
    gender,
    preferredLang,
    abhaNumber: abhaId,
    bloodGroup,
    address,
    allergies: Array.isArray(body.allergies) ? body.allergies.map(String) : [],
    chronicConditions: Array.isArray(body.chronicConditions) ? body.chronicConditions.map(String) : [],
    metadata: typeof body.metadata === "object" && body.metadata !== null ? (body.metadata as Record<string, unknown>) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  savePatientToStore(patientRecord);

  const clinicId = String(body.clinic_id || body.clinicId || "clinic-delhi-01");
  const orgId = String(body.org_id || body.orgId || "org-ayusetu-primary");
  const serviceDate = new Date().toISOString().slice(0, 10);
  let sequenceNumber: number;
  const db = c.env?.DB;
  if (db) {
    try {
      const row = await db.prepare(`
        INSERT INTO clinic_token_sequences (org_id, clinic_id, service_date, last_value)
        VALUES (?, ?, ?, COALESCE((
          SELECT MAX(token_number) FROM encounters
          WHERE org_id = ? AND clinic_id = ? AND date(created_at) = ?
        ), 0) + 1)
        ON CONFLICT (org_id, clinic_id, service_date)
        DO UPDATE SET last_value = clinic_token_sequences.last_value + 1
        RETURNING last_value
      `).bind(orgId, clinicId, serviceDate, orgId, clinicId, serviceDate).first<{ last_value: number }>();
      if (!row) throw new Error("Token sequence was not returned");
      sequenceNumber = row.last_value;
    } catch {
      return c.json({ success: false, error: "Could not issue a sequential clinic token." }, 503);
    }
  } else {
    const sequenceKey = `${orgId}:${clinicId}:${serviceDate}`;
    if (!localTokenSequences.has(sequenceKey)) {
      const existingMax = [...new Map([...encounterStore.values()].map(enc => [enc.id, enc])).values()]
        .filter(enc => enc.org_id === orgId && enc.clinic_id === clinicId)
        .map(enc => Number(enc.token_number.match(/\d+/)?.[0] || 0))
        .reduce((max, value) => Math.max(max, value), 0);
      localTokenSequences.set(sequenceKey, existingMax);
    }
    sequenceNumber = (localTokenSequences.get(sequenceKey) || 0) + 1;
    localTokenSequences.set(sequenceKey, sequenceNumber);
  }
  const token = `${isEmergency ? "E-" : "#"}${String(sequenceNumber).padStart(3, "0")}`;
  const initialStatus: "WAITING" | "STAT_ALERT" | "IN_CONSULT" | "DISPENSED" =
    body.status ? String(body.status).toUpperCase() as any : (isEmergency ? "STAT_ALERT" : "WAITING");

  const encounter: EncounterRecord = {
    id: body.id ? String(body.id) : `enc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    token,
    token_number: token,
    clinic_id: clinicId,
    org_id: orgId,
    patient_id: patientId,
    patient_name: patientName,
    age,
    gender,
    phone,
    abha_id: abhaId,
    pmjay_eligible: Boolean(body.pmjay_eligible ?? body.hasPmjay ?? true),
    chief_complaint: body.chief_complaint ? String(body.chief_complaint) : body.englishTranslation ? String(body.englishTranslation) : body.selectedSymptom ? String(body.selectedSymptom) : "Acute consultation",
    selected_symptom: body.selected_symptom ? String(body.selected_symptom) : body.selectedSymptom ? String(body.selectedSymptom) : "",
    triage_priority: isEmergency ? "EMERGENCY_RED" : (body.triage_priority ? String(body.triage_priority) : "ROUTINE"),
    status: initialStatus,
    is_emergency: isEmergency,
    triage: triageResult,
    vitals: typeof body.vitals === "object" && body.vitals !== null && !Array.isArray(body.vitals)
      ? body.vitals as Record<string, unknown>
      : {},
    soap: body.soap || null,
    bay: body.bay ? String(body.bay) : body.bay_assigned ? String(body.bay_assigned) : (isEmergency ? "Emergency Bay 1" : null),
    assigned_doctor: body.assigned_doctor ? String(body.assigned_doctor) : body.doctor_name ? String(body.doctor_name) : null,
    created_at: body.created_at ? String(body.created_at) : now,
    updated_at: now
  };

  encounterStore.set(encounter.id, encounter);
  encounterStore.set(encounter.patient_id, encounter);

  // Persist in D1 if bound
  if (db) {
    try {
      await db.batch([
        db.prepare("INSERT OR IGNORE INTO patients (id, org_id, name, phone_hash, abha_number, abha_address, dob, sex, preferred_lang) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(
          patientId, orgId, patientName, phoneHash, abhaId, typeof patientRecord.metadata?.abhaAddress === "string" ? patientRecord.metadata.abhaAddress : null, dob, gender, preferredLang
        ),
        db.prepare(
          "INSERT INTO encounters (id, org_id, clinic_id, patient_id, tier, chief_complaint, status, token_number, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
        encounter.id,
        encounter.org_id,
        encounter.clinic_id,
        encounter.patient_id,
        isEmergency ? 3 : 1,
        encounter.chief_complaint,
        encounter.status,
        sequenceNumber,
        encounter.created_at
        ),
      ]);
    } catch {
      encounterStore.delete(encounter.id);
      encounterStore.delete(encounter.patient_id);
      return c.json({ success: false, error: "Could not save the clinic encounter. Check the patient profile and database migrations." }, 503);
    }
  }

  return c.json({ success: true, encounter });
});

intakeRouter.get("/queue", async (c) => {
  const clinicId = c.req.query("clinic_id") || c.req.query("clinicId");
  const statusParam = c.req.query("status");

  const seen = new Set<string>();
  let encounters: EncounterRecord[] = [];
  for (const enc of encounterStore.values()) {
    if (!seen.has(enc.id)) {
      seen.add(enc.id);
      encounters.push(enc);
    }
  }

  // If D1 is bound, query persisted encounters
  const db = (c.env as any)?.DB;
  if (db) {
    try {
      const rows = await db.prepare("SELECT * FROM encounters ORDER BY created_at DESC LIMIT 50").all();
      if (rows?.results && rows.results.length > 0) {
        for (const r of rows.results as any[]) {
          if (!seen.has(r.id)) {
            seen.add(r.id);
            const restored: EncounterRecord = {
              id: r.id,
              token: r.token_number ? `${r.tier === 3 ? "E-" : "#"}${String(r.token_number).padStart(3, "0")}` : `#${r.id.slice(-3)}`,
              token_number: r.token_number ? `${r.tier === 3 ? "E-" : "#"}${String(r.token_number).padStart(3, "0")}` : `#${r.id.slice(-3)}`,
              clinic_id: r.clinic_id || "clinic-delhi-01",
              org_id: r.org_id || "org-ayusetu-primary",
              patient_id: r.patient_id,
              patient_name: "Patient " + (r.patient_id || "").slice(-4),
              age: 45,
              gender: "MALE",
              abha_id: "91-4829-1029-4821",
              pmjay_eligible: true,
              chief_complaint: r.chief_complaint || "Clinical consultation",
              selected_symptom: "",
              triage_priority: r.tier === 3 ? "EMERGENCY_RED" : "ROUTINE",
              status: r.status || "WAITING",
              is_emergency: r.tier === 3,
              triage: { tier: r.tier === 3 ? "emergency" : "routine" },
              vitals: { bp: "120/80 mmHg", pulse: 76, spo2: 98, temp: "98.4°F" },
              soap: null,
              created_at: r.created_at || new Date().toISOString(),
              updated_at: r.created_at || new Date().toISOString()
            };
            encounterStore.set(restored.id, restored);
            encounters.push(restored);
          }
        }
      }
    } catch {
      // In-memory fallback
    }
  }

  if (clinicId) {
    encounters = encounters.filter(e => !e.clinic_id || e.clinic_id === clinicId);
  }

  if (statusParam) {
    const statuses = statusParam.split(",").map(s => s.trim().toUpperCase());
    encounters = encounters.filter(e => statuses.includes(String(e.status).toUpperCase()));
  }

  // Sort: STAT_ALERT / EMERGENCY_RED first, then newest first
  encounters.sort((a, b) => {
    const aEmergency = a.status === "STAT_ALERT" || a.is_emergency;
    const bEmergency = b.status === "STAT_ALERT" || b.is_emergency;
    if (aEmergency && !bEmergency) return -1;
    if (!aEmergency && bEmergency) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return c.json({
    success: true,
    count: encounters.length,
    queue: encounters,
    encounters,
    timestamp: new Date().toISOString()
  });
});

const handleUpdateEncounter = async (c: any) => {
  const id = c.req.param("id");
  const body = (await c.req.json().catch(() => ({}))) as Record<string, any>;

  let encounter = encounterStore.get(id);
  if (!encounter) {
    for (const val of encounterStore.values()) {
      if (val.patient_id === id || val.token === id || val.token_number === id) {
        encounter = val;
        break;
      }
    }
  }

  if (!encounter) {
    return c.json({ success: false, error: "Encounter not found" }, 404);
  }

  const updatedStatus = body.status ? String(body.status).toUpperCase() : encounter.status;
  const isEmergency = updatedStatus === "STAT_ALERT" || body.is_emergency === true || encounter.is_emergency;

  const updated: EncounterRecord = {
    ...encounter,
    ...body,
    status: updatedStatus,
    bay: body.bay !== undefined ? body.bay : (body.bay_assigned !== undefined ? body.bay_assigned : encounter.bay),
    assigned_doctor: body.assigned_doctor !== undefined ? body.assigned_doctor : (body.doctor_name !== undefined ? body.doctor_name : encounter.assigned_doctor),
    triage_priority: body.triage_priority || (updatedStatus === "STAT_ALERT" ? "EMERGENCY_RED" : encounter.triage_priority),
    is_emergency: isEmergency,
    vitals: body.vitals || encounter.vitals,
    soap: body.soap !== undefined ? body.soap : encounter.soap,
    updated_at: new Date().toISOString()
  };

  encounterStore.set(encounter.id, updated);
  if (encounter.patient_id) {
    encounterStore.set(encounter.patient_id, updated);
  }

  const db = (c.env as any)?.DB;
  if (db) {
    try {
      await db.prepare("UPDATE encounters SET status = ? WHERE id = ?").bind(updated.status, encounter.id).run();
    } catch {
      // Ignore D1 error
    }
  }

  return c.json({ success: true, encounter: updated });
};

intakeRouter.patch("/encounter/:id", handleUpdateEncounter);
intakeRouter.post("/encounter/:id/status", handleUpdateEncounter);
intakeRouter.patch("/:id", handleUpdateEncounter);
intakeRouter.post("/:id/status", handleUpdateEncounter);

intakeRouter.get("/encounter/:id", async (c) => {
  const id = c.req.param("id");
  let encounter = encounterStore.get(id);
  if (!encounter) {
    for (const val of encounterStore.values()) {
      if (val.patient_id === id || val.token === id || val.token_number === id) {
        encounter = val;
        break;
      }
    }
  }
  if (!encounter) return c.json({ success: false, error: "Encounter not found" }, 404);
  return c.json({ success: true, encounter });
});

intakeRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  let encounter = encounterStore.get(id);
  if (!encounter) {
    for (const val of encounterStore.values()) {
      if (val.patient_id === id || val.token === id || val.token_number === id) {
        encounter = val;
        break;
      }
    }
  }
  if (!encounter) return c.json({ success: false, error: "Encounter not found" }, 404);
  return c.json({ success: true, encounter });
});

