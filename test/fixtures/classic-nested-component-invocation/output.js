module.exports = {
  src: {
    ui: {
      routes: {
        posts: {
          edit: {
            '-elements': {
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
