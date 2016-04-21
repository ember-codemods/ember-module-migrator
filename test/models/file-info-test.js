var assert = require('power-assert');
var Migrator = require('../../lib');

describe('file-info model', function() {
  describe('destRelativePath', function() {
    var engine, file;

    beforeEach(function() {
      engine = new Migrator({
        projectRoot: '.'
      });

      file = engine.fileInfoFor('app/routes/foo-bar.js');
    });

    it('calls _fileInfoCollection.filesInBucket', function() {
      var called = false;

      file._fileInfoCollection.filesInBucket = function() {
        called = true;
      };

      assert(file.destRelativePath === 'src/routes/foo-bar.route.js');
      assert.ok(called, 'called filesInBucket');
    });

    it('uses slashes when multiple files exist', function() {
      var file2 = engine.fileInfoFor('app/controllers/foo-bar.js');

      assert(file.destRelativePath === 'src/routes/foo-bar/route.js');
      assert(file2.destRelativePath === 'src/routes/foo-bar/controller.js');
    });

  });
});
