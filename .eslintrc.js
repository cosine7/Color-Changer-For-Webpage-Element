module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'no-param-reassign': ['error', { props: false }],
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
  },
  globals: {
    chrome: 'readonly',
  },
};
