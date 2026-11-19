// Web track, launch-ready extension, group E: security part 2, quality and maintenance and handover, capstone 2.
// Lessons w58 to w60. See docs/WEB-TRACK.md for the roadmap.
// Headers such as Content-Security-Policy cannot run inside the lesson preview, so they are taught with code and tested as plain functions.
// The engine inlines a student's <script src> where the tag is, so scripts go at the END of the body.
import { ASSETS } from './assets.js';
import { fullPage } from './shared.js';

const page = (body, o = {}) => fullPage(body, { title: 'Lake Dental Clinic', ...o });

// ------------------------------------------------------------------ w58 helpers
const COOKIE_FN = `function cookieIssues(setCookie) {
  const parts = setCookie.split(";").map((part) => part.trim().toLowerCase());
  const missing = [];
  if (!parts.includes("secure")) {
    missing.push("Secure");
  }
  if (!parts.includes("httponly")) {
    missing.push("HttpOnly");
  }
  if (!parts.some((part) => part.startsWith("samesite="))) {
    missing.push("SameSite");
  }
  return missing;
}
`;

const HEADERS_SOLUTION = `function missingHeaders(headers) {
  const have = Object.keys(headers).map((name) => name.toLowerCase());
  const wanted = ["Content-Security-Policy", "X-Content-Type-Options", "Referrer-Policy", "Strict-Transport-Security"];
  return wanted.filter((name) => !have.includes(name.toLowerCase()));
}
`;

const SAFE_URL_SOLUTION = String.raw`function safeUrl(url) {
  const cleaned = url.replace(/[\u0000-\u0020]/g, "");
  const match = cleaned.match(/^([a-z][a-z0-9+.-]*):/i);
  if (!match) {
    return url.trim();
  }
  const scheme = match[1].toLowerCase();
  return ["http", "https", "mailto", "tel"].includes(scheme) ? url.trim() : "#";
}
`;

const CSP_SOLUTION = `function parseCsp(policy) {
  const result = {};
  for (const part of policy.split(";")) {
    const words = part.trim().split(/\\s+/).filter(Boolean);
    if (words.length === 0) {
      continue;
    }
    result[words[0].toLowerCase()] = words.slice(1);
  }
  return result;
}

function allowsInlineScripts(policy) {
  const csp = parseCsp(policy);
  const sources = csp["script-src"] || csp["default-src"];
  if (!sources) {
    return true;
  }
  return sources.includes("'unsafe-inline'");
}
`;

const PASSWORD_SOLUTION = String.raw`function passwordProblems(password, banned) {
  const problems = [];
  if (password.length < 10) {
    problems.push("too short");
  }
  if (banned.includes(password.toLowerCase())) {
    problems.push("too common");
  }
  if (/^(.)\1+$/.test(password)) {
    problems.push("one repeated character");
  }
  return problems;
}
`;

const LOGIN_STARTER = `<h1>Staff login</h1>
<form action="/login">
  <label for="email">Email</label>
  <input id="email" name="email">

  <label for="password">Password</label>
  <input id="password" name="password">

  <button>Log in</button>
</form>
<p>Need help? <a href="https://help.example.com" target="_blank">Visit our help page</a></p>`;

const LOGIN_SOLUTION = `<h1>Staff login</h1>
<form action="/login" method="post">
  <label for="email">Email</label>
  <input id="email" name="email" type="email" autocomplete="username" required>

  <label for="password">Password</label>
  <input id="password" name="password" type="password" autocomplete="current-password" minlength="10" required>

  <button type="submit">Log in</button>
</form>
<p>Need help? <a href="https://help.example.com" target="_blank" rel="noopener noreferrer">Visit our help page</a></p>`;

// ------------------------------------------------------------------ w59 helpers
const DAYS_FN = `function daysUntil(dateText, todayText) {
  const day = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(dateText + "T00:00:00Z") - Date.parse(todayText + "T00:00:00Z")) / day);
}
`;

const RENEWAL_SOLUTION = `${DAYS_FN}
function renewalStatus(expiry, today) {
  const days = daysUntil(expiry, today);
  if (days <= 0) {
    return "expired";
  }
  if (days <= 30) {
    return "renew now";
  }
  if (days <= 90) {
    return "plan renewal";
  }
  return "ok";
}
`;

const BROKEN_SOLUTION = `function findBrokenLinks(site) {
  const broken = [];
  for (const page of Object.keys(site)) {
    for (const link of site[page]) {
      if (link.startsWith("http") || link.startsWith("mailto:") || link.startsWith("tel:") || link.startsWith("#")) {
        continue;
      }
      const target = link.split("#")[0].split("?")[0];
      if (!(target in site)) {
        broken.push(page + " -> " + link);
      }
    }
  }
  return broken.sort();
}
`;

const SCORE_SOLUTION = `function launchScore(checklist) {
  const items = Object.keys(checklist);
  const done = items.filter((name) => checklist[name]).length;
  return {
    done,
    total: items.length,
    percent: items.length === 0 ? 0 : Math.round((done / items.length) * 100),
    missing: items.filter((name) => !checklist[name]),
  };
}
`;

const HANDOVER_SOLUTION = `<main>
  <h1>Lake Dental Clinic: website handover</h1>
  <p>Everything you need to run the website after launch.</p>

  <h2>Accounts</h2>
  <ul>
    <li>Domain name: lakedental.co.ug (registered in the clinic's name, renews every December)</li>
    <li>Hosting: a static host account owned by the clinic</li>
    <li>Analytics and Search Console: owned by the clinic</li>
  </ul>
  <p>All passwords are kept in the clinic's password manager. Never send a password in a chat message.</p>

  <h2>How to edit the content</h2>
  <p>Open content.json, change the prices or the text, and save. The website shows the new content.</p>

  <h2>How to deploy a change</h2>
  <p>Save the change to the main branch on GitHub. The site updates in about one minute.</p>

  <h2>If something breaks</h2>
  <p>Check that the domain has not expired, then check the host's status page, then contact support.</p>

  <h2>Support</h2>
  <p>Free fixes for 30 days. After that: <a href="mailto:grace@example.com">grace@example.com</a> or 0700 000 000.</p>
</main>`;

// ------------------------------------------------------------------ w60 helpers
const CLINIC_API = {
  '/api/clinic': {
    name: 'Lake Dental Clinic',
    services: [
      { name: 'Check-up', price: 30000 },
      { name: 'Cleaning', price: 60000 },
      { name: 'Filling', price: 90000 },
    ],
  },
  '/api/appointment': { ok: true },
};

const CLINIC_HEAD = `
  <meta name="description" content="Friendly family dentistry in Jinja: check-ups, cleaning and fillings. Book an appointment online or call us today.">
  <link rel="canonical" href="https://lakedental.co.ug/">
  <meta property="og:title" content="Lake Dental Clinic | Dentist in Jinja">
  <meta property="og:description" content="Friendly family dentistry in Jinja. Book online.">
  <meta property="og:image" content="https://lakedental.co.ug/img/share.jpg">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Lake Dental Clinic",
    "telephone": "+256700123456",
    "address": { "@type": "PostalAddress", "addressLocality": "Jinja", "addressCountry": "UG" }
  }
  </script>`;

const CLINIC_BODY = `  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="logo" href="#top" id="clinic-name">Lake Dental Clinic</a>
    <button id="menu-btn" class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-nav">&#9776;</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        <li><a href="#services">Services</a></li>
        <li><a href="#book">Book</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main id="main">
    <section class="hero" id="top">
      <h1>Gentle dentistry in Jinja</h1>
      <p>Check-ups, cleaning and fillings for the whole family.</p>
      <img src="img/phone-hero.svg" alt="A phone showing the clinic's booking page" width="320" height="200" fetchpriority="high">
    </section>

    <section id="services">
      <h2>Our services</h2>
      <ul id="service-list"></ul>
      <div class="gallery">
        <img src="img/pin.svg" alt="A map pin marking the clinic" width="160" height="100" loading="lazy" decoding="async">
        <img src="img/logo.svg" alt="The clinic logo" width="160" height="100" loading="lazy" decoding="async">
      </div>
    </section>

    <section id="book">
      <h2>Book an appointment</h2>
      <form id="appointment" data-endpoint="/api/appointment">
        <label for="name">Your name</label>
        <input id="name" name="name" type="text" required autocomplete="name">

        <label for="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" required autocomplete="tel">

        <input class="trap" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button type="submit">Book now</button>
        <p id="status" role="status"></p>
      </form>
    </section>
  </main>

  <footer id="contact">
    <p>Call <a href="tel:+256700123456">0700 123 456</a> or <a href="https://wa.me/256700123456">chat on WhatsApp</a>.</p>
    <p><a href="privacy.html">Privacy policy</a></p>
  </footer>

  <div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Cookie choices" hidden>
    <p>We would like to count visitors to improve this site. You choose. <a href="privacy.html">Privacy policy</a></p>
    <button id="accept" type="button">Accept</button>
    <button id="reject" type="button">Reject</button>
  </div>`;

