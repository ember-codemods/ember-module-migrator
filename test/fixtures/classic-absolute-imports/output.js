module.exports = {
  src: {
    ui: {
      routes: {
        application: {
          'route.js': 'import NestedUtil from "my-app/src/utils/nested/util"; import SingleUtil from "my-app/src/utils/single";',
          'route-unit-test.js': 'import ApplicationRoute from "my-app/src/ui/routes/application/route";'
        }
      }
    },
    utils: {
      nested: {
        'util.js': '"nested util"',
        'util-unit-test.js': '"nested util test"'
      },
      'single.js': '"single util"'
    }
  }
};
