// The launch screen lives in index.html (so it shows before JavaScript loads). Once the app is drawn, fade it away.
// It stays a little while on a cold start so the name and logo register; the time already spent loading counts, so a slow start is never made slower.
// First open in a session: 2.2 seconds, long enough to read the name. Later reloads in the same session: 0.9 seconds.
const FIRST_MS = 2200;
const AGAIN_MS = 900;

function minimum() {
  try {
    const seen = sessionStorage.getItem('splashSeen');
    sessionStorage.setItem('splashSeen', '1');
    return seen ? AGAIN_MS : FIRST_MS;
  } catch {
    return FIRST_MS;
  }
}

export function hideSplash() {
  const s = document.getElementById('splash');
  if (!s) return;
  const waited = Date.now() - (window.__splashStart || Date.now());
  const MIN_MS = minimum();
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
