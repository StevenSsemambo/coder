// Web track, launch-ready extension, group D: browser APIs, SVG, speed in depth.
// Lessons w55 to w57. See docs/WEB-TRACK.md for the roadmap.
// jsdom (the test browser) has no IntersectionObserver, clipboard or share, so the code always feature-detects,
// and the checks call small pure functions (reveal, loadImage, showPage...) that behave the same in a real browser.
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

const page = (body, o = {}) => fullPage(body, { title: 'Kato Rides', ...o });

// ------------------------------------------------------------------ w55 helpers
const REVEAL_HTML = `<h1>Our services</h1>
<section class="reveal"><h2>Parcels</h2><p>Same-day delivery across Kampala.</p></section>
<section class="reveal"><h2>Shopping</h2><p>We buy it and bring it to you.</p></section>`;

const REVEAL_CSS = `.js .reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.4s, transform 0.4s;
}
.js .reveal.visible {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .js .reveal {
    transition: none;
  }
}
`;

const REVEAL_FN = `function reveal(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (observer) {
        observer.unobserve(entry.target);
      }
    }
  });
}
`;

const REVEAL_JS = `document.documentElement.classList.add("js");

${REVEAL_FN}
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => reveal(entries, observer), { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}
`;

const REVEAL_STARTER_JS = `document.documentElement.classList.add("js");

function reveal(entries, observer) {
  // For every entry that is intersecting (visible on screen):
  //   add the class "visible" to entry.target
  //   and, when an observer is given, stop watching: observer.unobserve(entry.target)
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => reveal(entries, observer), { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}
`;

const LAZY_FN = `function loadImage(img) {
  img.src = img.dataset.src;
  img.removeAttribute("data-src");
}
`;

const SHARE_FN = `async function shareLink(data, nav) {
  if (nav.share) {
    await nav.share(data);
    return "shared";
  }
  if (nav.clipboard) {
    await nav.clipboard.writeText(data.url);
    return "copied";
  }
  return "manual";
}
`;

const SHARE_PAGE_JS = (fn) => `${fn}
window.results = [];
const data = { title: "Kato Rides", url: "https://katorides.co.ug" };
const phone = { share: async () => {} };
const laptop = { clipboard: { writeText: async () => {} } };
const old = {};

Promise.all([shareLink(data, phone), shareLink(data, laptop), shareLink(data, old)]).then((values) => {
  window.results = values;
});
`;

const WHATSAPP_SOLUTION = `function whatsappShareUrl(text, url) {
  return "https://wa.me/?text=" + encodeURIComponent(text + " " + url);
}
`;

const ROUTER_HTML = `<nav><a href="#/home">Home</a> <a href="#/prices">Prices</a> <a href="#/contact">Contact</a></nav>
<section data-page="home"><h1>Kato Rides</h1><p>Parcels delivered across Kampala.</p></section>
<section data-page="prices" hidden><h1>Prices</h1><p>From UGX 5,000.</p></section>
<section data-page="contact" hidden><h1>Contact</h1><p>Call 0700 123 456.</p></section>`;

const ROUTER_FN = `function showPage(hash) {
  const name = hash.replace("#/", "") || "home";
  let found = document.querySelector('[data-page="' + name + '"]');
  if (!found) {
    found = document.querySelector('[data-page="home"]');
  }
  document.querySelectorAll("[data-page]").forEach((section) => {
    section.hidden = section !== found;
  });
}
`;

const ROUTER_JS = `${ROUTER_FN}
window.addEventListener("hashchange", () => showPage(location.hash));
showPage(location.hash);
`;

const ROUTER_STARTER_JS = `function showPage(hash) {
  // hash looks like "#/prices". Find the section with data-page="prices", show it (hidden = false)
  // and hide all the others. An empty or unknown hash shows the "home" section.
}

window.addEventListener("hashchange", () => showPage(location.hash));
showPage(location.hash);
`;

const DEBOUNCE_SOLUTION = `function debounce(fn, ms) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
`;

const ABORT_JS = `const out = document.querySelector("#out");
let controller = null;

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new Error("cancelled"));
    });
  });
}

async function search(term) {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();
  try {
    await wait(40, controller.signal);
    out.textContent = "Results for " + term;
  } catch (error) {
    // The search was cancelled by a newer one. Ignore it.
  }
}

search("su");
search("sug");
search("suga");
`;

// ------------------------------------------------------------------ w56 helpers
const LOGO_SVG = `<svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-labelledby="logo-title">
  <title id="logo-title">Kato Rides logo</title>
  <circle cx="50" cy="50" r="46" fill="#0b6b4f"></circle>
  <polygon points="50,22 62,46 38,46" fill="#f7c948"></polygon>
  <rect x="30" y="56" width="40" height="14" rx="4" fill="#fdf1d3"></rect>
</svg>`;

const PHONE_PATH = 'M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z';

const ICON_HTML = (fill) => `<button type="button" class="call">
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="${PHONE_PATH}" fill="${fill}"></path></svg>
  Call us
</button>`;

const ICON_CSS = `.call {
  color: #0b6b4f;
  background: transparent;
  border: 2px solid #0b6b4f;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.call:hover {
  color: #f7c948;
}
`;

const SPRITE_HTML = `<svg width="0" height="0" style="position: absolute" aria-hidden="true">
  <symbol id="icon-phone" viewBox="0 0 24 24">
    <path d="${PHONE_PATH}" fill="currentColor"></path>
  </symbol>
</svg>
<p><svg width="24" height="24" aria-hidden="true"><use href="#icon-phone"></use></svg> Call 0700 123 456</p>
<p><svg width="24" height="24" aria-hidden="true"><use href="#icon-phone"></use></svg> Or 0750 123 456</p>`;

const SPRITE_STARTER_HTML = `<p><svg width="24" height="24" aria-hidden="true"><path d="${PHONE_PATH}" fill="currentColor"></path></svg> Call 0700 123 456</p>
<p><svg width="24" height="24" aria-hidden="true"><path d="${PHONE_PATH}" fill="currentColor"></path></svg> Or 0750 123 456</p>`;

const CHART_HTML = `<h1>Bookings per week</h1>
<svg id="chart" viewBox="0 0 120 100" width="240" height="200" role="img" aria-label="Bookings per week: 10, 20 and 40"></svg>`;

const CHART_SOLUTION_JS = `const data = [10, 20, 40];
const svg = document.querySelector("#chart");
const max = Math.max(...data);

data.forEach((value, index) => {
  const height = (value / max) * 100;
  const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bar.setAttribute("x", index * 40 + 5);
  bar.setAttribute("y", 100 - height);
  bar.setAttribute("width", 30);
  bar.setAttribute("height", height);
  bar.setAttribute("fill", "#0b6b4f");
  svg.append(bar);
});
`;

const CHART_STARTER_JS = `const data = [10, 20, 40];
const svg = document.querySelector("#chart");
const max = Math.max(...data);

// For each value, create a <rect> with document.createElementNS("http://www.w3.org/2000/svg", "rect")
// x = index * 40 + 5, width = 30, height = value / max * 100, y = 100 - height. Then append it to svg.
`;

const DRAW_HTML = `<svg viewBox="0 0 100 40" width="300" height="120" role="img" aria-label="A road to the shop">
  <path class="draw" d="M5 30 C 30 5, 60 5, 95 30" fill="none" stroke="#0b6b4f" stroke-width="3"></path>
</svg>`;

const DRAW_CSS_STARTER = `.draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
}
`;

const DRAW_CSS_SOLUTION = `.draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 2s ease forwards;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .draw {
    animation: none;
    stroke-dashoffset: 0;
  }
}
`;

// ------------------------------------------------------------------ w57 helpers
const IMAGES_STARTER = `<header>
  <img src="img/phone-hero.svg">
  <h1>Kato Rides</h1>
</header>
<section class="gallery">
  <img src="img/boda.svg">
  <img src="img/pin.svg">
  <img src="img/rolex.svg">
</section>`;

const IMAGES_SOLUTION = `<header>
  <img src="img/phone-hero.svg" alt="A phone showing a delivery on the map" width="320" height="200" fetchpriority="high">
  <h1>Kato Rides</h1>
</header>
<section class="gallery">
  <img src="img/boda.svg" alt="A boda boda rider" width="160" height="100" loading="lazy" decoding="async">
  <img src="img/pin.svg" alt="A map pin" width="160" height="100" loading="lazy" decoding="async">
  <img src="img/rolex.svg" alt="A rolex" width="160" height="100" loading="lazy" decoding="async">
</section>`;

const RATING_SOLUTION = `function vitalRating(metric, value) {
  const limits = {
    lcp: [2500, 4000],
    cls: [0.1, 0.25],
    inp: [200, 500],
  };
  const [good, poor] = limits[metric];
  if (value <= good) {
    return "good";
  }
  if (value <= poor) {
    return "needs improvement";
  }
  return "poor";
}
`;

