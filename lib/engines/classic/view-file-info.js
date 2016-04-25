var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var ViewFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'ViewFileInfo',

  repopulate: function() {
    var viewName = path.join(this.namespace, this.name);

    if (this._fileInfoCollection.viewInvokedInTemplate(viewName)) {
      this.collectionGroup = 'ui';
      this.collection = 'views';
    }
  }
});

module.exports = ViewFileInfo;
