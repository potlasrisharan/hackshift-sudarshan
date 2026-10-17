# Drift Radar

Status: robust baseline/CUSUM mechanism, not the older PRD's BOCPD and not a
validated deterioration model. Only systolic BP is currently supported.

**Problem:** reveal a sustained change against a person's starting measurements
while retaining an independent absolute-limit alert. A population threshold
alone can miss sub-threshold shifts; a chatbot cannot reproduce the statistics.

Inputs: 1–365 readings of `{day,value}`, validated 60–250 mmHg. Group same-day
samples by mean, sort event time. Baseline m = median(first 7 days),
`s=max(3,1.4826*median(abs(x-m)))`. For later samples,
`C_t=max(0,C_(t-1)+(x_t-m)/s-0.5)`. Reset C on a gap exceeding three days. Flag if
C≥5; independently flag any systolic value≥180 even during cold start. This
illustrative threshold is not a clinical management plan.

```text
validate, group same day, sort chronologically
estimate median and MAD from up to seven observed days
for each reading:
    reset accumulator after a >3-day gap
    after baseline, update one-sided standardised CUSUM
    record accumulator, trend flag and independent absolute flag
return baseline, robust scale, full trace and limitations
```

Time O(n log n), memory O(n), with bounded n. Tunables: baseline count 7, scale
floor 3, allowance 0.5, threshold 5, reset gap 3. Missing days are never imputed.
Arrival order does not affect results. Single-channel, upward drift only; no
context about medication changes or clinician-established baselines. A newly high
baseline may therefore be missed below the absolute floor. Sensor quality,
longitudinal calibration and clinician feedback remain required.

Tests: constant streams stay quiet; synthetic ramp alerts; absolute floor works
on the first reading; reverse arrival order is equivalent; long gaps reset the
accumulator. Benchmarks report both injected-change detections and unchanged
streams flagged, with limitations on how the simulator favours each strategy.

60 seconds: “We show when a series has moved from its starting pattern, and
show the readings and formula so a care team can inspect it. This is an early
engineering mechanism, not a diagnosis.”

Technical: “Median/MAD standardisation feeds a one-sided CUSUM, with event-time
normalisation, same-day aggregation, gap resets and an independent absolute flag.
BOCPD, multi-sensor fusion and validated alert utility remain future work.”
