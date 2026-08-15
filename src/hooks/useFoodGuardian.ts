import { useCallback, useEffect, useRef, useState } from "react";
import { primeAudio, playTone } from "../lib/audio";
import {
  BUTTON_DELAY_MS,
  FOOD_SELECTED_SPLASH_MS,
  LCD_INTERVAL_MS,
  SENSOR_INTERVAL_MS,
} from "../lib/constants";
import { arduinoMap, constrainValue } from "../lib/arduinoMath";
import { FoodType } from "../lib/foodTypes";
import { buildLcdFrame, foodSelectedFrame, type LcdFrame } from "../lib/lcd";
import { buzzerToneFor, calculateRiskScore, fanShouldRun, statusFromRisk } from "../lib/riskEngine";
import { buildSerialBlock, DHT_FAULT_LINE } from "../lib/serialLog";
import {
  getScenario,
  sampleScenario,
  scenarioCycleSec,
  type ScenarioId,
} from "../lib/scenarios";
import { connectHardwareSerial, isWebSerialSupported, type HardwareLink } from "../lib/serialProtocol";
import { parseSerialBlock } from "../lib/serialLog";
import type { DataSource, GuardianSnapshot } from "../lib/types";

const TICK_MS = 100;
const MAX_LOG_LINES = 200;

export type HardwareStatus = "unsupported" | "idle" | "connecting" | "connected" | "error";

