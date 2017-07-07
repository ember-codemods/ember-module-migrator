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
  var isConfigPath = path.indexOf('/config/') > 0;
  var baseDir = p.dirname('/' + base);
  if (isConfigPath) {
    baseDir += '/..';
  }
  return p.resolve(baseDir, path).substring(1);
}

module.exports = {
  isRelative,
  makeRelative,
  makeAbsolute
};