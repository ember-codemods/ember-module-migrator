var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var ComponentFileInfo = ClassicFileInfo.extend({
  type: 'ComponentFileInfo'
});

Object.defineProperty(ComponentFileInfo.prototype, 'destRelativePath', {
  get: function() {
    var renderableName = path.join(this.namespace, this.name);
    var privateRenderableInvoker = this._fileInfoCollection.detectPrivateRenderableInvoker(renderableName);

    var destRelativePath;

    if (privateRenderableInvoker) {
      destRelativePath = path.join(
        'src',
        privateRenderableInvoker.collectionGroup,
        privateRenderableInvoker.collection,
        privateRenderableInvoker.namespace,
        privateRenderableInvoker.name,
        '-' + this.collection,
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

module.exports = ComponentFileInfo;
