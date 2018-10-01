const nest = require('depnest')
const { h } = require('mutant')
const { isGathering } = require('ssb-gathering-schema')
const Scuttle = require('scuttle-gathering')
const Card = require('../../../../views/card')

exports.gives = nest('message.html.layout')

exports.needs = nest({
  'about.html.avatar': 'first',
  'about.obs.color': 'first',
  'app.sync.goTo': 'first',
  'message.html.action': 'map',
  // 'message.html.meta': 'first',
  'message.html.markdown': 'first',
  'message.html.timestamp': 'first',
  'blob.sync.url': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = (api) => {
  return nest('message.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts = {}) {
    if (!(opts.layout === undefined || opts.layout === 'card')) return
    if (!isGathering(msg)) return

    const { action, timestamp } = api.message.html
    const card = Card({
      gathering: msg,
      scuttle: Scuttle(api.sbot.obs.connection),
      blobUrl: api.blob.sync.url,
      markdown: api.message.html.markdown
    })

    return h('Message -gathering-card', {
      'ev-click': () => api.app.sync.goTo(msg.key),
      attributes: { tabindex: '0' } // needed to be able to navigate and show focus()
    }, [
      h('section.avatar', api.about.html.avatar(msg.value.author)),
      h('section.top', [
        // h('div.author', author(msg)),
        // h('div.title'),
        // h('div.meta', meta(msg))
      ]),
      h('section.content', card),
      h('section.raw-content'), //, rawMessage),
      h('section.bottom', [
        h('div.timestamp', timestamp(msg)),
        h('div.actions', action(msg))
      ])
      // h('footer.backlinks', backlinks(msg))
    ])
  }
}
