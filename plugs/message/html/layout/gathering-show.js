const nest = require('depnest')
const { h, Value } = require('mutant')
const { isGathering } = require('ssb-gathering-schema')
const Scuttle = require('scuttle-gathering')
const ScuttleBlob = require('scuttle-blob')
const Show = require('../../../../views/show')
const Edit = require('../../../../views/edit')

exports.gives = nest('message.html.layout')

exports.needs = nest({
  'app.sync.goTo': 'first',
  'app.html.modal': 'first',
  'about.html.avatar': 'first',
  'about.pull.updates': 'first',
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

    // editing modal
    const isOpen = Value(false)
    const form = Edit({
      gathering: msg,
      scuttle: Scuttle(api.sbot.obs.connection),
      scuttleBlob: ScuttleBlob(api.sbot.obs.connection),
      blobUrl: api.blob.sync.url,
      onCancel: () => isOpen.set(false),
      afterPublish: (msg) => {
        isOpen.set(false)
      }
    })
    const modal = api.app.html.modal(form, { isOpen })
    const editBtn = h('i.fa.fa-pencil', { 'ev-click': () => isOpen.set(true) })

    const show = Show({
      gathering: msg,
      scuttle: Scuttle(api.sbot.obs.connection),
      blobUrl: api.blob.sync.url,
      markdown: api.message.html.markdown,
      avatar: id => api.about.html.avatar(id),
      editBtn,
      updateStream: api.about.pull.updates(msg.key)
    })

    return h('Message -gathering-show', [
      modal,
      show,
      api.message.html.backlinks(msg)
    ])
  }
}
