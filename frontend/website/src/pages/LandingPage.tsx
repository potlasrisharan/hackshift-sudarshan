import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { landingMarkup } from "../../../../packages/design/landing";
import "../../../../packages/design/landing.css";

const markup = landingMarkup({
  patient: "#/kiosk",
  clinician: "#/app?view=doctor-consultation",
  emergency: "#/app?view=emergency-triage",
  headquarters: "#/app?view=admin",
  operations: "#/app?view=clinic-admin",
  home: "#/",
});
export default function LandingPage() {
  const navigate = useNavigate();
  const node = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = node.current;
    function follow(event: MouseEvent) {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>("a");
      if (
        !anchor ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("#/")) {
        event.preventDefault();
        navigate(href.slice(1));
      } else if (href.startsWith("#ds-")) {
        event.preventDefault();
        document.getElementById(href.slice(1))?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }
    }
    element?.addEventListener("click", follow);
    return () => element?.removeEventListener("click", follow);
  }, [navigate]);
  // biome-ignore lint/security/noDangerouslySetInnerHtml: Static locally authored markup; no user or API values are interpolated.
  return <div ref={node} dangerouslySetInnerHTML={{ __html: markup }} />;
}
