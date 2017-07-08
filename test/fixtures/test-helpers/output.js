module.exports = {
  src: {
    'main.js': '// app',
    'resolver.js': '// resolver'
  },
  config: {
    'environment.js': '"ENV"'
  },
  tests: {
    '.eslint.js': '{}',
    'test-helper.js': '{}',
    'helpers': {
      'resolver.js': 'import Resolver from "../../src/resolver";',
      'start-app.js': 'import App from "../../src/main";'
    }
  }
};
