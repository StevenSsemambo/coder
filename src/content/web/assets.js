// Pictures for the lessons. They are tiny SVGs written as text, so they work with no internet at all.
// In the student's HTML they are used like real files: <img src="img/rolex.svg" alt="...">
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

export const ASSETS = {
  'img/logo.svg': svg(120, 120, '<circle cx="60" cy="60" r="56" fill="#0b6b4f"/><circle cx="60" cy="60" r="44" fill="#f7c948"/><text x="60" y="74" font-size="40" text-anchor="middle" font-family="sans-serif" font-weight="700" fill="#0b6b4f">MR</text>'),
  'img/rolex.svg': svg(240, 160, '<rect width="240" height="160" rx="16" fill="#fdf1d3"/><ellipse cx="120" cy="96" rx="92" ry="34" fill="#e9b872"/><ellipse cx="120" cy="86" rx="92" ry="34" fill="#f3cf8d"/><ellipse cx="120" cy="82" rx="70" ry="22" fill="#f7c948"/><circle cx="100" cy="78" r="7" fill="#5aa469"/><circle cx="130" cy="86" r="7" fill="#e0533d"/><circle cx="150" cy="76" r="6" fill="#5aa469"/>'),
  'img/chicken.svg': svg(240, 160, '<rect width="240" height="160" rx="16" fill="#e6f2ec"/><ellipse cx="120" cy="96" rx="58" ry="40" fill="#fff"/><circle cx="160" cy="62" r="22" fill="#fff"/><polygon points="180,60 200,66 180,72" fill="#f59e0b"/><circle cx="166" cy="56" r="4" fill="#1c1b18"/><path d="M154 40 q6 -16 14 0 q6 -14 12 2" fill="#e0533d"/>'),
  'img/boda.svg': svg(240, 160, '<rect width="240" height="160" rx="16" fill="#e8eef9"/><circle cx="64" cy="108" r="26" fill="none" stroke="#1c1b18" stroke-width="8"/><circle cx="176" cy="108" r="26" fill="none" stroke="#1c1b18" stroke-width="8"/><path d="M64 108 L108 70 L150 70 L176 108 M108 70 L96 54 L80 54" fill="none" stroke="#0b6b4f" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'),
  'img/pin.svg': svg(40, 56, '<path d="M20 2C10 2 2 10 2 20c0 14 18 34 18 34s18-20 18-34C38 10 30 2 20 2z" fill="#e0533d"/><circle cx="20" cy="20" r="7" fill="#fff"/>'),
  'img/phone-hero.svg': svg(320, 180, '<rect width="320" height="180" fill="#0b6b4f"/><circle cx="260" cy="40" r="70" fill="#14876a"/><circle cx="40" cy="170" r="60" fill="#14876a"/><text x="160" y="104" font-size="34" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">Fresh. Hot. Daily.</text>'),
};
