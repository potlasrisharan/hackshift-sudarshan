import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import {
  driftRadar,
  rxToShelf,
  sentinel,
  threadPulse,
} from "../packages/engine";
import { demoPlan } from "../packages/shared/demo";

let state = 26047;
function random() {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return state / 4294967296;
}
const n = 500;
const allocation = {
  oursUnsafe: 0,
  baselineUnsafe: 0,
  oursMeanPaise: 0,
  baselineMeanPaise: 0,
};
const drift = {
  oursDetected: 0,
  baselineDetected: 0,
  oursFalseAlerts: 0,
  baselineFalseAlerts: 0,
};
const began = performance.now();
for (let i = 0; i < n; i++) {
  const input = demoPlan();
  input.batches = input.batches.map((b) => ({
    ...b,
    pricePaise: 30 + Math.floor(random() * 270),
  }));
  const ours = rxToShelf(input).plans[0];
  const baseline = [...input.batches].sort(
    (a, b) => a.pricePaise - b.pricePaise,
  )[0];
  if (!ours) throw new Error("Synthetic benchmark unexpectedly infeasible");
  allocation.oursMeanPaise += ours.costPaise / n;
  if (
    ours.allocation.some((a) => {
      const b = input.batches.find((b) => b.id === a.batchId);
      return (
        b?.strengthMg !== 500 ||
        b.salt !== "metformin" ||
        b.form !== "tablet" ||
        b.expiry < "2026-11-30" ||
        a.units > b.stock
      );
    })
  )
    allocation.oursUnsafe++;
  if (baseline) {
    allocation.baselineMeanPaise +=
      (baseline.pricePaise * input.prescription.units) / n;
    if (baseline.strengthMg !== 500 || baseline.expiry < "2026-11-30")
      allocation.baselineUnsafe++;
  }
  const changed = i % 2 === 0;
  const readings = Array.from({ length: 30 }, (_, day) => ({
    day,
    value:
      125 +
      (random() - 0.5) * 6 +
      (changed && day >= 15 ? Math.min(20, (day - 14) * 2) : 0),
  }));
  const oursAlert = driftRadar({ readings }).alert,
    baselineAlert = readings.some((r) => r.value >= 150);
  if (changed) {
    if (oursAlert) drift.oursDetected++;
    if (baselineAlert) drift.baselineDetected++;
  } else {
    if (oursAlert) drift.oursFalseAlerts++;
    if (baselineAlert) drift.baselineFalseAlerts++;
  }
}
const latency: { algorithm: string; meanMs: number }[] = [];
for (const [algorithm, run] of Object.entries({
  sentinel: () => sentinel({ answers: { fever: "yes" } }),
  rxToShelf: () => rxToShelf(demoPlan()),
  driftRadar: () =>
    driftRadar({
      readings: Array.from({ length: 30 }, (_, day) => ({ day, value: 125 })),
    }),
  threadPulse: () =>
    threadPulse({
      probabilities: Array.from({ length: 100 }, () => 0.5),
      stock: 50,
    }),
})) {
  for (let i = 0; i < 50; i++) run();
  const start = performance.now();
  for (let i = 0; i < 1000; i++) run();
  latency.push({ algorithm, meanMs: (performance.now() - start) / 1000 });
}
const results = {
  seed: 26047,
  cases: n,
  generatedAt: new Date().toISOString(),
  runtime: process.version,
  durationMs: performance.now() - began,
  allocation,
  drift,
  latency,
  limitations: [
    "Hand-constructed adversarial allocation cases: cheapest-only baseline ignores safety; not a real pharmacy comparison.",
    "Noise/ramp parameters favour a baseline-adaptive detector; not calibrated or clinically validated.",
    "No independent clinical dataset; no claim about real-world sensitivity or safety.",
    "Cycle modelling, full BOCPD, calibrated Sentinel confidence and refill-time estimation remain pending.",
  ],
};
await mkdir("docs/benchmarks", { recursive: true });
await writeFile(
  "docs/benchmarks/results.json",
  `${JSON.stringify(results, null, 2)}\n`,
);
await writeFile(
  "docs/benchmarks/RESULTS.md",
  `# Synthetic mechanism benchmark\n\nSeed ${results.seed}; ${n} synthetic cases; runtime ${process.version}. Reproduce with \`make bench\`.\n\n| Measure | Dhaaga | Naive baseline |\n|---|---:|---:|\n| Unsafe stock selections | ${allocation.oursUnsafe} | ${allocation.baselineUnsafe} |\n| Mean plan paise | ${allocation.oursMeanPaise.toFixed(0)} | ${allocation.baselineMeanPaise.toFixed(0)} |\n| Injected BP ramps detected (250) | ${drift.oursDetected} | ${drift.baselineDetected} |\n| Unchanged streams alerted (250) | ${drift.oursFalseAlerts} | ${drift.baselineFalseAlerts} |\n\nThe cheapest-only stock baseline omits clinical constraints and may select the wrong strength or expiry. Its apparent savings are invalid. The BP baseline alerts at 150 mmHg; ramps here stay below that threshold by construction. These results demonstrate mechanisms, not superiority on realistic clinical workloads.\n\n| Algorithm | Mean milliseconds / call (1,000 iterations) |\n|---|---:|\n${latency.map((l) => `| ${l.algorithm} | ${l.meanMs.toFixed(4)} |`).join("\n")}\n\n${results.limitations.map((l) => `- ${l}`).join("\n")}\n`,
);
console.log(JSON.stringify(results, null, 2));
