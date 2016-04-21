module.exports = {
  'src': {
    'main.js': 'app.js',
    'components': {
      'foo-bar.component.js': 'foo-bar component',
      'foo-bar.template.hbs': 'foo-bar component template',
      'baz-derp.component.js': 'baz-derp component',
      'baz-derp.template.hbs': 'baz-derp template'
    },
    'helpers': {
      'i18n.js': 'i18n helper',
      'blerg.js': 'blerg helper'
    },
    'routes': {
      'index.controller.js': 'index controller',
      'index.route.js': 'index route',
      'index.template.hbs': 'index route template',
      'posts': {
        'index.controller.js': 'posts/index controller',
        'index.route.js': 'posts/index route',
        'index.template.hbs': 'posts/index route template',
        'post': {
          'index.controller.js': 'posts/post/index controller',
          'index.route.js': 'posts/post/index route',
          'index.template.hbs': 'posts/post/index route template',
          'edit.controller.js': 'posts/post/edit controller',
          'edit.route.js': 'posts/post/edit route',
          'edit.template.hbs': 'posts/post/edit route template'
        },
        'new.controller.js': 'posts/new controller',
        'new.route.js': 'posts/new route',
        'new.template.hbs': 'posts/new route template'
      }
    },
    'models': {
      'application.adapter.js': 'application adapter',
      'application.serializer.js': 'application serializer',
      'post.adapter.js': 'post adapter',
      'post.serializer.js': 'post serializer',
      'post.model.js': 'post model',
      'comment.adapter.js': 'comment adapter',
      'comment.serializer.js': 'comment serializer',
      'comment.model.js': 'comment model'
    },
    'initializers': {
      'blah.js': 'blah initializer',
      'derp.js': 'derp initializer'
    },
    'instance-initializers': {
      'blammo.js': 'blammo instance initializer'
    }
  }
};
