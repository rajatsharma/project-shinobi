const chainedpack = require('./webpack.config')
const fs = require('fs-extra')
const path = require('path')
const project = require('../project.config')

fs.copySync(
  path.resolve(project.basePath, 'public'),
  path.resolve(project.basePath, project.outDir)
)

chainedpack.build()
