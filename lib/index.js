var RSVP = require('rsvp');
var walkSync = require('walk-sync');
var fse = require('fs-extra');
var move = RSVP.denodeify(fse.move);
var CoreObject = require('core-object');
var engines = require('./engines');
var FileInfoCollection = require('./models/file-info-collection');

var Engine = CoreObject.extend({
  init: function() {
    this._super.apply(this, arguments);

    var engineType = typeof this.engine;

    if (engineType === 'string') {
      this.engine = engines[this.engine];
    } else if (engineType === 'function') {
      // let the user provide their own engine.buildFor
    } else {
      this.engine = engines.classic;
    }

    if (!this.engine) {
      throw new Error('Can not fine engine to use for migration!');
    }

    this._promise = null;
    this._fileInfoCollection = new FileInfoCollection();
    this._fileInfos = [];
  },

  _queueMoveFile: function(source, dest) {
    this._promise = this._promise
      .then(function() {
        return move(source, dest);
      });
  },

  _filesInDir: function(dir) {
    return walkSync(this.projectRoot + '/' + dir)
      .map(function(relativePath) {
        // add the dir back as a prefix
        return dir + '/' + relativePath;
      })
      .filter(function(relativePath) {
        // remove entries for directories
        return relativePath.slice(-1) !== '/';
      });
  },

  _queueRemoveEmptyDirs: function(dir) {
    var projectRoot = this.projectRoot;

    this._promise = this._promise
      .then(function() {
        var contents = walkSync(projectRoot + '/' + dir);
        var files = contents
              .filter(function(entry) {
                return entry.slice(-1) !== '/';
              });
        var directories = contents
              .filter(function(entry) {
                return entry.slice(-1) === '/';
              });

        // there are no files left
        if (files.length === 0) {
          fse.removeSync(projectRoot + '/' + dir);
        }

        // there are files, so we need to only delete empty dirs
        for (var i = 0; i < directories.length; i++){
          var directory = directories[i];
          var hasFiles = files
                .some(function(file) {
                  return file.indexOf(directory) === 0;
                });

          if (!hasFiles) {
            fse.removeSync(projectRoot + '/' + dir + '/' + directory);
          }
        }
      });
  },

  processFiles: function() {
    this._promise = RSVP.resolve();
    var inputFiles = [].concat(
      this._filesInDir('app'),
      this._filesInDir('tests')
    );

    var projectRoot = this.projectRoot;
    var i;

    // build all the fileInfo objects
    for (i = 0; i < inputFiles.length; i++) {
      var relativePath = inputFiles[i];

      this.fileInfoFor(relativePath);
    }

    this.finalizeFileDiscovery();

    // move them all. this is split so that
    // they can all be populated which helps
    // determine the destRelativePath (which is
    // a getter)
    this._fileInfos.forEach(function(fileInfo) {
      var source = projectRoot + '/' + fileInfo.sourceRelativePath;
      var dest = projectRoot + '/' + fileInfo.destRelativePath;

      this._queueMoveFile(source, dest);
    }, this);

    this._queueRemoveEmptyDirs('app');
    this._queueRemoveEmptyDirs('tests');

    return this._promise;
  },

  fileInfoFor: function(path) {
    var fileInfo = this.engine.buildFor(path, {
      projectRoot: this.projectRoot,
      _fileInfoCollection: this._fileInfoCollection
    });

    // not all files return a FileInfo
    if (fileInfo) {
      this._fileInfos.push(fileInfo);
    }

    return fileInfo;
  },

  finalizeFileDiscovery: function() {
    // invoke the `repopulate` hook on each file
    // allowing it to tweak/modify path related
    // properties after all files have been processed
    this._fileInfos.forEach(function(fileInfo) {
      fileInfo.repopulate();
    });
  }
});

module.exports = Engine;
