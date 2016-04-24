var path = require('path');
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

Object.defineProperty(TemplateFileInfo.prototype, 'destRelativePath', {
  get: function() {
    var renderableName = path.join(this.namespace, this.name);
    var privateRenderableInvoker = this._fileInfoCollection.detectPrivateRenderableInvoker(renderableName);

    var destRelativePath;

    if (privateRenderableInvoker) {
      var invokerLocation = path.dirname(privateRenderableInvoker.destRelativePath);
      var privateCollection = invokerLocation.indexOf('-elements') > -1 ? '' : '-elements';

      destRelativePath = path.join(
        invokerLocation,
        privateCollection,
        this.namespace,
        this.name,
        this.type + this.ext
      );
    } else {
      destRelativePath = path.join(
        'src/',
        this.collectionGroup,
        this.collection,
        this.namespace,
        this.name,
        this.type + this.ext
      );
    }

    return destRelativePath;
  }
});

module.exports = ComponentTemplateFileInfo;
