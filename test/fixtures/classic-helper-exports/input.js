module.exports = {
  app: {
    helpers: {
      'titleize.js': 'export default helper(function() { });',
      'capitalize.js': 'export default helper(function() { });'
    }
  },

  tests: {
    integration: {
      helpers: {
        'capitalize-test.js': 'capitalize helper test'
      }
    }
  }
};
