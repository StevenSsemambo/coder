// Web track, Level 4 project: Mama Rose's Order App (everything from Levels 1 to 4 together).
import { fullPage } from './shared.js';

const MENU = [
  { id: 1, name: 'Plain rolex', price: 3000 },
  { id: 2, name: 'Veggie rolex', price: 4000 },
  { id: 3, name: 'Chicken rolex', price: 7000 },
];
const API = { '/api/menu': MENU, '/api/orders': { ok: true } };

const APP_HTML = fullPage(
  '  <header class="top">\n    <h1>Mama Rose Rolex</h1>\n  </header>\n  <main class="page">\n    <section aria-labelledby="menu-title">\n      <h2 id="menu-title">Menu</h2>\n      <p id="status" role="status">Loading menu...</p>\n      <ul id="menu" class="menu"></ul>\n    </section>\n    <section aria-labelledby="cart-title" class="cart">\n      <h2 id="cart-title">Your order</h2>\n      <ul id="cart-lines"></ul>\n      <p class="total">Total: UGX <span id="total">0</span></p>\n      <button type="button" id="checkout">Send order</button>\n      <button type="button" id="clear">Clear</button>\n      <p id="message" role="status"></p>\n    </section>\n  </main>',
  { css: true, js: true, title: "Order | Mama Rose Rolex" },
);

const APP_CSS = '* { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; background: #fdf1d3; color: #1c1b18; }\n.top { background: #0b6b4f; color: #fff; padding: 12px 16px; }\n.top h1 { margin: 0; font-size: 1.25rem; }\n.page { max-width: 900px; margin: 0 auto; padding: 16px; display: grid; gap: 24px; }\n.menu, #cart-lines { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }\n.menu li, #cart-lines li { background: #fff; border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }\nbutton { min-height: 44px; padding: 0 16px; border: none; border-radius: 999px; background: #0b6b4f; color: #fff; font-weight: 700; cursor: pointer; }\nbutton:focus-visible { outline: 3px solid #f7c948; outline-offset: 2px; }\n.total { font-size: 1.25rem; font-weight: 700; }\n@media (min-width: 700px) {\n  .page { grid-template-columns: 2fr 1fr; align-items: start; }\n}\n';

const APP_JS = 'const menuBox = document.querySelector("#menu");\nconst statusBox = document.querySelector("#status");\nconst lines = document.querySelector("#cart-lines");\nconst totalBox = document.querySelector("#total");\nconst message = document.querySelector("#message");\n\nlet menu = [];\nlet cart = JSON.parse(localStorage.getItem("cart") || "[]");\n\nconst money = (n) => n.toLocaleString("en-US");\n\nfunction save() {\n  localStorage.setItem("cart", JSON.stringify(cart));\n}\n\nfunction renderCart() {\n  lines.innerHTML = "";\n  for (const line of cart) {\n    const li = document.createElement("li");\n    li.textContent = `${line.name} x${line.qty}`;\n    lines.append(li);\n  }\n  totalBox.textContent = money(cart.reduce((sum, l) => sum + l.price * l.qty, 0));\n}\n\nfunction add(item) {\n  const line = cart.find((l) => l.id === item.id);\n  if (line) {\n    line.qty += 1;\n  } else {\n    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });\n  }\n  save();\n  renderCart();\n}\n\nasync function loadMenu() {\n  try {\n    const response = await fetch("/api/menu");\n    if (!response.ok) throw new Error("Server said " + response.status);\n    menu = await response.json();\n    statusBox.textContent = "";\n    for (const item of menu) {\n      const li = document.createElement("li");\n      const label = document.createElement("span");\n      label.textContent = `${item.name} (UGX ${money(item.price)})`;\n      const button = document.createElement("button");\n      button.type = "button";\n      button.textContent = "Add";\n      button.dataset.id = item.id;\n      li.append(label, button);\n      menuBox.append(li);\n    }\n  } catch (error) {\n    statusBox.textContent = "Could not load the menu. Please try again.";\n  }\n}\n\nmenuBox.addEventListener("click", (event) => {\n  const button = event.target.closest("button");\n  if (!button) return;\n  const item = menu.find((m) => m.id === Number(button.dataset.id));\n  if (item) add(item);\n});\n\ndocument.querySelector("#clear").addEventListener("click", () => {\n  cart = [];\n  save();\n  renderCart();\n  message.textContent = "";\n});\n\ndocument.querySelector("#checkout").addEventListener("click", async () => {\n  if (cart.length === 0) {\n    message.textContent = "Your order is empty.";\n    return;\n  }\n  try {\n    const response = await fetch("/api/orders", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify({ lines: cart }),\n    });\n    if (!response.ok) throw new Error("Server said " + response.status);\n    message.textContent = "Order sent! We will call you.";\n    cart = [];\n    save();\n    renderCart();\n  } catch (error) {\n    message.textContent = "Could not send the order. Please try again.";\n  }\n});\n\nloadMenu();\nrenderCart();\n';

