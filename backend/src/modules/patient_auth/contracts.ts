import { z } from "zod";

export const patientSignupSchema = z.object({
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
  name: z.string().min(2),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).default("FEMALE"),
  email: z.string().email().optional().nullable(),
  preferredLang: z.string().default("hi"),
  abhaNumber: z.string().optional().nullable(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "UNKNOWN"]).optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const patientLoginSchema = z.object({
  identifier: z.string().min(3), // Phone, email, or ABHA
  password: z.string().min(1),
});

export const patientProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "UNKNOWN"]).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  preferredLang: z.string().optional(),
});

export const patientPreferencesSchema = z.object({
  primaryFocus: z.enum(["longevity", "womens_health", "yoga", "opd"]).default("longevity"),
  primaryModules: z.array(z.string()).default(["prescriptions", "vitalis", "her", "yoga"]),
  themeMode: z.enum(["light", "dark", "system"]).default("light"),
  colorAccent: z.string().default("botanical_teal"),
  language: z.string().default("hi"),
  notificationsEnabled: z.boolean().default(true),
  medicineRemindersEnabled: z.boolean().default(true),
  cycleRemindersEnabled: z.boolean().default(true),
  vitalsDriftAlertsEnabled: z.boolean().default(true),
  biometricLoginEnabled: z.boolean().default(false),
  reminderMorningTime: z.string().default("08:00"),
  reminderAfternoonTime: z.string().default("13:00"),
  reminderNightTime: z.string().default("20:30"),
});

export const ayurvedicProfileSchema = z.object({
  primaryDosha: z.enum(["VATA", "PITTA", "KAPHA", "VATA_PITTA", "PITTA_KAPHA", "VATA_KAPHA", "TRIDOSHA"]),
  secondaryDosha: z.string().default("NONE"),
  prakritiSummary: z.string(),
  vikritiAggravation: z.string().optional(),
  agniType: z.enum(["SAMAGNI", "VISHAMAGNI", "TIKSHNAGNI", "MANDAGNI"]).default("SAMAGNI"),
  koshthaType: z.enum(["MRIDU", "MADHYAMA", "KRURA"]).default("MADHYAMA"),
  dietaryGuidelines: z.array(z.string()).default([]),
  yogaRecommendations: z.array(z.string()).default([]),
});

export type PatientSignupInput = z.infer<typeof patientSignupSchema>;
export type PatientLoginInput = z.infer<typeof patientLoginSchema>;
export type PatientProfileUpdateInput = z.infer<typeof patientProfileUpdateSchema>;
export type PatientPreferencesInput = z.infer<typeof patientPreferencesSchema>;
export type AyurvedicProfileInput = z.infer<typeof ayurvedicProfileSchema>;
