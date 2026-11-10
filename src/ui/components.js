// Reusable UI pieces: symbol bar, output panel, error card, test results, stdin field.
import { h, richText } from './dom.js';
import { state } from '../state.js';
import { translateError, cleanRaw } from '../lib/errors.js';
import { PACKS, formatBytes } from '../lib/packs.js';

// ---- symbol bar (the big fix for typing code on a phone keyboard) ------------
const SYMBOLS = {
  c: [
    { label: 'Tab', text: '    ' },
    { label: ';', text: ';' },
    { label: '{ }', text: '{}', back: 1 },
    { label: '( )', text: '()', back: 1 },
    { label: '[ ]', text: '[]', back: 1 },
    { label: '" "', text: '""', back: 1 },
    { label: '&', text: '&' },
    { label: '*', text: '*' },
    { label: '#', text: '#' },
    { label: '<', text: '<' },
    { label: '>', text: '>' },
    { label: '=', text: '=' },
    { label: '==', text: '==' },
    { label: '%', text: '%' },
    { label: '%d', text: '%d' },
    { label: '\\n', text: '\\n' },
    { label: '!', text: '!' },
    { label: '+', text: '+' },
    { label: '-', text: '-' },
    { label: '/', text: '/' },
    { label: ',', text: ',' },
  ],
  python: [
    { label: 'Tab', text: '    ' },
    { label: ':', text: ':' },
    { label: '( )', text: '()', back: 1 },
    { label: '[ ]', text: '[]', back: 1 },
    { label: '{ }', text: '{}', back: 1 },
    { label: '" "', text: '""', back: 1 },
    { label: "' '", text: "''", back: 1 },
    { label: '=', text: '=' },
    { label: '==', text: '==' },
    { label: '#', text: '#' },
    { label: '_', text: '_' },
    { label: '+', text: '+' },
    { label: '-', text: '-' },
    { label: '*', text: '*' },
    { label: '/', text: '/' },
    { label: '%', text: '%' },
    { label: '<', text: '<' },
    { label: '>', text: '>' },
    { label: ',', text: ',' },
    { label: '.', text: '.' },
  ],
};

export function symbolBar(editor, language) {
  const keep = (e) => e.preventDefault(); // keep the keyboard open and the cursor in place
  const key = (label, title, onClick, extra = '') =>
    h('button', { type: 'button', class: `sym ${extra}`.trim(), title, 'aria-label': title, onmousedown: keep, onclick: onClick }, label);

  return h(
    'div',
    { class: 'symbar', role: 'toolbar', 'aria-label': 'Code symbols' },
    key('Undo', 'Undo', () => editor.undo(), 'sym-wide'),
    key('Redo', 'Redo', () => editor.redo(), 'sym-wide'),
    SYMBOLS[language].map((s) => key(s.label, `Insert ${s.label}`, () => editor.insert(s.text, s.back || 0))),
  );
}

/**
 * Bottom dock holding the symbol bar and the main buttons.
 * Pressing it must not move focus away from the editor: otherwise the keyboard state changes, the layout
 * shifts under the finger or mouse, and the press never turns into a click.
 */
export function dock(...children) {
  const node = h('div', { class: 'dock' }, ...children);
  node.addEventListener('mousedown', (e) => e.preventDefault());
  return node;
}

// ---- Input (stdin) field -----------------------------------------------------
export function stdinField(initial = '') {
  const box = h('textarea', {
    class: 'stdin',
    rows: 2,
    value: initial,
    placeholder: 'Type the program input here, one value per line or separated by spaces',
    autocapitalize: 'off',
    autocorrect: 'off',
    spellcheck: 'false',
  });
  box.value = initial;
  return { node: h('label', { class: 'stdin-wrap' }, h('span', { class: 'label' }, 'Input'), box), get value() { return box.value; } };
}

