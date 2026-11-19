// Java course: from complete beginner to building market-ready programs.
// The roadmap, the engine limits and the lesson rules are in docs/JAVA-TRACK.md.
// Running project: the Village SACCO (savings and loans group).
import { whatLesson } from './java/what.js';
import { firstLesson } from './java/first.js';
import { variablesLesson } from './java/variables.js';
import { operatorsLesson } from './java/operators.js';
import { inputLesson } from './java/input.js';
import { decisionsLesson } from './java/decisions.js';
import { loopsLesson } from './java/loops.js';
import { nestedLesson } from './java/nested.js';
import { methodsLesson } from './java/methods.js';
import { recursionLesson } from './java/recursion.js';
import { arraysLesson } from './java/arrays.js';
import { arrayAlgosLesson } from './java/arrayalgos.js';
import { gridsLesson } from './java/grids.js';
import { stringsLesson } from './java/strings.js';
import { ledgerLesson } from './java/ledger.js';
import { classesLesson } from './java/classes.js';
import { constructorsLesson } from './java/constructors.js';
import { encapsulationLesson } from './java/encapsulation.js';
import { staticsLesson } from './java/statics.js';

export const javaCourse = {
  id: 'java-start',
  language: 'java',
  title: 'Java from Zero to Market-Ready',
  subtitle: 'Learn real Java offline, and build the Village SACCO system step by step',
  lessons: [whatLesson, firstLesson, variablesLesson, operatorsLesson, inputLesson, decisionsLesson, loopsLesson, nestedLesson, methodsLesson, recursionLesson, arraysLesson, arrayAlgosLesson, gridsLesson, stringsLesson, ledgerLesson, classesLesson, constructorsLesson, encapsulationLesson, staticsLesson],
};
