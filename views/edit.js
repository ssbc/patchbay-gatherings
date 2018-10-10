const { resolve } = require('mutant')
const isEqual = require('lodash.isequal')
const getTimezone = require('../lib/get-timezone')
const { initialiseState, buildState } = require('../lib/form-state')
const Form = require('./component/form')

module.exports = function GatheringEdit (opts) {
  const {
    gathering,
    scuttle,
    scuttleBlob,
    blobUrl,
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
    publish,
    scuttleBlob,
    blobUrl,
    isEditing: true
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
    if (!isEqual(n.image, c.image)) opts.image = n.image

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

    if (!Object.keys(opts).length) return

    // send an update alert to everyone who's already said they're going
    if (c.attendees && c.attendees.length) opts.mentions = c.attendees
    // TODO ? move this up into scuttle-gathering#put

    scuttle.put(gathering.key, opts, (err, data) => {
      if (err) return console.error(err)

      fetchCurrentState()
      afterPublish(data)
    })
  }
}
