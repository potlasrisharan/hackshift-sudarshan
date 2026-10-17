import { Hono } from "hono";

export const platformRouter = new Hono();

platformRouter.post("/auth/login", async (c) => {
  return c.json({
    token: "mock-jwt-token",
    expiresIn: 900,
    user: {
      id: "usr_admin",
      role: "HOSPITAL_ADMIN",
      clinicId: "clinic_north"
    }
  });
});

platformRouter.get("/audit/verify", async (c) => {
  return c.json({
    chainLength: 142,
    isValid: true,
    latestHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  });
});
