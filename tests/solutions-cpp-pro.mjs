// Reference solutions for the C++ Pro course (real C++, see docs/CPP-PRO-TRACK.md). Every exercise must have one
// here, it must pass all its tests on the real compiler, and the starter must NOT pass.
import { progPro, progProFn } from '../src/content/cpp-pro/shared.js';

const P = (body) => progPro(body);
const INC_V = '#include <iostream>\n#include <string>\n#include <vector>';
const PV = (body) => progPro(body, INC_V);
const INC_A = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n#include <numeric>\n#include <functional>';
const PA = (body) => progPro(body, INC_A);
const PAF = (body) => progPro(body, INC_A + '\n#include <iomanip>');
const INC_R = '#include <iostream>\n#include <string>\n#include <vector>\n#include <cctype>\n#include <utility>';
const PRF = (above, body) => progProFn(above, body, INC_R);
const INC_S = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';
const PSF = (above, body) => progProFn(above, body, INC_S);
const INC_L = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';
const PLF = (above, body) => progProFn(above, body, INC_L);
const PVF = (body) => progPro(body, INC_V + '\n#include <iomanip>');

export const cppProSolutions = {
  // Lesson 1: strings
  'cppp1-welcome': P(String.raw`    string first, last;
    cin >> first >> last;
    cout << "Welcome, " << first << " " << last << "!" << endl;
    cout << "Letters: " << first.length() + last.length() << endl;`),
  'cppp1-words': P(String.raw`    string line;
    getline(cin, line);
    int words = 1;
    for (char c : line) {
        if (c == ' ') {
            words++;
        }
    }
    cout << "Words: " << words << endl;`),
  'cppp1-email': P(String.raw`    string email;
    cin >> email;
    size_t at = email.find('@');
    if (at == string::npos) {
        cout << "Not an email" << endl;
    } else {
        cout << "User: " << email.substr(0, at) << endl;
        cout << "Domain: " << email.substr(at + 1) << endl;
    }`),
  'cppp1-initials': P(String.raw`    string line;
    getline(cin, line);
    string out = "";
    for (int i = 0; i < line.length(); i++) {
        if (i == 0 || line[i - 1] == ' ') {
            out += line[i];
            out += '.';
        }
    }
    cout << out << endl;`),

  // Lesson 2: vectors
  'cppp2-numbers': PVF(String.raw`    vector<int> v;
    int x;
    while (cin >> x) {
        v.push_back(x);
    }
    int total = 0;
    for (int n : v) {
        total += n;
    }
    cout << "Count: " << v.size() << endl;
    cout << "Total: " << total << endl;
    cout << fixed << setprecision(2);
    cout << "Average: " << (double)total / v.size() << endl;`),
  'cppp2-top2': PV(String.raw`    int n;
    cin >> n;
    vector<int> v;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        v.push_back(x);
    }
    int first = -1000000, second = -1000000;
    for (int x : v) {
        if (x > first) {
            second = first;
            first = x;
        } else if (x > second) {
            second = x;
        }
    }
    cout << "Largest: " << first << endl;
    cout << "Second: " << second << endl;`),
  'cppp2-reverse': PV(String.raw`    vector<string> words;
    string w;
    while (cin >> w) {
        words.push_back(w);
    }
    for (int i = words.size() - 1; i >= 0; i--) {
        cout << words[i];
        if (i > 0) {
            cout << " ";
        }
    }
    cout << endl;`),
  'cppp2-unique': PV(String.raw`    vector<int> unique;
    int x;
    while (cin >> x) {
        bool found = false;
        for (int u : unique) {
            if (u == x) {
                found = true;
            }
        }
        if (!found) {
            unique.push_back(x);
        }
    }
    for (int i = 0; i < unique.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << unique[i];
    }
    cout << endl;`),

  // Lesson 3: the algorithm library
  'cppp3-sorted': PA(String.raw`    vector<int> v;
    int x;
    while (cin >> x) {
        v.push_back(x);
    }
    sort(v.begin(), v.end());
    for (int i = 0; i < v.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << v[i];
    }
    cout << endl;
    sort(v.begin(), v.end(), greater<int>());
    for (int i = 0; i < v.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << v[i];
    }
    cout << endl;`),
  'cppp3-median': PAF(String.raw`    vector<int> v;
    int x;
    while (cin >> x) {
        v.push_back(x);
    }
    sort(v.begin(), v.end());
    int n = v.size();
    double median;
    if (n % 2 == 1) {
        median = v[n / 2];
    } else {
        median = (v[n / 2 - 1] + v[n / 2]) / 2.0;
    }
    cout << fixed << setprecision(1);
    cout << "Median: " << median << endl;`),
  'cppp3-mode': PA(String.raw`    vector<int> v;
    int x;
    while (cin >> x) {
        v.push_back(x);
    }
    sort(v.begin(), v.end());
    int bestValue = v[0], bestCount = 0;
    for (int value : v) {
        int c = count(v.begin(), v.end(), value);
        if (c > bestCount) {
            bestCount = c;
            bestValue = value;
        }
    }
    cout << "Mode: " << bestValue << endl;
    cout << "Count: " << bestCount << endl;`),
  'cppp3-bylength': PA(String.raw`    vector<string> words;
    string w;
    while (cin >> w) {
        words.push_back(w);
    }
    stable_sort(words.begin(), words.end(), [](string a, string b) {
        return a.length() < b.length();
    });
    for (int i = 0; i < words.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << words[i];
    }
    cout << endl;`),

  // Lesson 4: references
  'cppp4-swap': PRF(String.raw`void exchange(int &x, int &y) {
    int temp = x;
    x = y;
    y = temp;
}`, String.raw`    int a, b;
    cin >> a >> b;
    cout << "Before: " << a << " " << b << endl;
    exchange(a, b);
    cout << "After: " << a << " " << b << endl;`),
  'cppp4-stats': PRF(String.raw`void stats(const vector<int> &v, int &total, int &highest) {
    total = 0;
    highest = v[0];
    for (int x : v) {
        total += x;
        if (x > highest) {
            highest = x;
        }
    }
}`, String.raw`    vector<int> v;
    int x;
    while (cin >> x) {
        v.push_back(x);
    }
    int total, highest;
    stats(v, total, highest);
    cout << "Total: " << total << endl;
    cout << "Highest: " << highest << endl;`),
  'cppp4-double': PRF(String.raw`void doubleAll(vector<int> &v) {
    for (int &n : v) {
        n = n * 2;
    }
}`, String.raw`    vector<int> v;
    int x;
    while (cin >> x) {
        v.push_back(x);
    }
    doubleAll(v);
    for (int i = 0; i < v.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << v[i];
    }
    cout << endl;`),
  'cppp4-shout': PRF(String.raw`void shout(string &s) {
    for (char &c : s) {
        c = toupper(c);
    }
}`, String.raw`    string line;
    getline(cin, line);
    shout(line);
    cout << line << endl;`),

  // Lesson 5: structs and enum class
  'cppp5-menu': PSF(String.raw`struct Dish {
    string name;
    int price;
};`, String.raw`    vector<Dish> dishes;
    string name;
    int price;
    while (cin >> name >> price) {
        dishes.push_back({name, price});
    }
    int cheapest = 0, priciest = 0;
    for (int i = 1; i < dishes.size(); i++) {
        if (dishes[i].price < dishes[cheapest].price) {
            cheapest = i;
        }
        if (dishes[i].price > dishes[priciest].price) {
            priciest = i;
        }
    }
    cout << "Cheapest: " << dishes[cheapest].name << " (" << dishes[cheapest].price << ")" << endl;
    cout << "Priciest: " << dishes[priciest].name << " (" << dishes[priciest].price << ")" << endl;`),
  'cppp5-receipt': PSF(String.raw`struct Line {
    string name;
    int qty;
    int price;
};`, String.raw`    vector<Line> lines;
    string name;
    int qty, price;
    while (cin >> name >> qty >> price) {
        lines.push_back({name, qty, price});
    }
    int total = 0;
    for (const Line &l : lines) {
        int amount = l.qty * l.price;
        cout << l.name << " x" << l.qty << " = " << amount << endl;
        total += amount;
    }
    cout << "Total: " << total << endl;`),
  'cppp5-sortprice': PSF(String.raw`struct Dish {
    string name;
    int price;
};`, String.raw`    vector<Dish> dishes;
    string name;
    int price;
    while (cin >> name >> price) {
        dishes.push_back({name, price});
    }
    stable_sort(dishes.begin(), dishes.end(), [](const Dish &a, const Dish &b) {
        return a.price < b.price;
    });
    for (int i = 0; i < dishes.size(); i++) {
        if (i > 0) {
            cout << " ";
        }
        cout << dishes[i].name;
    }
    cout << endl;`),
  'cppp5-grade': PSF(String.raw`enum class Grade { Fail, Pass, Merit, Distinction };

Grade gradeOf(int mark) {
    if (mark < 50) {
        return Grade::Fail;
    } else if (mark < 70) {
        return Grade::Pass;
    } else if (mark < 85) {
        return Grade::Merit;
    }
    return Grade::Distinction;
}

string gradeName(Grade g) {
    switch (g) {
        case Grade::Fail:
            return "Fail";
        case Grade::Pass:
            return "Pass";
        case Grade::Merit:
            return "Merit";
        case Grade::Distinction:
            return "Distinction";
    }
    return "?";
}`, String.raw`    int mark;
    cin >> mark;
    cout << gradeName(gradeOf(mark)) << endl;`),

  // Lesson 6: the ledger project
  'cppp6-ledger': PLF(String.raw`struct Entry {
    string customer;
    int amount;
};

int grandTotal(const vector<Entry> &ledger) {
    int total = 0;
    for (const Entry &e : ledger) {
        total += e.amount;
    }
    return total;
}

int totalFor(const vector<Entry> &ledger, const string &customer) {
    int total = 0;
    for (const Entry &e : ledger) {
        if (e.customer == customer) {
            total += e.amount;
        }
    }
    return total;
}

void listBiggestFirst(const vector<Entry> &ledger) {
    if (ledger.empty()) {
        cout << "No entries" << endl;
        return;
    }
    vector<Entry> sorted = ledger;
    stable_sort(sorted.begin(), sorted.end(), [](const Entry &a, const Entry &b) {
        return a.amount > b.amount;
    });
    for (const Entry &e : sorted) {
        cout << e.customer << " " << e.amount << endl;
    }
}`, String.raw`    vector<Entry> ledger;
    string cmd;
    while (cin >> cmd && cmd != "quit") {
        if (cmd == "add") {
            string customer;
            int amount;
            cin >> customer >> amount;
            ledger.push_back({customer, amount});
            cout << "Added " << customer << " " << amount << endl;
        } else if (cmd == "total") {
            cout << "Total: " << grandTotal(ledger) << endl;
        } else if (cmd == "who") {
            string customer;
            cin >> customer;
            cout << customer << ": " << totalFor(ledger, customer) << endl;
        } else if (cmd == "list") {
            listBiggestFirst(ledger);
        } else {
            cout << "Unknown command: " << cmd << endl;
        }
    }
    cout << "Entries: " << ledger.size() << endl;`),
  'cppp6-report': PLF(String.raw`struct Customer {
    string name;
    int total;
    int entries;
};`, String.raw`    vector<Customer> customers;
    string name;
    int amount;
    int grand = 0;
    while (cin >> name >> amount) {
        grand += amount;
        bool found = false;
        for (Customer &c : customers) {
            if (c.name == name) {
                c.total += amount;
                c.entries++;
                found = true;
            }
        }
        if (!found) {
            customers.push_back({name, amount, 1});
        }
    }
    for (const Customer &c : customers) {
        cout << c.name << " total=" << c.total << " entries=" << c.entries << endl;
    }
    cout << "Customers: " << customers.size() << endl;
    cout << "Grand total: " << grand << endl;`),
};
