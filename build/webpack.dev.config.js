const postCss = require('../postcss.config')
const webpack = require('webpack')

const { inProject } = require('./lib/pathcalculator')

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
      `webpack-hot-middleware/client.js?path=${inProject(project.outDir)}__webpack_hmr`
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
})

module.exports = devConfig
