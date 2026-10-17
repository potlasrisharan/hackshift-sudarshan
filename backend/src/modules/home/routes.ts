import { Hono } from "hono";
import { driftRadar } from "../../../../packages/engine";
import { demoReadings } from "../../../../packages/shared/demo";

export const homeRouter = new Hono();

homeRouter.post("/vitals", async (c) => {
  let readings: Array<{ day: number; value: number }> = demoReadings;
  try {
    const body = (await c.req.json()) as {
      readings?: Array<{ day: number; value: number }>;
      value?: number;
      systolic?: number;
      day?: number;
    };
    if (body?.readings && Array.isArray(body.readings) && body.readings.length > 0) {
      readings = body.readings;
    } else if (typeof body?.systolic === "number" || typeof body?.value === "number") {
      const val = body.systolic ?? body.value ?? 120;
      const day = body.day ?? demoReadings.length;
      readings = [...demoReadings, { day, value: val }];
    }
  } catch {
    // If no body provided, use demo baseline
  }

  const driftResult = driftRadar({ readings });

  return c.json({
    status: "recorded",
    readingId: "vit_" + Date.now(),
    driftDetected: driftResult.alert,
    drift: driftResult,
    timestamp: new Date().toISOString()
  });
});

homeRouter.post("/drift", async (c) => {
  const body = await c.req.json();
  return c.json(driftRadar(body));
});

homeRouter.post("/whatsapp/webhook", async (c) => {
  return c.json({
    status: "dispatched",
    handled: true
  });
});

homeRouter.get("/nurse/queue", async (c) => {
  // Execute deterministic drift analysis over longitudinal readings
  const drift = driftRadar({ readings: demoReadings });
  const latestTrace = drift.trace.at(-1);

  return c.json({
    queue: [
      {
        patientId: "pat_sunita",
        name: "Sunita Devi",
        riskScore: latestTrace?.alert ? 0.92 : 0.45,
        driftDetected: drift.alert,
        driftReason: drift.alert
          ? "Systolic BP steady upward drift exceeding CUSUM threshold"
          : "Vitals stable within baseline",
        baseline: drift.baseline,
        sigma: drift.sigma,
        latestCusum: latestTrace?.cusum ?? 0,
        lastVitals: { systolic: latestTrace?.value ?? 148, date: "Today" }
      }
    ]
  });
});

