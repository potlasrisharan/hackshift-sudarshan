import { Hono } from "hono";
import { rxToShelf, threadPulse } from "../../../../packages/engine";
import { demoPlan } from "../../../../packages/shared/demo";

export const bridgeRouter = new Hono();

bridgeRouter.post("/rx2shelf/plan", async (c) => {
  let input: unknown = null;
  try {
    input = await c.req.json();
  } catch {
    // If empty body, fallback to canonical demo plan
    input = demoPlan();
  }

  // If input lacks required fields, fallback to demo plan
  if (!input || typeof input !== "object" || !("prescription" in input)) {
    input = demoPlan();
  }

  const result = rxToShelf(input);
  return c.json({
    planId: "plan_" + Date.now(),
    status: result.plans.length > 0 ? "READY_FOR_DISPENSE" : "BLOCKED_OR_UNAVAILABLE",
    result,
    timestamp: new Date().toISOString()
  });
});

bridgeRouter.post("/rx2shelf", async (c) => {
  const body = await c.req.json();
  return c.json(rxToShelf(body));
});

bridgeRouter.get("/threadpulse/hazard", async (c) => {
  const stockParam = c.req.query("stock");
  const stock = stockParam ? parseInt(stockParam, 10) : 5;
  const probabilities = [0.9, 0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.8, 0.9, 0.7];

  const result = threadPulse({
    probabilities,
    stock,
    serviceLevel: 0.95
  });

  return c.json({
    forecastDate: new Date().toISOString(),
    stock,
    stockoutProbability: result.stockoutProbability,
    reorderUnits: result.reorderUnits,
    targetServiceStock: result.target,
    expectedDemand: result.expectedDemand,
    explanation: result.explanation,
    pmf: result.pmf
  });
});

bridgeRouter.post("/threadpulse", async (c) => {
  const body = await c.req.json();
  return c.json(threadPulse(body));
});

