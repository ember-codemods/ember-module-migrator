var assert = require('power-assert');
var Migrator = require('../../lib');

describe('file-info model', function() {
  describe('destRelativePath', function() {
    var engine;

    beforeEach(function() {
      engine = new Migrator({
        projectRoot: '.'
      });

    });

    it('can calculate a destRelativePath where type is the same as collection', function() {
      var file = engine.fileInfoFor('app/routes/foo-bar.js');

      assert(file.destRelativePath === 'src/ui/routes/foo-bar.js');
    });

    it('can calculate a destRelativePath where type is not the same as collection', function() {
      var file = engine.fileInfoFor('app/adapters/foo.js');

      assert(file.destRelativePath === 'src/data/models/foo/adapter.js');
    });

    it('uses <name>.<ext> instead of <name>/<type>.<ext> when only a single item that is the default type is present', function() {
      var file = engine.fileInfoFor('app/models/foo.js');

      assert(file.destRelativePath === 'src/data/models/foo.js');
    });

    it('uses <name>/<ext> instead of <name>.<type>.<ext> when multiple items exist for the bucket', function() {
      var model = engine.fileInfoFor('app/models/foo.js');
      var adapter = engine.fileInfoFor('app/adapters/foo.js');

      assert(model.destRelativePath === 'src/data/models/foo/model.js');
      assert(adapter.destRelativePath === 'src/data/models/foo/adapter.js');
    });
  });
});
