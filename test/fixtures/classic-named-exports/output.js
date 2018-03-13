module.exports = {
  src: {
    'main.js': 'export default App',
    'router.js': 'export default Router',
    ui: {
      components: {
        'titleize.js': 'import { helper as buildHelper } from \'@ember/component/helper\';\nexport const helper = buildHelper(function() { });',
        'capitalize': {
          'helper.js': 'import { helper as buildHelper } from \'@ember/component/helper\';\nexport default buildHelper(function() { });',
          'helper-integration-test.js': '"capitalize helper test"'
        }
      }
    }
  }
};
