// A face for every course: emoji, colour, tagline. These are DEFAULTS kept in the app shell, so no track account has to
// edit anything. A course may set its own `emoji`, `color` or `tagline` later and those win (see docs/PRODUCT.md, section 5).
// Colours are dark enough for white text in light and dark mode.
const BY_ID = {
  'py-start': { emoji: '🐍', color: '#2f6fb0', tagline: 'Build real programs, step by step' },
  'web-start': { emoji: '🌐', color: '#c2551f', tagline: 'Build your own websites' },
  'sql-start': { emoji: '🗄️', color: '#0e7490', tagline: 'Ask questions of any database' },
  'php-start': { emoji: '🐘', color: '#6652b3', tagline: 'Make websites that remember things' },
  'java-start': { emoji: '☕', color: '#a8480f', tagline: 'Build solid apps with objects' },
  'c-structured': { emoji: '⚙️', color: '#475569', tagline: 'See how computers really work' },
  'c-advanced': { emoji: '🧩', color: '#8a5a00', tagline: 'Control memory and save to files' },
  'cpp-start': { emoji: '🚀', color: '#9d2f93', tagline: 'Fast code, from C to C++' },
  'cpp-pro': { emoji: '⚡', color: '#7c3aed', tagline: 'Real C++ with strings, vectors, classes' },
};
const BY_LANGUAGE = { c: '⚙️', cx: '🧩', cpp: '🚀', cppfull: '⚡', python: '🐍', java: '☕', web: '🌐', sql: '🗄️', php: '🐘' };
export const DEFAULT_COLOR = '#0b6b4f';

export function metaOf(course) {
  const d = BY_ID[course.id] || {};
  return {
    emoji: course.emoji || d.emoji || BY_LANGUAGE[course.language] || '💻',
    color: course.color || d.color || DEFAULT_COLOR,
    tagline: course.tagline || d.tagline || '',
  };
}
export const emojiOf = (course) => metaOf(course).emoji;

/** What do you want to build? Each answer points at a course that exists in the app (the tests check this). */
export const INTERESTS = [
  { id: 'websites', emoji: '🌐', label: 'Websites', help: 'Pages people open in a browser', course: 'web-start' },
  { id: 'apps', emoji: '🛠️', label: 'Apps and tools', help: 'Programs that solve real problems', course: 'py-start' },
  { id: 'data', emoji: '🗄️', label: 'Data and databases', help: 'Store, search and understand information', course: 'sql-start' },
  { id: 'computers', emoji: '⚙️', label: 'How computers work', help: 'Memory, speed and the machine itself', course: 'c-structured' },
  { id: 'unsure', emoji: '🤔', label: 'I am not sure yet', help: 'No problem. Python is a friendly start', course: 'py-start' },
];
