import type { MasteryLevel } from "@/design-system/code-companions-0f8a99/design-system/hologram/components/Mastery";
import type { MasteryState, PrerequisiteRisk } from "@/types/domain";

export const MASTERY_LABEL: Record<MasteryState, string> = {
  beginning: "Beginning",
  developing: "Developing",
  approaching: "Approaching",
  secure: "Secure",
};

export const RISK_LABEL: Record<PrerequisiteRisk, string> = {
  low: "Low prerequisite risk",
  moderate: "Moderate prerequisite risk",
  high: "High prerequisite risk",
};

/** Maps the pilot's mastery states onto the design system's locked ordinal scale. */
export function masteryLevel(state: MasteryState): MasteryLevel {
  switch (state) {
    case "beginning":
      return 0;
    case "developing":
      return 1;
    case "approaching":
      return 2;
    case "secure":
      return 3;
  }
}

export function formatConfidence(value: number): string {
  return value.toFixed(2);
}

export function formatDemoDate(value: string): string {
  const date = new Date(value.length === 10 ? `${value}T12:00:00.000Z` : value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDemoTimestamp(value: string): string {
  const date = new Date(value);
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })} · ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  })} UTC`;
}
