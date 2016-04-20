var path = require('path');
var walkSync = require('walk-sync');
var fse = require('fs-extra');
var RSVP = require('rsvp');
var move = RSVP.denodeify(fse.move);

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

    var name = this.sourceRelativePath
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

ClassicFileInfo.buildFor = function(filePath, options) {
  var sourceRelativePath = filePath.replace(new RegExp('^' + options.sourceRoot + '/'), '');
  var ext = path.extname(filePath);

  options.sourceRelativePath = sourceRelativePath;

  if (ext === '.js') {
    var pathParts = sourceRelativePath.split('/');

    if (pathParts.length === 1) {
      // handle files in the source root
      return new MainFileInfo(options);
    } else {
      options.type = pathParts[0].slice(0, -1); // stupidly drop `s`
    }
  } else if (ext === '.hbs') {
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
};

function ClassicEngine(source, dest) {
  this.source = source;
  this.dest = dest;

  this._promise = null;
}

ClassicEngine.prototype = {
  _queueMoveFile: function(source, dest) {
    this._promise = this._promise
      .then(function() {
        return move(source, dest);
      });
  },

  processFiles: function() {
    this._promise = RSVP.resolve();
    var inputFiles = walkSync(this.source);

    var source = this.source;
    var dest = this.dest;

    for (var i = 0; i < inputFiles.length; i++) {
      var relativePath = inputFiles[i];
      if (relativePath.slice(-1) === '/') { continue; } // skip directories

      var fileInfo = this.fileInfoFor(relativePath);
      var finalSource = source + '/' + relativePath;
      var finalDest = dest + '/' + fileInfo.destRelativePath;

      this._queueMoveFile(finalSource, finalDest);
    }

    return this._promise;
  },

  fileInfoFor: function(path) {
    return ClassicFileInfo.buildFor(path, {
      sourceRoot: this.source,
      destRoot: this.dest
    });
  }

};

module.exports = ClassicEngine;
