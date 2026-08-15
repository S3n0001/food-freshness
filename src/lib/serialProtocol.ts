/**
 * Optional bridge to a *real* board running Food_Guardian.ino over USB.
 * Uses the Web Serial API (Chrome/Edge only) to read the sketch's unmodified
 * `Serial.print` output and feed it through `parseSerialBlock`. No firmware
 * changes required — this reads exactly what `printSerialData()` sends.
 */

export function isWebSerialSupported(): boolean {
  return typeof navigator !== "undefined" && "serial" in navigator;
}

export interface HardwareLink {
  disconnect: () => Promise<void>;
}

interface ConnectOptions {
  baudRate?: number;
  onLine: (line: string) => void;
  onDisconnect: (reason?: string) => void;
}

/** Requests a serial port, opens it, and streams newline-delimited text to `onLine`. */
export async function connectHardwareSerial(opts: ConnectOptions): Promise<HardwareLink> {
  if (!isWebSerialSupported()) {
    throw new Error("Web Serial is not supported in this browser.");
  }

  // Chrome-only API; not present in the shared lib.dom typings.
  const serial = (navigator as unknown as { serial: any }).serial;
  const port = await serial.requestPort();
  await port.open({ baudRate: opts.baudRate ?? 9600 });

  const textDecoder = new TextDecoderStream();
  const readableClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  let buffer = "";
  let cancelled = false;

  (async () => {
    try {
      while (!cancelled) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          buffer += value;
          let idx: number;
          while ((idx = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, idx).replace(/\r$/, "");
            buffer = buffer.slice(idx + 1);
            if (line.length > 0) opts.onLine(line);
          }
        }
      }
    } catch (err) {
      if (!cancelled) opts.onDisconnect(err instanceof Error ? err.message : String(err));
      return;
    }
    if (!cancelled) opts.onDisconnect();
  })();

  const disconnect = async () => {
    cancelled = true;
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
    try {
      await readableClosed.catch(() => undefined);
    } catch {
      // ignore
    }
    try {
      await port.close();
    } catch {
      // ignore
    }
  };

  return { disconnect };
}
