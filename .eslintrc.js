module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.ts']
      }
    },
    'import/parsers': { '@typescript-eslint/parser': ['.js', '.ts'] },
    'import/external-module-folders': ['node_modules'],
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    semi: ['error', 'always'],
    'semi-spacing': ['error', { after: true, before: false }],
    'semi-style': ['error', 'last'],
    'no-extra-semi': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
    'sort-imports': 0,
    'import/order': ["error", {
      "groups": [
        "builtin",
        "external",
        "parent",
        "sibling",
        "index",
        "internal",
        "type",
        "object",
      ],
      "pathGroups": [
        {
          "pattern": "~/**",
          "group": "parent"
        }
      ],
      alphabetize: { order: 'asc' },
    }],
  },
};
