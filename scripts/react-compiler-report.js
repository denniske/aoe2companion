#!/usr/bin/env node
/**
 * Reports which components/hooks React Compiler can actually optimize.
 *
 * The app ships with `reactCompiler: true` (app.config.ts), which means every
 * component is fed through babel-plugin-react-compiler at build time. A component
 * the compiler bails out on is silently left unoptimized — nothing in the build
 * output says so. This script runs the same compiler over src/ and reports the
 * per-component result.
 *
 * Note this is a different question from `yarn lint:hooks`. Lint reports rule
 * violations; this reports whether the compiler *succeeded*. The two usually
 * correlate but not always: a `preserve-manual-memoization` bailout (stale
 * useMemo deps) makes the compiler skip a whole component while most of the
 * hooks rules stay quiet.
 *
 * Usage:
 *   node scripts/react-compiler-report.js [paths...] [options]
 *
 *   --failures-only   only list components the compiler could not optimize
 *   --json            machine-readable output
 *   --strict          exit 1 if any component fails to compile (for CI)
 *   --quiet           summary only
 */

const fs = require('fs');
const path = require('path');

const babel = require('@babel/core');

// babel-plugin-react-compiler is a dependency of babel-preset-expo rather than a
// direct one, so fall back to resolving it from there for non-hoisted layouts.
function loadCompilerPlugin() {
    try {
        return require.resolve('babel-plugin-react-compiler');
    } catch {}
    try {
        return require.resolve('babel-plugin-react-compiler', { paths: [path.dirname(require.resolve('babel-preset-expo/package.json'))] });
    } catch {}
    console.error('Could not resolve babel-plugin-react-compiler. Run an install first.');
    process.exit(2);
}

const COMPILER_PLUGIN = loadCompilerPlugin();
const PARSER_PLUGINS = ['typescript', 'jsx', 'decorators-legacy'];
const EXTENSIONS = new Set(['.tsx', '.jsx', '.ts', '.js']);

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const roots = args.filter((a) => !a.startsWith('--'));
if (roots.length === 0) roots.push('src');

function collectFiles(root) {
    const stat = fs.statSync(root, { throwIfNoEntry: false });
    if (!stat) return [];
    if (stat.isFile()) return [root];
    const out = [];
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        const full = path.join(root, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
            out.push(...collectFiles(full));
        } else if (EXTENSIONS.has(path.extname(entry.name)) && !entry.name.endsWith('.d.ts')) {
            out.push(full);
        }
    }
    return out;
}

/**
 * CompileSuccess events carry `fnName`, but CompileError events only carry
 * `fnLoc` — so build a line -> name index from the AST to name the failures.
 */
function indexFunctionNames(code, filename) {
    const byLine = new Map();
    let ast;
    try {
        ast = babel.parseSync(code, {
            filename,
            babelrc: false,
            configFile: false,
            parserOpts: { plugins: PARSER_PLUGINS, errorRecovery: true },
        });
    } catch {
        return byLine;
    }

    const nameOf = (nodePath) => {
        const { node, parent } = nodePath;
        if (node.id?.name) return node.id.name;
        if (parent?.type === 'VariableDeclarator' && parent.id?.name) return parent.id.name;
        if (parent?.type === 'ObjectProperty' && parent.key?.name) return parent.key.name;
        if (parent?.type === 'AssignmentExpression' && parent.left?.name) return parent.left.name;
        // forwardRef(fn) / memo(fn) — walk out to the binding that names it
        if (parent?.type === 'CallExpression') {
            const gp = nodePath.parentPath?.parent;
            if (gp?.type === 'VariableDeclarator' && gp.id?.name) return gp.id.name;
        }
        return null;
    };

    const visit = (nodePath) => {
        const loc = nodePath.node.loc;
        if (!loc) return;
        const name = nameOf(nodePath);
        if (!name) return;
        const key = loc.start.line;
        const existing = byLine.get(key);
        // prefer the outermost declaration starting on this line
        if (!existing || loc.start.column < existing.column) {
            byLine.set(key, { name, column: loc.start.column });
        }
    };

    babel.traverse(ast, {
        FunctionDeclaration: visit,
        FunctionExpression: visit,
        ArrowFunctionExpression: visit,
    });
    return byLine;
}

function reasonOf(event) {
    const d = event.detail ?? {};
    const o = d.options ?? d;
    const reason = o.reason || o.description || d.reason || 'unknown';
    return String(reason).replace(/\s+/g, ' ').trim();
}

const results = [];
const parseFailures = [];
const files = roots.flatMap(collectFiles).sort();

