import type { Inventory, Prescription, StockPlan } from "../shared/operations";
import { stockPlanSchema } from "../shared/operations";
import { rxToShelf } from "./index";

/** A clinician chooses composition and substitution scope. Among feasible brands,
 * choose the lowest total FEFO course cost; within a brand consume earliest expiry.
 * A mixed-brand FEFO fallback requires the same explicit substitution approval.
 */
export function dispensingPlan(
  prescription: Prescription,
  inventory: Inventory,
  today: string,
): StockPlan {
  const allocation: StockPlan["allocation"] = [],
    issues: StockPlan["issues"] = [];
  for (const line of prescription.lines) {
    if (line.courseEnd < today) {
      issues.push({
        lineId: line.id,
        reason: "Prescription course end has passed; clinician review required",
      });
      continue;
    }
    const equivalent = inventory.batches.filter(
      (batch) =>
        batch.salt.toLowerCase() === line.salt.toLowerCase() &&
        batch.strengthMg === line.strengthMg &&
        batch.form === line.form &&
        (batch.skuId === line.skuId || (line.allowEquivalent && !line.nti)),
    );
    if (equivalent.length > 200) {
      issues.push({
        lineId: line.id,
        reason:
          "Too many candidate batches for automatic allocation; manual review required",
      });
      continue;
    }
    const safety = rxToShelf({
      prescription: {
        salt: line.salt,
        strengthMg: line.strengthMg,
        form: line.form,
        units: line.units,
        courseEnd: line.courseEnd,
      },
      batches: equivalent.map((batch) => ({
        id: batch.id,
        clinic: batch.clinicId,
        salt: batch.salt,
        strengthMg: batch.strengthMg,
        form: batch.form,
        stock: batch.available,
        pricePaise: batch.pricePaise,
        expiry: batch.expiry,
      })),
      allergies: prescription.allergies,
      homeClinic: prescription.clinicId,
      transferPaise: 0,
    });
    if (safety.blocked || !safety.plans.length) {
      issues.push({
        lineId: line.id,
        reason:
          safety.blocked ??
          "Insufficient approved stock valid through course end + 14 days",
      });
      continue;
    }
    const cutoff = new Date(`${line.courseEnd}T00:00:00Z`);
    cutoff.setUTCDate(cutoff.getUTCDate() + 14);
    const eligible = equivalent.filter(
      (batch) =>
        batch.expiry >= cutoff.toISOString().slice(0, 10) &&
        batch.available > 0,
    );
    function fefo(batches: Inventory["batches"]) {
      let remaining = line.units;
      const parts: StockPlan["allocation"] = [];
      for (const batch of [...batches].sort(
        (a, b) =>
          a.expiry.localeCompare(b.expiry) ||
          a.pricePaise - b.pricePaise ||
          a.id.localeCompare(b.id),
      )) {
        const units = Math.min(remaining, batch.available);
        if (!units) continue;
        parts.push({
          lineId: line.id,
          batchId: batch.id,
          brand: batch.brand,
          units,
          unitPricePaise: batch.pricePaise,
          costPaise: units * batch.costPaise,
          expiry: batch.expiry,
        });
        remaining -= units;
      }
      return remaining === 0 ? parts : null;
    }
    const cost = (parts: StockPlan["allocation"]) =>
      parts.reduce((sum, part) => sum + part.units * part.unitPricePaise, 0);
    const options = [...new Set(eligible.map((batch) => batch.skuId))].flatMap(
      (skuId) => {
        const plan = fefo(eligible.filter((batch) => batch.skuId === skuId));
        return plan ? [plan] : [];
      },
    );
    options.sort(
      (a, b) =>
        cost(a) - cost(b) ||
        (a[0]?.batchId ?? "").localeCompare(b[0]?.batchId ?? ""),
    );
    const chosen =
      options[0] ?? (line.allowEquivalent && !line.nti ? fefo(eligible) : null);
    if (chosen) allocation.push(...chosen);
    else
      issues.push({
        lineId: line.id,
        reason: "No complete approved course available",
      });
  }
  return stockPlanSchema.parse({
    prescriptionId: prescription.id,
    complete: issues.length === 0,
    totalPaise: allocation.reduce(
      (sum, part) => sum + part.units * part.unitPricePaise,
      0,
    ),
    allocation,
    issues,
    policy:
      "Course end + 14 days; exact composition; approved brand scope; FEFO within selected brand; local clinic only; human confirmation required",
  });
}
