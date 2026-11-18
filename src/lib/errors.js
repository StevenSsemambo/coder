// Rule-based error translator.
// Turns raw compiler / runtime messages into plain language, with a likely cause and a fix.
// It is rule based on purpose: instant, deterministic, and it runs on any phone with no AI model.
//
// Languages: en (English), sw (Kiswahili), lg (Luganda).
// Every rule must have English. Other languages are optional and fall back to English.
// NOTE: Luganda ("lg") entries are intentionally empty. They need a native speaker to write
// them so the phrasing sounds natural (see docs/CONTRIBUTING-TRANSLATIONS.md).

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'lg', label: 'Luganda (coming soon)' },
];

const HEADERS = {
  stdio: ['printf', 'scanf', 'puts', 'getchar', 'putchar', 'gets', 'fgets', 'sprintf'],
  math: ['sqrt', 'pow', 'fabs', 'floor', 'ceil', 'sin', 'cos', 'tan', 'log', 'exp'],
  string: ['strlen', 'strcpy', 'strcmp', 'strcat', 'memset', 'memcpy'],
  stdlib: ['malloc', 'free', 'atoi', 'atof', 'rand', 'srand', 'exit', 'abs'],
};
function headerFor(name) {
  for (const [file, names] of Object.entries(HEADERS)) if (names.includes(name)) return `#include <${file}.h>`;
  return null;
}

const CLOSERS = { '(': ')', '[': ']', '{': '}' };

