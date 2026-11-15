// Java runtime probe (Java track). Runs real programs through the candidate Java engine
// (@live-codes/java-wasm = OpenJDK javac + TeaVM, compiled to WebAssembly) in Node, and checks
// every claim made in docs/JAVA-TRACK.md. It is NOT part of `npm test` (it is slow and needs the
// engine installed). Re-run it whenever the engine version changes.
//
//   npm install --no-save @live-codes/java-wasm@0.1.0
//   node tests/java-probe.mjs            (about 3 to 4 minutes)
//
// "works" probes must print exactly `expect`. "gap" probes record a known limitation and must keep
// failing in the described way; if one starts to pass, the engine got better: update the doc.
import fs from 'node:fs';
import path from 'node:path';

const DIST = (process.env.JAVA_WASM_DIST || path.resolve('node_modules/@live-codes/java-wasm/dist')).replace(/\\/g, '/').replace(/\/?$/, '/');
if (!fs.existsSync(DIST + 'worker-java.js')) {
  console.error(`Engine not found in ${DIST}\nRun: npm install --no-save @live-codes/java-wasm@0.1.0`);
  process.exit(2);
}
globalThis.self = globalThis;
const realFetch = globalThis.fetch;
globalThis.fetch = async (u, o) => (typeof u === 'string' && !/^https?:/.test(u) ? new Response(fs.readFileSync(u)) : realFetch(u, o));
let waiting;
self.postMessage = (m) => waiting && waiting(m);
await import('file://' + (DIST.startsWith('/') ? '' : '/') + DIST + 'worker-java.js');
const send = (data) => new Promise((res) => { waiting = res; self.onmessage({ data }); });
const init = () => send({ cmd: 'init', baseUrl: DIST + 'teavm/' });
const run = (source, input = '') => send({ cmd: 'run', source, input });

const M = (body, pre = '') => `${pre}\npublic class Main { public static void main(String[] args) throws Exception { ${body} } }`;
const works = [], gaps = [];
const W = (name, source, expect, input) => works.push({ name, source, expect, input });
const G = (name, source, why, check, input) => gaps.push({ name, source, why, check, input });

// ---- things the course can rely on ----
W('hello + Scanner', M('java.util.Scanner s=new java.util.Scanner(System.in); System.out.println("Sum = "+(s.nextInt()+s.nextInt()));'), 'Sum = 42\n', '12 30\n');
W('types, printf, format', M('System.out.printf("%.2f %5d|%-6s|%n", 3.14159, 42, "ab"); System.out.println(String.format("UGX %,d", 1250000)+" "+10/3+" "+10%3+" "+(int)9.99);'), '3.14    42|ab    |\nUGX 1,250,000 3 1 9\n');
W('loops + nested', M('int s=0; for(int i=1;i<=5;i++) s+=i; System.out.println(s); for(int i=1;i<=3;i++){ for(int j=1;j<=i;j++) System.out.print("*"); System.out.println(); }'), '15\n*\n**\n***\n');
W('arrays 1D/2D/sort', M('int[][] g=new int[2][3]; g[1][2]=7; String[] n={"b","a","c"}; java.util.Arrays.sort(n); System.out.println(java.util.Arrays.deepToString(g)+String.join(",",n));'), '[[0, 0, 0], [0, 0, 7]]a,b,c\n');
W('strings + StringBuilder', M('String s="Hello, Uganda"; System.out.println(s.length()+" "+s.substring(7)+" "+s.indexOf("U")+" "+s.replace("l","L")+" "+new StringBuilder("abc").reverse()+" "+"ab".repeat(2));'), '13 Uganda 7 HeLLo, Uganda cba abab\n');
W('static methods, varargs, recursion', `public class Main { static double avg(int... v){ int s=0; for(int x:v) s+=x; return (double)s/v.length; } static int f(int n){ return n<=1?1:n*f(n-1); } public static void main(String[] a){ System.out.println(avg(1,2,3,4)+" "+f(10)); } }`, '2.5 3628800\n');
W('classes, static, exception thrown by us', `public class Main { static class Acc { private double b; static int n=0; Acc(double b){this.b=b; n++;} void dep(double a){ if(a<=0) throw new IllegalArgumentException("bad amount"); b+=a; } public String toString(){ return "UGX "+b; } } public static void main(String[] x){ Acc a=new Acc(1000); a.dep(500); System.out.println(a+" "+Acc.n); try { a.dep(-1); } catch (IllegalArgumentException e) { System.out.println("Caught: "+e.getMessage()); } } }`, 'UGX 1500.0 1\nCaught: bad amount\n');
W('inheritance, abstract, interface default, pattern instanceof', `abstract class Shape { abstract double area(); public String toString(){ return getClass().getSimpleName()+" "+String.format("%.1f",area()); } } class Circle extends Shape { double r; Circle(double r){this.r=r;} double area(){ return Math.PI*r*r; } } interface Pay { double pay(); default String label(){ return "Payable"; } } class Emp implements Pay { public double pay(){ return 5000; } } public class Main { public static void main(String[] a){ Shape s=new Circle(2); System.out.println(s+" "+new Emp().label()); Object o=s; if(o instanceof Circle c) System.out.println(c.r); } }`, 'Circle 12.6 Payable\n2.0\n');
W('inner, anonymous, static nested, equals/hashCode', `class P { int x,y; P(int x,int y){this.x=x;this.y=y;} @Override public boolean equals(Object o){ if(!(o instanceof P)) return false; P p=(P)o; return x==p.x&&y==p.y; } @Override public int hashCode(){ return java.util.Objects.hash(x,y);} } class Outer { int x=5; class In { int v(){ return x*2; } } } public class Main { public static void main(String[] a){ System.out.println(new java.util.HashSet<>(java.util.List.of(new P(1,2),new P(1,2))).size()+" "+new Outer().new In().v()); Runnable r=new Runnable(){ public void run(){ System.out.println("anon"); } }; r.run(); } }`, '1 10\nanon\n');
W('enum, record, switch expression, text block, sealed, pattern switch', `public class Main { enum Day { MON, SAT; boolean weekend(){ return this==SAT; } } record Point(int x,int y){ int sum(){ return x+y; } } public static void main(String[] a){ var d=Day.SAT; String r=switch(d){ case MON -> "weekday"; case SAT -> "weekend"; }; Object o=42; String t=switch(o){ case Integer i when i>40 -> "big"; default -> "other"; }; String tb="""
        Hello
          Block"""; System.out.println(d+" "+d.weekend()+" "+new Point(2,3)+" "+r+" "+t+"\\n"+tb); } }`, 'SAT true Point[x=2, y=3] weekend big\nHello\n  Block\n');
