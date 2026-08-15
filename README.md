# Food Guardian

> Firmware-accurate digital twin of an Arduino Uno food-safety monitor with real-time telemetry, interactive physical chamber simulation, 16x2 HD44780 LCD character matrix, and optional USB Web Serial hardware bridge.

## Features

- **Linear Dark Mode Interface**: Built with high-craft design tokens, subtle hairline borders, and responsive telemetry panels.
- **Microcontroller Digital Twin**: Simulates the exact thresholds (25/50/75), 2-second sensor sampling cadence, and dual-tone piezo buzzer acoustics of `Food_Guardian.ino`.
- **Chamber & Sensor Simulation**: Live refrigeration chamber with dynamic mist, ventilation fan actuation, and 4 food presets (Milk, Meat, Fruit, Vegetable).
- **HD44780 LCD & Radial Gauge**: Pixel-accurate 16x2 character matrix with automatic 5-page rotation alongside a radial risk dial.
- **Serial Monitor**: Real-time 9600 baud UART terminal stream matching physical Arduino serial output.
- **Web Serial Hardware Bridge**: Connect real Arduino Uno hardware over USB directly in supported browsers.

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Lucide Icons
- Vite

## Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

## License

MIT
