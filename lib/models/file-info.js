var path = require('path');
var inflection = require('inflection');
var CoreObject = require('core-object');

var FileInfo = CoreObject.extend({
  init: function(_options) {
    var options = _options || {};
    this.projectRoot = options.projectRoot;

    this.sourceRelativePath = options.sourceRelativePath;
    this.type = options.type;

    this.ext = options.ext;
    this.name = options.name;
    this._bucket = options.bucket;
    this.sourceRoot = options.sourceRoot;
    this.collection = options.collection;
    this.destRelativePath = options.destRelativePath;

    this._fileInfoCollection = options._fileInfoCollection;

    this.populate();
  },

  populate: function() {
    this.populateExt();
    this.populateName();
    this.populateCollection();

    this.bucket = 'src/' + this.collection + '/' + this.name;
    this._fileInfoCollection.add(this);
  },

  populateExt: function() {
    if (this.ext) { return this.ext; }

    return this.ext = path.extname(this.sourceRelativePath);
  },

  populateName: function() {
    if (this.name) {
      return this.name;
    }

    var pathParts = this.sourceRelativePath.split('/');
    var typeFolder = pathParts[1];

    var name = this.sourceRelativePath
          .replace(new RegExp('^' + this.sourceRoot + '/' + typeFolder + '/'), '') // remove leading type dir
          .replace(new RegExp(this.ext + '$'), '') // remove extension
          .replace(new RegExp('/' + this.type + '$'), ''); // remove trailing type

    return this.name = name;
  },

  populateCollection: function() {
    if (this.collection) {
      return this.collection;
    }

    var collection;

    switch (this.type) {
    case 'adapter':
    case 'serializer':
    case 'model':
      collection = 'models';
      break;

    case 'route':
    case 'controller':
    case 'template':
      collection = 'routes';
      break;

    default:
      collection = inflection.pluralize(this.type, this.plural_overrides[this.type]);
    }

    return this.collection = collection;
  }
});

Object.defineProperty(FileInfo.prototype, 'destRelativePath', {
  get: function() {
    var filesInBucket = this._fileInfoCollection && this._fileInfoCollection.filesInBucket(this.bucket);
    var bucketSeparator = '.';

    if (filesInBucket > 1) {
      bucketSeparator = '/';
    }

    var destRelativePath = this.bucket + bucketSeparator + this.type + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = FileInfo;
