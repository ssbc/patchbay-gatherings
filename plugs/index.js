const plugs = {
  app: {
    page: {
      gatherings: require('./app/page/gatherings')
    }
  },
  message: {
    html: {
      layout: {
        'gathering-card': require('./message/html/layout/gathering-card'),
        'gathering-show': require('./message/html/layout/gathering-show')
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
