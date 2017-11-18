const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const imageLoader = require('./loaders/imageloader')
const fontLoader = require('./loaders/fontloader')
const jsLoader = require('./loaders/jsloader')
const { inProject, inProjectSrc } = require('./lib/pathcalculator')

const devConfig = project => {
  const __DEV__ = project.env === 'dev'
  const __TEST__ = project.env === 'test'
  const __PROD__ = project.env === 'prod'

  return {
    devtool: project.sourcemaps ? 'source-map' : false,
    entry: {
      normalize: [
        inProjectSrc('normalize'),
      ],
      main: [
        inProjectSrc(project.main),
      ],
    },
    module:{
      rules: [imageLoader, fontLoader, jsLoader],
    },
    output: {
      path: inProject(project.outDir),
      filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
      publicPath: project.publicPath,
    },
    resolve: {
      modules: [
        inProject(project.srcDir),
        'node_modules',
      ],
      extensions: ['*', '.js', '.jsx', '.json'],
    },
    externals: project.externals,
    plugins: [
      new webpack.DefinePlugin(Object.assign({
        'process.env': { NODE_ENV: JSON.stringify(project.env) },
        __DEV__,
        __TEST__,
        __PROD__,
      }, project.globals)),
      new HtmlWebpackPlugin({
        template: inProjectSrc('index.html'),
        inject: true,
        minify: {
          collapseWhitespace: true,
        },
      })
    ]
  }
}

module.exports = devConfig
