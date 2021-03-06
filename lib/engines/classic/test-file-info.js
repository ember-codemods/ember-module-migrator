var path = require('path');
var ClassicFileInfo = require('./classic-file-info');
var calculateCollectionInfo = require('../../utils/calculate-collection-info');
var inflection = require('inflection');
var PodsSupport = require('../../utils/pods-support');
var typeForPodFile = PodsSupport.typeForPodFile;
var hasPodNamespace = PodsSupport.hasPodNamespace;

var TestFileInfo = ClassicFileInfo.extend({
  populate: function() {
    this.testType = this.options.testType;
    this.testSubjectType = this.options.testSubjectType;


    this.populateExt();
    this.populateName();
    this.populateCollection();

    if (this.testSubjectType === 'mixin') {
      this.testType = 'utils';
      this.namespace = path.join(this.namespace, 'mixins');
    }

    this.populateBucket();
    this.populateFileContents();

    this._fileInfoCollection.add(this);
  },

  populateName: function() {
    var pathParts = this.sourceRelativePath.split('/');
    var testTypeFolder = pathParts[1];
    var typeFolder = pathParts[2];
    var typeOfTest = '';

    var podType = typeForPodFile(this.sourceRelativePath);
    if (podType) {
      var fileName = pathParts[pathParts.length - 1];
      typeOfTest = fileName.replace(new RegExp('-test.js$'), '');
      typeFolder = inflection.pluralize(typeOfTest);
    }

    var strippedRelativePath;

    if (podType) {
      if (!hasPodNamespace(this.podModulePrefix)) {
        // pods without namespace
        strippedRelativePath = this.sourceRelativePath
          .replace(new RegExp('^' + this.sourceRoot + '/' + testTypeFolder + '/(' + typeFolder + '/)?'), '') // remove leading type dir
          .replace(new RegExp('-test.js$'), '') // remove extension
          .replace(new RegExp('/' + typeOfTest + '$'), ''); // remove type name if pods
      } else {
        // pods with namespace
        var pathRootRegex = new RegExp(this.podModulePrefix + '\/');
        strippedRelativePath = this.sourceRelativePath
          .replace(pathRootRegex, '') // don't care if the top directory is pods
          .replace(new RegExp('^' + this.sourceRoot + '/' + testTypeFolder + '/(' + typeFolder + '/)?'), '') // remove leading type dir
          .replace(new RegExp('-test.js$'), '') // remove extension
          .replace(new RegExp('/' + typeOfTest + '$'), ''); // remove type name if pods
      }
    } else {
      // classic
      strippedRelativePath = this.sourceRelativePath
        .replace(pathRootRegex, '') // don't care if the top directory is pods
        .replace(new RegExp('^' + this.sourceRoot + '/' + testTypeFolder + '/(' + typeFolder + '/)?'), '') // remove leading type dir
        .replace(new RegExp('-test.js$'), ''); // remove extension
    }

    var parts = strippedRelativePath.split('/');

    this.name = parts.pop();
    this.namespace = parts.join('/');
  },

  populateCollection: function() {
    var values = calculateCollectionInfo(this.testSubjectType);

    this.collection = values.collection;
    this.collectionGroup = values.collectionGroup;
  }
});

Object.defineProperty(TestFileInfo.prototype, 'destRelativePath', {
  get: function() {
    if (this.collection === 'components') {
      var renderableName = path.join(this.namespace, this.name);
      var privateRenderableInvoker = this._fileInfoCollection.detectPrivateRenderableInvoker(renderableName);

      if (privateRenderableInvoker && this._privateRenderableInvoker) {
        var invokerLocation = path.dirname(this._privateRenderableInvoker.destRelativePath);
        var invokerInComponentsCollection = privateRenderableInvoker.collection === 'components';
        var invokerInPrivateCollection = invokerLocation.indexOf('-components') > -1;
        var privateCollection = invokerInPrivateCollection || invokerInComponentsCollection? '' : '-components';

        return path.join(
          invokerLocation,
          privateCollection,
          this.namespace,
          this.name,
          this.type + this.ext
        );
      }
    }

    return path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.namespace,
      this.name,
      this.type + this.ext
    );
  }
});

module.exports = TestFileInfo;
