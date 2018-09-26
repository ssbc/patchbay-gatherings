const { resolve } = require('mutant')
const getTimezone = require('../lib/get-timezone')
const { initialiseState, emptyState } = require('../lib/form-state')
const Form = require('./component/form')

module.exports = function GatheringNew (opts) {
  const {
    initialState,
    scuttle,
    // suggest,
    // avatar,
    afterPublish = console.log,
    onCancel = () => {}
  } = opts

  var state = initialiseState(initialState)

  return Form({
    state,
    onCancel,
    publish
  })

  function publish () {
    const { title, description, location, day, time } = resolve(state)

    day.setHours(time.getHours())
    day.setMinutes(time.getMinutes())
    const opts = {
      title,
      startDateTime: {
        epoch: Number(day),
        tz: getTimezone()
      }
    }

    if (description) opts.description = description
    if (location) opts.location = location

    scuttle.post(opts, (err, data) => {
      if (err) return console.error(err)

      state.set(emptyState())
      afterPublish(data)
    })
  }
}