function nowMs(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

const INITIAL_SNAPSHOT: GuardianSnapshot = {
  food: FoodType.MEAT,
  temperature: 4,
  humidity: 58,
  moistureRaw: 820,
  moisturePercent: 19,
  riskScore: 0,
  status: "SAFE",
  fanOn: false,
  storageElapsedMs: 0,
  sensorFault: false,
};

export function useFoodGuardian() {
  const [snapshot, setSnapshot] = useState<GuardianSnapshot>(INITIAL_SNAPSHOT);
  const [ambient, setAmbient] = useState({
    temperature: INITIAL_SNAPSHOT.temperature,
    humidity: INITIAL_SNAPSHOT.humidity,
    moistureRaw: INITIAL_SNAPSHOT.moistureRaw,
  });
  const [lcd, setLcd] = useState<LcdFrame>({ line1: "FOOD GUARDIAN", line2: "Initializing..." });
  const [lcdScreenIndex, setLcdScreenIndex] = useState(0);
  const [serialLines, setSerialLines] = useState<string[]>([]);
  const [buzzerPulse, setBuzzerPulse] = useState(0);
  const [lastTone, setLastTone] = useState<{ freq: number; ms: number } | null>(null);
  const [scenarioId, setScenarioIdState] = useState<ScenarioId>("door-ajar");
  const [scenarioElapsedSec, setScenarioElapsedSec] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [dataSource, setDataSource] = useState<DataSource>("demo");
  const [hardwareStatus, setHardwareStatus] = useState<HardwareStatus>(
    isWebSerialSupported() ? "idle" : "unsupported",
  );
  const [hardwareError, setHardwareError] = useState<string | undefined>();

  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;
  const ambientRef = useRef(ambient);
  ambientRef.current = ambient;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;
  const dataSourceRef = useRef(dataSource);
  dataSourceRef.current = dataSource;

  const lastSensorReadRef = useRef(0);
  const lastLcdUpdateRef = useRef(0);
  const lastBeepRef = useRef(-Infinity);
  const lastButtonPressRef = useRef(-Infinity);
  const storageStartRef = useRef(nowMs());
  const scenarioStartRef = useRef(nowMs());
  const splashUntilRef = useRef(0);
  const pendingFaultRef = useRef(false);
  const lcdScreenRef = useRef(0);
  const hardwareLinkRef = useRef<HardwareLink | null>(null);
  const hardwareBlockRef = useRef<string[]>([]);

  const pushLog = useCallback((text: string) => {
    setSerialLines((prev) => {
      const next = [...prev, ...text.split("\n")];
      return next.length > MAX_LOG_LINES ? next.slice(next.length - MAX_LOG_LINES) : next;
    });
  }, []);

  // --- Demo engine tick -----------------------------------------------
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (dataSourceRef.current !== "demo") return;
      const t = nowMs();

      // Continuous "physical world" — always live so sliders/scenario feel alive,
      // independent of how often the firmware actually samples it below.
      const def = getScenario(scenarioId);
      if (def.keyframes.length > 0) {
        const cycle = scenarioCycleSec(def);
        const tSec = ((t - scenarioStartRef.current) / 1000) % (cycle > 0 ? cycle : 1);
        const sample = sampleScenario(def, tSec);
        setAmbient(sample);
        setScenarioElapsedSec(tSec);
      }

      // readSensors() + calculateRisk() + controlFan() + controlBuzzer() +
      // printSerialData(), gated by SENSOR_INTERVAL exactly like loop().
      if (t - lastSensorReadRef.current >= SENSOR_INTERVAL_MS) {
        lastSensorReadRef.current = t;

        const prev = snapshotRef.current;
        let next: GuardianSnapshot = { ...prev, sensorFault: false };

        if (pendingFaultRef.current) {
          pendingFaultRef.current = false;
          pushLog(DHT_FAULT_LINE);
          next = { ...prev, sensorFault: true };
        } else {
          const a = ambientRef.current;
          const moisturePercent = constrainValue(arduinoMap(a.moistureRaw, 1023, 0, 0, 100), 0, 100);
          next = {
            ...prev,
            temperature: a.temperature,
            humidity: a.humidity,
            moistureRaw: a.moistureRaw,
            moisturePercent,
            sensorFault: false,
          };
        }

        const riskScore = calculateRiskScore(next.food, next.temperature, next.humidity, next.moisturePercent);
        const status = statusFromRisk(riskScore);
        const fanOn = fanShouldRun(riskScore);
        const storageElapsedMs = t - storageStartRef.current;

        const finalSnapshot: GuardianSnapshot = { ...next, riskScore, status, fanOn, storageElapsedMs };
        setSnapshot(finalSnapshot);

        const tone = buzzerToneFor(riskScore);
        if (tone && t - lastBeepRef.current >= tone.intervalMs) {
          lastBeepRef.current = t;
          setBuzzerPulse((n) => n + 1);
          setLastTone({ freq: tone.frequencyHz, ms: tone.durationMs });
          if (soundEnabledRef.current) playTone(tone.frequencyHz, tone.durationMs);
        }

        pushLog(buildSerialBlock(finalSnapshot));
      }

      // displayLCD(), gated by LCD_INTERVAL, independent of the sensor timer.
      // The transient "FOOD SELECTED" splash (set instantly by selectFood)
      // holds the screen and suppresses cycling until it expires, mirroring
      // the blocking delay(1000) inside showFoodSelection().
      if (t >= splashUntilRef.current && t - lastLcdUpdateRef.current >= LCD_INTERVAL_MS) {
        lastLcdUpdateRef.current = t;
        setLcd(
          buildLcdFrame(lcdScreenRef.current, {
            ...snapshotRef.current,
            storageElapsedMs: t - storageStartRef.current,
          }),
        );
        lcdScreenRef.current += 1;
        if (lcdScreenRef.current > 4) lcdScreenRef.current = 0;
        setLcdScreenIndex(lcdScreenRef.current);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, [scenarioId, pushLog]);

  // --- Actions ----------------------------------------------------------

  const selectFood = useCallback(
    (food: FoodType) => {
      const t = nowMs();
      if (t - lastButtonPressRef.current < BUTTON_DELAY_MS) return;
      lastButtonPressRef.current = t;
      storageStartRef.current = t;
      lcdScreenRef.current = 0;
      setLcdScreenIndex(0);
      splashUntilRef.current = t + FOOD_SELECTED_SPLASH_MS;
      setSnapshot((prev) => ({ ...prev, food, storageElapsedMs: 0 }));
      setLcd(foodSelectedFrame({ ...snapshotRef.current, food }));
    },
    [],
  );

  const setScenario = useCallback((id: ScenarioId) => {
    const t = nowMs();
    setScenarioIdState(id);
    scenarioStartRef.current = t;
    setScenarioElapsedSec(0);
    setDataSource("demo");
    const def = getScenario(id);
    if (def.autoFood) selectFood(def.autoFood);
  }, [selectFood]);

  const setManualAmbient = useCallback((patch: Partial<typeof ambient>) => {
    setScenarioIdState("manual");
    setAmbient((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleSound = useCallback(() => {
    primeAudio();
    setSoundEnabled((v) => !v);
  }, []);

  const triggerSensorFault = useCallback(() => {
    pendingFaultRef.current = true;
  }, []);

  const clearLog = useCallback(() => {
    setSerialLines([]);
  }, []);

  const disconnectHardware = useCallback(async () => {
    if (hardwareLinkRef.current) {
      await hardwareLinkRef.current.disconnect();
      hardwareLinkRef.current = null;
    }
    setDataSource("demo");
    setHardwareStatus(isWebSerialSupported() ? "idle" : "unsupported");
  }, []);

  const connectHardware = useCallback(async () => {
    if (!isWebSerialSupported()) {
      setHardwareStatus("unsupported");
      return;
    }
    setHardwareStatus("connecting");
    setHardwareError(undefined);
    hardwareBlockRef.current = [];
    try {
      const link = await connectHardwareSerial({
        onLine: (line) => {
          pushLog(line);
          if (/^Food\s*:/.test(line)) {
            hardwareBlockRef.current = [line];
          } else if (hardwareBlockRef.current.length > 0) {
            hardwareBlockRef.current.push(line);
            if (/^Storage\s*:/.test(line)) {
              const parsed = parseSerialBlock(hardwareBlockRef.current.join("\n"));
              hardwareBlockRef.current = [];
              if (parsed) {
                setSnapshot((prev) => ({
                  ...prev,
                  ...parsed,
                  food: (parsed.food as unknown as FoodType) ?? prev.food,
                } as GuardianSnapshot));
              }
            }
          }
        },
        onDisconnect: (reason) => {
          hardwareLinkRef.current = null;
          setDataSource("demo");
          if (reason) {
            setHardwareStatus("error");
            setHardwareError(reason);
          } else {
            setHardwareStatus("idle");
          }
        },
      });
      hardwareLinkRef.current = link;
      setDataSource("hardware");
      setHardwareStatus("connected");
    } catch (err) {
      setHardwareStatus("error");
      setHardwareError(err instanceof Error ? err.message : String(err));
    }
  }, [pushLog]);

  // Keep the LCD cycling even while on hardware data, so the replica stays alive.
  useEffect(() => {
    if (dataSource !== "hardware") return;
    const interval = window.setInterval(() => {
      setLcd(buildLcdFrame(lcdScreenRef.current, snapshotRef.current));
      lcdScreenRef.current += 1;
      if (lcdScreenRef.current > 4) lcdScreenRef.current = 0;
      setLcdScreenIndex(lcdScreenRef.current);
    }, LCD_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [dataSource]);

  return {
    snapshot,
    ambient,
    lcd,
    lcdScreenIndex,
    serialLines,
    buzzerPulse,
    lastTone,
    scenarioId,
    scenarioElapsedSec,
    scenarioCycleSec: scenarioCycleSec(getScenario(scenarioId)),
    soundEnabled,
    dataSource,
    hardwareStatus,
    hardwareError,
    actions: {
      selectFood,
      setScenario,
      setManualAmbient,
      toggleSound,
      triggerSensorFault,
      clearLog,
      connectHardware,
      disconnectHardware,
    },
  };
}
