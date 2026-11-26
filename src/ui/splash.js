// The launch screen lives in index.html (so it shows before JavaScript loads). Once the app is drawn, fade it away.
// It stays at least MIN_MS on a cold start so the name and logo register, but never makes a slow start slower.
const MIN_MS = 700;

export function hideSplash() {
  const s = document.getElementById('splash');
  if (!s) return;
  const waited = Date.now() - (window.__splashStart || Date.now());
  setTimeout(() => {
    s.classList.add('gone');
    setTimeout(() => s.remove(), 450);
  }, Math.max(0, MIN_MS - waited));
}

export function splashFailed(message) {
  const s = document.getElementById('splash');
  const note = s?.querySelector('.slow');
  if (!note) return;
  note.textContent = message || 'Something went wrong while starting. Close the app and open it again.';
  s.classList.add('late');
}
