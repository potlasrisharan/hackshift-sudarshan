import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  type Encounter,
  encounterSchema,
  loginResponseSchema,
} from "../../../../../packages/shared/integration";
import { call, cbcApi, type DoctorSession, sessionKey } from "./api";

export function DoctorCbcAccess({
  onConnect,
}: {
  onConnect: (session: DoctorSession | null, encounters: Encounter[]) => void;
}) {
  const [session, setSession] = useState<DoctorSession | null>(null);
  const [available, setAvailable] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const generation = useRef(0);
  const mounted = useRef(true);
  useEffect(() => {
    let live = true;
    mounted.current = true;
    const restoreGeneration = generation.current;
    const expire = () => {
      generation.current++;
      sessionStorage.removeItem(sessionKey);
      setSession(null);
      onConnect(null, []);
      setMessage("Clinical session ended. Connect again.");
    };
    window.addEventListener("cbc-session-expired", expire);
    // The legacy shell uses these events on sign-out; never retain CBC access across it.
    const authChange = (event: Event) => {
      const detail: unknown =
        event instanceof CustomEvent ? event.detail : null;
      if (z.object({ session: z.null() }).safeParse(detail).success) expire();
    };
    window.addEventListener("cf_auth_change", authChange);
    window.addEventListener("ayusetu_demo_logout", expire);
    void (async () => {
      try {
        const caps = await cbcApi.capabilities();
        if (!live) return;
        setAvailable(caps.enabled);
        const raw = sessionStorage.getItem(sessionKey);
        if (caps.enabled && raw) {
          const saved = loginResponseSchema.parse(JSON.parse(raw));
          await cbcApi.me(saved.token);
          const data = await cbcApi.encounters(saved.token);
          if (live && generation.current === restoreGeneration) {
            setSession(saved);
            onConnect(saved, data.encounters);
          }
        }
      } catch {
        if (live)
          setMessage(
            "Connect an authenticated clinical session to use CBC reports.",
          );
      }
    })();
    return () => {
      live = false;
      mounted.current = false;
      generation.current++;
      window.removeEventListener("cbc-session-expired", expire);
      window.removeEventListener("cf_auth_change", authChange);
      window.removeEventListener("ayusetu_demo_logout", expire);
    };
  }, [onConnect]);
  useEffect(() => {
    if (!session) return;
    const remaining = Date.parse(session.expiresAt) - Date.now();
    const expiry = window.setTimeout(
      () => window.dispatchEvent(new Event("cbc-session-expired")),
      Math.max(0, remaining),
    );
    let refreshing = false,
      live = true;
    const refresh = async () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const principal = await cbcApi.me(session.token);
        if (principal.role !== "DOCTOR")
          throw new Error("Doctor authorization ended");
        const data = await cbcApi.encounters(session.token);
        if (live) onConnect(session, data.encounters);
      } catch {
        if (live) window.dispatchEvent(new Event("cbc-session-expired"));
      } finally {
        refreshing = false;
      }
    };
    const focus = () => {
      void refresh();
    };
    const interval = window.setInterval(focus, 30000);
    window.addEventListener("focus", focus);
    return () => {
      live = false;
      clearTimeout(expiry);
      clearInterval(interval);
      window.removeEventListener("focus", focus);
    };
  }, [session, onConnect]);
  async function connect(form: HTMLFormElement) {
    const fields = new FormData(form),
      requestGeneration = ++generation.current;
    setBusy(true);
    setMessage("");
    try {
      const result = await cbcApi.login(
        String(fields.get("org")),
        String(fields.get("email")),
        String(fields.get("password")),
      );
      if (result.principal.role !== "DOCTOR")
        throw new Error("Connect using an authorized doctor account.");
      const data = await cbcApi.encounters(result.token);
      if (!mounted.current || generation.current !== requestGeneration) return;
      sessionStorage.setItem(sessionKey, JSON.stringify(result));
      setSession(result);
      onConnect(result, data.encounters);
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not connect.");
    } finally {
      setBusy(false);
    }
  }
  async function addSynthetic() {
    if (!session || !name.trim()) return;
    const requestGeneration = generation.current;
    setBusy(true);
    setMessage("");
    try {
      await call("/encounters", encounterSchema, session.token, "POST", {
        patient: {
          name: `Synthetic ${name.trim()}`,
          birthDate: "1980-01-01",
          gender: "female",
          language: "en-IN",
        },
        chiefComplaint: "Synthetic CBC workflow demonstration",
        answers: { chestPain: "no", breathless: "no", fainting: "no" },
        careConsent: true,
        synthetic: true,
      });
      const data = await cbcApi.encounters(session.token);
      if (mounted.current && generation.current === requestGeneration) {
        onConnect(session, data.encounters);
        setName("");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create synthetic encounter.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3"
      aria-label="CBC clinical access"
    >
      <h2 className="font-bold text-slate-900">
        CBC clinical workspace{" "}
        <span className="text-xs font-normal text-amber-800">
          Synthetic records only
        </span>
      </h2>
      {!available ? (
        <p className="text-sm text-slate-600">
          CBC requires the authenticated local clinical workspace. Production
          patient-record access is not configured.
        </p>
      ) : !session ? (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void connect(event.currentTarget);
          }}
        >
          <label className="text-xs">
            Organization
            <input
              name="org"
              required
              className="block border rounded p-2"
              autoComplete="organization"
            />
          </label>
          <label className="text-xs">
            Clinical email
            <input
              name="email"
              type="email"
              required
              className="block border rounded p-2"
              autoComplete="username"
            />
          </label>
          <label className="text-xs">
            Clinical password
            <input
              name="password"
              type="password"
              required
              className="block border rounded p-2"
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded bg-teal-800 text-white p-2 text-sm"
          >
            Connect clinical session
          </button>
          <p className="w-full text-xs text-slate-500">
            Use the configured clinical account. The ERP demo login does not
            authorize report access.
          </p>
        </form>
      ) : (
        <>
          <div className="flex gap-3 items-center text-sm">
            <span>
              Doctor connected · {session.principal.orgId} /{" "}
              {session.principal.clinicId}
            </span>
            <button
              type="button"
              className="underline"
              onClick={() => {
                generation.current++;
                void call(
                  "/auth/logout",
                  z.object({ loggedOut: z.boolean() }),
                  session.token,
                  "POST",
                ).catch(() => {});
                sessionStorage.removeItem(sessionKey);
                setSession(null);
                onConnect(null, []);
              }}
            >
              Disconnect CBC session
            </button>
          </div>
          <p className="text-xs text-slate-600">
            Select an authorized synthetic consultation from the existing
            patient queue. Legacy/demo rows without a verified clinical
            encounter remain unavailable for CBC.
          </p>
          <form
            className="flex flex-wrap gap-2 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              void addSynthetic();
            }}
          >
            <label className="text-xs">
              Synthetic demo name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                placeholder="Fictional name only"
                className="ml-2 border rounded p-2"
                required
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="border rounded p-2 text-xs"
            >
              Add synthetic consultation
            </button>
            <span className="text-xs text-slate-500">
              Creates an explicitly synthetic adult record and demo care
              consent.
            </span>
          </form>
        </>
      )}
      {message && (
        <p role="status" className="text-sm text-amber-900">
          {message}
        </p>
      )}
    </section>
  );
}
