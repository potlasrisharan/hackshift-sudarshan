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
  maybeContext: CycleAnalysisContext = {},
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
      yearsSinceMenarche:
        input.yearsSinceMenarche ?? maybeContext.yearsSinceMenarche,
      isPregnantOrLactating:
        input.isPregnantOrLactating ?? maybeContext.isPregnantOrLactating,
      hormonalContraception:
        input.hormonalContraception ?? maybeContext.hormonalContraception,
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
    caveats.push(
      "Active pregnancy or lactation alters normal cyclic ovulatory physiology.",
    );
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
    caveats.push(
      "Hormonal contraception suppresses spontaneous hypothalamic-pituitary-ovarian ovulation; withdrawal bleeds do not reflect natural menstrual regularity.",
    );
  }

  if (uniqueDates.length < 2) {
    caveats.push(
      "At least 2 recorded cycles are required to compute cycle intervals.",
    );
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
  const variance = intervals.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? (100 * stdDev) / mean : 0;

  // Median & Extrema
  const sortedIntervals = [...intervals].sort((a, b) => a - b);
  const median =
    n % 2 === 1
      ? (sortedIntervals[Math.floor(n / 2)] ?? mean)
      : ((sortedIntervals[n / 2 - 1] ?? mean) +
          (sortedIntervals[n / 2] ?? mean)) /
        2;

  const shortest = sortedIntervals[0] ?? 0;
  const longest = sortedIntervals[sortedIntervals.length - 1] ?? 0;

  // Age-Aware Clinical Irregularity Rules
  const isAdolescent =
    (context.age !== undefined && context.age < 19) ||
    (context.yearsSinceMenarche ?? 5) < 3;

  if (isAdolescent) {
    // ACOG adolescent criteria: 21 to 45 days is physiologically normal in first 3 years post-menarche
    if (shortest < 21) {
      flags.push("Frequent cycles (<21 days) observed in adolescent profile.");
    }
    if (longest > 45) {
      flags.push(
        "Infrequent cycles (>45 days) observed in adolescent profile.",
      );
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
      flags.push(
        "Elevated cycle length variability (standard deviation > 7 days).",
      );
    }
  }

  // Predicted Next Period Window (with explicit uncertainty spread)
  let windowStartISO: string | null = null;
  let windowEndISO: string | null = null;

  if (intervals.length >= 2) {
    const lastDateStr = uniqueDates[uniqueDates.length - 1]!;
    const lastDate = new Date(lastDateStr);
    const spread = Math.max(Math.round(stdDev), 2);

    const projectedStartMs =
      lastDate.getTime() + (median - spread) * 24 * 60 * 60 * 1000;
    const projectedEndMs =
      lastDate.getTime() + (median + spread) * 24 * 60 * 60 * 1000;

    windowStartISO =
      new Date(projectedStartMs).toISOString().split("T")[0] ?? null;
    windowEndISO = new Date(projectedEndMs).toISOString().split("T")[0] ?? null;
  } else {
    caveats.push(
      "Next period estimation requires at least 3 historical cycles for reliable spread computation.",
    );
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

export type MenstrualPhase =
  | "MENSTRUAL"
  | "FOLLICULAR"
  | "OVULATION"
  | "LUTEAL";
export type PregnancyChance = "VERY_LOW" | "LOW" | "MEDIUM" | "HIGH" | "PEAK";

export interface CyclePhaseDetail {
  targetDate: string;
  cycleDay: number;
  totalCycleDays: number;
  phase: MenstrualPhase;
  phaseTitle: string;
  phaseSubtitle: string;
  pregnancyChance: PregnancyChance;
  isOvulationDay: boolean;
  isFertileWindow: boolean;
  isPeriodDay: boolean;
  daysUntilNextPeriod: number;
  predictedNextPeriodDate: string;
  periodLengthDays: number;
  hormoneSummary: {
    estrogen: "LOW" | "RISING" | "PEAK" | "MODERATE";
    progesterone: "LOW" | "RISING" | "HIGH" | "FALLING";
    lh: "BASELINE" | "SURGING" | "LOW";
  };
  dailyInsights: {
    bodyAndEnergy: string;
    nutritionFocus: string;
    movementAdvice: string;
    ayurvedicDosha: string;
  };
}

export interface MonthPhaseMapEntry {
  date: string;
  cycleDay: number;
  phase: MenstrualPhase;
  isPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  pregnancyChance: PregnancyChance;
}

export function herCyclePhaseDetector(params: {
  lastPeriodStartDate: string;
  cycleLengthDays?: number;
  periodLengthDays?: number;
  targetDate?: string;
}): CyclePhaseDetail {
  const cycleLength = Math.max(21, Math.min(45, params.cycleLengthDays ?? 28));
  const periodLength = Math.max(2, Math.min(10, params.periodLengthDays ?? 5));
  const targetDateStr =
    params.targetDate ?? new Date().toISOString().split("T")[0]!;

  const start = new Date(params.lastPeriodStartDate + "T00:00:00Z").getTime();
  const target = new Date(targetDateStr + "T00:00:00Z").getTime();
  const diffDays = Math.floor((target - start) / (1000 * 60 * 60 * 24));

  // Normalized 1-based cycle day
  const normalizedDay =
    diffDays >= 0
      ? (diffDays % cycleLength) + 1
      : cycleLength - (Math.abs(diffDays) % cycleLength) + 1;

  // Ovulation typically occurs 14 days before the next cycle starts
  const ovulationDay = Math.max(periodLength + 2, cycleLength - 14);
  const fertileStart = Math.max(periodLength + 1, ovulationDay - 5);
  const fertileEnd = Math.min(cycleLength, ovulationDay + 1);

  let phase: MenstrualPhase = "FOLLICULAR";
  let phaseTitle = "Follicular Phase";
  let phaseSubtitle = "Energy is rising as estrogen increases";
  let pregnancyChance: PregnancyChance = "LOW";
  let isPeriodDay = false;
  let isOvulationDay = false;
  let isFertileWindow = false;

  if (normalizedDay <= periodLength) {
    phase = "MENSTRUAL";
    phaseTitle = "Menstrual Phase";
    phaseSubtitle = `Day ${normalizedDay} of period · Endometrium is shedding`;
    pregnancyChance = "VERY_LOW";
    isPeriodDay = true;
  } else if (normalizedDay === ovulationDay) {
    phase = "OVULATION";
    phaseTitle = "Ovulation Day";
    phaseSubtitle = "Peak fertility window · Egg release underway";
    pregnancyChance = "PEAK";
    isOvulationDay = true;
    isFertileWindow = true;
  } else if (normalizedDay >= fertileStart && normalizedDay <= fertileEnd) {
    phase = "FOLLICULAR";
    phaseTitle = "Fertile Window";
    phaseSubtitle = "High chance of conception · Estrogen peak approaching";
    pregnancyChance = normalizedDay >= ovulationDay - 2 ? "HIGH" : "MEDIUM";
    isFertileWindow = true;
  } else if (normalizedDay > ovulationDay + 1) {
    phase = "LUTEAL";
    phaseTitle = "Luteal Phase";
    phaseSubtitle = "Progesterone dominant · Body preparing for renewal";
    pregnancyChance = "VERY_LOW";
  } else {
    phase = "FOLLICULAR";
    phaseTitle = "Follicular Phase";
    phaseSubtitle = "Estrogen building · Mental focus and stamina improving";
    pregnancyChance = "LOW";
  }

  // Next period calculation
  const cyclesElapsed = Math.floor(Math.max(0, diffDays) / cycleLength);
  const nextPeriodMs =
    start + (cyclesElapsed + 1) * cycleLength * 24 * 60 * 60 * 1000;
  const nextPeriodDate = new Date(nextPeriodMs).toISOString().split("T")[0]!;
  const daysUntilNextPeriod = Math.max(
    0,
    Math.ceil((nextPeriodMs - target) / (1000 * 60 * 60 * 24)),
  );

  const hormoneSummary = {
    estrogen:
      phase === "MENSTRUAL"
        ? "LOW"
        : phase === "OVULATION"
          ? "PEAK"
          : phase === "LUTEAL"
            ? "MODERATE"
            : "RISING",
    progesterone: phase === "LUTEAL" ? "HIGH" : "LOW",
    lh: isOvulationDay ? "SURGING" : "BASELINE",
  } as const;

  const dailyInsights = {
    bodyAndEnergy:
      phase === "MENSTRUAL"
        ? "Resting metabolic rate is lower. Prioritize rest and restorative sleep to support natural uterine clearing."
        : phase === "FOLLICULAR"
          ? "Rising estradiol enhances insulin sensitivity and cognitive verbal fluency. Optimal time for challenging tasks."
          : phase === "OVULATION"
            ? "Luteinizing hormone surge triggers peak libido, cervical fluid hydration, and cardiovascular stamina."
            : "Progesterone promotes relaxation but can increase fluid retention and core temperature by 0.3°C - 0.5°C.",
    nutritionFocus:
      phase === "MENSTRUAL"
        ? "Warm, easily digestible meals rich in bioavailable iron (palak, methi) and magnesium to soothe uterine contractions."
        : phase === "FOLLICULAR"
          ? "Fresh leafy sprouts, pumpkin and flax seeds (Seed Cycling Phase 1) to support balanced follicular estrogen synthesis."
          : phase === "OVULATION"
            ? "Antioxidant-dense berries, zinc, and cruciferous vegetables (broccoli, cabbage) to assist liver estrogen clearance."
            : "Sunflower and sesame seeds (Seed Cycling Phase 2), complex millets, and unrefined salts to mitigate PMS bloat.",
    movementAdvice:
      phase === "MENSTRUAL"
        ? "Gentle pelvic opening: Supta Baddha Konasana, gentle Cat-Cow, and supported breath pauses. Avoid inversions."
        : phase === "FOLLICULAR"
          ? "Progressive aerobic intervals, vinyasa flows, and functional resistance training taking advantage of high stamina."
          : phase === "OVULATION"
            ? "Peak exertion activities, full body strength, and high tempo flows while joint laxity is safely monitored."
            : "Slow Hatha, restorative floor yin, and calming Nadi Shodhana pranayama to soothe premenstrual nervous tension.",
    ayurvedicDosha:
      phase === "MENSTRUAL"
        ? "Apana Vayu is actively directing downward flow. Favor sweet, warm, unctuous foods; pacify aggravated Vata."
        : phase === "FOLLICULAR"
          ? "Kapha builds follicular tissue and unctuous vitality (Ojas). Light, warming, spiced meals kindle Agni."
          : phase === "OVULATION"
            ? "Pitta energy surges with metabolic transformation and body heat. Favor cooling herbs like coriander and fennel."
            : "Vata tends to accumulate as menses nears. Warm sesame oil Abhyanga and grounding Brahmi calm mental flutter.",
  };

  return {
    targetDate: targetDateStr,
    cycleDay: normalizedDay,
    totalCycleDays: cycleLength,
    phase,
    phaseTitle,
    phaseSubtitle,
    pregnancyChance,
    isOvulationDay,
    isFertileWindow,
    isPeriodDay,
    daysUntilNextPeriod,
    predictedNextPeriodDate: nextPeriodDate,
    periodLengthDays: periodLength,
    hormoneSummary,
    dailyInsights,
  };
}

export function herMonthPhaseMap(params: {
  lastPeriodStartDate: string;
  cycleLengthDays?: number;
  periodLengthDays?: number;
  year: number;
  month: number; // 1 to 12
}): MonthPhaseMapEntry[] {
  const { year, month } = params;
  const daysInMonth = new Date(year, month, 0).getDate();
  const entries: MonthPhaseMapEntry[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const detail = herCyclePhaseDetector({
      lastPeriodStartDate: params.lastPeriodStartDate,
      cycleLengthDays: params.cycleLengthDays,
      periodLengthDays: params.periodLengthDays,
      targetDate: dayStr,
    });

    entries.push({
      date: dayStr,
      cycleDay: detail.cycleDay,
      phase: detail.phase,
      isPeriod: detail.isPeriodDay,
      isFertile: detail.isFertileWindow,
      isOvulation: detail.isOvulationDay,
      pregnancyChance: detail.pregnancyChance,
    });
  }

  return entries;
}
