var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var ROOT_FILES = ['main', 'router', 'routes'];

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

    if (ROOT_FILES.indexOf(this.name) > -1) {
      // do nothing (leave them in `src/` root)
    } else if (this.name === 'index' && this.ext === '.html') {
      this.collectionGroup = 'ui';
    }
  },

  populateName: function() {
    this.namespace = '';

    if (!this.name) {
      this.name = path.basename(this.sourceRelativePath, this.ext);
    }
  },

  // do not rewrite exports for main files
  updateDefaultExportToNamed: function() { }
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
