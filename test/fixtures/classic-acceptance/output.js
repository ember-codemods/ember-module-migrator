module.exports = {
  'src': {
    'main.js': 'app.js',
    'init': {
      'initializers': {
        'blah.js': 'blah initializer',
        'derp.js': 'derp initializer'
      },
      'instance-initializers': {
        'blammo.js': 'blammo instance initializer'
      }
    },
    'ui': {
      'hbs': {
        'foo-bar': {
          'component.js': 'foo-bar component',
          'template.hbs': 'foo-bar component template'
        },
        'baz-derp': {
          'component.js': 'baz-derp component',
          'template.hbs': 'baz-derp template'
        },
        'i18n.js': 'i18n helper',
        'blerg.js': 'blerg helper'
      },
      'routes': {
        'index': {
          'controller.js': 'index controller',
          'route.js': 'index route',
          'template.hbs': 'index route template'
        },
        'posts': {
          'index': {
            'controller.js': 'posts/index controller',
            'route.js': 'posts/index route',
            'template.hbs': 'posts/index route template'
          },
          'post': {
            'index': {
              'controller.js': 'posts/post/index controller',
              'route.js': 'posts/post/index route',
              'template.hbs': 'posts/post/index route template'
            },
            'edit': {
              'controller.js': 'posts/post/edit controller',
              'route.js': 'posts/post/edit route',
              'template.hbs': 'posts/post/edit route template'
            }
          },
          'new': {
            'controller.js': 'posts/new controller',
            'route.js': 'posts/new route',
            'template.hbs': 'posts/new route template'
          }
        }
      }
    },
    'data': {
      'models': {
        'application': {
          'adapter.js': 'application adapter',
          'serializer.js': 'application serializer'
        },
        'post': {
          'adapter.js': 'post adapter',
          'serializer.js': 'post serializer',
          'model.js': 'post model'
        },
        'comment': {
          'adapter.js': 'comment adapter',
          'serializer.js': 'comment serializer',
          'model.js': 'comment model'
        }
      }
    }
  }
};
