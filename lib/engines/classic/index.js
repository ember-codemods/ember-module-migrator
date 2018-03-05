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
var MiscFileInfo = require('./misc-file-info');
var PodsSupport = require('../../utils/pods-support');
var typeForPodFile = PodsSupport.typeForPodFile;
var hasPodNamespace = PodsSupport.hasPodNamespace;

module.exports = {
  buildFor: function(sourceRelativePath, options) {
    var ext = path.extname(sourceRelativePath);
    var pathParts = sourceRelativePath.split('/');
    var filename = pathParts.slice(-1)[0];

    if (filename === '.gitkeep') {
      // ignore .gitkeep files
      return null;
    }

    options.sourceRelativePath = sourceRelativePath;
    var sourceRoot = options.sourceRoot = pathParts[0];
    var topLevelDirectory;

    if (filename[0] === '.' && ext === '.js') {
      // keep js dotfiles in their original location
      return new MiscFileInfo(options);
    }

    if (sourceRoot === 'app') {
      options.base = 'src';

      if (pathParts.length === 2) {
        // handle files in the source root
        return new MainFileInfo(options);
      }

      topLevelDirectory = pathParts[1];

      var typeBasedOnFolder = inflection.singularize(topLevelDirectory);
      options.type = typeForPodFile(sourceRelativePath) || typeBasedOnFolder;


      if (ext === '.hbs') {
        options.type = 'template';

        if (/^app\/(.+\/)?(templates\/)?components/.test(sourceRelativePath)) {
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

        options.base = 'src';
        options.testType = testType;

        var podType = typeForPodFile(options.sourceRelativePath);
        var arePodsNamespaced = hasPodNamespace(options.podModulePrefix);

        if (podType) {
          var fileName = pathParts[pathParts.length - 1];
          testSubjectType = fileName.replace(new RegExp('-test.js$'), '');
          options.testSubjectType = testSubjectType;
          options.type = testSubjectType + '-' + testType + '-test';

          if (arePodsNamespaced) {
            topLevelDirectory = pathParts[3];


            return new TestFileInfo(options);
          }

          topLevelDirectory = pathParts[3];

          return new TestFileInfo(options);
        }



        topLevelDirectory = pathParts[2];
        testSubjectType = inflection.singularize(topLevelDirectory);
        options.testSubjectType = testSubjectType;

        options.type = testSubjectType + '-' + testType + '-test';

        return new TestFileInfo(options);
      } else if (testType !== 'acceptance' && pathParts[2]) {
        options.type = testType;
        options.base = 'tests';
        return new ClassicFileInfo(options);
      }
    } else if (sourceRoot === 'config') {
      return new ConfigFileInfo(options);
    }
  }
};
