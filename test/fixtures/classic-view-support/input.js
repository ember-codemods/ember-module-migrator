module.exports = {
  'app': {
    'views': {
      'foo.js': 'foo view no template invocation',
      'bar.js': 'bar view with template invocation'
    },
    'templates': {
      'index.hbs': '{{view "bar"}}',
      'foo.hbs': 'foo template'
    }
  },
  'tests': {}
};
