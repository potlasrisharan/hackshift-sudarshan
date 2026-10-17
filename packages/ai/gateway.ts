/** External AI is deliberately disabled in this milestone. Regex redaction is
 * defense in depth, NOT a guarantee of de-identification. Never send arbitrary
 * clinical free text through a provider based only on this helper.
 */
export function redact(text: string, names: string[] = []) {
  let result = text;
  for (const name of names.filter(Boolean))
    result = result.replaceAll(name, "[NAME]");
  return result
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[EMAIL]")
    .replace(/\b\d[\d\s-]{8,}\d\b/g, "[IDENTIFIER]");
}
export function sourceSummary(sources: { id: string; text: string }[]) {
  return {
    provider: "local-template",
    externalCalls: 0,
    lines: sources.map((s) => ({ text: s.text, citations: [s.id] })),
    requiresClinicianReview: true,
  };
}
