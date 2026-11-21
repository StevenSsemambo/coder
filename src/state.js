// Shared app state (small on purpose).
import { DEFAULT_SETTINGS } from './lib/storage.js';

export const state = {
  settings: { ...DEFAULT_SETTINGS },
  progress: {},
};

export function applySettings() {
  document.documentElement.style.setProperty('--scale', String(state.settings.textScale || 1));
  document.documentElement.style.setProperty('--code-size', `${state.settings.fontSize}px`);
}
