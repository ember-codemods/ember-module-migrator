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

function makeAbsolute(base, path, appName) {
  var baseDir = p.dirname(`/${appName}/${base}`);

  // check if path goes over the root config folder and adjust base
  var configIndex = path.indexOf('/config/');
  if (configIndex >= 0) {
    var configPath = p.resolve(baseDir, path.substring(0, configIndex) + '/config').substring(1);
    if (configPath == `${appName}/app/config`) {
      baseDir += '/..';
    }
  }

  return p.resolve(baseDir, path).substring(1);
}

module.exports = {
  isRelative,
  makeRelative,
  makeAbsolute
};