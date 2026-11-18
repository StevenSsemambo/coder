// Web track, launch-ready extension, group B: privacy and cookies and licences, analytics and campaign links, CSS frameworks and design systems.
// Lessons w49 to w51. See docs/WEB-TRACK.md for the roadmap.
// This is general information for developers, not legal advice. Each lesson says so where it matters.
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

const page = (body, o = {}) => fullPage(body, { title: 'Mama Rose Rolex', ...o });

// ------------------------------------------------------------------ w49 helpers
const BANNER_HTML = `<h1>Kato Rides</h1>
<p>Parcels delivered across Kampala.</p>

<div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Cookie choices" hidden>
  <p>We would like to count visitors to improve this site. You choose. <a href="privacy.html">Privacy policy</a></p>
  <button id="accept" type="button">Accept</button>
  <button id="reject" type="button">Reject</button>
</div>`;

const BANNER_CSS = `.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background-color: #1c1b18;
  color: #ffffff;
}
.cookie-banner button {
  min-width: 96px;
  min-height: 44px;
  margin-right: 8px;
  font-size: 16px;
}
.cookie-banner a {
  color: #f7c948;
}
`;

const BANNER_JS = `const banner = document.querySelector("#cookie-banner");
const KEY = "consent";

function choose(value) {
  localStorage.setItem(KEY, value);
  banner.hidden = true;
}

if (localStorage.getItem(KEY) === null) {
  banner.hidden = false;
}

document.querySelector("#accept").addEventListener("click", () => choose("accepted"));
document.querySelector("#reject").addEventListener("click", () => choose("rejected"));
`;

const TRACK_GATE_STARTER = `window.events = [];

function track(name) {
  window.events.push({ event: name });
}
`;

const TRACK_GATE_SOLUTION = `window.events = [];

function track(name) {
  if (localStorage.getItem("consent") !== "accepted") {
    return;
  }
  window.events.push({ event: name });
}
`;

const PRIVACY_PAGE = `<main>
  <h1>Privacy policy</h1>
  <p>Last updated: 1 December 2026. Kato Rides respects your privacy.</p>

  <h2>What we collect</h2>
  <p>Your name, phone number and pickup place when you book a ride.</p>

  <h2>Why we collect it</h2>
  <p>Only to contact you and deliver your parcel.</p>

  <h2>Who can see it</h2>
  <p>Kato and the rider who delivers your parcel. We do not sell your details.</p>

  <h2>How long we keep it</h2>
  <p>For 12 months, and then we delete it.</p>

  <h2>Your rights</h2>
  <p>You can ask to see, correct or delete your details at any time.</p>

  <h2>Contact us</h2>
  <p>Email <a href="mailto:privacy@katorides.co.ug">privacy@katorides.co.ug</a> or call 0700 123 456.</p>
</main>`;

const ATTRIBUTION_SOLUTION = `function attributionLine(photo) {
  if (photo.licence === "own") {
    return "Photo: " + photo.title + ", our own";
  }
  if (photo.licence === "CC0") {
    return "Photo: " + photo.title + " (public domain)";
  }
  return "Photo: " + photo.title + " by " + photo.author + " (" + photo.licence + ")";
}
`;

// ------------------------------------------------------------------ w50 helpers
const TRACKER_HTML = `<h1>Kato Rides</h1>
<button type="button" data-track="booking_click">Book a ride</button>
<button type="button" data-track="whatsapp_click">Chat on WhatsApp</button>
<button type="button">Just a button</button>
<p id="count">0 events</p>`;

const TRACKER_JS = `window.dataLayer = window.dataLayer || [];

function track(name, details) {
  window.dataLayer.push({ event: name, ...details });
  document.querySelector("#count").textContent = window.dataLayer.length + " events";
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-track]");
  if (target) {
    track(target.dataset.track, { page: "home" });
  }
});
`;

const CONVERSION_SOLUTION = `function conversionRate(visitors, conversions) {
  if (visitors === 0) {
    return 0;
  }
  return Math.round((conversions / visitors) * 1000) / 10;
}
`;

const PARSE_SOLUTION = `function parseCampaign(address) {
  const params = new URL(address).searchParams;
  return {
    source: params.get("utm_source") || "direct",
    medium: params.get("utm_medium") || "none",
    campaign: params.get("utm_campaign") || "none",
  };
}
`;

const BUILD_SOLUTION = `function buildCampaignLink(base, source, medium, campaign) {
  const url = new URL(base);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}
`;

const TOP_SOURCES_SOLUTION = `function topSources(visits) {
  const counts = {};
  for (const visit of visits) {
    counts[visit.source] = (counts[visit.source] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
`;

// ------------------------------------------------------------------ w51 helpers
const UTILITY_CSS = `.p-2 { padding: 8px; }
.p-4 { padding: 16px; }
.mt-4 { margin-top: 16px; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.text-center { text-align: center; }
.bg-brand { background-color: #0b6b4f; }
.text-white { color: #ffffff; }
.rounded { border-radius: 8px; }
.font-bold { font-weight: 700; }
`;

const UTILITY_HTML = `<header class="flex items-center justify-between p-4 bg-brand text-white">
  <span class="font-bold">Mama Rose</span>
  <a class="p-2 rounded text-white" href="#order">Order</a>
</header>
<main class="p-4">
  <h1 class="text-center">Hot rolex</h1>
  <p class="mt-4">Wandegeya, Kampala.</p>
</main>`;

const MINI_FRAMEWORK = `.container { max-width: 960px; margin: 0 auto; padding: 0 16px; }
.row { display: flex; flex-wrap: wrap; gap: 16px; }
.col-6 { flex: 1 1 calc(50% - 16px); }
.card { border: 1px solid #d9d4c7; border-radius: 12px; overflow: hidden; background-color: #ffffff; }
.card-body { padding: 16px; }
.btn { display: inline-block; padding: 10px 16px; border-radius: 8px; text-decoration: none; }
.btn-primary { background-color: #0b6b4f; color: #ffffff; }
`;

const TOKENS_STARTER = `.hero {
  background-color: #0b6b4f;
  color: #fdf1d3;
  padding: 24px;
}
.cta {
  background-color: #f7c948;
  color: #1c1b18;
  padding: 12px 20px;
  margin-top: 24px;
}
.footer {
  background-color: #0b6b4f;
  color: #fdf1d3;
  padding: 24px;
}
`;

const TOKENS_SOLUTION = `:root {
  --brand: #0b6b4f;
  --cream: #fdf1d3;
  --accent: #f7c948;
  --ink: #1c1b18;
  --space: 24px;
}
.hero {
  background-color: var(--brand);
  color: var(--cream);
  padding: var(--space);
}
.cta {
  background-color: var(--accent);
  color: var(--ink);
  padding: 12px 20px;
  margin-top: var(--space);
}
.footer {
  background-color: var(--brand);
  color: var(--cream);
  padding: var(--space);
}
`;

const TOKENS_HTML = `<section class="hero">
  <h1>Kato Rides</h1>
  <a class="cta" href="#book">Book a ride</a>
</section>
<footer class="footer">
  <p>Wandegeya, Kampala</p>
</footer>`;

const TYPE_SCALE_SOLUTION = `function typeScale(base, ratio, steps) {
  const sizes = [];
  for (let i = 0; i < steps; i++) {
    sizes.push(Math.round(base * Math.pow(ratio, i) * 10) / 10);
  }
  return sizes;
}
`;

