/** @type {import('tailwindcss').Config} */

const themeColors = require('./app/src/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        // "./app4/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        g: ({ theme }) => theme('spacing'),
        colors: themeColors,
    },
    plugins: [
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    g: (value) => ({
                        gap: value,
                    }),
                },
                { values: theme('g') }
            );
        }),
    ],
};
