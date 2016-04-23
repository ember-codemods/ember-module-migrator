var FileInfo = require('../../models/file-info');

var ClassicFileInfo = FileInfo.extend({
  fileInfoType: 'ClassicFileInfo'
});

module.exports = ClassicFileInfo;
