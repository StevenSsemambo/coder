// Web track, launch-ready extension, group C: content management, websites in many languages, modern CSS part 2.
// Lessons w52 to w54. See docs/WEB-TRACK.md for the roadmap.
// jsdom (the test browser) ignores media and container queries, so those are checked with `uses`; base rules use `style`.
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

const page = (body, o = {}) => fullPage(body, { title: 'Kato Rides', ...o });

// ------------------------------------------------------------------ w52 helpers
const CONTENT = {
  shop: 'Kato Rides',
  prices: [
    { name: 'Parcel in Kampala', price: 5000 },
    { name: 'Shopping errand', price: 8000 },
    { name: 'Airport run', price: 40000 },
  ],
};

const PRICES_HTML = `<h1 id="shop-name">Loading...</h1>
<ul id="prices"></ul>`;

const PRICES_JS = (path) => `const list = document.querySelector("#prices");
const title = document.querySelector("#shop-name");

async function loadContent() {
  try {
    const response = await fetch("${path}");
    if (!response.ok) {
      throw new Error("Could not load");
    }
    const content = await response.json();
    title.textContent = content.shop;
    for (const item of content.prices) {
      const li = document.createElement("li");
      li.textContent = item.name + ": UGX " + item.price.toLocaleString("en-US");
      list.append(li);
    }
  } catch (error) {
    list.textContent = "Prices are not available right now. Please call 0700 123 456.";
  }
}

loadContent();
`;

const PRICES_STARTER_JS = `const list = document.querySelector("#prices");
const title = document.querySelector("#shop-name");

// Load /api/content, show the shop name in the title,
// and add one <li> for each price, like "Parcel in Kampala: UGX 5,000".
`;

const ESCAPE_SOLUTION = String.raw`function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
`;

const MARKDOWN_SOLUTION = String.raw`function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(text) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function markdownToHtml(markdown) {
  const out = [];
  let items = [];

  function flush() {
    if (items.length > 0) {
      out.push("<ul>" + items.join("") + "</ul>");
      items = [];
    }
  }

  for (const raw of markdown.split("\n")) {
    const line = escapeHtml(raw.trim());
    if (line.startsWith("- ")) {
      items.push("<li>" + inline(line.slice(2)) + "</li>");
      continue;
    }
    flush();
    if (line.startsWith("## ")) {
      out.push("<h2>" + inline(line.slice(3)) + "</h2>");
    } else if (line.startsWith("# ")) {
      out.push("<h1>" + inline(line.slice(2)) + "</h1>");
    } else if (line !== "") {
      out.push("<p>" + inline(line) + "</p>");
    }
  }
  flush();
  return out.join("\n");
}
`;

const PUBLISHED_SOLUTION = `function publishedPosts(items) {
  return items
    .filter((item) => item.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));
}
`;

// ------------------------------------------------------------------ w53 helpers
const DICTIONARY_JS = `const dictionary = {
  en: { welcome: "Welcome", order: "Order now", contact: "Contact us" },
  sw: { welcome: "Karibu", order: "Agiza sasa", contact: "Wasiliana nasi" },
  fr: { welcome: "Bienvenue", order: "Commander", contact: "Contactez-nous" },
};
`;

const SWITCHER_HTML = `<nav aria-label="Language">
  <button type="button" id="lang-en" data-lang="en" lang="en">English</button>
  <button type="button" id="lang-sw" data-lang="sw" lang="sw">Kiswahili</button>
  <button type="button" id="lang-fr" data-lang="fr" lang="fr">Fran&ccedil;ais</button>
</nav>
<h1 data-i18n="welcome">Welcome</h1>
<p><a href="#order" data-i18n="order">Order now</a></p>
<p><a href="#contact" data-i18n="contact">Contact us</a></p>`;

const SWITCHER_JS = `${DICTIONARY_JS}
function translate(lang, key) {
  return (dictionary[lang] && dictionary[lang][key]) || dictionary.en[key] || key;
}

function setLanguage(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(lang, element.dataset.i18n);
  });
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

setLanguage(localStorage.getItem("lang") || "en");
`;

const SWITCHER_STARTER_JS = `${DICTIONARY_JS}
function translate(lang, key) {
  return (dictionary[lang] && dictionary[lang][key]) || dictionary.en[key] || key;
}

function setLanguage(lang) {
  // 1. set the page language on <html>
  // 2. save the choice in localStorage under "lang"
  // 3. replace the text of every [data-i18n] element
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});
`;

const T_SOLUTION = `function t(dictionary, lang, key) {
  if (dictionary[lang] && dictionary[lang][key]) {
    return dictionary[lang][key];
  }
  if (dictionary.en && dictionary.en[key]) {
    return dictionary.en[key];
  }
  return key;
}
`;

const FORMAT_PRICE_SOLUTION = `function formatPrice(amount, locale) {
  return new Intl.NumberFormat(locale).format(amount) + " UGX";
}
`;

const RTL_CSS_STARTER = `.note {
  margin-left: 16px;
  padding-right: 8px;
  text-align: left;
  border-left: 4px solid #0b6b4f;
}
`;

const RTL_CSS_SOLUTION = `.note {
  margin-inline-start: 16px;
  padding-inline-end: 8px;
  text-align: start;
  border-inline-start: 4px solid #0b6b4f;
}
`;

// ------------------------------------------------------------------ w54 helpers
const CARD_HTML = `<div class="card-wrap">
  <article class="card">
    <img src="img/rolex.svg" alt="A rolex" width="120" height="80">
    <div class="card-text">
      <h2>Parcel in Kampala</h2>
      <p>From UGX 5,000.</p>
    </div>
  </article>
</div>`;

const NAV_PRINT_HTML = `<nav class="site-nav"><a href="/">Home</a> <a href="/prices.html">Prices</a></nav>
<div class="cookie-banner">We use cookies.</div>
<main>
  <h1>Price list</h1>
  <p>Questions? Visit <a href="https://katorides.co.ug/contact.html">our contact page</a>.</p>
</main>`;

