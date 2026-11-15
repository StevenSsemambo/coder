// SQL course: SQL from Zero (SQLite). The roadmap, the engine notes and the lesson style are in docs/SQL-TRACK.md.
import { level1 } from './sql/level1.js';
import { level1b } from './sql/level1b.js';
import { level2 } from './sql/level2.js';
import { level3 } from './sql/level3.js';

export const sqlCourse = {
  id: 'sql-start',
  language: 'sql',
  title: 'SQL from Zero',
  subtitle: 'Ask databases questions, then design your own. Runs offline on SQLite.',
  lessons: [...level1, ...level1b, ...level2, ...level3],
};
