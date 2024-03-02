/** @type {import('tailwindcss').Config} */

const themeColors = require('./app/src/colors');

module.exports = {
    content: [
        './App.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        // "./app4/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        colors: themeColors,
    },
};
