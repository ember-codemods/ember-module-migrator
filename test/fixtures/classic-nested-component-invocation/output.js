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
            'template.hbs': '{{posts/edit/x-button}}'
          }
        }
      }
    }
  }
};
