module.exports = {
  src: {
    ui: {
      routes: {
        posts: {
          edit: {
            '-components': {
              'x-button': {
                'template.hbs': 'x-button template'
              }
            },
            'template.hbs': '{{x-button}}\n{{#x-button}}\n  foo\n{{/x-button}}'
          }
        }
      }
    }
  }
};
