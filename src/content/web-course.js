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

export const webCourse = {
  id: 'web-start',
  language: 'web',
  title: 'Web: Build Real Websites',
  subtitle: 'HTML, CSS and JavaScript with a live preview. Build a real business website for Mama Rose, make it beautiful and responsive, then make it react to taps.',
  lessons: [...htmlLessons, ...html2Lessons, ...cssLessons, ...css2Lessons, jsLessons[0], ...js2aLessons, ...js2bLessons, jsLessons[1], ...dom2Lessons, ...dom3Lessons, ...proLessons],
};
