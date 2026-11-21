// Step-by-step lessons: one small screen at a time, a big Continue button, and Kato cheering you on.
// The long single-page lesson (views/lesson.js) is still there, at #/page/<course>/<lesson>.
import { h, replace } from '../dom.js';
import { getCourse, getLesson } from '../../content/index.js';
import { state } from '../../state.js';
import { warmUp } from '../../lib/runners.js';
import { renderBlock } from '../lesson-blocks.js';
import { buildSteps, isQuestion } from '../steps.js';
import { katoSays, pickLine } from '../mascot.js';
import { feel } from '../feedback.js';
import { setLast, getResume, setResume } from '../../lib/storage.js';
import { getGame, isLessonDone } from '../../lib/game.js';
import { onLessonReached } from '../rewards.js';
import { progressBar } from '../components.js';

/** Small stable number from text, so Kato's lines differ from lesson to lesson but never flicker. */
const seedOf = (text) => [...String(text)].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 100003, 7);

export async function stepLessonView(courseId, lessonId) {
  const course = getCourse(courseId);
  const lesson = getLesson(courseId, lessonId);
  if (!lesson) return { node: h('div', { class: 'view' }, h('p', null, 'Lesson not found.')) };

  warmUp(course.language); // start loading the language runtime while the learner reads

  const steps = buildSteps(lesson);
  const lastIndex = steps.length - 1;
  const key = `${courseId}/${lessonId}`;
  const position = course.lessons.findIndex((l) => l.id === lesson.id);
  const next = course.lessons[position + 1];
  const seed = seedOf(key);

  const [resume, game] = await Promise.all([getResume(), getGame()]);
  const alreadyDone = isLessonDone(game, courseId, lessonId);
  let step = !alreadyDone && resume[key] > 0 ? Math.min(resume[key], lastIndex - 1) : 0;
  let reached = step; // the furthest step shown, so going back never locks the way forward again
  let ctx = { cleanups: [] };
  let rewarded = false;
  let gone = false;
  setLast(courseId, lessonId);
  document.body.classList.add('in-lesson');

  const counter = h('span', { class: 'step-count muted small', 'aria-live': 'polite' });
  const bar = h('div', { class: 'step-bar' });
  const body = h('div', { class: 'step-body', tabindex: '-1' });
  const backBtn = h('button', { class: 'btn', type: 'button', onclick: () => go(step - 1) }, '← Back');
  const nextSlot = h('div', { class: 'step-next' });

  function drawChrome() {
    counter.textContent = `Step ${step + 1} of ${steps.length}`;
    replace(bar, progressBar((step + 1) / steps.length));
    backBtn.classList.toggle('hidden', step === 0);
  }

  function continueButton({ enabled }) {
    const onLast = step === lastIndex;
    if (onLast) {
      replace(nextSlot, next ? h('a', { class: 'btn btn-primary btn-block', href: `#/lesson/${course.id}/${next.id}` }, 'Next lesson →') : h('a', { class: 'btn btn-primary btn-block', href: `#/course/${course.id}` }, 'Back to the course'));
      return;
    }
    const btn = h('button', { class: 'btn btn-primary btn-block', type: 'button', disabled: !enabled, onclick: () => { feel('tap'); go(step + 1); } }, step === lastIndex - 1 ? 'Finish ✓' : 'Continue');
    replace(nextSlot, btn);
  }

  function disposeStep() {
    ctx.cleanups.forEach((fn) => fn());
    ctx = { cleanups: [] };
  }

  function go(i) {
    if (gone || i < 0 || i > lastIndex) return;
    step = i;
    reached = Math.max(reached, step);
    // Remember where the learner is (a finished lesson has nothing to resume).
    setResume(key, step >= lastIndex ? 0 : step);
    draw();
    window.scrollTo(0, 0);
    body.focus({ preventScroll: true });
  }

  function draw() {
    disposeStep();
    drawChrome();
    const st = steps[step];
    const content = [];
    const slot = h('div', { class: 'kato-slot' });

    if (st.kind === 'practice') {
      content.push(drawPractice());
      continueButton({ enabled: true });
      replace(body, h('div', { class: 'step-in' }, content));
      reward();
      return;
    }

    if (step === 0) content.push(katoSays('happy', pickLine(position === 0 && !Object.keys(resume).length ? 'welcome' : 'back', seed)));

    let unlock = () => {};
    if (st.kind === 'do') {
      const { block, index } = st.blocks[0];
      const question = isQuestion(block);
      const alreadySeen = step < reached;
      continueButton({ enabled: !question || alreadySeen });
      const hooks = question
        ? {
            giveUpAfter: 2,
            onResult: (r) => {
              feel(r.correct ? 'ok' : 'tap');
              replace(slot, katoSays(r.correct ? 'cheer' : 'think', pickLine(r.correct ? 'right' : 'reveal', seed + step)));
              unlock();
            },
            onWrong: (n) => {
              feel('wrong');
              replace(slot, katoSays('oops', pickLine('wrong', seed + n)));
            },
          }
        : {};
      unlock = () => continueButton({ enabled: true });
      content.push(renderBlock(block, { language: course.language, index, ctx, hooks }), slot);
      if (!question) content.push(h('p', { class: 'muted small step-hint' }, block.t === 'web' ? 'Change the code, then press Continue when you are ready.' : 'Tap Run to see what happens. Then press Continue.'));
    } else {
      continueButton({ enabled: true });
      content.push(st.blocks.map(({ block, index }) => renderBlock(block, { language: course.language, index, ctx })));
    }
    replace(body, h('div', { class: 'step-in' }, content));
  }

  function drawPractice() {
    const list = lesson.exercises;
    const firstOpen = list.find((e) => !state.progress[e.id]?.passed) || list[0];
    return h(
      'div',
      { class: 'practice-step' },
      katoSays('cheer', pickLine('practice', seed)),
      h('h2', { class: 'lesson-h' }, 'Practice'),
      list.length ? h('p', { class: 'muted' }, 'Do these one by one. Hints are free.') : h('p', { class: 'muted' }, 'This lesson has no exercises. You are ready for the next one.'),
      list.map((e) => {
        const p = state.progress[e.id];
        return h(
          'a',
          { class: 'card lesson-row', href: `#/exercise/${course.id}/${lesson.id}/${e.id}` },
          h('span', { class: `status-dot ${p?.passed ? 'done' : ''}`, 'aria-hidden': 'true' }, p?.passed ? '✓' : ''),
          h('div', { class: 'grow' }, h('h3', null, e.title), h('p', { class: 'muted small' }, p?.passed ? 'Completed' : p ? `Best: ${Math.round(p.best * 100)}%` : 'Not started')),
          h('span', { class: 'chevron', 'aria-hidden': 'true' }, '›'),
        );
      }),
      list.length ? h('a', { class: 'btn btn-primary btn-block', href: `#/exercise/${course.id}/${lesson.id}/${firstOpen.id}` }, 'Start practising') : null,
    );
  }

  function reward() {
    if (rewarded) return;
    rewarded = true;
    const firstExercise = lesson.exercises.find((e) => !state.progress[e.id]?.passed) || lesson.exercises[0];
    onLessonReached(courseId, lessonId, { firstExercise });
  }

  const node = h(
    'div',
    { class: 'view stepview' },
    h(
      'div',
      { class: 'step-top' },
      h('a', { class: 'step-close', href: `#/course/${course.id}`, 'aria-label': 'Close lesson and go back to the course' }, '✕'),
      bar,
      h('a', { class: 'step-full muted small', href: `#/page/${course.id}/${lesson.id}` }, 'Full page'),
    ),
    h('div', { class: 'step-meta' }, h('span', { class: 'step-title' }, lesson.title), counter),
    body,
    h('div', { class: 'step-dock' }, backBtn, nextSlot),
  );

  draw();

  return {
    node,
    cleanup() {
      gone = true;
      disposeStep();
      document.body.classList.remove('in-lesson');
    },
  };
}
