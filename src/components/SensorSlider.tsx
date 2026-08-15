interface SensorSliderProps {
  label: string;
  pin?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  displayValue?: string;
  onChange: (value: number) => void;
  accent?: string;
  disabled?: boolean;
  presets?: { label: string; val: number }[];
}

/** Linear precision sensor slider with preset pills and live telemetry track */
export function SensorSlider({
  label,
  pin,
  value,
  min,
  max,
  step = 1,
  unit,
  displayValue,
  onChange,
  accent = "#5e6ad2",
  disabled,
  presets,
}: SensorSliderProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`space-y-1.5 ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label className="font-mono text-[11px] font-semibold tracking-wider text-[#8f96a3] uppercase">
            {label}
          </label>
          {pin && (
            <span className="text-[9px] font-mono text-[#5f6573] px-1 py-0.2 rounded bg-white/[0.04]">
              {pin}
            </span>
          )}
        </div>

        {/* Live Value Pill */}
        <div className="flex items-baseline gap-1 font-mono text-xs text-[#f2f5f8] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06] tabular-nums">
          <span className="font-semibold">{displayValue ?? value}</span>
          {unit && <span className="text-[#5f6573] text-[10px]">{unit}</span>}
        </div>
      </div>

      {/* Slider Input */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, ${accent} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
          }}
        />
      </div>

      {/* Quick Presets (if provided) */}
      {presets && presets.length > 0 && !disabled && (
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-[9px] font-mono text-[#5f6573]">PRESETS:</span>
          <div className="flex flex-wrap gap-1">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.val)}
                className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#8f96a3] bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/[0.05] transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
