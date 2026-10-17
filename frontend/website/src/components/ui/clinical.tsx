import { AlertTriangle, ClipboardList, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function ClinicalStatusBadge({
  children,
  danger = false,
}: {
  children: ReactNode;
  danger?: boolean;
}) {
  return <span className={`badge ${danger ? "danger" : ""}`}>{children}</span>;
}
export function MetricCard({
  label,
  value,
  detail,
  critical = false,
}: {
  label: string;
  value: ReactNode;
  detail: string;
  critical?: boolean;
}) {
  const Icon = critical
    ? AlertTriangle
    : label === "Patient threads"
      ? ClipboardList
      : ShieldCheck;
  return (
    <div className={`ayu-metric ${critical ? "ayu-metric-critical" : ""}`}>
      <div className="ayu-metric-label">
        <span>{label}</span>
        <Icon size={18} aria-hidden="true" />
      </div>
      <strong className={critical ? "red-text" : ""}>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
