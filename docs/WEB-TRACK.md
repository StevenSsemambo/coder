# The Web track: Build Real Websites

Course id `web-start`, language `web`. One running project: a website for **Mama Rose Rolex**, Wandegeya, Kampala.
Goal: a learner finishes able to build, deploy and sell a small business website or web app.

## What exists now (9 lessons, 27 auto-checked exercises)

| Level | Lessons |
|---|---|
| 1. Your first web page (HTML) | First page (tags, headings, paragraphs) / Text, lists and links (tel:, WhatsApp) / Pictures and a proper page (alt text, skeleton, semantic tags) |
| 2. Make it beautiful (CSS) | Colour and text, linking the stylesheet / Box model, classes / Flexbox / Responsive: media queries, fluid images, grid |
| 3. JavaScript | Variables, text and sums (console) / The DOM: events, textContent, classList |

## Roadmap: what to write next (the engine already supports all of it)

**Level 3 (finish JavaScript)**
- 10 Decisions: `if / else`, comparison, `&&` `||` (discount rules, "open now?")
- 11 Loops: `for`, `while`, `for...of` (print a menu, add up a till)
- 12 Functions: parameters, return, arrow functions (`calculateTotal`)
- 13 Arrays and objects: the menu as data, `push`, `find`
- 14 Array methods: `map`, `filter`, `reduce` (sales report, search box)

**Level 4 (JavaScript in the page)**
- 15 Forms and validation: `input`/`submit` events, `preventDefault`, error messages (order form with quantity)
- 16 Building lists from data: `createElement`, render a menu and a cart from an array
- 17 Remembering: `localStorage` (cart survives a refresh). The preview ships a pretend `localStorage`.
- 18 Talking to a server: `fetch`, `async/await`, JSON, loading and error states. Use the `api` option: the exercise declares `api: { '/api/menu': [...] }` and `fetch('/api/menu')` answers offline.
- 19 **Project:** Rose's Order App (menu from the API, cart, total in UGX, saved in localStorage, mobile layout)

**Level 5 (professional skills)**
- 20 Accessibility: keyboard, contrast, labels (rules `form-labels`, `img-alt`, `link-text` exist)
- 21 CSS you will use every day: variables (`--brand`), transitions, hover/focus, shadows, dark mode
- 22 DevTools and debugging a phone page, reading the console error cards
- 23 Speed and SEO: image sizes, title/description, Open Graph, why 3G matters
- 24 Git and GitHub Pages: publish a site for free (conceptual lesson with `quiz` and `reorder` blocks)
- 25 **Capstone:** a real site for a real local business (portfolio piece)
- 26 Freelancing in Uganda: scoping, pricing in UGX, Mobile Money deposits, a one-page contract, finding the first 3 clients

**Level 6 (later)** Node + Express, a database, authentication, then React. These need a server runtime, so they are separate tracks.

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
`{ exists }` `{ count, equals|min|max }` `{ text, equals|contains|matches, index? }` `{ attr, name, equals|contains|exists:false }`
`{ style, prop, is|not|contains|atLeast|atMost }` `{ order: [selectors] }` `{ visible, is? }` `{ field, equals }`
`{ uses: 'html|css|js', pattern }` `{ js: 'expression', equals }` `{ log, equals? }` `{ logs: [...] }` `{ noErrors }`
`{ lint: 'html|css' }` `{ rule: 'img-alt|html-lang|viewport|title|one-h1|form-labels|link-text|buttons-type' }`
Actions: `{ do: 'click|type|select|check|submit|key|wait', target, value }`. Every check can have `label` and `hidden`.

**Write checks that give the same answer in jsdom and in a real browser.** Safe computed properties: colour, background-color, font-size, text-align, padding-*, margin-* (not `auto`), border-*, display, flex-direction, flex-wrap, justify-content, align-items, gap, min/max-width, box-sizing, font-weight.
Use `uses` (source checks) for: `margin: 0 auto`, `flex: 1 1 140px`, `line-height: 1.6`, `grid-template-columns`, anything inside `@media`. The test suite cannot evaluate media queries the way a phone does.
