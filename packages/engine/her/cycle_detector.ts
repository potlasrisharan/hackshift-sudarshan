/**
 * AyuSetu HER — Algorithm A1: Menstrual Pattern Deviation Detector
 * Mathematical computation of cycle length statistics, descriptive spread,
 * variability metrics, and age-aware irregularity flags.
 */

export interface CycleAnalysisContext {
  age?: number;
  yearsSinceMenarche?: number;
  hormonalContraception?: boolean;
  isPregnantOrLactating?: boolean;
  isPerimenopausal?: boolean;
}

export interface CycleStatsResult {
  status: "ADEQUATE_DATA" | "INSUFFICIENT_DATA" | "CONTEXT_LIMITED";
  totalIntervals: number;
  meanLengthDays: number | null;
  stdDevDays: number | null;
  coefficientOfVariation: number | null;
  medianLengthDays: number | null;
  shortestCycleDays: number | null;
  longestCycleDays: number | null;
  predictedNextWindowStart: string | null;
  predictedNextWindowEnd: string | null;
  hasIrregularity: boolean;
  hasAmenorrhea: boolean;
  irregularityFlags: string[];
  caveats: string[];
  ruleVersion: string;
}

export function herCycleDetector(
  input:
    | string[]
    | {
        dates?: string[];
        cycles?: Array<{ startDate?: string } | string>;
        age?: number;
        yearsSinceMenarche?: number;
        isPregnantOrLactating?: boolean;
        hormonalContraception?: boolean;
      },
  maybeContext: CycleAnalysisContext = {}
): CycleStatsResult {
  const ruleVersion = "A1-CYCLE-2026.1";
  const caveats: string[] = [];
  const flags: string[] = [];

  let rawDates: string[] = [];
  let context: CycleAnalysisContext = { ...maybeContext };

  if (Array.isArray(input)) {
    rawDates = input;
  } else if (input && typeof input === "object") {
    context = {
      age: input.age ?? maybeContext.age,
      yearsSinceMenarche: input.yearsSinceMenarche ?? maybeContext.yearsSinceMenarche,
      isPregnantOrLactating: input.isPregnantOrLactating ?? maybeContext.isPregnantOrLactating,
      hormonalContraception: input.hormonalContraception ?? maybeContext.hormonalContraception,
    };
    if (Array.isArray(input.dates)) {
      rawDates = input.dates;
    } else if (Array.isArray(input.cycles)) {
      rawDates = input.cycles
        .map((c) => (typeof c === "string" ? c : c.startDate || ""))
        .filter(Boolean);
    }
  }

  // Sort and deduplicate dates
  const uniqueDates = Array.from(new Set(rawDates))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (context.isPregnantOrLactating) {
    caveats.push("Active pregnancy or lactation alters normal cyclic ovulatory physiology.");
    return {
      status: "CONTEXT_LIMITED",
      totalIntervals: 0,
      meanLengthDays: null,
      stdDevDays: null,
      coefficientOfVariation: null,
      medianLengthDays: null,
      shortestCycleDays: null,
      longestCycleDays: null,
      predictedNextWindowStart: null,
      predictedNextWindowEnd: null,
      hasIrregularity: false,
      hasAmenorrhea: false,
      irregularityFlags: [],
      caveats,
      ruleVersion,
    };
  }

  if (context.hormonalContraception) {
    caveats.push("Hormonal contraception suppresses spontaneous hypothalamic-pituitary-ovarian ovulation; withdrawal bleeds do not reflect natural menstrual regularity.");
  }

  if (uniqueDates.length < 2) {
    caveats.push("At least 2 recorded cycles are required to compute cycle intervals.");
    return {
      status: "INSUFFICIENT_DATA",
      totalIntervals: 0,
      meanLengthDays: null,
      stdDevDays: null,
      coefficientOfVariation: null,
      medianLengthDays: null,
      shortestCycleDays: null,
      longestCycleDays: null,
      predictedNextWindowStart: null,
      predictedNextWindowEnd: null,
      hasIrregularity: false,
      hasAmenorrhea: false,
      irregularityFlags: [],
      caveats,
      ruleVersion,
    };
  }

  // Calculate intervals Li = D(i+1) - D(i)
  const intervals: number[] = [];
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const d1 = new Date(uniqueDates[i]!).getTime();
    const d2 = new Date(uniqueDates[i + 1]!).getTime();
    const diffDays = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      intervals.push(diffDays);
    }
  }

  if (intervals.length === 0) {
    return {
      status: "INSUFFICIENT_DATA",
      totalIntervals: 0,
      meanLengthDays: null,
      stdDevDays: null,
      coefficientOfVariation: null,
      medianLengthDays: null,
      shortestCycleDays: null,
      longestCycleDays: null,
      predictedNextWindowStart: null,
      predictedNextWindowEnd: null,
      hasIrregularity: false,
      hasAmenorrhea: false,
      irregularityFlags: [],
      caveats: ["Insufficient chronological intervals."],
      ruleVersion,
    };
  }

  // Statistics: Mean, Variance, StdDev, CV
  const n = intervals.length;
  const mean = intervals.reduce((acc, v) => acc + v, 0) / n;
  const variance = intervals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? (100 * stdDev) / mean : 0;

  // Median & Extrema
  const sortedIntervals = [...intervals].sort((a, b) => a - b);
  const median =
    n % 2 === 1
      ? (sortedIntervals[Math.floor(n / 2)] ?? mean)
      : ((sortedIntervals[n / 2 - 1] ?? mean) + (sortedIntervals[n / 2] ?? mean)) / 2;

  const shortest = sortedIntervals[0] ?? 0;
  const longest = sortedIntervals[sortedIntervals.length - 1] ?? 0;

  // Age-Aware Clinical Irregularity Rules
  const isAdolescent = (context.age !== undefined && context.age < 19) || ((context.yearsSinceMenarche ?? 5) < 3);

  if (isAdolescent) {
    // ACOG adolescent criteria: 21 to 45 days is physiologically normal in first 3 years post-menarche
    if (shortest < 21) {
      flags.push("Frequent cycles (<21 days) observed in adolescent profile.");
    }
    if (longest > 45) {
      flags.push("Infrequent cycles (>45 days) observed in adolescent profile.");
    }
  } else {
    // 2023 International Adult PCOS Guideline criteria:
    // Normal adult range: 21 to 35 days
    if (shortest < 21) {
      flags.push("Polymenorrhea: Cycles shorter than 21 days recorded.");
    }
    if (longest > 35) {
      flags.push("Oligomenorrhea: Cycles longer than 35 days recorded.");
    }
    if (longest >= 90) {
      flags.push("Secondary Amenorrhea: Cycle gap of 90+ days detected.");
    }
    if (stdDev > 7 || cv > 20) {
      flags.push("Elevated cycle length variability (standard deviation > 7 days).");
    }
  }

  // Predicted Next Period Window (with explicit uncertainty spread)
  let windowStartISO: string | null = null;
  let windowEndISO: string | null = null;

  if (intervals.length >= 2) {
    const lastDateStr = uniqueDates[uniqueDates.length - 1]!;
    const lastDate = new Date(lastDateStr);
    const spread = Math.max(Math.round(stdDev), 2);

    const projectedStartMs = lastDate.getTime() + (median - spread) * 24 * 60 * 60 * 1000;
    const projectedEndMs = lastDate.getTime() + (median + spread) * 24 * 60 * 60 * 1000;

    windowStartISO = new Date(projectedStartMs).toISOString().split("T")[0] ?? null;
    windowEndISO = new Date(projectedEndMs).toISOString().split("T")[0] ?? null;
  } else {
    caveats.push("Next period estimation requires at least 3 historical cycles for reliable spread computation.");
  }

  return {
    status: intervals.length >= 3 ? "ADEQUATE_DATA" : "INSUFFICIENT_DATA",
    totalIntervals: n,
    meanLengthDays: Math.round(mean * 10) / 10,
    stdDevDays: Math.round(stdDev * 10) / 10,
    coefficientOfVariation: Math.round(cv * 10) / 10,
    medianLengthDays: Math.round(median),
    shortestCycleDays: shortest,
    longestCycleDays: longest,
    predictedNextWindowStart: windowStartISO,
    predictedNextWindowEnd: windowEndISO,
    hasIrregularity: flags.length > 0,
    hasAmenorrhea: (longest ?? 0) >= 90,
    irregularityFlags: flags,
    caveats,
    ruleVersion,
  };
}
