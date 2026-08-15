import { Activity, Fan, Droplets, Clock } from "lucide-react";
import { statusStyle } from "../lib/statusStyle";
import { formatStorageClock } from "../lib/lcd";
import type { GuardianSnapshot } from "../lib/types";

export function InstrumentStrip({ snapshot }: { snapshot: GuardianSnapshot }) {
  const style = statusStyle(snapshot.status);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
      {/* 1. Status Pill Card */}
      <div className="rounded-xl bg-[#0e1017] border border-white/[0.08] p-3 flex flex-col justify-between shadow-xs linear-border-top-sheen">
        <div className="flex items-center justify-between text-xs font-mono text-[#8f96a3] mb-1.5">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] uppercase tracking-wider text-[#5f6573]">STATUS</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.hex }} />
        </div>
        <div className="flex items-baseline justify-between">
          <span className={`text-sm sm:text-base font-semibold tracking-tight ${style.text}`}>
            {snapshot.status}
          </span>
          <span className="text-[10px] font-mono text-[#5f6573]">RISK {snapshot.riskScore}</span>
        </div>
      </div>

      {/* 2. Relay / Fan Ventilation */}
      <div className="rounded-xl bg-[#0e1017] border border-white/[0.08] p-3 flex flex-col justify-between shadow-xs linear-border-top-sheen">
        <div className="flex items-center justify-between text-xs font-mono text-[#8f96a3] mb-1.5">
          <div className="flex items-center gap-1.5">
            <Fan className={`w-3.5 h-3.5 ${snapshot.fanOn ? "text-sky-400 animate-spin-fan" : "text-[#5f6573]"}`} />
            <span className="text-[10px] uppercase tracking-wider text-[#5f6573]">RELAY · D10</span>
          </div>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              snapshot.fanOn ? "bg-sky-400 shadow-[0_0_6px_#38bdf8]" : "bg-white/[0.15]"
            }`}
          />
        </div>
        <div className="flex items-baseline justify-between">
          <span
            className={`text-sm sm:text-base font-semibold tracking-tight ${
              snapshot.fanOn ? "text-sky-300" : "text-[#d0d6e0]"
            }`}
          >
            {snapshot.fanOn ? "VENT ACTIVE" : "OFF / IDLE"}
          </span>
          <span className="text-[10px] font-mono text-[#5f6573]">{snapshot.fanOn ? "12V HIGH" : "0V LOW"}</span>
        </div>
      </div>

      {/* 3. Soil Moisture */}
      <div className="rounded-xl bg-[#0e1017] border border-white/[0.08] p-3 flex flex-col justify-between shadow-xs linear-border-top-sheen">
        <div className="flex items-center justify-between text-xs font-mono text-[#8f96a3] mb-1.5">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider text-[#5f6573]">MOISTURE · A0</span>
          </div>
          <span className="text-[10px] font-mono text-[#5f6573]">ADC {snapshot.moistureRaw}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm sm:text-base font-semibold tracking-tight text-[#f2f5f8] font-mono">
            {snapshot.moisturePercent}%
          </span>
          <span className="text-[10px] font-mono text-[#5f6573]">
            {snapshot.moisturePercent > 60 ? "HUMID" : "NORMAL"}
          </span>
        </div>
      </div>

      {/* 4. Storage Duration Clock */}
      <div className="rounded-xl bg-[#0e1017] border border-white/[0.08] p-3 flex flex-col justify-between shadow-xs linear-border-top-sheen">
        <div className="flex items-center justify-between text-xs font-mono text-[#8f96a3] mb-1.5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider text-[#5f6573]">STORAGE TIME</span>
          </div>
          <span className="text-[10px] font-mono text-[#5f6573]">ELAPSED</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-sm sm:text-base font-semibold tracking-tight text-[#f2f5f8] font-mono tabular-nums">
            {formatStorageClock(snapshot.storageElapsedMs)}
          </span>
          <span className="text-[10px] font-mono text-[#5f6573]">HH:MM:SS</span>
        </div>
      </div>
    </div>
  );
}
