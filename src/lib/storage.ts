import {
  ASSIGNMENTS,
  AUDIT_SEED,
  INTERVENTION_DRAFTS,
  SUBMISSIONS,
} from "@/data/seed";
import type {
  Assignment,
  AuditEvent,
  DemoRole,
  InterventionDraft,
  PassbackRecord,
  PilotRequest,
  Submission,
} from "@/types/domain";

export const DEMO_STATE_KEY = "hologram_demo_state_v1";
export const PILOT_REQUEST_KEY = "hologram_demo_pilot_request";
export const THEME_KEY = "hologram_demo_theme";

export type ThemeChoice = "system" | "light" | "dark";

export interface DemoState {
  role: DemoRole;
  assignments: Assignment[];
  submissions: Submission[];
  interventions: InterventionDraft[];
  passbacks: PassbackRecord[];
  audit: AuditEvent[];
}

/** Built lazily — never at module scope, so the worker runtime stays happy. */
export function createSeedState(): DemoState {
  return {
    role: "teacher",
    assignments: structuredCloneSafe(ASSIGNMENTS),
    submissions: structuredCloneSafe(SUBMISSIONS),
    interventions: structuredCloneSafe(INTERVENTION_DRAFTS),
    passbacks: [],
    audit: structuredCloneSafe(AUDIT_SEED),
  };
}

function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function loadDemoState(): DemoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DEMO_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DemoState>;
    const seed = createSeedState();
    return {
      role: parsed.role ?? seed.role,
      assignments: parsed.assignments ?? seed.assignments,
      submissions: parsed.submissions ?? seed.submissions,
      interventions: parsed.interventions ?? seed.interventions,
      passbacks: parsed.passbacks ?? seed.passbacks,
      audit: parsed.audit ?? seed.audit,
    };
  } catch {
    return null;
  }
}

export function saveDemoState(state: DemoState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — the demo continues in memory */
  }
}

export function clearDemoState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_STATE_KEY);
}

export function savePilotRequest(request: PilotRequest): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PILOT_REQUEST_KEY, JSON.stringify(request));
}

export function readPilotRequest(): PilotRequest | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PILOT_REQUEST_KEY);
    return raw ? (JSON.parse(raw) as PilotRequest) : null;
  } catch {
    return null;
  }
}

export function readTheme(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(THEME_KEY);
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
}

export function writeTheme(theme: ThemeChoice): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
}
