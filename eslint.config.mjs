// @ts-check
import tseslint from 'typescript-eslint';
// import angular from '@angular-eslint/eslint-plugin';
import angular from 'angular-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import jasmine from 'eslint-plugin-jasmine';
import _import from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import eslintConfigLove from 'eslint-config-love';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/.angular/**'] },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      eslintConfigLove,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],

      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
    },

    processor: angular.processInlineTemplates,

    plugins: {
      'unused-imports': unusedImports,
      jasmine,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettier,
    ],
    rules: {
      'prettier/prettier': ['error', { parser: 'angular' }],
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
    },
  },
);
