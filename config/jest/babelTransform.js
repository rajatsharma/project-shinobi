const babelJest = require('babel-jest');
const fs = require('fs-extra');
const paths = require('../paths');

const hasBabelRc = fs.existsSync(paths.appBabelRc);

const config = {
  presets: !hasBabelRc && [require.resolve('babel-preset-razzle')],
  babelrc: !!hasBabelRc,
};

module.exports = babelJest.createTransformer(config);
