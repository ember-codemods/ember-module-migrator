var CoreObject = require('core-object');

var FileInfoCollection = CoreObject.extend({
  init: function() {
    this._fileInfos = [];
    this._bucketCounts = {};
    this._renderableInvocations = {};
  },

  add: function(fileInfo) {
    this._fileInfos.push(fileInfo);

    var bucket = fileInfo.bucket;
    if (!this._bucketCounts[bucket]) {
      this._bucketCounts[bucket] = 0;
    }

    this._bucketCounts[bucket]++;
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
  }
});

module.exports = FileInfoCollection;
