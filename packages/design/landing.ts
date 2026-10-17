/** Shared, static marketing content. Destinations are supplied by each host app. */
export interface LandingDestinations {
  patient: string;
  clinician: string;
  emergency: string;
  headquarters: string;
  operations: string;
  home: string;
}
const icons = {
  intake:
    '<rect x="6" y="3" width="12" height="18" rx="3"/><path d="M9 8h6m-3-3v6m-3 6h6"/>',
  clinical:
    '<path d="M6 3v5a4 4 0 0 0 8 0V3M4 3h4m4 0h4m-6 9v4a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="3"/>',
  emergency: '<path d="m12 3 10 18H2L12 3Z M12 9v5m0 3v.5"/>',
  operations:
    '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4m-4 5v5m-3-2.5h6"/>',
  headquarters:
    '<path d="M4 21V3h12v18M16 9h4v12M2 21h20M8 7h4m-4 4h4m-4 4h4m-2 6v-3"/>',
  home: '<path d="m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z"/>',
  shield: '<path d="M12 3 3 7v6c0 4 9 8 9 8s9-4 9-8V7l-9-4Z m-4 9 3 3 5-6"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
};
export function designIcon(name: keyof typeof icons, className = "") {
  return `<svg class="ds-icon ${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}
export const brandMarkup = `<span class="ds-wordmark">Ayu<span lang="hi">सेतु</span></span>`;
export function landingMarkup(d: LandingDestinations): string {
  const workspaces = [
    [
      "intake",
      "Patient portal & kiosk",
      "A welcoming first step. Your language, your health, your care.",
      d.patient,
      "Begin your care journey",
      "featured",
    ],
    [
      "clinical",
      "Doctor consultation",
      "The patient story, ready for your review.",
      d.clinician,
      "Open clinical workspace",
      "",
    ],
    [
      "headquarters",
      "Headquarters",
      "A connected view of your healthcare network.",
      d.headquarters,
      "Explore headquarters",
      "",
    ],
    [
      "operations",
      "Clinic operations",
      "Keep pharmacy, inventory and daily work in step.",
      d.operations,
      "Open operations",
      "",
    ],
    [
      "emergency",
      "Emergency triage",
      "Clear priorities when every moment matters.",
      d.emergency,
      "Open emergency workspace",
      "urgent",
    ],
  ] as const;
  return `<div class="ds-site"><a class="ds-skip" href="#ds-content">Skip to content</a>
  <header class="ds-nav"><a href="${d.home}" aria-label="AyuSetu home">${brandMarkup}</a><nav aria-label="Website"><a href="#ds-platform">Platform</a><a href="#ds-journey">Our approach</a><a href="#ds-safety">Trust & care</a></nav><a class="ds-button ds-button-small" href="#ds-workspaces">Enter workspace ${designIcon("arrow")}</a></header>
  <main id="ds-content"><section class="ds-hero"><div class="ds-hero-copy"><span class="ds-eyebrow"><span class="ds-status-dot"></span> A more connected kind of care</span><h1>Healthcare,<br>finally <em>connected.</em></h1><p>One continuous journey from first symptom to recovery. For patients, care teams, and everyone in between.</p><div class="ds-actions"><a class="ds-button" href="#ds-workspaces">Explore AyuSetu ${designIcon("arrow")}</a><a class="ds-button ds-button-secondary" href="#ds-platform">View platform</a></div><div class="ds-hero-note">${designIcon("shield")} Built around people. Guided by clinical oversight.</div></div>
  <div class="ds-hero-art"><img src="/assets/design/care-continuum.jpg" alt="An Indian doctor sharing a reassuring moment with a child and her mother" width="1400" height="933" fetchpriority="high"><div class="ds-care-node ds-node-one">${designIcon("heart")} Prevention</div><div class="ds-care-node ds-node-two">${designIcon("clinical")} Consultation</div><div class="ds-care-node ds-node-three">${designIcon("home")} Care continues</div><span class="ds-art-caption">A healthier tomorrow,<br><em>together.</em></span></div></section>
  <div class="ds-foundation"><div><strong>5</strong><span>Connected workspaces</span></div><div><strong>4</strong><span>Deterministic core engines</span></div><div><strong>5</strong><span>Intake language options</span></div><div><strong>One</strong><span>Continuous care journey</span></div></div>
  <section class="ds-section ds-journey" id="ds-journey"><div class="ds-section-heading"><span class="ds-kicker">Care without the gaps</span><h2>One platform.<br>Every stage of care.</h2><p>Better handoffs start with a shared understanding of the person behind the patient.</p></div><ol class="ds-journey-line">${[
    ["intake", "A warm welcome", "Start in your language"],
    ["clinical", "An informed consultation", "Put the patient story first"],
    [
      "operations",
      "Treatment, connected",
      "Bring clinical and pharmacy work together",
    ],
    ["home", "Support beyond the visit", "Keep the next step in sight"],
  ]
    .map(
      ([icon, title, copy], i) =>
        `<li><span class="ds-journey-icon">${designIcon(icon as keyof typeof icons)}</span><span class="ds-step-label">0${i + 1}</span><h3>${title}</h3><p>${copy}</p></li>`,
    )
    .join("")}</ol></section>
  <section class="ds-section" id="ds-workspaces"><div class="ds-section-heading"><span class="ds-kicker">Your place in the care journey</span><h2>Where would you<br>like to begin?</h2><p>Choose your workspace. Each brings a different part of care into focus.</p></div><div class="ds-workspace-grid">${workspaces.map(([icon, title, copy, href, action, variant]) => `<a class="ds-workspace-card ${variant}" href="${href}"><span class="ds-workspace-icon">${designIcon(icon)}</span><h3>${title}</h3><p>${copy}</p><span class="ds-workspace-action">${action}${designIcon("arrow")}</span>${variant === "featured" ? '<div class="ds-language-preview" aria-hidden="true"><span lang="hi">नमस्ते</span><span>Hello</span><span lang="te">నమస్కారం</span><span lang="ta">வணக்கம்</span></div>' : ""}</a>`).join("")}</div></section>
  <section class="ds-section ds-platform" id="ds-platform"><div class="ds-platform-story"><span class="ds-kicker">Thoughtfully connected</span><h2>The whole picture.<br>A clearer next step.</h2><p>Intake, clinical review, emergency triage and daily operations belong in the same conversation.</p><a class="ds-text-link" href="#ds-workspaces">Find your workspace ${designIcon("arrow")}</a><div class="ds-product-tags"><span>AyuSetu Intake</span><span>Clinical</span><span>Emergency</span><span>Operations</span><span>Home</span><span>HER</span><span>Vitalis</span></div></div><div class="ds-thread-preview"><header>${designIcon("clinical")}<strong>The patient thread</strong><span>Platform overview</span></header><div class="ds-thread-entry"><span>01</span><div><strong>Listen first</strong><p>Language preference and patient-reported concerns</p><small>INTAKE</small></div></div><div class="ds-thread-entry"><span>02</span><div><strong>Review with context</strong><p>Source-linked information and clinician oversight</p><small>CONSULTATION</small></div></div><div class="ds-thread-entry"><span>03</span><div><strong>Make the handoff matter</strong><p>Medication, monitoring and preventive care</p><small>CONTINUITY</small></div></div><footer>${designIcon("shield")} Illustrative workflow. Availability varies by workspace.</footer></div></section>
  <section class="ds-section ds-safety" id="ds-safety"><div><span class="ds-kicker">Technology with care</span><h2>Human decisions.<br>Thoughtful support.</h2></div><div class="ds-safety-items"><article>${designIcon("clinical")}<div><h3>Clinical oversight</h3><p>Decision support keeps the clinician in the loop.</p></div></article><article>${designIcon("shield")}<div><h3>Consent, with clarity</h3><p>Understand what is shared and how it is used.</p></div></article><article>${designIcon("operations")}<div><h3>Explainable by design</h3><p>Deterministic core algorithms and FHIR-aligned records.</p></div></article></div></section>
  <section class="ds-closing"><span>From the first hello to the next healthy day.</span><h2>Let’s bring care together.</h2><a class="ds-button" href="#ds-workspaces">Find your workspace ${designIcon("arrow")}</a></section></main>
  <footer class="ds-footer"><a href="${d.home}">${brandMarkup}</a><p>One thread from first symptom to recovery.</p><a href="#ds-safety">Our approach to care</a><small>Demo capabilities are identified in each workspace. Not an emergency service.</small></footer></div>`;
}