const CLINIC_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lake Dental Clinic | Dentist in Jinja, Uganda</title>${CLINIC_HEAD}
  <link rel="stylesheet" href="style.css">
</head>
<body>
${CLINIC_BODY}
  <script src="script.js"></script>
</body>
</html>
`;

const CLINIC_CSS = `:root {
  --brand: #0b6b4f;
  --cream: #fdf1d3;
  --accent: #f7c948;
  --ink: #1c1b18;
  --space: 16px;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: var(--ink);
  background-color: #ffffff;
  line-height: 1.5;
}
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: var(--space);
  top: var(--space);
  padding: 8px 16px;
  background-color: var(--accent);
  z-index: 10;
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 8px var(--space);
  background-color: var(--brand);
  color: #ffffff;
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
main {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--space);
}
.hero {
  padding: 24px 0;
}
.hero img {
  max-width: 100%;
  height: auto;
}
.gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space);
}
.gallery img {
  max-width: 100%;
  height: auto;
}
form {
  max-width: 400px;
}
label {
  display: block;
  margin-top: 12px;
}
input[type="text"],
input[type="tel"] {
  width: 100%;
  min-height: 44px;
  padding: 8px;
  font-size: 16px;
}
.trap {
  position: absolute;
  left: -9999px;
}
form button {
  min-height: 44px;
  margin-top: var(--space);
  padding: 8px 24px;
  font-size: 16px;
  color: #ffffff;
  background-color: var(--brand);
  border: none;
  border-radius: 8px;
}
footer {
  margin-top: 32px;
  padding: var(--space);
  background-color: var(--cream);
}
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--space);
  color: #ffffff;
  background-color: var(--ink);
}
.cookie-banner button {
  min-width: 96px;
  min-height: 44px;
  margin-right: 8px;
  font-size: 16px;
}
.cookie-banner a {
  color: var(--accent);
}
a:focus-visible,
button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
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
  .gallery {
    grid-template-columns: 1fr 1fr;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none;
    animation: none;
  }
}
`;

const CLINIC_JS = `document.documentElement.classList.add("js");

// ---- Menu
const button = document.querySelector("#menu-btn");
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

// ---- Consent and tracking
window.dataLayer = window.dataLayer || [];
const banner = document.querySelector("#cookie-banner");

function choose(value) {
  localStorage.setItem("consent", value);
  banner.hidden = true;
}

function track(name) {
  if (localStorage.getItem("consent") !== "accepted") {
    return;
  }
  window.dataLayer.push({ event: name });
}

if (localStorage.getItem("consent") === null) {
  banner.hidden = false;
}
document.querySelector("#accept").addEventListener("click", () => choose("accepted"));
document.querySelector("#reject").addEventListener("click", () => choose("rejected"));

// ---- Content from the CMS
const list = document.querySelector("#service-list");

async function loadClinic() {
  try {
    const response = await fetch("/api/clinic");
    if (!response.ok) {
      throw new Error("Could not load");
    }
    const clinic = await response.json();
    document.querySelector("#clinic-name").textContent = clinic.name;
    for (const service of clinic.services) {
      const li = document.createElement("li");
      li.textContent = service.name + ": UGX " + service.price.toLocaleString("en-US");
      list.append(li);
    }
  } catch (error) {
    list.textContent = "Our price list is not available right now. Please call 0700 123 456.";
  }
}

loadClinic();

// ---- Appointment form
const form = document.querySelector("#appointment");
const status = document.querySelector("#status");
const submit = form.querySelector("button");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (form.elements._gotcha.value) {
    return;
  }
  submit.disabled = true;
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
    status.textContent = "Thank you, " + data.received.name + "! We will call you to confirm.";
    track("appointment_booked");
  } catch (error) {
    status.textContent = "Sorry, that did not send. Please call 0700 123 456.";
  } finally {
    submit.disabled = false;
  }
});
`;

const CLINIC_STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lake Dental Clinic</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Lake Dental Clinic</h1>
  <script src="script.js"></script>
</body>
</html>
`;

const FILL = [
  { do: 'type', target: '#name', value: 'Amina' },
  { do: 'type', target: '#phone', value: '0700123456' },
  { do: 'submit', target: '#appointment', ms: 90 },
];

