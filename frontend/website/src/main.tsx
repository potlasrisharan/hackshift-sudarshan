import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { z } from "zod";
import {
  ApiError,
  integrationClient,
} from "../../../packages/api-client/integration";
import { sentinel } from "../../../packages/engine";
import {
  patientSchema,
  type sentinelInputSchema,
} from "../../../packages/shared/contracts";
import {
  type Encounter,
  intakeSchema,
  type Principal,
} from "../../../packages/shared/integration";
import "./style.css";
import "./design-system/workspace.css";
import {
  ClipboardPlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import {
  ClinicalStatusBadge as Badge,
  MetricCard,
} from "./components/ui/clinical";
import { VoiceInput } from "./components/VoiceInput";
import { WebsiteLanguageSelect } from "./components/WebsiteLanguageSelect";
import { startWebsiteLocalization } from "../../../packages/i18n/website";

type Client = ReturnType<typeof integrationClient>;
const questions = [
  ["chestPain", "Chest pain"],
  ["breathless", "Difficulty breathing"],
  ["fainting", "Fainting"],
  ["fever", "Fever"],
  ["cough", "Cough"],
  ["fatigue", "Fatigue"],
  ["thirst", "Increased thirst"],
] as const;
type Answers = z.infer<typeof sentinelInputSchema>["answers"];
function message(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Request failed. Please try again.";
}
function useRoute() {
  const [route, setRoute] = useState(
    window.location.hash.slice(1) || "/clinician",
  );
  useEffect(() => {
    const update = () =>
      setRoute(window.location.hash.slice(1) || "/clinician");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return route;
}
function Login({
  onLogin,
}: {
  onLogin: (token: string, principal: Principal) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget);
    try {
      const session = await integrationClient().login({
        orgId: String(data.get("organization")),
        email: String(data.get("email")),
        password: String(data.get("password")),
      });
      onLogin(session.token, session.principal);
    } catch (error) {
      setError(message(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-page">
      <WebsiteLanguageSelect />
      <section className="login-story">
        <div className="wordmark">
          <img
            src="/assets/ayusetu_logo.png"
            alt="AyuSetu Healthcare"
            style={{ height: "48px", width: "auto", objectFit: "contain" }}
          />
        </div>
        <div>
          <p className="eyebrow">CARE THAT STAYS CONNECTED</p>
          <h1>
            From the first
            <br />
            hello to a<br />
            <em>healthier tomorrow.</em>
          </h1>
          <p className="story-description">
            From the first conversation to the clinician's desk. A shared
            workspace for care teams and the people they care for.
          </p>
        </div>
        <a className="story-foot" href="/erp.html">
          Explore AyuSetu and all workspaces →
        </a>
      </section>
      <main className="login-panel">
        <div className="login-card">
          <Badge>AYUSETU WORKSPACE</Badge>
          <h2>Welcome to your care workspace</h2>
          <p className="muted">Sign in with your clinic account to continue.</p>
          <form onSubmit={submit}>
            <label>
              Organization
              <input
                name="organization"
                defaultValue="demo"
                required
                autoComplete="organization"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                defaultValue="doctor@demo.test"
                required
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className="primary">
              {busy ? "Signing in…" : "Sign in to workspace →"}
            </button>
          </form>
          <details>
            <summary>Local demo sign-in</summary>
            <p>
              Organization: <code>demo</code>
              <br />
              Doctor: <code>doctor@demo.test</code>
              <br />
              Nurse: <code>nurse@demo.test</code>
              <br />
              Password: <code>Dhaaga-demo-2026!</code>
            </p>
            <p>
              AyuSetu encrypted healthcare workspace.
            </p>
          </details>
        </div>
      </main>
    </div>
  );
}
function Intake({
  api,
  onCreated,
}: {
  api: Client;
  onCreated: (encounter: Encounter) => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [complaint, setComplaint] = useState("");
  const [language, setLanguage] = useState("en-IN");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const request = useRef({ body: "", key: "" });
  const result = sentinel({ answers });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const input = intakeSchema.parse({
        patient: {
          name: data.get("name"),
          gender: data.get("gender"),
          birthDate: data.get("birthDate"),
          language: data.get("language"),
        },
        chiefComplaint: data.get("complaint"),
        answers,
        careConsent: data.get("consent") === "on",
        synthetic: true,
      });
      const body = JSON.stringify(input);
      if (request.current.body !== body)
        request.current = { body, key: crypto.randomUUID() };
      setBusy(true);
      onCreated(await api.intake(input, request.current.key));
    } catch (error) {
      setError(
        error instanceof z.ZodError
          ? "Check the patient details and confirm care consent before submitting."
          : message(error),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">AYUSETU KIOSK → CARE TEAM</p>
          <h1>Start with a conversation.</h1>
          <p className="muted">
            Capture a consented intake. The clinician receives the same
            encounter.
          </p>
        </div>
        <Badge>STAFF-ASSISTED INTAKE</Badge>
      </div>
      <form className="intake-layout" onSubmit={submit}>
        <section className="panel">
          <div className="section-title">
            <span className="step">01</span>
            <div>
              <h2>Patient & visit</h2>
              <p className="muted">
                Enter patient registration details for intake.
              </p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Patient name
              <input
                name="name"
                placeholder="e.g. Patient Full Name"
                required
                maxLength={120}
              />
            </label>
            <label>
              Confirmed date of birth
              <input
                type="date"
                name="birthDate"
                max={new Date().toISOString().slice(0, 10)}
                required
              />
            </label>
            <label>
              Gender
              <select name="gender">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="unknown">Unknown</option>
              </select>
            </label>
            <label>
              Preferred language
              <select
                name="language"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {patientSchema.shape.language.options.map((language) => (
                  <option key={language} value={language}>
                    {
                      {
                        "en-IN": "English",
                        "hi-IN": "Hindi",
                        "pa-IN": "Punjabi",
                        "ta-IN": "Tamil",
                        "te-IN": "Telugu",
                      }[language]
                    }
                  </option>
                ))}
              </select>
            </label>
          </div>
          <VoiceInput language={language} onTranscript={setComplaint} />
          <label>
            What brings the patient in today?
            <textarea
              name="complaint"
              value={complaint}
              onChange={(event) => setComplaint(event.target.value)}
              required
              minLength={3}
              maxLength={2000}
              rows={4}
              placeholder="Record the patient's own words. This is a source statement, not a diagnosis."
            />
          </label>
          <div className="source-note">
            Language preference is saved. Browser dictation transcribes your
            words; clinical translation is not connected.
          </div>
        </section>
        <section className="panel">
          <div className="section-title">
            <span className="step">02</span>
            <div>
              <h2>Safety screen</h2>
              <p className="muted">
                Deterministic checks · clinician review required
              </p>
            </div>
          </div>
          <div className="questions">
            {questions.map(([key, label], index) => (
              <label key={key} className="question">
                <span>
                  {label}
                  {index < 3 && <small> Red-flag screen</small>}
                </span>
                <select
                  aria-label={label}
                  required={index < 3}
                  value={answers[key] ?? ""}
                  onChange={(event) =>
                    setAnswers({
                      ...answers,
                      [key]: z
                        .enum(["yes", "no", "unsure"])
                        .parse(event.target.value),
                    })
                  }
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  <option value="unsure">Unsure</option>
                </select>
              </label>
            ))}
          </div>
          {result.tier === "emergency" ? (
            <div role="alert" className="emergency">
              <strong>Emergency escalation</strong>
              <p>
                Seek emergency help now. Do not wait for this app. The care team
                will see this as an emergency encounter.
              </p>
            </div>
          ) : (
            <div className="source-note">
              No diagnosis is generated. A negative screen does not establish
              safety.
            </div>
          )}
        </section>
        <section className="panel consent-panel">
          <label className="checkbox">
            <input type="checkbox" name="consent" required />
            <span>
              I confirm the patient's consent to care processing and that all
              entered details are verified.
            </span>
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="primary" disabled={busy}>
            {busy ? "Sending to care team…" : "Send intake to clinician →"}
          </button>
        </section>
      </form>
    </>
  );
}
function Clinician({
  api,
  principal,
  detailId,
}: {
  api: Client;
  principal: Principal;
  detailId?: string;
}) {
  const [rows, setRows] = useState<Encounter[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const visibleRows = rows.filter(
    (row) =>
      (statusFilter === "all" || row.status === statusFilter) &&
      `${row.patientName} ${row.chiefComplaint} ${row.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [active, setActive] = useState<Encounter | null>(null);
  const refresh = useCallback(
    async (current: () => boolean = () => true) => {
      try {
        const [data, detail] = await Promise.all([
          api.encounters(),
          detailId
            ? api.encounter(detailId).catch((error: unknown) => {
                if (error instanceof ApiError && error.status === 404)
                  return null;
                throw error;
              })
            : Promise.resolve(null),
        ]);
        if (current()) {
          setRows(data.encounters);
          setActive(detail);
          setError("");
        }
      } catch (error) {
        if (current()) {
          setRows([]);
          setActive(null);
          setError(message(error));
        }
      } finally {
        if (current()) setLoading(false);
      }
    },
    [api, detailId],
  );
  useEffect(() => {
    let current = true;
    void refresh(() => current);
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh(() => current);
    }, 5000);
    return () => {
      current = false;
      clearInterval(interval);
    };
  }, [refresh]);
  async function action(kind: "review" | "revoke") {
    if (!active) return;
    setBusy(true);
    setActionError("");
    try {
      if (kind === "review") await api.review(active.id, note);
      else {
        await api.revoke(active.id);
        window.location.hash = "/clinician";
      }
      await refresh();
    } catch (error) {
      setActionError(message(error));
      await refresh();
    } finally {
      setBusy(false);
    }
  }
  const waiting = rows.filter((row) => row.status === "waiting").length,
    emergency = rows.filter((row) => row.status === "emergency").length;
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CLINICAL WORKSPACE</p>
          <h1>
            {detailId ? "The patient thread." : "Every handoff, in view."}
          </h1>
          <p className="muted">
            {principal.clinicId === "north" ? "North Clinic" : "East Clinic"} ·
            Intake and clinician review on one record
          </p>
        </div>
        <a className="primary link-button" href="#/kiosk">
          + New intake
        </a>
      </div>
      <div className="stats">
        <MetricCard
          label="Awaiting review"
          value={waiting.toString().padStart(2, "0")}
          detail="Consented encounters"
        />
        <MetricCard
          label="Emergency escalation"
          value={emergency.toString().padStart(2, "0")}
          detail="Requires immediate staff attention"
          critical={emergency > 0}
        />
        <MetricCard
          label="Patient threads"
          value={rows.length.toString().padStart(2, "0")}
          detail="Latest 100 consented records · persisted locally"
        />
      </div>
      {error && (
        <div role="alert" className="error">
          {error}{" "}
          <button onClick={() => void refresh()} type="button">
            Retry
          </button>
        </div>
      )}
      {loading ? (
        <section className="panel" aria-busy="true">
          Loading clinic queue…
        </section>
      ) : detailId ? (
        active ? (
          <section className="panel encounter-detail">
            <div className="detail-heading">
              <div>
                <a href="#/clinician" className="back-link">
                  ← Back to clinic queue
                </a>
                <h2>{active.patientName}</h2>
                <p className="muted">
                  Encounter {active.id} · {active.language}
                </p>
              </div>
              <Badge danger={active.status === "emergency"}>
                {active.status}
              </Badge>
            </div>
            <div className="source-block">
              <span className="eyebrow">
                PATIENT'S REPORTED CONCERN · INTAKE SOURCE
              </span>
              <p>{active.chiefComplaint}</p>
            </div>
            <h3>Recorded safety answers</h3>
            <dl className="answer-grid">
              {questions.map(([key, label]) => (
                <div key={key}>
                  <dt>{label}</dt>
                  <dd>{active.answers[key] ?? "Not recorded"}</dd>
                </div>
              ))}
            </dl>
            {active.status === "emergency" && (
              <div role="alert" className="emergency">
                <strong>Emergency pathway remains active</strong>
                <p>
                  Seek emergency help now. Routine review cannot downgrade this
                  encounter.
                </p>
              </div>
            )}
            {active.status === "reviewed" ? (
              <div className="source-block">
                <span className="eyebrow">
                  CLINICIAN REVIEW · {active.reviewedBy}
                </span>
                <p>{active.reviewNote}</p>
                <small>
                  {active.reviewedAt &&
                    new Date(active.reviewedAt).toLocaleString()}
                </small>
              </div>
            ) : active.status === "waiting" && principal.role === "DOCTOR" ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void action("review");
                }}
              >
                <label>
                  Clinician review note
                  <textarea
                    required
                    minLength={3}
                    maxLength={4000}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={4}
                    placeholder="Record your review. Prescription signing is a later milestone."
                  />
                </label>
                <button type="submit" className="primary" disabled={busy}>
                  {busy ? "Saving…" : "Save clinician review"}
                </button>
              </form>
            ) : active.status === "waiting" ? (
              <p className="muted">
                Only a doctor can submit a routine clinician review.
              </p>
            ) : null}
            {actionError && (
              <p role="alert" className="error">
                {actionError}
              </p>
            )}
            <details className="consent-controls">
              <summary>Consent & record access</summary>
              <p>
                Revocation removes this encounter from care views for all clinic
                staff.
              </p>
              <button
                type="button"
                className="outline-danger"
                onClick={() => void action("revoke")}
                disabled={busy}
              >
                Record withdrawal of care consent
              </button>
            </details>
          </section>
        ) : (
          <section className="panel">
            <h2>Encounter unavailable</h2>
            <p>
              It may be outside your clinic or its care consent was revoked.
            </p>
            <a href="#/clinician">Back to queue</a>
          </section>
        )
      ) : (
        <section className="panel queue-panel">
          <div className="panel-heading">
            <div>
              <h2>Clinic queue</h2>
              <p className="muted">
                Updates every 5 seconds · emergency encounters first
              </p>
            </div>
            <button
              className="secondary"
              onClick={() => void refresh()}
              type="button"
            >
              ↻ Refresh
            </button>
          </div>
          <div className="ayu-queue-toolbar">
            <label className="ayu-search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search clinic queue</span>
              <input
                placeholder="Search patients, concerns or encounter…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <label className="sr-only" htmlFor="queue-status">
              Filter queue status
            </label>
            <select
              id="queue-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All encounters</option>
              <option value="waiting">Awaiting review</option>
              <option value="emergency">Emergency</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
          {visibleRows.length === 0 ? (
            <div className="empty">
              <div className="empty-mark">↗</div>
              <h3>
                {rows.length
                  ? "No matching encounters"
                  : "Your next handoff starts here."}
              </h3>
              <p>
                {rows.length
                  ? "Try a different patient name or status filter."
                  : "No active consented encounters in this clinic yet."}
              </p>
              <a href="#/kiosk" className="back-link">
                Create the first intake →
              </a>
            </div>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Reported concern</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th>
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.patientName}</strong>
                        <small>
                          {row.language} · {row.id.slice(0, 8)}
                        </small>
                      </td>
                      <td>{row.chiefComplaint}</td>
                      <td>
                        <Badge danger={row.status === "emergency"}>
                          {row.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(row.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        <a className="back-link" href={`#/thread/${row.id}`}>
                          Open thread →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      <div className="integration-note">
        <span className="small-symbol">↔</span>
        <p>
          <strong>A connected foundation.</strong> Intake and clinician review
          share a persistent record. Browser dictation is available. Pharmacy,
          ledger and Flutter connectivity remain in the integration backlog.
        </p>
        <Badge>AYUSETU CLINICAL WORKSPACE</Badge>
      </div>
    </>
  );
}
function App() {
  const [session, setSession] = useState<{
    token: string;
    principal: Principal;
  } | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [navOpen, setNavOpen] = useState(false);

  const [error, setError] = useState("");
  const route = useRoute();
  const [api, setApi] = useState<Client>(() => integrationClient());
  useEffect(() => startWebsiteLocalization(), []);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!session)
    return (
      <Login
        onLogin={(token, principal) => {
          setSession({ token, principal });
          setApi(integrationClient(token));
          setError("");
        }}
      />
    );
  async function logout() {
    try {
      await api.logout();
      setSession(null);
      setApi(integrationClient());
    } catch (error) {
      setError(message(error));
    }
  }
  const isKiosk = route === "/kiosk";
  const detailId = route.startsWith("/thread/") ? route.slice(8) : undefined;
  return (
    <div className={`workspace ${navOpen ? "nav-open" : ""}`}>
      <WebsiteLanguageSelect />
      <aside className="sidebar">
        <a href="#/clinician" className="wordmark">
          <img
            src="/assets/ayusetu_logo.png"
            alt="AyuSetu Healthcare"
            style={{ height: "32px", width: "auto", objectFit: "contain" }}
          />
        </a>
        <div className="clinic-label">
          <span className="clinic-avatar">
            {session.principal.clinicId.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <strong>
              {session.principal.clinicId === "north"
                ? "North Clinic"
                : "East Clinic"}
            </strong>
            <small>{session.principal.orgId} · care network</small>
          </div>
          <span>⌄</span>
        </div>
        <span className="nav-caption">CARE WORKSPACE</span>
        <nav aria-label="Care workspace">
          <a href="#/clinician" className={!isKiosk ? "active" : ""}>
            <LayoutDashboard size={18} aria-hidden="true" /> Clinician queue
          </a>
          <a href="#/kiosk" className={isKiosk ? "active" : ""}>
            <ClipboardPlus size={18} aria-hidden="true" /> Patient intake
          </a>
        </nav>
        <div className="next-modules">
          <span className="nav-caption">NEXT IN THE INTEGRATION</span>
          <p>
            Inventory & pharmacy <small>Planned</small>
          </p>
          <p>
            Accounts & procurement <small>Planned</small>
          </p>
          <p>
            Home monitoring <small>Planned</small>
          </p>
        </div>
        <div className="sidebar-bottom">
          <span className="avatar">
            {session.principal.role === "DOCTOR" ? "Dr" : "CT"}
          </span>
          <div>
            <strong>{session.principal.userId}</strong>
            <small>{session.principal.role.replace(/_/g, " ")}</small>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(!navOpen)}
          >
            <Menu size={20} />
          </button>
          <span>
            Workspace{" "}
            <span className="breadcrumb">
              / {isKiosk ? "Patient intake" : "Clinical care"}
            </span>
          </span>
          <div>
            <span className={`status-dot ${online ? "" : "offline"}`} />
            {online ? "Local workspace" : "Offline · changes cannot sync"}
            <span className="topbar-divider" />
            Active workspace
          </div>
        </header>
        <main className="main-content">
          {!online && (
            <p role="status" className="error">
              You are offline. Server actions will show errors; no fabricated
              records are substituted.
            </p>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {session.principal.role === "CASHIER" ? (
            <section className="panel">
              <h1>Clinical access restricted</h1>
              <p>
                Your cashier role cannot read clinical encounters. Pharmacy
                integration is planned.
              </p>
            </section>
          ) : isKiosk ? (
            <Intake
              api={api}
              onCreated={(encounter) => {
                window.location.hash = `/thread/${encounter.id}`;
              }}
            />
          ) : (
            <Clinician
              key={detailId ?? "queue"}
              api={api}
              principal={session.principal}
              detailId={detailId}
            />
          )}
        </main>
        <footer>
          AyuSetu · One thread from intake to ongoing care.
          <span className="footer-model-note">
            Clinical model: illustrative · clinician review required
          </span>
        </footer>
      </div>
    </div>
  );
}
const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);
