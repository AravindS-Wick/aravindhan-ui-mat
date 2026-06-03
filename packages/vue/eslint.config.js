import rootConfig from '../../eslint.config.js';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  ...rootConfig,
  {
    files: ['src/**/*.vue'],
    plugins: { vue: pluginVue },
    languageOptions: {
      // vue-eslint-parser handles the .vue template; it delegates
      // <script setup lang="ts"> blocks to @typescript-eslint/parser
      // so TypeScript syntax (interface, type imports, ?) is understood.
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: globals.browser,
    },
    rules: {
      ...pluginVue.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['src/__tests__/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
