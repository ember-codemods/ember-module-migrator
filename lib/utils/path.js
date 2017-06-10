var p = require('path');

function isRelative(path) {
  return path[0] === '.';
}

function makeRelative(from, to) {
  var path = p.relative(p.dirname(from), to);
  if (!isRelative(path)) {
    path = './' + path;
  }
  return path;
}

function makeAbsolute(base, path) {
  return p.resolve(p.dirname('/' + base), path).substring(1);
}

module.exports = {
  isRelative,
  makeRelative,
  makeAbsolute
};