module.exports = {
  'src': {
    'main.js': '"app.js"',
    'router.js': '"router.js"',
    'init': {
      'initializers': {
        'blah.js': '"blah initializer"',
        'derp.js': '"derp initializer"'
      },
      'instance-initializers': {
        'blammo.js': '"blammo instance initializer"'
      }
    },
    'ui': {
      'index.html': 'index.html contents',
      'components': {
        'foo-bar': {
          'component.js': '"foo-bar component"',
          'template.hbs': 'foo-bar component template'
        },
        'baz-derp': {
          'component.js': '"baz-derp component"',
          'template.hbs': 'baz-derp template'
        },
        'i18n.js': '"i18n helper"',
        'blerg.js': '"blerg helper"'
      },
      'routes': {
        'index': {
          '-components': {
            'main-greeting-text.js': '"main-greeting-text helper"'
          },
          'controller.js': '"index controller"',
          'route.js': '"index route"',
          'template.hbs': 'index route template {{main-greeting-text}}'
        },
        'posts': {
          'index': {
            'controller.js': '"posts/index controller"',
            'route.js': '"posts/index route"',
            'template.hbs': 'posts/index route template',
            'route-unit-test.js': '"posts/index unit test"',
            'route-integration-test.js': '"posts/index integration test"'
          },
          'show': {
            'template.hbs': 'posts/post/show route template'
          },
          'post': {
            'index': {
              '-components': {
                'post-display': {
                  'post-footer': {
                    'component.js': '"post-footer component"',
                    'template.hbs': 'post-footer component template',
                    'component-integration-test.js': '"post-footer integration test"'
                  },
                  'component.js': '"post-display component"',
                  'template.hbs': 'post-display component template\n{{post-footer}}',
                  'component-integration-test.js': '"post-display component integration test"'
                }
              },
              'controller.js': '"posts/post/index controller"',
              'route.js': '"posts/post/index route"',
              'template.hbs': 'posts/post/index route template\n{{post-display}}'
            },
            'edit': {
              'controller.js': '"posts/post/edit controller"',
              'route.js': '"posts/post/edit route"',
              'template.hbs': 'posts/post/edit route template'
            }
          },
          'new': {
            '-components': {
              'show-default-title': {
                'helper.js': '"show-default-title helper"',
                'helper-integration-test.js': '"show-default-title helper integration test"'
              }
            },
            'controller.js': '"posts/new controller"',
            'route.js': '"posts/new route"',
            'template.hbs': 'posts/new route template {{show-default-title}}'
          }
        }
      }
    },
    'data': {
      'models': {
        'application': {
          'adapter.js': '"application adapter"',
          'serializer.js': '"application serializer"'
        },
        'post': {
          'adapter.js': '"post adapter"',
          'serializer.js': '"post serializer"',
          'model.js': '"post model"'
        },
        'comment': {
          'adapter.js': '"comment adapter"',
          'serializer.js': '"comment serializer"',
          'model.js': '"comment model"'
        },
        'tag.js': '"tag model"'
      },
      transforms: {
        'date.js': '"custom date transform"'
      }
    },
    'services': {
      'ajax': {
        'service-unit-test.js': '"ajax service unit test"',
        'service.js': '"ajax service"'
      }
    },
    'utils': {
      'mixins': {
        'foo': {
          'mixin.js': '"foo mixin"',
          'mixin-unit-test.js': '"foo mixin unit test"'
        }
      }
    },
    'validators': {
      'blahzorz': {
        'validator.js': '"blahzorz validator"',
        'validator-unit-test.js': '"blahzorz validator test"'
      }
    }
  },
  'tests': {
    'acceptance': {
      'post-test.js': '"post acceptance test"'
    }
  }
};
