// PHP course: PHP from Zero to Market-Ready. The roadmap, the engine notes and the lesson style are in docs/PHP-TRACK.md.
import { level1 } from './php/level1.js';
import { level1b } from './php/level1b.js';
import { level2 } from './php/level2.js';
import { level2b } from './php/level2b.js';

export const phpCourse = {
  id: 'php-start',
  language: 'php',
  title: 'PHP from Zero',
  subtitle: "Build Nambi's Mobile Money booth in PHP, from your first line to a real application. Runs offline.",
  lessons: [...level1, ...level1b, ...level2, ...level2b],
};
