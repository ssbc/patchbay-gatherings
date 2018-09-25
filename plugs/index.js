const plugs = {
  app: {
    page: {
      // gathering: require('./app/page/gathering'),
      gatherings: require('./app/page/gatherings')
    }
  },
  message: {
    html: {
      layout: {
        'gathering-card': require('./message/html/layout/gathering-card')
      },
      render: {
        gathering: require('./message/html/render/gathering')
      }
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
