module.exports = {
  app: {
    models: {
      'application.js': '//app model',
      'post.js': 'import ApplicationModel from "./application";'
    },
    adapters: {
      'application.js': '//app serializer',
      'post.js': 'import ApplicationSerializer from "./application";'
    },
    utils: {
      'nested.js': '"nested util"',
      'single.js': '"single util"',
      'derived-nested.js': 'import NestedUtil from "./nested";',
      'derived-single.js': 'import SingleUtil from "./single";'
    },
    pods: {
      application: {
        'route.js': 'import NestedUtil from "../../utils/nested"; import SingleUtil from "../../utils/single";'
      },
      index: {
        'route.js': 'import ApplicationRoute from "../application/route";',
      },
      post: {
        index: {
          'route.js': 'import ApplicationRoute from "../../application/route";'
        }
      }
    }
  },
  tests: {
    unit: {
      utils: {
        'nested-test.js': '"nested util test"'
      },
      routes: {
        'application-test.js': 'import ApplicationRoute from "../../../pods/application/route"; import NestedTest from "../utils/nested-test";'
      }
    }
  }
};
