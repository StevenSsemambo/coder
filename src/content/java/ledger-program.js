// The Village SACCO ledger (Level 2 project, lesson 15).
// The lesson and its exercises all build on this one program, so it is generated from one place:
// the lesson uses it as it is, an exercise starter plugs a TODO into it, and the reference solution plugs in the answer.
//
//   extraMethods: extra static methods (indented by 4 spaces), placed before main
//   extraCases:   extra `case "X" -> { ... }` blocks for the switch (indented by 16 spaces), placed before `default`

/** One report row exactly as the program prints it: name padded to 10, balance right-aligned in 10. */
export const row = (name, balance) => name.padEnd(10) + String(balance).padStart(10);

export const ledgerProgram = ({ extraMethods = '', extraCases = '' } = {}) => String.raw`import java.util.Scanner;

public class Main {
    static int findMember(String[] names, int count, String name) {
        for (int i = 0; i < count; i++) {
            if (names[i].equalsIgnoreCase(name)) {
                return i;
            }
        }
        return -1;
    }

    static void report(String[] names, int[] balances, int count) {
        int total = 0;
        int best = 0;
        System.out.println("=== SACCO REPORT ===");
        for (int i = 0; i < count; i++) {
            System.out.printf("%-10s%10d%n", names[i], balances[i]);
            total += balances[i];
            if (balances[i] > balances[best]) {
                best = i;
            }
        }
        System.out.println("Members: " + count);
        System.out.println("Total: " + total);
        if (count > 0) {
            System.out.println("Top saver: " + names[best]);
        }
    }
${extraMethods ? `\n${extraMethods}\n` : ''}
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String[] names = new String[10];
        int[] balances = new int[10];
        int count = 0;
        while (in.hasNext()) {
            String command = in.next().toUpperCase();
            if (command.equals("QUIT")) {
                System.out.println("Goodbye");
                break;
            }
            switch (command) {
                case "JOIN" -> {
                    String name = in.next();
                    int start = in.nextInt();
                    if (findMember(names, count, name) >= 0) {
                        System.out.println("Member already exists: " + name);
                    } else if (count == names.length) {
                        System.out.println("SACCO is full");
                    } else {
                        names[count] = name;
                        balances[count] = start;
                        count++;
                        System.out.println("Welcome, " + name + " (balance " + start + ")");
                    }
                }
                case "DEPOSIT", "WITHDRAW" -> {
                    String name = in.next();
                    int amount = in.nextInt();
                    int i = findMember(names, count, name);
                    if (i < 0) {
                        System.out.println("No such member: " + name);
                    } else if (amount <= 0) {
                        System.out.println("Invalid amount");
                    } else if (command.equals("DEPOSIT")) {
                        balances[i] += amount;
                        System.out.println("Deposited " + amount + ". New balance: " + balances[i]);
                    } else if (amount > balances[i]) {
                        System.out.println("Insufficient funds. Balance: " + balances[i]);
                    } else {
                        balances[i] -= amount;
                        System.out.println("Withdrew " + amount + ". New balance: " + balances[i]);
                    }
                }
                case "BALANCE" -> {
                    String name = in.next();
                    int i = findMember(names, count, name);
                    if (i < 0) {
                        System.out.println("No such member: " + name);
                    } else {
                        System.out.println(names[i] + ": " + balances[i]);
                    }
                }
                case "REPORT" -> report(names, balances, count);
${extraCases ? `${extraCases}\n` : ''}                default -> System.out.println("Unknown command: " + command);
            }
        }
    }
}
`;
