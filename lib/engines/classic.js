var path = require('path');

function ClassicEngine(source, dest) {
  this.source = source;
  this.dest = dest;

  this._stripSourceCache = {};
  this._typeCache = {};
  this._nameCache = {};
}

ClassicEngine.prototype = {
  _stripSourcePath: function(path) {
    if (this._stripSourceCache[path]) {
      return this._stripSourceCache[path];
    }

    var stripped = path.replace(new RegExp('^' + this.source + '/'), '');

    return this._stripSourceCache[path] = stripped;
  },

  _calculateType: function(source) {
    if (this._typeCache[source]) {
      return this._typeCache[source];
    }

    var ext = path.extname(source);
    var relativePath = this._stripSourcePath(source);
    var type;

    if (ext === '.js') {
      var pathParts = relativePath.split('/');

      return pathParts[0].slice(0, -1); // stupidly drop `s`
    } else if (ext === '.hbs') {
      if (/^(templates\/)?components/.test(relativePath)) {
        type = 'component-template';
      } else {
        type = 'template';
      }
    }

    return this._typeCache[source] = type;
  },

  _calculateName: function(source) {
    if (this._nameCache[source]) {
      return this._nameCache[source];
    }

    var relativePath = this._stripSourcePath(source);
    var realType = this._calculateType(source);
    var ext = path.extname(source);

    var type = realType === 'component-template' ? 'template' : realType;
    var name = relativePath
          .replace(new RegExp('^' + type + 's/'), '') // remove leading type dir
          .replace(new RegExp(ext + '$'), '') // remove extension
          .replace(new RegExp('/' + type + '$'), ''); // remove trailing type

    if (realType === 'component-template') {
      name = name
        .replace(/^components\//, '');
    }

    return this._nameCache[source] = name;
  },

  _collectionForType: function(type) {
    switch (type) {
    case 'component-template': return 'components';

    case 'adapter':
    case 'serializer':
    case 'model': return 'data';

    case 'controller':
    case 'template': return 'routes';

    default: return type + 's';
    }
  },

  calculateDestFor: function(source) {
    var ext = path.extname(source);
    var realType = this._calculateType(source);
    var type = realType === 'component-template' ? 'template' : realType;
    var name = this._calculateName(source);
    var collection = this._collectionForType(realType);

    return this.dest + '/' + collection + '/' + name + '/' + type + ext;
  }
};

module.exports = ClassicEngine;