W('collections (List, Map, Set, Deque, Queue)', M('var l=new java.util.ArrayList<String>(java.util.List.of("matooke","rice","beans")); java.util.Collections.sort(l); var m=new java.util.TreeMap<String,Integer>(); m.put("a",1); m.merge("a",5,Integer::sum); var dq=new java.util.ArrayDeque<Integer>(); dq.push(1); dq.push(2); System.out.println(l+" "+m+" "+dq.pop()+" "+new java.util.HashSet<>(java.util.List.of(1,2,2,3)).size());'), '[beans, matooke, rice] {a=6} 2 3\n');
W('lambdas, streams, Optional, Comparator', M('var n=java.util.List.of(5,2,8,1); System.out.println(n.stream().filter(x->x>1).map(x->x*2).sorted().toList()+" "+n.stream().mapToInt(Integer::intValue).sum()+" "+java.util.Optional.of("x").map(String::toUpperCase).orElse("none")); var w=new java.util.ArrayList<>(java.util.List.of("kiwi","fig","banana")); w.sort(java.util.Comparator.comparing(String::length)); System.out.println(w+" "+w.stream().collect(java.util.stream.Collectors.joining(",","[","]")));'), '[4, 10, 16] 16 X\n[fig, kiwi, banana] [fig,kiwi,banana]\n');
W('generics', `import java.util.*; public class Main { static class Box<T extends Comparable<T>> { T v; Box(T v){this.v=v;} boolean bigger(Box<T> o){ return v.compareTo(o.v)>0; } } public static void main(String[] a){ System.out.println(new Box<>(5).bigger(new Box<>(3))); } }`, 'true\n');
W('exceptions we throw or the library throws', `public class Main { static class LowFunds extends Exception { LowFunds(String m){ super(m); } } static void w(int b,int a) throws LowFunds { if(a>b) throw new LowFunds("Need "+(a-b)); } public static void main(String[] x) throws Exception { try { w(100,150); } catch (LowFunds e){ System.out.println("E: "+e.getMessage()); } finally { System.out.println("done"); } try { Integer.parseInt("x1"); } catch (NumberFormatException e){ System.out.println("NFE"); } int z=Integer.parseInt("0"); try { int q=5/z; } catch (ArithmeticException e){ System.out.println("AE "+e.getMessage()); } try { new java.util.ArrayList<Integer>().get(3); } catch (IndexOutOfBoundsException e){ System.out.println("IOOBE"); } try { "abc".charAt(9); } catch (StringIndexOutOfBoundsException e){ System.out.println("SIOOBE"); } try { java.util.Optional.empty().get(); } catch (java.util.NoSuchElementException e){ System.out.println("NSEE"); } try { java.util.Objects.requireNonNull(null,"must not be null"); } catch (NullPointerException e){ System.out.println(e.getMessage()); } try { throw new RuntimeException("x"); } catch (Exception e){ System.out.println(e+" | "+e.getClass().getName()); } } }`, 'E: Need 50\ndone\nNFE\nAE / by zero\nIOOBE\nSIOOBE\nNSEE\nmust not be null\njava.lang.RuntimeException: x | java.lang.RuntimeException\n');
W('try-with-resources', M('try (Res r=new Res("A"); Res q=new Res("B")) { System.out.println("body"); }', `class Res implements AutoCloseable { String n; Res(String n){this.n=n; System.out.println("open "+n);} public void close(){ System.out.println("close "+n);} }`), 'open A\nopen B\nbody\nclose B\nclose A\n');
W('stdin: BufferedReader + Scanner, hasNextInt loop, hasNextLine loop', `import java.io.*; public class Main { public static void main(String[] a) throws IOException { BufferedReader br=new BufferedReader(new InputStreamReader(System.in)); System.out.println("got "+br.readLine()); java.util.Scanner sc=new java.util.Scanner(br); int t=0; while(sc.hasNextInt()) t+=sc.nextInt(); System.out.println(t); } }`, 'got first\n10\n', 'first\n1 2 3 4\n');
W('Math, Random(seed), BigDecimal, BigInteger, wrapper types', M('System.out.println(Math.max(3,9)+" "+Math.pow(2,10)+" "+Math.round(2.5)+" "+(Integer.MAX_VALUE+1)+" "+new java.util.Random(42).nextInt(100)+" "+new java.math.BigDecimal("10.25").add(new java.math.BigDecimal("0.75"))+" "+java.math.BigInteger.valueOf(2).pow(100)+" "+Integer.toBinaryString(10)+" "+(0.1+0.2));'), '9 1024.0 3 -2147483648 53 11.00 1267650600228229401496703205376 1010 0.30000000000000004\n');
W('regex, String.format flags, LocalDate, DateTimeFormatter', M('System.out.println("0772-123456".matches("07\\\\d{2}-\\\\d{6}")+" "+"a1b2".replaceAll("[0-9]","#")+" "+String.format("%,.2f|%08.3f|%+d",1234567.891,3.14159,5)+" "+java.time.LocalDate.of(2026,11,15).getDayOfWeek()+" "+java.time.LocalDateTime.of(2026,11,15,9,5).format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));'), 'true a#b# 1,234,567.89|0003.142|+5 SUNDAY 15/11/2026 09:05\n');
W('threads, synchronized, join, sleep', M('final int[] c={0}; Object lock=new Object(); Thread[] ts=new Thread[4]; for(int i=0;i<4;i++){ ts[i]=new Thread(()->{ for(int k=0;k<1000;k++) synchronized(lock){ c[0]++; } }); ts[i].start(); } for(Thread t:ts) t.join(); Thread.sleep(20); System.out.println(c[0]);'), '4000\n');
W('file I/O in a virtual (in-memory) file system', M('java.io.FileWriter w=new java.io.FileWriter("notes.txt"); w.write("hi\\nthere\\n"); w.close(); java.util.Scanner s=new java.util.Scanner(new java.io.File("notes.txt")); while(s.hasNextLine()) System.out.println(s.nextLine());'), 'hi\nthere\n');
W('unicode output, long overflow, float', M('System.out.println("UGX 5,000 \u2014 M\u00fcller \u2713"); long f=1; for(int i=1;i<=20;i++) f*=i; System.out.println(f+" "+0.1f+0.2f+" "+1.0/0+" "+0.0/0);'), 'UGX 5,000 \u2014 M\u00fcller \u2713\n2432902008176640000 0.10.2 Infinity NaN\n');
W('pure speed: 200 million loop steps', M('long s=0; for(int i=0;i<200_000_000;i++){ s+=i%7; } System.out.println(s);'), '599999994\n');

