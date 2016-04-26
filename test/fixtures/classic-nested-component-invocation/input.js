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
        'edit.hbs': '{{posts/edit/x-button}}'
      }
    }
  },

  tests: {

  }
};
