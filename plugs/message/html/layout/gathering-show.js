const nest = require('depnest')
const { h } = require('mutant')
const { isGathering } = require('ssb-gathering-schema')
const Scuttle = require('scuttle-gathering')
const Show = require('../../../../views/show')

exports.gives = nest('message.html.layout')

exports.needs = nest({
  'about.html.avatar': 'first',
  'message.html.backlinks': 'first',
  'message.html.markdown': 'first',
  'message.html.timestamp': 'first',
  'blob.sync.url': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = (api) => {
  return nest('message.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts = {}) {
    if (opts.layout !== 'show') return
    if (!isGathering(msg)) return

    const show = Show({
      gathering: msg,
      scuttle: Scuttle(api.sbot.obs.connection),
      blobUrl: api.blob.sync.url,
      markdown: api.message.html.markdown,
      avatar: api.about.html.avatar
    })

    return h('Message -gathering-show', [
      show,
      api.message.html.backlinks(msg)
    ])
  }
}
