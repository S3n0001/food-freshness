import {
  BUZZER_CRITICAL_INTERVAL_MS,
  BUZZER_CRITICAL_TONE_HZ,
  BUZZER_CRITICAL_TONE_MS,
  BUZZER_WARNING_INTERVAL_MS,
  BUZZER_WARNING_TONE_HZ,
  BUZZER_WARNING_TONE_MS,
  RISK_HIGH_MAX,
  RISK_SAFE_MAX,
  RISK_WARNING_MAX,
} from "./constants";
import { constrainValue } from "./arduinoMath";
import { FoodType } from "./foodTypes";

export type StatusText = "SAFE" | "WARNING" | "HIGH RISK" | "CRITICAL";

/**
 * Direct port of `calculateRisk()`. MILK and MEAT share one scoring table,
 * FRUIT and VEGETABLE share another, exactly as written in the sketch.
 */
export function calculateRiskScore(
  food: FoodType,
  temperature: number,
  humidity: number,
  moisturePercent: number,
): number {
  let riskScore = 0;

  if (food === FoodType.MILK || food === FoodType.MEAT) {
    if (temperature >= 35) riskScore += 45;
    else if (temperature >= 30) riskScore += 35;
    else if (temperature >= 25) riskScore += 20;

    if (humidity >= 85) riskScore += 30;
    else if (humidity >= 75) riskScore += 20;
    else if (humidity >= 65) riskScore += 10;

    if (moisturePercent >= 80) riskScore += 25;
    else if (moisturePercent >= 60) riskScore += 15;
  } else {
    if (temperature >= 35) riskScore += 30;
    else if (temperature >= 30) riskScore += 20;
    else if (temperature >= 27) riskScore += 10;

    if (humidity >= 90) riskScore += 40;
    else if (humidity >= 80) riskScore += 30;
    else if (humidity >= 70) riskScore += 15;

    if (moisturePercent >= 80) riskScore += 30;
    else if (moisturePercent >= 60) riskScore += 20;
  }

  return constrainValue(riskScore, 0, 100);
}

/** Direct port of the status thresholds at the end of `calculateRisk()`. */
export function statusFromRisk(riskScore: number): StatusText {
  if (riskScore <= RISK_SAFE_MAX) return "SAFE";
  if (riskScore <= RISK_WARNING_MAX) return "WARNING";
  if (riskScore <= RISK_HIGH_MAX) return "HIGH RISK";
  return "CRITICAL";
}

/** Direct port of `controlFan()` — the relay (and cooling fan) engages above SAFE. */
export function fanShouldRun(riskScore: number): boolean {
  return riskScore > RISK_SAFE_MAX;
}

export interface BuzzerTone {
  frequencyHz: number;
  durationMs: number;
  intervalMs: number;
}

/** Direct port of the two-speed beep pattern inside `controlBuzzer()`. */
export function buzzerToneFor(riskScore: number): BuzzerTone | null {
  if (riskScore <= RISK_WARNING_MAX) return null;
  if (riskScore <= RISK_HIGH_MAX) {
    return {
      frequencyHz: BUZZER_WARNING_TONE_HZ,
      durationMs: BUZZER_WARNING_TONE_MS,
      intervalMs: BUZZER_WARNING_INTERVAL_MS,
    };
  }
  return {
    frequencyHz: BUZZER_CRITICAL_TONE_HZ,
    durationMs: BUZZER_CRITICAL_TONE_MS,
    intervalMs: BUZZER_CRITICAL_INTERVAL_MS,
  };
}
