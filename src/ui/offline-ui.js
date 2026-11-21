// Small cards about being ready for offline use, installing the app and keeping progress safe.
import { h, replace } from './dom.js';
import { toast, progressBar } from './components.js';
import { downloadPack, formatBytes } from '../lib/packs.js';
import { missingPack, offlineReport, BUILT_IN } from '../lib/offline.js';
import { installState, promptInstall } from '../lib/install.js';
import { collectData, makeBackup, checkBackup, restoreData, backupFileName } from '../lib/backup.js';
import { getProfile, updateProfile } from '../lib/profile.js';
import { getProgress } from '../lib/storage.js';
import { katoSays } from './mascot.js';
import { feel } from './feedback.js';
import { state } from '../state.js';

/**
 * "Python needs a one-time download" with a button that does it right here.
 * Resolves to null when the language needs nothing, so callers can simply skip it.
 */
export async function packBanner(language, { onReady } = {}) {
  const need = await missingPack(language);
  if (!need) return null;
  const bar = h('div', { class: 'bar hidden' }, h('span', { style: 'width:0%' }));
  const box = h('div', { class: 'card notice pack-banner' });
  const draw = () =>
    replace(
      box,
      h('strong', null, `${need.name} is not on this phone yet`),
      h('p', { class: 'muted' }, `Download it once (${formatBytes(need.bytes)}). After that it works with no internet. Best on Wi-Fi.`),
      bar,
      h('button', { class: 'btn btn-primary', type: 'button', onclick: start }, `Download ${formatBytes(need.bytes)}`),
    );
  async function start(e) {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Downloading…';
    bar.classList.remove('hidden');
    try {
      await downloadPack(need.id, (f) => { bar.firstChild.style.width = `${Math.round(f * 100)}%`; });
      feel('ok');
      toast(`${need.name} is ready to use offline.`);
      box.remove();
      onReady?.();
    } catch (err) {
      toast(`Download failed. Check your connection and try again. (${err.message})`);
      draw();
    }
  }
  draw();
  return box;
}

/** Add the app to the home screen. Returns null when there is nothing to offer. */
export function installCard({ dismissible = true } = {}) {
  const st = installState();
  if (st === 'installed' || st === 'none') return null;
  const box = h('div', { class: 'card install' });
  const close = dismissible ? h('button', { class: 'btn btn-ghost btn-small', type: 'button', onclick: async () => { box.remove(); await updateProfile({ installDismissed: true }); } }, 'Not now') : null;
  if (st === 'prompt') {
    replace(box, h('strong', null, '📲 Put SayMaCoder on your home screen'), h('p', { class: 'muted' }, 'Opens like a normal app, keeps your lessons safe on the phone, and works with no internet.'), h('div', { class: 'actions' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: async () => { const r = await promptInstall(); if (r === 'accepted') { feel('win'); box.remove(); } } }, 'Add to home screen'), close));
  } else {
    replace(box, h('strong', null, '📲 Put SayMaCoder on your home screen'), h('ol', { class: 'steps-list' }, h('li', null, 'Tap the Share button in Safari.'), h('li', null, 'Choose "Add to Home Screen".'), h('li', null, 'Tap "Add". Open SayMaCoder from your home screen.')), close);
  }
  return box;
}

/** A plain answer to "will it work with no internet?", with a button for anything that is missing. */
export async function offlineCheckCard({ onChange } = {}) {
  const r = await offlineReport({ shellReady: state.offlineReady });
  const box = h('div', { class: 'card offline-check' });
  const row = (ok, label, note, action) => h('li', { class: `check-row ${ok ? 'ok' : 'todo'}` }, h('span', { class: 'check-mark', 'aria-hidden': 'true' }, ok ? '✓' : '↓'), h('div', { class: 'grow' }, h('strong', null, label), h('span', { class: 'muted small block' }, note)), action || null);
  replace(
    box,
    h('div', { class: 'course-top' }, h('h3', null, r.allReady ? '✅ Ready for offline' : 'Offline check'), h('span', { class: `chip ${r.allReady ? 'chip-ok' : ''}` }, r.allReady ? 'All set' : `${r.missing.length} to download`)),
    h('ul', { class: 'check-list' }, row(r.shell, 'The app and its lessons', r.shell ? 'Saved on this phone.' : 'Open the app once with internet, then close and reopen it.'), BUILT_IN.map((b) => row(true, b.name, 'Built in. Needs nothing.')), r.packs.map((p) => row(p.installed, p.name.replace(' runtime', ''), p.installed ? 'Downloaded. Works with no internet.' : `Not downloaded yet (${formatBytes(p.bytes)}).`, p.installed ? null : h('a', { class: 'btn btn-small', href: '#/settings' }, 'Get'))), row(r.persisted, 'Protected from automatic cleanup', r.persisted ? 'Your phone will not clear your downloads to save space.' : 'Install the app and use "Protect my downloads" below.')),
  );
  void onChange;
  return box;
}

