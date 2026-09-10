import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ROLE_ACTOR } from "@/lib/permissions";
import {
  clearDemoState,
  createSeedState,
  loadDemoState,
  readTheme,
  saveDemoState,
  writeTheme,
  type DemoState,
  type ThemeChoice,
} from "@/lib/storage";
import {
  clearLaunchContext,
  createDemoLaunchContext,
  readLaunchContext,
  writeLaunchContext,
} from "@/lib/ltiContext";
import type {
  Assignment,
  AuditEvent,
  DemoRole,
  InterventionDraft,
  PassbackRecord,
} from "@/types/domain";
import type { LtiLaunchContext } from "@/types/lti";

interface AuditInput {
  action: string;
  target: string;
  description: string;
  role?: DemoRole;
}

interface DemoContextValue {
  state: DemoState;
  hydrated: boolean;
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  theme: ThemeChoice;
  setTheme: (theme: ThemeChoice) => void;
  launchContext: LtiLaunchContext | null;
  launchDemoContext: () => LtiLaunchContext;
  endLaunchContext: () => void;
  addAudit: (input: AuditInput) => void;
  addAssignment: (assignment: Assignment) => void;
  saveSubmission: (studentId: string, assignmentId: string, lines: string[]) => void;
  updateIntervention: (id: string, patch: Partial<InterventionDraft>, audit: AuditInput) => void;
  addPassback: (record: PassbackRecord) => void;
  confirmPassback: (id: string) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => createSeedState());
  const [hydrated, setHydrated] = useState(false);
  const [theme, setThemeValue] = useState<ThemeChoice>("system");
  const [launchContext, setLaunchContext] = useState<LtiLaunchContext | null>(null);

  useEffect(() => {
    const stored = loadDemoState();
    if (stored) setState(stored);
    setThemeValue(readTheme());
    setLaunchContext(readLaunchContext());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDemoState(state);
  }, [state, hydrated]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("theme-dark", dark);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  const pushAudit = useCallback((current: DemoState, input: AuditInput): AuditEvent[] => {
    const role = input.role ?? current.role;
    const event: AuditEvent = {
      id: makeId("aud"),
      actor: ROLE_ACTOR[role],
      role,
      timestamp: new Date().toISOString(),
      action: input.action,
      target: input.target,
      description: input.description,
    };
    return [...current.audit, event];
  }, []);

  const value = useMemo<DemoContextValue>(() => {
    return {
      state,
      hydrated,
      role: state.role,
      setRole: (role) => setState((prev) => ({ ...prev, role })),
      theme,
      setTheme: (next) => {
        setThemeValue(next);
        writeTheme(next);
      },
      launchContext,
      launchDemoContext: () => {
        const context = createDemoLaunchContext();
        writeLaunchContext(context);
        setLaunchContext(context);
        setState((prev) => ({
          ...prev,
          audit: pushAudit(prev, {
            action: "Simulated launch opened",
            target: "Math 6 — Period 3",
            description:
              "A simulated pilot launch context was created in this browser. No LMS was contacted.",
            role: "teacher",
          }),
        }));
        return context;
      },
      endLaunchContext: () => {
        clearLaunchContext();
        setLaunchContext(null);
      },
      addAudit: (input) => setState((prev) => ({ ...prev, audit: pushAudit(prev, input) })),
      addAssignment: (assignment) =>
        setState((prev) => ({
          ...prev,
          assignments: [...prev.assignments, assignment],
          audit: pushAudit(prev, {
            action: "Assignment created",
            target: assignment.title,
            description: `A demo assignment aligned to ${assignment.standardCodes.join(", ")} was created in this browser.`,
          }),
        })),
      saveSubmission: (studentId, assignmentId, lines) =>
        setState((prev) => {
          const existing = prev.submissions.find(
            (s) => s.studentId === studentId && s.assignmentId === assignmentId,
          );
          const submissions = existing
            ? prev.submissions.map((s) =>
                s.id === existing.id
                  ? { ...s, lines, submittedOn: new Date().toISOString().slice(0, 10) }
                  : s,
              )
            : [
                ...prev.submissions,
                {
                  id: makeId("sub"),
                  assignmentId,
                  studentId,
                  submittedOn: new Date().toISOString().slice(0, 10),
                  lines,
                  identifiedIssue: "Awaiting teacher review",
                  errorLineIndex: -1,
                  teacherFeedback: "",
                  reviewed: false,
                },
              ];
          return {
            ...prev,
            submissions,
            audit: pushAudit(prev, {
              action: "Submission saved",
              target: "Expressions and Equations Checkpoint",
              description: "A student response was saved in demo mode.",
              role: "student",
            }),
          };
        }),
      updateIntervention: (id, patch, audit) =>
        setState((prev) => ({
          ...prev,
          interventions: prev.interventions.map((draft) =>
            draft.id === id ? { ...draft, ...patch } : draft,
          ),
          audit: pushAudit(prev, audit),
        })),
      addPassback: (record) =>
        setState((prev) => ({
          ...prev,
          passbacks: [...prev.passbacks, record],
          audit: pushAudit(prev, {
            action: "Simulated passback prepared",
            target: `${record.standardCode} · ${record.destinationLabel}`,
            description: "A simulated passback preview was prepared. No data was sent to an LMS.",
          }),
        })),
      confirmPassback: (id) =>
        setState((prev) => ({
          ...prev,
          passbacks: prev.passbacks.map((record) =>
            record.id === id
              ? { ...record, confirmed: true, confirmedOn: new Date().toISOString() }
              : record,
          ),
          audit: pushAudit(prev, {
            action: "Simulated passback confirmed",
            target: "Simulated pilot destination",
            description:
              "The teacher confirmed a simulated passback. This demo does not transmit data anywhere.",
          }),
        })),
      resetDemo: () => {
        clearDemoState();
        const seed = createSeedState();
        setState({ ...seed, role: state.role });
      },
    };
  }, [state, hydrated, theme, launchContext, pushAudit]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoStateProvider");
  return context;
}