const BUDGET_SOLUTION = `function budgetReport(resources, limitKb) {
  let total = 0;
  let biggest = null;
  for (const item of resources) {
    total += item.bytes;
    if (biggest === null || item.bytes > biggest.bytes) {
      biggest = item;
    }
  }
  const totalKb = Math.round((total / 1024) * 10) / 10;
  return { totalKb, over: totalKb > limitKb, biggest: biggest ? biggest.name : null };
}
`;

const CACHE_SOLUTION = String.raw`function cacheControl(path) {
  if (path.endsWith(".html") || path === "/") {
    return "no-cache";
  }
  if (/\.[0-9a-f]{8}\.(js|css)$/.test(path)) {
    return "public, max-age=31536000, immutable";
  }
  return "public, max-age=86400";
}
`;

const PICK_WIDTH_SOLUTION = `function pickWidth(displayWidth, pixelRatio, available) {
  const needed = displayWidth * pixelRatio;
  const sorted = [...available].sort((a, b) => a - b);
  for (const width of sorted) {
    if (width >= needed) {
      return width;
    }
  }
  return sorted[sorted.length - 1];
}
`;

const FONTS_PAGE = `<h1>Kato Rides</h1>
<p>Parcels delivered across Kampala.</p>`;

const FONTS_CSS = `@font-face {
  font-family: "Poppins";
  src: url("fonts/poppins-600.woff2") format("woff2");
  font-weight: 600;
  font-display: swap;
}
body {
  font-family: "Poppins", system-ui, sans-serif;
}
`;

