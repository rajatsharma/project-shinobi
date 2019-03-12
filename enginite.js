module.exports = {
  template: ['src', '.gitignore', '.editorconfig', 'public'],
  requireables: [
    'scripts/dev.js',
    'scripts/build.js',
    'config/node.webpack.config.js',
    'config/web.webpack.config.js',
  ],
  packageScripts: ['dev', 'build'],
  bin: 'shinobi',
};
