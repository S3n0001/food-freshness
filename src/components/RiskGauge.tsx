import { statusStyle } from "../lib/statusStyle";
import type { StatusText } from "../lib/riskEngine";
import { ShieldCheck, AlertTriangle, Flame, AlertOctagon } from "lucide-react";

interface RiskGaugeProps {
  riskScore: number;
  status: StatusText;
}

const CX = 100;
const CY = 92;
const R = 72;

function angleForValue(value: number) {
  // 0 -> 180° (left), 100 -> 0° (right)
  return 180 - (value / 100) * 180;
}

function polarToCartesian(angleDeg: number, radius = R) {
  const rad = (Math.PI / 180) * angleDeg;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  };
}

export function RiskGauge({ riskScore, status }: RiskGaugeProps) {
  const style = statusStyle(status);
  const clampedScore = Math.min(100, Math.max(0, riskScore));
  const needleAngle = angleForValue(clampedScore);
  const needleTip = polarToCartesian(needleAngle, R - 6);
  const needleBase = polarToCartesian(needleAngle, 18);

  const getStatusIcon = () => {
    switch (status) {
      case "SAFE":
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case "WARNING":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "HIGH RISK":
        return <Flame className="w-3.5 h-3.5" />;
      case "CRITICAL":
        return <AlertOctagon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full sm:w-[260px] rounded-xl bg-[#0e1017] border border-white/[0.08] p-4 flex flex-col items-center justify-between shadow-md linear-border-top-sheen">
      {/* Gauge Header */}
      <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-white/[0.06] text-xs font-mono">
        <span className="text-[11px] font-medium text-[#8f96a3]">RISK TELEMETRY</span>
        <span className="text-[10px] text-[#5f6573]">0 - 100 SCALE</span>
      </div>

      {/* SVG Radial Arc */}
      <div className="relative my-1">
        <svg viewBox="0 0 200 115" className="w-48 h-auto overflow-visible">
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke={style.hex}
            strokeWidth="10"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${clampedScore} ${100 - clampedScore}`}
            className="transition-all duration-500 ease-out"
            filter="url(#gauge-glow)"
          />

          {/* Threshold Tick Marks */}
          {[
            { val: 0, label: "0" },
            { val: 25, label: "25" },
            { val: 50, label: "50" },
            { val: 75, label: "75" },
            { val: 100, label: "100" },
          ].map((tick) => {
            const a = angleForValue(tick.val);
            const p1 = polarToCartesian(a, R - 9);
            const p2 = polarToCartesian(a, R + 7);
            const labelPos = polarToCartesian(a, R + 18);
            return (
              <g key={tick.val}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1.5"
                />
                <text
                  x={labelPos.x}
                  y={labelPos.y + 3}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="7.5"
                  fill="#5f6573"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Central Pivot & Needle */}
          <circle cx={CX} cy={CY} r="6" fill="#181b22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line
            x1={needleBase.x}
            y1={needleBase.y}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
          <circle cx={CX} cy={CY} r="2.5" fill={style.hex} />
        </svg>
      </div>

      {/* Numerical & Status Readout */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-white/[0.06]">
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-mono text-2xl font-bold tracking-tight tabular-nums"
            style={{ color: style.hex }}
          >
            {clampedScore}
          </span>
          <span className="text-[10px] font-mono text-[#5f6573]">/ 100</span>
        </div>

        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono font-medium ${style.bg} ${style.border} ${style.text}`}
        >
          {getStatusIcon()}
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
}
