import { expect, test } from "@playwright/test";

async function start(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Agree to local demo processing & begin" })
    .click();
  await expect(page.getByText("Good morning, Sunita.")).toBeVisible();
}
test("cross-project care story and privacy controls", async ({ page }) => {
  const exceptions: string[] = [];
  page.on("pageerror", (e) => exceptions.push(e.message));
  await start(page);
  await page
    .getByRole("button", { name: "Medicine access", exact: true })
    .click();
  await expect(page.getByText("₹64", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Explain allocation" }).click();
  await expect(page.locator("#allocation")).toContainText("north-expiring");
  await page
    .getByRole("button", { name: "Your health thread", exact: true })
    .click();
  await expect(page.getByText(/project-1 • LOINC/)).toBeVisible();
  await expect(page.getByText(/project-2 • LOINC/)).toBeVisible();
  await page
    .getByRole("button", { name: "Create source-linked summary" })
    .click();
  await expect(page.locator("#summary")).toContainText("citations");
  await page
    .getByRole("button", { name: "Algorithm lab", exact: true })
    .click();
  await page.getByRole("button", { name: "Test chest-pain red flag" }).click();
  await expect(page.locator(".triage-status")).toContainText(
    "Seek emergency help now",
  );
  await page.getByRole("button", { name: "Compare with API result" }).click();
  await expect(page.locator("#server-result")).toContainText('"matches": true');
  await page.getByRole("button", { name: "Privacy", exact: true }).click();
  await page.getByRole("button", { name: "Verify audit chain" }).click();
  await expect(page.locator("#audit")).toContainText('"valid": true');
  await page.getByRole("button", { name: "Revoke processing consent" }).click();
  await expect(
    page.getByRole("button", {
      name: "Agree to local demo processing & begin",
    }),
  ).toBeVisible();
  expect(exceptions).toEqual([]);
});
test("mobile viewport, language and accessibility controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await start(page);
  await page.getByLabel("Language", { exact: true }).selectOption("hi-IN");
  await expect(
    page.getByRole("heading", { name: "हर दिन, थोड़ा ख्याल।" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Toggle large text" }).click();
  await expect(page.locator("body")).toHaveClass(/elder/);
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(page.locator("body")).toHaveClass(/dark/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("algorithm screen works offline after first load", async ({
  page,
  context,
}) => {
  await start(page);
  await page
    .getByRole("button", { name: "Algorithm lab", exact: true })
    .click();
  await context.setOffline(true);
  await page.getByRole("button", { name: "Test chest-pain red flag" }).click();
  await expect(page.locator(".triage-status")).toContainText(
    "Seek emergency help now",
  );
  await expect(page.getByText(/Offline. The algorithm lab/)).toBeVisible();
  await context.setOffline(false);
});
