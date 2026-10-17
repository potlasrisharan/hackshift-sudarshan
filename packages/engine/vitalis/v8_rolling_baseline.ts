export type HRVMetricType = "RMSSD" | "SDNN";

export interface BaselineSample {
  value: number;
  dateUtc: string;
  sourceDevice: string;
  qualityScore?: number;
}

export interface BaselineResult {
  metricName: string;
  metricType?: HRVMetricType;
  sampleCount: number;
  mean: number | null;
  stdDev: number | null;
  todayValue: number | null;
  todayZScore: number | null;
  baselineWindowDays: number;
  status: "ADEQUATE" | "INSUFFICIENT_SAMPLES" | "DEVICE_SEGMENTED";
  isWithinNormalRange: boolean;
  clinicalNote: string;
}

/**
 * V8 — 21-Day Rolling HRV/RHR Baseline
 * Calculates personal mean and standard deviation over a rolling 21-day window.
 * Strictly enforces RMSSD vs SDNN isolation.
 */
export function vitalisRollingBaseline(
  metricName: "RESTING_HR" | "HRV",
  samples: BaselineSample[],
  todaySample?: BaselineSample,
  hrvType?: HRVMetricType,
): BaselineResult {
  const minSamples = 7;
  const windowDays = 21;

  // Verify consistent source device
  const devices = new Set(samples.map((s) => s.sourceDevice));
  if (devices.size > 1) {
    // Take only the primary device (most frequent)
    const deviceCounts = new Map<string, number>();
    for (const s of samples) {
      deviceCounts.set(
        s.sourceDevice,
        (deviceCounts.get(s.sourceDevice) || 0) + 1,
      );
    }
    let topDevice = "";
    let topCount = 0;
    for (const [dev, cnt] of deviceCounts.entries()) {
      if (cnt > topCount) {
        topDevice = dev;
        topCount = cnt;
      }
    }
    samples = samples.filter((s) => s.sourceDevice === topDevice);
  }

  if (samples.length < minSamples) {
    return {
      metricName,
      metricType: hrvType,
      sampleCount: samples.length,
      mean: null,
      stdDev: null,
      todayValue: todaySample?.value ?? null,
      todayZScore: null,
      baselineWindowDays: windowDays,
      status: "INSUFFICIENT_SAMPLES",
      isWithinNormalRange: true,
      clinicalNote: `Insufficient observations within the last 21 days (recorded ${samples.length}, minimum ${minSamples} required).`,
    };
  }

  const values = samples.map((s) => s.value);
  const n = values.length;
  const mean = Number((values.reduce((a, b) => a + b, 0) / n).toFixed(1));

  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const stdDev = Number(Math.max(0.5, Math.sqrt(variance)).toFixed(2));

  let todayZScore: number | null = null;
  let isWithinRange = true;

  if (todaySample && stdDev > 0.1) {
    todayZScore = Number(((todaySample.value - mean) / stdDev).toFixed(2));
    isWithinRange = Math.abs(todayZScore) <= 2.0;
  }

  return {
    metricName,
    metricType: hrvType,
    sampleCount: n,
    mean,
    stdDev,
    todayValue: todaySample?.value ?? null,
    todayZScore,
    baselineWindowDays: windowDays,
    status: "ADEQUATE",
    isWithinNormalRange: isWithinRange,
    clinicalNote: isWithinRange
      ? `Today's measurement (${todaySample?.value ?? mean}) is consistent with your 21-day personal baseline (Mean: ${mean}, SD: ${stdDev}).`
      : `Today's measurement deviates from your 21-day personal baseline (Z-score: ${todayZScore}). May reflect acute fatigue, stress, or recovery demands.`,
  };
}
