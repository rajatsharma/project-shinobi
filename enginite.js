module.exports = {
  template: ['src', '.gitignore', '.editorconfig', 'public'],
  requireables: [
    'scripts/dev.js',
    'scripts/build.js',
    'config/node.webpack.config.js',
    'config/web.webpack.config.js',
    'config/webpack.js',
  ],
  packageScripts: ['dev', 'build', 'eject'],
  bin: 'shinobi',
};
