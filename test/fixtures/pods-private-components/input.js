module.exports = {
  app: {
    templates: {
      components: {
        'x-button.hbs': 'x-button template',
        'x-foo.hbs': 'x-foo template: {{x-bar}}',
        'x-bar.hbs': 'x-bar template'
      },
    },
    pods: {
      posts: {
        'edit': {
          'template.hbs': '{{x-button}}\n{{#x-button}}\n  foo\n{{/x-button}}'
        }
      }
    }
  },

  tests: {
    integration: {
      components: {
        'x-bar-test.js': '"x-bar component test"'
      }
    }
  }
};
