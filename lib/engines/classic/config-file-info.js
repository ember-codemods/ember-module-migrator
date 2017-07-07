var ClassicFileInfo = require('./classic-file-info');

var ConfigFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'ConfigFileInfo',


  init: function(options) {
    this._super(options);
    options.type = 'config';
    options.base = '.';
    options.sourceRoot = '.';
  },

  populateCollection: function() {
    this.collection = '..';
    this.collectionGroup = '';
  }
});

module.exports = ConfigFileInfo;