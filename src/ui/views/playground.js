import { h, replace, debounce, revealResult, dismissKeyboard } from '../dom.js';
import { createEditor } from '../../lib/editor.js';
import { runCode, warmUp, onRunnerStatus } from '../../lib/runners.js';
import { kvGet, kvSet } from '../../lib/storage.js';
import { symbolBar, stdinField, outputView, dock } from '../components.js';
import { createWorkspace } from '../web-workspace.js';
import { packBanner } from '../offline-ui.js';

const STARTERS = {
  python: 'name = input()\nprint("Hello,", name)\n',
  c: String.raw`#include <stdio.h>

int main() {
    printf("Hello from SayMaCoder!\n");
    return 0;
}
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from SayMaCoder!" << endl;
    return 0;
}
`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from SayMaCoder!");
    }
}
`,
  php: `<?php
echo "Hello from SayMaCoder!\n";
`,
  sql: 'SELECT name, score FROM players ORDER BY score DESC;\n',
};
// SQL runs against a small practice database (the "input" box), so a query has something to look at.
const SQL_DB = `CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT, score INTEGER);
INSERT INTO players (name, score) VALUES ('Amina', 42), ('Brian', 35), ('Cathy', 58);
`;
const NAMES = { python: 'Python', c: 'C', cpp: 'C++', java: 'Java', php: 'PHP', sql: 'SQL', web: 'Web' };
const EMOJI = { python: '🐍', c: '⚙️', cpp: '🚀', java: '☕', php: '🐘', sql: '🗄️', web: '🌐' };
const PACKED = ['python', 'php', 'java'];
const WEB_STARTER = {
  html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My page</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello, Uganda!</h1>\n  <p>Edit me and watch the page change.</p>\n  <button id="hi">Say hi</button>\n  <script src="script.js"></script>\n</body>\n</html>\n',
  css: 'body {\n  font-family: system-ui, sans-serif;\n  text-align: center;\n  padding: 24px;\n}\nh1 {\n  color: tomato;\n}\n',
  js: 'document.getElementById("hi").addEventListener("click", () => {\n  alert("Hello from my first page!");\n  console.log("clicked");\n});\n',
};

export async function playgroundView() {
  let language = await kvGet('play:lang', 'python');
  if (!NAMES[language]) language = 'python';
  const drafts = {};
  const inputs = {};
  for (const l of Object.keys(STARTERS)) {
    drafts[l] = await kvGet(`draft:play:${l}`, STARTERS[l]);
    inputs[l] = await kvGet(`draft:play:input:${l}`, l === 'sql' ? SQL_DB : '');
  }
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
  let stdin = stdinField(inputs[language] ?? '', language);
  const stdinSlot = h('div', { class: 'stdin-slot' }, stdin.node);
  const banner = h('div', { class: 'banner-slot' });
  const showBanner = () => { replace(banner); if (PACKED.includes(language)) packBanner(language).then((b) => b && language && banner.append(b)); };
  showBanner();
  const result = h('div', { class: 'result', 'aria-live': 'polite' });
  const runtimeNote = h('p', { class: 'muted small runtime' });
  const runBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: doRun }, 'Run');

  const tabs = Object.keys(NAMES).map((lang) =>
    h('button', { type: 'button', role: 'tab', 'aria-selected': String(lang === language), class: `seg ${lang === language ? 'active' : ''}`, 'data-lang': lang, onclick: () => switchTo(lang) }, h('span', { 'aria-hidden': 'true' }, EMOJI[lang] + ' '), NAMES[lang]),
  );

  const stop = onRunnerStatus(({ language: l, state: s, detail }) => {
    if (l !== language) return;
    runtimeNote.textContent = { loading: `Starting ${NAMES[l]}… the first time can take a few seconds.`, ready: `${NAMES[l]} is ready.`, running: detail === 'building' ? 'Building your program… the first run can take a few seconds.' : '', failed: `${NAMES[l]} could not start.` }[s] ?? '';
  });

  function showWeb(on) {
    if (on && !webWorkspace) {
      webWorkspace = createWorkspace({ files: ['html', 'css', 'js'], starter: webDraft, onChange: debounce((files) => kvSet('draft:play:web', files), 500), symbolsInside: true });
      webBox.append(webWorkspace.node);
    }
    webBox.hidden = !on;
    [mount, stdinSlot, dockNode, runtimeNote, result, tools].forEach((el) => { el.hidden = on; });
  }

  function markTabs() {
    tabs.forEach((t) => {
      const on = t.dataset.lang === language;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
      if (on) t.scrollIntoView?.({ inline: 'center', block: 'nearest' });
    });
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(editor.getValue());
      copyBtn.textContent = 'Copied ✓';
    } catch {
      copyBtn.textContent = 'Copy not available';
    }
    setTimeout(() => { copyBtn.textContent = 'Copy code'; }, 1800);
  }

  async function resetCode() {
    if (!window.confirm('Start again with the example for this language? Your code here will be replaced.')) return;
    editor.setValue(STARTERS[language]);
    drafts[language] = STARTERS[language];
    kvSet(`draft:play:${language}`, STARTERS[language]);
    if (language === 'sql') stdin = (replace(stdinSlot, (stdin = stdinField(SQL_DB, 'sql')).node), stdin);
  }

  async function switchTo(next) {
    if (next === language || busy) return;
    if (language !== 'web') {
      drafts[language] = editor.getValue();
      inputs[language] = stdin.value;
      await kvSet(`draft:play:${language}`, drafts[language]);
      await kvSet(`draft:play:input:${language}`, inputs[language]);
    }
    language = next;
    await kvSet('play:lang', language);
    showWeb(language === 'web');
    if (language === 'web') {
      markTabs();
      showBanner();
      return;
    }
    editor.setLanguage(language);
    editor.setValue(drafts[language]);
    replace(barSlot, symbolBar(editor, language));
    markTabs();
    stdin = stdinField(inputs[language] ?? '', language);
    replace(stdinSlot, stdin.node);
    showBanner();
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
    inputs[language] = stdin.value;
    kvSet(`draft:play:input:${language}`, inputs[language]);
    const res = await runCode(language, editor.getValue(), stdin.value);
    replace(result, outputView(res, language));
    revealResult(result);
    busy = false;
    runBtn.disabled = false;
  }

  const copyBtn = h('button', { class: 'btn btn-small', type: 'button', onclick: copyCode }, 'Copy code');
  const resetBtn = h('button', { class: 'btn btn-small', type: 'button', onclick: resetCode }, 'Start again');
  const tools = h('div', { class: 'play-tools' }, copyBtn, resetBtn);
  const dockNode = dock(barSlot, h('div', { class: 'actions' }, runBtn));
  const node = h('div', { class: 'view playground' }, h('h1', null, 'Code'), h('div', { class: 'segmented play-langs', role: 'tablist', 'aria-label': 'Programming language' }, tabs), banner, webBox, mount, stdinSlot, tools, dockNode, runtimeNote, result);
  showWeb(language === 'web');
  requestAnimationFrame(markTabs); // bring a saved language that is far to the right into view

  return {
    node,
    cleanup() {
      stop();
      editor.destroy();
      webWorkspace?.destroy();
    },
  };
}
