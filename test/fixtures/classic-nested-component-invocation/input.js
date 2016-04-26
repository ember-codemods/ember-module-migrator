module.exports = {
  app: {
    templates: {
      components: {
        posts: {
          edit: {
            'x-button.hbs': 'x-button template'
          }
        }
      },
      posts: {
        'edit.hbs': '{{posts/edit/x-button}}\n{{#posts/edit/x-button}}\n  foo\n{{/posts/edit/x-button}}'
      }
    }
  },

  tests: {

  }
};
