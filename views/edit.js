const { resolve } = require('mutant')
const getTimezone = require('../lib/get-timezone')
const { initialiseState, buildState } = require('../lib/form-state')
const Form = require('./component/form')

module.exports = function GatheringNew (opts) {
  const {
    gathering,
    scuttle,
    // suggest,
    // avatar,
    afterPublish = console.log,
    onCancel = () => {}
  } = opts

  var state = {
    current: initialiseState(),
    next: initialiseState()
  }
  fetchCurrentState()

  return Form({
    state: state.next,
    onCancel,
    publish
  })

  function fetchCurrentState () {
    scuttle.get(gathering.key, (err, _state) => {
      if (err) return console.error(err)
      state.current.set(buildState(_state))
      state.next.set(buildState(_state))
    })
  }

  function publish () {
    const n = resolve(state.next)
    const c = resolve(state.current)

    const opts = {}

    if (n.title !== c.title) opts.title = n.title
    if (n.location !== c.location) opts.location = n.location
    if (n.description !== c.description) opts.description = n.description

    n.day.setHours(n.time.getHours())
    n.day.setMinutes(n.time.getMinutes())
    c.day.setHours(c.time.getHours())
    c.day.setMinutes(c.time.getMinutes())
    if (Number(n.day) !== Number(c.day)) {
      opts.startDateTime = {
        epoch: Number(n.day),
        tz: getTimezone()
      }
    }

    scuttle.put(gathering.key, opts, (err, data) => {
      if (err) return console.error(err)

      fetchCurrentState()
      afterPublish(data)
    })
  }
}
