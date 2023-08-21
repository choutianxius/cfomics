module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/prop-types': 'off',
    'linebreak-style': 'off',
    'object-curly-newline': ['error', { multiline: true }],
    'space-before-function-paren': ['error', 'always'],
    'import/no-named-default': 'off',
    'react/jsx-props-no-spreading': 'off',
    'prefer-template': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-shadow': 'off',
    'import/no-unresolved': ['error', { caseSensitive: false }],
    'no-unused-vars': ['error', { varsIgnorePattern: '[iI]gnored' }],
    'react/jsx-no-bind': 'off',
    'no-nested-ternary': 'off',
    radix: 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'no-underscore-dangle': 'off',
  },
  settings: { 'import/resolver': { webpack: { config: './config/webpack.config.js' } } },
};
