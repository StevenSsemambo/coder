// C course: Structured Programming in C (module TTSD113).
// The roadmap, the interpreter limits and the lesson style are in docs/C-TRACK.md.
// NOTE: the lesson order is a standard Structured Programming syllabus. It must be mapped to the official
// module outline before this pack is used for assessed work.
import { level1 } from './c/level1.js';
import { legacyLessons } from './c/legacy.js';

export const cCourse = {
  id: 'c-structured',
  language: 'c',
  title: 'Structured Programming in C',
  subtitle: 'Draft pack for the Structured Programming module',
  lessons: [...level1, ...legacyLessons],
};
