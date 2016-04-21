var ClassicFileInfo = require('./classic-file-info');

var SingleTypeCollectionFileInfo = ClassicFileInfo.extend({
  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = 'src/' + this.collection + '/' + this.name + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = SingleTypeCollectionFileInfo;
