module.exports = {
  extends: ['@hellpack/hellpack'],
  rules: {
    'no-bitwise': 0,
    'no-console': 0,
    'react/jsx-filename-extension': 0,
    'import/no-dynamic-require': 0,
  },
  globals: {
    fetch: true,
    document: true
  }
};
