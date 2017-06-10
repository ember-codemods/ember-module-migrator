var path_utils = require('../utils/path');

function transformer(file, api) {
  var j = api.jscodeshift;

  return j(file.source)
    .find(j.ImportDeclaration)
    .find(j.Literal)
    .forEach(function(path) {
      var importPath = path.value.value + '.js';
      var appName = file.appName;

      if (!appName) {
        // skip import transforms if appName is not set
        return;
      }

      // determine the actual path that importPath points to
      // TODO: extract these resolutions into classic-file-info and test-file-info
      var relative = path_utils.isRelative(importPath);
      if (relative) {
        var sourceRelativePath = file.fileInfo.sourceRelativePath;

        if (sourceRelativePath.startsWith('tests/')) {
          importPath = path_utils.makeAbsolute(appName + '/app/' + sourceRelativePath, importPath);

          // see if we stayed within tests
          var inTestsPrefix = appName + '/app/tests/';
          if (importPath.startsWith(inTestsPrefix)) {
            importPath = appName + '/tests/' + importPath.substring(inTestsPrefix.length);
          }
        } else {
          importPath = path_utils.makeAbsolute(appName + '/' + sourceRelativePath, importPath);
        }
      } else {
        // check if import path starts with appName and add /app
        if (importPath.startsWith(appName + '/') && !importPath.startsWith(appName + '/app/')) {
          importPath = appName + '/app' + importPath.substring(appName.length);
        }
      }

      var targetFileInfo = file.fileInfos.find(function(f) {
        return (appName + '/' + f.sourceRelativePath) === importPath;
      });

      if (!targetFileInfo) {
        // TODO error message
        return;
      }

      var newImportPath = appName + '/' + targetFileInfo.destRelativePath;
      if (relative) {
        newImportPath = path_utils.makeRelative(file.fileInfo.destRelativePath, targetFileInfo.destRelativePath);
      }
      // remove extension
      newImportPath = newImportPath.slice(0, -targetFileInfo.ext.length);
      j(path).replaceWith(j.literal(newImportPath));
    })
    .toSource();

}

module.exports = transformer;
