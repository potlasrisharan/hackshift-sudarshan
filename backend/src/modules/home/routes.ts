import { Hono } from "hono";

export const homeRouter = new Hono();

homeRouter.post("/vitals", async (c) => {
  return c.json({
    status: "recorded",
    readingId: "vit_" + Date.now(),
    driftDetected: false
  });
});

homeRouter.post("/whatsapp/webhook", async (c) => {
  return c.json({
    status: "dispatched",
    handled: true
  });
});

homeRouter.get("/nurse/queue", async (c) => {
  return c.json({
    queue: [
      {
        patientId: "pat_sunita",
        name: "Sunita Devi",
        riskScore: 0.82,
        driftReason: "Systolic BP steady upward drift over 9 days",
        lastVitals: { systolic: 148, diastolic: 92, date: "Today" }
      }
    ]
  });
});
