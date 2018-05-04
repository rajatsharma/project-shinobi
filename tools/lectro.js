const Lectro = require('@lectro/core')
const CommonUtilsEnhancer = require('@lectro/enhancer-commonutils')

const lectro = new Lectro('web'/* Target */).apply(CommonUtilsEnhancer)
module.exports = lectro
