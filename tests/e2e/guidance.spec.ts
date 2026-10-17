import { expect, test } from "@playwright/test";

for (const width of [1440, 768, 390]) {
  test(`guide exits cleanly and stays in the consultation workspace at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/erp.html#/app?view=doctor-consultation");
    await expect(page.locator("#tour-clinical-overview")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Show me around", exact: true }),
    ).toBeVisible();
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    const launch = page.getByRole("button", {
      name: "Show guide",
      exact: true,
    });
    await launch.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Your consultation workspace");
    await expect(
      page.locator(".ayu-guide-spotlight, .ayu-guide-shade"),
    ).toHaveCount(1);
    const box = await dialog.boundingBox();
    if (!box) throw new Error("Guide has no visible bounds");
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    for (let i = 0; i < 7; i++) {
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((node) => node.contains(document.activeElement)),
      ).toBe(true);
    }
    await dialog.getByRole("button", { name: "Next", exact: true }).click();
    await dialog.getByRole("button", { name: "Next", exact: true }).click();
    await dialog
      .getByRole("button", { name: "Finish guide", exact: true })
      .click();
    await expect(
      page.locator(".ayu-guide-spotlight, .ayu-guide-shade, dialog[open]"),
    ).toHaveCount(0);
    await expect(launch).toBeFocused();
    await expect(page).toHaveURL(/view=doctor-consultation$/);
    await expect(page.locator("#tour-clinical-overview")).toBeVisible();
    // The same action must remain clickable after finishing, closing, and Escape.
    await launch.click();
    await dialog
      .getByRole("button", { name: "Close guide", exact: true })
      .click();
    await expect(
      page.locator(".ayu-guide-spotlight, .ayu-guide-shade, dialog[open]"),
    ).toHaveCount(0);
    await launch.click();
    await page.keyboard.press("Escape");
    await expect(
      page.locator(".ayu-guide-spotlight, .ayu-guide-shade, dialog[open]"),
    ).toHaveCount(0);
    await expect(launch).toBeFocused();
    await page.reload();
    await expect(launch).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Show me around", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.locator(".ayu-guide-spotlight, .ayu-guide-shade, dialog[open]"),
    ).toHaveCount(0);
  });
}

test("finishing removes the overlay even when browser storage cannot save completion", async ({
  page,
}) => {
  await page.goto("/erp.html#/app?view=doctor-consultation");
  await page.getByRole("button", { name: "Show guide", exact: true }).click();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage blocked", "SecurityError");
    };
  });
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Next", exact: true }).click();
  await dialog.getByRole("button", { name: "Next", exact: true }).click();
  await dialog
    .getByRole("button", { name: "Finish guide", exact: true })
    .click();
  await expect(
    page.locator(".ayu-guide-spotlight, .ayu-guide-shade, dialog[open]"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Show guide", exact: true }).click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
