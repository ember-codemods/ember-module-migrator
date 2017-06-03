var path = require('path');
var chalk = require('chalk');
var CoreObject = require('core-object');
var Table = require('cli-table2');

var Logger = CoreObject.extend({
  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    this._movedFiles = {};
    this._renamedRenderables = [];
  },

  movedFile: function(_source, _destination) {
    var source = path.relative(this.projectRoot, _source);
    var destination = path.relative(this.projectRoot, _destination);

    this._movedFiles[source] = destination;
  },

  flush: function() {
    // guard against environments such as travis that report zero columns
    var columns = process.stdout.columns || 80;
    var maxWidth = columns - 4;
    var halfWidth = Math.floor(maxWidth / 2);
    var table = new Table({
      head: ['Source', 'Destination'],
      colWidths: [halfWidth, halfWidth]
    });


    for (var source in this._movedFiles) {
      var destination = this._movedFiles[source];

      table.push([chalk.cyan(source), chalk.yellow(destination)]);
    }

    return table.toString();
  }
});

module.exports = Logger;
