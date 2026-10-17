/** JS engines can differ in last bits for transcendental functions.
 * Compare JSON structures exactly, allowing only 1e-10 absolute numeric error.
 */
export function equivalent(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number")
    return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-10;
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b))
    return a.length === b.length && a.every((v, i) => equivalent(v, b[i]));
  if (a && b && typeof a === "object" && typeof b === "object") {
    const left = a as Record<string, unknown>,
      right = b as Record<string, unknown>;
    const keys = Object.keys(left);
    return (
      keys.length === Object.keys(right).length &&
      keys.every(
        (k) => Object.hasOwn(right, k) && equivalent(left[k], right[k]),
      )
    );
  }
  return false;
}
