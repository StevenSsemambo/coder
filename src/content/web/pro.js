// Web track, Level 5: go professional. Accessibility, speed/SEO/security, publishing, a capstone and going to market.
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

const L5 = 'Level 5: Go professional';

const CAPSTONE_HTML = fullPage(
  '  <!-- Build the Kato Rides page here -->\n',
  { css: true, js: true },
);

export const proLessons = [
  // ------------------------------------------------------------------------------------------------
  {
    id: 'w32-accessibility',
    level: L5,
    title: 'Accessibility: a website for everyone',
    summary: 'Screen readers, keyboards, contrast, and the checks every professional runs.',
    minutes: 24,
    blocks: [
      {
        t: 'story',
        title: 'Grandfather Mukasa and the website',
        text: 'Rose\'s grandfather Mukasa has poor eyesight. He uses his phone\'s screen reader, which **speaks the page aloud**. On Rose\'s new site it says: "button, button, button, link, link, image, image". It cannot tell him what anything does.\n\nBlind users, people who cannot use a mouse, people with shaky hands, people in bright sunlight, people with a broken arm: **everyone benefits from accessible sites**. In many countries it is also a legal requirement for organisations, and it is what clients expect from a professional.',
      },
      { t: 'analogy', text: 'Accessibility is the ramp next to the stairs. Built in from the start it costs almost nothing, and it is used by far more than you expect: parents with prams, delivery boys with trolleys, people with sore knees. A site that works with a keyboard and a screen reader also works better for everyone else.' },
      {
        t: 'list',
        items: ['**Meaningful HTML first:** real `<button>`, `<a>`, `<nav>`, `<main>`, headings in order. A `<div onclick>` is not a button: it cannot be reached with the keyboard and a screen reader does not know it.', '**Every image** has `alt` (empty `alt=""` for pure decoration). **Every input** has a label. **Every link** says where it goes.', '**Keyboard:** everything works with `Tab`, `Enter` and `Space`, and you can always **see** where the focus is. Never write `outline: none` without a replacement.', '**Contrast:** text needs a contrast ratio of at least 4.5 to 1 against its background (light grey on white fails). Never rely on colour alone: add an icon or words to "red = error".', '**Names for icon buttons:** `<button aria-label="Close menu">✕</button>`. Announce changes with `role="alert"` or `aria-live="polite"`. Touch targets at least 44px.'],
      },
      {
        t: 'web',
        title: 'Press Tab repeatedly in the preview. Can you always see where you are?',
        files: ['html', 'css'],
        starter: {
          html: fullPage('  <a class="skip" href="#main">Skip to the menu</a>\n  <header><h1>Mama Rose Rolex</h1></header>\n  <main id="main">\n    <h2>Order</h2>\n    <form>\n      <label for="name">Your name</label>\n      <input id="name" type="text">\n      <button type="submit">Send</button>\n      <button type="button" aria-label="Clear the form">✕</button>\n    </form>\n  </main>', { css: true }),
          css: '.skip {\n  position: absolute;\n  left: -999px;\n}\n.skip:focus {\n  left: 8px;\n  top: 8px;\n  background: #f7c948;\n  padding: 8px 12px;\n}\nbutton, input {\n  min-height: 44px;\n  padding: 0 12px;\n}\n:focus-visible {\n  outline: 3px solid #0b6b4f;\n  outline-offset: 2px;\n}\n',
        },
        checks: [{ rule: 'form-labels' }, { rule: 'buttons-type' }, { uses: 'css', pattern: ':focus-visible' }],
      },
      {
        t: 'see',
        files: { html: '<button aria-label="Close menu">✕</button>\n<img src="img/logo.svg" alt="">\n<a href="#">Read more</a>' },
        question: 'A screen reader reaches the third element. Which problem does it have?',
        options: ['"Read more" does not say what it leads to', 'It is not a real link', 'It has no colour', 'It must be a button'],
        answer: 0,
        explain: 'Screen reader users often jump from link to link, so each link must make sense alone: "Read the Mama Rose story", not "Read more". The first element is fine (aria-label gives it a name) and the empty `alt=""` correctly marks a decorative image.',
        proof: [{ text: 'a', equals: 'Read more' }, { exists: 'button[aria-label]' }],
      },
      { t: 'tip', text: 'Test with the keyboard: unplug your mouse (or just do not touch the screen) and use only **Tab**. Can you reach everything? Can you see where you are? Then run an automated checker such as Lighthouse in the Chrome browser menu: it finds many problems for free. Automated tools find only about a third of issues, so also look and listen yourself.' },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', logic: true, wrong: '<div class="btn" onclick="send()">Send</div>', why: 'A `div` cannot be focused with the keyboard and a screen reader does not call it a button. Use a real `<button>`: you also get Enter and Space for free.', right: '<button type="button" onclick="send()">Send</button>' },
          { lang: 'css', logic: true, wrong: 'button:focus {\n  outline: none;\n}', why: 'This hides the only sign of where keyboard users are. If you remove the outline you must give a replacement (a thick coloured outline or shadow).', right: 'button:focus-visible {\n  outline: 3px solid #0b6b4f;\n  outline-offset: 2px;\n}' },
        ],
      },
      { t: 'quiz', question: 'Which is the right way to make a clickable "Close" icon?', options: ['<button type="button" aria-label="Close">✕</button>', '<div onclick="close()">✕</div>', '<span class="close">✕</span>', '<img src="x.png">'], answer: 0, explain: 'A real button works with the keyboard, and `aria-label` gives it a name a screen reader can speak.' },
      { t: 'recap', items: ['Use real elements: `<button>`, `<a>`, headings, `<nav>`, `<main>`.', 'Alt text for images, labels for inputs, links that say where they go.', 'Everything must work with the keyboard, and focus must be visible.', 'Contrast of 4.5 to 1, never colour alone, touch targets of 44px.', 'Test with Tab and with a checker such as Lighthouse.'], memory: 'Real elements, names for everything, visible focus.' },
    ],
    exercises: [
      {
        id: 'w32-fix-page',
        title: 'Fix the inaccessible page',
        assets: ASSETS,
        prompt: 'A screen-reader user cannot use this page. Fix **all** the problems:\n\n1. the page does not say what language it is in\n2. the picture has no `alt` text\n3. the name box has no label\n4. the link says only `click here`\n5. the icon button has no name',
        files: ['html'],
        starter: { html: '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Mama Rose Rolex</title>\n</head>\n<body>\n  <h1>Mama Rose Rolex</h1>\n  <img src="img/rolex.svg">\n  <form>\n    <input id="name" type="text">\n    <button type="submit">Send</button>\n    <button type="button">✕</button>\n  </form>\n  <p><a href="#menu">click here</a> to see the menu.</p>\n</body>\n</html>\n' },
        solution: { html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Mama Rose Rolex</title>\n</head>\n<body>\n  <h1>Mama Rose Rolex</h1>\n  <img src="img/rolex.svg" alt="A plate of hot rolex">\n  <form>\n    <label for="name">Your name</label>\n    <input id="name" type="text">\n    <button type="submit">Send</button>\n    <button type="button" aria-label="Clear the form">✕</button>\n  </form>\n  <p><a href="#menu">See the menu</a> for prices.</p>\n</body>\n</html>\n' },
        checks: [{ rule: 'html-lang', label: 'The page declares its language' }, { rule: 'img-alt', label: 'The picture has alt text' }, { rule: 'form-labels', label: 'The name box has a label' }, { rule: 'link-text', label: 'No link says "click here"' }, { rule: 'buttons-type', label: 'Every button has a name' }, { rule: 'one-h1' }, { lint: 'html' }],
        hints: ['Each failed check names one problem. Fix them one at a time.', 'Add `lang="en"` to `<html>`, `alt="..."` to the image, a `<label for="name">`, descriptive link text, and an `aria-label` on the icon button.', '```\n<html lang="en">\n<img src="img/rolex.svg" alt="A plate of hot rolex">\n<label for="name">Your name</label>\n<button type="button" aria-label="Clear the form">✕</button>\n```'],
      },
      {
        id: 'w32-skip-link',
        title: 'A skip link',
        prompt: 'Keyboard users must Tab through the whole menu on every page before reaching the content. Add a **skip link**:\n\n- `<a class="skip" href="#main">Skip to content</a>` as the **first** thing in `<body>`\n- give the `<main>` the id `main`\n- in the CSS hide `.skip` off-screen (`position: absolute; left: -999px;`) and show it when focused (`.skip:focus { left: 8px; }`)',
        files: ['html', 'css'],
        starter: { html: fullPage('  <header>\n    <h1>Mama Rose Rolex</h1>\n    <nav><a href="#a">Menu</a> <a href="#b">Contact</a></nav>\n  </header>\n  <main>\n    <p>Hot rolex, every day.</p>\n  </main>', { css: true }), css: '/* hide the skip link until it is focused */\n' },
        solution: { html: fullPage('  <a class="skip" href="#main">Skip to content</a>\n  <header>\n    <h1>Mama Rose Rolex</h1>\n    <nav><a href="#a">Menu</a> <a href="#b">Contact</a></nav>\n  </header>\n  <main id="main">\n    <p>Hot rolex, every day.</p>\n  </main>', { css: true }), css: '.skip {\n  position: absolute;\n  left: -999px;\n}\n.skip:focus {\n  left: 8px;\n  top: 8px;\n}\n' },
        checks: [{ exists: 'body > a.skip:first-child', label: 'The skip link is the first element in the body' }, { attr: 'a.skip', name: 'href', equals: '#main' }, { text: 'a.skip', contains: 'content' }, { exists: 'main#main', label: 'The main element has id="main"' }, { style: '.skip', prop: 'position', is: 'absolute', label: 'The skip link is positioned off-screen' }, { uses: 'css', pattern: '\\.skip:focus', label: 'It becomes visible on focus' }, { lint: 'html' }, { lint: 'css' }],
        hints: ['Three edits: a new link at the top of the body, an `id` on main, and two CSS rules.', 'The link\'s `href="#main"` jumps to the element with `id="main"`.', '```\n.skip { position: absolute; left: -999px; }\n.skip:focus { left: 8px; top: 8px; }\n```'],
      },
      {
        id: 'w32-focus-touch',
        title: 'Focus you can see, targets you can hit',
        prompt: 'Style the buttons for keyboards and thumbs:\n\n- every `button` is at least `44px` tall (`min-height: 44px`)\n- add a `button:focus-visible` rule with a **3px solid** outline (any colour) and `outline-offset: 2px`',
        files: ['css'],
        starter: { html: fullPage('  <button type="button">Add</button>\n  <button type="button">Remove</button>', { css: true }), css: 'button {\n  padding: 0 16px;\n}\n' },
        solution: { html: fullPage('  <button type="button">Add</button>\n  <button type="button">Remove</button>', { css: true }), css: 'button {\n  padding: 0 16px;\n  min-height: 44px;\n}\nbutton:focus-visible {\n  outline: 3px solid #0b6b4f;\n  outline-offset: 2px;\n}\n' },
        checks: [{ style: 'button', prop: 'min-height', is: '44px' }, { uses: 'css', pattern: 'button:focus-visible\\s*\\{[^}]*outline:\\s*3px\\s+solid', label: 'button:focus-visible has a 3px solid outline' }, { uses: 'css', pattern: 'outline-offset:\\s*2px', label: 'The outline has an offset of 2px' }, { uses: 'css', pattern: '^(?![\\s\\S]*outline:\\s*none)', label: 'You did not remove the outline' }, { lint: 'css' }],
        hints: ['Two things: a `min-height` on `button`, and a new `button:focus-visible` rule.', '`outline: 3px solid <colour>;` is one line.', '```\nbutton:focus-visible {\n  outline: 3px solid #0b6b4f;\n  outline-offset: 2px;\n}\n```'],
      },
    ],
  },

  // ------------------------------------------------------------------------------------------------
  {
    id: 'w33-speed-seo-security',
    level: L5,
    title: 'Fast, findable and safe',
    summary: 'Performance on slow data, search engine basics, and the security habits that protect your clients.',
    minutes: 26,
    blocks: [
      {
        t: 'story',
        title: 'Twelve seconds in Gulu',
        text: 'Rose\'s cousin in Gulu opens the page on a cheap phone on mobile data. It takes **twelve seconds** and half the pictures never appear. Meanwhile, Google shows three competitors above Rose when someone searches "rolex Kampala". And last week a prankster typed some code into the comment box and the page started showing a rude message to every visitor.\n\nSpeed, search ranking and security are not extras. They decide whether a site makes money. Luckily the basics are a handful of habits.',
      },
      { t: 'analogy', text: 'A website is a shop. **Speed** is how fast the door opens: nobody waits twelve seconds. **SEO** is the signboard on the main road so people find you. **Security** is the lock and the good habit of never handing a stranger your till. A beautiful shop with a stuck door, no signboard and an open till still fails.' },
      {
        t: 'list',
        items: ['**Speed:** send fewer, smaller bytes. Give images `width`/`height`, `loading="lazy"`, and sensible sizes (never a 4 MB phone photo for a thumbnail). Prefer system fonts. Add `defer` to scripts in the head. Test on a throttled "Slow 4G" setting in Chrome DevTools.', '**SEO:** one clear `<title>` and description per page, real headings, descriptive link text and alt text, a fast mobile-friendly page, and **structured data** (JSON-LD) that tells Google your business name, phone and address. Add the shop to **Google Business Profile**: for local shops it matters more than anything else.', '**Security:** use **HTTPS** (hosts give it free). **Never trust input**: a user may type code, so show their text with `textContent`, not `innerHTML`. Never put secrets (API keys, passwords) in front-end code. External links get `rel="noopener noreferrer"`. Keep libraries updated.'],
      },
      {
        t: 'web',
        title: 'Structured data tells Google who you are. Change the phone number.',
        files: ['html'],
        starter: {
          html: fullPage('  <h1>Mama Rose Rolex</h1>\n  <p>Hot rolex, every day.</p>', { head: '\n  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "Restaurant",\n    "name": "Mama Rose Rolex",\n    "telephone": "+256700000000",\n    "servesCuisine": "Ugandan street food",\n    "address": {\n      "@type": "PostalAddress",\n      "streetAddress": "Wandegeya",\n      "addressLocality": "Kampala",\n      "addressCountry": "UG"\n    }\n  }\n  </script>' }),
        },
        checks: [{ js: 'JSON.parse(document.querySelector("script[type=\'application/ld+json\']").textContent)["@type"]', equals: 'Restaurant' }],
      },
      {
        t: 'see',
        files: { html: '<ul id="comments"></ul>', js: 'const comment = "<b>Great rolex!</b>";\nconst li = document.createElement("li");\nli.textContent = comment;\ndocument.querySelector("#comments").append(li);' },
        question: 'The comment contains HTML tags. How does it appear with `textContent`?',
        options: ['As plain text, tags included: <b>Great rolex!</b>', 'In bold: Great rolex!', 'It does not appear', 'It runs as code'],
        answer: 0,
        explain: '`textContent` treats everything as plain text, so even a malicious `<script>` or `<img onerror=...>` just appears as harmless words. `innerHTML` would turn it into real elements and run it. That is XSS.',
        proof: [{ text: '#comments li', contains: '<b>Great rolex!</b>' }, { count: '#comments b', equals: 0 }],
      },
      { t: 'tip', text: 'Three security questions for every feature: **Where does this text come from?** (if a user typed it, it is untrusted). **Where does it go?** (into the page? a database? a link?). **Who can see or change it?** Anything the browser can read, an attacker can read: so passwords and secret keys must live on a server, never in your JavaScript or HTML.' },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: 'li.innerHTML = comment;', why: 'If `comment` came from a user it may contain `<img src=x onerror=...>`. The browser would run their code on your page, for every visitor.', right: 'li.textContent = comment;' },
          { lang: 'html', logic: true, wrong: '<a href="https://example.com" target="_blank">Partner</a>', why: 'A page opened with `target="_blank"` can access your page through `window.opener` in some browsers. Add `rel="noopener noreferrer"`.', right: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Partner</a>' },
          { lang: 'dom', wrong: 'const API_KEY = "sk_live_51H...secret";\nfetch(url + "?key=" + API_KEY);', why: 'Anyone can open DevTools and read this. Secret keys belong on a server that your page asks, never in front-end code.', right: '// The page asks YOUR server, which holds the secret key\nfetch("/api/charge", { method: "POST" });' },
        ],
      },
      { t: 'quiz', question: 'A user types their name into a form. How should you show it back on the page?', options: ['element.textContent = name', 'element.innerHTML = name', 'document.write(name)', 'eval(name)'], answer: 0, explain: '`textContent` can never run code. The other three can, and are the root of many real attacks.' },
      { t: 'quiz', question: 'Which change helps a slow-data visitor the most?', options: ['Resizing a 4 MB photo to the size it is displayed and adding loading="lazy"', 'Changing the button colour', 'Adding more animations', 'Using a longer title'], answer: 0, explain: 'Images are usually most of a page\'s weight. Right-sized and lazy-loaded pictures save the most data.' },
      { t: 'recap', items: ['Speed: small images with width/height and `loading="lazy"`, system fonts, `defer`, test on slow 4G.', 'SEO: titles, descriptions, headings, alt text, JSON-LD, Google Business Profile.', 'Security: HTTPS, `textContent` for user text, no secrets in front-end code, `rel="noopener noreferrer"`.', 'Never trust input. Anything the browser can see, an attacker can see.'], memory: 'Light pages, clear signs, locked tills.' },
    ],
    exercises: [
      {
        id: 'w33-json-ld',
        title: 'Tell Google who you are',
        prompt: 'In the `<head>`, add a `<script type="application/ld+json">` with valid JSON describing the shop:\n\n- `"@context"`: `"https://schema.org"`\n- `"@type"`: `"Restaurant"`\n- `"name"`: `"Mama Rose Rolex"`\n- `"telephone"`: `"+256700000000"`\n- an `"address"` object with `"addressLocality"`: `"Kampala"`',
        files: ['html'],
        starter: { html: fullPage('  <h1>Mama Rose Rolex</h1>') },
        solution: { html: fullPage('  <h1>Mama Rose Rolex</h1>', { head: '\n  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "Restaurant",\n    "name": "Mama Rose Rolex",\n    "telephone": "+256700000000",\n    "address": { "@type": "PostalAddress", "addressLocality": "Kampala" }\n  }\n  </script>' }) },
        checks: [{ exists: 'script[type="application/ld+json"]', label: 'The head has a JSON-LD script' }, { js: 'JSON.parse(document.querySelector("script[type=\'application/ld+json\']").textContent)["@context"]', equals: 'https://schema.org', label: '@context is https://schema.org (and the JSON is valid)' }, { js: 'JSON.parse(document.querySelector("script[type=\'application/ld+json\']").textContent)["@type"]', equals: 'Restaurant', label: '@type is Restaurant' }, { js: 'JSON.parse(document.querySelector("script[type=\'application/ld+json\']").textContent).name', equals: 'Mama Rose Rolex', label: 'The name is right' }, { js: 'JSON.parse(document.querySelector("script[type=\'application/ld+json\']").textContent).telephone', equals: '+256700000000', label: 'The telephone is right' }, { js: 'JSON.parse(document.querySelector("script[type=\'application/ld+json\']").textContent).address.addressLocality', equals: 'Kampala', label: 'The address locality is Kampala' }],
        hints: ['It is a normal `<script>` tag but with `type="application/ld+json"`, and JSON inside instead of JavaScript.', 'JSON needs double quotes around every key and string, commas between items, and no comma after the last one.', '```\n<script type="application/ld+json">\n{ "@context": "https://schema.org", "@type": "Restaurant", ... }\n</script>\n```'],
      },
      {
        id: 'w33-fast-images',
        title: 'Lighter, faster images',
        assets: ASSETS,
        prompt: 'The page loads three pictures at once. Make it kinder to slow data:\n\n- every `<img>` gets `width` and `height` (so the page does not jump)\n- the **two lower** images get `loading="lazy"` (the first one is at the top, so it must load at once)',
        files: ['html'],
        starter: { html: '<img src="img/rolex.svg" alt="Plain rolex">\n<p>Scroll for more...</p>\n<img src="img/chicken.svg" alt="Chicken rolex">\n<img src="img/boda.svg" alt="Delivery boda">\n' },
        solution: { html: '<img src="img/rolex.svg" alt="Plain rolex" width="240" height="160">\n<p>Scroll for more...</p>\n<img src="img/chicken.svg" alt="Chicken rolex" width="240" height="160" loading="lazy">\n<img src="img/boda.svg" alt="Delivery boda" width="240" height="160" loading="lazy">\n' },
        checks: [{ count: 'img[width][height]', equals: 3, label: 'All three images have width and height' }, { count: 'img[loading="lazy"]', equals: 2, label: 'Exactly two images are lazy-loaded' }, { attr: 'img:nth-of-type(1)', name: 'loading', present: false, label: 'The first image (at the top) is NOT lazy' }, { rule: 'img-alt' }, { lint: 'html' }],
        hints: ['Add attributes inside each `<img>` tag.', 'Use the real size of the pictures: `width="240" height="160"`.', '```\n<img src="img/chicken.svg" alt="Chicken rolex" width="240" height="160" loading="lazy">\n```'],
      },
      {
        id: 'w33-safe-comments',
        title: 'Close the XSS hole',
        prompt: 'The comment board shows a user\'s comment with `innerHTML`, so a comment containing HTML creates real elements. Fix `addComment` so the comment is shown **as plain text** (`textContent`).\n\nThe test comment is `<img src=x onerror="steal()">`.',
        files: ['js'],
        starter: { html: fullPage('  <ul id="comments"></ul>', { js: true }), js: 'function addComment(text) {\n  const li = document.createElement("li");\n  li.innerHTML = text;\n  document.querySelector("#comments").append(li);\n}\n\naddComment(\'<img src=x onerror="steal()">\');\n' },
        solution: { html: fullPage('  <ul id="comments"></ul>', { js: true }), js: 'function addComment(text) {\n  const li = document.createElement("li");\n  li.textContent = text;\n  document.querySelector("#comments").append(li);\n}\n\naddComment(\'<img src=x onerror="steal()">\');\n' },
        checks: [{ count: '#comments li', equals: 1, label: 'One comment is shown' }, { count: '#comments img', equals: 0, label: 'No <img> element was created from the comment text' }, { text: '#comments li', contains: '<img src=x', label: 'The comment appears as harmless text' }, { uses: 'js', pattern: 'textContent', label: 'You used textContent' }, { uses: 'js', pattern: '^(?![\\s\\S]*innerHTML\\s*=)', label: 'You do not use innerHTML for the comment' }],
        hints: ['Find the line that puts the comment into the page.', 'Replace `li.innerHTML = text;` with the safe version.', '```\nli.textContent = text;\n```'],
      },
    ],
  },

  // ------------------------------------------------------------------------------------------------
  {
    id: 'w34-publishing',
    level: L5,
    title: 'Putting it online: Git and GitHub Pages',
    summary: 'Save points with Git, free hosting with GitHub Pages, and the bugs that only appear when you go live.',
    minutes: 22,
    blocks: [
      {
        t: 'story',
        title: 'It only exists on your phone',
        text: 'Rose\'s site is finished, and it lives on **your** phone. Grace cannot open it, customers cannot find it, and if your phone falls in the river the work is gone.\n\nGoing live needs two things: a safe place to keep your code with its history (**Git** and GitHub), and a computer that is always on and answers visitors (**hosting**). The good news: both are free for small sites.',
      },
      { t: 'analogy', text: 'Git is the save-points system in a video game. Every time you reach a good moment you make a **commit**: a named save you can return to. GitHub is the cloud where your saves are kept safely and shared. Hosting is the notice-board in the town square: you pin your finished page to it and everybody can read it.' },
      {
        t: 'code',
        text: '# one time, on your computer\ngit config --global user.name "Your Name"\ngit config --global user.email "you@example.com"\n\n# in your project folder\ngit init\ngit add .\ngit commit -m "First version of Mama Rose site"\n\n# connect to GitHub (create an empty repository there first)\ngit remote add origin https://github.com/YOURNAME/rose-site.git\ngit push -u origin main',
      },
      {
        t: 'list',
        items: ['`git add .` chooses what goes in the next save, `git commit -m "message"` makes the save with a message about **what changed and why**, `git push` sends your saves to GitHub.', '**GitHub Pages:** in the repository go to Settings, then Pages, choose the `main` branch. In a minute your site is live at `https://YOURNAME.github.io/rose-site/` with free HTTPS. Netlify and Cloudflare Pages work the same way and are just as free.', '**A custom domain** (like `maamarose.co.ug`) is bought from a registrar, then pointed at your host in the host\'s settings. Compare prices, and register it in the **client\'s** name so they own it.', 'Put `index.html` in the root folder: that is the page shown for the plain address. Add a `404.html` for missing pages.'],
      },
      {
        t: 'web',
        title: 'Relative paths work anywhere. Try changing img/logo.svg to /img/logo.svg and see it break in the exercise.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: fullPage('  <img src="img/logo.svg" alt="Mama Rose logo" width="80">\n  <p><a href="menu.html">See the menu</a></p>', { css: true }), css: 'body { font-family: system-ui, sans-serif; }\n' },
        checks: [{ attr: 'img', name: 'src', contains: 'data:image/svg' }],
      },
      { t: 'h', text: 'Bugs that appear only when you go live' },
      {
        t: 'list',
        items: ['**Absolute paths:** `href="/style.css"` means "the root of the whole website". On GitHub Pages your site lives in a sub-folder (`/rose-site/`), so `/style.css` is not found. Use **relative** paths: `style.css`, `img/logo.svg`.', '**Capital letters:** the servers are case sensitive. `Logo.SVG` and `logo.svg` are different files. It worked on your phone, and broke online. Keep all file names lowercase with dashes, no spaces.', '**Cache:** browsers keep old copies. After you publish, a hard refresh shows the new one.', '**Secrets:** never commit passwords or keys. Once pushed, they are public forever, even if you delete them later.'],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', logic: true, wrong: '<link rel="stylesheet" href="/css/style.css">\n<img src="/img/Logo.PNG" alt="Logo">', why: 'The leading slash points to the root of the whole domain, and `Logo.PNG` has capital letters. Both break on a sub-folder site on a case-sensitive server.', right: '<link rel="stylesheet" href="css/style.css">\n<img src="img/logo.png" alt="Logo">' },
          { lang: 'dom', wrong: 'git commit -m "stuff"', why: 'A vague message makes the history useless. Say what changed: "Add order form with phone validation".', right: 'git commit -m "Add order form with phone validation"' },
        ],
      },
      { t: 'quiz', question: 'After `git add .` and `git commit`, how do your saves get to GitHub?', options: ['git push', 'git pull', 'git init', 'git clone'], answer: 0, explain: '`push` uploads your commits. `pull` downloads other people\'s, `clone` copies a repository, and `init` starts a new one.' },
      { t: 'quiz', question: 'The site works on your laptop but the CSS is missing online. What is the most likely cause?', options: ['An absolute path or a capital letter in a file name', 'The internet is slow', 'GitHub does not support CSS', 'The page title is too long'], answer: 0, explain: 'Paths that start with `/` and file names with different capitals are the top two "works on my machine" bugs.' },
      { t: 'recap', items: ['Git saves history: `add`, `commit -m "clear message"`, `push`.', 'GitHub Pages, Netlify and Cloudflare Pages host small sites free, with HTTPS.', '`index.html` in the root. Lowercase file names. Relative paths.', 'Register the domain in the client\'s name.', 'Never commit secrets.'], memory: 'Add, commit, push. Relative paths, lowercase names.' },
    ],
    exercises: [
      {
        id: 'w34-relative-paths',
        title: 'Make the paths work online',
        assets: ASSETS,
        prompt: 'The site will live in a sub-folder, so every path that begins with `/` breaks. Make the three paths **relative** by removing the leading slash:\n\n- the stylesheet `/style.css`\n- the picture `/img/logo.svg`\n- the link `/menu.html`',
        files: ['html'],
        starter: { html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Mama Rose Rolex</title>\n  <link rel="stylesheet" href="/style.css">\n</head>\n<body>\n  <img src="/img/logo.svg" alt="Mama Rose logo" width="80">\n  <p><a href="/menu.html">See the menu</a></p>\n</body>\n</html>\n', css: 'body { font-family: system-ui, sans-serif; }\n' },
        solution: { html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Mama Rose Rolex</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <img src="img/logo.svg" alt="Mama Rose logo" width="80">\n  <p><a href="menu.html">See the menu</a></p>\n</body>\n</html>\n', css: 'body { font-family: system-ui, sans-serif; }\n' },
        checks: [{ attr: 'img', name: 'src', contains: 'data:image/svg', label: 'The picture is found (its path is relative and exact)' }, { uses: 'html', pattern: 'href=["\']style\\.css["\']', label: 'The stylesheet path is style.css' }, { attr: 'a', name: 'href', equals: 'menu.html', label: 'The link goes to menu.html' }, { uses: 'html', pattern: '^(?![\\s\\S]*(?:href|src)=["\']/(?!/))', label: 'No path starts with a slash' }, { lint: 'html' }],
        hints: ['Find every `href="/...` and `src="/...`.', 'Remove only the first `/` of each path. `/style.css` becomes `style.css`.', '```\n<link rel="stylesheet" href="style.css">\n<img src="img/logo.svg" ...>\n<a href="menu.html">\n```'],
      },
      {
        id: 'w34-case-names',
        title: 'The capital-letter bug',
        assets: ASSETS,
        prompt: 'Online, the picture is missing. The files in the `img` folder are named in lowercase (`rolex.svg`, `chicken.svg`) but the HTML uses capital letters. Fix **both** images. Also make the external link safe with `target="_blank"` and `rel="noopener noreferrer"`.',
        files: ['html'],
        starter: { html: '<img src="img/Rolex.SVG" alt="Plain rolex" width="120">\n<img src="img/Chicken.svg" alt="Chicken rolex" width="120">\n<p><a href="https://example.com">Our partner</a></p>\n' },
        solution: { html: '<img src="img/rolex.svg" alt="Plain rolex" width="120">\n<img src="img/chicken.svg" alt="Chicken rolex" width="120">\n<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">Our partner</a></p>\n' },
        checks: [{ attr: 'img:nth-of-type(1)', name: 'src', contains: 'data:image/svg', label: 'The first picture is found' }, { attr: 'img:nth-of-type(2)', name: 'src', contains: 'data:image/svg', label: 'The second picture is found' }, { attr: 'a', name: 'target', equals: '_blank' }, { attr: 'a', name: 'rel', contains: 'noopener', label: 'The link has rel="noopener noreferrer"' }, { rule: 'img-alt' }, { lint: 'html' }],
        hints: ['The preview finds pictures only when the name matches exactly, just like a real server.', 'Make both picture names lowercase: `rolex.svg` and `chicken.svg`.', '```\n<a href="https://example.com" target="_blank" rel="noopener noreferrer">Our partner</a>\n```'],
      },
    ],
  },

  // ------------------------------------------------------------------------------------------------
  {
    id: 'w35-capstone',
    level: L5,
    title: 'Capstone: a real client website',
    summary: 'A complete, accessible, responsive, validated business site built from a client brief, ready to show in your portfolio.',
    minutes: 60,
    blocks: [
      {
        t: 'story',
        title: 'Your first paying client',
        text: 'Kato runs **Kato Rides**, a boda boda delivery service in Kampala. He sends parcels, groceries and documents across town. He has only a WhatsApp number and no website, and he loses customers who cannot find his prices or book a ride.\n\nThis is your graduation project: build his website from a brief, the way a freelancer would. When it passes every check it is good enough to show to real clients.',
      },
      { t: 'analogy', text: 'A capstone is the final exam of an apprenticeship: not a question, but a real job. A carpenter\'s apprentice builds a whole chair. Nobody tells you which tool to pick at each step: you read the brief, plan the order, build, test like a customer, and fix what is wrong.' },
      {
        t: 'list',
        items: ['**The brief (what Kato asked for):** a page that says what Kato Rides does, shows three services, a price table, and has a booking form (name, phone, a note) that checks its input and a WhatsApp link.', '**Quality rules (what a professional adds):** semantic structure (`header`, `nav`, `main`, `section`, `footer`), one `h1`, `lang`, viewport, a good title and description, labels, alt text, visible focus, a mobile layout that becomes a grid on bigger screens, and CSS variables for the brand colours.', '**Plan:** 1) HTML structure and head, 2) CSS: variables, layout, responsive, 3) JavaScript: form validation and messages, 4) test by keyboard and on a small screen.'],
      },
      { t: 'tip', text: 'Work in small steps and test each one. After the HTML, look at it unstyled: does it make sense on its own? After the CSS, shrink the preview: does it still work? After the JavaScript, try the form with empty, wrong and good data. Professionals spend half their time testing like a customer. When the checker disagrees with you, read the message: it is describing what a user or Google would see.' },
      { t: 'quiz', question: 'Which should you build FIRST?', options: ['The HTML structure and content', 'The animations', 'The colour theme', 'The deployment'], answer: 0, explain: 'Content and structure first. If the unstyled HTML is clear and accessible, the CSS and JavaScript have something solid to dress up and enhance.' },
      { t: 'quiz', question: 'The checker says everything passes, but is the site really finished?', options: ['Not yet: also test with the keyboard and on a small phone, like a real customer', 'Yes: the checker finds every possible problem', 'Yes: a site is finished when the code is long', 'No: it must also have animations'], answer: 0, explain: 'Automated checks catch many problems but not all. Real finished work is also tried by hand: Tab through it, shrink the screen, type silly data into the form.' },
      { t: 'recap', items: ['A client brief lists what the client wants; quality rules are what you add as a professional.', 'Build in layers: HTML structure, CSS looks and layout, JavaScript behaviour.', 'Test like a customer: keyboard, small screen, bad input.', 'Finished and checked work goes in your portfolio.'], memory: 'Brief, structure, style, behaviour, test.' },
    ],
    exercises: [
      {
        id: 'w35-kato-rides',
        title: 'Kato Rides: the full website',
        assets: ASSETS,
        prompt: 'Build the Kato Rides website. All three files are yours.\n\n**HTML**\n- a full page: `lang="en"`, viewport, a `<title>` with `Kato Rides` and `Kampala`, and a meta description of at least 50 characters\n- `<header>` with one `<h1>` (`Kato Rides`) and a `<nav>` with at least 2 links\n- `<main>` with three `<section class="service">` blocks (each with an `<h2>` or `<h3>`), a price `<table>` with a `<caption>` and at least 3 rows in `<tbody>`, and the booking form\n- an `<img>` with `alt`, and a `<footer>`\n- the form (`id="booking"`): labelled inputs `#name` and `#phone`, a textarea, a submit button; and `<p id="form-message" role="status"></p>`\n- a WhatsApp link `https://wa.me/256700000000`\n\n**CSS**\n- brand colours as variables on `:root` (`--brand`), used with `var(--brand)`\n- the services in a grid (`display: grid`) with a media query for wider screens\n- visible `:focus-visible` styles\n\n**JavaScript**\n- on submit: stop the reload; empty name shows `Please write your name.`; a phone that is not 07 followed by 8 digits shows `Enter a phone like 0700123456.`; a good booking shows `Thanks NAME, we will call you.` (all in `#form-message`)',
        files: ['html', 'css', 'js'],
        starter: { html: CAPSTONE_HTML, css: '/* Kato Rides styles */\n', js: '// Kato Rides: booking form\n' },
        solution: {
          html: fullPage(
            '  <header class="top">\n    <h1>Kato Rides</h1>\n    <nav aria-label="Main"><a href="#services">Services</a> <a href="#prices">Prices</a> <a href="#book">Book</a></nav>\n  </header>\n  <main>\n    <img src="img/boda.svg" alt="A boda boda rider ready to deliver" width="240" height="160">\n    <section id="services">\n      <h2>What we deliver</h2>\n      <div class="services">\n        <section class="service"><h3>Parcels</h3><p>Anywhere in Kampala.</p></section>\n        <section class="service"><h3>Groceries</h3><p>From the market to your door.</p></section>\n        <section class="service"><h3>Documents</h3><p>Fast and safe.</p></section>\n      </div>\n    </section>\n    <section id="prices">\n      <h2>Prices</h2>\n      <table>\n        <caption>Delivery prices</caption>\n        <thead><tr><th scope="col">Distance</th><th scope="col">Price (UGX)</th></tr></thead>\n        <tbody>\n          <tr><td>Under 3 km</td><td>5,000</td></tr>\n          <tr><td>3 to 8 km</td><td>8,000</td></tr>\n          <tr><td>Over 8 km</td><td>12,000</td></tr>\n        </tbody>\n      </table>\n    </section>\n    <section id="book">\n      <h2>Book a ride</h2>\n      <form id="booking" novalidate>\n        <label for="name">Your name</label>\n        <input id="name" type="text">\n        <label for="phone">Phone</label>\n        <input id="phone" type="tel">\n        <label for="note">Where to?</label>\n        <textarea id="note" rows="3"></textarea>\n        <button type="submit">Book now</button>\n      </form>\n      <p id="form-message" role="status"></p>\n      <p><a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer">Or chat on WhatsApp</a></p>\n    </section>\n  </main>\n  <footer><p>Kato Rides, Kampala. Open every day.</p></footer>',
            { css: true, js: true, title: 'Kato Rides | Boda delivery in Kampala', head: '\n  <meta name="description" content="Fast boda boda delivery in Kampala for parcels, groceries and documents. Book by form or WhatsApp.">' },
          ),
          css: ':root {\n  --brand: #0b6b4f;\n  --accent: #f7c948;\n}\n* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; color: #1c1b18; }\n.top { background: var(--brand); color: #fff; padding: 12px 16px; }\n.top a { color: #fff; }\nmain { max-width: 900px; margin: 0 auto; padding: 16px; }\n.services { display: grid; gap: 12px; }\n.service { background: #fdf1d3; padding: 12px; border-radius: 12px; }\nbutton { min-height: 44px; padding: 0 16px; border: none; border-radius: 999px; background: var(--brand); color: #fff; font-weight: 700; }\n:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }\n@media (min-width: 700px) {\n  .services { grid-template-columns: repeat(3, 1fr); }\n}\n',
          js: 'const form = document.querySelector("#booking");\nconst message = document.querySelector("#form-message");\n\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.querySelector("#name").value.trim();\n  const phone = document.querySelector("#phone").value.trim();\n  if (name === "") {\n    message.textContent = "Please write your name.";\n    return;\n  }\n  if (!/^07\\d{8}$/.test(phone)) {\n    message.textContent = "Enter a phone like 0700123456.";\n    return;\n  }\n  message.textContent = `Thanks ${name}, we will call you.`;\n});\n',
        },
        checks: [
          { rule: 'html-lang' }, { rule: 'viewport' }, { rule: 'title' }, { rule: 'one-h1' }, { rule: 'img-alt' }, { rule: 'form-labels' }, { rule: 'buttons-type' }, { rule: 'link-text' },
          { text: 'title', contains: 'Kato Rides', label: 'The title says Kato Rides' }, { text: 'title', contains: 'Kampala', label: 'The title says Kampala' },
          { attr: 'meta[name="description"]', name: 'content', matches: '.{50,}', label: 'The meta description is at least 50 characters' },
          { exists: 'header h1', label: 'The header has the h1' }, { text: 'h1', contains: 'Kato Rides' }, { count: 'header nav a', min: 2, label: 'The nav has at least 2 links' },
          { exists: 'main', label: 'There is a main element' }, { count: 'section.service', equals: 3, label: 'Three service sections' }, { exists: 'main table caption' }, { count: 'tbody tr', min: 3, label: 'The price table has at least 3 rows' }, { exists: 'footer' },
          { order: ['header', 'main', 'footer'] },
          { exists: 'form#booking' }, { exists: '#name' }, { exists: '#phone' }, { exists: 'form#booking textarea' }, { exists: 'form#booking button[type="submit"]' }, { exists: 'p#form-message' },
          { attr: 'a[href^="https://wa.me/"]', name: 'href', contains: '256700000000', label: 'There is a WhatsApp link' },
          { uses: 'css', pattern: ':root\\s*\\{[^}]*--brand', label: 'CSS variable --brand is defined' }, { uses: 'css', pattern: 'var\\(--brand\\)', label: 'var(--brand) is used' },
          { uses: 'css', pattern: 'display:\\s*grid', label: 'The services use grid' }, { uses: 'css', pattern: '@media\\s*\\(\\s*min-width', label: 'A media query adapts the layout' }, { uses: 'css', pattern: ':focus-visible', label: 'Focus is visible' },
          { do: 'submit', target: '#booking' }, { text: '#form-message', equals: 'Please write your name.', label: 'An empty name is rejected' },
          { do: 'type', target: '#name', value: 'Amina' }, { do: 'type', target: '#phone', value: '12345' }, { do: 'submit', target: '#booking' }, { text: '#form-message', equals: 'Enter a phone like 0700123456.', label: 'A wrong phone is rejected' },
          { do: 'type', target: '#phone', value: '0700123456' }, { do: 'submit', target: '#booking' }, { text: '#form-message', equals: 'Thanks Amina, we will call you.', label: 'A good booking is accepted' },
          { lint: 'html' }, { lint: 'css' },
        ],
        hints: ['Do it in layers and check often. First the HTML: write the full page with all the required parts. The failed checks list exactly what is still missing.', 'Then the CSS: `:root` variables, a grid for `.services`, a media query, a visible focus style. Then the JavaScript: one submit handler that checks the name, then the phone, then thanks the user.', '```\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.querySelector("#name").value.trim();\n  const phone = document.querySelector("#phone").value.trim();\n  if (name === "") { message.textContent = "Please write your name."; return; }\n  if (!/^07\\d{8}$/.test(phone)) { message.textContent = "Enter a phone like 0700123456."; return; }\n  message.textContent = `Thanks ${name}, we will call you.`;\n});\n```'],
      },
    ],
  },

  // ------------------------------------------------------------------------------------------------
  {
    id: 'w36-going-to-market',
    level: L5,
    title: 'Going to market: clients, quotes and Mobile Money',
    summary: 'Find clients, price your work in UGX, write a quote, take a deposit, and add WhatsApp ordering.',
    minutes: 30,
    blocks: [
      {
        t: 'story',
        title: 'The skill nobody teaches',
        text: 'You can build a good site. Kato loves it and asks: **"How much?"** You panic and say "ten thousand". He agrees instantly, and you spend two weeks on it. Then he asks for five more pages and a logo, and says "it was in the price". Next month he is two weeks late paying.\n\nTechnical skill gets you the job. **Business skill gets you paid.** This lesson is the other half of being market ready: finding clients, scoping and pricing the work, getting a deposit, and protecting yourself.',
      },
      { t: 'analogy', text: 'A freelancer is a tailor. Before cutting any cloth the tailor takes measurements (the **brief**), tells you the price and the day it will be ready (the **quote**), and takes a deposit for the cloth (the **deposit**). A tailor who just starts sewing and names a price at the end ends up with angry customers and empty pockets.' },
      {
        t: 'list',
        items: ['**Where clients are:** businesses that already sell but have no website or only a Facebook page: restaurants, salons, boda stages, pharmacies, schools, churches, SACCOs, hardware shops, event planners. Walk in, show a demo on your phone, and offer a free one-page sample for their own business. Your own portfolio site (the capstone) is your business card. Post finished work on WhatsApp Status.', '**What to sell:** results, not code. "A page that takes bookings by WhatsApp" is easier to buy than "a responsive HTML5 site". Offer 3 packages (for example Starter: one page; Business: five pages and a contact form; Shop: ordering and a menu) and a monthly **care plan** for updates and hosting.', '**How to price:** estimate your hours, multiply by what you want to earn per hour, add the costs (domain, hosting), and add a buffer of about 20% for changes. Never price below what a week of your time is worth. Quote a **fixed price for a clear scope** and charge extra for changes outside it.', '**Get paid safely:** a deposit (commonly half) before you start by Mobile Money, the balance when the work is delivered and **before you hand over the domain and files**. Put it in a short written agreement: what is included, the number of revisions, the deadline, the price, and that the client owns the site after full payment.', '**Taking payments on a site:** collecting Mobile Money from a site\'s visitors needs a **server** and a provider (for example MTN MoMo, Airtel Money, or a gateway such as Pesapal or Flutterwave). The keys must stay on the server. A simpler start for small shops: a button that opens **WhatsApp with the order already typed**, and the customer pays when the order is confirmed.'],
      },
      {
        t: 'web',
        title: 'A WhatsApp order link. Change the message and the number.',
        files: ['js'],
        starter: {
          html: fullPage('  <a id="order" href="#">Order on WhatsApp</a>', { js: true }),
          js: 'const number = "256700000000";\nconst message = "Hello Mama Rose, I want 2 chicken rolex.";\nconst link = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;\ndocument.querySelector("#order").href = link;\nconsole.log(link);\n',
        },
        checks: [{ attr: '#order', name: 'href', contains: 'https://wa.me/256700000000?text=Hello%20Mama%20Rose' }],
      },
      { t: 'tip', text: '`encodeURIComponent` turns spaces and special characters into a form that is safe inside a link (a space becomes `%20`). Without it, a message with `&` or `#` breaks the link. The number goes in international format with **no plus sign and no spaces**: 256700000000.' },
      {
        t: 'mistakes',
        items: [
          { lang: 'js', logic: true, wrong: 'console.log("https://wa.me/256700000000?text=" + "I want 2 & a drink");', why: 'The `&` and spaces are not encoded, so WhatsApp cuts the message at the `&`. Always wrap the text in `encodeURIComponent`.', right: 'console.log("https://wa.me/256700000000?text=" + encodeURIComponent("I want 2 & a drink"));' },
          { lang: 'js', logic: true, wrong: 'const total = 450000;\nconst deposit = total * 50 / 100;\nconsole.log(deposit);', why: 'Money in UGX has no cents, so always round to a whole number, or you may quote "225000.5".', right: 'const total = 450000;\nconst deposit = Math.round(total * 50 / 100);\nconsole.log(deposit);' },
        ],
      },
      { t: 'quiz', question: 'A client says "the price was for a simple page" after you also built three extra pages. What would have protected you?', options: ['A written scope listing exactly what is included, with extra work charged separately', 'Working faster', 'A longer deadline', 'A cheaper price'], answer: 0, explain: 'A clear written scope turns "it was in the price" into a calm conversation: "that was not in the scope, here is a quote for the extra pages".' },
      { t: 'quiz', question: 'When should the client receive the final files and domain?', options: ['After the final payment has been received', 'As soon as the first draft is ready', 'Before the deposit', 'Never'], answer: 0, explain: 'Hand over after the balance is paid. The deposit protects your time at the start; the final payment protects your work at the end.' },
      { t: 'quiz', question: 'Why must Mobile Money API keys never appear in your front-end JavaScript?', options: ['Anyone can read front-end code and use the keys to take money', 'They make the page slow', 'JavaScript cannot store text', 'They are too long'], answer: 0, explain: 'Everything the browser downloads can be read by the visitor. Keys that can move money must stay on a server.' },
      { t: 'recap', items: ['Find clients who already sell but have no site; show a demo; keep a portfolio.', 'Sell results in 3 packages plus a monthly care plan.', 'Price from your hours plus costs plus a buffer. Fixed price for a written scope.', 'Take a deposit first, hand over after the final payment, get it in writing.', 'WhatsApp order links are a simple start; real Mobile Money collection needs a server and keys stay there.'], memory: 'Measure, quote, deposit, deliver, then hand over.' },
    ],
    exercises: [
      {
        id: 'w36-whatsapp-link',
        title: 'The order link',
        prompt: 'Write `orderLink(name, items)` that returns the WhatsApp link for the shop `256700000000`. The message must be:\n\n`Hello Mama Rose, I am NAME. I want: ITEM1, ITEM2`\n\nwhere `items` is a list joined with `", "`. The message goes in the `text` part of the link, safely encoded with `encodeURIComponent`.',
        files: ['js'],
        starter: { js: '// Write orderLink here\n' },
        solution: { js: 'function orderLink(name, items) {\n  const message = `Hello Mama Rose, I am ${name}. I want: ${items.join(", ")}`;\n  return "https://wa.me/256700000000?text=" + encodeURIComponent(message);\n}\n' },
        checks: [{ js: 'orderLink("Amina", ["Plain", "Chicken"]) === "https://wa.me/256700000000?text=" + encodeURIComponent("Hello Mama Rose, I am Amina. I want: Plain, Chicken")', equals: true, label: 'The link is right for Amina and two items' }, { js: 'orderLink("Kato", ["Veggie"]) === "https://wa.me/256700000000?text=" + encodeURIComponent("Hello Mama Rose, I am Kato. I want: Veggie")', equals: true, label: 'The link is right for Kato and one item' }, { js: 'orderLink("Zed", ["A & B"]).includes("%26")', equals: true, label: 'A special character like & is encoded' }, { uses: 'js', pattern: 'encodeURIComponent', label: 'You used encodeURIComponent' }, { uses: 'js', pattern: 'join\\(', label: 'You joined the items with join' }],
        hints: ['First build the message text with a template literal and `items.join(", ")`.', 'Then add it to the link: `"https://wa.me/256700000000?text=" + encodeURIComponent(message)`.', '```\nconst message = `Hello Mama Rose, I am ${name}. I want: ${items.join(", ")}`;\nreturn "https://wa.me/256700000000?text=" + encodeURIComponent(message);\n```'],
      },
      {
        id: 'w36-quote',
        title: 'The quote calculator',
        prompt: 'Write `quote(items, depositPercent)` for a client quote. `items` is a list like `[{ name: "Home page", price: 300000 }]`. Return an object **with these keys in this order**: `total` (the sum of the prices), `deposit` (the deposit, **rounded** to a whole number: `total * depositPercent / 100`) and `balance` (`total - deposit`).',
        files: ['js'],
        starter: { js: '// Write quote here\n' },
        solution: { js: 'function quote(items, depositPercent) {\n  const total = items.reduce((sum, item) => sum + item.price, 0);\n  const deposit = Math.round((total * depositPercent) / 100);\n  return { total, deposit, balance: total - deposit };\n}\n' },
        checks: [{ js: 'quote([{ price: 300000 }, { price: 150000 }], 50)', equals: { total: 450000, deposit: 225000, balance: 225000 }, label: '450,000 with a 50% deposit' }, { js: 'quote([{ price: 1000001 }], 30)', equals: { total: 1000001, deposit: 300000, balance: 700001 }, label: 'The deposit is rounded to a whole number' }, { js: 'quote([], 50)', equals: { total: 0, deposit: 0, balance: 0 }, label: 'An empty quote is all zeros' }, { uses: 'js', pattern: 'reduce\\(', label: 'You used reduce' }, { uses: 'js', pattern: 'Math\\.round', label: 'You rounded the deposit' }],
        hints: ['Three numbers: the total (use `reduce`), the deposit, and the balance.', 'The deposit is `Math.round(total * depositPercent / 100)`. The balance is what is left.', '```\nconst total = items.reduce((sum, item) => sum + item.price, 0);\nconst deposit = Math.round((total * depositPercent) / 100);\nreturn { total, deposit, balance: total - deposit };\n```'],
      },
      {
        id: 'w36-packages',
        title: 'Your three packages',
        prompt: 'Build the pricing table you would show a client:\n\n- a `<table>` with a `<caption>` and a header row with `Package`, `Pages` and `Price (UGX)`\n- three body rows: `Starter`, `Business` and `Shop` (any pages and prices you choose, in UGX)\n- under it, a WhatsApp link with the text `Ask about a package` that goes to `https://wa.me/256700000000` and opens in a new tab safely (`target="_blank"` and `rel="noopener noreferrer"`)',
        files: ['html'],
        starter: { html: '<h2>Website packages</h2>\n' },
        solution: { html: '<h2>Website packages</h2>\n<table>\n  <caption>Website packages</caption>\n  <thead>\n    <tr><th scope="col">Package</th><th scope="col">Pages</th><th scope="col">Price (UGX)</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Starter</td><td>1</td><td>300,000</td></tr>\n    <tr><td>Business</td><td>5</td><td>800,000</td></tr>\n    <tr><td>Shop</td><td>8 + ordering</td><td>1,500,000</td></tr>\n  </tbody>\n</table>\n<p><a href="https://wa.me/256700000000" target="_blank" rel="noopener noreferrer">Ask about a package</a></p>\n' },
        checks: [{ exists: 'table caption' }, { count: 'thead th', equals: 3 }, { text: 'thead th', contains: 'Package', index: 0 }, { text: 'thead th', contains: 'Price', index: 2 }, { count: 'tbody tr', equals: 3 }, { text: 'tbody td', equals: 'Starter', index: 0 }, { text: 'tbody td', equals: 'Business', index: 3 }, { text: 'tbody td', equals: 'Shop', index: 6 }, { attr: 'a', name: 'href', equals: 'https://wa.me/256700000000' }, { text: 'a', equals: 'Ask about a package' }, { attr: 'a', name: 'target', equals: '_blank' }, { attr: 'a', name: 'rel', contains: 'noopener' }, { lint: 'html' }],
        hints: ['A header row in `<thead>` and three rows in `<tbody>`. Each row has three cells.', 'The link needs `href`, `target="_blank"` and `rel="noopener noreferrer"`.', '```\n<tr><td>Starter</td><td>1</td><td>300,000</td></tr>\n```'],
      },
    ],
  },
];
