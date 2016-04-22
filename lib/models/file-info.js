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
    this.sourceRoot = options.sourceRoot;
    this.collection = options.collection;
    this.collectionGroup = options.collectionGroup;
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
      collection = 'hbs';
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
  },

  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.name,
      this.type + this.ext
    );

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = FileInfo;
