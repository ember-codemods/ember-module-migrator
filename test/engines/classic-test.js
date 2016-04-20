var assert = require('power-assert');
var ClassicEngine = require('../../lib/engines/classic');

describe('classic engine', function() {
  it('can be created with a source and destination', function() {
    var engine = new ClassicEngine('app', 'src');

    assert(engine.source === 'app');
    assert(engine.dest === 'src');
  });

  describe('_calculateType', function() {
    function confirmType(path, expectedType) {
      it(path + ' should be a ' + expectedType, function() {
        var engine = new ClassicEngine('app', 'src');

        assert(engine._calculateType(path) === expectedType);
      });
    }

    confirmType('app/components/foo-bar/template.hbs', 'component-template');
    confirmType('app/templates/components/foo-bar.hbs', 'component-template');
    confirmType('app/components/foo-bar/component.js', 'component');
    confirmType('app/components/foo-bar.js', 'component');
    confirmType('app/routes/foo-bar.js', 'route');
    confirmType('app/adapters/post.js', 'adapter');
    confirmType('app/serializers/post.js', 'serializer');
  });

  describe('_calculateName', function() {
    function confirm(path, expected) {
      it(path + ' should be named ' + expected, function() {
        var engine = new ClassicEngine('app', 'src');

        assert(engine._calculateName(path) === expected);
      });
    }

    confirm('app/components/foo-bar/template.hbs', 'foo-bar');
    confirm('app/templates/components/foo-bar.hbs', 'foo-bar');
    confirm('app/components/foo-bar/component.js', 'foo-bar');
    confirm('app/components/foo-bar.js', 'foo-bar');
    confirm('app/components/foo/baz-bar.js', 'foo/baz-bar');
    confirm('app/routes/foo/bar/baz.js', 'foo/bar/baz');
    confirm('app/adapters/post.js', 'post');
  });

  describe('calculateDestFor', function() {
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
        var engine = new ClassicEngine('app', 'src');
        var actual = engine.calculateDestFor(src);

        assert(actual === expected);
      });
    }

    for (var src in mappings) {
      var expected = mappings[src];
      confirm(src, expected);
    }
  });
});
