import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  findings as seedFindings,
  initialActivity,
  type Finding,
  type FindingStatus,
} from "./mock-data";

interface ActivityItem {
  at: string;
  text: string;
}

interface StoreValue {
  findings: Finding[];
  activity: ActivityItem[];
  openFindingId: string | null;
  openFinding: (id: string) => void;
  closeFinding: () => void;
  setStatus: (id: string, status: FindingStatus, note?: string) => void;
  acceptRisk: (id: string, justification: string, expiry: string) => void;
  createTicket: (id: string) => string;
  logActivity: (text: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

let ticketSeq = 4821;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Finding[]>(seedFindings);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const [openFindingId, setOpenFindingId] = useState<string | null>(null);

  const logActivity = useCallback((text: string) => {
    setActivity((prev) => [{ at: "just now", text }, ...prev].slice(0, 25));
  }, []);

  const patch = useCallback((id: string, fn: (f: Finding) => Finding) => {
    setItems((prev) => prev.map((f) => (f.id === id ? fn(f) : f)));
  }, []);

  const setStatus = useCallback(
    (id: string, status: FindingStatus, note?: string) => {
      patch(id, (f) => ({
        ...f,
        status,
        activity: [
          ...f.activity,
          { at: "just now", text: note ?? `Status changed from ${f.status} to ${status}` },
        ],
      }));
      const found = seedFindings.find((f) => f.id === id);
      logActivity(`${found?.title ?? "Finding"} marked as ${status}`);
    },
    [patch, logActivity],
  );

  const acceptRisk = useCallback(
    (id: string, justification: string, expiry: string) => {
      patch(id, (f) => ({
        ...f,
        status: "Risk Accepted",
        activity: [
          ...f.activity,
          { at: "just now", text: `Risk accepted until ${expiry} — "${justification}"` },
        ],
      }));
      logActivity(`Risk acceptance recorded (expires ${expiry})`);
    },
    [patch, logActivity],
  );

  const createTicket = useCallback(
    (id: string) => {
      const key = `JIRA-${ticketSeq++}`;
      patch(id, (f) => ({
        ...f,
        jira: key,
        activity: [...f.activity, { at: "just now", text: `Ticket created: ${key}` }],
      }));
      logActivity(`Ticket ${key} created for remediation`);
      return key;
    },
    [patch, logActivity],
  );

  const value = useMemo<StoreValue>(
    () => ({
      findings: items,
      activity,
      openFindingId,
      openFinding: setOpenFindingId,
      closeFinding: () => setOpenFindingId(null),
      setStatus,
      acceptRisk,
      createTicket,
      logActivity,
    }),
    [items, activity, openFindingId, setStatus, acceptRisk, createTicket, logActivity],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
