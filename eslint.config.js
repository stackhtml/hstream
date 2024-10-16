'use strict'

module.exports = require('neostandard')().concat([
  {
    rules: {
      'no-var': 'off',
      'object-shorthand': ['error', 'never'],
    },
  },
])
