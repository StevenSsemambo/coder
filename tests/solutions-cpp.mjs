// Reference solutions for the C++ course (see docs/CPP-TRACK.md). Every C++ exercise must have one here,
// it must pass all its tests, and the starter must NOT pass.
import { prog, IO_FMT } from '../src/content/cpp/shared.js';

const P = (body) => prog(body);
const PF = (body) => prog(body, IO_FMT);

export const cppSolutions = {
  // Lesson 1: your first program
  'cpp1-hello': P('    cout << "Hello, Uganda!" << endl;'),
  'cpp1-menu': P(String.raw`    cout << "Mama Rose's Rolex Stand" << endl;
    cout << "Rolex: 3000 UGX" << endl;
    cout << "Chapati: 1000 UGX" << endl;`),
  'cpp1-board': P(String.raw`    cout << "Item:\tRolex" << endl;
    cout << "Price:\t3000" << endl;
    cout << "Rose says \"Karibu!\"" << endl;`),

  // Lesson 2: variables and input
  'cpp2-sum': P('    int a, b;\n    cin >> a >> b;\n    cout << "Sum: " << a + b << endl;'),
  'cpp2-change': P('    int price, paid;\n    cin >> price >> paid;\n    cout << "Change: " << paid - price << endl;'),
  'cpp2-average': PF('    int a, b, c;\n    cin >> a >> b >> c;\n    double average = (a + b + c) / 3.0;\n    cout << fixed << setprecision(2);\n    cout << "Average: " << average << endl;'),

  // Lesson 3: numbers, characters and operators
  'cpp3-sweets': P('    int sweets, children;\n    cin >> sweets >> children;\n    cout << "Each: " << sweets / children << endl;\n    cout << "Left over: " << sweets % children << endl;'),
  'cpp3-minutes': P(String.raw`    int minutes;
    cin >> minutes;
    cout << minutes / 60 << " hours " << minutes % 60 << " minutes" << endl;`),
  'cpp3-vat': P('    const int VAT = 18;\n    int price;\n    cin >> price;\n    int vat = price * VAT / 100;\n    cout << "VAT: " << vat << endl;\n    cout << "Total: " << price + vat << endl;'),

  // Lesson 4: decisions
  'cpp4-passfail': P('    int marks;\n    cin >> marks;\n    if (marks >= 50) {\n        cout << "Pass" << endl;\n    } else {\n        cout << "Fail" << endl;\n    }'),
  'cpp4-evenodd': P('    int n;\n    cin >> n;\n    if (n % 2 == 0) {\n        cout << "Even" << endl;\n    } else {\n        cout << "Odd" << endl;\n    }'),
  'cpp4-fare': P('    int km;\n    cin >> km;\n    int fare = km * 1000;\n    if (fare < 2000) {\n        fare = 2000;\n    }\n    cout << "Fare: " << fare << endl;'),
};
