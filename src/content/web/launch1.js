// Web track, launch-ready extension, group A: mobile navigation, forms that really send, domains and search-engine files.
// Lessons w46 to w48. See docs/WEB-TRACK.md for the roadmap.
// Checks avoid media queries and anything jsdom cannot do, so they give the same answer on a real phone.
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

const page = (body, o = {}) => fullPage(body, { title: 'Mama Rose Rolex', ...o });

// ------------------------------------------------------------------ w46 helpers
const NAV_HTML = `<header class="site-header">
  <a class="logo" href="#top">Mama Rose</a>
  <button id="menu-btn" class="menu-btn" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">&#9776;</button>
  <nav id="site-nav" class="site-nav" aria-label="Main">
    <ul>
      <li><a href="#menu" aria-current="page">Menu</a></li>
      <li><a href="#order">Order</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>
<main id="top">
  <h1>Hot rolex, every day</h1>
  <p>Wandegeya, Kampala. Open from 6 am.</p>
</main>`;

const NAV_CSS = `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
.site-header {
  position: sticky;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: #0b6b4f;
  color: #ffffff;
  padding: 8px 16px;
}
.logo {
  color: #ffffff;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
}
.menu-btn {
  min-width: 44px;
  min-height: 44px;
  font-size: 24px;
  color: #ffffff;
  background: transparent;
  border: 2px solid #ffffff;
  border-radius: 8px;
}
.site-nav {
  display: none;
  width: 100%;
}
.site-nav.open {
  display: block;
}
.site-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.site-nav a {
  display: block;
  padding: 14px 8px;
  color: #ffffff;
  text-decoration: none;
}
.site-nav a[aria-current="page"] {
  font-weight: 700;
  border-left: 4px solid #f7c948;
}
@media (min-width: 700px) {
  .menu-btn {
    display: none;
  }
  .site-nav {
    display: block;
    width: auto;
  }
  .site-nav ul {
    display: flex;
    gap: 8px;
  }
}
`;

const NAV_JS_TOGGLE = `const button = document.querySelector("#menu-btn");
const nav = document.querySelector("#site-nav");

button.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", String(open));
});
`;

const NAV_JS_FULL = `const button = document.querySelector("#menu-btn");
const nav = document.querySelector("#site-nav");

function closeMenu() {
  nav.classList.remove("open");
  button.setAttribute("aria-expanded", "false");
}

button.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  button.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});
`;

// ------------------------------------------------------------------ w47 helpers
const BOOKING_FORM = `<form id="booking" data-endpoint="/api/booking">
  <label for="name">Your name</label>
  <input id="name" name="name" type="text" required autocomplete="name">

  <label for="phone">Phone number</label>
  <input id="phone" name="phone" type="tel" required autocomplete="tel">

  <label for="pickup">Pickup place</label>
  <input id="pickup" name="pickup" type="text">

  <input class="trap" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
  <button type="submit">Book a ride</button>
  <p id="status" role="status"></p>
</form>`;

const SEND_JS = `const form = document.querySelector("#booking");
const status = document.querySelector("#status");
const button = form.querySelector("button");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (form.elements._gotcha.value) {
    return;
  }
  button.disabled = true;
  status.textContent = "Sending...";
  try {
    const response = await fetch(form.dataset.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!response.ok) {
      throw new Error("The server said " + response.status);
    }
    const data = await response.json();
    form.reset();
    status.textContent = "Thank you, " + data.received.name + "! Kato will call you soon.";
  } catch (error) {
    status.textContent = "Sorry, that did not send. Please call 0700 123 456.";
  } finally {
    button.disabled = false;
  }
});
`;

const FILL_AND_SEND = [
  { do: 'type', target: '#name', value: 'Amina' },
  { do: 'type', target: '#phone', value: '0700123456' },
  { do: 'submit', target: '#booking', ms: 80 },
];

// ------------------------------------------------------------------ w48 helpers
const RESOLVE_SOLUTION = `function resolve(name, table) {
  let current = name;
  for (let hops = 0; hops < 5; hops++) {
    const record = table[current];
    if (!record) {
      return "not found";
    }
    if (record.type !== "CNAME") {
      return record.value;
    }
    current = record.value;
  }
  return "loop";
}
`;

const SITEMAP_SOLUTION = `function buildSitemap(base, paths) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  for (const path of paths) {
    const address = (base + path).replace(/&/g, "&amp;");
    lines.push("  <url><loc>" + address + "</loc></url>");
  }
  lines.push("</urlset>");
  return lines.join("\\n");
}
`;

