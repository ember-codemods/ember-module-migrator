module.exports = {
  'app': {
    'app.js': 'app.js',
    'components': {
      'foo-bar.js': 'foo-bar component',
      'baz-derp': {
        'component.js': 'baz-derp component',
        'template.hbs': 'baz-derp template'
      }
    },
    'helpers': {
      'i18n.js': 'i18n helper',
      'blerg.js': 'blerg helper'
    },
    'routes': {
      'index.js': 'index route',
      'posts': {
        'index.js': 'posts/index route',
        'post': {
          'index.js': 'posts/post/index route',
          'edit.js': 'posts/post/edit route'
        },
        'new.js': 'posts/new route'
      }
    },
    'adapters': {
      'application.js': 'application adapter',
      'post.js': 'post adapter',
      'comment.js': 'comment adapter'
    },
    'serializers': {
      'application.js': 'application serializer',
      'post.js': 'post serializer',
      'comment.js': 'comment serializer'
    },
    'models': {
      'post.js': 'post model',
      'comment.js': 'comment model',
      'tag.js': 'tag model'
    },
    'initializers': {
      'blah.js': 'blah initializer',
      'derp.js': 'derp initializer'
    },
    'instance-initializers': {
      'blammo.js': 'blammo instance initializer'
    },
    'controllers': {
      'index.js': 'index controller',
      'posts': {
        'index.js': 'posts/index controller',
        'post': {
          'index.js': 'posts/post/index controller',
          'edit.js': 'posts/post/edit controller'
        },
        'new.js': 'posts/new controller'
      }
    },
    'templates': {
      'index.hbs': 'index route template',
      'posts': {
        'index.hbs': 'posts/index route template',
        'post': {
          'index.hbs': 'posts/post/index route template',
          'edit.hbs': 'posts/post/edit route template'
        },
        'new.hbs': 'posts/new route template',
        'show.hbs': 'posts/post/show route template'
      },
      'components': {
        'foo-bar.hbs': 'foo-bar component template'
      }
    }
  }
};
