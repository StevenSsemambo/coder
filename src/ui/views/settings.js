import { h, replace } from '../dom.js';
import { state, applySettings } from '../../state.js';
import { saveSettings } from '../../lib/storage.js';
import { LANGUAGES } from '../../lib/errors.js';
import { PACKS, packStatus, downloadPack, removePack, formatBytes, cacheSupported } from '../../lib/packs.js';
import { toast } from '../components.js';
import packInfo from '../../generated/pack-info.json';

export async function settingsView() {
  const persist = async () => {
    await saveSettings(state.settings);
    applySettings();
  };

  // ---- language of error explanations
  const langSelect = h(
    'select',
    { class: 'select', 'aria-label': 'Language for error explanations', onchange: (e) => { state.settings.lang = e.target.value; persist(); } },
    LANGUAGES.map((l) => h('option', { value: l.code, selected: l.code === state.settings.lang }, l.label)),
  );

  // ---- code size
  const sizeValue = h('span', { class: 'muted small' }, `${state.settings.fontSize}px`);
  const sizeInput = h('input', {
    type: 'range',
    min: 12,
    max: 24,
    step: 1,
    value: state.settings.fontSize,
    'aria-label': 'Code text size',
    oninput: (e) => {
      state.settings.fontSize = Number(e.target.value);
      sizeValue.textContent = `${state.settings.fontSize}px`;
      persist();
    },
  });

  // ---- python pack
  const pack = PACKS.python;
  const packRow = h('div', { class: 'card pack' });
  const progressNode = h('div', { class: 'bar hidden' }, h('span', { style: 'width:0%' }));

  async function renderPack() {
    const st = await packStatus('python');
    const status = !st.supported ? 'Offline storage is not available in this browser.' : st.installed ? 'Installed. Works with no internet.' : `Not downloaded (${formatBytes(pack.bytes)}).`;
    replace(
      packRow,
      h('div', { class: 'course-top' }, h('h3', null, pack.name), h('span', { class: `chip ${st.installed ? 'chip-ok' : ''}` }, st.installed ? 'Installed' : 'Needed for Python')),
      h('p', { class: 'muted' }, status),
      progressNode,
      st.supported
        ? st.installed
          ? h('button', { class: 'btn btn-ghost', type: 'button', onclick: async () => { await removePack('python'); renderPack(); } }, 'Remove from this phone')
          : h('button', { class: 'btn btn-primary', type: 'button', id: 'download-python', onclick: startDownload }, `Download ${formatBytes(pack.bytes)}`)
        : null,
    );
  }

  async function startDownload(e) {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = 'Downloading…';
    progressNode.classList.remove('hidden');
    try {
      await downloadPack('python', (f) => { progressNode.firstChild.style.width = `${Math.round(f * 100)}%`; });
      toast('Python is ready to use offline.');
    } catch (err) {
      toast(`Download failed. Check your connection and try again. (${err.message})`);
    }
    renderPack();
  }
  await renderPack();

  // ---- storage safety
  const storageNote = h('p', { class: 'muted' }, 'Checking storage…');
  const persistBtn = h('button', { class: 'btn', type: 'button', onclick: async () => {
    const ok = navigator.storage?.persist ? await navigator.storage.persist() : false;
    toast(ok ? 'Done. Your downloads are protected from automatic cleanup.' : 'Your browser did not allow this. Installing the app to your home screen helps.');
    refreshStorage();
  } }, 'Protect my downloads');

  async function refreshStorage() {
    try {
      const est = await navigator.storage.estimate();
      const persisted = navigator.storage.persisted ? await navigator.storage.persisted() : false;
      storageNote.textContent = `Using ${formatBytes(est.usage || 0)} of ${formatBytes(est.quota || 0)} available. ${persisted ? 'Protected from automatic cleanup.' : 'Not yet protected from automatic cleanup.'}`;
      persistBtn.disabled = persisted;
    } catch {
      storageNote.textContent = 'Storage information is not available here.';
    }
  }
  refreshStorage();

  const node = h(
    'div',
    { class: 'view' },
    h('h1', null, 'Settings'),
    h('h2', { class: 'section-title' }, 'Downloads'),
    h('p', { class: 'muted' }, `C is built in (${formatBytes(packInfo.c.bundledBytes)}). Python is a separate download so the app stays small.`),
    packRow,
    h('h2', { class: 'section-title' }, 'Reading and language'),
    h('label', { class: 'field' }, h('span', null, 'Explain errors in'), langSelect),
    h('label', { class: 'field' }, h('span', null, 'Code text size'), sizeInput, sizeValue),
    h('h2', { class: 'section-title' }, 'Keep your data safe'),
    cacheSupported() ? [storageNote, persistBtn] : h('p', { class: 'muted' }, 'Storage controls are not available in this browser.'),
    h('h2', { class: 'section-title' }, 'About'),
    h('p', { class: 'muted' }, 'SayMaCoder v0.1 (Phase 0 prototype). Everything runs on your phone. Your code and progress never leave it.'),
  );
  return { node };
}
