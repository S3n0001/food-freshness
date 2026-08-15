import { useState } from "react";
import { FIRMWARE_SOURCE } from "../lib/firmwareSource";
import { Cpu, Copy, Check, ChevronDown, ChevronUp, Code2, CircuitBoard, Layers } from "lucide-react";

const PINOUT: { signal: string; pin: string; mode: string; role: string }[] = [
  { signal: "DHT11 Sensor Data", pin: "D2", mode: "DHT.begin()", role: "Digital temp & humidity readings" },
  { signal: "Soil / Moisture Probe", pin: "A0", mode: "analogRead()", role: "0-1023 ADC mapped to 0-100%" },
  { signal: "Piezo Buzzer Alarm", pin: "D9", mode: "tone() / noTone()", role: "2000Hz (Warn) / 2500Hz (Alarm)" },
  { signal: "Relay Fan Control", pin: "D10", mode: "OUTPUT (LOW = ON)", role: "12V Cooling fan triggered >25 risk" },
  { signal: "Button — MILK", pin: "D11", mode: "INPUT_PULLUP", role: "Select Milk monitoring profile" },
  { signal: "Button — MEAT", pin: "D12", mode: "INPUT_PULLUP", role: "Select Meat monitoring profile" },
  { signal: "Button — FRUIT", pin: "A1", mode: "INPUT_PULLUP", role: "Select Fruit monitoring profile" },
  { signal: "Button — VEG", pin: "A2", mode: "INPUT_PULLUP", role: "Select Vegetable profile" },
  { signal: "LCD1602 HD44780", pin: "7, 6, 5, 4, 3, 8", mode: "LiquidCrystal", role: "RS, E, D4-D7 4-bit bus interface" },
];

const FIRMWARE_MAP: { title: string; logic: string; sketchMethod: string }[] = [
  {
    title: "Risk Engine Thresholds",
    logic: "Risk 0-25 (Safe) · 25-50 (Warning) · 50-75 (High Risk) · 75-100 (Critical)",
    sketchMethod: "calculateRisk()",
  },
  {
    title: "Cooling Fan Actuation",
    logic: "Relay energized LOW when risk > 25 to circulate air and lower humidity",
    sketchMethod: "controlFan()",
  },
  {
    title: "Dual-Tier Piezo Buzzer",
    logic: "2000 Hz / 300ms pulsing for Warning; 2500 Hz / 500ms rapid beeps for Critical",
    sketchMethod: "controlBuzzer()",
  },
  {
    title: "5-Page LCD Character Matrix",
    logic: "Cycles through Food/Status, Temp, Humidity, Moisture, and Elapsed Time every 3s",
    sketchMethod: "displayLCD()",
  },
  {
    title: "Hardware Serial Stream",
    logic: "Structured multi-line telemetry block emitted to USB at 9600 baud every 2000ms",
    sketchMethod: "printSerialData()",
  },
  {
    title: "Button Debounce Hardware Guard",
    logic: "300ms software lockout to suppress mechanical switch bounce",
    sketchMethod: "checkButtons()",
  },
];

export function CircuitSection() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(FIRMWARE_SOURCE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="circuit" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CircuitBoard className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-xs tracking-wider text-indigo-400 uppercase font-semibold">
            HARDWARE SPECIFICATION &amp; SKETCH
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f2f5f8]">
          Firmware-Accurate Technical Architecture
        </h2>
        <p className="mt-2 max-w-3xl text-sm sm:text-base text-[#8f96a3] leading-relaxed">
          Every threshold, pin assignment, and timing cadence simulated in this web application is ported
          verbatim from <span className="text-[#f2f5f8] font-mono font-medium">Food_Guardian.ino</span>. You can flash this
          exact sketch directly to any Arduino Uno board.
        </p>
      </div>

      {/* Grid: Pinout Table & Firmware Architecture */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Pinout Card */}
        <div className="rounded-xl bg-[#0f1117] border border-white/[0.08] p-4 sm:p-5 linear-border-top-sheen shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-sm text-[#f2f5f8]">Microcontroller Pinout Matrix</h3>
            </div>
            <span className="text-[10px] font-mono text-[#5f6573] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              ATmega328P
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-linear">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[#5f6573] font-mono text-[10px] uppercase">
                  <th className="pb-2 font-medium">Signal &amp; Peripheral</th>
                  <th className="pb-2 font-medium">Pin</th>
                  <th className="pb-2 font-medium">Mode</th>
                  <th className="pb-2 font-medium hidden sm:table-cell">Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono">
                {PINOUT.map((row) => (
                  <tr key={row.signal} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 pr-2 font-sans text-xs text-[#d0d6e0] font-medium">{row.signal}</td>
                    <td className="py-2.5 pr-2 text-indigo-300 font-semibold">{row.pin}</td>
                    <td className="py-2.5 pr-2 text-[#8f96a3] text-[11px]">{row.mode}</td>
                    <td className="py-2.5 text-[#5f6573] text-[11px] font-sans hidden sm:table-cell">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Firmware Mapping Card */}
        <div className="rounded-xl bg-[#0f1117] border border-white/[0.08] p-4 sm:p-5 linear-border-top-sheen shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-[#f2f5f8]">Firmware Logic Map</h3>
            </div>
            <span className="text-[10px] font-mono text-[#5f6573] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
              6 Subroutines
            </span>
          </div>

          <div className="space-y-2.5">
            {FIRMWARE_MAP.map((item) => (
              <div
                key={item.title}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[#f2f5f8]">{item.title}</span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {item.sketchMethod}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#8f96a3] leading-relaxed">{item.logic}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arduino Sketch Viewer */}
      <div className="rounded-xl bg-[#0b0c10] border border-white/[0.08] overflow-hidden shadow-xl linear-border-top-sheen">
        <div className="flex items-center justify-between px-4 py-3 bg-[#12141a] border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-xs font-semibold text-[#f2f5f8]">
              Food_Guardian.ino
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#8f96a3] bg-white/[0.04] border border-white/[0.06]">
              Arduino C++ · 284 lines
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-[#8f96a3] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "COPIED" : "COPY SKETCH"}</span>
            </button>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
            >
              <span>{expanded ? "COLLAPSE" : "EXPAND FULL"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <pre
          className={`px-4 py-3.5 font-mono text-[11.5px] sm:text-[12px] leading-[1.65] text-[#b8c0cc] overflow-auto scrollbar-linear whitespace-pre bg-[#07080b] ${
            expanded ? "max-h-[600px]" : "max-h-[220px]"
          }`}
        >
          {FIRMWARE_SOURCE}
        </pre>
      </div>
    </section>
  );
}
