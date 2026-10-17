import { Hono } from "hono";

export const opsRouter = new Hono();

opsRouter.get("/inventory/radar", async (c) => {
  return c.json({
    expiringBatches: [],
    lowStockItems: [],
    totalSkus: 120
  });
});

opsRouter.post("/pos/sale", async (c) => {
  return c.json({
    saleId: "sale_" + Date.now(),
    status: "completed",
    totalPaise: 45000,
    journalEntryId: "je_" + Date.now()
  });
});

opsRouter.get("/ledger/summary", async (c) => {
  return c.json({
    revenuePaise: 12500000,
    cogsPaise: 8200000,
    operatingExpensesPaise: 2100000,
    netProfitPaise: 2200000,
    isBalanced: true
  });
});
