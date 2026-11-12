import { h, replace, debounce, revealResult, dismissKeyboard } from '../dom.js';
import { createEditor } from '../../lib/editor.js';
import { runCode, warmUp, onRunnerStatus } from '../../lib/runners.js';
import { kvGet, kvSet } from '../../lib/storage.js';
import { symbolBar, stdinField, outputView, dock } from '../components.js';
import { createWorkspace } from '../web-workspace.js';

const STARTERS = {
  python: 'name = input()\nprint("Hello,", name)\n',
  c: String.raw`#include <stdio.h>

int main() {
    printf("Hello from SayMaCoder!\n");
    return 0;
}
`,
};
const NAMES = { python: 'Python', c: 'C', web: 'Web' };
const WEB_STARTER = {
  html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My page</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello, Uganda!</h1>\n  <p>Edit me and watch the page change.</p>\n  <button id="hi">Say hi</button>\n  <script src="script.js"></script>\n</body>\n</html>\n',
  css: 'body {\n  font-family: system-ui, sans-serif;\n  text-align: center;\n  padding: 24px;\n}\nh1 {\n  color: tomato;\n}\n',
  js: 'document.getElementById("hi").addEventListener("click", () => {\n  alert("Hello from my first page!");\n  console.log("clicked");\n});\n',
};

export async function playgroundView() {
  let language = await kvGet('play:lang', 'python');
  if (!NAMES[language]) language = 'python';
  const drafts = { python: await kvGet('draft:play:python', STARTERS.python), c: await kvGet('draft:play:c', STARTERS.c) };
  const webDraft = await kvGet('draft:play:web', WEB_STARTER);
  let webWorkspace = null;
  const webBox = h('div', { class: 'web-box' });
  let busy = false;

  const mount = h('div', { class: 'editor-mount' });
  const editor = createEditor(mount, {
    language: language === 'web' ? 'python' : language,
    doc: drafts[language] ?? '',
    onChange: debounce((code) => {
      if (language === 'web') return;
      drafts[language] = code;
      kvSet(`draft:play:${language}`, code);
    }, 400),
  });
  warmUp(language);

  const barSlot = h('div', { class: 'bar-slot' }, symbolBar(editor, language === 'web' ? 'python' : language));
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

  function showWeb(on) {
    if (on && !webWorkspace) {
      webWorkspace = createWorkspace({ files: ['html', 'css', 'js'], starter: webDraft, onChange: debounce((files) => kvSet('draft:play:web', files), 500), symbolsInside: true });
      webBox.append(webWorkspace.node);
    }
    webBox.hidden = !on;
    [mount, stdin.node, dockNode, runtimeNote, result].forEach((el) => { el.hidden = on; });
  }

  async function switchTo(next) {
    if (next === language || busy) return;
    if (language !== 'web') {
      drafts[language] = editor.getValue();
      await kvSet(`draft:play:${language}`, drafts[language]);
    }
    language = next;
    await kvSet('play:lang', language);
    showWeb(language === 'web');
    if (language === 'web') {
      tabs.forEach((t) => t.classList.toggle('active', t.dataset.lang === language));
      return;
    }
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

  const dockNode = dock(barSlot, h('div', { class: 'actions' }, runBtn));
  const node = h('div', { class: 'view playground' }, h('h1', null, 'Code'), h('div', { class: 'segmented', role: 'tablist' }, tabs), webBox, mount, stdin.node, dockNode, runtimeNote, result);
  showWeb(language === 'web');

  return {
    node,
    cleanup() {
      stop();
      editor.destroy();
      webWorkspace?.destroy();
    },
  };
}
