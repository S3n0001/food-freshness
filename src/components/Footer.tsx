export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#08090a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5f6573]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#8f96a3]">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="font-semibold text-xs tracking-tight text-[#f2f5f8]">Food Guardian</span>
          </div>
          <span className="text-[#3a3f4d]">/</span>
          <span>Digital Twin Firmware Simulator &amp; IoT Bridge</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>MIT License</span>
          <span className="text-[#3a3f4d]">·</span>
          <span>React 19 + TypeScript + Tailwind</span>
          <span className="text-[#3a3f4d]">·</span>
          <span>Web Serial API</span>
        </div>
      </div>
    </footer>
  );
}
