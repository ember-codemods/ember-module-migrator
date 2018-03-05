module.exports = {
  'app': {
    'app.js': '"app.js"',
    'router.js': '"router.js"',
    'index.html': 'index.html contents',
    'pods': {
      'components': {
        'foo-bar': {
          'component.js': '"foo-bar component"',
          'template.hbs': 'foo-bar component template'
        } ,
        'baz-derp': {
          'component.js': '"baz-derp component"',
          'template.hbs': 'baz-derp template'
        },
        'post-display': {
          'component.js': '"post-display component"',
          'template.hbs': 'post-display component template\n{{post-footer}}'
        },
        'post-footer': {
          'component.js': '"post-footer component"',
          'template.hbs': 'post-footer component template'
        },
      },
      'index': {
        'template.hbs': 'index route template {{main-greeting-text}}',
        'controller.js': '"index controller"',
        'route.js': '"index route"',
      },
      'posts': {
        'index': {
          'route.js': '"posts/index route"',
          'controller.js': '"posts/index controller"',
          'template.hbs': 'posts/index route template',
        },
        'post': {
          'index': {
            'route.js': '"posts/post/index route"',
            'controller.js': '"posts/post/index controller"',
            'template.hbs': 'posts/post/index route template\n{{post-display}}',
          },
          'edit': {
            'route.js': '"posts/post/edit route"',
            'controller.js': '"posts/post/edit controller"',
            'template.hbs': 'posts/post/edit route template'
          },
        },
        'new': {
          'route.js': '"posts/new route"',
          'controller.js': '"posts/new controller"',
          'template.hbs': 'posts/new route template {{show-default-title}}',
        },
        'show': {
          'template.hbs': 'posts/post/show route template',
        },
      },
    },
    'helpers': {
      'i18n.js': '"i18n helper"',
      'blerg.js': '"blerg helper"',
      'main-greeting-text.js': '"main-greeting-text helper"',
      'show-default-title.js': '"show-default-title helper"'
    },
    'adapters': {
      'application.js': '"application adapter"',
      'post.js': '"post adapter"',
      'comment.js': '"comment adapter"'
    },
    'serializers': {
      'application.js': '"application serializer"',
      'post.js': '"post serializer"',
      'comment.js': '"comment serializer"'
    },
    'models': {
      'post.js': '"post model"',
      'comment.js': '"comment model"',
      'tag.js': '"tag model"'
    },
    'initializers': {
      'blah.js': '"blah initializer"',
      'derp.js': '"derp initializer"'
    },
    'instance-initializers': {
      'blammo.js': '"blammo instance initializer"'
    },
    'transforms': {
      'date.js': '"custom date transform"'
    },
    'mixins': {
      'foo.js': '"foo mixin"'
    },
    'services': {
      'ajax.js': '"ajax service"'
    },
    'validators': {
      'blahzorz.js': '"blahzorz validator"'
    }
  },
  'tests': {
    'acceptance': {
      'post-test.js': '"post acceptance test"'
    },
    'unit': {
      'pods': {
        'posts': {
          'index': {
            'route-test.js': '"posts/index unit test"',
          },
        },
      },
      'mixins': {
        'foo-test.js': '"foo mixin unit test"'
      },
      'service': {
        'ajax-test.js': '"ajax service unit test"'
      },
      'validators': {
        'blahzorz-test.js': '"blahzorz validator test"'
      }
    },
    'integration': {
      'pods': {
        'components': {
          'post-display': {
            'component-test.js': '"post-display component integration test"',
          },
          'post-footer': {
            'component-test.js': '"post-footer integration test"'
          }
        },
        'posts': {
          'index': {
            'route-test.js': '"posts/index integration test"'
          }
        }
      },
      'helpers': {
        'show-default-title-test.js': '"show-default-title helper integration test"'
      }
    }
  }
};
