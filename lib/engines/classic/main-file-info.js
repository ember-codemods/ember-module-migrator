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

    this.collectionGroup = '';
    this.collection = '';

    if (this.name === 'main') {
      // do nothing
    } else if (this.ext === '.js' || this.ext === '.html') {
      this.collection = 'main';
    }

    this.populateDestination();
  },

  populateName: function() {
    if (this.name) {
      return this.name;
    }

    return this.name = path.basename(this.sourceRelativePath, this.ext);
  },

  populateDestination: function() {
    var destRelativePath = path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.name + this.ext
    );

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = MainFileInfo;
