// Python course: From Zero to Builder.
// The course id stays "py-start" so progress saved on students' phones is kept.
// Lessons live in src/content/py/, one file per group of lessons.
import { level1a } from './py/level1-a.js';
import { level1b } from './py/level1-b.js';
import { level1c } from './py/level1-c.js';

export const pythonCourse = {
  id: 'py-start',
  language: 'python',
  title: 'Python: From Zero to Builder',
  subtitle: 'No experience needed. In Level 1 you build a working shop till.',
  lessons: [...level1a, ...level1b, ...level1c],
};
