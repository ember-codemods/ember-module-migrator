var TemplateFileInfo = require('./template-file-info');

var ComponentTemplateFileInfo = TemplateFileInfo.extend({
  type: 'ComponentTemplateFileInfo',

  init: function(options) {
    this._super(options);

    this.collection = 'elements';
    this.collectionGroup = 'ui';
  },
  populateName: function() {
    this._super.populateName.apply(this, arguments);

    var namespace = this.namespace.replace(/^components/, '');

    this.namespace = namespace;
  }
});

module.exports = ComponentTemplateFileInfo;