const RULES = [
  // ---- both languages ------------------------------------------------------
  {
    id: 'timeout',
    languages: ['python', 'c', 'cpp', 'cx', 'java', 'web', 'sql', 'php'],
    match: /Time limit exceeded/i,
    build: () => ({
      en: {
        title: 'Your program ran for too long',
        why: 'It probably has an infinite loop (a loop whose condition never becomes false), or it waits for something that never comes.',
        fix: 'Check your loop condition and make sure the loop variable changes inside the loop, for example with i++. Then run again.',
      },
      sw: {
        title: 'Programu yako imechukua muda mrefu mno',
        why: 'Huenda ina kitanzi kisichoisha (infinite loop), yaani kitanzi ambacho sharti lake halibadiliki kuwa uongo, au inasubiri kitu ambacho hakitakuja.',
        fix: 'Angalia sharti la kitanzi chako na hakikisha kigezo cha kitanzi kinabadilika ndani ya kitanzi, mfano i++. Kisha endesha tena.',
      },
    }),
  },


  // ---- JavaScript (web track) -----------------------------------------------
  {
    id: 'js-ref',
    languages: ['web'],
    match: /ReferenceError: (\w+) is not defined/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not defined`,
        why: `JavaScript does not know the name "${m[1]}". You may have misspelled it, used it before creating it with let or const, or forgotten quotes around text.`,
        fix: `Check the spelling (capital and small letters matter). Create it first: const ${m[1]} = ... If you meant text, write "${m[1]}" in quotes.`,
      },
      sw: {
        title: `"${m[1]}" haijafafanuliwa`,
        why: `JavaScript haijui jina "${m[1]}". Huenda umekosea tahajia, umelitumia kabla ya kulitengeneza kwa let au const, au umesahau alama za nukuu kwenye maandishi.`,
        fix: `Angalia tahajia (herufi kubwa na ndogo zinajalisha). Litengeneze kwanza: const ${m[1]} = ... Kama ulimaanisha maandishi, andika "${m[1]}" ndani ya nukuu.`,
      },
    }),
  },
  {
    id: 'js-null-property',
    languages: ['web'],
    match: /Cannot read properties of (null|undefined) \(reading '([^']+)'\)|can't access property "([^"]+)", .+ is (null|undefined)|(null|undefined) is not an object \(evaluating '[^.']+\.([^')]+)'\)/,
    build: (m) => {
      const what = m[1] || m[4] || m[5];
      const prop = m[2] || m[3] || m[6];
      return {
        en: {
          title: `Your code tried to use "${prop}" on something that is ${what}`,
          why: what === 'null' ? 'This almost always means getElementById or querySelector found nothing. The id or selector is spelled differently in your HTML, or your script runs before the page has that element.' : 'You asked for a part of something that does not exist yet, for example the 5th item of a list with 3 items.',
          fix: what === 'null' ? 'Compare the id or selector in your JavaScript with your HTML, letter by letter. Put the script tag at the end of the body, just before </body>.' : 'Print the value with console.log() just before the error line, and check that it holds what you expect.',
        },
        sw: {
          title: `Msimbo wako ulijaribu kutumia "${prop}" kwenye kitu ambacho ni ${what}`,
          why: what === 'null' ? 'Hii karibu kila mara inamaanisha getElementById au querySelector haikupata kitu. Id au selector imeandikwa tofauti kwenye HTML yako, au script yako inaendeshwa kabla ukurasa haujapata kipengele hicho.' : 'Uliomba sehemu ya kitu ambacho bado hakipo, kwa mfano kipengee cha 5 kwenye orodha yenye vipengee 3.',
          fix: what === 'null' ? 'Linganisha id au selector kwenye JavaScript yako na HTML yako, herufi kwa herufi. Weka tagi ya script mwishoni mwa body, kabla ya </body>.' : 'Chapisha thamani kwa console.log() kabla ya mstari wenye hitilafu, kisha hakikisha ina unachotarajia.',
        },
      };
    },
  },
  {
    id: 'js-not-function',
    languages: ['web'],
    match: /TypeError: ([\w.$]+) is not a function/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not a function`,
        why: `You wrote ${m[1]}( ) as if it were a function, but it is something else, or its name is misspelled.`,
        fix: `Check the spelling and capital letters of ${m[1]}. Method names like addEventListener and querySelector are case sensitive.`,
      },
      sw: {
        title: `"${m[1]}" si function`,
        why: `Uliandika ${m[1]}( ) kana kwamba ni function, lakini ni kitu kingine, au jina lake lina makosa ya tahajia.`,
        fix: `Angalia tahajia na herufi kubwa za ${m[1]}. Majina kama addEventListener na querySelector yanajali herufi kubwa na ndogo.`,
      },
    }),
  },
  {
    id: 'js-const',
    languages: ['web'],
    match: /TypeError: Assignment to constant variable/,
    build: () => ({
      en: {
        title: 'You changed a const',
        why: 'A variable made with const can never get a new value.',
        fix: 'Change const to let at the place where the variable is created, if it needs to change.',
      },
      sw: {
        title: 'Umebadilisha const',
        why: 'Kigezo kilichotengenezwa kwa const hakiwezi kupewa thamani mpya.',
        fix: 'Badilisha const kuwa let pale kigezo kinapotengenezwa, kama kinahitaji kubadilika.',
      },
    }),
  },
  {
    id: 'js-redeclared',
    languages: ['web'],
    match: /SyntaxError: Identifier '(\w+)' has already been declared/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" was created twice`,
        why: `You wrote let or const ${m[1]} two times. A name can be created only once.`,
        fix: `Keep the first let or const ${m[1]}. For the second one, write only ${m[1]} = new value (no let or const).`,
      },
      sw: {
        title: `"${m[1]}" imetengenezwa mara mbili`,
        why: `Umeandika let au const ${m[1]} mara mbili. Jina linaweza kutengenezwa mara moja tu.`,
        fix: `Acha let au const ${m[1]} ya kwanza. Kwa ya pili, andika tu ${m[1]} = thamani mpya (bila let au const).`,
      },
    }),
  },
  {
    id: 'js-syntax-eof',
    languages: ['web'],
    match: /SyntaxError: Unexpected end of input|SyntaxError: missing \) after argument list|SyntaxError: Unexpected token '?}'?|SyntaxError: Unexpected token '?\)'?|SyntaxError: Unexpected EOF/,
    build: () => ({
      en: {
        title: 'A bracket is missing or in the wrong place',
        why: 'JavaScript reached a place where the brackets do not match: a ( [ { was opened and never closed, or a closing one has nothing to close.',
        fix: 'Go through the code and count: every ( needs a ), every { needs a }, every [ needs a ]. Look at the line number shown and the lines just above it.',
      },
      sw: {
        title: 'Mabano yamekosekana au yapo mahali pasipofaa',
        why: 'JavaScript imefika mahali ambapo mabano hayalingani: ( [ { ulifunguliwa bila kufungwa, au kuna kifunga kisicho na cha kufunga.',
        fix: 'Pitia msimbo na uhesabu: kila ( inahitaji ), kila { inahitaji }, kila [ inahitaji ]. Angalia mstari ulioonyeshwa na mistari ya juu yake.',
      },
    }),
  },
  {
    id: 'js-syntax',
    languages: ['web'],
    match: /SyntaxError: (Unexpected (?:token|identifier|string|number)[^\n]*|Invalid or unexpected token)/,
    build: (m) => ({
      en: {
        title: 'JavaScript cannot read this line',
        why: `Something is written in a way JavaScript does not understand (${m[1]}). Common causes: a missing comma or quote, a missing bracket on the line above, or a typo in a keyword.`,
        fix: 'Look at the line number shown and the line just before it. Check commas, quotes and brackets.',
      },
      sw: {
        title: 'JavaScript haiwezi kusoma mstari huu',
        why: `Kuna kitu kimeandikwa kwa namna ambayo JavaScript haielewi (${m[1]}). Sababu za kawaida: koma au nukuu iliyokosekana, bano lililokosekana kwenye mstari wa juu, au kosa la tahajia kwenye neno muhimu.`,
        fix: 'Angalia mstari ulioonyeshwa na mstari kabla yake. Kagua koma, nukuu na mabano.',
      },
    }),
  },
  {
    id: 'js-stack',
    languages: ['web'],
    match: /RangeError: Maximum call stack size exceeded/,
    build: () => ({
      en: {
        title: 'A function kept calling itself',
        why: 'A function calls itself (or two functions call each other) and never stops, so the browser ran out of room.',
        fix: 'Make sure there is a condition that makes the function stop (return) before it calls itself again.',
      },
      sw: {
        title: 'Function iliendelea kujiita yenyewe',
        why: 'Function inajiita yenyewe (au function mbili zinaitana) bila kuacha, hivyo kivinjari kimeishiwa nafasi.',
        fix: 'Hakikisha kuna sharti linalofanya function iache (return) kabla ya kujiita tena.',
      },
    }),
  },

  // ---- Python ---------------------------------------------------------------
  {
    id: 'py-name-error',
    languages: ['python'],
    match: /NameError: name '([^']+)' is not defined/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not defined`,
        why: `Python does not know the name "${m[1]}". You may have misspelled it, or used it before giving it a value.`,
        fix: `Check the spelling (capital and small letters matter). Make sure you write ${m[1]} = ... before you use it. If you meant text, put it in quotes: "${m[1]}".`,
      },
      sw: {
        title: `"${m[1]}" haijafafanuliwa`,
        why: `Python haijui jina "${m[1]}". Huenda umekosea tahajia, au umelitumia kabla ya kulipa thamani.`,
        fix: `Angalia tahajia (herufi kubwa na ndogo zinajalisha). Hakikisha umeandika ${m[1]} = ... kabla ya kulitumia. Kama ulimaanisha maandishi, yaweke kwenye alama za nukuu: "${m[1]}".`,
      },
    }),
  },
  {
    id: 'py-never-closed',
    languages: ['python'],
    match: /SyntaxError: '([(\[{])' was never closed/,
    build: (m) => ({
      en: {
        title: `A "${m[1]}" was never closed`,
        why: 'You opened a bracket but did not close it.',
        fix: `Find the opening ${m[1]} and add the matching ${CLOSERS[m[1]]}. Every opening bracket needs a closing one.`,
      },
      sw: {
        title: `Mabano "${m[1]}" hayajafungwa`,
        why: 'Ulifungua mabano lakini hukuyafunga.',
        fix: `Tafuta ${m[1]} ya kufungua kisha ongeza ${CLOSERS[m[1]]} inayolingana. Kila ya kufungua inahitaji ya kufunga.`,
      },
    }),
  },
  {
    id: 'py-missing-colon',
    languages: ['python'],
    match: /SyntaxError: expected ':'/,
    build: () => ({
      en: {
        title: 'A colon ":" is missing',
        why: 'Lines that start with if, else, elif, for, while, def or class must end with a colon.',
        fix: 'Add ":" at the end of the line, then indent the next line.',
      },
      sw: {
        title: 'Alama ya nukta mbili ":" haipo',
        why: 'Mistari inayoanza na if, else, elif, for, while, def au class lazima iishie na ":".',
        fix: 'Weka ":" mwishoni mwa mstari, kisha ingiza mstari unaofuata ndani kidogo (indent).',
      },
    }),
  },
  {
    id: 'py-unterminated-string',
    languages: ['python'],
    match: /SyntaxError: (unterminated string literal|unterminated triple-quoted)/,
    build: () => ({
      en: {
        title: 'A piece of text was not closed',
        why: 'You started text with a quote but did not finish it with a matching quote on the same line.',
        fix: 'Add the closing quote (" or \') at the end of the text.',
      },
      sw: {
        title: 'Maandishi hayajafungwa',
        why: 'Ulianza maandishi kwa alama ya nukuu lakini hukuimalizia kwa nukuu inayolingana kwenye mstari huo.',
        fix: 'Ongeza alama ya nukuu ya kufunga (" au \') mwishoni mwa maandishi.',
      },
    }),
  },
  {
    id: 'py-indentation',
    languages: ['python'],
    match: /IndentationError/,
    build: () => ({
      en: {
        title: 'The spacing at the start of a line is wrong',
        why: 'Python uses spaces at the start of a line to group code. After a line ending in ":" the next line must be indented, and lines in the same block must line up.',
        fix: 'Indent the lines inside if, for, while and def by the same number of spaces (use the Tab button). Do not indent lines that are not inside a block.',
      },
      sw: {
        title: 'Nafasi mwanzoni mwa mstari si sahihi',
        why: 'Python hutumia nafasi mwanzoni mwa mstari kupanga msimbo. Baada ya mstari unaoishia na ":" mstari unaofuata lazima uingizwe ndani, na mistari ya kundi moja lazima ilingane.',
        fix: 'Ingiza ndani mistari iliyo ndani ya if, for, while na def kwa nafasi sawa (tumia kitufe cha Tab). Usiingize ndani mistari isiyo kwenye kundi.',
      },
    }),
  },
  {
    id: 'py-syntax',
    languages: ['python'],
    match: /SyntaxError/,
    build: () => ({
      en: {
        title: 'Python cannot understand this line',
        why: 'There is a typing mistake in the code: a missing or extra symbol, or a misspelled keyword.',
        fix: 'Look at the line shown and the line just before it. Check commas, brackets, quotes and colons, and the spelling of words like if, for, while.',
      },
      sw: {
        title: 'Python haielewi mstari huu',
        why: 'Kuna kosa la kuandika: alama imepungua au imezidi, au neno muhimu limekosewa tahajia.',
        fix: 'Angalia mstari unaoonyeshwa na mstari uliotangulia. Kagua koma, mabano, nukuu na nukta mbili, pamoja na tahajia ya maneno kama if, for, while.',
      },
    }),
  },
  {
    id: 'py-zero-division',
    languages: ['python'],
    match: /ZeroDivisionError/,
    build: () => ({
      en: {
        title: 'Division by zero',
        why: 'The program tried to divide a number by 0, which is not possible.',
        fix: 'Check the value you divide by. Use an if statement to avoid dividing when it is 0.',
      },
      sw: {
        title: 'Kugawanya kwa sifuri',
        why: 'Programu ilijaribu kugawanya nambari kwa 0, jambo ambalo haliwezekani.',
        fix: 'Angalia thamani unayogawanyia. Tumia if ili kuepuka kugawanya pale ambapo ni 0.',
      },
    }),
  },
  {
    id: 'py-value-int',
    languages: ['python'],
    match: /ValueError: invalid literal for int\(\) with base 10: (.+)/,
    build: (m) => ({
      en: {
        title: `Cannot turn ${m[1]} into a whole number`,
        why: 'int() only works on text that looks like a whole number, such as "25". Letters, decimals or an empty input fail.',
        fix: 'Check what is typed in the Input box. For decimals use float() instead of int().',
      },
      sw: {
        title: `Haiwezi kubadilisha ${m[1]} kuwa nambari kamili`,
        why: 'int() hufanya kazi tu kwenye maandishi yanayofanana na nambari kamili kama "25". Herufi, desimali au ingizo tupu hushindwa.',
        fix: 'Angalia kilichoandikwa kwenye kisanduku cha Ingizo. Kwa desimali tumia float() badala ya int().',
      },
    }),
  },
  {
    id: 'py-type-operand',
    languages: ['python'],
    match: /TypeError: unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/,
    build: (m) => ({
      en: {
        title: `Cannot mix "${m[2]}" and "${m[3]}" here`,
        why: 'Python cannot combine these two kinds of values with this operator, for example a number with text.',
        fix: 'Convert one of them: int("5") turns text into a number, str(5) turns a number into text.',
      },
      sw: {
        title: `Huwezi kuchanganya "${m[2]}" na "${m[3]}" hapa`,
        why: 'Python haiwezi kuunganisha aina hizi mbili za thamani kwa kitendakazi hiki, kwa mfano nambari na maandishi.',
        fix: 'Badilisha moja yao: int("5") hubadilisha maandishi kuwa nambari, str(5) hubadilisha nambari kuwa maandishi.',
      },
    }),
  },
  {
    id: 'py-type-concat',
    languages: ['python'],
    match: /TypeError: can only concatenate str \(not "(\w+)"\) to str/,
    build: (m) => ({
      en: {
        title: `Cannot join text and "${m[1]}"`,
        why: 'The + sign joins text with text. You tried to join text with a different kind of value.',
        fix: 'Turn the other value into text with str(...), for example "Total: " + str(total).',
      },
      sw: {
        title: `Huwezi kuunganisha maandishi na "${m[1]}"`,
        why: 'Alama ya + huunganisha maandishi na maandishi. Ulijaribu kuunganisha maandishi na aina nyingine ya thamani.',
        fix: 'Badilisha thamani nyingine kuwa maandishi kwa str(...), mfano "Jumla: " + str(jumla).',
      },
    }),
  },
  {
    id: 'py-index',
    languages: ['python'],
    match: /IndexError/,
    build: () => ({
      en: {
        title: 'List position out of range',
        why: 'You asked for a position that does not exist. Lists start at position 0 and the last position is len(list) - 1.',
        fix: 'Check the position number and the length of the list. Loops should stop before the length.',
      },
      sw: {
        title: 'Nafasi iko nje ya orodha',
        why: 'Uliomba nafasi isiyopo. Orodha huanza nafasi 0 na nafasi ya mwisho ni len(orodha) - 1.',
        fix: 'Angalia namba ya nafasi na urefu wa orodha. Vitanzi vinapaswa kusimama kabla ya urefu.',
      },
    }),
  },
  {
    id: 'py-key',
    languages: ['python'],
    match: /KeyError: (.+)/,
    build: (m) => ({
      en: {
        title: `Key ${m[1]} not found`,
        why: 'The dictionary has no item with that key.',
        fix: 'Check the spelling of the key, or test first with "if key in dictionary".',
      },
      sw: {
        title: `Ufunguo ${m[1]} haupatikani`,
        why: 'Kamusi (dictionary) haina kipengele chenye ufunguo huo.',
        fix: 'Angalia tahajia ya ufunguo, au jaribu kwanza kwa "if key in dictionary".',
      },
    }),
  },
  {
    id: 'py-eof',
    languages: ['python'],
    match: /EOFError/,
    build: () => ({
      en: {
        title: 'The program asked for input that was not there',
        why: 'input() tried to read a line, but the Input box has no more lines.',
        fix: 'Type the input values in the Input box, one per line, in the order the program asks for them.',
      },
      sw: {
        title: 'Programu iliomba ingizo ambalo halikuwepo',
        why: 'input() ilijaribu kusoma mstari, lakini kisanduku cha Ingizo hakina mistari zaidi.',
        fix: 'Andika thamani za ingizo kwenye kisanduku cha Ingizo, moja kwa kila mstari, kwa mpangilio ambao programu inaziomba.',
      },
    }),
  },
  {
    id: 'py-attribute',
    languages: ['python'],
    match: /AttributeError: '(\w+)' object has no attribute '(\w+)'/,
    build: (m) => ({
      en: {
        title: `A ${m[1]} has no "${m[2]}"`,
        why: `A value of type ${m[1]} does not have something called "${m[2]}". The name may be misspelled or belong to another type.`,
        fix: 'Check the spelling and capital letters. Print type(value) to see what you really have.',
      },
      sw: {
        title: `${m[1]} haina "${m[2]}"`,
        why: `Thamani ya aina ${m[1]} haina kitu kinachoitwa "${m[2]}". Jina linaweza kuwa limekosewa tahajia au ni la aina nyingine.`,
        fix: 'Angalia tahajia na herufi kubwa na ndogo. Chapisha type(thamani) kuona una nini hasa.',
      },
    }),
  },

  // ---- C++ (runs on the same interpreter as C; the C rules below also apply to it) ---------------
  {
    id: 'cpp-missing-iostream',
    languages: ['cpp'],
    match: /variable (cout|cin|endl|setw|setprecision|fixed) does not exist/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not known yet`,
        why: `${m[1]} lives in a library. Two things must be at the top of the program: the include line, and using namespace std; so you can write ${m[1]} without std:: in front.`,
        fix: `Add #include <iostream> as the first line (and #include <iomanip> for setw, setprecision and fixed), then add using namespace std; below the includes.`,
      },
      sw: {
        title: `"${m[1]}" haijulikani bado`,
        why: `${m[1]} ipo kwenye maktaba. Juu ya programu lazima kuwe na mstari wa include, na using namespace std; ili uandike ${m[1]} bila std:: mbele yake.`,
        fix: `Ongeza #include <iostream> kama mstari wa kwanza (na #include <iomanip> kwa setw, setprecision na fixed), kisha using namespace std; chini ya mistari ya include.`,
      },
    }),
  },

  {
    id: 'cpp-stack',
    languages: ['cpp'],
    match: /Maximum call stack size exceeded/,
    build: () => ({
      en: {
        title: 'A function kept calling itself',
        why: 'A function calls itself (or two functions call each other) and never reaches a point where it stops, so the program ran out of room. The practice runner in this app also allows only a few hundred nested calls.',
        fix: 'Give the function a base case: an if that returns an answer without calling itself, and make sure every call moves closer to it.',
      },
      sw: {
        title: 'Function iliendelea kujiita yenyewe',
        why: 'Function inajiita yenyewe (au function mbili zinaitana) bila kufikia mahali pa kuacha, hivyo programu imeishiwa nafasi. Mfumo wa mazoezi wa app hii pia unaruhusu miito michache tu ya ndani.',
        fix: 'Weka kesi ya msingi: if inayorudisha jibu bila kujiita, na hakikisha kila mwito unakaribia kesi hiyo.',
      },
    }),
  },

  {
    id: 'cpp-index',
    languages: ['cpp'],
    match: /index out of bound (\d+) >= (\d+)|negative index (-?\d+)/,
    build: (m) => {
      const n = m[3] !== undefined
        ? { en: `The index ${m[3]} is negative, and array positions start at 0.`, sw: `Kielezo ${m[3]} ni hasi, na nafasi za safu huanza 0.` }
        : { en: `The program asked for position ${m[1]}, but the array only has ${m[2]} boxes. The last valid index is ${Number(m[2]) - 1}.`, sw: `Programu iliomba nafasi ${m[1]}, lakini safu ina masanduku ${m[2]} tu. Kielezo cha mwisho kinachofaa ni ${Number(m[2]) - 1}.` };
      return {
        en: {
          title: 'Outside the array',
          why: n.en + ' A real C++ program would not stop here: it would quietly read or change some other memory.',
          fix: 'Indexes go from 0 to size - 1. Check your loop limit (use i < size, not i <= size) and any i + 1 or i - 1 you use.',
        },
        sw: {
          title: 'Nje ya safu',
          why: n.sw + ' Programu halisi ya C++ isingesimama hapa: ingesoma au kubadilisha kumbukumbu nyingine kimya kimya.',
          fix: 'Viashiria huanzia 0 hadi ukubwa - 1. Angalia kikomo cha kitanzi (tumia i < ukubwa, si i <= ukubwa) na i + 1 au i - 1 yoyote unayotumia.',
        },
      };
    },
  },
  {
    id: 'cpp-pointer-uninit',
    languages: ['cpp'],
    match: /dereference an unitialized pointer/,
    build: () => ({
      en: {
        title: 'This pointer has no address yet',
        why: 'A pointer was used with * before it was given an address, so it points to nowhere in particular. A real C++ program would write to a random place in memory.',
        fix: 'Give the pointer the address of a real variable first, for example int *p = &x;, and only then use *p.',
      },
      sw: {
        title: 'Kielekezi hiki hakina anwani bado',
        why: 'Kielekezi kilitumiwa na * kabla ya kupewa anwani, hivyo hakielekezi popote maalum. Programu halisi ya C++ ingeandika mahali popote kwenye kumbukumbu.',
        fix: 'Kwanza mpe kielekezi anwani ya kigezo halisi, kwa mfano int *p = &x;, kisha tu tumia *p.',
      },
    }),
  },
  {
    id: 'cpp-pointer-type',
    languages: ['cpp'],
    match: /is not a normal porinter/,
    build: () => ({
      en: {
        title: 'A pointer needs an address, not a number',
        why: 'A pointer variable holds the address of another variable. Here a plain number was given where an address was expected (or an address where a number was expected).',
        fix: 'Use & to get an address (int *p = &x;) and * to reach the value (*p = 10;). When calling a function that takes pointers, pass addresses: exchange(&a, &b).',
      },
      sw: {
        title: 'Kielekezi kinahitaji anwani, si nambari',
        why: 'Kigezo cha kielekezi hushikilia anwani ya kigezo kingine. Hapa nambari ya kawaida ilitolewa pale anwani ilipotarajiwa (au kinyume chake).',
        fix: 'Tumia & kupata anwani (int *p = &x;) na * kufikia thamani (*p = 10;). Unapoita function inayochukua vielekezi, tuma anwani: exchange(&a, &b).',
      },
    }),
  },

  // ---- C ----------------------------------------------------------------------
  {
    id: 'c-missing-include',
    languages: ['c'],
    match: /variable (\w+) does not exist/,
    when: (m) => headerFor(m[1]) !== null,
    build: (m) => {
      const header = headerFor(m[1]);
      return {
        en: {
          title: `Missing ${header} for ${m[1]}`,
          why: `${m[1]}() lives in a library. The compiler only knows it if you include the right header at the top.`,
          fix: `Add ${header} as the first line of your program.`,
        },
        sw: {
          title: `Hakuna ${header} kwa ${m[1]}`,
          why: `${m[1]}() ipo kwenye maktaba. Kikusanyaji kinaijua tu ukijumuisha faili sahihi ya kichwa juu ya programu.`,
          fix: `Ongeza ${header} kama mstari wa kwanza wa programu yako.`,
        },
      };
    },
  },
  {
    id: 'c-undeclared',
    languages: ['c'],
    match: /variable (\w+) does not exist/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not declared`,
        why: `The program uses "${m[1]}" but never created it. It may be misspelled, you may have forgotten to declare it (for example int ${m[1]};), or it is a function that does not exist.`,
        fix: `Check the spelling (C is case-sensitive). Declare the variable before using it: int ${m[1]};`,
      },
      sw: {
        title: `"${m[1]}" haijatangazwa`,
        why: `Programu inatumia "${m[1]}" lakini haikuiunda kamwe. Huenda imekosewa tahajia, umesahau kuitangaza (mfano int ${m[1]};), au ni kitendakazi kisichokuwepo.`,
        fix: `Angalia tahajia (C inatofautisha herufi kubwa na ndogo). Tangaza kigezo kabla ya kukitumia: int ${m[1]};`,
      },
    }),
  },
  {
    id: 'c-parse',
    languages: ['c'],
    match: /Parsing Failure[\s\S]*?line (\d+) \(column (\d+)\)/,
    build: (m) => ({
      en: {
        title: 'The compiler cannot understand the code',
        why: `Something is written incorrectly near line ${m[1]}. Most often a semicolon ";" is missing, a bracket or quote was not closed, or a word is misspelled.`,
        fix: `Check line ${m[1]} and the line before it. Every statement ends with ";". Every "{" needs a "}" and every "(" needs a ")".`,
      },
      sw: {
        title: 'Kikusanyaji hakielewi msimbo',
        why: `Kuna kitu kimeandikwa vibaya karibu na mstari ${m[1]}. Mara nyingi ";" imesahaulika, mabano au nukuu hazijafungwa, au neno limekosewa tahajia.`,
        fix: `Angalia mstari ${m[1]} na mstari uliotangulia. Kila taarifa inaishia na ";". Kila "{" inahitaji "}" na kila "(" inahitaji ")".`,
      },
    }),
  },
  {
    id: 'c-memory',
    languages: ['c'],
    match: /Memory overflow/,
    build: () => ({
      en: {
        title: 'Memory problem',
        why: 'The program tried to read input that was not provided, or used memory it should not (for example outside an array).',
        fix: 'If your program uses scanf, type the numbers in the Input box. If you use arrays, check that every index is between 0 and size - 1.',
      },
      sw: {
        title: 'Tatizo la kumbukumbu',
        why: 'Programu ilijaribu kusoma ingizo ambalo halikutolewa, au ilitumia kumbukumbu isiyostahili (mfano nje ya safu).',
        fix: 'Ukitumia scanf, andika nambari kwenye kisanduku cha Ingizo. Ukitumia safu (arrays), hakikisha kila kielekezi kiko kati ya 0 na ukubwa - 1.',
      },
    }),
  },
  {
    id: 'c-zero-division',
    languages: ['c'],
    match: /overflow of (Infinity|NaN)/,
    build: () => ({
      en: {
        title: 'Division by zero',
        why: 'The program tried to divide a number by 0, which is not possible.',
        fix: 'Check the value you divide by. Use an if statement to avoid dividing when it is 0.',
      },
      sw: {
        title: 'Kugawanya kwa sifuri',
        why: 'Programu ilijaribu kugawanya nambari kwa 0, jambo ambalo haliwezekani.',
        fix: 'Angalia thamani unayogawanyia. Tumia if ili kuepuka kugawanya pale ambapo ni 0.',
      },
    }),
  },
  {
    id: 'c-cast',
    languages: ['c'],
    match: /cast failed from type (.+) to (.+)/,
    build: (m) => ({
      en: {
        title: 'Wrong type of value',
        why: `You tried to put a value of type ${m[1].trim()} where ${m[2].trim()} was expected.`,
        fix: 'Use the right kind of variable: int for whole numbers, float for decimals, char for one character. Text needs a char array.',
      },
      sw: {
        title: 'Aina ya thamani si sahihi',
        why: `Ulijaribu kuweka thamani ya aina ${m[1].trim()} mahali palipotarajiwa ${m[2].trim()}.`,
        fix: 'Tumia aina sahihi ya kigezo: int kwa nambari kamili, float kwa desimali, char kwa herufi moja. Maandishi yanahitaji safu ya char.',
      },
    }),
  },

  // ---- SQL (SQLite) ---------------------------------------------------------------------------
  {
    id: 'sql-no-table',
    languages: ['sql'],
    match: /no such table: (\S+)/,
    build: (m) => ({
      en: {
        title: `There is no table called "${m[1]}"`,
        why: `SQLite looked for a table named ${m[1]} in the practice database and did not find one. The name may be spelled differently, or the table may not exist in this lesson.`,
        fix: `Check the table name in the lesson: capital letters do not matter in SQL, but every other letter does. To see every table, run: SELECT name FROM sqlite_master WHERE type = 'table';`,
      },
      sw: {
        title: `Hakuna jedwali linaloitwa "${m[1]}"`,
        why: `SQLite ilitafuta jedwali liitwalo ${m[1]} kwenye hifadhidata ya mazoezi na haikuliona. Jina linaweza kuwa limeandikwa tofauti, au jedwali hilo halipo kwenye somo hili.`,
        fix: `Angalia jina la jedwali kwenye somo. Kuona majedwali yote, endesha: SELECT name FROM sqlite_master WHERE type = 'table';`,
      },
    }),
  },
  {
    id: 'sql-no-column',
    languages: ['sql'],
    match: /no such column: (\S+)/,
    build: (m) => ({
      en: {
        title: `There is no column called "${m[1]}"`,
        why: `The table has no column with that name. Often the name is misspelled, or text was written without quotes (SQL reads ${m[1]} as a column name, not as text).`,
        fix: `Look at the column names with SELECT * FROM tablename LIMIT 1; If you meant text, put it in single quotes, like 'Kampala'.`,
      },
      sw: {
        title: `Hakuna safu inayoitwa "${m[1]}"`,
        why: `Jedwali halina safu yenye jina hilo. Mara nyingi jina limekosewa tahajia, au maandishi yameandikwa bila nukuu (SQL inasoma ${m[1]} kama jina la safu, si maandishi).`,
        fix: `Angalia majina ya safu kwa SELECT * FROM jina_la_jedwali LIMIT 1; Kama ulimaanisha maandishi, yaweke ndani ya nukuu moja, mfano 'Kampala'.`,
      },
    }),
  },
  {
    id: 'sql-syntax',
    languages: ['sql'],
    match: /near "([^"]*)": syntax error/,
    build: (m) => ({
      en: {
        title: `SQL did not understand the part near "${m[1]}"`,
        why: `Something is wrong at or just before ${m[1]}: a keyword may be misspelled, a comma may be missing or extra, or two parts are in the wrong order (SELECT, then FROM, then WHERE, and so on).`,
        fix: 'Read the line slowly from the left. Check the spelling of every keyword, check the commas between column names (none after the last one), and check that quotes and brackets come in pairs.',
      },
      sw: {
        title: `SQL haikuelewa sehemu karibu na "${m[1]}"`,
        why: `Kuna kosa pale ${m[1]} ilipo au kabla yake: neno kuu linaweza kuwa na tahajia mbaya, koma inaweza kukosekana au kuzidi, au sehemu mbili ziko kwenye mpangilio usio sahihi (SELECT, kisha FROM, kisha WHERE, na kadhalika).`,
        fix: 'Soma mstari polepole kutoka kushoto. Angalia tahajia ya kila neno kuu, koma kati ya majina ya safu (hakuna baada ya ya mwisho), na nukuu na mabano yawe kwa jozi.',
      },
    }),
  },
  {
    id: 'sql-incomplete',
    languages: ['sql'],
    match: /incomplete input|unrecognized token/,
    build: () => ({
      en: {
        title: 'The SQL stops too early, or a quote is not closed',
        why: 'The statement is not finished. Usually a closing quote \' or a closing bracket ) is missing.',
        fix: 'Count your quotes and brackets: every opening one needs a closing one. Text goes in single quotes.',
      },
      sw: {
        title: 'SQL inaishia mapema, au nukuu haijafungwa',
        why: 'Amri haijakamilika. Mara nyingi nukuu ya kufunga \' au mabano ya kufunga ) yamekosekana.',
        fix: 'Hesabu nukuu na mabano yako: kila ya kufungua inahitaji ya kufunga. Maandishi huwekwa ndani ya nukuu moja.',
      },
    }),
  },
  {
    id: 'sql-ambiguous',
    languages: ['sql'],
    match: /ambiguous column name: (\S+)/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" could mean more than one column`,
        why: `Two tables in your query both have a column called ${m[1]}, so SQL cannot guess which one you want.`,
        fix: `Put the table name in front, with a dot: tablename.${m[1]}`,
      },
      sw: {
        title: `"${m[1]}" inaweza kumaanisha safu zaidi ya moja`,
        why: `Majedwali mawili kwenye hoja yako yote yana safu iitwayo ${m[1]}, kwa hiyo SQL haiwezi kubahatisha unataka ipi.`,
        fix: `Weka jina la jedwali mbele, kwa nukta: jina_la_jedwali.${m[1]}`,
      },
    }),
  },
  {
    id: 'sql-unique',
    languages: ['sql'],
    match: /UNIQUE constraint failed: (\S+)/,
    build: (m) => ({
      en: {
        title: 'That value already exists',
        why: `The column ${m[1]} must be different in every row (it is a key or is marked UNIQUE), and you tried to add a value that is already there.`,
        fix: 'Use a new value, or change the existing row with UPDATE instead of adding a second one.',
      },
      sw: {
        title: 'Thamani hiyo tayari ipo',
        why: `Safu ${m[1]} lazima iwe tofauti kwenye kila mstari (ni ufunguo au imewekwa UNIQUE), nawe ulijaribu kuongeza thamani iliyopo tayari.`,
        fix: 'Tumia thamani mpya, au badilisha mstari uliopo kwa UPDATE badala ya kuongeza wa pili.',
      },
    }),
  },
  {
    id: 'sql-not-null',
    languages: ['sql'],
    match: /NOT NULL constraint failed: (\S+)/,
    build: (m) => ({
      en: {
        title: 'A required value is missing',
        why: `The column ${m[1]} may not be empty (NULL), but the row you tried to add has no value for it.`,
        fix: 'Give that column a value in your INSERT, and check that the columns and the values are in the same order.',
      },
      sw: {
        title: 'Thamani inayohitajika haipo',
        why: `Safu ${m[1]} haiwezi kuwa tupu (NULL), lakini mstari uliojaribu kuongeza hauna thamani yake.`,
        fix: 'Toa thamani kwa safu hiyo kwenye INSERT yako, na hakikisha safu na thamani ziko kwa mpangilio uleule.',
      },
    }),
  },
  {
    id: 'sql-column-count',
    languages: ['sql'],
    match: /(\d+) values for (\d+) columns|table (\S+) has (\d+) columns but (\d+) values were supplied/,
    build: () => ({
      en: {
        title: 'The number of values does not match the number of columns',
        why: 'Your INSERT gives a different number of values than the number of columns it fills.',
        fix: 'Count them. If you name the columns, write exactly one value for each, in the same order.',
      },
      sw: {
        title: 'Idadi ya thamani hailingani na idadi ya safu',
        why: 'INSERT yako inatoa idadi tofauti ya thamani kuliko idadi ya safu inazojaza.',
        fix: 'Zihesabu. Ukitaja safu, andika thamani moja kwa kila safu, kwa mpangilio uleule.',
      },
    }),
  },
  {
    id: 'sql-aggregate-where',
    languages: ['sql'],
    match: /misuse of aggregate/,
    build: () => ({
      en: {
        title: 'COUNT, SUM, AVG, MIN and MAX cannot be used in WHERE',
        why: 'WHERE picks rows one by one, before any totals exist. A total can only be tested after the rows are grouped.',
        fix: 'Use HAVING (after GROUP BY) to test a total, for example HAVING COUNT(*) > 2.',
      },
      sw: {
        title: 'COUNT, SUM, AVG, MIN na MAX haviwezi kutumika kwenye WHERE',
        why: 'WHERE huchagua mistari moja moja, kabla ya jumla yoyote kuwepo. Jumla inaweza kupimwa tu baada ya mistari kuwekwa kwenye vikundi.',
        fix: 'Tumia HAVING (baada ya GROUP BY) kupima jumla, mfano HAVING COUNT(*) > 2.',
      },
    }),
  },
  {
    id: 'sql-no-function',
    languages: ['sql'],
    match: /no such function: (\S+)/,
    build: (m) => ({
      en: {
        title: `SQLite has no function called ${m[1]}`,
        why: `The name ${m[1]} is not a function SQLite knows. It may be misspelled, or it may exist in another database system (MySQL or SQL Server) but not in SQLite.`,
        fix: 'Check the spelling. Common SQLite functions: COUNT, SUM, AVG, MIN, MAX, ROUND, LENGTH, UPPER, LOWER, SUBSTR, REPLACE, COALESCE, DATE.',
      },
      sw: {
        title: `SQLite haina kitendakazi kiitwacho ${m[1]}`,
        why: `Jina ${m[1]} si kitendakazi ambacho SQLite inakijua. Linaweza kuwa limekosewa tahajia, au lipo kwenye mfumo mwingine (MySQL au SQL Server) lakini si SQLite.`,
        fix: 'Angalia tahajia. Vitendakazi vya kawaida vya SQLite: COUNT, SUM, AVG, MIN, MAX, ROUND, LENGTH, UPPER, LOWER, SUBSTR, REPLACE, COALESCE, DATE.',
      },
    }),
  },
  {
    id: 'sql-table-exists',
    languages: ['sql'],
    match: /(table|index|view|trigger) (\S+) already exists/,
    build: (m) => ({
      en: {
        title: `The ${m[1]} "${m[2]}" already exists`,
        why: `You tried to create a ${m[1]} with a name that is already taken in this database.`,
        fix: `Choose a different name, or write CREATE ${m[1].toUpperCase()} IF NOT EXISTS ${m[2]} ... so SQL skips it when it is already there.`,
      },
      sw: {
        title: `"${m[2]}" (${m[1]}) tayari ipo`,
        why: `Ulijaribu kuunda ${m[1]} kwa jina ambalo tayari limetumika kwenye hifadhidata hii.`,
        fix: `Chagua jina tofauti, au andika CREATE ${m[1].toUpperCase()} IF NOT EXISTS ${m[2]} ... ili SQL iruke kama tayari ipo.`,
      },
    }),
  },
  {
    id: 'sql-check',
    languages: ['sql'],
    match: /CHECK constraint failed: (.+)/,
    build: (m) => ({
      en: {
        title: 'The value breaks a rule of the table',
        why: `This table has a rule (CHECK ${m[1].trim()}) and the value you tried to save does not obey it, so SQLite refused the whole change.`,
        fix: 'Use a value that follows the rule, or change the rule if the rule itself is wrong.',
      },
      sw: {
        title: 'Thamani inavunja sheria ya jedwali',
        why: `Jedwali hili lina sheria (CHECK ${m[1].trim()}) na thamani uliyojaribu kuhifadhi haiitii, kwa hiyo SQLite ilikataa mabadiliko yote.`,
        fix: 'Tumia thamani inayofuata sheria, au badilisha sheria kama sheria yenyewe ndiyo yenye kosa.',
      },
    }),
  },
  {
    id: 'sql-no-column-named',
    languages: ['sql'],
    match: /table (\S+) has no column named (\S+)/,
    build: (m) => ({
      en: {
        title: `The table ${m[1]} has no column called "${m[2]}"`,
        why: `Your INSERT names a column (${m[2]}) that ${m[1]} does not have. The name may be misspelled.`,
        fix: `See the real column names with PRAGMA table_info(${m[1]}); and use exactly those.`,
      },
      sw: {
        title: `Jedwali ${m[1]} halina safu inayoitwa "${m[2]}"`,
        why: `INSERT yako inataja safu (${m[2]}) ambayo ${m[1]} haina. Jina linaweza kuwa limekosewa tahajia.`,
        fix: `Angalia majina halisi ya safu kwa PRAGMA table_info(${m[1]}); kisha utumie hayohayo.`,
      },
    }),
  },
  {
    id: 'sql-add-notnull',
    languages: ['sql'],
    match: /Cannot add a NOT NULL column with default value NULL/,
    build: () => ({
      en: {
        title: 'A new required column needs a starting value',
        why: 'The table already has rows. A new NOT NULL column would be empty in all of them, which breaks its own rule.',
        fix: "Give the column a default, for example: ALTER TABLE t ADD COLUMN level INTEGER NOT NULL DEFAULT 1;",
      },
      sw: {
        title: 'Safu mpya inayohitajika inahitaji thamani ya kuanzia',
        why: 'Jedwali tayari lina mistari. Safu mpya ya NOT NULL ingekuwa tupu kwenye yote, jambo linalovunja sheria yake yenyewe.',
        fix: 'Ipe safu thamani ya msingi, kwa mfano: ALTER TABLE t ADD COLUMN level INTEGER NOT NULL DEFAULT 1;',
      },
    }),
  },
  {
    id: 'sql-foreign-key',
    languages: ['sql'],
    match: /FOREIGN KEY constraint failed/,
    build: () => ({
      en: {
        title: 'That row points at something that does not exist, or is still needed',
        why: 'A foreign key links this row to a row in another table. Either the row you are adding points at a parent that is not there (for example a customer number nobody has), or you are deleting a parent that other rows still point at.',
        fix: 'Check that the number you point at exists in the other table. To delete a parent, first delete or change the rows that point at it.',
      },
      sw: {
        title: 'Mstari huo unaelekeza kwenye kitu ambacho hakipo, au bado kinahitajika',
        why: 'Ufunguo wa kigeni unaunganisha mstari huu na mstari kwenye jedwali lingine. Ama mstari unaoongeza unaelekeza kwa mzazi asiyekuwepo (kwa mfano namba ya mteja ambayo haipo), au unafuta mzazi ambaye mistari mingine bado inamtegemea.',
        fix: 'Hakikisha namba unayoelekeza ipo kwenye jedwali lingine. Ili kufuta mzazi, kwanza futa au badilisha mistari inayomwelekea.',
      },
    }),
  },
  {
    id: 'sql-subquery-columns',
    languages: ['sql'],
    match: /sub-select returns (\d+) columns/,
    build: (m) => ({
      en: {
        title: 'The inner query must return exactly one column here',
        why: `The query in brackets returns ${m[1]} columns, but IN (...) or a comparison can only use one column of values.`,
        fix: 'Select just the one column you need in the brackets, for example IN (SELECT customer_id FROM orders).',
      },
      sw: {
        title: 'Hoja ya ndani lazima irudishe safu moja tu hapa',
        why: `Hoja ndani ya mabano inarudisha safu ${m[1]}, lakini IN (...) au ulinganisho unaweza kutumia safu moja ya thamani tu.`,
        fix: 'Chagua safu moja unayohitaji ndani ya mabano, kwa mfano IN (SELECT customer_id FROM orders).',
      },
    }),
  },

  // ---- PHP (8.3) -------------------------------------------------------------------------------
  // Only fatal and parse errors reach these rules. Warnings and notices stay in the program output, as in real PHP.
  {
    id: 'php-missing-semicolon',
    languages: ['php'],
    match: /Parse error: syntax error, unexpected (?:token|identifier|variable) "?([^"\n]+?)"?,? expecting (?:"[,.]" or )?";"/,
    build: (m) => ({
      en: {
        title: 'A semicolon ; is missing',
        why: `PHP reached ${m[1]} and found that the line before it was not finished. Every PHP statement ends with a semicolon.`,
        fix: 'Look at the end of the line just above the line number shown. Add ; there.',
      },
      sw: {
        title: 'Alama ya nukta-mkato ; haipo',
        why: `PHP ilifika ${m[1]} na kuona kuwa mstari uliotangulia haukukamilika. Kila amri ya PHP inaisha kwa nukta-mkato.`,
        fix: 'Angalia mwisho wa mstari juu ya nambari ya mstari iliyoonyeshwa. Weka ; hapo.',
      },
    }),
  },
  {
    id: 'php-parse',
    languages: ['php'],
    match: /Parse error: (?:syntax error, )?(unexpected [^\n]*?) in /,
    build: (m) => ({
      en: {
        title: 'PHP could not read this line',
        why: `PHP stopped at something it did not expect (${m[1]}). Usually a bracket, quote or semicolon is missing or in the wrong place, on this line or the line above.`,
        fix: 'Check that every ( has a ), every { has a }, and every opening quote has a closing quote. Then check the line above for a missing ;.',
      },
      sw: {
        title: 'PHP haikuweza kusoma mstari huu',
        why: `PHP ilisimama mahali ambapo haikutarajia kitu (${m[1]}). Mara nyingi mabano, nukuu au nukta-mkato imekosekana au imewekwa vibaya, kwenye mstari huu au ule wa juu.`,
        fix: 'Hakikisha kila ( ina ), kila { ina }, na kila nukuu ya kufungua ina ya kufunga. Kisha angalia mstari wa juu kama ; imekosekana.',
      },
    }),
  },
  {
    id: 'php-undefined-function',
    languages: ['php'],
    match: /Call to undefined function ([A-Za-z0-9_\\]+)\(\)/,
    build: (m) => ({
      en: {
        title: `There is no function called ${m[1]}()`,
        why: 'The name may be misspelled, or the function has not been written yet. PHP function names must be typed exactly (capital letters do not matter for functions, but spelling does).',
        fix: `Check the spelling of ${m[1]}. If it is your own function, define it with "function ${m[1]}() { ... }".`,
      },
      sw: {
        title: `Hakuna kazi (function) inayoitwa ${m[1]}()`,
        why: 'Jina linaweza kuwa limekosewa tahajia, au kazi hiyo haijaandikwa bado.',
        fix: `Angalia tahajia ya ${m[1]}. Kama ni kazi yako mwenyewe, ifafanue kwa "function ${m[1]}() { ... }".`,
      },
    }),
  },
  {
    id: 'php-undefined-method',
    languages: ['php'],
    match: /Call to (?:undefined|private|protected) method ([A-Za-z0-9_\\]+)::([A-Za-z0-9_]+)\(\)/,
    build: (m) => ({
      en: {
        title: `${m[1]} has no method you can call named ${m[2]}()`,
        why: `Either ${m[2]} is not written inside class ${m[1]}, its name is misspelled, or it is private or protected, so code outside the class may not call it.`,
        fix: `Check the spelling inside class ${m[1]}. If it is private, make it public or call it from inside the class.`,
      },
      sw: {
        title: `${m[1]} haina njia (method) inayoitwa ${m[2]}() unayoweza kuiita`,
        why: `Huenda ${m[2]} haijaandikwa ndani ya class ${m[1]}, jina limekosewa, au ni private/protected kwa hiyo nje ya class haiwezi kuitwa.`,
        fix: `Angalia tahajia ndani ya class ${m[1]}. Kama ni private, ifanye public au iite kutoka ndani ya class.`,
      },
    }),
  },
  {
    id: 'php-null-member',
    languages: ['php'],
    match: /Call to a member function ([A-Za-z0-9_]+)\(\) on (null|string|int|array|bool|float)/,
    build: (m) => ({
      en: {
        title: `You called ${m[1]}() on ${m[2]}, not on an object`,
        why: `The variable before the arrow -> holds ${m[2]}, so it has no methods. Often an object was never created with "new", or a function that should return an object returned nothing.`,
        fix: 'Print the variable with var_dump($variable) just before this line to see what it really holds.',
      },
      sw: {
        title: `Uliita ${m[1]}() kwenye ${m[2]}, si kitu (object)`,
        why: `Kigezo kabla ya mshale -> kina ${m[2]}, kwa hiyo hakina methods. Mara nyingi object haikuundwa kwa "new", au kazi iliyotakiwa kurudisha object haikurudisha kitu.`,
        fix: 'Chapisha kigezo kwa var_dump($kigezo) kabla ya mstari huu uone kina nini hasa.',
      },
    }),
  },
  {
    id: 'php-type-error',
    languages: ['php'],
    match: /TypeError: ([A-Za-z0-9_\\:]+)\(\): Argument #(\d+) \(\$(\w+)\) must be of type ([^,\n]+), ([^\s]+) given/,
    build: (m) => ({
      en: {
        title: `${m[1]}() wanted ${m[4]} but got ${m[5]}`,
        why: `Argument number ${m[2]} (${'$'}${m[3]}) has to be ${m[4]}. The value you passed is ${m[5]}. PHP checks types when a function declares them.`,
        fix: `Pass a ${m[4]} value. If the value comes from text, convert it first, for example (int)"50" or (float)"2.5".`,
      },
      sw: {
        title: `${m[1]}() ilitaka ${m[4]} lakini ikapata ${m[5]}`,
        why: `Kigezo namba ${m[2]} (${'$'}${m[3]}) lazima kiwe ${m[4]}. Thamani uliyotoa ni ${m[5]}.`,
        fix: `Toa thamani ya aina ${m[4]}. Kama inatoka kwenye maandishi, ibadilishe kwanza, mfano (int)"50".`,
      },
    }),
  },
  {
    id: 'php-arg-count',
    languages: ['php'],
    match: /ArgumentCountError: Too few arguments to function ([A-Za-z0-9_\\:]+)\(\), (\d+) passed .*? and (?:exactly|at least) (\d+) expected/,
    build: (m) => ({
      en: {
        title: `${m[1]}() needs ${m[3]} value(s) but got ${m[2]}`,
        why: 'When you call a function you must give one value for each parameter that has no default value.',
        fix: `Call ${m[1]}() with ${m[3]} value(s) inside the brackets, or give the missing parameters default values.`,
      },
      sw: {
        title: `${m[1]}() inahitaji thamani ${m[3]} lakini ilipewa ${m[2]}`,
        why: 'Unapoita kazi lazima utoe thamani moja kwa kila kigezo ambacho hakina thamani ya msingi.',
        fix: `Ita ${m[1]}() ukiwa na thamani ${m[3]} ndani ya mabano, au weka thamani za msingi kwa vigezo vinavyokosekana.`,
      },
    }),
  },
  {
    id: 'php-division-zero',
    languages: ['php'],
    match: /DivisionByZeroError: (Division|Modulo) by zero/,
    build: () => ({
      en: {
        title: 'You divided by zero',
        why: 'Dividing by 0 has no answer, so PHP stops. This often happens when the number you divide by comes from input or from a count that turned out to be 0.',
        fix: 'Check the value before dividing: if ($count > 0) { ... }.',
      },
      sw: {
        title: 'Umegawanya kwa sifuri',
        why: 'Kugawanya kwa 0 hakuna jibu, kwa hiyo PHP inasimama. Hii hutokea mara nyingi namba unayogawanyia inatoka kwenye pembejeo au hesabu iliyokuwa 0.',
        fix: 'Angalia thamani kabla ya kugawanya: if ($idadi > 0) { ... }.',
      },
    }),
  },
  {
    id: 'php-undefined-constant',
    languages: ['php'],
    match: /Undefined constant "([^"]+)"/,
    build: (m) => ({
      en: {
        title: `PHP does not know "${m[1]}"`,
        why: `PHP read ${m[1]} as a constant (a fixed name), not as text or as a variable. Text needs quotes, and variables start with $.`,
        fix: `If you meant text, write "${m[1]}" with quotes. If you meant a variable, write ${'$'}${m[1]}.`,
      },
      sw: {
        title: `PHP haijui "${m[1]}"`,
        why: `PHP ilisoma ${m[1]} kama constant (jina lisilobadilika), si maandishi wala kigezo. Maandishi yanahitaji nukuu, na vigezo vinaanza na $.`,
        fix: `Kama ulimaanisha maandishi, andika "${m[1]}" kwa nukuu. Kama ulimaanisha kigezo, andika ${'$'}${m[1]}.`,
      },
    }),
  },
  {
    id: 'php-class-not-found',
    languages: ['php'],
    match: /Class "([^"]+)" not found/,
    build: (m) => ({
      en: {
        title: `There is no class called ${m[1]}`,
        why: 'The class name may be misspelled, or the class is written further down in a file that PHP has not loaded, or it was never written.',
        fix: `Check the spelling of ${m[1]} (it must match exactly) and make sure "class ${m[1]} { ... }" exists in your program.`,
      },
      sw: {
        title: `Hakuna class inayoitwa ${m[1]}`,
        why: 'Jina la class linaweza kuwa limekosewa tahajia, au class haijaandikwa kabisa.',
        fix: `Angalia tahajia ya ${m[1]} (lazima ilingane kabisa) na hakikisha "class ${m[1]} { ... }" ipo kwenye programu yako.`,
      },
    }),
  },
  {
    id: 'php-unsupported-operand',
    languages: ['php'],
    match: /Unsupported operand types: ([a-z]+) ([-+*\/%.]+|\*\*) ([a-z]+)/,
    build: (m) => ({
      en: {
        title: `You cannot use ${m[2]} between ${m[1]} and ${m[3]}`,
        why: `PHP can do arithmetic on numbers, but one side here is not a number (${m[1]} ${m[2]} ${m[3]}). An array or null cannot be added or multiplied like a number.`,
        fix: 'Check both sides of the operator. To add up the numbers inside an array, use array_sum($array).',
      },
      sw: {
        title: `Huwezi kutumia ${m[2]} kati ya ${m[1]} na ${m[3]}`,
        why: `PHP inaweza kufanya hesabu kwa namba, lakini upande mmoja si namba (${m[1]} ${m[2]} ${m[3]}).`,
        fix: 'Angalia pande zote mbili za alama. Kujumlisha namba ndani ya array tumia array_sum($array).',
      },
    }),
  },
  {
    id: 'php-redeclare',
    languages: ['php'],
    match: /Cannot redeclare ([A-Za-z0-9_\\]+)\(\)/,
    build: (m) => ({
      en: {
        title: `${m[1]}() is defined twice`,
        why: 'Two functions in the same program have the same name. PHP does not allow that.',
        fix: `Rename one of them, or delete the duplicate definition of ${m[1]}().`,
      },
      sw: {
        title: `${m[1]}() imefafanuliwa mara mbili`,
        why: 'Kazi mbili kwenye programu moja zina jina lilelile. PHP hairuhusu.',
        fix: `Badilisha jina la moja, au futa ufafanuzi unaojirudia wa ${m[1]}().`,
      },
    }),
  },
  {
    id: 'php-memory',
    languages: ['php'],
    match: /Allowed memory size of \d+ bytes exhausted/,
    build: () => ({
      en: {
        title: 'The program used too much memory',
        why: 'Something keeps growing without stopping, for example a loop that keeps adding to an array forever, or a function that calls itself with no end.',
        fix: 'Check that your loop has a way to finish, and that a recursive function has a stopping case.',
      },
      sw: {
        title: 'Programu imetumia kumbukumbu nyingi mno',
        why: 'Kuna kitu kinachoendelea kukua bila kusimama, mfano mzunguko unaoongeza kwenye array milele, au kazi inayojiita bila mwisho.',
        fix: 'Hakikisha mzunguko wako una namna ya kuisha, na kazi inayojiita ina sharti la kusimama.',
      },
    }),
  },
  {
    id: 'php-uncaught',
    languages: ['php'],
    match: /Fatal error: Uncaught ([A-Za-z\\]*(?:Exception|Error)): ([^\n]*)/,
    build: (m) => ({
      en: {
        title: `An ${m[1]} stopped the program`,
        why: `Something went wrong (${m[2]}) and nothing in the program caught it, so PHP stopped.`,
        fix: 'Read the message after the word "Error" or "Exception": it says what happened. To handle it yourself, put the risky code in try { ... } catch (Exception $e) { ... }.',
      },
      sw: {
        title: `${m[1]} imesimamisha programu`,
        why: `Kitu kimekwenda vibaya (${m[2]}) na hakuna sehemu ya programu iliyokishika, kwa hiyo PHP imesimama.`,
        fix: 'Soma ujumbe baada ya neno "Error" au "Exception": unasema kilichotokea. Kukishughulikia mwenyewe, weka msimbo hatari ndani ya try { ... } catch (Exception $e) { ... }.',
      },
    }),
  },
  {
    id: 'sql-view-modify',
    languages: ['sql'],
    match: /cannot modify (\S+) because it is a view/,
    build: (m) => ({
      en: {
        title: `${m[1]} is a view, so you cannot change rows in it`,
        why: `A view is a saved question, not a table that holds rows. There is nothing in ${m[1]} to add to, change or delete.`,
        fix: 'Run your INSERT, UPDATE or DELETE on the real table that the view reads from.',
      },
      sw: {
        title: `${m[1]} ni mwonekano (view), kwa hiyo huwezi kubadilisha mistari ndani yake`,
        why: `Mwonekano ni swali lililohifadhiwa, si jedwali lenye mistari. Hakuna kitu ndani ya ${m[1]} cha kuongeza, kubadilisha au kufuta.`,
        fix: 'Endesha INSERT, UPDATE au DELETE yako kwenye jedwali halisi ambalo mwonekano unalisoma.',
      },
    }),
  },
  {
    id: 'sql-transaction',
    languages: ['sql'],
    match: /cannot (commit|rollback) - no transaction is active|cannot start a transaction within a transaction/,
    build: (m) => ({
      en: {
        title: m[1] ? `There is nothing to ${m[1]}: no transaction was started` : 'A transaction is already open',
        why: m[1] ? `${m[1].toUpperCase()} ends a transaction, but BEGIN was never run (or the transaction already ended).` : 'You ran BEGIN while another transaction was still open. A transaction cannot start inside another.',
        fix: m[1] ? 'Start with BEGIN; do the changes; then finish with COMMIT; (keep them) or ROLLBACK; (undo them).' : 'Finish the open one first with COMMIT; or ROLLBACK;, and only then BEGIN a new one.',
      },
      sw: {
        title: m[1] ? `Hakuna cha ${m[1] === 'commit' ? 'kuthibitisha' : 'kurudisha nyuma'}: hakuna muamala ulioanzishwa` : 'Muamala tayari umefunguliwa',
        why: m[1] ? `${m[1].toUpperCase()} humaliza muamala, lakini BEGIN haikuendeshwa (au muamala ulishaisha).` : 'Uliendesha BEGIN wakati muamala mwingine bado uko wazi. Muamala hauwezi kuanza ndani ya mwingine.',
        fix: m[1] ? 'Anza na BEGIN; fanya mabadiliko; kisha malizia na COMMIT; (yabaki) au ROLLBACK; (yaondolewe).' : 'Maliza ule ulio wazi kwanza kwa COMMIT; au ROLLBACK;, kisha ndipo uanze BEGIN mpya.',
      },
    }),
  },
  {
    id: 'sql-window-misuse',
    languages: ['sql'],
    match: /misuse of (aliased )?window function/,
    build: () => ({
      en: {
        title: 'A window function cannot be used in WHERE',
        why: 'WHERE runs before window functions such as ROW_NUMBER, RANK or SUM(...) OVER are worked out, so it cannot see their results.',
        fix: 'Work the window function out inside a WITH (or a subquery), then filter on its result in the outer query.',
      },
      sw: {
        title: 'Kitendakazi cha dirisha hakiwezi kutumika kwenye WHERE',
        why: 'WHERE huendeshwa kabla vitendakazi vya dirisha kama ROW_NUMBER, RANK au SUM(...) OVER havijahesabiwa, kwa hiyo haviwezi kuona matokeo yake.',
        fix: 'Hesabu kitendakazi cha dirisha ndani ya WITH (au hoja ya ndani), kisha chuja kwa matokeo yake kwenye hoja ya nje.',
      },
    }),
  },
  // ---- Java (javac messages and exception reports; see docs/JAVA-TRACK.md) -----------------------------
  {
    id: 'java-expected',
    languages: ['java'],
    match: /error: '([;)\]({}])' expected/,
    build: (m) => ({
      en: {
        title: `A "${m[1]}" is missing`,
        why: `Java expected a "${m[1]}" at that place. The most common cause is a forgotten ";" at the end of a statement, or a bracket that was opened and never closed.`,
        fix: `Look at the end of the line that is shown, and at the line before it. Add the missing "${m[1]}". Every ( needs a ), every { needs a }, and most statements end with ;`,
      },
      sw: {
        title: `Alama "${m[1]}" imekosekana`,
        why: `Java ilitarajia alama "${m[1]}" mahali hapo. Sababu ya kawaida ni kusahau ";" mwishoni mwa amri, au mabano yaliyofunguliwa lakini hayakufungwa.`,
        fix: `Angalia mwisho wa mstari ulioonyeshwa, na mstari uliotangulia. Ongeza "${m[1]}" inayokosekana. Kila ( inahitaji ), kila { inahitaji }, na amri nyingi huishia na ;`,
      },
    }),
  },
  {
    id: 'java-quote',
    languages: ['java'],
    match: /error: unclosed (string|character) literal/,
    build: (m) => ({
      en: {
        title: m[1] === 'string' ? 'A closing double quote is missing' : 'Single quotes hold only one character',
        why: m[1] === 'string'
          ? 'Text in Java starts with a double quote " and must end with another double quote " on the same line. Java did not find the closing one, so it kept reading to the end of the line.'
          : 'Java saw a single quote \' and expected exactly one character and then another single quote. Text of several characters belongs in double quotes: "like this".',
        fix: m[1] === 'string'
          ? 'Add the missing " at the end of the text, before the ) and the ;'
          : 'Use double quotes for text: System.out.println("Karibu"); Single quotes are only for one character, such as \'A\'.',
      },
      sw: {
        title: m[1] === 'string' ? 'Nukuu ya kufunga inakosekana' : 'Nukuu moja hushika herufi moja tu',
        why: m[1] === 'string'
          ? 'Maandishi katika Java huanza na nukuu mbili " na lazima yaishie na nukuu mbili " kwenye mstari huo huo. Java haikupata ya kufunga, kwa hiyo iliendelea kusoma hadi mwisho wa mstari.'
          : 'Java iliona nukuu moja \' na ilitarajia herufi moja kisha nukuu moja nyingine. Maandishi ya herufi nyingi yanawekwa ndani ya nukuu mbili: "hivi".',
        fix: m[1] === 'string'
          ? 'Ongeza " inayokosekana mwishoni mwa maandishi, kabla ya ) na ;'
          : 'Tumia nukuu mbili kwa maandishi: System.out.println("Karibu"); Nukuu moja ni kwa herufi moja tu, mfano \'A\'.',
      },
    }),
  },
  {
    id: 'java-syntax',
    languages: ['java'],
    match: /error: (reached end of file while parsing|illegal start of (?:expression|type)|not a statement|unclosed (?:string|character) literal|class, interface, enum, or record expected|<identifier> expected|illegal character|'else' without 'if'|orphaned \w+)/,
    build: (m) => ({
      en: {
        title: 'Java cannot read this line',
        why: `Java stopped because the code is not written in a form it understands ("${m[1]}"). Usually a bracket or quote is missing or extra, a word is misspelled, or a statement is outside a method.`,
        fix: 'Check the shown line and the lines above it: do all { } ( ) and " " come in pairs? Is every statement inside a method inside a class? Fix the first problem and run again; later errors often disappear.',
      },
      sw: {
        title: 'Java haiwezi kusoma mstari huu',
        why: `Java imesimama kwa sababu msimbo haujaandikwa kwa umbo inalolielewa ("${m[1]}"). Mara nyingi bano au nukuu imekosekana au imezidi, neno limekosewa tahajia, au amri iko nje ya njia (method).`,
        fix: 'Angalia mstari ulioonyeshwa na mistari iliyo juu yake: je, { } ( ) na " " viko kwa jozi? Je, kila amri iko ndani ya method ndani ya class? Rekebisha tatizo la kwanza kisha endesha tena; makosa mengine mara nyingi hupotea.',
      },
    }),
  },
  {
    id: 'java-symbol',
    languages: ['java'],
    match: /cannot find symbol\s+symbol:\s+(variable|method|class)\s+([\w$]+)/,
    build: (m) => ({
      en: {
        title: `Java does not know "${m[2]}"`,
        why: `The program uses ${m[1] === 'class' ? 'a class' : `a ${m[1]}`} called "${m[2]}", but Java cannot find it. It may be misspelled (small and capital letters matter: String, not string), never created, created in a different place where it cannot be seen, or it needs an import line at the top.`,
        fix: `Check the spelling of "${m[2]}". ${m[1] === 'variable' ? `Declare it before you use it, for example: int ${m[2]} = 0;` : m[1] === 'method' ? 'Make sure the method exists, has that exact name, and takes the arguments you give it.' : 'Check the class name, and add the import it needs, for example: import java.util.Scanner;'}`,
      },
      sw: {
        title: `Java haijui "${m[2]}"`,
        why: `Programu inatumia ${m[1] === 'class' ? 'class' : m[1] === 'method' ? 'method' : 'kigezo'} iitwayo "${m[2]}", lakini Java haiipati. Huenda imekosewa tahajia (herufi kubwa na ndogo zinajali: String, si string), haikuundwa kamwe, iko mahali isipoweza kuonekana, au inahitaji mstari wa import juu.`,
        fix: `Angalia tahajia ya "${m[2]}". ${m[1] === 'variable' ? `Itangaze kabla ya kuitumia, mfano: int ${m[2]} = 0;` : m[1] === 'method' ? 'Hakikisha method ipo, ina jina hilo hasa, na inapokea vigezo unavyoipa.' : 'Angalia jina la class, na ongeza import inayohitajika, mfano: import java.util.Scanner;'}`,
      },
    }),
  },
  {
    id: 'java-package',
    languages: ['java'],
    match: /error: package ([\w.$]+) does not exist/,
    build: (m) => ({
      en: {
        title: `Java does not know "${m[1]}"`,
        why: `Java looks for a package called "${m[1]}" and cannot find it. The usual cause is a small letter where a capital is needed: the class is called System (capital S), String (capital S), Math (capital M). Another cause is a missing import line at the top.`,
        fix: `Check the capital letters (system.out.println should be System.out.println). If the name is right, add the import line it needs, for example: import java.util.Scanner;`,
      },
      sw: {
        title: `Java haijui "${m[1]}"`,
        why: `Java inatafuta package iitwayo "${m[1]}" na haiipati. Sababu ya kawaida ni herufi ndogo mahali panapohitaji herufi kubwa: class inaitwa System (S kubwa), String (S kubwa), Math (M kubwa). Sababu nyingine ni mstari wa import uliokosekana juu.`,
        fix: `Angalia herufi kubwa (system.out.println inapaswa kuwa System.out.println). Kama jina ni sahihi, ongeza mstari wa import unaohitajika, mfano: import java.util.Scanner;`,
      },
    }),
  },
  {
    id: 'java-args',
    languages: ['java'],
    match: /error: (constructor|method) ([\w$]+) in (?:class|enum|record|interface) ([\w$]+) cannot be applied to given types/,
    build: (m) => ({
      en: {
        title: `Wrong arguments for ${m[1] === 'constructor' ? 'the constructor' : 'the method'} ${m[2]}`,
        why: `The ${m[1]} ${m[2]} of ${m[3]} needs different arguments from the ones you gave: too many, too few, the wrong types, or the right values in the wrong order.`,
        fix: `Look at how ${m[2]} is defined and give exactly the parameters it lists, in the same order and of the same types. If you want to call it with no arguments (or fewer), the class needs another ${m[1]} for that.`,
      },
      sw: {
        title: `Vigezo si sahihi kwa ${m[1] === 'constructor' ? 'constructor' : 'method'} ${m[2]}`,
        why: `${m[1] === 'constructor' ? 'Constructor' : 'Method'} ${m[2]} ya ${m[3]} inahitaji vigezo tofauti na ulivyovitoa: vingi mno, vichache mno, aina isiyo sahihi, au thamani sahihi kwa mpangilio usio sahihi.`,
        fix: `Angalia ${m[2]} ilivyofafanuliwa na toa vigezo vile vile inavyoorodhesha, kwa mpangilio ule ule na aina zile zile. Kama unataka kuiita bila vigezo (au vichache), class inahitaji ${m[1]} nyingine kwa hilo.`,
      },
    }),
  },
  {
    id: 'java-private',
    languages: ['java'],
    match: /error: ([\w$]+)(?:\([^)]*\))? has private access in ([\w$]+)/,
    build: (m) => ({
      en: {
        title: `${m[1]} is private to ${m[2]}`,
        why: `${m[1]} was declared private, which means only code inside the class ${m[2]} may use it. This line is outside the class, so Java refuses. That is the whole point of private: the class decides how its data is used.`,
        fix: `Use a public method of ${m[2]} instead, such as a getter (getBalance()) to read it or a method such as deposit(...) to change it. If outside code really should reach it, the class can make it public, but think first.`,
      },
      sw: {
        title: `${m[1]} ni ya faragha ndani ya ${m[2]}`,
        why: `${m[1]} ilitangazwa private, yaani ni msimbo ulio ndani ya class ${m[2]} tu unaoweza kuitumia. Mstari huu uko nje ya class, kwa hiyo Java inakataa. Hiyo ndiyo maana ya private: class yenyewe huamua data yake itumikeje.`,
        fix: `Tumia method ya public ya ${m[2]} badala yake, kama getter (getBalance()) kusoma au method kama deposit(...) kubadilisha. Kama msimbo wa nje unapaswa kuifikia kweli, class inaweza kuifanya public, lakini fikiria kwanza.`,
      },
    }),
  },
  {
    id: 'java-lossy',
    languages: ['java'],
    match: /incompatible types: possible lossy conversion from (\w+) to (\w+)/,
    build: (m) => ({
      en: {
        title: `A ${m[1]} will not fit in a ${m[2]}`,
        why: `You are putting a ${m[1]} value into a ${m[2]} variable. That would lose information (for example the part after the decimal point), so Java refuses to do it silently.`,
        fix: `Use a ${m[1]} variable instead, or say clearly that you accept the loss with a cast: (${m[2]}) value`,
      },
      sw: {
        title: `${m[1]} haitoshi kwenye ${m[2]}`,
        why: `Unaweka thamani ya ${m[1]} kwenye kigezo cha ${m[2]}. Hilo lingepoteza taarifa (mfano sehemu baada ya nukta ya desimali), kwa hiyo Java inakataa kufanya hivyo kimya kimya.`,
        fix: `Tumia kigezo cha ${m[1]} badala yake, au sema wazi kuwa unakubali kupoteza kwa cast: (${m[2]}) thamani`,
      },
    }),
  },
  {
    id: 'java-types',
    languages: ['java'],
    match: /incompatible types: (.+?) cannot be converted to (.+)/,
    build: (m) => ({
      en: {
        title: 'Wrong type of value',
        why: `A value of type ${m[1].trim()} was used where Java needs ${m[2].trim()}. Java checks types strictly: whole numbers are int, decimals are double, text is String (in double quotes), one character is char (in single quotes).`,
        fix: `Use a value of type ${m[2].trim()}. To turn text into a number use Integer.parseInt("42") or Double.parseDouble("2.5"); to turn a number into text use String.valueOf(42).`,
      },
      sw: {
        title: 'Aina ya thamani si sahihi',
        why: `Thamani ya aina ${m[1].trim()} imetumika mahali Java inapohitaji ${m[2].trim()}. Java hukagua aina kwa ukali: nambari kamili ni int, desimali ni double, maandishi ni String (ndani ya nukuu mbili), herufi moja ni char (ndani ya nukuu moja).`,
        fix: `Tumia thamani ya aina ${m[2].trim()}. Kubadilisha maandishi kuwa nambari tumia Integer.parseInt("42") au Double.parseDouble("2.5"); kubadilisha nambari kuwa maandishi tumia String.valueOf(42).`,
      },
    }),
  },
  {
    id: 'java-return',
    languages: ['java'],
    match: /error: missing return statement/,
    build: () => ({
      en: {
        title: 'This method must return a value',
        why: 'The method promises to give back a value, but there is a way through it (an if without an else, or a loop) that reaches the end without a return.',
        fix: 'Make sure every path ends with return. Often it means adding a final return after the if or the loop.',
      },
      sw: {
        title: 'Method hii lazima irudishe thamani',
        why: 'Method inaahidi kurudisha thamani, lakini kuna njia ndani yake (if bila else, au kitanzi) inayofika mwisho bila return.',
        fix: 'Hakikisha kila njia inaishia na return. Mara nyingi inamaanisha kuongeza return ya mwisho baada ya if au kitanzi.',
      },
    }),
  },
  {
    id: 'java-uninit',
    languages: ['java'],
    match: /error: variable ([\w$]+) might not have been initialized/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" has no value yet`,
        why: `The variable "${m[1]}" is read before anything is stored in it, or it only gets a value on some paths (for example inside an if). Java does not give local variables a starting value.`,
        fix: `Give it a value when you declare it, for example: int ${m[1]} = 0;`,
      },
      sw: {
        title: `"${m[1]}" haina thamani bado`,
        why: `Kigezo "${m[1]}" kinasomwa kabla ya kuwekewa chochote, au kinapata thamani kwenye baadhi ya njia tu (mfano ndani ya if). Java haipi vigezo vya ndani thamani ya kuanzia.`,
        fix: `Kipe thamani unapokitangaza, mfano: int ${m[1]} = 0;`,
      },
    }),
  },
  {
    id: 'java-duplicate',
    languages: ['java'],
    match: /error: variable ([\w$]+) is already defined in/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is already used`,
        why: `A variable called "${m[1]}" was already created in this method, and you declared it again.`,
        fix: `Pick a different name, or drop the type to reuse the old variable: write ${m[1]} = 5; instead of int ${m[1]} = 5;`,
      },
      sw: {
        title: `"${m[1]}" imeshatumika`,
        why: `Kigezo kiitwacho "${m[1]}" tayari kiliundwa kwenye method hii, na umekitangaza tena.`,
        fix: `Chagua jina tofauti, au acha aina ili utumie kigezo cha zamani: andika ${m[1]} = 5; badala ya int ${m[1]} = 5;`,
      },
    }),
  },
  {
    id: 'java-checked',
    languages: ['java'],
    match: /error: unreported exception ([\w.$]+); must be caught or declared to be thrown/,
    build: (m) => ({
      en: {
        title: `${m[1].split('.').pop()} must be handled`,
        why: `This code can throw a "checked" exception (${m[1].split('.').pop()}). Java makes you decide what happens if it does: handle it, or pass the problem on.`,
        fix: `Wrap the code in try { ... } catch (${m[1].split('.').pop()} e) { ... }, or add "throws ${m[1].split('.').pop()}" to the method.`,
      },
      sw: {
        title: `${m[1].split('.').pop()} lazima ishughulikiwe`,
        why: `Msimbo huu unaweza kutupa kosa la aina "checked" (${m[1].split('.').pop()}). Java inakulazimisha uamue kitakachofanyika likitokea: lishughulikie, au lipitishe.`,
        fix: `Funga msimbo ndani ya try { ... } catch (${m[1].split('.').pop()} e) { ... }, au ongeza "throws ${m[1].split('.').pop()}" kwenye method.`,
      },
    }),
  },
  {
    id: 'java-static',
    languages: ['java'],
    match: /error: non-static (method|variable) ([\w$]+(?:\([^)]*\))?) cannot be referenced from a static context/,
    build: (m) => ({
      en: {
        title: 'main cannot use this directly',
        why: `main is static: it belongs to the class, not to any object. The ${m[1]} ${m[2]} belongs to an object, so main cannot use it on its own.`,
        fix: `Create an object first and use it through the object (for example: Shop shop = new Shop(); shop.open();), or mark the ${m[1]} as static.`,
      },
      sw: {
        title: 'main haiwezi kutumia hii moja kwa moja',
        why: `main ni static: inamilikiwa na class, si na kitu (object) chochote. ${m[1] === 'method' ? 'Method' : 'Kigezo'} ${m[2]} kinamilikiwa na object, kwa hiyo main haiwezi kukitumia peke yake.`,
        fix: `Unda object kwanza na uitumie kupitia object (mfano: Shop shop = new Shop(); shop.open();), au weka ${m[1] === 'method' ? 'method' : 'kigezo'} kuwa static.`,
      },
    }),
  },
  {
    id: 'java-final',
    languages: ['java'],
    match: /error: cannot assign a value to final variable ([\w$]+)/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" cannot change`,
        why: `"${m[1]}" was declared final, which means it is a constant: it gets one value and keeps it.`,
        fix: `Remove final if the value must change, or stop assigning to "${m[1]}".`,
      },
      sw: {
        title: `"${m[1]}" haiwezi kubadilika`,
        why: `"${m[1]}" ilitangazwa final, yaani ni thabiti: inapata thamani moja na kuibakiza.`,
        fix: `Ondoa final kama thamani inapaswa kubadilika, au acha kuipa "${m[1]}" thamani mpya.`,
      },
    }),
  },
  {
    id: 'java-abstract',
    languages: ['java'],
    match: /error: ([\w$]+) is abstract; cannot be instantiated/,
    build: (m) => ({
      en: {
        title: `You cannot create a "${m[1]}" directly`,
        why: `"${m[1]}" is abstract (or an interface): it describes what something can do, but it is not complete enough to make an object from.`,
        fix: `Create an object of a class that extends or implements "${m[1]}" instead, for example: ${m[1]} item = new SomeSubclass();`,
      },
      sw: {
        title: `Huwezi kuunda "${m[1]}" moja kwa moja`,
        why: `"${m[1]}" ni abstract (au interface): inaeleza kitu kinaweza kufanya nini, lakini haijakamilika vya kutosha kutengeneza object kutoka kwake.`,
        fix: `Unda object ya class inayoirithi au kuitekeleza "${m[1]}" badala yake, mfano: ${m[1]} item = new SomeSubclass();`,
      },
    }),
  },
  {
    id: 'java-public-file',
    languages: ['java'],
    match: /error: class ([\w$]+) is public, should be declared in a file named/,
    build: (m) => ({
      en: {
        title: 'Only one class can be public',
        why: `"${m[1]}" is marked public, and another public class is in the same program. Java allows one public class per file.`,
        fix: 'Remove the word public from all the classes except the one that holds main.',
      },
      sw: {
        title: 'Class moja tu inaweza kuwa public',
        why: `"${m[1]}" imewekwa public, na kuna class nyingine ya public kwenye programu hiyo hiyo. Java inaruhusu class moja ya public kwa kila faili.`,
        fix: 'Ondoa neno public kwenye class zote isipokuwa ile yenye main.',
      },
    }),
  },
  {
    id: 'java-array-index',
    languages: ['java'],
    match: /Exception in thread "main" java\.lang\.(?:ArrayIndexOutOfBounds|IndexOutOfBounds|StringIndexOutOfBounds)Exception/,
    build: () => ({
      en: {
        title: 'You went past the end of the list',
        why: 'The program asked for a position that does not exist (an array, a list or a string). Positions start at 0, so a list of 5 items has positions 0 to 4, and position 5 does not exist.',
        fix: 'Check the number you use as the index. A loop should stop with i < length, not i <= length. Look at the method names in the report to see where it happened.',
      },
      sw: {
        title: 'Umepita mwisho wa orodha',
        why: 'Programu iliomba nafasi isiyokuwepo (safu, orodha au maandishi). Nafasi huanza 0, kwa hiyo orodha ya vitu 5 ina nafasi 0 hadi 4, na nafasi 5 haipo.',
        fix: 'Angalia nambari unayotumia kama faharasa. Kitanzi kinapaswa kusimama kwa i < length, si i <= length. Angalia majina ya method kwenye ripoti kuona ilipotokea.',
      },
    }),
  },
  {
    id: 'java-null',
    languages: ['java'],
    match: /Exception in thread "main" java\.lang\.NullPointerException/,
    build: () => ({
      en: {
        title: 'Something was empty (null)',
        why: 'The program tried to use a variable that points to nothing. An object variable that was never given an object, or a method that returned null, holds null, and you cannot call methods on null.',
        fix: 'Find the variable used on the line in the report, and make sure it is given a real object first (for example with new), or check if (x != null) before using it.',
      },
      sw: {
        title: 'Kuna kitu kitupu (null)',
        why: 'Programu ilijaribu kutumia kigezo kisichoelekeza popote. Kigezo cha object ambacho hakikupewa object kamwe, au method iliyorudisha null, kinashikilia null, na huwezi kuita method kwenye null.',
        fix: 'Tafuta kigezo kinachotumika kwenye mstari wa ripoti, na hakikisha kinapewa object halisi kwanza (mfano kwa new), au kagua if (x != null) kabla ya kukitumia.',
      },
    }),
  },
  {
    id: 'java-stack',
    languages: ['java'],
    match: /Exception in thread "main" java\.lang\.StackOverflowError/,
    build: () => ({
      en: {
        title: 'A method kept calling itself',
        why: 'A method called itself again and again with no way to stop, until the computer ran out of room for the calls. This is recursion without a base case.',
        fix: 'Add a base case: an if that returns without calling the method again, and make sure each call moves closer to it.',
      },
      sw: {
        title: 'Method iliendelea kujiita yenyewe',
        why: 'Method ilijiita tena na tena bila njia ya kusimama, hadi kompyuta ikaishiwa nafasi ya miito. Hii ni recursion isiyo na base case.',
        fix: 'Ongeza base case: if inayorudi bila kuiita method tena, na hakikisha kila mwito unakaribia hiyo.',
      },
    }),
  },
  {
    id: 'java-arith',
    languages: ['java'],
    match: /Exception in thread "main" java\.lang\.ArithmeticException/,
    build: () => ({
      en: {
        title: 'Division by zero',
        why: 'Whole-number division by 0 is impossible, so Java stops with an ArithmeticException.',
        fix: 'Check the divisor first: if (b != 0) { ... } else { ... }.',
      },
      sw: {
        title: 'Kugawanya kwa sifuri',
        why: 'Kugawanya nambari kamili kwa 0 hakuwezekani, kwa hiyo Java inasimama na ArithmeticException.',
        fix: 'Kagua kigawanyo kwanza: if (b != 0) { ... } else { ... }.',
      },
    }),
  },
  {
    id: 'java-number-format',
    languages: ['java'],
    match: /Exception in thread "main" java\.lang\.NumberFormatException/,
    build: () => ({
      en: {
        title: 'That text is not a number',
        why: 'Integer.parseInt or Double.parseDouble was given text that cannot be turned into a number (letters, spaces, or an empty line).',
        fix: 'Check the text before converting, or wrap the conversion in try { ... } catch (NumberFormatException e) { ... } and ask again.',
      },
      sw: {
        title: 'Maandishi hayo si nambari',
        why: 'Integer.parseInt au Double.parseDouble ilipewa maandishi yasiyoweza kugeuzwa kuwa nambari (herufi, nafasi, au mstari mtupu).',
        fix: 'Kagua maandishi kabla ya kubadilisha, au funga ubadilishaji ndani ya try { ... } catch (NumberFormatException e) { ... } kisha uliza tena.',
      },
    }),
  },
  {
    id: 'java-input',
    languages: ['java'],
    match: /Exception in thread "main" java\.util\.(InputMismatchException|NoSuchElementException)/,
    build: (m) => ({
      en: m[1] === 'InputMismatchException'
        ? {
            title: 'The input is not what the program asked for',
            why: 'Scanner was asked for one kind of value (for example nextInt) but the input has another (for example letters).',
            fix: 'Check the Input box: type what the program expects, one value after another. Use hasNextInt() to check before reading.',
          }
        : {
            title: 'The program wanted more input',
            why: 'Scanner tried to read a value, but the Input box has run out of values.',
            fix: 'Type all the values the program asks for in the Input box (one per line, or separated by spaces), or check with hasNext() before reading.',
          },
      sw: m[1] === 'InputMismatchException'
        ? {
            title: 'Ingizo si lile ambalo programu iliomba',
            why: 'Scanner iliombwa aina moja ya thamani (mfano nextInt) lakini ingizo lina nyingine (mfano herufi).',
            fix: 'Angalia kisanduku cha Input: andika kile programu inachotarajia, thamani moja baada ya nyingine. Tumia hasNextInt() kukagua kabla ya kusoma.',
          }
        : {
            title: 'Programu ilitaka ingizo zaidi',
            why: 'Scanner ilijaribu kusoma thamani, lakini kisanduku cha Input kimeishiwa thamani.',
            fix: 'Andika thamani zote ambazo programu inaomba kwenye kisanduku cha Input (moja kwa mstari, au zikitenganishwa na nafasi), au kagua kwa hasNext() kabla ya kusoma.',
          },
    }),
  },
  {
    id: 'java-uncaught',
    languages: ['java'],
    match: /Exception in thread "main" ([\w.$]+)(?:: ([^\n]*))?/,
    build: (m) => {
      const name = m[1].split('.').pop();
      return {
        en: {
          title: `The program stopped with ${name}`,
          why: m[2] ? `An exception was thrown and nothing caught it. Its message says: ${m[2]}` : 'An exception was thrown and nothing caught it, so the program stopped.',
          fix: 'Read the line that starts with "at": it names the methods that were running, from the one that failed back to main. Fix the cause there, or catch the exception with try / catch if it is expected.',
        },
        sw: {
          title: `Programu ilisimama na ${name}`,
          why: m[2] ? `Exception ilitupwa na hakuna aliyeishika. Ujumbe wake unasema: ${m[2]}` : 'Exception ilitupwa na hakuna aliyeishika, kwa hiyo programu ilisimama.',
          fix: 'Soma mstari unaoanza na "at": unataja method zilizokuwa zikiendeshwa, kuanzia iliyofeli hadi main. Rekebisha chanzo hapo, au shika exception kwa try / catch kama inatarajiwa.',
        },
      };
    },
  },

  // ---- Full C (picoc on WebAssembly: structs, malloc, files). Messages look like "/main.c:12:5 <message>" ----
  {
    id: 'cx-missing-include',
    languages: ['cx'],
    match: /'(\w+)' is undefined/,
    when: (m) => headerFor(m[1]) !== null,
    build: (m) => {
      const header = headerFor(m[1]);
      return {
        en: {
          title: `Missing ${header} for ${m[1]}`,
          why: `${m[1]}() lives in a library. The program only knows it if you include the right header at the top.`,
          fix: `Add ${header} as the first line of your program.`,
        },
        sw: {
          title: `Kichwa ${header} kinakosekana kwa ${m[1]}`,
          why: `${m[1]}() inatoka kwenye maktaba. Programu inaijua tu ukijumuisha kichwa sahihi juu.`,
          fix: `Weka ${header} kama mstari wa kwanza wa programu yako.`,
        },
      };
    },
  },
  {
    id: 'cx-undefined',
    languages: ['cx'],
    match: /'(\w+)' is undefined/,
    build: (m) => ({
      en: {
        title: `"${m[1]}" is not declared`,
        why: `The program uses "${m[1]}" but never created it. It may be misspelled (C is case-sensitive), declared inside a different block, or a function that does not exist.`,
        fix: `Check the spelling. Declare the variable before using it, for example int ${m[1]};`,
      },
      sw: {
        title: `"${m[1]}" haijatangazwa`,
        why: `Programu inatumia "${m[1]}" lakini haikuiunda. Inaweza kuwa imeandikwa vibaya (C hutofautisha herufi kubwa na ndogo), imetangazwa ndani ya kizuizi kingine, au ni kitendakazi kisichokuwepo.`,
        fix: `Angalia tahajia. Tangaza kigeugeu kabla ya kukitumia, kwa mfano int ${m[1]};`,
      },
    }),
  },
  {
    id: 'cx-member',
    languages: ['cx'],
    match: /doesn't have a member called '(\w+)'/,
    build: (m) => ({
      en: {
        title: `The struct has no member "${m[1]}"`,
        why: `You wrote .${m[1]} or ->${m[1]}, but the struct was declared without a member of that name.`,
        fix: `Look at the struct definition and copy the member name exactly (spelling and capital letters matter).`,
      },
      sw: {
        title: `Struct haina mwanachama "${m[1]}"`,
        why: `Uliandika .${m[1]} au ->${m[1]}, lakini struct ilitangazwa bila mwanachama wa jina hilo.`,
        fix: 'Tazama ufafanuzi wa struct na unakili jina la mwanachama kama lilivyo (tahajia na herufi kubwa vinahesabika).',
      },
    }),
  },
  {
    id: 'cx-arrow-dot',
    languages: ['cx'],
    match: /can't use '(->|\.)' on something that's not a struct or union( pointer)?\s*:\s*it's an? (.*)$/m,
    build: (m) => ({
      en: {
        title: m[1] === '->' ? 'Use a dot, not an arrow, here' : 'Use an arrow, not a dot, here',
        why: m[1] === '->' ? `-> is only for a **pointer** to a struct. This is a plain struct variable (${m[3]}).` : `A dot is for a struct **variable**. This is a pointer (${m[3]}), so you need ->.`,
        fix: m[1] === '->' ? 'Write variable.member for a struct, and pointer->member for a pointer to a struct.' : 'Write pointer->member, or (*pointer).member.',
      },
      sw: {
        title: m[1] === '->' ? 'Tumia nukta, si mshale, hapa' : 'Tumia mshale, si nukta, hapa',
        why: m[1] === '->' ? `-> ni kwa **kielekezi** cha struct tu. Hiki ni kigeugeu cha struct cha kawaida (${m[3]}).` : `Nukta ni kwa **kigeugeu** cha struct. Hiki ni kielekezi (${m[3]}), kwa hiyo unahitaji ->.`,
        fix: m[1] === '->' ? 'Andika kigeugeu.mwanachama kwa struct, na kielekezi->mwanachama kwa kielekezi cha struct.' : 'Andika kielekezi->mwanachama, au (*kielekezi).mwanachama.',
      },
    }),
  },
  {
    id: 'cx-null-pointer',
    languages: ['cx'],
    match: /NULL pointer dereference/,
    build: () => ({
      en: {
        title: 'The pointer has no address yet',
        why: 'The program followed a pointer that points nowhere (it was never given an address, or malloc has not been called).',
        fix: 'Give the pointer something to point at before using it: int *p = malloc(sizeof(int)); or p = &variable; and check that malloc did not return NULL.',
      },
      sw: {
        title: 'Kielekezi hakina anwani bado',
        why: 'Programu ilifuata kielekezi kisichoelekeza popote (hakikupewa anwani, au malloc haikuitwa).',
        fix: 'Pa kielekezi kitu cha kuelekeza kabla ya kukitumia: int *p = malloc(sizeof(int)); au p = &kigeugeu; na uhakikishe malloc haikurudisha NULL.',
      },
    }),
  },
  {
    id: 'cx-type-unknown',
    languages: ['cx'],
    match: /type '([^']+)' isn't defined/,
    build: (m) => ({
      en: {
        title: `The type "${m[1]}" does not exist`,
        why: `The program uses ${m[1]} before it was defined, or the name is misspelled.`,
        fix: 'Define the struct, enum or typedef above main(), and check the spelling.',
      },
      sw: {
        title: `Aina "${m[1]}" haipo`,
        why: `Programu inatumia ${m[1]} kabla haijafafanuliwa, au jina limeandikwa vibaya.`,
        fix: 'Fafanua struct, enum au typedef juu ya main(), na angalia tahajia.',
      },
    }),
  },
  {
    id: 'cx-arguments',
    languages: ['cx'],
    match: /(too many|not enough) arguments to (\w+)\(\)/,
    build: (m) => ({
      en: {
        title: `Wrong number of arguments to ${m[2]}()`,
        why: `${m[2]}() was called with ${m[1] === 'too many' ? 'more' : 'fewer'} values than it was defined to take.`,
        fix: `Count the parameters in the definition of ${m[2]}() and pass exactly that many values.`,
      },
      sw: {
        title: `Idadi isiyo sahihi ya hoja kwa ${m[2]}()`,
        why: `${m[2]}() iliitwa na thamani ${m[1] === 'too many' ? 'nyingi zaidi' : 'chache zaidi'} kuliko ilivyofafanuliwa kupokea.`,
        fix: `Hesabu vigezo katika ufafanuzi wa ${m[2]}() na upitishe thamani idadi hiyo hasa.`,
      },
    }),
  },
  {
    id: 'cx-assign',
    languages: ['cx'],
    match: /can't assign (.+) from (.+)$/m,
    build: (m) => ({
      en: {
        title: `You cannot put a ${m[2]} into a ${m[1]}`,
        why: 'The two sides of = have types that do not match (for example a number assigned to a whole struct).',
        fix: 'Assign to one member at a time (p.x = 5;), or copy a struct from another struct of the same type.',
      },
      sw: {
        title: `Huwezi kuweka ${m[2]} ndani ya ${m[1]}`,
        why: 'Pande mbili za = zina aina zisizolingana (kwa mfano nambari kupewa struct nzima).',
        fix: 'Pa mwanachama mmoja kwa wakati (p.x = 5;), au nakili struct kutoka struct nyingine ya aina ile ile.',
      },
    }),
  },
  {
    id: 'cx-parse',
    languages: ['cx'],
    match: /(?:'(.)' expected|(\w+) expected|identifier not expected here|bad type declaration)/,
    build: (m) => ({
      en: {
        title: m[1] ? `A "${m[1]}" is missing` : 'The program could not be read here',
        why: m[1] ? `The compiler expected a ${m[1]} at this point.` : 'Something is out of place: often a missing semicolon on the line above, a missing bracket, or a typing slip.',
        fix: 'Look at the marked line and the line above it. Check semicolons ( ; ), brackets and quotes.',
      },
      sw: {
        title: m[1] ? `"${m[1]}" inakosekana` : 'Programu haikuweza kusomwa hapa',
        why: m[1] ? `Kikusanyaji kilitarajia ${m[1]} mahali hapa.` : 'Kitu kimekaa mahali pasipo sahihi: mara nyingi nusu koloni imesahaulika mstari wa juu, mabano yamekosekana, au kosa la kuandika.',
        fix: 'Tazama mstari ulioonyeshwa na ule wa juu yake. Angalia nusu koloni ( ; ), mabano na nukuu.',
      },
    }),
  },
  {
    id: 'cx-div-zero',
    languages: ['cx'],
    match: /divide by zero|divisible by zero/i,
    build: () => ({
      en: {
        title: 'Division by zero',
        why: 'The program divided a number by 0, which has no answer.',
        fix: 'Check that the divisor is not 0 before you divide: if (b != 0) { ... }',
      },
      sw: {
        title: 'Kugawanya kwa sifuri',
        why: 'Programu iligawanya nambari kwa 0, jambo lisilo na jibu.',
        fix: 'Hakikisha kigawanyo si 0 kabla ya kugawanya: if (b != 0) { ... }',
      },
    }),
  },
  {
    id: 'cx-crash-file',
    languages: ['cx'],
    match: /fopen returned NULL|failed to open/i,
    build: () => ({
      en: {
        title: 'A file that did not open was used',
        why: 'fopen returned NULL (the file does not exist, or the name is wrong) and the program used it anyway.',
        fix: 'Always test the result: FILE *f = fopen("data.txt", "r"); if (f == NULL) { printf("Cannot open\\n"); return 1; }',
      },
      sw: {
        title: 'Faili lisilofunguka lilitumika',
        why: 'fopen ilirudisha NULL (faili halipo, au jina si sahihi) na programu likalitumia hata hivyo.',
        fix: 'Jaribu matokeo kila mara: FILE *f = fopen("data.txt", "r"); if (f == NULL) { printf("Cannot open\\n"); return 1; }',
      },
    }),
  },
  {
    id: 'cx-memory',
    languages: ['cx'],
    match: /too much memory/,
    build: () => ({
      en: {
        title: 'The program used too much memory',
        why: 'Usually a function that calls itself with no base case, or a loop that keeps calling malloc.',
        fix: 'Make sure every recursive function has a base case that stops it, and free memory you no longer need.',
      },
      sw: {
        title: 'Programu ilitumia kumbukumbu nyingi mno',
        why: 'Mara nyingi ni kitendakazi kinachojiita bila sharti la kusimama, au kitanzi kinachoendelea kuita malloc.',
        fix: 'Hakikisha kila kitendakazi cha kujiita kina sharti la kusimama, na achilia kumbukumbu usiyoihitaji tena (free).',
      },
    }),
  },
  {
    id: 'cx-generic',
    languages: ['cx'],
    match: /\/main\.c:\d+:\d+ (.+)$/m,
    build: (m) => ({
      en: {
        title: 'The program stopped with an error',
        why: m[1],
        fix: 'Read the message and look at the marked line. Check spelling, semicolons, brackets and the types of your variables.',
      },
      sw: {
        title: 'Programu ilisimama kwa kosa',
        why: m[1],
        fix: 'Soma ujumbe na utazame mstari ulioonyeshwa. Angalia tahajia, nusu koloni, mabano na aina za vigeugeu vyako.',
      },
    }),
  },
];

