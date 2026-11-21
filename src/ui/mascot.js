// Kato, the SayMaCoder guide: a small, friendly robot drawn as inline SVG (no image files, works offline).
// Moods change the eyes and mouth: 'happy', 'cheer', 'think', 'oops', 'sleepy'.
// Colours come from the app's CSS variables, so Kato follows light and dark mode.
import { h } from './dom.js';

const NS = 'http://www.w3.org/2000/svg';

function svg(tag, attrs = {}, ...kids) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  for (const kid of kids.flat()) if (kid) el.append(kid);
  return el;
}

export const MOODS = ['happy', 'cheer', 'think', 'oops', 'sleepy'];

function eyes(mood) {
  const eye = (cx) => {
    if (mood === 'cheer') return svg('path', { d: `M${cx - 5} 40 Q${cx} 32 ${cx + 5} 40`, fill: 'none', stroke: 'var(--kato-ink)', 'stroke-width': 3.4, 'stroke-linecap': 'round' });
    if (mood === 'sleepy') return svg('path', { d: `M${cx - 5} 38 Q${cx} 43 ${cx + 5} 38`, fill: 'none', stroke: 'var(--kato-ink)', 'stroke-width': 3.4, 'stroke-linecap': 'round' });
    const look = mood === 'think' ? 2 : 0;
    return svg('g', {}, svg('circle', { cx: cx + look, cy: mood === 'oops' ? 39 : 38, r: mood === 'oops' ? 5.6 : 5, fill: 'var(--kato-ink)' }), svg('circle', { cx: cx + look + 1.7, cy: (mood === 'oops' ? 39 : 38) - 1.8, r: 1.6, fill: '#fff' }));
  };
  return [eye(33), eye(67)];
}

function mouth(mood) {
  const stroke = { fill: 'none', stroke: 'var(--kato-ink)', 'stroke-width': 3.4, 'stroke-linecap': 'round' };
  if (mood === 'cheer') return svg('path', { d: 'M38 50 Q50 66 62 50 Z', fill: 'var(--kato-ink)', stroke: 'var(--kato-ink)', 'stroke-width': 2, 'stroke-linejoin': 'round' });
  if (mood === 'think') return svg('path', { d: 'M42 55 L58 53', ...stroke });
  if (mood === 'oops') return svg('path', { d: 'M40 58 Q50 49 60 58', ...stroke });
  if (mood === 'sleepy') return svg('path', { d: 'M44 54 Q50 57 56 54', ...stroke });
  return svg('path', { d: 'M39 51 Q50 62 61 51', ...stroke });
}

/** Kato as an SVG element. `size` is in pixels. */
export function kato(mood = 'happy', size = 64) {
  const m = MOODS.includes(mood) ? mood : 'happy';
  const root = svg(
    'svg',
    { viewBox: '0 0 100 100', width: size, height: size, role: 'img', 'aria-label': 'Kato, your coding guide', class: `kato kato-${m}` },
    // antenna
    svg('line', { x1: 50, y1: 12, x2: 50, y2: 22, stroke: 'var(--kato-body)', 'stroke-width': 4, 'stroke-linecap': 'round' }),
    svg('circle', { cx: 50, cy: 9, r: 5, fill: 'var(--kato-spark)', class: 'kato-spark' }),
    // ears
    svg('rect', { x: 10, y: 36, width: 8, height: 20, rx: 4, fill: 'var(--kato-body)' }),
    svg('rect', { x: 82, y: 36, width: 8, height: 20, rx: 4, fill: 'var(--kato-body)' }),
    // head
    svg('rect', { x: 15, y: 20, width: 70, height: 58, rx: 22, fill: 'var(--kato-body)' }),
    // face plate
    svg('rect', { x: 22, y: 27, width: 56, height: 44, rx: 16, fill: 'var(--kato-face)' }),
    eyes(m),
    m === 'cheer' || m === 'happy' ? [svg('circle', { cx: 27, cy: 55, r: 4.2, fill: 'var(--kato-cheek)', opacity: 0.7 }), svg('circle', { cx: 73, cy: 55, r: 4.2, fill: 'var(--kato-cheek)', opacity: 0.7 })] : null,
    mouth(m),
    // body hint with the </> badge
    svg('rect', { x: 32, y: 82, width: 36, height: 14, rx: 7, fill: 'var(--kato-body)' }),
    svg('text', { x: 50, y: 92.5, 'text-anchor': 'middle', 'font-size': 9.5, 'font-weight': 700, 'font-family': 'ui-monospace, Menlo, Consolas, monospace', fill: 'var(--kato-face)' }, '</>'),
  );
  return root;
}

/** Kato with a speech bubble: `kato-say('cheer', 'Nice work!')`. */
export function katoSays(mood, text, { size = 56 } = {}) {
  return h('div', { class: 'kato-say' }, h('div', { class: 'kato-wrap', 'aria-hidden': 'true' }, kato(mood, size)), h('div', { class: 'kato-bubble', role: 'status' }, text));
}

// Short, kind lines. Picked by a number so tests are predictable and the same screen does not repeat itself every time.
export const LINES = {
  welcome: ['Hi, I am Kato! Ready to write some code?', 'Karibu! Let us build something today.', 'Hello! One small step is all it takes.'],
  back: ['Welcome back! Your next step is ready.', 'Good to see you again. Shall we continue?', 'You are back! Let us pick up where you stopped.'],
  right: ['Yes! That is right.', 'Nice one!', 'Exactly right.', 'You got it!'],
  wrong: ['Almost! Read it once more.', 'Not yet. You can do this.', 'Good try. Look again and pick another.'],
  reveal: ['This one is tricky. Here is the answer. Read why.', 'No worry. Here is the answer, and why.'],
  practice: ['Now let us practise. Doing it is how you learn.', 'Time to try it yourself. I am here to help.'],
  stuck: ['Stuck? Hints cost nothing. Take one.', 'Every coder gets stuck. A hint is a good friend.'],
  done: ['You finished every step. Well done!', 'That lesson is done. I am proud of you!'],
  ready: ['Your first lesson is ready. Tap Continue!', 'All set! Tap Continue to begin.', 'Ready when you are. Tap Continue.'],
};

export const pickLine = (kind, n = Date.now()) => {
  const list = LINES[kind] || LINES.right;
  return list[Math.abs(Math.floor(n)) % list.length];
};
