// "Will this work with no internet?" One honest answer for the learner, built from facts the browser can tell us.
import { PACKS, packStatus, cacheSupported } from './packs.js';

/** Which downloadable pack a language needs, or null when it is built in (C, C++, SQL and the Web track need none). */
export const packIdFor = (language) => ({ python: 'python', php: 'php', java: 'java' }[language] || null);

export const BUILT_IN = [
  { name: 'C and C++ (basics)', note: 'built in' },
  { name: 'SQL', note: 'built in' },
  { name: 'Web: HTML, CSS, JavaScript', note: 'built in' },
];

/** The pack a language still needs, as { id, name, bytes }, or null when nothing is missing. */
export async function missingPack(language) {
  const id = packIdFor(language);
  if (!id || !cacheSupported()) return null;
  try {
    const st = await packStatus(id);
    return st.installed ? null : { id, name: PACKS[id].name, bytes: PACKS[id].bytes };
  } catch {
    return null;
  }
}

/** shell: the app itself is saved for offline use. packs: each download and whether it is saved. */
export async function offlineReport({ shellReady = false } = {}) {
  const shell = shellReady || Boolean(globalThis.navigator?.serviceWorker?.controller);
  const packs = [];
  for (const id of Object.keys(PACKS)) {
    let installed = false;
    try { installed = cacheSupported() ? (await packStatus(id)).installed : false; } catch { /* treat as not saved */ }
    packs.push({ id, name: PACKS[id].name, bytes: PACKS[id].bytes, installed });
  }
  let persisted = false;
  try { persisted = (await globalThis.navigator?.storage?.persisted?.()) || false; } catch { /* ignore */ }
  const missing = packs.filter((p) => !p.installed);
  return { shell, packs, persisted, missing, allReady: shell && missing.length === 0 };
}
