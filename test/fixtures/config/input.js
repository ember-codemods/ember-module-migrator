module.exports = {
  app: {
    'app.js': 'import config from "./config/environment";',
    utils: {
      'first.js': 'import config from "my-app/config/environment";',
      'second.js': 'import config from "../config/environment";'
    }
  },
  config: {
    'environment.js': '"ENV"'
  },
  tests: {
    unit: {
      utils: {
        'first-test.js': 'import config from "../../../config/environment";',
        'second-test.js': 'import config from "my-app/config/environment";'
      }
    }
  }
};
