const { h, when, computed } = require('mutant')
const DayPicker = require('./day-picker')
const TimePicker = require('./time-picker')
const getTimezone = require('../../lib/get-timezone')
const getTimezoneOffset = require('../../lib/get-timezone-offset')

module.exports = function GatheringForm (opts) {
  const {
    state,
    onCancel,
    publish
  } = opts

  const isValid = computed(state, ({ title, day, time }) => {
    return title && day && time
  })

  return h('GatheringForm', [
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
}
