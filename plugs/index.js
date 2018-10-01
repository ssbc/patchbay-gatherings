const plugs = {
  app: {
    page: {
      gatherings: require('./app/page/gatherings')
    }
  },
  gathering: {
    html: {
      button: require('./gathering/html/button')
    },
    sync: {
      launchModal: require('./gathering/sync/launch-modal')
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
