import { getFoodName } from "./foodTypes";
import type { GuardianSnapshot } from "./types";

const RULE = "------------------------------";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Direct port of `printSerialData()`. `Serial.print(float)` defaults to 2 decimals. */
export function buildSerialBlock(snapshot: GuardianSnapshot): string {
  const totalSeconds = Math.floor(snapshot.storageElapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const lines = [
    RULE,
    `Food        : ${getFoodName(snapshot.food)}`,
    `Temperature : ${snapshot.temperature.toFixed(2)} C`,
    `Humidity    : ${snapshot.humidity.toFixed(2)} %`,
    `Moisture    : ${snapshot.moisturePercent} %`,
    `Risk Score  : ${snapshot.riskScore} %`,
    `Status      : ${snapshot.status}`,
    `Fan         : ${snapshot.riskScore > 25 ? "ON" : "OFF"}`,
    `Storage     : ${pad2(hours)}h ${pad2(minutes)}m`,
    RULE,
  ];

  return lines.join("\n");
}

/** Matches `Serial.println("ERROR: DHT11 reading failed!");` from `readSensors()`. */
export const DHT_FAULT_LINE = "ERROR: DHT11 reading failed!";

/**
 * Regex-based parser for the exact block above. Lets the console read a
 * *real* Arduino's Serial output (see serialProtocol.ts) instead of the
 * simulated engine, using the sketch unmodified.
 */
export function parseSerialBlock(block: string): Partial<GuardianSnapshot> | null {
  const get = (label: string): string | null => {
    const match = block.match(new RegExp(`${label}\\s*:\\s*(.+)`));
    return match ? match[1].trim() : null;
  };

  const foodRaw = get("Food");
  const tempRaw = get("Temperature");
  const humRaw = get("Humidity");
  const moistRaw = get("Moisture");
  const riskRaw = get("Risk Score");
  const statusRaw = get("Status");
  const fanRaw = get("Fan");
  const storageRaw = get("Storage");

  if (!tempRaw && !statusRaw) return null;

  const partial: Partial<GuardianSnapshot> = {};
  if (foodRaw) partial.food = foodRaw.trim() as GuardianSnapshot["food"];
  if (tempRaw) partial.temperature = parseFloat(tempRaw);
  if (humRaw) partial.humidity = parseFloat(humRaw);
  if (moistRaw) partial.moisturePercent = parseInt(moistRaw, 10);
  if (riskRaw) partial.riskScore = parseInt(riskRaw, 10);
  if (statusRaw) partial.status = statusRaw.trim() as GuardianSnapshot["status"];
  if (fanRaw) partial.fanOn = fanRaw.trim() === "ON";
  if (storageRaw) {
    const m = storageRaw.match(/(\d+)h\s*(\d+)m/);
    if (m) partial.storageElapsedMs = (parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60) * 1000;
  }
  return partial;
}
