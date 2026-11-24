// Reference solutions for the C++ Pro course (real C++, see docs/CPP-PRO-TRACK.md). Every exercise must have one
// here, it must pass all its tests on the real compiler, and the starter must NOT pass.
import { progPro, progProFn } from '../src/content/cpp-pro/shared.js';
import { SHOP_PARTS } from '../src/content/cpp-pro/shop.js';

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
const INC_C = '#include <iostream>\n#include <string>\n#include <vector>';
const PCF = (above, body, inc = INC_C) => progProFn(above, body, inc);
const INC_KM = INC_C + '\n#include <cmath>\n#include <iomanip>';
const INC_E = '#include <iostream>\n#include <string>\n#include <vector>';
const INC_EF = INC_E + '\n#include <iomanip>\n#include <algorithm>';
const PEF = (above, body, inc = INC_E) => progProFn(above, body, inc);
const INC_O = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';
const INC_OF = INC_O + '\n#include <iomanip>';
const POF = (above, body, inc = INC_O) => progProFn(above, body, inc);
const INC_I = '#include <iostream>\n#include <string>\n#include <vector>';
const PIF = (above, body, inc = INC_I) => progProFn(above, body, inc);
const INC_P = '#include <iostream>\n#include <string>\n#include <vector>\n#include <iomanip>';
const PPF = (above, body, inc = INC_P) => progProFn(above, body, inc);
const INC_D = '#include <iostream>\n#include <string>\n#include <vector>';
const INC_DF = INC_D + '\n#include <iomanip>';
const PDF = (above, body, inc = INC_D) => progProFn(above, body, inc);
const INC_SH = '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>';
const PSH = (above, body) => progProFn(above, body, INC_SH);
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

  // Lesson 7: classes
  'cppp7-counter': PCF(String.raw`class Counter {
    int count = 0;
public:
    void increment() { count++; }
    void decrement() {
        if (count > 0) {
            count--;
        }
    }
    void reset() { count = 0; }
    int value() const { return count; }
};`, String.raw`    Counter c;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "inc") {
            c.increment();
        } else if (cmd == "dec") {
            c.decrement();
        } else if (cmd == "reset") {
            c.reset();
        } else if (cmd == "show") {
            cout << "Count: " << c.value() << endl;
        }
    }`),
  'cppp7-account': PCF(String.raw`class Account {
    int money = 0;
public:
    void deposit(int amount) { money += amount; }
    bool withdraw(int amount) {
        if (amount > money) {
            return false;
        }
        money -= amount;
        return true;
    }
    int balance() const { return money; }
};`, String.raw`    Account acc;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "dep") {
            int n;
            cin >> n;
            acc.deposit(n);
        } else if (cmd == "wd") {
            int n;
            cin >> n;
            cout << (acc.withdraw(n) ? "Done" : "Refused") << endl;
        } else if (cmd == "bal") {
            cout << "Balance: " << acc.balance() << endl;
        }
    }`),
  'cppp7-rectangle': PCF(String.raw`class Rectangle {
    int w, h;
public:
    Rectangle(int width, int height) : w(width), h(height) {}
    int area() const { return w * h; }
    int perimeter() const { return 2 * (w + h); }
    bool isSquare() const { return w == h; }
};`, String.raw`    int w, h;
    while (cin >> w >> h) {
        Rectangle r(w, h);
        cout << "Area " << r.area() << " Perimeter " << r.perimeter() << " Square " << (r.isSquare() ? "yes" : "no") << endl;
    }`),
  'cppp7-stock': PCF(String.raw`class Product {
    string name;
    int stock;
    int price;
public:
    Product(string n, int s, int p) : name(n), stock(s), price(p) {}
    int sell(int qty) {
        if (qty > stock) {
            return -1;
        }
        stock -= qty;
        return qty * price;
    }
    int left() const { return stock; }
};`, String.raw`    string name;
    int stock, price;
    cin >> name >> stock >> price;
    Product p(name, stock, price);
    string cmd;
    int qty;
    while (cin >> cmd >> qty) {
        int earned = p.sell(qty);
        if (earned < 0) {
            cout << "Not enough stock" << endl;
        } else {
            cout << "Sold " << qty << " for " << earned << endl;
        }
    }
    cout << "Left: " << p.left() << endl;`),

  // Lesson 8: constructors and destructors
  'cppp8-greeter': PCF(String.raw`class Greeter {
    string name;
public:
    Greeter(string n) : name(n) {
        cout << "Hello " << name << endl;
    }
    ~Greeter() {
        cout << "Bye " << name << endl;
    }
};`, String.raw`    string n1, n2, n3;
    cin >> n1 >> n2 >> n3;
    Greeter g1(n1);
    Greeter g2(n2);
    Greeter g3(n3);
    cout << "end" << endl;`),
  'cppp8-ticket': PCF(String.raw`class Ticket {
    static inline int issued = 0;
    const int id;
public:
    Ticket() : id(++issued) {}
    int number() const { return id; }
    static int total() { return issued; }
};`, String.raw`    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        Ticket t;
        cout << "Ticket " << t.number() << endl;
    }
    cout << "Issued: " << Ticket::total() << endl;`),
  'cppp8-path': PCF(String.raw`class Point {
    double x, y;
public:
    Point() : x(0), y(0) {}
    Point(double px, double py) : x(px), y(py) {}
    double distanceTo(const Point &other) const {
        double dx = x - other.x;
        double dy = y - other.y;
        return sqrt(dx * dx + dy * dy);
    }
};`, String.raw`    vector<Point> points;
    double x, y;
    while (cin >> x >> y) {
        points.push_back(Point(x, y));
    }
    double length = 0;
    for (int i = 1; i < points.size(); i++) {
        length += points[i - 1].distanceTo(points[i]);
    }
    cout << "Points: " << points.size() << endl;
    cout << fixed << setprecision(2);
    cout << "Path length: " << length << endl;`, INC_KM),

  // Lesson 9: encapsulation
  'cppp9-wallet': PEF(String.raw`class Wallet {
    int balance = 0;
    int withdrawnToday = 0;
public:
    bool deposit(int amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }
    // 0 = ok, 1 = invalid, 2 = insufficient, 3 = limit
    int withdraw(int amount) {
        if (amount <= 0) {
            return 1;
        }
        if (amount > balance) {
            return 2;
        }
        if (withdrawnToday + amount > 50000) {
            return 3;
        }
        balance -= amount;
        withdrawnToday += amount;
        return 0;
    }
    int getBalance() const { return balance; }
};`, String.raw`    Wallet w;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "dep") {
            int n;
            cin >> n;
            cout << (w.deposit(n) ? "OK" : "Invalid amount") << endl;
        } else if (cmd == "wd") {
            int n;
            cin >> n;
            int r = w.withdraw(n);
            if (r == 0) {
                cout << "OK" << endl;
            } else if (r == 1) {
                cout << "Invalid amount" << endl;
            } else if (r == 2) {
                cout << "Insufficient funds" << endl;
            } else {
                cout << "Daily limit reached" << endl;
            }
        } else if (cmd == "bal") {
            cout << "Balance: " << w.getBalance() << endl;
        }
    }`),
  'cppp9-percent': PEF(String.raw`class Percent {
    int value = 0;
public:
    void set(int v) {
        if (v < 0) {
            value = 0;
        } else if (v > 100) {
            value = 100;
        } else {
            value = v;
        }
    }
    void add(int n) { set(value + n); }
    int get() const { return value; }
};`, String.raw`    Percent p;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "set") {
            int n;
            cin >> n;
            p.set(n);
        } else if (cmd == "add") {
            int n;
            cin >> n;
            p.add(n);
        } else if (cmd == "show") {
            cout << "Percent: " << p.get() << endl;
        }
    }`),
  'cppp9-marks': PEF(String.raw`class MarkBook {
    vector<int> marks;
public:
    bool add(int m) {
        if (m < 0 || m > 100) {
            return false;
        }
        marks.push_back(m);
        return true;
    }
    int count() const { return marks.size(); }
    double average() const {
        if (marks.empty()) {
            return 0;
        }
        int total = 0;
        for (int m : marks) {
            total += m;
        }
        return (double)total / marks.size();
    }
    int highest() const {
        int best = 0;
        for (int m : marks) {
            if (m > best) {
                best = m;
            }
        }
        return best;
    }
};`, String.raw`    MarkBook book;
    int m;
    while (cin >> m) {
        if (!book.add(m)) {
            cout << "Rejected " << m << endl;
        }
    }
    cout << "Count: " << book.count() << endl;
    cout << fixed << setprecision(2);
    cout << "Average: " << book.average() << endl;
    cout << "Highest: " << book.highest() << endl;`, INC_EF),
  'cppp9-shelf': PEF(String.raw`class Shelf {
    static const int CAPACITY = 100;
    int count = 0;
public:
    bool add(int n) {
        if (count + n > CAPACITY) {
            return false;
        }
        count += n;
        return true;
    }
    bool remove(int n) {
        if (n > count) {
            return false;
        }
        count -= n;
        return true;
    }
    int items() const { return count; }
};`, String.raw`    Shelf shelf;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "add") {
            int n;
            cin >> n;
            cout << (shelf.add(n) ? "Added" : "Shelf full") << endl;
        } else if (cmd == "remove") {
            int n;
            cin >> n;
            cout << (shelf.remove(n) ? "Removed" : "Not enough") << endl;
        } else if (cmd == "show") {
            cout << "Items: " << shelf.items() << endl;
        }
    }`),

  // Lesson 10: operator overloading
  'cppp10-money': POF(String.raw`class Money {
    int ugx;
public:
    Money(int u = 0) : ugx(u) {}
    int value() const { return ugx; }
    Money operator+(const Money &o) const { return Money(ugx + o.ugx); }
    bool operator<(const Money &o) const { return ugx < o.ugx; }
};

ostream &operator<<(ostream &out, const Money &m) {
    out << m.value() << " UGX";
    return out;
}`, String.raw`    Money total, biggest;
    int x;
    while (cin >> x) {
        Money m(x);
        total = total + m;
        if (biggest < m) {
            biggest = m;
        }
    }
    cout << "Total: " << total << endl;
    cout << "Biggest: " << biggest << endl;`),
  'cppp10-fraction': POF(String.raw`int gcdOf(int a, int b) {
    if (b == 0) {
        return a;
    }
    return gcdOf(b, a % b);
}

class Fraction {
    int num, den;
public:
    Fraction(int n, int d) {
        int g = gcdOf(n, d);
        num = n / g;
        den = d / g;
    }
    int numerator() const { return num; }
    int denominator() const { return den; }
    Fraction operator+(const Fraction &o) const {
        return Fraction(num * o.den + o.num * den, den * o.den);
    }
    Fraction operator*(const Fraction &o) const {
        return Fraction(num * o.num, den * o.den);
    }
};

ostream &operator<<(ostream &out, const Fraction &f) {
    out << f.numerator() << "/" << f.denominator();
    return out;
}`, String.raw`    int a, b, c, d;
    cin >> a >> b >> c >> d;
    Fraction x(a, b), y(c, d);
    cout << "Sum: " << x + y << endl;
    cout << "Product: " << x * y << endl;`),
  'cppp10-time': POF(String.raw`class Time {
    int minutes;
public:
    Time(int h, int m) {
        minutes = (h * 60 + m) % (24 * 60);
    }
    int hours() const { return minutes / 60; }
    int mins() const { return minutes % 60; }
    Time operator+(int extra) const {
        return Time(0, minutes + extra);
    }
};

ostream &operator<<(ostream &out, const Time &t) {
    out << setfill('0') << setw(2) << t.hours() << ":" << setw(2) << t.mins();
    return out;
}`, String.raw`    int h, m, add;
    cin >> h >> m >> add;
    Time t(h, m);
    cout << t + add << endl;`, INC_OF),
  'cppp10-sort': POF(String.raw`class Money {
    int amount;
public:
    Money(int a) : amount(a) {}
    int value() const { return amount; }
    bool operator<(const Money &other) const { return amount < other.amount; }
};`, String.raw`    vector<Money> v;
    int x;
    while (cin >> x) {
        v.push_back(Money(x));
    }
    sort(v.begin(), v.end());
    cout << "Sorted:";
    for (const Money &m : v) {
        cout << " " << m.value();
    }
    cout << endl;`),

  // Lesson 11: inheritance
  'cppp11-vehicles': PIF(String.raw`class Vehicle {
protected:
    string kind, name;
    int wheels;
public:
    Vehicle(string k, string n, int w) : kind(k), name(n), wheels(w) {}
    string describe() const {
        return name + " (" + kind + ", " + to_string(wheels) + " wheels)";
    }
};

class Boda : public Vehicle {
public:
    Boda(string n) : Vehicle("boda", n, 2) {}
    int fare(int km) const { return 2000 + 1000 * km; }
};

class Taxi : public Vehicle {
public:
    Taxi(string n) : Vehicle("taxi", n, 4) {}
    int fare(int km) const { return 5000 + 1500 * km; }
};

class Lorry : public Vehicle {
public:
    Lorry(string n) : Vehicle("lorry", n, 6) {}
    int fare(int km) const { return 10000 + 2500 * km; }
};`, String.raw`    string kind, name;
    int km;
    while (cin >> kind >> name >> km) {
        if (kind == "boda") {
            Boda v(name);
            cout << v.describe() << ": " << v.fare(km) << endl;
        } else if (kind == "taxi") {
            Taxi v(name);
            cout << v.describe() << ": " << v.fare(km) << endl;
        } else if (kind == "lorry") {
            Lorry v(name);
            cout << v.describe() << ": " << v.fare(km) << endl;
        }
    }`),
  'cppp11-staff': PIF(String.raw`class Employee {
protected:
    string name;
public:
    Employee(string n) : name(n) {}
    string getName() const { return name; }
    int pay() const { return 300000; }
};

class Cashier : public Employee {
    int tills;
public:
    Cashier(string n, int t) : Employee(n), tills(t) {}
    int total() const { return pay() + 1000 * tills; }
};

class Manager : public Employee {
    int team;
public:
    Manager(string n, int t) : Employee(n), team(t) {}
    int total() const { return pay() + 20000 * team; }
};`, String.raw`    string kind, name;
    int n;
    while (cin >> kind >> name >> n) {
        if (kind == "cashier") {
            Cashier c(name, n);
            cout << c.getName() << " earns " << c.total() << endl;
        } else if (kind == "manager") {
            Manager m(name, n);
            cout << m.getName() << " earns " << m.total() << endl;
        }
    }`),
  'cppp11-layers': PIF(String.raw`class Person {
protected:
    string name;
public:
    Person(string n) : name(n) { cout << "Person " << name << endl; }
    ~Person() { cout << "~Person " << name << endl; }
};

class Student : public Person {
public:
    Student(string n) : Person(n) { cout << "Student " << name << endl; }
    ~Student() { cout << "~Student " << name << endl; }
};

class Prefect : public Student {
public:
    Prefect(string n) : Student(n) { cout << "Prefect " << name << endl; }
    ~Prefect() { cout << "~Prefect " << name << endl; }
};`, String.raw`    string name;
    cin >> name;
    Prefect p(name);
    cout << "done" << endl;`),

  // Lesson 12: polymorphism
  'cppp12-shapes': PPF(String.raw`class Shape {
public:
    virtual double area() const = 0;
    virtual string name() const = 0;
    virtual ~Shape() {}
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
    string name() const override { return "Rectangle"; }
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
    string name() const override { return "Circle"; }
};

class Triangle : public Shape {
    double b, h;
public:
    Triangle(double b, double h) : b(b), h(h) {}
    double area() const override { return 0.5 * b * h; }
    string name() const override { return "Triangle"; }
};`, String.raw`    vector<Shape *> shapes;
    string kind;
    while (cin >> kind) {
        if (kind == "rect") {
            double w, h;
            cin >> w >> h;
            shapes.push_back(new Rectangle(w, h));
        } else if (kind == "circle") {
            double r;
            cin >> r;
            shapes.push_back(new Circle(r));
        } else if (kind == "tri") {
            double b, h;
            cin >> b >> h;
            shapes.push_back(new Triangle(b, h));
        }
    }
    cout << fixed << setprecision(2);
    double total = 0;
    for (const Shape *s : shapes) {
        cout << s->name() << " area " << s->area() << endl;
        total += s->area();
    }
    cout << "Total area " << total << endl;
    for (Shape *s : shapes) {
        delete s;
    }`),
  'cppp12-payroll': PPF(String.raw`class Worker {
protected:
    string name;
public:
    Worker(string n) : name(n) {}
    string getName() const { return name; }
    virtual int pay() const = 0;
    virtual ~Worker() {}
};

class Salaried : public Worker {
    int amount;
public:
    Salaried(string n, int a) : Worker(n), amount(a) {}
    int pay() const override { return amount; }
};

class Hourly : public Worker {
    int rate, hours;
public:
    Hourly(string n, int r, int h) : Worker(n), rate(r), hours(h) {}
    int pay() const override { return rate * hours; }
};

class Commission : public Worker {
    int base, sales;
public:
    Commission(string n, int b, int s) : Worker(n), base(b), sales(s) {}
    int pay() const override { return base + sales * 5 / 100; }
};`, String.raw`    vector<Worker *> workers;
    string kind, name;
    while (cin >> kind >> name) {
        if (kind == "salaried") {
            int a;
            cin >> a;
            workers.push_back(new Salaried(name, a));
        } else if (kind == "hourly") {
            int r, h;
            cin >> r >> h;
            workers.push_back(new Hourly(name, r, h));
        } else if (kind == "commission") {
            int b, s;
            cin >> b >> s;
            workers.push_back(new Commission(name, b, s));
        }
    }
    int total = 0;
    for (const Worker *w : workers) {
        cout << w->getName() << ": " << w->pay() << endl;
        total += w->pay();
    }
    cout << "Total: " << total << endl;
    for (Worker *w : workers) {
        delete w;
    }`),
  'cppp12-notify': PPF(String.raw`class Notifier {
public:
    virtual string format(const string &msg) const = 0;
    virtual ~Notifier() {}
};

class Sms : public Notifier {
public:
    string format(const string &msg) const override { return "[SMS] " + msg; }
};

class Email : public Notifier {
public:
    string format(const string &msg) const override { return "[Email] " + msg + " -- Mama Rose"; }
};

class WhatsApp : public Notifier {
public:
    string format(const string &msg) const override { return "[WA] " + msg; }
};

void deliver(const Notifier &n, const string &msg) {
    cout << n.format(msg) << endl;
}`, String.raw`    string channel, msg;
    while (cin >> channel >> msg) {
        if (channel == "sms") {
            Sms s;
            deliver(s, msg);
        } else if (channel == "email") {
            Email e;
            deliver(e, msg);
        } else if (channel == "wa") {
            WhatsApp w;
            deliver(w, msg);
        }
    }`),
  'cppp12-discount': PPF(String.raw`class Discount {
public:
    virtual int apply(int price) const = 0;
    virtual ~Discount() {}
};

class NoDiscount : public Discount {
public:
    int apply(int price) const override { return price; }
};

class PercentOff : public Discount {
    int percent;
public:
    PercentOff(int p) : percent(p) {}
    int apply(int price) const override { return price * (100 - percent) / 100; }
};

class FlatOff : public Discount {
    int amount;
public:
    FlatOff(int a) : amount(a) {}
    int apply(int price) const override {
        int result = price - amount;
        return result < 0 ? 0 : result;
    }
};`, String.raw`    string kind;
    while (cin >> kind) {
        int price;
        if (kind == "none") {
            cin >> price;
            NoDiscount d;
            cout << d.apply(price) << endl;
        } else if (kind == "percent") {
            int p;
            cin >> p >> price;
            PercentOff d(p);
            cout << d.apply(price) << endl;
        } else if (kind == "flat") {
            int f;
            cin >> f >> price;
            FlatOff d(f);
            cout << d.apply(price) << endl;
        }
    }`),

  // Lesson 13: design with objects
  'cppp13-stack': PDF(String.raw`class Stack {
    vector<int> items;
public:
    void push(int x) { items.push_back(x); }
    bool pop() {
        if (items.empty()) {
            return false;
        }
        items.pop_back();
        return true;
    }
    int top() const { return items.back(); }
    bool empty() const { return items.empty(); }
    int size() const { return items.size(); }
};`, String.raw`    Stack s;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "push") {
            int n;
            cin >> n;
            s.push(n);
        } else if (cmd == "pop") {
            if (!s.pop()) {
                cout << "Empty" << endl;
            }
        } else if (cmd == "top") {
            if (s.empty()) {
                cout << "Empty" << endl;
            } else {
                cout << s.top() << endl;
            }
        } else if (cmd == "size") {
            cout << "Size: " << s.size() << endl;
        }
    }`),
  'cppp13-library': PDF(String.raw`class Book {
    string title;
    bool available = true;
public:
    Book(string t) : title(t) {}
    string getTitle() const { return title; }
    bool isAvailable() const { return available; }
    void take() { available = false; }
    void giveBack() { available = true; }
};

class Library {
    vector<Book> books;
    int find(const string &title) const {
        for (int i = 0; i < books.size(); i++) {
            if (books[i].getTitle() == title) {
                return i;
            }
        }
        return -1;
    }
public:
    void add(string title) { books.push_back(Book(title)); }
    // 0 = ok, 1 = out, 2 = no such book
    int borrow(const string &title) {
        int i = find(title);
        if (i < 0) {
            return 2;
        }
        if (!books[i].isAvailable()) {
            return 1;
        }
        books[i].take();
        return 0;
    }
    bool giveBack(const string &title) {
        int i = find(title);
        if (i < 0 || books[i].isAvailable()) {
            return false;
        }
        books[i].giveBack();
        return true;
    }
    int available() const {
        int n = 0;
        for (const Book &b : books) {
            if (b.isAvailable()) {
                n++;
            }
        }
        return n;
    }
};`, String.raw`    Library lib;
    string cmd, title;
    while (cin >> cmd) {
        if (cmd == "count") {
            cout << "Available: " << lib.available() << endl;
            continue;
        }
        cin >> title;
        if (cmd == "add") {
            lib.add(title);
            cout << "Added " << title << endl;
        } else if (cmd == "borrow") {
            int r = lib.borrow(title);
            if (r == 0) {
                cout << "Borrowed " << title << endl;
            } else if (r == 1) {
                cout << title << " is out" << endl;
            } else {
                cout << "No such book" << endl;
            }
        } else if (cmd == "return") {
            if (lib.giveBack(title)) {
                cout << "Returned " << title << endl;
            } else {
                cout << "Cannot return " << title << endl;
            }
        }
    }`),
  'cppp13-cart': PDF(String.raw`struct Line {
    string name;
    int qty;
    int price;
};

class Cart {
    vector<Line> lines;
public:
    void add(const string &name, int qty, int price) {
        for (Line &l : lines) {
            if (l.name == name) {
                l.qty += qty;
                return;
            }
        }
        lines.push_back({name, qty, price});
    }
    void remove(const string &name) {
        for (int i = 0; i < lines.size(); i++) {
            if (lines[i].name == name) {
                lines.erase(lines.begin() + i);
                return;
            }
        }
    }
    int total() const {
        int sum = 0;
        for (const Line &l : lines) {
            sum += l.qty * l.price;
        }
        return sum;
    }
    void show() const {
        if (lines.empty()) {
            cout << "Empty" << endl;
            return;
        }
        for (const Line &l : lines) {
            cout << l.name << " x" << l.qty << endl;
        }
    }
};`, String.raw`    Cart cart;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "add") {
            string name;
            int qty, price;
            cin >> name >> qty >> price;
            cart.add(name, qty, price);
        } else if (cmd == "remove") {
            string name;
            cin >> name;
            cart.remove(name);
        } else if (cmd == "total") {
            cout << "Total: " << cart.total() << endl;
        } else if (cmd == "show") {
            cart.show();
        }
    }`),
  'cppp13-classroom': PDF(String.raw`class Student {
    string name;
    vector<int> marks;
public:
    Student(string n) : name(n) {}
    string getName() const { return name; }
    void addMark(int m) { marks.push_back(m); }
    int total() const {
        int t = 0;
        for (int m : marks) {
            t += m;
        }
        return t;
    }
    int count() const { return marks.size(); }
    double average() const {
        if (marks.empty()) {
            return 0.0;
        }
        return (double)total() / count();
    }
};

class Classroom {
    vector<Student> students;
public:
    void addStudent(string name) { students.push_back(Student(name)); }
    bool addMark(const string &name, int m) {
        for (Student &s : students) {
            if (s.getName() == name) {
                s.addMark(m);
                return true;
            }
        }
        return false;
    }
    void report() const {
        cout << fixed << setprecision(2);
        int total = 0, count = 0;
        for (const Student &s : students) {
            cout << s.getName() << ": " << s.average() << endl;
            total += s.total();
            count += s.count();
        }
        double avg = count == 0 ? 0.0 : (double)total / count;
        cout << "Class average: " << avg << endl;
    }
};`, String.raw`    Classroom room;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "student") {
            string name;
            cin >> name;
            room.addStudent(name);
        } else if (cmd == "mark") {
            string name;
            int m;
            cin >> name >> m;
            if (!room.addMark(name, m)) {
                cout << "No such student" << endl;
            }
        } else if (cmd == "report") {
            room.report();
        }
    }`, INC_DF),

  // Lesson 14: the shop project
  'cppp14-shop': SHOP_PARTS.HEAD + SHOP_PARTS.INVENTORY + SHOP_PARTS.CART + SHOP_PARTS.DISCOUNT + SHOP_PARTS.MAIN3,
  'cppp14-sales': PSH(String.raw`struct Total {
    string name;
    int qty;
    int revenue;
};

class SalesLog {
    vector<Total> totals;
public:
    void record(const string &name, int qty, int price) {
        for (Total &t : totals) {
            if (t.name == name) {
                t.qty += qty;
                t.revenue += qty * price;
                return;
            }
        }
        totals.push_back({name, qty, qty * price});
    }
    void report() const {
        if (totals.empty()) {
            cout << "No sales" << endl;
            return;
        }
        vector<Total> sorted = totals;
        stable_sort(sorted.begin(), sorted.end(), [](const Total &a, const Total &b) {
            return a.revenue > b.revenue;
        });
        int total = 0;
        for (const Total &t : sorted) {
            cout << t.name << " qty=" << t.qty << " revenue=" << t.revenue << endl;
            total += t.revenue;
        }
        cout << "Total revenue: " << total << endl;
        cout << "Best seller: " << sorted[0].name << endl;
    }
};`, String.raw`    SalesLog log;
    string cmd;
    while (cin >> cmd) {
        if (cmd == "sale") {
            string name;
            int qty, price;
            cin >> name >> qty >> price;
            log.record(name, qty, price);
        } else if (cmd == "report") {
            log.report();
        }
    }`),
};
