var CoreObject = require('core-object');

var FileInfoCollection = CoreObject.extend({
  init: function() {
    this._fileInfos = [];
    this._bucketCounts = {};
  },

  add: function(fileInfo) {
    this._fileInfos.push(fileInfo);

    var bucket = fileInfo.bucket;
    if (!this._bucketCounts[bucket]) {
      this._bucketCounts[bucket] = 0;
    }

    this._bucketCounts[bucket]++;
  },

  filesInBucket: function(bucket) {
    return this._bucketCounts[bucket];
  }
});

module.exports = FileInfoCollection;