export const launch1Lessons = [
  // ================================================================== w46
  {
    id: 'w46-mobile-navigation',
    level: 'Level 4: JavaScript in the page',
    title: 'Navigation that works on phones',
    summary: 'A header and menu that collapse into a button on a phone, stay reachable while scrolling, and work with a keyboard and a screen reader.',
    minutes: 30,
    blocks: [
      {
        t: 'story',
        title: 'The pile of links',
        text: 'Rose\'s website has grown to five pages: Menu, Order, Gallery, About and Contact. On her cousin\'s phone the five links wrap into a **messy pile** that covers half the screen. The Order link, the one that brings money, has slipped below the picture. Customers scroll, get lost and leave.\n\nEvery company website needs a **navigation bar** that works on a phone. On a wide screen the links sit in a row. On a narrow screen they hide behind a button (people call it a **hamburger menu**, from the three lines) and open when tapped. Almost every site you will ever build has one.',
      },
      { t: 'analogy', text: 'Think of the paper menu on a restaurant table. Folded, it takes almost no room and shows only the shop\'s name. Open it, and every dish is there. The **button** is the fold, the **links** are the dishes. A good menu also tells people whether it is open or folded (a screen reader says \"expanded\" or \"collapsed\") and can be closed without a mouse.' },
      { t: 'h', text: 'Start with the phone: mobile-first' },
      {
        t: 'list',
        items: [
          '**Mobile-first** means you write the phone layout as the normal CSS and add the wide-screen layout inside `@media (min-width: 700px)`. Most of your visitors are on phones, so the phone design is the main design.',
          'The **button** must be a real `<button>`. It has `aria-expanded` (\"false\" when closed, \"true\" when open), `aria-controls` (the `id` of the menu it opens) and a name such as `aria-label=\"Menu\"`, because a picture of three lines has no text.',
          'The **menu** is a `<nav aria-label=\"Main\">` with a list of links. The link of the page you are on gets `aria-current=\"page\"`.',
          'Make everything easy to hit with a thumb: tap targets at least **44 by 44 pixels**.',
          'A **sticky header** (`position: sticky; top: 0`) stays at the top while the visitor scrolls, so the menu is always one tap away.',
        ],
      },
      {
        t: 'web',
        title: 'A complete mobile menu. Tap the button in the preview, then tap it again. The tests check the open and closed states.',
        files: ['html', 'css', 'js'],
        assets: ASSETS,
        starter: { html: page(NAV_HTML, { css: true, js: true }), css: NAV_CSS, js: NAV_JS_TOGGLE },
        checks: [
          { exists: 'button#menu-btn[aria-controls="site-nav"]' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'The menu starts closed' },
          { do: 'click', target: '#menu-btn' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'true', label: 'Tapping the button opens the menu' },
          { attr: '#site-nav', name: 'class', contains: 'open' },
          { do: 'click', target: '#menu-btn' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'Tapping again closes it' },
        ],
      },
      {
        t: 'see',
        files: { html: page(NAV_HTML, { css: true, js: true }), css: NAV_CSS, js: NAV_JS_TOGGLE },
        question: 'A visitor opens the page on a phone and has not touched anything yet. Looking at the CSS above (the normal rules, outside the `@media` block), what do they see in the header?',
        options: ['The logo and the menu button; the four links are hidden', 'The logo and all four links in a row', 'Only the four links', 'A blank header'],
        answer: 0,
        explain: 'Outside the `@media (min-width: 700px)` block, `.site-nav` has `display: none`, so the links are hidden until the button adds the class `open`. On a wide screen the media query takes over: the button disappears and the links show in a row.',
        proof: [{ uses: 'css', pattern: '\\.site-nav\\s*\\{[^}]*display:\\s*none' }, { uses: 'css', pattern: '@media\\s*\\(min-width:\\s*700px\\)' }],
      },
      { t: 'tip', text: 'You cannot test a media query by shrinking a preview in these lessons, but you can on your own phone or with the device toolbar in browser DevTools (Lesson 45). Always check the menu at about 360 pixels wide, the width of a common cheap phone.' },
      { t: 'h', text: 'Keep the state honest' },
      { t: 'p', text: 'The class `open` changes how the menu LOOKS. The attribute `aria-expanded` tells a screen reader what the menu IS doing. If you update only one of them, sighted visitors and blind visitors see two different pages. That is why the click handler changes both in the same place.' },
      {
        t: 'try',
        code: 'const states = [];\nlet open = false;\n\nfunction toggle() {\n  open = !open;\n  states.push(String(open));\n}\n\ntoggle();\ntoggle();\ntoggle();\nconsole.log(states.join(", "));',
        output: 'true, false, true',
      },
      {
        t: 'predict',
        code: 'let open = false;\nfunction toggle() {\n  open = !open;\n  return String(open);\n}\nconsole.log(toggle());\nconsole.log(toggle());',
        question: 'This models the button. What does it print?',
        options: ['true\nfalse', 'false\ntrue', 'true\ntrue', 'false\nfalse'],
        answer: 0,
        explain: 'The menu starts closed (`open` is false). The first tap flips it to true, the second flips it back to false. `classList.toggle` does the same job and also tells you the new state.',
      },
      { t: 'h', text: 'Close the menu at the right moments' },
      {
        t: 'list',
        items: [
          'After a visitor taps a link, close the menu. Otherwise it stays open over the page they just chose.',
          'Pressing **Escape** should close it. Keyboard users expect this from every menu and popup.',
          'Use one `closeMenu()` function and call it from both places, so the class and `aria-expanded` always change together.',
          '**Event delegation** (Level 4): listen once on the `<nav>` and ask `event.target.closest("a")`, instead of adding a listener to every link.',
        ],
      },
      {
        t: 'web',
        title: 'The finished behaviour: links close the menu and Escape closes it too. Open the menu, tap a link, and watch it close.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(NAV_HTML, { css: true, js: true }), css: NAV_CSS, js: NAV_JS_FULL },
        checks: [
          { do: 'click', target: '#menu-btn' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'true' },
          { do: 'click', target: '#site-nav a[href="#order"]' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'Tapping a link closes the menu' },
          { do: 'click', target: '#menu-btn' },
          { do: 'key', target: '#menu-btn', value: 'Escape' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'Escape closes the menu' },
        ],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<div class="menu-btn">&#9776;</div>', why: 'A `<div>` cannot be reached with the Tab key and a screen reader does not call it a button. Pressing Enter does nothing. Use a real `<button>`.', right: '<button class="menu-btn" aria-label="Menu">&#9776;</button>', logic: true },
          { lang: 'html', wrong: '<button class="menu-btn">&#9776;</button>', why: 'This button has no name (a screen reader says just \"button\") and it does not say whether the menu is open or which menu it controls. Add `aria-label`, `aria-expanded` and `aria-controls`.', right: '<button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="site-nav">&#9776;</button>', logic: true },
          { lang: 'dom', wrong: 'button.addEventListener("click", () => {\n  nav.classList.toggle("open");\n});', why: 'The menu opens and closes visually, but `aria-expanded` stays \"false\" for ever, so a screen reader user is told the menu is closed while it is open. Update both together.', right: 'button.addEventListener("click", () => {\n  const open = nav.classList.toggle("open");\n  button.setAttribute("aria-expanded", String(open));\n});' },
          { lang: 'dom', wrong: 'button.setAttribute("aria-expanded", open);', why: 'This works only by luck, because the boolean is turned into text. Be explicit with `String(open)`, so you always write the text \"true\" or \"false\".', right: 'button.setAttribute("aria-expanded", String(open));' },
        ],
      },
      {
        t: 'quiz',
        question: 'What does `aria-expanded="true"` on the menu button tell a screen reader?',
        options: ['The menu this button controls is currently open', 'The button is very large', 'The page is wide', 'The menu is broken'],
        answer: 0,
        explain: 'It states the current state. When the menu is closed the value is \"false\". Without it, blind visitors cannot tell whether tapping the button did anything.',
      },
      {
        t: 'quiz',
        question: 'Why do we write the phone layout as the normal CSS and the wide layout inside `@media (min-width: 700px)`?',
        options: ['Most visitors are on phones, and phones then load the simplest rules', 'Because wide screens are not important', 'Because media queries only work on phones', 'Because it uses less colour'],
        answer: 0,
        explain: 'This is mobile-first design. The simple phone version needs no overrides, and the wide screen only adds what it needs.',
      },
      { t: 'recap', items: ['A navigation bar must work on a phone: links hide behind a real `<button>` and open on tap.', 'Write the phone layout first (mobile-first), then add the wide-screen version in `@media (min-width: 700px)`.', 'The button needs `aria-label`, `aria-expanded` and `aria-controls`. Change `aria-expanded` and the class together.', 'Close the menu after a link is tapped and when Escape is pressed. One `closeMenu()` function does both.', 'A sticky header keeps the menu one tap away. Tap targets should be at least 44 by 44 pixels.', 'Mark the current page with `aria-current="page"` and style it, so visitors always know where they are.'] },
    ],
    exercises: [
      {
        id: 'w46-toggle',
        title: 'Make the button work',
        prompt: 'The header and the CSS are ready, but the button does nothing. In the JavaScript, listen for a click on `#menu-btn`. Each click must toggle the class `open` on `#site-nav` AND set the button\'s `aria-expanded` attribute to `"true"` or `"false"` to match.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(NAV_HTML, { css: true, js: true }), css: NAV_CSS, js: 'const button = document.querySelector("#menu-btn");\nconst nav = document.querySelector("#site-nav");\n\n// Listen for a click on the button.\n' },
        solution: { html: page(NAV_HTML, { css: true, js: true }), css: NAV_CSS, js: NAV_JS_TOGGLE },
        checks: [
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'The menu starts closed' },
          { do: 'click', target: '#menu-btn' },
          { attr: '#site-nav', name: 'class', contains: 'open', label: 'The first click opens the menu' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'true', label: 'aria-expanded becomes "true"' },
          { do: 'click', target: '#menu-btn' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'The second click closes it again' },
          { attr: '#site-nav', name: 'class', matches: '^((?!open).)*$', label: 'The class open is removed' },
        ],
        hints: ['`element.classList.toggle("open")` adds the class if it is missing and removes it if it is there. It also returns true or false.', 'Store the answer: `const open = nav.classList.toggle("open");` and then use `open` for the attribute.', '```\nbutton.addEventListener("click", () => {\n  const open = nav.classList.toggle("open");\n  button.setAttribute("aria-expanded", String(open));\n});\n```'],
      },
      {
        id: 'w46-accessible-markup',
        title: 'Fix the header markup',
        prompt: 'This header looks right but is hard to use with a keyboard or a screen reader. Fix the HTML:\n\n- Make the menu control a real `<button>` (keep `id="menu-btn"` and `class="menu-btn"`) with `aria-label="Menu"`, `aria-expanded="false"` and `aria-controls="site-nav"`.\n- Give the `<nav>` an `aria-label` of `Main`.\n- Mark the link to the page you are on (Menu) with `aria-current="page"`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<header class="site-header">\n  <a class="logo" href="#top">Mama Rose</a>\n  <div id="menu-btn" class="menu-btn">&#9776;</div>\n  <nav id="site-nav" class="site-nav">\n    <ul>\n      <li><a href="#menu">Menu</a></li>\n      <li><a href="#order">Order</a></li>\n      <li><a href="#contact">Contact</a></li>\n    </ul>\n  </nav>\n</header>\n<main id="top">\n  <h1>Hot rolex, every day</h1>\n</main>', { css: true }), css: NAV_CSS },
        solution: { html: page('<header class="site-header">\n  <a class="logo" href="#top">Mama Rose</a>\n  <button id="menu-btn" class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="site-nav">&#9776;</button>\n  <nav id="site-nav" class="site-nav" aria-label="Main">\n    <ul>\n      <li><a href="#menu" aria-current="page">Menu</a></li>\n      <li><a href="#order">Order</a></li>\n      <li><a href="#contact">Contact</a></li>\n    </ul>\n  </nav>\n</header>\n<main id="top">\n  <h1>Hot rolex, every day</h1>\n</main>', { css: true }), css: NAV_CSS },
        checks: [
          { exists: 'button#menu-btn.menu-btn', label: 'The menu control is a real button' },
          { attr: '#menu-btn', name: 'aria-label', equals: 'Menu' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false' },
          { attr: '#menu-btn', name: 'aria-controls', equals: 'site-nav' },
          { attr: 'nav#site-nav', name: 'aria-label', equals: 'Main' },
          { attr: '#site-nav a[href="#menu"]', name: 'aria-current', equals: 'page', label: 'The current page is marked' },
          { count: '#site-nav a[aria-current]', equals: 1, label: 'Only one link is marked as the current page' },
          { lint: 'html' },
        ],
        hints: ['Change the tags: the `<div>` that shows the three lines becomes a `<button>` and keeps its `id` and `class`.', 'All the aria attributes go on the opening tag of the element they describe. `aria-controls` holds the `id` of the nav, which is `site-nav`.', '```\n<button id="menu-btn" class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="site-nav">&#9776;</button>\n<nav id="site-nav" class="site-nav" aria-label="Main">\n...\n<li><a href="#menu" aria-current="page">Menu</a></li>\n```'],
      },
      {
        id: 'w46-sticky-css',
        title: 'Mobile-first header styles',
        prompt: 'The HTML is finished. Write the CSS (mobile-first):\n\n- `.site-header` is **sticky** at the top (`position: sticky; top: 0`) with a `background-color` of `#0b6b4f`.\n- `.site-nav` is hidden by default (`display: none`) and shown with `display: block` when it also has the class `open`.\n- Inside `@media (min-width: 700px)` the button is hidden (`display: none`) and `.site-nav` is always shown (`display: block`).\n- `.menu-btn` is easy to tap: `min-width: 44px` and `min-height: 44px`.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(NAV_HTML, { css: true }), css: '/* Write the header styles here */\n' },
        solution: { html: page(NAV_HTML, { css: true }), css: NAV_CSS },
        checks: [
          { style: '.site-header', prop: 'background-color', is: '#0b6b4f' },
          { uses: 'css', pattern: 'position:\\s*sticky', label: 'The header is sticky' },
          { uses: 'css', pattern: 'top:\\s*0', label: 'It sticks to the top (top: 0)' },
          { uses: 'css', pattern: '\\.site-nav\\s*\\{[^}]*display:\\s*none', label: '.site-nav is hidden by default' },
          { uses: 'css', pattern: '\\.site-nav\\.open\\s*\\{[^}]*display:\\s*block', label: 'The class open shows it' },
          { uses: 'css', pattern: '@media\\s*\\(min-width:\\s*700px\\)', label: 'There is a wide-screen rule' },
          { uses: 'css', pattern: 'min-width:\\s*44px', label: 'The button is at least 44px wide' },
          { uses: 'css', pattern: 'min-height:\\s*44px', hidden: true },
          { lint: 'css' },
        ],
        hints: ['Mobile-first: the rules outside the media query describe the PHONE. The media query adds what a wide screen changes.', 'Hidden by default: `.site-nav { display: none; }`. Shown when open: `.site-nav.open { display: block; }` (no space between the two class names, because both are on the same element).', '```\n@media (min-width: 700px) {\n  .menu-btn {\n    display: none;\n  }\n  .site-nav {\n    display: block;\n  }\n}\n```'],
      },
      {
        id: 'w46-close',
        title: 'Close it at the right moment',
        prompt: 'The button opens and closes the menu already. Add the two other ways to close it:\n\n1. Tapping any link inside `#site-nav` closes the menu.\n2. Pressing the **Escape** key closes the menu.\n\nWrite one `closeMenu()` function that removes the class `open` and sets `aria-expanded` to `"false"`, and call it from both places.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(NAV_HTML, { css: true, js: true }), css: NAV_CSS, js: NAV_JS_TOGGLE + '\n// Add closeMenu() and the two listeners below.\n' },
        solution: { html: page(NAV_HTML, { css: true, js: true }), css: NAV_CSS, js: NAV_JS_FULL },
        checks: [
          { do: 'click', target: '#menu-btn' },
          { attr: '#site-nav', name: 'class', contains: 'open', label: 'The button still opens the menu' },
          { do: 'click', target: '#site-nav a[href="#about"]' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'Tapping a link closes the menu' },
          { attr: '#site-nav', name: 'class', matches: '^((?!open).)*$', label: 'The class open is removed after a link' },
          { do: 'click', target: '#menu-btn' },
          { do: 'key', target: '#menu-btn', value: 'Escape' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'Escape closes the menu' },
          { uses: 'js', pattern: 'function\\s+closeMenu', label: 'You wrote a closeMenu function', hidden: true },
        ],
        hints: ['Write `function closeMenu() { ... }` once. Inside: remove the class and set the attribute to the text `"false"`.', 'For the links, listen on the whole nav: `nav.addEventListener("click", (event) => { ... })` and test `event.target.closest("a")`. For Escape, listen on `document` for `keydown` and check `event.key === "Escape"`.', '```\ndocument.addEventListener("keydown", (event) => {\n  if (event.key === "Escape") {\n    closeMenu();\n  }\n});\n```'],
      },
    ],
  },

  // ================================================================== w47
  {
    id: 'w47-forms-that-send',
    level: 'Level 6: Launch-ready for any company',
    title: 'Forms that really send',
    summary: 'Make a contact or booking form deliver messages to a real inbox without writing a server: form services, spam traps, loading, success and error states.',
    minutes: 32,
    blocks: [
      {
        t: 'story',
        title: 'The bookings that vanished',
        text: 'Kato\'s boda delivery site has a lovely booking form. Customers fill it in and press **Book a ride**. The page says \"Thank you\". But Kato\'s phone stays quiet. For two weeks, nobody got a message, and a customer waited an hour at a bus stop.\n\nA form on its own only **collects** information. Something must **receive** it. A normal website hosted for free (like GitHub Pages) has no server of its own. So how does a booking reach Kato? In this lesson you learn the real options, and how to build the part that runs in the visitor\'s browser: sending, waiting, success and failure.',
      },
      { t: 'analogy', text: 'A form is a paper booking slip. The `action` is the **address on the envelope**, the `method` is **how you post it** (`post` means \"inside the envelope\", `get` means \"written on the outside where everyone can read it\"), and every field\'s `name` is the **label of each line** on the slip. A line with no label (no `name`) is thrown away before posting.' },
      { t: 'h', text: 'Four real ways to receive a form' },
      {
        t: 'list',
        items: [
          '**A form service** (for example Formspree, Getform or Netlify Forms). You point the form\'s `action` at the service\'s address; it receives the data and emails it to you. No server to write. Free plans have limits, and companies and prices change, so read the current terms before you promise a client anything.',
          '**WhatsApp or email links** (`https://wa.me/...`, `mailto:...`). The visitor\'s own app opens with the message ready. Very reliable in Uganda, but the visitor must press send, and you get no record in a database.',
          '**Your own server** (Node, PHP, Python): the most control, and the subject of a later track. It can save to a database and send a Mobile Money request.',
          '**Embedding a Google Form.** Quick and free, but it looks different from your site.',
        ],
      },
      { t: 'h', text: 'Step 1: a form that is ready to post' },
      {
        t: 'list',
        items: [
          '`action` is the address that receives the data, and `method="post"` sends it inside the request, not in the address bar.',
          'Every field you want to receive needs a `name`. The `name` becomes the key: `name="phone"` arrives as `phone`.',
          'Every field has a `<label for="...">` (Lesson 4, and accessibility in Lesson 32).',
          'A **honeypot**: an extra text field that real people never see or fill, but spam robots do. If it arrives filled, ignore the message. Hide it from sight with CSS, keep it out of the Tab order (`tabindex="-1"`) and out of screen readers (`aria-hidden="true"`), and turn off autofill (`autocomplete="off"`).',
        ],
      },
      {
        t: 'web',
        title: 'A booking form that is ready for a form service. Look at the name attributes and the hidden trap field.',
        files: ['html', 'css'],
        assets: ASSETS,
        starter: {
          html: page('<h1>Book a ride with Kato</h1>\n<form action="https://formspree.io/f/your-form-id" method="post">\n  <label for="name">Your name</label>\n  <input id="name" name="name" type="text" required>\n\n  <label for="phone">Phone number</label>\n  <input id="phone" name="phone" type="tel" required>\n\n  <input class="trap" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">\n  <button type="submit">Book a ride</button>\n</form>', { css: true }),
          css: 'form { max-width: 360px; }\nlabel { display: block; margin-top: 12px; }\ninput { width: 100%; padding: 10px; box-sizing: border-box; }\n.trap {\n  position: absolute;\n  left: -9999px;\n}\nbutton { margin-top: 16px; padding: 12px 20px; }\n',
        },
        checks: [
          { attr: 'form', name: 'action', matches: '^https://' },
          { attr: 'form', name: 'method', equals: 'post' },
          { count: 'input[name]', min: 3 },
          { exists: 'input[name="_gotcha"][tabindex="-1"]' },
          { count: 'label[for]', min: 2, label: 'Every visible field has a label' },
        ],
      },
      { t: 'tip', text: 'The id in a form-service address (like `/f/your-form-id`) is public by design: anyone can read it in your page. That is fine, because it can only be used to SEND a form to you. Never put a secret that can READ your data, or spend money, in front-end code (Lesson 33).' },
      { t: 'h', text: 'Step 2: send without reloading the page' },
      { t: 'p', text: 'A plain form reloads the browser and shows the service\'s own page. For a professional result, catch the `submit` event, send the data yourself with `fetch`, and show your own message. This is the `fetch` and `FormData` pattern, with the three states every network request needs: **sending**, **success** and **error**.' },
      {
        t: 'web',
        title: 'Fill in the form and press Book a ride. The pretend server answers instantly with success.',
        files: ['js'],
        assets: ASSETS,
        api: { '/api/booking': { ok: true } },
        starter: {
          html: page(BOOKING_FORM, { css: true, js: true }),
          css: 'form { max-width: 360px; }\nlabel { display: block; margin-top: 12px; }\ninput { width: 100%; padding: 10px; box-sizing: border-box; }\n.trap { position: absolute; left: -9999px; }\nbutton { margin-top: 16px; padding: 12px 20px; }\n',
          js: SEND_JS,
        },
        checks: [
          ...FILL_AND_SEND,
          { text: '#status', contains: 'Thank you, Amina' },
          { field: '#name', equals: '', label: 'The form is cleared after success' },
        ],
      },
      {
        t: 'list',
        items: [
          '`event.preventDefault()` stops the browser from reloading the page.',
          '`new FormData(form)` collects every field that has a `name`. `Object.fromEntries(...)` turns it into a normal object, and `JSON.stringify` makes it text to send.',
          '**Disable the button** while sending (`button.disabled = true`) so an impatient visitor cannot send the same booking three times. Turn it back on in `finally`, which runs after success AND after an error.',
          '`fetch` does NOT throw an error for a 404 or 500 answer. Check `response.ok` yourself and `throw` when it is false (Lesson 30).',
          'On error, tell the visitor what to do next, for example a phone number to call. Never leave them guessing.',
        ],
      },
      {
        t: 'see',
        files: { html: page(BOOKING_FORM.replace('/api/booking', '/api/missing'), { css: true, js: true }), css: '.trap { position: absolute; left: -9999px; }\n', js: SEND_JS },
        api: { '/api/booking': { ok: true } },
        question: 'This form sends to `/api/missing`, an address the pretend server does not know (it answers 404). After the visitor fills in the form and presses the button, what does the page say?',
        options: ['Sorry, that did not send. Please call 0700 123 456.', 'Thank you, Amina! Kato will call you soon.', 'Sending... for ever', 'Nothing at all'],
        answer: 0,
        explain: '`fetch` itself succeeds (the server answered), but the answer was 404, so `response.ok` is false and the code throws. The `catch` block shows the helpful message, and `finally` turns the button back on so the visitor can try again.',
        proof: [...FILL_AND_SEND, { text: '#status', contains: 'Sorry, that did not send' }],
      },
      { t: 'h', text: 'Spam, privacy and trust' },
      {
        t: 'list',
        items: [
          'Public forms attract robots. A honeypot, the form service\'s own spam filter, and (for busy sites) a CAPTCHA such as Cloudflare Turnstile or Google reCAPTCHA keep the inbox usable.',
          'Ask only for what you need. A boda booking needs a name, a phone number and a pickup place, not a birth date.',
          'Say what you will do with the data, next to the button, and link your privacy policy (Lesson 49).',
          'The browser checks (`required`, `type="tel"`) are a convenience. They are not security, because anyone can skip them. The receiving side must validate again.',
        ],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<input id="phone" type="tel">', why: 'The field has no `name`, so the browser leaves it out of the data that is sent. The form arrives without a phone number.', right: '<input id="phone" name="phone" type="tel">', logic: true },
          { lang: 'html', wrong: '<form action="https://formspree.io/f/your-form-id">\n  <input name="phone" type="tel">\n</form>', why: 'Without `method="post"` the form uses `get`, which writes the phone number into the web address, where it is logged and shown in history. Always use `post` for forms that send personal details.', right: '<form action="https://formspree.io/f/your-form-id" method="post">\n  <input name="phone" type="tel">\n</form>', logic: true },
          { lang: 'dom', wrong: 'form.addEventListener("submit", async () => {\n  const response = await fetch(url, { method: "POST", body });\n  status.textContent = "Thank you!";\n});', why: 'Two bugs. There is no `event.preventDefault()`, so the page reloads and the message vanishes. And the message appears even when the server answered with an error. Check `response.ok`.', right: 'form.addEventListener("submit", async (event) => {\n  event.preventDefault();\n  const response = await fetch(url, { method: "POST", body });\n  if (!response.ok) throw new Error("Failed");\n  status.textContent = "Thank you!";\n});' },
          { lang: 'dom', wrong: 'button.disabled = true;\nawait send();\nbutton.disabled = false;', why: 'If `send()` throws an error, the last line never runs and the button stays disabled for ever, so the visitor cannot try again. Put the re-enable step in `finally`.', right: 'button.disabled = true;\ntry {\n  await send();\n} finally {\n  button.disabled = false;\n}' },
        ],
      },
      {
        t: 'quiz',
        question: 'A visitor fills the form but the owner receives an email with an empty phone number. What is the most likely cause?',
        options: ['The phone input has no `name` attribute', 'The phone is too long', 'The browser is too old', 'The form has too many labels'],
        answer: 0,
        explain: 'Only fields with a `name` are sent. The `id` is for labels and JavaScript; the `name` is the key in the data.',
      },
      {
        t: 'quiz',
        question: 'Why do we re-enable the Send button inside `finally`?',
        options: ['It runs after success AND after an error, so the button can never stay stuck', 'It runs only when the server fails', 'It makes the request faster', 'It hides the form'],
        answer: 0,
        explain: '`finally` always runs. If the re-enable line lived only after `await send()`, an error would skip it.',
      },
      { t: 'recap', items: ['A form only collects. Something must receive it: a form service, a WhatsApp or email link, or your own server.', 'A postable form has `action`, `method="post"`, a `name` on every field you want, and labels.', 'A honeypot (a hidden extra field) catches robots. If it arrives filled, ignore the message.', 'Send with `fetch` and `FormData` after `event.preventDefault()`, and always show three states: sending, success, error.', 'Check `response.ok` yourself. Disable the button while sending and re-enable it in `finally`.', 'Ask only for what you need, say what you will do with it, and re-check on the server because browser checks are not security.'] },
    ],
    exercises: [
      {
        id: 'w47-form-markup',
        title: 'A form that is ready to post',
        prompt: 'Complete the booking form so a form service can receive it:\n\n- The `<form>` posts to `https://formspree.io/f/kato-rides` with `method="post"`.\n- Give the three inputs the names `name`, `phone` and `pickup` (keep their ids).\n- Add a honeypot: a text input named `_gotcha` with `tabindex="-1"`, `autocomplete="off"` and `aria-hidden="true"`, and give it the class `trap`.',
        files: ['html'],
        assets: ASSETS,
        starter: {
          html: page('<h1>Book a ride with Kato</h1>\n<form>\n  <label for="name">Your name</label>\n  <input id="name" type="text" required>\n\n  <label for="phone">Phone number</label>\n  <input id="phone" type="tel" required>\n\n  <label for="pickup">Pickup place</label>\n  <input id="pickup" type="text">\n\n  <button type="submit">Book a ride</button>\n</form>', { css: true }),
          css: '.trap { position: absolute; left: -9999px; }\n',
        },
        solution: {
          html: page('<h1>Book a ride with Kato</h1>\n<form action="https://formspree.io/f/kato-rides" method="post">\n  <label for="name">Your name</label>\n  <input id="name" name="name" type="text" required>\n\n  <label for="phone">Phone number</label>\n  <input id="phone" name="phone" type="tel" required>\n\n  <label for="pickup">Pickup place</label>\n  <input id="pickup" name="pickup" type="text">\n\n  <input class="trap" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">\n  <button type="submit">Book a ride</button>\n</form>', { css: true }),
          css: '.trap { position: absolute; left: -9999px; }\n',
        },
        checks: [
          { attr: 'form', name: 'action', equals: 'https://formspree.io/f/kato-rides' },
          { attr: 'form', name: 'method', equals: 'post' },
          { exists: 'input#name[name="name"]', label: 'The name field is named' },
          { exists: 'input#phone[name="phone"]', label: 'The phone field is named' },
          { exists: 'input#pickup[name="pickup"]', label: 'The pickup field is named' },
          { exists: 'input.trap[name="_gotcha"][tabindex="-1"][autocomplete="off"]', label: 'The honeypot is in place' },
          { attr: 'input[name="_gotcha"]', name: 'aria-hidden', equals: 'true' },
          { count: 'label[for]', min: 3, label: 'Every visible field has a label' },
          { lint: 'html' },
        ],
        hints: ['The address and the way of posting both go on the opening `<form ...>` tag.', 'Every input needs `name="..."` as well as its `id`. The name is what the receiver sees.', '```\n<input class="trap" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">\n```'],
      },
      {
        id: 'w47-send',
        title: 'Send the booking',
        prompt: 'The form has `data-endpoint="/api/booking"`. Write the submit handler:\n\n1. Stop the page from reloading.\n2. Disable the button and show `Sending...` in `#status`.\n3. `POST` the form data as JSON (`Object.fromEntries(new FormData(form))` and `JSON.stringify`) to the endpoint.\n4. When the answer is ok, read the JSON and show `Thank you, NAME!` using `data.received.name`, then clear the form with `form.reset()`.\n5. Always turn the button back on at the end.',
        files: ['js'],
        assets: ASSETS,
        api: { '/api/booking': { ok: true } },
        starter: { html: page(BOOKING_FORM, { css: true, js: true }), css: '.trap { position: absolute; left: -9999px; }\n', js: 'const form = document.querySelector("#booking");\nconst status = document.querySelector("#status");\nconst button = form.querySelector("button");\n\n// Handle the submit event here.\n' },
        solution: {
          html: page(BOOKING_FORM, { css: true, js: true }),
          css: '.trap { position: absolute; left: -9999px; }\n',
          js: 'const form = document.querySelector("#booking");\nconst status = document.querySelector("#status");\nconst button = form.querySelector("button");\n\nform.addEventListener("submit", async (event) => {\n  event.preventDefault();\n  button.disabled = true;\n  status.textContent = "Sending...";\n  try {\n    const response = await fetch(form.dataset.endpoint, {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify(Object.fromEntries(new FormData(form))),\n    });\n    if (!response.ok) {\n      throw new Error("Failed");\n    }\n    const data = await response.json();\n    status.textContent = "Thank you, " + data.received.name + "!";\n    form.reset();\n  } finally {\n    button.disabled = false;\n  }\n});\n',
        },
        checks: [
          ...FILL_AND_SEND,
          { text: '#status', equals: 'Thank you, Amina!', label: 'The success message uses the name the server received' },
          { field: '#name', equals: '', label: 'The form is cleared' },
          { js: 'document.querySelector("#booking button").disabled', equals: false, label: 'The button is enabled again' },
          { noErrors: true },
        ],
        hints: ['Use an `async` function for the `submit` listener, so you can `await` the `fetch`. Call `event.preventDefault()` first.', 'The server answers with `{ ok: true, received: ... }`, where `received` is the data you sent. So after `const data = await response.json();` the name is `data.received.name`.', '```\nconst response = await fetch(form.dataset.endpoint, {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(Object.fromEntries(new FormData(form))),\n});\n```'],
      },
      {
        id: 'w47-errors',
        title: 'When the server says no',
        prompt: 'This form sends to `/api/missing`, which answers 404. Right now the page says `Thank you` anyway. Fix the handler so that:\n\n- A bad answer (`response.ok` is false) is treated as an error.\n- The visitor sees `Sorry, that did not send. Please call 0700 123 456.`\n- The button is enabled again, so they can try once more.',
        files: ['js'],
        assets: ASSETS,
        api: { '/api/booking': { ok: true } },
        starter: {
          html: page(BOOKING_FORM.replace('/api/booking', '/api/missing'), { css: true, js: true }),
          css: '.trap { position: absolute; left: -9999px; }\n',
          js: 'const form = document.querySelector("#booking");\nconst status = document.querySelector("#status");\nconst button = form.querySelector("button");\n\nform.addEventListener("submit", async (event) => {\n  event.preventDefault();\n  button.disabled = true;\n  status.textContent = "Sending...";\n  const response = await fetch(form.dataset.endpoint, {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(Object.fromEntries(new FormData(form))),\n  });\n  status.textContent = "Thank you!";\n  button.disabled = false;\n});\n',
        },
        solution: {
          html: page(BOOKING_FORM.replace('/api/booking', '/api/missing'), { css: true, js: true }),
          css: '.trap { position: absolute; left: -9999px; }\n',
          js: 'const form = document.querySelector("#booking");\nconst status = document.querySelector("#status");\nconst button = form.querySelector("button");\n\nform.addEventListener("submit", async (event) => {\n  event.preventDefault();\n  button.disabled = true;\n  status.textContent = "Sending...";\n  try {\n    const response = await fetch(form.dataset.endpoint, {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify(Object.fromEntries(new FormData(form))),\n    });\n    if (!response.ok) {\n      throw new Error("The server said " + response.status);\n    }\n    status.textContent = "Thank you!";\n  } catch (error) {\n    status.textContent = "Sorry, that did not send. Please call 0700 123 456.";\n  } finally {\n    button.disabled = false;\n  }\n});\n',
        },
        checks: [
          ...FILL_AND_SEND,
          { text: '#status', equals: 'Sorry, that did not send. Please call 0700 123 456.', label: 'The visitor sees the helpful error message' },
          { js: 'document.querySelector("#booking button").disabled', equals: false, label: 'The button works again' },
          { uses: 'js', pattern: 'response\\.ok', label: 'The code checks response.ok' },
          { noErrors: true },
        ],
        hints: ['`fetch` does not throw for a 404. After the `await fetch(...)`, test `response.ok` yourself and `throw new Error(...)` when it is false.', 'Wrap the sending code in `try { ... } catch (error) { ... } finally { ... }`. The error message goes in `catch`.', '```\n} catch (error) {\n  status.textContent = "Sorry, that did not send. Please call 0700 123 456.";\n} finally {\n  button.disabled = false;\n}\n```'],
      },
      {
        id: 'w47-honeypot',
        title: 'Catch the robots',
        prompt: 'Robots fill in every field, including the hidden trap field `_gotcha`. In the submit handler, after `event.preventDefault()`, check `form.elements._gotcha.value`. When the trap field has text, **do nothing**: do not send, and leave `#status` empty. Real visitors (the trap is empty) must still get `Thank you, NAME!`.',
        files: ['js'],
        assets: ASSETS,
        api: { '/api/booking': { ok: true } },
        starter: {
          html: page(BOOKING_FORM, { css: true, js: true }),
          css: '.trap { position: absolute; left: -9999px; }\n',
          js: 'const form = document.querySelector("#booking");\nconst status = document.querySelector("#status");\n\nform.addEventListener("submit", async (event) => {\n  event.preventDefault();\n  status.textContent = "Sending...";\n  const response = await fetch(form.dataset.endpoint, {\n    method: "POST",\n    body: JSON.stringify(Object.fromEntries(new FormData(form))),\n  });\n  const data = await response.json();\n  status.textContent = "Thank you, " + data.received.name + "!";\n});\n',
        },
        solution: {
          html: page(BOOKING_FORM, { css: true, js: true }),
          css: '.trap { position: absolute; left: -9999px; }\n',
          js: 'const form = document.querySelector("#booking");\nconst status = document.querySelector("#status");\n\nform.addEventListener("submit", async (event) => {\n  event.preventDefault();\n  if (form.elements._gotcha.value) {\n    return;\n  }\n  status.textContent = "Sending...";\n  const response = await fetch(form.dataset.endpoint, {\n    method: "POST",\n    body: JSON.stringify(Object.fromEntries(new FormData(form))),\n  });\n  const data = await response.json();\n  status.textContent = "Thank you, " + data.received.name + "!";\n});\n',
        },
        checks: [
          { do: 'type', target: '#name', value: 'Robot' },
          { do: 'type', target: '[name="_gotcha"]', value: 'buy cheap watches' },
          { do: 'submit', target: '#booking', ms: 80 },
          { text: '#status', equals: '', label: 'A filled trap field is ignored: nothing is sent' },
          { do: 'type', target: '[name="_gotcha"]', value: '' },
          { do: 'type', target: '#name', value: 'Amina' },
          { do: 'submit', target: '#booking', ms: 80 },
          { text: '#status', equals: 'Thank you, Amina!', label: 'A real visitor still gets through' },
        ],
        hints: ['The trap is an input named `_gotcha`, so its text is at `form.elements._gotcha.value`. An empty string counts as false.', 'Put the check right after `event.preventDefault()`: `if (form.elements._gotcha.value) { return; }` stops the handler before anything is sent.', '```\nevent.preventDefault();\nif (form.elements._gotcha.value) {\n  return;\n}\n```'],
      },
    ],
  },

  // ================================================================== w48
  {
    id: 'w48-domains-hosting-seo-files',
    level: 'Level 6: Launch-ready for any company',
    title: 'Domains, hosting and the files search engines read',
    summary: 'How a web address finds your site (DNS), how to choose hosting, and the small files and tags that help Google and visitors: robots.txt, sitemap.xml, canonical, 404 and redirects.',
    minutes: 32,
    blocks: [
      {
        t: 'story',
        title: 'Kato wants a real address',
        text: 'Kato\'s site is live at a long address ending in `github.io`. A big customer, a supermarket, says: \"Give us your website address for the delivery contract.\" Kato is embarrassed to read it out. He also notices two problems: Google shows his old Facebook page above his new site, and when a friend mistypes the address, the page shown is a plain grey error with no way back.\n\nProfessional sites have their own name (`katorides.co.ug`), tell Google exactly which pages exist, and show a helpful page when something is missing. None of this needs advanced code. It needs understanding a few moving parts, and a handful of small text files.',
      },
      { t: 'analogy', text: 'A website is a shop. The **domain name** is the **name on the sign** that people remember. **Hosting** is the **building and land** where the shop stands. **DNS** is the **map that tells a visitor\'s phone which building the sign belongs to**. **HTTPS** is the **lock and ID badge**, proof that the shop is the real one and nobody can read what customers hand over.' },
      { t: 'h', text: 'Four moving parts' },
      {
        t: 'list',
        items: [
          '**Domain name**: you RENT it, usually per year, from a **registrar**. Names ending in `.ug` and `.co.ug` are sold through local registrars; prices and rules change, so compare two or three before you buy. You rent it in the client\'s name or hand it over properly (Lesson 36).',
          '**Hosting**: the computer that serves your files. For static sites, free hosts such as GitHub Pages, Netlify, Cloudflare Pages and Vercel are good enough for many small businesses. Check each one\'s current free limits.',
          '**DNS (Domain Name System)**: a table of **records** that says what each name points to. You edit the records at your registrar or DNS provider.',
          '**HTTPS**: a certificate that most hosts give you free and renew automatically. Turn it on and tick \"enforce HTTPS\". Never ship a business site on plain `http`.',
        ],
      },
      { t: 'h', text: 'DNS records you will actually use' },
      {
        t: 'list',
        items: [
          '`A` record: a name points to an IP address (like `kato.co.ug` to `185.199.108.153`).',
          '`CNAME` record: a name is an **alias** of another name (`www.kato.co.ug` is an alias of `katorides.github.io`).',
          '`TXT` record: a piece of text, used to prove you own the domain (to Google Search Console) and to protect your email.',
          '`MX` record: where email for the domain goes. Business email (`info@katorides.co.ug`) is a separate service, not part of the website host.',
        ],
      },
      { t: 'p', text: 'A phone that wants `www.katorides.co.ug` looks up the name and may be sent along a **chain** of aliases before it reaches an address. Here is a pretend DNS table, and a function that follows the chain. Trace it yourself before you run it:' },
      {
        t: 'predict',
        code: 'const table = {\n  "www.katorides.co.ug": { type: "CNAME", value: "katorides.github.io" },\n  "katorides.github.io": { type: "A", value: "185.199.108.153" },\n};\n\nfunction lookup(name) {\n  let current = name;\n  while (table[current] && table[current].type === "CNAME") {\n    current = table[current].value;\n  }\n  return table[current] ? table[current].value : "not found";\n}\n\nconsole.log(lookup("www.katorides.co.ug"));\nconsole.log(lookup("shop.katorides.co.ug"));',
        question: 'What does this print?',
        options: ['185.199.108.153\nnot found', 'katorides.github.io\nnot found', '185.199.108.153\n185.199.108.153', 'not found\nnot found'],
        answer: 0,
        explain: 'The first name is an alias (CNAME) of `katorides.github.io`, which is an A record holding the address. The second name is not in the table at all.',
      },
      { t: 'h', text: 'The files and tags search engines read' },
      {
        t: 'list',
        items: [
          '`robots.txt` sits at the top of the site (`/robots.txt`). It tells search robots what they may visit and where your sitemap is. It is a request, not a lock.',
          '`sitemap.xml` is a list of every page you want found. You submit it in **Google Search Console**, a free tool that also shows how your site appears in search and reports problems.',
          '`<link rel="canonical" href="...">` in the `<head>` says \"this is the official address of this page\", which avoids duplicate-page confusion (for example with and without `www`).',
          '`<meta name="robots" content="noindex">` asks search engines NOT to list a page, for example a thank-you page after a booking.',
          'A `404.html` page: shown when an address does not exist. It should explain, and link back to the home page and the main sections.',
          'Redirects: when you move a page, send the old address to the new one (a **301** means \"moved for good\"). Hosts differ in how: Netlify reads a `_redirects` file, others use settings or a small HTML page.',
        ],
      },
      {
        t: 'code',
        text: 'User-agent: *\nAllow: /\nDisallow: /thank-you.html\n\nSitemap: https://katorides.co.ug/sitemap.xml',
      },
      {
        t: 'code',
        text: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://katorides.co.ug/</loc></url>\n  <url><loc>https://katorides.co.ug/prices.html</loc></url>\n  <url><loc>https://katorides.co.ug/contact.html</loc></url>\n</urlset>',
      },
      {
        t: 'web',
        title: 'The head of a page search engines understand. The canonical link names the official address.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<h1>Prices</h1>\n<p>Parcels in Kampala from UGX 5,000.</p>', { head: '\n  <meta name="description" content="Boda parcel delivery prices in Kampala.">\n  <link rel="canonical" href="https://katorides.co.ug/prices.html">' }) },
        checks: [{ attr: 'link[rel="canonical"]', name: 'href', equals: 'https://katorides.co.ug/prices.html' }, { exists: 'meta[name="description"]' }, { rule: 'title' }, { rule: 'viewport' }],
      },
      {
        t: 'web',
        title: 'A helpful 404 page. It explains, and gives the visitor a way back.',
        files: ['html', 'css'],
        assets: ASSETS,
        starter: {
          html: page('<main class="lost">\n  <h1>Page not found</h1>\n  <p>Sorry, we could not find that page. It may have moved.</p>\n  <p><a class="back" href="/">Go to the home page</a></p>\n  <p><a href="/prices.html">See our prices</a> or <a href="/contact.html">contact Kato</a>.</p>\n</main>', { css: true, title: '404 - Page not found | Kato Rides' }),
          css: 'body { font-family: system-ui, sans-serif; }\n.lost { max-width: 480px; margin: 48px auto; padding: 0 16px; text-align: center; }\n.back { display: inline-block; padding: 12px 20px; background-color: #0b6b4f; color: #ffffff; border-radius: 8px; text-decoration: none; }\n',
        },
        checks: [{ exists: 'a[href="/"]' }, { text: 'h1', contains: 'not found' }, { rule: 'title' }, { count: 'a', min: 2 }],
      },
      {
        t: 'tip',
        text: 'On GitHub Pages, a file named `404.html` at the top of the site is shown automatically for missing pages. Netlify and Cloudflare Pages do the same. Add `Allow: /` in `robots.txt` carefully: `Disallow: /` blocks your WHOLE site from search, and it is a famous way to make a business vanish from Google by accident (it is often left over from the testing stage).',
      },
      { t: 'h', text: 'Launch-day order of work' },
      {
        t: 'list',
        items: [
          'Buy or receive the domain (in the client\'s name). Choose and set up hosting.',
          'Add the DNS records the host asks for. Wait: changes can take from minutes to a day to spread across the world.',
          'Turn on HTTPS and tick \"enforce HTTPS\". Decide on one official address (with or without `www`) and redirect the other to it.',
          'Add `robots.txt`, `sitemap.xml`, canonical tags and a `404.html`. Check no test page is blocked or hidden by mistake.',
          'Verify the site in Google Search Console (a `TXT` record or a meta tag proves you own it), submit the sitemap, and add the business to Google Business Profile (Lesson 33).',
          'Set up business email separately (MX and TXT records), and test it by sending yourself a message.',
        ],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<link rel="canonical" href="prices.html">', why: 'A canonical address must be the FULL official address, including `https://` and the domain. A relative address leaves search engines to guess.', right: '<link rel="canonical" href="https://katorides.co.ug/prices.html">', logic: true },
          { lang: 'html', wrong: '<meta name="robots" content="noindex">', why: 'On a normal page this tells Google to leave it out of search, which hides it from customers. `noindex` belongs on pages like thank-you pages, never on pages you want found. (It is easy to copy it from a testing version and forget.)', right: '<meta name="description" content="Boda parcel delivery prices in Kampala.">', logic: true },
          { lang: 'dom', wrong: 'User-agent: *\nDisallow: /', why: 'This blocks every robot from your whole site. It is correct for a site that is still being built, and a disaster if it is left there after the launch.', right: 'User-agent: *\nAllow: /\nSitemap: https://katorides.co.ug/sitemap.xml' },
          { lang: 'dom', wrong: 'www.katorides.co.ug  CNAME  katorides.co.ug\nkatorides.co.ug      CNAME  katorides.github.io', why: 'The bare domain (called the apex) usually cannot be a `CNAME`, because it also has to carry records like `MX` for email. Use `A` records for the bare domain (your host gives the addresses) and a `CNAME` for `www`.', right: 'katorides.co.ug      A      (the addresses your host gives you)\nwww.katorides.co.ug  CNAME  katorides.github.io' },
        ],
      },
      {
        t: 'quiz',
        question: 'Which record makes `www.katorides.co.ug` an alias of `katorides.github.io`?',
        options: ['CNAME', 'MX', 'TXT', 'robots'],
        answer: 0,
        explain: 'A CNAME says \"this name is another name for that one\". An MX record is for email, a TXT record holds text such as a verification code, and robots.txt is not a DNS record at all.',
      },
      {
        t: 'quiz',
        question: 'You added a thank-you page that appears after each booking. Which tag keeps it out of Google results?',
        options: ['<meta name="robots" content="noindex">', '<link rel="canonical" href="/">', '<meta charset="utf-8">', '<title>Thank you</title>'],
        answer: 0,
        explain: '`noindex` asks search engines not to list the page. Customers should find your prices and contact page, not the page that appears after a booking.',
      },
      { t: 'recap', items: ['A domain is rented from a registrar, hosting serves the files, DNS records connect the name to the host, and HTTPS secures it. Put the domain in the client\'s name.', 'Records you will use: A (name to address), CNAME (alias), TXT (verification and email protection), MX (email).', '`robots.txt` and `sitemap.xml` live at the top of the site and tell search engines what to visit. Never leave `Disallow: /` after launch.', '`canonical` (full official address) and `noindex` (keep a page out of results) are head tags.', 'Add a helpful `404.html` and redirect moved pages (301).', 'Verify the site in Google Search Console and submit the sitemap. Test everything on launch day.'] },
    ],
    exercises: [
      {
        id: 'w48-head-seo',
        title: 'Tags for a page search engines understand',
        prompt: 'This is the booking thank-you page. Add two tags inside `<head>`:\n\n- A canonical link: `<link rel="canonical" href="https://katorides.co.ug/thank-you.html">`\n- A robots tag that keeps the page out of search: `<meta name="robots" content="noindex">`\n\nKeep the page\'s title and description.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<h1>Thank you!</h1>\n<p>Kato will call you soon.</p>', { title: 'Thank you | Kato Rides', head: '\n  <meta name="description" content="Your booking was received.">' }) },
        solution: { html: page('<h1>Thank you!</h1>\n<p>Kato will call you soon.</p>', { title: 'Thank you | Kato Rides', head: '\n  <meta name="description" content="Your booking was received.">\n  <link rel="canonical" href="https://katorides.co.ug/thank-you.html">\n  <meta name="robots" content="noindex">' }) },
        checks: [
          { attr: 'link[rel="canonical"]', name: 'href', equals: 'https://katorides.co.ug/thank-you.html', label: 'The canonical link has the full official address' },
          { attr: 'meta[name="robots"]', name: 'content', equals: 'noindex', label: 'The page is kept out of search' },
          { exists: 'meta[name="description"]', label: 'The description is still there' },
          { rule: 'title' },
          { lint: 'html' },
        ],
        hints: ['Both tags belong inside `<head>`, before `</head>`. Neither has a closing tag.', 'The canonical link is `<link rel="canonical" href="...">` with the full address, including `https://`.', '```\n<link rel="canonical" href="https://katorides.co.ug/thank-you.html">\n<meta name="robots" content="noindex">\n```'],
      },
      {
        id: 'w48-resolve',
        title: 'Follow the DNS chain',
        prompt: 'Write `resolve(name, table)`. `table` maps names to records like `{ type: "CNAME", value: "other.name" }` or `{ type: "A", value: "185.199.108.153" }`.\n\n- Follow `CNAME` records until you reach a record of another type, and return that record\'s `value`.\n- If a name is not in the table, return `"not found"`.\n- Stop after 5 steps and return `"loop"`, in case two names point at each other.',
        files: ['js'],
        starter: { js: '// Write resolve(name, table)\n' },
        solution: { js: RESOLVE_SOLUTION },
        checks: [
          { js: 'resolve("a.com", { "a.com": { type: "A", value: "1.2.3.4" } })', equals: '1.2.3.4' },
          { js: 'resolve("www.a.com", { "www.a.com": { type: "CNAME", value: "a.com" }, "a.com": { type: "A", value: "1.2.3.4" } })', equals: '1.2.3.4', label: 'It follows one alias' },
          { js: 'resolve("x.a.com", { "x.a.com": { type: "CNAME", value: "y.a.com" }, "y.a.com": { type: "CNAME", value: "a.com" }, "a.com": { type: "A", value: "9.9.9.9" } })', equals: '9.9.9.9', label: 'It follows a chain of aliases' },
          { js: 'resolve("nothing.com", {})', equals: 'not found', label: 'An unknown name is not found' },
          { js: 'resolve("www.a.com", { "www.a.com": { type: "CNAME", value: "gone.com" } })', equals: 'not found', label: 'An alias to nowhere is not found' },
          { js: 'resolve("a", { a: { type: "CNAME", value: "b" }, b: { type: "CNAME", value: "a" } })', equals: 'loop', label: 'Two aliases pointing at each other give "loop"', hidden: true },
        ],
        hints: ['Keep a variable `current` that starts as `name`. Look up `table[current]` in a loop that runs at most 5 times.', 'Inside the loop: no record means `return "not found"`; a record whose `type` is not `"CNAME"` means `return record.value`; otherwise set `current = record.value` and go round again.', '```\nfor (let hops = 0; hops < 5; hops++) {\n  const record = table[current];\n  ...\n}\nreturn "loop";\n```'],
      },
      {
        id: 'w48-sitemap',
        title: 'Generate the sitemap',
        prompt: 'Write `buildSitemap(base, paths)`. It returns the text of a `sitemap.xml`:\n\n- first line: `<?xml version="1.0" encoding="UTF-8"?>`\n- then `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`\n- one line `  <url><loc>BASE+PATH</loc></url>` for each path\n- last line `</urlset>`\n\nJoin the lines with a new line. In an address, an `&` must be written `&amp;` in XML.',
        files: ['js'],
        starter: { js: '// Write buildSitemap(base, paths)\n' },
        solution: { js: SITEMAP_SOLUTION },
        checks: [
          { js: 'buildSitemap("https://katorides.co.ug", ["/", "/prices.html"]).split("\\n").length', equals: 5, label: 'Two pages make five lines' },
          { js: 'buildSitemap("https://katorides.co.ug", ["/about"]).includes("<url><loc>https://katorides.co.ug/about</loc></url>")', equals: true, label: 'Each page gets a url and loc tag' },
          { js: 'buildSitemap("https://a.co.ug", []).split("\\n")[0]', equals: '<?xml version="1.0" encoding="UTF-8"?>', label: 'It starts with the XML line' },
          { js: 'buildSitemap("https://a.co.ug", []).endsWith("</urlset>")', equals: true, label: 'It ends with the closing urlset tag' },
          { js: 'buildSitemap("https://a.co.ug", []).includes("http://www.sitemaps.org/schemas/sitemap/0.9")', equals: true },
          { js: 'buildSitemap("https://a.co.ug", ["/p?a=1&b=2"]).includes("/p?a=1&amp;b=2")', equals: true, label: 'An ampersand is written as &amp;', hidden: true },
        ],
        hints: ['Build an array `lines` that starts with the two header lines. Add one line per path with a loop, then add the closing tag.', 'One line looks like `"  <url><loc>" + base + path + "</loc></url>"`. Finish with `lines.join("\\n")`.', 'For the ampersand use `.replace(/&/g, "&amp;")` on the address before you put it between the tags.'],
      },
      {
        id: 'w48-404-page',
        title: 'A 404 page that helps',
        prompt: 'Build a friendly error page for `404.html`:\n\n- A `<title>` that starts with `404` and an `<h1>` that says `Page not found`.\n- One sentence that explains, and a link back to the home page (`href="/"`).\n- At least two more links that help the visitor: to `/prices.html` and `/contact.html`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<h1>Error</h1>', { title: 'Error' }) },
        solution: { html: page('<main>\n  <h1>Page not found</h1>\n  <p>Sorry, we could not find that page. It may have moved.</p>\n  <p><a href="/">Go to the home page</a></p>\n  <p><a href="/prices.html">See our prices</a> or <a href="/contact.html">contact Kato</a>.</p>\n</main>', { title: '404 - Page not found | Kato Rides' }) },
        checks: [
          { text: 'h1', equals: 'Page not found' },
          { js: 'document.title.indexOf("404") === 0', equals: true, label: 'The title starts with 404' },
          { exists: 'a[href="/"]', label: 'A link goes back to the home page' },
          { exists: 'a[href="/prices.html"]' },
          { exists: 'a[href="/contact.html"]' },
          { rule: 'one-h1' },
          { rule: 'link-text' },
        ],
        hints: ['Change the title in `<head>` and the `<h1>` text. Both matter: the title appears in the browser tab and in history.', 'A link back is `<a href="/">Go to the home page</a>`. The address `/` means the top of the site.', '```\n<p><a href="/prices.html">See our prices</a> or <a href="/contact.html">contact Kato</a>.</p>\n```'],
      },
    ],
  },
];
