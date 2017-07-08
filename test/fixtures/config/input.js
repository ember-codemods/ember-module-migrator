module.exports = {
  app: {
    'app.js': 'import config from "./config/environment";',
    utils: {
      'first.js': 'import ConfigUtils from "./config/third";',
      'second.js': 'import config from "../config/environment";',
      config: {
        'third.js': 'import config from "../../config/environment";',
      }
    }
  },
  config: {
    'environment.js': '"ENV"',
    foo: {
      'baz.sh': 'yolo'
    }
  },
  tests: {
    'helpers': {
      'resolver.js': 'import config from "../../config/environment";',
      'start-app.js': 'import config from "my-app/config/environment";'
    },
    unit: {
      utils: {
        'first-test.js': 'import config from "../../../config/environment";',
        'second-test.js': 'import config from "my-app/config/environment";',
        config: {
          'third-test.js': 'import config from "my-app/config/environment";'
        }
      }
    }
  }
};
