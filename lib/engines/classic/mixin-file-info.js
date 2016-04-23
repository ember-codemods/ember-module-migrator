var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var MixinFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'MixinFileInfo',

  init: function(options) {
    options.type = 'util';

    this._super(options);
    this.namespace = path.join('mixins', this.namespace);
    this._fileNameType = 'mixin';
    this.populate();
  }
});

module.exports = MixinFileInfo;
