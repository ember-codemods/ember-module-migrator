module.exports = {
  src: {
    'main.js': 'import config from "../config/environment";',
    utils: {
      first: {
        'util.js': 'import config from "my-app/config/environment";',
        'util-unit-test.js': 'import config from "../../../config/environment";'
      },
      second: {
        'util.js': 'import config from "../../../config/environment";',
        'util-unit-test.js': 'import config from "my-app/config/environment";'
      }
    }
  },
  config: {
    'environment.js': '"ENV"'
  }
};
