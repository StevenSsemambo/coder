// C++ course: C++ from Zero. The roadmap, the interpreter limits and the lesson style are in docs/CPP-TRACK.md.
import { level1 } from './cpp/level1.js';
import { level2 } from './cpp/level2.js';
import { switchLessons } from './cpp/switch.js';
import { loopLessons } from './cpp/loops.js';
import { projectLessons } from './cpp/till.js';
import { functionLessons } from './cpp/functions.js';
import { momoLessons } from './cpp/momo.js';
import { arrayLessons } from './cpp/arrays.js';
import { textLessons } from './cpp/text.js';

export const cppCourse = {
  id: 'cpp-start',
  language: 'cpp',
  title: 'C++ from Zero',
  subtitle: 'Part A: the basics, run on the built-in interpreter',
  lessons: [...level1, ...level2, ...switchLessons, ...loopLessons, ...projectLessons, ...functionLessons, ...momoLessons, ...arrayLessons, ...textLessons],
};
