import { Volume2, VolumeX, Usb, Terminal, Cpu, Activity, HelpCircle } from "lucide-react";
import { statusStyle } from "../lib/statusStyle";
import type { StatusText } from "../lib/riskEngine";
import type { DataSource } from "../lib/types";
import type { HardwareStatus } from "../hooks/useFoodGuardian";

interface HeaderProps {
  status: StatusText;
  soundEnabled: boolean;
  onToggleSound: () => void;
  dataSource: DataSource;
  hardwareStatus: HardwareStatus;
  onConnectHardware: () => void;
  onDisconnectHardware: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  onOpenShortcuts?: () => void;
}

export function Header({
  status,
  soundEnabled,
  onToggleSound,
  dataSource,
  hardwareStatus,
  onConnectHardware,
  onDisconnectHardware,
  activeSection,
  onSelectSection,
  onOpenShortcuts,
}: HeaderProps) {
  const style = statusStyle(status);
  const isHardwareConnected = hardwareStatus === "connected" && dataSource === "hardware";

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#08090a]/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectSection("console")}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5e6ad2] to-[#3b49b8] p-[1px] shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-[7px] bg-[#0d0e12] flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-indigo-400">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-[#f2f5f8] group-hover:text-white transition-colors">
                Food Guardian
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-[#8f96a3] bg-white/[0.04] border border-white/[0.06]">
                ATmega328P
              </span>
            </div>
          </button>
        </div>

        {/* Linear Segmented Nav */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-[#12141a] border border-white/[0.06]">
          <button
            type="button"
            onClick={() => onSelectSection("console")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeSection === "console"
                ? "bg-white/[0.08] text-white shadow-xs"
                : "text-[#8f96a3] hover:text-[#d0d6e0] hover:bg-white/[0.03]"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Telemetry
          </button>
          <button
            type="button"
            onClick={() => onSelectSection("terminal")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeSection === "terminal"
                ? "bg-white/[0.08] text-white shadow-xs"
                : "text-[#8f96a3] hover:text-[#d0d6e0] hover:bg-white/[0.03]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Serial Log
          </button>
          <button
            type="button"
            onClick={() => onSelectSection("circuit")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeSection === "circuit"
                ? "bg-white/[0.08] text-white shadow-xs"
                : "text-[#8f96a3] hover:text-[#d0d6e0] hover:bg-white/[0.03]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Firmware &amp; Specs
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live Status Pill */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-mono font-medium transition-all ${style.bg} ${style.border} ${style.text}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`}
              />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
            </span>
            <span>{status}</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? "Mute Buzzer Tone (M)" : "Enable Buzzer Audio (M)"}
            className={`p-1.5 rounded-md border text-xs font-medium transition-all ${
              soundEnabled
                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25"
                : "bg-white/[0.03] border-white/[0.06] text-[#8f96a3] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* USB Serial Button */}
          <button
            type="button"
            onClick={isHardwareConnected ? onDisconnectHardware : onConnectHardware}
            disabled={hardwareStatus === "unsupported" || hardwareStatus === "connecting"}
            title={
              hardwareStatus === "unsupported"
                ? "Web Serial API unavailable in this browser"
                : isHardwareConnected
                ? "Disconnect USB Arduino"
                : "Connect real Arduino Uno over Web Serial"
            }
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              isHardwareConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                : "bg-white/[0.03] border-white/[0.06] text-[#8f96a3] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>{isHardwareConnected ? "USB: Live" : "Connect USB"}</span>
          </button>

          {/* Keyboard shortcuts trigger */}
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts (?)"
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#8f96a3] hover:text-white hover:bg-white/[0.06] text-xs font-mono transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <kbd className="text-[10px] bg-white/[0.06] px-1 rounded text-[#8f96a3]">?</kbd>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