export const dom3Lessons = [
  {
    id: 'w31-order-app',
    level: 'Level 4: JavaScript in the page',
    title: "Project: Mama Rose's Order App",
    summary: 'Put HTML, CSS and JavaScript together into a real ordering app with a menu from a server, a saved cart and checkout.',
    minutes: 40,
    blocks: [
      {
        t: 'story',
        title: 'Grace\'s three shops',
        text: 'Grace phones: **"Rose, I will pay you to build the ordering page properly. All three shops, one menu on a server, customers on phones. If it works, I will tell the other stalls."**\n\nThis is your first real product. Nothing new to learn: you will combine everything from Levels 1 to 4 into one app, the way you will on a real job. Read the plan, study the finished app, then build your own version.',
      },
      { t: 'analogy', text: 'Building an app is cooking a full meal rather than practising single dishes. You already know each skill: the structure (HTML), the looks (CSS), the logic and data (JavaScript). The new skill is **planning the order**: shopping list first, then the base, then the extras, then tasting as you go.' },
      {
        t: 'list',
        items: ['**1. Structure:** a header, a menu section, an order section. Use semantic tags, labels and a `viewport` tag.', '**2. Data:** fetch the menu from `/api/menu` and draw it with JavaScript. Show loading and error states.', '**3. Behaviour:** one click listener on the menu. Adding the same item twice raises its quantity.', '**4. Memory:** save the cart in `localStorage` after every change and reload it at the start.', '**5. Checkout:** POST the order to `/api/orders`, thank the customer, empty the cart. An empty cart gets a message.', '**6. Looks:** a mobile layout first, then two columns from 700px wide. Keyboard focus must be visible.'],
      },
      {
        t: 'web',
        project: true,
        title: 'The finished Order App: use it, then read every part',
        text: 'Add items, reload the page (the Reload button below), tap Send order. Everything here is something you have already learned.',
        files: ['html', 'css', 'js'],
        api: API,
        starter: { html: APP_HTML, css: APP_CSS, js: APP_JS },
        checks: [{ do: 'wait', ms: 40 }, { count: '#menu li', equals: 3 }, { do: 'click', target: '#menu li:nth-child(3) button' }, { text: '#total', equals: '7,000' }],
      },
      { t: 'tip', text: 'Notice how the JavaScript is organised: **data** at the top (`menu`, `cart`), small **helper functions** (`money`, `save`), **render** functions that draw from the data, **actions** that change the data, then the **wiring** of events at the bottom. When an app grows, this order keeps it readable. Always change the data first, then call render.' },
      { t: 'quiz', question: 'A customer adds the same rolex twice. What should the cart show?', options: ['One line with quantity 2', 'Two separate lines', 'Nothing', 'An error'], answer: 0, explain: 'A professional cart finds the existing line and raises its `qty`. Two lines for the same item is confusing and makes totals harder.' },
      { t: 'quiz', question: 'Why does the app save the cart after EVERY change instead of only on checkout?', options: ['A reload or crash at any moment would lose the cart otherwise', 'It makes the page faster', 'localStorage only works when called often', 'It is required by HTML'], answer: 0, explain: 'You cannot know when a phone will lose signal or a tab will close. Saving after each change means nothing is lost.' },
      { t: 'recap', items: ['A real feature is built in layers: structure, data, behaviour, memory, checkout, looks.', 'Keep data, helper functions, render functions, actions and event wiring in a clear order.', 'Always show loading, empty and error states.', 'Save state after every change and render from the data.', 'You can now build and ship a real small shop page.'], memory: 'Structure, data, behaviour, memory, checkout, looks.' },
    ],
    exercises: [
      {
        id: 'w31-order-app',
        title: 'Build the Order App',
        api: API,
        prompt: 'Build the app from the plan. The page and styles are started: **you write the JavaScript** (and may improve the HTML and CSS).\n\nRequirements, all checked automatically:\n\n- load `/api/menu` and draw one `<li>` with an **Add** button for each item inside `#menu`; clear `#status` when done\n- clicking Add puts a line like `Chicken rolex x2` in `#cart-lines` (the same item twice raises the number) and shows the total with commas in `#total`\n- save the cart in `localStorage` under `cart` (a list)\n- `#clear` empties the cart\n- `#checkout` POSTs to `/api/orders`, then shows `Order sent! We will call you.` in `#message` and empties the cart; an empty cart shows `Your order is empty.`',
        files: ['html', 'css', 'js'],
        starter: { html: APP_HTML, css: APP_CSS, js: '// Mama Rose Order App\n// Plan: data -> helpers -> render -> actions -> events\n' },
        solution: { html: APP_HTML, css: APP_CSS, js: APP_JS },
        checks: [
          { do: 'wait', ms: 40 },
          { count: '#menu li', equals: 3, label: 'The menu shows 3 items from the server' },
          { count: '#menu li button', equals: 3, label: 'Every item has an Add button' },
          { text: '#status', equals: '', label: 'The loading message is cleared' },
          { do: 'click', target: '#menu li:nth-child(3) button' },
          { do: 'click', target: '#menu li:nth-child(3) button' },
          { text: '#cart-lines li', equals: 'Chicken rolex x2', index: 0, label: 'Adding chicken twice gives one line: Chicken rolex x2' },
          { text: '#total', equals: '14,000', label: 'The total is 14,000' },
          { do: 'click', target: '#menu li:nth-child(1) button' },
          { count: '#cart-lines li', equals: 2, label: 'A different item adds a second line' },
          { text: '#total', equals: '17,000', label: 'The total is now 17,000' },
          { js: 'JSON.parse(localStorage.getItem("cart")).length', equals: 2, label: 'The cart is saved in localStorage' },
          { do: 'click', target: '#checkout' },
          { do: 'wait', ms: 40 },
          { text: '#message', contains: 'Order sent', label: 'Checkout confirms the order' },
          { text: '#total', equals: '0', label: 'The cart is emptied after checkout' },
          { do: 'click', target: '#checkout' },
          { text: '#message', contains: 'empty', label: 'An empty cart shows a message' },
          { do: 'click', target: '#menu li:nth-child(2) button' },
          { do: 'click', target: '#clear' },
          { text: '#total', equals: '0', label: 'Clear empties the cart' },
          { rule: 'html-lang' },
          { rule: 'viewport' },
          { rule: 'one-h1' },
          { rule: 'buttons-type' },
          { uses: 'css', pattern: '@media\\s*\\(\\s*min-width', label: 'The layout adapts with a media query' },
          { uses: 'css', pattern: ':focus-visible', label: 'Keyboard focus is visible' },
          { uses: 'js', pattern: 'localStorage', label: 'You used localStorage' },
          { uses: 'js', pattern: 'fetch\\(', label: 'You used fetch' },
          { lint: 'html' },
          { lint: 'css' },
        ],
        hints: ['Work in the order of the plan: first draw the menu from the server, then adding to the cart, then saving, then checkout. Test after each step.', 'Keep `menu` and `cart` as arrays at the top. `renderCart()` redraws `#cart-lines` and `#total` from `cart`. Use one click listener on `#menu` with `event.target.closest("button")` and `button.dataset.id`.', '```\nasync function loadMenu() {\n  const response = await fetch("/api/menu");\n  menu = await response.json();\n  // create li + button for each item\n}\nfunction add(item) {\n  const line = cart.find((l) => l.id === item.id);\n  if (line) line.qty += 1;\n  else cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });\n  save();\n  renderCart();\n}\n```'],
      },
      {
        id: 'w31-change-qty',
        title: 'Plus and minus',
        prompt: 'Write a **pure function** `changeQty(cart, id, delta)` that returns a **new** cart (do not change the old one) where the line with that `id` has its `qty` changed by `delta`. A line whose `qty` falls to `0` or below is removed.\n\nA cart is a list like `[{ id: 1, name: "Plain", qty: 2 }]`.',
        files: ['js'],
        starter: { js: '// Write changeQty here\n' },
        solution: { js: 'function changeQty(cart, id, delta) {\n  return cart\n    .map((line) => (line.id === id ? { ...line, qty: line.qty + delta } : line))\n    .filter((line) => line.qty > 0);\n}\n' },
        checks: [{ js: 'changeQty([{ id: 1, qty: 2 }], 1, 1)', equals: [{ id: 1, qty: 3 }], label: 'Plus raises the quantity' }, { js: 'changeQty([{ id: 1, qty: 2 }, { id: 2, qty: 1 }], 2, -1)', equals: [{ id: 1, qty: 2 }], label: 'Minus to zero removes the line' }, { js: 'changeQty([{ id: 1, qty: 2 }], 9, 1)', equals: [{ id: 1, qty: 2 }], label: 'An unknown id changes nothing' }, { js: '(() => { const c = [{ id: 1, qty: 2 }]; changeQty(c, 1, 5); return c[0].qty; })()', equals: 2, label: 'The original cart is NOT changed' }, { uses: 'js', pattern: '\\.map\\(', label: 'You used map' }, { uses: 'js', pattern: '\\.filter\\(', label: 'You used filter' }],
        hints: ['Use `map` to change the matching line and `filter` to drop empty ones. Neither changes the original.', 'Copy the line with spread: `{ ...line, qty: line.qty + delta }`.', '```\nreturn cart\n  .map((line) => (line.id === id ? { ...line, qty: line.qty + delta } : line))\n  .filter((line) => line.qty > 0);\n```'],
      },
      {
        id: 'w31-send-order',
        title: 'Send the order',
        api: API,
        prompt: 'Write an `async` function `sendOrder(order)` that **POSTs** the order as JSON to `/api/orders` and returns the parsed answer. If the server answer is not ok it must `throw new Error("Order failed")`.\n\nThe pretend server answers a POST with `{ ok: true, received: <what you sent> }`.',
        files: ['js'],
        starter: { js: '// Write sendOrder here\n' },
        solution: { js: 'async function sendOrder(order) {\n  const response = await fetch("/api/orders", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(order),\n  });\n  if (!response.ok) {\n    throw new Error("Order failed");\n  }\n  return response.json();\n}\n' },
        checks: [{ js: 'sendOrder({ name: "Amina", total: 7000 }).then((r) => r.received.name)', equals: 'Amina', label: 'The server received the order' }, { js: 'sendOrder({ total: 14000 }).then((r) => r.received.total)', equals: 14000, label: 'The total arrived as a number' }, { js: 'sendOrder({ a: 1 }).then((r) => r.ok)', equals: true, label: 'The answer says ok' }, { uses: 'js', pattern: 'method:\\s*["\']POST["\']', label: 'You used method POST' }, { uses: 'js', pattern: 'JSON\\.stringify', label: 'You sent JSON with JSON.stringify' }, { uses: 'js', pattern: 'throw\\s+new\\s+Error', label: 'You throw when the answer is not ok' }],
        hints: ['`fetch` takes a second argument with `method`, `headers` and `body`.', 'The body must be text: `JSON.stringify(order)`. Then check `response.ok` and return `response.json()`.', '```\nconst response = await fetch("/api/orders", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(order),\n});\n```'],
      },
    ],
  },
];
