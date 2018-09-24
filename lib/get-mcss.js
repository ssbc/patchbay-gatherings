const readDir = require('read-directory')
const { join } = require('path')
const getMaramaMCSS = require('marama/lib/get-mcss')

module.exports = function getMcss (cb) {
  const collection = readDir.sync(join(__dirname, '..'), {
    extensions: false,
    filter: '**/*.mcss',
    ignore: '**/node_modules/**'
  })

  return [ getMaramaMCSS(), ...values(collection).reverse() ]
    .join('\n\n')
}

function values (obj) {
  return Object.keys(obj)
    .map(key => obj[key])
}
