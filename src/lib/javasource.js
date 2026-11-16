// Java source preparation (Java track). Pure functions, so the app and the Node tests share them.
// The Java engine (OpenJDK javac + TeaVM in WebAssembly) has three quirks that a student could not
// possibly work around, so the source is adjusted before it is built. Each fix keeps the program's
// meaning exactly as real Java defines it. The quirks are documented in docs/JAVA-TRACK.md (G5, G6, G11).

/**
 * Split Java source into pieces: code, string, textblock, char, comment.
 * Joining the pieces gives back the exact input.
 */
export function segments(source) {
  const out = [];
  let i = 0;
  let start = 0;
  const push = (kind, end) => {
    if (end > start) out.push({ kind, text: source.slice(start, end) });
    start = end;
  };
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];
    if (c === '/' && next === '/') {
      push('code', i);
      while (i < source.length && source[i] !== '\n') i += 1;
      push('comment', i);
    } else if (c === '/' && next === '*') {
      push('code', i);
      const end = source.indexOf('*/', i + 2);
      i = end === -1 ? source.length : end + 2;
      push('comment', i);
    } else if (c === '"' && source.startsWith('"""', i)) {
      push('code', i);
      i += 3;
      while (i < source.length && !source.startsWith('"""', i)) i += source[i] === '\\' ? 2 : 1;
      i = Math.min(source.length, i + 3);
      push('textblock', i);
    } else if (c === '"') {
      push('code', i);
      i += 1;
      while (i < source.length && source[i] !== '"' && source[i] !== '\n') i += source[i] === '\\' ? 2 : 1;
      i = Math.min(source.length, i + 1);
      push('string', i);
    } else if (c === "'") {
      push('code', i);
      i += 1;
      while (i < source.length && source[i] !== "'" && source[i] !== '\n') i += source[i] === '\\' ? 2 : 1;
      i = Math.min(source.length, i + 1);
      push('char', i);
    } else {
      i += 1;
    }
  }
  push('code', source.length);
  return out;
}

/** In a format string `%n` means "new line", but the engine's formatter wrongly uses up an argument for it. */
function fixPercentN(text) {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '%' && text[i + 1] === '%') {
      out += '%%';
      i += 1;
    } else if (text[i] === '%' && text[i + 1] === 'n') {
      out += '\\n';
      i += 1;
    } else {
      out += text[i];
    }
  }
  return out;
}

/**
 * `10 / 0` written with a literal zero makes the engine's COMPILER crash (it tries to work the answer out
 * while building). Real Java builds it and throws ArithmeticException when the program runs. Hiding the
 * zero from the compiler gives exactly that. `5.0 / 0` still gives Infinity, as in Java.
 */
function fixLiteralZeroDivisor(code) {
  return code.replace(/([/%])(\s*)0(?![\w.])/g, (m, op, space) => `${op}${space}Integer.parseInt("0")`);
}

export function normalizeJava(source) {
  return segments(source)
    .map((seg) => {
      if (seg.kind === 'code') return fixLiteralZeroDivisor(seg.text);
      if (seg.kind === 'string' || seg.kind === 'textblock') return fixPercentN(seg.text);
      return seg.text;
    })
    .join('');
}

/** Replace comments and the inside of strings and chars with spaces, keeping every position. */
function mask(source) {
  return segments(source)
    .map((seg) => {
      if (seg.kind === 'code') return seg.text;
      return seg.text.replace(/[^\n]/g, ' ');
    })
    .join('');
}

/**
 * Find the top-level class that holds `main`, and the file name Java needs for the program.
 * The engine always compiles one file, and Java insists a public class lives in a file with its name,
 * so the file is named after the public class (or Main when no class is public).
 * @returns {{ mainClass: string, fileName: string }}
 */
export function javaRunInfo(source) {
  const code = mask(source);
  const topLevel = []; // { name, isPublic, hasMain }
  let depth = 0;
  let current = null;
  const declaration = /\b(?:(public)\s+)?(?:(?:abstract|final|sealed|non-sealed|strictfp|static)\s+)*(class|interface|enum|record)\s+([A-Za-z_$][\w$]*)/y;
  for (let i = 0; i < code.length; i += 1) {
    const c = code[i];
    if (c === '{') depth += 1;
    else if (c === '}') {
      depth -= 1;
      if (depth === 0) current = null;
    } else if (depth === 0 && /[a-z]/.test(c) && (i === 0 || !/[\w$]/.test(code[i - 1]))) {
      declaration.lastIndex = i;
      const m = declaration.exec(code);
      if (m) {
        current = { name: m[3], isPublic: !!m[1] || /\bpublic\b/.test(code.slice(Math.max(0, i - 12), i)), hasMain: false };
        topLevel.push(current);
        i = declaration.lastIndex - 1;
      }
    } else if (depth === 1 && current && c === 's' && /^static\s+void\s+main\s*\(/.test(code.slice(i, i + 40)) && (i === 0 || !/[\w$]/.test(code[i - 1]))) {
      current.hasMain = true;
    }
  }
  const withMain = topLevel.find((k) => k.hasMain);
  const publicClass = topLevel.find((k) => k.isPublic);
  const mainClass = (withMain || publicClass || { name: 'Main' }).name;
  const fileName = `${(publicClass || { name: 'Main' }).name}.java`;
  return { mainClass, fileName };
}
