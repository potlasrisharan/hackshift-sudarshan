export interface SleepInterval {
  date: string; // YYYY-MM-DD
  bedtimeMinuteOfDay: number; // 0 to 1439 (e.g., 23:00 = 1380, 00:30 = 30)
  wakeMinuteOfDay: number;
  durationMinutes: number;
  efficiencyPercent?: number;
}

export interface SleepRegularityResult {
  metricType: "SLEEP_REGULARITY_INDEX" | "BEDTIME_CONSISTENCY_SCORE";
  score: number; // 0 to 100
  meanBedtimeFormatted: string;
  meanWakeTimeFormatted: string;
  bedtimeVariabilityMinutes: number;
  sleepDurationAverageHours: number;
  consistencyCategory: "EXCELLENT" | "MODERATE" | "HIGH_VARIABILITY";
  recommendation: string;
}

function formatMinutesToTime(totalMins: number): string {
  const norm = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const hours = Math.floor(norm / 60);
  const mins = norm % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${mins.toString().padStart(2, "0")} ${ampm}`;
}

/**
 * V9 — Sleep Regularity Index & Bedtime Consistency
 * Measures circadian timing stability using circular statistics on bedtime schedules.
 */
export function vitalisSleepRegularity(
  intervals: SleepInterval[]
): SleepRegularityResult {
  if (intervals.length === 0) {
    return {
      metricType: "BEDTIME_CONSISTENCY_SCORE",
      score: 50,
      meanBedtimeFormatted: "11:00 PM",
      meanWakeTimeFormatted: "07:00 AM",
      bedtimeVariabilityMinutes: 0,
      sleepDurationAverageHours: 7.0,
      consistencyCategory: "MODERATE",
      recommendation: "Log 3+ nights of sleep data to calibrate schedule regularity.",
    };
  }

  // Circular mean calculation for bedtimes (angles around 24hr clock)
  let sinSum = 0;
  let cosSum = 0;
  let totalDuration = 0;

  for (const interval of intervals) {
    const angle = (interval.bedtimeMinuteOfDay / 1440) * 2 * Math.PI;
    sinSum += Math.sin(angle);
    cosSum += Math.cos(angle);
    totalDuration += interval.durationMinutes;
  }

  const n = intervals.length;
  const meanAngle = Math.atan2(sinSum / n, cosSum / n);
  const normalizedMeanAngle = (meanAngle + 2 * Math.PI) % (2 * Math.PI);
  const meanBedtimeMinute = (normalizedMeanAngle / (2 * Math.PI)) * 1440;

  // Circular dispersion / variance (R length)
  const rLength = Math.sqrt(Math.pow(sinSum / n, 2) + Math.pow(cosSum / n, 2));
  // Circular standard deviation in minutes
  const circularStdMinutes = Math.min(
    240,
    Math.round(Math.sqrt(Math.max(0, -2 * Math.log(Math.max(0.01, rLength)))) * (1440 / (2 * Math.PI)))
  );

  // Consistency Score: 100 is 0 std dev, 0 is 180+ mins variability
  const score = Math.max(0, Math.min(100, Math.round(100 - (circularStdMinutes / 120) * 50)));

  const avgDurationHours = Number((totalDuration / n / 60).toFixed(1));
  const meanWakeMinute = (meanBedtimeMinute + avgDurationHours * 60) % 1440;

  let category: SleepRegularityResult["consistencyCategory"] = "MODERATE";
  let rec = "Schedule is reasonably stable. Aim to keep sleep onset within a 30-minute window.";

  if (score >= 85) {
    category = "EXCELLENT";
    rec = "High circadian stability. Regular sleep timing strengthens restorative delta sleep.";
  } else if (score < 65) {
    category = "HIGH_VARIABILITY";
    rec = "Frequent shifts in sleep timing observed. A consistent bedtime anchors metabolic rhythm.";
  }

  return {
    metricType: "BEDTIME_CONSISTENCY_SCORE",
    score,
    meanBedtimeFormatted: formatMinutesToTime(meanBedtimeMinute),
    meanWakeTimeFormatted: formatMinutesToTime(meanWakeMinute),
    bedtimeVariabilityMinutes: circularStdMinutes,
    sleepDurationAverageHours: avgDurationHours,
    consistencyCategory: category,
    recommendation: rec,
  };
}
