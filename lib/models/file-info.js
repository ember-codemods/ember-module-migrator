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
    this.sourceRoot = options.sourceRoot;
    this.collection = options.collection;
    this.destRelativePath = options.destRelativePath;

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
  },

  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = 'src/' + this.collection + '/' + this.name + '.' + this.type + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = FileInfo;
