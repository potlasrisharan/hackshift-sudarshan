import { expect, test } from "@playwright/test";

async function start(page: import("@playwright/test").Page) {
  await page.goto("/#today");
  await expect(
    page.getByRole("heading", { name: "Choose your language" }),
  ).toBeVisible();
}

test("patient intake replaces personal patient view on web and redirects #today", async ({
  page,
}) => {
  const exceptions: string[] = [];
  page.on("pageerror", (e) => exceptions.push(e.message));

  await start(page);
  await expect(page).toHaveURL(/.*\/erp\.html#\/app\?view=patient-kiosk/);
  await expect(page.getByText("EMERGENCY / STAT")).toBeVisible();

  // Screen 1 -> Screen 2 via Language Selection
  await page
    .getByRole("button", { name: "English · English", exact: true })
    .click();
  await expect(page.locator(".ayu-kiosk")).toHaveAttribute("data-screen", "1");

  // Verify Patient Identification options exist
  await expect(page.getByText("Mobile Number")).toBeVisible();
  await expect(page.getByText("Scan ABHA QR")).toBeVisible();
  await expect(page.getByText("14-Digit ABHA ID")).toBeVisible();
  await expect(page.getByText("Aadhaar Card")).toBeVisible();
  await expect(page.getByText("New Patient?")).toBeVisible();

  expect(exceptions).toEqual([]);
});

test("patient intake emergency detection and red-flag banner", async ({
  page,
}) => {
  await start(page);
  await page.getByText("EMERGENCY / STAT").click();
  await expect(
    page.getByText("EMERGENCY SYMPTOM DETECTED (Safety screen)"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(
    page.getByText("EMERGENCY SYMPTOM DETECTED (Safety screen)"),
  ).toHaveCount(0);
});

test("mobile viewport and accessibility controls on patient intake", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await start(page);
  await expect(
    page.getByRole("heading", { name: "Choose your language" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Toggle high contrast" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("real-time clinical translation converts vernacular input into clinical English", async ({
  page,
}) => {
  await page.route("**/api/v1/intake/translate", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        clinicalTranslation:
          "Severe acute epigastric and abdominal pain with visceral tenderness and gastrointestinal irritation.",
      }),
    }),
  );
  await start(page);
  await page
    .getByRole("navigation", { name: "Intake progress" })
    .getByRole("button", { name: /Voice/ })
    .click();
  await expect(page.locator(".ayu-kiosk")).toHaveAttribute("data-screen", "2");

  await page
    .getByRole("button", { name: /टाइप करें|Type/ })
    .first()
    .click();
  const textarea = page.locator("textarea").first();
  await textarea.fill("मेरा पेट में बहुत दर्द हो रहा है और");

  await expect(page.getByText('"मेरा पेट में बहुत दर्द हो रहा है और"')).toBeVisible();

  await expect(
    page.getByText(
      "Severe acute epigastric and abdominal pain with visceral tenderness and gastrointestinal irritation.",
    ),
  ).toBeVisible();
});

test("patient intake updates doctor consultation queue and emergency triage in real time", async ({
  page,
}) => {
  await page.route("**/api/v1/intake/encounter", (route) =>
    route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        encounter: { token: "E-045", token_number: "E-045" },
      }),
    }),
  );
  await start(page);

  // Trigger emergency override at kiosk
  await page.getByRole("button", { name: /EMERGENCY \/ STAT/ }).click();
  await expect(page.locator(".ayu-kiosk")).toHaveAttribute("data-screen", "4");
  await expect(page.getByText("E-045").first()).toBeVisible();

  // Navigate to Doctor Consultation Cockpit
  await page.goto("/erp.html#/app?view=doctor-consultation");
  await expect(
    page.getByRole("heading", { name: /Doctor Consultation \(OPD\)/ }),
  ).toBeVisible();

  // Verify the intake patient appears in Doctor queue and is active with STAT alert
  await expect(page.getByText("E-045").first()).toBeVisible();
  await expect(
    page
      .getByText("Priority 1 Acute Undifferentiated Medical Emergency")
      .first(),
  ).toBeVisible();

  // Navigate to Emergency Triage (STAT)
  await page.goto("/erp.html#/app?view=emergency-triage");
  await expect(
    page.getByRole("heading", { name: "Casualty Resus Bay 1" }),
  ).toBeVisible();
  await expect(page.getByText("E-045").first()).toBeVisible();
});
