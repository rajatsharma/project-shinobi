const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const postCss = require('../postcss.config')
const UglifyJsWebpackPluginBeta = require('uglifyjs-webpack-plugin')
const { inProjectSrc } = require('./lib/pathcalculator')

const extractStyleLoader = project => ({
  test: /\.(sass|scss)$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          sourceMap: project.sourcemaps,
          minimize: {
            discardComments: {
              removeAll : true,
            },
            discardUnused: false,
            mergeIdents: false,
            reduceIdents: false,
            safe: true,
            sourcemap: project.sourcemaps,
          },
        },
      },
      {
        loader: 'postcss-loader',
        options: postCss
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: project.sourcemaps,
          includePaths: [
            inProjectSrc('styles'),
          ],
        },
      },
    ],
  })
})

const devConfig = project => {
  const __DEV__ = project.env === 'dev'
  return {
    module:{
      rules: [extractStyleLoader(project)],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new ExtractTextPlugin({
        filename: 'styles/[name].[contenthash].css',
        allChunks: true,
        disable: __DEV__,
      }),
      new UglifyJsWebpackPluginBeta({
        sourceMap: project.sourcemaps
      }),
    ]
  }
}

module.exports = devConfig
