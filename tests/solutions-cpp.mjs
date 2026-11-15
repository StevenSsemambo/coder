// Reference solutions for the C++ course (see docs/CPP-TRACK.md). Every C++ exercise must have one here,
// it must pass all its tests, and the starter must NOT pass.
import { prog, progFn, IO_FMT, IO_STR } from '../src/content/cpp/shared.js';

const P = (body) => prog(body);
const PF = (body) => prog(body, IO_FMT);
const PS = (body) => prog(body, IO_STR);

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

  // Lesson 10: functions
  'cpp10-cost': progFn('int cost(int qty) {\n    return qty * 3000;\n}', '    int qty;\n    cin >> qty;\n    cout << "Cost: " << cost(qty) << endl;'),
  'cpp10-bigger': progFn('int bigger(int a, int b) {\n    if (a > b) {\n        return a;\n    }\n    return b;\n}', '    int a, b;\n    cin >> a >> b;\n    cout << "Bigger: " << bigger(a, b) << endl;'),
  'cpp10-prime': progFn(String.raw`bool isPrime(int n) {
    if (n < 2) {
        return false;
    }
    for (int i = 2; i < n; i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}`, String.raw`    int n;
    cin >> n;
    if (isPrime(n)) {
        cout << "Prime" << endl;
    } else {
        cout << "Not prime" << endl;
    }`),

  // Lesson 11: parameters, scope, default arguments
  'cpp11-fee': progFn('int fee(int amount, int percent = 10) {\n    return amount * percent / 100;\n}', '    int amount;\n    cin >> amount;\n    cout << "Fee: " << fee(amount) << endl;\n    cout << "Fee at 5%: " << fee(amount, 5) << endl;'),
  'cpp11-served': progFn(String.raw`int served = 0;
int earned = 0;

void sale(int amount) {
    served++;
    earned += amount;
}`, String.raw`    int amount;
    cin >> amount;
    while (amount != 0) {
        sale(amount);
        cin >> amount;
    }
    cout << "Served: " << served << endl;
    cout << "Earned: " << earned << endl;`),
  'cpp11-newprice': progFn('int discounted(int price) {\n    return price * 90 / 100;\n}', '    int price;\n    cin >> price;\n    int now = discounted(price);\n    cout << "Original: " << price << endl;\n    cout << "Now: " << now << endl;'),

  // Lesson 12: recursion
  'cpp12-factorial': progFn('int fact(int n) {\n    if (n <= 1) {\n        return 1;\n    }\n    return n * fact(n - 1);\n}', '    int n;\n    cin >> n;\n    cout << "Factorial: " << fact(n) << endl;'),
  'cpp12-fib': progFn('int fib(int n) {\n    if (n <= 1) {\n        return n;\n    }\n    return fib(n - 1) + fib(n - 2);\n}', '    int n;\n    cin >> n;\n    cout << "Fib: " << fib(n) << endl;'),
  'cpp12-gcd': progFn('int gcd(int a, int b) {\n    if (b == 0) {\n        return a;\n    }\n    return gcd(b, a % b);\n}', '    int a, b;\n    cin >> a >> b;\n    cout << "GCD: " << gcd(a, b) << endl;'),

  // Lesson 13: the Mobile Money kiosk project
  'cpp13-fee': progFn(String.raw`int withdrawFee(int amount) {
    if (amount <= 10000) {
        return 300;
    } else if (amount <= 50000) {
        return 700;
    }
    return 1500;
}`, String.raw`    int amount;
    cin >> amount;
    cout << "Fee: " << withdrawFee(amount) << endl;`),
  'cpp13-wallet': progFn(String.raw`int transactions = 0;

int withdrawFee(int amount) {
    if (amount <= 10000) {
        return 300;
    } else if (amount <= 50000) {
        return 700;
    }
    return 1500;
}

void showBalance(int balance) {
    cout << "Balance: " << balance << endl;
}`, String.raw`    int balance, command, amount, fee;
    cin >> balance;
    cin >> command;
    while (command != 0) {
        switch (command) {
            case 1:
                cin >> amount;
                balance += amount;
                transactions++;
                cout << "Deposited: " << amount << endl;
                break;
            case 2:
                cin >> amount;
                fee = withdrawFee(amount);
                if (amount + fee <= balance) {
                    balance -= amount + fee;
                    transactions++;
                    cout << "Withdrew: " << amount << " (fee " << fee << ")" << endl;
                } else {
                    cout << "Insufficient funds" << endl;
                }
                break;
            case 3:
                showBalance(balance);
                break;
            default:
                cout << "Unknown command" << endl;
        }
        cin >> command;
    }
    cout << "Goodbye" << endl;
    cout << "Transactions: " << transactions << endl;`),

  // Lesson 14: arrays
  'cpp14-total': PF(String.raw`    const int N = 5;
    int sales[N];
    int total = 0;
    for (int i = 0; i < N; i++) {
        cin >> sales[i];
        total += sales[i];
    }
    cout << "Total: " << total << endl;
    cout << fixed << setprecision(2);
    cout << "Average: " << (double)total / N << endl;`),
  'cpp14-reverse': P(String.raw`    int n;
    int a[10];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    for (int i = n - 1; i >= 0; i--) {
        cout << a[i] << " ";
    }
    cout << endl;`),
  'cpp14-above': P(String.raw`    int a[5];
    int total = 0;
    for (int i = 0; i < 5; i++) {
        cin >> a[i];
        total += a[i];
    }
    double average = total / 5.0;
    int count = 0;
    for (int i = 0; i < 5; i++) {
        if (a[i] > average) {
            count++;
        }
    }
    cout << "Above average: " << count << endl;`),

  // Lesson 15: arrays and functions
  'cpp15-maxmin': P(String.raw`    int n;
    int a[10];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    int max = a[0], min = a[0], pos = 0;
    for (int i = 1; i < n; i++) {
        if (a[i] > max) {
            max = a[i];
            pos = i;
        }
        if (a[i] < min) {
            min = a[i];
        }
    }
    cout << "Max: " << max << endl;
    cout << "Min: " << min << endl;
    cout << "Best position: " << pos + 1 << endl;`),
  'cpp15-search': P(String.raw`    int n, target;
    int a[10];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    cin >> target;
    bool found = false;
    for (int i = 0; i < n; i++) {
        if (a[i] == target) {
            cout << "Found at position " << i + 1 << endl;
            found = true;
            break;
        }
    }
    if (!found) {
        cout << "Not found" << endl;
    }`),
  'cpp15-sort': progFn(String.raw`void bubbleSort(int a[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        for (int i = 0; i < n - 1 - pass; i++) {
            if (a[i] > a[i + 1]) {
                int temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
            }
        }
    }
}`, String.raw`    int n;
    int a[10];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    bubbleSort(a, n);
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
    cout << endl;`),

  // Lesson 16: tables
  'cpp16-stalls': P(String.raw`    int t[3][4];
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 4; c++) {
            cin >> t[r][c];
        }
    }
    int grand = 0;
    for (int r = 0; r < 3; r++) {
        int total = 0;
        for (int c = 0; c < 4; c++) {
            total += t[r][c];
        }
        cout << "Stall " << r + 1 << ": " << total << endl;
        grand += total;
    }
    cout << "All stalls: " << grand << endl;`),
  'cpp16-diagonal': P(String.raw`    int t[3][3];
    for (int r = 0; r < 3; r++) {
        for (int c = 0; c < 3; c++) {
            cin >> t[r][c];
        }
    }
    int total = 0;
    for (int i = 0; i < 3; i++) {
        total += t[i][i];
    }
    cout << "Diagonal: " << total << endl;`),
  'cpp16-transpose': P(String.raw`    int t[2][3];
    for (int r = 0; r < 2; r++) {
        for (int c = 0; c < 3; c++) {
            cin >> t[r][c];
        }
    }
    for (int c = 0; c < 3; c++) {
        for (int r = 0; r < 2; r++) {
            cout << t[r][c] << " ";
        }
        cout << endl;
    }`),

  // Lesson 17: text as char arrays
  'cpp17-vowels': PS(String.raw`    char w[30];
    cin >> w;
    int vowels = 0;
    for (int i = 0; w[i] != '\0'; i++) {
        char c = tolower(w[i]);
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            vowels++;
        }
    }
    cout << "Vowels: " << vowels << endl;`),
  'cpp17-upper': PS(String.raw`    char s[100];
    cin.getline(s, 100);
    for (int i = 0; s[i] != '\0'; i++) {
        cout << (char)toupper(s[i]);
    }
    cout << endl;`),
  'cpp17-palindrome': PS(String.raw`    char w[30];
    cin >> w;
    int n = strlen(w);
    bool same = true;
    for (int i = 0; i < n / 2; i++) {
        if (w[i] != w[n - 1 - i]) {
            same = false;
        }
    }
    if (same) {
        cout << "Palindrome" << endl;
    } else {
        cout << "Not palindrome" << endl;
    }`),
  'cpp17-login': PS(String.raw`    char user[20], pass[20];
    cin >> user >> pass;
    if (strcmp(user, "rose") == 0 && strcmp(pass, "karibu") == 0) {
        cout << "Welcome" << endl;
    } else {
        cout << "Access denied" << endl;
    }`),

  // Lesson 18: pointers
  'cpp18-swap': progFn(String.raw`void exchange(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}`, String.raw`    int a, b;
    cin >> a >> b;
    cout << "Before: " << a << " " << b << endl;
    exchange(&a, &b);
    cout << "After: " << a << " " << b << endl;`),
  'cpp18-tax': progFn(String.raw`void addVat(int *price) {
    *price = *price * 118 / 100;
}`, String.raw`    int price;
    cin >> price;
    addVat(&price);
    cout << "Price with VAT: " << price << endl;`),
  'cpp18-minmax': progFn(String.raw`void minMax(int a[], int n, int *lowest, int *highest) {
    *lowest = a[0];
    *highest = a[0];
    for (int i = 1; i < n; i++) {
        if (a[i] < *lowest) {
            *lowest = a[i];
        }
        if (a[i] > *highest) {
            *highest = a[i];
        }
    }
}`, String.raw`    int n;
    int a[10];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    int low, high;
    minMax(a, n, &low, &high);
    cout << "Min: " << low << endl;
    cout << "Max: " << high << endl;`),
  'cpp18-reverse': progFn(String.raw`void exchange(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}`, String.raw`    int n;
    int a[10];
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    int *left = a;
    int *right = a + n - 1;
    while (left < right) {
        exchange(left, right);
        left++;
        right--;
    }
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
    cout << endl;`),
};
