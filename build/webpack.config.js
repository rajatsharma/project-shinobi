const commonConfig = require('./webpack.common.config')
const wpmerge = require('webpack-merge')
const project = require('../project.config')
const { converge } = require('ramda')

// Webpack config as a function of env
module.exports = converge(wpmerge, [commonConfig, require(`./webpack.${process.env.NODE_ENV}.config`)])(project)
