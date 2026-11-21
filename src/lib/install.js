// "Add to home screen". Android Chrome lets us ask with one tap; iPhones need the Share menu, so we explain it.
let deferred = null;

export function captureInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // we show our own friendly card instead of the browser's mini bar
    deferred = e;
    window.dispatchEvent(new Event('saymacoder:installable'));
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    window.dispatchEvent(new Event('saymacoder:installable'));
  });
}

export const isStandalone = () => Boolean(globalThis.matchMedia?.('(display-mode: standalone)').matches || globalThis.navigator?.standalone === true);
export const isIOS = () => /iphone|ipad|ipod/i.test(globalThis.navigator?.userAgent || '');

/** 'installed' | 'prompt' (one tap works) | 'ios' (show the Share steps) | 'none' (nothing to offer) */
export function installState() {
  if (isStandalone()) return 'installed';
  if (deferred) return 'prompt';
  if (isIOS()) return 'ios';
  return 'none';
}

export async function promptInstall() {
  if (!deferred) return 'none';
  const ev = deferred;
  deferred = null;
  ev.prompt();
  try {
    const choice = await ev.userChoice;
    if (choice?.outcome === 'accepted') await globalThis.navigator?.storage?.persist?.().catch?.(() => {});
    return choice?.outcome || 'dismissed';
  } catch {
    return 'dismissed';
  }
}
