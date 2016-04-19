var lint = require('mocha-eslint');

var paths = [
  'bin',
  'lib',
  'tests/**/*Test.js',
];

var options = {};
lint(paths, options);
