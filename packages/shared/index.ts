import { z } from "zod";

// Base entity schemas
export const PatientSchema = z.object({
  id: z.string(),
  abhaId: z.string().optional(),
  name: z.string(),
  dob: z.string(),
  sex: z.enum(["M", "F", "O"]),
  phoneHash: z.string(),
  preferredLang: z.enum(["hi", "en", "pa", "ta"]),
});

export type Patient = z.infer<typeof PatientSchema>;

export const EncounterSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  clinicId: z.string(),
  tier: z.number().int().min(0).max(3),
  chiefComplaint: z.string(),
  createdAt: z.string(),
});

export type Encounter = z.infer<typeof EncounterSchema>;

// Money helper (Strict integer paise)
export function formatPaiseToRupees(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
