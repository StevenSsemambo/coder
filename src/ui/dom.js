// Tiny DOM helpers (no framework, to keep the app small and fast on low-end phones).

export function h(tag, props, ...children) {
  const el = document.createElement(tag);
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'class') el.className = value;
      else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key === 'value' || key === 'checked' || key === 'disabled' || key === 'selected') el[key] = value;
      else el.setAttribute(key, value === true ? '' : String(value));
    }
  }
  append(el, children);
  return el;
}

export function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

export function replace(el, ...children) {
  el.replaceChildren();
  return append(el, children);
}

/** Turn `code` spans and **bold** words in a string into elements. Returns an array of nodes. */
export function richText(text) {
  return String(text)
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return h('code', null, part.slice(1, -1));
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return h('strong', null, part.slice(2, -2));
      return part;
    });
}

/** Close the on-screen keyboard and bring the tab bar back (called when a run starts). */
export function dismissKeyboard() {
  const active = document.activeElement;
  if (active && active !== document.body) active.blur?.();
  document.body.classList.remove('typing');
}

/** Bring a freshly rendered result into view (the Run button is far below the editor on a phone). */
export function revealResult(node) {
  const calm = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  node.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
}

export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
