var path = require('path');
var inflection = require('inflection');
var FileInfo = require('../models/file-info');

var PLURAL_OVERRIDES = {
  'mirage': 'mirage',
  'html': 'html'
};
var ClassicFileInfo = FileInfo.extend({
  plural_overrides: PLURAL_OVERRIDES
});

var ComponentTemplateFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.collection = 'components';
    this._super(options);
  },
  populateName: function() {
    this._super();

    var name = this.name.replace(/^components\//, '');

    return this.name = name;
  }
});
var MainFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.type = 'main';

    if (options.sourceRelativePath === 'app.js') {
      options.name = 'main';
    }
    this._super(options);

    this.collection = 'main';
  },
  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = this.name + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

var SingleTypeCollectionFileInfo = ClassicFileInfo.extend({
  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = this.collection + '/' + this.name + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

var MixinFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.type = 'util';

    this._super(options);
  },
  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = this.collection + '/mixins/' + this.name + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});
function typeIncluded(type) {
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
}

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

    if (topLevelDirectory === 'mixins') {
      return new MixinFileInfo(options);
    } else if (typeIncluded(options.type)) {
      return new SingleTypeCollectionFileInfo(options);
    } else {
      return new ClassicFileInfo(options);
    }
  }
};
