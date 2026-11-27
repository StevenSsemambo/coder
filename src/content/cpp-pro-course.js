// C++ Pro: real C++ (a real compiler running offline), from strings and vectors to classes, templates and the standard
// library. The roadmap, the limits and the way it is tested are in docs/CPP-PRO-TRACK.md.
// The course is written and tested, but it is not offered in the app until the compiler pack is wired in
// (see `pendingCourses` in src/content/index.js).
import { stringsLesson } from './cpp-pro/strings.js';
import { vectorsLesson } from './cpp-pro/vectors.js';
import { algorithmsLesson } from './cpp-pro/algorithms.js';
import { referencesLesson } from './cpp-pro/references.js';
import { structsLesson } from './cpp-pro/structs.js';
import { ledgerLesson } from './cpp-pro/ledger.js';
import { classesLesson } from './cpp-pro/classes.js';
import { constructorsLesson } from './cpp-pro/constructors.js';
import { encapsulationLesson } from './cpp-pro/encapsulation.js';
import { operatorsLesson } from './cpp-pro/operators.js';
import { inheritanceLesson } from './cpp-pro/inheritance.js';
import { polymorphismLesson } from './cpp-pro/polymorphism.js';
import { designLesson } from './cpp-pro/design.js';
import { shopLesson } from './cpp-pro/shop.js';
import { templatesLesson } from './cpp-pro/templates.js';
import { containersLesson } from './cpp-pro/containers.js';
import { iteratorsLesson } from './cpp-pro/iterators.js';
import { memoryLesson } from './cpp-pro/memory.js';

export const cppProCourse = {
  id: 'cpp-pro',
  language: 'cppfull',
  title: 'C++ Pro: Real C++',
  subtitle: 'Strings, vectors, classes, templates and the standard library, with a real compiler',
  lessons: [stringsLesson, vectorsLesson, algorithmsLesson, referencesLesson, structsLesson, ledgerLesson, classesLesson, constructorsLesson, encapsulationLesson, operatorsLesson, inheritanceLesson, polymorphismLesson, designLesson, shopLesson, templatesLesson, containersLesson, iteratorsLesson, memoryLesson],
};
