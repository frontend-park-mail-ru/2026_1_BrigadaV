import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,

    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },

    {
        files: ['src/**/*.{js,ts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },

    {
        files: ['server/**/*.{js,ts}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
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
        ignores: ['dist/', '**/*.hbs?compiled'],
    }
);
