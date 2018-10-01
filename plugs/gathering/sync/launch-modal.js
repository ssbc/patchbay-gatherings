const nest = require('depnest')
const { Value } = require('mutant')
const Scuttle = require('scuttle-gathering')
const GatheringNew = require('../../../views/new')

exports.gives = nest({
  'gathering.sync.launchModal': true
})

exports.needs = nest({
  'app.html.modal': 'first',
  'app.sync.goTo': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest({
    'gathering.sync.launchModal': GatheringLaunchModal
  })

  function GatheringLaunchModal (initialState, root) {
    // initialState: see /lib/form-state.js

    const isOpen = Value(false)

    const form = GatheringNew({
      initialState,
      scuttle: Scuttle(api.sbot.obs.connection),
      onCancel: () => isOpen.set(false),
      afterPublish: (msg) => {
        isOpen.set(false)
        api.app.sync.goTo(msg)
      }
    })

    const modal = api.app.html.modal(form, { isOpen })
    isOpen(open => {
      if (open) root.appendChild(modal)
      else modal.remove()
    })

    isOpen.set(true)
    return true
  }
}
