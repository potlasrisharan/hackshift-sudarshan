/**
 * AyuSetu HER — Algorithm A4: Longitudinal Health Trend Analyzer
 * Multi-window rolling averages and coverage evaluation across wear telemetry and symptoms.
 * Emits strictly descriptive correlations; zero causal claims; transparent coverage metrics.
 */

export interface TimeSeriesPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface TrendResult {
  status: "AVAILABLE" | "INSUFFICIENT_DATA";
  windowDays: number;
  sampleCount: number;
  coverageRatio: number; // e.g. 0.85 = 85% days with data
  rollingMean: number | null;
  minimum: number | null;
  maximum: number | null;
  descriptiveNarrative: string;
}

export function herTrendAnalyzer(
  series: TimeSeriesPoint[],
  windowDaysOrLabel: 7 | 14 | 30 | string = 14,
  minimumCoverage: number = 0.5,
): TrendResult {
  const windowDays =
    typeof windowDaysOrLabel === "number" ? windowDaysOrLabel : 14;
  if (!series || series.length === 0) {
    return {
      status: "INSUFFICIENT_DATA",
      windowDays,
      sampleCount: 0,
      coverageRatio: 0,
      rollingMean: null,
      minimum: null,
      maximum: null,
      descriptiveNarrative: `Insufficient recorded entries over the past ${windowDays} days.`,
    };
  }

  // Deduplicate by date (keep last entry for that date)
  const map = new Map<string, number>();
  for (const pt of series) {
    map.set(pt.date, pt.value);
  }

  const distinctDates = Array.from(map.keys()).sort();
  const latestDateMs = new Date(
    distinctDates[distinctDates.length - 1]!,
  ).getTime();
  const windowStartMs = latestDateMs - (windowDays - 1) * 24 * 60 * 60 * 1000;

  // Filter points inside the rolling window
  const windowPoints: number[] = [];
  for (const [dateStr, val] of map.entries()) {
    const ptMs = new Date(dateStr).getTime();
    if (ptMs >= windowStartMs && ptMs <= latestDateMs) {
      windowPoints.push(val);
    }
  }

  const sampleCount = windowPoints.length;
  const coverageRatio = Math.round((sampleCount / windowDays) * 100) / 100;

  if (coverageRatio < minimumCoverage || sampleCount === 0) {
    return {
      status: "INSUFFICIENT_DATA",
      windowDays,
      sampleCount,
      coverageRatio,
      rollingMean: null,
      minimum: null,
      maximum: null,
      descriptiveNarrative: `Only ${sampleCount} of ${windowDays} days logged (${Math.round(coverageRatio * 100)}% coverage). Minimum required is ${Math.round(minimumCoverage * 100)}%.`,
    };
  }

  const sum = windowPoints.reduce((acc, v) => acc + v, 0);
  const mean = Math.round((sum / sampleCount) * 10) / 10;
  const min = Math.min(...windowPoints);
  const max = Math.max(...windowPoints);

  const narrative = `Over the past ${windowDays} days (${Math.round(coverageRatio * 100)}% observation coverage), the recorded average was ${mean} (range: ${min} to ${max}).`;

  return {
    status: "AVAILABLE",
    windowDays,
    sampleCount,
    coverageRatio,
    rollingMean: mean,
    minimum: min,
    maximum: max,
    descriptiveNarrative: narrative,
  };
}
