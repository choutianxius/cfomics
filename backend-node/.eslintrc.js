module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    'linebreak-style': 'off',
    'object-curly-newline': ['error', { multiline: true }],
    'space-before-function-paren': ['error', 'always'],
    'import/no-named-default': 'off',
    'react/jsx-props-no-spreading': 'off',
    'prefer-template': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-shadow': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: '[iI]gnored' }],
    'global-require': 'off',
  },
};
