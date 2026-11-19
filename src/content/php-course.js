// PHP course: PHP from Zero to Market-Ready. The roadmap, the engine notes and the lesson style are in docs/PHP-TRACK.md.
import { level1 } from './php/level1.js';
import { level1b } from './php/level1b.js';
import { level2 } from './php/level2.js';
import { level2b } from './php/level2b.js';
import { level3 } from './php/level3.js';
import { level3b } from './php/level3b.js';
import { level4 } from './php/level4.js';
import { level4b } from './php/level4b.js';
import { level5 } from './php/level5.js';
import { level5b } from './php/level5b.js';
import { level5c } from './php/level5c.js';

export const phpCourse = {
  id: 'php-start',
  language: 'php',
  title: 'PHP from Zero',
  subtitle: "Build Nambi's Mobile Money booth in PHP, from your first line to a real application. Runs offline.",
  lessons: [...level1, ...level1b, ...level2, ...level2b, ...level3, ...level3b, ...level4, ...level4b, ...level5, ...level5b, ...level5c],
};
