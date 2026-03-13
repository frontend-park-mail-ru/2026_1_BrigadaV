import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    pluginJs.configs.recommended,

    {
        files: ['src/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
    {
        files: ['server/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
    {
        rules: {
            indent: ['error', 4],
            eqeqeq: 'error',
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'no-console': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-unused-vars': ['error', { args: 'none' }],
            'eol-last': ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],
        },
    },
    {
        ignores: ['dist/', '**/*.hbs?compiled']
    }
];
