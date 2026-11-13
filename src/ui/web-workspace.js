// The live workspace for the web track: file tabs, one editor, a live preview, a console and friendly tips.
import { h, replace, debounce, richText } from './dom.js';
import { createEditor } from '../lib/editor.js';
import { Preview, Engine, buildPreview } from '../lib/webrun.js';
import { FILE_NAMES, filesFrom } from '../lib/webgrade.js';
import { symbolBar, errorCard } from './components.js';

const LANG = { html: 'html', css: 'css', js: 'js' };

/**
 * options:
 *  files      which files the student can edit, e.g. ['html', 'css']
 *  starter    { html, css, js } (all three; uneditable ones are still part of the page)
 *  goal       { html, css, js } shown on request as "the goal", so the student sees what to build
 *  assets/api the lesson's image library and its pretend server
 *  onChange   called (debounced) with the files object
 *  height     editor height class: 'tall' | 'short'
 *  symbolsInside  put the symbol bar under the editor (lesson blocks). Otherwise use `.symbols` in a dock.
 */
export function createWorkspace({ files: editable = ['html', 'css', 'js'], starter = {}, goal = null, assets, api, strict = false, onChange, symbolsInside = false, title } = {}) {
  const docs = filesFrom(starter);
  let current = editable[0];
  let switching = false;
  let showingGoal = false;
  let consoleOpen = false;
  const logs = [];
  const errors = [];

  const mount = h('div', { class: 'editor-mount web-editor' });
  const editor = createEditor(mount, {
    language: LANG[current],
    doc: docs[current],
    onChange: (text) => {
      if (switching) return;
      docs[current] = text;
      schedule();
      onChange?.({ ...docs });
    },
  });

  const symbols = h('div', { class: 'bar-slot' }, symbolBar(editor, LANG[current]));
  const tabs = editable.map((f) => h('button', { type: 'button', class: `file-tab ${f === current ? 'active' : ''}`, 'data-file': f, onclick: () => switchTo(f) }, FILE_NAMES[f]));
  const tabBar = editable.length > 1 ? h('div', { class: 'file-tabs', role: 'tablist' }, tabs) : h('div', { class: 'file-tabs' }, tabs);

  // ---- preview ---------------------------------------------------------------
  const preview = new Preview({
    onLog: (l) => { logs.push(l); drawConsole(); },
    onError: (raw) => { errors.push(raw); consoleOpen = true; drawConsole(); },
  });
  let goalPreview = null;
  const hasPage = () => editable.includes('html') || editable.includes('css') || docs.html.trim() !== '';
  const stage = h('div', { class: 'preview-stage' }, preview.frame);
  const consoleBox = h('div', { class: 'web-console', 'aria-live': 'polite' });
  const tips = h('div', { class: 'web-tips' });
  const consoleBtn = h('button', { type: 'button', class: 'btn btn-small', onclick: () => { consoleOpen = !consoleOpen; drawConsole(); } }, 'Console');
  const goalBtn = goal ? h('button', { type: 'button', class: 'btn btn-small', onclick: toggleGoal }, 'See the goal') : null;
  const label = h('span', { class: 'label' }, hasPage() ? 'Live preview' : 'Console');
  const reloadBtn = h('button', { type: 'button', class: 'btn btn-small', onclick: render, title: 'Load the page again from scratch (saved data stays)' }, 'Reload page');
  const download = h('button', { type: 'button', class: 'btn btn-small btn-ghost', onclick: saveAsFile, title: 'Download this page as a file you can send or open in any browser' }, 'Save page');
  const head = h('div', { class: 'preview-head' }, label, h('span', { class: 'grow' }), goalBtn, hasPage() ? reloadBtn : null, consoleBtn, hasPage() ? download : null);

  function drawConsole() {
    consoleBtn.textContent = errors.length ? `Console (${errors.length} error${errors.length > 1 ? 's' : ''})` : logs.length ? `Console (${logs.length})` : 'Console';
    consoleBtn.classList.toggle('has-error', errors.length > 0);
    if (!consoleOpen && !(!hasPage() && (logs.length || errors.length))) {
      consoleBox.hidden = true;
      return;
    }
    consoleBox.hidden = false;
    replace(
      consoleBox,
      logs.length ? h('pre', { class: 'out web-log' }, logs.map((l) => `${l.level === 'error' || l.level === 'warn' ? '! ' : '› '}${l.text}`).join('\n')) : errors.length ? null : h('p', { class: 'muted small' }, 'Nothing here yet. Use console.log("hello") in your JavaScript to print things.'),
      errors.slice(0, 1).map((raw) => errorCard(raw, 'web')),
    );
  }

  function drawTips() {
    const problems = [];
    if (editable.includes('html')) problems.push(...Engine.lintHtml(docs.html).map((p) => ({ ...p, file: 'html' })));
    if (editable.includes('css')) problems.push(...Engine.lintCss(docs.css).map((p) => ({ ...p, file: 'css' })));
    replace(
      tips,
      problems.slice(0, 3).map((p) => h('p', { class: `web-tip ${p.kind === 'tip' ? 'soft' : ''}` }, h('b', null, p.kind === 'tip' ? 'Tip · ' : `${FILE_NAMES[p.file]} · `), richText(p.message))),
    );
  }

  function render() {
    logs.length = 0;
    errors.length = 0;
    drawConsole();
    drawTips();
    if (!hasPage() && !docs.js.trim()) return;
    preview.render(docs, { assets, api, strict });
  }
  const schedule = debounce(render, 600);

  function toggleGoal() {
    showingGoal = !showingGoal;
    if (showingGoal && !goalPreview) {
      goalPreview = new Preview({});
      goalPreview.frame.classList.add('goal-frame');
      stage.append(goalPreview.frame);
      goalPreview.render(filesFrom(goal), { assets, api });
    }
    preview.frame.hidden = showingGoal;
    if (goalPreview) goalPreview.frame.hidden = !showingGoal;
    goalBtn.textContent = showingGoal ? 'Back to my page' : 'See the goal';
    label.textContent = showingGoal ? 'The goal' : 'Live preview';
    stage.classList.toggle('is-goal', showingGoal);
  }

  function saveAsFile() {
    const { html } = Engine.buildDocument(docs, { harness: false, guard: false, assets });
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const a = h('a', { href: url, download: 'my-page.html' });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  function switchTo(file) {
    if (file === current) return;
    docs[current] = editor.getValue();
    current = file;
    switching = true;
    editor.setLanguage(LANG[file]);
    editor.setValue(docs[file]);
    switching = false;
    replace(symbols, symbolBar(editor, LANG[file]));
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.file === file));
  }

  render();
  if (!hasPage()) stage.hidden = true;

  const node = h(
    'div',
    { class: 'workspace' },
    title ? h('div', { class: 'label' }, title) : null,
    tabBar,
    mount,
    symbolsInside ? symbols : null,
    head,
    stage,
    consoleBox,
    tips,
  );

  return {
    node,
    symbols,
    /** All files, including the one being typed in. */
    getFiles: () => ({ ...docs, [current]: editor.getValue() }),
    setFiles(next) {
      Object.assign(docs, filesFrom(next));
      switching = true;
      editor.setValue(docs[current]);
      switching = false;
      render();
    },
    refresh: render,
    destroy() {
      preview.destroy();
      goalPreview?.destroy();
      editor.destroy();
    },
  };
}

/** A static, non-editable live render (used when a lesson shows what the code produces). */
export function renderOnce(files, { assets, api } = {}) {
  const preview = new Preview({});
  preview.render(filesFrom(files), { assets, api });
  return preview;
}

export { buildPreview };
