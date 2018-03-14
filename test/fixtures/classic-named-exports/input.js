var stripIndents = require('common-tags').stripIndents;

module.exports = {
  app: {
    // ensure we do not rewrite main files
    'app.js': 'export default App',
    'router.js': 'export default Router',
    helpers: {
      'titleize.js': stripIndents`
        import { helper } from '@ember/component/helper';
        export default helper(function() { });
      `,
      'capitalize.js': stripIndents`
        import { helper } from '@ember/component/helper';
        export default helper(function() { });
      `
    }
  },

  tests: {
    integration: {
      helpers: {
        'capitalize-test.js': '"capitalize helper test"'
      }
    }
  }
};
