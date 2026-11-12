// Touch-friendly code editor built on CodeMirror 6.
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo } from '@codemirror/commands';
import { indentOnInput, bracketMatching, syntaxHighlighting, HighlightStyle, indentUnit } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { tags } from '@lezer/highlight';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

// Colours come from CSS variables so the editor follows light and dark mode.
const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword, tags.definitionKeyword], color: 'var(--tok-keyword)' },
  { tag: [tags.string, tags.special(tags.string), tags.character], color: 'var(--tok-string)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--tok-number)' },
  { tag: [tags.lineComment, tags.blockComment, tags.comment], color: 'var(--tok-comment)', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--tok-fn)' },
  { tag: [tags.typeName, tags.className, tags.standard(tags.typeName)], color: 'var(--tok-type)' },
  { tag: [tags.meta, tags.processingInstruction], color: 'var(--tok-meta)' },
  { tag: [tags.operator, tags.punctuation, tags.bracket], color: 'var(--tok-punct)' },
]);

const theme = EditorView.theme({
  '&': { height: '100%', backgroundColor: 'var(--editor-bg)', color: 'var(--ink)', fontSize: 'var(--code-size, 16px)' },
  '.cm-scroller': { fontFamily: 'var(--mono)', lineHeight: '1.5', overflow: 'auto' },
  '.cm-content': { caretColor: 'var(--accent)', padding: '10px 0' },
  '.cm-gutters': { backgroundColor: 'var(--editor-gutter)', color: 'var(--muted)', border: 'none' },
  '.cm-activeLine': { backgroundColor: 'var(--editor-active)' },
  '.cm-activeLineGutter': { backgroundColor: 'var(--editor-active)' },
  '&.cm-focused': { outline: 'none' },
  '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--accent)', borderLeftWidth: '2px' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: 'var(--selection) !important' },
  '.cm-matchingBracket': { backgroundColor: 'var(--selection)', outline: 'none' },
});

const languageExtension = (language) => {
  if (language === 'c') return cpp();
  if (language === 'html') return html();
  if (language === 'css') return css();
  if (language === 'js') return javascript();
  return python();
};

export function createEditor(parent, { language = 'python', doc = '', onChange } = {}) {
  const languageSlot = new Compartment();
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc,
      extensions: [
        lineNumbers(),
        history(),
        drawSelection(),
        highlightActiveLine(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        indentUnit.of(['html', 'css', 'js'].includes(language) ? '  ' : '    '),
        syntaxHighlighting(highlight),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
        languageSlot.of(languageExtension(language)),
        // Phone keyboards: no auto-capitalise, auto-correct or spell-check inside code.
        EditorView.contentAttributes.of({
          autocapitalize: 'off',
          autocorrect: 'off',
          autocomplete: 'off',
          spellcheck: 'false',
          'data-gramm': 'false',
          enterkeyhint: 'enter',
        }),
        EditorView.updateListener.of((u) => {
          if (u.docChanged && onChange) onChange(u.state.doc.toString());
        }),
        theme,
      ],
    }),
  });

  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue(text) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
    },
    setLanguage(lang) {
      view.dispatch({ effects: languageSlot.reconfigure(languageExtension(lang)) });
    },
    /** Insert text at the cursor. `back` moves the cursor left afterwards (to sit between a pair). */
    insert(text, back = 0) {
      const { from, to } = view.state.selection.main;
      view.dispatch({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length - back },
        scrollIntoView: true,
      });
      view.focus();
    },
    undo: () => undo(view),
    redo: () => redo(view),
    focus: () => view.focus(),
    destroy: () => view.destroy(),
  };
}
