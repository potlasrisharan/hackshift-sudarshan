import { Hono } from "hono";

export const intakeRouter = new Hono();

intakeRouter.post("/session", async (c) => {
  return c.json({
    sessionId: "sess_" + Date.now(),
    status: "active",
    triageTier: 0,
    timestamp: new Date().toISOString()
  });
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
