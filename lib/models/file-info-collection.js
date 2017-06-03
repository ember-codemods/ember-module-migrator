var CoreObject = require('core-object');

var FileInfoCollection = CoreObject.extend({
  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    this._fileInfos = [];
    this._bucketCounts = {};
    this._renderableInvocations = {};
    this._viewInvocations = {};
  },

  add: function(fileInfo) {
    this._fileInfos.push(fileInfo);

    var bucket = fileInfo.bucket;
    if (!this._bucketCounts[bucket]) {
      this._bucketCounts[bucket] = 0;
    }

    this._bucketCounts[bucket]++;
  },

  registerViewInvocation: function(viewName) {
    this._viewInvocations[viewName] = true;
  },

  registerRenderableInvocation: function(options) {
    var invocationDetails = this._renderableInvocations[options.renderable];
    if (!invocationDetails) {
      this._renderableInvocations[options.renderable] = invocationDetails = {
        sourceRelativePaths: [],
        fileInfos: []
      };
    }

    invocationDetails.sourceRelativePaths.push(options.sourceRelativePath);
    invocationDetails.fileInfos.push(options.fileInfo);
  },

  filesInBucket: function(bucket) {
    return this._bucketCounts[bucket];
  },

  detectPrivateRenderableInvoker: function(renderableName) {
    var invocationDetails = this._renderableInvocations[renderableName];

    if (invocationDetails && invocationDetails.fileInfos.length === 1) {
      return invocationDetails.fileInfos[0];
    }

    return null;
  },

  viewInvokedInTemplate: function(viewName) {
    return this._viewInvocations[viewName];
  }
});

module.exports = FileInfoCollection;
