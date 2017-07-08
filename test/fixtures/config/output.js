module.exports = {
  src: {
    'main.js': 'import config from "../config/environment";',
    utils: {
      first: {
        'util.js': 'import ConfigUtils from "../config/third/util";',
        'util-unit-test.js': 'import config from "../../../config/environment";'
      },
      second: {
        'util.js': 'import config from "../../../config/environment";',
        'util-unit-test.js': 'import config from "my-app/config/environment";'
      },
      config: {
        third: {
          'util-unit-test.js': 'import config from "my-app/config/environment";',
          'util.js': 'import config from "../../../../config/environment";'
        }
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
    }
  }
};
