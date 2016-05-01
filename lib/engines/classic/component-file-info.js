var ClassicFileInfo = require('./classic-file-info');

var ComponentFileInfo = ClassicFileInfo.extend({
  fileInfoType: 'ComponentFileInfo',

  shouldUseDotFormNaming: function() {
    // components should always use <name>/<type>.<ext>
    return false;
  }
});

module.exports = ComponentFileInfo;
