var path = require('path');
var inflection = require('inflection');
var ClassicFileInfo = require('./classic-file-info');
var ComponentTemplateFileInfo = require('./component-template-file-info');
var MainFileInfo = require('./main-file-info');
var MixinFileInfo = require('./mixin-file-info');
var SingleTypeCollectionFileInfo = require('./single-type-collection-file-info');
var typeIncluded = require('../../utils/type-included');


module.exports = {
  buildFor: function(sourceRelativePath, options) {
    var ext = path.extname(sourceRelativePath);
    var pathParts = sourceRelativePath.split('/');

    options.sourceRelativePath = sourceRelativePath;
    var sourceRoot = options.sourceRoot = pathParts[0];

    if (sourceRoot === 'app') {
      if (pathParts.length === 2) {
        // handle files in the source root
        return new MainFileInfo(options);
      }

      var topLevelDirectory = pathParts[1];

      options.type = inflection.singularize(topLevelDirectory);

      if (ext === '.hbs') {
        options.type = 'template';

        if (/^app\/(templates\/)?components/.test(sourceRelativePath)) {
          return new ComponentTemplateFileInfo(options);
        }
      }

      if (topLevelDirectory === 'mixins') {
        return new MixinFileInfo(options);
      } else if (typeIncluded(options.type)) {
        return new SingleTypeCollectionFileInfo(options);
      } else {
        return new ClassicFileInfo(options);
      }
    }
  }
};
