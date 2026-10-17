import { equivalent } from "../../../packages/shared/compare";
import "./style.css";
import "../../../packages/design/landing.css";
import "./design-v2.css";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { z } from "zod";
import {
  brandMarkup,
  designIcon,
  landingMarkup,
} from "../../../packages/design/landing";
import {
  driftRadar,
  rxToShelf,
  sentinel,
  threadPulse,
} from "../../../packages/engine";
import { type Language, languages, words } from "../../../packages/i18n";
import {
  observationSchema,
  patientSchema,
} from "../../../packages/shared/contracts";
import {
  demoPlan,
  demoReadings,
  demoRecord,
} from "../../../packages/shared/demo";
import TextType from "./TextType";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Application root missing");
const app = root;
let token = "",
  page = "today",
  lang: Language = "en-IN",
  consent = true,
  loading = false,
  error = "",
  deleted = false;
let elder = false,
  dark = false,
  caregiver = false;
let record = demoRecord();
let taken = false,
  minutes = 90,
  answer: Record<string, "yes" | "no" | "unsure"> = {};
let audit: unknown = null;
const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
const safe = (s: unknown) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] ?? c,
  );
const nav = [
  { id: "today", key: "today", icon: "home" },
  { id: "thread", key: "thread", icon: "clinical" },
  { id: "medicines", key: "medicines", icon: "operations" },
  { id: "monitor", key: "monitor", icon: "heart" },
  { id: "care", label: "AyuSetu Vitalis", icon: "heart" },
  { id: "women", label: "AyuSetu HER", icon: "heart" },
  { id: "privacy", key: "privacy", icon: "shield" },
  { id: "lab", key: "lab", icon: "intake" },
] as const;
const API_BASE =
  import.meta.env.VITE_API_BASE ??
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? "/api/v1"
    : "https://ayusetu-api.potlasrisharanchowdary.workers.dev/api/v1");

