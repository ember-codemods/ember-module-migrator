var path = require('path');
var fse = require('fs-extra');
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
      renderables.push(node.path.original);
      processSubExpressionsInNode(node);
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

  return Detector;
}

var TemplateFileInfo = ClassicFileInfo.extend({
  type: 'TemplateFileInfo',

  read: function() {
    var fullPath = path.join(this.projectRoot, this.sourceRelativePath);

    return fse.readFileSync(fullPath, { encoding: 'utf8' });
  },

  detectRenderableInvocations: function() {
    var fileContents = this.read();
    this.renderablesInvoked = [];

    compile(fileContents, {
      plugins: {
        ast: [buildDetectorPlugin(this.renderablesInvoked)]
      }
    });
  }
});

module.exports = TemplateFileInfo;
