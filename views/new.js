const { h, Struct, when, computed, resolve } = require('mutant')
const DayPicker = require('./component/day-picker')
const TimePicker = require('./component/time-picker')
const getTimezone = require('../lib/get-timezone')
const getTimezoneOffset = require('../lib/get-timezone-offset')

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

  const isValid = computed(state, ({ title, day, time }) => {
    return title && day && time
  })

  return h('GatheringNew', [
    h('div.details', [
      h('label.title', 'Title'),
      h('input.title', {
        'ev-input': ev => state.title.set(ev.target.value),
        value: state.title
      }),
      h('label.time', 'Time'),
      h('div.time-input', [
        DayPicker(state),
        h('div.time-picker', [
          TimePicker(state),
          h('div.timezone', [
            h('label', 'Timezone you\'re seeing times in is'),
            h('div.zone', [
              getTimezone() || '??',
              h('span', ['(UTC ', getTimezoneOffset(), ')'])
            ])
          ])
        ])
      ]),
      h('label.location', 'Location'),
      h('input.location', {
        'ev-input': ev => state.location.set(ev.target.value),
        value: state.location,
        placeholder: '(optional)'
      }),
      h('label.description', 'Description'),
      h('textarea', {
        'ev-input': ev => state.description.set(ev.target.value),
        value: state.description,
        placeholder: '(optional)'
      })
      // h('label', 'Image'),
      // // upload + preview image...
    ]),
    h('div.actions', [
      h('button -subtle', { 'ev-click': onCancel }, 'Cancel'),
      h('button', {
        className: when(isValid, '-primary'),
        disabled: when(isValid, false, true),
        'ev-click': publish
      }, 'Publish')
    ])
  ])

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

function initialiseState (initialState) {
  const state = Struct(emptyState())
  if (!initialState) return state

  const { title, description, location, startDateTime } = initialState

  if (title) state.title.set(title)
  if (description) state.title.set(description)
  if (location) state.title.set(location)
  if (startDateTime && startDateTime.epoch) {
    const date = new Date(startDateTime.epoch)
    state.monthIndex.set(date.getMonth())
    state.day.set(date)
    state.time.set(date)
  }

  return state
}

function emptyState () {
  const now = new Date()
  return {
    title: '',
    description: '',
    location: '',
    monthIndex: now.getMonth(),
    day: false,
    time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14),
    image: null
  }
}
