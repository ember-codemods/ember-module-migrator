var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var MixinFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'MixinFileInfo',

  init: function(options) {
    options.type = 'util';

    this._super(options);
  },
  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      '/mixins/',
      this.name + this.ext
    );

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = MixinFileInfo;
