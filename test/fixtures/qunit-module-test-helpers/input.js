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
    'test-helper.js': 'import App from "../app";',
    helpers: {
      'resolver.js': 'import Resolver from "../../resolver";'
    }
  }
};
