var RSVP = require('rsvp');
var walkSync = require('walk-sync');
var fse = require('fs-extra');
var move = RSVP.denodeify(fse.move);
var CoreObject = require('core-object');
var engines = require('./engines');
var FileInfoCollection = require('./models/file-info-collection');
var Logger = require('./models/logger');

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
      throw new Error('Can not find engine to use for migration!');
    }

    this._promise = null;
    this._fileInfoCollection = new FileInfoCollection();
    this._logger = new Logger({
      projectRoot: this.projectRoot
    });
    this._fileInfos = [];
  },

  _queueMoveFile: function(source, dest) {
    if (source === dest) {
      return;
    }

    var logger = this._logger;

    this._promise = this._promise
      .then(function() {
        return move(source, dest);
      })
      .then(function() {
        logger.movedFile(source, dest);
      });
  },

  _safeWalkSync: function(dir) {
    var projectDir = this.projectRoot + '/' + dir;
    return fse.existsSync(projectDir) ? walkSync(projectDir) : [];
  },

  _filesInDir: function(dir) {
    return this._safeWalkSync(dir)
      // add the dir back as a prefix
      .map( relativePath => dir + '/' + relativePath )
      // remove entries for directories
      .filter( relativePath => relativePath.slice(-1) !== '/');
  },

  _queueRemoveEmptyDirs: function(dir) {
    this._promise = this._promise
      .then(() => {
        var contents = this._safeWalkSync(dir);
        var files = contents
              .filter(function(entry) {
                return entry.slice(-1) !== '/' && entry.slice(-8) !== '.gitkeep';
              });
        var directories = contents
              .filter(function(entry) {
                return entry.slice(-1) === '/';
              });

        // there are no files left
        if (files.length === 0) {
          fse.removeSync(this.projectRoot + '/' + dir);
        }

        // there are files, so we need to only delete empty dirs
        for (var i = 0; i < directories.length; i++){
          var directory = directories[i];
          var hasFiles = files
                .some(function(file) {
                  return file.indexOf(directory) === 0;
                });

          if (!hasFiles) {
            fse.removeSync(this.projectRoot + '/' + dir + '/' + directory);
          }
        }
      });
  },

  processFiles: function() {
    this._promise = RSVP.resolve();
    var inputFiles = [].concat(
      this._filesInDir('app'),
      this._filesInDir('tests'),
      this._filesInDir('config')
    );

    var verbose = this.verbose;
    var logger = this._logger;
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

    return this._promise
      .then(function() {
        /*eslint no-console: 0 */
        if (verbose) {
          console.log(logger.flush());
        }
      });
  },

  fileInfoFor: function(path) {
    var fileInfo = this.engine.buildFor(path, {
      projectRoot: this.projectRoot,
      projectName: this.projectName,
      podModulePrefix: this.podModulePrefix !== undefined ? this.podModulePrefix : 'pods',
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
