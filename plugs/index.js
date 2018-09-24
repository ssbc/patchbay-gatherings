const plugs = {
  app: {
    page: {
      gatherings: require('./app/page/gatherings')
    }
  },
  router: {
    sync: {
      routes: require('./router/sync/routes')
    }
  },
  styles: {
    mcss: require('./styles/mcss')
  }
}

module.exports = {
  'patchbay-gatherings': plugs
}
