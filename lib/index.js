var RSVP = require('rsvp');
var walkSync = require('walk-sync');
var fse = require('fs-extra');
var move = RSVP.denodeify(fse.move);

var engines = require('./engines');

function Engine(source, dest, engine) {
  this.source = source;
  this.dest = dest;

  if (typeof engine === 'function') {
    this.engine = engine;
  } else {
    this.engine = engines[engine] || engines.classic;
  }

  this._promise = null;
}

Engine.prototype = {
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
    return this.engine.buildFor(path, {
      sourceRoot: this.source,
      destRoot: this.dest
    });
  }
};

module.exports = Engine;
