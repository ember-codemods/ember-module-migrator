var ClassicFileInfo = require('./classic-file-info');

var MixinFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.type = 'util';

    this._super(options);
  }
});

Object.defineProperty(MixinFileInfo.prototype, 'destRelativePath', {
  get: function() {
    return 'src/' + this.collection + '/mixins/' + this.name + this.ext;
  }
});

module.exports = MixinFileInfo;
