import rootConfig from '../../eslint.config.js';

// Root config already handles Vue via eslintPluginVue.configs['flat/recommended']
// and sets @typescript-eslint/parser for <script setup lang="ts"> blocks.
// Package config only needs to add the test file globals.
import globals from 'globals';

export default [
  ...rootConfig,
  {
    files: ['src/__tests__/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
