var path = require('path');

function ClassicFileInfo(_options) {
  var options = _options || {};

  this.sourceRoot = options.sourceRoot;
  this.destRoot = options.destRoot;

  this.relativePath = options.relativePath;
  this.type = options.type;

  this.ext = options.ext;
  this.name = options.name;
  this.collection = options.collection;
  this.destRelativePath = options.destRelativePath;

  this.populate();
}

ClassicFileInfo.prototype = {
  populate: function() {
    this.populateExt();
    this.populateName();
    this.populateCollection();
    this.populateDestination();
  },

  populateExt: function() {
    if (this.ext) { return this.ext; }

    return this.ext = path.extname(this.relativePath);
  },

  populateName: function() {
    if (this.name) {
      return this.name;
    }

    var name = this.relativePath
          .replace(new RegExp('^' + this.type + 's/'), '') // remove leading type dir
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
      collection = 'data';
      break;

    case 'route':
    case 'controller':
    case 'template':
      collection = 'routes';
      break;

    default:
      collection = this.type + 's';
    }

    return this.collection = collection;
  },

  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = this.destRoot + '/' + this.collection + '/' + this.name + '/' + this.type + this.ext;

    return this.destRelativePath = destRelativePath;
  }
};

function ComponentTemplateFileInfo(options) {
  options.collection = 'components';

  ClassicFileInfo.apply(this, arguments);
}
ComponentTemplateFileInfo.prototype = Object.create(ClassicFileInfo.prototype);
ComponentTemplateFileInfo.prototype.constructor = ComponentTemplateFileInfo;
ComponentTemplateFileInfo.prototype.$superPopulateName = ClassicFileInfo.prototype.populateName;

ComponentTemplateFileInfo.prototype.populateName = function() {
  if (this.name) {
    return this.name;
  }

  var name = this.$superPopulateName()
      .replace(/^components\//, '');

  return this.name = name;
};

ClassicFileInfo.buildFor = function(filePath, options) {
  var relativePath = filePath.replace(new RegExp('^' + options.sourceRoot + '/'), '');
  var ext = path.extname(filePath);

  options.relativePath = relativePath;

  if (ext === '.js') {
    var pathParts = relativePath.split('/');

    options.type = pathParts[0].slice(0, -1); // stupidly drop `s`
  } else if (ext === '.hbs') {
    options.type = 'template';

    if (/^(templates\/)?components/.test(relativePath)) {
      return new ComponentTemplateFileInfo(options);
    }
  }

  return new ClassicFileInfo(options);
};

function ClassicEngine(source, dest) {
  this.source = source;
  this.dest = dest;

  this._stripSourceCache = {};
  this._typeCache = {};
  this._nameCache = {};
}

ClassicEngine.prototype = {
  fileInfoFor: function(path) {
    return ClassicFileInfo.buildFor(path, {
      sourceRoot: this.source,
      destRoot: this.dest
    });
  }

};

module.exports = ClassicEngine;
