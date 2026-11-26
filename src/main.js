import './styles.css';
import { h } from './ui/dom.js';
import { icon } from './ui/icons.js';
import { route, startRouter } from './ui/router.js';
import { state, applySettings } from './state.js';
import { loadSettings, getProgress } from './lib/storage.js';
import { learnView, courseView } from './ui/views/learn.js';
import { lessonView } from './ui/views/lesson.js';
import { stepLessonView } from './ui/views/steps-lesson.js';
import { onAttempt } from './ui/rewards.js';
import { unlockAudio } from './ui/feedback.js';
import { welcomeView } from './ui/views/welcome.js';
import { reviewView } from './ui/views/review.js';
import { logoMark } from './ui/logo.js';
import { hideSplash, splashFailed } from './ui/splash.js';
import { pathsView, certificateView } from './ui/views/paths.js';
import { captureInstall } from './lib/install.js';
import { exerciseView } from './ui/views/exercise.js';
import { playgroundView } from './ui/views/playground.js';
import { progressView } from './ui/views/progress.js';
import { settingsView } from './ui/views/settings.js';
import { registerSW } from 'virtual:pwa-register';
import { toast } from './ui/components.js';

const TABS = [
  { path: '/learn', label: 'Learn', icon: 'learn', match: /^\/(learn|course|lesson|page|exercise|review)/ },
  { path: '/code', label: 'Code', icon: 'code', match: /^\/code/ },
  { path: '/progress', label: 'Progress', icon: 'progress', match: /^\/(progress|paths|certificate)/ },
  { path: '/settings', label: 'Settings', icon: 'settings', match: /^\/settings/ },
];

async function boot() {
  state.settings = await loadSettings();
  state.progress = await getProgress();
  applySettings();

  const main = h('main', { id: 'main', tabindex: '-1' });
  const offlineBadge = h('span', { class: 'net-badge', role: 'status' });
  const tabLinks = TABS.map((t) => h('a', { class: 'tab', href: `#${t.path}`, 'aria-label': t.label }, icon(t.icon), h('span', null, t.label)));

  const updateNet = () => {
    offlineBadge.textContent = navigator.onLine ? '' : 'Offline';
    offlineBadge.classList.toggle('show', !navigator.onLine);
  };
  window.addEventListener('online', updateNet);
  window.addEventListener('offline', updateNet);
  updateNet();

  // Phones allow sound only after a touch: wake the audio on the first one. Celebrations listen for graded attempts.
  document.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('saymacoder:attempt', (e) => onAttempt(e.detail));
  captureInstall();

  // While typing, hide the tab bar so the dock sits right above the keyboard and the editor gets the space.
  const isTypingTarget = (el) => el?.matches?.('.cm-content, textarea, input[type="text"], input:not([type])');
  document.addEventListener('focusin', (e) => document.body.classList.toggle('typing', !!isTypingTarget(e.target)));
  document.addEventListener('focusout', (e) => {
    if (!isTypingTarget(e.target) || e.relatedTarget?.closest?.('.dock')) return;
    setTimeout(() => { if (!isTypingTarget(document.activeElement)) document.body.classList.remove('typing'); }, 80);
  });

  document.getElementById('app').replaceChildren(
    h('header', { class: 'topbar' }, h('a', { class: 'brand', href: '#/learn' }, h('span', { class: 'brand-mark', 'aria-hidden': 'true' }, logoMark(30)), h('span', { class: 'brand-name' }, 'SayMa', h('b', null, 'Coder'))), offlineBadge),
    main,
    h('nav', { class: 'tabbar', 'aria-label': 'Main' }, tabLinks),
  );

  route('/welcome', () => welcomeView());
  route('/review', () => reviewView());
  route('/paths', () => pathsView());
  route('/certificate/:kind/:id', (kind, id) => certificateView(kind, id));
  route('/learn', () => learnView());
  route('/course/:id', (id) => courseView(id));
  route('/lesson/:course/:lesson', (c, l) => stepLessonView(c, l));
  route('/page/:course/:lesson', (c, l) => lessonView(c, l));
  route('/exercise/:course/:lesson/:id', (c, l, id) => exerciseView(c, l, id));
  route('/code', () => playgroundView());
  route('/progress', () => progressView());
  route('/settings', () => settingsView());

  await startRouter(main, (path) => {
    // Screen readers and the browser history use the page title; keep it in step with the screen.
    const h1 = main.querySelector('h1');
    document.title = h1?.textContent ? `${h1.textContent} · SayMaCoder` : 'SayMaCoder';
    TABS.forEach((t, i) => {
      const active = t.match.test(path);
      tabLinks[i].classList.toggle('active', active);
      if (active) tabLinks[i].setAttribute('aria-current', 'page');
      else tabLinks[i].removeAttribute('aria-current');
    });
  });

  // Diagnostics from the service worker (visible in the browser console and in window.__packLog).
  window.__packLog = [];
  navigator.serviceWorker?.addEventListener('message', (e) => {
    if (e.data?.type?.startsWith('pack-')) {
      window.__packLog.push(e.data);
      console.warn('[SayMaCoder pack]', e.data);
    }
  });

  // Offline support: new versions are installed quietly and applied when the student agrees.
  const update = registerSW({
    onNeedRefresh() {
      toast('A new version is ready.', { label: 'Update', run: () => update(true) });
    },
    onOfflineReady() {
      state.offlineReady = true;
      toast('The app is ready to work offline.');
    },
  });
}

boot().then(hideSplash).catch((e) => {
  console.error(e);
  splashFailed();
});
