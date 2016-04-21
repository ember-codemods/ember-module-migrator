var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var MixinFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'MixinFileInfo',

  init: function(options) {
    options.type = 'util';

    this._super(options);
  }
});

Object.defineProperty(MixinFileInfo.prototype, 'destRelativePath', {
  get: function() {
    return path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      '/mixins/',
      this.name + this.ext
    );
  }
});

module.exports = MixinFileInfo;
