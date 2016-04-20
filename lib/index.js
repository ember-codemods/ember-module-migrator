var walkSync = require('walk-sync');

module.exports = function(options) {
  walkSync(options.source);
};
