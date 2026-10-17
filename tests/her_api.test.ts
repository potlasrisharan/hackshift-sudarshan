/**
 * AyuSetu HER — End-to-End Backend API Test Suite
 * Validates /api/v1/her endpoints, deterministic safety gating,
 * cycle analysis, screening evidence, and doctor-ready summaries.
 */

import { describe, expect, it } from "vitest";
import backendApp from "../backend/src/index";

describe("AyuSetu HER — API Endpoints (/api/v1/her)", () => {
  const patientHeaders = {
    "X-Patient-Id": "pat_her_test_01",
    "Content-Type": "application/json",
  };

  it("manages patient profile and demographic history", async () => {
    // 1. Get initial profile
    const getRes = await backendApp.request("/api/v1/her/profile", {
      headers: patientHeaders,
    });
    expect(getRes.status).toBe(200);
    const initial = (await getRes.json()) as any;
    expect(initial.patientId).toBe("pat_her_test_01");

    // 2. Update profile
    const updateRes = await backendApp.request("/api/v1/her/profile", {
      method: "POST",
      headers: patientHeaders,
      body: JSON.stringify({
        yearOfBirth: 1999,
        menarcheAge: 12,
        dietPreference: "vegetarian",
        allergies: ["dairy_allergy"],
      }),
    });
    expect(updateRes.status).toBe(200);
    const updated = (await updateRes.json()) as any;
    expect(updated.yearOfBirth).toBe(1999);
    expect(updated.allergies).toContain("dairy_allergy");
  });

  it("seeds synthetic scenario B (PCOS Pattern) and detects cycle irregularities", async () => {
    // 1. Seed Demo Scenario B
    const seedRes = await backendApp.request("/api/v1/her/demo/seed", {
      method: "POST",
      headers: patientHeaders,
      body: JSON.stringify({ scenario: "SCENARIO_B_PCOS" }),
    });
    expect(seedRes.status).toBe(200);

    // 2. Query cycles and check deviation analysis
    const cyclesRes = await backendApp.request("/api/v1/her/cycles", {
      headers: patientHeaders,
    });
    expect(cyclesRes.status).toBe(200);
    const data = (await cyclesRes.json()) as any;
    expect(data.cycles.length).toBeGreaterThanOrEqual(3);
    expect(data.analysis.hasIrregularity).toBe(true);
    expect(data.analysis.longestCycleDays).toBeGreaterThanOrEqual(48);
  });

  it("evaluates screening engine without diagnostic claims", async () => {
    const screenRes = await backendApp.request("/api/v1/her/screening/evaluate", {
      method: "POST",
      headers: patientHeaders,
      body: JSON.stringify({}),
    });
    expect(screenRes.status).toBe(200);
    const data = (await screenRes.json()) as any;
    expect(Array.isArray(data.findings)).toBe(true);

    const pcosFinding = data.findings.find((f: any) => f.domain === "PCOS_FEATURES");
    expect(pcosFinding).toBeDefined();
    expect(pcosFinding.isDiagnosis).toBe(false);
    expect(["CLINICAL_REVIEW_SUGGESTED", "MONITOR_AND_TRACK"]).toContain(pcosFinding.category);
    expect(pcosFinding.supportingEvidence.length).toBeGreaterThan(0);
    expect(pcosFinding.missingInformation.length).toBeGreaterThan(0);
  });

  it("logs daily symptoms and triggers immediate safety checks", async () => {
    // Routine symptom entry
    const symRes = await backendApp.request("/api/v1/her/symptoms", {
      method: "POST",
      headers: patientHeaders,
      body: JSON.stringify({
        energyLevel: 8,
        mood: "calm",
        pelvicPain: 2,
        sleepHours: 7.5,
      }),
    });
    expect(symRes.status).toBe(200);
    const symData = (await symRes.json()) as any;
    expect(symData.safety.isUrgent).toBe(false);

    // Emergency symptom entry: severe pain with fainting
    const emergencyRes = await backendApp.request("/api/v1/her/symptoms", {
      method: "POST",
      headers: patientHeaders,
      body: JSON.stringify({
        pelvicPain: 9,
        suddenSeverePain: true,
        faintingOrSyncope: true,
      }),
    });
    expect(emergencyRes.status).toBe(200);
    const emData = (await emergencyRes.json()) as any;
    expect(emData.safety.isUrgent).toBe(true);
    expect(emData.safety.category).toBe("URGENT_REVIEW");
    expect(emData.safety.suppressWellnessAdvice).toBe(true);
  });

  it("returns tailored wellness recommendations filtering out allergens", async () => {
    const wellRes = await backendApp.request("/api/v1/her/wellness", {
      headers: patientHeaders,
    });
    expect(wellRes.status).toBe(200);
    const wellData = (await wellRes.json()) as any;
    expect(Array.isArray(wellData.recommendations)).toBe(true);

    // Ensure dairy is filtered out due to allergy
    for (const item of wellData.recommendations) {
      if (item.category === "NUTRITION") {
        expect(item.contraindications.includes("dairy_allergy")).toBe(false);
      }
    }
  });

  it("syncs wearable data and computes longitudinal trends", async () => {
    const syncRes = await backendApp.request("/api/v1/her/wearables/sync", {
      method: "POST",
      headers: patientHeaders,
      body: JSON.stringify([
        { date: "2026-10-15", restingHeartRateBpm: 68, sleepDurationMinutes: 460 },
        { date: "2026-10-16", restingHeartRateBpm: 69, sleepDurationMinutes: 440 },
      ]),
    });
    expect(syncRes.status).toBe(200);

    const trendRes = await backendApp.request("/api/v1/her/trends", {
      headers: patientHeaders,
    });
    expect(trendRes.status).toBe(200);
    const trendData = (await trendRes.json()) as any;
    expect(Array.isArray(trendData.trends)).toBe(true);
  });

  it("generates a doctor-ready summary, verifies access, and revokes it", async () => {
    // 1. Generate summary
    const sumRes = await backendApp.request("/api/v1/her/doctor-summary", {
      method: "POST",
      headers: patientHeaders,
      body: JSON.stringify({}),
    });
    expect(sumRes.status).toBe(200);
    const summary = (await sumRes.json()) as any;
    expect(summary.shareToken).toBeDefined();

    // 2. View via share token
    const viewRes = await backendApp.request(`/api/v1/her/doctor-summary/${summary.shareToken}`);
    expect(viewRes.status).toBe(200);
    const viewed = (await viewRes.json()) as any;
    expect(viewed.id).toBe(summary.id);

    // 3. Revoke access
    const revokeRes = await backendApp.request(`/api/v1/her/doctor-summary/${summary.id}/revoke`, {
      method: "POST",
      headers: patientHeaders,
    });
    expect(revokeRes.status).toBe(200);

    // 4. Verify access is now rejected
    const reViewRes = await backendApp.request(`/api/v1/her/doctor-summary/${summary.shareToken}`);
    expect(reViewRes.status).toBe(403);
  });
});
