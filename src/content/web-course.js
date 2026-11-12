// Web course: Build Real Websites (HTML, CSS and JavaScript).
// One running project through the whole course: a website for "Mama Rose Rolex" in Wandegeya, Kampala.
// Lessons live in src/content/web/. See docs/WEB-TRACK.md for the full roadmap and how to add lessons.
import { htmlLessons } from './web/html.js';
import { cssLessons } from './web/css.js';
import { jsLessons } from './web/js.js';

export const webCourse = {
  id: 'web-start',
  language: 'web',
  title: 'Web: Build Real Websites',
  subtitle: 'HTML, CSS and JavaScript with a live preview. Build a real business website for Mama Rose, make it beautiful and responsive, then make it react to taps.',
  lessons: [...htmlLessons, ...cssLessons, ...jsLessons],
};
