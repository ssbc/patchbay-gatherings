const nest = require('depnest')
const pull = require('pull-stream')
const { h } = require('mutant')
const Scroller = require('pull-scroll') // TODO replace with mutant-scroll ??

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.gatherings': true
})

exports.needs = nest({
  'app.html.scroller': 'first',
  'gathering.html.button': 'first',
  'message.html.render': 'first',
  'sbot.pull.stream': 'first'
})

exports.create = function (api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.gatherings': gatheringsPage
  })

  function menuItem (handleClick) {
    return h('a', {
      style: { order: 0 },
      'ev-click': () => handleClick({ page: 'gatherings' })
    }, '/gatherings')
  }

  function gatheringsPage (path) {
    const { container, content } = api.app.html.scroller({
      prepend: [api.gathering.html.button()]
    })

    // extract to scuttle-gathering?
    const source = opts => api.sbot.pull.stream(server => {
      const _opts = Object.assign({
        query: [{
          $filter: {
            value: {
              timestamp: { $gt: 0 },
              content: { type: 'gathering' }
            }
          }
        }]
      }, opts)

      return server.query.read(_opts)
    })

    pull(
      source({ reverse: true }),
      Scroller(container, content, api.message.html.render, false, false)
    )

    pull(
      source({ old: false }),
      Scroller(container, content, api.message.html.render, true, false)
    )

    container.title = '/gatherings'
    container.classList.add('Gatherings')
    return container
  }
}