export const launch4Lessons = [
  // ================================================================== w55
  {
    id: 'w55-browser-apis',
    level: 'Level 4: JavaScript in the page',
    title: 'Browser APIs that professional sites use',
    summary: 'Scroll effects with IntersectionObserver, lazy images, sharing and copying, hash routing, cancelling requests and debouncing, always with a safe fallback.',
    minutes: 34,
    blocks: [
      {
        t: 'story',
        title: 'The long page nobody finished reading',
        text: 'Grace builds a long page for a hotel: rooms, restaurant, spa, events, reviews, map. It has twenty photos. On a visitor\'s phone with a slow connection, the page downloads every photo at once before it shows anything, and many visitors leave. The owner also wants the service cards to fade in as people scroll, and a **Share** button so guests can send a room to a friend on WhatsApp.\n\nThe browser already contains tools for all of this. They are called **Web APIs**: ready-made abilities that JavaScript can use, such as *noticing* when an element reaches the screen, *sharing*, *copying*, and *cancelling* a slow request. In this lesson you learn the ones professional sites use every day, and one habit that matters more than any of them: **check that the browser has the tool before you use it.**',
      },
      { t: 'analogy', text: 'A web API is like the buttons on a modern phone. Not every phone has every button: an old phone has no fingerprint reader. A careful app asks \"does this phone have a fingerprint reader?\" and, if not, offers a PIN instead. That question is **feature detection**, and the PIN is the **fallback**.' },
      { t: 'h', text: 'Feature detection and progressive enhancement' },
      {
        t: 'list',
        items: [
          'Ask first: `"IntersectionObserver" in window`, `navigator.share`, `navigator.clipboard`. If the answer is no, use a simpler way that still works.',
          '**Progressive enhancement**: the basic page works for everyone, and the fancy part is an upgrade for browsers that support it.',
          'A classic trap: hiding content with CSS and revealing it with JavaScript. If the script fails, the content stays hidden for ever. Add a class to `<html>` from JavaScript (`.js`) and only hide things under `.js`, so nothing disappears when JavaScript is missing.',
          'Check a feature on caniuse.com or MDN before you rely on it, and always test the fallback.',
        ],
      },
      { t: 'h', text: 'IntersectionObserver: know when something reaches the screen' },
      { t: 'p', text: 'Old code listened to the `scroll` event and measured positions on every pixel of scrolling, which makes pages heavy and jerky. An `IntersectionObserver` tells you only when an element **enters or leaves** the visible area. The same tool powers scroll animations, \"load more\" lists and lazy-loaded images.' },
      {
        t: 'web',
        title: 'Cards that fade in as they appear on screen. The reveal() function is separate so it can be tested.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(REVEAL_HTML, { css: true, js: true }), css: REVEAL_CSS, js: REVEAL_JS },
        checks: [
          { js: '(() => { const el = document.createElement("div"); reveal([{ isIntersecting: true, target: el }]); return el.classList.contains("visible"); })()', equals: true, label: 'An element on screen gets the class visible' },
          { js: '(() => { const el = document.createElement("div"); reveal([{ isIntersecting: false, target: el }]); return el.classList.contains("visible"); })()', equals: false, label: 'An element off screen is left alone' },
          { js: '(() => { const el = document.createElement("div"); const seen = []; reveal([{ isIntersecting: true, target: el }], { unobserve: (t) => seen.push(t) }); return seen[0] === el; })()', equals: true, label: 'The observer stops watching a revealed element' },
          { uses: 'js', pattern: '"IntersectionObserver"\\s+in\\s+window', label: 'The code checks that IntersectionObserver exists' },
          { attr: 'html', name: 'class', contains: 'js', label: 'The js class protects content when scripts fail' },
        ],
      },
      { t: 'tip', text: 'The preview in these lessons may not scroll a real long page, so the checks call `reveal()` directly with a pretend entry (`{ isIntersecting: true, target: element }`). Writing small functions that take plain data, instead of hiding everything inside an event handler, is what makes code testable.' },
      { t: 'h', text: 'Lazy-loading images yourself' },
      { t: 'p', text: 'The attribute `loading="lazy"` (Lesson 33) already delays images below the screen. When you need more control (a background image, a slideshow), keep the address in `data-src`, and copy it to `src` when the image comes near the screen.' },
      {
        t: 'try',
        code: 'function loadImage(img) {\n  img.src = img.dataset.src;\n  delete img.dataset.src;\n}\n\nconst img = { src: "", dataset: { src: "img/boda.svg" } };\nloadImage(img);\nconsole.log(img.src);\nconsole.log("src" in img.dataset);',
        output: 'img/boda.svg\nfalse',
      },
      { t: 'h', text: 'Share and copy' },
      { t: 'list', items: ['`navigator.share({ title, text, url })` opens the phone\'s own share sheet (WhatsApp, SMS, email). It exists mostly on phones and needs a tap by the visitor and a secure (https) page.', '`navigator.clipboard.writeText(text)` copies text. It also needs https and a tap, and it returns a **promise**, so `await` it and catch the failure.', 'A good Share button tries the best tool first and falls back: share sheet, then copy, then a plain link the visitor can long-press.', 'WhatsApp is the favourite way to share in Uganda: a link of the form `https://wa.me/?text=...` opens it with your message ready. The message must be encoded with `encodeURIComponent`.'] },
      {
        t: 'predict',
        code: 'console.log(encodeURIComponent("tea & rice"));',
        question: 'What does this print?',
        options: ['tea%20%26%20rice', 'tea & rice', 'tea+&+rice', 'tea%20&%20rice'],
        answer: 0,
        explain: '`encodeURIComponent` turns every character that is not safe in a link into a `%` code. A space is `%20` and `&` is `%26`. Without it, the `&` would end the message early.',
      },
      {
        t: 'web',
        title: 'A Share function with two fallbacks, tried on three pretend browsers: a phone, a laptop and an old browser.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page('<h1>Share this page</h1>', { js: true }), js: SHARE_PAGE_JS(SHARE_FN) },
        checks: [{ do: 'wait', ms: 80 }, { js: 'window.results.join(",")', equals: 'shared,copied,manual', label: 'Phone shares, laptop copies, old browser falls back to manual' }],
      },
      { t: 'h', text: 'Hash routing: pages without reloading' },
      { t: 'p', text: 'A **single-page** site keeps every page in one HTML file and shows one at a time. The part of the address after `#` (the hash) is not sent to the server, and the browser fires a `hashchange` event when it changes, so the Back button and shared links just work.' },
      {
        t: 'web',
        title: 'Three pages in one file. Click the links and watch the address change. Unknown hashes fall back to Home.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(ROUTER_HTML, { js: true }), js: ROUTER_JS },
        checks: [
          { js: '(showPage("#/prices"), document.querySelector("[data-page=prices]").hidden)', equals: false, label: 'The Prices section is shown' },
          { js: 'document.querySelector("[data-page=home]").hidden', equals: true, label: 'The others are hidden' },
          { js: '(showPage("#/nonsense"), document.querySelector("[data-page=home]").hidden)', equals: false, label: 'An unknown hash shows Home' },
          { js: '(showPage(""), document.querySelector("[data-page=contact]").hidden)', equals: true },
        ],
      },
      { t: 'h', text: 'Cancel what is no longer needed' },
      { t: 'p', text: 'A visitor types \"su\", then \"sug\", then \"suga\" into a search box. Three requests fly out. The slow answer for \"su\" can arrive LAST and overwrite the right one. An `AbortController` lets you cancel the old request when a new one starts. A related tool, **debouncing**, waits until the visitor stops typing for a moment before searching at all.' },
      {
        t: 'web',
        title: 'Three searches start almost together, and only the last one is allowed to finish.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page('<h1>Search</h1>\n<p id="out">Searching...</p>', { js: true }), js: ABORT_JS },
        checks: [{ do: 'wait', ms: 140 }, { text: '#out', equals: 'Results for suga', label: 'Only the newest search wins' }, { noErrors: true }],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: 'const observer = new IntersectionObserver(reveal);\nobserver.observe(card);', why: 'On a browser without `IntersectionObserver` this line throws an error and the rest of your script never runs. Check `"IntersectionObserver" in window` and give a fallback.', right: 'if ("IntersectionObserver" in window) {\n  const observer = new IntersectionObserver(reveal);\n  observer.observe(card);\n} else {\n  card.classList.add("visible");\n}' },
          { lang: 'dom', wrong: 'button.addEventListener("click", () => {\n  navigator.clipboard.writeText(url);\n  message.textContent = "Copied!";\n});', why: '`writeText` returns a promise and can fail (an insecure page, or the visitor refused). This shows \"Copied!\" even when nothing was copied. `await` it and handle the error.', right: 'button.addEventListener("click", async () => {\n  try {\n    await navigator.clipboard.writeText(url);\n    message.textContent = "Copied!";\n  } catch (error) {\n    message.textContent = "Press and hold the link to copy it.";\n  }\n});' },
          { lang: 'dom', wrong: 'const link = "https://wa.me/?text=" + text + " " + url;', why: 'The text may contain spaces, `&`, `#` and other characters that break the link. Encode the whole message with `encodeURIComponent`.', right: 'const link = "https://wa.me/?text=" + encodeURIComponent(text + " " + url);' },
          { lang: 'dom', wrong: 'function showPage(hash) {\n  document.querySelector("[data-page=" + hash.slice(2) + "]").hidden = false;\n}', why: 'An unknown or empty hash makes `querySelector` return `null`, and `null.hidden` throws an error, so the visitor sees a blank page. Always plan for the unknown address and fall back to Home.', right: 'function showPage(hash) {\n  const found = document.querySelector("[data-page=\\"" + hash.slice(2) + "\\"]") || document.querySelector("[data-page=home]");\n  found.hidden = false;\n}' },
          { lang: 'dom', wrong: '.reveal { opacity: 0; }', why: 'Content that starts invisible and is revealed by JavaScript disappears for ever if the script fails or the browser is old. Hide only under a class that JavaScript adds: `.js .reveal { opacity: 0; }`.', right: '.js .reveal { opacity: 0; }' },
        ],
      },
      {
        t: 'quiz',
        question: 'Why check `"IntersectionObserver" in window` before using it?',
        options: ['An older browser may not have it, and using it would stop the whole script', 'It makes the observer faster', 'It is required by the law', 'It turns the observer on'],
        answer: 0,
        explain: 'Feature detection keeps the page working everywhere. With a fallback, nobody is left with a broken site.',
      },
      {
        t: 'quiz',
        question: 'A visitor types fast into a search box. What does debouncing do?',
        options: ['Waits until they pause, then runs the search once', 'Runs the search on every key press, faster', 'Blocks the keyboard', 'Deletes old results'],
        answer: 0,
        explain: 'A debounced function restarts a short timer on every call, so only the last call, after a quiet moment, actually runs.',
      },
      { t: 'recap', items: ['Web APIs are abilities built into the browser. Always feature-detect first, and write a fallback, so the basic page works for everyone (progressive enhancement).', '`IntersectionObserver` reports when elements enter or leave the screen: for fade-ins, lazy loading and infinite lists. Hide things only under a `.js` class.', '`navigator.share` and `navigator.clipboard` need https and a tap, and fail sometimes: try, catch and fall back. Encode WhatsApp messages with `encodeURIComponent`.', 'Hash routing (`location.hash` and the `hashchange` event) shows pages without reloading. Always handle the unknown hash.', '`AbortController` cancels a request that is no longer needed. Debouncing waits for a pause before running.', 'Write small functions that take plain data. They are easy to test and reuse.'] },
    ],
    exercises: [
      {
        id: 'w55-reveal',
        title: 'Reveal what is on screen',
        prompt: 'Finish the `reveal(entries, observer)` function. Each `entry` has `isIntersecting` and a `target` element. For every entry that is intersecting, add the class `visible` to its target. Then, **if an observer was given**, tell it to stop watching that element with `observer.unobserve(entry.target)`.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(REVEAL_HTML, { css: true, js: true }), css: REVEAL_CSS, js: REVEAL_STARTER_JS },
        solution: { html: page(REVEAL_HTML, { css: true, js: true }), css: REVEAL_CSS, js: REVEAL_JS },
        checks: [
          { js: '(() => { const el = document.createElement("div"); reveal([{ isIntersecting: true, target: el }]); return el.classList.contains("visible"); })()', equals: true, label: 'An element on screen gets the class visible' },
          { js: '(() => { const el = document.createElement("div"); reveal([{ isIntersecting: false, target: el }]); return el.classList.contains("visible"); })()', equals: false, label: 'An element off screen is left alone' },
          { js: '(() => { const el = document.createElement("div"); const seen = []; reveal([{ isIntersecting: true, target: el }], { unobserve: (t) => seen.push(t) }); return seen[0] === el; })()', equals: true, label: 'The observer stops watching a revealed element' },
          { js: '(() => { const el = document.createElement("div"); const seen = []; reveal([{ isIntersecting: false, target: el }], { unobserve: (t) => seen.push(t) }); return seen.length; })()', equals: 0, label: 'It keeps watching elements that are not visible yet', hidden: true },
          { js: '(() => { const a = document.createElement("div"); const b = document.createElement("div"); reveal([{ isIntersecting: true, target: a }, { isIntersecting: false, target: b }]); return a.classList.contains("visible") + "," + b.classList.contains("visible"); })()', equals: 'true,false', label: 'Several entries are each handled separately', hidden: true },
        ],
        hints: ['`entries` is a list. Loop over it with `entries.forEach((entry) => { ... })`.', 'Only act when `entry.isIntersecting` is true. Then `entry.target.classList.add("visible")`.', '```\nif (observer) {\n  observer.unobserve(entry.target);\n}\n```'],
      },
      {
        id: 'w55-lazy-image',
        title: 'Load an image when it is needed',
        prompt: 'Write `loadImage(img)`. The image holds its real address in a `data-src` attribute. Copy it into `src` (use `img.dataset.src`), and then remove the `data-src` attribute, so the image is not loaded twice.',
        files: ['js'],
        starter: { js: '// Write loadImage(img)\n' },
        solution: { js: LAZY_FN },
        checks: [
          { js: '(() => { const img = document.createElement("img"); img.dataset.src = "img/boda.svg"; loadImage(img); return img.getAttribute("src"); })()', equals: 'img/boda.svg', label: 'The src is copied from data-src' },
          { js: '(() => { const img = document.createElement("img"); img.dataset.src = "img/pin.svg"; loadImage(img); return img.hasAttribute("data-src"); })()', equals: false, label: 'The data-src attribute is removed' },
          { js: '(() => { const img = document.createElement("img"); img.dataset.src = "img/rolex.svg"; img.alt = "A rolex"; loadImage(img); return img.alt; })()', equals: 'A rolex', label: 'Other attributes are not touched', hidden: true },
        ],
        hints: ['`img.dataset.src` reads the attribute `data-src`. `img.src = ...` sets the real address.', 'To remove an attribute use `img.removeAttribute("data-src")`.', '```\nimg.src = img.dataset.src;\nimg.removeAttribute("data-src");\n```'],
      },
      {
        id: 'w55-whatsapp-share',
        title: 'A WhatsApp share link',
        prompt: 'Write `whatsappShareUrl(text, url)`. It returns `https://wa.me/?text=` followed by the text, a space and the url, all encoded with `encodeURIComponent` as ONE message.\n\nFor example `whatsappShareUrl("Kato prices", "https://katorides.co.ug")` gives `https://wa.me/?text=Kato%20prices%20https%3A%2F%2Fkatorides.co.ug`.',
        files: ['js'],
        starter: { js: '// Write whatsappShareUrl(text, url)\n' },
        solution: { js: WHATSAPP_SOLUTION },
        checks: [
          { js: 'whatsappShareUrl("Kato prices", "https://katorides.co.ug")', equals: 'https://wa.me/?text=Kato%20prices%20https%3A%2F%2Fkatorides.co.ug' },
          { js: 'whatsappShareUrl("Tea & rice", "https://a.co/b")', equals: 'https://wa.me/?text=Tea%20%26%20rice%20https%3A%2F%2Fa.co%2Fb', label: 'An ampersand is encoded' },
          { js: 'whatsappShareUrl("Hi", "x").startsWith("https://wa.me/?text=")', equals: true },
          { js: 'whatsappShareUrl("a#b", "c")', equals: 'https://wa.me/?text=a%23b%20c', label: 'A hash is encoded too', hidden: true },
        ],
        hints: ['Join the text and the address with a space first: `text + " " + url`.', 'Encode that whole message once with `encodeURIComponent(...)`.', '```\nreturn "https://wa.me/?text=" + encodeURIComponent(text + " " + url);\n```'],
      },
      {
        id: 'w55-router',
        title: 'Show the page for the hash',
        prompt: 'Finish `showPage(hash)`. The hash looks like `#/prices`. Work out the page name (remove `#/`, and use `home` when it is empty), find the section with that `data-page`, and show it by setting its `hidden` property to `false`. Every other section must be hidden. An unknown name shows the `home` section.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(ROUTER_HTML, { js: true }), js: ROUTER_STARTER_JS },
        solution: { html: page(ROUTER_HTML, { js: true }), js: ROUTER_JS },
        checks: [
          { js: '(showPage("#/prices"), document.querySelector("[data-page=prices]").hidden)', equals: false, label: 'The page for the hash is shown' },
          { js: 'document.querySelector("[data-page=home]").hidden', equals: true, label: 'Other pages are hidden' },
          { js: '(showPage("#/contact"), document.querySelector("[data-page=prices]").hidden)', equals: true, label: 'Moving on hides the previous page' },
          { js: '(showPage(""), document.querySelector("[data-page=home]").hidden)', equals: false, label: 'An empty hash shows Home' },
          { js: '(showPage("#/nonsense"), document.querySelector("[data-page=home]").hidden)', equals: false, label: 'An unknown hash shows Home' },
        ],
        hints: ['Get the name with `hash.replace("#/", "")` and use `|| "home"` for the empty case.', 'Find a section with `document.querySelector(\'[data-page="\' + name + \'"]\')`. If that is `null`, use the home section instead.', '```\ndocument.querySelectorAll("[data-page]").forEach((section) => {\n  section.hidden = section !== found;\n});\n```'],
      },
      {
        id: 'w55-debounce',
        title: 'Wait for the pause',
        prompt: 'Write `debounce(fn, ms)`. It returns a new function. Each time the new function is called, it cancels any waiting timer and starts a new `ms` millisecond timer that will call `fn` with the same arguments. The page below calls it three times quickly, and `fn` must run only **once**.',
        files: ['js'],
        starter: { html: page('<h1>Search</h1>', { js: true }), js: '// Write debounce(fn, ms)\nvar calls = 0;\nvar last = "";\nvar search = typeof debounce === "function" ? debounce(function (term) { calls++; last = term; }, 40) : null;\nif (search) {\n  search("su");\n  search("sug");\n  search("suga");\n}\n' },
        solution: { html: page('<h1>Search</h1>', { js: true }), js: DEBOUNCE_SOLUTION + '\nvar calls = 0;\nvar last = "";\nvar search = debounce(function (term) { calls++; last = term; }, 40);\nsearch("su");\nsearch("sug");\nsearch("suga");\n' },
        checks: [
          { js: 'typeof debounce', equals: 'function', label: 'debounce is a function' },
          { js: 'calls', equals: 0, label: 'Nothing runs straight away' },
          { do: 'wait', ms: 120 },
          { js: 'calls', equals: 1, label: 'After the pause it ran once, not three times' },
          { js: 'last', equals: 'suga', label: 'It ran with the last arguments' },
        ],
        hints: ['Keep a variable `timer` outside the returned function, so every call can see it.', 'In the returned function: `clearTimeout(timer)` first, then `timer = setTimeout(...)`.', '```\nreturn function (...args) {\n  clearTimeout(timer);\n  timer = setTimeout(() => fn(...args), ms);\n};\n```'],
      },
    ],
  },

  // ================================================================== w56
  {
    id: 'w56-svg',
    level: 'Level 2: CSS',
    title: 'SVG: logos, icons and simple charts',
    summary: 'Draw sharp graphics with code: shapes, viewBox, icons that take the text colour, reusable sprites, accessible titles, animation and a bar chart built by JavaScript.',
    minutes: 32,
    blocks: [
      {
        t: 'story',
        title: 'The blurry logo',
        text: 'Kato\'s sign painter made him a lovely logo, and Kato put it on his website as a PNG picture. On his own phone it looks fine. On the supermarket manager\'s big new screen it is blurry, and on a phone in dark mode the black text vanishes. The file is also 180 kilobytes, as big as the rest of the page.\n\nA picture made of **pixels** (PNG, JPEG) gets blurry when it is enlarged. A picture made of **instructions** (\"a green circle here, a yellow triangle there\") stays sharp at any size and is often only a few hundred bytes. That is **SVG**, \"scalable vector graphics\". Logos, icons, simple illustrations and charts all belong in SVG.',
      },
      { t: 'analogy', text: 'A pixel picture is a **photograph** of a drawing: enlarge it and you just see bigger dots. An SVG is the **recipe** for the drawing: \"circle, radius 46, green\". You can follow the recipe at any size and it is always sharp, and you can change one ingredient (the colour) in CSS.' },
      { t: 'h', text: 'Shapes and the viewBox' },
      {
        t: 'list',
        items: [
          'SVG is XML written straight in your HTML: `<svg>` is the canvas, and inside it are shapes.',
          '`viewBox="0 0 100 100"` gives the drawing its **own coordinate system**: the left edge is 0, the right edge is 100, top 0, bottom 100. The `width` and `height` attributes then decide how big it is on the page, and everything scales together.',
          'Shapes: `<rect x y width height rx>`, `<circle cx cy r>`, `<ellipse>`, `<line>`, `<polygon points="x,y x,y ...">`, `<polyline>`, `<path d="...">` (any outline: `M` move, `L` line, `C` curve, `Z` close) and `<text>`.',
          'Style with attributes (`fill`, `stroke`, `stroke-width`) or with CSS. Group shapes with `<g>`.',
        ],
      },
      {
        t: 'web',
        title: 'A logo drawn with three shapes. Change a number and see the preview change.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(LOGO_SVG) },
        checks: [{ attr: 'svg', name: 'viewBox', equals: '0 0 100 100' }, { count: 'svg circle', equals: 1 }, { count: 'svg polygon', equals: 1 }, { count: 'svg rect', equals: 1 }, { attr: 'svg', name: 'role', equals: 'img' }],
      },
      { t: 'h', text: 'Accessible SVG' },
      {
        t: 'list',
        items: [
          'A **meaningful** graphic (a logo or a chart) needs a name: `role="img"` on the `<svg>` plus a `<title>` inside it, linked with `aria-labelledby`, or an `aria-label`.',
          'A **decorative** icon next to text (the phone beside \"Call us\") must be hidden from screen readers: `aria-hidden="true"`. The text already says everything.',
          'An icon-only button has no text, so the BUTTON needs the name: `aria-label="Call us"` (Lesson 32).',
        ],
      },
      { t: 'h', text: 'Icons that follow the text colour' },
      { t: 'p', text: 'If you write `fill="currentColor"` on an icon\'s path, the icon takes the **text colour** of its parent. Change the colour in CSS, even on hover, and the icon follows. One icon file serves every colour scheme, including dark mode.' },
      {
        t: 'web',
        title: 'A button with an icon that follows the text colour. Hover over the button in the preview.',
        files: ['html', 'css'],
        assets: ASSETS,
        starter: { html: page(ICON_HTML('currentColor'), { css: true }), css: ICON_CSS },
        checks: [{ attr: 'button.call svg path', name: 'fill', equals: 'currentColor' }, { attr: 'button.call svg', name: 'aria-hidden', equals: 'true' }, { style: 'button.call', prop: 'color', is: '#0b6b4f' }],
      },
      { t: 'h', text: 'Reuse an icon with a sprite' },
      { t: 'p', text: 'If the same icon appears ten times, do not repeat its long `path` ten times. Define it **once** in a `<symbol>`, then place it with `<use href="#id">` wherever it is needed. The browser draws a copy each time.' },
      {
        t: 'web',
        title: 'One phone icon defined once and used twice.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(SPRITE_HTML) },
        checks: [{ count: 'symbol#icon-phone', equals: 1 }, { count: 'use[href="#icon-phone"]', equals: 2 }, { attr: 'symbol#icon-phone', name: 'viewBox', equals: '0 0 24 24' }],
      },
      { t: 'h', text: 'Animate with CSS' },
      { t: 'p', text: 'SVG shapes are elements, so CSS can style and animate them. A classic effect \"draws\" a line: make the dashes as long as the line, push them off by the same amount, then animate the offset to zero. Respect visitors who asked for less motion (Lesson 38).' },
      {
        t: 'web',
        title: 'A road that draws itself.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(DRAW_HTML, { css: true }), css: DRAW_CSS_SOLUTION },
        checks: [{ uses: 'css', pattern: 'stroke-dasharray' }, { uses: 'css', pattern: '@keyframes\\s+draw' }, { uses: 'css', pattern: 'prefers-reduced-motion:\\s*reduce' }],
      },
      { t: 'h', text: 'A chart from data, built with JavaScript' },
      { t: 'p', text: 'An SVG chart is just shapes placed by arithmetic. For each number, make a `<rect>` whose height is proportional to the value. SVG elements must be created with `document.createElementNS("http://www.w3.org/2000/svg", "rect")`, not `createElement`, because they belong to the SVG family (a \"namespace\").' },
      {
        t: 'web',
        title: 'A bar chart of three numbers. Change the data and the bars change.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(CHART_HTML, { js: true }), js: CHART_SOLUTION_JS },
        checks: [{ count: '#chart rect', equals: 3 }, { attr: '#chart rect:nth-child(1)', name: 'height', equals: '25' }, { attr: '#chart rect:nth-child(3)', name: 'height', equals: '100' }, { attr: '#chart rect:nth-child(3)', name: 'y', equals: '0', label: 'The tallest bar touches the top' }],
      },
      {
        t: 'predict',
        code: 'const data = [10, 20, 40];\nconst max = Math.max(...data);\nconsole.log(data.map((v) => (v / max) * 100).join(", "));',
        question: 'What are the bar heights, with the biggest value as 100?',
        options: ['25, 50, 100', '10, 20, 40', '100, 50, 25', '0.25, 0.5, 1'],
        answer: 0,
        explain: 'Each value is divided by the biggest (40) and multiplied by 100: 10 is 25 percent of 40, and 20 is 50 percent.',
      },
      { t: 'tip', text: 'SVG files are text, so they compress well, but editors export extra junk. Run them through an optimiser such as SVGO before shipping, and never paste an SVG from a stranger inline without reading it: an SVG can contain scripts.' },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<svg width="120" height="120">\n  <circle cx="50" cy="50" r="46" fill="#0b6b4f"></circle>\n</svg>', why: 'There is no `viewBox`, so the drawing cannot scale. If you change the size with CSS, the circle stays the same size and gets cut off. Add `viewBox="0 0 100 100"` so everything scales together.', right: '<svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-label="Green circle">\n  <circle cx="50" cy="50" r="46" fill="#0b6b4f"></circle>\n</svg>', logic: true },
          { lang: 'html', wrong: '<button><svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 3h4l2 5z"></path></svg></button>', why: 'An icon-only button has no name: a screen reader says just \"button\". Give the BUTTON a name with `aria-label`, and hide the decorative icon with `aria-hidden`.', right: '<button type="button" aria-label="Call us"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M6 3h4l2 5z"></path></svg></button>', logic: true },
          { lang: 'dom', wrong: 'const bar = document.createElement("rect");\nsvg.append(bar);', why: '`createElement` makes an HTML element, which the browser does not draw inside an SVG. SVG shapes need `createElementNS("http://www.w3.org/2000/svg", "rect")`.', right: 'const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");\nsvg.append(bar);' },
          { lang: 'dom', wrong: 'bar.setAttribute("y", height);', why: 'In SVG the `y` axis points DOWN from the top, so a bar that starts at `y = height` hangs below the baseline. For a bar chart the top of the bar is at `100 - height`.', right: 'bar.setAttribute("y", 100 - height);' },
          { lang: 'html', wrong: '<path d="M6 3h4l2 5z" fill="#000000"></path>', why: 'A fixed black fill never follows the text colour, so on a dark button the icon disappears. Use `fill="currentColor"`.', right: '<path d="M6 3h4l2 5z" fill="currentColor"></path>', logic: true },
        ],
      },
      {
        t: 'quiz',
        question: 'What does `viewBox="0 0 100 100"` do?',
        options: ['Gives the drawing its own coordinate system, so it scales to any size', 'Makes the SVG 100 pixels wide', 'Hides the SVG', 'Adds a 100 pixel border'],
        answer: 0,
        explain: 'The viewBox is the drawing\'s own ruler. The `width` and `height` set how big that ruler is on the page, and the whole picture scales to fit.',
      },
      {
        t: 'quiz',
        question: 'A phone icon sits beside the words "Call us". How should the icon be marked for a screen reader?',
        options: ['aria-hidden="true", because the text already says it', 'role="img" with the title "phone"', 'No marking at all', 'alt="phone"'],
        answer: 0,
        explain: 'A decorative icon next to a text label only adds noise for a screen reader. Hide it, and let the text speak.',
      },
      { t: 'recap', items: ['SVG is drawing by instructions: it stays sharp at any size, is tiny, and can be styled and animated with CSS.', 'Shapes live in the `viewBox` coordinate system (`rect`, `circle`, `polygon`, `path`, `text`). Width and height scale the whole drawing.', 'Name meaningful graphics (`role="img"` plus a `<title>` or `aria-label`), and hide decorative icons with `aria-hidden="true"`.', '`fill="currentColor"` makes an icon follow the text colour, hover and dark mode included.', 'A `<symbol>` defined once and reused with `<use>` is a sprite.', 'Charts are arithmetic: build `<rect>` elements with `createElementNS`, remembering that `y` counts down from the top.'] },
    ],
    exercises: [
      {
        id: 'w56-logo',
        title: 'Draw the logo',
        prompt: 'Complete this SVG logo. It needs:\n\n- `viewBox="0 0 100 100"` and `role="img"` on the `<svg>`,\n- a `<title>` that names it,\n- a `<circle>` (`cx="50" cy="50" r="46"` filled `#0b6b4f`),\n- a `<polygon>` (`points="50,22 62,46 38,46"` filled `#f7c948`),\n- a `<rect>` (`x="30" y="56" width="40" height="14" rx="4"` filled `#fdf1d3`).',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<svg width="120" height="120">\n  <!-- draw the logo here -->\n</svg>') },
        solution: { html: page(LOGO_SVG) },
        checks: [
          { attr: 'svg', name: 'viewBox', equals: '0 0 100 100', label: 'The drawing has its own coordinate system' },
          { attr: 'svg', name: 'role', equals: 'img', label: 'The logo is marked as an image' },
          { exists: 'svg title', label: 'It has a title' },
          { attr: 'svg circle', name: 'fill', equals: '#0b6b4f' },
          { attr: 'svg circle', name: 'r', equals: '46' },
          { attr: 'svg polygon', name: 'points', equals: '50,22 62,46 38,46' },
          { attr: 'svg rect', name: 'fill', equals: '#fdf1d3' },
          { attr: 'svg rect', name: 'rx', equals: '4' },
        ],
        hints: ['Put the three shapes between `<svg ...>` and `</svg>`, and the `<title>` as the first child. Write each shape with an explicit closing tag, like `<circle ...></circle>`.', 'Start the SVG tag like this: `<svg viewBox="0 0 100 100" width="120" height="120" role="img">`.', '```\n<circle cx="50" cy="50" r="46" fill="#0b6b4f"></circle>\n<polygon points="50,22 62,46 38,46" fill="#f7c948"></polygon>\n<rect x="30" y="56" width="40" height="14" rx="4" fill="#fdf1d3"></rect>\n```'],
      },
      {
        id: 'w56-current-color',
        title: 'An icon that follows the colour',
        prompt: 'The phone icon has a fixed black fill, so hovering the button changes the text colour but not the icon. Change the `fill` of the icon\'s path to `currentColor`. Also hide the decorative icon from screen readers with `aria-hidden="true"` on the `<svg>`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(ICON_HTML('#000000').replace(' aria-hidden="true"', ''), { css: true }), css: ICON_CSS },
        solution: { html: page(ICON_HTML('currentColor'), { css: true }), css: ICON_CSS },
        checks: [
          { attr: 'button.call svg path', name: 'fill', equals: 'currentColor', label: 'The icon takes the text colour' },
          { attr: 'button.call svg', name: 'aria-hidden', equals: 'true', label: 'The decorative icon is hidden from screen readers' },
          { text: 'button.call', contains: 'Call us', label: 'The visible text is still there' },
          { count: 'button.call svg', equals: 1 },
        ],
        hints: ['Find `fill="#000000"` on the `<path>` and change the value.', 'The special word is `currentColor` (with a capital C). It means \"whatever the text colour is here\".', 'Add `aria-hidden="true"` to the opening `<svg ...>` tag, next to `viewBox`.'],
      },
      {
        id: 'w56-sprite',
        title: 'Define the icon once',
        prompt: 'The same phone icon is written out twice, with a long `path` each time. Define it **once** as `<symbol id="icon-phone" viewBox="0 0 24 24">` containing the path (keep `fill="currentColor"`), inside a hidden `<svg>` at the top. Then replace the two icons with `<svg width="24" height="24" aria-hidden="true"><use href="#icon-phone"></use></svg>`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(SPRITE_STARTER_HTML) },
        solution: { html: page(SPRITE_HTML) },
        checks: [
          { count: 'symbol#icon-phone', equals: 1, label: 'The icon is defined once' },
          { attr: 'symbol#icon-phone', name: 'viewBox', equals: '0 0 24 24' },
          { count: 'use[href="#icon-phone"]', equals: 2, label: 'It is used twice' },
          { count: 'path', equals: 1, label: 'There is only ONE path in the whole page' },
          { count: 'svg[aria-hidden="true"]', min: 2 },
        ],
        hints: ['Start a hidden SVG at the top: `<svg width="0" height="0" style="position: absolute" aria-hidden="true">`, and inside it put the `<symbol>`.', 'Move the `<path>` into the `<symbol>`. Then the paragraphs no longer contain any path at all.', '```\n<svg width="24" height="24" aria-hidden="true"><use href="#icon-phone"></use></svg>\n```'],
      },
      {
        id: 'w56-bar-chart',
        title: 'Build a bar chart',
        prompt: 'The page has an empty `<svg id="chart">` and the data `[10, 20, 40]`. For each value, create a `<rect>` with `document.createElementNS("http://www.w3.org/2000/svg", "rect")` and set:\n\n- `x` = `index * 40 + 5` and `width` = `30`\n- `height` = `value / max * 100` (the biggest value gets 100)\n- `y` = `100 - height`, so every bar stands on the baseline\n\nThen `append` each bar to the SVG.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(CHART_HTML, { js: true }), js: CHART_STARTER_JS },
        solution: { html: page(CHART_HTML, { js: true }), js: CHART_SOLUTION_JS },
        checks: [
          { count: '#chart rect', equals: 3, label: 'One bar for each value' },
          { attr: '#chart rect:nth-child(1)', name: 'height', equals: '25', label: 'The first bar is 25 tall' },
          { attr: '#chart rect:nth-child(2)', name: 'height', equals: '50' },
          { attr: '#chart rect:nth-child(3)', name: 'height', equals: '100', label: 'The biggest bar is 100 tall' },
          { attr: '#chart rect:nth-child(1)', name: 'y', equals: '75', label: 'Bars stand on the baseline (y = 100 - height)' },
          { attr: '#chart rect:nth-child(2)', name: 'x', equals: '45', label: 'Bars are spaced 40 apart' },
          { attr: '#chart rect:nth-child(3)', name: 'width', equals: '30' },
          { noErrors: true },
        ],
        hints: ['Use `data.forEach((value, index) => { ... })` so you have both the number and its position.', 'Inside: `const height = (value / max) * 100;` and then create the bar with `createElementNS` (not `createElement`).', '```\nbar.setAttribute("x", index * 40 + 5);\nbar.setAttribute("y", 100 - height);\nbar.setAttribute("width", 30);\nbar.setAttribute("height", height);\nsvg.append(bar);\n```'],
      },
      {
        id: 'w56-draw-animation',
        title: 'Make the line draw itself',
        prompt: 'The path has `stroke-dasharray: 100` and `stroke-dashoffset: 100`, so it starts invisible. Add an animation named `draw` that moves `stroke-dashoffset` to `0` (`@keyframes draw { to { stroke-dashoffset: 0; } }`), apply it to `.draw` with `animation: draw 2s ease forwards;`, and for visitors who prefer reduced motion (`@media (prefers-reduced-motion: reduce)`) turn the animation off and show the finished line (`animation: none; stroke-dashoffset: 0;`).',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(DRAW_HTML, { css: true }), css: DRAW_CSS_STARTER },
        solution: { html: page(DRAW_HTML, { css: true }), css: DRAW_CSS_SOLUTION },
        checks: [
          { uses: 'css', pattern: '@keyframes\\s+draw\\s*\\{[^]*stroke-dashoffset:\\s*0', label: 'The keyframes animate the offset to 0' },
          { uses: 'css', pattern: 'animation:\\s*draw\\s+2s', label: 'The animation is applied' },
          { uses: 'css', pattern: 'forwards', label: 'The finished line stays drawn' },
          { uses: 'css', pattern: '@media\\s*\\(prefers-reduced-motion:\\s*reduce\\)[^]*animation:\\s*none', label: 'Reduced motion switches the animation off' },
          { uses: 'css', pattern: 'stroke-dasharray:\\s*100', label: 'The starting dash setup is kept' },
        ],
        hints: ['`@keyframes draw { to { stroke-dashoffset: 0; } }` describes the end of the movement. The start is the value already on `.draw`.', 'Put `animation: draw 2s ease forwards;` inside the `.draw` rule. `forwards` keeps the last frame.', '```\n@media (prefers-reduced-motion: reduce) {\n  .draw {\n    animation: none;\n    stroke-dashoffset: 0;\n  }\n}\n```'],
      },
    ],
  },

  // ================================================================== w57
  {
    id: 'w57-speed-in-depth',
    level: 'Level 6: Launch-ready for any company',
    title: 'Speed in depth: Core Web Vitals, images, fonts and caching',
    summary: 'Measure how fast a page feels, fix the usual causes (heavy images, slow fonts, blocking scripts, bad caching) and set a budget a client can understand.',
    minutes: 34,
    blocks: [
      {
        t: 'story',
        title: 'Data is money',
        text: 'Most of Kato\'s customers browse on a phone with a mobile data bundle, often on a slow connection. A page that downloads 6 megabytes costs the visitor real money and many seconds, and a visitor who waits more than a few seconds is gone. Google also notices: slow, jumpy pages rank lower and lose customers.\n\nIn Lesson 33 you learned the basics of speed. Now you learn how to **measure** it the way professionals do, which fixes matter most, and how to put it in a number the client can understand. Speed is not decoration. On a phone in Kampala it can be the difference between a booking and a back button.',
      },
      { t: 'analogy', text: 'A page loading is a **customer walking into a shop**. Is the first thing they came to see on the shelf quickly (Largest Contentful Paint)? Do the shelves jump around while they reach for something, and they grab the wrong thing (Cumulative Layout Shift)? When they point at a product, does the shopkeeper react at once or freeze (Interaction to Next Paint)? Those three feelings are the **Core Web Vitals**.' },
      { t: 'h', text: 'The three Core Web Vitals' },
      {
        t: 'list',
        items: [
          '**LCP (Largest Contentful Paint)**: how long until the biggest thing on screen (usually the main picture or a big heading) is visible. Good is 2.5 seconds or less. Poor is more than 4 seconds.',
          '**CLS (Cumulative Layout Shift)**: how much the page jumps while loading. A picture arriving late and pushing the text down causes it. Good is 0.1 or less. Poor is more than 0.25.',
          '**INP (Interaction to Next Paint)**: how quickly the page responds after a tap or a key press. Good is 200 milliseconds or less. Poor is more than 500.',
          'These are the thresholds Google publishes at the time of writing. Check `web.dev` for the current ones.',
        ],
      },
      {
        t: 'try',
        code: 'function lcpRating(ms) {\n  if (ms <= 2500) return "good";\n  if (ms <= 4000) return "needs improvement";\n  return "poor";\n}\n\nconsole.log(lcpRating(1800));\nconsole.log(lcpRating(3200));\nconsole.log(lcpRating(6000));',
        output: 'good\nneeds improvement\npoor',
      },
      { t: 'h', text: 'How to measure' },
      {
        t: 'list',
        items: [
          '**PageSpeed Insights** (pagespeed.web.dev): paste an address and get a report and advice. It shows real visitors\' data when the site has enough traffic.',
          '**Lighthouse**, inside the browser\'s DevTools (Lesson 45): runs the tests on your own computer, on a pretend slow phone.',
          'Test on a **real cheap phone** on a real mobile connection, not only on your laptop with fast Wi-Fi.',
          'Test the slowest realistic case: throttle the network in DevTools to \"Slow 4G\".',
          'Measure BEFORE you change anything, write the numbers down, change one thing, then measure again.',
        ],
      },
      { t: 'h', text: 'Fix 1: images, the biggest cost' },
      {
        t: 'list',
        items: [
          '**Right format**: photos as WebP or AVIF (much smaller than JPEG), logos and icons as SVG, PNG only when you really need it.',
          '**Right size**: do not send a 4000-pixel photo to show it 400 pixels wide. Make several sizes and let `srcset` and `sizes` (Lesson 37) pick the right one for the screen.',
          '**Always set `width` and `height`** so the browser reserves the space before the picture arrives. This one habit fixes most layout shift.',
          '**The main (hero) image** at the top: do NOT lazy-load it. Give it `fetchpriority="high"` so the browser fetches it first. This improves LCP.',
          '**Images below the screen**: `loading="lazy"` and `decoding="async"`.',
        ],
      },
      {
        t: 'web',
        title: 'The image markup of a fast page: a hero that loads first, and a lazy gallery with reserved space.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(IMAGES_SOLUTION) },
        checks: [
          { attr: 'header img', name: 'fetchpriority', equals: 'high', label: 'The hero image is fetched first' },
          { attr: 'header img', name: 'loading', present: false, label: 'The hero image is not lazy' },
          { attr: '.gallery img', name: 'loading', equals: 'lazy' },
          { attr: '.gallery img', name: 'width', matches: '^\\d+$', label: 'Width reserves space' },
          { rule: 'img-alt' },
        ],
      },
      { t: 'h', text: 'Fix 2: fonts' },
      {
        t: 'list',
        items: [
          'A custom font is a download. Use as few families and weights as you can (two weights is usually enough).',
          '`font-display: swap` shows text at once in a fallback font and swaps when the custom font arrives, instead of hiding the text (\"invisible text\") while it loads.',
          'Use a good fallback stack (`system-ui, sans-serif`) so the swap hardly moves the layout. Self-host WOFF2 files where you can, which also avoids an extra connection to another server.',
          'A system font stack costs nothing: sometimes the fastest font is no font.',
        ],
      },
      {
        t: 'web',
        title: 'A font loaded politely: text appears immediately, then swaps.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(FONTS_PAGE, { css: true }), css: FONTS_CSS },
        checks: [{ uses: 'css', pattern: 'font-display:\\s*swap' }, { uses: 'css', pattern: 'format\\("woff2"\\)' }, { uses: 'css', pattern: 'system-ui' }],
      },
      { t: 'h', text: 'Fix 3: scripts and styles' },
      {
        t: 'list',
        items: [
          'A normal `<script src>` in the middle of the page **blocks** the browser. Add **`defer`** (it runs after the page is read, in order) or put it at the end. Use `async` only for scripts that do not depend on others, such as analytics.',
          '**Minify** CSS and JavaScript (remove spaces and comments) with a tool, and delete code you do not use.',
          'Think before adding a big library for a small job. Many sites load 300 KB of JavaScript to show a menu.',
          '**Third-party scripts** (chat widgets, maps, video embeds, analytics) are often the heaviest part. Load them only when needed, for example a map or video only after the visitor taps it.',
        ],
      },
      { t: 'h', text: 'Fix 4: caching and compression' },
      {
        t: 'list',
        items: [
          'The `Cache-Control` header tells the browser how long it may keep a file. A returning visitor then downloads almost nothing.',
          'Files whose name includes a **hash of their contents** (`app.3f9a1c2b.js`) can be cached for a year (`max-age=31536000, immutable`), because any change makes a NEW file name.',
          'HTML must not be cached for long (`no-cache`), so that visitors always get the newest page, which points to the newest hashed files.',
          'Servers should compress text with **gzip or Brotli**: a 300 KB script becomes about 90 KB. Good hosts (GitHub Pages, Netlify, Cloudflare) do this for you. A **CDN** (content delivery network) also keeps copies near the visitor.',
        ],
      },
      {
        t: 'try',
        code: 'function cacheControl(path) {\n  if (path.endsWith(".html") || path === "/") return "no-cache";\n  if (/\\.[0-9a-f]{8}\\.(js|css)$/.test(path)) return "public, max-age=31536000, immutable";\n  return "public, max-age=86400";\n}\n\nconsole.log(cacheControl("/index.html"));\nconsole.log(cacheControl("/assets/app.3f9a1c2b.js"));\nconsole.log(cacheControl("/img/logo.svg"));',
        output: 'no-cache\npublic, max-age=31536000, immutable\npublic, max-age=86400',
      },
      { t: 'h', text: 'A performance budget' },
      { t: 'p', text: 'A **budget** is a limit you agree before you build, so speed does not get forgotten. For a small business site on phones, a sensible budget might be: total page weight under 1 megabyte, hero image under 150 KB, no more than about 10 requests, and Core Web Vitals in the \"good\" range. When a new feature breaks the budget, you discuss it with the client instead of discovering it a month later.' },
      {
        t: 'predict',
        code: 'const sizes = [420000, 130000, 520000];\nconst total = sizes.reduce((sum, n) => sum + n, 0);\nconsole.log(Math.round((total / 1024) * 10) / 10);',
        question: 'What does this print (the total in kilobytes, where 1 KB is 1024 bytes)?',
        options: ['1044.9', '1070000', '1070', '1.0'],
        answer: 0,
        explain: 'The sizes add up to 1,070,000 bytes. Divide by 1024 to get kilobytes: 1,070,000 / 1024 is 1044.92..., which rounds to 1044.9. That is just over a megabyte, so it would break the 1 MB budget above.',
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<img src="hero.jpg" loading="lazy" alt="Our shop">', why: 'The main picture at the top is lazy-loaded, so the browser delays the one image the visitor wants to see first. That makes LCP worse. Lazy-load only images BELOW the screen, and give the hero `fetchpriority="high"`.', right: '<img src="hero.jpg" fetchpriority="high" alt="Our shop" width="800" height="500">', logic: true },
          { lang: 'html', wrong: '<img src="gallery-1.jpg" alt="A rolex">', why: 'No `width` and `height`, so the browser does not know how much space to keep. When the picture arrives, the text below jumps down. That is layout shift (CLS). Always give both attributes.', right: '<img src="gallery-1.jpg" alt="A rolex" width="400" height="300" loading="lazy">', logic: true },
          { lang: 'html', wrong: '<script src="app.js"></script>', why: 'A plain script in the head stops the browser from showing the page until it has downloaded and run. Add `defer`.', right: '<script src="app.js" defer></script>', logic: true },
          { lang: 'css', wrong: '@font-face {\n  font-family: "Poppins";\n  src: url("poppins.woff2") format("woff2");\n}', why: 'Without `font-display: swap`, some browsers hide the text until the font arrives, leaving a blank page on a slow connection. Add `font-display: swap`.', right: '@font-face {\n  font-family: "Poppins";\n  src: url("poppins.woff2") format("woff2");\n  font-display: swap;\n}', logic: true },
          { lang: 'dom', wrong: 'Cache-Control: public, max-age=31536000   (for index.html)', why: 'A year of caching on the HTML page means visitors keep seeing the OLD page, because the browser never asks again. Cache long only files whose name changes when their content changes (hashed files). HTML should be `no-cache`.', right: 'Cache-Control: no-cache   (for index.html)' },
        ],
      },
      {
        t: 'quiz',
        question: 'Pictures arrive late and push the text down, so the visitor taps the wrong button. Which Core Web Vital measures this?',
        options: ['CLS (layout shift)', 'LCP (largest paint)', 'INP (interaction)', 'TTFB'],
        answer: 0,
        explain: 'Cumulative Layout Shift measures how much visible content moves unexpectedly. Setting `width` and `height` on images is the main cure.',
      },
      {
        t: 'quiz',
        question: 'Which file can safely be cached for a whole year?',
        options: ['app.3f9a1c2b.js (the name contains a hash of its contents)', 'index.html', 'prices.html', 'app.js that you overwrite at each update'],
        answer: 0,
        explain: 'When a hashed file changes, its name changes, so the old cached copy is simply never asked for again.',
      },
      { t: 'recap', items: ['The Core Web Vitals: LCP (main content shows in 2.5 s or less), CLS (layout shift 0.1 or less), INP (response 200 ms or less). Check web.dev for current thresholds.', 'Measure first with PageSpeed Insights and Lighthouse, on a real cheap phone and Slow 4G. Change one thing at a time and measure again.', 'Images are the biggest cost: use WebP, AVIF or SVG, the right size, `width` and `height` on every image, `fetchpriority="high"` for the hero, and `loading="lazy"` below the screen.', 'Fonts: few weights, `font-display: swap`, a good fallback stack, WOFF2.', 'Scripts: `defer`, minify, remove unused code, and load third-party widgets only when needed.', 'Cache hashed files for a year, never cache HTML for long, and let the host compress text. Agree a performance budget with the client.'] },
    ],
    exercises: [
      {
        id: 'w57-image-markup',
        title: 'Fast image markup',
        prompt: 'Fix the images on this page:\n\n- The **hero** image in the `<header>`: give it a good `alt`, `width="320"` and `height="200"`, and `fetchpriority="high"`. It must NOT be lazy.\n- The three **gallery** images: give each a good `alt`, `width="160"`, `height="100"`, `loading="lazy"` and `decoding="async"`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(IMAGES_STARTER) },
        solution: { html: page(IMAGES_SOLUTION) },
        checks: [
          { attr: 'header img', name: 'fetchpriority', equals: 'high', label: 'The hero is fetched first' },
          { attr: 'header img', name: 'loading', present: false, label: 'The hero is not lazy' },
          { attr: 'header img', name: 'width', equals: '320' },
          { attr: 'header img', name: 'height', equals: '200' },
          { count: '.gallery img[loading="lazy"]', equals: 3, label: 'All three gallery images are lazy' },
          { count: '.gallery img[decoding="async"]', equals: 3 },
          { count: '.gallery img[width="160"][height="100"]', equals: 3, label: 'Every gallery image reserves its space' },
          { rule: 'img-alt' },
        ],
        hints: ['The hero and the gallery need DIFFERENT attributes. The hero is the first thing seen, so it must load early; the gallery can wait.', 'Hero: `alt`, `width`, `height` and `fetchpriority="high"`. Gallery images: `alt`, `width`, `height`, `loading="lazy"` and `decoding="async"`.', '```\n<img src="img/boda.svg" alt="A boda boda rider" width="160" height="100" loading="lazy" decoding="async">\n```'],
      },
      {
        id: 'w57-vital-rating',
        title: 'Rate a Core Web Vital',
        prompt: 'Write `vitalRating(metric, value)`. `metric` is `"lcp"` (milliseconds), `"cls"` (a number) or `"inp"` (milliseconds). Return `"good"`, `"needs improvement"` or `"poor"`:\n\n- LCP: good up to 2500, needs improvement up to 4000, otherwise poor\n- CLS: good up to 0.1, needs improvement up to 0.25, otherwise poor\n- INP: good up to 200, needs improvement up to 500, otherwise poor\n\n(The limits themselves belong to the better rating.)',
        files: ['js'],
        starter: { js: '// Write vitalRating(metric, value)\n' },
        solution: { js: RATING_SOLUTION },
        checks: [
          { js: 'vitalRating("lcp", 1800)', equals: 'good' },
          { js: 'vitalRating("lcp", 2500)', equals: 'good', label: 'The limit itself is good' },
          { js: 'vitalRating("lcp", 3200)', equals: 'needs improvement' },
          { js: 'vitalRating("lcp", 6000)', equals: 'poor' },
          { js: 'vitalRating("cls", 0.05)', equals: 'good' },
          { js: 'vitalRating("cls", 0.2)', equals: 'needs improvement' },
          { js: 'vitalRating("inp", 450)', equals: 'needs improvement', hidden: true },
          { js: 'vitalRating("inp", 600)', equals: 'poor', hidden: true },
          { js: 'vitalRating("cls", 0.25)', equals: 'needs improvement', hidden: true },
        ],
        hints: ['Keep the limits in an object, one pair per metric: `lcp: [2500, 4000]`, and so on. Then one set of `if` statements works for all three.', 'Take the two limits out with `const [good, poor] = limits[metric];`. Then: `value <= good` is good, `value <= poor` needs improvement, anything else is poor.', '```\nif (value <= good) return "good";\nif (value <= poor) return "needs improvement";\nreturn "poor";\n```'],
      },
      {
        id: 'w57-budget',
        title: 'Check the page weight',
        prompt: 'Write `budgetReport(resources, limitKb)`. `resources` is a list like `{ name: "hero.jpg", bytes: 420000 }`. Return an object `{ totalKb, over, biggest }`:\n\n- `totalKb`: the total of all `bytes` divided by 1024, rounded to **one decimal place**\n- `over`: `true` when `totalKb` is more than `limitKb`\n- `biggest`: the `name` of the largest resource (or `null` for an empty list)',
        files: ['js'],
        starter: { js: '// Write budgetReport(resources, limitKb)\n' },
        solution: { js: BUDGET_SOLUTION },
        checks: [
          { js: 'budgetReport([{ name: "a.jpg", bytes: 512000 }, { name: "b.js", bytes: 102400 }], 1000).totalKb', equals: 600 },
          { js: 'budgetReport([{ name: "a.jpg", bytes: 512000 }, { name: "b.js", bytes: 102400 }], 1000).biggest', equals: 'a.jpg', label: 'It names the biggest file' },
          { js: 'budgetReport([{ name: "a.jpg", bytes: 2048000 }], 1000).over', equals: true, label: 'Over the budget is flagged' },
          { js: 'budgetReport([{ name: "a.jpg", bytes: 1024 }], 1).over', equals: false, label: 'Exactly on the limit is not over' },
          { js: 'budgetReport([], 100).biggest', equals: null, hidden: true },
          { js: 'budgetReport([{ name: "x", bytes: 1500 }], 5).totalKb', equals: 1.5, hidden: true },
        ],
        hints: ['Loop over the resources, adding `item.bytes` to a running total and remembering the biggest item you have seen.', 'Kilobytes: `total / 1024`. To round to one decimal place: `Math.round(x * 10) / 10`.', '```\nreturn { totalKb, over: totalKb > limitKb, biggest: biggest ? biggest.name : null };\n```'],
      },
      {
        id: 'w57-cache-control',
        title: 'Choose the cache header',
        prompt: 'Write `cacheControl(path)` that returns the right `Cache-Control` value:\n\n- a path ending in `.html`, or exactly `"/"`: `no-cache`\n- a `.js` or `.css` file whose name has an 8-character hash before the extension, like `/assets/app.3f9a1c2b.js`: `public, max-age=31536000, immutable`\n- anything else: `public, max-age=86400`',
        files: ['js'],
        starter: { js: '// Write cacheControl(path)\n' },
        solution: { js: CACHE_SOLUTION },
        checks: [
          { js: 'cacheControl("/index.html")', equals: 'no-cache' },
          { js: 'cacheControl("/")', equals: 'no-cache' },
          { js: 'cacheControl("/assets/app.3f9a1c2b.js")', equals: 'public, max-age=31536000, immutable', label: 'A hashed script is cached for a year' },
          { js: 'cacheControl("/assets/style.0a1b2c3d.css")', equals: 'public, max-age=31536000, immutable' },
          { js: 'cacheControl("/img/logo.svg")', equals: 'public, max-age=86400' },
          { js: 'cacheControl("/assets/app.js")', equals: 'public, max-age=86400', label: 'A script without a hash is NOT cached for a year', hidden: true },
          { js: 'cacheControl("/prices.html")', equals: 'no-cache', hidden: true },
        ],
        hints: ['Three cases, checked in this order: HTML first, hashed files second, everything else last.', 'For the hashed files use a regular expression that looks for a dot, 8 hexadecimal characters, a dot, and `js` or `css` at the end: `/\\.[0-9a-f]{8}\\.(js|css)$/`.', '```\nif (/\\.[0-9a-f]{8}\\.(js|css)$/.test(path)) {\n  return "public, max-age=31536000, immutable";\n}\n```'],
      },
      {
        id: 'w57-pick-width',
        title: 'Pick the right image size',
        prompt: 'A phone screen has a pixel ratio (a sharp screen packs 2 or 3 device pixels into one CSS pixel). Write `pickWidth(displayWidth, pixelRatio, available)`. The picture needs `displayWidth * pixelRatio` pixels. Return the **smallest** available width that is at least that big. If none is big enough, return the largest available width.',
        files: ['js'],
        starter: { js: '// Write pickWidth(displayWidth, pixelRatio, available)\n' },
        solution: { js: PICK_WIDTH_SOLUTION },
        checks: [
          { js: 'pickWidth(400, 2, [400, 800, 1200])', equals: 800, label: '400 CSS pixels on a 2x screen needs 800' },
          { js: 'pickWidth(300, 1, [400, 800, 1200])', equals: 400, label: 'The smallest that is big enough' },
          { js: 'pickWidth(600, 3, [400, 800, 1200])', equals: 1200 },
          { js: 'pickWidth(1000, 3, [400, 800, 1200])', equals: 1200, label: 'Nothing big enough gives the largest' },
          { js: 'pickWidth(400, 2, [1200, 400, 800])', equals: 800, label: 'The list can be in any order', hidden: true },
          { js: 'pickWidth(100, 1, [200])', equals: 200, hidden: true },
        ],
        hints: ['First work out `needed = displayWidth * pixelRatio`.', 'Sort a COPY of the sizes from small to large, `[...available].sort((a, b) => a - b)`, and return the first one that is `>= needed`.', 'If the loop ends without finding one, return the last (largest) item of the sorted list.'],
      },
    ],
  },
];
