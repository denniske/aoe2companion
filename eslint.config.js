// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

// The React Compiler rules used to live in the standalone
// `eslint-plugin-react-compiler` (single `react-compiler/react-compiler` rule).
// That plugin is deprecated and is NOT installed here — requiring it made
// `eslint` fail to start at all.
//
// The rules now ship as individual rules in `eslint-plugin-react-hooks` v7,
// which `eslint-config-expo` already bundles and enables at the same severities
// as the plugin's own `recommended-latest` preset (immutability, refs,
// set-state-in-effect, purity, preserve-manual-memoization, globals, ...).
// So the compiler rule set comes in via `expoConfig` below — only the deltas
// need to be spelled out here.

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],
        rules: {
            // The only rule in react-hooks' `recommended-latest` that
            // eslint-config-expo@56.0.4 does not set. Currently 0 violations.
            'react-hooks/void-use-memo': 'error',

            // `immutability` and `refs` used to be downgraded here too. Both are at
            // 0 findings now that the last compiler bailouts are fixed, so they are
            // left at expo's `error` to keep them that way — every component in src/
            // compiles, and CI enforces it (.github/workflows/lint.yml).
            //
            // Still a backlog: effects that reset/initialise rather than derive
            // state. Warning so it doesn't fail the run; delete the line to promote
            // it back to expo's `error` and enforce it.
            //
            // NOTE: the 47 eslint-plugin-react errors (react/no-unescaped-entities,
            // react/jsx-key, react/display-name) that surfaced once this config
            // started loading are all fixed — `eslint src` now exits 0. What is left
            // is ~590 warnings (no-unused-vars, eqeqeq, array-type, exhaustive-deps).
            'react-hooks/set-state-in-effect': 'warn', // 20 findings

            // Dropped `'` and `"` from the default forbid list. Both are legal in JSX
            // text and the parser decodes `&apos;`/`&quot;` to exactly the same string,
            // so the rule only forced prose — don't, "Game Content Usage Rules" — to be
            // written as entities for zero runtime difference.
            //
            // That leaves the rule effectively inert here: in .tsx a bare `>` or `}` in
            // JSX text is already a parse error from the TypeScript parser ("Unexpected
            // token. Did you mean `{'>'}` or `&gt;`?"), so it fails before the rule ever
            // runs. Kept rather than 'off' to state the intent and to still cover any
            // more permissive parser.
            'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],

            // 'react-native/no-unused-styles': 1,
            // 'import/no-unresolved': 'off',
            // 'react/jsx-key': 'off',
            // 'react/no-unescaped-entities': 'off',
            // 'react/display-name': 'off',
            // '@typescript-eslint/no-unused-vars': 'off',
            // 'eqeqeq': 'off',
            // 'import/no-named-as-default': 'off',
            // '@typescript-eslint/array-type': 'off',
            // '@typescript-eslint/no-empty-object-type': 'off',
            // 'no-empty-pattern': 'off',
            // 'no-unused-expressions': 'off',
            // '@typescript-eslint/no-require-imports': 'off',
        },
    },
]);
