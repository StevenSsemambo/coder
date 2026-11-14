// Web track, addition for Level 5: installable and offline sites (PWA basics).
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

export const extra4Lessons = [
  {
    id: 'w44-installable-offline',
    level: 'Level 5: Go professional',
    title: 'Installable and offline: PWA basics',
    summary: 'A manifest, a service worker and a cache: make a site that opens instantly and keeps working without data.',
    minutes: 28,
    blocks: [
      {
        t: 'story',
        title: 'The tunnel and the data bundle',
        text: 'Rose\'s customers ride boda bodas through Kampala, and the signal drops in the tunnels and the valleys. Her page loads, then the next tap shows a blank screen with "No internet". Many customers also run out of data bundles by the middle of the month.\n\nA **Progressive Web App (PWA)** fixes both: after the first visit the site is **kept on the phone**, opens instantly even with no signal, and can be **installed on the home screen** like a real app. It is the same HTML, CSS and JavaScript you already know, plus two small files.',
      },
      { t: 'analogy', text: 'A normal website is a restaurant with no stock: every dish is fetched from the market when you order. A PWA is the same restaurant with a **stockroom**. The first time, the cook buys the ingredients and puts the common ones in the stockroom. Next time the cook looks in the stockroom first, so dishes come out fast, even when the market is closed.' },
      {
        t: 'list',
        items: ['A PWA needs **HTTPS**, a **web app manifest** (a small JSON file saying the app\'s name, icon and colours), and a **service worker** (a script that sits between the page and the network).', 'The **manifest** makes the site installable: `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, `background_color` and `icons` (at least 192 and 512 pixels).', 'The **service worker** runs in the background. It can answer requests from a **cache** (files saved on the phone) so the site works offline and loads instantly.', '**Strategies:** *cache first* (static files such as CSS, scripts and images), *network first* (data that changes, such as the menu: try the network, fall back to the cache), *stale while revalidate* (show the cached copy now and update it quietly for next time).'],
      },
      {
        t: 'try',
        code: 'const manifest = {\n  name: "Mama Rose Rolex",\n  short_name: "Rose",\n  start_url: "/",\n  display: "standalone",\n  theme_color: "#0b6b4f",\n  background_color: "#fdf1d3",\n  icons: [{ src: "icon-192.png", sizes: "192x192", type: "image/png" }],\n};\nconsole.log(Object.keys(manifest).join(", "));\nconsole.log(JSON.stringify(manifest).length > 150);',
        output: 'name, short_name, start_url, display, theme_color, background_color, icons\ntrue',
      },
      { t: 'p', text: 'The manifest is saved as `manifest.webmanifest` (plain JSON) and connected from the page head. This is how browsers know to offer "Add to Home screen".' },
      {
        t: 'web',
        title: 'The head tags of an installable site',
        files: ['html'],
        assets: ASSETS,
        starter: { html: fullPage('  <h1>Mama Rose Rolex</h1>\n  <p>Hot rolex, every day.</p>', { head: '\n  <link rel="manifest" href="manifest.webmanifest">\n  <meta name="theme-color" content="#0b6b4f">\n  <link rel="apple-touch-icon" href="img/logo.svg">' }) },
        checks: [{ exists: 'link[rel="manifest"]' }, { exists: 'meta[name="theme-color"]' }, { rule: 'viewport' }],
      },
      { t: 'h', text: 'A service worker, step by step' },
      {
        t: 'code',
        text: '// In your page (script.js):\nif ("serviceWorker" in navigator) {\n  navigator.serviceWorker.register("/sw.js");\n}\n\n// sw.js  (a separate file at the top of your site)\nconst CACHE = "rose-v1";\nconst FILES = ["/", "/index.html", "/style.css", "/script.js", "/img/logo.svg"];\n\nself.addEventListener("install", (event) => {\n  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));\n});\n\nself.addEventListener("activate", (event) => {\n  event.waitUntil(\n    caches.keys().then((keys) =>\n      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))\n    )\n  );\n});\n\nself.addEventListener("fetch", (event) => {\n  event.respondWith(\n    caches.match(event.request).then((hit) => hit || fetch(event.request))\n  );\n});',
      },
      {
        t: 'list',
        items: ['**install**: runs once; save the important files in the cache. **activate**: clean up old caches. **fetch**: runs for every request; answer from the cache or the network.', 'To publish a new version, change the cache name (`rose-v2`), so old files are replaced. A common beginner problem is a visitor stuck on an old version.', 'Service workers only work on **HTTPS** (and on localhost), and in the lesson preview they do not run: practise them on your own project with a free host.', 'You can see the result in DevTools: **Application** tab, Service Workers and Cache Storage. Test offline by ticking **Offline** in the Network tab.'],
      },
      { t: 'predict', code: 'const cache = new Map([["/style.css", "css-v1"]]);\nconst get = (url) => cache.get(url) ?? "network";\nconsole.log(get("/style.css"));\nconsole.log(get("/api/menu"));', question: 'This models "cache first". What does it print?', options: ['css-v1\nnetwork', 'network\nnetwork', 'css-v1\ncss-v1', 'undefined\nnetwork'], answer: 0, explain: 'The stylesheet is in the cache, so it is returned at once. The menu is not cached here, so we fall back to the network.' },
      { t: 'tip', text: 'This very app (SayMaCoder) is a PWA: its lessons and the code runners are saved on the phone, which is why it works in airplane mode. For a business site, cache the **shell** (page, CSS, script, logo) first. Be careful with data that changes (menu, prices, stock): prefer *network first* for it, so customers never see yesterday\'s prices.' },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: '"start_url": "index.html",\n"display": "browser"', why: '`display: "browser"` opens the site as a normal tab, so there is nothing "installed" about it. Use `"standalone"`. Also give the start URL as `"/"` so it works wherever the site is hosted at the root.', right: '"start_url": "/",\n"display": "standalone"' },
          { lang: 'dom', wrong: 'const FILES = ["/index.html", "/style.css"];\n// (cache name never changes between releases)', why: 'When you publish a new style.css, visitors keep seeing the old cached copy. Change the cache name for every release (rose-v2, rose-v3) and delete the old ones in `activate`.', right: 'const CACHE = "rose-v2";\nconst FILES = ["/index.html", "/style.css"];' },
          { lang: 'dom', wrong: 'self.addEventListener("fetch", (event) => {\n  event.respondWith(caches.match(event.request));\n});', why: 'If the file is not in the cache, `caches.match` gives `undefined` and the request fails. Fall back to the network: `|| fetch(event.request)`.', right: 'self.addEventListener("fetch", (event) => {\n  event.respondWith(\n    caches.match(event.request).then((hit) => hit || fetch(event.request))\n  );\n});' },
        ],
      },
      { t: 'quiz', question: 'Which strategy is best for the shop menu and prices, which change during the day?', options: ['Network first, falling back to the cache when offline', 'Cache first forever', 'Never cache anything', 'Cache first and never update'], answer: 0, explain: 'Try the network so customers get fresh prices, and use the cached copy only when there is no signal. Static files like the logo are fine as cache first.' },
      { t: 'quiz', question: 'What makes a site installable on the home screen?', options: ['A web app manifest (with name, icons and display standalone) served over HTTPS', 'Only a nice logo', 'A very long page', 'Using the word install in the title'], answer: 0, explain: 'The manifest tells the browser how the app should look when installed. Together with HTTPS and a service worker, browsers offer "Add to Home screen".' },
      { t: 'quiz', question: 'You published a new stylesheet but visitors still see the old design. What is the likely cause?', options: ['The service worker is serving the old cached file, because the cache name did not change', 'The CSS is broken', 'HTTPS is off', 'The manifest has no icon'], answer: 0, explain: 'A cache-first service worker keeps answering from the old cache. Change the cache name and clear the old one in `activate`.' },
      { t: 'recap', items: ['A PWA is a normal site plus a manifest (installable) and a service worker (offline, fast).', 'The manifest needs `name`, `short_name`, `start_url`, `display: standalone`, colours and 192 and 512 pixel icons.', 'The service worker has install (cache files), activate (clean old caches) and fetch (answer from cache or network).', 'Cache first for static files, network first for changing data, stale while revalidate for pages.', 'Change the cache name on every release. HTTPS is required.'], memory: 'Manifest to install, worker to stockroom, rename the cache each release.' },
    ],
    exercises: [
      {
        id: 'w44-manifest',
        title: 'Write the manifest',
        prompt: 'Create a `const manifest` object for the shop with:\n\n- `name`: `"Mama Rose Rolex"` and `short_name`: `"Rose"` (a short name is at most 12 characters)\n- `start_url`: `"/"` and `display`: `"standalone"`\n- `theme_color`: `"#0b6b4f"` and `background_color`: `"#fdf1d3"`\n- `icons`: a list with **two** icons, one with `sizes: "192x192"` and one with `sizes: "512x512"` (each also has a `src` and `type: "image/png"`)',
        files: ['js'],
        starter: { js: '// const manifest = { ... };\n' },
        solution: { js: 'const manifest = {\n  name: "Mama Rose Rolex",\n  short_name: "Rose",\n  start_url: "/",\n  display: "standalone",\n  theme_color: "#0b6b4f",\n  background_color: "#fdf1d3",\n  icons: [\n    { src: "icon-192.png", sizes: "192x192", type: "image/png" },\n    { src: "icon-512.png", sizes: "512x512", type: "image/png" },\n  ],\n};\n' },
        checks: [{ js: 'manifest.name', equals: 'Mama Rose Rolex' }, { js: 'manifest.short_name.length <= 12', equals: true, label: 'The short name is 12 characters or fewer' }, { js: 'manifest.start_url', equals: '/' }, { js: 'manifest.display', equals: 'standalone' }, { js: 'manifest.theme_color', equals: '#0b6b4f' }, { js: 'manifest.background_color', equals: '#fdf1d3' }, { js: 'manifest.icons.some((i) => i.sizes === "192x192")', equals: true, label: 'There is a 192x192 icon' }, { js: 'manifest.icons.some((i) => i.sizes === "512x512")', equals: true, label: 'There is a 512x512 icon' }, { js: 'manifest.icons.every((i) => i.src && i.type === "image/png")', equals: true, label: 'Every icon has a src and type image/png' }],
        hints: ['A manifest is a plain object. `icons` is a list of small objects.', 'Each icon looks like `{ src: "icon-192.png", sizes: "192x192", type: "image/png" }`.', '```\nicons: [\n  { src: "icon-192.png", sizes: "192x192", type: "image/png" },\n  { src: "icon-512.png", sizes: "512x512", type: "image/png" },\n],\n```'],
      },
      {
        id: 'w44-head-tags',
        title: 'Make the page installable',
        assets: ASSETS,
        prompt: 'In the `<head>`, add the three tags that connect the page to its app identity:\n\n- `<link rel="manifest" href="manifest.webmanifest">`\n- `<meta name="theme-color" content="#0b6b4f">`\n- `<link rel="apple-touch-icon" href="img/logo.svg">`',
        files: ['html'],
        starter: { html: fullPage('  <h1>Mama Rose Rolex</h1>\n  <p>Hot rolex, every day.</p>') },
        solution: { html: fullPage('  <h1>Mama Rose Rolex</h1>\n  <p>Hot rolex, every day.</p>', { head: '\n  <link rel="manifest" href="manifest.webmanifest">\n  <meta name="theme-color" content="#0b6b4f">\n  <link rel="apple-touch-icon" href="img/logo.svg">' }) },
        checks: [{ attr: 'link[rel="manifest"]', name: 'href', equals: 'manifest.webmanifest', label: 'The head links manifest.webmanifest' }, { attr: 'meta[name="theme-color"]', name: 'content', equals: '#0b6b4f' }, { exists: 'link[rel="apple-touch-icon"]', label: 'There is an apple-touch-icon link' }, { uses: 'html', pattern: 'rel=["\']apple-touch-icon["\'][^>]*href=["\']img/logo\\.svg|href=["\']img/logo\\.svg["\'][^>]*rel=["\']apple-touch-icon', label: 'The icon is img/logo.svg' }, { rule: 'viewport' }, { rule: 'title' }, { lint: 'html' }],
        hints: ['All three go inside `<head>`, before `</head>`. None of them has a closing tag.', 'The manifest link is `rel="manifest"`. The colour uses `meta name="theme-color"`.', '```\n<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#0b6b4f">\n<link rel="apple-touch-icon" href="img/logo.svg">\n```'],
      },
      {
        id: 'w44-strategy',
        title: 'Choose the caching strategy',
        prompt: 'Write `chooseStrategy(url)` for a service worker. It returns:\n\n- `"network-first"` for addresses starting with `/api/` (changing data)\n- `"cache-first"` for static files ending in `.css`, `.js`, `.svg`, `.png`, `.jpg`, `.webp` or `.woff2`\n- `"stale-while-revalidate"` for `"/"` and addresses ending in `.html`\n- `"network-only"` for everything else',
        files: ['js'],
        starter: { js: '// Write chooseStrategy(url)\n' },
        solution: { js: 'function chooseStrategy(url) {\n  if (url.startsWith("/api/")) {\n    return "network-first";\n  }\n  if (/\\.(css|js|svg|png|jpg|webp|woff2)$/.test(url)) {\n    return "cache-first";\n  }\n  if (url === "/" || url.endsWith(".html")) {\n    return "stale-while-revalidate";\n  }\n  return "network-only";\n}\n' },
        checks: [{ js: 'chooseStrategy("/api/menu")', equals: 'network-first' }, { js: 'chooseStrategy("/style.css")', equals: 'cache-first' }, { js: 'chooseStrategy("/img/logo.svg")', equals: 'cache-first' }, { js: 'chooseStrategy("/fonts/rose.woff2")', equals: 'cache-first' }, { js: 'chooseStrategy("/")', equals: 'stale-while-revalidate' }, { js: 'chooseStrategy("/menu.html")', equals: 'stale-while-revalidate' }, { js: 'chooseStrategy("/pay/callback")', equals: 'network-only' }, { js: 'chooseStrategy("/api/orders")', equals: 'network-first', hidden: true }, { uses: 'js', pattern: 'return', label: 'You return a strategy name' }],
        hints: ['Check the cases in order, from the most specific: first `/api/`, then file types, then pages.', 'A regular expression like `/\\.(css|js|svg)$/` matches a file ending.', '```\nif (url.startsWith("/api/")) {\n  return "network-first";\n}\n```'],
      },
    ],
  },
];
