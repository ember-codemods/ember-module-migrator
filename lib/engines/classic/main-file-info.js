var ClassicFileInfo = require('./classic-file-info');

var MainFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.type = 'main';

    if (options.sourceRelativePath === 'app.js') {
      options.name = 'main';
    }
    this._super(options);

    this.collection = 'main';
  },
  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = this.name + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = MainFileInfo;
