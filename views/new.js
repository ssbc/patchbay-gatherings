const { resolve } = require('mutant')
const getTimezone = require('../lib/get-timezone')
const { initialiseState, emptyState } = require('../lib/form-state')
const Form = require('./component/form')

module.exports = function GatheringNew (opts) {
  const {
    initialState,
    scuttle,
    scuttleBlob,
    myKey,
    blobUrl,
    avatar,
    suggest,
    afterPublish = console.log,
    onCancel = () => {}
  } = opts

  var state = initialiseState(initialState)

  return Form({
    state,
    myKey,
    onCancel,
    publish,
    scuttleBlob,
    blobUrl,
    avatar,
    suggest
  })

  function publish () {
    const { title, description, location, image, day, time, progenitor, mentions, recps } = resolve(state)

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
    if (image) opts.image = image
    if (progenitor) opts.progenitor = progenitor

    if (recps && recps.length) {
      opts.recps = [ myKey, ...recps.map(e => e.link ? e.link : e) ]
    }
    if (mentions && mentions.length) {
      if (!opts.recps) opts.mentions = mentions
      else opts.mentions = mentions.filter(e => !opts.recps.includes(e.link))
      // dedup recps and mentions
    }

    scuttle.post(opts, (err, data) => {
      if (err) return console.error(err)

      state.set(emptyState())
      afterPublish(data)
    })
  }
}
