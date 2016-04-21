var path = require('path');
var inflection = require('inflection');
var CoreObject = require('core-object');

var FileInfo = CoreObject.extend({
  init: function(options) {
    var _options = options || {};
    this.sourceRoot = _options.sourceRoot;
    this.destRoot = _options.destRoot;

    this.sourceRelativePath = _options.sourceRelativePath;
    this.type = _options.type;

    this.ext = _options.ext;
    this.name = _options.name;
    this.collection = _options.collection;
    this.destRelativePath = _options.destRelativePath;

    this.populate();
  },
  populate: function() {
    this.populateExt();
    this.populateName();
    this.populateCollection();
    this.populateDestination();
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
    var rootFolder = pathParts[0];

    var name = this.sourceRelativePath
          .replace(new RegExp('^' + rootFolder + '/'), '') // remove leading type dir
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
  },

  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = this.collection + '/' + this.name + '/' + this.type + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = FileInfo;
