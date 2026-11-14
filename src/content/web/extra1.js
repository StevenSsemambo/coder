// Web track, additions: concepts the first 36 lessons did not cover.
// Written after a coverage audit (media and embeds, smarter inputs, modern CSS functions, fixed positioning).
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

const P = (body) => fullPage(body, { css: true });

export const extra1Lessons = [
  // ------------------------------------------------------------------------------------------------
  {
    id: 'w37-media-embeds-inputs',
    level: 'Level 1: Your first web page',
    title: 'Video, maps and smarter inputs',
    summary: 'Video and audio, embedded maps, responsive images, and date, slider and suggestion inputs.',
    minutes: 24,
    blocks: [
      {
        t: 'story',
        title: 'The video, the map and the catering form',
        text: 'Rose\'s cousin films a 20-second video of the rolex being made. A church group wants to **order catering for 50 people**: they need a date, a time, and a way to say how spicy. And everyone asks, "where exactly is your stand?"\n\nSo the page needs **video**, a **map**, and **inputs that fit the question**: a date picker for dates, a slider for "how spicy". The right tag does most of the work for you, and costs the visitor less data.',
      },
      { t: 'analogy', text: 'Think of the page as a magazine. Text and headings are the articles. A `<video>` or `<iframe>` is a pull-out insert: handy, but it makes the magazine heavier to carry. Good editors add inserts only where they help, and tell the reader what they are (that is what `title`, `poster` and captions do).' },
      {
        t: 'list',
        items: ['`<video controls poster="..." preload="metadata">` with one or more `<source src type>` inside. `controls` shows play and pause, `poster` is the picture before play, `preload="none"` or `"metadata"` stops it from downloading the whole file on page load (**data is money** for your visitors).', '`<track kind="captions" src="en.vtt" srclang="en" label="English">` adds subtitles. Captions help deaf users, people in noisy markets, and people watching without sound.', '`autoplay` is rude and costly. If you must, it needs `muted` and `playsinline`. `<audio controls>` works the same way.', '`<iframe src="..." title="Map to the stand" loading="lazy">` embeds another page, such as a map or a YouTube video. Always give it a `title` so screen readers can describe it.'],
      },
      {
        t: 'web',
        title: 'The video has no file yet, but the poster, controls and captions are all in place',
        files: ['html'],
        assets: ASSETS,
        starter: { html: '<video controls preload="metadata" poster="img/phone-hero.svg" width="320">\n  <source src="rolex.mp4" type="video/mp4">\n  <track kind="captions" src="rolex-en.vtt" srclang="en" label="English">\n  Your browser cannot play this video. <a href="rolex.mp4">Download it</a>.\n</video>' },
        checks: [{ exists: 'video[controls]' }, { exists: 'video source' }, { lint: 'html' }],
      },
      { t: 'h', text: 'Responsive images: the right size for each screen' },
      { t: 'p', text: 'A phone does not need a 2000 pixel wide photo. `srcset` lists several sizes and `sizes` says how wide the image will be shown; the browser picks the smallest file that looks sharp. `<picture>` goes further and lets you swap a different crop for small screens.' },
      {
        t: 'code',
        text: '<img src="rolex-480.jpg"\n     srcset="rolex-480.jpg 480w, rolex-960.jpg 960w, rolex-1600.jpg 1600w"\n     sizes="(min-width: 800px) 50vw, 100vw"\n     alt="A plate of hot rolex" width="480" height="320" loading="lazy">\n\n<picture>\n  <source media="(min-width: 800px)" srcset="hero-wide.jpg">\n  <img src="hero-square.jpg" alt="Mama Rose at the stand">\n</picture>',
      },
      { t: 'h', text: 'Inputs that fit the question' },
      {
        t: 'list',
        items: ['`type="date"`, `"time"`, `"range"` (slider), `"color"`, `"search"`, `"file"` (with `accept="image/*"`) each give the right control and keyboard on a phone.', '`<datalist>` gives suggestions while still allowing free typing: connect it with `list="id"` on the input.', '`inputmode="numeric"` opens the number pad for things like a quantity or code. `autocomplete="name"` or `"tel"` lets the phone fill the box for the customer.', '`min`, `max`, `step` and `required` work on most of them and are checked by the browser.'],
      },
      {
        t: 'web',
        title: 'Drag the slider and open the date picker',
        files: ['html'],
        starter: { html: '<form>\n  <label for="date">Event date</label>\n  <input id="date" name="date" type="date" required>\n\n  <label for="spice">How spicy? (0 to 5)</label>\n  <input id="spice" name="spice" type="range" min="0" max="5" value="2">\n\n  <label for="area">Area</label>\n  <input id="area" name="area" list="areas" autocomplete="off">\n  <datalist id="areas">\n    <option value="Wandegeya"></option>\n    <option value="Makerere"></option>\n    <option value="Mulago"></option>\n  </datalist>\n</form>' },
        checks: [{ rule: 'form-labels' }, { attr: '#area', name: 'list', equals: 'areas' }, { lint: 'html' }],
      },
      {
        t: 'see',
        files: { html: '<label for="spice">How spicy?</label>\n<input id="spice" type="range" min="0" max="10" value="5">' },
        question: 'What does the visitor see?',
        options: ['A slider from 0 to 10 that starts in the middle', 'A box where they can type any text', 'A drop-down with ten items', 'A number box with arrows'],
        answer: 0,
        explain: '`type="range"` draws a slider. `min` and `max` set the ends and `value` sets where it starts: 5 is halfway between 0 and 10.',
        proof: [{ attr: '#spice', name: 'type', equals: 'range' }, { attr: '#spice', name: 'min', equals: '0' }, { attr: '#spice', name: 'max', equals: '10' }, { attr: '#spice', name: 'value', equals: '5' }],
      },
      { t: 'h', text: 'Table footers and merged cells' },
      {
        t: 'web',
        title: 'The last row spans two columns with colspan',
        files: ['html'],
        starter: { html: '<table>\n  <thead>\n    <tr><th>Item</th><th>Price</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Plain rolex x20</td><td>60,000</td></tr>\n    <tr><td>Chicken rolex x30</td><td>210,000</td></tr>\n  </tbody>\n  <tfoot>\n    <tr><th>Total</th><td>270,000</td></tr>\n    <tr><td colspan="2">Deposit of 50% needed to book the date.</td></tr>\n  </tfoot>\n</table>' },
        checks: [{ exists: 'tfoot' }, { attr: 'tfoot td[colspan]', name: 'colspan', equals: '2' }, { lint: 'html' }],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', logic: true, wrong: '<iframe src="https://maps.example.com/rose"></iframe>', why: 'An iframe with no title is announced by screen readers as just "frame". Describe it, and load it lazily so it does not cost data until the visitor scrolls to it.', right: '<iframe src="https://maps.example.com/rose" title="Map to Mama Rose Rolex" loading="lazy"></iframe>' },
          { lang: 'html', logic: true, wrong: '<video src="rolex.mp4" autoplay loop></video>', why: 'It downloads straight away, plays with no way to pause, and eats the visitor\'s data bundle. Use `controls`, a `poster` and `preload="none"`.', right: '<video src="rolex.mp4" controls poster="poster.jpg" preload="none"></video>' },
          { lang: 'html', wrong: '<video controls>\n  <source src="rolex.mp4" type="video/mp4">\n', why: 'The `<video>` was opened and never closed, so everything after it becomes part of the video.', right: '<video controls>\n  <source src="rolex.mp4" type="video/mp4">\n</video>' },
        ],
      },
      { t: 'quiz', question: 'Why is `preload="none"` a good habit on a page with a video?', options: ['The video file is not downloaded until the visitor presses play, which saves their data', 'It makes the video play faster', 'It adds subtitles', 'It lets the video loop'], answer: 0, explain: 'Most visitors never press play. With `preload="none"` they never pay for a video they did not watch.' },
      {
        t: 'web',
        project: true,
        title: 'The catering form',
        text: 'The finished form a church group would use to book Mama Rose for an event.',
        files: ['html'],
        starter: { html: '<form id="catering">\n  <label for="name">Contact name</label>\n  <input id="name" name="name" type="text" autocomplete="name" required>\n  <label for="phone">Phone</label>\n  <input id="phone" name="phone" type="tel" autocomplete="tel" required>\n  <label for="date">Event date</label>\n  <input id="date" name="date" type="date" required>\n  <label for="time">Time</label>\n  <input id="time" name="time" type="time">\n  <label for="guests">Guests</label>\n  <input id="guests" name="guests" type="number" inputmode="numeric" min="10" value="50">\n  <label for="spice">How spicy?</label>\n  <input id="spice" name="spice" type="range" min="0" max="5" value="2">\n  <button type="submit">Request a quote</button>\n</form>' },
        checks: [{ rule: 'form-labels' }, { attr: '#guests', name: 'min', equals: '10' }],
      },
      { t: 'recap', items: ['`<video>` needs `controls`, a `poster` and `preload="none"` or `"metadata"`. Captions use `<track>`.', '`<iframe>` embeds other pages. Give it a `title` and `loading="lazy"`.', '`srcset` and `sizes` (or `<picture>`) deliver the smallest image that looks sharp.', '`date`, `time`, `range`, `file`, `search` and `<datalist>` give the right control for each question.', '`<tfoot>` and `colspan` finish a table. Always think about the visitor\'s data.'], memory: 'Poster, controls, title, lazy: respect the data bundle.' },
    ],
    exercises: [
      {
        id: 'w37-video',
        title: 'Add the cooking video',
        assets: ASSETS,
        prompt: 'Add a video under the heading:\n\n- `controls`, `preload="metadata"` and `width="320"`\n- `poster="img/phone-hero.svg"`\n- a `<source>` with `src="rolex.mp4"` and `type="video/mp4"`\n- a `<track>` of `kind="captions"`, `src="rolex-en.vtt"`, `srclang="en"` and `label="English"`',
        files: ['html'],
        starter: { html: '<h1>Watch us cook</h1>\n<!-- Add the video here -->\n' },
        solution: { html: '<h1>Watch us cook</h1>\n<video controls preload="metadata" poster="img/phone-hero.svg" width="320">\n  <source src="rolex.mp4" type="video/mp4">\n  <track kind="captions" src="rolex-en.vtt" srclang="en" label="English">\n  Your browser cannot play this video.\n</video>\n' },
        checks: [{ exists: 'video[controls]', label: 'The video has controls' }, { attr: 'video', name: 'preload', equals: 'metadata' }, { attr: 'video', name: 'width', equals: '320' }, { attr: 'video', name: 'poster', contains: 'data:image/svg', label: 'The poster is img/phone-hero.svg' }, { attr: 'video source', name: 'src', equals: 'rolex.mp4' }, { attr: 'video source', name: 'type', equals: 'video/mp4' }, { attr: 'video track', name: 'kind', equals: 'captions' }, { attr: 'video track', name: 'srclang', equals: 'en' }, { lint: 'html' }],
        hints: ['A video is `<video> ... </video>` with its attributes in the opening tag and `<source>` and `<track>` inside.', '`<source>` and `<track>` have no closing tag.', '```\n<video controls preload="metadata" poster="img/phone-hero.svg" width="320">\n  <source src="rolex.mp4" type="video/mp4">\n  <track kind="captions" src="rolex-en.vtt" srclang="en" label="English">\n</video>\n```'],
      },
      {
        id: 'w37-map-embed',
        title: 'Embed the map',
        prompt: 'Add an embedded map and make it fit the screen:\n\n- HTML: inside `.map` add an `<iframe>` with `src="https://www.openstreetmap.org/export/embed.html"`, a `title` that describes it, and `loading="lazy"`\n- CSS: `.map iframe` gets `width: 100%`, `aspect-ratio: 16 / 9` and `border: 0`',
        files: ['html', 'css'],
        starter: { html: P('  <h2>Find us</h2>\n  <div class="map">\n    <!-- Add the iframe here -->\n  </div>'), css: '/* Style the map iframe */\n' },
        solution: { html: P('  <h2>Find us</h2>\n  <div class="map">\n    <iframe src="https://www.openstreetmap.org/export/embed.html" title="Map to Mama Rose Rolex in Wandegeya" loading="lazy"></iframe>\n  </div>'), css: '.map iframe {\n  width: 100%;\n  aspect-ratio: 16 / 9;\n  border: 0;\n}\n' },
        checks: [{ exists: '.map iframe', label: 'There is an iframe inside .map' }, { attr: '.map iframe', name: 'src', matches: '^https://www\\.openstreetmap\\.org' }, { attr: '.map iframe', name: 'title', matches: '.{8,}', label: 'The iframe has a descriptive title' }, { attr: '.map iframe', name: 'loading', equals: 'lazy' }, { style: '.map iframe', prop: 'width', is: '100%' }, { uses: 'css', pattern: 'aspect-ratio:\\s*16\\s*/\\s*9', label: 'The map has aspect-ratio: 16 / 9' }, { uses: 'css', pattern: 'border:\\s*0', label: 'The iframe has no border' }, { lint: 'html' }, { lint: 'css' }],
        hints: ['Write the iframe in the HTML tab, then style it in the CSS tab.', 'An iframe needs a closing tag: `<iframe ...></iframe>`.', '```\n<iframe src="https://www.openstreetmap.org/export/embed.html" title="Map to Mama Rose Rolex" loading="lazy"></iframe>\n```'],
      },
      {
        id: 'w37-catering-form',
        title: 'The catering form',
        prompt: 'Build the form with the **right input for each question** (each with a label):\n\n- event date: `type="date"`, `id="date"`, `required`\n- time: `type="time"`, `id="time"`\n- how spicy: `type="range"`, `id="spice"`, `min="0"`, `max="5"`, `value="2"`\n- area: `id="area"` with `list="areas"`, and a `<datalist id="areas">` with **three** options: Wandegeya, Makerere, Mulago\n- guests: `type="number"`, `id="guests"`, `inputmode="numeric"`, `min="10"`',
        files: ['html'],
        starter: { html: '<form id="catering">\n  <!-- Add the fields here -->\n  <button type="submit">Request a quote</button>\n</form>\n' },
        solution: { html: '<form id="catering">\n  <label for="date">Event date</label>\n  <input id="date" name="date" type="date" required>\n  <label for="time">Time</label>\n  <input id="time" name="time" type="time">\n  <label for="spice">How spicy?</label>\n  <input id="spice" name="spice" type="range" min="0" max="5" value="2">\n  <label for="area">Area</label>\n  <input id="area" name="area" list="areas">\n  <datalist id="areas">\n    <option value="Wandegeya"></option>\n    <option value="Makerere"></option>\n    <option value="Mulago"></option>\n  </datalist>\n  <label for="guests">Guests</label>\n  <input id="guests" name="guests" type="number" inputmode="numeric" min="10">\n  <button type="submit">Request a quote</button>\n</form>\n' },
        checks: [{ attr: '#date', name: 'type', equals: 'date' }, { attr: '#date', name: 'required', present: true }, { attr: '#time', name: 'type', equals: 'time' }, { attr: '#spice', name: 'type', equals: 'range' }, { attr: '#spice', name: 'max', equals: '5' }, { attr: '#spice', name: 'value', equals: '2' }, { attr: '#area', name: 'list', equals: 'areas' }, { count: 'datalist#areas option', equals: 3 }, { attr: '#guests', name: 'inputmode', equals: 'numeric' }, { attr: '#guests', name: 'min', equals: '10' }, { rule: 'form-labels' }, { lint: 'html' }],
        hints: ['Each field is a `<label for>` followed by an `<input>` with the right `type`.', 'The `<datalist>` has the id `areas` and its `<option>`s need closing tags.', '```\n<input id="area" name="area" list="areas">\n<datalist id="areas">\n  <option value="Wandegeya"></option>\n</datalist>\n```'],
      },
    ],
  },

  // ------------------------------------------------------------------------------------------------
  {
    id: 'w38-modern-css',
    level: 'Level 2: Make it beautiful',
    title: 'Modern CSS: calc, clamp, fixed and pseudo-elements',
    summary: 'Fluid sizes, a floating WhatsApp button, smooth scrolling and decoration without extra HTML.',
    minutes: 24,
    blocks: [
      {
        t: 'story',
        title: 'The floating WhatsApp button',
        text: 'Mama Rose wants a green **WhatsApp button that floats in the corner** and stays there as people scroll, so nobody has to hunt for it. She also wants the main heading to look right on a tiny phone and on her nephew\'s big monitor **without** writing five media queries, and "UGX" in front of every price **without** typing it forty times.\n\nModern CSS does all three in a few lines.',
      },
      { t: 'analogy', text: 'CSS functions are a stretchy measuring tape. `clamp(min, wanted, max)` is an elastic band with a stop at each end: it stretches with the screen but never gets smaller than the minimum or bigger than the maximum. `calc()` is a calculator that can mix units. `position: fixed` is a sticker on the glass of the screen, not on the page.' },
      {
        t: 'list',
        items: ['`calc(100% - 2rem)` does maths with mixed units. **Spaces around `+` and `-` are required.**', '`min(90%, 40rem)` picks the smaller, `max(1rem, 3vw)` the larger, and `clamp(1.5rem, 4vw + 1rem, 3rem)` keeps a fluid value between two limits. One line replaces several media queries for text and spacing.', '`position: fixed; bottom: 16px; right: 16px;` pins an element to the screen corner. Give it a `z-index` so it sits above content.', '`::before` and `::after` add generated content, usually with `content: "..."`. Great for icons, labels like "UGX", and decoration. They are not selectable and not read reliably by screen readers, so never put essential words in them.', '`scroll-behavior: smooth` on `html` makes anchor links glide, and `scroll-margin-top` on targets keeps them from hiding under a sticky header.'],
      },
      {
        t: 'web',
        title: 'Resize the preview and scroll: the heading flexes, the button stays',
        files: ['css'],
        starter: {
          html: P('  <main class="page">\n    <h1>Mama Rose Rolex</h1>\n    <p class="item">Plain rolex <span class="price">3,000</span></p>\n    <p class="item">Chicken rolex <span class="price">7,000</span></p>\n    <p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p><p>Scroll down.</p>\n  </main>\n  <a class="whatsapp" href="https://wa.me/256700000000">Chat on WhatsApp</a>'),
          css: 'body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n}\n.page {\n  width: min(90%, 40rem);\n  margin: 0 auto;\n}\nh1 {\n  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);\n}\n.price::before {\n  content: "UGX ";\n}\n.whatsapp {\n  position: fixed;\n  bottom: 16px;\n  right: 16px;\n  z-index: 50;\n  background: #25d366;\n  color: #fff;\n  padding: 14px 18px;\n  border-radius: 999px;\n  text-decoration: none;\n  font-weight: 700;\n}\n',
        },
        checks: [{ style: '.whatsapp', prop: 'position', is: 'fixed' }, { style: '.whatsapp', prop: 'bottom', is: '16px' }],
      },
      {
        t: 'see',
        files: { html: '<h1>Hello</h1>', css: 'h1 {\n  font-size: clamp(1.5rem, 5vw, 3rem);\n}' },
        question: 'On a very wide screen, 5vw would be huge. What is the heading\'s size then?',
        options: ['3rem: clamp never lets it go above the maximum', '5vw, which keeps growing', '1.5rem, the minimum, always', 'It is invalid, so the browser ignores it'],
        answer: 0,
        explain: '`clamp(min, wanted, max)` uses the wanted value while it stays between the limits. On a wide screen 5vw is bigger than 3rem, so 3rem wins. On a tiny screen the 1.5rem minimum wins.',
        proof: [{ uses: 'css', pattern: 'clamp\\(\\s*1\\.5rem\\s*,\\s*5vw\\s*,\\s*3rem\\s*\\)' }],
      },
      { t: 'h', text: 'Smooth scrolling and a sticky header' },
      {
        t: 'code',
        text: 'html {\n  scroll-behavior: smooth;\n}\nsection[id] {\n  scroll-margin-top: 4rem; /* leave room for a sticky header */\n}\n\n.gallery {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n}\n.gallery img {\n  scroll-snap-align: start;\n}',
      },
      { t: 'h', text: 'A few more tools' },
      {
        t: 'list',
        items: ['`filter: grayscale(1)` and `opacity` dim or desaturate (a "sold out" photo). `backdrop-filter: blur(6px)` blurs what is behind a see-through header.', '`clip-path: circle(50%)` crops an element to a shape.', '`@font-face` loads your own font file: `@font-face { font-family: "Rose"; src: url(rose.woff2) format("woff2"); font-display: swap; }`. With `font-display: swap` the text shows at once in a fallback font and switches when the font arrives.', '`:is(h1, h2, h3)` groups selectors, and the new `:has()` lets a parent react to its children, for example `.card:has(img)`. Newer features like these are safe for many users now, but check support before you rely on them.'],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'css', logic: true, wrong: '.box {\n  width: calc(100%-2rem);\n}', why: 'Inside `calc()` the `+` and `-` need a space on both sides. Without them the whole declaration is invalid and ignored.', right: '.box {\n  width: calc(100% - 2rem);\n}' },
          { lang: 'css', logic: true, wrong: 'h1 {\n  font-size: clamp(3rem, 4vw, 1.5rem);\n}', why: 'The order is minimum, preferred, maximum. Here the minimum is bigger than the maximum, so the result is always 3rem and nothing flexes.', right: 'h1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}' },
          { lang: 'css', logic: true, wrong: '.price::before {\n  color: green;\n}', why: 'A `::before` without `content` is not created at all. Even an empty string `content: ""` is needed.', right: '.price::before {\n  content: "UGX ";\n  color: green;\n}' },
        ],
      },
      { t: 'quiz', question: 'Which declaration keeps a button stuck to the bottom-right of the screen while the page scrolls?', options: ['position: fixed; bottom: 16px; right: 16px;', 'position: relative; bottom: 16px; right: 16px;', 'float: bottom-right;', 'display: fixed;'], answer: 0, explain: '`fixed` positions relative to the screen (viewport), so it stays put while the page scrolls under it.' },
      {
        t: 'web',
        project: true,
        title: 'Rose\'s page with the modern touches',
        text: 'Fluid heading, price labels from CSS, smooth scrolling and the floating button, all together.',
        files: ['css'],
        starter: {
          html: P('  <header class="top"><nav><a href="#menu">Menu</a> <a href="#contact">Contact</a></nav></header>\n  <main class="page">\n    <h1>Mama Rose Rolex</h1>\n    <section id="menu"><h2>Menu</h2><p class="item">Plain rolex <span class="price">3,000</span></p></section>\n    <section id="contact"><h2>Contact</h2><p>Wandegeya, Kampala</p></section>\n  </main>\n  <a class="whatsapp" href="https://wa.me/256700000000" aria-label="Chat on WhatsApp">WhatsApp</a>'),
          css: 'html {\n  scroll-behavior: smooth;\n}\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n}\n.top {\n  position: sticky;\n  top: 0;\n  background: #0b6b4f;\n  padding: 12px 16px;\n}\n.top a {\n  color: #fff;\n}\nsection[id] {\n  scroll-margin-top: 4rem;\n}\n.page {\n  width: min(90%, 40rem);\n  margin: 0 auto;\n}\nh1 {\n  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);\n}\n.price::before {\n  content: "UGX ";\n}\n.whatsapp {\n  position: fixed;\n  bottom: 16px;\n  right: 16px;\n  z-index: 50;\n  background: #25d366;\n  color: #fff;\n  padding: 14px 18px;\n  border-radius: 999px;\n  text-decoration: none;\n}\n',
        },
        checks: [{ style: '.top', prop: 'position', is: 'sticky' }, { lint: 'css' }],
      },
      { t: 'recap', items: ['`calc()` mixes units (spaces around + and -). `min()`, `max()` and `clamp(min, wanted, max)` make fluid sizes without media queries.', '`position: fixed` pins to the screen. Add a `z-index`.', '`::before` and `::after` need `content`. Do not put essential words in them.', '`scroll-behavior: smooth` and `scroll-margin-top` make anchor links friendly.', '`@font-face` with `font-display: swap` loads your own fonts without blocking the text.'], memory: 'Clamp the elastic, pin the sticker, content for pseudo.' },
    ],
    exercises: [
      {
        id: 'w38-floating-button',
        title: 'The floating WhatsApp button',
        prompt: 'Pin `.whatsapp` to the bottom-right corner of the screen:\n\n- `position: fixed`\n- `bottom: 16px` and `right: 16px`\n- `z-index: 50`\n- `background-color: #25d366`, `border-radius: 999px` and `padding: 14px 18px`',
        files: ['css'],
        starter: { html: P('  <h1>Mama Rose Rolex</h1>\n  <a class="whatsapp" href="https://wa.me/256700000000">Chat on WhatsApp</a>'), css: '.whatsapp {\n  color: #fff;\n  text-decoration: none;\n}\n' },
        solution: { html: P('  <h1>Mama Rose Rolex</h1>\n  <a class="whatsapp" href="https://wa.me/256700000000">Chat on WhatsApp</a>'), css: '.whatsapp {\n  position: fixed;\n  bottom: 16px;\n  right: 16px;\n  z-index: 50;\n  background-color: #25d366;\n  border-radius: 999px;\n  padding: 14px 18px;\n  color: #fff;\n  text-decoration: none;\n}\n' },
        checks: [{ style: '.whatsapp', prop: 'position', is: 'fixed' }, { style: '.whatsapp', prop: 'bottom', is: '16px' }, { style: '.whatsapp', prop: 'right', is: '16px' }, { style: '.whatsapp', prop: 'z-index', is: '50' }, { style: '.whatsapp', prop: 'background-color', is: '#25d366' }, { style: '.whatsapp', prop: 'padding-top', is: '14px' }, { style: '.whatsapp', prop: 'padding-left', is: '18px' }, { style: '.whatsapp', prop: 'border-top-left-radius', is: '999px' }, { lint: 'css' }],
        hints: ['All the new properties go inside the existing `.whatsapp` rule.', '`fixed` is positioned from the screen edges, so `bottom` and `right` are distances from the corner.', '```\nposition: fixed;\nbottom: 16px;\nright: 16px;\nz-index: 50;\n```'],
      },
      {
        id: 'w38-fluid-type',
        title: 'Fluid heading and width',
        prompt: 'Make the page fluid with no media queries:\n\n- `h1`: `font-size: clamp(1.5rem, 4vw + 1rem, 3rem)`\n- `.page`: `width: min(90%, 40rem)` and `margin: 0 auto`\n- `.page`: `padding-block: max(1rem, 3vw)`',
        files: ['css'],
        starter: { html: P('  <main class="page">\n    <h1>Mama Rose Rolex</h1>\n    <p>Hot rolex, every day.</p>\n  </main>'), css: '/* Make it fluid */\n' },
        solution: { html: P('  <main class="page">\n    <h1>Mama Rose Rolex</h1>\n    <p>Hot rolex, every day.</p>\n  </main>'), css: 'h1 {\n  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);\n}\n.page {\n  width: min(90%, 40rem);\n  margin: 0 auto;\n  padding-block: max(1rem, 3vw);\n}\n' },
        checks: [{ uses: 'css', pattern: 'font-size:\\s*clamp\\(\\s*1\\.5rem\\s*,\\s*4vw\\s*\\+\\s*1rem\\s*,\\s*3rem\\s*\\)', label: 'The h1 uses clamp(1.5rem, 4vw + 1rem, 3rem)' }, { uses: 'css', pattern: 'width:\\s*min\\(\\s*90%\\s*,\\s*40rem\\s*\\)', label: '.page uses width: min(90%, 40rem)' }, { uses: 'css', pattern: 'margin:\\s*0\\s+auto', label: '.page is centred' }, { uses: 'css', pattern: 'padding-block:\\s*max\\(\\s*1rem\\s*,\\s*3vw\\s*\\)', label: '.page uses padding-block: max(1rem, 3vw)' }, { uses: 'css', pattern: '^(?![\\s\\S]*@media)', label: 'No media query was needed' }, { lint: 'css' }],
        hints: ['Three declarations in two rules. Keep the spaces around the `+` inside `clamp`.', '`clamp(min, wanted, max)`: smallest, then the fluid value, then the largest.', '```\nh1 {\n  font-size: clamp(1.5rem, 4vw + 1rem, 3rem);\n}\n```'],
      },
      {
        id: 'w38-price-tags',
        title: 'UGX in front of every price',
        prompt: 'Three prices need "UGX " in front, without touching the HTML:\n\n1. `.price::before` with `content: "UGX "`\n2. `html` gets `scroll-behavior: smooth`\n3. `section[id]` gets `scroll-margin-top: 4rem`',
        files: ['css'],
        starter: { html: P('  <section id="menu">\n    <p>Plain <span class="price">3,000</span></p>\n    <p>Veggie <span class="price">4,000</span></p>\n    <p>Chicken <span class="price">7,000</span></p>\n  </section>'), css: '.price {\n  font-weight: 700;\n}\n' },
        solution: { html: P('  <section id="menu">\n    <p>Plain <span class="price">3,000</span></p>\n    <p>Veggie <span class="price">4,000</span></p>\n    <p>Chicken <span class="price">7,000</span></p>\n  </section>'), css: '.price {\n  font-weight: 700;\n}\n.price::before {\n  content: "UGX ";\n}\nhtml {\n  scroll-behavior: smooth;\n}\nsection[id] {\n  scroll-margin-top: 4rem;\n}\n' },
        checks: [{ uses: 'css', pattern: '\\.price::before\\s*\\{[^}]*content:\\s*["\']UGX ["\']', label: '.price::before has content: "UGX "' }, { uses: 'css', pattern: 'html\\s*\\{[^}]*scroll-behavior:\\s*smooth', label: 'html has scroll-behavior: smooth' }, { uses: 'css', pattern: 'section\\[id\\]\\s*\\{[^}]*scroll-margin-top:\\s*4rem', label: 'section[id] has scroll-margin-top: 4rem' }, { count: '.price', equals: 3, label: 'The HTML still has its 3 prices' }, { lint: 'css' }],
        hints: ['Add three new rules; the HTML stays untouched.', 'Do not forget the quotes around the text in `content`, and the space after UGX.', '```\n.price::before {\n  content: "UGX ";\n}\n```'],
      },
    ],
  },
];
