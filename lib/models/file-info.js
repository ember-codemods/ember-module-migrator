var path = require('path');
var CoreObject = require('core-object');
var fse = require('fs-extra');
var existsSync = require('exists-sync');
var jscodeshift = require('jscodeshift');
var isTypeInSingleTypeCollection = require('../utils/is-type-in-single-type-collection');
var defaultTypeForCollection = require('../utils/default-type-for-collection');
var calculateCollectionInfo = require('../utils/calculate-collection-info');
var importDeclarationsTransform = require('../transforms/import-declarations');

var FileInfo = CoreObject.extend({
  type: 'FileInfo',

  init: function(_options) {
    this._super.init && this._super.init.apply(this, arguments);

    var options = _options || {};
    this.options = options;
    this.projectRoot = options.projectRoot;

    this.sourceRelativePath = options.sourceRelativePath;
    this.type = options.type;

    this.ext = options.ext;
    this.base = options.base || 'src';
    this.name = options.name;
    this._bucket = options.bucket;
    this.namespace = options.namespace;
    this.sourceRoot = options.sourceRoot;
    this.collection = options.collection;
    this.collectionGroup = options.collectionGroup;
    this.destRelativePath = options.destRelativePath;

    this._fileInfoCollection = options._fileInfoCollection;

    this.populate();
  },

  populate: function() {
    this.populateExt();
    this.populateName();
    this.populateCollection();
    this.populateBucket();
    this.populateFileContents();

    this._fileInfoCollection.add(this);
  },

  populateBucket: function() {
    this.bucket = path.join(
      this.base,
      this.collectionGroup,
      this.collection,
      this.namespace,
      this.name
    );
  },

  populateExt: function() {
    if (this.ext) { return this.ext; }

    return this.ext = path.extname(this.sourceRelativePath);
  },

  populateName: function() {
    if (this.name) {
      return;
    }

    var pathParts = this.sourceRelativePath.split('/');
    var typeFolder = pathParts[1];

    var strippedRelativePath = this.sourceRelativePath
          .replace(new RegExp('^' + this.sourceRoot + '/' + typeFolder + '/'), '') // remove leading type dir
          .replace(new RegExp(this.ext + '$'), '') // remove extension
          .replace(new RegExp('/' + this.type + '$'), ''); // remove trailing type

    var parts = strippedRelativePath.split('/');
    this.name = parts.pop();
    this.namespace = parts.join('/');
  },

  populateCollection: function(_type) {
    var type = _type || this.type;
    var values = calculateCollectionInfo(type);

    this.collection = values.collection;
    this.collectionGroup = values.collectionGroup;
  },

  populateFileContents: function() {
    var fullPath = path.join(this.projectRoot, this.sourceRelativePath);
    if (!existsSync(fullPath)) {
      return;
    }

    this._fileContents = fse.readFileSync(fullPath, { encoding: 'utf8' });
  },

  updateImports: function() {
    if (this.ext !== '.js' || !this._fileContents) { return; } // only process JavaScript files

    var appName = this.options.projectName;

    try {
      var newContents = importDeclarationsTransform(
        { source: this._fileContents,
          fileInfo: this,
          appName: appName,
          fileInfos: this._fileInfoCollection._fileInfos
        },
        { jscodeshift });

      var fullPath = path.join(this.projectRoot, this.sourceRelativePath);

      fse.writeFileSync(fullPath, newContents, { encoding: 'utf-8' });
      this._fileContents = newContents;
    } catch(e) {
      // eslint-disable-next-line no-console
      console.log('error parsing file `' + this.sourceRelativePath + '` failed to apply codeshift. Possible invalid JS file. Returning original file unchanged. error: ' + e.message);
    }
  },

  repopulate: function() {
    this.updateImports();

    var inComponentsCollection = this.collection === 'components';
    var renderableName = path.join(this.namespace, this.name);

    if (inComponentsCollection) {
      var privateRenderableInvoker = this._fileInfoCollection.detectPrivateRenderableInvoker(renderableName);

      this._privateRenderableInvoker = privateRenderableInvoker;

      if (privateRenderableInvoker) {
        var invokerPath = path.join(privateRenderableInvoker.namespace, privateRenderableInvoker.name);
        if (invokerPath === this.namespace) {
          var source = path.join(this.namespace, this.name);
          var dest = this.name;

          privateRenderableInvoker.updateRenderableName(source, dest);
          this.namespace = '';
        }
      }
    }

    var isDefaultTypeForCollection = defaultTypeForCollection(this.collection) === this.type;
    var shouldUseDotFormNaming = this.shouldUseDotFormNaming();

    if (!isDefaultTypeForCollection && shouldUseDotFormNaming) {
      this.updateDefaultExportToNamed();
    }
  },

  updateDefaultExportToNamed: function() {
    if (this.ext !== '.js') { return; }
    if (!this._fileContents) { return; }

    var newContents = this._fileContents
          .replace('export default ', 'export const ' + this.type + ' = ');


    var fullPath = path.join(this.projectRoot, this.sourceRelativePath);

    fse.writeFileSync(fullPath, newContents, { encoding: 'utf-8' });
    this._fileContents = newContents;
  },

  shouldUseDotFormNaming: function() {
    var filesInBucket = this._fileInfoCollection.filesInBucket(this.bucket);

    // when more than one file is in the same bucket
    // we can never use <name>.<ext>
    if (filesInBucket > 1) {
      return false;
    }

    // if we are in a collection that only contains one type
    // then use <name>.<ext> when only one file is present
    if (isTypeInSingleTypeCollection(this.type)) {
      return true;
    }

    if (this.type === 'util') {
      return true;
    }

    var isDefaultTypeForCollection = defaultTypeForCollection(this.collection) === this.type;

    // use <name>.<ext> in the root of a collection if it is the default type
    return isDefaultTypeForCollection;
  }
});

Object.defineProperty(FileInfo.prototype, 'destRelativePath', {
  get: function() {
    var baseRelativePath = path.join(
      this.base + '/',
      this.collectionGroup,
      this.collection
    );

    if (this._privateRenderableInvoker) {
      var invokerLocation = path.dirname(this._privateRenderableInvoker.destRelativePath);
      var invokerInComponentsCollection = this._privateRenderableInvoker.collection === 'components';
      var invokerInPrivateCollection = invokerLocation.indexOf('-components') > -1;
      var privateCollection = invokerInPrivateCollection || invokerInComponentsCollection? '' : '-components';

      baseRelativePath = path.join(
        invokerLocation,
        privateCollection
      );
    }
    var destRelativePath;

    if (this.shouldUseDotFormNaming()) {
      destRelativePath = path.join(
        baseRelativePath,
        this.namespace,
        this.name + this.ext
      );
    } else {
      destRelativePath = path.join(
        baseRelativePath,
        this.namespace,
        this.name,
        (this._fileNameType || this.type) + this.ext
      );
    }

    return destRelativePath;
  }
});

module.exports = FileInfo;
