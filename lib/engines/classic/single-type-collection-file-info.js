var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var SingleTypeCollectionFileInfo = ClassicFileInfo.extend({});

Object.defineProperty(SingleTypeCollectionFileInfo.prototype, 'destRelativePath', {
  get: function() {
    return path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.name + this.ext
    );
  }
});

module.exports = SingleTypeCollectionFileInfo;
