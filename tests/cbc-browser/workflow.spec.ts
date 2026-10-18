import { createRequire } from "node:module";
import { expect, type Page, test } from "@playwright/test";
import { LocalDatabase } from "../../backend/local/database";
import { demoPassword } from "../../backend/local/seed";
import { tenantDb } from "../../backend/src/database";
import {
  encounterListSchema,
  loginResponseSchema,
} from "../../packages/shared/integration";

test("separate clinical queue entries isolate two encounters for the same patient", async ({
  page,
}) => {
  const panel = await openDashboard(page);
  const rawSession = await page.evaluate(() =>
    sessionStorage.getItem("ayusetu.cbc.doctor-session.v1"),
  );
  if (!rawSession) throw new Error("Missing clinical test session");
  const session = loginResponseSchema.parse(JSON.parse(rawSession));
  const api = await page.request.get("/api/v1/encounters", {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  const original = encounterListSchema.parse(await api.json()).encounters[0];
  if (!original || !process.env.CBC_E2E_DB)
    throw new Error("Missing synthetic encounter fixture");
  const id = crypto.randomUUID();
  const db = new LocalDatabase(process.env.CBC_E2E_DB);
  try {
    const repo = tenantDb({ db, orgId: "demo" });
    await repo.batch([
      repo.statement(
        `INSERT INTO encounters(org_id,id,patient_id,clinic_id,chief_complaint,answers_json,red_flags_json,status,created_at)
        SELECT :org,?,patient_id,clinic_id,'Synthetic second CBC visit',answers_json,red_flags_json,'waiting',? FROM encounters WHERE org_id=? AND id=?`,
        id,
        new Date().toISOString(),
        "demo",
        original.id,
      ),
      repo.statement(
        "INSERT INTO consents(org_id,patient_id,encounter_id,purpose,granted_at) VALUES(:org,?,?,'care',?)",
        original.patientId,
        id,
        new Date().toISOString(),
      ),
    ]);
  } finally {
    db.close();
  }
  await panel.getByLabel("WBC value").fill("8.95");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  const second = page.getByText(`Clinical ${id.slice(0, 8)}`, { exact: true });
  await expect(second).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await second.click();
  await expect(panel.getByLabel("WBC value")).toHaveValue("");
  await expect(panel.getByText(/Encounter:/)).toContainText(id);
  await panel.getByLabel("WBC value").fill("10");
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByText(`Clinical ${original.id.slice(0, 8)}`, { exact: true })
    .click();
  await expect(panel.getByLabel("WBC value")).toHaveValue("");
  await expect(panel.getByText(/Encounter:/)).toContainText(original.id);
});

const require = createRequire(
  new URL("../../frontend/website/package.json", import.meta.url),
);
// Fixture construction only; no real reports or patient data.
const { jsPDF } = require("jspdf") as {
  jsPDF: new () => {
    text(text: string, x: number, y: number): void;
    output(type: "arraybuffer"): ArrayBuffer;
    addImage(
      data: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number,
    ): void;
  };
};
function imageBytes(data: string): Buffer {
  const encoded = data.split(",")[1];
  if (!encoded) throw new Error("Missing synthetic image data");
  return Buffer.from(encoded, "base64");
}
const rows = [
  "WBC 8.95 10^9/L",
  "RBC 4.41 10^12/L",
  "Neutrophils 65 %",
  "Lymphocytes 25 %",
  "Monocytes 9 %",
];
function textPdf() {
  const doc = new jsPDF();
  doc.text("SYNTHETIC CBC - no patient identifiers", 20, 20);
  rows.forEach((line, index) => {
    doc.text(line, 20, 40 + index * 12);
  });
  return Buffer.from(doc.output("arraybuffer"));
}
async function openDashboard(page: Page) {
  await page.goto("/erp.html#/app?view=doctor-consultation");
  await expect(
    page.getByRole("heading", { name: "Your consultation workspace" }),
  ).toBeVisible();
  const access = page.getByRole("region", { name: "CBC clinical access" });
  await access.getByLabel("Organization", { exact: true }).fill("demo");
  await access
    .getByLabel("Clinical email", { exact: true })
    .fill("doctor@demo.test");
  await access
    .getByLabel("Clinical password", { exact: true })
    .fill(demoPassword);
  await access
    .getByRole("button", { name: "Connect clinical session" })
    .click();
  await expect(access.getByText(/Doctor connected/)).toBeVisible();
  const fictionalName = `CBC Alpha ${crypto.randomUUID().slice(0, 8)}`;
  await access.getByLabel("Synthetic demo name").fill(fictionalName);
  await access
    .getByRole("button", { name: "Add synthetic consultation" })
    .click();
  await page
    .getByText(`Synthetic ${fictionalName}`, { exact: true })
    .first()
    .click();
  const panel = page.getByTestId("cbc-panel");
  await expect(
    panel.getByLabel("Upload CBC report", { exact: true }),
  ).toBeEnabled();
  return panel;
}
test("real consultation: text PDF review, frozen model, reload and patient isolation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let panel = await openDashboard(page);
  const contextText = await panel.getByText(/Encounter:/).textContent();
  const selectedEncounter = contextText?.match(
    /[0-9a-f]{8}-[0-9a-f-]{27}/i,
  )?.[0];
  if (!selectedEncounter)
    throw new Error("Missing selected clinical encounter");
  await panel.getByLabel("Upload CBC report", { exact: true }).setInputFiles({
    name: "synthetic-cbc.pdf",
    mimeType: "application/pdf",
    buffer: textPdf(),
  });
  await expect(panel.getByRole("status")).toContainText("Extraction finished", {
    timeout: 45000,
  });
  await expect(panel.getByLabel("WBC value")).toHaveValue("8.95");
  await expect(panel.getByLabel("Monocytes value")).toHaveValue("9");
  await panel.getByLabel("Record permission to process").check();
  await panel.getByLabel("Record permission for optional research").check();
  await panel.getByLabel("I checked every value/unit").check();
  await panel
    .getByRole("button", { name: "Confirm and save measurements" })
    .click();
  await expect(panel.getByText(/Confirmed snapshot/)).toBeVisible();
  await panel.getByRole("button", { name: "Run research analysis" }).click();
  await expect(panel.getByTestId("cbc-result")).toContainText("0.652883");
  await panel.screenshot({ path: ".local/cbc-consultation-panel.png" });
  await page.reload();
  panel = page.getByTestId("cbc-panel");
  await page
    .getByText(`Clinical ${selectedEncounter.slice(0, 8)}`, { exact: true })
    .click();
  await panel
    .getByRole("button", { name: /^Open / })
    .first()
    .click();
  await expect(panel.getByTestId("cbc-result")).toContainText("0.652883");
  const access = page.getByRole("region", { name: "CBC clinical access" });
  await access.getByLabel("Synthetic demo name").fill("CBC Beta");
  await access
    .getByRole("button", { name: "Add synthetic consultation" })
    .click();
  await page.getByText("Synthetic CBC Beta", { exact: true }).first().click();
  await expect(panel.getByLabel("WBC value")).toHaveValue("");
  await expect(panel.getByTestId("cbc-result")).toHaveCount(0);
  await expect(
    page.getByText("Intelligent AI SOAP Notes & Clinical Intake"),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(panel).toBeVisible();
  expect(
    await panel.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("real local OCR processes a PNG and a raster-only PDF without third-party requests", async ({
  page,
}) => {
  const panel = await openDashboard(page);
  const foreign: string[] = [];
  page.on("request", (request) => {
    if (
      /tesseract|traineddata|\.wasm/.test(request.url()) &&
      !request.url().startsWith("http://127.0.0.1:8791/")
    )
      foreign.push(request.url());
  });
  const image = await page.evaluate((lines) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Test canvas is unavailable");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1400, 700);
    ctx.fillStyle = "black";
    ctx.font = "36px Arial";
    lines.forEach((line, index) => {
      ctx.fillText(line, 60, 90 + index * 100);
    });
    const rotated = document.createElement("canvas");
    rotated.width = canvas.height;
    rotated.height = canvas.width;
    const rotatedContext = rotated.getContext("2d");
    if (!rotatedContext) throw new Error("Test rotation canvas is unavailable");
    rotatedContext.translate(rotated.width / 2, rotated.height / 2);
    rotatedContext.rotate(Math.PI / 2);
    rotatedContext.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    return {
      png: canvas.toDataURL("image/png"),
      jpeg: canvas.toDataURL("image/jpeg", 1),
      rotated: rotated.toDataURL("image/png"),
    };
  }, rows);
  await panel.getByLabel("Upload CBC report", { exact: true }).setInputFiles({
    name: "synthetic-cbc.png",
    mimeType: "image/png",
    buffer: imageBytes(image.png),
  });
  await expect(panel.getByRole("status")).toContainText("Extraction finished", {
    timeout: 60000,
  });
  await expect(panel.getByLabel("Monocytes value")).toHaveValue("9");
  page.once("dialog", (dialog) => dialog.accept());
  await panel
    .getByRole("button", { name: "New report / manual entry" })
    .click();
  const pdf = new jsPDF();
  pdf.addImage(image.jpeg, "JPEG", 10, 10, 190, 95);
  await panel.getByLabel("Upload CBC report", { exact: true }).setInputFiles({
    name: "synthetic-scan.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(pdf.output("arraybuffer")),
  });
  await expect(panel.getByRole("status")).toContainText("Extraction finished", {
    timeout: 60000,
  });
  await expect(panel.getByLabel("Lymphocytes value")).toHaveValue("25");
  page.once("dialog", (dialog) => dialog.accept());
  await panel
    .getByRole("button", { name: "New report / manual entry" })
    .click();
  await panel.getByLabel("Upload CBC report", { exact: true }).setInputFiles({
    name: "rotated-synthetic.png",
    mimeType: "image/png",
    buffer: imageBytes(image.rotated),
  });
  await expect(panel.getByRole("status")).toContainText("Extraction finished", {
    timeout: 60000,
  });
  await expect(panel.getByLabel("Monocytes value")).toHaveValue("9");
  expect(foreign).toEqual([]);
});

test("patient switching cancels stale extraction and unsupported files never receive sample values", async ({
  page,
}) => {
  const panel = await openDashboard(page);
  const access = page.getByRole("region", { name: "CBC clinical access" });
  await access.getByLabel("Synthetic demo name").fill("CBC Switch");
  await access
    .getByRole("button", { name: "Add synthetic consultation" })
    .click();
  await expect(
    page.getByText("Synthetic CBC Switch", { exact: true }),
  ).toBeVisible();
  await page.route("**/assets/pdf.worker*.mjs", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });
  await panel.getByLabel("Upload CBC report", { exact: true }).setInputFiles({
    name: "synthetic-cbc.pdf",
    mimeType: "application/pdf",
    buffer: textPdf(),
  });
  await panel.getByRole("button", { name: "Cancel extraction" }).click();
  await expect(
    panel.getByRole("button", { name: "New report / manual entry" }),
  ).toBeEnabled();
  await panel.getByLabel("WBC value").fill("7.1");
  await expect(panel.getByLabel("WBC value")).toHaveValue("7.1");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByText("Synthetic CBC Switch", { exact: true }).first().click();
  await expect(panel.getByLabel("WBC value")).toHaveValue("");
  await panel.getByLabel("Upload CBC report", { exact: true }).setInputFiles({
    name: "unsupported.docx",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("not a CBC report"),
  });
  await expect(panel.getByRole("alert")).toContainText("Supported files");
  await expect(panel.getByLabel("WBC value")).toHaveValue("");
  await expect(
    panel.getByRole("button", { name: "Confirm and save measurements" }),
  ).toBeDisabled();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Exit to Portals" }).click();
  await expect(panel).toBeVisible();
  await access.getByRole("button", { name: "Disconnect CBC session" }).click();
  await expect(panel.getByText(/no verified clinical encounter/)).toBeVisible();
});
