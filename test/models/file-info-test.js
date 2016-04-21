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

    it('can calculate a destRelativePath', function() {
      assert(file.destRelativePath === 'src/ui/routes/foo-bar/route.js');
    });
  });
});
