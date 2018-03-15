var stripIndents = require('common-tags').stripIndents;

module.exports = {
  src: {
    'main.js': 'export default App',
    'router.js': 'export default Router',
    ui: {
      components: {
        'titleize.js': stripIndents`
          import { helper as buildHelper } from '@ember/component/helper';
          export const helper = buildHelper(function() { });
        `,
        'capitalize': {
          'helper.js': stripIndents`
            import { helper as buildHelper } from '@ember/component/helper';
            export default buildHelper(function() { });
          `,
          'helper-integration-test.js': '"capitalize helper test"'
        }
      }
    }
  }
};
