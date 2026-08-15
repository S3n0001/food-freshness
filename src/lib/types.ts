import type { FoodType } from "./foodTypes";
import type { StatusText } from "./riskEngine";

/** The full set of readings/derived values the console renders each tick. */
export interface GuardianSnapshot {
  food: FoodType;
  temperature: number;
  humidity: number;
  moistureRaw: number;
  moisturePercent: number;
  riskScore: number;
  status: StatusText;
  fanOn: boolean;
  storageElapsedMs: number;
  sensorFault: boolean;
}

export type DataSource = "demo" | "hardware";
