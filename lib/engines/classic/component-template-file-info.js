var ClassicFileInfo = require('./classic-file-info');

var ComponentTemplateFileInfo = ClassicFileInfo.extend({
  type: 'ComponentTemplateFileInfo',

  init: function(options) {
    this._super(options);

    this.collection = 'elements';
    this.collectionGroup = 'ui';
  },
  populateName: function() {
    this._super();

    var namespace = this.namespace.replace(/^components/, '');

    this.namespace = namespace;
  }
});

module.exports = ComponentTemplateFileInfo;
