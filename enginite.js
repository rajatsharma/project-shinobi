module.exports = {
  template: ['src', '.gitignore', '.editorconfig', 'public'],
  requireables: ['scripts/dev.js', 'scripts/build.js'],
  packageScripts: ['dev', 'build'],
  bin: 'shinobi',
};
