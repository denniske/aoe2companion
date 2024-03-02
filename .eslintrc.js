module.exports = {
    root: true,
    extends: ['universe/native'],
    plugins: ['react', 'react-native'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        'react-native/no-unused-styles': 1,
    },
};