// ---- known gaps (the doc explains how lessons work around each one) ----
const says = (re) => (r) => re.test((r.stderr || '') + (r.error || ''));
G('array index out of bounds cannot be caught', M('try { int[] a=new int[2]; a[5]=1; } catch (Exception e){ System.out.println("caught"); }'), 'the program dies with a trap; catch never runs', (r) => !r.ok && r.stdout === '' && says(/out of bounds/)(r));
G('null pointer cannot be caught', M('try { String s=null; s.length(); } catch (Exception e){ System.out.println("caught"); }'), 'the program dies with a trap; catch never runs', (r) => !r.ok && says(/null pointer/)(r));
G('bad cast is not detected', M('Object s="a"; Integer i=(Integer)s; System.out.println("no ClassCastException");'), 'no ClassCastException is thrown', (r) => r.ok && /no ClassCastException/.test(r.stdout));
G('stack overflow cannot be caught', `public class Main { static int rec(int n){ return rec(n+1)+1; } public static void main(String[] a){ try { rec(1); } catch (StackOverflowError e) { System.out.println("caught"); } } }`, 'the program dies with "Maximum call stack size exceeded"', (r) => !r.ok && says(/call stack/)(r));
G('literal division by zero crashes the COMPILER', M('System.out.println(10/0);'), 'javac/TeaVM constant folding traps; the worker must be restarted', (r) => !r.ok && /divide by zero/.test(r.error || ''), undefined);
G('%n in the middle of a format string eats an argument', M('System.out.printf("A=%d%nB=%d%nC=%d%n", 1, 2, 3);'), 'prints A=1 B=3 C= then dies (use \\n, or %n only at the very end)', (r) => !r.ok && r.stdout === 'A=1\nB=3\nC=');
G('System.exit does not exist', M('System.exit(0);'), 'compile error: cannot find symbol', says(/cannot find symbol[\s\S]*exit/));
G('Swing / AWT / JavaFX do not exist', `import javax.swing.*; public class Main { public static void main(String[] a){ JFrame f=new JFrame("x"); } }`, 'compile error: package javax.swing does not exist', says(/javax\.swing does not exist/));
G('ExecutorService / CompletableFuture do not exist', M('java.util.concurrent.ExecutorService e=java.util.concurrent.Executors.newFixedThreadPool(2);'), 'compile error: cannot find symbol', says(/cannot find symbol/));
G('assertions are ON (real Java: off by default)', M('int x=5; assert x>10 : "x too small"; System.out.println("after assert");'), 'the assert fires and stops the program', (r) => !r.ok && /x too small/.test(r.stderr));
G('main class must be called Main (public class Shop fails)', `public class Shop { public static void main(String[] a){ System.out.println("shop"); } }`, 'compile error: class Shop is public, should be declared in a file named Shop.java', says(/should be declared in a file named/));
G('uncaught exception shows only its message, no class name or stack', M('throw new IllegalArgumentException("bad input");'), 'stderr is just "bad input"', (r) => !r.ok && r.stderr.trim() === 'bad input');
G('library exception messages differ from real Java', M('try { Integer.parseInt("x1"); } catch (NumberFormatException e){ System.out.println(e.getMessage()); }'), 'real Java says: For input string: "x1"', (r) => r.ok && !/For input string/.test(r.stdout));

let bad = 0;
await init();
const show = (ok, label, extra = '') => { if (!ok) bad += 1; console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}${extra}`); };
console.log(`Engine: ${DIST}\n\nWORKS`);
for (const p of works) {
  const t = Date.now();
  const r = await run(p.source, p.input || '');
  show(r.ok && r.stdout === p.expect, p.name, `  (${Math.round(r.generateMs || 0)} ms to build, ${Math.round(r.runMs || 0)} ms to run; wall ${Date.now() - t} ms)`);
  if (!(r.ok && r.stdout === p.expect)) console.log('     got:', JSON.stringify(r.stdout), (r.stderr || r.error || '').toString().slice(0, 200));
  if (r.error) await init();
}
console.log('\nKNOWN GAPS (must keep failing in the described way)');
for (const p of gaps) {
  const r = await run(p.source, p.input || '');
  show(p.check(r), p.name, `  -> ${p.why}`);
  if (!p.check(r)) console.log('     got:', JSON.stringify(r.stdout), (r.stderr || r.error || '').toString().slice(0, 200));
  if (r.error) await init();
}
console.log(`\n${works.length} works, ${gaps.length} gaps, ${bad} unexpected`);
process.exit(bad ? 1 : 0);