for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    const events = [];
    try {
        babel.transformSync(code, {
            filename: path.resolve(file),
            babelrc: false,
            configFile: false,
            parserOpts: { plugins: PARSER_PLUGINS },
            plugins: [[COMPILER_PLUGIN, { logger: { logEvent: (_f, e) => events.push(e) } }]],
        });
    } catch (e) {
        parseFailures.push({ file, message: String(e.message).split('\n')[0] });
        continue;
    }

    const relevant = events.filter((e) => e.kind === 'CompileSuccess' || e.kind === 'CompileError' || e.kind === 'CompileSkip');
    if (relevant.length === 0) continue;

    const names = indexFunctionNames(code, path.resolve(file));
    const seen = new Map();

    for (const event of relevant) {
        const line = event.fnLoc?.start?.line ?? 0;
        const name = event.fnName || names.get(line)?.name || `<anonymous:${line}>`;
        const status = event.kind === 'CompileSuccess' ? 'compiled' : event.kind === 'CompileSkip' ? 'skipped' : 'bailout';
        const reason = status === 'bailout' ? reasonOf(event) : null;

        // One row per component. The compiler can log the same bailout twice, and
        // can also report several distinct problems for one function — collect the
        // reasons rather than emitting the component more than once.
        const key = `${line}|${name}`;
        const existing = seen.get(key);
        if (existing) {
            if (reason && !existing.reasons.includes(reason)) existing.reasons.push(reason);
            continue;
        }
        const row = { file, line, name, status, reasons: reason ? [reason] : [], memoSlots: event.memoSlots ?? null };
        seen.set(key, row);
        results.push(row);
    }
}

const compiled = results.filter((r) => r.status === 'compiled');
const bailouts = results.filter((r) => r.status === 'bailout');
const skipped = results.filter((r) => r.status === 'skipped');

if (flags.has('--json')) {
    console.log(JSON.stringify({ summary: { files: files.length, total: results.length, compiled: compiled.length, bailouts: bailouts.length, skipped: skipped.length }, results, parseFailures }, null, 2));
    process.exit(flags.has('--strict') && bailouts.length > 0 ? 1 : 0);
}

const GREEN = '\x1b[32m', RED = '\x1b[31m', YELLOW = '\x1b[33m', DIM = '\x1b[2m', BOLD = '\x1b[1m', RESET = '\x1b[0m';
const colorize = process.stdout.isTTY;
const c = (color, s) => (colorize ? color + s + RESET : s);

if (!flags.has('--quiet')) {
    const show = flags.has('--failures-only') ? bailouts : results;
    let currentFile = null;
    for (const r of show) {
        if (r.file !== currentFile) {
            currentFile = r.file;
            console.log(`\n${c(BOLD, r.file)}`);
        }
        if (r.status === 'compiled') {
            const slots = r.memoSlots === null ? '' : c(DIM, ` (${r.memoSlots} memo slot${r.memoSlots === 1 ? '' : 's'})`);
            console.log(`  ${c(GREEN, '✓')} ${r.name}${slots}`);
        } else if (r.status === 'skipped') {
            console.log(`  ${c(YELLOW, '−')} ${r.name} ${c(DIM, 'skipped')}`);
        } else {
            console.log(`  ${c(RED, '✗')} ${r.name}  ${c(RED, r.reasons[0] ?? 'unknown')}  ${c(DIM, `(:${r.line})`)}`);
            for (const extra of r.reasons.slice(1)) console.log(`      ${c(DIM, 'also:')} ${c(RED, extra)}`);
        }
    }
}

if (parseFailures.length > 0) {
    console.log(`\n${c(YELLOW, 'Could not parse:')}`);
    for (const f of parseFailures) console.log(`  ${f.file} ${c(DIM, f.message)}`);
}

const pct = results.length ? Math.round((compiled.length / results.length) * 100) : 100;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
console.log(
    `\n${c(BOLD, 'React Compiler')}  ${plural(files.length, 'file', 'files')} scanned, ` +
        `${plural(results.length, 'component/hook', 'components/hooks')} analyzed`
);
console.log(`  ${c(GREEN, '✓ compiled')}  ${compiled.length} (${pct}%)`);
console.log(`  ${c(RED, '✗ bailout ')}  ${bailouts.length}${bailouts.length ? c(DIM, '  — left unoptimized') : ''}`);
if (skipped.length) console.log(`  ${c(YELLOW, '− skipped ')}  ${skipped.length}`);

if (bailouts.length) {
    const histogram = new Map();
    for (const b of bailouts) {
        for (const reason of b.reasons) histogram.set(reason, (histogram.get(reason) ?? 0) + 1);
    }
    console.log(`\n${c(BOLD, 'Why components bail out')}`);
    for (const [reason, count] of [...histogram.entries()].sort((a, b) => b[1] - a[1])) {
        const short = reason.length > 88 ? reason.slice(0, 85) + '...' : reason;
        console.log(`  ${String(count).padStart(3)}  ${short}`);
    }
}

if (!flags.has('--failures-only') && bailouts.length) console.log(c(DIM, `\n  rerun with --failures-only to list just the bailouts`));

process.exit(flags.has('--strict') && bailouts.length > 0 ? 1 : 0);
