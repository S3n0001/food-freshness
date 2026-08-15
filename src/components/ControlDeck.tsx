import type { useFoodGuardian } from "../hooks/useFoodGuardian";
import { FoodSelector } from "./FoodSelector";
import { LcdDisplay } from "./LcdDisplay";
import { RiskGauge } from "./RiskGauge";
import { InstrumentStrip } from "./InstrumentStrip";
import { ScenarioPicker } from "./ScenarioPicker";
import { SensorSlider } from "./SensorSlider";
import { arduinoMap, constrainValue } from "../lib/arduinoMath";
import { AlertCircle, Sliders, Volume2, VolumeX } from "lucide-react";

type Guardian = ReturnType<typeof useFoodGuardian>;

/** Top telemetry cluster: LCD, Risk Gauge, Key Instruments, Food Selector */
export function TelemetryDeck(fg: Guardian) {
  const { snapshot, lcd, lcdScreenIndex, actions } = fg;

  return (
    <div className="space-y-4">
      {/* 1. LCD1602 Display + Radial Risk Gauge */}
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-stretch">
        <LcdDisplay frame={lcd} screenIndex={lcdScreenIndex} />
        <RiskGauge riskScore={snapshot.riskScore} status={snapshot.status} />
      </div>

      {/* 2. Key Metrics Instrument Strip */}
      <InstrumentStrip snapshot={snapshot} />

      {/* 3. Food Selection Controls */}
      <div className="rounded-xl bg-[#0f1117] border border-white/[0.08] p-4 shadow-sm linear-border-top-sheen">
        <FoodSelector selected={snapshot.food} onSelect={actions.selectFood} />
      </div>
    </div>
  );
}

/** Bottom interactive controls: Simulation Scenarios & Manual Sensor Overrides side-by-side */
export function SimulationControlsDeck(fg: Guardian) {
  const {
    ambient,
    scenarioId,
    scenarioElapsedSec,
    dataSource,
    actions,
  } = fg;
  const isHardware = dataSource === "hardware";
  const livePercent = constrainValue(arduinoMap(ambient.moistureRaw, 1023, 0, 0, 100), 0, 100);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* Left Column: Simulation Scenario Picker */}
      <div className="rounded-xl bg-[#0f1117] border border-white/[0.08] p-4 shadow-sm linear-border-top-sheen flex flex-col justify-between h-full">
        <ScenarioPicker
          scenarioId={scenarioId}
          elapsedSec={scenarioElapsedSec}
          onSelect={actions.setScenario}
        />
      </div>

      {/* Right Column: Manual Sensor Overrides */}
      <div
        className={`rounded-xl bg-[#0f1117] border border-white/[0.08] p-4 shadow-sm linear-border-top-sheen space-y-4 h-full ${
          isHardware ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-[#8f96a3] uppercase">
              MANUAL SENSOR OVERRIDE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={actions.toggleSound}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono border transition-all duration-150 ${
                fg.soundEnabled
                  ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25"
                  : "bg-white/[0.03] border-white/[0.06] text-[#8f96a3] hover:text-white"
              }`}
              title="Toggle Piezo Buzzer Audio (M)"
            >
              {fg.soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>{fg.soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
            </button>
            <button
              type="button"
              onClick={actions.triggerSensorFault}
              disabled={isHardware}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all duration-150 disabled:cursor-not-allowed"
              title="Inject a DHT11 read failure to test isnan() firmware fallback branch"
            >
              <AlertCircle className="w-3 h-3" />
              <span>INJECT SENSOR FAULT</span>
            </button>
          </div>
        </div>

        {/* Temperature Sensor Slider */}
        <SensorSlider
          label="TEMPERATURE"
          pin="PIN D2"
          value={ambient.temperature}
          min={-5}
          max={45}
          step={0.5}
          unit="°C"
          displayValue={ambient.temperature.toFixed(1)}
          onChange={(v) => actions.setManualAmbient({ temperature: v })}
          accent="#f97316"
          disabled={isHardware}
          presets={[
            { label: "Freezer (-2°)", val: -2 },
            { label: "Cold (4°)", val: 4 },
            { label: "Warm (18°)", val: 18 },
            { label: "Danger (32°)", val: 32 },
          ]}
        />

        {/* Relative Humidity Sensor Slider */}
        <SensorSlider
          label="HUMIDITY (DHT11)"
          pin="PIN D2"
          value={ambient.humidity}
          min={20}
          max={99}
          unit="%"
          displayValue={ambient.humidity.toFixed(0)}
          onChange={(v) => actions.setManualAmbient({ humidity: v })}
          accent="#38bdf8"
          disabled={isHardware}
          presets={[
            { label: "Dry (35%)", val: 35 },
            { label: "Optimal (55%)", val: 55 },
            { label: "High (75%)", val: 75 },
            { label: "Saturated (92%)", val: 92 },
          ]}
        />

        {/* Soil Moisture ADC Slider */}
        <SensorSlider
          label="MOISTURE SENSOR (10-BIT ADC)"
          pin="PIN A0"
          value={ambient.moistureRaw}
          min={0}
          max={1023}
          unit=""
          displayValue={`${Math.round(ambient.moistureRaw)} ADC → ${livePercent}%`}
          onChange={(v) => actions.setManualAmbient({ moistureRaw: v })}
          accent="#10b981"
          disabled={isHardware}
          presets={[
            { label: "Dry (900)", val: 900 },
            { label: "Medium (700)", val: 700 },
            { label: "Wet (400)", val: 400 },
            { label: "Submerged (150)", val: 150 },
          ]}
        />
      </div>
    </div>
  );
}
