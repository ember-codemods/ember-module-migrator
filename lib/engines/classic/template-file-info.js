var path = require('path');
var fse = require('fs-extra');
var existsSync = require('exists-sync');
var compile = require('htmlbars').compile;
var ClassicFileInfo = require('./classic-file-info');

function buildDetectorPlugin(fileInfo) {
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
    logRenderable(renderable, node);
    processNodeForStaticComponentHelper(node);
    processNodeForViewHelper(node);
  }

  function processNodeForStaticComponentHelper(node) {
    if (node.path.original !== 'component') {
      return;
    }

    var componentName = node.params[0];
    if (componentName.type === 'StringLiteral') {
      logRenderable(componentName.value, node);
    }
  }

  function processNodeForViewHelper(node) {
    if (node.path.original !== 'view') {
      return;
    }

    var viewName = node.params[0];
    if (viewName.type === 'StringLiteral') {
      fileInfo.registerViewInvocation(viewName.value);
    }
  }

  function logRenderable(renderableName) {
    if (fileInfo.renderablesInvoked.indexOf(renderableName) === -1) {
      fileInfo.renderablesInvoked.push(renderableName);
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

    this._fileContents = fse.readFileSync(fullPath, { encoding: 'utf8' });

    try {
      compile(this._fileContents, {
        plugins: {
          ast: [buildDetectorPlugin(this)]
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

  registerViewInvocation: function(viewName) {
    this._fileInfoCollection.registerViewInvocation(viewName);
  },

  registerRenderableUsage: function(renderable) {
    this._fileInfoCollection.registerRenderableInvocation({
      sourceRelativePath: this.sourceRelativePath,
      renderable: renderable,
      fileInfo: this
    });
  },

  updateRenderableName: function(source, dest) {
    if (!this._fileContents) { return; }

    var newContents = this._fileContents
          .replace(new RegExp('{{' + source,'g'), '{{' + dest)
          .replace(new RegExp('{{#' + source,'g'), '{{#' + dest)
          .replace(new RegExp('{{/' + source,'g'), '{{/' + dest);


    var fullPath = path.join(this.projectRoot, this.sourceRelativePath);

    this._fileContents = fse.readFileSync(fullPath, { encoding: 'utf8' });
    fse.writeFileSync(fullPath, newContents, { encoding: 'utf-8' });
  }
});

module.exports = TemplateFileInfo;
