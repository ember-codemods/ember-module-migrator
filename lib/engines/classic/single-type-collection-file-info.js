var ClassicFileInfo = require('./classic-file-info');

var SingleTypeCollectionFileInfo = ClassicFileInfo.extend({});

Object.defineProperty(SingleTypeCollectionFileInfo.prototype, 'destRelativePath', {
  get: function() {
    return 'src/' + this.collection + '/' + this.name + this.ext;
  }
});

module.exports = SingleTypeCollectionFileInfo;