export const launch3Lessons = [
  // ================================================================== w52
  {
    id: 'w52-content-management',
    level: 'Level 6: Launch-ready for any company',
    title: 'Content management: letting the client edit their own site',
    summary: 'Choose between WordPress, site builders, headless CMS and files, load content from JSON safely, and handle Markdown and untrusted text.',
    minutes: 32,
    blocks: [
      {
        t: 'story',
        title: 'Every price change costs a phone call',
        text: 'Kato\'s new site is live. A month later fuel goes up, so his prices change. He phones the developer. A week later the Christmas offer starts. He phones again. Each little text change costs UGX 20,000 and a day\'s wait, and soon Kato wonders why he did not just make a Facebook page.\n\nThis is the most common complaint clients have about hand-coded sites: **\"I cannot change anything myself.\"** The answer is to separate the **content** (words, prices, photos) from the **design** (HTML and CSS), and give the client a safe place to edit the content. That place is called a **CMS**, a **content management system**.',
      },
      { t: 'analogy', text: 'A shop has a window frame and a poster in it. The **frame** is the design: it is built once. The **poster** is the content: it changes every week. A good shop lets the owner swap the poster without calling a carpenter. A CMS is the way to swap the poster.' },
      { t: 'h', text: 'Four kinds of CMS' },
      {
        t: 'list',
        items: [
          '**Traditional CMS (WordPress and similar).** The CMS and the website live together: a login page, an editor, a database (PHP and MySQL for WordPress), themes for design and plugins for extra features. Very popular, so clients and agencies know it, and a huge number of ready-made themes exist. Its needs: hosting that runs PHP and a database, regular updates, backups and attention to security.',
          '**Site builders (Wix, Squarespace, Shopify for online stores, WordPress.com).** No code: the client drags and edits, and the company hosts everything for a monthly fee. Fastest to start, least control, and you can be tied to their prices and limits.',
          '**Headless CMS (Sanity, Strapi, Contentful, Decap CMS and others).** The editor and the content live in one place and your own site fetches the content through an API as JSON. You keep full design freedom and speed. Needs a developer to connect it.',
          '**Files in the project (JSON, Markdown, even a Google Sheet published as data).** The cheapest, fastest and safest for small sites, and fine when the developer or a technical helper makes the edits.',
        ],
      },
      {
        t: 'list',
        items: [
          '**Who edits, and how often?** A client who changes the text every day needs a real editor. One who changes prices twice a year can phone you.',
          '**Does the site sell things online?** Then look at Shopify or WordPress with WooCommerce, and mobile payments (Lesson 36).',
          '**What is the budget for hosting and for yearly maintenance?** A \"free\" CMS still needs updates and backups.',
          '**Who keeps it secure?** Anything with a login and a database is attacked by robots every day. Plan updates, strong passwords and backups, or choose something that has no login at all.',
          'Write the choice and its reasons into your proposal, so the client understands what they are buying.',
        ],
      },
      { t: 'tip', text: 'WordPress needs a real server with PHP and a database, so it cannot run inside this app. That is why this lesson teaches the idea underneath it: content lives in data, and the page is built from the data. Everything you learn here works the same way when the data comes from WordPress, a headless CMS or a JSON file.' },
      { t: 'h', text: 'A JSON file as a CMS' },
      { t: 'p', text: 'The page below has no prices in its HTML. It asks for a content file, and builds the list from whatever it finds. Change the file and the page changes, with no HTML edits. (In the lesson the pretend server answers at `/api/content`; on a real site it would be a file such as `content.json`, or a CMS address.)' },
      {
        t: 'web',
        title: 'Prices built from content. Look at the HTML: it has an empty list.',
        files: ['js'],
        assets: ASSETS,
        api: { '/api/content': CONTENT },
        starter: { html: page(PRICES_HTML, { js: true }), js: PRICES_JS('/api/content') },
        checks: [
          { do: 'wait', ms: 80 },
          { text: '#shop-name', equals: 'Kato Rides', label: 'The shop name comes from the content' },
          { count: '#prices li', equals: 3, label: 'One list item for each price' },
          { js: 'document.querySelector("#prices li").textContent', equals: 'Parcel in Kampala: UGX 5,000' },
          { noErrors: true },
        ],
      },
      {
        t: 'see',
        files: { html: page(PRICES_HTML, { js: true }), js: PRICES_JS('/api/missing') },
        api: { '/api/content': CONTENT },
        question: 'Now the page asks for `/api/missing`, which the server does not have (it answers 404). What does the visitor see in the price list?',
        options: ['Prices are not available right now. Please call 0700 123 456.', 'An empty list and nothing else', 'The page stays on Loading... for ever', 'A broken page with an error code'],
        answer: 0,
        explain: 'The code checks `response.ok` and throws on a bad answer, and the `catch` block shows a helpful message with a phone number. A content-driven page must ALWAYS plan for the content failing to load.',
        proof: [{ do: 'wait', ms: 80 }, { text: '#prices', contains: 'not available right now' }],
      },
      { t: 'h', text: 'Content design: types and fields' },
      {
        t: 'list',
        items: [
          'List the **content types** the site needs: Page, Service, Product, Post, Testimonial, Team member.',
          'Give each type **fields**: a Service has a `name`, a `price`, a `description` and an `image` with `alt` text. Making `alt` a required field is how you keep a site accessible after you leave.',
          'Add a **status** (`draft` or `published`) and a **date**, so the client can prepare a post and publish it later.',
          'Use a **slug**, the short part of the address (`/services/airport-run`), instead of a number.',
          'Decide what the client may change and what is fixed. Editors should never be able to break the layout.',
        ],
      },
      { t: 'h', text: 'Markdown: simple formatting that editors love' },
      { t: 'p', text: 'Many CMSs store text as **Markdown**: plain text with light marks. `# Title` is a main heading, `## Heading` a smaller one, `- item` a list item, and `**bold**` is bold. Your page turns it into HTML. Here is the smallest possible converter for one line:' },
      {
        t: 'try',
        code: 'function line(markdown) {\n  if (markdown.startsWith("## ")) return "<h2>" + markdown.slice(3) + "</h2>";\n  if (markdown.startsWith("# ")) return "<h1>" + markdown.slice(2) + "</h1>";\n  return "<p>" + markdown + "</p>";\n}\n\nconsole.log(line("# Prices"));\nconsole.log(line("## Parcels"));\nconsole.log(line("Same-day delivery."));',
        output: '<h1>Prices</h1>\n<h2>Parcels</h2>\n<p>Same-day delivery.</p>',
      },
      { t: 'h', text: 'Never trust content blindly' },
      { t: 'p', text: 'Anyone with an editor login, or a stolen password, can type a `<script>` tag into a CMS field. If your page inserts that text with `innerHTML`, the script runs for every visitor (Lesson 33, cross-site scripting). The safe habits: put content in with `textContent`, which shows text as text, or **escape** it first.' },
      {
        t: 'try',
        code: 'function escapeHtml(text) {\n  return text\n    .replace(/&/g, "&amp;")\n    .replace(/</g, "&lt;")\n    .replace(/>/g, "&gt;")\n    .replace(/"/g, "&quot;");\n}\n\nconsole.log(escapeHtml(\'<b>Hi</b> & "bye"\'));',
        output: '&lt;b&gt;Hi&lt;/b&gt; &amp; &quot;bye&quot;',
      },
      {
        t: 'predict',
        code: 'function escapeHtml(text) {\n  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");\n}\nconsole.log(escapeHtml("a < b & c"));',
        question: 'What does this print?',
        options: ['a &lt; b &amp; c', 'a < b & c', 'a &amp;lt; b &amp; c', 'a &lt; b & c'],
        answer: 0,
        explain: 'Both replacements run. `&` becomes `&amp;` first, and then `<` becomes `&lt;`. Order matters: if `<` were changed first, its new `&` would be changed again into `&amp;lt;`, which is the third option.',
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: 'li.innerHTML = item.name + ": UGX " + item.price;', why: 'If `item.name` contains `<img src=x onerror=...>`, the browser runs it. Insert content as text, not as HTML.', right: 'li.textContent = item.name + ": UGX " + item.price;' },
          { lang: 'dom', wrong: 'const content = await fetch("/api/content").then((r) => r.json());\ntitle.textContent = content.shop;', why: 'There is no check that the content loaded. When the server is down, `r.json()` throws, nothing catches it, and the page stays on \"Loading...\" for ever. Check `response.ok` and show a helpful message.', right: 'try {\n  const response = await fetch("/api/content");\n  if (!response.ok) throw new Error("Could not load");\n  const content = await response.json();\n  title.textContent = content.shop;\n} catch (error) {\n  title.textContent = "Please call 0700 123 456";\n}' },
          { lang: 'html', wrong: '<img src="img/rolex.svg">', why: 'Content images need an `alt` text, and in a CMS the editor must be forced to fill it in. An image with no alt is invisible to a blind visitor.', right: '<img src="img/rolex.svg" alt="A hot rolex wrapped in a chapati">', logic: true },
          { lang: 'dom', wrong: '<li>Parcel in Kampala: UGX 5,000</li>\n<!-- and the same price again inside content.json -->', why: 'The price is typed in two places, so one of them will soon be out of date. Keep each fact in ONE place and build everything else from it.', right: '<ul id="prices"></ul>\n<!-- the list is built from content.json -->' },
        ],
      },
      {
        t: 'quiz',
        question: 'A client edits her restaurant menu every morning and also wants to sell vouchers online. Which choice is most sensible?',
        options: ['A real CMS or store platform with an editor, chosen with the client\'s budget and maintenance in mind', 'Hand-edited HTML that she emails to you', 'A JSON file she edits in a text editor', 'No website at all'],
        answer: 0,
        explain: 'Frequent edits and online sales need an editor she can use herself, and a store that handles payments safely. Choose and explain the trade-offs in your proposal.',
      },
      {
        t: 'quiz',
        question: 'Why use `element.textContent = text` instead of `element.innerHTML = text` for content that people can edit?',
        options: ['textContent shows the text as text, so a hidden script cannot run', 'textContent is faster to type', 'innerHTML does not work with fetch', 'textContent adds colour'],
        answer: 0,
        explain: '`innerHTML` turns the text into real HTML, including scripts and event handlers. `textContent` never does.',
      },
      { t: 'recap', items: ['A CMS separates content (words, prices, photos) from design, so the client can edit safely.', 'Four kinds: traditional (WordPress), site builders (Wix, Shopify), headless CMS (content through an API), and files in the project (JSON, Markdown). Choose by who edits, how often, selling online, budget and security care.', 'A page built from content must plan for the content failing to load: check `response.ok` and show a helpful message.', 'Design the content: types, fields, required alt text, status (draft or published), dates and slugs.', 'Markdown is simple formatted text that your code turns into HTML.', 'Never insert editable text with `innerHTML`. Use `textContent`, or escape it. Keep each fact in one place.'] },
    ],
    exercises: [
      {
        id: 'w52-render-prices',
        title: 'Build the price list from content',
        prompt: 'The HTML has an empty `<ul id="prices">` and a heading `#shop-name`. Write the JavaScript: `fetch("/api/content")`, read the JSON, put `content.shop` in `#shop-name`, and add one `<li>` for each item in `content.prices`, with the text `NAME: UGX PRICE` (use `item.price.toLocaleString("en-US")` for the commas). Use `textContent`, not `innerHTML`.',
        files: ['js'],
        assets: ASSETS,
        api: { '/api/content': CONTENT },
        starter: { html: page(PRICES_HTML, { js: true }), js: PRICES_STARTER_JS },
        solution: { html: page(PRICES_HTML, { js: true }), js: PRICES_JS('/api/content') },
        checks: [
          { do: 'wait', ms: 80 },
          { text: '#shop-name', equals: 'Kato Rides' },
          { count: '#prices li', equals: 3, label: 'There is one list item for each price' },
          { js: 'document.querySelector("#prices li").textContent', equals: 'Parcel in Kampala: UGX 5,000' },
          { js: 'document.querySelectorAll("#prices li")[2].textContent', equals: 'Airport run: UGX 40,000', label: 'Big numbers get commas' },
          { uses: 'js', pattern: 'textContent', label: 'You used textContent' },
          { noErrors: true },
        ],
        hints: ['Start with `const response = await fetch("/api/content");` inside an `async` function, then `const content = await response.json();`.', 'Loop with `for (const item of content.prices)`. In the loop make an element with `document.createElement("li")`, set its `textContent`, and add it with `list.append(li)`.', '```\nli.textContent = item.name + ": UGX " + item.price.toLocaleString("en-US");\nlist.append(li);\n```'],
      },
      {
        id: 'w52-escape-html',
        title: 'Escape untrusted text',
        prompt: 'Write `escapeHtml(text)`. It returns the text with these four characters replaced, so it can be shown safely: `&` becomes `&amp;`, `<` becomes `&lt;`, `>` becomes `&gt;`, and `"` becomes `&quot;`. Replace `&` FIRST.',
        files: ['js'],
        starter: { js: '// Write escapeHtml(text)\n' },
        solution: { js: ESCAPE_SOLUTION },
        checks: [
          { js: 'escapeHtml("<b>Hi</b>")', equals: '&lt;b&gt;Hi&lt;/b&gt;' },
          { js: 'escapeHtml("Tom & Jerry")', equals: 'Tom &amp; Jerry' },
          { js: 'escapeHtml(\'say "hi"\')', equals: 'say &quot;hi&quot;' },
          { js: 'escapeHtml("5 < 6")', equals: '5 &lt; 6' },
          { js: 'escapeHtml("<")', equals: '&lt;', label: 'Ampersands are replaced first, so the new ones are not changed again', hidden: true },
          { js: 'escapeHtml("plain text")', equals: 'plain text', hidden: true },
        ],
        hints: ['Use `.replace(/&/g, "&amp;")`. The `g` after the slash means \"every one\", not just the first.', 'Chain four `.replace(...)` calls, one after another, one for each character.', 'Order matters: do the `&` replacement FIRST, otherwise the `&` in `&lt;` would itself be replaced.'],
      },
      {
        id: 'w52-markdown',
        title: 'A small Markdown converter',
        prompt: 'Write `markdownToHtml(markdown)`. Go through the lines:\n\n- `# text` becomes `<h1>text</h1>` and `## text` becomes `<h2>text</h2>`\n- Consecutive lines starting with `- ` become ONE `<ul>` with one `<li>` per line\n- Any other non-empty line becomes `<p>text</p>`; empty lines are skipped\n- `**word**` inside a line becomes `<strong>word</strong>`\n- Escape `&`, `<` and `>` in the text first\n\nJoin the finished blocks with a new line (`"\\n"`).',
        files: ['js'],
        starter: { js: '// Write markdownToHtml(markdown)\n' },
        solution: { js: MARKDOWN_SOLUTION },
        checks: [
          { js: 'markdownToHtml("# Prices")', equals: '<h1>Prices</h1>' },
          { js: 'markdownToHtml("## Parcels")', equals: '<h2>Parcels</h2>' },
          { js: 'markdownToHtml("- Sugar\\n- Rice")', equals: '<ul><li>Sugar</li><li>Rice</li></ul>', label: 'List lines are grouped into one list' },
          { js: 'markdownToHtml("# Prices\\n\\n- Sugar 4500\\n- Rice 3000\\n\\nCall **now**")', equals: '<h1>Prices</h1>\n<ul><li>Sugar 4500</li><li>Rice 3000</li></ul>\n<p>Call <strong>now</strong></p>', label: 'A whole document works' },
          { js: 'markdownToHtml("5 < 6")', equals: '<p>5 &lt; 6</p>', label: 'Text is escaped', hidden: true },
          { js: 'markdownToHtml("- a\\ntext\\n- b")', equals: '<ul><li>a</li></ul>\n<p>text</p>\n<ul><li>b</li></ul>', label: 'A paragraph ends a list', hidden: true },
        ],
        hints: ['Split the text into lines with `markdown.split("\\n")` and loop. Keep an array `out` for finished blocks and an array `items` for list items waiting to be closed.', 'When a line starts with `- `, push an `<li>` into `items` and continue. For any other line, first close the list: if `items` is not empty, push `"<ul>" + items.join("") + "</ul>"` and empty `items`. Close it again after the loop.', 'The bold marks need a regular expression: `text.replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>")`.'],
      },
      {
        id: 'w52-published-posts',
        title: 'Show only published posts',
        prompt: 'Write `publishedPosts(items)`. Each item looks like `{ title: "...", status: "published", date: "2026-11-30" }`. Return only the items whose `status` is `"published"`, with the newest `date` first. (Dates written as year-month-day sort correctly as text.)',
        files: ['js'],
        starter: { js: '// Write publishedPosts(items)\n' },
        solution: { js: PUBLISHED_SOLUTION },
        checks: [
          { js: 'JSON.stringify(publishedPosts([{ title: "A", status: "published", date: "2026-01-05" }, { title: "B", status: "draft", date: "2026-03-01" }, { title: "C", status: "published", date: "2026-02-10" }]).map((p) => p.title))', equals: '["C","A"]', label: 'Drafts are hidden and the newest comes first' },
          { js: 'publishedPosts([]).length', equals: 0, label: 'An empty list gives an empty list' },
          { js: 'publishedPosts([{ title: "Draft", status: "draft", date: "2026-05-05" }]).length', equals: 0, label: 'Only drafts gives nothing' },
          { js: 'JSON.stringify(publishedPosts([{ title: "X", status: "published", date: "2025-12-31" }, { title: "Y", status: "published", date: "2026-01-01" }]).map((p) => p.title))', equals: '["Y","X"]', hidden: true },
        ],
        hints: ['First keep only the published ones with `items.filter(...)`, then order them with `.sort(...)`.', 'The filter test is `item.status === "published"`.', 'To put the newest first compare the dates backwards: `.sort((a, b) => b.date.localeCompare(a.date))`.'],
      },
    ],
  },

  // ================================================================== w53
  {
    id: 'w53-multilingual-sites',
    level: 'Level 6: Launch-ready for any company',
    title: 'Websites in many languages',
    summary: 'Serve visitors in English, Kiswahili and more: the lang attribute, hreflang, translation dictionaries, a language switcher, right-to-left text and local number and date formats.',
    minutes: 32,
    blocks: [
      {
        t: 'story',
        title: 'The hotel with guests from five countries',
        text: 'A small hotel in Jinja asks Rose\'s cousin Grace for a website. Their guests come from Uganda, Kenya, Rwanda, France and Saudi Arabia. A booking in English is fine for many, but a Kenyan trader finds Kiswahili easier, and a French family would feel welcomed by a line in their own language.\n\nA website that speaks the visitor\'s language earns trust and sales, and in East Africa it is a real advantage: many customers work in two or three languages every day. This lesson shows the technical side, so the words can be right and the page can behave correctly in each language. (The words in these lessons are short examples. For a real client, pay a native speaker to translate and review.)',
      },
      { t: 'analogy', text: 'A multilingual site is like a hotel front desk with name badges that say \"English, Kiswahili, Fran\u00e7ais\". The guest points to the badge they trust, and the person behind the desk (the page) switches language and remembers it for the rest of the stay.' },
      { t: 'h', text: 'Tell the browser what language the page speaks' },
      {
        t: 'list',
        items: [
          '`<html lang="en">` says what language the page is written in. Screen readers pick the right voice and pronunciation from it, browsers offer correct hyphenation and spell checks, and search engines understand your content.',
          'Mark any **other** language inside the page too: `<span lang="sw">Karibu</span>`. Without it, an English screen reader mispronounces the Kiswahili word.',
          'Use proper language codes: `en`, `sw` (Kiswahili), `fr`, `ar`, `lg` (Luganda). Add a country if it matters: `en-UG`, `sw-KE`.',
          'Write each language\'s name **in its own language**: English, Kiswahili, Fran\u00e7ais. Never use a flag for a language: flags are countries, and Kiswahili is spoken in several countries (and some countries speak several languages).',
        ],
      },
      { t: 'h', text: 'Help search engines serve the right version' },
      {
        t: 'list',
        items: [
          'Give each language its **own address**: `/en/`, `/sw/`, `/fr/` (or separate domains). A page that changes language without changing the address cannot be found in that language.',
          'Link the versions together in the `<head>` with `hreflang` tags, and name a default: `<link rel="alternate" hreflang="sw" href="https://hotel.example/sw/">` and `<link rel="alternate" hreflang="x-default" href="https://hotel.example/">`.',
          'Do not use automatic redirects based only on the visitor\'s location. A French person in Kampala should still get French. Offer a visible switcher.',
        ],
      },
      { t: 'h', text: 'Keep translations in a dictionary' },
      { t: 'p', text: 'Never write translations all over your HTML. Keep them in one **dictionary**: an object with one entry per language, and mark each translated element with a `data-i18n` key (\"i18n\" is short for \"internationalisation\": an i followed by 18 letters and an n). The code looks up each key, and **falls back** to English when a translation is missing, so the page is never blank.' },
      {
        t: 'web',
        title: 'A language switcher. Press the three buttons and watch the words, the lang attribute and the saved choice change.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(SWITCHER_HTML, { js: true }), js: SWITCHER_JS },
        checks: [
          { text: 'h1', equals: 'Welcome', label: 'The page starts in English' },
          { do: 'click', target: '#lang-sw' },
          { text: 'h1', equals: 'Karibu', label: 'Kiswahili shows Karibu' },
          { attr: 'html', name: 'lang', equals: 'sw', label: 'The page language is updated' },
          { js: 'localStorage.getItem("lang")', equals: 'sw', label: 'The choice is remembered' },
          { do: 'click', target: '#lang-fr' },
          { text: 'h1', equals: 'Bienvenue' },
          { text: 'a[href="#order"]', equals: 'Commander' },
        ],
      },
      {
        t: 'see',
        files: { html: page(SWITCHER_HTML, { js: true }), js: SWITCHER_JS },
        question: 'A visitor clicks `Kiswahili`. Which attribute on `<html>` must change so a screen reader switches its voice?',
        options: ['lang', 'dir', 'class', 'hreflang'],
        answer: 0,
        explain: 'The `lang` attribute on the `<html>` element names the language of the page. The code sets it with `document.documentElement.lang`. (`dir` is for the direction of writing, and `hreflang` belongs to links.)',
        proof: [{ do: 'click', target: '#lang-sw' }, { attr: 'html', name: 'lang', equals: 'sw' }],
      },
      { t: 'h', text: 'Numbers, money and dates look different in each place' },
      { t: 'p', text: 'One million two hundred and fifty thousand is `1,250,000` in English, `1.250.000` in German, and `12,50,000` in India. Dates differ even more. The browser knows all of this. The `Intl` tools format for you, so you do not guess:' },
      {
        t: 'try',
        code: 'const amount = 1250000;\nconsole.log(new Intl.NumberFormat("en-US").format(amount));\nconsole.log(new Intl.NumberFormat("de-DE").format(amount));\nconsole.log(new Intl.NumberFormat("en-IN").format(amount));',
        output: '1,250,000\n1.250.000\n12,50,000',
      },
      {
        t: 'try',
        code: 'const day = new Date(Date.UTC(2026, 11, 25));\nconst options = { dateStyle: "long", timeZone: "UTC" };\nconsole.log(new Intl.DateTimeFormat("en-GB", options).format(day));\nconsole.log(new Intl.DateTimeFormat("sw", options).format(day));\nconsole.log(new Intl.DateTimeFormat("en-US", options).format(day));',
        output: '25 December 2026\n25 Desemba 2026\nDecember 25, 2026',
      },
      {
        t: 'predict',
        code: 'console.log(new Intl.NumberFormat("de-DE").format(4500));',
        question: 'What does this print?',
        options: ['4.500', '4,500', '4500', '4 500'],
        answer: 0,
        explain: 'German uses a dot to group thousands. The same number reads `4,500` in English. Never build numbers by hand with commas when `Intl` can do it for the visitor\'s language.',
      },
      { t: 'h', text: 'Languages that read right to left' },
      { t: 'p', text: 'Arabic, Hebrew and some other languages are written from right to left. Add `dir="rtl"` to the page or the block, and the browser reverses the direction of text and many layouts. Then use **logical properties** in CSS: `margin-inline-start` instead of `margin-left`, `padding-inline-end` instead of `padding-right`, `text-align: start` instead of `left`. \"Start\" means the left in English and the right in Arabic, so one stylesheet works for both.' },
      {
        t: 'web',
        title: 'An Arabic greeting in a block that reads right to left, styled with logical properties.',
        files: ['html', 'css'],
        assets: ASSETS,
        starter: { html: page('<h1>Welcome</h1>\n<p lang="ar" dir="rtl" class="note">\u0645\u0631\u062d\u0628\u0627 \u0628\u0643\u0645</p>', { css: true }), css: RTL_CSS_SOLUTION },
        checks: [{ attr: 'p[lang="ar"]', name: 'dir', equals: 'rtl' }, { uses: 'css', pattern: 'margin-inline-start' }, { uses: 'css', pattern: 'text-align:\\s*start' }],
      },
      { t: 'h', text: 'Practical rules for a multilingual site' },
      {
        t: 'list',
        items: [
          'Plan for **longer text**. French and German words are often 30 percent longer than English, so buttons and menus must grow, not overflow.',
          'Do not put text inside images. It cannot be translated or read aloud.',
          'Translate **meaning**, not word for word, and keep the same words for the same things (consistent terms).',
          'Machine translation is useful for a first draft only. A native speaker must read the final text, especially prices, terms and legal pages.',
          'Keep the default language complete and show it when a translation is missing.',
          'Test every language: the longest text, right-to-left, and a screen reader if you can.',
        ],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<p>Our guests say <q>Karibu</q> when they arrive.</p>', why: 'The Kiswahili word sits inside English text with no language mark, so a screen reader pronounces it as English. Wrap it in `<span lang="sw">`.', right: '<p>Our guests say <q><span lang="sw">Karibu</span></q> when they arrive.</p>', logic: true },
          { lang: 'html', wrong: '<button><img src="uk-flag.png" alt="">English</button>', why: 'A flag stands for a country, not a language. Use the language\'s name written in that language, for example `English` or `Kiswahili`.', right: '<button type="button" lang="en">English</button>', logic: true },
          { lang: 'dom', wrong: 'element.textContent = dictionary[lang][key];', why: 'If `lang` has no entry or the key is missing, this throws an error or shows `undefined`. Fall back to English, and finally to the key itself.', right: 'element.textContent = (dictionary[lang] && dictionary[lang][key]) || dictionary.en[key] || key;' },
          { lang: 'dom', wrong: 'const price = amount.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");', why: 'Hand-made grouping is always English-style and breaks for other places. Use `Intl.NumberFormat(locale).format(amount)`.', right: 'const price = new Intl.NumberFormat(locale).format(amount);' },
        ],
      },
      {
        t: 'quiz',
        question: 'Why does `<span lang="sw">Karibu</span>` matter inside an English page?',
        options: ['A screen reader switches to a Kiswahili voice for that word', 'It translates the word automatically', 'It changes the text colour', 'It makes the word a link'],
        answer: 0,
        explain: 'The `lang` attribute only labels the language, but the label is what lets screen readers, translation tools and search engines treat the word correctly.',
      },
      {
        t: 'quiz',
        question: 'Which CSS makes one stylesheet work for both English and Arabic layouts?',
        options: ['margin-inline-start and text-align: start', 'margin-left and text-align: left', 'float: left', 'position: absolute; left: 0'],
        answer: 0,
        explain: 'Logical properties follow the direction of the text, so \"start\" is the left in English and the right in Arabic. Physical `left` and `right` never change.',
      },
      { t: 'recap', items: ['Set `lang` on `<html>` and on any foreign words inside the page. Use language codes (`en`, `sw`, `fr`, `ar`) and write language names in their own language, never as flags.', 'Give each language its own address and link them with `hreflang` tags (plus `x-default`). Offer a visible switcher instead of guessing from the visitor\'s location.', 'Keep translations in one dictionary with `data-i18n` keys, and fall back to English when a translation is missing. Save the visitor\'s choice in `localStorage`.', 'Let `Intl.NumberFormat` and `Intl.DateTimeFormat` write numbers and dates for each place.', 'For right-to-left languages use `dir="rtl"` and logical CSS properties (`margin-inline-start`, `text-align: start`).', 'Plan for longer text, never put text in images, and have a native speaker review the real words.'] },
    ],
    exercises: [
      {
        id: 'w53-lang-markup',
        title: 'Label the languages',
        prompt: 'This page is in English, but it mentions a Kiswahili greeting and has a Kiswahili version at `https://hotel.example/sw/`. Fix the HTML:\n\n- Wrap the word `Karibu` in `<span lang="sw">`.\n- In the `<head>`, add three alternate links: `hreflang="en"` to `https://hotel.example/`, `hreflang="sw"` to `https://hotel.example/sw/`, and `hreflang="x-default"` to `https://hotel.example/`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<h1>Lake Hotel Jinja</h1>\n<p>Our guests say Karibu when they arrive.</p>', { title: 'Lake Hotel Jinja' }) },
        solution: { html: page('<h1>Lake Hotel Jinja</h1>\n<p>Our guests say <span lang="sw">Karibu</span> when they arrive.</p>', { title: 'Lake Hotel Jinja', head: '\n  <link rel="alternate" hreflang="en" href="https://hotel.example/">\n  <link rel="alternate" hreflang="sw" href="https://hotel.example/sw/">\n  <link rel="alternate" hreflang="x-default" href="https://hotel.example/">' }) },
        checks: [
          { text: 'span[lang="sw"]', equals: 'Karibu', label: 'The Kiswahili word is marked' },
          { attr: 'link[hreflang="en"]', name: 'href', equals: 'https://hotel.example/' },
          { attr: 'link[hreflang="sw"]', name: 'href', equals: 'https://hotel.example/sw/', label: 'The Kiswahili version is linked' },
          { attr: 'link[hreflang="x-default"]', name: 'href', equals: 'https://hotel.example/', label: 'A default version is named' },
          { attr: 'link[rel="alternate"][hreflang="sw"]', name: 'rel', equals: 'alternate' },
          { lint: 'html' },
        ],
        hints: ['A language mark goes on the smallest piece that is in another language: `<span lang="sw">Karibu</span>`.', 'The three links go inside `<head>`, one after another. They are all `rel="alternate"` and differ in `hreflang` and `href`.', '```\n<link rel="alternate" hreflang="sw" href="https://hotel.example/sw/">\n```'],
      },
      {
        id: 'w53-translate',
        title: 'Look up a translation, with a fallback',
        prompt: 'Write `t(dictionary, lang, key)`. Return `dictionary[lang][key]` when it exists. If the language or the key is missing, fall back to the English text `dictionary.en[key]`. If that is missing too, return the `key` itself.',
        files: ['js'],
        starter: { js: '// Write t(dictionary, lang, key)\n' },
        solution: { js: T_SOLUTION },
        checks: [
          { js: 't({ en: { hi: "Welcome" }, sw: { hi: "Karibu" } }, "sw", "hi")', equals: 'Karibu' },
          { js: 't({ en: { hi: "Welcome" }, sw: {} }, "sw", "hi")', equals: 'Welcome', label: 'A missing translation falls back to English' },
          { js: 't({ en: { hi: "Welcome" } }, "fr", "hi")', equals: 'Welcome', label: 'A missing language falls back to English' },
          { js: 't({ en: { hi: "Welcome" } }, "en", "bye")', equals: 'bye', label: 'A missing key returns the key' },
          { js: 't({ en: {} }, "sw", "x")', equals: 'x', hidden: true },
        ],
        hints: ['Three cases, in order: the wanted translation, the English one, then the key.', 'Check that the language object exists before reading from it: `dictionary[lang] && dictionary[lang][key]`.', '```\nif (dictionary[lang] && dictionary[lang][key]) {\n  return dictionary[lang][key];\n}\n```'],
      },
      {
        id: 'w53-switcher',
        title: 'Make the switcher work',
        prompt: 'The dictionary, the buttons and the `translate` function are ready. Finish `setLanguage(lang)`:\n\n1. Set `document.documentElement.lang` to the language.\n2. Save the choice with `localStorage.setItem("lang", lang)`.\n3. For every element with a `data-i18n` attribute, set its `textContent` to `translate(lang, element.dataset.i18n)`.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(SWITCHER_HTML, { js: true }), js: SWITCHER_STARTER_JS },
        solution: { html: page(SWITCHER_HTML, { js: true }), js: SWITCHER_JS },
        checks: [
          { do: 'click', target: '#lang-sw' },
          { text: 'h1', equals: 'Karibu', label: 'Kiswahili changes the heading' },
          { text: 'a[href="#contact"]', equals: 'Wasiliana nasi', label: 'Every translated element changes' },
          { attr: 'html', name: 'lang', equals: 'sw', label: 'The page language is updated' },
          { js: 'localStorage.getItem("lang")', equals: 'sw', label: 'The choice is saved' },
          { do: 'click', target: '#lang-en' },
          { text: 'h1', equals: 'Welcome', label: 'English comes back' },
          { attr: 'html', name: 'lang', equals: 'en' },
        ],
        hints: ['`document.documentElement` is the `<html>` element, and its `lang` property sets the attribute.', '`document.querySelectorAll("[data-i18n]")` finds every element that needs translating. Loop over it with `forEach`.', '```\ndocument.querySelectorAll("[data-i18n]").forEach((element) => {\n  element.textContent = translate(lang, element.dataset.i18n);\n});\n```'],
      },
      {
        id: 'w53-format-price',
        title: 'Prices for each visitor',
        prompt: 'Write `formatPrice(amount, locale)`. It formats the number for that locale with `new Intl.NumberFormat(locale).format(amount)` and adds a space and `UGX` after it.\n\nFor example `formatPrice(1250000, "en-US")` is `1,250,000 UGX` and `formatPrice(1250000, "de-DE")` is `1.250.000 UGX`.',
        files: ['js'],
        starter: { js: '// Write formatPrice(amount, locale)\n' },
        solution: { js: FORMAT_PRICE_SOLUTION },
        checks: [
          { js: 'formatPrice(1250000, "en-US")', equals: '1,250,000 UGX' },
          { js: 'formatPrice(1250000, "de-DE")', equals: '1.250.000 UGX', label: 'German grouping uses dots' },
          { js: 'formatPrice(4500, "en-US")', equals: '4,500 UGX' },
          { js: 'formatPrice(1250000, "en-IN")', equals: '12,50,000 UGX', hidden: true },
          { js: 'formatPrice(0, "en-US")', equals: '0 UGX', hidden: true },
        ],
        hints: ['`new Intl.NumberFormat(locale)` makes a formatter for the locale. Its `.format(amount)` gives the text.', 'Join the result and the currency with `+ " UGX"`.', '```\nreturn new Intl.NumberFormat(locale).format(amount) + " UGX";\n```'],
      },
      {
        id: 'w53-logical-css',
        title: 'One stylesheet for both directions',
        prompt: 'This note box uses `left` and `right` properties, so it looks wrong when the text direction is reversed. Rewrite the CSS with logical properties:\n\n- `margin-left` becomes `margin-inline-start`\n- `padding-right` becomes `padding-inline-end`\n- `text-align: left` becomes `text-align: start`\n- `border-left` becomes `border-inline-start`',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page('<p class="note">Welcome</p>\n<p class="note" lang="ar" dir="rtl">\u0645\u0631\u062d\u0628\u0627</p>', { css: true }), css: RTL_CSS_STARTER },
        solution: { html: page('<p class="note">Welcome</p>\n<p class="note" lang="ar" dir="rtl">\u0645\u0631\u062d\u0628\u0627</p>', { css: true }), css: RTL_CSS_SOLUTION },
        checks: [
          { uses: 'css', pattern: 'margin-inline-start:\\s*16px', label: 'margin-inline-start is used' },
          { uses: 'css', pattern: 'padding-inline-end:\\s*8px', label: 'padding-inline-end is used' },
          { uses: 'css', pattern: 'text-align:\\s*start', label: 'text-align is start' },
          { uses: 'css', pattern: 'border-inline-start:\\s*4px\\s+solid\\s+#0b6b4f', label: 'border-inline-start is used' },
          { uses: 'css', pattern: '^(?![\\s\\S]*(margin-left|padding-right|border-left))', label: 'No left or right properties remain' },
        ],
        hints: ['Change only the property names and keep the values. `inline` means \"along the line of text\"; `start` and `end` are the two ends of the line.', 'A few of them in full: `margin-inline-start`, `padding-inline-end`, `border-inline-start`.', '```\n.note {\n  margin-inline-start: 16px;\n  padding-inline-end: 8px;\n  text-align: start;\n  border-inline-start: 4px solid #0b6b4f;\n}\n```'],
      },
    ],
  },

  // ================================================================== w54
  {
    id: 'w54-modern-css-2',
    level: 'Level 2: CSS',
    title: 'Modern CSS, part 2: container queries, nesting, layers and more',
    summary: 'Components that adapt to the space they have, tidier nested rules, a predictable cascade, a parent selector, safe progressive enhancement and print styles.',
    minutes: 30,
    blocks: [
      {
        t: 'story',
        title: 'The card that does not fit',
        text: 'Grace builds a service card: a picture on the left and text on the right. It looks perfect in the wide main column. Then the client asks for the same card in the narrow sidebar, and the picture squeezes the text into a thin strip.\n\nShe tries a media query, but a media query only knows the width of the **whole screen**, not the width of the **box the card sits in**. On a wide screen the sidebar is still narrow, and the media query says \"plenty of room!\". In the last few years CSS has gained answers to exactly this kind of problem. This lesson covers the modern features you will meet in professional code. Each one is a small idea.',
      },
      { t: 'tip', text: 'All of these work in current versions of the main browsers, but very old phones may lack some of them. Look up a feature on caniuse.com before you depend on it, and always write the basic rule first so that an old browser still shows a usable page (this is **progressive enhancement**). The test browser in these lessons ignores some of these rules, so several checks look at your CSS text instead.' },
      { t: 'h', text: 'Container queries: respond to the space you have' },
      { t: 'p', text: 'Name a parent as a **container**, then write rules that depend on the **container\'s** width instead of the screen\'s. The same card now adapts in any column.' },
      {
        t: 'code',
        text: '.card-wrap {\n  container-type: inline-size;\n}\n\n.card {\n  display: block;\n}\n\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n    gap: 16px;\n  }\n}',
      },
      { t: 'analogy', text: 'A media query is a **dress code based on the weather outside the building**. A container query is a **dress code based on the size of the room you walk into**. A card in a small room folds up, whatever the weather is.' },
      { t: 'h', text: 'Nesting: keep related rules together' },
      {
        t: 'code',
        text: '.card {\n  padding: 16px;\n\n  & h2 {\n    margin: 0;\n  }\n\n  &:hover {\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  }\n}',
      },
      { t: 'p', text: '`&` means \"the parent selector\". `& h2` is `.card h2`, and `&:hover` is `.card:hover`. Nesting saves typing the same name again and again and keeps everything about a card in one place. (Do not nest more than two or three levels, or you build rules that are hard to override.)' },
      { t: 'h', text: 'Layers: the cascade you can control' },
      { t: 'p', text: 'When two rules disagree, normally the more **specific** selector wins, and a later rule beats an earlier one. In big projects that turns into a fight. `@layer` lets you declare an **order of importance** once. A rule in a later layer wins over an earlier layer, whatever the specificity.' },
      {
        t: 'code',
        text: '@layer reset, base, components, utilities;\n\n@layer base {\n  a { color: #0b6b4f; }\n}\n\n@layer components {\n  .btn { background-color: #0b6b4f; color: #ffffff; }\n}\n\n@layer utilities {\n  .text-white { color: #ffffff; }\n}',
      },
      { t: 'h', text: 'A parent selector at last: :has()' },
      { t: 'p', text: '`:has()` selects an element **because of what it contains**. `.card:has(img)` is a card that has a picture. `label:has(input:invalid)` is a label whose field has a mistake. Before `:has()` you needed JavaScript to do this.' },
      {
        t: 'code',
        text: '.card {\n  border: 1px solid #d9d4c7;\n}\n\n.card:has(img) {\n  border: 2px solid #0b6b4f;\n}',
      },
      { t: 'h', text: 'Smaller helpers' },
      {
        t: 'list',
        items: [
          '`:is(h1, h2, h3)` writes one rule for several selectors. `:where(...)` does the same with **zero specificity**, so anything can override it easily. Great for resets.',
          '`@supports (display: grid) { ... }` applies rules only when the browser understands the feature. Put the safe fallback outside, and the modern version inside.',
          '**Logical properties** (`margin-inline-start`, `padding-block`) from Lesson 53 follow the direction of writing.',
          '`aspect-ratio` and `clamp()` (Lesson 38) are modern tools you already know.',
        ],
      },
      {
        t: 'code',
        text: '.gallery {\n  display: block;\n}\n\n@supports (display: grid) {\n  .gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 16px;\n  }\n}',
      },
      { t: 'h', text: 'Print styles' },
      { t: 'p', text: 'Clients print price lists, forms and receipts. A print stylesheet hides what makes no sense on paper (menus, cookie banners, buttons), switches to black text on white, and writes out the address of each link so the printout is still useful.' },
      {
        t: 'web',
        title: 'The price list with a print stylesheet. On screen nothing changes; when printed, the navigation and banner disappear.',
        files: ['css'],
        assets: ASSETS,
        starter: {
          html: page(NAV_PRINT_HTML, { css: true }),
          css: '@media print {\n  .site-nav,\n  .cookie-banner {\n    display: none;\n  }\n  body {\n    color: #000000;\n    background-color: #ffffff;\n  }\n  a[href]::after {\n    content: " (" attr(href) ")";\n  }\n}\n',
        },
        checks: [{ uses: 'css', pattern: '@media\\s+print' }, { style: '.site-nav', prop: 'display', not: 'none', label: 'On screen the navigation still shows' }, { uses: 'css', pattern: 'attr\\(href\\)' }],
      },
      {
        t: 'see',
        files: { html: page(CARD_HTML, { css: true }), css: '.card-wrap { container-type: inline-size; }\n.card { display: block; }\n@container (min-width: 400px) {\n  .card { display: flex; gap: 16px; }\n}\n' },
        question: 'Look at the container query in the CSS. When the `.card-wrap` box is 300 pixels wide, which layout does the card use?',
        options: ['The basic one: `display: block`, because the container is narrower than 400px', 'display: flex, because the screen is wide', 'It depends on the width of the whole screen', 'No layout at all'],
        answer: 0,
        explain: 'A container query looks at the width of the container (`.card-wrap`), not the screen. Under 400px the rule does not apply, so the basic `display: block` stays. In a wider column the same card becomes a flex row.',
        proof: [{ uses: 'css', pattern: 'container-type:\\s*inline-size' }, { uses: 'css', pattern: '@container\\s*\\(min-width:\\s*400px\\)' }, { style: '.card', prop: 'display', is: 'block' }],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: '.card {\n  display: flex;\n}\n\n@container (min-width: 400px) {\n  .card {\n    flex-direction: row;\n  }\n}', why: 'Nothing in the page is named a container, so the `@container` rule has nothing to measure and never applies. Add `container-type: inline-size` to the PARENT of the card.', right: '.card-wrap {\n  container-type: inline-size;\n}\n.card {\n  display: flex;\n}\n@container (min-width: 400px) {\n  .card {\n    flex-direction: row;\n  }\n}' },
          { lang: 'dom', wrong: '.card {\n  container-type: inline-size;\n  display: flex;\n}\n@container (min-width: 400px) {\n  .card {\n    gap: 24px;\n  }\n}', why: 'A container cannot style itself. The query applies to the CHILDREN of the container. Put `container-type` on a wrapper and style the card inside it.', right: '.card-wrap {\n  container-type: inline-size;\n}\n.card {\n  display: flex;\n}\n@container (min-width: 400px) {\n  .card {\n    gap: 24px;\n  }\n}', logic: true },
          { lang: 'css', wrong: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}', why: 'This works in modern browsers, but an old phone that does not understand it shows the images in a broken state. Write a simple `display: block` first and put the grid inside `@supports`.', right: '.gallery {\n  display: block;\n}\n@supports (display: grid) {\n  .gallery {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n  }\n}', logic: true },
          { lang: 'css', wrong: '@layer components, base;\n\n@layer base {\n  a { color: red; }\n}\n@layer components {\n  a { color: blue; }\n}', why: 'The layer order lists the weakest layer FIRST. Here `base` is declared after `components`, so `base` wins and the links are red, probably not what you wanted. List layers from weakest to strongest.', right: '@layer base, components;\n\n@layer base {\n  a { color: red; }\n}\n@layer components {\n  a { color: blue; }\n}', logic: true },
        ],
      },
      {
        t: 'quiz',
        question: 'A card sits in a narrow sidebar on a wide desktop screen. Which feature lets the card choose its layout from the sidebar\'s width?',
        options: ['A container query', 'A media query', 'The :hover selector', 'The viewport meta tag'],
        answer: 0,
        explain: 'A media query measures the screen. A container query measures the box the component sits in, which is what matters for reusable components.',
      },
      {
        t: 'quiz',
        question: 'What does `.card:has(img)` select?',
        options: ['A card that contains an image', 'An image that is inside a card', 'Every card on the page', 'The card after an image'],
        answer: 0,
        explain: '`:has()` looks inside the element and selects it when the inside matches. It is the long-awaited \"parent selector\".',
      },
      { t: 'recap', items: ['A container query (`container-type: inline-size` on a parent, then `@container (min-width: ...)`) lets a component adapt to the space it has, not the whole screen.', 'CSS nesting groups related rules: `&` is the parent selector (`& h2`, `&:hover`).', '`@layer a, b, c;` sets the order of importance from weakest to strongest, whatever the specificity.', '`:has()` selects by contents, `:is()` and `:where()` shorten selectors (`:where` has zero specificity).', '`@supports` guards modern rules, with a simple fallback written first. Always check caniuse.com.', 'A `@media print` stylesheet hides menus and banners, uses black on white, and prints the link addresses.'] },
    ],
    exercises: [
      {
        id: 'w54-container-card',
        title: 'A card that adapts to its container',
        prompt: 'The card has a picture and text. Write the CSS so that:\n\n- `.card-wrap` is a container: `container-type: inline-size`.\n- `.card` is `display: block` by default.\n- When the container is at least 400px wide (`@container (min-width: 400px)`), `.card` becomes `display: flex` with a `gap` of `16px`.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(CARD_HTML, { css: true }), css: '/* Write the card styles here */\n' },
        solution: { html: page(CARD_HTML, { css: true }), css: '.card-wrap {\n  container-type: inline-size;\n}\n.card {\n  display: block;\n}\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n    gap: 16px;\n  }\n}\n' },
        checks: [
          { uses: 'css', pattern: '\\.card-wrap\\s*\\{[^}]*container-type:\\s*inline-size', label: '.card-wrap is a container' },
          { uses: 'css', pattern: '@container\\s*\\(min-width:\\s*400px\\)', label: 'There is a 400px container query' },
          { style: '.card', prop: 'display', is: 'block', label: 'The default card layout is block' },
          { uses: 'css', pattern: '@container[^{]*\\{[^}]*\\.card\\s*\\{[^}]*display:\\s*flex', label: 'Inside the query the card becomes flex' },
          { uses: 'css', pattern: 'gap:\\s*16px' },
        ],
        hints: ['A container is an ordinary parent with `container-type: inline-size;`. That is the wrapper, not the card.', 'The basic rule comes first: `.card { display: block; }`. The query then adds what changes when there is more room.', '```\n@container (min-width: 400px) {\n  .card {\n    display: flex;\n    gap: 16px;\n  }\n}\n```'],
      },
      {
        id: 'w54-nesting',
        title: 'Nest the card rules',
        prompt: 'These three rules all belong to the card. Rewrite them as ONE `.card` rule with the others nested inside it using `&`:\n\n- `& h2` for the heading (`margin: 0`)\n- `&:hover` for the hover shadow\n\nThe words `.card h2` and `.card:hover` must not appear any more.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(CARD_HTML, { css: true }), css: '.card {\n  padding: 16px;\n}\n.card h2 {\n  margin: 0;\n}\n.card:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n' },
        solution: { html: page(CARD_HTML, { css: true }), css: '.card {\n  padding: 16px;\n\n  & h2 {\n    margin: 0;\n  }\n\n  &:hover {\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  }\n}\n' },
        checks: [
          { uses: 'css', pattern: '\\.card\\s*\\{[^]*&\\s*h2\\s*\\{', label: 'The heading rule is nested with & h2' },
          { uses: 'css', pattern: '&:hover\\s*\\{', label: 'The hover rule is nested with &:hover' },
          { uses: 'css', pattern: '^(?![\\s\\S]*\\.card\\s+h2)', label: 'The words .card h2 are gone' },
          { uses: 'css', pattern: '^(?![\\s\\S]*\\.card:hover)', label: 'The words .card:hover are gone' },
          { uses: 'css', pattern: 'padding:\\s*16px', label: 'The card padding is kept' },
          { style: '.card', prop: 'padding-top', is: '16px' },
        ],
        hints: ['Keep one `.card { ... }` rule and move the other two INSIDE its braces.', '`.card h2` becomes `& h2` and `.card:hover` becomes `&:hover`. The `&` stands for `.card`.', '```\n.card {\n  padding: 16px;\n  & h2 {\n    margin: 0;\n  }\n}\n```'],
      },
      {
        id: 'w54-layers',
        title: 'Put the styles in layers',
        prompt: 'Add an order of layers at the very top: `@layer reset, base, components;`. Then wrap the existing rules: the `*` reset rule goes in `@layer reset`, the `a` rule in `@layer base`, and the `.btn` rule in `@layer components`.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page('<p><a href="#home">Home</a> <a class="btn" href="#book">Book</a></p>', { css: true }), css: '* {\n  box-sizing: border-box;\n}\na {\n  color: #0b6b4f;\n}\n.btn {\n  background-color: #0b6b4f;\n  color: #ffffff;\n  padding: 8px 16px;\n}\n' },
        solution: { html: page('<p><a href="#home">Home</a> <a class="btn" href="#book">Book</a></p>', { css: true }), css: '@layer reset, base, components;\n\n@layer reset {\n  * {\n    box-sizing: border-box;\n  }\n}\n@layer base {\n  a {\n    color: #0b6b4f;\n  }\n}\n@layer components {\n  .btn {\n    background-color: #0b6b4f;\n    color: #ffffff;\n    padding: 8px 16px;\n  }\n}\n' },
        checks: [
          { uses: 'css', pattern: '^\\s*@layer\\s+reset\\s*,\\s*base\\s*,\\s*components\\s*;', label: 'The layer order is declared first' },
          { uses: 'css', pattern: '@layer\\s+reset\\s*\\{[^]*box-sizing', label: 'The reset is in the reset layer' },
          { uses: 'css', pattern: '@layer\\s+base\\s*\\{[^]*a\\s*\\{', label: 'The link rule is in the base layer' },
          { uses: 'css', pattern: '@layer\\s+components\\s*\\{[^]*\\.btn', label: 'The button rule is in the components layer' },
          { style: '.btn', prop: 'background-color', is: '#0b6b4f', label: 'The button is still styled' },
        ],
        hints: ['The order line is one statement ending in a semicolon: `@layer reset, base, components;` and it must come first.', 'Then wrap each rule: `@layer base { a { color: ... } }`.', '```\n@layer components {\n  .btn {\n    background-color: #0b6b4f;\n    color: #ffffff;\n    padding: 8px 16px;\n  }\n}\n```'],
      },
      {
        id: 'w54-has',
        title: 'Style a card by what it contains',
        prompt: 'The page has two cards, and only one has a picture. Keep the basic rule (`.card` with a `1px solid #d9d4c7` border) and add a rule so that **only cards that contain an `<img>`** get a `2px solid #0b6b4f` border. Use `:has(img)`.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page('<article class="card"><img src="img/rolex.svg" alt="A rolex" width="60" height="40"><h2>With picture</h2></article>\n<article class="card"><h2>No picture</h2></article>', { css: true }), css: '.card {\n  border: 1px solid #d9d4c7;\n  padding: 12px;\n  margin-bottom: 12px;\n}\n' },
        solution: { html: page('<article class="card"><img src="img/rolex.svg" alt="A rolex" width="60" height="40"><h2>With picture</h2></article>\n<article class="card"><h2>No picture</h2></article>', { css: true }), css: '.card {\n  border: 1px solid #d9d4c7;\n  padding: 12px;\n  margin-bottom: 12px;\n}\n.card:has(img) {\n  border: 2px solid #0b6b4f;\n}\n' },
        checks: [
          { uses: 'css', pattern: '\\.card:has\\(\\s*img\\s*\\)\\s*\\{', label: 'A :has(img) rule exists' },
          { uses: 'css', pattern: ':has\\(\\s*img\\s*\\)\\s*\\{[^}]*2px\\s+solid\\s+#0b6b4f', label: 'It gives the card a 2px brand border' },
          { uses: 'css', pattern: '\\.card\\s*\\{[^}]*1px\\s+solid\\s+#d9d4c7', label: 'The basic card border is kept' },
          { count: '.card', equals: 2 },
        ],
        hints: ['`:has()` goes right after the selector it describes: `.card:has(...)`, with no space before the colon.', 'Inside the brackets write what the card must contain. Here it is an `img`.', '```\n.card:has(img) {\n  border: 2px solid #0b6b4f;\n}\n```'],
      },
      {
        id: 'w54-print',
        title: 'A print stylesheet',
        prompt: 'Add a `@media print` block that:\n\n- hides `.site-nav` and `.cookie-banner` (`display: none`),\n- makes the page black text on a white background (`body { color: #000000; background-color: #ffffff; }`),\n- shows the address after every link: `a[href]::after { content: " (" attr(href) ")"; }`.\n\nOn screen, the navigation must still be visible.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(NAV_PRINT_HTML, { css: true }), css: 'body {\n  font-family: system-ui, sans-serif;\n}\n' },
        solution: { html: page(NAV_PRINT_HTML, { css: true }), css: 'body {\n  font-family: system-ui, sans-serif;\n}\n@media print {\n  .site-nav,\n  .cookie-banner {\n    display: none;\n  }\n  body {\n    color: #000000;\n    background-color: #ffffff;\n  }\n  a[href]::after {\n    content: " (" attr(href) ")";\n  }\n}\n' },
        checks: [
          { uses: 'css', pattern: '@media\\s+print\\s*\\{', label: 'There is a print block' },
          { uses: 'css', pattern: '@media\\s+print[^]*\\.site-nav[^]*display:\\s*none', label: 'The navigation is hidden in print' },
          { uses: 'css', pattern: '@media\\s+print[^]*\\.cookie-banner', label: 'The cookie banner is hidden in print' },
          { uses: 'css', pattern: '@media\\s+print[^]*color:\\s*#000000', label: 'Print text is black' },
          { uses: 'css', pattern: 'attr\\(href\\)', label: 'Link addresses are printed' },
          { style: '.site-nav', prop: 'display', not: 'none', label: 'On screen the navigation still shows' },
        ],
        hints: ['Everything for paper goes inside one block: `@media print { ... }`. Rules outside it still apply on screen.', 'Several selectors can share a rule if you separate them with commas: `.site-nav, .cookie-banner { display: none; }`.', '`a[href]::after` adds text after every link that has an `href`, and `content: " (" attr(href) ")";` fills it with the address.'],
      },
    ],
  },
];
