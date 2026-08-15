import { useEffect, useRef, useState } from "react";
import { Terminal, Copy, Check, Trash2, ArrowDown } from "lucide-react";

interface SerialMonitorProps {
  lines: string[];
  onClear?: () => void;
}

function lineClass(line: string): string {
  if (line.startsWith("ERROR")) return "text-rose-400 font-semibold bg-rose-500/10 px-1 rounded";
  if (line.startsWith("Status")) {
    if (line.includes("CRITICAL")) return "text-rose-400 font-bold bg-rose-500/15 px-1 rounded";
    if (line.includes("HIGH RISK")) return "text-orange-400 font-semibold";
    if (line.includes("WARNING")) return "text-amber-400 font-semibold";
    if (line.includes("SAFE")) return "text-emerald-400 font-semibold";
  }
  if (line.startsWith("---")) return "text-[#363a45] select-none";
  if (line.startsWith("Fan") && line.includes("ON")) return "text-sky-300 font-medium";
  if (line.startsWith("Food")) return "text-indigo-300 font-semibold";
  if (line.startsWith("Storage")) return "text-[#8f96a3]";
  return "text-[#c2c8d2]";
}

/** Linear-style Terminal replica of the Arduino Serial Monitor at 9600 baud. */
export function SerialMonitor({ lines, onClear }: SerialMonitorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, autoScroll]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#0b0c10] border border-white/[0.08] shadow-2xl overflow-hidden linear-border-top-sheen">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#12141a] border-b border-white/[0.07]">
        {/* Left window controls & title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="h-3.5 w-[1px] bg-white/[0.1] mx-0.5" />

          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-xs font-semibold text-[#f2f5f8]">
              Serial Monitor
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#8f96a3] bg-white/[0.04] border border-white/[0.06]">
              9600 BAUD · COM
            </span>
          </div>
        </div>

        {/* Right terminal actions */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Autoscroll toggle */}
          <button
            type="button"
            onClick={() => setAutoScroll((v) => !v)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors ${
              autoScroll
                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                : "text-[#8f96a3] hover:text-white bg-white/[0.03]"
            }`}
            title="Toggle Auto-scroll"
          >
            <ArrowDown className="w-2.5 h-2.5" />
            <span>{autoScroll ? "AUTOSCROLL" : "MANUAL"}</span>
          </button>

          {/* Copy logs */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[#8f96a3] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
            title="Copy Terminal Output"
          >
            {copied ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
            <span>{copied ? "COPIED" : "COPY"}</span>
          </button>

          {/* Clear terminal */}
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[#8f96a3] hover:text-rose-400 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors"
              title="Clear Log"
            >
              <Trash2 className="w-2.5 h-2.5" />
              <span>CLEAR</span>
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="h-72 sm:h-80 overflow-y-auto scrollbar-linear px-4 py-3 font-mono text-[12px] sm:text-[12.5px] leading-[1.6] bg-[#07080b]"
      >
        {lines.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5f6573] gap-2">
            <Terminal className="w-6 h-6 opacity-40 animate-pulse" />
            <span>Waiting for initial sensor read packet from loop()...</span>
          </div>
        ) : (
          lines.map((line, i) => (
            <div key={i} className="flex items-baseline gap-3 hover:bg-white/[0.02] -mx-2 px-2 py-0.5 rounded">
              <span className="select-none text-[#3a3f4d] text-[10px] w-7 text-right shrink-0">
                {i + 1}
              </span>
              <span className={`${lineClass(line)} break-all`}>{line || "\u00a0"}</span>
            </div>
          ))
        )}
      </div>

      {/* Terminal Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0e1017] border-t border-white/[0.06] text-[10px] font-mono text-[#5f6573]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>FIRMWARE TX: ACTIVE</span>
        </div>
        <span>{lines.length} LINES RECORDED</span>
      </div>
    </div>
  );
}
