var ClassicFileInfo = require('./classic-file-info');

var MiscFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'MiscFileInfo',


  init: function(options) {
    // sourceRoot needs to be set before the super call so that non js files stay in place
    options.sourceRoot = '.';
    this._super(options);

    options.type = 'misc';
  },

  populateCollection: function() {
    this.collection = '..';
    this.collectionGroup = '';
  }
});

module.exports = MiscFileInfo;