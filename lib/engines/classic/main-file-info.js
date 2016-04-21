var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var MainFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.type = 'main';

    if (options.sourceRelativePath === 'app/app.js') {
      options.name = 'main';
    }
    this._super(options);

    this.collection = 'main';
  },

  populateName: function() {
    if (this.name) {
      return this.name;
    }

    return this.name = path.basename(this.sourceRelativePath, this.ext);
  }
});

Object.defineProperty(MainFileInfo.prototype, 'destRelativePath', {
  get: function() {
    return 'src/' + this.name + this.ext;
  }
});

module.exports = MainFileInfo;
