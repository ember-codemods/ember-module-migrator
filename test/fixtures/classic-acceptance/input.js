module.exports = {
  'app': {
    'app.js': '"app.js"',
    'router.js': '"router.js"',
    'index.html': 'index.html contents',
    'components': {
      'foo-bar.js': '"foo-bar component"',
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
      }
    },
    'helpers': {
      'i18n.js': '"i18n helper"',
      'blerg.js': '"blerg helper"',
      'main-greeting-text.js': '"main-greeting-text helper"',
      'show-default-title.js': '"show-default-title helper"'
    },
    'routes': {
      'index.js': '"index route"',
      'posts': {
        'index.js': '"posts/index route"',
        'post': {
          'index.js': '"posts/post/index route"',
          'edit.js': '"posts/post/edit route"'
        },
        'new.js': '"posts/new route"'
      }
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
    'controllers': {
      'index.js': '"index controller"',
      'posts': {
        'index.js': '"posts/index controller"',
        'post': {
          'index.js': '"posts/post/index controller"',
          'edit.js': '"posts/post/edit controller"'
        },
        'new.js': '"posts/new controller"'
      }
    },
    'templates': {
      'index.hbs': 'index route template {{main-greeting-text}}',
      'posts': {
        'index.hbs': 'posts/index route template',
        'post': {
          'index.hbs': 'posts/post/index route template\n{{post-display}}',
          'edit.hbs': 'posts/post/edit route template'
        },
        'new.hbs': 'posts/new route template {{show-default-title}}',
        'show.hbs': 'posts/post/show route template'
      },
      'components': {
        'foo-bar.hbs': 'foo-bar component template'
      }
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
      'mixins': {
        'foo-test.js': '"foo mixin unit test"'
      },
      'service': {
        'ajax-test.js': '"ajax service unit test"'
      },
      'routes': {
        'posts': {
          'index-test.js': '"posts/index unit test"'
        }
      },
      'validators': {
        'blahzorz-test.js': '"blahzorz validator test"'
      }
    },
    'integration': {
      'routes': {
        'posts': {
          'index-test.js': '"posts/index integration test"'
        }
      },
      'components': {
        'post-display-test.js': '"post-display component integration test"',
        'post-footer-test.js': '"post-footer integration test"'
      },
      'helpers': {
        'show-default-title-test.js': '"show-default-title helper integration test"'
      }
    }
  }
};
