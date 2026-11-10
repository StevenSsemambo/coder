// Local storage for settings, drafts, progress and streaks.
// Primary store: IndexedDB. If it is unavailable (private mode, old WebView), it falls back to
// localStorage, and finally to memory, so the app never breaks because of storage.

const DB_NAME = 'saymacoder';
const DB_VERSION = 1;
const memory = new Map();
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains('kv')) req.result.createObjectStore('kv');
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB blocked'));
  });
  return dbPromise;
}

function request(mode, fn) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction('kv', mode);
        const req = fn(tx.objectStore('kv'));
        tx.oncomplete = () => resolve(req ? req.result : undefined);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }),
  );
}

const lsKey = (key) => `saymacoder:${key}`;

export async function kvGet(key, fallback = null) {
  try {
    const value = await request('readonly', (store) => store.get(key));
    return value === undefined ? fallback : value;
  } catch {
    try {
      const raw = globalThis.localStorage?.getItem(lsKey(key));
      if (raw != null) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return memory.has(key) ? memory.get(key) : fallback;
  }
}

export async function kvSet(key, value) {
  try {
    await request('readwrite', (store) => store.put(value, key));
  } catch {
    memory.set(key, value);
    try {
      globalThis.localStorage?.setItem(lsKey(key), JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }
}

// ---- settings ---------------------------------------------------------------
export const DEFAULT_SETTINGS = { lang: 'en', fontSize: 16 };

export async function loadSettings() {
  return { ...DEFAULT_SETTINGS, ...(await kvGet('settings', {})) };
}
export async function saveSettings(settings) {
  await kvSet('settings', settings);
}

// ---- drafts -----------------------------------------------------------------
export const getDraft = (id) => kvGet(`draft:${id}`, null);
export const saveDraft = (id, code) => kvSet(`draft:${id}`, code);
export const clearDraft = (id) => kvSet(`draft:${id}`, null);

// ---- progress and streaks ---------------------------------------------------
export function dayKey(input = new Date()) {
  const d = input instanceof Date ? input : new Date(input);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export const getProgress = () => kvGet('progress', {});

/** Record a graded attempt. Returns { entry, firstPass }. */
export async function recordAttempt({ exerciseId, courseId, passedCount, total, hintsUsed = 0, now = Date.now() }) {
  const passed = total > 0 && passedCount === total;
  const progress = await getProgress();
  const entry = progress[exerciseId] || { passed: false, best: 0, attempts: 0 };
  const firstPass = passed && !entry.passed;

  entry.attempts += 1;
  entry.best = Math.max(entry.best, total ? passedCount / total : 0);
  entry.lastAt = now;
  if (firstPass) {
    entry.passed = true;
    entry.firstPassedAt = now;
    entry.hintsAtFirstPass = hintsUsed;
  }
  progress[exerciseId] = entry;
  await kvSet('progress', progress);

  const attempts = await kvGet('attempts', []);
  attempts.push({ exerciseId, courseId, passedCount, total, passed, hintsUsed, at: now });
  await kvSet('attempts', attempts.slice(-200));

  const days = await kvGet('days', []);
  const today = dayKey(now);
  if (!days.includes(today)) {
    days.push(today);
    await kvSet('days', days.slice(-400));
  }
  return { entry, firstPass };
}

export const getRecentAttempts = async (n = 10) => (await kvGet('attempts', [])).slice(-n).reverse();

/** Consecutive days with at least one graded attempt. A streak survives until the end of tomorrow. */
export async function getStreak(now = new Date()) {
  const days = new Set(await kvGet('days', []));
  const cursor = new Date(now);
  const activeToday = days.has(dayKey(cursor));
  if (!activeToday) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (days.has(dayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, activeToday, totalDays: days.size };
}
