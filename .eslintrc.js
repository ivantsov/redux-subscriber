module.exports = {
    extends: [
        'airbnb-base'
    ],
    env: {
        jest: true
    },
    rules: {
        indent: ['error', 4],
        'comma-dangle': ['error', 'never'],
        'object-curly-spacing': ['error', 'never'],
        'brace-style': ['error', 'stroustrup', {
            'allowSingleLine': false
        }],
        'no-prototype-builtins': 'off',
        'arrow-parens': 'off'
    }
};
