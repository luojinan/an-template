import antfu from '@antfu/eslint-config'

// Auto fix for formatting (aimed to be used standalone without Prettier) https://github.com/antfu/eslint-config
export default antfu(
  {
    ignores: [
      'vite.config.ts',
      'src/proApi/*',
      'src/utils/proProApi/*',
    ],
    lessOpinionated: true, // allow arrow function and if else etc https://github.com/antfu/eslint-config?tab=readme-ov-file#top-level-function-style-etc
    isInEditor: false, // auto fix import by eslint https://github.com/antfu/eslint-config?tab=readme-ov-file#editor-specific-disables
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'no-console': 'off',
      'vue/eqeqeq': 'off',
      'eqeqeq': 'off',
      'no-restricted-syntax': 'off',
      'vue/no-unused-refs': 'warn',
      'prefer-promise-reject-errors': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-returns-description': 'off',
      'unused-imports/no-unused-vars': 'warn',
      'ts/no-use-before-define': 'warn',
      'style/max-statements-per-line': 'warn',
    },
  },
)
