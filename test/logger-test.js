var path = require('path');
var assert = require('power-assert');
var Logger = require('../lib/models/logger');

describe('logger', function() {
  var logger;

  beforeEach(function() {
    logger = new Logger({
      projectRoot: __dirname
    });
  });

  it('tracks moved files', function() {
    var source = 'app/helpers/titleize.js';
    var dest = 'src/ui/components/titleize.js';

    logger.movedFile(source, dest);

    var output = logger.flush();

    assert(output.indexOf(source) > -1);
    assert(output.indexOf(dest) > -1);
  });

  it('uses paths relative to root', function() {
    var source = path.resolve(__dirname, 'app/helpers/titleize.js');
    var dest = path.resolve(__dirname, 'src/ui/components/titleize.js');

    logger.movedFile(source, dest);

    var output = logger.flush();

    assert(output.indexOf(__dirname) === -1);
  });
});
