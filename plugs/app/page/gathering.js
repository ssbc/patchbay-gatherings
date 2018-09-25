const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest({
  'app.page.gathering': true
})

exports.needs = nest({
})

exports.create = function (api) {
  return nest({
    'app.page.gathering': gatheringPage
  })

  function gatheringPage (path) {
    const container = h('h1', 'Gathering')
    container.title = '/gatherings'
    return container
  }
}