// ---- Output / error panels -----------------------------------------------------
export function packMissingCard(language, detail) {
  const pack = PACKS[language];
  const name = pack ? pack.name : language;
  return h(
    'div',
    { class: 'card notice' },
    h('strong', null, `${name} could not start`),
    pack
      ? h('p', null, `If you have not downloaded it yet, download it once while you have a connection (${formatBytes(pack.bytes)}). After that it works with no internet. If you already did, close and reopen the app, then try again.`)
      : h('p', null, 'Close and reopen the app, then try again.'),
    pack ? h('a', { class: 'btn btn-primary', href: '#/settings' }, 'Open downloads') : null,
    detail ? h('details', null, h('summary', null, 'Technical details'), h('pre', { class: 'raw' }, detail)) : null,
  );
}

export function errorCard(raw, language) {
  const t = translateError(raw, { language, lang: state.settings.lang });
  const original = cleanRaw(raw, language);
  const line = t?.line ?? null;
  return h(
    'div',
    { class: 'card error', role: 'alert' },
    t
      ? [
          h('div', { class: 'error-head' }, h('strong', null, t.title), line ? h('span', { class: 'chip' }, `Line ${line}`) : null),
          h('p', null, richText(t.why)),
          h('p', { class: 'fix' }, h('b', null, state.settings.lang === 'sw' ? 'Suluhisho: ' : 'Fix: '), richText(t.fix)),
          t.fellBack ? h('p', { class: 'muted small' }, 'This message is not translated yet. Showing English.') : null,
        ]
      : [h('div', { class: 'error-head' }, h('strong', null, 'Your program stopped with an error'), line ? h('span', { class: 'chip' }, `Line ${line}`) : null)],
    h('details', null, h('summary', null, 'Original message'), h('pre', { class: 'raw' }, original)),
  );
}

export function outputView(res, language) {
  if (res.initFailed) return packMissingCard(language, res.error);
  const parts = [];
  const text = res.stdout + (res.stderr ? res.stderr : '');
  parts.push(h('pre', { class: 'out' }, text || (res.error ? '' : '(no output)')));
  if (res.truncated) parts.push(h('p', { class: 'muted small' }, 'Output was cut off because it was very long.'));
  if (res.error) parts.push(errorCard(res.error, language));
  parts.push(h('p', { class: 'muted small' }, `${res.ms} ms`));
  return h('div', { class: 'output-view' }, parts);
}

export function testResultsView(result, language) {
  if (result.initFailed) return packMissingCard(language, result.message);
  const rows = result.cases.map((c) => {
    const status = c.skipped ? 'skip' : c.passed ? 'pass' : 'fail';
    const mark = status === 'pass' ? '✓' : status === 'skip' ? '–' : '✗';
    const showDetail = !c.passed && !c.skipped && !c.hidden;
    return h(
      'li',
      { class: `test ${status}` },
      h('div', { class: 'test-head' }, h('span', { class: 'mark' }, mark), h('span', null, c.hidden ? `${c.name} (hidden)` : c.name), c.timedOut ? h('span', { class: 'chip' }, 'too slow') : null),
      showDetail
        ? h(
            'div',
            { class: 'test-detail' },
            c.input ? [h('div', { class: 'label' }, 'Input'), h('pre', null, c.input)] : null,
            h('div', { class: 'label' }, 'Expected'),
            h('pre', null, c.expected),
            h('div', { class: 'label' }, 'Your output'),
            h('pre', null, c.actual || '(nothing)'),
          )
        : null,
    );
  });
  return h(
    'div',
    { class: 'results' },
    h('div', { class: `results-head ${result.passed ? 'pass' : 'fail'}` }, result.passed ? 'All tests passed' : `${result.passedCount} of ${result.total} tests passed`),
    h('ul', { class: 'tests' }, rows),
    result.firstError ? errorCard(result.firstError, language) : null,
  );
}

export function progressBar(fraction) {
  const pct = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  return h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct }, h('span', { style: `width:${pct}%` }));
}

export function toast(message, action) {
  const node = h(
    'div',
    { class: 'toast', role: 'status' },
    h('span', null, message),
    action ? h('button', { class: 'btn btn-small', onclick: () => { action.run(); node.remove(); } }, action.label) : null,
    h('button', { class: 'toast-close', 'aria-label': 'Dismiss', onclick: () => node.remove() }, '×'),
  );
  document.body.append(node);
  if (!action) setTimeout(() => node.remove(), 4000);
  return node;
}
