import "./style.css";
import "../../../packages/design/landing.css";
import "./design-v2.css";
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { landingMarkup } from "../../../packages/design/landing";
import TextType from "./TextType";

const root = document.querySelector<HTMLDivElement>("#app");
if (!root) throw new Error("Application root missing");
const app = root;

window.addEventListener(
  "error",
  (e) => {
    const target = e.target as HTMLElement | null;
    if (
      target?.tagName === "IMG" &&
      target.classList.contains("ds-brand-logo")
    ) {
      target.style.display = "none";
      const fallback = target.nextElementSibling as HTMLElement | null;
      if (fallback) fallback.style.display = "inline-block";
    }
  },
  true,
);

const patientRoutes = [
  "begin",
  "today",
  "kiosk",
  "intake",
  "patient",
  "thread",
  "medicines",
  "monitor",
  "care",
  "women",
  "privacy",
  "lab",
];

function checkPatientRouteRedirect(): boolean {
  const h = window.location.hash.slice(1);
  if (patientRoutes.includes(h)) {
    window.location.replace("/erp.html#/app?view=patient-kiosk");
    return true;
  }
  return false;
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
  if (checkPatientRouteRedirect()) return;

  app.innerHTML = landingMarkup({
    patient: "/erp.html#/app?view=patient-kiosk",
    clinician: "/erp.html#/app?view=doctor-consultation",
    emergency: "/erp.html#/app?view=emergency-triage",
    headquarters: "/erp.html#/app?view=admin",
    operations: "/erp.html#/app?view=clinic-admin",
    home: "#",
  });
  heroRoot = null;
  mountHeroTextType();
}

window.addEventListener("hashchange", () => {
  if (!checkPatientRouteRedirect()) {
    render();
  }
});

window.addEventListener("popstate", () => {
  if (!checkPatientRouteRedirect()) {
    render();
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

if (!checkPatientRouteRedirect()) {
  render();
}
