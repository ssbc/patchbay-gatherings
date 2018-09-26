const { h, Struct, Value, when, computed, resolve } = require('mutant')
const DayPicker = require('./component/day-picker')
const TimePicker = require('./component/time-picker')
const getTimezone = require('../lib/get-timezone')
const getTimezoneOffset = require('../lib/get-timezone-offset')

module.exports = function GatheringNew (opts) {
  const {
    // initialState,
    scuttle,
    // suggest,
    // avatar,
    afterPublish = console.log,
    onCancel = () => {}
  } = opts

  const now = new Date()
  const state = Struct({
    title: '',
    description: '',
    location: '',
    monthIndex: now.getMonth(),
    day: null,
    time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14),
    image: Value()
  })

  const isValid = computed(state, ({ title, day, time }) => {
    return title && day && time
  })

  // loadInitialState(initialState, state) // TODO

  return h('GatheringNew', [
    h('div.details', [
      h('label', 'Title'),
      h('input', {
        'ev-input': ev => state.title.set(ev.target.value),
        value: state.title
      }),
      h('label', 'Description'),
      h('textarea', {
        'ev-input': ev => state.description.set(ev.target.value),
        value: state.description,
        placeholder: '(optional)'
      }),
      h('label', 'Location'),
      h('input', {
        'ev-input': ev => state.location.set(ev.target.value),
        value: state.location,
        placeholder: '(optional)'
      }),
      h('label', 'Time'),
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
      ])
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

      // state.set(initialState)
      afterPublish(data)
    })
  }
}
