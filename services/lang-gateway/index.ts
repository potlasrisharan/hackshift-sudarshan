import { z } from "zod";
import { words } from "../../packages/i18n";
export const speechInput = z.object({
  language: z.enum(["en-IN", "hi-IN", "ta-IN", "te-IN"]),
});
const responseSchema = z.object({
  audios: z
    .array(
      z
        .string()
        .regex(/^[A-Za-z0-9+/=]+$/)
        .max(3000000),
    )
    .min(1)
    .max(4),
});
type Result = {
  source: "sarvam" | "cache" | "fallback";
  text: string;
  audio: string | null;
  warning: string | null;
};
/** Only static nonclinical welcome text can cross this boundary. No arbitrary
 * text/audio, identifiers, records, dosages or prompts are accepted.
 */
export function speechGateway(
  options: {
    key?: string;
    enabled?: boolean;
    transport?: typeof fetch;
    maxCalls?: number;
  } = {},
) {
  const cache = new Map<string, Result>();
  let calls = 0,
    failures = 0,
    openUntil = 0;
  const transport = options.transport ?? fetch;
  const fallback = (text: string, warning: string): Result => ({
    source: "fallback",
    text,
    audio: null,
    warning,
  });
  return {
    stats: () => ({
      requests: calls,
      configured: !!options.enabled && !!options.key,
      circuitOpen: Date.now() < openUntil,
    }),
    async welcome(raw: unknown): Promise<Result> {
      const { language } = speechInput.parse(raw);
      const text = words[language].welcome;
      const cached = cache.get(language);
      if (cached) return { ...cached, source: "cache" };
      if (!options.enabled || !options.key)
        return fallback(
          text,
          "Sarvam is not configured. Read the text or use an available device voice.",
        );
      if (Date.now() < openUntil)
        return fallback(
          text,
          "Speech provider temporarily unavailable; text remains available.",
        );
      for (let attempt = 0; attempt < 2; attempt++) {
        if (calls >= (options.maxCalls ?? 20))
          return fallback(
            text,
            "Local demo speech budget exhausted. Text remains available.",
          );
        calls++;
        try {
          const response = await transport(
            "https://api.sarvam.ai/text-to-speech",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "api-subscription-key": options.key,
              },
              body: JSON.stringify({
                text,
                language_code: language,
                model: "bulbul:v3",
                speaker: "shubh",
                output_audio_codec: "wav",
              }),
              signal: AbortSignal.timeout(8000),
            },
          );
          if (!response.ok) {
            if (response.status === 401 || response.status === 403)
              return fallback(
                text,
                "Speech credentials rejected; configure the provider server-side.",
              );
            throw new Error("Speech provider unavailable");
          }
          const value = responseSchema.parse(await response.json());
          const result: Result = {
            source: "sarvam",
            text,
            audio: value.audios[0] ?? null,
            warning:
              "Machine-generated nonclinical welcome audio. Clinical translation is not enabled.",
          };
          failures = 0;
          cache.set(language, result);
          return result;
        } catch {
          failures++;
          if (failures >= 3) {
            openUntil = Date.now() + 60000;
            break;
          }
          if (attempt === 0)
            await new Promise((resolve) =>
              setTimeout(resolve, 100 + Math.random() * 100),
            );
        }
      }
      return fallback(text, "Speech request failed; text remains available.");
    },
  };
}
