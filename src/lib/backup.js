// Back up and restore a learner's progress as one small file.
//
// Why: progress lives only on the phone. A lost, broken or replaced phone would erase months of work.
// The file is plain JSON, so it can be sent by WhatsApp, email or Bluetooth, and opened on the new phone.
//
// Restoring MERGES: it never makes a learner lose work that is already on the phone.
import { kvAll, kvSet } from './storage.js';

export const BACKUP_APP = 'saymacoder';
export const BACKUP_VERSION = 1;
const KEYS = ['progress', 'attempts', 'days', 'game', 'last', 'resume', 'profile'];
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Everything worth keeping, from storage (drafts are included; null drafts are skipped). */
export async function collectData() {
  const all = await kvAll();
  const data = {};
  for (const k of KEYS) if (all[k] != null) data[k] = all[k];
  const drafts = {};
  for (const [k, v] of Object.entries(all)) if (k.startsWith('draft:') && typeof v === 'string' && v.trim()) drafts[k.slice(6)] = v;
  if (Object.keys(drafts).length) data.drafts = drafts;
  return data;
}

export function makeBackup(data, now = Date.now()) {
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: now, data };
}

/** Returns { ok: true, data } or { ok: false, why } with a sentence a learner can understand. */
export function checkBackup(text) {
  let file;
  try {
    file = typeof text === 'string' ? JSON.parse(text) : text;
  } catch {
    return { ok: false, why: 'This file is not a SayMaCoder backup. It could not be read.' };
  }
  if (!isObj(file) || file.app !== BACKUP_APP || !isObj(file.data)) return { ok: false, why: 'This file is not a SayMaCoder backup.' };
  if (typeof file.version !== 'number' || file.version > BACKUP_VERSION) return { ok: false, why: 'This backup was made by a newer version of the app. Update the app and try again.' };
  const d = file.data;
  if ((d.progress != null && !isObj(d.progress)) || (d.attempts != null && !Array.isArray(d.attempts)) || (d.days != null && !Array.isArray(d.days)) || (d.game != null && !isObj(d.game))) return { ok: false, why: 'This backup is damaged, so it was not used. Your work on this phone is safe.' };
  return { ok: true, data: d, exportedAt: file.exportedAt || 0 };
}

const earliest = (a, b) => (a && b ? Math.min(a, b) : a || b || 0);
const union = (a = {}, b = {}) => ({ ...b, ...a });

function mergeProgress(local = {}, incoming = {}) {
  const out = { ...local };
  for (const [id, b] of Object.entries(incoming)) {
    if (!isObj(b)) continue;
    const a = local[id];
    if (!a) { out[id] = b; continue; }
    const first = earliest(a.firstPassedAt, b.firstPassedAt);
    const fromEarlier = (b.firstPassedAt && (!a.firstPassedAt || b.firstPassedAt < a.firstPassedAt)) ? b : a;
    out[id] = {
      ...a,
      passed: Boolean(a.passed || b.passed),
      best: Math.max(a.best || 0, b.best || 0),
      attempts: Math.max(a.attempts || 0, b.attempts || 0),
      lastAt: Math.max(a.lastAt || 0, b.lastAt || 0),
      ...(first ? { firstPassedAt: first, hintsAtFirstPass: fromEarlier.hintsAtFirstPass ?? 0 } : {}),
    };
  }
  return out;
}

/** Merge a backup into what is on the phone. Pure: nothing is read or written here (the tests rely on that). */
export function mergeData(local = {}, incoming = {}) {
  const out = { ...local };
  out.progress = mergeProgress(local.progress, incoming.progress);

  const seen = new Set();
  out.attempts = [...(local.attempts || []), ...(incoming.attempts || [])]
    .filter((a) => isObj(a) && !seen.has(`${a.exerciseId}@${a.at}`) && seen.add(`${a.exerciseId}@${a.at}`))
    .sort((x, y) => x.at - y.at)
    .slice(-200);

  out.days = [...new Set([...(local.days || []), ...(incoming.days || [])])].sort().slice(-400);

  const lg = local.game || {};
  const ig = incoming.game || {};
  const lessons = { ...(ig.lessons || {}) };
  for (const [k, at] of Object.entries(lg.lessons || {})) lessons[k] = earliest(at, lessons[k]);
  const fixed = { ...(ig.fixed || {}) };
  for (const [k, at] of Object.entries(lg.fixed || {})) fixed[k] = earliest(at, fixed[k]);
  out.game = { ...lg, lessons, fixed, badges: { ...(ig.badges || {}), ...(lg.badges || {}) }, solutions: union(lg.solutions, ig.solutions), goal: [1, 2, 3].includes(ig.goal) ? ig.goal : lg.goal };
  if (out.game.goal == null) delete out.game.goal;

  const newer = (a, b) => (a && b ? (a.at >= b.at ? a : b) : a || b);
  const last = newer(local.last, incoming.last);
  if (last) out.last = last;
  out.resume = union(local.resume, incoming.resume);

  const lp = local.profile || {};
  const ip = incoming.profile || {};
  out.profile = { ...ip, ...lp, welcomed: Boolean(lp.welcomed || ip.welcomed), startCourse: lp.startCourse || ip.startCourse || null, backupAt: Math.max(lp.backupAt || 0, ip.backupAt || 0) };

  out.drafts = { ...(incoming.drafts || {}), ...(local.drafts || {}) }; // a draft already on the phone wins
  return out;
}

/** Save merged data back to storage. Returns a short summary for the learner. */
export async function restoreData(incoming) {
  const local = await collectData();
  const merged = mergeData(local, incoming);
  for (const k of KEYS) if (merged[k] !== undefined) await kvSet(k, merged[k]);
  for (const [id, code] of Object.entries(merged.drafts || {})) if (!(local.drafts && local.drafts[id])) await kvSet(`draft:${id}`, code);
  const passed = Object.values(merged.progress || {}).filter((p) => p && p.passed).length;
  const lessons = Object.keys((merged.game || {}).lessons || {}).length;
  return { passed, lessons, days: (merged.days || []).length };
}

export const backupFileName = (now = new Date()) => `saymacoder-backup-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.json`;
