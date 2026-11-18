// Reference solutions for the C++ Pro course (real C++, see docs/CPP-PRO-TRACK.md). Every exercise must have one
// here, it must pass all its tests on the real compiler, and the starter must NOT pass.
import { progPro } from '../src/content/cpp-pro/shared.js';

const P = (body) => progPro(body);

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
};
