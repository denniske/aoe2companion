// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const reactCompiler = require("eslint-plugin-react-compiler");

module.exports = defineConfig([
    expoConfig,
    {
        ignores: ['dist/*'],
        plugins: {
            'react-compiler': reactCompiler,
        },
        rules: {
            // 'react-native/no-unused-styles': 1,
            'react-compiler/react-compiler': 'error',
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

            // 'react-hooks/react-compiler': [
            //     'error',
            //     {
            //         reportableLevels: new Set([
            //             'InvalidJS',
            //             'InvalidReact',
            //             'InvalidConfig',
            //             'CannotPreserveMemoization',
            //             'Todo',
            //             'Invariant',
            //         ]),
            //     },
            // ],
        },
    },
]);

