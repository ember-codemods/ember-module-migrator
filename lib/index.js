var RSVP = require('rsvp');
var walkSync = require('walk-sync');
var fse = require('fs-extra');
var move = RSVP.denodeify(fse.move);
var CoreObject = require('core-object');
var engines = require('./engines');

var Engine = CoreObject.extend({
  init: function(options) {
    this.sourceRoot = options.sourceRoot;
    this.destRoot = options.destRoot;

    if (typeof options.engine === 'function') {
      this.engine = options.engine;
    } else {
      this.engine = engines[options.engine] || engines.classic;
    }

    this._promise = null;
  },

  _queueMoveFile: function(source, dest) {
    this._promise = this._promise
      .then(function() {
        return move(source, dest);
      });
  },

  processFiles: function() {
    this._promise = RSVP.resolve();
    var inputFiles = walkSync(this.sourceRoot);

    var source = this.sourceRoot;
    var dest = this.destRoot;

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
    return this.engine.buildFor(path, {
      sourceRoot: this.sourceRoot,
      destRoot: this.destRoot
    });
  }
});

module.exports = Engine;
