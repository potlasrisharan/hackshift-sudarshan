import { expect, it } from "vitest";
import { redact, sourceSummary } from "../packages/ai/gateway";
import { driftRadar, rxToShelf, sentinel } from "../packages/engine";
import { words } from "../packages/i18n";
import { demoPlan } from "../packages/shared/demo";

for (const signal of ["chestPain", "breathless", "fainting"]) {
  it(`red flag recall: ${signal}`, () => {
    expect(sentinel({ answers: { [signal]: "yes" } }).tier).toBe("emergency");
  });
}
it("absolute BP floor is active even during learning", () => {
  expect(driftRadar({ readings: [{ day: 0, value: 180 }] }).alert).toBe(true);
});
it("known allergy cannot produce allocation", () => {
  expect(rxToShelf({ ...demoPlan(), allergies: ["metformin"] }).plans).toEqual(
    [],
  );
});
it("redacts known identifiers without external calls", () => {
  expect(
    redact("Sunita phone 9999999999 and person@example.com", ["Sunita"]),
  ).toBe("[NAME] phone [IDENTIFIER] and [EMAIL]");
});
it("local summary cites every source line", () => {
  const result = sourceSummary([{ id: "o1", text: "Synthetic measurement" }]);
  expect(result.externalCalls).toBe(0);
  expect(result.lines.every((l) => l.citations.length > 0)).toBe(true);
});
it("all interface languages preserve nonempty primary labels", () => {
  for (const dictionary of Object.values(words))
    for (const value of Object.values(dictionary))
      expect(value.length).toBeGreaterThan(0);
});
