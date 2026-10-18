import { describe, expect, it } from "vitest";
import backendApp from "../backend/src/index";

describe("Mobile Patient Auth & Profile Customization API", () => {
  const testPhone = "+919876543219";
  const testPassword = "Password123!";
  let sessionToken = "";
  let patientId = "";

  it("registers a new patient via /api/v1/auth/patient/signup", async () => {
    const res = await backendApp.request("/api/v1/auth/patient/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": "org_test",
      },
      body: JSON.stringify({
        phone: testPhone,
        password: testPassword,
        name: "Sunita Devi",
        dob: "1994-06-15",
        sex: "FEMALE",
        preferredLang: "hi",
        bloodGroup: "B+",
      }),
    });

    expect(res.status).toBe(201);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.patient.name).toBe("Sunita Devi");
    expect(data.patient.phone).toBe("+919876543219");
    expect(data.preferences.primaryFocus).toBe("longevity");

    sessionToken = data.token;
    patientId = data.patient.id;
  });

  it("rejects duplicate phone signup", async () => {
    const res = await backendApp.request("/api/v1/auth/patient/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": "org_test",
      },
      body: JSON.stringify({
        phone: testPhone,
        password: testPassword,
        name: "Sunita Devi Duplicate",
        dob: "1994-06-15",
        sex: "FEMALE",
      }),
    });

    expect(res.status).toBe(409);
    const data = (await res.json()) as any;
    expect(data.success).toBe(false);
  });

  it("authenticates via /api/v1/auth/patient/login with phone and password", async () => {
    const res = await backendApp.request("/api/v1/auth/patient/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": "org_test",
      },
      body: JSON.stringify({
        identifier: testPhone,
        password: testPassword,
      }),
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.token).toBeDefined();
    expect(data.patient.id).toBe(patientId);
  });

  it("rejects invalid password", async () => {
    const res = await backendApp.request("/api/v1/auth/patient/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": "org_test",
      },
      body: JSON.stringify({
        identifier: testPhone,
        password: "WrongPassword!",
      }),
    });

    expect(res.status).toBe(401);
    const data = (await res.json()) as any;
    expect(data.success).toBe(false);
  });

  it("verifies session via /api/v1/auth/patient/me", async () => {
    const res = await backendApp.request("/api/v1/auth/patient/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "X-Tenant-Id": "org_test",
      },
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.patient.id).toBe(patientId);
    expect(data.patient.name).toBe("Sunita Devi");
  });

  it("updates extended profile via /api/v1/patient/:id/profile", async () => {
    const res = await backendApp.request(
      `/api/v1/patient/${patientId}/profile`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloodGroup: "B+",
          allergies: ["Peanuts", "Dust"],
          chronicConditions: ["PCOS"],
          emergencyContact: "+919876543210",
        }),
      },
    );

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.patient.allergies).toContain("Peanuts");
    expect(data.patient.chronicConditions).toContain("PCOS");
  });

  it("updates app preferences via /api/v1/patient/:id/preferences", async () => {
    const res = await backendApp.request(
      `/api/v1/patient/${patientId}/preferences`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id": "org_test",
        },
        body: JSON.stringify({
          primaryFocus: "womens_health",
          primaryModules: ["her", "prescriptions", "yoga"],
          themeMode: "dark",
          colorAccent: "her_rose",
          language: "hi",
        }),
      },
    );

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.preferences.primaryFocus).toBe("womens_health");
    expect(data.preferences.themeMode).toBe("dark");
  });

  it("saves and retrieves Ayurvedic Prakriti profile via /api/v1/patient/:id/ayurveda", async () => {
    const res = await backendApp.request(
      `/api/v1/patient/${patientId}/ayurveda`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id": "org_test",
        },
        body: JSON.stringify({
          primaryDosha: "PITTA_KAPHA",
          secondaryDosha: "VATA",
          prakritiSummary:
            "Pitta-dominant constitution with strong metabolic fire and steady stamina.",
          agniType: "TIKSHNAGNI",
          koshthaType: "MRIDU",
          dietaryGuidelines: [
            "Cooling foods",
            "Avoid excess chili",
            "Fresh coconut water",
          ],
          yogaRecommendations: [
            "Sheetali Pranayama",
            "Moon Salutations",
            "Sitali Breath",
          ],
        }),
      },
    );

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);
    expect(data.ayurveda.primaryDosha).toBe("PITTA_KAPHA");

    const getRes = await backendApp.request(
      `/api/v1/patient/${patientId}/ayurveda`,
      {
        method: "GET",
      },
    );
    expect(getRes.status).toBe(200);
    const getData = (await getRes.json()) as any;
    expect(getData.ayurveda.primaryDosha).toBe("PITTA_KAPHA");
  });

  it("logs out via /api/v1/auth/patient/logout", async () => {
    const res = await backendApp.request("/api/v1/auth/patient/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "X-Tenant-Id": "org_test",
      },
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.success).toBe(true);

    // Verifying session after logout should fail
    const meRes = await backendApp.request("/api/v1/auth/patient/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "X-Tenant-Id": "org_test",
      },
    });
    expect(meRes.status).toBe(401);
  });
});
