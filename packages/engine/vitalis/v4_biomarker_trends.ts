export interface BiomarkerPoint {
  dateUtc: string; // ISO string
  value: number;
  unit: string;
  sourceType?: string;
}

export interface BiomarkerTrendResult {
  metricName: string;
  unit: string;
  sampleCount: number;
  latestValue: number | null;
  previousValue: number | null;
  delta: number | null;
  slopePerDay: number | null;
  slopePerMonth: number | null;
  rollingMean: number | null;
  direction: "INCREASING" | "DECREASING" | "STABLE" | "INSUFFICIENT_DATA";
  status: "NORMAL_PROGRESSION" | "ELEVATED_ATTENTION" | "QUARANTINED_OUTLIERS";
  quarantinedPoints: BiomarkerPoint[];
  validPoints: BiomarkerPoint[];
  clinicalNote: string;
}

// Physiological plausible bounds
const PHYSIOLOGICAL_BOUNDS: Record<string, { min: number; max: number }> = {
  hba1c: { min: 3.0, max: 20.0 }, // %
  fasting_glucose: { min: 30, max: 600 }, // mg/dL
  systolic_bp: { min: 50, max: 260 }, // mmHg
  diastolic_bp: { min: 30, max: 160 }, // mmHg
  total_cholesterol: { min: 50, max: 600 }, // mg/dL
  ldl: { min: 20, max: 400 }, // mg/dL
  hdl: { min: 10, max: 150 }, // mg/dL
  triglycerides: { min: 20, max: 1500 }, // mg/dL
  resting_hr: { min: 30, max: 220 }, // bpm
  vo2max: { min: 10, max: 95 }, // mL/kg/min
};

/**
 * V4 — Biomarker Trend Analyzer
 * Robust time-series analysis with outlier quarantine and rate-of-change computation.
 */
export function vitalisBiomarkerTrends(
  metricKey: string,
  readings: BiomarkerPoint[],
): BiomarkerTrendResult {
  const bounds = PHYSIOLOGICAL_BOUNDS[metricKey.toLowerCase()] || {
    min: 0,
    max: 999999,
  };

  const validPoints: BiomarkerPoint[] = [];
  const quarantinedPoints: BiomarkerPoint[] = [];

  for (const r of readings) {
    if (r.value < bounds.min || r.value > bounds.max || isNaN(r.value)) {
      quarantinedPoints.push(r);
    } else {
      validPoints.push(r);
    }
  }

  // Sort chronologically
  validPoints.sort(
    (a, b) => new Date(a.dateUtc).getTime() - new Date(b.dateUtc).getTime(),
  );

  if (validPoints.length < 2) {
    const single = validPoints[0];
    return {
      metricName: metricKey,
      unit: single?.unit ?? "units",
      sampleCount: validPoints.length,
      latestValue: single?.value ?? null,
      previousValue: null,
      delta: null,
      slopePerDay: null,
      slopePerMonth: null,
      rollingMean: single?.value ?? null,
      direction: "INSUFFICIENT_DATA",
      status:
        quarantinedPoints.length > 0
          ? "QUARANTINED_OUTLIERS"
          : "NORMAL_PROGRESSION",
      quarantinedPoints,
      validPoints,
      clinicalNote:
        "Minimum two valid chronological measurements required to evaluate trajectory.",
    };
  }

  const latest = validPoints[validPoints.length - 1]!;
  const previous = validPoints[validPoints.length - 2]!;

  const delta = Number((latest.value - previous.value).toFixed(2));
  const tLatest = new Date(latest.dateUtc).getTime();
  const tPrev = new Date(previous.dateUtc).getTime();
  const daysDiff = Math.max(1, (tLatest - tPrev) / (1000 * 60 * 60 * 24));

  const slopePerDay = Number((delta / daysDiff).toFixed(4));
  const slopePerMonth = Number((slopePerDay * 30.4375).toFixed(2));

  const sum = validPoints.reduce((acc, p) => acc + p.value, 0);
  const rollingMean = Number((sum / validPoints.length).toFixed(2));

  let direction: BiomarkerTrendResult["direction"] = "STABLE";
  if (Math.abs(delta) > 0.05 * previous.value) {
    direction = delta > 0 ? "INCREASING" : "DECREASING";
  }

  return {
    metricName: metricKey,
    unit: latest.unit,
    sampleCount: validPoints.length,
    latestValue: latest.value,
    previousValue: previous.value,
    delta,
    slopePerDay,
    slopePerMonth,
    rollingMean,
    direction,
    status:
      quarantinedPoints.length > 0
        ? "QUARANTINED_OUTLIERS"
        : "NORMAL_PROGRESSION",
    quarantinedPoints,
    validPoints,
    clinicalNote: `Observed trend over ${Math.round(daysDiff)} days shows a net change of ${delta > 0 ? "+" : ""}${delta} ${latest.unit}. Associations require clinical context.`,
  };
}
