import { describe, expect, it } from "vitest";
import app from "../backend/src/index";

describe("AyuSetu Vitalis — API Routes (/api/v1/vitalis)", () => {
  it("GET /api/v1/vitalis/overview returns patient overview and calculated HPI score", async () => {
    const res = await app.request("/api/v1/vitalis/overview", {
      headers: { "X-Patient-Id": "test_patient_001" },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.data).toBeDefined();
    expect(body.data.profile.patientId).toBe("test_patient_001");
    expect(body.data.healthspanIndex.status).toBe("ADEQUATE_DATA");
    expect(body.data.healthspanIndex.hpiScore).toBeGreaterThanOrEqual(0);
    expect(body.data.topRecommendations.length).toBeGreaterThan(0);
  });

  it("PUT /api/v1/vitalis/profile updates profile and preserves patient isolation", async () => {
    const updatePayload = {
      patientId: "test_patient_002",
      yearOfBirth: 1980,
      sex: "FEMALE",
      heightCm: 165,
      weightKg: 62,
      diagnosedConditions: ["Mild Hypertension"],
      medications: ["Telmisartan 20mg"],
      allergies: ["Penicillin"],
      dietPreference: "vegetarian",
      activityLimitations: [],
      goals: ["strength", "sleep"],
      smokingStatus: "never",
      alcoholIntake: "none",
      clinicianRestrictedExertion: false,
      onboardingVersion: "2026.1",
    };

    const res = await app.request("/api/v1/vitalis/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Patient-Id": "test_patient_002",
      },
      body: JSON.stringify(updatePayload),
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.data.yearOfBirth).toBe(1980);
    expect(body.data.diagnosedConditions).toContain("Mild Hypertension");
  });

  it("POST /api/v1/vitalis/assessments completes assessment and triggers safety gate triage", async () => {
    // 1. Start assessment
    const startRes = await app.request("/api/v1/vitalis/assessments", {
      method: "POST",
      headers: { "X-Patient-Id": "test_patient_003" },
    });
    expect(startRes.status).toBe(200);
    const startBody = (await startRes.json()) as any;
    const asmtId = startBody.data.id;

    // 2. Answer with urgent chest pain flag
    await app.request(`/api/v1/vitalis/assessments/${asmtId}/answers`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Patient-Id": "test_patient_003",
      },
      body: JSON.stringify({
        answers: {
          Q01: 1975,
          Q18: true, // Chest pain on exertion!
          Q38: true, // Chest discomfort right now!
        },
      }),
    });

    // 3. Complete assessment
    const completeRes = await app.request(`/api/v1/vitalis/assessments/${asmtId}/complete`, {
      method: "POST",
      headers: { "X-Patient-Id": "test_patient_003" },
    });
    expect(completeRes.status).toBe(200);
    const compBody = (await completeRes.json()) as any;
    expect(compBody.data.status).toBe("completed");
    expect(compBody.data.resultCategory).toBe("urgent_evaluation");
    expect(compBody.safety.decision).toBe("URGENT_EVALUATION");
    expect(compBody.safety.emergencyGuidance).toBeDefined();
  });

  it("GET /api/v1/vitalis/fitness/cardio returns VO2max record with explicit provenance", async () => {
    const res = await app.request("/api/v1/vitalis/fitness/cardio");
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.data.record.sourceType).toBe("wearable_estimated");
    expect(body.data.provenanceLabel).toContain("Wearable");
    expect(body.data.isLabMeasured).toBe(false);
  });

  it("POST /api/v1/vitalis/scenarios/simulate calculates projected active minutes without mortality claims", async () => {
    const res = await app.request("/api/v1/vitalis/scenarios/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentDailySteps: 4000,
        currentWeeklyStrengthSessions: 1,
        currentSleepHours: 6.5,
        simulatedExtraWalkMinutes: 30,
        simulatedExtraStrengthSessions: 1,
        simulatedEarlierBedtimeMinutes: 30,
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.data.projectedDailySteps).toBe(7000);
    expect(body.data.illustrativeNotice).toContain("models planned routine feasibility and schedule volume only");
  });

  it("GET /api/v1/vitalis/doctor-summary returns clinician report with disclaimer and algorithm versions", async () => {
    const res = await app.request("/api/v1/vitalis/doctor-summary", {
      headers: { "X-Patient-Id": "pat_doc_summary_test" },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.data.isClinicianConfirmed).toBe(false);
    expect(body.data.algorithmVersions.safetyGate).toBeDefined();
    expect(body.data.disclaimer).toContain("Not machine-diagnosed");
  });
});
