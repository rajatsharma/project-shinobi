/* eslint-disable */
module.exports = (config, _options, webpack) => {
  config.devtool = 'none';
  config.plugins.push(
    new webpack.DefinePlugin({
      __WORD__: JSON.stringify('hi'),
    }),
  );
};
