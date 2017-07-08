module.exports = {
  src: {
    'main.js': '// app',
    'resolver.js': '// resolver'
  },
  config: {
    'environment.js': '"ENV"'
  },
  tests: {
    'helpers': {
      'resolver.js': 'import Resolver from "../../src/resolver";',
      'start-app.js': 'import App from "../../src/main";'
    }
  }
};
