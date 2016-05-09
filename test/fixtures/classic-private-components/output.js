module.exports = {
  src: {
    ui: {
      components: {
        'x-foo': {
          'template.hbs': 'x-foo template: {{x-bar}}',
          'x-bar': {
            'template.hbs': 'x-bar template',
            'component-integration-test.js': 'x-bar component test'
          }
        }
      },
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
