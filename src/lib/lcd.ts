import { getFoodName } from "./foodTypes";
import type { GuardianSnapshot } from "./types";

export interface LcdFrame {
  line1: string;
  line2: string;
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function splitStorage(elapsedMs: number): { hours: number; minutes: number; seconds: number } {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

/** hh:mm:ss readout used outside the LCD replica (the LCD itself only shows hh/mm, per the sketch). */
export function formatStorageClock(elapsedMs: number): string {
  const { hours, minutes, seconds } = splitStorage(elapsedMs);
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

/** Transient splash shown by `showFoodSelection()` right after a button press. */
export function foodSelectedFrame(snapshot: GuardianSnapshot): LcdFrame {
  return { line1: "FOOD SELECTED:", line2: getFoodName(snapshot.food) };
}

/**
 * Direct port of `displayLCD()`. `screen` is the 0-4 rotation index
 * (`lcdScreen`) — the sketch cycles through these every LCD_INTERVAL.
 */
export function buildLcdFrame(screen: number, snapshot: GuardianSnapshot): LcdFrame {
  switch (screen) {
    case 0:
      return {
        line1: `FOOD:${getFoodName(snapshot.food)}`,
        line2: `T:${snapshot.temperature.toFixed(1)}C H:${Math.round(snapshot.humidity)}%`,
      };
    case 1:
      return {
        line1: `MOISTURE:${snapshot.moisturePercent}%`,
        line2: `RISK:${snapshot.riskScore}%`,
      };
    case 2:
      return { line1: "STATUS:", line2: snapshot.status };
    case 3: {
      const { hours, minutes } = splitStorage(snapshot.storageElapsedMs);
      return { line1: "STORAGE TIME", line2: `${pad2(hours)}h ${pad2(minutes)}m` };
    }
    default: {
      const fanLine = snapshot.riskScore > 25 ? "ON" : "OFF";
      let advisory: string;
      if (snapshot.riskScore > 75) advisory = "CHECK FOOD!";
      else if (snapshot.riskScore > 50) advisory = "HIGH RISK";
      else if (snapshot.riskScore > 25) advisory = "VENTILATING";
      else advisory = "MONITORING";
      return { line1: `FAN:${fanLine}`, line2: advisory };
    }
  }
}
