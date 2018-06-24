module.exports = {
  plugins: ['prettier'],
  extends: ['airbnb-base', 'prettier'],
  env: {
    jest: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-prototype-builtins': 'off',
  },
};
