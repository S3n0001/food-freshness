import { FoodType } from "./foodTypes";

export type ScenarioId = "manual" | "normal" | "door-ajar" | "compressor-fail" | "spoiling-produce";

interface Keyframe {
  t: number;
  temperature: number;
  humidity: number;
  moistureRaw: number;
}

export interface ScenarioDef {
  id: ScenarioId;
  label: string;
  tagline: string;
  description: string;
  autoFood?: FoodType;
  holdSec: number;
  keyframes: Keyframe[];
}

export const SCENARIOS: ScenarioDef[] = [
  {
    id: "manual",
    label: "Manual control",
    tagline: "You are the sensor",
    description: "Drag the sensor sliders yourself and watch the firmware react in real time.",
    holdSec: 0,
    keyframes: [],
  },
  {
    id: "normal",
    label: "Normal operation",
    tagline: "Cold, dry, quiet",
    description: "A healthy fridge holding steady at ~5\u00b0C. Fan off, buzzer silent, status SAFE.",
    autoFood: FoodType.MILK,
    holdSec: 8,
    keyframes: [
      { t: 0, temperature: 4.5, humidity: 58, moistureRaw: 820 },
      { t: 8, temperature: 4.5, humidity: 58, moistureRaw: 820 },
    ],
  },
  {
    id: "door-ajar",
    label: "Door left ajar",
    tagline: "Slow creep to spoilage",
    description: "The seal didn't catch. Warm, humid air seeps in over two minutes until the guardian intervenes.",
    autoFood: FoodType.MEAT,
    holdSec: 15,
    keyframes: [
      { t: 0, temperature: 4, humidity: 58, moistureRaw: 820 },
      { t: 40, temperature: 14, humidity: 66, moistureRaw: 700 },
      { t: 80, temperature: 22, humidity: 76, moistureRaw: 560 },
      { t: 120, temperature: 28, humidity: 83, moistureRaw: 400 },
    ],
  },
  {
    id: "compressor-fail",
    label: "Compressor failure",
    tagline: "Fast, severe, loud",
    description: "The compressor cuts out entirely. Temperature climbs fast \u2014 expect CRITICAL within a minute.",
    autoFood: FoodType.MEAT,
    holdSec: 20,
    keyframes: [
      { t: 0, temperature: 4, humidity: 60, moistureRaw: 800 },
      { t: 20, temperature: 15, humidity: 69, moistureRaw: 660 },
      { t: 40, temperature: 25, humidity: 79, moistureRaw: 480 },
      { t: 60, temperature: 33, humidity: 88, moistureRaw: 280 },
      { t: 75, temperature: 37, humidity: 93, moistureRaw: 140 },
    ],
  },
  {
    id: "spoiling-produce",
    label: "Spoiling produce",
    tagline: "Humidity is the enemy",
    description: "Fruit & veg thresholds are humidity-led. Watch how the same fridge behaves differently for produce.",
    autoFood: FoodType.FRUIT,
    holdSec: 20,
    keyframes: [
      { t: 0, temperature: 10, humidity: 70, moistureRaw: 750 },
      { t: 30, temperature: 18, humidity: 82, moistureRaw: 600 },
      { t: 60, temperature: 24, humidity: 91, moistureRaw: 450 },
      { t: 90, temperature: 29, humidity: 95, moistureRaw: 250 },
      { t: 110, temperature: 33, humidity: 96, moistureRaw: 150 },
    ],
  },
];

export function getScenario(id: ScenarioId): ScenarioDef {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

function lerp(a: number, b: number, f: number): number {
  return a + (b - a) * f;
}

export interface ScenarioSample {
  temperature: number;
  humidity: number;
  moistureRaw: number;
}

/** Piecewise-linear interpolation across a scenario's keyframes, holding at the last frame. */
export function sampleScenario(def: ScenarioDef, tSec: number): ScenarioSample {
  const frames = def.keyframes;
  if (frames.length === 0) {
    return { temperature: 4, humidity: 58, moistureRaw: 820 };
  }
  if (tSec <= frames[0].t) return { ...frames[0] };
  const last = frames[frames.length - 1];
  if (tSec >= last.t) return { ...last };

  for (let i = 0; i < frames.length - 1; i++) {
    const a = frames[i];
    const b = frames[i + 1];
    if (tSec >= a.t && tSec <= b.t) {
      const f = (tSec - a.t) / (b.t - a.t);
      return {
        temperature: lerp(a.temperature, b.temperature, f),
        humidity: lerp(a.humidity, b.humidity, f),
        moistureRaw: lerp(a.moistureRaw, b.moistureRaw, f),
      };
    }
  }
  return { ...last };
}

/** Total playback length before the scenario loops back to its first keyframe. */
export function scenarioCycleSec(def: ScenarioDef): number {
  if (def.keyframes.length === 0) return 0;
  const last = def.keyframes[def.keyframes.length - 1];
  return last.t + def.holdSec;
}