/** Line number mentioned by the raw error, if any. */
export function extractLine(raw, language) {
  if (!raw) return null;
  if (language === 'web') {
    const w = raw.match(/script\.js:(\d+)/);
    return w ? Number(w[1]) : null;
  }
  if (language === 'php') {
    // "Uncaught Error: ... in main.php:7" (where it happened), or "... in main.php on line 7"
    const p = raw.match(/main\.php:(\d+)/) || raw.match(/main\.php on line (\d+)/);
    return p ? Number(p[1]) : null;
  }
  if (language === 'python') {
    const all = [...raw.matchAll(/File "<exec>", line (\d+)/g)];
    return all.length ? Number(all[all.length - 1][1]) : null;
  }
  if (language === 'java') {
    const j = raw.match(/\.java:(\d+):/);
    return j ? Number(j[1]) : null;
  }
  if (language === 'cx') {
    const c = raw.match(/\/main\.c:(\d+):\d+ /);
    return c ? Number(c[1]) : null;
  }
  const a = raw.match(/^(\d+):\d+/m);
  if (a) return Number(a[1]);
  const b = raw.match(/line (\d+)/);
  return b ? Number(b[1]) : null;
}

/** Keep only the useful part of a raw error (drop internal frames). */
export function cleanRaw(raw, language) {
  if (!raw) return '';
  if (language !== 'python') return raw.trim();
  const lines = raw.trim().split('\n');
  const userFrame = lines.findIndex((l) => /File "<exec>"/.test(l));
  return (userFrame >= 0 ? lines.slice(userFrame) : lines.slice(-3)).join('\n');
}

/**
 * Translate a raw error.
 * @returns { id, title, why, fix, lang, fellBack, line } or null when no rule matches
 */
export function translateError(raw, { language, lang = 'en' }) {
  if (!raw) return null;
  for (const rule of RULES) {
    // C++ runs on the same interpreter as C, so the C rules apply to it too (its own rules come first).
    if (!rule.languages.includes(language) && !(language === 'cpp' && rule.languages.includes('c'))) continue;
    const m = raw.match(rule.match);
    if (!m) continue;
    if (rule.when && !rule.when(m)) continue;
    const entry = rule.build(m);
    const chosen = entry[lang] || entry.en;
    return {
      id: rule.id,
      ...chosen,
      lang: entry[lang] ? lang : 'en',
      fellBack: lang !== 'en' && !entry[lang],
      line: extractLine(raw, language),
    };
  }
  return null;
}
