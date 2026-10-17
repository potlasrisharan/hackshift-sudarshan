import { writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { createApp } from "../apps/api/app";

const app = createApp();
const began = performance.now(),
  duration = 3000,
  latencies: number[] = [];
let failures = 0;
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (performance.now() - began < duration) {
      const start = performance.now();
      const response = await app.request("/healthz");
      latencies.push(performance.now() - start);
      if (response.status !== 200) failures++;
    }
  }),
);
latencies.sort((a, b) => a - b);
const elapsed = performance.now() - began;
const result = {
  scope:
    "In-process Hono health-handler concurrency only; NOT k6 or end-to-end HTTP/database load",
  concurrency: 5,
  requests: latencies.length,
  failures,
  elapsedMs: elapsed,
  p50Ms: latencies[Math.floor(latencies.length * 0.5)],
  p95Ms: latencies[Math.floor(latencies.length * 0.95)],
  requestsPerSecond: latencies.length / (elapsed / 1000),
};
await writeFile(
  "docs/benchmarks/load-handler.json",
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result, null, 2));
