module.exports = {
  app: {
    'app.js': '// app',
    'resolver.js': '// resolver'
  },
  config: {
    'environment.js': '"ENV"'
  },
  tests: {
    helpers: {
      'resolver.js': 'import Resolver from "../../resolver";',
      'start-app.js': 'import App from "../../app";'
    }
  }
};
