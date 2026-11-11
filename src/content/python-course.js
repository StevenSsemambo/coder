// Python course: From Zero to Builder.
// The course id stays "py-start" so progress saved on students' phones is kept.
// Lessons live in src/content/py/, one file per group of lessons.
import { level1a } from './py/level1-a.js';
import { level1b } from './py/level1-b.js';
import { level1c } from './py/level1-c.js';
import { level2a } from './py/level2-a.js';
import { level2b } from './py/level2-b.js';
import { level3a } from './py/level3-a.js';
import { level3b } from './py/level3-b.js';

export const pythonCourse = {
  id: 'py-start',
  language: 'python',
  title: 'Python: From Zero to Builder',
  subtitle: 'No experience needed. Build a shop till in Level 1 and a stock manager in Level 2, and a shop that remembers in Level 3.',
  lessons: [...level1a, ...level1b, ...level1c, ...level2a, ...level2b, ...level3a, ...level3b],
};
