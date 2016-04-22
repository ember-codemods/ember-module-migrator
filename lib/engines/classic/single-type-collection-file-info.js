var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var SingleTypeCollectionFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'SingleTypeCollectionFileInfo',

  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.name + this.ext
    );

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = SingleTypeCollectionFileInfo;
