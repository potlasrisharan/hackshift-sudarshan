import type { TourStep } from "./context/TourContext";

// Tours explain the current workspace. They never change clinical routes or roles.
export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  { targetId: "welcome-step", title: "Your network overview", content: "Review the clinics and operational information available to your account. Demonstration records are labelled in this workspace." },
  { targetId: "tour-revenue-card", title: "Financial overview", content: "Open the revenue breakdown to inspect the available clinic totals. The guide does not create or modify transactions." },
  { targetId: "tour-analytics-hub", title: "Explore your data", content: "Use the available clinic and reporting filters to narrow the overview. You can reopen this guide at any time." },
];
export function workspaceTour(view: string): TourStep[] {
  if (view === "admin") return DASHBOARD_TOUR_STEPS;
  if (view === "doctor-consultation") return [
    { targetId: "tour-clinical-overview", title: "Your consultation workspace", content: "Keep the patient queue, reported history and clinical notes together. This guide explains the interface; it does not give medical advice." },
    { targetId: "tour-clinical-queue", title: "Find the patient", content: "Search or filter the queue, then select the intended patient. Check their name and encounter before reviewing the record." },
    { targetId: "tour-clinical-record", title: "Review before acting", content: "Inspect source information, notes and medication details for the selected patient. Demonstration measurements and simulated actions are not live care." },
  ];
  if (view === "emergency-triage") return [
    { targetId: "tour-workspace-content", title: "Emergency workspace", content: "Review case status, available bays and the existing emergency controls. Do not wait for a software guide when immediate care is needed." },
    { targetId: "center", title: "Check the scenario", content: "This demonstration uses synthetic cases. Simulation controls do not dispatch emergency staff or provide a real emergency service." },
  ];
  const labels: Record<string,string> = {
    "clinic-admin":"Clinic operations", "inventory-dashboard":"Inventory", pos:"Billing & POS", staff:"Staff management", attendance:"Attendance", "shift-management":"Shift management", earnings:"Earnings", billing:"Subscription & billing", procurement:"Procurement", expenses:"Expenses", equipments:"Equipment", "ca-suite":"Finance", ipd:"Inpatient management", settings:"Settings", hospitals:"Hospital registry", audit_logs:"Audit logs", "ayush-center":"AYUSH assessment",
  };
  const label = labels[view] ?? "Your workspace";
  return [
    { targetId:"tour-workspace-content", title:label, content:"Use the controls and information available in this workspace. Access depends on your account and the selected clinic." },
    { targetId:"center", title:"Stay in control", content:"Review details before saving or confirming an action. You can close this guide with Escape or the close button and reopen it from Show guide." },
  ];
}
