var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var MainFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'MainFileInfo',

  init: function(options) {
    options.type = 'main';

    if (options.sourceRelativePath === 'app/app.js') {
      options.name = 'main';
    }
    this._super(options);

    this.collection = 'main';
    this.collectionGroup = 'core';

    this.destRelativePath = null;
    this.populateDestination();
  },

  populateName: function() {
    if (this.name) {
      return this.name;
    }

    return this.name = path.basename(this.sourceRelativePath, this.ext);
  },

  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = path.join(
      'src/',
      this.collectionGroup,
      this.name + this.ext
    );

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = MainFileInfo;
