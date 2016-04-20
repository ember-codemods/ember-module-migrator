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

      confirm('components/foo-bar.js', {type: 'component', name: 'foo-bar', collection: 'components'});
      confirm('components/foo-bar/component.js', {type: 'component', name: 'foo-bar', collection: 'components'});
      confirm('templates/components/foo-bar.hbs', {type: 'template', name: 'foo-bar', collection: 'components'});
      confirm('components/foo-bar/template.hbs', {type: 'template', name: 'foo-bar', collection: 'components'});
      confirm('routes/foo-bar.js', {type: 'route', name: 'foo-bar', collection: 'routes'});
      confirm('routes/foo-bar/baz/index.js', {type: 'route', name: 'foo-bar/baz/index', collection: 'routes'});
      confirm('templates/foo-bar.hbs', {type: 'template', name: 'foo-bar', collection: 'routes'});
      confirm('templates/foo-bar/baz/index.hbs', {type: 'template', name: 'foo-bar/baz/index', collection: 'routes'});
      confirm('adapters/application.js', {type: 'adapter', name: 'application', collection: 'data'});
    });

    describe('file info destinations', function() {
      var mappings = {
        'components/foo-bar.js': 'components/foo-bar/component.js',
        'components/qux-derp/component.js': 'components/qux-derp/component.js',
        'templates/components/foo-bar.hbs': 'components/foo-bar/template.hbs',
        'components/qux-derp/template.hbs': 'components/qux-derp/template.hbs',
        'routes/post/index.js': 'routes/post/index/route.js',
        'templates/post/index.hbs': 'routes/post/index/template.hbs',
        'routes/foo/bar/baz.js': 'routes/foo/bar/baz/route.js',
        'templates/foo/bar/baz.hbs': 'routes/foo/bar/baz/template.hbs',
        'adapters/post.js': 'data/post/adapter.js',
        'serializers/post.js': 'data/post/serializer.js',
        'controllers/foo/bar/baz.js': 'routes/foo/bar/baz/controller.js'
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
