export interface RawTelemetrySample {
  patientId: string;
  provider: string; // "healthkit" | "health_connect" | "manual"
  sourceDevice: string; // "apple_watch" | "iphone" | "galaxy_watch" | "pixel"
  sourceRecordId?: string;
  metricCode: string;
  value: number;
  unit: string;
  startUtc: string; // ISO8601
  endUtc?: string;
  ianaTimezone?: string;
}

export interface BucketedDailySummary {
  dateLocal: string; // YYYY-MM-DD in target timezone
  metricCode: string;
  aggregatedValue: number;
  unit: string;
  sampleCount: number;
  sources: string[];
}

/**
 * V12 — Time-Series Deduplication & Local-Day Bucketing
 * Prevents double-counting from multiple co-present device streams (e.g. watch + phone).
 */
export function vitalisIngestAndDeduplicate(
  samples: RawTelemetrySample[],
  targetTimezone: string = "Asia/Kolkata"
): {
  deduplicatedSamples: RawTelemetrySample[];
  dailySummaries: BucketedDailySummary[];
  duplicateCount: number;
} {
  const seenRecords = new Set<string>();
  const deduplicated: RawTelemetrySample[] = [];
  let duplicateCount = 0;

  for (const s of samples) {
    // Harmonize units if applicable
    let val = s.value;
    let unit = s.unit.toLowerCase();

    // Glucose mmol/L to mg/dL conversion factor: 18.0182
    if (s.metricCode === "blood_glucose" && (unit === "mmol/l" || unit === "mmol")) {
      val = Number((val * 18.0182).toFixed(1));
      unit = "mg/dL";
    }

    const harmonizedSample: RawTelemetrySample = {
      ...s,
      value: val,
      unit: unit,
    };

    // Construct dedup key
    const recordKey = s.sourceRecordId
      ? `${s.patientId}:${s.provider}:${s.sourceRecordId}`
      : `${s.patientId}:${s.metricCode}:${s.startUtc}:${s.sourceDevice}`;

    if (seenRecords.has(recordKey)) {
      duplicateCount++;
      continue;
    }
    seenRecords.add(recordKey);
    deduplicated.push(harmonizedSample);
  }

  // Group by local day in target timezone
  // For cumulative metrics (steps, active minutes) -> sum; for instantaneous (HR, HRV) -> mean
  const dayMetricGroups = new Map<string, {
    values: number[];
    sources: Set<string>;
    unit: string;
  }>();

  for (const s of deduplicated) {
    // Compute date string in local timezone
    const dt = new Date(s.startUtc);
    let localDateStr = s.startUtc.slice(0, 10);
    try {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: targetTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(dt);
      localDateStr = parts; // YYYY-MM-DD
    } catch {
      // fallback to UTC slice
    }

    const groupKey = `${localDateStr}:${s.metricCode}`;
    if (!dayMetricGroups.has(groupKey)) {
      dayMetricGroups.set(groupKey, {
        values: [],
        sources: new Set(),
        unit: s.unit,
      });
    }

    const group = dayMetricGroups.get(groupKey)!;
    group.values.push(s.value);
    group.sources.add(s.sourceDevice);
  }

  const dailySummaries: BucketedDailySummary[] = [];

  for (const [key, data] of dayMetricGroups.entries()) {
    const [dateLocal = "", metricCode = ""] = key.split(":");
    const isCumulative = metricCode === "steps" || metricCode === "active_minutes";

    let aggregatedValue = 0;
    if (isCumulative) {
      aggregatedValue = data.values.reduce((a, b) => a + b, 0);
    } else {
      aggregatedValue = Number((data.values.reduce((a, b) => a + b, 0) / data.values.length).toFixed(1));
    }

    dailySummaries.push({
      dateLocal,
      metricCode,
      aggregatedValue,
      unit: data.unit,
      sampleCount: data.values.length,
      sources: Array.from(data.sources),
    });
  }

  dailySummaries.sort((a, b) => a.dateLocal.localeCompare(b.dateLocal));

  return {
    deduplicatedSamples: deduplicated,
    dailySummaries,
    duplicateCount,
  };
}
