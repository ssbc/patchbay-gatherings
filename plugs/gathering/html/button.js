const nest = require('depnest')
const { h, Value } = require('mutant')
const Scuttle = require('scuttle-gathering')
const ScuttleBlob = require('scuttle-blob')
const GatheringNew = require('../../../views/new')

exports.gives = nest({
  'gathering.html.button': true
})

exports.needs = nest({
  'app.html.modal': 'first',
  'app.sync.goTo': 'first',
  'blob.sync.url': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'gathering.html.button': GatheringButton
  })

  function GatheringButton (initialState) {
    // initialState: see /lib/form-state.js

    const isOpen = Value(false)
    const form = GatheringNew({
      initialState,
      scuttle: Scuttle(api.sbot.obs.connection),
      scuttleBlob: ScuttleBlob(api.sbot.obs.connection),
      blobUrl: api.blob.sync.url,
      onCancel: () => isOpen.set(false),
      afterPublish: (msg) => {
        isOpen.set(false)
        api.app.sync.goTo(msg)
      }
    })

    const modal = api.app.html.modal(form, { isOpen })

    return h('GatheringButton', [
      h('button', { 'ev-click': () => isOpen.set(true) }, 'New Gathering'),
      modal
    ])
  }
}
