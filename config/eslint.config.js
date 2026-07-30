import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import jsdoc from 'eslint-plugin-jsdoc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

/**
 * @description Configuração do ESLint para o frontend (flat config).
 * Aplica regras de qualidade, padrões de código e consistência de estilo
 * seguindo as convenções definidas no guia do projeto.
 *
 * Regras aplicadas:
 * - Ordenação de imports por grupos (Ecossistema, Stores, Constantes, Types, Composables, Utils, Services, Componentes, Outros)
 * - Ordem de atributos em templates Vue (CONDITIONALS, LIST_RENDERING, TWO_WAY_BINDING, OTHER_DIRECTIVES, OTHER_ATTR, EVENTS)
 * - Ordem dos blocos .vue (template, script, style)
 * - Convenções de nomenclatura (prefixos T, I, C, p para parâmetros, camelCase, UPPER_CASE)
 * - Boas práticas Vue 3 e TypeScript
 */
export default tseslint.config(
  {
    ignores: ['dist', 'dev-dist', 'node_modules', '*.config.*'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            [
              '^vue$',
              '^vue-i18n',
              '^pinia',
              '^vue-router',
              '^vuetify',
              '^@mdi',
              '^axios',
              '^dayjs',
              '^apexcharts',
              '^vue3-',
              '^html2canvas',
              '^jspdf',
              '^xlsx$',
            ],
            ['^@/stores'],
            ['^@/constants'],
            ['^@/models', '^.+\\u0000$'],
            ['^@/composables'],
            ['^@/utils'],
            ['^@/services'],
            ['^@/components'],
            ['^@?\\w'],
            ['^'],
            ['^\\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-undef': 'off',
    },
  },
  {
    plugins: {
      jsdoc,
    },
    rules: {
      'jsdoc/require-description': ['warn', { descriptionStyle: 'tag' }],
      'jsdoc/require-param': 'warn',
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-property': 'warn',
      'jsdoc/require-property-description': 'warn',
      'jsdoc/require-property-name': 'warn',
      'jsdoc/require-property-type': 'off',
    },
  },
  prettierConfig,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': [
        'warn',
        {
          singleline: { max: 1 },
          multiline: { max: 1 },
        },
      ],
      'vue/first-attribute-linebreak': [
        'warn',
        {
          singleline: 'beside',
          multiline: 'below',
        },
      ],
      'vue/html-indent': [
        'warn',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: false,
          ignores: [],
        },
      ],
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'SLOT',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'ATTR_DYNAMIC',
            'ATTR_STATIC',
            'ATTR_SHORTHAND_BOOL',
            'EVENTS',
            'CONTENT',
          ],
          alphabetical: false,
        },
      ],
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
      'vue/v-on-event-hyphenation': ['error', 'never'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
          prefix: ['C'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: ['function', 'method'],
          format: ['camelCase'],
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase'],
          prefix: ['p'],
        },
      ],
      'no-console': 'warn',
    },
  },
);
