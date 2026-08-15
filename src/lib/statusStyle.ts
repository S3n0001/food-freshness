import type { StatusText } from "./riskEngine";

export interface StatusStyle {
  label: StatusText;
  hex: string;
  text: string;
  bg: string;
  border: string;
  glow: string;
  chip: string;
  dot: string;
}

/**
 * Central color mapping for the four `statusText` values from
 * `calculateRisk()`. Every status-driven visual reads from this
 * refined Linear-style palette so they stay completely synchronized.
 */
export const STATUS_STYLES: Record<StatusText, StatusStyle> = {
  SAFE: {
    label: "SAFE",
    hex: "#10b981",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    glow: "shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)]",
    chip: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  WARNING: {
    label: "WARNING",
    hex: "#f59e0b",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    glow: "shadow-[0_0_24px_-4px_rgba(245,158,11,0.35)]",
    chip: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    dot: "bg-amber-400",
  },
  "HIGH RISK": {
    label: "HIGH RISK",
    hex: "#f97316",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    glow: "shadow-[0_0_24px_-4px_rgba(249,115,22,0.35)]",
    chip: "bg-orange-500/10 text-orange-400 border-orange-500/25",
    dot: "bg-orange-400",
  },
  CRITICAL: {
    label: "CRITICAL",
    hex: "#f43f5e",
    text: "text-rose-400",
    bg: "bg-rose-500/12",
    border: "border-rose-500/30",
    glow: "shadow-[0_0_28px_-2px_rgba(244,63,94,0.4)]",
    chip: "bg-rose-500/12 text-rose-400 border-rose-500/30",
    dot: "bg-rose-400",
  },
};

export function statusStyle(status: StatusText): StatusStyle {
  return STATUS_STYLES[status] || STATUS_STYLES.SAFE;
}
