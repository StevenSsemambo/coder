// The celebration after a win: Kato, stars, XP, level-ups and new badges. One small dialog, easy to close.
import { h } from './dom.js';
import { kato } from './mascot.js';
import { feel, reducedMotion } from './feedback.js';

const CONFETTI = ['#e0a526', '#0b6b4f', '#d6504a', '#3b82c4', '#a3359a', '#17794f'];

let open = null;

export function closeCelebration() {
  if (!open) return;
  open.node.remove();
  document.removeEventListener('keydown', open.onKey);
  window.removeEventListener('hashchange', closeCelebration);
  open.restore?.focus?.();
  open = null;
}

function confetti() {
  if (reducedMotion()) return null;
  const pieces = [];
  for (let i = 0; i < 26; i += 1) {
    pieces.push(
      h('span', {
        class: 'confetti',
        'aria-hidden': 'true',
        style: `left:${(i * 37) % 100}%;background:${CONFETTI[i % CONFETTI.length]};animation-delay:${(i % 9) * 0.07}s;animation-duration:${1.6 + (i % 5) * 0.25}s;transform:rotate(${i * 29}deg)`,
      }),
    );
  }
  return h('div', { class: 'confetti-layer', 'aria-hidden': 'true' }, pieces);
}

function starRow(stars) {
  return h(
    'div',
    { class: 'stars', role: 'img', 'aria-label': `${stars} of 3 stars` },
    [1, 2, 3].map((n) => h('span', { class: `star ${n <= stars ? 'on' : ''}`, style: `animation-delay:${0.15 + n * 0.18}s`, 'aria-hidden': 'true' }, '★')),
  );
}

function levelBar(stats) {
  const lv = stats.level;
  return h(
    'div',
    { class: 'levelbar' },
    h('div', { class: 'levelbar-top' }, h('strong', null, `Level ${lv.level}`), h('span', { class: 'muted small' }, lv.title)),
    h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': lv.pct }, h('span', { style: `width:${lv.pct}%` })),
    h('p', { class: 'muted small' }, `${lv.span - lv.into} XP to the next level`),
  );
}

/**
 * @param {object} o
 * @param {string} o.title        headline
 * @param {string} [o.sub]        one kind line under it
 * @param {number} [o.stars]      0 hides the star row
 * @param {number} o.xpGained
 * @param {object} [o.levelUp]    levelInfo of the new level, when one was reached
 * @param {Array}  [o.badges]     badge objects just earned
 * @param {object} [o.daily]      { done, goal, reached }
 * @param {object} [o.stats]      loadStats().stats, to draw the level bar
 * @param {{label: string, href?: string, run?: Function}} o.primary
 */
export function showCelebration(o) {
  closeCelebration();
  const restore = document.activeElement;
  const close = () => closeCelebration();
  const mood = o.levelUp || (o.stars || 0) >= 3 ? 'cheer' : 'happy';

  const primary = o.primary.href
    ? h('a', { class: 'btn btn-primary', href: o.primary.href, onclick: close }, o.primary.label)
    : h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { close(); o.primary.run?.(); } }, o.primary.label);

  const card = h(
    'div',
    { class: 'celebrate-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'cel-title' },
    h('div', { class: 'cel-kato' }, kato(mood, 96)),
    h('h2', { id: 'cel-title', class: 'cel-title' }, o.title),
    o.sub ? h('p', { class: 'muted cel-sub' }, o.sub) : null,
    o.stars ? starRow(o.stars) : null,
    o.xpGained ? h('div', { class: 'xp-chip' }, `+${o.xpGained} XP`) : null,
    o.levelUp ? h('div', { class: 'levelup' }, h('strong', null, 'Level up!'), h('span', null, `You are now Level ${o.levelUp.level}: ${o.levelUp.title}`)) : null,
    (o.badges || []).map((b) => h('div', { class: 'badge-new' }, h('span', { class: 'badge-icon', 'aria-hidden': 'true' }, b.icon), h('div', null, h('strong', null, `New badge: ${b.title}`), h('p', { class: 'muted small' }, b.desc)))),
    o.daily?.reached && o.daily.done === o.daily.goal ? h('p', { class: 'goal-note' }, '🎯 Daily goal reached. Come back tomorrow to keep your streak.') : o.daily ? h('p', { class: 'muted small' }, `Today: ${Math.min(o.daily.done, o.daily.goal)} of ${o.daily.goal}`) : null,
    o.stats ? levelBar(o.stats) : null,
    h('div', { class: 'cel-actions' }, primary, h('button', { class: 'btn btn-ghost', type: 'button', onclick: close }, 'Close')),
  );

  const node = h('div', { class: 'celebrate' }, confetti(), card);
  node.addEventListener('click', (e) => { if (e.target === node) close(); });
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  window.addEventListener('hashchange', closeCelebration);
  document.body.append(node);
  open = { node, onKey, restore };
  feel(o.levelUp ? 'level' : 'win');
  (primary.focus ? primary : card).focus?.();
  return node;
}
