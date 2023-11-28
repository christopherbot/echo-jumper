/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  ignorePatterns: ['.eslintrc.cjs'],
  plugins: ['@typescript-eslint', 'import', 'import-alias', 'canonical'],
  rules: {
    '@typescript-eslint/consistent-type-assertions': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'no-multiple-empty-lines': 'error',
    'import/prefer-default-export': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/first': 'error',
    'import-alias/import-alias': [
      'error',
      {
        relativeDepth: 0,
        aliases: [
          {
            alias: '@src',
            matcher: '^src',
          },
        ],
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        groups: [['builtin', 'external'], 'internal', ['sibling', 'index']],
        pathGroups: [
          {
            pattern: '@src/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always',
      },
    ],
    // https://github.com/gajus/eslint-plugin-canonical
    'canonical/filename-match-exported': 'error',
  },
  overrides: [
    {
      files: 'index.ts',
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
  ],
}

module.exports = config
