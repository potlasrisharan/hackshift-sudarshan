# Synthetic mechanism benchmark

Seed 26047; 500 synthetic cases; runtime v20.20.1. Reproduce with `make bench`.

| Measure | AYUSETU | Naive baseline |
|---|---:|---:|
| Unsafe stock selections | 0 | 276 |
| Mean plan paise | 7893 | 5106 |
| Injected BP ramps detected (250) | 250 | 0 |
| Unchanged streams alerted (250) | 4 | 0 |

The cheapest-only stock baseline omits clinical constraints and may select the wrong strength or expiry. Its apparent savings are invalid. The BP baseline alerts at 150 mmHg; ramps here stay below that threshold by construction. These results demonstrate mechanisms, not superiority on realistic clinical workloads.

| Algorithm | Mean milliseconds / call (1,000 iterations) |
|---|---:|
| sentinel | 0.0061 |
| rxToShelf | 0.0133 |
| driftRadar | 0.0314 |
| threadPulse | 0.0402 |

- Hand-constructed adversarial allocation cases: cheapest-only baseline ignores safety; not a real pharmacy comparison.
- Noise/ramp parameters favour a baseline-adaptive detector; not calibrated or clinically validated.
- No independent clinical dataset; no claim about real-world sensitivity or safety.
- Cycle modelling, full BOCPD, calibrated Sentinel confidence and refill-time estimation remain pending.
