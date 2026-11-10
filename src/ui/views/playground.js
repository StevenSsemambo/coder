import { h, replace, debounce, revealResult, dismissKeyboard } from '../dom.js';
import { createEditor } from '../../lib/editor.js';
import { runCode, warmUp, onRunnerStatus } from '../../lib/runners.js';
import { kvGet, kvSet } from '../../lib/storage.js';
import { symbolBar, stdinField, outputView, dock } from '../components.js';

const STARTERS = {
  python: 'name = input()\nprint("Hello,", name)\n',
  c: String.raw`#include <stdio.h>

int main() {
    printf("Hello from SayMaCoder!\n");
    return 0;
}
`,
};
const NAMES = { python: 'Python', c: 'C' };

export async function playgroundView() {
  let language = await kvGet('play:lang', 'python');
  if (!STARTERS[language]) language = 'python';
  const drafts = { python: await kvGet('draft:play:python', STARTERS.python), c: await kvGet('draft:play:c', STARTERS.c) };
  let busy = false;

  const mount = h('div', { class: 'editor-mount' });
  const editor = createEditor(mount, {
    language,
    doc: drafts[language],
    onChange: debounce((code) => {
      drafts[language] = code;
      kvSet(`draft:play:${language}`, code);
    }, 400),
  });
  warmUp(language);

  const barSlot = h('div', { class: 'bar-slot' }, symbolBar(editor, language));
  const stdin = stdinField('');
  const result = h('div', { class: 'result', 'aria-live': 'polite' });
  const runtimeNote = h('p', { class: 'muted small runtime' });
  const runBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: doRun }, 'Run');

  const tabs = Object.keys(NAMES).map((lang) =>
    h('button', { type: 'button', class: `seg ${lang === language ? 'active' : ''}`, 'data-lang': lang, onclick: () => switchTo(lang) }, NAMES[lang]),
  );

  const stop = onRunnerStatus(({ language: l, state: s }) => {
    if (l !== language) return;
    runtimeNote.textContent = { loading: `Starting ${NAMES[l]}… the first time can take a few seconds.`, ready: `${NAMES[l]} is ready.`, failed: `${NAMES[l]} could not start.` }[s] ?? '';
  });

  async function switchTo(next) {
    if (next === language || busy) return;
    drafts[language] = editor.getValue();
    await kvSet(`draft:play:${language}`, drafts[language]);
    language = next;
    await kvSet('play:lang', language);
    editor.setLanguage(language);
    editor.setValue(drafts[language]);
    replace(barSlot, symbolBar(editor, language));
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.lang === language));
    replace(result);
    runtimeNote.textContent = '';
    warmUp(language);
  }

  async function doRun() {
    if (busy) return;
    dismissKeyboard();
    busy = true;
    runBtn.disabled = true;
    replace(result, h('p', { class: 'muted' }, 'Running…'));
    const res = await runCode(language, editor.getValue(), stdin.value);
    replace(result, outputView(res, language));
    revealResult(result);
    busy = false;
    runBtn.disabled = false;
  }

  const node = h(
    'div',
    { class: 'view playground' },
    h('h1', null, 'Code'),
    h('div', { class: 'segmented', role: 'tablist' }, tabs),
    mount,
    stdin.node,
    dock(barSlot, h('div', { class: 'actions' }, runBtn)),
    runtimeNote,
    result,
  );

  return {
    node,
    cleanup() {
      stop();
      editor.destroy();
    },
  };
}
