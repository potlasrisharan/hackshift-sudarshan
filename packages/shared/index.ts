export * from "./contracts";
export * from "./integration";

/** Display only; domain calculations remain integer paise. */
export function formatPaiseToRupees(paise: number): string {
  if (!Number.isSafeInteger(paise)) throw new Error("Expected integer paise");
  const sign = paise < 0 ? "-" : "";
  const value = Math.abs(paise);
  return `${sign}₹${Math.floor(value / 100).toLocaleString("en-IN")}.${String(value % 100).padStart(2, "0")}`;
}
