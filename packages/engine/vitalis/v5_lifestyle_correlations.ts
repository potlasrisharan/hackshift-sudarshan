export interface PairedSample {
  x: number;
  y: number;
  dateKey: string;
}

export interface CorrelationResult {
  xLabel: string;
  yLabel: string;
  sampleCount: number;
  pearsonR: number | null;
  interpretation: string;
  status: "ADEQUATE" | "INSUFFICIENT_SAMPLES" | "ZERO_VARIANCE";
  disclaimer: string;
}

/**
 * V5 — Lifestyle Association Explorer
 * Computes non-causal Pearson correlation between lifestyle habits with sample size guards.
 */
export function vitalisLifestyleCorrelations(
  xLabel: string,
  yLabel: string,
  pairs: PairedSample[],
): CorrelationResult {
  const disclaimer =
    "Association does not establish causation. Observed statistical correlation does not guarantee clinical efficacy or health outcomes.";

  if (pairs.length < 7) {
    return {
      xLabel,
      yLabel,
      sampleCount: pairs.length,
      pearsonR: null,
      interpretation:
        "Insufficient paired data points (minimum 7 required) to evaluate statistical association.",
      status: "INSUFFICIENT_SAMPLES",
      disclaimer,
    };
  }

  const n = pairs.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;

  for (const p of pairs) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    sumY2 += p.y * p.y;
  }

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
  );

  if (denominator === 0 || isNaN(denominator)) {
    return {
      xLabel,
      yLabel,
      sampleCount: n,
      pearsonR: 0,
      interpretation: "Zero variance detected in one of the variables.",
      status: "ZERO_VARIANCE",
      disclaimer,
    };
  }

  const r = Number((numerator / denominator).toFixed(3));
  let interpretation = "No meaningful association detected.";
  if (r >= 0.6)
    interpretation = `Strong positive association between ${xLabel} and ${yLabel}.`;
  else if (r >= 0.3)
    interpretation = `Moderate positive association between ${xLabel} and ${yLabel}.`;
  else if (r <= -0.6)
    interpretation = `Strong inverse association between ${xLabel} and ${yLabel}.`;
  else if (r <= -0.3)
    interpretation = `Moderate inverse association between ${xLabel} and ${yLabel}.`;

  return {
    xLabel,
    yLabel,
    sampleCount: n,
    pearsonR: r,
    interpretation,
    status: "ADEQUATE",
    disclaimer,
  };
}
