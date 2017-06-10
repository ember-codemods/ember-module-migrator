module.exports = {
  src: {
    data: {
      models: {
        application: {
          'adapter.js': '//app serializer',
          'model.js': '//app model'
        },
        post: {
          'adapter.js': 'import ApplicationSerializer from "../application/adapter";',
          'model.js': 'import ApplicationModel from "../application/model";'
        }
      }
    },
    ui: {
      routes: {
        application: {
          'route.js': 'import NestedUtil from "../../../utils/nested/util"; import SingleUtil from "../../../utils/single";',
          'route-unit-test.js': 'import ApplicationRoute from "./route"; import NestedTest from "../../../utils/nested/util-unit-test";'
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
