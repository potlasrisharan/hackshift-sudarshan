import {
  demandInputSchema,
  driftInputSchema,
  planInputSchema,
  sentinelInputSchema,
} from "../shared/contracts";

/** Sparse Bayesian question selection over a synthetic knowledge base.
 * Information gain selects questions. Red-flag evidence can only escalate.
 * Condition weights are illustrative and have NOT been clinically calibrated.
 */
export function sentinel(raw: unknown) {
  const { answers } = sentinelInputSchema.parse(raw);
  const symptoms = [
    "chestPain",
    "breathless",
    "fainting",
    "fever",
    "cough",
    "fatigue",
    "thirst",
  ] as const;
  const conditions = [
    {
      id: "cardiorespiratory-review",
      prior: 0.1,
      likelihood: [0.8, 0.8, 0.5, 0.1, 0.2, 0.5, 0.1],
    },
    {
      id: "infection-review",
      prior: 0.4,
      likelihood: [0.1, 0.2, 0.05, 0.8, 0.8, 0.6, 0.1],
    },
    {
      id: "metabolic-review",
      prior: 0.2,
      likelihood: [0.05, 0.1, 0.1, 0.1, 0.1, 0.6, 0.8],
    },
    {
      id: "uncertain",
      prior: 0.3,
      likelihood: [0.1, 0.1, 0.05, 0.1, 0.2, 0.3, 0.2],
    },
  ];
  const logs = conditions.map(
    (c) =>
      Math.log(c.prior) +
      symptoms.reduce((s, k, i) => {
        const a = answers[k],
          p = c.likelihood[i] ?? 0.5;
        return (
          s + (a === "yes" ? Math.log(p) : a === "no" ? Math.log(1 - p) : 0)
        );
      }, 0),
  );
  const max = Math.max(...logs),
    weights = logs.map((v) => Math.exp(v - max)),
    total = weights.reduce((s, v) => s + v, 0);
  const posterior = weights.map((v) => v / total);
  const entropy = (ps: number[]) =>
    -ps.reduce((s, p) => s + (p > 0 ? p * Math.log2(p) : 0), 0);
  const questions = symptoms
    .filter((k) => answers[k] === undefined)
    .map((k) => {
      const i = symptoms.indexOf(k);
      const yes = posterior.map(
        (p, j) => p * (conditions[j]?.likelihood[i] ?? 0.5),
      );
      const pYes = yes.reduce((s, v) => s + v, 0),
        no = posterior.map(
          (p, j) => p * (1 - (conditions[j]?.likelihood[i] ?? 0.5)),
        );
      return {
        id: k,
        gain:
          entropy(posterior) -
          pYes * entropy(yes.map((p) => p / pYes)) -
          (1 - pYes) * entropy(no.map((p) => p / (1 - pYes))),
      };
    })
    .sort((a, b) => b.gain - a.gain);
  const danger = ["chestPain", "breathless", "fainting"] as const;
  const redFlags = danger.filter((k) => answers[k] === "yes");
  const firstScreen = danger.find((k) => answers[k] === undefined);
  return {
    tier: redFlags.length ? "emergency" : "clinician-review",
    nextQuestion: redFlags.length
      ? null
      : (firstScreen ?? questions[0]?.id ?? null),
    posterior: conditions.map((c, i) => ({
      condition: c.id,
      probability: posterior[i] ?? 0,
    })),
    explanation: {
      redFlags,
      informationGain: questions,
      uncertainty: "Synthetic knowledge base; not diagnostic probabilities.",
      action: redFlags.length
        ? "Seek emergency help now. Do not wait for this app."
        : "A clinician must review symptoms; absence of a red flag does not establish safety.",
    },
  };
}

/** Enumerate up to two clinics; exact min-cost allocation for one equivalent
 * composition with linear unit costs plus fixed transfer cost. No substitution
 * across salt/strength/form. Human pharmacist confirmation is always required.
 */
