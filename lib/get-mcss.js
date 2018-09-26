const readDir = require('read-directory')
const { join } = require('path')
const getMaramaMCSS = require('marama/lib/get-mcss')

const collection = readDir.sync(join(__dirname, '..'), {
  extensions: false,
  filter: '**/*.mcss',
  ignore: '**/node_modules/**'
})

module.exports = function mcss (soFar = {}) {
  soFar['patchbay-gatherings'] = values(collection).reverse().join('\n\n')
  soFar['marama'] = getMaramaMCSS()

  return soFar
}

function values (obj) {
  return Object.keys(obj)
    .map(key => obj[key])
}
