module.exports = {
  app: {
    'app.js': '// app',
    'resolver.js': '// resolver'
  },
  config: {
    'environment.js': '"ENV"'
  },
  tests: {
    '.eslint.js': '{}',
    'test-helper.js': '{}',
    helpers: {
      'resolver.js': 'import Resolver from "../../resolver";',
      'start-app.js': 'import App from "../../app";'
    }
  }
};
