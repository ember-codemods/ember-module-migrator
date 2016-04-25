module.exports = {
  launchers: {
    Node: {
      command: 'mocha --reporter tap',
      protocol: 'tap'
    }
  },
  src_files: [
    'lib/**/*.js',
    'test/*.js'
  ],
  'launch_in_dev':  ['Node']
};
