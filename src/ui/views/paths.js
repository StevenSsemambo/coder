// Career paths list, and the certificate screen.
import { h, replace } from '../dom.js';
import { courses } from '../../content/index.js';
import { state } from '../../state.js';
import { getProgress } from '../../lib/storage.js';
import { getGame } from '../../lib/game.js';
import { getProfile, updateProfile } from '../../lib/profile.js';
import { allPathStatus, certificateTarget } from '../../lib/paths.js';
import { progressBar } from '../components.js';
import { metaOf } from '../course-meta.js';
import { katoSays } from '../mascot.js';
import { certificateCanvas, canvasBlob } from '../certificate.js';

export async function pathsView() {
  state.progress = await getProgress();
  const game = await getGame();
  const list = allPathStatus(courses, state.progress, game);
  const node = h(
    'div',
    { class: 'view paths' },
    h('a', { class: 'back', href: '#/progress' }, '← Progress'),
    h('h1', null, 'Career paths'),
    katoSays('happy', 'A path is a few courses in a good order. Finish one and you can save a certificate.', { size: 56 }),
    list.map((s) =>
      h(
        'section',
        { class: 'card path-card' },
        h('h2', null, `${s.path.emoji} ${s.path.title}`),
        h('p', { class: 'muted' }, s.path.blurb),
        progressBar(s.fraction),
        h(
          'ol',
          { class: 'path-steps' },
          s.steps.map((x) =>
            h('li', { style: `--course:${metaOf(x.course).color}` }, h('a', { href: `#/course/${x.course.id}` }, h('span', { class: `status-dot ${x.finished ? 'done' : ''}`, 'aria-hidden': 'true' }, x.finished ? '✓' : ''), h('span', { class: 'grow' }, x.course.title), h('span', { class: 'muted small' }, x.finished ? 'Done' : `${x.done}/${x.total}`))),
          ),
        ),
        s.finished ? h('a', { class: 'btn btn-primary btn-block', href: `#/certificate/path/${s.path.id}` }, '🎓 Get your certificate') : s.next ? h('a', { class: 'btn btn-block', href: `#/course/${s.next.id}` }, `Next: ${s.next.title}`) : null,
      ),
    ),
  );
  return { node };
}

export async function certificateView(kind, id) {
  state.progress = await getProgress();
  const game = await getGame();
  const target = certificateTarget(kind, id, courses, state.progress, game);
  const back = kind === 'path' ? '#/paths' : `#/course/${id}`;
  if (!target) return { node: h('div', { class: 'view' }, h('a', { class: 'back', href: '#/progress' }, '← Progress'), h('p', null, 'Certificate not found.')) };
  if (!target.finished) {
    return { node: h('div', { class: 'view' }, h('a', { class: 'back', href: back }, '← Back'), h('h1', null, 'Certificate'), katoSays('think', `Finish every lesson and exercise in ${target.title} to earn this. You can do it!`, { size: 56 }), h('a', { class: 'btn btn-primary btn-block', href: back }, 'Keep going')) };
  }

  let profile = await getProfile();
  const key = `${kind}:${id}`;
  // The date is the first day the learner opened the finished certificate, and it stays the same afterwards.
  if (!profile.certs?.[key]) profile = await updateProfile({ certs: { ...(profile.certs || {}), [key]: Date.now() } });
  const when = new Date(profile.certs[key]);
  const color = kind === 'course' ? metaOf(courses.find((c) => c.id === id)).color : '#0b6b4f';

  const slot = h('div', { class: 'cert-slot' });
  const input = h('input', { class: 'text-input', type: 'text', maxlength: 40, value: profile.name || '', placeholder: 'Your name', 'aria-label': 'Your name for the certificate', autocomplete: 'name' });
  const status = h('p', { class: 'muted small', 'aria-live': 'polite' });
  let blob = null;

  async function draw() {
    const canvas = certificateCanvas({ name: input.value.trim(), title: target.title, kind, parts: target.parts, date: when, color });
    blob = await canvasBlob(canvas).catch(() => null);
    replace(slot, canvas.toDataURL ? h('img', { class: 'cert-img', alt: `Certificate for ${input.value.trim() || 'you'}: ${target.title}`, src: canvas.toDataURL('image/png') }) : null);
  }
  async function saveName() {
    await updateProfile({ name: input.value.trim() });
    await draw();
    status.textContent = 'Saved.';
  }
  async function download() {
    if (!blob) await draw();
    if (!blob) { status.textContent = 'Could not make the image on this phone. Take a screenshot instead.'; return; }
    const file = new File([blob], `saymacoder-${id}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'My SayMaCoder certificate' }); return; } catch { /* cancelled: fall back to a download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: file.name });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    status.textContent = 'Saved to your downloads.';
  }

  const node = h(
    'div',
    { class: 'view certificate' },
    h('a', { class: 'back', href: back }, '← Back'),
    h('h1', null, 'Your certificate'),
    katoSays('cheer', `You finished ${target.title}. I am so proud of you!`, { size: 56 }),
    h('label', { class: 'field' }, h('span', null, 'Name on the certificate'), input),
    h('div', { class: 'play-tools' }, h('button', { class: 'btn btn-small', type: 'button', onclick: saveName }, 'Update name')),
    slot,
    h('button', { class: 'btn btn-primary btn-block', type: 'button', onclick: download }, navigator.canShare ? 'Save or share' : 'Save as picture'),
    status,
  );
  await draw();
  return { node };
}
