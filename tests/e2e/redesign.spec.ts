import { expect, test } from "@playwright/test";

test("the public site reaches each workspace and the kiosk keeps language navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Healthcare,.*finally connected/ }),
  ).toBeVisible();
  const portals = page.locator(".ds-workspace-card");
  await expect(portals).toHaveCount(5);
  for (const portal of await portals.all())
    await expect(portal).toHaveAttribute(
      "href",
      /^(#begin|\/erp\.html#\/app\?view=)/,
    );
  await page.goto("/erp.html#/kiosk");
  await page
    .getByRole("button", { name: "English · English", exact: true })
    .click();
  await expect(page.locator(".ayu-kiosk")).toHaveAttribute("data-screen", "1");
  await page
    .getByRole("navigation", { name: "Intake progress" })
    .getByRole("button")
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Choose your language" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("dictation pause and stop release microphone tracks, and the transcript remains reviewable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as unknown as { __voiceTracksStopped: number };
    state.__voiceTracksStopped = 0;
    class TestRecognition {
      lang = "";
      continuous = false;
      interimResults = false;
      onresult:
        | ((event: { results: { transcript: string }[][] }) => void)
        | null = null;
      onerror: ((event: { error: string }) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        queueMicrotask(() =>
          this.onresult?.({
            results: [[{ transcript: "Synthetic patient reports mild fever" }]],
          }),
        );
      }
      stop() {
        this.onend?.();
      }
      abort() {
        this.onend?.();
      }
    }
    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: TestRecognition,
    });
    navigator.mediaDevices.getUserMedia = async () =>
      ({
        getTracks: () => [
          {
            stop: () => {
              state.__voiceTracksStopped++;
            },
          },
        ],
      }) as unknown as MediaStream;
  });
  await page.goto("/erp.html#/kiosk");
  await page
    .getByRole("navigation", { name: "Intake progress" })
    .getByRole("button")
    .nth(2)
    .click();
  await page
    .getByRole("button", { name: "Start voice input", exact: true })
    .click();
  await expect(page.locator(".ayu-transcript")).toContainText(
    "Synthetic patient reports mild fever",
  );
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    page.getByText("Recording paused", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __voiceTracksStopped: number })
          .__voiceTracksStopped,
    ),
  ).toBe(1);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page
    .getByRole("button", { name: "Stop voice input", exact: true })
    .click();
  await expect(
    page.getByText("Transcript ready for your review", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __voiceTracksStopped: number })
          .__voiceTracksStopped,
    ),
  ).toBe(2);
  await page.getByRole("button", { name: "Type instead", exact: true }).click();
  await expect(page.locator(".ayu-kiosk textarea")).toHaveValue(
    /Synthetic patient/,
  );
});

test("unsupported dictation gives an accessible typing fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      configurable: true,
      value: undefined,
    });
  });
  await page.goto("/erp.html#/kiosk");
  await page
    .getByRole("navigation", { name: "Intake progress" })
    .getByRole("button")
    .nth(2)
    .click();
  await page
    .getByRole("button", { name: "Start voice input", exact: true })
    .click();
  await expect(page.locator(".ayu-voice [role=alert]")).toContainText(
    "unavailable in this browser",
  );
  await page.getByRole("button", { name: "Type instead", exact: true }).click();
  await expect(page.locator(".ayu-kiosk textarea")).toBeVisible();
});
