var ClassicFileInfo = require('./classic-file-info');

var TemplateFileInfo = ClassicFileInfo.extend({
  type: 'TemplateFileInfo',

  detectRenderableInvocations: function() {

  }
});

module.exports = TemplateFileInfo;
