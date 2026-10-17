import { z } from "zod";

export const paiseSchema = z.number().int().min(0).max(100000000000);
const id = z.string().min(1).max(100);
export const skuSchema = z.object({
  id,
  brand: z.string(),
  salt: z.string(),
  strengthMg: z.number().int().positive(),
  form: z.enum(["tablet", "capsule"]),
  nti: z.boolean(),
  scheduleH: z.boolean(),
  gstBps: z.number().int().min(0).max(10000),
});
export const catalogSchema = z.object({ items: z.array(skuSchema) });
export const signPrescriptionSchema = z
  .object({
    encounterId: z.uuid(),
    note: z.string().trim().min(3).max(4000),
    allergiesReviewed: z.literal(true),
    pharmacyConsentConfirmed: z.literal(true),
    allergies: z.array(z.string().trim().min(1).max(100)).max(30),
    lines: z
      .array(
        z
          .object({
            skuId: id,
            units: z.number().int().min(1).max(1000),
            courseEnd: z.iso.date(),
            directions: z.string().trim().min(3).max(1000),
            allowEquivalent: z.boolean(),
          })
          .strict(),
      )
      .min(1)
      .max(20),
  })
  .strict();
export const prescriptionLineSchema = z.object({
  id: z.uuid(),
  skuId: id,
  brand: z.string(),
  salt: z.string(),
  strengthMg: z.number().int(),
  form: z.enum(["tablet", "capsule"]),
  units: z.number().int(),
  courseEnd: z.iso.date(),
  directions: z.string(),
  allowEquivalent: z.boolean(),
  nti: z.boolean(),
  scheduleH: z.boolean(),
});
export const prescriptionSchema = z.object({
  id: z.uuid(),
  encounterId: z.uuid(),
  patientId: z.uuid(),
  patientName: z.string(),
  clinicId: id,
  signedBy: id,
  signedAt: z.iso.datetime(),
  signatureHash: z.string(),
  note: z.string(),
  allergies: z.array(z.string()),
  lines: z.array(prescriptionLineSchema),
  reservationId: z.uuid().nullable(),
  reservationExpiresAt: z.iso.datetime().nullable(),
  saleId: z.uuid().nullable(),
});
export type Prescription = z.infer<typeof prescriptionSchema>;
export const prescriptionsSchema = z.object({
  prescriptions: z.array(prescriptionSchema),
});
export const inventorySchema = z.object({
  batches: z.array(
    z.object({
      id,
      skuId: id,
      brand: z.string(),
      salt: z.string(),
      strengthMg: z.number().int(),
      form: z.enum(["tablet", "capsule"]),
      clinicId: id,
      batchNo: z.string(),
      expiry: z.iso.date(),
      quantity: z.number().int().nonnegative(),
      reserved: z.number().int().nonnegative(),
      available: z.number().int().nonnegative(),
      pricePaise: paiseSchema,
      costPaise: paiseSchema,
    }),
  ),
});
export type Inventory = z.infer<typeof inventorySchema>;
export const allocationSchema = z.object({
  lineId: z.uuid(),
  batchId: id,
  brand: z.string(),
  units: z.number().int().positive(),
  unitPricePaise: paiseSchema,
  costPaise: paiseSchema,
  expiry: z.iso.date(),
});
export const stockPlanSchema = z.object({
  prescriptionId: z.uuid(),
  complete: z.boolean(),
  totalPaise: paiseSchema,
  allocation: z.array(allocationSchema),
  issues: z.array(z.object({ lineId: z.uuid(), reason: z.string() })),
  policy: z.string(),
});
export type StockPlan = z.infer<typeof stockPlanSchema>;
export const reserveSchema = z
  .object({
    prescriptionId: z.uuid(),
    pharmacistConfirmed: z.literal(true),
    expectedTotalPaise: paiseSchema,
  })
  .strict();
export const reservationSchema = z.object({
  id: z.uuid(),
  prescriptionId: z.uuid(),
  expiresAt: z.iso.datetime(),
  totalPaise: paiseSchema,
  status: z.enum(["held", "released", "dispensed"]),
});
export const checkoutSchema = z
  .object({
    reservationId: z.uuid(),
    pharmacistConfirmed: z.literal(true),
    payments: z
      .array(
        z
          .object({
            method: z.enum(["cash", "upi", "card", "credit"]),
            amountPaise: paiseSchema,
          })
          .strict(),
      )
      .min(1)
      .max(4),
    taxMode: z.enum(["intra", "inter"]),
  })
  .strict();
export const invoiceSchema = z.object({
  id: z.uuid(),
  prescriptionId: z.uuid(),
  encounterId: z.uuid(),
  patientName: z.string(),
  createdAt: z.iso.datetime(),
  totalPaise: paiseSchema,
  netPaise: paiseSchema,
  taxPaise: paiseSchema,
  cgstPaise: paiseSchema,
  sgstPaise: paiseSchema,
  igstPaise: paiseSchema,
  costPaise: paiseSchema,
  paymentStatus: z.literal("simulated"),
  payments: z.array(z.object({ method: z.string(), amountPaise: paiseSchema })),
  lines: z.array(
    z.object({
      brand: z.string(),
      salt: z.string(),
      strengthMg: z.number().int(),
      batchNo: z.string(),
      expiry: z.iso.date(),
      units: z.number().int(),
      unitPricePaise: paiseSchema,
      grossPaise: paiseSchema,
    }),
  ),
});
export type Invoice = z.infer<typeof invoiceSchema>;
export const ledgerSchema = z.object({
  revenuePaise: paiseSchema,
  cogsPaise: paiseSchema,
  taxPayablePaise: paiseSchema,
  profitPaise: z.number().int(),
  debitPaise: paiseSchema,
  creditPaise: paiseSchema,
  balanced: z.boolean(),
  lockDate: z.iso.date().nullable(),
  journals: z.array(
    z.object({
      id: z.uuid(),
      referenceId: z.uuid(),
      date: z.iso.date(),
      debitPaise: paiseSchema,
      creditPaise: paiseSchema,
    }),
  ),
});
export type Ledger = z.infer<typeof ledgerSchema>;
export const lockPeriodSchema = z.object({ lockDate: z.iso.date() }).strict();

/** Integer half-up division; used only with nonnegative paise operands. */
export function roundDivide(numerator: bigint, denominator: bigint): number {
  if (numerator < 0n || denominator <= 0n)
    throw new Error("Invalid monetary operands");
  const result = Number((numerator + denominator / 2n) / denominator);
  if (!Number.isSafeInteger(result))
    throw new Error("Money exceeds safe integer range");
  return result;
}
