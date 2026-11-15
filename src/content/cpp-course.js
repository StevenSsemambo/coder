// C++ course: C++ from Zero. The roadmap, the interpreter limits and the lesson style are in docs/CPP-TRACK.md.
import { level1 } from './cpp/level1.js';
import { level2 } from './cpp/level2.js';

export const cppCourse = {
  id: 'cpp-start',
  language: 'cpp',
  title: 'C++ from Zero',
  subtitle: 'Part A: the basics, run on the built-in interpreter',
  lessons: [...level1, ...level2],
};
