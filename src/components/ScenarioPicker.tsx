import { SCENARIOS, getScenario, scenarioCycleSec, type ScenarioId } from "../lib/scenarios";
import { Sliders, ShieldCheck, DoorOpen, ZapOff, Sparkles, CheckCircle2 } from "lucide-react";

interface ScenarioPickerProps {
  scenarioId: ScenarioId;
  elapsedSec: number;
  onSelect: (id: ScenarioId) => void;
}

const SCENARIO_ICONS: Record<ScenarioId, typeof Sliders> = {
  manual: Sliders,
  normal: ShieldCheck,
  "door-ajar": DoorOpen,
  "compressor-fail": ZapOff,
  "spoiling-produce": Sparkles,
};

export function ScenarioPicker({ scenarioId, elapsedSec, onSelect }: ScenarioPickerProps) {
  const active = getScenario(scenarioId);
  const cycle = scenarioCycleSec(active);
  const progress = cycle > 0 ? Math.min(100, (elapsedSec / cycle) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#8f96a3] uppercase">
            SIMULATION SCENARIOS
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#5f6573] bg-white/[0.04] border border-white/[0.06]">
            {SCENARIOS.length} PRESETS
          </span>
        </div>
        {cycle > 0 && (
          <span className="font-mono text-[10px] text-[#8f96a3] bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
            {Math.round(elapsedSec)}s / {cycle}s
          </span>
        )}
      </div>

      {/* Scenario List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
        {SCENARIOS.map((s) => {
          const isActive = s.id === scenarioId;
          const Icon = SCENARIO_ICONS[s.id] || Sliders;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`w-full text-left rounded-lg p-2.5 border transition-all duration-150 flex items-center justify-between gap-3 ${
                isActive
                  ? "bg-[#181b24] border-indigo-500/40 shadow-xs linear-border-top-sheen"
                  : "bg-[#0e1017] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#13151e]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-white/[0.04] text-[#8f96a3] border border-white/[0.06]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-xs truncate ${
                        isActive ? "text-white" : "text-[#d0d6e0]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#5f6573] truncate leading-tight mt-0.5">
                    {s.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isActive ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    RUNNING
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#5f6573] hover:text-[#8f96a3]">
                    SELECT
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Details & Progress Bar */}
      <div className="mt-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
        <p className="text-xs text-[#8f96a3] leading-relaxed">{active.description}</p>
        {cycle > 0 && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#5f6573] mb-1">
              <span>CYCLE TIMELINE</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
