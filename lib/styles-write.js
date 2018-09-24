const fs = require('fs')
const { join } = require('path')
const getCSS = require('./get-css')

function stylesWrite () {
  fs.writeFile(join(__dirname, '../scry.css'), getCSS(), (err, done) => {
    if (err) throw err
    console.log('mcss built')
  })
}

module.exports = stylesWrite

if (!module.parent) stylesWrite()
