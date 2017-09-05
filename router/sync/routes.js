const nest = require('depnest')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.page.gatherings': 'first',
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const pages = api.app.page

    // loc = location
    const routes = [
      [ loc => loc.page === 'gatherings', pages.gatherings ],
    ]

    return [...routes, ...sofar]
  })
}

