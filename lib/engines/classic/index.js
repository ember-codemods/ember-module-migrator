var path = require('path');
var inflection = require('inflection');
var ClassicFileInfo = require('./classic-file-info');
var TestFileInfo = require('./test-file-info');
var ComponentFileInfo = require('./component-file-info');
var ViewFileInfo = require('./view-file-info');
var TemplateFileInfo = require('./template-file-info');
var ComponentTemplateFileInfo = require('./component-template-file-info');
var MainFileInfo = require('./main-file-info');
var MixinFileInfo = require('./mixin-file-info');
var ConfigFileInfo = require('./config-file-info');

module.exports = {
  buildFor: function(sourceRelativePath, options) {
    var ext = path.extname(sourceRelativePath);
    var pathParts = sourceRelativePath.split('/');

    if (pathParts.slice(-1)[0] === '.gitkeep') {
      // ignore .gitkeep files
      return null;
    }

    options.sourceRelativePath = sourceRelativePath;
    var sourceRoot = options.sourceRoot = pathParts[0];
    var topLevelDirectory;

    if (sourceRoot === 'app') {
      options.base = 'src';

      if (pathParts.length === 2) {
        // handle files in the source root
        return new MainFileInfo(options);
      }

      topLevelDirectory = pathParts[1];

      options.type = inflection.singularize(topLevelDirectory);

      if (ext === '.hbs') {
        options.type = 'template';

        if (/^app\/(templates\/)?components/.test(sourceRelativePath)) {
          return new ComponentTemplateFileInfo(options);
        } else {
          return new TemplateFileInfo(options);
        }
      }

      switch (topLevelDirectory) {
      case 'mixins':
        return new MixinFileInfo(options);
      case 'components':
        return new ComponentFileInfo(options);
      case 'views':
        return new ViewFileInfo(options);
      default:
        return new ClassicFileInfo(options);
      }
    } else if (sourceRoot === 'tests') {
      var testType = pathParts[1];
      var testSubjectType;

      if (testType === 'unit' || testType === 'integration') {
        options.testType = testType;

        topLevelDirectory = pathParts[2];
        testSubjectType = inflection.singularize(topLevelDirectory);
        options.testSubjectType = testSubjectType;

        options.type = testSubjectType + '-' + testType + '-test';

        return new TestFileInfo(options);
      }
    } else if (sourceRoot === 'config') {
      return new ConfigFileInfo(options);
    }
  }
};
