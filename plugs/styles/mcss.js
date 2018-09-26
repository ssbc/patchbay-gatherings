const nest = require('depnest')
const mcss = require('../../lib/get-mcss')

exports.gives = nest('styles.mcss')

exports.create = function (api) {
  return nest('styles.mcss', mcss)
}
