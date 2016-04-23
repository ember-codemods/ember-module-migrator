var path = require('path');
var ClassicFileInfo = require('./classic-file-info');

var TestFileInfo = ClassicFileInfo.extend({
  populate: function() {
    this.testType = this.options.testType;
    this.testSubjectType = this.options.testSubjectType;


    this.populateExt();
    this.populateName();
    this.populateCollection();

    if (this.testSubjectType === 'mixin') {
      this.testType = 'utils';
      this.namespace = path.join(this.namespace, 'mixins');
    }

    this.populateBucket();

    this._fileInfoCollection.add(this);
  },

  populateName: function() {
    var pathParts = this.sourceRelativePath.split('/');
    var testTypeFolder = pathParts[1];
    var typeFolder = pathParts[2];

    var strippedRelativePath = this.sourceRelativePath
          .replace(new RegExp('^' + this.sourceRoot + '/' + testTypeFolder + '/(' + typeFolder + '/)?'), '') // remove leading type dir
          .replace(new RegExp('-test.js$'), ''); // remove extension

    var parts = strippedRelativePath.split('/');
    this.name = parts.pop();
    this.namespace = parts.join('/');
  },

  populateCollection: function() {
    this._super.populateCollection.apply(this, [this.testSubjectType]);
  }
});

Object.defineProperty(TestFileInfo.prototype, 'destRelativePath', {
  get: function() {
    return path.join(
      'src/',
      this.collectionGroup,
      this.collection,
      this.namespace,
      this.name,
      this.type + this.ext
    );
  }
});

module.exports = TestFileInfo;
