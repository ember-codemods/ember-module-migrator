var path = require('path');
var fse = require('fs-extra');
var existsSync = require('exists-sync');
var compile = require('htmlbars').compile;
var ClassicFileInfo = require('./classic-file-info');

function buildDetectorPlugin(renderables) {
  function Detector(options) {
    this.options = options;
    this.syntax = null; // set by HTMLBars
  }

  Detector.prototype.transform = function(ast) {
    this.syntax.traverse(ast, {
      MustacheStatement: processNode,
      BlockStatement: processNode,
      SubExpression: processNode
    });

    return ast;
  };

  function processNode(node) {
    var renderable = node.path.original;
    logRenderable(renderable);
    processNodeForComponentOrPartialHelper(node);
  }

  function processNodeForComponentOrPartialHelper(node) {
    var nameNode;

    switch (node.path.original) {
    case 'partial':
    case 'component':
      nameNode = node.params[0];
      break;

    default:
      return;
    }

    if (nameNode.type === 'StringLiteral') {
      logRenderable(nameNode.value);
    }
  }

  function logRenderable(renderable) {
    if (renderables.indexOf(renderable) === -1) {
      renderables.push(renderable);
    }
  }

  return Detector;
}

var TemplateFileInfo = ClassicFileInfo.extend({
  type: 'TemplateFileInfo',

  populate: function() {
    this._super.populate.apply(this, arguments);

    this.detectRenderableInvocations();
  },

  detectRenderableInvocations: function() {
    this.renderablesInvoked = [];

    var fullPath = path.join(this.projectRoot, this.sourceRelativePath);
    if (!existsSync(fullPath)) {
      return;
    }

    var fileContents = fse.readFileSync(fullPath, { encoding: 'utf8' });

    try {
      compile(fileContents, {
        plugins: {
          ast: [buildDetectorPlugin(this.renderablesInvoked)]
        }
      });
    } catch (e) {
      // do nothing
    }

    for (var i = 0; i < this.renderablesInvoked.length; i++) {
      var renderable = this.renderablesInvoked[i];

      this.registerRenderableUsage(renderable);
    }
  },

  registerRenderableUsage: function(renderable) {
    this._fileInfoCollection.registerRenderableInvocation({
      sourceRelativePath: this.sourceRelativePath,
      renderable: renderable,
      fileInfo: this
    });
  }
});


module.exports = TemplateFileInfo;
