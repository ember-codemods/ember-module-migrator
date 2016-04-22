var FileInfo = require('../../models/file-info');

var PLURAL_OVERRIDES = {
  'mirage': 'mirage',
  'html': 'html'
};
var ClassicFileInfo = FileInfo.extend({
  fileInfoType: 'ClassicFileInfo',
  plural_overrides: PLURAL_OVERRIDES
});

module.exports = ClassicFileInfo;
