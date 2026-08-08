import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules', 'public/mockServiceWorker.js', 'eslint.config.js'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2024 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // Pinned explicitly rather than `version: 'detect'` — eslint-plugin-react
    // 7.37.5's auto-detection calls the deprecated context.getFilename()
    // method internally, which ESLint 10 removed, crashing the linter
    // entirely. Fixed here rather than downgrading ESLint.
    settings: { react: { version: '19.2.8' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules, // React 19: no need for React in scope
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Deliberately off: every usage in this codebase is a fixed-length
      // skeleton-loader or static placeholder array that never reorders,
      // filters, or has items inserted/removed — the actual failure mode
      // this rule protects against doesn't apply.
      'react/no-array-index-key': 'off',
      'react/prop-types': 'off', // no PropTypes in this codebase by design; Zod validates at the API boundary instead
    },
  },
];
