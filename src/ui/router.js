// Minimal hash router: #/learn, #/code, #/exercise/c-structured/c-first/c1-hello ...
const routes = [];

export function route(pattern, handler) {
  const re = new RegExp(`^${pattern.replace(/:[a-zA-Z]+/g, '([^/]+)')}$`);
  routes.push({ re, handler });
}

export const go = (path) => {
  location.hash = `#${path}`;
};

export function startRouter(mount, onChange) {
  let current = null;
  let token = 0;

  async function render() {
    const path = location.hash.replace(/^#/, '') || '/learn';
    const myToken = ++token;
    if (current?.cleanup) current.cleanup();
    current = null;

    for (const { re, handler } of routes) {
      const m = path.match(re);
      if (!m) continue;
      const view = await handler(...m.slice(1).map(decodeURIComponent));
      if (myToken !== token) {
        view?.cleanup?.();
        return;
      }
      current = view;
      mount.replaceChildren(view.node);
      window.scrollTo(0, 0);
      onChange(path);
      return;
    }
    go('/learn');
  }

  window.addEventListener('hashchange', render);
  return render();
}
