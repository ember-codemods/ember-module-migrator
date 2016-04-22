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
  },

  populateName: function() {
    this.namespace = '';

    if (!this.name) {
      this.name = path.basename(this.sourceRelativePath, this.ext);
    }
  }
});

Object.defineProperty(MainFileInfo.prototype, 'destRelativePath', {
  get: function() {
    return path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.name + this.ext
    );
  }
});

module.exports = MainFileInfo;
