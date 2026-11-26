// The SayMaCoder logo mark, drawn in code (the same drawing as public/icons/logo.svg and the launch screen in index.html).
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, ...kids) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  kids.forEach((k) => n.append(k));
  return n;
};
let n = 0;

/** The logo as an SVG element, `size` pixels square. Decorative: the name is written next to it. */
export function logoMark(size = 30) {
  const id = `lg${(n += 1)}`;
  const stroke = { fill: 'none', 'stroke-width': 46, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  return el(
    'svg',
    { viewBox: '0 0 512 512', width: size, height: size, 'aria-hidden': 'true', focusable: 'false', class: 'logo-mark' },
    el('defs', {}, el('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1 }, el('stop', { offset: 0, 'stop-color': '#15a077' }), el('stop', { offset: 0.55, 'stop-color': '#0b6b4f' }), el('stop', { offset: 1, 'stop-color': '#06402e' }))),
    el('rect', { width: 512, height: 512, rx: 116, fill: `url(#${id})` }),
    el('path', { d: 'M176 182 L96 252 L176 322', stroke: '#fff', ...stroke }),
    el('path', { d: 'M336 182 L416 252 L336 322', stroke: '#fff', ...stroke }),
    el('path', { d: 'M282 164 L230 340', stroke: '#ffc94d', ...stroke }),
    el('rect', { x: 190, y: 384, width: 132, height: 28, rx: 14, fill: '#8ff0c4' }),
  );
}
