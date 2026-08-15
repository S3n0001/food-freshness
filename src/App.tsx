import { useState, useEffect } from "react";
import { useFoodGuardian } from "./hooks/useFoodGuardian";
import { Footer } from "./components/Footer";
import { FridgeVisual } from "./components/FridgeVisual";
import { TelemetryDeck, SimulationControlsDeck } from "./components/ControlDeck";
import { HardwareConnect } from "./components/HardwareConnect";
import { SerialMonitor } from "./components/SerialMonitor";
import { CircuitSection } from "./components/CircuitSection";
import { FoodType } from "./lib/foodTypes";
import {
  Terminal,
  Keyboard,
  X,
} from "lucide-react";

function App() {
  const fg = useFoodGuardian();
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Global Keyboard Shortcuts (Linear style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is inside an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "1") {
        fg.actions.selectFood(FoodType.MILK);
      } else if (e.key === "2") {
        fg.actions.selectFood(FoodType.MEAT);
      } else if (e.key === "3") {
        fg.actions.selectFood(FoodType.FRUIT);
      } else if (e.key === "4") {
        fg.actions.selectFood(FoodType.VEGETABLE);
      } else if (e.key === "m" || e.key === "M") {
        fg.actions.toggleSound();
      } else if (e.key === "f" || e.key === "F") {
        fg.actions.triggerSensorFault();
      } else if (e.key === "?") {
        setShowShortcutsModal((v) => !v);
      } else if (e.key === "Escape") {
        setShowShortcutsModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fg.actions]);

  return (
    <div id="top" className="min-h-screen bg-[#08090a] bg-linear-grid text-[#d0d6e0] flex flex-col relative overflow-hidden">
      {/* Linear Ambient Radial Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(94,106,210,0.18),transparent_70%)] pointer-events-none z-0" />

      <main className="flex-1 relative z-10">
        {/* Main Workspace Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* 1. Top Section: Physical Chamber Twin (Left) & Telemetry Cluster (Right) */}
          <div className="grid lg:grid-cols-[minmax(0,390px)_1fr] gap-6 items-stretch">
            {/* Left Column: Chamber Visual Twin */}
            <div className="flex flex-col justify-between">
              <FridgeVisual snapshot={fg.snapshot} buzzerPulse={fg.buzzerPulse} />
            </div>

            {/* Right Column: LCD + Gauge, Instrument Strip, Food Selector */}
            <div className="flex flex-col justify-between">
              <TelemetryDeck {...fg} />
            </div>
          </div>

          {/* 2. Full-Width Hardware USB WebSerial Link (Spans Entire Width) */}
          <div className="w-full">
            <HardwareConnect
              status={fg.hardwareStatus}
              dataSource={fg.dataSource}
              error={fg.hardwareError}
              onConnect={fg.actions.connectHardware}
              onDisconnect={fg.actions.disconnectHardware}
            />
          </div>

          {/* 3. Controls Section: Simulation Scenarios & Manual Overrides SIDE BY SIDE */}
          <div className="w-full">
            <SimulationControlsDeck {...fg} />
          </div>
        </div>

        {/* 4. Serial Terminal Section */}
        <section id="terminal" className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 border-t border-white/[0.07]">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs tracking-wider text-emerald-400 uppercase font-semibold">
                  RAW SERIAL STREAM
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f2f5f8]">
                Deterministic <code className="font-mono text-emerald-300 font-medium">printSerialData()</code> Stream
              </h2>
              <p className="text-xs sm:text-sm text-[#8f96a3] mt-1">
                Real-time UART packets at 9600 baud directly matching the Arduino serial monitor format.
              </p>
            </div>
          </div>

          <SerialMonitor lines={fg.serialLines} onClear={fg.actions.clearLog} />
        </section>

        {/* 5. Circuit & Firmware Source Section */}
        <CircuitSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Screen reader polite announcement */}
      <p className="sr-only" aria-live="polite">
        {fg.serialLines[fg.serialLines.length - 1]}
      </p>

      {/* Keyboard Shortcuts Dialog Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-[#12141a] border border-white/[0.1] p-5 shadow-2xl linear-border-top-sheen relative">
            <button
              type="button"
              onClick={() => setShowShortcutsModal(false)}
              className="absolute top-4 right-4 text-[#8f96a3] hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.07]">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold text-sm text-[#f2f5f8]">Keyboard Quick Commands</h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                <span className="text-[#d0d6e0]">Select Milk Profile</span>
                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-indigo-300">1</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                <span className="text-[#d0d6e0]">Select Meat Profile</span>
                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-indigo-300">2</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                <span className="text-[#d0d6e0]">Select Fruit Profile</span>
                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-indigo-300">3</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                <span className="text-[#d0d6e0]">Select Vegetable Profile</span>
                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-indigo-300">4</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                <span className="text-[#d0d6e0]">Toggle Buzzer Sound</span>
                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-indigo-300">M</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                <span className="text-[#d0d6e0]">Inject Sensor Fault</span>
                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-indigo-300">F</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded bg-white/[0.02]">
                <span className="text-[#d0d6e0]">Close this modal</span>
                <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-indigo-300">ESC</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
