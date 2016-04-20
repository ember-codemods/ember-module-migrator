var assert = require('power-assert');
var ClassicEngine = require('../../lib/engines/classic');

describe('classic engine', function() {
  it('can be created with a source and destination', function() {
    var engine = new ClassicEngine('app', 'src');

    assert(engine.source === 'app');
    assert(engine.dest === 'src');
  });

  describe('fileInfoFor', function() {
    var engine;

    beforeEach(function() {
      engine = new ClassicEngine('app', 'src');
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

      confirm('app/components/foo-bar.js', {type: 'component', name: 'foo-bar', collection: 'components'});
      confirm('app/components/foo-bar/component.js', {type: 'component', name: 'foo-bar', collection: 'components'});
      confirm('app/templates/components/foo-bar.hbs', {type: 'template', name: 'foo-bar', collection: 'components'});
      confirm('app/components/foo-bar/template.hbs', {type: 'template', name: 'foo-bar', collection: 'components'});
      confirm('app/routes/foo-bar.js', {type: 'route', name: 'foo-bar', collection: 'routes'});
      confirm('app/routes/foo-bar/baz/index.js', {type: 'route', name: 'foo-bar/baz/index', collection: 'routes'});
      confirm('app/templates/foo-bar.hbs', {type: 'template', name: 'foo-bar', collection: 'routes'});
      confirm('app/templates/foo-bar/baz/index.hbs', {type: 'template', name: 'foo-bar/baz/index', collection: 'routes'});
      confirm('app/adapters/application.js', {type: 'adapter', name: 'application', collection: 'data'});
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
        'app/adapters/post.js': 'src/data/post/adapter.js',
        'app/serializers/post.js': 'src/data/post/serializer.js',
        'app/controllers/foo/bar/baz.js': 'src/routes/foo/bar/baz/controller.js'
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
});
