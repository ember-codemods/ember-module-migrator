var assertDiff = require('assert-diff');
var fixturify = require('fixturify');
var fse = require('fs-extra');
var Migrator = require('../../../lib');

assertDiff.options.strict = true;

describe('template-file-info', function() {
  describe('detectRenderableInvocations', function() {
    var tmpPath = 'tmp/detect-templates';

    beforeEach(function() {
      fse.mkdirsSync(tmpPath);
    });

    afterEach(function() {
      fse.removeSync(tmpPath);
    });

    function confirmDetectsRenderables(templateSnippet, expectedRenderables) {
      it('`' + templateSnippet + '` should include ' + expectedRenderables, function() {
        fixturify.writeSync(tmpPath, {
          app: {
            templates: {
              'post.hbs': templateSnippet
            }
          }
        });

        var engine = new Migrator({
          projectRoot: tmpPath
        });

        var file = engine.fileInfoFor('app/templates/post.hbs');
        file.detectRenderableInvocations();

        assertDiff.deepEqual(file.renderablesInvoked, expectedRenderables);
      });
    }

    // components
    confirmDetectsRenderables('{{#foo-bar}}{{/foo-bar}}', ['foo-bar']);
    confirmDetectsRenderables('{{foo-bar derp="blammo"}}', ['foo-bar']);
    confirmDetectsRenderables('<div>{{#foo-bar}}{{huz-zah blah="lolol"}}{{/foo-bar}}</div>', ['foo-bar', 'huz-zah']);
    confirmDetectsRenderables('{{yield (hash foo=(build-thing) bar=(component "bar-baz"))}}', ['yield', 'hash', 'build-thing', 'component', 'bar-baz']);
    confirmDetectsRenderables('{{component "foo-bar"}}', ['component', 'foo-bar']);
    confirmDetectsRenderables('{{foo/bar/baz/x-blah}}', ['foo/bar/baz/x-blah']);

    // helpers
    confirmDetectsRenderables('{{t "some thing"}}', ['t']);
    confirmDetectsRenderables('{{t "some thing"}}{{t "whopdee doo"}}', ['t']);
    confirmDetectsRenderables('{{derp blah="haha"}}', ['derp']);
    confirmDetectsRenderables('<div data-foo={{derp blah="haha"}}></div>', ['derp']);

    // error tolerance
    confirmDetectsRenderables('<div>', []);
  });
});
