import {
  Keyboard,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface RecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SpeechWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};
type VoiceState =
  | "idle"
  | "initializing"
  | "listening"
  | "processing"
  | "paused"
  | "speaking"
  | "completed"
  | "error";
const bars = Array.from({ length: 15 }, (_, index) => ({
  id: `bar-${index}`,
  height: 12 + (7 - Math.abs(7 - index)) * 5,
}));
/** Browser dictation only. Recognition may use the browser vendor's speech service. */
export function VoiceInput({
  language,
  onTranscript,
  onType,
}: {
  language: string;
  onTranscript: (text: string) => void;
  onType?: () => void;
}) {
  const [state, setState] = useState<VoiceState>("idle");
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const visual = useRef<HTMLDivElement>(null);
  const recognition = useRef<Recognition | null>(null);
  const resources = useRef<{
    stream?: MediaStream;
    audio?: AudioContext;
    frame?: number;
  }>({});
  const mounted = useRef(true);
  const generation = useRef(0);
  const replay = useRef<SpeechSynthesisUtterance | null>(null);
  const stopPlayback = useCallback(() => {
    if (!replay.current) return;
    replay.current.onend = null;
    replay.current.onerror = null;
    window.speechSynthesis.cancel();
    replay.current = null;
  }, []);
  const stopMeter = useCallback(() => {
    const r = resources.current;
    if (r.frame !== undefined) cancelAnimationFrame(r.frame);
    for (const track of r.stream?.getTracks() ?? []) track.stop();
    void r.audio?.close();
    resources.current = {};
    visual.current?.style.setProperty("--voice-level", "0");
  }, []);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      generation.current++;
      recognition.current?.abort();
      stopPlayback();
      stopMeter();
    };
  }, [stopMeter, stopPlayback]);
  async function begin(resume = false) {
    stopPlayback();
    const prefix = resume ? text : "";
    const Speech =
      (window as SpeechWindow).SpeechRecognition ??
      (window as SpeechWindow).webkitSpeechRecognition;
    if (!Speech) {
      setState("error");
      setError(
        "Voice input is unavailable in this browser. Please type your concern below.",
      );
      return;
    }
    setError("");
    setState("initializing");
    const request = ++generation.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current || request !== generation.current) {
        for (const track of stream.getTracks()) track.stop();
        return;
      }
      resources.current.stream = stream;
      try {
        const audio = new AudioContext();
        resources.current.audio = audio;
        const analyser = audio.createAnalyser();
        analyser.fftSize = 256;
        audio.createMediaStreamSource(stream).connect(analyser);
        const values = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(values);
          const level =
            values.reduce((sum, value) => sum + value, 0) / values.length / 128;
          visual.current?.style.setProperty(
            "--voice-level",
            String(Math.min(1, level)),
          );
          resources.current.frame = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        /* Dictation remains available when audio metering is unsupported. */
      }
      const rec = new Speech();
      recognition.current = rec;
      rec.lang = language;
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event) => {
        const current = Array.from(event.results)
          .map((result) => result[0]?.transcript ?? "")
          .join(" ");
        const value = [prefix, current].filter(Boolean).join(" ");
        if (mounted.current) {
          setText(value);
          onTranscript(value);
        }
      };
      rec.onerror = (event) => {
        stopMeter();
        if (mounted.current) {
          setState("error");
          setError(
            event.error === "not-allowed"
              ? "Microphone access was denied. Allow it in browser settings, or type below."
              : "Voice input stopped. Retry or type your concern below.",
          );
        }
      };
      rec.onend = () => {
        stopMeter();
        if (mounted.current)
          setState((s) => (s === "error" || s === "paused" ? s : "completed"));
      };
      rec.start();
      setState("listening");
    } catch {
      stopMeter();
      if (mounted.current) {
        setState("error");
        setError(
          "Microphone unavailable. Check your browser permissions, or type below.",
        );
      }
    }
  }
  const active = state === "listening" || state === "initializing";
  const labels: Record<VoiceState, string> = {
    idle: "Your words. Your language.",
    initializing: "Preparing your microphone…",
    listening: "Listening to you…",
    processing: "Finishing your transcript…",
    paused: "Recording paused",
    speaking: "Playing your transcript…",
    completed: "Transcript ready for your review",
    error: "You can always type instead",
  };
  return (
    <div className={`ayu-voice ayu-voice-${state}`} ref={visual}>
      <div className="ayu-voice-stage">
        <div className="ayu-wave" aria-hidden="true">
          {bars.map((bar) => (
            <span key={bar.id} style={{ height: `${bar.height}px` }} />
          ))}
        </div>
        <button
          type="button"
          className="ayu-voice-orb"
          aria-label={
            state === "speaking"
              ? "Stop playback"
              : active
                ? "Stop voice input"
                : "Start voice input"
          }
          disabled={state === "initializing" || state === "processing"}
          onClick={() => {
            if (state === "speaking") {
              stopPlayback();
              setState("completed");
            } else if (active) {
              setState("processing");
              recognition.current?.stop();
              stopMeter();
            } else void begin();
          }}
        >
          {active ? <Square size={28} /> : <Mic size={34} />}
        </button>
        <div className="ayu-wave ayu-wave-right" aria-hidden="true">
          {bars.map((bar) => (
            <span key={bar.id} style={{ height: `${bar.height}px` }} />
          ))}
        </div>
      </div>
      <strong aria-live="polite">{labels[state]}</strong>
      <p className="ayu-voice-caption">
        Tap to speak. Review and edit your words before continuing.
      </p>
      {text && (
        <div className="ayu-transcript">
          <span>Your words</span>
          <p>{text}</p>
        </div>
      )}
      {error && (
        <p role="alert" className="ayu-voice-error">
          {error}
        </p>
      )}
      <div className="ayu-voice-tools">
        <button
          type="button"
          onClick={
            onType ??
            (() =>
              visual.current
                ?.closest("form")
                ?.querySelector("textarea")
                ?.focus())
          }
        >
          <Keyboard size={14} /> Type instead
        </button>
        {state === "listening" && (
          <button
            type="button"
            onClick={() => {
              setState("paused");
              recognition.current?.stop();
              stopMeter();
            }}
          >
            <Pause size={14} /> Pause
          </button>
        )}
        {state === "paused" && (
          <button type="button" onClick={() => void begin(true)}>
            <Play size={14} /> Resume
          </button>
        )}
        {text && !active && "speechSynthesis" in window && (
          <button
            type="button"
            onClick={() => {
              stopPlayback();
              const utterance = new SpeechSynthesisUtterance(text);
              replay.current = utterance;
              utterance.lang = language;
              utterance.onstart = () => {
                if (mounted.current) setState("speaking");
              };
              utterance.onend = () => {
                replay.current = null;
                if (mounted.current) setState("completed");
              };
              utterance.onerror = () => {
                replay.current = null;
                if (mounted.current) {
                  setState("error");
                  setError(
                    "Playback unavailable. Your transcript is still available to read and edit.",
                  );
                }
              };
              window.speechSynthesis.speak(utterance);
            }}
          >
            <Volume2 size={14} /> Replay
          </button>
        )}
        {state === "completed" && (
          <button
            type="button"
            onClick={() => {
              setText("");
              void begin();
            }}
          >
            <RotateCcw size={14} /> Record again
          </button>
        )}
      </div>
      <small>
        Browser dictation may send audio to your browser’s speech provider. Use
        synthetic information only in this demo.
      </small>
    </div>
  );
}
