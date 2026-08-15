import { Usb, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import type { HardwareStatus } from "../hooks/useFoodGuardian";
import type { DataSource } from "../lib/types";

interface HardwareConnectProps {
  status: HardwareStatus;
  dataSource: DataSource;
  error?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const STATUS_DETAILS: Record<HardwareStatus, { title: string; desc: string; badge: string; color: string }> = {
  unsupported: {
    title: "Web Serial Unsupported",
    desc: "Requires Chrome, Edge, or Opera with Web Serial API enabled.",
    badge: "UNAVAILABLE",
    color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
  },
  idle: {
    title: "Hardware Bridge Standby",
    desc: "Connect an Arduino Uno running Food_Guardian.ino at 9600 baud over USB.",
    badge: "READY",
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  connecting: {
    title: "Requesting USB Port",
    desc: "Select the Arduino Uno COM port in the browser prompt...",
    badge: "CONNECTING",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  connected: {
    title: "USB Bridge Live",
    desc: "Streaming real Serial.print telemetry from the physical microcontroller.",
    badge: "CONNECTED",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  error: {
    title: "Hardware Link Error",
    desc: "Connection interrupted or port unavailable.",
    badge: "ERROR",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
};

/** Bridges to a physical Arduino running Food_Guardian.ino unmodified over USB Web Serial. */
export function HardwareConnect({
  status,
  dataSource,
  error,
  onConnect,
  onDisconnect,
}: HardwareConnectProps) {
  const connected = status === "connected" && dataSource === "hardware";
  const info = STATUS_DETAILS[status];

  return (
    <div className="rounded-xl bg-[#0e1017] border border-white/[0.08] p-3.5 linear-border-top-sheen shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Status & Details */}
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
              connected
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-white/[0.04] border-white/[0.06] text-[#8f96a3]"
            }`}
          >
            <Usb className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-[#f2f5f8]">{info.title}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${info.color}`}>
                {info.badge}
              </span>
            </div>
            <p className="text-[11px] text-[#8f96a3] mt-0.5 leading-relaxed truncate">
              {error ?? info.desc}
            </p>
          </div>
        </div>

        {/* Right Connect Button */}
        <button
          type="button"
          disabled={status === "unsupported" || status === "connecting"}
          onClick={connected ? onDisconnect : onConnect}
          className={`shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
            connected
              ? "bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
          }`}
        >
          {status === "connecting" ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Prompting...</span>
            </>
          ) : connected ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Disconnect</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-200" />
              <span>Connect Board</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
