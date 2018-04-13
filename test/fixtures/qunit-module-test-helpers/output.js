module.exports = {
  app: {
    adapters: {
      '.eslint.js': '{}'
    }
  },
  src: {
    'main.js': '// app',
    'resolver.js': '// resolver'
  },
  config: {
    'environment.js': '"ENV"'
  },
  tests: {
    '.eslintrc.js': 'module.exports = {};',
    '.eslint.js': '{}',
    'test-helper.js': 'import App from "../src/main";',
    'helpers': {
      'resolver.js': 'import Resolver from "../../src/resolver";'
    }
  }
};
