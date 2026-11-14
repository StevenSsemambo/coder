// Source preparation shared by the app and the tests.
//
// The C interpreter (JSCPP) is a teaching-subset interpreter with two quirks that would
// otherwise fail correct student programs, so the source is normalised before it runs:
//
//   1. It rejects "int main(void)". For a student it means the same as "int main()".
//   2. Inside a function call, its preprocessor splits string literals at commas and brackets and drops the
//      whitespace next to them: printf("Hello, world") prints "Hello,world" and "Total (UGX)" loses its space.
//      Writing that whitespace as the escape \x20 keeps the exact same string and avoids the bug.

/** Split source into code, string-literal, char-literal and comment segments. */
function segments(source) {
  const out = [];
  let code = '';
  let i = 0;
  const flush = () => {
    if (code) out.push({ kind: 'code', text: code });
    code = '';
  };
  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];
    if (ch === '/' && next === '/') {
      flush();
      let j = i;
      while (j < source.length && source[j] !== '\n') j += 1;
      out.push({ kind: 'comment', text: source.slice(i, j) });
      i = j;
    } else if (ch === '/' && next === '*') {
      flush();
      const end = source.indexOf('*/', i + 2);
      const j = end === -1 ? source.length : end + 2;
      out.push({ kind: 'comment', text: source.slice(i, j) });
      i = j;
    } else if (ch === '"' || ch === "'") {
      flush();
      let j = i + 1;
      while (j < source.length && source[j] !== ch && source[j] !== '\n') {
        j += source[j] === '\\' ? 2 : 1;
      }
      j = Math.min(j + 1, source.length);
      out.push({ kind: ch === '"' ? 'string' : 'char', text: source.slice(i, j) });
      i = j;
    } else {
      code += ch;
      i += 1;
    }
  }
  flush();
  return out;
}

/** Whitespace inside a string literal that the interpreter would drop, written as escapes: after a comma, after a
 *  bracket, and before a bracket (so "Total (UGX): 5" and "a, b" print exactly as typed). */
function protectCommaSpaces(literal) {
  const esc = (ws) => [...ws].map((c) => (c === ' ' ? '\\x20' : '\\t')).join('');
  return literal.replace(/([,()])([ \t]+)|([ \t]+)(?=[()])/g, (_, mark, after, before) => (before !== undefined ? esc(before) : mark + esc(after)));
}

/** "main(void)" and similar become "main()". Only touches code, never strings or comments. */
function fixVoidParams(code) {
  return code.replace(/\b(?!return\b)([A-Za-z_]\w*)\s*\(\s*void\s*\)/g, '$1()');
}

export function normalizeC(source) {
  return segments(source)
    .map((seg) => {
      if (seg.kind === 'code') return fixVoidParams(seg.text);
      if (seg.kind === 'string') return protectCommaSpaces(seg.text);
      return seg.text;
    })
    .join('');
}

export function prepareSource(language, source) {
  return language === 'c' ? normalizeC(source) : source;
}