async function api(
  path: string,
  method = "GET",
  data?: unknown,
): Promise<unknown> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(data ? { "Content-Type": "application/json" } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  if (!response.ok) {
    const payload = (await response.json()) as { error?: { message?: string } };
    throw new Error(
      payload.error?.message ?? `Request failed (${response.status})`,
    );
  }
  return response.json() as Promise<unknown>;
}
const recordResponse = z.object({
  patient: patientSchema,
  observations: z.array(observationSchema),
});
async function start() {
  loading = true;
  error = "";
  consent = true;
  try {
    const session = z
      .object({ token: z.string() })
      .parse(await api("/demo/session", "POST"));
    token = session.token;
    await api("/consent", "POST", { granted: true });
    record = recordResponse.parse(await api("/record"));
    deleted = false;
  } catch {
    // Retain local synthetic demo record on network/offline fallback
  } finally {
    loading = false;
    render();
    if (window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }
}
function chart(values: number[], title: string) {
  const low = Math.min(...values) - 5,
    high = Math.max(...values) + 5;
  const points = values
    .map(
      (v, i) =>
        `${35 + (i * 640) / Math.max(1, values.length - 1)},${145 - ((v - low) / (high - low)) * 110}`,
    )
    .join(" ");
  return `<svg viewBox="0 0 710 185" role="img" aria-label="${safe(title)}"><title>${safe(title)}</title><path class="gridline" d="M35 35H690M35 85H690M35 135H690"/><polyline class="chart-line" points="${points}"/><text x="35" y="175">Earlier</text><text x="620" y="175">Latest</text><text x="0" y="40">${Math.round(high)}</text><text x="0" y="140">${Math.round(low)}</text></svg>`;
}
function heading(title: string, description: string) {
  return `<div class="page-title"><div><p class="eyebrow">Your connected care</p><h1>${safe(title)}</h1><p>${safe(description)}</p></div><span class="pill demo">${words[lang].demo}</span></div>`;
}
function today() {
  return `${heading(words[lang].welcome, "A clear view of today, with your care connected.")}
 <section class="welcome-panel"><div><span class="pill">Patient view ${caregiver ? "• Caregiver preview" : ""}</span><h2>Good morning, Sunita.</h2><p>Your next small step is a gentle walk.<br>Your care team stays part of the picture.</p><button data-go="care" class="primary">See your day’s plan <span>↗</span></button><button data-action="listen" class="listen-button">Listen to welcome</button><p id="speech-status" aria-live="polite"></p></div><div class="thread-art" aria-hidden="true"><div class="orbit o1"></div><div class="orbit o2"></div><div class="orbit o3"></div><div class="thread-center">Care<br>continues.</div><span class="thread-dot d1"></span><span class="thread-dot d2"></span></div></section>
 <div class="section-heading"><h2>Today, at a glance</h2><span>Synthetic scenario · Sample daily plan</span></div>
 <div class="stats"><article><span class="stat-icon">✚</span><p>Medicine check-in</p><strong>${taken ? "Recorded" : "Due at 8:30"}</strong><small>${taken ? "In this demo session" : "Illustrative medication schedule"}</small></article><article><span class="stat-icon mint">⌁</span><p>Latest recorded BP</p><strong>${record.observations.at(-1)?.value ?? "—"}<em> mmHg</em></strong><small>Systolic only • demo reading</small></article><article><span class="stat-icon violet">◇</span><p>Record sharing</p><strong>Local demo</strong><small>External clinical AI disabled</small></article></div>
 <div class="two-col"><section class="panel"><div class="section-heading"><h2>Your next steps</h2><span class="pill">2 activities</span></div><div class="task"><div class="task-time">08:30</div><div><h3>Medication check-in</h3><p>Follow your clinician’s prescription.</p></div><button data-action="taken" class="${taken ? "done" : "secondary"}">${taken ? "✓ Recorded" : "Mark taken"}</button></div><div class="task"><div class="task-time">09:00</div><div><h3>A short, comfortable walk</h3><p>Start small, at your own pace.</p></div><button data-go="care" class="text-button">View plan</button></div><p class="caption">Logging is a demo interaction. No alarm or caregiver message is sent.</p></section>
 <section class="panel thread-preview"><div class="section-heading"><h2>One health thread</h2><button data-go="thread" class="text-button">View record</button></div><div class="timeline"><div><span></span><h3>Clinical intake</h3><p>AYUSETU Intake • Kiosk</p></div><div><span></span><h3>Clinic observation</h3><p>AYUSETU ClinicOS • ERP</p></div><div><span></span><h3>At home, connected</h3><p>Monitoring and follow-up demo</p></div></div></section></div>`;
}
function thread() {
  return `${heading(words[lang].thread, "Two source formats, one validated patient record.")}
 <section class="panel"><div class="section-heading"><h2>Sunita’s longitudinal record</h2><button data-action="export" class="primary">Export FHIR</button></div><p class="notice">Synthetic fixtures demonstrate adapters. Live upstream sync and shared sign-in are pending.</p>
 ${record.observations.length ? record.observations.map((o) => `<div class="record-row"><span class="source-dot"></span><div><h3>Systolic blood pressure</h3><p>${safe(o.sampledAt.slice(0, 10))} • ${safe(o.source)} • LOINC ${safe(o.code)}</p></div><strong>${o.value} <small>${safe(o.unit)}</small></strong></div>`).join("") : "<p>No observations. Start a new demo to restore synthetic fixtures.</p>"}
 <button data-action="summary" class="secondary">Create source-linked summary</button><pre id="summary" class="result" aria-live="polite"></pre></section>`;
}
function medicines() {
  const result = rxToShelf(demoPlan()),
    plan = result.plans[0];
  return `${heading(words[lang].medicines, "A prescription connects to course-valid stock across clinics.")}
 <div class="two-col"><section class="panel"><div class="section-heading"><h2>Rx-to-Shelf</h2><span class="pill">Pharmacist review required</span></div><h3>Metformin 500 mg · 60 tablets</h3><p>Illustrative prescription only. No medicine is recommended or dispensed by this demo.</p>
 <div class="price-compare"><div><p>North clinic</p><strong>₹120</strong><small>Valid stock • synthetic price</small></div><div class="selected"><p>East clinic + transfer</p><strong>${money(plan?.costPaise ?? 0)}</strong><small>Lowest feasible plan</small></div></div><div class="saving"><strong>₹56</strong><span>Estimated difference on this synthetic course<br>Not a verified monthly saving</span></div><button data-action="plan" class="primary">Explain allocation</button></section>
 <section class="panel"><h2>Safety before savings</h2><div class="check-row">✓ Same salt, strength and formulation</div><div class="check-row">✓ Stock covers the complete course</div><div class="check-row">✓ Expiry extends 14 days beyond course</div><div class="check-row warning">! North’s cheapest batch rejected: expires too soon</div><div class="check-row warning">! South’s 850 mg batch rejected: wrong strength</div><p class="caption">No live stock, Jan Aushadhi pricing, reservation or generic substitution is claimed.</p></section></div><pre id="allocation" class="result" aria-live="polite"></pre>`;
}
function monitor() {
  const d = driftRadar({ readings: demoReadings });
  return `${heading(words[lang].monitor, "See a change against a personal baseline, with the maths visible.")}
 <section class="panel"><div class="section-heading"><div><h2>Blood pressure over time</h2><p>21 synthetic daily readings • systolic BP</p></div><span class="pill warning">Trend review needed</span></div>${chart(
   demoReadings.map((r) => r.value),
   "Synthetic systolic blood pressure rising from 125 to 145 mmHg",
 )}
 <div class="insight"><span>⌁</span><div><h3>A change from your starting pattern</h3><p>Baseline ${d.baseline} mmHg. A robust CUSUM detects sustained upward drift. This is a demonstration, not clinical validation.</p></div></div><button data-action="ble" class="primary">Add simulated heart-rate reading</button><button data-go="thread" class="secondary">View source record</button><p class="caption">BLE simulator only. Health Connect, HealthKit and real Bluetooth are not connected.</p></section>`;
}
function care() {
  return `${heading("Small steps for long-term wellbeing", "Keep your clinician’s care plan at the centre.")}
 <section class="panel"><h2>Movement what-if</h2><p>Explore progress toward a general activity guideline. This does not predict lifespan or medical risk.</p><label for="minutes">Weekly moderate activity: <strong id="minutes-label">${minutes} minutes</strong></label><input id="minutes" type="range" min="0" max="300" step="10" value="${minutes}"><div class="progress-track"><div class="progress-fill" id="activity-progress"></div></div><p id="activity-label">${Math.round(Math.min(100, (minutes / 150) * 100))}% of the 150-minute lower guideline target</p><p><a href="https://www.who.int/europe/news-room/fact-sheets/item/physical-activity" target="_blank" rel="noreferrer">WHO physical activity guidance</a> • Strong recommendation, moderate certainty evidence.</p><p class="notice">Start at a comfortable level. Ask your clinician about limits with pregnancy, chronic disease, pain or dizziness. Do not alter prescribed treatment.</p></section>
 <div class="two-col"><section class="panel"><h2>Make a little space</h2><h3>Two minutes of comfortable breathing</h3><p>Stay seated and breathe naturally. No breath holding or forceful breathing. Stop if uncomfortable.</p><button data-action="breathe" class="primary">Start a 2-minute timer</button><strong id="timer" class="timer" aria-live="polite"></strong><p class="caption">Relaxation prompt only; not a treatment. Personalised yoga and herb–drug checking are pending.</p></section><section class="panel"><h2>Food that fits everyday life</h2><h3>Seasonal vegetables + dal + rice</h3><p>An illustrative local-food idea, not a diet prescription. Kidney disease, allergies, pregnancy and other conditions need individual advice.</p><span class="pill">₹35 illustrative serving cost</span><p class="caption">Mock price. No live local price source connected.</p></section></div>`;
}
function women() {
  return `${heading("Cycle wellbeing, on your terms", "Sensitive cycle data should stay private by default.")}
 <section class="panel"><span class="pill">Local illustration only</span><h2>Your patterns deserve context.</h2><p>Illustrative cycle lengths: 31, 38, 45, 34 days. Variation alone cannot diagnose PCOS, predict ovulation or confirm fertility.</p>${chart([31, 38, 45, 34], "Synthetic cycle lengths: 31, 38, 45 and 34 days")}<div class="insight"><span>◌</span><div><h3>A conversation starter, never a diagnosis</h3><p>If your cycle pattern concerns you, discuss it with a qualified clinician. Prediction, symptom capture and clinical risk scoring are pending.</p></div></div><p class="notice">Seek urgent care for severe symptoms, very heavy bleeding or fainting. A missed period with possible pregnancy needs appropriate assessment.</p><p>Caregiver preview never exposes additional cycle data. No cycle information is sent to the API.</p></section>`;
}
function privacy() {
  return `${heading(words[lang].privacy, "Know what this demo stores and what remains unconnected.")}
 <div class="two-col"><section class="panel"><span class="privacy-symbol">◇</span><h2>Your sharing, visible.</h2><div class="key-value"><span>Dataset</span><strong>Synthetic only</strong></div><div class="key-value"><span>Session record</span><strong>Server memory, 1 hour</strong></div><div class="key-value"><span>Clinical AI</span><strong>Disabled; welcome speech optional</strong></div><div class="key-value"><span>Local Cognee node</span><strong>Not connected</strong></div><div class="key-value"><span>Network-egress monitor</span><strong>Not implemented</strong></div><p class="caption">Zero configured external AI calls is not proof of zero network egress. This milestone does not accept real health data.</p></section>
 <section class="panel"><h2>You control this session</h2><p>Consent is checked on every record read, export and algorithm request.</p><button data-action="verify" class="primary">Verify audit chain</button><button data-action="revoke" class="secondary">Revoke processing consent</button><button data-action="delete" class="danger-button">Delete demo observations</button><pre id="audit" class="result" aria-live="polite">${audit ? safe(JSON.stringify(audit, null, 2)) : ""}</pre><p class="caption">Audit is tamper-evident in memory, not durable immutable storage. Identity fixture and non-PHI action hashes expire with the session.</p></section></div>`;
}
function lab() {
  const s = sentinel({ answers: answer }),
    pulse = threadPulse({
      probabilities: [0.9, 0.8, 0.7, 0.6, 0.4, 0.3, 0.2, 0.8, 0.9, 0.7],
      stock: 5,
      serviceLevel: 0.95,
    });
  return `${heading(words[lang].lab, "Deterministic algorithms, with uncertainty and limits in view.")}
 <div class="two-col"><section class="panel"><h2>Triage Sentinel</h2><p>Bayesian question selection over an illustrative knowledge base. Always requires clinician review.</p><div class="triage-status ${s.tier === "emergency" ? "emergency" : ""}">${s.tier === "emergency" ? "Seek emergency help now. Do not wait for this app." : `Next screen: ${safe(s.nextQuestion ?? "clinician review")}`}</div><div class="button-row"><button data-action="redflag" class="danger-button">Test chest-pain red flag</button><button data-action="reset-triage" class="secondary">Reset</button></div><p>${safe(s.explanation.action)}</p><details><summary>Show probabilities and information gain</summary><pre>${safe(JSON.stringify(s, null, 2))}</pre></details></section>
 <section class="panel"><h2>ThreadPulse</h2><p>Exact probabilistic demand from ten synthetic refill probabilities.</p><div class="stat-large">${pulse.reorderUnits}<small>additional units suggested</small></div><p>Illustrative stockout probability: ${(pulse.stockoutProbability * 100).toFixed(1)}%</p><p>95% service quantile: ${pulse.target} units. Manager approval required.</p><details><summary>Show demand distribution</summary><pre>${safe(JSON.stringify(pulse, null, 2))}</pre></details></section></div><section class="panel"><h2>Shared engine, local execution</h2><p>This screen runs the same pure TypeScript modules used by the API. It remains usable when the server is offline after the shell has been cached.</p><div class="button-row"><button data-action="server-test" class="primary">Compare with API result</button><button data-go="medicines" class="secondary">Explore Rx-to-Shelf</button><button data-go="monitor" class="secondary">Explore Drift Radar</button></div><pre id="server-result" class="result" aria-live="polite"></pre><p class="caption">Benchmarks are reproducible with make bench. Synthetic results do not establish clinical safety or superiority.</p></section>`;
}
let heroRoot: Root | null = null;

function mountHeroTextType() {
  const container = document.getElementById("hero-typed-target");
  if (!container) return;
  if (!heroRoot) {
    heroRoot = createRoot(container);
  }
  heroRoot.render(
    createElement(TextType, {
      as: "span",
      prefix: "Healthcare,\n",
      text: [
        "finally connected.",
        "deeply human.",
        "from clinic to home.",
        "care without gaps.",
      ],
      textColors: ["#087466", "#087466", "#087466", "#087466"],
      typingSpeed: 75,
      pauseDuration: 1800,
      deletingSpeed: 45,
      deleteMode: "backspace",
      typeEffect: "fade",
      mistakes: 0.1,
      cursorStyle: "bar",
      cursorGlide: true,
      showCursor: true,
      cursorColor: "#087466",
      className: "ds-typed-hero",
    }),
  );
}

function render() {
  const w = words[lang];
  document.documentElement.lang = lang.slice(0, 2);
  document.body.classList.toggle("dark", dark);
  document.body.classList.toggle("elder", elder);
  const currentHash = window.location.hash.slice(1);
  const isPatientPage = nav.some((n) => n.id === currentHash);
  if (!isPatientPage) {
    app.innerHTML = landingMarkup({
      patient: "#today",
      clinician: "/erp.html#/app?view=doctor-consultation",
      emergency: "/erp.html#/app?view=emergency-triage",
      headquarters: "/erp.html#/app?view=admin",
      operations: "/erp.html#/app?view=clinic-admin",
      home: "#",
    });
    heroRoot = null;
    mountHeroTextType();
    return;
  }
  heroRoot = null;
  app.innerHTML = `<a class="skip" href="#main">Skip to content</a><aside class="sidebar"><a href="#" class="brand" title="AyuSetu Home">${brandMarkup}</a><div class="workspace"><span class="avatar">S</span><div><strong>Sunita’s care space</strong><small>Synthetic patient demo</small></div></div><nav aria-label="Main navigation">${nav.map((n) => `<button data-go="${n.id}" class="nav-item ${page === n.id ? "active" : ""}" ${page === n.id ? 'aria-current="page"' : ""}>${designIcon(n.icon)}${"key" in n ? w[n.key] : n.label}</button>`).join("")}</nav><div class="sidebar-bottom"><p>One thread.<br>From clinic to everyday life.</p><span class="pill">Decision support demo</span><button data-action="caregiver" class="text-button">${caregiver ? "Leave caregiver preview" : "Caregiver preview"}</button></div></aside>
 <div class="main-wrap"><header><div class="breadcrumb">My care <span>/</span> ${safe(nav.find((n) => n.id === page)?.id ?? "today")}</div><div class="header-actions"><label class="sr-only" for="language">Language</label><select id="language">${Object.entries(
   languages,
 )
   .map(
     ([key, name]) =>
       `<option value="${key}" ${key === lang ? "selected" : ""}>${name}</option>`,
   )
   .join(
     "",
   )}</select><button data-action="elder" class="icon-button" aria-label="Toggle large text">Aa</button><button data-action="theme" class="icon-button" aria-label="Toggle dark mode">◐</button><span class="avatar small">S</span></div></header>
 <main id="main" tabindex="-1">${!navigator.onLine ? '<div class="status-banner">Offline. The algorithm lab uses local synthetic fixtures; server actions need a connection.</div>' : ""}${error ? `<div class="error" role="alert">${safe(error)} <button data-action="dismiss" class="text-button">Dismiss</button></div>` : ""}${deleted ? '<div class="status-banner">Demo observations deleted. Start a new session to restore the sample record.</div>' : ""}
 ${page === "today" ? today() : page === "thread" ? thread() : page === "medicines" ? medicines() : page === "monitor" ? monitor() : page === "care" ? care() : page === "women" ? women() : page === "privacy" ? privacy() : lab()}
 <footer>Demo data • Decision support, not diagnosis • Keep prescribed treatment unchanged <button data-action="sos" class="text-button">Emergency help</button></footer></main></div>`;
  if (page === "care")
    document
      .getElementById("activity-progress")
      ?.style.setProperty("width", `${Math.min(100, (minutes / 150) * 100)}%`);
}
function show(id: string, value: unknown) {
  const node = document.getElementById(id);
  if (node)
    node.textContent =
      typeof value === "string" ? value : JSON.stringify(value, null, 2);
}
let timer: ReturnType<typeof setInterval> | undefined;
app.addEventListener("click", async (event) => {
  const target = (event.target as Element).closest<HTMLElement>(
    "[data-action],[data-go]",
  );
  if (!target) return;
  if (target.dataset.go) {
    if (timer) clearInterval(timer);
    page = target.dataset.go;
    error = "";
    history.pushState({ page }, "", `#${page}`);
    render();
    return;
  }
  try {
    switch (target.dataset.action) {
      case "start":
        await start();
        break;
      case "dismiss":
        error = "";
        render();
        break;
      case "theme":
        dark = !dark;
        render();
        break;
      case "elder":
        elder = !elder;
        render();
        break;
      case "caregiver":
        caregiver = !caregiver;
        render();
        break;
      case "taken":
        taken = !taken;
        render();
        break;
      case "plan":
        show("allocation", rxToShelf(demoPlan()));
        break;
      case "redflag":
        answer = { chestPain: "yes" };
        render();
        break;
      case "reset-triage":
        answer = {};
        render();
        break;
      case "server-test": {
        const local = sentinel({ answers: answer });
        const remote = await api("/algorithms/sentinel", "POST", {
          answers: answer,
        });
        show("server-result", {
          matches: equivalent(local, remote),
          remote,
        });
        break;
      }
      case "listen": {
        const result = z
          .object({
            source: z.string(),
            text: z.string(),
            audio: z.string().nullable(),
            warning: z.string().nullable(),
          })
          .parse(await api("/lang/welcome", "POST", { language: lang }));
        show(
          "speech-status",
          result.warning ?? `Audio source: ${result.source}`,
        );
        if (result.audio) {
          const bytes = Uint8Array.from(atob(result.audio), (c) =>
            c.charCodeAt(0),
          );
          const url = URL.createObjectURL(
            new Blob([bytes], { type: "audio/wav" }),
          );
          const player = new Audio(url);
          player.onended = () => URL.revokeObjectURL(url);
          player.onerror = () => URL.revokeObjectURL(url);
          await player.play();
        } else if ("speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(result.text);
          utterance.lang = lang;
          speechSynthesis.speak(utterance);
          show(
            "speech-status",
            `${result.warning} Device voice requested; availability depends on your system.`,
          );
        }
        break;
      }
      case "summary":
        show("summary", await api("/summary"));
        break;
      case "verify":
        audit = await api("/audit/verify");
        show("audit", audit);
        break;
      case "revoke":
        await api("/consent", "POST", { granted: false });
        error = "Demo processing consent revoked for this session.";
        render();
        break;
      case "delete":
        await api("/record", "DELETE");
        record.observations = [];
        deleted = true;
        render();
        break;
      case "export": {
        const data = await api("/record/fhir");
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(data, null, 2)], {
            type: "application/fhir+json",
          }),
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "ayusetu-synthetic-record.fhir.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        break;
      }
      case "ble":
        await api("/observations", "POST", {
          id: crypto.randomUUID(),
          code: "8867-4",
          value: 72,
          unit: "/min",
          sampledAt: new Date().toISOString(),
          source: "ble-simulator",
        });
        record = recordResponse.parse(await api("/record"));
        error =
          "Simulated heart-rate reading added. This did not connect to a device.";
        render();
        break;
      case "breathe": {
        if (timer) clearInterval(timer);
        let left = 120;
        show("timer", "2:00");
        timer = setInterval(() => {
          left--;
          show(
            "timer",
            `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`,
          );
          if (left <= 0) {
            clearInterval(timer);
            show("timer", "Session complete");
          }
        }, 1000);
        break;
      }
      case "sos":
        error =
          "If you need urgent medical help, contact local emergency services or seek immediate in-person care. This demo cannot dispatch help, send alerts or share location.";
        render();
        break;
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Action failed";
    render();
  }
});
app.addEventListener("change", (event) => {
  const target = event.target as HTMLSelectElement;
  if (target.id === "language" && target.value in languages) {
    lang = target.value as Language;
    render();
  }
});
app.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  if (target.id === "minutes") {
    minutes = Number(target.value);
    show("minutes-label", `${minutes} minutes`);
    show(
      "activity-label",
      `${Math.round(Math.min(100, (minutes / 150) * 100))}% of the 150-minute lower guideline target`,
    );
    document
      .getElementById("activity-progress")
      ?.style.setProperty("width", `${Math.min(100, (minutes / 150) * 100)}%`);
  }
});
window.addEventListener("offline", render);
window.addEventListener("online", render);
window.addEventListener("popstate", (event) => {
  const p =
    (event.state as { page?: string } | null)?.page ??
    window.location.hash.slice(1);
  if (p && nav.some((n) => n.id === p)) {
    page = p;
    if (!token && !loading) void start();
    else render();
  } else {
    render();
  }
});
window.addEventListener("hashchange", () => {
  const h = window.location.hash.slice(1);
  if (h === "begin") {
    window.location.hash = "#today";
    return;
  }
  if (h && nav.some((n) => n.id === h)) {
    page = h as typeof page;
    if (!token && !loading) void start();
    else render();
  } else {
    render();
  }
});
if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("/sw.js").catch(() => {});
if (window.location.hash === "#begin") {
  window.location.hash = "#today";
}
const initialHash = window.location.hash.slice(1);
if (initialHash && nav.some((n) => n.id === initialHash)) {
  page = initialHash as typeof page;
  void start();
} else {
  render();
}
