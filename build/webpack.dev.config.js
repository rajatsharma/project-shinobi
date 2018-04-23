const postCss = require('../postcss.config')
const webpack = require('webpack')

const styleLoader = {
  test: /\.(s?)css$/,
  use: ['style-loader', 'css-loader', {
    loader: 'postcss-loader',
    options: postCss
  }, 'sass-loader'] // Sass loader should be the first loader, because postcss doesn't understand Sass
}

const devConfig = project => ({
  module:{
    rules: [styleLoader],
  },
  entry: {
    main: [
      // Must be set to the output public path of the server
      `webpack-hot-middleware/client.js?reload=true`
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
})

module.exports = devConfig
