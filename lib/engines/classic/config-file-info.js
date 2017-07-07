var ClassicFileInfo = require('./classic-file-info');

var ConfigFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'ConfigFileInfo',


  init: function(options) {
    options.type = 'config';
    options.base = '.';
    options.sourceRoot = '.';

    this._super(options);
  },

  populateCollection: function() {
    this.collection = '..';
    this.collectionGroup = '';
  }
});

module.exports = ConfigFileInfo;