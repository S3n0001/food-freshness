import type { LcdFrame } from "../lib/lcd";

const COLS = 16;

function padLine(text: string): string {
  return text.length >= COLS ? text.slice(0, COLS) : text.padEnd(COLS, " ");
}

interface LcdDisplayProps {
  frame: LcdFrame;
  screenIndex?: number;
}

/** Pixel-precise digital replica of the 16x2 HD44780 character LCD wired to pins 7,6,5,4,3,8. */
export function LcdDisplay({ frame, screenIndex = 0 }: LcdDisplayProps) {
  const lines = [padLine(frame.line1), padLine(frame.line2)];

  return (
    <div className="w-full rounded-xl bg-[#0e1017] border border-white/[0.08] p-3 shadow-md linear-border-top-sheen">
      {/* LCD Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          <span className="text-[11px] font-medium text-[#8f96a3]">LCD1602 · HD44780</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#5f6573]">PAGE</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  screenIndex === idx
                    ? "bg-cyan-400 scale-125 shadow-[0_0_6px_#38bdf8]"
                    : "bg-white/[0.12]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 16x2 Pixel Matrix Display Surface */}
      <div className="relative rounded-lg bg-[#04080e] border border-cyan-500/20 p-3 overflow-hidden shadow-inner">
        {/* Subtle Scanline Texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.8) 0px, rgba(0,0,0,0.8) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Matrix Characters with Phosphor Glow */}
        <div className="font-mono text-sm sm:text-[15px] font-semibold leading-[1.65] text-cyan-300 tracking-[0.14em] whitespace-pre select-none drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          <div>{lines[0]}</div>
          <div>{lines[1]}</div>
        </div>
      </div>

      {/* Hardware Pins Silk-screen Sub-footer */}
      <div className="flex items-center justify-between mt-2 pt-1.5 text-[9px] font-mono text-[#5f6573]">
        <span>PINS: RS:7 E:6 D4:5 D5:4 D6:3 D7:8</span>
        <span>CADENCE: 3000ms</span>
      </div>
    </div>
  );
}
