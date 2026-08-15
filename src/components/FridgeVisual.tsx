import { useEffect, useState } from "react";
import { Fan, Bell, Thermometer, Droplets, ShieldAlert } from "lucide-react";
import type { GuardianSnapshot } from "../lib/types";
import { statusStyle } from "../lib/statusStyle";
import { FoodIcon } from "./FoodIcons";
import { getFoodName } from "../lib/foodTypes";

interface FridgeVisualProps {
  snapshot: GuardianSnapshot;
  buzzerPulse: number;
}

export function FridgeVisual({ snapshot, buzzerPulse }: FridgeVisualProps) {
  const style = statusStyle(snapshot.status);
  const [beepFlash, setBeepFlash] = useState(false);

  useEffect(() => {
    if (buzzerPulse === 0) return;
    setBeepFlash(true);
    const id = window.setTimeout(() => setBeepFlash(false), 320);
    return () => window.clearTimeout(id);
  }, [buzzerPulse]);

  const frostOpacity = Math.min(0.75, Math.max(0.08, snapshot.humidity / 100));
  const isCritical = snapshot.status === "CRITICAL";
  const isElevated = snapshot.riskScore > 25;

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer Chamber Enclosure */}
      <div className="w-full max-w-[400px] rounded-2xl bg-[#0f1117] border border-white/[0.09] p-4 sm:p-5 shadow-2xl relative overflow-hidden linear-border-top-sheen">
        {/* Subtle Ambient Radial Glow behind the chamber */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: style.hex }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-15 blur-3xl transition-colors duration-700"
          style={{ backgroundColor: snapshot.fanOn ? "#38bdf8" : style.hex }}
        />

        {/* Top Hardware Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#d0d6e0] uppercase">
              CHAMBER TEL-01
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#5f6573]">ATmega328P</span>
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isElevated ? "animate-ping" : ""
              }`}
              style={{ backgroundColor: style.hex }}
              title={`Status: ${snapshot.status}`}
            />
          </div>
        </div>

        {/* Main Refrigeration Chamber (Vector & Layered UI) */}
        <div className="relative rounded-xl bg-gradient-to-b from-[#0b0d13] to-[#08090d] border border-white/[0.08] p-4 overflow-hidden min-h-[380px] flex flex-col justify-between shadow-inner">
          {/* Chamber Glass Highlights & Grid */}
          <div className="absolute inset-0 bg-linear-dots-dense opacity-20 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

          {/* Top Sub-Instruments (Fan & Buzzer Telemetry) */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            {/* Buzzer Node */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                beepFlash
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.4)]"
                  : "bg-white/[0.03] border-white/[0.06] text-[#8f96a3]"
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${beepFlash ? "text-rose-400 animate-bounce" : "text-[#5f6573]"}`} />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-[#5f6573]">PIEZO D9</span>
                <span className="text-[11px] font-medium leading-none">
                  {beepFlash ? "PULSE" : "IDLE"}
                </span>
              </div>
            </div>

            {/* Ventilation Relay Node */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
                snapshot.fanOn
                  ? "bg-sky-500/15 border-sky-500/35 text-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.25)]"
                  : "bg-white/[0.03] border-white/[0.06] text-[#8f96a3]"
              }`}
            >
              <Fan
                className={`w-3.5 h-3.5 ${snapshot.fanOn ? "text-sky-400 animate-spin-fan" : "text-[#5f6573]"}`}
              />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-[#5f6573]">RELAY D10</span>
                <span className="text-[11px] font-medium leading-none">
                  {snapshot.fanOn ? "12V ACTIVE" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Storage Shelf & Active Item */}
          <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
            {/* Frost & Humidity Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-cyan-200 animate-frost-drift"
                  style={{
                    left: `${15 + ((i * 31) % 70)}%`,
                    bottom: `${10 + ((i * 23) % 60)}%`,
                    opacity: frostOpacity * (0.3 + (i % 3) * 0.2),
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: `${4 + (i % 3)}s`,
                  }}
                />
              ))}
            </div>

            {/* Food Visual Container */}
            <div className="relative transition-all duration-500 hover:scale-105 group">
              <div
                className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xs transition-shadow duration-500"
                style={{
                  boxShadow: `0 8px 32px -8px ${style.hex}22`,
                }}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28">
                  <FoodIcon food={snapshot.food} />
                </div>
              </div>

              {/* Dynamic Storage Status Tag */}
              <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-medium shadow-sm uppercase tracking-wider ${style.bg} ${style.border} ${style.text}`}
                >
                  {getFoodName(snapshot.food)}
                </span>
              </div>
            </div>

            {/* Wire Shelf Rack */}
            <div className="w-full max-w-[280px] mt-6 relative">
              <div className="h-1.5 w-full rounded-full bg-white/[0.12] border-t border-white/[0.2] shadow-sm" />
              <div className="flex justify-between px-3 mt-0.5">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div key={idx} className="w-[1px] h-3 bg-white/[0.08]" />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Sensor Telemetry Overlay Bar */}
          <div className="relative z-10 pt-2 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[#8f96a3]">
              <Thermometer className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="text-[10px] text-[#5f6573]">DHT11:</span>
              <span className="text-[#f2f5f8] font-medium">{snapshot.temperature.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[#8f96a3]">
              <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[10px] text-[#5f6573]">HUM:</span>
              <span className="text-[#f2f5f8] font-medium">{snapshot.humidity.toFixed(0)}%</span>
            </div>
          </div>

          {/* Critical Hazard Alert Ribbon */}
          {isCritical && (
            <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-center animate-pulse">
              <div className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-mono font-semibold shadow-lg">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>CRITICAL SPOILAGE RISK DETECTED</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info pill */}
        <div className="mt-3.5 flex items-center justify-between text-[11px] font-mono text-[#5f6573]">
          <span>PIN CADENCE: 2000ms</span>
          <span className="text-[#8f96a3]">Soil ADC: {snapshot.moisturePercent}%</span>
        </div>
      </div>
    </div>
  );
}
