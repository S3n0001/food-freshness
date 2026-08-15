import { FOOD_BUTTONS } from "../lib/foodTypes";
import type { FoodType } from "../lib/foodTypes";
import { FoodIcon } from "./FoodIcons";
import { Check } from "lucide-react";

interface FoodSelectorProps {
  selected: FoodType;
  onSelect: (food: FoodType) => void;
}

const FOOD_DESCRIPTIONS: Record<string, string> = {
  MILK: "High sensitivity · Temp 4°C · Moisture 60%",
  MEAT: "Strict limit · Temp 5°C · High risk fast",
  FRUIT: "Moderate decay · Temp 8°C · Humid tolerant",
  VEG: "High moisture tolerance · Temp 10°C",
};

/** Replica of the four physical push buttons wired to BUTTON_MILK/MEAT/FRUIT/VEG. */
export function FoodSelector({ selected, onSelect }: FoodSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#8f96a3] uppercase">
            FOOD TYPE SELECTOR
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#5f6573] bg-white/[0.04] border border-white/[0.06]">
            INPUT_PULLUP
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#5f6573]">HOTKEYS 1-4</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FOOD_BUTTONS.map(({ food, label, pin }, idx) => {
          const active = selected === food;
          return (
            <button
              key={food}
              type="button"
              onClick={() => onSelect(food)}
              aria-pressed={active}
              className={`group relative text-left rounded-xl p-3 border transition-all duration-150 flex flex-col justify-between ${
                active
                  ? "bg-[#181b24] border-indigo-500/50 shadow-[0_0_20px_-4px_rgba(94,106,210,0.3)] linear-border-top-sheen"
                  : "bg-[#0e1017] border-white/[0.07] hover:border-white/[0.14] hover:bg-[#13151e]"
              }`}
            >
              {/* Top Row: Pin & Icon */}
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                  <div className="w-5 h-5">
                    <FoodIcon food={food} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-[#5f6573] px-1.5 py-0.5 rounded bg-white/[0.03]">
                    {pin}
                  </span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Label & Description */}
              <div>
                <div className="flex items-baseline justify-between">
                  <span
                    className={`font-semibold text-sm tracking-tight ${
                      active ? "text-white" : "text-[#d0d6e0] group-hover:text-white"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-[10px] font-mono text-[#5f6573] opacity-60">
                    [{idx + 1}]
                  </span>
                </div>
                <p className="mt-1 text-[10px] leading-tight text-[#8f96a3] line-clamp-1">
                  {FOOD_DESCRIPTIONS[label] || "Target monitoring profile"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