// ---- backup and restore ---------------------------------------------------------------------------------------------
async function saveBackupFile() {
  const data = await collectData();
  const text = JSON.stringify(makeBackup(data), null, 1);
  const name = backupFileName();
  const file = typeof File === 'function' ? new File([text], name, { type: 'application/json' }) : null;
  // On phones the share sheet lets the learner send the file to WhatsApp, email or Google Drive in one tap.
  if (file && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'SayMaCoder backup' });
      await updateProfile({ backupAt: Date.now() });
      return 'shared';
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancelled';
    }
  }
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = h('a', { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  await updateProfile({ backupAt: Date.now() });
  return 'downloaded';
}

export function backupCard({ onRestored } = {}) {
  const note = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const input = h('input', { type: 'file', accept: '.json,application/json', class: 'hidden', 'aria-label': 'Choose a backup file' });
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    const res = checkBackup(await file.text());
    if (!res.ok) { replace(note, res.why); return; }
    const sum = await restoreData(res.data);
    state.progress = await getProgress(); // the screens read this copy: refresh it so Continue, paths and counts are right at once
    feel('ok');
    toast(`Restored: ${sum.passed} exercises and ${sum.lessons} lessons.`);
    replace(note, `Done. Your progress now has ${sum.passed} exercises and ${sum.lessons} lessons. Work already on this phone was kept.`);
    onRestored?.();
  });
  const when = h('p', { class: 'muted small' }, '');
  getProfile().then((p) => { when.textContent = p.backupAt ? `Last backup: ${new Date(p.backupAt).toLocaleDateString()}.` : 'You have not made a backup yet.'; });
  return h(
    'div',
    { class: 'card backup' },
    h('strong', null, '💾 Keep your progress safe'),
    h('p', { class: 'muted' }, 'Your progress lives on this phone only. Save a backup file now and then. If you get a new phone, restore it there. Restoring never removes work that is already on the phone.'),
    when,
    h('div', { class: 'actions' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: async () => { const r = await saveBackupFile(); if (r !== 'cancelled') { toast(r === 'shared' ? 'Backup shared. Keep it somewhere safe.' : 'Backup saved to your downloads. Keep it somewhere safe.'); when.textContent = `Last backup: ${new Date().toLocaleDateString()}.`; } } }, 'Save a backup'), h('button', { class: 'btn', type: 'button', onclick: () => input.click() }, 'Restore from a file')),
    input,
    note,
  );
}

/** A gentle reminder on the home screen after real progress. Returns null when it is not time. */
export function backupReminder(profile, stats, now = Date.now()) {
  const DAY = 86400000;
  if (stats.passed < 10 || now - (profile.backupSnoozed || 0) < 7 * DAY) return null;
  if (profile.backupAt && now - profile.backupAt < 14 * DAY) return null;
  const box = h('div', { class: 'card backup-reminder' });
  replace(
    box,
    katoSays('think', 'You have done a lot of work! Save a backup so a lost phone cannot erase it.', { size: 52 }),
    h('div', { class: 'actions' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: async () => { const r = await saveBackupFile(); if (r !== 'cancelled') { toast('Backup saved. Well done for keeping it safe.'); box.remove(); } } }, 'Save a backup'), h('button', { class: 'btn btn-ghost', type: 'button', onclick: async () => { box.remove(); await updateProfile({ backupSnoozed: now }); } }, 'Remind me later')),
  );
  return box;
}
