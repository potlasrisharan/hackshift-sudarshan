import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  driftRadar,
  rxToShelf,
  sentinel,
  threadPulse,
} from "../packages/engine";
import {
  fromIntakePatient,
  fromOpsReading,
  mergeRecord,
} from "../packages/shared/adapters";
import { equivalent } from "../packages/shared/compare";
import { demoPlan, demoReadings } from "../packages/shared/demo";

describe("prescription-to-stock integration", () => {
  it("rejects wrong-strength and course-invalid stock and accounts for transfer cost", () => {
    const result = rxToShelf(demoPlan());
    expect(result.plans[0]?.costPaise).toBe(6400);
    expect(result.plans[0]?.allocation[0]?.batchId).toBe("east-valid");
    expect(result.rejected).toHaveLength(2);
  });
  it("blocks recorded allergies", () => {
    expect(
      rxToShelf({ ...demoPlan(), allergies: ["METFORMIN"] }).blocked,
    ).toMatch(/allergy/);
  });
  it("returns no plan for insufficient stock", () => {
    expect(rxToShelf({ ...demoPlan(), batches: [] }).plans).toEqual([]);
  });
  it("rejects malformed prices", () => {
    expect(() =>
      rxToShelf({
        ...demoPlan(),
        batches: [{ ...demoPlan().batches[0], pricePaise: -1 }],
      }),
    ).toThrow();
  });
  it("equals exhaustive bounded allocation with fixed transfer cost", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            stock: fc.integer({ min: 0, max: 6 }),
            price: fc.integer({ min: 1, max: 20 }),
            east: fc.boolean(),
          }),
          { minLength: 1, maxLength: 5 },
        ),
        fc.integer({ min: 1, max: 8 }),
        fc.integer({ min: 0, max: 20 }),
        (rows, needed, fee) => {
          const input = demoPlan();
          input.prescription.units = needed;
          input.transferPaise = fee;
          input.batches = rows.map((r, i) => ({
            id: String(i),
            clinic: r.east ? "East" : "North",
            stock: r.stock,
            pricePaise: r.price,
            salt: "metformin",
            strengthMg: 500,
            form: "tablet",
            expiry: "2027-07-01",
          }));
          let best = Infinity;
          function enumerate(
            i: number,
            left: number,
            cost: number,
            usedEast: boolean,
          ) {
            if (i === rows.length) {
              if (left === 0)
                best = Math.min(best, cost + (usedEast ? fee : 0));
              return;
            }
            const r = rows[i];
            if (!r) return;
            for (let q = 0; q <= Math.min(r.stock, left); q++)
              enumerate(
                i + 1,
                left - q,
                cost + q * r.price,
                usedEast || (q > 0 && r.east),
              );
          }
          enumerate(0, needed, 0, false);
          expect(rxToShelf(input).plans[0]?.costPaise ?? Infinity).toBe(best);
        },
      ),
      { seed: 26047, numRuns: 200 },
    );
  });
});
describe("Sentinel", () => {
  it("screens danger signs before lower-risk information gain", () => {
    expect(sentinel({ answers: {} }).nextQuestion).toBe("chestPain");
  });
  it("keeps unsure neutral", () => {
    expect(sentinel({ answers: { fever: "unsure" } }).posterior).toEqual(
      sentinel({ answers: {} }).posterior,
    );
  });
  it("normalises probabilities", () => {
    expect(
      sentinel({ answers: { cough: "yes" } }).posterior.reduce(
        (s, p) => s + p.probability,
        0,
      ),
    ).toBeCloseTo(1, 10);
  });
  it("never de-escalates an affirmative red flag", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("yes" as const, "no" as const, "unsure" as const),
        fc.constantFrom("yes" as const, "no" as const, "unsure" as const),
        (fever, cough) => {
          expect(
            sentinel({ answers: { chestPain: "yes", fever, cough } }).tier,
          ).toBe("emergency");
        },
      ),
      { seed: 26047, numRuns: 100 },
    );
  });
  it("does not diagnose absence of danger", () => {
    expect(
      sentinel({
        answers: { chestPain: "no", breathless: "no", fainting: "no" },
      }).tier,
    ).toBe("clinician-review");
  });
});
describe("Drift Radar", () => {
  it("leaves constant baseline quiet", () => {
    expect(
      driftRadar({
        readings: Array.from({ length: 30 }, (_, day) => ({ day, value: 125 })),
      }).alert,
    ).toBe(false);
  });
  it("detects the injected synthetic ramp", () => {
    expect(driftRadar({ readings: demoReadings }).alert).toBe(true);
  });
  it("checks absolute danger during cold start", () => {
    expect(driftRadar({ readings: [{ day: 0, value: 185 }] }).alert).toBe(true);
  });
  it("is invariant to arrival order", () => {
    expect(driftRadar({ readings: [...demoReadings].reverse() })).toEqual(
      driftRadar({ readings: demoReadings }),
    );
  });
  it("resets accumulated evidence across long gaps", () => {
    const r = driftRadar({
      readings: [
        ...Array.from({ length: 7 }, (_, day) => ({ day, value: 125 })),
        { day: 7, value: 130 },
        { day: 30, value: 130 },
      ],
    });
    expect(r.trace.at(-1)?.cusum).toBeCloseTo(130 / 3 - 125 / 3 - 0.5);
  });
});
describe("ThreadPulse", () => {
  it("has exact known distribution", () => {
    expect(threadPulse({ probabilities: [0.5, 0.5], stock: 1 }).pmf).toEqual([
      0.25, 0.5, 0.25,
    ]);
  });
  it("matches enumeration and normalises for random vectors", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.integer({ min: 0, max: 100 }).map((n) => n / 100),
          { maxLength: 9 },
        ),
        (ps) => {
          const expected = Array<number>(ps.length + 1).fill(0);
          for (let mask = 0; mask < 2 ** ps.length; mask++) {
            let p = 1,
              count = 0;
            for (let i = 0; i < ps.length; i++) {
              const yes = (mask & (1 << i)) !== 0;
              p *= yes ? (ps[i] ?? 0) : 1 - (ps[i] ?? 0);
              if (yes) count++;
            }
            expected[count] = (expected[count] ?? 0) + p;
          }
          const actual = threadPulse({ probabilities: ps, stock: 0 }).pmf;
          actual.forEach((p, i) => {
            expect(p).toBeCloseTo(expected[i] ?? 0, 10);
          });
          expect(actual.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
        },
      ),
      { seed: 26047, numRuns: 100 },
    );
  });
  it("handles empty cohort without ordering", () => {
    expect(threadPulse({ probabilities: [], stock: 0 }).reorderUnits).toBe(0);
  });
  it("has monotone service quantiles", () => {
    fc.assert(
      fc.property(
        fc.array(fc.double({ min: 0, max: 1, noNaN: true }), { maxLength: 50 }),
        (ps) => {
          expect(
            threadPulse({ probabilities: ps, stock: 0, serviceLevel: 0.99 })
              .target,
          ).toBeGreaterThanOrEqual(
            threadPulse({ probabilities: ps, stock: 0, serviceLevel: 0.8 })
              .target,
          );
        },
      ),
      { seed: 26047, numRuns: 100 },
    );
  });
});
describe("anti-corruption boundary", () => {
  it("refuses guessed birth dates and malformed source data", () => {
    expect(() =>
      fromIntakePatient(
        { id: "x", full_name: "X", gender: "FEMALE", age: 34 },
        "unknown",
      ),
    ).toThrow();
  });
  it("keeps provenance and deduplicates exact source identities", () => {
    const o = fromOpsReading({
      id: "1",
      patient_id: "p",
      systolic: 120,
      recorded_at: "2026-10-01T00:00:00Z",
    });
    expect(mergeRecord([o, o])).toEqual([o]);
    expect(o.source).toBe("project-1");
  });
});

it("compares cross-runtime floating-point results with bounded tolerance", () => {
  expect(equivalent({ p: 0.1 + 0.2 }, { p: 0.3 })).toBe(true);
  expect(equivalent({ p: 0.3 }, { p: 0.30001 })).toBe(false);
  expect(equivalent({ tier: "review" }, { tier: "emergency" })).toBe(false);
});