export const launch2Lessons = [
  // ================================================================== w49
  {
    id: 'w49-trust-and-the-law',
    level: 'Level 6: Launch-ready for any company',
    title: 'Trust and the law: privacy, cookies and licences',
    summary: 'What a company website must tell visitors and what it must not take: a privacy policy, a fair cookie choice, honest business details and correct licences.',
    minutes: 32,
    blocks: [
      {
        t: 'story',
        title: 'The supermarket asks a question',
        text: 'Kato\'s boda delivery site collects names and phone numbers. A supermarket wants to hire him for its parcels, and its manager asks three questions before signing: \"Where is your privacy policy? Does your site use cookies? Where did you get these photos?\"\n\nKato has no answers, and the contract waits. Companies, banks and big customers check these things, because a careless website can bring them legal trouble and lost customers. In this lesson you learn what to say, what to ask for and what to build, so you can deliver a site that a careful company will accept.',
      },
      { t: 'tip', text: 'This lesson is general information for web developers. It is not legal advice, and laws change. For a client who handles sensitive data (health, money, children, IDs), recommend that they ask a lawyer, and tell them so in your proposal.' },
      { t: 'analogy', text: 'Personal data is like the **house keys** a neighbour lends you. A good neighbour says what the keys are for, takes only the keys they need, keeps them safe, and gives them back when the job is done. A bad one copies them \"just in case\". A privacy policy is the polite note you pin to the door: what you were lent, why, and when you return it.' },
      { t: 'h', text: 'Personal data and the law in Uganda' },
      {
        t: 'list',
        items: [
          '**Personal data** is any information that can identify a person: a name, a phone number, an email address, a photo, a location, an ID number. A booking form collects personal data.',
          'Uganda\'s **Data Protection and Privacy Act, 2019** sets rules for people and organisations that collect and use personal data, and the **Personal Data Protection Office** (under NITA-U) oversees it. In plain words the main ideas are: have a lawful reason, collect only what you need, tell people what you do with it, keep it safe, do not keep it longer than needed, and let people see and correct their details.',
          'If your visitors include people in the **European Union**, the **GDPR** may also apply to your client. Big international customers often ask for it.',
          'Your job as the developer: build the pieces (a clear policy page, honest consent, secure forms, less data) and ask the client to confirm the legal side.',
        ],
      },
      { t: 'h', text: 'A privacy policy, in six honest sections' },
      {
        t: 'list',
        items: [
          '**What we collect**: the exact fields (name, phone, pickup place).',
          '**Why we collect it**: the reason, in one sentence.',
          '**Who can see it**: your team, helpers, tools such as a form service. Say clearly if you never sell it.',
          '**How long we keep it**: a real period, then deletion.',
          '**Your rights**: seeing, correcting and deleting their details.',
          '**Contact us**: a real email or phone for privacy questions.',
          'Link the policy from the footer of EVERY page and next to every form button. Write it in plain language, not in a wall of legal words nobody can read.',
        ],
      },
      { t: 'h', text: 'Cookies and consent' },
      {
        t: 'p',
        text: 'A **cookie** is a small piece of text a site asks the browser to remember. **Essential** cookies keep a login or a shopping cart working. **Non-essential** ones (counting visitors, advertising, tracking across sites) are different: in many places, and for many international customers, you must ask first. A fair choice banner follows a few rules:',
      },
      {
        t: 'list',
        items: [
          '**Reject is as easy as Accept**: both buttons are equally clear. No tiny grey \"reject\" hidden behind a link.',
          '**Nothing is switched on by default.** Do not load analytics or ad scripts until the visitor accepts.',
          '**Remember the choice** (here in `localStorage`) so the banner does not return on every page.',
          '**Link the privacy policy** from the banner, and let people change their mind later.',
        ],
      },
      {
        t: 'web',
        title: 'A fair cookie choice. The banner shows only when there is no saved choice. Press Accept, then check what was stored.',
        files: ['html', 'css', 'js'],
        assets: ASSETS,
        starter: { html: page(BANNER_HTML, { css: true, js: true }), css: BANNER_CSS, js: BANNER_JS },
        checks: [
          { visible: '#cookie-banner', label: 'With no saved choice the banner is shown' },
          { do: 'click', target: '#accept' },
          { visible: '#cookie-banner', is: false, label: 'After Accept the banner is hidden' },
          { js: 'localStorage.getItem("consent")', equals: 'accepted', label: 'The choice is saved as accepted' },
          { count: '#cookie-banner button', equals: 2, label: 'There are two equal buttons: accept and reject' },
        ],
      },
      {
        t: 'predict',
        code: 'const choice = null;\nconsole.log(choice === "accepted" ? "load analytics" : "do not load analytics");',
        question: 'The visitor has not chosen yet (`null`). What does this print?',
        options: ['do not load analytics', 'load analytics', 'null', 'undefined'],
        answer: 0,
        explain: 'No choice is NOT a yes. Only the exact value `"accepted"` allows tracking. This is the rule of every fair consent system: silence means no.',
      },
      {
        t: 'try',
        code: 'function shouldTrack(consent) {\n  return consent === "accepted";\n}\n\nconsole.log(shouldTrack("accepted"));\nconsole.log(shouldTrack("rejected"));\nconsole.log(shouldTrack(null));',
        output: 'true\nfalse\nfalse',
      },
      { t: 'h', text: 'Licences: using other people\'s work' },
      {
        t: 'list',
        items: [
          '**Everything online is owned by someone** unless it clearly says otherwise. Copying a competitor\'s text, or a photo from a Google search, can lead to a legal demand or a takedown.',
          'Best: use **your own photos** and text, with the owner\'s permission to publish. Ask permission before showing a customer\'s or an employee\'s face, and be especially careful with children.',
          'Free-to-use libraries state a **licence**. Some need **attribution** (a credit line naming the author and the licence), some need none. Always read the licence on the picture\'s own page.',
          'Fonts and icons have licences too. Open fonts (for example those from Google Fonts) and open-source icon sets are free to use, within their licence. Keep a note of where each asset came from.',
          'Code has licences as well. Libraries you install usually come with a licence file such as MIT. Keep it.',
        ],
      },
      { t: 'h', text: 'Show who you are' },
      {
        t: 'list',
        items: [
          'Trust grows when a visitor can see a **real business**: the registered name, a physical location or service area, a phone number that answers, an email on your own domain.',
          'State **prices clearly** (with the currency), and put **delivery, refund and payment terms** in plain words on one page that is easy to find.',
          'Show real testimonials only with the customer\'s permission. Never invent reviews.',
          'Keep the site secure (HTTPS, Lesson 33) and accessible (Lesson 32). An accessible, secure, honest site is a trustworthy site.',
        ],
      },
      {
        t: 'web',
        title: 'A privacy policy page with the six sections, a date and a contact. This is the structure to reuse for a client.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(PRIVACY_PAGE, { title: 'Privacy policy | Kato Rides' }) },
        checks: [{ count: 'h2', min: 6 }, { exists: 'a[href^="mailto:"]' }, { rule: 'one-h1' }, { rule: 'title' }],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<div class="cookie-banner">\n  <p>By using this site you agree to everything.</p>\n  <button type="button">OK</button>\n</div>', why: 'There is only an \"OK\" button, so the visitor has no real choice, and \"by using this site you agree\" is not consent. Offer two equal buttons, accept and reject, and link the privacy policy.', right: '<div class="cookie-banner">\n  <p>We would like to count visitors. You choose. <a href="privacy.html">Privacy policy</a></p>\n  <button type="button">Accept</button>\n  <button type="button">Reject</button>\n</div>', logic: true },
          { lang: 'html', wrong: '<img src="https://example.com/photo-from-google.jpg" alt="Kampala street">', why: 'A photo copied from a search result has an owner who did not give permission. Use your own photo, or one from a library whose licence you have read, and keep a record of it.', right: '<img src="img/kampala-street.jpg" alt="A busy street in Kampala at dusk">', logic: true },
          { lang: 'dom', wrong: 'loadAnalytics();\n\nif (consent === "accepted") {\n  enableMarketing();\n}', why: 'The tracking script is loaded BEFORE the visitor chooses, so the choice means nothing. Load it inside the `if`, after a real accept.', right: 'if (consent === "accepted") {\n  loadAnalytics();\n}' },
          { lang: 'dom', wrong: 'if (consent !== "rejected") {\n  loadAnalytics();\n}', why: 'This also tracks visitors who have not chosen yet (`null`). Silence is not a yes. Compare with `=== "accepted"` instead.', right: 'if (consent === "accepted") {\n  loadAnalytics();\n}' },
        ],
      },
      {
        t: 'quiz',
        question: 'A visitor has not clicked anything on your cookie banner. Which is the fair thing to do?',
        options: ['Do not load analytics or ad scripts until they accept', 'Load everything, because they will probably accept', 'Load analytics but hide the banner', 'Ask again on every click'],
        answer: 0,
        explain: 'No choice means no tracking. Essential things can still work, but counting and advertising tools wait for a clear yes.',
      },
      {
        t: 'quiz',
        question: 'You want to use a beautiful photo you found on a random website. What should you do first?',
        options: ['Find the owner and the licence, and use it only if the licence allows it (with a credit if required)', 'Use it, because it was easy to download', 'Crop it so nobody notices', 'Put it in your CSS instead of your HTML'],
        answer: 0,
        explain: 'Being able to download a picture does not give you the right to use it. The licence, or the owner\'s permission, does.',
      },
      { t: 'recap', items: ['Personal data (names, phones, emails, photos, locations) is protected. Uganda\'s Data Protection and Privacy Act, 2019 sets the rules, and big international customers may expect GDPR too. This is general guidance, and a lawyer confirms the legal side.', 'A privacy policy answers six questions: what we collect, why, who sees it, how long we keep it, your rights, and how to contact us. Link it from every page and from every form.', 'A fair cookie banner has equal Accept and Reject, loads nothing until a clear yes, remembers the choice, and links the policy.', 'Silence is not consent: only `"accepted"` switches tracking on.', 'Use your own photos or properly licensed ones, give credit where the licence needs it, and keep a record. Never copy from a search.', 'Show real business details, clear prices and terms. Collect as little data as you can.'] },
    ],
    exercises: [
      {
        id: 'w49-banner',
        title: 'Build the consent banner',
        prompt: 'The banner HTML is ready and starts hidden. Write the JavaScript:\n\n- When the page loads and `localStorage` has no `"consent"` value yet, show the banner (`banner.hidden = false`).\n- Clicking `#accept` saves `"accepted"`, clicking `#reject` saves `"rejected"`, and both hide the banner.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(BANNER_HTML, { css: true, js: true }), css: BANNER_CSS, js: 'const banner = document.querySelector("#cookie-banner");\n\n// Show the banner when there is no saved choice.\n// Save the choice when a button is pressed.\n' },
        solution: { html: page(BANNER_HTML, { css: true, js: true }), css: BANNER_CSS, js: BANNER_JS },
        checks: [
          { visible: '#cookie-banner', label: 'With no saved choice the banner is shown' },
          { do: 'click', target: '#reject' },
          { visible: '#cookie-banner', is: false, label: 'After a choice the banner is hidden' },
          { js: 'localStorage.getItem("consent")', equals: 'rejected', label: 'Reject saves "rejected"' },
          { do: 'click', target: '#accept' },
          { js: 'localStorage.getItem("consent")', equals: 'accepted', label: 'Accept saves "accepted"' },
        ],
        hints: ['`localStorage.getItem("consent")` gives `null` when nothing was saved yet. Test for `null` to decide whether to show the banner.', 'Write one function `choose(value)` that saves the value with `localStorage.setItem("consent", value)` and hides the banner with `banner.hidden = true`. Call it from both buttons.', '```\ndocument.querySelector("#accept").addEventListener("click", () => choose("accepted"));\ndocument.querySelector("#reject").addEventListener("click", () => choose("rejected"));\n```'],
      },
      {
        id: 'w49-consent-gate',
        title: 'Track only after a yes',
        prompt: 'The function `track(name)` records an event in `window.events`, but it records everything, even for visitors who have not agreed. Change it so it records an event ONLY when `localStorage.getItem("consent")` is exactly `"accepted"`. In every other case (rejected, or no choice yet) it does nothing.',
        files: ['js'],
        starter: { html: page('<h1>Kato Rides</h1>', { js: true }), js: TRACK_GATE_STARTER },
        solution: { html: page('<h1>Kato Rides</h1>', { js: true }), js: TRACK_GATE_SOLUTION },
        checks: [
          { js: '(localStorage.removeItem("consent"), window.events.length = 0, track("view"), window.events.length)', equals: 0, label: 'No saved choice: nothing is recorded' },
          { js: '(localStorage.setItem("consent", "rejected"), window.events.length = 0, track("view"), window.events.length)', equals: 0, label: 'Rejected: nothing is recorded' },
          { js: '(localStorage.setItem("consent", "accepted"), window.events.length = 0, track("view"), window.events.length)', equals: 1, label: 'Accepted: the event is recorded' },
          { js: 'window.events[0].event', equals: 'view', label: 'The event keeps its name' },
        ],
        hints: ['Look at the saved choice at the START of the function, before you push anything.', 'If the choice is not exactly `"accepted"`, leave the function early with `return;`.', '```\nif (localStorage.getItem("consent") !== "accepted") {\n  return;\n}\n```'],
      },
      {
        id: 'w49-privacy-page',
        title: 'Write the privacy policy page',
        prompt: 'Turn this page into a privacy policy. Keep the `<h1>` and add six sections, each with an `<h2>` and a short paragraph. The headings must be about: what you **collect**, **why** you collect it, **who** can see it, how **long** you keep it, the visitor\'s **rights**, and how to **contact** you. For the contact section, include a `mailto:` link.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<main>\n  <h1>Privacy policy</h1>\n  <p>Last updated: 1 December 2026.</p>\n</main>', { title: 'Privacy policy | Kato Rides' }) },
        solution: { html: page(PRIVACY_PAGE, { title: 'Privacy policy | Kato Rides' }) },
        checks: [
          { count: 'h2', min: 6, label: 'There are at least six sections' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /collect/i.test(h.textContent))', equals: true, label: 'A section says what you collect' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /why/i.test(h.textContent))', equals: true, label: 'A section says why' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /who/i.test(h.textContent))', equals: true, label: 'A section says who can see it' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /long|keep/i.test(h.textContent))', equals: true, label: 'A section says how long you keep it' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /right/i.test(h.textContent))', equals: true, label: 'A section lists the visitor\'s rights' },
          { exists: 'a[href^="mailto:"]', label: 'There is a way to contact you by email' },
          { rule: 'one-h1' },
        ],
        hints: ['Each section is a pair: an `<h2>` heading and a `<p>` below it. You need six pairs.', 'Use plain words for the headings, for example: \"What we collect\", \"Why we collect it\", \"Who can see it\", \"How long we keep it\", \"Your rights\", \"Contact us\".', '```\n<h2>Contact us</h2>\n<p>Email <a href="mailto:privacy@katorides.co.ug">privacy@katorides.co.ug</a></p>\n```'],
      },
      {
        id: 'w49-attribution',
        title: 'Give credit correctly',
        prompt: 'Write `attributionLine(photo)`, which builds the credit line shown under a picture. A photo is an object with `title`, `author` and `licence`.\n\n- Licence `"own"`: return `Photo: TITLE, our own`\n- Licence `"CC0"` (no credit needed): return `Photo: TITLE (public domain)`\n- Any other licence: return `Photo: TITLE by AUTHOR (LICENCE)`',
        files: ['js'],
        starter: { js: '// Write attributionLine(photo)\n' },
        solution: { js: ATTRIBUTION_SOLUTION },
        checks: [
          { js: 'attributionLine({ title: "Boda at dusk", author: "Amina", licence: "own" })', equals: 'Photo: Boda at dusk, our own' },
          { js: 'attributionLine({ title: "Market", author: "Sam Okello", licence: "CC BY 4.0" })', equals: 'Photo: Market by Sam Okello (CC BY 4.0)', label: 'A credited photo names the author and the licence' },
          { js: 'attributionLine({ title: "Sky", author: "Unknown", licence: "CC0" })', equals: 'Photo: Sky (public domain)' },
          { js: 'attributionLine({ title: "Road", author: "Jo Kato", licence: "CC BY-SA 4.0" })', equals: 'Photo: Road by Jo Kato (CC BY-SA 4.0)', hidden: true },
        ],
        hints: ['Check the special licences first, `"own"` and `"CC0"`, with `if` and an early `return`.', 'Everything else gets the full line, built with `+` between the pieces.', '```\nreturn "Photo: " + photo.title + " by " + photo.author + " (" + photo.licence + ")";\n```'],
      },
    ],
  },

  // ================================================================== w50
  {
    id: 'w50-measuring-success',
    level: 'Level 6: Launch-ready for any company',
    title: 'Measuring success: analytics, events and campaign links',
    summary: 'Find out who visits, what they do and which advert worked, with events, conversion rates and tagged links, without spying on anyone.',
    minutes: 30,
    blocks: [
      {
        t: 'story',
        title: 'Fifty thousand shillings and no answer',
        text: 'Kato pays UGX 50,000 for a Facebook advert about his parcel delivery. Two weeks later his friend asks: \"Did it work?\" Kato has no idea. Bookings did come in, but from the advert? From Google? From a friend who shared his number?\n\nA business that cannot answer \"what worked?\" keeps paying for what does not. **Analytics** is the habit of measuring: how many people visit, where they come from, and how many do the thing the business wants (book, call, order). It is also a skill clients will pay you for.',
      },
      { t: 'analogy', text: 'A shopkeeper standing at the door can see how many people walk in, but not how many only looked. If she keeps two jars and drops a bean in one for every visitor and a bean in the other for every sale, she learns her **conversion**: how many visitors became customers. Analytics is those two jars, plus a label on each bean saying where the visitor heard about the shop.' },
      { t: 'h', text: 'What to measure' },
      {
        t: 'list',
        items: [
          '**Visitors** and **sessions**: how many people, and how many visits.',
          '**Sources**: where they came from (Google search, Facebook, a link someone shared, typing the address directly).',
          '**Conversions** (also called goals or key events): the actions that make money or move the business, such as a booking submitted, a WhatsApp chat started, a phone call tapped. Decide them BEFORE you build the tracking.',
          '**Conversion rate** = conversions divided by visitors, shown as a percentage. 14 bookings from 200 visitors is `14 / 200 = 0.07`, so 7%.',
          '**Search data**: Google Search Console (Lesson 48) shows what people searched to find you.',
        ],
      },
      {
        t: 'list',
        items: [
          'Common tools: **Google Analytics 4** (free, powerful, needs consent in many places), and privacy-friendly ones such as **Plausible** or **Umami** (simpler, often paid or self-hosted). Check current prices and features, and match the tool to the client and the law (Lesson 49).',
          'You add a tool with one small script tag from the tool\'s own website. Never paste a script from a stranger, and remember that, in this course, the preview has no network, so the lessons practise the same ideas with code you write.',
          'Ask for consent before loading it, wherever the law or the client requires.',
        ],
      },
      {
        t: 'try',
        code: 'function conversionRate(visitors, conversions) {\n  if (visitors === 0) {\n    return 0;\n  }\n  return Math.round((conversions / visitors) * 1000) / 10;\n}\n\nconsole.log(conversionRate(200, 14));\nconsole.log(conversionRate(3, 1));\nconsole.log(conversionRate(0, 0));',
        output: '7\n33.3\n0',
      },
      { t: 'h', text: 'Events: record what visitors do' },
      { t: 'p', text: 'Page views come free. Actions need an **event**: a small note, \"someone tapped the WhatsApp button\". The standard pattern (used by Google Tag Manager) is a list called `dataLayer`. Your code pushes events onto it, and the analytics tool reads them. Below, one listener on the whole page watches for any element with a `data-track` attribute (event delegation, Level 4), so adding tracking to a new button needs no new JavaScript.' },
      {
        t: 'web',
        title: 'Tap the two tracked buttons, then the plain one. Only the tracked ones create events.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page(TRACKER_HTML, { js: true }), js: TRACKER_JS },
        checks: [
          { js: 'window.dataLayer.length', equals: 0, label: 'No events before any tap' },
          { do: 'click', target: '[data-track="booking_click"]' },
          { js: 'window.dataLayer[0].event', equals: 'booking_click', label: 'A tracked button records its event name' },
          { do: 'click', target: '[data-track="whatsapp_click"]' },
          { do: 'click', target: 'button:not([data-track])' },
          { js: 'window.dataLayer.length', equals: 2, label: 'The plain button records nothing' },
          { text: '#count', equals: '2 events' },
        ],
      },
      {
        t: 'see',
        files: { html: page(TRACKER_HTML, { js: true }), js: TRACKER_JS },
        question: 'A visitor taps the plain `Just a button` and then `Book a ride`. What does the counter say?',
        options: ['1 events', '2 events', '0 events', '3 events'],
        answer: 0,
        explain: 'Only elements with a `data-track` attribute create events, so the plain button is ignored. The one event from `Book a ride` makes the count 1. (The word \"events\" is not made plural by the code, which is a small polish you could add.)',
        proof: [{ do: 'click', target: 'button:not([data-track])' }, { do: 'click', target: '[data-track="booking_click"]' }, { text: '#count', equals: '1 events' }],
      },
      { t: 'h', text: 'Campaign links: which advert worked?' },
      { t: 'p', text: 'To learn which advert a visitor came from, put labels on the **link in the advert**. These labels are called **UTM parameters**: `utm_source` (where: facebook), `utm_medium` (kind: ad) and `utm_campaign` (which one: december-offer). They sit in the web address after a `?`, and analytics tools read them. You already met the tool that reads and builds them: `URL` and `URLSearchParams`.' },
      {
        t: 'web',
        title: 'Read the labels from an advert link. The result is written into the page.',
        files: ['js'],
        assets: ASSETS,
        starter: { html: page('<h1>Campaign link</h1>\n<p id="out"></p>', { js: true }), js: PARSE_SOLUTION + '\nconst result = parseCampaign("https://katorides.co.ug/?utm_source=facebook&utm_medium=ad&utm_campaign=december-offer");\ndocument.querySelector("#out").textContent = result.source + " / " + result.medium + " / " + result.campaign;\n' },
        checks: [{ text: '#out', equals: 'facebook / ad / december-offer' }, { js: 'parseCampaign("https://katorides.co.ug/").source', equals: 'direct', label: 'No labels means a direct visit' }],
      },
      {
        t: 'list',
        items: [
          'Keep names **lower case with no spaces** (`december-offer`), because `Facebook` and `facebook` count as different sources.',
          'Use **one tagged link per advert or post**, so you can compare them.',
          'Write down what you tagged. A tag nobody remembers is useless.',
          'Do not put personal details (names, phones, emails) in a link or an event. Analytics should count actions, not follow people.',
        ],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: 'const rate = conversions / visitors * 100;', why: 'With zero visitors this divides by zero and gives `NaN` (or `Infinity`), which then appears on the dashboard. Handle the zero case first.', right: 'const rate = visitors === 0 ? 0 : (conversions / visitors) * 100;' },
          { lang: 'dom', wrong: 'track("booking_submitted", { name: form.name.value, phone: form.phone.value });', why: 'This sends the visitor\'s name and phone number to the analytics tool. Analytics should count that a booking happened, not who made it (Lesson 49).', right: 'track("booking_submitted", { page: "home" });' },
          { lang: 'dom', wrong: 'https://katorides.co.ug/?utm_source=Facebook&utm_medium=Ad&utm_campaign=December Offer', why: 'A space in a link breaks it, and capital letters split one source into two (`Facebook` and `facebook`). Use lower case and a hyphen.', right: 'https://katorides.co.ug/?utm_source=facebook&utm_medium=ad&utm_campaign=december-offer' },
          { lang: 'dom', wrong: 'document.querySelectorAll("button").forEach((b) => {\n  b.addEventListener("click", () => track(b.textContent));\n});', why: 'Tracking every button by its visible text means a change in wording (\"Book now\" instead of \"Book a ride\") silently breaks all your reports. Give each tracked element a stable `data-track` name.', right: 'document.addEventListener("click", (event) => {\n  const target = event.target.closest("[data-track]");\n  if (target) track(target.dataset.track);\n});' },
        ],
      },
      {
        t: 'quiz',
        question: '14 people booked out of 200 visitors. What is the conversion rate?',
        options: ['7%', '14%', '0.7%', '70%'],
        answer: 0,
        explain: '14 divided by 200 is 0.07, which is 7%.',
      },
      {
        t: 'quiz',
        question: 'Why add `utm_campaign` labels to the link in an advert?',
        options: ['So analytics can show which advert brought each visitor', 'To make the page load faster', 'To hide the link from competitors', 'Because the link will not work without them'],
        answer: 0,
        explain: 'The labels travel with the visitor to your site, where analytics reads them. Without them, all the advert\'s visitors look like \"direct\" or \"facebook\" with no detail.',
      },
      { t: 'recap', items: ['Measure what matters: visitors, sources, and conversions (booking, call, order). Decide the conversions BEFORE building the tracking.', 'Conversion rate = conversions divided by visitors, as a percentage. Always handle zero visitors.', 'Events are small notes about actions. Pushing them onto a `dataLayer` list is the standard pattern, and `data-track` plus one delegated listener keeps it tidy.', 'UTM labels on a campaign link (`utm_source`, `utm_medium`, `utm_campaign`) show which advert worked. Use lower case and hyphens, and read or build them with `URL` and `URLSearchParams`.', 'Analytics should count actions, not people: no names, phones or emails in events or links, and respect consent (Lesson 49).', 'Look at the numbers on a schedule (for example every Friday) and change one thing at a time.'] },
    ],
    exercises: [
      {
        id: 'w50-conversion-rate',
        title: 'Conversion rate',
        prompt: 'Write `conversionRate(visitors, conversions)`. It returns the percentage of visitors who converted, rounded to **one decimal place**. With 0 visitors it returns 0 (not `NaN`).',
        files: ['js'],
        starter: { js: '// Write conversionRate(visitors, conversions)\n' },
        solution: { js: CONVERSION_SOLUTION },
        checks: [
          { js: 'conversionRate(200, 14)', equals: 7 },
          { js: 'conversionRate(3, 1)', equals: 33.3, label: '1 out of 3 is 33.3 percent' },
          { js: 'conversionRate(0, 0)', equals: 0, label: 'No visitors gives 0, not NaN' },
          { js: 'conversionRate(50, 0)', equals: 0, hidden: true },
          { js: 'conversionRate(8, 8)', equals: 100, hidden: true },
        ],
        hints: ['Percentage means divided by visitors, times 100. Handle the zero-visitors case with an early `return 0`.', 'To round to one decimal place: multiply by 1000 first, round, and then divide by 10 (`Math.round(x * 10) / 10` on the percentage).', '```\nreturn Math.round((conversions / visitors) * 1000) / 10;\n```'],
      },
      {
        id: 'w50-track-clicks',
        title: 'Track the right buttons',
        prompt: 'Write the tracking code. Keep a list `window.dataLayer`. Add ONE click listener on `document`. When the click is on (or inside) an element that has a `data-track` attribute, push `{ event: NAME }` onto `window.dataLayer`, where NAME is the value of that attribute. Clicks on elements without `data-track` do nothing.',
        files: ['js'],
        starter: { html: page('<h1>Kato Rides</h1>\n<button type="button" data-track="booking_click">Book a ride</button>\n<button type="button" data-track="call_click"><span>Call</span> Kato</button>\n<button type="button">Just a button</button>', { js: true }), js: 'window.dataLayer = [];\n\n// Add one click listener on document.\n' },
        solution: { html: page('<h1>Kato Rides</h1>\n<button type="button" data-track="booking_click">Book a ride</button>\n<button type="button" data-track="call_click"><span>Call</span> Kato</button>\n<button type="button">Just a button</button>', { js: true }), js: 'window.dataLayer = [];\n\ndocument.addEventListener("click", (event) => {\n  const target = event.target.closest("[data-track]");\n  if (target) {\n    window.dataLayer.push({ event: target.dataset.track });\n  }\n});\n' },
        checks: [
          { do: 'click', target: '[data-track="booking_click"]' },
          { js: 'window.dataLayer.length', equals: 1, label: 'A tracked button adds one event' },
          { js: 'window.dataLayer[0].event', equals: 'booking_click', label: 'The event has the name from data-track' },
          { do: 'click', target: 'button:not([data-track])' },
          { js: 'window.dataLayer.length', equals: 1, label: 'A plain button adds nothing' },
          { do: 'click', target: '[data-track="call_click"] span' },
          { js: 'window.dataLayer[1].event', equals: 'call_click', label: 'A click on something inside a tracked button still counts' },
        ],
        hints: ['Listen on `document` and use the event object: `event.target` is the element that was clicked.', '`event.target.closest("[data-track]")` finds the nearest tracked element, even when the click lands on a `<span>` inside the button. It gives `null` when there is none.', '```\nconst target = event.target.closest("[data-track]");\nif (target) {\n  window.dataLayer.push({ event: target.dataset.track });\n}\n```'],
      },
      {
        id: 'w50-parse-campaign',
        title: 'Read the campaign labels',
        prompt: 'Write `parseCampaign(address)`. Use `new URL(address).searchParams` to read the three labels `utm_source`, `utm_medium` and `utm_campaign`, and return `{ source, medium, campaign }`. When a label is missing use `"direct"` for the source, and `"none"` for the medium and the campaign.',
        files: ['js'],
        starter: { js: '// Write parseCampaign(address)\n' },
        solution: { js: PARSE_SOLUTION },
        checks: [
          { js: 'parseCampaign("https://katorides.co.ug/?utm_source=facebook&utm_medium=ad&utm_campaign=december-offer").source', equals: 'facebook' },
          { js: 'parseCampaign("https://katorides.co.ug/?utm_source=facebook&utm_medium=ad&utm_campaign=december-offer").campaign', equals: 'december-offer' },
          { js: 'parseCampaign("https://katorides.co.ug/").source', equals: 'direct', label: 'No labels means a direct visit' },
          { js: 'parseCampaign("https://katorides.co.ug/").medium', equals: 'none' },
          { js: 'parseCampaign("https://katorides.co.ug/prices?lang=en&utm_source=whatsapp").source', equals: 'whatsapp', label: 'Other parameters do not confuse it', hidden: true },
        ],
        hints: ['`new URL(address).searchParams` is an object with a `.get(name)` method.', '`.get("utm_source")` gives `null` when the label is missing. The `||` operator lets you supply a default: `params.get("utm_source") || "direct"`.', '```\nreturn {\n  source: params.get("utm_source") || "direct",\n  medium: params.get("utm_medium") || "none",\n  campaign: params.get("utm_campaign") || "none",\n};\n```'],
      },
      {
        id: 'w50-build-link',
        title: 'Build a tagged link',
        prompt: 'Write `buildCampaignLink(base, source, medium, campaign)`. Make a `new URL(base)`, set the three labels `utm_source`, `utm_medium` and `utm_campaign` with `url.searchParams.set(...)`, and return `url.toString()`. Existing parameters in the base address must be kept.',
        files: ['js'],
        starter: { js: '// Write buildCampaignLink(base, source, medium, campaign)\n' },
        solution: { js: BUILD_SOLUTION },
        checks: [
          { js: 'buildCampaignLink("https://katorides.co.ug/", "facebook", "ad", "december-offer")', equals: 'https://katorides.co.ug/?utm_source=facebook&utm_medium=ad&utm_campaign=december-offer' },
          { js: 'buildCampaignLink("https://katorides.co.ug/", "facebook", "ad", "december offer")', equals: 'https://katorides.co.ug/?utm_source=facebook&utm_medium=ad&utm_campaign=december+offer', label: 'A space is encoded safely' },
          { js: 'buildCampaignLink("https://katorides.co.ug/prices?lang=en", "whatsapp", "status", "new-year")', equals: 'https://katorides.co.ug/prices?lang=en&utm_source=whatsapp&utm_medium=status&utm_campaign=new-year', label: 'An existing parameter is kept', hidden: true },
        ],
        hints: ['`new URL(base)` takes the address apart. Its `searchParams` has a `.set(name, value)` method that adds or replaces a parameter, and it also encodes special characters for you.', 'Call `url.searchParams.set("utm_source", source)` for each of the three labels, in the order source, medium, campaign.', '`url.toString()` gives the finished address as text.'],
      },
      {
        id: 'w50-top-sources',
        title: 'Which source brings the most visitors?',
        prompt: 'Write `topSources(visits)`. `visits` is a list of objects like `{ source: "facebook" }`. Return a list of `[source, count]` pairs, sorted with the biggest count first. When two sources have the same count, sort them alphabetically.',
        files: ['js'],
        starter: { js: '// Write topSources(visits)\n' },
        solution: { js: TOP_SOURCES_SOLUTION },
        checks: [
          { js: 'JSON.stringify(topSources([{ source: "facebook" }, { source: "google" }, { source: "facebook" }]))', equals: '[["facebook",2],["google",1]]' },
          { js: 'JSON.stringify(topSources([]))', equals: '[]', label: 'No visits gives an empty list' },
          { js: 'JSON.stringify(topSources([{ source: "whatsapp" }, { source: "google" }]))', equals: '[["google",1],["whatsapp",1]]', label: 'A tie is sorted alphabetically' },
          { js: 'JSON.stringify(topSources([{ source: "a" }, { source: "b" }, { source: "b" }, { source: "c" }, { source: "c" }, { source: "c" }]))', equals: '[["c",3],["b",2],["a",1]]', hidden: true },
        ],
        hints: ['First count: make an empty object `counts` and, for each visit, add 1 to `counts[visit.source]` (starting from 0 when it is new).', '`Object.entries(counts)` turns the object into a list of `[source, count]` pairs. Then `.sort(...)`.', 'The sort rule: `(a, b) => b[1] - a[1] || a[0].localeCompare(b[0])`. The `||` only uses the alphabet when the counts are equal.'],
      },
    ],
  },

  // ================================================================== w51
  {
    id: 'w51-css-frameworks-design-systems',
    level: 'Level 6: Launch-ready for any company',
    title: 'CSS frameworks and design systems',
    summary: 'Read Bootstrap and Tailwind code with confidence, build your own tiny utility classes and design tokens, and turn a design into consistent spacing and type scales.',
    minutes: 32,
    blocks: [
      {
        t: 'story',
        title: 'The job advert that says Tailwind',
        text: 'Rose\'s cousin Grace sees a job advert from a Kampala web agency: \"Front-end developer. Bootstrap or Tailwind required.\" She panics. She can write CSS, but she has never used either. A week later at the interview she is shown a page full of strange class names like `d-flex justify-content-between p-3` and `flex items-center gap-4 md:flex-row`, and asked what they do.\n\nThe good news: **frameworks are not new magic. They are CSS you already understand, written by someone else and given short names.** Once you can read them you can use any of them. And once you see how they work, you can build a small one yourself, which is exactly what this lesson does.',
      },
      { t: 'analogy', text: 'Think of fabric shops. **Plain CSS** is buying cloth and cutting every garment yourself: perfect fit, slow. **Bootstrap** is buying ready-made shirts and trousers: quick, but many people end up wearing the same shirt. **Tailwind** is buying a box of ready-cut pieces (sleeves, collars, buttons) and stitching them as you like: fast and flexible, but your HTML gets busy.' },
      { t: 'h', text: 'Two styles of framework' },
      {
        t: 'list',
        items: [
          '**Component frameworks (Bootstrap).** You write the component name: `<a class="btn btn-primary">`, `<div class="card">`, `<nav class="navbar">`. It brings a **12-column grid** (`container`, `row`, `col-md-6`) and ready-made buttons, cards, forms and menus. Fast to start, and recognisable, so sites can look alike until you customise it.',
          '**Utility frameworks (Tailwind).** You write tiny single-purpose classes straight in the HTML: `p-4` (padding), `flex`, `gap-2`, `text-lg`, `bg-green-700`, `rounded`, and size prefixes like `md:flex-row` (\"from the medium screen up, a row\"). You rarely write CSS files.',
          'Both **load from a file or a build step**: a `<link>` to a stylesheet from a CDN, or tools that generate the CSS. In these lessons the preview is offline, so you will build and use a tiny framework of your own.',
          '**When to use one:** a team or agency already uses it, a deadline is short, or an admin dashboard needs many standard parts. **When plain CSS wins:** a small, unusual, very fast page where you want full control and no extra file.',
        ],
      },
      { t: 'h', text: 'Read the class soup' },
      { t: 'p', text: 'Every class does one thing you already know. Decode this Bootstrap-style line, then the Tailwind-style one:' },
      {
        t: 'list',
        items: [
          '`d-flex justify-content-between p-3` is `display: flex; justify-content: space-between; padding: 1rem;`.',
          '`btn btn-primary btn-lg` is a button, in the main colour, in the large size.',
          '`flex items-center gap-4 p-4 md:p-8` is `display: flex; align-items: center; gap: 16px; padding: 16px;`, and from the medium screen up `padding: 32px`.',
        ],
      },
      { t: 'h', text: 'Build a tiny utility framework' },
      { t: 'p', text: 'Here is the idea in twelve lines. Each class carries ONE declaration, and the page is built by combining them. This is how Tailwind works, minus the thousands of extra classes and the build tool.' },
      {
        t: 'web',
        title: 'A page built only from utility classes. The stylesheet below has twelve tiny rules.',
        files: ['css', 'html'],
        assets: ASSETS,
        starter: { html: page(UTILITY_HTML, { css: true }), css: UTILITY_CSS },
        checks: [
          { style: 'header', prop: 'display', is: 'flex' },
          { style: 'header', prop: 'background-color', is: '#0b6b4f' },
          { style: 'header', prop: 'padding-top', is: '16px' },
          { style: 'h1', prop: 'text-align', is: 'center' },
          { style: 'main p', prop: 'margin-top', is: '16px' },
        ],
      },
      {
        t: 'see',
        files: { html: page(UTILITY_HTML, { css: true }), css: UTILITY_CSS },
        question: 'In the page above, the link `<a class="p-2 rounded text-white">` gets its white text from which class?',
        options: ['text-white', 'bg-brand', 'p-2', 'rounded'],
        answer: 0,
        explain: 'Each utility class carries one declaration. `text-white` sets `color: #ffffff`, `p-2` the padding, and `rounded` the corners. `bg-brand` colours the header, not the text.',
        proof: [{ style: 'header a', prop: 'color', is: '#ffffff' }, { style: 'header a', prop: 'border-radius', is: '8px' }],
      },
      { t: 'h', text: 'Component classes: the Bootstrap way' },
      { t: 'p', text: 'With a component framework you describe the **structure** and the framework styles it. The layout of two cards side by side is always the same pattern: a `container`, a `row`, and a `col` for each card.' },
      {
        t: 'web',
        title: 'Two cards in a grid, written the Bootstrap way. The stylesheet is a small stand-in for the framework.',
        files: ['html'],
        assets: ASSETS,
        starter: {
          html: page('<div class="container">\n  <div class="row">\n    <div class="col-6">\n      <div class="card">\n        <div class="card-body">\n          <h2>Parcels</h2>\n          <p>Same-day delivery.</p>\n          <a class="btn btn-primary" href="#parcels">Book</a>\n        </div>\n      </div>\n    </div>\n    <div class="col-6">\n      <div class="card">\n        <div class="card-body">\n          <h2>Shopping</h2>\n          <p>We buy and deliver.</p>\n          <a class="btn btn-primary" href="#shopping">Book</a>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>', { css: true }),
          css: MINI_FRAMEWORK,
        },
        checks: [{ count: '.container .row .col-6 .card .card-body', equals: 2 }, { count: 'a.btn.btn-primary', equals: 2 }, { style: 'a.btn', prop: 'background-color', is: '#0b6b4f' }],
      },
      { t: 'h', text: 'Design systems: tokens, scales and consistency' },
      {
        t: 'list',
        items: [
          'A **design system** is the agreed set of choices for a brand: colours, fonts, spacing, button styles. It is why a company\'s site, app and posters feel like one family.',
          '**Design tokens** are those choices as named values. In CSS they are **custom properties**: `--brand: #0b6b4f;`, used with `var(--brand)`. Change a token once and the whole site follows.',
          'A **spacing scale** (for example 4, 8, 16, 24, 32, 48 pixels) stops every gap being a random number. A **type scale** grows font sizes by one ratio (for example 1.25 each step: 16, 20, 25, 31 pixels), which looks calm and professional.',
          'A **wireframe** is a grey-box sketch of a page (header, hero, three cards, footer) made BEFORE colours and fonts. It lets you and the client agree on the content and the order cheaply.',
          '**Design handoff**: when a client gives you a Figma or other design file, read the colours, the font sizes and the spacing from it, put them into tokens, and build the same scales instead of eyeballing pixels.',
        ],
      },
      {
        t: 'web',
        title: 'The same page with design tokens. Change `--brand` in the CSS and watch both coloured areas follow.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(TOKENS_HTML, { css: true }), css: TOKENS_SOLUTION },
        checks: [{ uses: 'css', pattern: ':root\\s*\\{[^}]*--brand:\\s*#0b6b4f' }, { uses: 'css', pattern: 'var\\(--brand\\)' }, { exists: '.hero' }],
      },
      {
        t: 'try',
        code: 'function typeScale(base, ratio, steps) {\n  const sizes = [];\n  for (let i = 0; i < steps; i++) {\n    sizes.push(Math.round(base * Math.pow(ratio, i) * 10) / 10);\n  }\n  return sizes;\n}\n\nconsole.log(typeScale(16, 1.25, 5).join(", "));',
        output: '16, 20, 25, 31.3, 39.1',
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'html', wrong: '<a class="btn btn-primary">Book</a>', why: 'It is not wrong to use the class names, but this page never loaded the framework\'s stylesheet, so the classes do nothing. A framework is a file: link it (or build it) first.', right: '<a class="btn btn-primary" href="#book">Book</a>', logic: true },
          { lang: 'css', wrong: '.hero {\n  background-color: #0b6b4f;\n}\n.footer {\n  background-color: #0b6c4f;\n}', why: 'The brand colour was typed twice and one copy has a typo (`6c` instead of `6b`), so the footer is a slightly different green. Put the colour in a variable once and use `var(--brand)` everywhere.', right: ':root {\n  --brand: #0b6b4f;\n}\n.hero {\n  background-color: var(--brand);\n}\n.footer {\n  background-color: var(--brand);\n}', logic: true },
          { lang: 'dom', wrong: '<div class="p-4 p-2 p-8">', why: 'Three padding utilities on one element clash, and the one written LAST in the stylesheet wins (not the last in the HTML). Choose one value, and use responsive prefixes for changes.', right: '<div class="p-4 md:p-8">' },
          { lang: 'dom', wrong: '<div style="padding: 13px; margin-top: 7px; font-size: 17px;">', why: 'Random numbers make a page feel slightly \"off\". Take values from your scales, such as 16, 8 and 20, and keep them in classes or tokens.', right: '<div class="p-4 mt-2 text-lg">' },
        ],
      },
      {
        t: 'quiz',
        question: 'What does the Tailwind-style class `md:flex-row` mean?',
        options: ['From the medium screen width upward, lay the children out in a row', 'Use the medium font in a flexible row', 'Make the row medium sized', 'Mark the row as the most important'],
        answer: 0,
        explain: 'The `md:` prefix wraps the utility in a media query (a minimum width), and `flex-row` is `flex-direction: row`.',
      },
      {
        t: 'quiz',
        question: 'Why use `var(--brand)` instead of typing `#0b6b4f` everywhere?',
        options: ['Changing the colour once changes the whole site, and typos cannot creep in', 'Because hex colours do not work in CSS', 'Because variables make the page load faster', 'Because browsers ignore colours that are typed twice'],
        answer: 0,
        explain: 'A design token is a single source of truth. It is the heart of every design system.',
      },
      { t: 'recap', items: ['A CSS framework is CSS someone else wrote, with short class names. Bootstrap gives ready components (`btn`, `card`, a 12-column grid). Tailwind gives tiny utilities (`p-4`, `flex`, `md:flex-row`).', 'To read class soup, translate each class into the CSS you already know. Use a framework when a team or deadline calls for it, and plain CSS when you want control.', 'A framework is a file that must be loaded. The classes do nothing without it.', 'Design tokens (custom properties) hold each brand choice in one place. Spacing and type scales keep a site consistent.', 'Make a wireframe before colours, and read values from the client\'s design file into tokens instead of guessing pixels.', 'Building a tiny utility framework yourself is the quickest way to understand all of them.'] },
    ],
    exercises: [
      {
        id: 'w51-utilities',
        title: 'Write your own utility classes',
        prompt: 'The HTML is built from utility classes, but the stylesheet is empty, so nothing is styled. Write these classes (one declaration each):\n\n- `.flex` is `display: flex`, `.items-center` is `align-items: center`, `.justify-between` is `justify-content: space-between`\n- `.p-4` is `padding: 16px`, `.mt-4` is `margin-top: 16px`\n- `.bg-brand` is `background-color: #0b6b4f`, `.text-white` is `color: #ffffff`\n- `.text-center` is `text-align: center`, `.rounded` is `border-radius: 8px`',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(UTILITY_HTML, { css: true }), css: '/* Write the utility classes here */\n' },
        solution: { html: page(UTILITY_HTML, { css: true }), css: UTILITY_CSS },
        checks: [
          { style: 'header', prop: 'display', is: 'flex', label: '.flex makes the header a flex container' },
          { style: 'header', prop: 'align-items', is: 'center' },
          { style: 'header', prop: 'justify-content', is: 'space-between' },
          { style: 'header', prop: 'padding-top', is: '16px', label: '.p-4 gives 16px of padding' },
          { style: 'header', prop: 'background-color', is: '#0b6b4f' },
          { style: 'header', prop: 'color', is: '#ffffff' },
          { style: 'h1', prop: 'text-align', is: 'center' },
          { style: 'main p', prop: 'margin-top', is: '16px' },
          { style: 'header a', prop: 'border-radius', is: '8px' },
          { lint: 'css' },
        ],
        hints: ['Each class is one small rule: a dot, the class name, and one declaration. For example `.flex { display: flex; }`.', 'The spacing classes use the scale: `p-4` is 16px, and `p-2` is 8px (which the link needs too).', '```\n.p-2 { padding: 8px; }\n.p-4 { padding: 16px; }\n.mt-4 { margin-top: 16px; }\n```'],
      },
      {
        id: 'w51-card-markup',
        title: 'Two cards, the Bootstrap way',
        prompt: 'The framework stylesheet is loaded (it has `.container`, `.row`, `.col-6`, `.card`, `.card-body`, `.btn` and `.btn-primary`). Write the HTML: a `container` with one `row` that holds **two** `col-6` columns. Each column has a `card` with a `card-body` that contains an `<h2>`, a `<p>` and a link `<a class="btn btn-primary" href="...">`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<h1>Our services</h1>\n<!-- Build the two cards here -->', { css: true }), css: MINI_FRAMEWORK },
        solution: { html: page('<h1>Our services</h1>\n<div class="container">\n  <div class="row">\n    <div class="col-6">\n      <div class="card">\n        <div class="card-body">\n          <h2>Parcels</h2>\n          <p>Same-day delivery.</p>\n          <a class="btn btn-primary" href="#parcels">Book</a>\n        </div>\n      </div>\n    </div>\n    <div class="col-6">\n      <div class="card">\n        <div class="card-body">\n          <h2>Shopping</h2>\n          <p>We buy and deliver.</p>\n          <a class="btn btn-primary" href="#shopping">Book</a>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>', { css: true }), css: MINI_FRAMEWORK },
        checks: [
          { count: '.container > .row', equals: 1, label: 'A container holds one row' },
          { count: '.row > .col-6', equals: 2, label: 'The row has two columns' },
          { count: '.col-6 > .card > .card-body', equals: 2, label: 'Each column holds a card with a body' },
          { count: '.card-body h2', equals: 2 },
          { count: '.card-body p', equals: 2 },
          { count: '.card-body a.btn.btn-primary', equals: 2, label: 'Each card has a primary button link' },
          { lint: 'html' },
        ],
        hints: ['Work from the outside in: `container`, then `row`, then two `col-6`, and inside each one a `card`, then a `card-body`.', 'Inside a `card-body` you need three things in order: a heading, a paragraph and a link.', '```\n<div class="col-6">\n  <div class="card">\n    <div class="card-body">\n      <h2>Parcels</h2>\n      <p>Same-day delivery.</p>\n      <a class="btn btn-primary" href="#parcels">Book</a>\n    </div>\n  </div>\n</div>\n```'],
      },
      {
        id: 'w51-tokens',
        title: 'Move the colours into tokens',
        prompt: 'The same colours are typed again and again. Add a `:root` rule with these tokens:\n\n- `--brand: #0b6b4f`, `--cream: #fdf1d3`, `--accent: #f7c948`, `--ink: #1c1b18` and `--space: 24px`\n\nThen use `var(...)` in `.hero`, `.cta` and `.footer`, so that no colour value or 24px is typed twice any more.',
        files: ['css'],
        assets: ASSETS,
        starter: { html: page(TOKENS_HTML, { css: true }), css: TOKENS_STARTER },
        solution: { html: page(TOKENS_HTML, { css: true }), css: TOKENS_SOLUTION },
        checks: [
          { uses: 'css', pattern: ':root\\s*\\{[^}]*--brand:\\s*#0b6b4f', label: 'The --brand token is defined' },
          { uses: 'css', pattern: '--cream:\\s*#fdf1d3' },
          { uses: 'css', pattern: '--accent:\\s*#f7c948' },
          { uses: 'css', pattern: '--ink:\\s*#1c1b18' },
          { uses: 'css', pattern: '--space:\\s*24px' },
          { uses: 'css', pattern: '^(?:(?!#0b6b4f)[\\s\\S])*#0b6b4f(?:(?!#0b6b4f)[\\s\\S])*$', label: 'The brand colour is typed only once' },
          { uses: 'css', pattern: 'var\\(--brand\\)[\\s\\S]*var\\(--brand\\)', label: 'var(--brand) is used in more than one place' },
          { uses: 'css', pattern: 'var\\(--space\\)' },
          { lint: 'css' },
        ],
        hints: ['Tokens live in `:root { ... }`. Each one is `--name: value;`, with two dashes at the start of the name.', 'Replace each repeated value with `var(--name)`, for example `background-color: var(--brand);`.', '```\n:root {\n  --brand: #0b6b4f;\n  --space: 24px;\n}\n.hero {\n  background-color: var(--brand);\n  padding: var(--space);\n}\n```'],
      },
      {
        id: 'w51-type-scale',
        title: 'Build a type scale',
        prompt: 'Write `typeScale(base, ratio, steps)`. It returns a list of `steps` font sizes. The first is `base`, and each next size is the one before multiplied by `ratio`. Round every size to **one decimal place**.\n\nFor example `typeScale(16, 1.25, 4)` gives `[16, 20, 25, 31.3]`.',
        files: ['js'],
        starter: { js: '// Write typeScale(base, ratio, steps)\n' },
        solution: { js: TYPE_SCALE_SOLUTION },
        checks: [
          { js: 'JSON.stringify(typeScale(16, 1.25, 4))', equals: '[16,20,25,31.3]' },
          { js: 'JSON.stringify(typeScale(10, 2, 3))', equals: '[10,20,40]', label: 'A ratio of 2 doubles each time' },
          { js: 'typeScale(16, 1.25, 0).length', equals: 0, label: 'Zero steps gives an empty list' },
          { js: 'JSON.stringify(typeScale(18, 1.5, 2))', equals: '[18,27]', hidden: true },
        ],
        hints: ['Make an empty list `sizes` and loop `steps` times with an index `i` that starts at 0.', 'The size at step `i` is `base * Math.pow(ratio, i)`. Step 0 is just `base`, because anything to the power 0 is 1.', '```\nsizes.push(Math.round(base * Math.pow(ratio, i) * 10) / 10);\n```'],
      },
    ],
  },
];
