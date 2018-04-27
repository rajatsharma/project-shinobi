const commonConfig = require('./webpack.common.config')
const wpmerge = require('webpack-merge')
const project = require('../project.config')
const { converge } = require('ramda')
const chainedpack = require('@halberd/chainedpack')

// Webpack config as a function of env
module.exports =
  chainedpack.createConfiguration(
    webpack =>
      converge(wpmerge, [
        commonConfig(webpack),
        require(`./webpack.${process.env.NODE_ENV}.config`)(webpack)
      ])(project)
  )
