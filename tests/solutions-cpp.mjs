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

  // Lesson 5: switch, nested decisions, bool
  'cpp5-menu': P(String.raw`    int choice;
    cin >> choice;
    switch (choice) {
        case 1:
            cout << "Rolex: 3000 UGX" << endl;
            break;
        case 2:
            cout << "Chapati: 1000 UGX" << endl;
            break;
        case 3:
            cout << "Soda: 1500 UGX" << endl;
            break;
        case 4:
            cout << "Tea: 1000 UGX" << endl;
            break;
        default:
            cout << "No such item" << endl;
    }`),
  'cpp5-day': P(String.raw`    int d;
    cin >> d;
    switch (d) {
        case 1: cout << "Monday" << endl; break;
        case 2: cout << "Tuesday" << endl; break;
        case 3: cout << "Wednesday" << endl; break;
        case 4: cout << "Thursday" << endl; break;
        case 5: cout << "Friday" << endl; break;
        case 6: cout << "Saturday" << endl; break;
        case 7: cout << "Sunday" << endl; break;
        default: cout << "Invalid day" << endl;
    }`),
  'cpp5-calc': P(String.raw`    int a, b;
    char op;
    cin >> a >> op >> b;
    switch (op) {
        case '+':
            cout << "Result: " << a + b << endl;
            break;
        case '-':
            cout << "Result: " << a - b << endl;
            break;
        case '*':
            cout << "Result: " << a * b << endl;
            break;
        case '/':
            if (b == 0) {
                cout << "Cannot divide by zero" << endl;
            } else {
                cout << "Result: " << a / b << endl;
            }
            break;
        default:
            cout << "Unknown operator" << endl;
    }`),

  // Lesson 6: for loops
  'cpp6-count': P('    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) {\n        cout << i << endl;\n    }'),
  'cpp6-sum': P('    int n, total = 0;\n    cin >> n;\n    for (int i = 1; i <= n; i++) {\n        total += i;\n    }\n    cout << "Sum: " << total << endl;'),
  'cpp6-table': P('    int n;\n    cin >> n;\n    for (int i = 1; i <= 12; i++) {\n        cout << n << " x " << i << " = " << n * i << endl;\n    }'),

  // Lesson 7: while loops
  'cpp7-total': P('    int x, total = 0;\n    cin >> x;\n    while (x != 0) {\n        total += x;\n        cin >> x;\n    }\n    cout << "Total: " << total << endl;'),
  'cpp7-digits': P('    int n, digits = 0;\n    cin >> n;\n    while (n > 0) {\n        digits++;\n        n = n / 10;\n    }\n    cout << "Digits: " << digits << endl;'),
  'cpp7-doubling': P('    int target, money = 1000, days = 0;\n    cin >> target;\n    while (money < target) {\n        money = money * 2;\n        days++;\n    }\n    cout << "Days: " << days << endl;'),

  // Lesson 8: nested loops
  'cpp8-rectangle': P(String.raw`    int rows, cols;
    cin >> rows >> cols;
    for (int r = 1; r <= rows; r++) {
        for (int c = 1; c <= cols; c++) {
            cout << "#";
        }
        cout << endl;
    }`),
  'cpp8-triangle': P(String.raw`    int n;
    cin >> n;
    for (int r = 1; r <= n; r++) {
        for (int c = 1; c <= r; c++) {
            cout << "*";
        }
        cout << endl;
    }`),
  'cpp8-grid': PF(String.raw`    int n;
    cin >> n;
    for (int r = 1; r <= n; r++) {
        for (int c = 1; c <= n; c++) {
            cout << setw(4) << r * c;
        }
        cout << endl;
    }`),

  // Lesson 9: the till project
  'cpp9-till': P(String.raw`    int item, qty, price, total = 0, paid;
    cin >> item;
    while (item != 0) {
        cin >> qty;
        price = 0;
        switch (item) {
            case 1: price = 3000; break;
            case 2: price = 1000; break;
            case 3: price = 1500; break;
            case 4: price = 1000; break;
            default: cout << "No such item" << endl;
        }
        total += price * qty;
        cin >> item;
    }
    cin >> paid;
    int discount = 0;
    if (total >= 10000) {
        discount = total / 10;
    }
    int toPay = total - discount;
    cout << "Total: " << total << endl;
    cout << "Discount: " << discount << endl;
    cout << "To pay: " << toPay << endl;
    if (paid >= toPay) {
        cout << "Change: " << paid - toPay << endl;
    } else {
        cout << "Short by: " << toPay - paid << endl;
    }`),
  'cpp9-daily': PF(String.raw`    int n, total = 0, highest = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        int amount;
        cin >> amount;
        total += amount;
        if (i == 1 || amount > highest) {
            highest = amount;
        }
    }
    cout << "Total: " << total << endl;
    cout << "Highest: " << highest << endl;
    cout << fixed << setprecision(2);
    cout << "Average: " << (double)total / n << endl;`),
};
