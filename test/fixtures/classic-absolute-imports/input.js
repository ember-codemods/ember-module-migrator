module.exports = {
  app: {
    utils: {
      'nested.js': '"nested util"',
      'single.js': '"single util"'
    },
    routes: {
      'application.js': 'import NestedUtil from "my-app/utils/nested"; import SingleUtil from "my-app/utils/single";'
    }
  },
  tests: {
    unit: {
      utils: {
        'nested-test.js': '"nested util test"'
      },
      routes: {
        'application-test.js': 'import ApplicationRoute from "my-app/routes/application";'
      }
    }
  }
};
