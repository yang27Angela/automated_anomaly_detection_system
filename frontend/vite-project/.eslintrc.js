// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    plugins: ['react', '@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
    },
    settings: {
        react: { version: 'detect' }
    },
    rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single']
    }
};