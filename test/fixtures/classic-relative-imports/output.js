module.exports = {
  src: {
    ui: {
      routes: {
        application: {
          'route.js': 'import NestedUtil from "../../../utils/nested/util"; import SingleUtil from "../../../utils/single";',
          'route-unit-test.js': 'import ApplicationRoute from "./route";'
        },
        'index.js': 'import ApplicationRoute from "./application/route";',
        post: {
          'index.js': 'import ApplicationRoute from "../application/route";'
        }
      }
    },
    utils: {
      'derived-nested.js': 'import NestedUtil from "./nested/util";',
      'derived-single.js': 'import SingleUtil from "./single";',
      nested: {
        'util.js': '"nested util"',
        'util-unit-test.js': '"nested util test"'
      },
      'single.js': '"single util"'
    }
  }
};
