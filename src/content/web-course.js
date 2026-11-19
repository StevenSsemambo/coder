// Web course: Build Real Websites (HTML, CSS and JavaScript).
// One running project through the whole course: a website for "Mama Rose Rolex" in Wandegeya, Kampala.
// Lessons live in src/content/web/. See docs/WEB-TRACK.md for the full roadmap and how to add lessons.
import { htmlLessons } from './web/html.js';
import { cssLessons } from './web/css.js';
import { jsLessons } from './web/js.js';
import { html2Lessons } from './web/html2.js';
import { css2Lessons } from './web/css2.js';
import { js2aLessons } from './web/js2a.js';
import { js2bLessons } from './web/js2b.js';
import { dom2Lessons } from './web/dom2.js';
import { dom3Lessons } from './web/dom3.js';
import { proLessons } from './web/pro.js';
import { extra1Lessons } from './web/extra1.js';
import { extra2Lessons } from './web/extra2.js';
import { extra3Lessons } from './web/extra3.js';
import { extra4Lessons } from './web/extra4.js';
import { launch1Lessons } from './web/launch1.js';
import { launch2Lessons } from './web/launch2.js';
import { launch3Lessons } from './web/launch3.js';
import { launch4Lessons } from './web/launch4.js';
import { launch5Lessons } from './web/launch5.js';

// Lessons added after the coverage audit are slotted in where they belong in the learning order.
function place(list, afterId, items) {
  const at = list.findIndex((l) => l.id === afterId);
  if (at < 0) throw new Error(`place(): no lesson with id ${afterId}`);
  return [...list.slice(0, at + 1), ...items, ...list.slice(at + 1)];
}
const byId = (lessons, id) => lessons.find((l) => l.id === id);

let lessons = [...htmlLessons, ...html2Lessons, ...cssLessons, ...css2Lessons, jsLessons[0], ...js2aLessons, ...js2bLessons, jsLessons[1], ...dom2Lessons, ...dom3Lessons, ...proLessons];
lessons = place(lessons, 'w11-tables-media-head', [byId(extra1Lessons, 'w37-media-embeds-inputs')]);
lessons = place(lessons, 'w17-grid', [byId(extra1Lessons, 'w38-modern-css')]);
lessons = place(lessons, 'w26-classes-modules', [byId(extra2Lessons, 'w39-patterns-every-codebase'), byId(extra2Lessons, 'w43-regular-expressions')]);
lessons = place(lessons, 'w28-forms-validation', [byId(extra3Lessons, 'w40-timers-and-keys'), byId(extra3Lessons, 'w41-ui-patterns')]);
lessons = place(lessons, 'w30-fetch-async', [byId(extra3Lessons, 'w42-promises-patterns')]);
lessons = place(lessons, 'w34-publishing', [byId(extra4Lessons, 'w44-installable-offline'), byId(extra2Lessons, 'w45-tools-of-the-trade')]);

// Level 6 "Launch-ready" extension (docs/WEB-TRACK.md): lessons that belong earlier are slotted in, the rest go at the end.
lessons = place(lessons, 'w41-ui-patterns', [byId(launch1Lessons, 'w46-mobile-navigation')]);
lessons = place(lessons, 'w42-promises-patterns', [byId(launch4Lessons, 'w55-browser-apis')]);
lessons = place(lessons, 'w38-modern-css', [byId(launch3Lessons, 'w54-modern-css-2'), byId(launch4Lessons, 'w56-svg')]);
lessons = [...lessons, byId(launch1Lessons, 'w47-forms-that-send'), byId(launch1Lessons, 'w48-domains-hosting-seo-files'), byId(launch2Lessons, 'w49-trust-and-the-law'), byId(launch2Lessons, 'w50-measuring-success'), byId(launch2Lessons, 'w51-css-frameworks-design-systems'), byId(launch3Lessons, 'w52-content-management'), byId(launch3Lessons, 'w53-multilingual-sites'), byId(launch4Lessons, 'w57-speed-in-depth'), byId(launch5Lessons, 'w58-security-2'), byId(launch5Lessons, 'w59-quality-maintenance-handover'), byId(launch5Lessons, 'w60-capstone-2')];

export const webCourse = {
  id: 'web-start',
  language: 'web',
  title: 'Web: Build Real Websites',
  subtitle: 'HTML, CSS and JavaScript with a live preview. Build a real business website for Mama Rose, make it beautiful and responsive, then make it react to taps.',
  lessons,
};