export const launch5Lessons = [
  // ================================================================== w58
  {
    id: 'w58-security-2',
    level: 'Level 6: Launch-ready for any company',
    title: 'Security, part 2: cookies, headers, passwords and trust',
    summary: 'Keep a company site safe in practice: cookie flags, security headers and CSP, CORS and CSRF in plain words, safe links, passwords, secrets and updates.',
    minutes: 36,
    blocks: [
      {
        t: 'story',
        title: 'Friday morning, a message in red',
        text: 'On Friday morning a friend of Grace\'s phones in panic. His bakery\'s website now says \"HACKED\" in red letters, and customers are seeing it. Nothing fancy happened. His site ran on an old plugin that had a known flaw, and the admin password was `123456`.\n\nSmall businesses are not attacked by clever people looking for them one by one. They are attacked by **robots** that try the same weak passwords and known flaws on millions of sites. In Lesson 33 you learned the basics: HTTPS, cross-site scripting and secrets. Here is the rest of the professional\'s checklist, in plain words.',
      },
      { t: 'analogy', text: 'A shop is protected in **layers**: a lock on the door (HTTPS), a guard who checks who comes in (validation and login), a safe for the money (secrets), a camera (logs), and a spare key that only the owner holds (access control). No single layer is perfect, and a thief must get through all of them. Security in web work is the same: **many small defences that add up**.' },
      { t: 'h', text: 'The one rule behind everything' },
      { t: 'p', text: '**Never trust anything that comes from the browser.** A visitor can change the address, the form fields, the cookies and the headers; a robot does not even use a browser. The page you send is a request, not a rule. Every important check (is this person allowed? is this value valid?) must be done again on the server, and everything you show must be treated as text, never as code.' },
      { t: 'h', text: 'What really goes wrong on small sites' },
      {
        t: 'list',
        items: [
          '**Weak or reused passwords**, and no second step (MFA).',
          '**Old software**: a CMS, a plugin or a library with a published flaw that nobody updated.',
          '**Secrets in the open**: an API key or password committed to a public GitHub repository.',
          '**Untrusted text shown as code** (cross-site scripting) and **untrusted text put into a database command** (injection).',
          '**Phishing**: a fake login page or an urgent message (\"your account will close\") that tricks a person into giving their password. No code can stop this, only training.',
          '**No backups**, so one attack becomes the end of the business.',
        ],
      },
      { t: 'h', text: 'Cookies: three flags that matter' },
      { t: 'p', text: 'A cookie that holds a login (a **session**) is the key to someone\'s account, so it needs protection. When the server sets it, it adds flags:' },
      {
        t: 'list',
        items: [
          '`Secure`: the cookie is sent only over https, never over an open connection.',
          '`HttpOnly`: JavaScript cannot read the cookie. If an attacker manages to run a script on your page, they still cannot steal the session cookie.',
          '`SameSite=Lax` (or `Strict`): the browser does not send the cookie when the request comes from ANOTHER website, which blocks most cross-site request forgery.',
        ],
      },
      {
        t: 'try',
        code: 'function cookieIssues(setCookie) {\n  const parts = setCookie.split(";").map((part) => part.trim().toLowerCase());\n  const missing = [];\n  if (!parts.includes("secure")) missing.push("Secure");\n  if (!parts.includes("httponly")) missing.push("HttpOnly");\n  if (!parts.some((part) => part.startsWith("samesite="))) missing.push("SameSite");\n  return missing;\n}\n\nconsole.log(cookieIssues("session=abc; Path=/; Secure; HttpOnly; SameSite=Lax").length);\nconsole.log(cookieIssues("session=abc; Path=/").join(", "));',
        output: '0\nSecure, HttpOnly, SameSite',
      },
      {
        t: 'see',
        files: { html: page('<h1>Cookies</h1>\n<p>Which flag stops JavaScript from reading a cookie?</p>') },
        question: 'An attacker finds a way to run a script on your page. Which cookie flag stops that script from reading the visitor\'s session cookie?',
        options: ['HttpOnly', 'Secure', 'SameSite', 'Path'],
        answer: 0,
        explain: '`HttpOnly` hides the cookie from JavaScript completely (`document.cookie` will not show it). `Secure` is about https, `SameSite` is about requests from other sites.',
        proof: [{ exists: 'h1' }],
      },
      { t: 'h', text: 'Two browser rules with confusing names' },
      {
        t: 'list',
        items: [
          '**CSRF (cross-site request forgery).** A visitor logged in to your site opens an evil page. That page quietly sends a request to your site, and the browser attaches the visitor\'s cookies, so your server thinks the visitor did it. Defences: `SameSite` cookies, a secret **anti-CSRF token** in each form, and checking where the request came from.',
          '**CORS (cross-origin resource sharing).** By default a page from one site cannot READ the answers from another site. A server can allow it by sending `Access-Control-Allow-Origin: https://yoursite.co.ug`. CORS protects the visitor\'s browser, NOT your server: robots ignore it. Never answer `*` for a service that uses logins, and never rely on CORS to keep data private.',
        ],
      },
      { t: 'h', text: 'Security headers and CSP' },
      { t: 'p', text: 'A **response header** is a line the server sends before the page. A few headers tell the browser to be stricter, and they cost nothing:' },
      {
        t: 'list',
        items: [
          '`Strict-Transport-Security` (HSTS): \"always use https for this site\".',
          '`X-Content-Type-Options: nosniff`: do not guess the type of a file.',
          '`Referrer-Policy: strict-origin-when-cross-origin`: share less of your addresses with other sites.',
          '`Content-Security-Policy` (CSP): a list of where scripts, images and styles may come from. If an attacker injects a script from an evil address, the browser refuses to run it.',
        ],
      },
      {
        t: 'code',
        text: "Content-Security-Policy: default-src 'self'; img-src 'self' data:; script-src 'self'; frame-ancestors 'none'",
      },
      { t: 'p', text: 'That policy says: load everything only from my own site; images may also be inline `data:`; scripts only from my site (no inline scripts); and nobody may put my site in a frame (which stops clickjacking). Words like `\'unsafe-inline\'` switch the protection off again, so avoid them. A good habit is to start in **report-only** mode, read the reports, and then enforce. Static hosts set headers in a settings file (for example a `_headers` file on Netlify) or in the dashboard. (A restrictive policy would also block these lesson previews, so here we only read and test policies as text.)' },
      {
        t: 'code',
        text: '<script src="https://cdn.example.com/lib.js"\n        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"\n        crossorigin="anonymous"></script>',
      },
      { t: 'p', text: 'The `integrity` attribute above is **Subresource Integrity**: a fingerprint of the file you tested. If the third-party server is hacked and changes the file, the browser refuses to run it. Use it for every script or style you load from someone else\'s server.' },
      { t: 'h', text: 'Passwords and login' },
      {
        t: 'list',
        items: [
          '**Never build your own login system if you can avoid it.** Use your CMS\'s login, or a trusted provider (Google sign-in, Firebase Authentication, Auth0). Login is easy to get subtly wrong.',
          'A server must NEVER store passwords as plain text. It stores a **hash** made with a slow, salted function (bcrypt or Argon2). Even the developer cannot read the password.',
          'Good rules favour **length** and a **blocklist of common passwords** over strange required symbols. `kampala-rain-boda-2026` beats `P@ssw0rd!`. Allow password managers (paste must work).',
          'Offer a second step (**MFA**) for admin accounts, and limit repeated wrong tries (rate limiting).',
          'Give clients a **password manager** and teach them: one strong password per site, no sharing passwords in a chat message.',
          'Mark login fields properly: `type="password"` and `autocomplete="current-password"`, so browsers and password managers can help.',
        ],
      },
      { t: 'h', text: 'Links, secrets and updates' },
      {
        t: 'list',
        items: [
          'Links that open a new tab need `rel="noopener noreferrer"`, so the new page cannot control yours.',
          'When you build a link from data (a CMS field, a query string), allow only safe schemes: `http`, `https`, `mailto`, `tel`. A link beginning `javascript:` runs code when clicked.',
          'Keep secrets out of code and out of Git: use environment variables and a `.gitignore` file. If a key ever reaches a public repository, treat it as stolen and **replace it** at once.',
          'Update your CMS, plugins and libraries on a schedule, and remove the ones you do not use. Most hacked small sites were running software with a known fix.',
          'Keep backups somewhere an attacker cannot reach (Lesson 59), and test that you can restore them.',
        ],
      },
      {
        t: 'web',
        title: 'A sensible login form. Look at the types and autocomplete values, and the link that opens in a new tab.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(LOGIN_SOLUTION, { title: 'Staff login | Lake Dental Clinic' }) },
        checks: [
          { attr: 'form', name: 'method', equals: 'post' },
          { attr: '#password', name: 'type', equals: 'password' },
          { attr: '#password', name: 'autocomplete', equals: 'current-password' },
          { attr: 'a[target="_blank"]', name: 'rel', contains: 'noopener' },
          { rule: 'form-labels' },
        ],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: 'const API_KEY = "sk_live_51Hx...";\nfetch("https://api.example.com/charge?key=" + API_KEY);', why: 'A secret in front-end code (or in a public repository) is visible to everyone. Keep secrets on a server, in environment variables, and call the service from there.', right: '// On the server only:\nconst API_KEY = process.env.PAYMENT_KEY;' },
          { lang: 'html', wrong: '<a href="https://partner.example.com" target="_blank">Our partner</a>', why: 'A page opened with `target="_blank"` can, in some browsers, reach back and change your page through `window.opener`. Add `rel="noopener noreferrer"`.', right: '<a href="https://partner.example.com" target="_blank" rel="noopener noreferrer">Our partner</a>', logic: true },
          { lang: 'dom', wrong: 'link.href = user.website;', why: 'If `user.website` is `javascript:stealCookies()`, clicking the link runs it. Check the scheme first and allow only http, https, mailto and tel.', right: 'link.href = safeUrl(user.website);' },
          { lang: 'dom', wrong: 'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true', why: 'Allowing every website to read answers that include a logged-in visitor\'s data defeats the point of CORS. Name the exact origin you trust, and remember that CORS never protects your server from robots.', right: 'Access-Control-Allow-Origin: https://lakedental.co.ug\nAccess-Control-Allow-Credentials: true' },
          { lang: 'dom', wrong: 'Set-Cookie: session=abc123', why: 'No `Secure`, no `HttpOnly`, no `SameSite`: a stolen script can read it, it travels over open connections, and other sites can send it. Add all three flags.', right: 'Set-Cookie: session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax' },
          { lang: 'dom', wrong: 'if (password === storedPassword) { login(); }', why: 'This means passwords are stored as readable text. Store only a salted hash (bcrypt or Argon2) and compare hashes, so a stolen database does not reveal passwords.', right: 'if (await bcrypt.compare(password, storedHash)) { login(); }' },
        ],
      },
      {
        t: 'quiz',
        question: 'A bakery website was hacked through an old plugin. What is the most effective habit to prevent this?',
        options: ['Update software on a schedule and remove what you do not use', 'Hide the website address', 'Use a longer title', 'Turn off the images'],
        answer: 0,
        explain: 'Robots look for known flaws that have known fixes. Updating closes the door they are trying.',
      },
      {
        t: 'quiz',
        question: 'Why is CORS not a way to keep your data private?',
        options: ['It only restricts web browsers; a robot or a script ignores it completely', 'It is too slow', 'It only works on Mondays', 'It deletes cookies'],
        answer: 0,
        explain: 'CORS is the browser protecting the visitor. Anything that is not a browser can ask your server directly. Protect data on the server with real checks.',
      },
      { t: 'recap', items: ['Never trust the browser: every important check is repeated on the server, and shown text is never treated as code.', 'Session cookies need `Secure`, `HttpOnly` and `SameSite`. CSRF is defeated by SameSite cookies and anti-CSRF tokens. CORS protects visitors, not servers.', 'Security headers (HSTS, `nosniff`, Referrer-Policy) and a Content-Security-Policy without `unsafe-inline` make attacks harder. Use `integrity` on third-party scripts.', 'Use a trusted login (CMS or provider) where you can. Servers store salted hashes, never passwords. Favour long passwords, a common-password blocklist and MFA. Give clients a password manager.', 'Use `rel="noopener noreferrer"` on `_blank` links, allow only safe URL schemes, keep secrets out of code, and replace any key that leaks.', 'Update on a schedule, remove unused software, keep tested backups, and train people about phishing.'] },
    ],
    exercises: [
      {
        id: 'w58-cookie-audit',
        title: 'Audit a cookie',
        prompt: 'Write `cookieIssues(setCookie)`. It receives the text of a `Set-Cookie` header, like `session=abc; Path=/; Secure`. Return a list of the protections that are **missing**, in this order: `"Secure"`, `"HttpOnly"`, `"SameSite"`. `SameSite` counts as present when any part starts with `SameSite=`. Ignore upper and lower case, and spaces around the parts.',
        files: ['js'],
        starter: { js: '// Write cookieIssues(setCookie)\n' },
        solution: { js: COOKIE_FN },
        checks: [
          { js: 'JSON.stringify(cookieIssues("session=abc; Path=/; Secure; HttpOnly; SameSite=Lax"))', equals: '[]', label: 'A protected cookie has no issues' },
          { js: 'JSON.stringify(cookieIssues("session=abc; Path=/"))', equals: '["Secure","HttpOnly","SameSite"]', label: 'An unprotected cookie misses all three' },
          { js: 'JSON.stringify(cookieIssues("id=1; Secure; SameSite=Strict"))', equals: '["HttpOnly"]' },
          { js: 'JSON.stringify(cookieIssues("id=1; secure; httponly"))', equals: '["SameSite"]', label: 'Upper and lower case do not matter' },
          { js: 'JSON.stringify(cookieIssues("id=1;HttpOnly;  SameSite=None"))', equals: '["Secure"]', label: 'Spaces around parts do not matter', hidden: true },
        ],
        hints: ['Split the text at `;` and clean every part with `.trim().toLowerCase()`. Then you can look for exact words.', '`parts.includes("secure")` checks for an exact part. For SameSite the part has a value, so use `parts.some((part) => part.startsWith("samesite="))`.', 'Build an array `missing`, and `push` a name onto it each time a protection is absent. Keep the order Secure, HttpOnly, SameSite.'],
      },
      {
        id: 'w58-header-audit',
        title: 'Audit the response headers',
        prompt: 'Write `missingHeaders(headers)`. `headers` is an object of a response\'s headers (names can be in any letter case). Return the recommended headers that are **missing**, in this order, with these exact spellings: `"Content-Security-Policy"`, `"X-Content-Type-Options"`, `"Referrer-Policy"`, `"Strict-Transport-Security"`.',
        files: ['js'],
        starter: { js: '// Write missingHeaders(headers)\n' },
        solution: { js: HEADERS_SOLUTION },
        checks: [
          { js: 'JSON.stringify(missingHeaders({}))', equals: '["Content-Security-Policy","X-Content-Type-Options","Referrer-Policy","Strict-Transport-Security"]', label: 'Nothing set means all four are missing' },
          { js: 'JSON.stringify(missingHeaders({ "content-security-policy": "default-src \'self\'", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer", "strict-transport-security": "max-age=31536000" }))', equals: '[]', label: 'Letter case does not matter' },
          { js: 'JSON.stringify(missingHeaders({ "X-Content-Type-Options": "nosniff" }))', equals: '["Content-Security-Policy","Referrer-Policy","Strict-Transport-Security"]' },
          { js: 'JSON.stringify(missingHeaders({ "Content-Type": "text/html", "Referrer-Policy": "no-referrer" }))', equals: '["Content-Security-Policy","X-Content-Type-Options","Strict-Transport-Security"]', hidden: true },
        ],
        hints: ['Make a list of the header names that are present, all in lower case: `Object.keys(headers).map((name) => name.toLowerCase())`.', 'Keep the four wanted names in an array in the required order and `.filter` out the ones that are present.', 'For each wanted name compare in lower case: `!have.includes(name.toLowerCase())`, but return the name with its original spelling.'],
      },
      {
        id: 'w58-safe-url',
        title: 'Make links safe',
        prompt: 'Write `safeUrl(url)`. It returns the URL (trimmed) when it is safe to put in a link, and `"#"` when it is not.\n\n- A URL with no scheme, like `/prices` or `contact.html`, is fine.\n- Allowed schemes: `http`, `https`, `mailto`, `tel` (in any letter case).\n- Anything else (`javascript:`, `data:`, ...) becomes `#`.\n- Browsers ignore spaces and control characters inside the scheme, so `java\\tscript:alert(1)` is also dangerous. Remove all characters up to and including the space (`\\u0000` to `\\u0020`) before you look for a scheme.',
        files: ['js'],
        starter: { js: '// Write safeUrl(url)\n' },
        solution: { js: SAFE_URL_SOLUTION },
        checks: [
          { js: 'safeUrl("/prices")', equals: '/prices', label: 'A relative link is fine' },
          { js: 'safeUrl("https://wa.me/256700123456")', equals: 'https://wa.me/256700123456' },
          { js: 'safeUrl("mailto:info@lakedental.co.ug")', equals: 'mailto:info@lakedental.co.ug' },
          { js: 'safeUrl("javascript:alert(1)")', equals: '#', label: 'javascript: is blocked' },
          { js: 'safeUrl("  JavaScript:alert(1)")', equals: '#', label: 'Spaces and capitals do not fool it' },
          { js: 'safeUrl("java\\tscript:alert(1)")', equals: '#', label: 'A hidden tab inside the scheme does not fool it', hidden: true },
          { js: 'safeUrl("data:text/html,<b>x")', equals: '#', hidden: true },
          { js: 'safeUrl("page.html?x=a:b")', equals: 'page.html?x=a:b', label: 'A colon later in the URL is not a scheme', hidden: true },
        ],
        hints: ['First make a cleaned copy with the control characters and spaces removed: `url.replace(/[\\u0000-\\u0020]/g, "")`. Use the cleaned copy only to find the scheme.', 'A scheme is letters at the very start followed by a colon: `cleaned.match(/^([a-z][a-z0-9+.-]*):/i)`. No match means a relative link, so return `url.trim()`.', 'With a match, take `match[1].toLowerCase()` and check it with `["http", "https", "mailto", "tel"].includes(scheme)`.'],
      },
      {
        id: 'w58-csp',
        title: 'Read a Content-Security-Policy',
        prompt: 'Write two functions.\n\n`parseCsp(policy)` turns a policy text into an object. The text is split at `;`, and each part is a directive name followed by its sources (separated by spaces). The result maps each lower-case directive name to the list of its sources, for example `"default-src \'self\'; img-src \'self\' data:"` gives `{ "default-src": ["\'self\'"], "img-src": ["\'self\'", "data:"] }`.\n\n`allowsInlineScripts(policy)` returns `true` when inline scripts could run: it looks at `script-src`, or at `default-src` when there is no `script-src`. If the sources include `\'unsafe-inline\'` return `true`. If neither directive is present at all, nothing restricts scripts, so return `true`. Otherwise `false`.',
        files: ['js'],
        starter: { js: '// Write parseCsp(policy) and allowsInlineScripts(policy)\n' },
        solution: { js: CSP_SOLUTION },
        checks: [
          { js: 'JSON.stringify(parseCsp("default-src \'self\'; img-src \'self\' data:"))', equals: "{\"default-src\":[\"'self'\"],\"img-src\":[\"'self'\",\"data:\"]}" },
          { js: 'JSON.stringify(parseCsp("  Script-Src  \'self\' ;; "))', equals: "{\"script-src\":[\"'self'\"]}", label: 'Extra spaces, capitals and empty parts are handled' },
          { js: 'allowsInlineScripts("default-src \'self\'")', equals: false, label: 'default-src without unsafe-inline blocks inline scripts' },
          { js: 'allowsInlineScripts("script-src \'self\' \'unsafe-inline\'")', equals: true, label: 'unsafe-inline allows them' },
          { js: 'allowsInlineScripts("default-src \'self\'; script-src \'self\'")', equals: false, label: 'script-src wins over default-src' },
          { js: 'allowsInlineScripts("img-src \'self\'")', equals: true, label: 'No script rule at all means no restriction' },
          { js: 'allowsInlineScripts("default-src \'unsafe-inline\'; script-src \'self\'")', equals: false, hidden: true },
        ],
        hints: ['Split the policy at `;`. For each part, `.trim().split(/\\s+/)` gives the words. Skip empty parts. The first word is the directive name, in lower case.', 'Store `result[name] = words.slice(1)`. Build the object with a loop and return it.', '`script-src` has priority: `const sources = csp["script-src"] || csp["default-src"];`. When `sources` is undefined, return true, otherwise test `sources.includes("\'unsafe-inline\'")`.'],
      },
      {
        id: 'w58-password-check',
        title: 'Check a new password',
        prompt: 'Write `passwordProblems(password, banned)`. `banned` is a list of very common passwords written in lower case. Return a list of problems (empty when the password is fine), in this order:\n\n- `"too short"` when it has fewer than 10 characters\n- `"too common"` when its lower-case version is in `banned`\n- `"one repeated character"` when every character is the same (like `aaaaaaaaaaaa`)',
        files: ['js'],
        starter: { js: '// Write passwordProblems(password, banned)\n' },
        solution: { js: PASSWORD_SOLUTION },
        checks: [
          { js: 'JSON.stringify(passwordProblems("kampala-rain-2026", []))', equals: '[]', label: 'A long, unusual password has no problems' },
          { js: 'JSON.stringify(passwordProblems("short", []))', equals: '["too short"]' },
          { js: 'JSON.stringify(passwordProblems("Password123", ["password123"]))', equals: '["too common"]', label: 'Common passwords are refused, whatever the capitals' },
          { js: 'JSON.stringify(passwordProblems("aaaaaaaaaaaa", []))', equals: '["one repeated character"]' },
          { js: 'JSON.stringify(passwordProblems("Pass", ["pass"]))', equals: '["too short","too common"]', label: 'Several problems are all listed', hidden: true },
          { js: 'JSON.stringify(passwordProblems("abababababab", []))', equals: '[]', hidden: true },
        ],
        hints: ['Start with an empty array `problems` and `push` each problem as you find it. Return the array at the end.', 'For the common check use `banned.includes(password.toLowerCase())`. Length is `password.length < 10`.', 'A regular expression can test for one repeated character: `/^(.)\\1+$/.test(password)`. The `\\1` means \"the same character again\".'],
      },
      {
        id: 'w58-login-markup',
        title: 'A safer login form',
        prompt: 'Fix the login page:\n\n- The form must send its data with `method="post"`.\n- The email input gets `type="email"`, `autocomplete="username"` and `required`.\n- The password input gets `type="password"`, `autocomplete="current-password"`, `minlength="10"` and `required`.\n- The button gets `type="submit"`.\n- The help link opens a new tab, so it needs `rel="noopener noreferrer"`.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(LOGIN_STARTER, { title: 'Staff login | Lake Dental Clinic' }) },
        solution: { html: page(LOGIN_SOLUTION, { title: 'Staff login | Lake Dental Clinic' }) },
        checks: [
          { attr: 'form', name: 'method', equals: 'post', label: 'The form posts its data' },
          { attr: '#email', name: 'type', equals: 'email' },
          { attr: '#email', name: 'autocomplete', equals: 'username' },
          { attr: '#password', name: 'type', equals: 'password', label: 'The password is hidden as it is typed' },
          { attr: '#password', name: 'autocomplete', equals: 'current-password' },
          { attr: '#password', name: 'minlength', equals: '10' },
          { count: 'input[required]', equals: 2, label: 'Both fields are required' },
          { attr: 'button', name: 'type', equals: 'submit' },
          { attr: 'a[target="_blank"]', name: 'rel', contains: 'noopener', label: 'The new-tab link is protected' },
          { rule: 'form-labels' },
          { rule: 'buttons-type' },
        ],
        hints: ['Every attribute goes inside the opening tag it describes. `method="post"` goes on `<form ...>`.', 'The two inputs differ only in their `type` and `autocomplete` values, plus `minlength` for the password.', '```\n<a href="https://help.example.com" target="_blank" rel="noopener noreferrer">Visit our help page</a>\n```'],
      },
    ],
  },

  // ================================================================== w59
  {
    id: 'w59-quality-maintenance-handover',
    level: 'Level 6: Launch-ready for any company',
    title: 'Quality, maintenance and handover',
    summary: 'Test like a professional before launch, keep a site healthy afterwards (updates, backups, renewals, monitoring), and hand over a project so the client is never stranded.',
    minutes: 34,
    blocks: [
      {
        t: 'story',
        title: 'The site that disappeared on a Tuesday',
        text: 'A shop owner in Entebbe woke up to find her website gone. Customers saw a page from a domain seller instead. The reason was simple: the domain name had expired. It was registered in the developer\'s name, the reminder emails went to the developer\'s old address, and the developer had moved to another job a year earlier. Getting it back took nine days and cost her many orders.\n\nNothing in that story is about code. It is about **quality, maintenance and handover**: the habits that separate someone who builds websites from someone a company can trust with theirs. They cost very little, and they are the reason clients pay for a second project and recommend you to others.',
      },
      { t: 'analogy', text: 'Selling a car, a good mechanic does three things. **Before** handing it over, she road-tests it (quality assurance). She gives the owner a **service schedule** and a spare key (maintenance and handover). And she tells the owner which dashboard lights mean \"stop now\" (monitoring). Handing over a car with a full tank and no manual is not finishing the job. Neither is handing over a website with only the code.' },
      { t: 'h', text: 'Before launch: the quality checklist' },
      {
        t: 'list',
        items: [
          '**Content**: spelling in every language, prices, phone numbers (tap them on a phone: `tel:` links), opening hours, addresses, names of people (spell them right).',
          '**Links**: every link works, none goes to a test page, external links open correctly, the 404 page exists (Lesson 48).',
          '**Forms**: send a real test message, check it arrives in the right inbox, test the error state by switching your connection off (Lesson 47).',
          '**Phones**: test at 360 pixels wide, in both directions (portrait and landscape), with the menu, the form and every button.',
          '**Browsers and devices**: Chrome, Safari on iPhone, Firefox, Samsung Internet, and ideally a cheap Android phone with a slow connection. Many visitors also use data-saving modes such as **Opera Mini**, which runs very little JavaScript, so the basic page must work without it (progressive enhancement, Lesson 55).',
          '**Accessibility**: Tab through the whole page using only the keyboard, check colour contrast, check every image has an `alt`, zoom to 200 percent (Lesson 32).',
          '**Speed**: run Lighthouse and PageSpeed Insights, and check the page on Slow 4G (Lesson 57).',
          '**Search and sharing**: title, description, canonical, sitemap, social preview image (Lesson 48).',
          '**Legal and trust**: privacy policy and cookie choice are present and linked, the contact details are real (Lesson 49).',
          '**Analytics**: events fire only after consent, and you can see a test visit in the dashboard (Lesson 50).',
        ],
      },
      {
        t: 'try',
        code: 'function launchScore(checklist) {\n  const items = Object.keys(checklist);\n  const done = items.filter((name) => checklist[name]).length;\n  return {\n    done,\n    total: items.length,\n    percent: items.length === 0 ? 0 : Math.round((done / items.length) * 100),\n    missing: items.filter((name) => !checklist[name]),\n  };\n}\n\nconst result = launchScore({ forms: true, phones: true, speed: false, privacy: true, analytics: false });\nconsole.log(result.percent + "%");\nconsole.log(result.missing.join(", "));',
        output: '60%\nspeed, analytics',
      },
      { t: 'h', text: 'Free tools that find problems for you' },
      {
        t: 'list',
        items: [
          'The **W3C validators** (validator.w3.org for HTML, jigsaw.w3.org/css-validator for CSS) find mistakes in your markup and styles.',
          '**Lighthouse** and **PageSpeed Insights** score performance, accessibility, best practices and search basics (Lesson 45 and 57).',
          'An accessibility checker such as **axe** (a browser extension) finds many problems automatically, but never all of them. Tab through the page yourself.',
          'A **link checker** crawls the site for dead links. You can also write a small one yourself, as you will in the exercises.',
          'Automated tests (for example **Playwright** or **Cypress** for whole-page journeys, **Jest** for functions) repeat your checks for you after every change. They need a real computer to run, so they are a next step after this course.',
        ],
      },
      {
        t: 'predict',
        code: 'function findBroken(site) {\n  const broken = [];\n  for (const page of Object.keys(site)) {\n    for (const link of site[page]) {\n      if (!(link in site)) broken.push(page + " -> " + link);\n    }\n  }\n  return broken;\n}\nconsole.log(findBroken({ "/": ["/prices", "/old"], "/prices": ["/"] }).join(", "));',
        question: 'What does this print?',
        options: ['/ -> /old', '/prices -> /', '/ -> /prices', 'Nothing'],
        answer: 0,
        explain: 'The home page links to `/prices` (which exists) and `/old` (which does not, so it is a dead link). The `/prices` page links back to `/`, which exists.',
      },
      { t: 'h', text: 'After launch: maintenance' },
      {
        t: 'list',
        items: [
          '**Renewals.** Domains and hosting expire. Put the expiry dates in a calendar with reminders 90, 30 and 7 days before, sent to an address that will still exist in three years. This is the most common disaster of all.',
          '**Updates.** CMS, plugins and libraries on a schedule (for example monthly), after taking a backup.',
          '**Backups.** The **3-2-1 rule**: three copies of the data, on two different kinds of storage, with one copy somewhere else (another place or another account). A backup you have never restored is only a hope. Test it.',
          '**Monitoring.** A free uptime checker tells you within minutes when the site is down. Google Search Console emails you about crawl and security problems.',
          '**Reviews.** Every few months look at analytics, speed and broken links, and decide the next small improvements.',
          '**A change process.** Small changes in the client\'s own repository or CMS, bigger changes as a short written quote. It prevents arguments.',
          '**A care plan.** A small monthly or yearly fee covers renewals, updates, backups, monitoring and a few hours of changes. Clients like it, because the site stays healthy. You like it, because the income is steady.',
        ],
      },
      {
        t: 'try',
        code: 'function daysUntil(dateText, todayText) {\n  const day = 24 * 60 * 60 * 1000;\n  return Math.round((Date.parse(dateText + "T00:00:00Z") - Date.parse(todayText + "T00:00:00Z")) / day);\n}\n\nconsole.log(daysUntil("2027-01-10", "2026-12-20"));\nconsole.log(daysUntil("2026-12-01", "2026-12-01"));\nconsole.log(daysUntil("2026-11-30", "2026-12-01"));',
        output: '21\n0\n-1',
      },
      { t: 'h', text: 'Handover: leave the client able to stand alone' },
      {
        t: 'list',
        items: [
          '**The client owns everything**: the domain, the hosting account, analytics, Search Console and the code repository are registered with the client\'s own email address and payment. You are added as a helper, and you can be removed.',
          '**A handover document** (a README or a one-page guide): where each account is, how to edit content, how to publish a change, what to do if something breaks, how to reach you, and when things renew.',
          '**Passwords** go in a password manager that the client controls. Never send them by chat or leave them in the document.',
          '**Training**: a short session where the client edits something and publishes it themselves, and a short screen recording they can watch again.',
          '**A warranty period**: for example 30 days of free fixes for mistakes in your work, written in the contract (Lesson 36).',
          '**A last invoice and a clean finish**: the final payment, a short summary of what was delivered, and an invitation to review in three months.',
          'Keep an **archive** of the project (final files and the agreement) so you can answer questions years later.',
        ],
      },
      {
        t: 'web',
        title: 'A handover page. Each section answers one question the client will ask on a bad day.',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page(HANDOVER_SOLUTION, { title: 'Website handover | Lake Dental Clinic' }) },
        checks: [{ count: 'h2', min: 5 }, { exists: 'main ul li' }, { exists: 'a[href^="mailto:"]' }, { rule: 'one-h1' }, { rule: 'title' }],
      },
      {
        t: 'mistakes',
        items: [
          { lang: 'dom', wrong: 'Domain registered with: developer@gmail.com\nHosting account: developer\'s own card', why: 'If the developer disappears, changes jobs or has a dispute, the client cannot renew, move or even prove that the site is theirs. The client should always be the owner of the accounts.', right: 'Domain registered with: info@lakedental.co.ug\nHosting account: the clinic\'s own account and payment' },
          { lang: 'dom', wrong: 'Hi, the login for the host is grace / Jinja2026! Please keep it safe.', why: 'A password sent in a chat message stays in the chat for ever, can be forwarded, and is visible if a phone is lost. Use a password manager and share access through it.', right: 'I have shared the hosting login with you in our password manager. Please accept the invitation.' },
          { lang: 'dom', wrong: 'Tested on: my laptop, Chrome, fast Wi-Fi.', why: 'Most of the clinic\'s visitors use cheap phones on mobile data. A site that is fast and perfect on your laptop can be slow and broken for them. Test on real phones and on a slow connection.', right: 'Tested on: Chrome and Samsung Internet on a cheap Android phone, Safari on an iPhone, 360px wide, Slow 4G.' },
          { lang: 'dom', wrong: 'Backups: a copy of the site folder on the same laptop.', why: 'One copy in one place fails with the laptop. Follow 3-2-1: three copies, two kinds of storage, one stored elsewhere, and test a restore.', right: 'Backups: the repository on GitHub, a monthly copy on an external drive, and a yearly copy in another cloud account. Restore tested in December.' },
        ],
      },
      {
        t: 'quiz',
        question: 'A client\'s domain expires and the site disappears. Which habit would have prevented it?',
        options: ['Calendar reminders for renewal, sent to an address that will still exist, on accounts the client owns', 'A faster website', 'A longer privacy policy', 'A bigger logo'],
        answer: 0,
        explain: 'Renewals are silent and boring until they fail. Reminders at 90, 30 and 7 days and client-owned accounts remove the risk.',
      },
      {
        t: 'quiz',
        question: 'What does the 3-2-1 backup rule mean?',
        options: ['3 copies, on 2 kinds of storage, with 1 copy somewhere else', '3 passwords, 2 phones, 1 laptop', '3 days, 2 hours, 1 minute', 'Back up 3 times a year'],
        answer: 0,
        explain: 'Spreading copies across storage types and places means no single accident (a stolen laptop, a failed drive, a hacked account) destroys everything.',
      },
      { t: 'recap', items: ['Quality before launch: check content, links, forms, phones (360 px), real browsers and cheap devices, accessibility, speed, search and sharing, legal pages and analytics.', 'Use free tools (W3C validators, Lighthouse, PageSpeed Insights, axe, a link checker) and still test by hand. Automated tests are a next step.', 'Maintenance: renewal reminders at 90, 30 and 7 days, scheduled updates after a backup, the 3-2-1 backup rule with a tested restore, uptime monitoring and regular reviews.', 'A care plan turns maintenance into a small steady fee that keeps the site healthy.', 'Handover: the client owns every account, you give a handover document, passwords go in a password manager, you train them, and you offer a short warranty.', 'A trusted developer finishes the whole job, not only the code.'] },
    ],
    exercises: [
      {
        id: 'w59-renewal-status',
        title: 'The renewal reminder',
        prompt: 'The helper `daysUntil(expiry, today)` is ready: it returns the number of days from `today` to `expiry` (both written `YYYY-MM-DD`). Write `renewalStatus(expiry, today)` that returns:\n\n- `"expired"` when there are 0 days left or fewer\n- `"renew now"` for 1 to 30 days\n- `"plan renewal"` for 31 to 90 days\n- `"ok"` for more than 90 days',
        files: ['js'],
        starter: { js: `${DAYS_FN}\n// Write renewalStatus(expiry, today)\n` },
        solution: { js: RENEWAL_SOLUTION },
        checks: [
          { js: 'renewalStatus("2027-01-10", "2026-12-20")', equals: 'renew now', label: '21 days left' },
          { js: 'renewalStatus("2026-12-01", "2026-12-01")', equals: 'expired', label: 'Expires today' },
          { js: 'renewalStatus("2026-11-30", "2026-12-01")', equals: 'expired', label: 'Already expired' },
          { js: 'renewalStatus("2027-02-15", "2026-12-01")', equals: 'plan renewal', label: '76 days left' },
          { js: 'renewalStatus("2027-12-01", "2026-12-01")', equals: 'ok', label: 'A year left' },
          { js: 'renewalStatus("2026-12-31", "2026-12-01")', equals: 'renew now', label: 'Exactly 30 days is still renew now', hidden: true },
          { js: 'renewalStatus("2027-03-01", "2026-12-01")', equals: 'plan renewal', label: 'Exactly 90 days is still plan renewal', hidden: true },
        ],
        hints: ['First get the number of days: `const days = daysUntil(expiry, today);`.', 'Check from the most urgent case down: `days <= 0`, then `days <= 30`, then `days <= 90`. Return `"ok"` last.', '```\nif (days <= 0) {\n  return "expired";\n}\n```'],
      },
      {
        id: 'w59-broken-links',
        title: 'Find the broken links',
        prompt: 'Write `findBrokenLinks(site)`. `site` is an object: each key is a page address and its value is the list of links on that page, for example `{ "/": ["/prices", "/old"], "/prices": ["/"] }`.\n\nA link is **broken** when it points to a page that is not a key of `site`. Ignore links that start with `http`, `mailto:`, `tel:` or `#`. For internal links ignore anything after `#` or `?` when you look the page up. Return a sorted list of texts like `"/ -> /old"` (the page, then ` -> `, then the link exactly as written).',
        files: ['js'],
        starter: { js: '// Write findBrokenLinks(site)\n' },
        solution: { js: BROKEN_SOLUTION },
        checks: [
          { js: 'JSON.stringify(findBrokenLinks({ "/": ["/prices", "/old"], "/prices": ["/"] }))', equals: '["/ -> /old"]' },
          { js: 'JSON.stringify(findBrokenLinks({ "/": ["/prices", "https://wa.me/1", "#top", "mailto:a@b.co", "tel:+256700"], "/prices": ["/"] }))', equals: '[]', label: 'External links, anchors and mail and phone links are ignored' },
          { js: 'JSON.stringify(findBrokenLinks({ "/": ["/prices"], "/prices": ["/", "/old-prices"], "/about": ["/", "/contact?x=1"] }))', equals: '["/about -> /contact?x=1","/prices -> /old-prices"]', label: 'Results are sorted' },
          { js: 'JSON.stringify(findBrokenLinks({ "/": ["/prices#top?x=1"], "/prices": [] }))', equals: '[]', label: 'The part after # or ? is ignored when looking up the page', hidden: true },
          { js: 'JSON.stringify(findBrokenLinks({}))', equals: '[]', hidden: true },
        ],
        hints: ['Two loops: `for (const page of Object.keys(site))` for the pages, and an inner loop over `site[page]` for that page\'s links.', 'Skip the links that are not internal with `continue`. For an internal link, cut off `#...` and `?...`: `link.split("#")[0].split("?")[0]`.', 'If `!(target in site)`, push `page + " -> " + link`. Return `broken.sort()`.'],
      },
      {
        id: 'w59-launch-score',
        title: 'Score the launch checklist',
        prompt: 'Write `launchScore(checklist)`. `checklist` is an object like `{ forms: true, speed: false }`. Return an object with:\n\n- `done`: how many items are `true`\n- `total`: how many items there are\n- `percent`: `done` divided by `total` as a whole-number percentage (rounded); `0` for an empty checklist\n- `missing`: the names of the items that are `false`, in their original order',
        files: ['js'],
        starter: { js: '// Write launchScore(checklist)\n' },
        solution: { js: SCORE_SOLUTION },
        checks: [
          { js: 'JSON.stringify(launchScore({ a: true, b: false, c: true, d: false }))', equals: '{"done":2,"total":4,"percent":50,"missing":["b","d"]}' },
          { js: 'JSON.stringify(launchScore({ forms: true, phones: true, speed: false, privacy: true, analytics: false }))', equals: '{"done":3,"total":5,"percent":60,"missing":["speed","analytics"]}' },
          { js: 'JSON.stringify(launchScore({ a: true, b: true }))', equals: '{"done":2,"total":2,"percent":100,"missing":[]}', label: 'All done is 100 percent' },
          { js: 'JSON.stringify(launchScore({}))', equals: '{"done":0,"total":0,"percent":0,"missing":[]}', label: 'An empty checklist does not divide by zero' },
          { js: 'launchScore({ a: true, b: false, c: false }).percent', equals: 33, label: 'The percentage is rounded', hidden: true },
        ],
        hints: ['`Object.keys(checklist)` gives you the names of the items. The values are `true` or `false`.', '`items.filter((name) => checklist[name]).length` counts the done ones, and the same filter with `!checklist[name]` gives the missing names.', 'Guard the division: `items.length === 0 ? 0 : Math.round((done / items.length) * 100)`. Return the four values in an object with the keys in this order: done, total, percent, missing.'],
      },
      {
        id: 'w59-handover-page',
        title: 'Write the handover page',
        prompt: 'Turn this page into a handover document for the client. Keep one `<h1>` and add **five** sections, each with an `<h2>`:\n\n1. **Accounts** (include a `<ul>` that lists where the domain, hosting and analytics accounts are)\n2. **How to edit the content**\n3. **How to deploy a change**\n4. **If something breaks**\n5. **Support** (with a `mailto:` link)',
        files: ['html'],
        assets: ASSETS,
        starter: { html: page('<main>\n  <h1>Lake Dental Clinic: website handover</h1>\n  <p>Everything you need to run the website after launch.</p>\n</main>', { title: 'Website handover | Lake Dental Clinic' }) },
        solution: { html: page(HANDOVER_SOLUTION, { title: 'Website handover | Lake Dental Clinic' }) },
        checks: [
          { count: 'h2', min: 5, label: 'There are five sections' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /account/i.test(h.textContent))', equals: true, label: 'A section covers the accounts' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /edit/i.test(h.textContent))', equals: true, label: 'A section explains how to edit' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /deploy|publish/i.test(h.textContent))', equals: true, label: 'A section explains how to deploy' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /break|problem|wrong/i.test(h.textContent))', equals: true, label: 'A section says what to do when something breaks' },
          { js: 'Array.from(document.querySelectorAll("h2")).some((h) => /support|contact/i.test(h.textContent))', equals: true, label: 'A section tells how to get support' },
          { exists: 'main ul li', label: 'The accounts are listed' },
          { exists: 'a[href^="mailto:"]', label: 'There is a support email' },
          { rule: 'one-h1' },
        ],
        hints: ['Each section is an `<h2>` followed by a paragraph or a list. Five `<h2>` headings in total.', 'In the Accounts section use `<ul>` with one `<li>` per account: the domain, the hosting and the analytics.', '```\n<h2>Support</h2>\n<p>Email <a href="mailto:grace@example.com">grace@example.com</a></p>\n```'],
      },
    ],
  },

  // ================================================================== w60
  {
    id: 'w60-capstone-2',
    level: 'Level 6: Launch-ready for any company',
    title: 'Capstone 2: launch a company website',
    summary: 'Build and launch a complete clinic website: mobile menu, content from a CMS, a form that really sends, a cookie choice, consent-aware analytics, SEO, speed and accessibility.',
    minutes: 90,
    blocks: [
      {
        t: 'story',
        title: 'Lake Dental Clinic wants to be found',
        text: 'Grace has finished the course, and her first big client is **Lake Dental Clinic** in Jinja. The owner, Dr. Nakato, says: \"My patients find me by word of mouth, but young families search on their phones. I want a website where they can see my prices, find my phone number and book an appointment, and I want to update the prices myself.\"\n\nThis is the graduation project of the launch-ready level. Nothing here is new. Every piece comes from a lesson in this level, and the brief reads like a real client\'s: it must look right on a phone, be easy to use with a keyboard, be fast on mobile data, explain how it treats visitors\' data, be found by Google, and **really deliver appointment requests**. Build it as a professional would, one small step at a time, and test each step.',
      },
      {
        t: 'list',
        items: [
          '**What the site does:** introduces the clinic, lists the services and their prices (loaded from the clinic\'s content file, so Dr. Nakato can change prices without calling you), lets patients request an appointment, and gives the phone number and a WhatsApp link.',
          '**Quality rules (what a professional adds):** a mobile menu that works with touch and keyboard, accessible markup, honest status messages for the form, a fair cookie choice, tracking only after consent, a privacy link, search-engine tags, fast image markup and a safe, polite experience when something fails.',
          '**The pieces you will use:** responsive navigation (Lesson 46), a form that really sends (47), search-engine tags (48), consent and the privacy link (49), consent-aware events (50), CSS tokens (51), content loaded from a CMS-style source (52), fast images (57), and a safe, accessible form (58 and Lesson 32).',
        ],
      },
      { t: 'tip', text: 'Work in small steps and test each one. Start with the HTML and look at it without styling: does it make sense on its own? Then style it mobile-first and shrink the preview. Then add the JavaScript one feature at a time: menu, consent, content, form. After each step, run the checks. When something fails, read the failing check\'s name carefully: it tells you exactly what the page should do.' },
      {
        t: 'quiz',
        question: 'Dr. Nakato changes a price in the content file, but the website still shows the old price. Which of these is the most likely cause?',
        options: ['The page still has the old price typed into its HTML instead of building the list from the content', 'The privacy policy is missing', 'The menu button is too small', 'The page has two headings'],
        answer: 0,
        explain: 'A price typed in two places will always be out of date in one of them. The service list must be built from the content, and the HTML should hold an empty list.',
      },
      {
        t: 'quiz',
        question: 'A visitor presses Reject on the cookie banner. What must happen to your analytics events?',
        options: ['Nothing is recorded, and the choice is remembered', 'They are recorded anyway but hidden', 'They are recorded after 10 seconds', 'The page reloads until the visitor accepts'],
        answer: 0,
        explain: 'Only an explicit Accept switches tracking on. Reject (or no choice yet) means no events, and the page stays fully usable.',
      },
      { t: 'recap', items: ['A launch-ready site combines everything: semantic and accessible markup, mobile-first CSS with tokens, content loaded from data, a form that sends and handles failure, a fair consent choice, consent-aware analytics, search tags, and fast images.', 'Each feature has three states to design: working, loading, and failing. A page that only handles success is not finished.', 'Check the page on a phone-sized preview and with the keyboard before you call it done, then hand it over properly (Lesson 59).'] },
    ],
    exercises: [
      {
        id: 'w60-clinic-site',
        title: 'Lake Dental Clinic: the full website',
        prompt: 'Build the Lake Dental Clinic website. All three files are yours.\n\n**HTML**\n- a full page: `lang="en"`, viewport, a `<title>` with `Lake Dental` and `Jinja`, a meta description of at least 50 characters, a canonical link `https://lakedental.co.ug/`, and Open Graph tags `og:title`, `og:description`, `og:image`\n- JSON-LD in a `<script type="application/ld+json">` with `"@type": "Dentist"`\n- a skip link `a.skip-link` to `#main`, and a `<header>` with a logo link `#clinic-name`, a menu button `#menu-btn` (a real button with `aria-label`, `aria-expanded="false"`, `aria-controls="site-nav"`) and `<nav id="site-nav" aria-label="Main">` with links to `#services`, `#book` and `#contact`\n- `<main id="main">` with one `<h1>`; a hero image (`alt`, `width`, `height`, `fetchpriority="high"`, not lazy); a `#services` section with an EMPTY `<ul id="service-list">` and two gallery images (`loading="lazy"`, `width`, `height`, `alt`); a `#book` section with the form `#appointment` (`data-endpoint="/api/appointment"`, labelled `#name` and `#phone`, a honeypot input named `_gotcha`, a submit button and `<p id="status" role="status">`)\n- a footer `#contact` with a `tel:` link, a WhatsApp link `https://wa.me/256700123456` and a link to `privacy.html`\n- a cookie banner `#cookie-banner` (starts `hidden`) with buttons `#accept` and `#reject`\n\n**CSS**\n- tokens on `:root` (`--brand`) used with `var(--brand)`; a sticky header\n- mobile-first menu: `.site-nav` hidden by default, shown with `.open`, and always shown inside `@media (min-width: 700px)`\n- visible `:focus-visible` styles, 44px tap targets, and a `prefers-reduced-motion` rule\n\n**JavaScript** (no libraries)\n- the menu button toggles `.open` on the nav and keeps `aria-expanded` in step; links and Escape close it\n- the cookie banner shows only when no `consent` is saved; Accept saves `accepted`, Reject saves `rejected`, and both hide it\n- `window.dataLayer` and a `track(name)` function that records `{ event: name }` ONLY when consent is `accepted`\n- load `/api/clinic`: show `clinic.name` in `#clinic-name` and one `<li>` per service (`NAME: UGX PRICE` with commas); on failure show a helpful message with the phone number\n- the form: no page reload, honeypot respected, `POST` JSON to the endpoint, status `Sending...`, then `Thank you, NAME! ...` on success or `Sorry, that did not send. Please call 0700 123 456.` on failure; the button is re-enabled; a successful booking calls `track("appointment_booked")`',
        files: ['html', 'css', 'js'],
        assets: ASSETS,
        api: CLINIC_API,
        starter: { html: CLINIC_STARTER_HTML, css: '/* Your styles */\n', js: '// Your JavaScript\n' },
        solution: { html: CLINIC_HTML, css: CLINIC_CSS, js: CLINIC_JS },
        checks: [
          // --- the page and the search tags
          { rule: 'html-lang' },
          { rule: 'viewport' },
          { rule: 'title' },
          { js: 'document.title.indexOf("Lake Dental") >= 0 && document.title.indexOf("Jinja") >= 0', equals: true, label: 'The title names the clinic and the town' },
          { attr: 'meta[name="description"]', name: 'content', matches: '^.{50,}$', label: 'The description is at least 50 characters' },
          { attr: 'link[rel="canonical"]', name: 'href', equals: 'https://lakedental.co.ug/' },
          { exists: 'meta[property="og:title"]' },
          { exists: 'meta[property="og:description"]' },
          { exists: 'meta[property="og:image"]' },
          { uses: 'html', pattern: '"@type"\\s*:\\s*"Dentist"', label: 'Structured data describes a Dentist' },
          // --- semantic and accessible markup
          { rule: 'one-h1' },
          { rule: 'img-alt' },
          { rule: 'buttons-type' },
          { rule: 'link-text' },
          { exists: 'a.skip-link[href="#main"]', label: 'There is a skip link' },
          { exists: 'header .logo' },
          { exists: 'main#main' },
          { exists: 'footer#contact' },
          // --- navigation
          { attr: '#menu-btn', name: 'aria-controls', equals: 'site-nav' },
          { attr: '#menu-btn', name: 'aria-label', present: true },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'The menu starts closed' },
          { attr: 'nav#site-nav', name: 'aria-label', equals: 'Main' },
          { exists: '#site-nav a[href="#services"]' },
          { exists: '#site-nav a[href="#book"]' },
          { exists: '#site-nav a[href="#contact"]' },
          { do: 'click', target: '#menu-btn' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'true', label: 'The button opens the menu' },
          { attr: '#site-nav', name: 'class', contains: 'open' },
          { do: 'key', target: '#menu-btn', value: 'Escape' },
          { attr: '#menu-btn', name: 'aria-expanded', equals: 'false', label: 'Escape closes the menu' },
          // --- speed
          { attr: '.hero img', name: 'fetchpriority', equals: 'high', label: 'The hero image is fetched first' },
          { attr: '.hero img', name: 'loading', present: false, label: 'The hero image is not lazy' },
          { count: '.gallery img[loading="lazy"]', min: 2, label: 'The gallery images are lazy' },
          { count: 'img:not([width])', equals: 0, label: 'Every image reserves its space (width)' },
          { count: 'img:not([height])', equals: 0, label: 'Every image reserves its space (height)' },
          // --- CSS
          { uses: 'css', pattern: ':root\\s*\\{[^}]*--brand', label: 'Brand colour token' },
          { uses: 'css', pattern: 'var\\(--brand\\)' },
          { uses: 'css', pattern: 'position:\\s*sticky', label: 'Sticky header' },
          { uses: 'css', pattern: '\\.site-nav\\s*\\{[^}]*display:\\s*none', label: 'Mobile-first: the menu is hidden by default' },
          { uses: 'css', pattern: '@media\\s*\\(min-width:\\s*700px\\)', label: 'A wide-screen rule' },
          { uses: 'css', pattern: ':focus-visible', label: 'Visible focus styles' },
          { uses: 'css', pattern: 'min-height:\\s*44px', label: '44px tap targets' },
          { uses: 'css', pattern: 'prefers-reduced-motion', label: 'Reduced motion is respected' },
          // --- content from the CMS
          { do: 'wait', ms: 120 },
          { text: '#clinic-name', equals: 'Lake Dental Clinic', label: 'The clinic name comes from the content' },
          { count: '#service-list li', equals: 3, label: 'One list item for each service' },
          { js: 'document.querySelector("#service-list li").textContent', equals: 'Check-up: UGX 30,000', label: 'A service shows its name and price with commas' },
          { js: 'document.querySelectorAll("#service-list li")[2].textContent', equals: 'Filling: UGX 90,000' },
          // --- consent and tracking
          { visible: '#cookie-banner', label: 'With no saved choice the banner is shown' },
          { count: '#cookie-banner button', equals: 2, label: 'Accept and Reject are equal choices' },
          { exists: '#cookie-banner a[href="privacy.html"]' },
          { js: '(localStorage.removeItem("consent"), window.dataLayer.length = 0, track("view"), window.dataLayer.length)', equals: 0, label: 'No choice yet: nothing is tracked' },
          { do: 'click', target: '#reject' },
          { js: 'localStorage.getItem("consent")', equals: 'rejected', label: 'Reject is remembered' },
          { visible: '#cookie-banner', is: false, label: 'The banner goes away after a choice' },
          { js: '(window.dataLayer.length = 0, track("view"), window.dataLayer.length)', equals: 0, label: 'Rejected: nothing is tracked' },
          { do: 'click', target: '#accept' },
          { js: 'localStorage.getItem("consent")', equals: 'accepted', label: 'Accept is remembered' },
          { js: '(window.dataLayer.length = 0, track("view"), window.dataLayer.length)', equals: 1, label: 'Accepted: the event is tracked' },
          // --- the appointment form
          { attr: '#appointment', name: 'data-endpoint', equals: '/api/appointment' },
          { exists: 'label[for="name"]' },
          { exists: 'label[for="phone"]' },
          { exists: 'input[name="_gotcha"][tabindex="-1"]', label: 'A honeypot catches robots' },
          { do: 'type', target: '[name="_gotcha"]', value: 'buy cheap watches' },
          { do: 'type', target: '#name', value: 'Robot' },
          { do: 'submit', target: '#appointment', ms: 90 },
          { text: '#status', equals: '', label: 'A filled honeypot sends nothing' },
          { do: 'type', target: '[name="_gotcha"]', value: '' },
          { do: 'type', target: '#name', value: 'Amina' },
          { do: 'type', target: '#phone', value: '0700123456' },
          { js: '(window.dataLayer.length = 0, true)', equals: true },
          { do: 'submit', target: '#appointment', ms: 90 },
          { text: '#status', contains: 'Thank you, Amina', label: 'A real booking is confirmed with the name' },
          { field: '#name', equals: '', label: 'The form is cleared after success' },
          { js: 'document.querySelector("#appointment button").disabled', equals: false, label: 'The button works again' },
          { js: 'window.dataLayer.length > 0 && window.dataLayer[0].event', equals: 'appointment_booked', label: 'A booking is tracked (consent was given)' },
          // --- when the server fails
          { js: '(document.querySelector("#appointment").dataset.endpoint = "/api/missing", true)', equals: true },
          { do: 'type', target: '#name', value: 'Amina' },
          { do: 'type', target: '#phone', value: '0700123456' },
          { do: 'submit', target: '#appointment', ms: 90 },
          { text: '#status', contains: 'Sorry, that did not send', label: 'A failure shows a helpful message' },
          { text: '#status', contains: '0700 123 456', label: 'The message gives a phone number' },
          { js: 'document.querySelector("#appointment button").disabled', equals: false, label: 'After a failure the visitor can try again' },
          // --- contact
          { exists: 'a[href^="tel:"]', label: 'A phone link' },
          { exists: 'a[href="https://wa.me/256700123456"]', label: 'A WhatsApp link' },
          { exists: 'footer a[href="privacy.html"]', label: 'The privacy policy is linked in the footer' },
          { noErrors: true },
        ],
        hints: [
          'Build in this order: 1) the HTML structure and head tags, 2) the mobile-first CSS, 3) the menu, 4) the cookie choice and `track`, 5) loading the services, 6) the form. After each step, run the checks and read the failing names.',
          'You have already written each piece in this level. The menu is from Lesson 46, the form from Lesson 47, the cookie choice and `track` from Lesson 49, the content from Lesson 52. Reuse them, and keep the ids and class names from the brief exactly.',
          'The script tag must be the LAST thing in `<body>` (`<script src="script.js"></script>`), so the page exists when your code runs. The service list in the HTML is EMPTY (`<ul id="service-list"></ul>`); JavaScript fills it from `/api/clinic`. Read the full solution for a model.',
        ],
      },
    ],
  },
];
