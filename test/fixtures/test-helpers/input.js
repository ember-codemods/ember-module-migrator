module.exports = {
  app: {
    'app.js': '// app',
    'resolver.js': '// resolver',
    adapters: {
      '.eslint.js': '{}'
    }
  },
  config: {
    'environment.js': '"ENV"'
  },
  tests: {
    '.eslintrc.js': 'module.exports = {};',
    '.eslint.js': '{}',
    'test-helper.js': '{}',
    helpers: {
      'resolver.js': 'import Resolver from "../../resolver";',
      'start-app.js': 'import App from "../../app";'
    }
  }
};
