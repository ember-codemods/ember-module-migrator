var ClassicFileInfo = require('./classic-file-info');

var MixinFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.type = 'util';

    this._super(options);
  },
  populateDestination: function() {
    if (this.destRelativePath) {
      return this.destRelativePath;
    }

    var destRelativePath = 'src/' + this.collection + '/mixins/' + this.name + this.ext;

    return this.destRelativePath = destRelativePath;
  }
});

module.exports = MixinFileInfo;
