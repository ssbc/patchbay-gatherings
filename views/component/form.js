const { h, when, computed } = require('mutant')
const DayPicker = require('./day-picker')
const TimePicker = require('./time-picker')
const getTimezone = require('../../lib/get-timezone')
const getTimezoneOffset = require('../../lib/get-timezone-offset')

module.exports = function GatheringForm (opts) {
  const {
    state,
    onCancel,
    publish,
    scuttleBlob,
    blobUrl
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
      }),
      h('label', 'Image'),
      h('div.image-input', [
        imageInput(),
        computed(state.image, image => {
          if (!image) return
          return h('img', { src: blobUrl(image.link) })
        })
      ])
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

  function imageInput () {
    return h('input', {
      type: 'file',
      accept: 'image/*',
      'ev-change': handleFiles
    })

    function handleFiles (ev) {
      const files = ev.target.files
      const opts = {
        stripExif: true
        // isPrivate: computed(state.recps => Boolean(recps.length))
      }
      scuttleBlob.async.files(files, opts, (err, result) => {
        ev.target.value = ''
        if (err) {
          console.error(err)
          return
        }

        state.image.set(result)
      })
    }
  }
}