export function rxToShelf(raw: unknown) {
  const input = planInputSchema.parse(raw),
    p = input.prescription;
  if (input.allergies.some((a) => a.toLowerCase() === p.salt.toLowerCase()))
    return {
      plans: [],
      rejected: [],
      blocked: "Recorded allergy: pharmacist review required",
    };
  const cutoff = new Date(`${p.courseEnd}T00:00:00Z`);
  cutoff.setUTCDate(cutoff.getUTCDate() + 14);
  const date = cutoff.toISOString().slice(0, 10);
  const reasons = input.batches.map((b) => ({
    id: b.id,
    reason:
      b.salt.toLowerCase() !== p.salt.toLowerCase() ||
      b.strengthMg !== p.strengthMg ||
      b.form !== p.form
        ? "Different composition"
        : b.expiry < date
          ? "Expires before course end + 14-day buffer"
          : b.stock === 0
            ? "Out of stock"
            : null,
  }));
  const eligible = input.batches.filter(
    (b) => reasons.find((r) => r.id === b.id)?.reason === null,
  );
  const clinics = [...new Set(eligible.map((b) => b.clinic))];
  const subsets = clinics.flatMap((c, i) => [
    [c],
    ...clinics.slice(i + 1).map((d) => [c, d]),
  ]);
  const plans = subsets.flatMap((s) => {
    const batches = eligible
      .filter((b) => s.includes(b.clinic))
      .sort(
        (a, b) =>
          a.pricePaise - b.pricePaise ||
          a.expiry.localeCompare(b.expiry) ||
          a.id.localeCompare(b.id),
      );
    let remaining = p.units;
    const allocation: {
      batchId: string;
      clinic: string;
      units: number;
      costPaise: number;
    }[] = [];
    for (const b of batches) {
      const units = Math.min(remaining, b.stock);
      if (units > 0)
        allocation.push({
          batchId: b.id,
          clinic: b.clinic,
          units,
          costPaise: units * b.pricePaise,
        });
      remaining -= units;
    }
    if (remaining > 0) return [];
    const used = [...new Set(allocation.map((a) => a.clinic))];
    const costPaise =
      allocation.reduce((v, a) => v + a.costPaise, 0) +
      used.filter((c) => c !== input.homeClinic).length * input.transferPaise;
    return [{ costPaise, clinics: used, allocation }];
  });
  const seen = new Set<string>();
  return {
    plans: plans
      .sort((a, b) => a.costPaise - b.costPaise)
      .filter((p) => {
        const key = JSON.stringify(p.allocation);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 3),
    rejected: reasons.filter((r) => r.reason !== null),
    blocked: null,
    explanation: {
      courseValidUntil: date,
      requiresPharmacistConfirmation: true,
      scope: "Synthetic stock and prices; no live reservation or dispensing",
    },
  };
}

/** Robust baseline CUSUM, not BOCPD: median/MAD resists single outliers.
 * Event-time sorting, duplicate-day averaging and gap reset prevent treating
 * delayed or missing samples as continuous measurements. Not a diagnosis.
 */
export function driftRadar(raw: unknown) {
  const input = driftInputSchema.parse(raw);
  const grouped = new Map<number, number[]>();
  for (const r of input.readings)
    grouped.set(r.day, [...(grouped.get(r.day) ?? []), r.value]);
  const readings = [...grouped]
    .map(([day, vs]) => ({
      day,
      value: vs.reduce((a, b) => a + b, 0) / vs.length,
    }))
    .sort((a, b) => a.day - b.day);
  const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b),
      i = Math.floor(s.length / 2);
    return s.length % 2 ? (s[i] ?? 0) : ((s[i - 1] ?? 0) + (s[i] ?? 0)) / 2;
  };
  const baseline = median(readings.slice(0, 7).map((r) => r.value));
  const sigma = Math.max(
    3,
    1.4826 *
      median(readings.slice(0, 7).map((r) => Math.abs(r.value - baseline))),
  );
  let sum = 0,
    lastDay = readings[0]?.day ?? 0;
  const trace = readings.map((r, i) => {
    if (r.day - lastDay > 3) sum = 0;
    lastDay = r.day;
    if (i >= 7) sum = Math.max(0, sum + (r.value - baseline) / sigma - 0.5);
    return {
      ...r,
      cusum: sum,
      alert: r.value >= 180 || (i >= 7 && sum >= 5),
      absolute: r.value >= 180,
    };
  });
  return {
    baseline,
    sigma,
    trace,
    learning: readings.length < 8,
    alert: trace.some((t) => t.alert),
    explanation: {
      method: "Median/MAD + one-sided CUSUM",
      minimumBaseline: 7,
      threshold: 5,
      missingDays: "No imputation; reset after a gap over three days",
      limitations:
        "Illustrative systolic BP trend, not clinically validated. Emergency symptoms always require immediate help.",
    },
  };
}

/** Exact Poisson-binomial convolution, O(n²) time and O(n) space.
 * One synthetic refill unit per patient; quantities and walk-ins require a
 * compound-demand extension. The service quantile is not a purchase order.
 */
export function threadPulse(raw: unknown) {
  const { probabilities, stock, serviceLevel } = demandInputSchema.parse(raw);
  let pmf = [1];
  for (const p of probabilities) {
    const next = Array<number>(pmf.length + 1).fill(0);
    for (let i = 0; i < pmf.length; i++) {
      next[i] = (next[i] ?? 0) + (pmf[i] ?? 0) * (1 - p);
      next[i + 1] = (next[i + 1] ?? 0) + (pmf[i] ?? 0) * p;
    }
    pmf = next;
  }
  let cumulative = 0,
    target = 0;
  for (let i = 0; i < pmf.length; i++) {
    cumulative += pmf[i] ?? 0;
    if (cumulative >= serviceLevel - 1e-12) {
      target = i;
      break;
    }
  }
  const risk = Math.max(
    0,
    Math.min(
      1,
      pmf.slice(stock + 1).reduce((s, v) => s + v, 0),
    ),
  );
  return {
    pmf,
    target,
    reorderUnits: Math.max(0, target - stock),
    stockoutProbability: risk,
    expectedDemand: probabilities.reduce((s, p) => s + p, 0),
    explanation: {
      serviceLevel,
      assumptions:
        "Independent Bernoulli refills, one unit per patient; illustrative probabilities",
      approval: "Manager approval required; no automatic purchase",
    },
  };
}
