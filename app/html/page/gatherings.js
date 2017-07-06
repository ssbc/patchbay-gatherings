const nest = require('depnest')
const pull = require('pull-stream')
const { h, Array } = require('mutant')
const Scroller = require('pull-scroll')

exports.gives = nest({
  'app.html': {
    page: true,
    menuItem: true
  }
})

exports.needs = nest({
  'app.html.scroller': 'first',
  'gathering.html': {
    create: 'first',
    render: 'first'
  },
  'gathering.pull.find': 'first'
})

exports.create = function (api) {
  const route = '/gatherings'
  return nest({
    'app.html': {
      menuItem: menuItem,
      page: gatheringsPage
    }
  })

  function menuItem (handleClick) {
    return h('a', {
      style: { order: 0 },
      'ev-click': () => handleClick(route)
    }, route)
  }

  function gatheringsPage (path) {
    if (path !== route) return

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
