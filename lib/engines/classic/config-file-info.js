var ClassicFileInfo = require('./classic-file-info');

var ConfigFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'ConfigFileInfo',


  init: function(options) {
    // sourceRoot needs to be set before the super call so that non js files stay in place
    options.sourceRoot = '.';
    this._super(options);

    options.type = 'config';
    options.base = '.';
  },

  populateCollection: function() {
    this.collection = '..';
    this.collectionGroup = '';
  }
});

module.exports = ConfigFileInfo;