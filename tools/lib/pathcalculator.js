const path = require('path')
const project = require('../../project.config')

const inProject = path.resolve.bind(path, project.basePath)
const inProjectSrc = (file) => inProject(project.srcDir, file)

module.exports = { inProjectSrc, inProject }
