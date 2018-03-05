var path = require('path');
var assert = require('power-assert');
var assertDiff = require('assert-diff');
var fixturify = require('fixturify');
var fse = require('fs-extra');
var Migrator = require('../../lib');

assertDiff.options.strict = true;

describe('classic engine', function() {
  describe('fileInfoFor', function() {
    var engine;

    beforeEach(function() {
      engine = new Migrator({
        projectRoot: '.',
        projectName: 'my-app'
      });
    });

    it('returns an object', function() {
      var file = engine.fileInfoFor('app/components/foo-bar.js');

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

      confirm('app/components/foo-bar.js', {type: 'component', name: 'foo-bar', namespace: '', collection: 'components', collectionGroup: 'ui'});
      confirm('app/helpers/foo.js', {type: 'helper', name: 'foo', namespace: '', collection: 'components', collectionGroup: 'ui'});
      confirm('app/helpers/foo/bar.js', {type: 'helper', name: 'bar', namespace: 'foo', collection: 'components', collectionGroup: 'ui'});
      confirm('app/components/foo-bar/component.js', {type: 'component', name: 'foo-bar', namespace: '', collection: 'components', collectionGroup: 'ui' });
      confirm('app/templates/components/foo-bar.hbs', {type: 'template', name: 'foo-bar', namespace: '', collection: 'components', collectionGroup: 'ui'});
      confirm('app/components/foo-bar/template.hbs', {type: 'template', name: 'foo-bar', namespace: '', collection: 'components', collectionGroup: 'ui'});
      confirm('app/routes/foo-bar.js', {type: 'route', name: 'foo-bar', namespace: '', collection: 'routes', collectionGroup: 'ui'});
      confirm('app/routes/foo-bar/baz/index.js', {type: 'route', name: 'index', namespace: 'foo-bar/baz', collection: 'routes', collectionGroup: 'ui'});
      confirm('app/templates/foo-bar.hbs', {type: 'template', name: 'foo-bar', collection: 'routes', collectionGroup: 'ui'});
      confirm('app/templates/foo-bar/baz/index.hbs', {type: 'template', name: 'index', namespace: 'foo-bar/baz', collection: 'routes', collectionGroup: 'ui'});
      confirm('app/adapters/application.js', {type: 'adapter', name: 'application', namespace: '', collection: 'models', collectionGroup: 'data' });
      confirm('app/app.js', {type: 'main', name: 'main', namespace: '', collection: '', collectionGroup: ''});
      confirm('app/router.js', {type: 'main', name: 'router', namespace: '', collection: '', collectionGroup: ''});
      confirm('app/index.md', { name: 'index', namespace: '', collection: '', collectionGroup: '' });
      confirm('app/index.html', { name: 'index', namespace: '', collection: '', collectionGroup: 'ui' });
      confirm('app/styles/app.css', { type: 'style', name: 'app', namespace: '', collection: 'styles', collectionGroup: 'ui' });
      confirm('app/styles/components/badges.css', { type: 'style', name: 'badges', namespace: 'components', collection: 'styles', collectionGroup: 'ui' });
      confirm('app/mixins/foo/bar.js', { type: 'util', name: 'bar', namespace: 'mixins/foo', collection: 'utils' });
      confirm('app/authorizers/oauth2.js', { type: 'authorizer', name: 'oauth2', namespace: '', collection: 'authorizers', collectionGroup: 'simple-auth'});

      // tests
      confirm('tests/unit/routes/foo-bar-test.js', { type: 'route-unit-test', name: 'foo-bar', collection: 'routes', collectionGroup: 'ui'});
      confirm('tests/unit/mixins/bar-test.js', { type: 'mixin-unit-test', name: 'bar', collection: 'utils', collectionGroup: ''});
      confirm('tests/unit/services/foo-test.js', { type: 'service-unit-test', name: 'foo', collection: 'services', collectionGroup: ''});
      confirm('tests/unit/utils/foo-test.js', { type: 'util-unit-test', name: 'foo', collection: 'utils', collectionGroup: ''});
      confirm('tests/unit/validators/foo-test.js', { type: 'validator-unit-test', name: 'foo', collection: 'validators', collectionGroup: ''});
    });

    describe('file info destinations', function() {
      var mappings = {
        'app/components/foo-bar.js': 'src/ui/components/foo-bar/component.js',
        'app/components/qux-derp/component.js': 'src/ui/components/qux-derp/component.js',
        'app/templates/components/foo-bar.hbs': 'src/ui/components/foo-bar/template.hbs',
        'app/components/qux-derp/template.hbs': 'src/ui/components/qux-derp/template.hbs',
        'app/routes/post/index.js': 'src/ui/routes/post/index.js',
        'app/templates/post/index.hbs': 'src/ui/routes/post/index/template.hbs',
        'app/routes/foo/bar/baz.js': 'src/ui/routes/foo/bar/baz.js',
        'app/templates/foo/bar/baz.hbs': 'src/ui/routes/foo/bar/baz/template.hbs',
        'app/adapters/post.js': 'src/data/models/post/adapter.js',
        'app/serializers/post.js': 'src/data/models/post/serializer.js',
        'app/controllers/foo/bar/baz.js': 'src/ui/routes/foo/bar/baz/controller.js',
        'app/templates/posts/post/index.hbs': 'src/ui/routes/posts/post/index/template.hbs',
        'app/app.js': 'src/main.js',
        'app/routes.js': 'src/routes.js',
        'app/router.js': 'src/router.js',
        'app/README.md': 'src/README.md',
        'app/_config.yml': 'src/_config.yml',
        'app/index.html': 'src/ui/index.html',
        'app/styles/app.css': 'src/ui/styles/app.css',
        'app/styles/components/badges.css': 'src/ui/styles/components/badges.css',
        'app/mirage/config.js': 'src/mirage/config.js',
        'app/mirage/factories/foo.js': 'src/mirage/factories/foo.js',
        'app/mixins/foo/bar.js': 'src/utils/mixins/foo/bar.js',
        'app/initializers/foo.js': 'src/init/initializers/foo.js',
        'app/instance-initializers/bar.js': 'src/init/instance-initializers/bar.js',
        'app/routes/foo.js': 'src/ui/routes/foo.js',
        'app/models/post.js': 'src/data/models/post.js',

        // tests
        'tests/unit/routes/foo-bar-test.js': 'src/ui/routes/foo-bar/route-unit-test.js',
        'tests/unit/.gitkeep': null,
        'tests/unit/mixins/bar-test.js': 'src/utils/mixins/bar/mixin-unit-test.js',
        'tests/unit/services/foo-test.js': 'src/services/foo/service-unit-test.js',
        'tests/unit/utils/some-thing-test.js': 'src/utils/some-thing/util-unit-test.js',

        // simple auth
        'app/authorizers/oauth2.js': 'src/simple-auth/authorizers/oauth2.js'
      };

      function confirm(src, expected) {
        it('should map ' + src + ' to ' + expected, function() {
          var file = engine.fileInfoFor(src);

          if (expected === null) {
            assert(!file);
          } else {
            assert(file.destRelativePath === expected);
          }
        });
      }

      for (var src in mappings) {
        var expected = mappings[src];
        confirm(src, expected);
      }
    });
  });

  describe('acceptance', function() {
    var tmpPath = 'tmp/process-files';
    var fixturesPath = path.resolve(__dirname, '../fixtures');

    beforeEach(function() {
      fse.mkdirsSync(tmpPath);
    });

    afterEach(function() {
      fse.removeSync(tmpPath);
    });

    var entries = fse.readdirSync(fixturesPath);

    entries.forEach(function(entry) {
      it('should migrate ' + entry + ' fixture properly', function() {
        var fixturePath = path.join(fixturesPath, entry);
        var input = require(fixturePath + '/input');
        var expected = require(fixturePath + '/output');
        var migratorConfig = {};
        try {
          migratorConfig = require(fixturePath + '/config');
        } catch (e) {
          // fixture uses default config...
        }

        fixturify.writeSync(tmpPath, input);
        var migratorOptions = Object.assign({}, {
          projectRoot: tmpPath,
          projectName: 'my-app'
        }, migratorConfig);

        var engine = new Migrator(migratorOptions);

        return engine.processFiles()
          .then(function() {
            var actual = fixturify.readSync(tmpPath);

            assertDiff.deepEqual(actual, expected);
          });
      });
    });
  });
});
