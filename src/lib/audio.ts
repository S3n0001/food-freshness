/**
 * Mirrors the Arduino `tone(BUZZER_PIN, frequency, duration)` call using the
 * Web Audio API. A single shared AudioContext is created lazily on the first
 * user gesture (browsers block audio until then).
 */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Prime the AudioContext from within a click handler so later beeps aren't blocked. */
export function primeAudio(): void {
  getContext();
}

export function playTone(frequencyHz: number, durationMs: number): void {
  const audioCtx = getContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "square";
  osc.frequency.setValueAtTime(frequencyHz, now);

  // Fast attack, gentle release so repeated beeps don't click/pop.
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
  gain.gain.setValueAtTime(0.12, now + durationMs / 1000 - 0.03);
  gain.gain.linearRampToValueAtTime(0, now + durationMs / 1000);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.02);
}
