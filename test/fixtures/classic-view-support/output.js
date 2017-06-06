module.exports = {
  'src': {
    'ui': {
      'views': {
        'bar.js': '"bar view with template invocation"'
      },
      'routes': {
        'index': {
          'template.hbs': '{{view "bar"}}'
        },
        'foo': {
          'view.js': '"foo view no template invocation"',
          'template.hbs': 'foo template'
        }
      }
    }
  }
};
