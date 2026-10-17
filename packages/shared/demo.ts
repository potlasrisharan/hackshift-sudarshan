import { fromIntakePatient, fromOpsReading, mergeRecord } from "./adapters";
import type { PlanInput } from "./contracts";

// MOCK: purpose-built synthetic fixtures; never copied from the imported patient DB.
export function demoRecord() {
  const patient = fromIntakePatient(
    {
      id: "sunita-demo",
      full_name: "Sunita • Demo patient",
      age: 34,
      gender: "FEMALE",
    },
    "1992-04-12",
  );
  const observations = mergeRecord([
    fromOpsReading({
      id: "bp-1",
      patient_id: patient.id,
      systolic: 124,
      recorded_at: "2026-10-10T08:00:00Z",
    }),
    {
      id: "intake-bp-2",
      patientId: patient.id,
      code: "8480-6",
      value: 128,
      unit: "mm[Hg]",
      sampledAt: "2026-10-12T08:00:00Z",
      source: "project-2",
    },
  ]);
  return { patient, observations };
}
export function demoPlan(): PlanInput {
  return {
    prescription: {
      salt: "metformin",
      strengthMg: 500,
      form: "tablet",
      units: 60,
      courseEnd: "2026-11-16",
    },
    homeClinic: "North",
    transferPaise: 1000,
    allergies: [],
    batches: [
      {
        id: "north-expiring",
        clinic: "North",
        salt: "metformin",
        strengthMg: 500,
        form: "tablet",
        stock: 80,
        pricePaise: 80,
        expiry: "2026-10-30",
      },
      {
        id: "north-valid",
        clinic: "North",
        salt: "metformin",
        strengthMg: 500,
        form: "tablet",
        stock: 80,
        pricePaise: 200,
        expiry: "2027-07-01",
      },
      {
        id: "east-valid",
        clinic: "East",
        salt: "metformin",
        strengthMg: 500,
        form: "tablet",
        stock: 80,
        pricePaise: 90,
        expiry: "2027-08-01",
      },
      {
        id: "wrong-strength",
        clinic: "South",
        salt: "metformin",
        strengthMg: 850,
        form: "tablet",
        stock: 80,
        pricePaise: 50,
        expiry: "2027-07-01",
      },
    ],
  };
}
export const demoReadings = Array.from({ length: 21 }, (_, day) => ({
  day,
  value: day < 10 ? 125 + (day % 3) - 1 : 125 + Math.min(20, (day - 9) * 2),
}));
