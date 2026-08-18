import { cn } from "@/lib/utils";
import type { FindingStatus, Severity } from "@/lib/mock-data";

const severityClass: Record<Severity, string> = {
  Critical: "bg-critical/20 text-critical border-critical/50",
  High: "bg-high/20 text-high border-high/50",
  Medium: "bg-medium/20 text-medium border-medium/50",
  Low: "bg-low/20 text-low border-low/50",
  Info: "bg-info/20 text-info border-info/50",
};

export const severityDot: Record<Severity, string> = {
  Critical: "bg-critical",
  High: "bg-high",
  Medium: "bg-medium",
  Low: "bg-low",
  Info: "bg-info",
};

export const severityHex: Record<Severity, string> = {
  Critical: "var(--critical)",
  High: "var(--high)",
  Medium: "var(--medium)",
  Low: "var(--low)",
  Info: "var(--info)",
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        severityClass[severity],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", severityDot[severity])} />
      {severity}
    </span>
  );
}

const statusClass: Record<FindingStatus, string> = {
  Active: "bg-critical/15 text-critical border-critical/40",
  Verified: "bg-primary/25 text-foreground border-primary/60",
  Mitigated: "bg-green/20 text-green border-green/50",
  "False Positive": "bg-muted text-muted-foreground border-border",
  "Risk Accepted": "bg-medium/15 text-medium border-medium/40",
  Duplicate: "bg-magenta/20 text-magenta border-magenta/50",
};

export function StatusBadge({ status, className }: { status: FindingStatus; className?: string }) {
  return (
    <span
      key={status}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors duration-300 animate-in fade-in zoom-in-95",
        statusClass[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
