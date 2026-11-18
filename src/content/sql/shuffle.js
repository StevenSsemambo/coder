// Spreads the correct answer of every multiple-choice block over all positions.
//
// The app lists the options of `quiz`, `predict` and `bug` blocks (and the choices of `fill` blocks) in the order the
// lesson gives them, and a lesson is easiest to write with the right answer first. Left like that, a learner could
// score well by always tapping the first choice. This rewrites the SQL lessons ONCE, when the course loads, so the
// correct answer lands in a different place each time. It is deterministic (the same on every load and in the tests),
// balanced (each position gets about the same share) and keeps the order of the wrong answers unpredictable.
// Nothing else changes: `answer` is updated to match, so the tests still prove every answer is right.

const SEED = 20261115;

function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function shuffled(items, next) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffleChoices(lessons) {
  const next = rng(SEED);
  const bags = new Map(); // option count -> positions not used yet, so every position gets its turn
  const targetFor = (n) => {
    if (!bags.get(n)?.length) bags.set(n, shuffled(Array.from({ length: n }, (_, i) => i), next));
    return bags.get(n).pop();
  };
  /** the options with the right one moved to a fresh position; returns the new list and where the right one went */
  const place = (options, correctIndex) => {
    const target = targetFor(options.length);
    const wrong = shuffled(options.filter((_, i) => i !== correctIndex), next);
    const out = [...wrong];
    out.splice(target, 0, options[correctIndex]);
    return { options: out, answer: target };
  };
  return lessons.map((lesson) => ({
    ...lesson,
    blocks: lesson.blocks.map((block) => {
      if (['quiz', 'predict', 'bug'].includes(block.t) && Array.isArray(block.options)) return { ...block, ...place(block.options, block.answer) };
      if (block.t === 'fill' && Array.isArray(block.blanks)) {
        return {
          ...block,
          blanks: block.blanks.map((blank) => {
            const at = blank.options.indexOf(blank.answer);
            return at < 0 ? blank : { ...blank, options: place(blank.options, at).options };
          }),
        };
      }
      return block;
    }),
  }));
}
