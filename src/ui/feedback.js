// Sound and vibration for small moments of joy. Both can be switched off in Settings.
// Sounds are made on the phone with the Web Audio API (no sound files, so nothing to download).
import { state } from '../state.js';

let ctx = null;

/** Call from a tap or click: phones only allow sound after the person has touched the screen. */
export function unlockAudio() {
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AC) return;
  try {
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    ctx = null;
  }
}

const soundOn = () => state.settings.sound !== false;
const buzzOn = () => state.settings.haptics !== false;

function tone(freq, at, length, { type = 'sine', gain = 0.1 } = {}) {
  if (!ctx) return;
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + length);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + length + 0.05);
}

// Notes: C5 523, E5 659, G5 784, C6 1047.
const SOUNDS = {
  tap: () => tone(660, 0, 0.07, { gain: 0.05 }),
  ok: () => { tone(659, 0, 0.12); tone(988, 0.1, 0.18); },
  wrong: () => tone(220, 0, 0.18, { type: 'triangle', gain: 0.07 }),
  win: () => { tone(523, 0, 0.14); tone(659, 0.12, 0.14); tone(784, 0.24, 0.14); tone(1047, 0.36, 0.34); },
  level: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.22)); },
};

// A wrong answer only gets a soft sound, never a buzz: mistakes are normal and nobody should be shamed for one.
const BUZZ = { tap: 8, ok: 25, win: [40, 60, 40, 60, 90], level: [50, 60, 50, 60, 50, 60, 140] };

/** Play a short sound and buzz the phone, if the person left those on. `kind`: tap, ok, wrong, win, level. */
export function feel(kind) {
  try {
    if (soundOn() && SOUNDS[kind]) {
      unlockAudio();
      SOUNDS[kind]();
    }
    if (buzzOn() && BUZZ[kind] && typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(BUZZ[kind]);
  } catch {
    /* sound and vibration are extras: never let them break a lesson */
  }
}

export const reducedMotion = () => Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
