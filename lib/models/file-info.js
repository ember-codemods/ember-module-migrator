var path = require('path');
var inflection = require('inflection');
var CoreObject = require('core-object');
var calculateCollectionInfo = require('../utils/calculate-collection-info');

var FileInfo = CoreObject.extend({
  type: 'FileInfo',

  init: function(_options) {
    var options = _options || {};
    this.options = options;
    this.projectRoot = options.projectRoot;

    this.sourceRelativePath = options.sourceRelativePath;
    this.type = options.type;

    this.ext = options.ext;
    this.base = options.base;
    this.name = options.name;
    this._bucket = options.bucket;
    this.namespace = options.namespace;
    this.sourceRoot = options.sourceRoot;
    this.collection = options.collection;
    this.collectionGroup = options.collectionGroup;
    this.destRelativePath = options.destRelativePath;

    this._fileInfoCollection = options._fileInfoCollection;

    this.populate();
  },

  populate: function() {
    this.populateExt();
    this.populateName();
    this.populateCollection();
    this.populateBucket();

    this._fileInfoCollection.add(this);
  },

  populateBucket: function() {
    this.bucket = path.join(
      'src',
      this.collectionGroup,
      this.collection,
      this.namespace,
      this.name
    );
  },

  populateExt: function() {
    if (this.ext) { return this.ext; }

    return this.ext = path.extname(this.sourceRelativePath);
  },

  populateName: function() {
    if (this.name) {
      return;
    }

    var pathParts = this.sourceRelativePath.split('/');
    var typeFolder = pathParts[1];

    var strippedRelativePath = this.sourceRelativePath
          .replace(new RegExp('^' + this.sourceRoot + '/' + typeFolder + '/'), '') // remove leading type dir
          .replace(new RegExp(this.ext + '$'), '') // remove extension
          .replace(new RegExp('/' + this.type + '$'), ''); // remove trailing type

    var parts = strippedRelativePath.split('/');
    this.name = parts.pop();
    this.namespace = parts.join('/');
  },

  populateCollection: function(_type) {
    var type = _type || this.type;
    var values = calculateCollectionInfo(type);

    this.collection = values.collection;
    this.collectionGroup = values.collectionGroup;
  }
});

Object.defineProperty(FileInfo.prototype, 'destRelativePath', {
  get: function() {
    var filesInBucket = this._fileInfoCollection && this._fileInfoCollection.filesInBucket(this.bucket);
    var baseRelativePath = path.join(
      'src/',
      this.collectionGroup,
      this.collection
    );

    var singularizedCollection = inflection.singularize(this.collection);
    var hasNamespace = !!this.namespace;
    var isUtil = this.type === 'util';
    var isDefaultTypeForCollection = singularizedCollection === this.type;
    var shouldUseDotForm = filesInBucket === 1 && isDefaultTypeForCollection && (!hasNamespace || isUtil);
    var inElementsCollection = this.collection === 'elements';
    var destRelativePath;

    if (inElementsCollection) {
      var renderableName = path.join(this.namespace, this.name);
      var privateRenderableInvoker = this._fileInfoCollection.detectPrivateRenderableInvoker(renderableName);

      if (privateRenderableInvoker) {
        var invokerLocation = path.dirname(privateRenderableInvoker.destRelativePath);
        var privateCollection = invokerLocation.indexOf('-elements') > -1 ? '' : '-elements';

        baseRelativePath = path.join(
          invokerLocation,
          privateCollection
        );
      }
    }

    if (shouldUseDotForm) {
      destRelativePath = path.join(
        baseRelativePath,
        this.namespace,
        this.name + this.ext
      );
    } else {
      destRelativePath = path.join(
        baseRelativePath,
        this.namespace,
        this.name,
        (this._fileNameType || this.type) + this.ext
      );
    }

    return destRelativePath;
  }
});

module.exports = FileInfo;
