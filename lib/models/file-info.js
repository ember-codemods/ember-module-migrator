var path = require('path');
var inflection = require('inflection');
var CoreObject = require('core-object');

var FileInfo = CoreObject.extend({
  type: 'FileInfo',

  init: function(_options) {
    var options = _options || {};
    this.projectRoot = options.projectRoot;

    this.sourceRelativePath = options.sourceRelativePath;
    this.type = options.type;

    this.ext = options.ext;
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

    this.bucket = path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.name
    );

    this._fileInfoCollection.add(this);
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

  populateCollection: function() {
    if (this.collection) {
      return;
    }

    var pluralizedType = inflection.pluralize(this.type, this.plural_overrides[this.type]);
    var collection, collectionGroup;

    switch (this.type) {
    case 'authenticator':
    case 'authorizer':
    case 'session-store':
      collection = pluralizedType;
      collectionGroup = 'simple-auth';
      break;

    case 'adapter':
    case 'serializer':
    case 'model':
      collection = 'models';
      collectionGroup = 'data';
      break;

    case 'transform':
      collection = 'transforms';
      collectionGroup = 'data';
      break;

    case 'route':
    case 'controller':
    case 'template':
      collection = 'routes';
      collectionGroup = 'ui';
      break;

    case 'helper':
    case 'component':
      collection = 'elements';
      collectionGroup = 'ui';
      break;

    case 'style':
      collection = 'styles';
      collectionGroup = 'ui';
      break;

    case 'initializer':
    case 'instance-initializer':
      collection = pluralizedType;
      collectionGroup = 'init';
      break;

    default:
      collection = pluralizedType;
      collectionGroup = '';
    }

    this.collection = collection;
    this.collectionGroup = collectionGroup;
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
    var isDefaultTypeForCollection = singularizedCollection === this.type;
    var shouldUseDotForm = filesInBucket === 1 && isDefaultTypeForCollection && !hasNamespace;
    var destRelativePath;

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
        this.type + this.ext
      );
    }

    return destRelativePath;
  }
});

module.exports = FileInfo;
