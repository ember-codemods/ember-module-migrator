var inflection = require('inflection');

module.exports = function(collection) {
  return inflection.singularize(collection);
};
