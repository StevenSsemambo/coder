// C, Part 2: structures, memory and files. Runs on picoc compiled to WebAssembly (tools/picoc-wasm/README.md).
// The roadmap and the runtime limits are in docs/CX-TRACK.md. It continues the first C course (c-structured).
import { structLessons } from './cx/structs.js';
import { memoryLessons } from './cx/memory.js';
import { fileLessons } from './cx/files.js';

export const cxCourse = {
  id: 'c-advanced',
  language: 'cx',
  title: 'C Part 2: Structures, Memory and Files',
  subtitle: 'Your own data types, memory you control, and saving data to files',
  lessons: [...structLessons, ...memoryLessons, ...fileLessons],
};
