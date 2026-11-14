# The Web track: Build Real Websites

Course id `web-start`, language `web`. One running project: a website for **Mama Rose Rolex**, Wandegeya, Kampala.
Goal: a learner finishes able to build, deploy and sell a small business website or web app.

## What exists now: 45 lessons, 136 auto-checked exercises, about 18 hours

| Level | Lessons |
|---|---|
| 1. Your first web page (HTML) | First page / Text, lists, links (tel:, WhatsApp) / Pictures, skeleton, semantic tags / **Forms** (inputs, labels, radio, select, validation attributes) / **Tables, figure, details, the head** (title, description, Open Graph, icon) / **Video, audio, iframes, srcset, date/range/datalist inputs, tfoot and colspan** |
| 2. Make it beautiful (CSS) | Colour and text, linking the stylesheet / Box model, classes / Flexbox / Responsive: media queries, fluid images, grid / **Selectors, specificity, inheritance** / **Units, display, position, overflow, aspect-ratio** / **Type, gradients, shadows, buttons** / **Transitions, transforms, keyframes, reduced motion** / **Variables, dark mode, reset, naming** / **Grid in depth** (areas, span) / **Modern CSS**: `calc`, `min`, `max`, `clamp`, fixed floating button, `::before`/`::after`, smooth scroll, `@font-face` |
| 3. JavaScript, make the page think | Variables, text, sums / **Decisions** / **Loops** / **Functions, scope** / **Arrays** / **Objects, destructuring, spread, JSON** / **map, filter, reduce, sort** / **Strings, numbers, Math, dates** / **try/catch, throw, debugging method** / **Classes, inheritance, modules** / **Patterns in every codebase**: `switch`, `??`, `Object.entries`, rest/spread, `Set`/`Map`, closures / **Regular expressions** |
| 4. JavaScript in the page | The DOM and events / **Rendering lists, event delegation, XSS** / **Forms and validation (submit, input events, regex)** / **Timers, debounce, keyboard events** / **Tabs, accordion, modal, live search** (accessible) / **localStorage and JSON** / **fetch, promises, async/await, loading and error states** / **Promises in depth**: `Promise.all`, chains, `sleep`, `retry` / **Project: Order App** (menu from API, cart, saved, checkout) |
| 5. Go professional | **Accessibility** / **Speed, SEO (JSON-LD), security** / **Git and GitHub Pages, paths and case bugs** / **Installable and offline: PWA manifest, service worker, caching strategies** / **Tools of the trade**: DevTools, npm, Vite, Prettier/ESLint, TypeScript, frameworks, a six-month plan / **Capstone: a client website from a brief** / **Going to market: finding clients, pricing, deposits, Mobile Money, WhatsApp order links** |

## Coverage audit: is anything left out?

Covered: the full HTML element set a business site needs, the whole CSS toolbox used in production (selectors and specificity, box model, units, display, position, flexbox, grid, responsive design, typography, backgrounds, transitions and animations, variables, dark mode, naming), core JavaScript (types, operators, control flow, functions, arrays, objects, classes, modules, errors, async), the DOM (events, delegation, forms), browser storage, networking with `fetch`, accessibility, SEO, performance, web security basics, version control and deployment, and the business side (clients, quotes, deposits).

Deliberately **not** practised in this track (each needs its own runtime or is a separate career step; suggested as later tracks):
- **A real backend and database** (Node + Express, SQL, authentication, real Mobile Money integration). The track teaches the front end and the *contract* with a server (`fetch`, JSON, POST) using a pretend server, and explains the next steps in the tools lesson.
- **A framework** (React or Vue), **TypeScript** and **automated testing frameworks**. They are explained and a six-month path is given, but the preview runs one `script.js`, so they cannot be practised inside this app. A "React from zero" track is the natural next course.
- **Service workers cannot run in the preview** (they need a real HTTPS origin). The PWA lesson teaches the manifest, caching strategies and the worker code, and the exercises check the manifest, head tags and strategy logic.
- **Newer CSS** (container queries, nesting, `@layer`, `:has()` in depth), **SVG and canvas**, and **browser APIs** (geolocation, camera, clipboard, share, `IntersectionObserver`, `FormData`, hash routing). Good candidates for an "Extras" level.

## How the track works

- `src/lib/webengine.cjs`: ONE classic script used by the app, the preview iframe and the tests. It builds the page, guards loops, runs the checker, lints HTML/CSS and runs console JavaScript.
- Preview: a sandboxed iframe (`sandbox="allow-scripts"`, no same-origin, no network). Pop-ups are shown in the console. `localStorage` and `fetch` are pretend ones.
- Grading: a fresh off-screen phone-sized page; checks run inside it. Same checks run in jsdom in `npm test`.
- Images: `src/content/web/assets.js`. Use `<img src="img/rolex.svg">`; the lesson passes `assets: ASSETS`.

### Block types for web lessons
Existing: `story analogy p h list tip code recap mistakes quiz`. Console JavaScript can also use `try predict fill reorder bug project` (they run in a Web Worker).
New: `web` (editable live page; optional `checks` must pass) and `see` ("what will the browser show?"; `proof` checks must pass so the marked answer is provably true).
`mistakes` items for web use `lang: 'html' | 'css' | 'js' | 'dom'`. html/css are linted by the tests; `logic: true` means "not a syntax error".

### Exercise shape
```js
{
  id, title, prompt,
  files: ['html', 'css', 'js'],          // which tabs the learner can edit
  starter: { html, css, js },            // the whole page
  solution: { html, css, js },           // shown as "the goal"; the tests prove it passes
  strict: true,                          // optional: do not add CSS/JS the HTML does not link
  assets, api,                           // optional image library / pretend server
  checks: [ ... ], hints: [3]
}
```

### Checks
`{ exists }` `{ count, equals|min|max }` `{ text, equals|contains|matches, index? }` `{ attr, name, equals|contains|matches|present:true|false }`
`{ style, prop, is|not|contains|atLeast|atMost }` `{ order: [selectors] }` `{ visible, is? }` `{ field, equals }`
`{ uses: 'html|css|js', pattern }` `{ js: 'expression', equals }` `{ log, equals? }` `{ logs: [...] }` `{ noErrors }`
`{ lint: 'html|css' }` `{ rule: 'img-alt|html-lang|viewport|title|one-h1|form-labels|link-text|buttons-type' }`
Actions: `{ do: 'click|type|select|check|submit|key|wait', target, value }`. Every check can have `label` and `hidden`.

**Write checks that give the same answer in jsdom and in a real browser.** Safe computed properties: colour, background-color, font-size, text-align, padding-*, margin-* (not `auto`), border-*, display, flex-direction, flex-wrap, justify-content, align-items, gap, min/max-width, box-sizing, font-weight.
Use `uses` (source checks) for: `margin: 0 auto`, `flex: 1 1 140px`, `line-height: 1.6`, `grid-template-columns`, anything inside `@media`. The test suite cannot evaluate media queries the way a phone does.
