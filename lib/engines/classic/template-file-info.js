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
    var walker = new this.syntax.Walker();

    walker.visit(ast, function(node) {
      if (canContainExpressions(node)) {
        processExpression(node);
      }
    });

    return ast;
  };

  function canContainExpressions(node) {
    var types = ['BlockStatement', 'MustacheStatement', 'ElementNode'];

    return types.indexOf(node.type) > -1;
  }

  function processExpression(node) {
    if (node.type === 'ElementNode') {
      processAttributesInElementNode(node);
    } else {
      logRenderable(node.path.original);
      processSubExpressionsInNode(node);
      processNodeForStaticComponentHelper(node);
    }
  }

  function processNodeForStaticComponentHelper(node) {
    if (node.path.original !== 'component') {
      return;
    }

    var componentName = node.params[0];
    if (componentName.type === 'StringLiteral') {
      logRenderable(componentName.value);
    }
  }

  function processSubExpressionsInNode(node) {
    var i;

    for (i = 0; i < node.params.length; i++) {
      if (node.params[i].type === 'SubExpression') {
        processExpression(node.params[i]);
      }
    }

    for (i = 0; i < node.hash.pairs.length; i++) {
      var pair = node.hash.pairs[i];
      var value = pair.value;

      if (value.type === 'SubExpression') {
        processExpression(value);
      }
    }
  }

  function processAttributesInElementNode(node) {
    for (var i = 0; i < node.attributes.length; i++) {
      if (node.attributes[i].value.type === 'MustacheStatement') {
        processExpression(node.attributes[i].value);
      }
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

    compile(fileContents, {
      plugins: {
        ast: [buildDetectorPlugin(this.renderablesInvoked)]
      }
    });

    for (var i = 0; i < this.renderablesInvoked.length; i++) {
      var renderable = this.renderablesInvoked[i];

      this._fileInfoCollection.registerRenderableInvocation({
        sourceRelativePath: this.sourceRelativePath,
        renderable: renderable,
        fileInfo: this
      });
    }
  }
});

module.exports = TemplateFileInfo;
