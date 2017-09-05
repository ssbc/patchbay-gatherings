const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array } = require('mutant')
const Scroller = require('pull-scroll')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.gatherings': true,
})

exports.needs = nest({
  'app.html.scroller': 'first',
  'gathering.html': {
    create: 'first',
    render: 'first'
  },
  'gathering.pull.find': 'first',
})

exports.create = function (api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.gatherings': gatheringsPage,
  })

  function menuItem (handleClick) {
    return h('a', {
      style: { order: 0 },
      'ev-click': () => handleClick({ page: 'gatherings' })
    }, '/gatherings')
  }

  function gatheringsPage (path) {
    const creator = api.gathering.html.create({})
    const { container, content } = api.app.html.scroller({prepend: [creator]})

    pull(
      api.gathering.pull.find({reverse: true}),
      Scroller(container, content, api.gathering.html.render, false, false)
    )

    pull(
      api.gathering.pull.find({old: false}),
      Scroller(container, content, api.gathering.html.render, true, false)
    )

    return container
  }
}
