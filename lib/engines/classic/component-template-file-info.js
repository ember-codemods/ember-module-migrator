var ClassicFileInfo = require('./classic-file-info');

var ComponentTemplateFileInfo = ClassicFileInfo.extend({
  init: function(options) {
    options.collection = 'components';
    this._super(options);
  },
  populateName: function() {
    this._super();

    var name = this.name.replace(/^components\//, '');

    return this.name = name;
  }
});

module.exports = ComponentTemplateFileInfo;
