var path = require('path');
var inflection = require('inflection');

var PLURAL_OVERRIDES = {
  'mirage': 'mirage'
};

function ClassicFileInfo(_options) {
  var options = _options || {};

  this.sourceRoot = options.sourceRoot;
  this.destRoot = options.destRoot;

  this.sourceRelativePath = options.sourceRelativePath;
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
      collection = 'data';
      break;

    case 'route':
    case 'controller':
    case 'template':
      collection = 'routes';
      break;

    default:
      collection = inflection.pluralize(this.type, PLURAL_OVERRIDES[this.type]);
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

function MainFileInfo(options) {
  options.type = 'main';

  ClassicFileInfo.apply(this, arguments);

  this.collection = 'main';
}
MainFileInfo.prototype = Object.create(ClassicFileInfo.prototype);
MainFileInfo.prototype.constructor = MainFileInfo;

MainFileInfo.prototype.populateDestination = function() {
  if (this.destRelativePath) {
    return this.destRelativePath;
  }

  var destRelativePath = this.name + this.ext;

  return this.destRelativePath = destRelativePath;
};

function SingleTypeCollectionFileInfo() {
  ClassicFileInfo.apply(this, arguments);
}
SingleTypeCollectionFileInfo.prototype = Object.create(ClassicFileInfo.prototype);
SingleTypeCollectionFileInfo.prototype.constructor = SingleTypeCollectionFileInfo;

SingleTypeCollectionFileInfo.prototype.populateDestination = function() {
  if (this.destRelativePath) {
    return this.destRelativePath;
  }

  var destRelativePath = this.collection + '/' + this.name + this.ext;

  return this.destRelativePath = destRelativePath;
};

SingleTypeCollectionFileInfo.typeIncluded = function(type) {
  switch (type) {
    // data
  case 'adapter':
  case 'serializer':
  case 'model':
    return false;

    // routes
  case 'route':
  case 'controller':
  case 'template':
    return false;

    // components
  case 'component':
    return false;

  default:
    return true;
  }
};

module.exports = {
  buildFor: function(filePath, options) {
    var sourceRelativePath = filePath.replace(new RegExp('^' + options.sourceRoot + '/'), '');
    var ext = path.extname(filePath);
    var pathParts = sourceRelativePath.split('/');

    options.sourceRelativePath = sourceRelativePath;

    if (pathParts.length === 1) {
      // handle files in the source root
      return new MainFileInfo(options);
    }

    var topLevelDirectory = pathParts[0];

    options.type = inflection.singularize(topLevelDirectory);

    if (ext === '.hbs') {
      options.type = 'template';

      if (/^(templates\/)?components/.test(sourceRelativePath)) {
        return new ComponentTemplateFileInfo(options);
      }
    }

    if (SingleTypeCollectionFileInfo.typeIncluded(options.type)) {
      return new SingleTypeCollectionFileInfo(options);
    } else {
      return new ClassicFileInfo(options);
    }
  }
};
