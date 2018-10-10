const nest = require('depnest')
const { h } = require('mutant')

exports.gives = nest({
  'gathering.html.button': true
})

exports.needs = nest({
  'gathering.sync.launchModal': 'first'
})

exports.create = function (api) {
  return nest({
    'gathering.html.button': GatheringButton
  })

  function GatheringButton (initialState) {
    // initialState: see /lib/form-state.js

    const button = h('GatheringButton', [
      h('button', { 'ev-click': openModal }, 'New Gathering')
    ])

    return button

    function openModal () {
      api.gathering.sync.launchModal(initialState, button)
    }
  }
}
