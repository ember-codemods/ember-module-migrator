module.exports = {
  app: {
    utils: {
      'nested.js': '"nested util"',
      'single.js': '"single util"',
      'derived-nested.js': 'import NestedUtil from "./nested";',
      'derived-single.js': 'import SingleUtil from "./single";'
    },
    routes: {
      'application.js': 'import NestedUtil from "../utils/nested"; import SingleUtil from "../utils/single";',
      'index.js': 'import ApplicationRoute from "./application";',
      post: {
        'index.js': 'import ApplicationRoute from "../application";'
      }
    }
  },
  tests: {
    unit: {
      utils: {
        'nested-test.js': '"nested util test"'
      },
      routes: {
        'application-test.js': 'import ApplicationRoute from "../../../app/routes/application";'
      }
    }
  }
};
