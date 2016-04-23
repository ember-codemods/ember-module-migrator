var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var SingleTypeCollectionFileInfo = ClassicFileInfo.extend({});

Object.defineProperty(SingleTypeCollectionFileInfo.prototype, 'destRelativePath', {
  get: function() {
    var filesInBucket = this._fileInfoCollection && this._fileInfoCollection.filesInBucket(this.bucket);
    var baseRelativePath = path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.namespace,
      this.name
    );

    var shouldUseDotForm = filesInBucket === 1;

    if (shouldUseDotForm) {
      return baseRelativePath + this.ext;
    } else {
      return path.join(baseRelativePath, this.type + this.ext);
    }
  }
});

module.exports = SingleTypeCollectionFileInfo;
