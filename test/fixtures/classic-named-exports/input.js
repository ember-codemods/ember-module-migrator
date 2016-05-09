module.exports = {
  app: {
    // ensure we do not rewrite main files
    'app.js': 'export default App',
    'router.js': 'export default Router',
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
