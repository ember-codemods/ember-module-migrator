var assert = require('power-assert');
var assertDiff = require('assert-diff');
var fixturify = require('fixturify');
var fse = require('fs-extra');
var Migrator = require('../../lib');

describe('classic engine', function() {
  describe('fileInfoFor', function() {
    var engine;

    beforeEach(function() {
      engine = new Migrator({
        projectRoot: '.'
      });
    });

    it('returns an object', function() {
      var file = engine.fileInfoFor('components/foo-bar.js');

      assert(file);
    });

    describe('file info properties', function() {
      function confirm(path, expected) {
        it(path + ' has the expected properties', function() {
          var file = engine.fileInfoFor(path);

          var keys = Object.keys(expected);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];

            assert(file[key] === expected[key]);
          }
        });
      }

      confirm('app/components/foo-bar.js', {type: 'component', name: 'foo-bar', collection: 'components'});
      confirm('app/components/foo-bar/component.js', {type: 'component', name: 'foo-bar', collection: 'components'});
      confirm('app/templates/components/foo-bar.hbs', {type: 'template', name: 'foo-bar', collection: 'components'});
      confirm('app/components/foo-bar/template.hbs', {type: 'template', name: 'foo-bar', collection: 'components'});
      confirm('app/routes/foo-bar.js', {type: 'route', name: 'foo-bar', collection: 'routes'});
      confirm('app/routes/foo-bar/baz/index.js', {type: 'route', name: 'foo-bar/baz/index', collection: 'routes'});
      confirm('app/templates/foo-bar.hbs', {type: 'template', name: 'foo-bar', collection: 'routes'});
      confirm('app/templates/foo-bar/baz/index.hbs', {type: 'template', name: 'foo-bar/baz/index', collection: 'routes'});
      confirm('app/adapters/application.js', {type: 'adapter', name: 'application', collection: 'models'});
      confirm('app/app.js', {type: 'main', name: 'main', collection: 'main'});
      confirm('app/index.md', { name: 'index', collection: 'main' });
      confirm('app/styles/app.css', { type: 'style', name: 'app', collection: 'styles' });
      confirm('app/styles/components/badges.css', { type: 'style', name: 'components/badges', collection: 'styles' });
      confirm('app/mixins/foo/bar.js', { type: 'util', name: 'foo/bar', collection: 'utils' });

    });

    describe('file info destinations', function() {
      var mappings = {
        'app/components/foo-bar.js': 'src/components/foo-bar/component.js',
        'app/components/qux-derp/component.js': 'src/components/qux-derp/component.js',
        'app/templates/components/foo-bar.hbs': 'src/components/foo-bar/template.hbs',
        'app/components/qux-derp/template.hbs': 'src/components/qux-derp/template.hbs',
        'app/routes/post/index.js': 'src/routes/post/index/route.js',
        'app/templates/post/index.hbs': 'src/routes/post/index/template.hbs',
        'app/routes/foo/bar/baz.js': 'src/routes/foo/bar/baz/route.js',
        'app/templates/foo/bar/baz.hbs': 'src/routes/foo/bar/baz/template.hbs',
        'app/adapters/post.js': 'src/models/post/adapter.js',
        'app/serializers/post.js': 'src/models/post/serializer.js',
        'app/controllers/foo/bar/baz.js': 'src/routes/foo/bar/baz/controller.js',
        'app/templates/posts/post/index.hbs': 'src/routes/posts/post/index/template.hbs',
        'app/app.js': 'src/main.js',
        'app/router.js': 'src/router.js',
        'app/index.html': 'src/index.html',
        'app/styles/app.css': 'src/styles/app.css',
        'app/styles/components/badges.css': 'src/styles/components/badges.css',
        'app/mirage/config.js': 'src/mirage/config.js',
        'app/mirage/factories/foo.js': 'src/mirage/factories/foo.js',
        'app/mixins/foo/bar.js': 'src/utils/mixins/foo/bar.js'
      };

      function confirm(src, expected) {
        it('should map ' + src + ' to ' + expected, function() {
          var file = engine.fileInfoFor(src);

          assert(file.destRelativePath === expected);
        });
      }

      for (var src in mappings) {
        var expected = mappings[src];
        confirm(src, expected);
      }
    });
  });

  describe('processFiles', function() {
    var tmpPath = 'tmp/process-files';

    beforeEach(function() {
      fse.mkdirsSync(tmpPath);
    });

    afterEach(function() {
      fse.removeSync(tmpPath);
    });

    it('should be able to migrate a file structure', function() {
      var input = require('../fixtures/classic-acceptance/input');
      var expected = require('../fixtures/classic-acceptance/output');

      fixturify.writeSync(tmpPath, input);

      var engine = new Migrator({
        projectRoot: tmpPath
      });

      return engine.processFiles()
        .then(function() {
          var actual = fixturify.readSync(tmpPath);

          assertDiff.deepEqual(actual, expected);
        });
    });
  });
});
