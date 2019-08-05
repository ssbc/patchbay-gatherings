const nest = require('depnest')
const { h, Value, watch } = require('mutant')
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
  'sbot.obs.connection': 'first',
  'keys.sync.id': 'first'
})

exports.create = (api) => {
  return nest('message.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts = {}) {
    if (opts.layout !== 'show') return
    if (!isGathering(msg)) return

    // editing modal
    const form = Value('Loading...')

    const isOpen = Value(false)
    watch(isOpen, _isOpen => {
      if (!_isOpen) form.set('Loading...')
      else {
        const loadedForm = Edit({
          gathering: msg,
          scuttle: Scuttle(api.sbot.obs.connection),
          scuttleBlob: ScuttleBlob(api.sbot.obs.connection),
          blobUrl: api.blob.sync.url,
          onCancel: () => isOpen.set(false),
          afterPublish: (msg) => {
            isOpen.set(false)
          }
        })
        form.set(loadedForm)
      }
    })

    const modal = api.app.html.modal(h('div', form), { isOpen })
    const editBtn = h('i.fa.fa-pencil', { 'ev-click': () => isOpen.set(true) })

    const show = Show({
      myKey: api.keys.sync.id(),
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
