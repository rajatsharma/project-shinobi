module.exports = {
  template: ['src', '.gitignore', '.editorconfig'],
  requireables: [
    '.eslintrc.js',
    '.prettierrc.js',
    'scripts/dev.js',
    'scripts/build.js',
    'babel.config.js',
  ],
  packageScripts: ['dev', 'build'],
};
